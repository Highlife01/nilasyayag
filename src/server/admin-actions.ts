"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { extractGeoFromHeaders, parseUserAgentAndHints } from "@/lib/analytics"
import { canTransition, sha, type InquiryStatus } from "@/lib/domain"
import { authenticate, endSession, requireUser } from "@/server/session"
import { clientIp, sameOrigin } from "@/server/request"
import { getRepo } from "@/server/runtime"

const STATUSES: InquiryStatus[] = ["new", "contacted", "quoted", "won", "lost"]

export async function loginAction(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  const headerList = await headers()
  const email = String(formData.get("email") || "").trim().toLowerCase().slice(0, 160)
  const password = String(formData.get("password") || "")
  const isTest = headerList.get("x-nilasya-test") === "1"

  let repo
  try {
    repo = await getRepo()
  } catch {
    return { error: "db" }
  }

  const now = Date.now()
  const nowIso = new Date(now).toISOString()
  const ipHash = sha(clientIp(headerList), process.env.NILASYA_SESSION_SECRET || "nilasya-dev")
  const window = 15 * 60 * 1000

  const uaInfo = parseUserAgentAndHints(headerList.get("user-agent"), {
    secChUa: headerList.get("sec-ch-ua"),
    secChUaMobile: headerList.get("sec-ch-ua-mobile"),
    secChUaPlatform: headerList.get("sec-ch-ua-platform"),
    secChUaPlatformVersion: headerList.get("sec-ch-ua-platform-version"),
    secChUaModel: headerList.get("sec-ch-ua-model"),
    acceptLanguage: headerList.get("accept-language"),
  })
  const geo = extractGeoFromHeaders(headerList)

  const recordAttempt = async (result: "success" | "failed", reason: "ok" | "credentials" | "otp" | "rate_limit" | "inactive") => {
    try {
      await repo.recordAuthLog({
        id: crypto.randomUUID(),
        at: nowIso,
        timezone: "Europe/Istanbul (UTC+3)",
        email: email || "belirtilmedi",
        result,
        reason,
        countryCode: geo.countryCode,
        countryName: geo.countryName,
        region: geo.region,
        city: geo.city,
        deviceType: uaInfo.deviceType,
        deviceBrand: uaInfo.deviceBrand,
        deviceModel: uaInfo.deviceModel,
        osName: uaInfo.osName,
        osVersion: uaInfo.osVersion,
        browserName: uaInfo.browserName,
        browserVersion: uaInfo.browserVersion,
        isTest,
      })
    } catch {
      // Do not block auth response if log write fails
    }
  }

  const allowed =
    (await repo.consumeRate(`login:email:${email}`, 8, window, now)) &&
    (await repo.consumeRate(`login:ip:${ipHash}`, 20, window, now))

  if (!allowed) {
    await recordAttempt("failed", "rate_limit")
    return { error: "rate" }
  }

  const result = await authenticate(email, password)
  if (!result.ok) {
    await recordAttempt("failed", result.reason)
    return { error: result.reason }
  }

  await recordAttempt("success", "ok")
  await repo.appendAudit({
    id: crypto.randomUUID(),
    at: nowIso,
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
  const headerList = await headers()
  if (!sameOrigin(headerList)) redirect("/admin")
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

export async function updateRetentionDaysAction(formData: FormData) {
  const headerList = await headers()
  if (!sameOrigin(headerList)) redirect("/admin/analytics")
  const user = await requireUser("settings")
  if (!user) redirect("/admin")
  const rawDays = Number(formData.get("retentionDays"))
  if (!Number.isFinite(rawDays) || rawDays < 7 || rawDays > 365) {
    redirect("/admin/analytics")
  }
  const repo = await getRepo()
  await repo.updateRetentionDays(rawDays, user.email)
  await repo.cleanupExpiredAnalytics()
  revalidatePath("/admin/analytics")
  redirect("/admin/analytics")
}
