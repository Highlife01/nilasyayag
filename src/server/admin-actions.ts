"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { canTransition, sha, type InquiryStatus } from "@/lib/domain"
import type { Inquiry } from "@/lib/model"
import { authenticate, endSession, requireUser } from "@/server/session"
import { clientIp } from "@/server/request"
import { getRepo } from "@/server/runtime"

const STATUSES: InquiryStatus[] = ["new", "contacted", "quoted", "won", "lost"]

export async function loginAction(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")
  const otp = String(formData.get("otp") || "")
  try {
    const repo = await getRepo()
    const now = Date.now()
    const ipHash = sha(clientIp(await headers()), process.env.NILASYA_SESSION_SECRET || "nilasya-dev")
    const window = 15 * 60 * 1000
    const allowed =
      (await repo.consumeRate(`login:email:${email}`, 8, window, now)) && (await repo.consumeRate(`login:ip:${ipHash}`, 20, window, now))
    if (!allowed) return { error: "rate" }
    const result = await authenticate(email, password, otp)
    if (!result.ok) return { error: result.reason }
  } catch {
    return { error: "unavailable" }
  }
  redirect("/admin")
}

export async function logoutAction() {
  try {
    await endSession()
  } catch {
    return { error: "Oturum kapatılamadı. Lütfen yeniden deneyin." }
  }
  redirect("/admin/login")
}

export async function updateLeadAction(formData: FormData) {
  const user = await requireUser("leads.write")
  if (!user) redirect("/admin")
  const id = String(formData.get("id") || "")
  if (!id) redirect("/admin/leads")
  const detailUrl = `/admin/leads/${encodeURIComponent(id)}`
  const requested = String(formData.get("status") || "") as InquiryStatus
  const status = STATUSES.includes(requested) ? requested : null
  if (!status) redirect(`${detailUrl}?error=invalid-status`)
  const assignee = String(formData.get("assignee") || "").slice(0, 160)
  const note = String(formData.get("note") || "").trim().slice(0, 2000)
  let invalidTransition = false
  let updated: Inquiry | null = null
  let saveError = false
  try {
    const repo = await getRepo()
    updated = await repo.updateInquiry(id, (lead) => {
      invalidTransition = !canTransition(lead.status, status)
      if (invalidTransition) return null
      const at = new Date().toISOString()
      if (status !== lead.status) {
        lead.status = status
        lead.history.push({ at, status, actor: user.email })
      }
      lead.assignee = assignee
      if (note) lead.notes.push({ id: crypto.randomUUID(), at, author: user.email, body: note })
      return { id: crypto.randomUUID(), at, actor: user.email, action: "lead.update", detail: `${id}:${lead.status}` }
    })
  } catch {
    saveError = true
  }
  if (invalidTransition) redirect(`${detailUrl}?error=invalid-transition`)
  if (saveError || !updated) redirect(`${detailUrl}?error=save`)
  redirect(`${detailUrl}?saved=1`)
}
