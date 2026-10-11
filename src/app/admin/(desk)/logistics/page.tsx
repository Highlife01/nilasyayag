import { requireUser } from "@/server/session"
import { redirect } from "next/navigation"
import { Ship, Anchor, Box } from "lucide-react"

export const metadata = {
  title: "Lojistik & Konteyner Radarı · Asia Oil Control Center",
  robots: { index: false, follow: false },
}

export default async function LogisticsAdminPage() {
  if (!(await requireUser("analytics"))) redirect("/admin")

  const routes = [
    {
      origin: "Mersin Limanı (MIP)",
      destination: "Jebel Ali / Dubai (BAE)",
      transit: "14 - 18 Gün",
      mode: "40ft HC & 20ft Flexitank",
      frequency: "Haftalık 3 Sefer",
      carrier: "MSC / Maersk / CMA CGM",
      status: "Düzenli Sefer",
    },
    {
      origin: "Mersin Limanı (MIP)",
      destination: "Rotterdam / Hamburg (Avrupa)",
      transit: "12 - 16 Gün",
      mode: "20ft & 40ft Paletli Konteyner",
      frequency: "Haftalık 4 Sefer",
      carrier: "Hapag-Lloyd / ONE / MSC",
      status: "Düzenli Sefer",
    },
    {
      origin: "İzmir Alsancak Limanı",
      destination: "New York / Newark (ABD)",
      transit: "18 - 22 Gün",
      mode: "40ft HC (Sızma Zeytinyağı)",
      frequency: "Haftalık 2 Sefer",
      carrier: "ZIM / MSC / Maersk",
      status: "Düzenli Sefer",
    },
    {
      origin: "Mersin Limanı (MIP)",
      destination: "Cidde / King Abdullah (Suudi Arabistan)",
      transit: "10 - 14 Gün",
      mode: "40ft HC (5L & 18L Teneke)",
      frequency: "Haftalık 3 Sefer",
      carrier: "Arkas / Tarros / MSC",
      status: "Düzenli Sefer",
    },
    {
      origin: "Mersin Limanı (MIP)",
      destination: "Port Klang / Singapur (Güneydoğu Asya)",
      transit: "24 - 28 Gün",
      mode: "20ft Flexitank (Dökme Ayçiçek)",
      frequency: "Haftalık 2 Sefer",
      carrier: "Evergreen / COSCO / CMA CGM",
      status: "Düzenli Sefer",
    },
  ]

  const containerSpecs = [
    {
      name: "20ft Standart Konteyner",
      cargo: "Flexitank veya Ağır Varilli Yağ",
      capacity: "21.500 - 24.000 kg",
      volume: "Tek 22.000 Litre Flexitank veya 80 Varil (200L)",
      feature: "Dökme ham/rafine ayçiçek yağı taşımacılığı için idealdir.",
    },
    {
      name: "40ft High Cube (HC)",
      cargo: "Paketli Şişe ve Teneke Yağlar",
      capacity: "25.000 - 26.500 kg (Ağırlık limitine göre)",
      volume: "24 - 25 Standart İhracat Paleti",
      feature: "1L, 2L, 5L PET ve 5L, 18L Teneke sevkiyatlarında maksimum hacim.",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a67c3d]">
          <Ship className="h-4 w-4" />
          <span>Denizyolu & Liman Sevkiyat Takibi</span>
        </div>
        <h1 className="font-display mt-1 text-3xl font-bold text-slate-900">
          Lojistik & Konteyner Radarı
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Mersin ve İzmir çıkışlı küresel konteyner hatları, transit süreleri ve Incoterms seçenekleri
        </p>
      </div>

      {/* Main Ports Banner */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Anchor className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Mersin Uluslararası Limanı (MIP)</h2>
              <p className="text-xs text-slate-500">Ana Hububat & Bitkisel Sıvı Yağ İhracat Kapısı</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600 leading-relaxed">
            Türkiye&apos;nin Doğu Akdeniz&apos;deki en büyük konteyner limanı. Orta Doğu, Kızıldeniz, Akdeniz ve Uzak Doğu ana hat gemilerinin doğrudan yanaştığı, flexitank dolum ve fümigasyon olanaklarına sahip stratejik merkez.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono text-slate-600">
            <span className="bg-slate-100 px-2 py-0.5 rounded">FOB Mersin</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded">CIF Jebel Ali</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded">CFR Rotterdam</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Anchor className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">İzmir Alsancak & Aliağa Limanları</h2>
              <p className="text-xs text-slate-500">Ege Zeytinyağı & Akdeniz İhracat Terminali</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600 leading-relaxed">
            Ege Bölgesi zeytin havzalarına en yakın liman ağı. Özellikle Avrupa, Kuzey Amerika ve okyanus aşırı pazarlara natürel sızma zeytinyağı şişeli ve tenekeli konteyner sevkiyatlarının yapıldığı çıkış noktası.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono text-slate-600">
            <span className="bg-slate-100 px-2 py-0.5 rounded">FOB İzmir</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded">CIF New York</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded">CFR Genoa</span>
          </div>
        </div>
      </div>

      {/* Global Shipping Routes Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Küresel Sevkiyat Rotaları ve Transit Süreleri</h2>
          <p className="text-xs text-slate-500 mt-0.5">Asia Oil ihracat operasyonlarında en sık kullanılan hatlar</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Çıkış Limanı</th>
                <th className="px-4 py-3">Varış Limanı & Bölge</th>
                <th className="px-4 py-3">Tahmini Transit</th>
                <th className="px-4 py-3">Taşıma Modu</th>
                <th className="px-4 py-3">Sefer Sıklığı</th>
                <th className="px-5 py-3 text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {routes.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{r.origin}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">{r.destination}</td>
                  <td className="px-4 py-3.5 font-mono text-emerald-700 font-bold">{r.transit}</td>
                  <td className="px-4 py-3.5 text-slate-600">{r.mode}</td>
                  <td className="px-4 py-3.5 text-slate-500">{r.frequency}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Container Specifications */}
      <div className="grid gap-5 md:grid-cols-2">
        {containerSpecs.map((c) => (
          <div key={c.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Box className="h-4 w-4 text-[#a67c3d]" />
              <span>{c.name}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{c.cargo}</p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Maksimum Yük Ağırlığı:</span>
                <span className="font-bold text-slate-800 font-mono">{c.capacity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Kapasite / Palet:</span>
                <span className="font-bold text-slate-800">{c.volume}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl leading-relaxed">
              {c.feature}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
