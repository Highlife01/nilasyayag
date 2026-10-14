import { Loader2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      <h2 className="mt-4 font-display text-xl font-bold text-slate-900">Veriler Sunucudan Yükleniyor...</h2>
      <p className="mt-1 text-xs text-slate-500">
        Gerçek zamanlı veritabanı kayıtları sorgulanıyor, lütfen bekleyiniz.
      </p>
    </div>
  )
}
