import { NextResponse } from "next/server"
import { consentRedirect } from "@/lib/consent"
import { sameOrigin } from "@/server/request"

export async function POST(request: Request) {
  if (!sameOrigin(request.headers)) return new NextResponse(null, { status: 403 })
  const form = await request.formData().catch(() => null)
  const choice = form?.get("choice")
  if (!form || (choice !== "all" && choice !== "necessary")) return new NextResponse(null, { status: 400 })
  const response = NextResponse.redirect(consentRedirect(form.get("next"), request.url), 303)
  const options = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 180 }
  response.cookies.set("nilasya_consent", choice, options)
  if (choice === "all") response.cookies.set("nilasya_vid", crypto.randomUUID(), options)
  else response.cookies.set("nilasya_vid", "", { ...options, maxAge: 0 })
  return response
}
