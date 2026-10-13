"use client"

import { useState } from "react"
import Image from "next/image"
import type { Locale } from "@/lib/i18n/config"
import { Droplet, ArrowUpRight, Check, Sparkles, ShieldCheck } from "lucide-react"
import type { Dict } from "@/content/types"
import { commerceCopy, packagingLabel } from "@/content/commerce-ui"
import { WHATSAPP_URL } from "@/lib/site"

interface Product {
  id: string
  title: Record<Locale, string>
  category: Record<Locale, string>
  badge: Record<Locale, string>
  hsCode: string
  description: Record<Locale, string>
  specs: { label: Record<Locale, string>; val: string }[]
  packages: string[]
  accentColor: string
  lightBg: string
  borderColor: string
  image: string
}

const PRODUCTS: Product[] = [
  {
    id: "sunflower",
    title: {
      tr: "Rafine Ayçiçek Yağı",
      en: "Refined Sunflower Oil",
      ar: "زيت دوار الشمس المكرر",
      ru: "Рафинированное подсолнечное масло",
      de: "Raffiniertes Sonnenblumenöl",
      fr: "Huile de tournesol raffinée",
      es: "Aceite de girasol refinado",
      it: "Olio di girasole raffinato",
    },
    category: {
      tr: "Tohumdan Sofraya Saf Berraklık",
      en: "Crystal Clear Pure Seed Oil",
      ar: "نقاء بلوري فائق الجودة",
      ru: "Кристальная чистота из семян",
      de: "Kristallklares reines Pflanzenöl",
      fr: "Pureté cristalline garantie",
      es: "Claridad cristalina y pureza",
      it: "Purezza cristallina garantita",
    },
    badge: {
      tr: "Global İhracat Lideri",
      en: "Top Global Export",
      ar: "المنتج الأكثر تصديراً",
      ru: "Лидер экспорта",
      de: "Top-Exportschlager",
      fr: "Produit phare à l'export",
      es: "Líder de exportación",
      it: "Leader nelle esportazioni",
    },
    hsCode: "HS 1512.19",
    description: {
      tr: "Anadolu ve Trakya'nın güneşle olgunlaşan seçkin tohumlarından tam entegre rafinasyonla üretilir. Kokusuz, berrak, hafif ve 232°C yüksek duman noktasıyla tüm dünya mutfaklarının vazgeçilmezidir.",
      en: "Produced through fully integrated refining of sun-ripened Anatolian sunflower seeds. Odorless, brilliant golden clarity, and a high smoke point of 232°C for all culinary uses.",
      ar: "يتم إنتاجه عبر تكرير متكامل من بذور عباد الشمس الممتازة في الأناضول. نقي وعديم الرائحة بنقطة دخان مرتفعة تصل إلى 232 درجة مئوية لكافة الاستخدامات.",
      ru: "Производится методом полной рафинации из отборных семян подсолнечника. Без запаха, кристально прозрачное, с точкой дымления 232°C.",
      de: "Vollständig raffiniert aus sonnengereiften Saaten Anatoliens. Geruchsneutral, goldgelb, leicht und mit 232°C hohem Rauchpunkt.",
      fr: "Raffiné à partir de graines de tournesol d'Anatolie. Inodore, limpide, doré avec un point de fumée élevé de 232°C.",
      es: "Producido mediante refinado integral de semillas maduradas al sol. Inodoro, brillante y con un alto punto de humo de 232°C.",
      it: "Prodotto attraverso raffinazione integrale di semi selezionati. Inodore, limpido e dorato con punto di fumo a 232°C.",
    },
    specs: [
      { label: { tr: "Serbest Asitlik (FFA)", en: "Free Fatty Acids (FFA)", ar: "الحموضة الحرة", ru: "Кислотность (FFA)", de: "Freie Fettsäuren", fr: "Acides gras libres", es: "Acidez libre", it: "Acidità libera" }, val: "Max %0.10" },
      { label: { tr: "Peroksit Değeri", en: "Peroxide Value", ar: "رقم البيروكسيد", ru: "Перекисное число", de: "Peroxidzahl", fr: "Indice de peroxyde", es: "Índice de peróxido", it: "Numero di perossidi" }, val: "Max 1.5 meq/kg" },
      { label: { tr: "Duman Noktası", en: "Smoke Point", ar: "نقطة الدخان", ru: "Точка дымления", de: "Rauchpunkt", fr: "Point de fumée", es: "Punto de humo", it: "Punto di fumo" }, val: "232°C" },
      { label: { tr: "Vinterizasyon", en: "Winterized Cold Test", ar: "اختبار التشتية", ru: "Винтеризация (Cold Test)", de: "Winterisierungstest", fr: "Test au froid", es: "Prueba de frío", it: "Test al freddo" }, val: "5.5h berrak" },
    ],
    packages: ["0.5L PET", "1.0L PET", "2.0L PET", "4.5L PET", "5.0L PET", "5L Teneke", "10L Teneke", "18L Teneke", "24.000L Flexitank"],
    accentColor: "from-amber-500 to-yellow-600",
    lightBg: "bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40",
    borderColor: "border-amber-200 hover:border-amber-500",
    image: "/media/hero/master-banner.webp",
  },
  {
    id: "olive",
    title: {
      tr: "Naturel Sızma & Riviera Zeytinyağı",
      en: "Extra Virgin & Riviera Olive Oil",
      ar: "زيت زيتون بكر ممتاز وريفيرّا",
      ru: "Оливковое масло Extra Virgin и Riviera",
      de: "Natives Olivenöl Extra & Riviera",
      fr: "Huile d'olive Vierge Extra & Riviera",
      es: "Aceite de oliva Virgen Extra y Riviera",
      it: "Olio extravergine e Riviera",
    },
    category: {
      tr: "Ege'nin Kadim Hasadı & Soğuk Sıkım",
      en: "Aegean Heritage & Cold-Pressed",
      ar: "محصول بحر إيجة العريق والعصر البارد",
      ru: "Эгейское наследие и холодный отжим",
      de: "Ägäis-Erbe & Kaltgepresst",
      fr: "Terroir d'Égée & Première pression à froid",
      es: "Herencia del Egeo y prensado en frío",
      it: "Tradizione dell'Egeo e spremitura a freddo",
    },
    badge: {
      tr: "Premium Gurme Kalite",
      en: "Gourmet Excellence",
      ar: "جودة ممتازة فاخرة",
      ru: "Премиальное качество",
      de: "Gourmet-Qualität",
      fr: "Qualité gourmet supérieure",
      es: "Calidad gourmet premium",
      it: "Qualità gourmet d'eccellenza",
    },
    hsCode: "HS 1509.20",
    description: {
      tr: "Ege ve Ayvalık yöresinin erken hasat zeytinlerinden 27°C altında soğuk mekanik sıkımla elde edilir. Meyvemsi aroma, zengin polifenol ve düşük asit oranıyla sofraların en değerli tacıdır.",
      en: "Extracted below 27°C through mechanical cold pressing of early harvest Aegean olives. Rich polyphenol content, balanced fruity aroma, and ultra-low acidity.",
      ar: "يُستخلص تحت 27 درجة مئوية بالعصر الميكانيكي البارد لزيتون إيجة المبكر. غني بالبوليفينول ومضادات الأكسدة بنكهة فاكهية متوازنة وحموضة متدنية.",
      ru: "Холодный механический отжим оливок Эгейского региона при температуре до 27°C. Богат полифенолами, обладает мягким фруктовым ароматом и низкой кислотностью.",
      de: "Unter 27°C kaltgepresst aus handverlesenen Oliven der Ägäis. Hoher Polyphenolgehalt, fruchtiges Aroma und extrem niedrige Säure.",
      fr: "Extrait à froid sous 27°C à partir d'olives fraîches égéennes. Teneur élevée en polyphénols et arôme fruité délicat.",
      es: "Prensado en frío por debajo de 27°C con aceitunas seleccionadas del Egeo. Alto contenido en polifenoles y aroma afrutado.",
      it: "Estratto a freddo sotto i 27°C da olive dell'Egeo. Ricco di polifenoli, aroma fruttato ed acidità ridotta.",
    },
    specs: [
      { label: { tr: "Asitlik (Sızma)", en: "Acidity (Extra Virgin)", ar: "الحموضة (البكر الممتاز)", ru: "Кислотность (EV)", de: "Säure (Natives Extra)", fr: "Acidité (Vierge Extra)", es: "Acidez (Virgen Extra)", it: "Acidità (Extra Vergine)" }, val: "Max %0.80" },
      { label: { tr: "Asitlik (Riviera)", en: "Acidity (Riviera)", ar: "الحموضة (ريفيرّا)", ru: "Кислотность (Riviera)", de: "Säure (Riviera)", fr: "Acidité (Riviera)", es: "Acidez (Riviera)", it: "Acidità (Riviera)" }, val: "Max %1.00" },
      { label: { tr: "Sıkım Yöntemi", en: "Extraction Method", ar: "طريقة الاستخلاص", ru: "Метод отжима", de: "Herstellungsverfahren", fr: "Méthode d'extraction", es: "Método de extracción", it: "Metodo di estrazione" }, val: "Soğuk Sıkım (<27°C)" },
      { label: { tr: "Polifenol Değeri", en: "Polyphenols", ar: "نسبة البوليفينول", ru: "Полифенолы", de: "Polyphenolgehalt", fr: "Polyphénols", es: "Polifenoles", it: "Polifenoli" }, val: "> 250 mg/kg" },
    ],
    packages: ["250ml Marasca Cam", "500ml Marasca Cam", "1.0L Cam & PET", "5L Teneke", "200L Varil", "1.000L IBC"],
    accentColor: "from-emerald-600 to-green-700",
    lightBg: "bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40",
    borderColor: "border-emerald-200 hover:border-emerald-500",
    image: "/media/hero/banner-signature.webp",
  },
  {
    id: "corn",
    title: {
      tr: "Rafine Mısırözü Yağı",
      en: "Refined Corn Oil",
      ar: "زيت الذرة المكرر",
      ru: "Рафинированное кукурузное масло",
      de: "Raffiniertes Maiskeimöl",
      fr: "Huile de maïs raffinée",
      es: "Aceite de maíz refinado",
      it: "Olio di mais raffinato",
    },
    category: {
      tr: "Yüksek Isı Dayanımı & Fitosterol Zengini",
      en: "High Heat Stability & Phytosterols",
      ar: "مقاومة فائقة للحرارة وغني بالفيتوستيرول",
      ru: "Высокая термостойкость и фитостеролы",
      de: "Hitzestabil & reich an Phytosterinen",
      fr: "Haute stabilité thermique & phytostérols",
      es: "Alta resistencia térmica y fitosteroles",
      it: "Alta stabilità al calore e fitosteroli",
    },
    badge: {
      tr: "Orta Doğu & Körfez Favorisi",
      en: "Middle East & Gulf Choice",
      ar: "الخيار الأول للشرق الأوسط والخليج",
      ru: "Выбор стран Ближнего Востока",
      de: "Beliebt im Nahen Osten & Golf",
      fr: "Très prisé au Moyen-Orient",
      es: "Favorito en Oriente Medio",
      it: "Molto richiesto in Medio Oriente",
    },
    hsCode: "HS 1515.29",
    description: {
      tr: "Çukurova ve Akdeniz havzasının bereketli mısır tanelerinden elde edilir. Kızartmalarda köpürmeyen, yüksek ısıya olağanüstü dirençli ve hafif aromalı bir mutfak klasiğidir.",
      en: "Extracted from fertile Mediterranean corn kernels. Non-foaming during high-heat deep frying, and naturally loaded with plant phytosterols.",
      ar: "مستخلص من حبوب الذرة الخصبة في حوض المتوسط. مقاوم للرغوة أثناء القلي العميق وغني بالفيتوستيرولات الطبيعية المفيدة للصحة.",
      ru: "Производится из отборных зерен средиземноморской кукурузы. Идеально для фритюра, не пенится при нагревании и богато фитостеролами.",
      de: "Gewonnen aus Maiskörnern des Mittelmeerraums. Schaumfrei beim Frittieren, hoch erhitzbar und mit wertvollen Phytosterinen.",
      fr: "Extrait de maïs méditerranéen. Parfait pour les fritures, ne mousse pas et résiste remarquablement aux hautes températures.",
      es: "Extraído de maíz mediterráneo. No produce espuma en frituras intensas y contiene fitoesteroles naturales.",
      it: "Estratto da mais mediterraneo. Ideale per fritture ad alta temperatura, non schiuma e ricco di fitosteroli.",
    },
    specs: [
      { label: { tr: "Serbest Asitlik (FFA)", en: "Free Fatty Acids (FFA)", ar: "الحموضة الحرة", ru: "Кислотность (FFA)", de: "Freie Fettsäuren", fr: "Acides gras libres", es: "Acidez libre", it: "Acidità libera" }, val: "Max %0.10" },
      { label: { tr: "Duman Noktası", en: "Smoke Point", ar: "نقطة الدخان", ru: "Точка дымления", de: "Rauchpunkt", fr: "Point de fumée", es: "Punto de humo", it: "Punto di fumo" }, val: "235°C" },
      { label: { tr: "Fitosterol Oranı", en: "Phytosterols", ar: "نسبة الفيتوستيرول", ru: "Фитостеролы", de: "Phytosterine", fr: "Phytostérols", es: "Fitoesteroles", it: "Fitosteroli" }, val: "Zengin (>900 mg/100g)" },
      { label: { tr: "Nem & Tortu", en: "Moisture & Impurities", ar: "الرطوبة والشوائب", ru: "Влага и примеси", de: "Feuchtigkeit & Trübung", fr: "Humidité & impuretés", es: "Humedad e impurezas", it: "Umidità e impurità" }, val: "Max %0.05" },
    ],
    packages: ["1.0L PET", "2.0L PET", "5.0L PET", "18L Horeca Teneke", "24.000L Flexitank"],
    accentColor: "from-amber-600 to-orange-600",
    lightBg: "bg-gradient-to-br from-orange-50/80 via-white to-orange-50/40",
    borderColor: "border-orange-200 hover:border-orange-500",
    image: "/media/hero/master-banner.webp",
  },
  {
    id: "industrial",
    title: {
      tr: "Kanola & Endüstriyel Horeca Yağı",
      en: "Canola & Industrial Frying Oil",
      ar: "زيت الكانولا والزيوت الصناعية للقلي",
      ru: "Масло канолы и фритюрные смеси",
      de: "Rapsöl & Industrie-Frittieröl",
      fr: "Huile de colza & Friture industrielle",
      es: "Aceite de canola y fritura industrial",
      it: "Olio di colza e frittura industriale",
    },
    category: {
      tr: "Gıda Sanayi & Toplu Tüketim Çözümleri",
      en: "Food Industry & Catering Solutions",
      ar: "حلول الصناعات الغذائية والمطاعم الكبرى",
      ru: "Решения для пищевой промышленности и HoReCa",
      de: "Lösungen für Lebensmittelindustrie & Großküchen",
      fr: "Solutions pour l'industrie agroalimentaire & CHR",
      es: "Soluciones para industria y hostelería",
      it: "Soluzioni per industria alimentare e catering",
    },
    badge: {
      tr: "Yüksek Dayanıklılık",
      en: "High Durability",
      ar: "ثبات حراري فائق",
      ru: "Сверхстойкость",
      de: "Extrem hitzebeständig",
      fr: "Très haute endurance",
      es: "Máxima durabilidad",
      it: "Massima resistenza",
    },
    hsCode: "HS 1514.19",
    description: {
      tr: "Catering, restoran zincirleri ve konserve/fırıncılık fabrikaları için özel olarak geliştirilmiş yüksek stabiliteye sahip rafine kanola ve bitkisel karışımlar. Uzun kızartma ömrü ve düşük maliyet avantajı.",
      en: "Engineered specifically for catering, restaurant chains, and industrial food factories. Extended frying lifecycles, zero trans-fats, and superior economy of scale.",
      ar: "مُطور خصيصاً لسلاسل المطاعم وشركات التموين ومصانع الأغذية. عمر استخدام طويل في القلي وخالٍ من الدهون المتحولة مع توفير اقتصادي ملموس.",
      ru: "Специально разработано для ресторанных сетей, кейтеринга и пищевых фабрик. Увеличенный ресурс во фритюре, 0% трансжиров.",
      de: "Speziell entwickelt für Restaurantketten, Catering und Lebensmittelwerke. Verlängerte Frittierstandzeit, 0% Transfette und höchste Wirtschaftlichkeit.",
      fr: "Conçue pour les chaînes de restauration et l'agroalimentaire. Durabilité de friture prolongée, zéro acide gras trans.",
      es: "Formulado para cadenas de restauración e industrias de aperitivos. Vida útil prolongada en freidora y sin grasas trans.",
      it: "Formulato per catene di ristorazione e industrie alimentari. Durata prolungata in friggitrice e zero grassi trans.",
    },
    specs: [
      { label: { tr: "Doymamış Yağ Asidi", en: "Monounsaturated Fats", ar: "الدهون الأحادية غير المشبعة", ru: "Мононенасыщенные жиры", de: "Einfach ungesättigte Fette", fr: "Acides gras mono-insaturés", es: "Grasas monoinsaturadas", it: "Grassi monoinsaturi" }, val: "> %60" },
      { label: { tr: "Trans Yağ Oranı", en: "Trans-Fat Content", ar: "الدهون المتحولة", ru: "Трансжиры", de: "Transfettsäuren", fr: "Acides gras trans", es: "Grasas trans", it: "Grassi trans" }, val: "0.00%" },
      { label: { tr: "Kızartma Döngüsü", en: "Frying Lifespan", ar: "دورة استخدام القلي", ru: "Ресурс жарки", de: "Frittierzyklen", fr: "Cycles de friture", es: "Ciclos de fritura", it: "Cicli di frittura" }, val: "2×" },
      { label: { tr: "Duman Noktası", en: "Smoke Point", ar: "نقطة الدخان", ru: "Точка дымления", de: "Rauchpunkt", fr: "Point de fumée", es: "Punto de humo", it: "Punto di fumo" }, val: "238°C" },
    ],
    packages: ["18L Teneke", "200L Varil", "1.000L IBC Tank", "24.000L Flexitank"],
    accentColor: "from-lime-600 to-emerald-700",
    lightBg: "bg-gradient-to-br from-lime-50/80 via-white to-lime-50/40",
    borderColor: "border-lime-200 hover:border-lime-500",
    image: "/media/hero/banner-signature.webp",
  },
]

