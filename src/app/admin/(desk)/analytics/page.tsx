import Link from "next/link"
import { redirect } from "next/navigation"
import { can } from "@/lib/domain"
import type { AnalyticsDashboardData, AuthLog } from "@/lib/model"
import { updateRetentionDaysAction } from "@/server/admin-actions"
import { getRepo } from "@/server/runtime"
import { requireUser } from "@/server/session"
import { AnalyticsSessionTable } from "@/components/admin/analytics-client"
import {
  BarChart3,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Filter,
  ShieldCheck,
  KeyRound,
  Clock,
  Info,
  Compass,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Ziyaretçi ve Giriş Analizi · Asia Oil Control Center",
  robots: { index: false, follow: false },
}

function formatDateTimeTr(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone: "Europe/Istanbul",
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 19).replace("T", " ")
  }
}

function DistributionCard({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle: string
  items: { label: string; count: number; badge?: string }[]
}) {
  const max = items.reduce((m, item) => Math.max(m, item.count), 0)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="font-display text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center">
          <p className="text-xs font-semibold text-slate-500">Henüz gerçek veri bulunmuyor</p>
          <p className="mt-0.5 text-[11px] text-slate-400">Tahminî veya rastgele grafik oluşturulmaz.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const widthPct = max > 0 ? Math.max(6, Math.round((item.count / max) * 100)) : 0
            return (
              <div key={`${item.label}-${item.badge || ""}`} className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 truncate font-medium text-slate-800">
                    {item.badge && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                        {item.badge}
                      </span>
                    )}
                    <span className="truncate" title={item.label}>
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900">{item.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-800 transition-all"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string
    to?: string
    country?: string
    deviceType?: string
    browser?: string
    page?: string
    converted?: string
    botFilter?: string
    includeTest?: string
    pageIndex?: string
  }>
}) {
  const user = await requireUser("analytics")
  if (!user) redirect("/admin/login")

  const query = await searchParams
  const from = query.from?.trim() || ""
  const to = query.to?.trim() || ""
  const country = query.country?.trim() || ""
  const deviceType = query.deviceType?.trim() || ""
  const browser = query.browser?.trim() || ""
  const page = query.page?.trim() || ""
  const converted = (
    ["all", "yes", "no", "contact", "rfq"].includes(query.converted || "") ? query.converted : "all"
  ) as "all" | "yes" | "no" | "contact" | "rfq"
  const botFilter = (
    ["human_only", "all", "bot_only", "uncertain_only"].includes(query.botFilter || "")
      ? query.botFilter
      : "human_only"
  ) as "human_only" | "all" | "bot_only" | "uncertain_only"
  const includeTest = query.includeTest === "1"
  const pageIndex = Math.max(1, Number(query.pageIndex) || 1)

  let data: AnalyticsDashboardData | null = null
  let authLogs: AuthLog[] = []
  let dbError: string | null = null

  try {
    const repo = await getRepo()
    await repo.cleanupExpiredAnalytics()
    ;[data, authLogs] = await Promise.all([
      repo.queryAnalytics({
        from: from || undefined,
        to: to || undefined,
        country: country || undefined,
        deviceType: deviceType || undefined,
        browser: browser || undefined,
        page: page || undefined,
        converted,
        botFilter,
        includeTest,
        pageIndex,
        pageSize: 20,
      }),
      repo.listAuthLogs({ includeTest, limit: 100 }),
    ])
  } catch (err) {
    dbError = (err as Error)?.message || "Analiz veritabanı bağlantısı kurulamadı."
  }

  if (dbError || !data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-8 text-center shadow-xs">
        <AlertTriangle className="mx-auto h-10 w-10 text-rose-600" />
        <h1 className="mt-3 font-display text-2xl font-bold text-rose-950">
          Analitik Sunucu Bağlantı Hatası
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-rose-800">
          Ziyaretçi ve giriş analizi verileri sunucudan alınamadı ({dbError}). Doğruluk kuralları gereği bağlantı
          hatasında örnek veya sahte verilere geçiş yapılmaz.
        </p>
        <Link
          href="/admin/analytics"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Bağlantıyı Yeniden Dene</span>
        </Link>
      </div>
    )
  }

  const canExport = can(user.role, "export")
  const canSettings = can(user.role, "settings")

  const buildQueryString = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged: Record<string, string | undefined> = {
      from: from || undefined,
      to: to || undefined,
      country: country || undefined,
      deviceType: deviceType || undefined,
      browser: browser || undefined,
      page: page || undefined,
      converted: converted !== "all" ? converted : undefined,
      botFilter: botFilter !== "human_only" ? botFilter : undefined,
      includeTest: includeTest ? "1" : undefined,
      pageIndex: String(pageIndex),
      ...overrides,
    }
    for (const [k, v] of Object.entries(merged)) {
      if (v && v.trim() !== "") params.set(k, v)
    }
    return params.toString()
  }

  const exportHref = `/api/admin/analytics/export?${buildQueryString({ pageIndex: undefined })}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a67c3d]">
            <BarChart3 className="h-4 w-4" />
            <span>Gerçek Zamanlı Sunucu Analitiği · Doğrulanmış Kayıtlar</span>
          </div>
          <h1 className="font-display mt-1 text-3xl font-bold text-slate-900">
            Ziyaretçi ve Giriş Analizi
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Yalnızca siteden gerçekten toplanan oturum, sayfa geçişi, dönüşüm ve yönetici kimlik doğrulama kayıtları.
            Son sorgu: <span className="font-mono font-semibold text-slate-700">{formatDateTimeTr(data.fetchedAt)}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {canExport && (
            <a
              href={exportHref}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Filtrelenmiş Sonuçları CSV İndir</span>
            </a>
          )}
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Filtreleri Sıfırla</span>
          </Link>
        </div>
      </div>

      {/* Accuracy & Methodology Notice Banner */}
      <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-4 text-xs text-amber-950">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <div className="space-y-1 leading-relaxed">
            <div className="font-bold text-amber-950">Ölçüm Doğruluğu, Konum ve Gizlilik Notu</div>
            <p>
              • <strong>Yaklaşık IP Konumu:</strong> Ülke ve bölge/şehir bilgisi sunucu tarafında doğrulanmış hosting/ağ
              başlıklarından belirlenir. IP konumu yaklaşık olabilir; VPN, proxy veya kurumsal ağ yönlendirmeleri nedeniyle
              gerçek konumdan farklı çıkabilir. Ham IP adresi veritabanında veya bu ekranda <strong>saklanmaz ve gösterilmez</strong>.
            </p>
            <p>
              • <strong>Cihaz Modeli ve Tekil Ziyaretçi Sınırlamaları:</strong> Tarayıcı (özellikle iOS/iPhone Safari ve
              güncel mobil tarayıcılar) kesin cihaz modelini paylaşmadığında ekran boyutundan tahmin yapılmaz ve{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">Model belirlenemedi</code> gösterilir. Tekil
              ziyaretçi sayısı 1. taraf analitik çerez izni veren ziyaretçilerde{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">nilasya_vid</code> çereziyle, izin vermeyenlerde
              oturum bazında ölçülür; çerez silindiğinde veya farklı tarayıcı kullanıldığında yeni ziyaretçi sayılır.
            </p>
            <p>
              • <strong>Oturum Süresi ve Bot Ayrımı:</strong> Oturum süresi yalnızca ölçülen etkinlikler arasındaki farktan
              hesaplanır; son etkinlikten sonraki süre uydurulmaz. Bot/tarayıcı otomasyonları ayrı sınıflandırılır (şu anki
              görünümden hariç tutulan bot oturumu: <strong>{data.summary.botSessionsExcluded}</strong>, hariç tutulan test
              oturumu: <strong>{data.summary.testSessionsExcluded}</strong>).
            </p>
          </div>
        </div>
      </div>

      {/* 5 Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Toplam Ziyaret</span>
            <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-slate-900">
            {data.summary.totalVisits}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Filtrelenen oturumlardaki toplam gerçek sayfa görüntüleme sayısı
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Toplam Oturum</span>
            <Compass className="h-4 w-4 text-blue-700" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-slate-900">
            {data.summary.totalSessions}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Kaydedilen gerçek ziyaret oturumu sayısı (30 dk hareketsizlik sınırı)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ölçülebilen Tekil Ziyaretçi</span>
            <Users className="h-4 w-4 text-indigo-700" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-slate-900">
            {data.summary.uniqueVisitors}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            1. taraf çerezli: <strong>{data.summary.uniqueVisitorsWithCookie}</strong> · Parmak izi kullanılmaz
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[11px] font-bold uppercase tracking-wider">Aktif Ziyaretçi</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-emerald-950">
            {data.summary.activeVisitors}
          </div>
          <p className="mt-1 text-[11px] text-emerald-800">
            Son <strong>{data.activeWindowMinutes} dakika</strong> içinde etkinlik gösteren oturumlar
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-[11px] font-bold uppercase tracking-wider">Form Dönüşümü</span>
            <CheckCircle2 className="h-4 w-4 text-amber-700" />
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-amber-950">
            {data.summary.convertedSessions}
          </div>
          <p className="mt-1 text-[11px] text-amber-900">
            İletişim: <strong>{data.summary.contactConversions}</strong> · Teklif (RFQ):{" "}
            <strong>{data.summary.rfqConversions}</strong>
          </p>
        </div>
      </div>

      {/* Server-Side Filter Form */}
      <form
        method="GET"
        action="/admin/analytics"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Filter className="h-4 w-4 text-[#a67c3d]" />
            <span>Sunucu Tarafı Ziyaretçi ve Dönüşüm Filtreleri</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Toplam Eşleşen Oturum: <strong className="text-slate-700">{data.pagination.totalRows}</strong>
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Başlangıç Tarihi</label>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Bitiş Tarihi</label>
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Ülke</label>
            <input
              type="text"
              name="country"
              defaultValue={country}
              placeholder="Örn: TR veya Türkiye"
              list="analytics-countries"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900"
            />
            <datalist id="analytics-countries">
              {data.availableFilters.countries.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Cihaz Türü</label>
            <select
              name="deviceType"
              defaultValue={deviceType}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900"
            >
              <option value="">Tüm Cihazlar</option>
              <option value="telefon">Telefon</option>
              <option value="tablet">Tablet</option>
              <option value="bilgisayar">Bilgisayar</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Tarayıcı</label>
            <input
              type="text"
              name="browser"
              defaultValue={browser}
              placeholder="Örn: Chrome, Safari"
              list="analytics-browsers"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900"
            />
            <datalist id="analytics-browsers">
              {data.availableFilters.browsers.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Ziyaret Edilen Sayfa</label>
            <input
              type="text"
              name="page"
              defaultValue={page}
              placeholder="Örn: /tr, /tr/contact"
              list="analytics-pages"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900"
            />
            <datalist id="analytics-pages">
              {data.availableFilters.pages.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Form Dönüşüm Durumu</label>
            <select
              name="converted"
              defaultValue={converted}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900"
            >
              <option value="all">Tüm Oturumlar</option>
              <option value="yes">Form Gönderenler (Tümü)</option>
              <option value="contact">İletişim Formu Gönderenler</option>
              <option value="rfq">Sipariş / Teklif Talebi Gönderenler</option>
              <option value="no">Form Göndermeyenler</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Bot & Otomasyon Filtresi</label>
            <select
              name="botFilter"
              defaultValue={botFilter}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900"
            >
              <option value="human_only">Standart Ziyaretçiler (Bot Hariç)</option>
              <option value="all">Tüm Kayıtlar (Botlar Dahil)</option>
              <option value="bot_only">Yalnızca Tespit Edilen Botlar</option>
              <option value="uncertain_only">Belirsiz / Şüpheli İstekler</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Veri Ortamı</label>
            <select
              name="includeTest"
              defaultValue={includeTest ? "1" : ""}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900"
            >
              <option value="">Üretim İstatistikleri (Test Hariç)</option>
              <option value="1">Test Kayıtlarını da Göster</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#111c14] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-950"
            >
              Filtreyi Uygula
            </button>
          </div>
        </div>
      </form>

      {/* Real-Data Distribution Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DistributionCard
          title="Ülke Dağılımı"
          subtitle="Sunucu tarafı IP konum başlıklarına göre oturumlar"
          items={data.distributions.countries.map((c) => ({
            label: c.label,
            badge: c.code,
            count: c.count,
          }))}
        />

        <DistributionCard
          title="Cihaz Türü"
          subtitle="Telefon, tablet ve bilgisayar dağılımı"
          items={data.distributions.devices.map((d) => ({
            label: d.label.charAt(0).toUpperCase() + d.label.slice(1),
            count: d.count,
          }))}
        />

        <DistributionCard
          title="İşletim Sistemi"
          subtitle="Erişilebilen işletim sistemi dağılımı"
          items={data.distributions.os}
        />

        <DistributionCard
          title="Tarayıcı Dağılımı"
          subtitle="Ziyaretçilerin kullandığı tarayıcı aileleri"
          items={data.distributions.browsers}
        />

        <DistributionCard
          title="Trafik Kaynağı & Yönlendiren"
          subtitle="Yönlendiren site (Referrer) ve UTM kaynakları"
          items={data.distributions.sources}
        />

        <DistributionCard
          title="En Çok Ziyaret Edilen Sayfalar"
          subtitle="Gerçek sayfa görüntüleme sayısına göre ilk 15 sayfa"
          items={data.distributions.topPages.map((p) => ({
            label: p.path,
            badge: `${p.sessions} oturum`,
            count: p.views,
          }))}
        />
      </div>

      {/* Visitor Sessions Table & Server-Side Pagination */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Ziyaret Oturumları ve Sayfa Geçiş Kayıtları
            </h2>
            <p className="text-xs text-slate-500">
              Zaman sıralı sayfa geçişlerini, cihaz/model ayrıntılarını ve form dönüşüm etkinliklerini görmek için bir
              satıra tıklayın.
            </p>
          </div>
          <div className="text-xs font-medium text-slate-500">
            Sayfa <strong className="text-slate-900">{data.pagination.pageIndex}</strong> /{" "}
            <strong className="text-slate-900">{data.pagination.totalPages}</strong> ({data.pagination.totalRows} kayıt)
          </div>
        </div>

        <AnalyticsSessionTable sessions={data.sessions} />

        {/* Pagination Bar */}
        {data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-6 py-3.5">
            <div className="text-xs text-slate-500">
              Her sayfada en fazla {data.pagination.pageSize} oturum gösterilir
            </div>
            <div className="flex items-center gap-2">
              {data.pagination.pageIndex > 1 ? (
                <Link
                  href={`/admin/analytics?${buildQueryString({
                    pageIndex: String(data.pagination.pageIndex - 1),
                  })}`}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Önceki</span>
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-xl border border-slate-100 bg-slate-100/60 px-3 py-1.5 text-xs font-semibold text-slate-400">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Önceki</span>
                </span>
              )}

              {data.pagination.pageIndex < data.pagination.totalPages ? (
                <Link
                  href={`/admin/analytics?${buildQueryString({
                    pageIndex: String(data.pagination.pageIndex + 1),
                  })}`}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span>Sonraki</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-xl border border-slate-100 bg-slate-100/60 px-3 py-1.5 text-xs font-semibold text-slate-400">
                  <span>Sonraki</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Real Account Login Logs Section (GERÇEK HESAP GİRİŞLERİ) */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a67c3d]">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Sunucu Kimlik Doğrulama Denetimi</span>
            </div>
            <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900">
              Giriş Kayıtları (Başarılı ve Başarısız Hesap Girişleri)
            </h2>
            <p className="text-xs text-slate-500">
              Yönetici paneli hesap giriş işlemleri sunucu tarafında kaydedilir. Güvenlik kuralları gereği şifre, erişim
              belirteci veya oturum çerezi kesinlikle kaydedilmez.
            </p>
          </div>
          <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
            Kaydedilen Giriş Denemesi: <strong className="font-mono text-slate-900">{authLogs.length}</strong>
          </span>
        </div>

        {authLogs.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-sm font-bold text-slate-700">Henüz giriş kaydı bulunmuyor</p>
            <p className="mt-1 text-xs text-slate-500">
              Yönetici hesabıyla başarılı veya başarısız giriş denemesi yapıldığında burada listelenir.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Tarih & Saat Dilimi</th>
                  <th className="px-4 py-3.5">İlgili Hesap</th>
                  <th className="px-4 py-3.5">Sonuç & Neden</th>
                  <th className="px-4 py-3.5">Yaklaşık Ülke / Bölge</th>
                  <th className="px-4 py-3.5">Cihaz & Model</th>
                  <th className="px-5 py-3.5">İşletim Sistemi & Tarayıcı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {authLogs.map((log) => {
                  const isSuccess = log.result === "success"
                  const reasonLabel =
                    log.reason === "ok"
                      ? "Doğrulandı"
                      : log.reason === "credentials"
                        ? "Hatalı E-posta veya Şifre"
                        : log.reason === "otp"
                          ? "Hatalı 2FA Kodu"
                          : log.reason === "rate_limit"
                            ? "Hız Sınırı Engeli"
                            : "Pasif Hesap"
                  const regionText =
                    [log.region, log.city].filter((x) => x && x !== "Bilinmiyor").join(" / ") || "Bilinmiyor"

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="font-mono font-semibold text-slate-900">{formatDateTimeTr(log.at)}</div>
                        <div className="text-[10px] text-slate-500">{log.timezone}</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-semibold text-slate-900">{log.email}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isSuccess
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-rose-100 text-rose-900"
                          }`}
                        >
                          <span>{isSuccess ? "Başarılı" : "Başarısız"}</span>
                          <span className="font-normal opacity-80">({reasonLabel})</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">
                          {log.countryName} ({log.countryCode})
                        </div>
                        <div className="text-[11px] text-slate-500">{regionText}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold capitalize text-slate-900">{log.deviceType}</div>
                        <div className="text-[11px] text-slate-500">
                          {log.deviceBrand !== "Bilinmiyor" ? `${log.deviceBrand} · ` : ""}
                          {log.deviceModel}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">
                          {log.osName} {log.osVersion !== "Bilinmiyor" ? log.osVersion : ""}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {log.browserName} {log.browserVersion !== "Bilinmiyor" ? log.browserVersion : ""}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Data Retention Configuration (Veri Saklama Süresi) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Clock className="h-3.5 w-3.5 text-emerald-800" />
              <span>Veri Saklama ve Otomatik Temizlik Politikası</span>
            </div>
            <h3 className="font-display mt-1 text-base font-bold text-slate-900">
              Analitik ve Giriş Kayıtları Saklama Süresi: {data.retentionDays} Gün
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Belirlenen saklama süresini aşan ziyaret oturumları ve giriş kayıtları sunucu sorgularında ve yapılandırma
              güncellemelerinde otomatik olarak temizlenir.
            </p>
          </div>

          {canSettings && (
            <form action={updateRetentionDaysAction} className="flex items-center gap-2">
              <select
                name="retentionDays"
                defaultValue={String(data.retentionDays)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900"
              >
                <option value="14">14 Gün</option>
                <option value="30">30 Gün</option>
                <option value="60">60 Gün</option>
                <option value="90">90 Gün (Varsayılan)</option>
                <option value="180">180 Gün</option>
                <option value="365">365 Gün</option>
              </select>
              <button
                type="submit"
                className="rounded-xl bg-emerald-900 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
              >
                Süreyi Kaydet & Temizle
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
