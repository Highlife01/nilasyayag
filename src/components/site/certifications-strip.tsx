import { getDict } from "@/content/index"
import { commerceCopy } from "@/content/commerce-ui"
import { pathFor, type Locale } from "@/lib/i18n/config"
import { ShieldCheck, FileCheck2, ArrowUpRight } from "lucide-react"

export function CertificationsStrip({ locale }: { locale: Locale }) {
  const dict = getDict(locale)
  const quality = dict.pages.quality
  const copy = commerceCopy(locale)
  const documents = quality.sections[0]?.b ?? []
  return (
    <section className="bg-white py-20 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            <FileCheck2 className="size-4 text-emerald-600" />
            <span>{quality.kicker}</span>
          </div>
          <h2 className="font-display mt-4 text-3xl font-extrabold text-slate-900 md:text-5xl">{quality.h1}</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">{quality.lede}</p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {documents.map((document, index) => (
            <div key={document} className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition hover:border-emerald-500 hover:bg-white hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-800">{String(index + 1).padStart(2, "0")}</span>
                <ShieldCheck className="size-5 text-emerald-600" />
              </div>
              <h3 className="font-display mt-4 text-xl font-bold text-slate-900">{document}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{copy.verification}</p>
              <a href={pathFor(locale, "quality")} className="mt-6 inline-flex items-center gap-2 border-t border-slate-200 pt-3 text-xs font-semibold text-emerald-700">
                {copy.documents}<ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
