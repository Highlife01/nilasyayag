import { z } from "zod"
import { createHash, timingSafeEqual } from "node:crypto"

export const ROLES = ["superadmin", "editor", "sales", "analyst"] as const
export type Role = (typeof ROLES)[number]

export const ACTIONS = [
  "leads",
  "leads.write",
  "content",
  "seo",
  "media",
  "analytics",
  "users",
  "settings",
  "audit",
  "export",
  "backup",
] as const
export type Action = (typeof ACTIONS)[number]

const MATRIX: Record<Role, readonly Action[]> = {
  superadmin: ACTIONS,
  editor: ["content", "seo", "media", "analytics", "audit"],
  sales: ["leads", "leads.write", "analytics", "export", "audit"],
  analyst: ["analytics", "seo", "audit"],
}

export function can(role: Role, action: Action) {
  return MATRIX[role].includes(action)
}

export type InquiryStatus = "new" | "contacted" | "quoted" | "won" | "lost"

const TRANSITIONS: Record<InquiryStatus, readonly InquiryStatus[]> = {
  new: ["contacted", "lost"],
  contacted: ["quoted", "lost"],
  quoted: ["won", "lost", "contacted"],
  won: [],
  lost: ["contacted"],
}

export function canTransition(from: InquiryStatus, to: InquiryStatus) {
  return from === to || TRANSITIONS[from].includes(to)
}

export const inquirySchema = z
  .object({
    company: z.string().trim().min(2).max(160),
    contactName: z.string().trim().min(2).max(120),
    email: z.email().max(160),
    phone: z.string().trim().min(6).max(40),
    country: z.string().trim().min(2).max(80),
    countryOther: z.string().trim().max(80).optional().default(""),
    destinationPort: z.string().trim().max(120).optional().default(""),
    product: z.enum(["sunflower", "olive", "both"]),
    orderType: z.enum(["container", "bulk", "distribution"]),
    quantity: z.string().trim().max(120).optional().default(""),
    packaging: z.string().trim().max(300).optional().default(""),
    message: z.string().trim().min(10).max(4000),
    consent: z.literal("yes"),
    locale: z.string().trim().min(2).max(12),
    formType: z.enum(["rfq", "contact"]),
    website: z.string().optional().default(""),
    renderedAt: z.string().trim().min(1),
  })
  .superRefine((value, ctx) => {
    if (value.formType === "rfq") {
      if (!value.quantity.trim()) ctx.addIssue({ code: "custom", path: ["quantity"], message: "required" })
      if (value.packaging.trim().length < 2) ctx.addIssue({ code: "custom", path: ["packaging"], message: "required" })
    }
    if (value.country === "OTHER" && value.countryOther.trim().length < 2) {
      ctx.addIssue({ code: "custom", path: ["countryOther"], message: "required" })
    }
  })

export type InquiryInput = z.infer<typeof inquirySchema>

export function sha(value: string, salt: string) {
  return createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 32)
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) {
    timingSafeEqual(left, left)
    return false
  }
  return timingSafeEqual(left, right)
}

const hits = new Map<string, number[]>()

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  if (hits.size > 10_000) {
    for (const [name, stamps] of hits) {
      if (now - (stamps[stamps.length - 1] ?? 0) >= windowMs) hits.delete(name)
    }
  }
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export function resetRateLimit() {
  hits.clear()
}

export function csvCell(value: string) {
  const text = value.replaceAll('"', '""')
  const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text
  return `"${guarded}"`
}
