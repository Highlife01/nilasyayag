import type { Locale } from "@/lib/i18n/config"
import { Globe2, Anchor, Droplets, Package, ShieldCheck } from "lucide-react"

interface StatItem {
  value: string
  suffix?: Record<Locale, string> | string
  label: Record<Locale, string>
  sub: Record<Locale, string>
  icon: typeof Globe2
  color: string
}

const STATS: StatItem[] = [
  {
    value: "60",
    suffix: "+",
    label: {
      tr: "İhracat Ülkesi",
      en: "Export Destinations",
      ar: "دولة تصدير",
      ru: "Стран экспорта",
      de: "Exportländer",
      fr: "Pays d'exportation",
      es: "Países de exportación",
      it: "Paesi di esportazione",
    },
    sub: {
      tr: "6 Kıtada Güçlü Dağıtım Ağı",
      en: "Global Network on 6 Continents",
      ar: "شبكة توزيع عبر 6 قارات",
      ru: "Сеть поставок на 6 континентах",
      de: "Netzwerk auf 6 Kontinenten",
      fr: "Réseau sur 6 continents",
      es: "Red en 6 continentes",
      it: "Rete su 6 continenti",
    },
    icon: Globe2,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    value: "2",
    suffix: {
      tr: " Liman",
      en: " Ports",
      ar: " موانئ",
      ru: " Порта",
      de: " Häfen",
      fr: " Ports",
      es: " Puertos",
      it: " Porti",
    },
    label: {
      tr: "Derin Deniz Terminali",
      en: "Deep-Sea Terminals",
      ar: "محطات بحرية استراتيجية",
      ru: "Глубоководных терминала",
      de: "Tiefsee-Terminals",
      fr: "Terminaux en eau profonde",
      es: "Terminales de aguas profundas",
      it: "Terminal in acque profonde",
    },
    sub: {
      tr: "Mersin (MIP) & İzmir Liman Çıkışlı",
      en: "Direct from Mersin (MIP) & Izmir",
      ar: "شحن مباشر من مرسين وإزمير",
      ru: "Прямые рейсы из портов Мерсин и Измир",
      de: "Direktexport via Mersin & Izmir",
      fr: "Départs Mersin (MIP) & Izmir",
      es: "Salidas desde Mersin MIP e Izmir",
      it: "Spedizioni Mersin MIP e Smirne",
    },
    icon: Anchor,
    color: "text-blue-600 bg-blue-50",
  },
  {
    value: "100",
    suffix: "%",
    label: {
      tr: "Doğal & Saf Rafinasyon",
      en: "Pure Natural & Refined",
      ar: "زيوت طبيعية ومكررة 100%",
      ru: "Натуральные рафинированные масла",
      de: "100% Natürliche Speiseöle",
      fr: "Huiles pures et naturelles",
      es: "Aceites 100% naturales",
      it: "Oli naturali e raffinati",
    },
    sub: {
      tr: "FFA < %0.10, 232°C Duman Noktası",
      en: "FFA < 0.10%, 232°C Smoke Point",
      ar: "حموضة < 0.10% ونقطة احتراق 232°م",
      ru: "FFA < 0.10%, точка дымления 232°C",
      de: "FFA < 0,10%, 232°C Rauchpunkt",
      fr: "FFA < 0,10%, point de fumée 232°C",
      es: "FFA < 0.10%, punto de humo 232°C",
      it: "FFA < 0,10%, punto di fumo 232°C",
    },
    icon: Droplets,
    color: "text-amber-600 bg-amber-50",
  },
  {
    value: "24.000",
    suffix: " L",
    label: {
      tr: "Flexitank & Dökme Kapasite",
      en: "Flexitank & Bulk Logistics",
      ar: "شحن فليكسيتانك وسائب",
      ru: "Флекситанки и наливом",
      de: "Flexitank & Bulk-Logistik",
      fr: "Capacité Flexitank & Vrac",
      es: "Logística Flexitank y a granel",
      it: "Capacità Flexitank e sfuso",
    },
    sub: {
      tr: "0.5L PET'ten 24.000L'e Tam Hacim",
      en: "Full Matrix: 0.5L PET to 24,000L",
      ar: "من 0.5 لتر حتى 24,000 لتر",
      ru: "От 0.5л до 24 000л во флекситанках",
      de: "Von 0,5L PET bis 24.000L",
      fr: "Du format 0.5L au vrac 24.000L",
      es: "De 0.5L PET a 24.000L a granel",
      it: "Da 0,5L PET a 24.000L sfuso",
    },
    icon: Package,
    color: "text-orange-600 bg-orange-50",
  },
  {
    value: "ISO",
    suffix: " 22000",
    label: {
      tr: "Uluslararası Akreditasyon",
      en: "Global Accreditations",
      ar: "اعتمادات دولية معتمدة",
      ru: "Международные стандарты",
      de: "Globale Zertifikate",
      fr: "Certifications mondiales",
      es: "Acreditaciones globales",
      it: "Certificazioni globali",
    },
    sub: {
      tr: "Helal, Kosher, EUR.1, SGS Onaylı",
      en: "Halal, Kosher, EUR.1 & SGS Audited",
      ar: "حلال، كوشير، EUR.1 وفحص SGS",
      ru: "Халяль, Кошер, EUR.1, SGS",
      de: "Halal, Koscher, EUR.1 & SGS",
      fr: "Halal, Casher, EUR.1 & SGS",
      es: "Halal, Kosher, EUR.1 y SGS",
      it: "Halal, Kosher, EUR.1 e SGS",
    },
    icon: ShieldCheck,
    color: "text-emerald-700 bg-emerald-50",
  },
]

export function StatsStrip({ locale }: { locale: Locale }) {
  return (
    <section className="relative z-20 py-10 md:py-14 w-full px-5 sm:px-8 lg:px-14 xl:px-20 2xl:px-28">
      <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-white p-6 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12)] md:p-8">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-800 via-teal-600 to-amber-500" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/70 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex size-12 items-center justify-center rounded-xl ${stat.color} transition duration-300 group-hover:scale-110 shadow-xs border border-slate-200/80`}>
                    <Icon className="size-5" />
                  </div>
                  <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 font-mono text-[11px] font-black tracking-wider text-slate-600 group-hover:bg-emerald-950 group-hover:text-amber-300 transition-colors">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-5">
                  <div className="font-display text-3xl font-black tracking-tight text-slate-950 xl:text-4xl">
                    <span className="text-slate-950">{stat.value}</span>
                    <span className="text-lg font-black text-emerald-700">
                      {typeof stat.suffix === "object" ? stat.suffix[locale] || stat.suffix.en : stat.suffix}
                    </span>
                  </div>
                  <h4 className="mt-1.5 text-sm font-black text-slate-950 leading-snug">
                    {stat.label[locale] || stat.label.en}
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 font-semibold leading-relaxed">
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
