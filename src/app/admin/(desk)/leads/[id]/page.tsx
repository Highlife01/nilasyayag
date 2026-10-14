import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { can } from "@/lib/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateLeadAction } from "@/server/admin-actions"
import { getRepo } from "@/server/runtime"
import { requireUser } from "@/server/session"
import { ArrowLeft, Mail, Phone, Globe2, MessageSquare, FileText, Clock } from "lucide-react"

export const dynamic = "force-dynamic"
export const metadata = { title: "Mesaj & Talep Detayı · Asia Oil", robots: { index: false, follow: false } }

function formatDateTimeTr(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "medium",
      timeStyle: "medium",
      timeZone: "Europe/Istanbul",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("leads")
  if (!user) redirect("/admin")
  const { id } = await params
  const lead = await (await getRepo()).getInquiry(id)
  if (!lead) notFound()
  const editable = can(user.role, "leads.write")
  const isContact = lead.formType === "contact" || lead.collection === "contact_submissions"

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={isContact ? "/admin/leads?type=contact" : "/admin/leads?type=rfq"}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Listeye Dön</span>
        </Link>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isContact ? "bg-amber-100 text-amber-900" : "bg-blue-100 text-blue-900"
          }`}
        >
          {isContact ? <MessageSquare className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
          <span>{isContact ? "İletişim Formu Mesajı" : "Sipariş / Teklif Talebi (RFQ)"}</span>
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-xs font-mono text-slate-400">Kayıt ID: {lead.id}</p>
            <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">{lead.company}</h1>
            <p className="text-sm font-medium text-slate-600 mt-0.5">Gönderen Yetkili: {lead.contactName}</p>
          </div>
          <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{formatDateTimeTr(lead.createdAt)} (UTC+3)</span>
          </div>
        </div>

        <dl className="grid gap-4 text-xs sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <dt className="text-slate-500 font-medium flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> E-posta
            </dt>
            <dd className="mt-1 font-semibold text-slate-900">
              <a href={`mailto:${lead.email}`} className="text-emerald-800 hover:underline">
                {lead.email}
              </a>
            </dd>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <dt className="text-slate-500 font-medium flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> Telefon
            </dt>
            <dd className="mt-1 font-mono font-semibold text-slate-900">{lead.phone || "Belirtilmedi"}</dd>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <dt className="text-slate-500 font-medium flex items-center gap-1">
              <Globe2 className="h-3.5 w-3.5" /> Ülke & Dil
            </dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {lead.country || "Bilinmiyor"} ({lead.locale.toUpperCase()})
            </dd>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <dt className="text-slate-500 font-medium">İlgilenilen Ürün</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {lead.product === "sunflower"
                ? "Ayçiçek Yağı"
                : lead.product === "olive"
                  ? "Zeytinyağı"
                  : "Her İkisi (Ayçiçek & Zeytinyağı)"}
            </dd>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <dt className="text-slate-500 font-medium">Miktar & Sipariş Tipi</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {lead.quantity || "Belirtilmedi"} ({lead.orderType})
            </dd>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <dt className="text-slate-500 font-medium">Ambalaj & Varış Limanı</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {lead.packaging || "—"} / {lead.destinationPort || "—"}
            </dd>
          </div>
        </dl>

        {/* Message Content */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Gönderilen Mesaj İçeriği
          </h2>
          <p className="text-sm leading-relaxed text-slate-900 whitespace-pre-wrap">{lead.message}</p>
        </div>

        <div className="text-xs text-slate-500">
          E-posta Bildirim Durumu: <strong className="font-mono">{lead.notification.status}</strong> — {lead.notification.detail}
        </div>
      </div>

      {editable ? (
        <form action={updateLeadAction} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Durum ve Not Güncelle</h2>
          <input type="hidden" name="id" value={lead.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="status">Durum</Label>
              <select
                id="status"
                name="status"
                defaultValue={lead.status}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
              >
                {["new", "contacted", "quoted", "won", "lost"].map((status) => (
                  <option key={status} value={status}>
                    {status === "new"
                      ? "Yeni (new)"
                      : status === "contacted"
                        ? "Görüşüldü (contacted)"
                        : status === "quoted"
                          ? "Teklif Verildi (quoted)"
                          : status === "won"
                            ? "Kazanıldı (won)"
                            : "Kaybedildi (lost)"}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignee">Sorumlu Temsilci</Label>
              <Input id="assignee" name="assignee" defaultValue={lead.assignee} className="h-11 rounded-xl" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Yeni İşlem Notu Ekle</Label>
            <Textarea id="note" name="note" className="rounded-xl" placeholder="Görüşme veya teklif detaylarını buraya yazabilirsiniz..." />
          </div>
          <Button type="submit" className="h-11 w-fit rounded-xl px-6">
            Değişiklikleri Kaydet
          </Button>
        </form>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">İşlem Geçmişi ve Notlar</h2>
        <ul className="mt-3 space-y-2 text-xs text-slate-600 font-mono">
          {lead.history.map((item) => (
            <li key={`${item.at}-${item.status}`} className="border-b border-slate-100 pb-1.5">
              {formatDateTimeTr(item.at)} · Durum: <strong>{item.status}</strong> · İşlemi Yapan: {item.actor}
            </li>
          ))}
          {lead.notes.map((note) => (
            <li key={note.id} className="border-b border-slate-100 pb-1.5 text-slate-800">
              {formatDateTimeTr(note.at)} · <strong>{note.author}</strong>: {note.body}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
