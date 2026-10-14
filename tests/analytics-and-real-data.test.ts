import { describe, expect, it } from "vitest"
import {
  extractGeoFromHeaders,
  extractSafeUtm,
  formatDurationTr,
  parseUserAgentAndHints,
  sanitizePathForAnalytics,
  sanitizeReferrer,
} from "@/lib/analytics"
import { submitInquiry } from "@/lib/inquiry-service"
import { createMemoryRepo, type TrackVisitPayload } from "@/lib/model"

describe("real-data empty state & accuracy rules", () => {
  it("returns strictly empty metrics and zero records on a fresh database without sample data", async () => {
    const repo = createMemoryRepo()
    const inquiries = await repo.listInquiries()
    expect(inquiries).toEqual([])

    const authLogs = await repo.listAuthLogs()
    expect(authLogs).toEqual([])

    const analytics = await repo.queryAnalytics()
    expect(analytics.summary.totalVisits).toBe(0)
    expect(analytics.summary.totalSessions).toBe(0)
    expect(analytics.summary.uniqueVisitors).toBe(0)
    expect(analytics.summary.activeVisitors).toBe(0)
    expect(analytics.summary.convertedSessions).toBe(0)
    expect(analytics.sessions).toEqual([])
    expect(analytics.distributions.countries).toEqual([])
    expect(analytics.distributions.devices).toEqual([])
    expect(analytics.distributions.topPages).toEqual([])
  })

  it("never guesses iPhone model from screen size and reports 'Model belirlenemedi'", () => {
    const iphoneUa =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1"
    const parsed = parseUserAgentAndHints(iphoneUa, {
      acceptLanguage: "tr-TR,tr;q=0.9",
    })
    expect(parsed.deviceType).toBe("telefon")
    expect(parsed.deviceBrand).toBe("Apple")
    expect(parsed.deviceModel).toBe("Model belirlenemedi")
    expect(parsed.osName).toBe("iOS")
    expect(parsed.osVersion).toBe("17.4.1")
    expect(parsed.browserName).toBe("Safari")
    expect(parsed.botStatus).toBe("human")
  })

  it("handles Android UA reduction ('K') vs explicit Client Hints model", () => {
    const reducedAndroidUa =
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
    const withoutHint = parseUserAgentAndHints(reducedAndroidUa, {
      secChUaMobile: "?1",
      secChUaPlatform: '"Android"',
      acceptLanguage: "tr-TR",
    })
    expect(withoutHint.deviceType).toBe("telefon")
    expect(withoutHint.deviceModel).toBe("Model belirlenemedi")

    const withHint = parseUserAgentAndHints(reducedAndroidUa, {
      secChUaMobile: "?1",
      secChUaPlatform: '"Android"',
      secChUaModel: '"SM-S928B"',
      acceptLanguage: "tr-TR",
    })
    expect(withHint.deviceType).toBe("telefon")
    expect(withHint.deviceBrand).toBe("Samsung")
    expect(withHint.deviceModel).toBe("SM-S928B")
  })

  it("classifies bots separately and extracts server-side geo headers without storing raw IP", () => {
    const botParsed = parseUserAgentAndHints(
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    )
    expect(botParsed.botStatus).toBe("bot")

    const headers = new Headers({
      "x-appengine-country": "de",
      "x-appengine-region": "hh",
      "x-appengine-city": "Hamburg",
    })
    const geo = extractGeoFromHeaders(headers)
    expect(geo.countryCode).toBe("DE")
    expect(geo.countryName).toContain("Almanya")
    expect(geo.city).toBe("Hamburg")
  })

  it("strips sensitive query parameters from analytics paths and referrers", () => {
    expect(sanitizePathForAnalytics("/tr/contact?email=secret@example.com&password=123&token=abc")).toBe(
      "/tr/contact",
    )
    expect(sanitizeReferrer("https://www.google.com/search?q=sunflower+oil&token=secret")).toBe(
      "https://www.google.com/search",
    )
    const utm = extractSafeUtm({
      utm_source: "linkedin",
      utm_campaign: "b2b_export_2026",
      utm_term: "user@private.example",
    })
    expect(utm.utmSource).toBe("linkedin")
    expect(utm.utmCampaign).toBe("b2b_export_2026")
    expect(utm.utmTerm).toBe("[Maskelendi]")
  })
})

