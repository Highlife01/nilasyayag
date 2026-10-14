import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { parseSessionBag, serializeSessionBag } from "@/lib/cookies-packed"

export async function POST(request: Request) {
  const form = await request.formData()
  const choice = form.get("choice") === "all" ? "all" : "necessary"
  const next = String(form.get("next") || "/tr")
  const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/tr"
  const origin = new URL(request.url).origin
  const response = NextResponse.redirect(new URL(safe, origin), 303)
  const baseOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  }

  const jar = await cookies()
  const bag = parseSessionBag(jar.get("__session")?.value, jar)
  bag.consent = choice

  response.cookies.set("nilasya_consent", choice, { ...baseOptions, maxAge: 60 * 60 * 24 * 180 })
  if (choice === "all") {
    const vid = bag.vid || crypto.randomUUID()
    const sid = bag.sid || crypto.randomUUID()
    bag.vid = vid
    bag.sid = sid
    response.cookies.set("nilasya_vid", vid, { ...baseOptions, maxAge: 60 * 60 * 24 * 180 })
    response.cookies.set("nilasya_sid", sid, { ...baseOptions, maxAge: 60 * 30 })
  } else {
    delete bag.vid
    delete bag.sid
    response.cookies.set("nilasya_vid", "", { ...baseOptions, maxAge: 0 })
    response.cookies.set("nilasya_sid", "", { ...baseOptions, maxAge: 0 })
  }

  response.cookies.set("__session", serializeSessionBag(bag), {
    ...baseOptions,
    maxAge: 60 * 60 * 24 * 180,
  })
  return response
}
