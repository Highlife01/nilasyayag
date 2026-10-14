import Link from "next/link"
import { redirect } from "next/navigation"
import type { InquiryStatus } from "@/lib/domain"
import type { Inquiry } from "@/lib/model"
import { getRepo } from "@/server/runtime"
import { requireUser } from "@/server/session"
import {
  Inbox,
  MessageSquare,
  FileText,
  Filter,
  PhoneCall,
  Mail,
  Ship,
  Package,
  AlertTriangle,
  RotateCcw,
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "İletişim Mesajları & Talepler · Asia Oil Control Center",
  robots: { index: false, follow: false },
}

const STATUS_FILTERS: { key: string; label: string; status?: InquiryStatus }[] = [
  { key: "all", label: "Tüm Durumlar" },
  { key: "new", label: "Yeni", status: "new" },
  { key: "contacted", label: "İletişime Geçildi", status: "contacted" },
  { key: "quoted", label: "Teklif Verildi", status: "quoted" },
  { key: "won", label: "Kazanıldı", status: "won" },
  { key: "lost", label: "Kaybedildi", status: "lost" },
]

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

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>
}) {
  if (!(await requireUser("leads"))) redirect("/admin")
  const query = await searchParams
  const activeStatus = query.status as InquiryStatus | undefined
  const activeType = query.type === "contact" ? "contact" : query.type === "rfq" ? "rfq" : "all"

  let allLeads: Inquiry[] = []
  let dbError: string | null = null

  try {
    allLeads = await (await getRepo()).listInquiries({ limit: 500 })
  } catch (err) {
    dbError = (err as Error)?.message || "Veritabanı bağlantısı kurulamadı."
  }

  if (dbError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center shadow-sm">
        <AlertTriangle className="mx-auto h-8 w-8 text-rose-600" />
        <h1 className="mt-3 font-display text-2xl font-bold text-rose-950">Bağlantı Hatası</h1>
        <p className="mt-1 text-xs text-rose-800">{dbError}</p>
        <Link
          href="/admin/leads"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-800 px-4 py-2 text-xs font-bold text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Yeniden Dene</span>
        </Link>
      </div>
    )
  }

  const contactCount = allLeads.filter((l) => l.formType === "contact" || l.collection === "contact_submissions").length
  const rfqCount = allLeads.filter((l) => l.formType === "rfq" || l.collection === "rfq_requests").length

  const typeFiltered = allLeads.filter((l) => {
    if (activeType === "contact") return l.formType === "contact" || l.collection === "contact_submissions"
    if (activeType === "rfq") return l.formType === "rfq" || l.collection === "rfq_requests"
    return true
  })

  const filteredLeads = activeStatus ? typeFiltered.filter((l) => l.status === activeStatus) : typeFiltered

  const buildHref = (typeVal: string, statusVal?: string) => {
    const params = new URLSearchParams()
    if (typeVal && typeVal !== "all") params.set("type", typeVal)
    if (statusVal) params.set("status", statusVal)
    const qs = params.toString()
    return qs ? `/admin/leads?${qs}` : "/admin/leads"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a67c3d]">
            <Inbox className="h-4 w-4" />
            <span>İletişim Formu & B2B Teklif Yönetimi</span>
          </div>
          <h1 className="font-display mt-1 text-3xl font-bold text-slate-900">
            İletişim Mesajları ve Sipariş Talepleri
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sitedeki iletişim formundan (`contact_submissions`) ve teklif formundan (`rfq_requests`) sunucuya kaydedilen gerçek kayıtlar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            İletişim Mesajı: <strong className="text-slate-900 font-mono">{contactCount}</strong>
          </span>
          <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            Teklif Talebi: <strong className="text-slate-900 font-mono">{rfqCount}</strong>
          </span>
          <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
            Yeni Bekleyen: <strong className="font-mono">{allLeads.filter((l) => l.status === "new").length}</strong>
          </span>
        </div>
      </div>

      {/* Form Type Tabs (All / Contact Messages / RFQ Requests) */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildHref("all", activeStatus)}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeType === "all"
              ? "bg-emerald-900 text-white shadow"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Inbox className="h-3.5 w-3.5" />
          <span>Tüm Kayıtlar ({allLeads.length})</span>
        </Link>

        <Link
          href={buildHref("contact", activeStatus)}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeType === "contact"
              ? "bg-emerald-900 text-white shadow"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>İletişim Formu Mesajları ({contactCount})</span>
        </Link>

        <Link
          href={buildHref("rfq", activeStatus)}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeType === "rfq"
              ? "bg-emerald-900 text-white shadow"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Sipariş & Teklif Talepleri ({rfqCount})</span>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <Filter className="h-4 w-4 text-slate-400 mr-1" />
        {STATUS_FILTERS.map((f) => {
          const isSelected = (!activeStatus && f.key === "all") || activeStatus === f.status
          const count = f.status ? typeFiltered.filter((l) => l.status === f.status).length : typeFiltered.length
          return (
            <Link
              key={f.key}
              href={buildHref(activeType, f.status)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-[#111c14] text-white shadow"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {count}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Leads & Messages Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Tür</th>
                <th className="px-4 py-3.5">Firma & Gönderen</th>
                <th className="px-4 py-3.5">İletişim</th>
                <th className="px-4 py-3.5">Mesaj / Talep Özeti</th>
                <th className="px-4 py-3.5">Ürün & Detay</th>
                <th className="px-4 py-3.5">Durum</th>
                <th className="px-4 py-3.5">Tarih (UTC+3)</th>
                <th className="px-5 py-3.5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => {
                const isNew = lead.status === "new"
                const isContact = lead.formType === "contact" || lead.collection === "contact_submissions"
                return (
                  <tr key={lead.id} className={`transition hover:bg-slate-50/80 ${isNew ? "bg-amber-50/30" : ""}`}>
                    {/* Form Type */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold ${
                          isContact
                            ? "bg-amber-100/80 text-amber-900 border border-amber-200"
                            : "bg-blue-100/80 text-blue-900 border border-blue-200"
                        }`}
                      >
                        {isContact ? <MessageSquare className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                        <span>{isContact ? "İletişim Mesajı" : "Teklif Talebi"}</span>
                      </span>
                    </td>

                    {/* Company & Country */}
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900">
                        <Link href={`/admin/leads/${lead.id}`} className="hover:text-[#a67c3d] transition">
                          {lead.company}
                        </Link>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{lead.contactName}</span>
                        <span>·</span>
                        <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                          {lead.country || "Bilinmiyor"}
                        </span>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <a href={`mailto:${lead.email}`} className="hover:underline truncate max-w-[150px]">
                          {lead.email}
                        </a>
                      </div>
                      {lead.phone ? (
                        <div className="mt-1 flex items-center gap-1.5 text-slate-600">
                          <PhoneCall className="h-3 w-3 text-emerald-600" />
                          <span className="font-mono text-[11px]">{lead.phone}</span>
                        </div>
                      ) : null}
                    </td>

                    {/* Message Preview */}
                    <td className="px-4 py-4 text-xs max-w-[260px]">
                      <p className="text-slate-700 line-clamp-2 leading-relaxed">{lead.message}</p>
                    </td>

                    {/* Product & Packing */}
                    <td className="px-4 py-4 text-xs">
                      <div className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                        <Package className="h-3.5 w-3.5 text-amber-600" />
                        <span>
                          {lead.product === "sunflower"
                            ? "Ayçiçek Yağı"
                            : lead.product === "olive"
                              ? "Zeytinyağı"
                              : "Karma"}
                        </span>
                      </div>
                      {!isContact ? (
                        <div className="mt-0.5 text-slate-500 text-[11px] truncate max-w-[180px]">
                          {lead.quantity || "Miktar belirtilmedi"} · {lead.packaging || "Ambalaj belirtilmedi"}
                        </div>
                      ) : (
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                          <Ship className="h-3 w-3" />
                          <span>Dil: {lead.locale.toUpperCase()}</span>
                        </div>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          lead.status === "new"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : lead.status === "contacted"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : lead.status === "quoted"
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : lead.status === "won"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {lead.status === "new" && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />}
                        {lead.status === "new"
                          ? "Yeni"
                          : lead.status === "contacted"
                            ? "Görüşüldü"
                            : lead.status === "quoted"
                              ? "Teklif Verildi"
                              : lead.status === "won"
                                ? "Kazanıldı"
                                : "Kaybedildi"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {formatDateTimeTr(lead.createdAt)}
                    </td>

                    {/* Action link */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Inbox className="h-10 w-10 mx-auto stroke-1 opacity-50 mb-3" />
            <p className="text-sm font-bold text-slate-700">
              {activeType === "contact"
                ? "Henüz mesaj bulunmuyor"
                : activeType === "rfq"
                  ? "Henüz sipariş talebi bulunmuyor"
                  : contactCount === 0 && rfqCount === 0
                    ? "Henüz mesaj bulunmuyor · Henüz sipariş talebi bulunmuyor"
                    : "Seçilen filtreye uygun kayıt bulunmuyor"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              İletişim veya teklif formundan gönderilen gerçek kayıtlar anında burada görünür.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
