import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import { articleIdBySlug } from "@/content/index"
import { rateLimit, sha } from "@/lib/domain"
import { insightBase, isLocale, matchStatic } from "@/lib/i18n/config"
import { clientIp } from "@/server/request"
import { getRepo } from "@/server/runtime"
import { analyticsAllowed } from "@/lib/consent"

function knownPath(path: string) {
  const [locale, ...parts] = path.split("/").filter(Boolean)
  if (!locale || !isLocale(locale)) return null
  if (parts.length === 0 || matchStatic(locale, parts)) return locale
  if (parts.length === 2 && parts[0] === insightBase(locale) && articleIdBySlug(locale, parts[1] || "")) return locale
  return null
}

export async function POST(request: Request) {
  const jar = await cookies()
  if (!analyticsAllowed(jar.get("nilasya_consent")?.value)) return new NextResponse(null, { status: 204 })
  const body = (await request.json().catch(() => null)) as { path?: unknown } | null
  const path = typeof body?.path === "string" ? body.path.slice(0, 180) : ""
  const locale = knownPath(path)
  if (!locale) return new NextResponse(null, { status: 204 })

  const vid = jar.get("nilasya_vid")?.value
  const caller = vid || sha(clientIp(await headers()), process.env.NILASYA_SESSION_SECRET || "nilasya-dev")
  if (!rateLimit(`visit:${caller}`, 60, 60 * 60 * 1000)) return new NextResponse(null, { status: 204 })

  const country = (request.headers.get("x-vercel-ip-country") || request.headers.get("x-appengine-country") || request.headers.get("cf-ipcountry") || "unknown").slice(0, 8)
  const date = new Date().toISOString().slice(0, 10)
  try {
    const repo = await getRepo()
    await repo.recordVisit({ date, path, locale, country }, vid)
  } catch {
    // Optional analytics must not disrupt browsing when storage is unavailable.
  }
  return new NextResponse(null, { status: 204 })
}
