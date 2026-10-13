import { isLocale } from "@/lib/i18n/config"
import { inquirySchema, sha } from "@/lib/domain"
import type { Inquiry, Repo } from "@/lib/model"

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; code: "invalid" | "fast" | "stale" | "rate" | "locale" | "unavailable"; fields?: Record<string, string> }

const HOUR = 60 * 60 * 1000

export const INQUIRY_LIMITS = { perIp: 5, perEmail: 5, site: 300 }

export async function submitInquiry(
  repo: Repo,
  raw: Record<string, string>,
  ctx: { ip: string; salt: string; now: number; notify: (inquiry: Inquiry) => Promise<Inquiry["notification"]> },
): Promise<SubmitResult> {
  if ((raw.website ?? "").trim()) return { ok: true, id: "" }

  const parsed = inquirySchema.safeParse(raw)
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form")
      if (!fields[key]) fields[key] = issue.message
    }
    return { ok: false, code: "invalid", fields }
  }
  const value = parsed.data
  if (!isLocale(value.locale)) return { ok: false, code: "locale" }

  const rendered = Number(value.renderedAt)
  if (!Number.isFinite(rendered)) return { ok: false, code: "stale" }
  const age = ctx.now - rendered
  if (age < 1200) return { ok: false, code: "fast" }
  if (age > 1000 * 60 * 60 * 24 || rendered > ctx.now + 5 * 60 * 1000) return { ok: false, code: "stale" }

  const ipHash = sha(ctx.ip || "unknown", ctx.salt)
  const emailHash = sha(value.email.toLowerCase(), ctx.salt)
  try {
    const withinLimits =
      (await repo.consumeRate(`inquiry:ip:${ipHash}`, INQUIRY_LIMITS.perIp, HOUR, ctx.now)) &&
      (await repo.consumeRate(`inquiry:email:${emailHash}`, INQUIRY_LIMITS.perEmail, HOUR, ctx.now)) &&
      (await repo.consumeRate("inquiry:site", INQUIRY_LIMITS.site, HOUR, ctx.now))
    if (!withinLimits) return { ok: false, code: "rate" }
  } catch {
    return { ok: false, code: "unavailable" }
  }

  const country = value.country === "OTHER" ? value.countryOther.trim() : value.country
  const createdAt = new Date(ctx.now).toISOString()
  const inquiry: Inquiry = {
    id: crypto.randomUUID(),
    createdAt,
    collection: value.formType === "contact" ? "contact_submissions" : "rfq_requests",
    formType: value.formType,
    status: "new",
    assignee: "",
    company: value.company,
    contactName: value.contactName,
    email: value.email,
    phone: value.phone,
    country,
    destinationPort: value.destinationPort,
    product: value.product,
    orderType: value.orderType,
    quantity: value.quantity,
    packaging: value.packaging,
    message: value.message,
    locale: value.locale,
    consent: true,
    ipHash,
    notification: { status: "queued", detail: "Waiting for the mailer." },
    notes: [],
    history: [{ at: createdAt, status: "new", actor: "website" }],
  }

  try {
    await repo.createInquiry(inquiry, {
      id: crypto.randomUUID(),
      at: createdAt,
      actor: "website",
      action: "inquiry.create",
      detail: `${inquiry.collection}:${inquiry.id}:${inquiry.company}`,
    })
  } catch {
    return { ok: false, code: "unavailable" }
  }

  let notification: Inquiry["notification"]
  try {
    notification = await ctx.notify(inquiry)
  } catch {
    notification = { status: "failed", detail: "The notification failed. The inquiry is saved." }
  }
  try {
    await repo.setNotification(inquiry, notification)
  } catch {
    // The inquiry is already durable. Asking the visitor to retry would create a duplicate.
    console.warn("The inquiry is saved, but its notification status could not be updated.")
  }
  return { ok: true, id: inquiry.id }
}
