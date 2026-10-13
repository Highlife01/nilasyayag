import { getDict } from "@/content/index"
import { commerceCopy } from "@/content/commerce-ui"
import { PUBLISHED_LOCALES, type Locale } from "@/lib/i18n/config"
import { Globe2, Anchor, Droplets, Package, ShieldCheck } from "lucide-react"

export function StatsStrip({ locale }: { locale: Locale }) {
  const dict = getDict(locale)
  const copy = commerceCopy(locale)
  const items = [
    { value: String(PUBLISHED_LOCALES.length), label: dict.ui.language, sub: dict.nav.contact, icon: Globe2, color: "text-emerald-600 bg-emerald-50" },
    { value: "FOB / CIF", label: dict.nav.trade, sub: dict.ui.shipsFromValue, icon: Anchor, color: "text-blue-600 bg-blue-50" },
    { value: "2", label: dict.form.product, sub: `${dict.form.sunflower} · ${dict.form.olive}`, icon: Droplets, color: "text-amber-600 bg-amber-50" },
    { value: "PET / FCL", label: dict.form.packaging, sub: dict.ui.packingValue, icon: Package, color: "text-orange-600 bg-orange-50" },
    { value: "QA", label: dict.nav.quality, sub: copy.documents, icon: ShieldCheck, color: "text-emerald-700 bg-emerald-50" },
  ]
  return (
    <section className="relative z-20 -mt-10 mx-auto max-w-7xl px-5 md:px-10">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl md:p-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="group flex flex-col justify-between border-s border-slate-100 ps-4">
                <div className="flex items-center justify-between">
                  <div className={`flex size-10 items-center justify-center rounded-xl ${item.color}`}><Icon className="size-5" /></div>
                  <span className="font-mono text-[11px] font-bold text-slate-300">0{index + 1}</span>
                </div>
                <div className="mt-4">
                  <div className="font-display text-2xl font-extrabold text-emerald-950 md:text-3xl">{item.value}</div>
                  <h4 className="mt-1 text-sm font-bold text-slate-800">{item.label}</h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.sub}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
