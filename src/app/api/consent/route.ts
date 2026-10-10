import { NextResponse } from "next/server"
import { siteUrl } from "@/lib/site"

export async function POST(request: Request) {
  const form = await request.formData()
  const choice = form.get("choice") === "all" ? "all" : "necessary"
  const next = String(form.get("next") || "/en")
  const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/en"
  const response = NextResponse.redirect(new URL(safe, siteUrl()), 303)
  const options = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 180 }
  response.cookies.set("nilasya_consent", choice, options)
  if (choice === "all") response.cookies.set("nilasya_vid", crypto.randomUUID(), options)
  return response
}
