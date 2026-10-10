import { notFound, redirect } from "next/navigation"
import { can } from "@/lib/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateLeadAction } from "@/server/admin-actions"
import { getRepo } from "@/server/runtime"
import { requireUser } from "@/server/session"

export const metadata = { robots: { index: false, follow: false } }

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("leads")
  if (!user) redirect("/admin")
  const { id } = await params
  const lead = await (await getRepo()).getInquiry(id)
  if (!lead) notFound()
  const editable = can(user.role, "leads.write")
  return (
    <div className="max-w-3xl">
      <p className="text-sm text-[#6d6248]">{lead.collection}</p>
      <h1 className="font-display text-5xl">{lead.company}</h1>
      <dl className="mt-6 grid gap-2 text-sm md:grid-cols-2">
        <div>Yetkili: {lead.contactName}</div>
        <div>E-posta: {lead.email}</div>
        <div>Telefon: {lead.phone}</div>
        <div>Ülke: {lead.country}</div>
        <div>Varış: {lead.destinationPort || "—"}</div>
        <div>Ürün: {lead.product}</div>
        <div>Miktar: {lead.quantity || "—"}</div>
        <div>Ambalaj: {lead.packaging || "—"}</div>
        <div className="md:col-span-2">Bildirim: {lead.notification.status} — {lead.notification.detail}</div>
      </dl>
      <p className="mt-6 leading-relaxed">{lead.message}</p>
      {editable ? (
        <form action={updateLeadAction} className="mt-8 grid gap-4 border border-[#e2dac8] bg-[#fbf9f4] p-5">
          <input type="hidden" name="id" value={lead.id} />
          <div className="grid gap-2">
            <Label htmlFor="status">Durum</Label>
            <select id="status" name="status" defaultValue={lead.status} className="h-11 border border-input bg-white px-3">
              {["new", "contacted", "quoted", "won", "lost"].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignee">Sorumlu</Label>
            <Input id="assignee" name="assignee" defaultValue={lead.assignee} className="h-11! rounded-none" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Not</Label>
            <Textarea id="note" name="note" className="rounded-none" />
          </div>
          <Button type="submit" className="h-11! w-fit rounded-none">Kaydet</Button>
        </form>
      ) : null}
      <h2 className="mt-8 text-lg">Geçmiş</h2>
      <ul className="mt-2 text-sm">
        {lead.history.map((item) => (
          <li key={`${item.at}-${item.status}`}>{item.at} · {item.status} · {item.actor}</li>
        ))}
        {lead.notes.map((note) => (
          <li key={note.id}>{note.at} · {note.author}: {note.body}</li>
        ))}
      </ul>
    </div>
  )
}
