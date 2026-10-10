"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { canTransition, sha, type InquiryStatus } from "@/lib/domain"
import { authenticate, endSession, requireUser } from "@/server/session"
import { clientIp } from "@/server/request"
import { getRepo } from "@/server/runtime"

const STATUSES: InquiryStatus[] = ["new", "contacted", "quoted", "won", "lost"]

export async function loginAction(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")
  const otp = String(formData.get("otp") || "")
  const repo = await getRepo()
  const now = Date.now()
  const ipHash = sha(clientIp(await headers()), process.env.NILASYA_SESSION_SECRET || "nilasya-dev")
  const window = 15 * 60 * 1000
  const allowed =
    (await repo.consumeRate(`login:email:${email}`, 8, window, now)) && (await repo.consumeRate(`login:ip:${ipHash}`, 20, window, now))
  if (!allowed) return { error: "rate" }
  const result = await authenticate(email, password, otp)
  if (!result.ok) return { error: result.reason }
  await repo.appendAudit({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    actor: email,
    action: "auth.login",
    detail: result.role,
  })
  redirect("/admin")
}

export async function logoutAction() {
  await endSession()
  redirect("/admin/login")
}

export async function updateLeadAction(formData: FormData) {
  const user = await requireUser("leads.write")
  if (!user) redirect("/admin")
  const id = String(formData.get("id") || "")
  const requested = String(formData.get("status") || "") as InquiryStatus
  const status = STATUSES.includes(requested) ? requested : null
  const assignee = String(formData.get("assignee") || "").slice(0, 160)
  const note = String(formData.get("note") || "").trim().slice(0, 2000)
  const repo = await getRepo()
  await repo.updateInquiry(id, (lead) => {
    const at = new Date().toISOString()
    if (status && status !== lead.status && canTransition(lead.status, status)) {
      lead.status = status
      lead.history.push({ at, status, actor: user.email })
    }
    lead.assignee = assignee
    if (note) lead.notes.push({ id: crypto.randomUUID(), at, author: user.email, body: note })
    return { id: crypto.randomUUID(), at, actor: user.email, action: "lead.update", detail: `${id}:${lead.status}` }
  })
  redirect(`/admin/leads/${id}`)
}
