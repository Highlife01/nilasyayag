import type { Locale } from "@/lib/i18n/config"
import { Globe2, Anchor, Droplets, Package, ShieldCheck, Award } from "lucide-react"

interface StatItem {
  value: string
  suffix?: string
  label: Record<Locale, string>
  sub: Record<Locale, string>
  icon: typeof Globe2
}

const STATS: StatItem[] = [
  {
    value: "60",
    suffix: "+",
    label: {
      tr: "İhracat Yapılan Ülke",
      en: "Export Destinations",
      ar: "دولة تصدير حول العالم",
      ru: "Стран экспорта по всему миру",
      de: "Exportländer weltweit",
      fr: "Pays d'exportation",
      es: "Países de exportación",
      it: "Paesi di esportazione",
    },
    sub: {
      tr: "6 Kıtada Güçlü B2B Dağıtım",
      en: "Strong Distribution across 6 Continents",
      ar: "شبكة توزيع قوية عبر 6 قارات",
      ru: "Сеть поставок на 6 континентах",
      de: "B2B-Netzwerk auf 6 Kontinenten",
      fr: "Réseau solide sur 6 continents",
      es: "Distribución en 6 continentes",
      it: "Distribuzione su 6 continenti",
    },
    icon: Globe2,
  },
  {
    value: "2",
    suffix: " Ports",
    label: {
      tr: "Stratejik Liman Terminali",
      en: "Strategic Seaport Terminals",
      ar: "محطات موانئ استراتيجية",
      ru: "Морских терминала отгрузки",
      de: "Strategische Seehafen-Terminals",
      fr: "Terminaux portuaires stratégiques",
      es: "Terminales portuarias estratégicas",
      it: "Terminal portuali strategici",
    },
    sub: {
      tr: "Mersin MIP & İzmir Liman Çıkışlı",
      en: "Mersin MIP & Izmir Seaport Dispatches",
      ar: "شحن مباشر من مينائي مرسين وإزمير",
      ru: "Прямые рейсы из портов Мерсин и Измир",
      de: "Direktexport via Mersin MIP & Izmir",
      fr: "Départs Mersin MIP & Port d'Izmir",
      es: "Salidas directas Mersin MIP e Izmir",
      it: "Spedizioni Mersin MIP e Smirne",
    },
    icon: Anchor,
  },
  {
    value: "100",
    suffix: "%",
    label: {
      tr: "Doğal & Entegre Rafinasyon",
      en: "Pure Natural & Refined Edible Oil",
      ar: "زيوت نباتية طبيعية ومكررة 100%",
      ru: "Натуральные рафинированные масла",
      de: "100% Natürliche & Raffinierte Speiseöle",
      fr: "Huiles pures et raffinées",
      es: "Aceites comestibles 100% puros",
      it: "Oli vegetali puri e raffinati",
    },
    sub: {
      tr: "Düşük Asitlik, Yüksek Duman Noktası",
      en: "Low Acidity & High Smoke Point",
      ar: "حموضة منخفضة ونقطة دخان عالية",
      ru: "Низкая кислотность, высокая точка дымления",
      de: "Geringe Säure, hoher Rauchpunkt",
      fr: "Faible acidité, point de fumée élevé",
      es: "Baja acidez y alto punto de humo",
      it: "Bassa acidità, alto punto di fumo",
    },
    icon: Droplets,
  },
  {
    value: "24.000",
    suffix: " L",
    label: {
      tr: "Flexitank & Dökme Sevkiyat",
      en: "Flexitank & Bulk Logistics",
      ar: "شحن خزانات فليكسيتانك وسائبة",
      ru: "Флекситанки и наливная логистика",
      de: "Flexitank & Schüttgut-Logistik",
      fr: "Logistique Flexitank & Vrac",
      es: "Logística Flexitank y a granel",
      it: "Logistica Flexitank e sfuso",
    },
    sub: {
      tr: "0.5L PET'ten 24.000L'e Tam Yelpaze",
      en: "Full Matrix: 0.5L PET to 24,000L Bulk",
      ar: "من عبوات 0.5 لتر حتى 24,000 لتر",
      ru: "От 0.5 л ПЭТ до 24 000 л наливом",
      de: "Von 0,5L PET bis 24.000L Tank",
      fr: "Du format 0.5L PET au vrac 24.000L",
      es: "Desde 0.5L PET hasta 24.000L",
      it: "Da 0,5L PET a 24.000L sfuso",
    },
    icon: Package,
  },
  {
    value: "ISO",
    suffix: " Cert",
    label: {
      tr: "Uluslararası Akreditasyon",
      en: "Global Quality Accreditations",
      ar: "شهادات جودة واعتمادات دولية",
      ru: "Международные сертификаты качества",
      de: "Internationale Akkreditierungen",
      fr: "Accréditations internationales",
      es: "Acreditaciones internacionales",
      it: "Accreditamenti internazionali",
    },
    sub: {
      tr: "ISO 22000, 9001, Helal & Kosher",
      en: "ISO 22000, 9001, Halal & Kosher",
      ar: "ISO 22000 و 9001 وحلال وكوشير",
      ru: "ISO 22000, 9001, Халяль и Кошер",
      de: "ISO 22000, 9001, Halal & Koscher",
      fr: "ISO 22000, 9001, Halal & Casher",
      es: "ISO 22000, 9001, Halal y Kosher",
      it: "ISO 22000, 9001, Halal e Kosher",
    },
    icon: ShieldCheck,
  },
]

export function StatsStrip({ locale }: { locale: Locale }) {
  return (
    <section className="relative z-10 -mt-8 border-y border-gold/30 bg-[#0e160a]/95 py-8 text-[#f7f1e3] backdrop-blur-xl shadow-2xl">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                className="group relative flex flex-col justify-between border-l border-gold/20 pl-5 transition duration-500 hover:border-gold hover:translate-y-[-2px] rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-5"
              >
                <div className="flex items-center justify-between text-gold/70 transition duration-300 group-hover:text-gold">
                  <Icon className="size-5" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gold/40">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                    <span className="text-gold-light">{stat.value}</span>
                    <span className="text-xl text-gold/90">{stat.suffix}</span>
                  </div>
                  <h4 className="mt-1 text-sm font-semibold text-[#f7f1e3]">
                    {stat.label[locale] || stat.label.en}
                  </h4>
                  <p className="mt-0.5 text-xs text-[#f7f1e3]/60 leading-relaxed">
                    {stat.sub[locale] || stat.sub.en}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
