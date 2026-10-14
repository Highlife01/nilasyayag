"use server"

import { cookies, headers } from "next/headers"
import { parseSessionBag } from "@/lib/cookies-packed"
import { submitInquiry } from "@/lib/inquiry-service"
import { notifyInquiry } from "@/lib/notify"
import { clientIp, sameOrigin } from "@/server/request"
import { getRepo } from "@/server/runtime"

export type FormState =
  | { ok: true; done?: boolean; id?: string }
  | { ok: false; code?: string; fields?: Record<string, string> }

export async function submitInquiryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const headerList = await headers()
  if (!sameOrigin(headerList)) return { ok: false, code: "invalid" }

  const raw: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") raw[key] = value
  }

  let repo
  try {
    repo = await getRepo()
  } catch {
    return { ok: false, code: "db_error" }
  }

  const jar = await cookies()
  const bag = parseSessionBag(jar.get("__session")?.value, jar)
  const consentGranted = bag.consent === "all"
  const sessionId = consentGranted ? bag.sid : undefined
  const isTest = headerList.get("x-nilasya-test") === "1" || raw.isTest === "1"

  const result = await submitInquiry(repo, raw, {
    ip: clientIp(headerList),
    salt: process.env.NILASYA_SESSION_SECRET || "nilasya-dev",
    now: Date.now(),
    notify: notifyInquiry,
    sessionId,
    consentGranted,
    isTest,
  })
  if (!result.ok) return { ok: false, code: result.code, fields: result.fields }
  return { ok: true, done: true, id: result.id }
}