export function ProductShowcase({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [selectedProduct, setSelectedProduct] = useState<string>("sunflower")
  const current = PRODUCTS.find((p) => p.id === selectedProduct) ?? PRODUCTS[0]
  const copy = commerceCopy(locale)

  return (
    <section id="products-catalog" className="bg-[#fcfbf9] py-24 md:py-32 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-semibold text-emerald-900 border border-emerald-300">
              <Droplet className="size-3.5 text-emerald-700" />
              <span>
                {dict.home.collectionsKicker}
              </span>
            </div>
            <h2 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
              <span className="text-emerald-gradient">{dict.home.collectionsTitle}</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 md:text-base">
            {dict.pages.wholesale.lede}
          </p>
        </div>

        {/* Product Selector Navigation Tabs */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PRODUCTS.map((p) => {
            const isSelected = selectedProduct === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProduct(p.id)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition duration-300 ${
                  isSelected
                    ? "border-emerald-600 bg-white shadow-xl shadow-emerald-900/10 ring-2 ring-emerald-600/20"
                    : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold tracking-wider text-slate-400">
                      {p.hsCode}
                    </span>
                    <span
                      className={`size-2.5 rounded-full transition ${
                        isSelected ? "bg-emerald-600 scale-125" : "bg-slate-300"
                      }`}
                    />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-slate-900 leading-snug">
                    {p.title[locale] || p.title.en}
                  </h3>
                </div>
                <p className="mt-3 text-xs text-slate-500 font-medium">
                  {p.category[locale] || p.category.en}
                </p>
              </button>
            )
          })}
        </div>

        {/* Active Product Detailed Card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="grid lg:grid-cols-12">
            {/* Left Content Column */}
            <div className="p-8 md:p-12 lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <Sparkles className="size-3 text-emerald-600" />
                    {current.badge[locale] || current.badge.en}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {current.hsCode}
                  </span>
                </div>

                <h3 className="font-display mt-5 text-3xl font-extrabold text-slate-900 md:text-5xl">
                  {current.title[locale] || current.title.en}
                </h3>
                <p className="mt-2 text-base font-medium text-emerald-800">
                  {current.category[locale] || current.category.en}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
                  {current.description[locale] || current.description.en}
                </p>

                {/* Laboratory Specs Grid */}
                <div className="mt-8">
                  <h4 className="text-xs font-bold tracking-wider uppercase text-slate-400">
                    {dict.ui.specifications}
                  </h4>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {current.specs.map((s, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-center"
                      >
                        <span className="block text-[11px] font-medium text-slate-500">
                          {s.label[locale] || s.label.en}
                        </span>
                        <span className="mt-1 block font-mono text-sm font-extrabold text-slate-900">
                          {s.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Packaging Formats Available */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold tracking-wider uppercase text-slate-400">
                    {dict.form.packaging}
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {current.packages.map((pkg, pIdx) => (
                      <span
                        key={pIdx}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
                      >
                        <Check className="size-3 text-emerald-600" />
                        {packagingLabel(pkg, locale)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100">
                <a
                  href={`mailto:export@asiaoil.com.tr?subject=${encodeURIComponent(
                    `${dict.ui.quote}: ${current.title[locale]} (${current.hsCode})`
                  )}`}
                  className="btn-shine inline-flex h-12 items-center gap-2.5 rounded-xl bg-emerald-800 px-7 text-sm font-semibold text-white transition hover:bg-emerald-900 shadow-md shadow-emerald-950/20"
                >
                  <span>{dict.ui.quote}</span>
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                </a>

                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent(`${dict.ui.quote}: ${current.title[locale]}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50/70 px-6 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
                >
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>WhatsApp · {dict.nav.contact}</span>
                </a>
              </div>
            </div>

            {/* Right Visual Image Banner Column */}
            <div className="relative min-h-[320px] bg-slate-900 lg:col-span-5">
              <Image
                src={current.image}
                alt={current.title[locale]}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-black/50 p-5 text-white backdrop-blur-md">
                <div className="flex items-center gap-2 text-amber-400">
                  <ShieldCheck className="size-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {dict.pages.quality.kicker}
                  </span>
                </div>
                <p className="mt-2 text-xs text-white/80 leading-relaxed">
                  {copy.verification}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
