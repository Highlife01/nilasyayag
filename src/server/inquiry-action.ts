"use server"

import { headers } from "next/headers"
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
  const repo = await getRepo()
  const result = await submitInquiry(repo, raw, {
    ip: clientIp(headerList),
    salt: process.env.NILASYA_SESSION_SECRET || "nilasya-dev",
    now: Date.now(),
    notify: notifyInquiry,
  })
  if (!result.ok) return { ok: false, code: result.code, fields: result.fields }
  return { ok: true, done: true, id: result.id }
}
