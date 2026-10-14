import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getRepo } from "@/server/runtime"
import type { AnalyticsDashboardData, Inquiry } from "@/lib/model"
import {
  Inbox,
  MessageSquare,
  Activity,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  Users,
  FileText,
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Genel Bakış · Asia Oil Control Center",
  robots: { index: false, follow: false },
}

function formatDateTimeTr(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Europe/Istanbul",
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 16).replace("T", " ")
  }
}

export default async function OverviewPage() {
  let inquiries: Inquiry[] = []
  let analytics: AnalyticsDashboardData | null = null
  let dbError: string | null = null
  const fetchedAt = new Date().toISOString()

  try {
    const repo = await getRepo()
    ;[inquiries, analytics] = await Promise.all([
      repo.listInquiries({ limit: 1000 }),
      repo.queryAnalytics({ pageSize: 5 }),
    ])
  } catch (err) {
    dbError = (err as Error)?.message || "Sunucu veritabanına bağlanılamadı."
  }

  if (dbError || !analytics) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-rose-950">
          Veritabanı Bağlantı Hatası
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-rose-800">
          Sunucu veritabanına erişilirken bir hata oluştu ({dbError}). Güvenlik ve doğruluk ilkeleri gereği sahte veya varsayılan örnek verilere geçiş yapılmamıştır.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl bg-rose-800 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-900 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Yeniden Dene</span>
          </Link>
        </div>
      </div>
    )
  }

  // Separate real contact form messages vs RFQ requests
  const contactMessages = inquiries.filter((i) => i.formType === "contact" || i.collection === "contact_submissions")
  const rfqRequests = inquiries.filter((i) => i.formType === "rfq" || i.collection === "rfq_requests")

  const totalCount = inquiries.length
  const newContactCount = contactMessages.filter((i) => i.status === "new").length
  const newRfqCount = rfqRequests.filter((i) => i.status === "new").length
  const wonCount = inquiries.filter((i) => i.status === "won").length
  const uniqueCountries = new Set(inquiries.map((i) => i.country).filter(Boolean))

  const sunflowerCount = inquiries.filter((i) => i.product === "sunflower" || i.product === "both").length
  const oliveCount = inquiries.filter((i) => i.product === "olive" || i.product === "both").length

  // Real top packaging calculation (no hardcoded fallback)
  const packagingMap = new Map<string, number>()
  for (const item of inquiries) {
    const pkg = (item.packaging || "").trim()
    if (pkg) packagingMap.set(pkg, (packagingMap.get(pkg) || 0) + 1)
  }
  const topPackaging =
    Array.from(packagingMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "Henüz veri yok"

  // Last 7 days volume calculation from real records
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    return date.toISOString().slice(0, 10)
  })
  const dailyContactCounts = days.map((day) => contactMessages.filter((i) => i.createdAt.slice(0, 10) === day).length)
  const dailyRfqCounts = days.map((day) => rfqRequests.filter((i) => i.createdAt.slice(0, 10) === day).length)
  const dailyTotals = days.map((_, idx) => dailyContactCounts[idx] + dailyRfqCounts[idx])
  const totalLast7Days = dailyTotals.reduce((a, b) => a + b, 0)
  const maxDaily = Math.max(1, ...dailyTotals)

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-[#111c14] via-[#1a2e20] to-[#0f1712] p-7 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-[#e4c98a] backdrop-blur font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Asia Oil Executive Control Center • Son Güncelleme: {formatDateTimeTr(fetchedAt)} (UTC+3)</span>
            </div>
            <h1 className="font-display mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#fbf9f4]">
              Hoş Geldiniz, Cebrail Bey
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-300 font-light leading-relaxed">
              İletişim formuna gelen mesajlar, B2B teklif talepleri (RFQ) ve gerçek zamanlı ziyaretçi & giriş analizleri doğrudan sunucu veritabanından çekilmektedir.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/leads?type=contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-[#c49f27] shadow-lg"
            >
              <MessageSquare className="h-4 w-4" />
              <span>İletişim Mesajları ({contactMessages.length})</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Activity className="h-4 w-4 text-emerald-300" />
              <span>Ziyaretçi Analizi</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[#d4af37]/15 blur-3xl" />
      </div>

      {/* KPI Stat Cards (100% Real Data) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Contact Form Messages */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              İletişim Formu Mesajları
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-slate-900">{contactMessages.length}</span>
            <span className="text-xs text-amber-700 font-medium">
              {newContactCount} yeni mesaj
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            İletişim sayfasından doğrudan düşen mesajlar
          </p>
        </div>

        {/* Card 2: RFQ / Order Requests */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sipariş & Teklif Talepleri
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-slate-900">{rfqRequests.length}</span>
            <span className="text-xs text-blue-700 font-medium">{newRfqCount} yeni talep</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {wonCount} onaylanan sevkiyat • {uniqueCountries.size} ülke
          </p>
        </div>

        {/* Card 3: Real Visitor & Session Traffic */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Gerçek Ziyaret & Oturum
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-slate-900">
              {analytics.summary.totalVisits}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              {analytics.summary.totalSessions} oturum
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Son {analytics.activeWindowMinutes} dk aktif ziyaretçi: <strong>{analytics.summary.activeVisitors}</strong>
          </p>
        </div>

        {/* Card 4: Verified Sales / Payment Metric */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Doğrulanmış Satış Tutarı
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
              Veri kaynağı bağlı değil
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
            Teklif taleplerinden tahmini ciro üretilmez; yalnızca doğrulanmış ödeme/fatura kaynağı bağlandığında hesaplanır.
          </p>
        </div>
      </div>

      {/* 2-Column Section: Contact Messages + RFQ Requests */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Incoming Contact Form Messages */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Gelen İletişim Formu Mesajları</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                İletişim sayfasından gönderilen doğrudan mesajlar (`contact_submissions`)
              </p>
            </div>
            <Link
              href="/admin/leads?type=contact"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#a67c3d] hover:text-[#88622c] transition"
            >
              <span>Tüm Mesajlar</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {contactMessages.slice(0, 6).map((msg) => (
              <div key={msg.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/leads/${msg.id}`}
                      className="font-semibold text-sm text-slate-900 hover:text-[#a67c3d] transition truncate"
                    >
                      {msg.contactName} ({msg.company})
                    </Link>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {msg.country || "Bilinmiyor"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {msg.message}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    {formatDateTimeTr(msg.createdAt)} · {msg.email} · {msg.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      msg.status === "new"
                        ? "bg-amber-100 text-amber-800"
                        : msg.status === "won"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {msg.status === "new" ? "Yeni" : msg.status === "won" ? "Kazanıldı" : msg.status}
                  </span>
                  <Link
                    href={`/admin/leads/${msg.id}`}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Aç
                  </Link>
                </div>
              </div>
            ))}

            {contactMessages.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <MessageSquare className="h-8 w-8 mx-auto stroke-1 opacity-50 mb-2" />
                <p className="text-sm font-medium text-slate-600">Henüz mesaj bulunmuyor</p>
                <p className="text-xs mt-1">İletişim formundan mesaj gönderildiğinde burada listelenir.</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right: Incoming RFQ / Order Requests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Gelen Sipariş ve Teklif Talepleri</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Teklif formundan gönderilen B2B ihracat talepleri (`rfq_requests`)
              </p>
            </div>
            <Link
              href="/admin/leads?type=rfq"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#a67c3d] hover:text-[#88622c] transition"
            >
              <span>Tüm Talepler</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {rfqRequests.slice(0, 6).map((lead) => (
              <div key={lead.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-semibold text-sm text-slate-900 hover:text-[#a67c3d] transition truncate"
                    >
                      {lead.company}
                    </Link>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {lead.country || "Bilinmiyor"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 truncate">
                    {lead.product === "sunflower" ? "Ayçiçek Yağı" : lead.product === "olive" ? "Zeytinyağı" : "Karma Talep"}{" "}
                    {lead.quantity ? `· ${lead.quantity}` : ""} {lead.packaging ? `· ${lead.packaging}` : ""}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    {formatDateTimeTr(lead.createdAt)} · {lead.contactName} ({lead.email})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      lead.status === "new"
                        ? "bg-amber-100 text-amber-800"
                        : lead.status === "won"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {lead.status === "new" ? "Yeni" : lead.status === "won" ? "Kazanıldı" : lead.status}
                  </span>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Detay
                  </Link>
                </div>
              </div>
            ))}

            {rfqRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Inbox className="h-8 w-8 mx-auto stroke-1 opacity-50 mb-2" />
                <p className="text-sm font-medium text-slate-600">Henüz sipariş talebi bulunmuyor</p>
                <p className="text-xs mt-1">Teklif formundan talep gönderildiğinde burada listelenir.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Real Commodity Share + Weekly Graph */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Commodity Share (Only Real Data) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Gerçek Ürün Talep Dağılımı</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kayıtlı mesaj ve tekliflerde seçilen ürün grupları</p>

            {totalCount === 0 ? (
              <div className="my-8 rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                Henüz kayıtlı mesaj veya teklif talebi bulunmadığı için ürün dağılım grafiği boş durumdadır.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Ayçiçek Yağı (Sunflower)</span>
                    <span className="font-mono text-amber-600 font-bold">{sunflowerCount} kayıt</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.round((sunflowerCount / totalCount) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Natürel Sızma Zeytinyağı (Olive)</span>
                    <span className="font-mono text-emerald-700 font-bold">{oliveCount} kayıt</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${Math.round((oliveCount / totalCount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>En çok talep edilen ambalaj:</span>
              <span className="font-bold text-slate-800">{topPackaging}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Tüm metrikler gerçek veritabanı kayıtlarından hesaplanır; sahte veri kullanılmaz.</span>
            </div>
          </div>
        </div>

        {/* 7 Days Real Trend Graph */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Son 7 Günlük Gerçek Mesaj ve Talep Grafiği</h2>
              <p className="text-xs text-slate-500">Gerçek tarih ve veritabanı kayıt sayılarına göre günlük dağılım</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">
              7 Gün Toplam: {totalLast7Days}
            </span>
          </div>

          {totalLast7Days === 0 ? (
            <div className="my-6 rounded-xl border border-dashed border-slate-200 py-12 text-center text-xs text-slate-500">
              Son 7 gün içinde kaydedilmiş mesaj veya sipariş talebi bulunmuyor.
            </div>
          ) : (
            <div className="mt-4">
              <svg viewBox="0 0 700 120" className="h-36 w-full" role="img" aria-label="Son 7 gün gerçek talep grafiği">
                {dailyTotals.map((count, index) => {
                  const barHeight = count > 0 ? Math.max(10, (count / maxDaily) * 85) : 2
                  const x = index * 100 + 20
                  const y = 100 - barHeight
                  return (
                    <g key={days[index]}>
                      <rect
                        x={x}
                        y={y}
                        width="60"
                        height={barHeight}
                        rx="6"
                        className={count > 0 ? "fill-[#d4af37] hover:fill-[#b8860b] transition" : "fill-slate-100"}
                      />
                      <text
                        x={x + 30}
                        y={y - 8}
                        textAnchor="middle"
                        className="text-[11px] font-mono font-bold fill-slate-700"
                      >
                        {count}
                      </text>
                    </g>
                  )
                })}
              </svg>

              <div className="grid grid-cols-7 text-center text-xs font-mono text-slate-500 border-t border-slate-100 pt-2">
                {days.map((day) => (
                  <span key={day}>{day.slice(5)}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
