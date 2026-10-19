import type { Locale } from "@/lib/i18n/config"

export function WhyUsSection({ locale }: { locale: Locale }) {
  const isTr = locale === "tr"

  const features = [
    {
      num: "1",
      title: isTr ? "Spesifikasyona Dayalı Rafinasyon" : "Specification-Driven Refining",
      desc: isTr
        ? "Serbest asitlik (FFA < %0.10), peroksit değeri, berraklık ve duman noktası her parti üründe akredite laboratuvar analizleriyle doğrulanır."
        : "Free fatty acids (FFA < 0.10%), peroxide value, clarity, and smoke point strictly verified per batch with certified COA analysis.",
    },
    {
      num: "2",
      title: isTr ? "İhracata Hazır Liman Lojistiği" : "Export-Ready Maritime Logistics",
      desc: isTr
        ? "Mersin Uluslararası Limanı (MIP) ve İzmir Limanı koridoru. 20'/40' FCL, flexitank veya dökme gemi; FOB, CFR ve CIF teslimat seçenekleri."
        : "Direct corridor to Mersin International Port (MIP) & Izmir Seaport. 20'/40' FCL, 22,000L flexitank, or bulk vessel with FOB, CFR, CIF Incoterms.",
    },
    {
      num: "3",
      title: isTr ? "Özel Marka (Private Label) & OEM" : "Private Label & Custom OEM",
      desc: isTr
        ? "Kendi markanız, özel teneke/şişe kalıbınız ve çok dilli yasal etiket tasarımınız. 0.5L'den 18L'ye kadar uluslararası perakende ve toptan standartları."
        : "Your brand, custom tin lithography or PET design, with certified multilingual labeling and barcode cartons built to your artwork.",
    },
    {
      num: "4",
      title: isTr ? "2 Saatte Hızlı Proforma Yanıtı" : "Responsive B2B Quoting",
      desc: isTr
        ? "Resmi proforma fatura, teknik spesifikasyon föyü ve SGS / Bureau Veritas analiz dosyası aynı gün içinde ihracat masamızca iletilir."
        : "Official proforma invoice, technical specification sheet, and container stowage plan returned within hours by our dedicated export desk.",
    },
  ]

  return (
    <section className="section relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-white border-y border-slate-200">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="container-x relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="chip mb-3">B2B Excellence</p>
          <h2 className="h2-title text-slate-950">
            {isTr ? "Neden Küresel Tedarik Ekipleri Asia Oil'i Seçiyor?" : "Why Global Sourcing Teams Choose ASIA OIL"}
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-700 font-medium">
            {isTr
              ? "Tohum kırmadan ve ilk sıkımdan liman mühürleme ve konteyner yüklemesine kadar tek, akredite ve hesap verebilir tedarik ortağınız."
              : "A single, accountable supply partner from seed crushing and cold extraction to container seal loading and maritime port dispatch."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.num}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-card hover:shadow-card-hover hover:border-emerald-600/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-800 via-teal-600 to-amber-500 opacity-85 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 font-mono text-sm font-black text-amber-300 shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform"
                    aria-hidden="true"
                  >
                    0{item.num}
                  </span>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    {isTr ? "Garantili Standart" : "Verified Standard"}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-black text-slate-950 leading-snug group-hover:text-emerald-900 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 font-medium">
                  {item.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-bold text-emerald-800">
                <span>✓ ISO 22000 &amp; SGS Verified</span>
                <span className="font-mono text-amber-600">COA • MIP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
