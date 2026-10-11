import Link from "next/link"
import { redirect } from "next/navigation"
import type { InquiryStatus } from "@/lib/domain"
import { getRepo } from "@/server/runtime"
import { requireUser } from "@/server/session"
import {
  Inbox,
  Filter,
  PhoneCall,
  Mail,
  Ship,
  Package,
} from "lucide-react"

export const metadata = {
  title: "Talepler & CRM · Asia Oil Control Center",
  robots: { index: false, follow: false },
}

const STATUS_FILTERS: { key: string; label: string; status?: InquiryStatus; color: string }[] = [
  { key: "all", label: "Tüm Talepler", color: "bg-slate-100 text-slate-800" },
  { key: "new", label: "Yeni", status: "new", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { key: "contacted", label: "İletişime Geçildi", status: "contacted", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { key: "quoted", label: "Teklif Verildi", status: "quoted", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { key: "won", label: "Kazanıldı", status: "won", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { key: "lost", label: "Kaybedildi", status: "lost", color: "bg-rose-100 text-rose-800 border-rose-300" },
]

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (!(await requireUser("leads"))) redirect("/admin")
  const query = await searchParams
  const activeStatus = query.status as InquiryStatus | undefined

  const allLeads = await (await getRepo()).listInquiries({ limit: 500 })
  const filteredLeads = activeStatus
    ? allLeads.filter((l) => l.status === activeStatus)
    : allLeads

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a67c3d]">
            <Inbox className="h-4 w-4" />
            <span>B2B Teklif & İletişim CRM</span>
          </div>
          <h1 className="font-display mt-1 text-3xl font-bold text-slate-900">
            Gelen Talepler & Teklifler
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Web sitesi RFQ ve iletişim formlarından anında Firestore veritabanına kaydedilen talepler
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
            Toplam: <strong className="text-slate-900 font-mono">{allLeads.length}</strong>
          </span>
          <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
            Yeni: <strong className="font-mono">{allLeads.filter((l) => l.status === "new").length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <Filter className="h-4 w-4 text-slate-400 mr-1" />
        {STATUS_FILTERS.map((f) => {
          const isSelected = (!activeStatus && f.key === "all") || activeStatus === f.status
          const count = f.status
            ? allLeads.filter((l) => l.status === f.status).length
            : allLeads.length
          return (
            <Link
              key={f.key}
              href={f.status ? `/admin/leads?status=${f.status}` : "/admin/leads"}
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

      {/* Leads Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Firma & Yetkili</th>
                <th className="px-4 py-3.5">İletişim</th>
                <th className="px-4 py-3.5">Ürün & Ambalaj</th>
                <th className="px-4 py-3.5">Miktar & Liman</th>
                <th className="px-4 py-3.5">Durum</th>
                <th className="px-4 py-3.5">Tarih</th>
                <th className="px-5 py-3.5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => {
                const isNew = lead.status === "new"
                return (
                  <tr key={lead.id} className={`transition hover:bg-slate-50/80 ${isNew ? "bg-amber-50/30" : ""}`}>
                    {/* Company & Country */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">
                        <Link href={`/admin/leads/${lead.id}`} className="hover:text-[#a67c3d] transition">
                          {lead.company}
                        </Link>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{lead.contactName}</span>
                        <span>·</span>
                        <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                          {lead.country || "Global"}
                        </span>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <a href={`mailto:${lead.email}`} className="hover:underline truncate max-w-[140px]">
                          {lead.email}
                        </a>
                      </div>
                      {lead.phone ? (
                        <div className="mt-1 flex items-center gap-1.5 text-slate-600">
                          <PhoneCall className="h-3 w-3 text-emerald-600" />
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-mono text-[11px]"
                          >
                            {lead.phone}
                          </a>
                        </div>
                      ) : null}
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
                            : "Karma Talep"}
                        </span>
                      </div>
                      <div className="mt-0.5 text-slate-500 text-[11px] truncate max-w-[180px]">
                        {lead.packaging || "Ambalaj belirtilmedi"}
                      </div>
                    </td>

                    {/* Quantity & Destination */}
                    <td className="px-4 py-4 text-xs">
                      <div className="font-semibold text-slate-800">
                        {lead.quantity || "Miktar konuşulacak"}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                        <Ship className="h-3 w-3 text-blue-500" />
                        <span>{lead.destinationPort || "FOB Mersin"}</span>
                      </div>
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
                    <td className="px-4 py-4 text-xs font-mono text-slate-500">
                      {lead.createdAt.slice(0, 10)}
                    </td>

                    {/* Action link */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
                      >
                        İncele
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
            <p className="text-sm font-medium text-slate-600">Bu filtreye uygun talep bulunamadı.</p>
            <p className="text-xs text-slate-400 mt-1">Farklı bir durum sekmesi seçebilir veya tüm talepleri listeleyebilirsiniz.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