describe("visitor session tracking, deduplication, conversions & login logs", () => {
  it("deduplicates rapid reloads, calculates measured duration accurately, and links form conversions", async () => {
    const repo = createMemoryRepo()
    const t0 = new Date("2026-10-14T10:00:00.000Z")
    const tReload = new Date("2026-10-14T10:00:02.000Z") // 2s later -> deduplicated
    const tNextPage = new Date("2026-10-14T10:01:30.000Z") // 90s later -> new pageview

    const basePayload: TrackVisitPayload = {
      sessionId: "sess_prod_1",
      visitorId: "vid_cookie_1",
      consentGranted: true,
      isTest: false,
      at: t0.toISOString(),
      timezone: "Europe/Istanbul",
      path: "/tr",
      locale: "tr",
      referrer: "https://www.google.com",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "aycicek_ihracat",
      utmTerm: "",
      utmContent: "",
      countryCode: "TR",
      countryName: "Türkiye (TR)",
      region: "31",
      city: "Hatay",
      geoSource: "Google Cloud / Firebase Hosting",
      deviceType: "bilgisayar",
      deviceBrand: "Bilinmiyor",
      deviceModel: "Model belirlenemedi",
      osName: "Windows",
      osVersion: "10/11",
      browserName: "Chrome",
      browserVersion: "128.0",
      language: "tr-TR",
      screenSize: "1920x1080",
      botStatus: "human",
      botReason: "",
    }

    const first = await repo.recordVisitorSessionEvent(basePayload)
    expect(first.deduplicated).toBe(false)
    expect(first.session.pageViews).toBe(1)
    expect(first.session.durationSeconds).toBe(0)
    expect(formatDurationTr(first.session.durationSeconds)).toBe("Tek etkinlik (0 sn)")

    // Duplicate reload 2 seconds later on same path
    const reload = await repo.recordVisitorSessionEvent({
      ...basePayload,
      at: tReload.toISOString(),
    })
    expect(reload.deduplicated).toBe(true)
    expect(reload.session.pageViews).toBe(1)

    // Navigate to /tr/iletisim 90 seconds after start
    const second = await repo.recordVisitorSessionEvent({
      ...basePayload,
      at: tNextPage.toISOString(),
      path: "/tr/iletisim",
    })
    expect(second.deduplicated).toBe(false)
    expect(second.session.pageViews).toBe(2)
    expect(second.session.durationSeconds).toBe(90)
    expect(formatDurationTr(second.session.durationSeconds)).toBe("1 dk 30 sn")
    expect(second.session.entryPage).toBe("/tr")
    expect(second.session.lastPage).toBe("/tr/iletisim")

    // Submit a real contact form linked to this session
    const inquiryRes = await submitInquiry(
      repo,
      {
        company: "Akdeniz Gıda A.Ş.",
        contactName: "Kemal Yılmaz",
        email: "kemal@akdenizgida.example",
        phone: "+90 532 000 0000",
        country: "Türkiye",
        countryOther: "",
        destinationPort: "",
        product: "sunflower",
        orderType: "distribution",
        quantity: "",
        packaging: "",
        message: "Yurt içi distribütörlük ve toptan ayçiçek yağı alımı için iletişime geçmek istiyoruz.",
        consent: "yes",
        locale: "tr",
        formType: "contact",
        website: "",
        renderedAt: String(tNextPage.getTime() - 6000),
      },
      {
        ip: "198.51.100.42",
        salt: "test-salt",
        now: tNextPage.getTime() + 10_000,
        sessionId: "sess_prod_1",
        consentGranted: true,
        isTest: false,
        notify: async () => ({ status: "sent", detail: "ok" }),
      },
    )
    expect(inquiryRes.ok).toBe(true)

    // Verify conversion is recorded on the visitor session
    const dash = await repo.queryAnalytics()
    expect(dash.summary.totalSessions).toBe(1)
    expect(dash.summary.totalVisits).toBe(2)
    expect(dash.summary.uniqueVisitors).toBe(1)
    expect(dash.summary.uniqueVisitorsWithCookie).toBe(1)
    expect(dash.summary.convertedSessions).toBe(1)
    expect(dash.summary.contactConversions).toBe(1)
    expect(dash.sessions[0]?.converted).toBe(true)
    expect(dash.sessions[0]?.conversionTypes).toContain("contact")
    expect(dash.sessions[0]?.events.some((e) => e.type === "contact_submit")).toBe(true)
  })

  it("separates test records and bot traffic from production statistics and records auth logs", async () => {
    const repo = createMemoryRepo()
    const nowIso = new Date().toISOString()

    // Record a test session (isTest: true)
    await repo.recordVisitorSessionEvent({
      sessionId: "sess_test_only",
      visitorId: "anon_test",
      consentGranted: false,
      isTest: true,
      at: nowIso,
      timezone: "Europe/Istanbul",
      path: "/tr",
      locale: "tr",
      referrer: "Doğrudan Giriş",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
      countryCode: "TR",
      countryName: "Türkiye (TR)",
      region: "Bilinmiyor",
      city: "Bilinmiyor",
      geoSource: "Test",
      deviceType: "telefon",
      deviceBrand: "Apple",
      deviceModel: "Model belirlenemedi",
      osName: "iOS",
      osVersion: "17.4",
      browserName: "Safari",
      browserVersion: "17.4",
      language: "tr-TR",
      screenSize: "390x844",
      botStatus: "human",
      botReason: "",
    })

    const prodStats = await repo.queryAnalytics({ includeTest: false })
    expect(prodStats.summary.totalSessions).toBe(0)
    expect(prodStats.summary.testSessionsExcluded).toBe(1)

    const testIncludedStats = await repo.queryAnalytics({ includeTest: true })
    expect(testIncludedStats.summary.totalSessions).toBe(1)

    // Record successful and failed login attempts without sensitive secrets
    await repo.recordAuthLog({
      id: "auth_1",
      at: nowIso,
      timezone: "Europe/Istanbul (UTC+3)",
      email: "cebrailkara@gmail.com",
      result: "failed",
      reason: "credentials",
      countryCode: "TR",
      countryName: "Türkiye (TR)",
      region: "Bilinmiyor",
      city: "Bilinmiyor",
      deviceType: "bilgisayar",
      deviceBrand: "Bilinmiyor",
      deviceModel: "Model belirlenemedi",
      osName: "Windows",
      osVersion: "10/11",
      browserName: "Chrome",
      browserVersion: "128.0",
      isTest: false,
    })

    const logs = await repo.listAuthLogs({ includeTest: false })
    expect(logs.length).toBe(1)
    expect(logs[0]?.email).toBe("cebrailkara@gmail.com")
    expect(logs[0]?.result).toBe("failed")
  })

  it("returns ok:false with code 'db_error' when repository write fails and never reports false success", async () => {
    const baseRepo = createMemoryRepo()
    const failingRepo = {
      ...baseRepo,
      createInquiry: async () => {
        throw new Error("Simulated Firestore write failure")
      },
    }

    const res = await submitInquiry(
      failingRepo,
      {
        company: "Test Co",
        contactName: "Test User",
        email: "test@example.com",
        phone: "+90 555 111 2233",
        country: "Türkiye",
        countryOther: "",
        destinationPort: "",
        product: "olive",
        orderType: "bulk",
        quantity: "",
        packaging: "",
        message: "Checking database failure error propagation.",
        consent: "yes",
        locale: "tr",
        formType: "contact",
        website: "",
        renderedAt: String(Date.now() - 5000),
      },
      {
        ip: "127.0.0.1",
        salt: "s",
        now: Date.now(),
        notify: async () => ({ status: "queued", detail: "none" }),
      },
    )

    expect(res).toEqual({ ok: false, code: "db_error" })
  })
})
