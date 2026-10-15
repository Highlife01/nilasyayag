import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import { articleIdBySlug } from "@/content/index"
import {
  extractGeoFromHeaders,
  extractSafeUtm,
  parseUserAgentAndHints,
  sanitizePathForAnalytics,
  sanitizeReferrer,
} from "@/lib/analytics"
import { parseSessionBag, serializeSessionBag } from "@/lib/cookies-packed"
import { rateLimit, sha } from "@/lib/domain"
import { insightBase, isLocale, matchStatic } from "@/lib/i18n/config"
import { clientIp } from "@/server/request"
import { getRepo } from "@/server/runtime"

function knownPath(rawPath: string) {
  const clean = sanitizePathForAnalytics(rawPath)
  const [locale, ...parts] = clean.split("/").filter(Boolean)
  if (!locale || !isLocale(locale)) return null
  if (parts.length === 0 || matchStatic(locale, parts)) return { locale, path: clean }
  if (parts.length === 2 && parts[0] === insightBase(locale) && articleIdBySlug(locale, parts[1] || "")) {
    return { locale, path: clean }
  }
  return null
}

export async function POST(request: Request) {
  const jar = await cookies()
  const bag = parseSessionBag(jar.get("__session")?.value, jar)
  const consent = bag.consent
  if (consent === "necessary") {
    return new NextResponse(null, {
      status: 204,
      headers: { "x-analytics-status": "consent_declined" },
    })
  }

  const body = (await request.json().catch(() => null)) as {
    path?: unknown
    referrer?: unknown
    language?: unknown
    screenSize?: unknown
    timezone?: unknown
    clientModel?: unknown
    clientPlatformVersion?: unknown
    utm?: Record<string, unknown>
    isTest?: unknown
  } | null

  const rawPath = typeof body?.path === "string" ? body.path.slice(0, 180) : ""
  const resolved = knownPath(rawPath)
  if (!resolved) {
    return new NextResponse(null, {
      status: 204,
      headers: { "x-analytics-status": "ignored_path" },
    })
  }

  const headerList = await headers()
  const vid = bag.vid && /^[\w-]{8,64}$/.test(bag.vid) ? bag.vid : crypto.randomUUID()
  const existingSid = bag.sid || ""
  const sessionId = existingSid && /^[\w-]{8,64}$/.test(existingSid) ? existingSid : crypto.randomUUID()

  // Note: Raw IP is hashed only for ephemeral rate-limiting and NEVER stored in database or shown in dashboard
  const caller = vid || sessionId || sha(clientIp(headerList), process.env.NILASYA_SESSION_SECRET || "nilasya-dev")
  if (!rateLimit(`visit:${caller}`, 120, 60 * 60 * 1000)) {
    return new NextResponse(null, {
      status: 204,
      headers: { "x-analytics-status": "rate_limited" },
    })
  }

  const geo = extractGeoFromHeaders(headerList)
  const clientModel = typeof body?.clientModel === "string" ? body.clientModel.slice(0, 80) : null
  const clientPlatformVersion = typeof body?.clientPlatformVersion === "string" ? body.clientPlatformVersion.slice(0, 40) : null

  const uaInfo = parseUserAgentAndHints(
    headerList.get("user-agent"),
    {
      secChUa: headerList.get("sec-ch-ua"),
      secChUaMobile: headerList.get("sec-ch-ua-mobile"),
      secChUaPlatform: headerList.get("sec-ch-ua-platform"),
      secChUaPlatformVersion: headerList.get("sec-ch-ua-platform-version"),
      secChUaModel: headerList.get("sec-ch-ua-model"),
      acceptLanguage: headerList.get("accept-language"),
    },
    clientModel,
    clientPlatformVersion,
  )

  const host = headerList.get("x-forwarded-host") || headerList.get("host") || ""
  const rawReferrer = typeof body?.referrer === "string" ? body.referrer : headerList.get("referer")
  const referrer = sanitizeReferrer(rawReferrer, host)
  const utm = extractSafeUtm(body?.utm)

  const rawLang =
    typeof body?.language === "string" && body.language.trim()
      ? body.language.trim()
      : (headerList.get("accept-language") || "").split(",")[0]?.trim() || ""
  const language = rawLang ? rawLang.slice(0, 32) : "Bilinmiyor"

  const rawScreen = typeof body?.screenSize === "string" ? body.screenSize.trim() : ""
  const screenSize = /^\d{2,5}x\d{2,5}$/.test(rawScreen) ? rawScreen : "Veri alınamadı"

  const rawTz = typeof body?.timezone === "string" && body.timezone.trim() ? body.timezone.trim().slice(0, 80) : "Europe/Istanbul (UTC+3)"
  const isTest = body?.isTest === true || headerList.get("x-nilasya-test") === "1"

  const nowIso = new Date().toISOString()
  const date = nowIso.slice(0, 10)
  let wasDeduplicated = false

  try {
    const repo = await getRepo()
    const { deduplicated } = await repo.recordVisitorSessionEvent({
      sessionId,
      visitorId: vid,
      consentGranted: true,
      isTest,
      at: nowIso,
      timezone: rawTz,
      path: resolved.path,
      locale: resolved.locale,
      referrer,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      utmTerm: utm.utmTerm,
      utmContent: utm.utmContent,
      countryCode: geo.countryCode,
      countryName: geo.countryName,
      region: geo.region,
      city: geo.city,
      geoSource: geo.source,
      deviceType: uaInfo.deviceType,
      deviceBrand: uaInfo.deviceBrand,
      deviceModel: uaInfo.deviceModel,
      osName: uaInfo.osName,
      osVersion: uaInfo.osVersion,
      browserName: uaInfo.browserName,
      browserVersion: uaInfo.browserVersion,
      language,
      screenSize,
      botStatus: uaInfo.botStatus,
      botReason: uaInfo.botReason,
    })
    wasDeduplicated = deduplicated

    if (!deduplicated && !isTest && uaInfo.botStatus !== "bot") {
      await repo.recordVisit(
        { date, path: resolved.path, locale: resolved.locale, country: geo.countryCode },
        vid || undefined,
      )
    }
  } catch {
    return new NextResponse(null, { status: 503 })
  }

  const response = new NextResponse(null, {
    status: 204,
    headers: {
      "x-analytics-status": wasDeduplicated ? "deduplicated" : "tracked",
      "x-analytics-session": sessionId,
    },
  })
  bag.consent = "all"
  bag.vid = vid
  bag.sid = sessionId
  response.cookies.set("__session", serializeSessionBag(bag), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  })
  response.cookies.set("nilasya_vid", vid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  })
  // Refresh 30-minute sliding session cookie
  response.cookies.set("nilasya_sid", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 30,
  })
  return response
}
