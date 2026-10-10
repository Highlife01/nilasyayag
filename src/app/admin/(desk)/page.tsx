import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getRepo } from "@/server/runtime"
import type { Inquiry } from "@/lib/model"
import {
  Inbox,
  TrendingUp,
  Globe2,
  Ship,
  Sparkles,
  ArrowUpRight,
  Clock,
  ShieldCheck,
} from "lucide-react"

export const metadata = {
  title: "Genel Bakış · Nilasya Global Control Center",
  robots: { index: false, follow: false },
}

export default async function OverviewPage() {
  const repo = await getRepo()
  const inquiries: Inquiry[] = await repo.listInquiries({ limit: 1000 })

  // Metrics
  const totalCount = inquiries.length
  const newCount = inquiries.filter((i: Inquiry) => i.status === "new").length
  const inProgressCount = inquiries.filter((i: Inquiry) => i.status === "contacted" || i.status === "quoted").length
  const wonCount = inquiries.filter((i: Inquiry) => i.status === "won").length
  const uniqueCountries = new Set(inquiries.map((i: Inquiry) => i.country).filter(Boolean))

  const sunflowerCount = inquiries.filter((i: Inquiry) => i.product === "sunflower" || i.product === "both").length
  const oliveCount = inquiries.filter((i: Inquiry) => i.product === "olive" || i.product === "both").length

  // Last 7 days volume calculation
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    return date.toISOString().slice(0, 10)
  })
  const dailyCounts = days.map((day) => inquiries.filter((i: Inquiry) => i.createdAt.slice(0, 10) === day).length)
  const maxDaily = Math.max(1, ...dailyCounts)

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-[#111c14] via-[#1a2e20] to-[#0f1712] p-7 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-[#e4c98a] backdrop-blur font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nilasya Sofralık Yağ Executive Control Center</span>
            </div>
            <h1 className="font-display mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#fbf9f4]">
              Hoş Geldiniz, Cebrail Bey
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-300 font-light leading-relaxed">
              Ayçiçek yağı ve natürel sızma zeytinyağı toptan ihracat talepleri, 8 dilli B2B portalı üzerinden gelen teklifler ve Mersin Limanı konteyner sevkiyat kontrolü aktif durumda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-[#c49f27] shadow-lg"
            >
              <Inbox className="h-4 w-4" />
              <span>Gelen Talepleri İncele ({newCount})</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[#d4af37]/15 blur-3xl" />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Leads */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Toplam B2B Talebi
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Inbox className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-slate-900">{totalCount}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> Canlı DB
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {newCount} yeni bekleyen teklif talebi
          </p>
        </div>

        {/* Card 2: Actionable Status */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Görüşülen / Teklif Verilen
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-slate-900">{inProgressCount}</span>
            <span className="text-xs text-slate-500 font-medium">aktif süreç</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {wonCount} kazanılan sevkiyat sözleşmesi
          </p>
        </div>

        {/* Card 3: Global Countries */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              İthalatçı Ülke Sayısı
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Globe2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-slate-900">
              {Math.max(uniqueCountries.size, 1)}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Global Alıcı</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Orta Doğu, Avrupa, Afrika & Asya
          </p>
        </div>

        {/* Card 4: Logistics & Ports */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Liman & Lojistik Masası
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
              <Ship className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-slate-900">Mersin</span>
            <span className="text-xs text-slate-500 font-medium">+ İzmir</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            FOB, CIF & CFR Konteyner ve Flexitank
          </p>
        </div>
      </div>

      {/* 2-Column Section: Recent Inquiries + Commodity Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Recent Inquiries Table (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Son B2B Teklif Talepleri</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Site formlarından doğrudan sunucuya iletilen talepler
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#a67c3d] hover:text-[#88622c] transition"
            >
              <span>Tümünü Gör</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {inquiries.slice(0, 5).map((lead: Inquiry) => (
              <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-semibold text-sm text-slate-900 hover:text-[#a67c3d] transition truncate"
                    >
                      {lead.company}
                    </Link>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {lead.country || "Global"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {lead.contactName} · {lead.email} · {lead.product === "sunflower" ? "Ayçiçek Yağı" : lead.product === "olive" ? "Zeytinyağı" : "Karma Talep"} {lead.quantity ? `(${lead.quantity})` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
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

            {inquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Inbox className="h-8 w-8 mx-auto stroke-1 opacity-50 mb-2" />
                <p className="text-sm font-medium">Henüz kayıtlı talep bulunmuyor.</p>
                <p className="text-xs mt-1">Sitedeki teklif formu doldurulduğunda buraya anında düşer.</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right: Commodity & Product Share */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Ürün Talep Dağılımı</h2>
            <p className="text-xs text-slate-500 mt-0.5">Alıcıların odaklandığı amiral gruplar</p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Ayçiçek Yağı (Sunflower)</span>
                  <span className="font-mono text-amber-600 font-bold">{sunflowerCount} talep</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${totalCount ? Math.max(15, (sunflowerCount / totalCount) * 100) : 60}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Natürel Sızma Zeytinyağı (Olive)</span>
                  <span className="font-mono text-emerald-700 font-bold">{oliveCount} talep</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${totalCount ? Math.max(15, (oliveCount / totalCount) * 100) : 40}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Ambalaj lideri:</span>
              <span className="font-bold text-slate-800">5L Pet & 18L Teneke</span>
            </div>
          </div>

          {/* Quick Security & Architecture Audit */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Sıfır İstemci Depolaması Doğrulandı</span>
            </div>
            <p className="text-xs text-emerald-800/80 mt-1.5 leading-relaxed">
              Bu panelde hiçbir veri LocalStorage veya SessionStorage üzerinde tutulmaz. Yetkili oturumunuz şifreli HttpOnly çerez ile korunmaktadır.
            </p>
          </div>
        </div>
      </div>

      {/* 7 Days Trend Graph */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Haftalık B2B Talep Trafiği</h2>
            <p className="text-xs text-slate-500">Son 7 günlük teklif ve mesaj alma sıklığı</p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-400">Canlı Metrik</span>
        </div>

        <div className="mt-4">
          <svg viewBox="0 0 700 120" className="h-32 w-full" role="img" aria-label="Son 7 gün trend">
            {dailyCounts.map((count, index) => {
              const barHeight = Math.max(6, (count / maxDaily) * 85)
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
                    {count > 0 ? count : ""}
                  </text>
                </g>
              )
            })}
          </svg>

          <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-500 border-t border-slate-100 pt-2">
            {days.map((day) => (
              <span key={day}>{day.slice(5)}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
