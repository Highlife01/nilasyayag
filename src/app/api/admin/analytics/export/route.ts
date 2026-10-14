import { NextResponse } from "next/server"
import { csvCell } from "@/lib/domain"
import { formatDurationTr } from "@/lib/analytics"
import { getRepo } from "@/server/runtime"
import { requireUser } from "@/server/session"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const user = await requireUser("export")
  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const from = url.searchParams.get("from") || undefined
  const to = url.searchParams.get("to") || undefined
  const country = url.searchParams.get("country") || undefined
  const deviceType = url.searchParams.get("deviceType") || undefined
  const browser = url.searchParams.get("browser") || undefined
  const page = url.searchParams.get("page") || undefined
  const convertedRaw = url.searchParams.get("converted") || "all"
  const converted = (
    ["all", "yes", "no", "contact", "rfq"].includes(convertedRaw) ? convertedRaw : "all"
  ) as "all" | "yes" | "no" | "contact" | "rfq"
  const botFilterRaw = url.searchParams.get("botFilter") || "human_only"
  const botFilter = (
    ["human_only", "all", "bot_only", "uncertain_only"].includes(botFilterRaw) ? botFilterRaw : "human_only"
  ) as "human_only" | "all" | "bot_only" | "uncertain_only"
  const includeTest = url.searchParams.get("includeTest") === "1"

  let repo
  try {
    repo = await getRepo()
  } catch {
    return NextResponse.json({ ok: false, error: "database_unavailable" }, { status: 503 })
  }

  const data = await repo.queryAnalytics({
    from,
    to,
    country,
    deviceType,
    browser,
    page,
    converted,
    botFilter,
    includeTest,
    pageIndex: 1,
    pageSize: 5000,
  })

  const header = [
    "Oturum ID",
    "Başlangıç Zamanı",
    "Son Etkinlik Zamanı",
    "Saat Dilimi",
    "Ülke",
    "Ülke Kodu",
    "Bölge / Şehir",
    "Konum Kaynağı",
    "Cihaz Türü",
    "Cihaz Markası",
    "Cihaz Modeli",
    "İşletim Sistemi",
    "Tarayıcı",
    "Tarayıcı Dili",
    "Ekran Boyutu",
    "İlk Giriş Sayfası",
    "Son Görülen Sayfa",
    "Ziyaret Edilen Sayfalar",
    "Görüntülenen Sayfa Sayısı",
    "Ölçülen Oturum Süresi",
    "Yönlendiren Site",
    "UTM Kaynak / Kampanya",
    "Form Dönüşümü",
    "Bot Sınıflandırması",
    "Çerez İzni",
  ].map(csvCell)

  const rows = data.sessions.map((s) => {
    const regionCity = [s.region, s.city].filter((x) => x && x !== "Bilinmiyor").join(" / ") || "Bilinmiyor"
    const osText = s.osVersion && s.osVersion !== "Bilinmiyor" ? `${s.osName} ${s.osVersion}` : s.osName
    const browserText =
      s.browserVersion && s.browserVersion !== "Bilinmiyor" ? `${s.browserName} ${s.browserVersion}` : s.browserName
    const utmText =
      [s.utmSource, s.utmMedium, s.utmCampaign].filter(Boolean).join(" / ") || "Yok"
    const convText = s.converted
      ? s.conversionTypes.map((t) => (t === "contact" ? "İletişim Formu" : "Teklif Talebi (RFQ)")).join(" + ")
      : "Hayır"

    return [
      s.id,
      s.startedAt,
      s.lastActivityAt,
      s.timezone,
      s.countryName,
      s.countryCode,
      regionCity,
      s.geoSource,
      s.deviceType,
      s.deviceBrand,
      s.deviceModel,
      osText,
      browserText,
      s.language,
      s.screenSize,
      s.entryPage,
      s.lastPage,
      s.visitedPages.join(" -> "),
      String(s.pageViews),
      formatDurationTr(s.durationSeconds),
      s.referrer || "Doğrudan Giriş",
      utmText,
      convText,
      s.botStatus === "human" ? "Standart Ziyaretçi" : s.botStatus === "bot" ? `Bot (${s.botReason})` : `Belirsiz (${s.botReason})`,
      s.consentGranted ? "Verildi (1. Taraf Çerez)" : "Verilmedi (Tek Oturum)",
    ]
      .map((cell) => csvCell(String(cell ?? "")))
      .join(",")
  })

  const csvContent = `\uFEFF${[header.join(","), ...rows].join("\r\n")}`

  await repo.appendAudit({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    actor: user.email,
    action: "analytics.export",
    detail: `rows:${rows.length}`,
  })

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="ziyaretci-analizi-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  })
}
