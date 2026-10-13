import Image from "next/image"
import { requireUser } from "@/server/session"
import { redirect } from "next/navigation"
import { Package, CheckCircle2, Sparkles, Layers } from "lucide-react"

export const metadata = {
  title: "Ürünler & Ambalaj Kataloğu · Asia Oil Control Center",
  robots: { index: false, follow: false },
}

export default async function ProductsAdminPage() {
  if (!(await requireUser("analytics"))) redirect("/admin")

  const products = [
    {
      id: "sunflower-oil",
      name: "Rafine Ayçiçek Yağı (Sunflower Oil)",
      category: "Bitkisel Sıvı Yağlar",
      specs: [
        { label: "Serbest Yağ Asitliği (FFA)", value: "Maks. %0.10 (Oleik asit cinsinden)" },
        { label: "Peroksit Değeri", value: "Maks. 1.0 meq O2/kg" },
        { label: "Nem ve Uçucu Madde", value: "Maks. %0.05" },
        { label: "Dumanlanma Noktası", value: "Min. 230°C" },
        { label: "Renk (Lovibond)", value: "Maks. 1.5 Kırmızı / 15 Sarı" },
      ],
      packagings: [
        { size: "500 ml & 1 Litre", type: "PET Şişe", carton: "12 veya 15 adet/koli", pallet: "90 koli/palet" },
        { size: "2 Litre & 5 Litre", type: "PET Köşeli Kulp", carton: "4 adet/koli", pallet: "44 koli/palet" },
        { size: "18 Litre", type: "Gıdaya Uygun Teneke", carton: "Tekli Shrink", pallet: "33 teneke/palet" },
        { size: "22.000 Litre", type: "Flexitank / Dökme", carton: "20ft Konteyner İçine", pallet: "Tek parça dökme" },
      ],
      image: "/media/hero/1.webp",
      status: "Zirve Sezon & Aktif Sevkiyat",
    },
    {
      id: "olive-oil",
      name: "Natürel Sızma Zeytinyağı (Extra Virgin Olive Oil)",
      category: "Zeytinyağı Grubu",
      specs: [
        { label: "Serbest Asitlik (Oleik Asit)", value: "Maks. %0.80 (Tipik: %0.3 - %0.5)" },
        { label: "Peroksit Sayısı", value: "Maks. 20 meq O2/kg" },
        { label: "K232 Spektrofotometrik Değer", value: "Maks. 2.50" },
        { label: "K270 Spektrofotometrik Değer", value: "Maks. 0.22" },
        { label: "Delta K", value: "Maks. 0.01" },
      ],
      packagings: [
        { size: "250 ml & 500 ml", type: "Koyu Renk Marasca Cam", carton: "12 adet/koli", pallet: "96 koli/palet" },
        { size: "750 ml & 1 Litre", type: "Dorica / Marasca Cam", carton: "12 adet/koli", pallet: "60 koli/palet" },
        { size: "3 Litre & 5 Litre", type: "Litolojili Teneke", carton: "4 adet/koli", pallet: "40 koli/palet" },
        { size: "200 Litre & IBC", type: "Gıda Varili / 1000L IBC", carton: "Endüstriyel", pallet: "4 varil/palet" },
      ],
      image: "/media/hero/3.webp",
      status: "Yeni Hasat & Soğuk Sıkım",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a67c3d]">
          <Package className="h-4 w-4" />
          <span>Katalog & Teknik Standartlar</span>
        </div>
        <h1 className="font-display mt-1 text-3xl font-bold text-slate-900">
          Ürün ve Ambalaj Yönetimi
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Uluslararası B2B tekliflerde ve teknik şartnamelerde yer alan doğrulanmış ürün ve ambalaj matrisi
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {products.map((prod) => (
          <div key={prod.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {/* Visual Header */}
            <div className="relative h-56 bg-slate-900">
              <Image
                src={prod.image}
                alt={prod.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30 backdrop-blur">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{prod.status}</span>
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-1.5">{prod.name}</h2>
                <p className="text-xs text-slate-300">{prod.category}</p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              {/* Specs */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#a67c3d]" />
                  <span>Uluslararası Laboratuvar Kalite Spekleri</span>
                </h3>
                <div className="grid gap-2 text-xs">
                  {prod.specs.map((s) => (
                    <div key={s.label} className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-600">{s.label}</span>
                      <span className="font-semibold text-slate-900 font-mono">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packaging Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#a67c3d]" />
                  <span>İhracat Ambalaj & Paletleme Seçenekleri</span>
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                      <tr>
                        <th className="px-3 py-2">Hacim</th>
                        <th className="px-3 py-2">Tip</th>
                        <th className="px-3 py-2">Koli / Adet</th>
                        <th className="px-3 py-2">Palet Bilgisi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {prod.packagings.map((pkg) => (
                        <tr key={pkg.size}>
                          <td className="px-3 py-2.5 font-bold text-slate-900">{pkg.size}</td>
                          <td className="px-3 py-2.5 text-slate-600">{pkg.type}</td>
                          <td className="px-3 py-2.5 text-slate-600">{pkg.carton}</td>
                          <td className="px-3 py-2.5 font-mono text-[11px] text-emerald-700 font-semibold">
                            {pkg.pallet}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
