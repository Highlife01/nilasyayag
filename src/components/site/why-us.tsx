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
    <section className="section bg-white border-y-2 border-slate-300">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="chip mb-3">B2B Excellence</p>
          <h2 className="h2-title text-slate-950">
            {isTr ? "Neden Küresel Tedarik Ekipleri Asia Oil'i Seçiyor?" : "Why sourcing teams choose ASIA OIL"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-700 font-medium">
            {isTr
              ? "Tohum kırmadan ve ilk sıkımdan liman mühürleme ve konteyner yüklemesine kadar tek, akredite ve hesap verebilir tedarik ortağınız."
              : "A single, accountable supply partner from seed crushing and cold extraction to container seal loading and maritime port dispatch."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.num}
              className="rounded-3xl border-2 border-slate-300 bg-white p-7 shadow-md hover:shadow-xl hover:border-emerald-600 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span
                  className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 text-base font-black text-white shadow-md shadow-emerald-800/30"
                  aria-hidden="true"
                >
                  {item.num}
                </span>
                <h3 className="mt-5 font-display text-lg font-black text-slate-950 leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-700 font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
