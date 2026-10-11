import { requireUser } from "@/server/session"
import { redirect } from "next/navigation"
import { getRepo } from "@/server/runtime"
import { SUPERADMIN_EMAIL } from "@/lib/site"
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Building,
  Server,
  KeyRound,
  CheckCircle2,
} from "lucide-react"

export const metadata = {
  title: "Ayarlar & Güvenlik · Asia Oil Control Center",
  robots: { index: false, follow: false },
}

export default async function SettingsAdminPage() {
  const user = await requireUser("settings")
  if (!user) redirect("/admin")

  const repo = await getRepo()
  const settings = await repo.getSettings()

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a67c3d]">
          <SettingsIcon className="h-4 w-4" />
          <span>Sistem, Güvenlik & Kurumsal Kimlik</span>
        </div>
        <h1 className="font-display mt-1 text-3xl font-bold text-slate-900">
          Ayarlar ve Güvenlik Denetimi
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Süper yönetici yetkileri, sıfır depolama güvenlik mimarisi ve kurumsal firma bilgileri
        </p>
      </div>

      {/* Security Architecture Audit Card */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-emerald-950">
              Sıfır İstemci Depolaması (Zero LocalStorage Policy)
            </h2>
            <p className="text-xs text-emerald-800">
              Uluslararası B2B Güvenlik ve Kurumsal Veri Bütünlüğü Kuralı
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-xl border border-emerald-200/80 bg-white p-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>LocalStorage</span>
            </div>
            <p className="text-slate-500 mt-1 text-[11px]">Kullanım: 0 Byte (Devre Dışı)</p>
          </div>

          <div className="rounded-xl border border-emerald-200/80 bg-white p-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>SessionStorage</span>
            </div>
            <p className="text-slate-500 mt-1 text-[11px]">Kullanım: 0 Byte (Devre Dışı)</p>
          </div>

          <div className="rounded-xl border border-emerald-200/80 bg-white p-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Oturum Çerezi</span>
            </div>
            <p className="text-slate-500 mt-1 text-[11px]">HttpOnly, Secure, SameSite=Lax</p>
          </div>
        </div>
      </div>

      {/* Superadmin Identity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-base text-slate-900">
          <KeyRound className="h-5 w-5 text-[#a67c3d]" />
          <span>Süper Yönetici Hesabı</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-slate-500 block font-medium">Yetkili E-posta:</span>
            <span className="font-mono text-slate-900 font-bold text-sm mt-0.5 block">{SUPERADMIN_EMAIL}</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-slate-500 block font-medium">Yetki Düzeyi:</span>
            <span className="text-emerald-700 font-bold text-sm mt-0.5 block">Superadmin (Tam Erişim)</span>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Güvenlik Hatırlatması:</strong> Yönetici parolası kaynak kodunda veya Git deposunda tutulmaz. Parola güncellemeleri doğrudan sunucu ortam değişkenleri (`NILASYA_ADMIN_PASSWORD`) veya Firebase Authentication üzerinden yönetilir.
        </div>
      </div>

      {/* Cloud & Firebase Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-base text-slate-900">
          <Server className="h-5 w-5 text-blue-600" />
          <span>Firebase & Bulut Altyapısı</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-slate-500">Google Cloud / Firebase Projesi:</span>
            <span className="font-mono text-slate-900 font-bold block mt-0.5">ajansonline</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-slate-500">Firebase Hosting Sitesi:</span>
            <span className="font-mono text-slate-900 font-bold block mt-0.5">nilasyayag</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-slate-500">Veritabanı Koleksiyonları:</span>
            <span className="font-mono text-slate-900 font-bold block mt-0.5">rfq_requests, contact_submissions</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-slate-500">Bildirim Hedefi:</span>
            <span className="font-mono text-slate-900 font-bold block mt-0.5">{settings.notifyEmail || SUPERADMIN_EMAIL}</span>
          </div>
        </div>
      </div>

      {/* Company Legal Profile */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-base text-slate-900">
          <Building className="h-5 w-5 text-slate-700" />
          <span>Firma Resmî Bilgileri</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div>
            <span className="text-slate-500 block">Resmî Marka / Unvan:</span>
            <span className="font-bold text-slate-900 block mt-0.5">{settings.legalName || "Asia Oil"}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Menşe & Merkez:</span>
            <span className="font-bold text-slate-900 block mt-0.5">Türkiye</span>
          </div>

          <div>
            <span className="text-slate-500 block">Genel İletişim E-posta:</span>
            <span className="font-bold text-slate-900 block mt-0.5">{settings.publicEmail || SUPERADMIN_EMAIL}</span>
          </div>

          <div>
            <span className="text-slate-500 block">İhracat Liman Üssü:</span>
            <span className="font-bold text-slate-900 block mt-0.5">Mersin Uluslararası Limanı (MIP) & İzmir Limanı</span>
          </div>
        </div>
      </div>
    </div>
  )
}
