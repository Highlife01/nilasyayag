import type { CSSProperties, ReactNode } from "react"
import { ArrowUpRight, Globe, Menu, Phone, Mail, Ship, ShieldCheck, CheckCircle2 } from "lucide-react"
import { ARTICLE_IDS, articleIdBySlug, getDict } from "@/content/index"
import type { Dict } from "@/content/types"
import { LOCALE_META, PUBLISHED_LOCALES, pathFor, type Locale, type StaticPage } from "@/lib/i18n/config"
import type { Settings } from "@/lib/model"
import { HeaderShell } from "@/components/site/header-shell"

const NAV: StaticPage[] = ["sunflower", "olive", "wholesale", "trade", "insights", "about"]
const MORE: StaticPage[] = ["privateLabel", "quality", "faq", "contact", "privacy"]

export const BRAND_NAME = "Asia Oil"
const BRAND_TAGLINE = "EDIBLE OILS · TÜRKİYE"

/** Modern high-tech brand mark */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 font-display text-lg font-black text-white shadow-md shadow-emerald-700/25 group-hover:scale-105 transition-transform duration-200 ${className}`}
      aria-hidden="true"
    >
      A
    </span>
  )
}

export function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  const title = size === "lg" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
  return (
    <span className="leading-tight flex flex-col">
      <span className={`font-display font-black tracking-tight text-slate-900 ${title}`}>
        ASIA<span className="text-emerald-700">OIL</span>
      </span>
      <span className="text-[0.62rem] font-bold tracking-[0.22em] text-emerald-800 uppercase">
        {BRAND_TAGLINE}
      </span>
    </span>
  )
}

export function SiteFrame({
  locale,
  dict,
  page,
  articleSlug,
  settings,
  consent,
  children,
}: {
  locale: Locale
  dict: Dict
  page: StaticPage
  articleSlug?: string
  settings: Settings
  consent: string | undefined
  children: ReactNode
}) {
  const home = pathFor(locale, "home")
  const articleId = articleSlug ? articleIdBySlug(locale, articleSlug) : null

  return (
    <div className="min-h-full bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:bg-emerald-800 focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        {dict.ui.skip}
      </a>

      {/* Top Global Logistics & Quick Contact Utility Bar */}
      <div className="border-b border-emerald-950/10 bg-[#092217] text-[#f7f1e3] text-xs py-2 px-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Left: Port Dispatch Status */}
          <div className="flex items-center gap-2 text-[#f7f1e3]/85 truncate">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-emerald-300">
              {locale === "tr" ? "Liman İhracat Çıkışları:" : "Seaport Terminals:"}
            </span>
            <span className="truncate">
              {locale === "tr"
                ? "Mersin Uluslararası Limanı (MIP) & İzmir Limanı • FOB / CIF Sevkiyat"
                : "Mersin International Port (MIP) & Izmir Seaport • FOB / CIF Worldwide"}
            </span>
          </div>

          {/* Right: Direct Desk Info & WhatsApp & Language */}
          <div className="flex items-center gap-4 sm:gap-5 text-xs">
            <a
              href="mailto:export@asiaoil.com.tr"
              className="hidden md:flex items-center gap-1.5 hover:text-amber-300 transition"
            >
              <Mail className="size-3.5 text-amber-400" />
              <span>export@asiaoil.com.tr</span>
            </a>

            <a
              href="https://wa.me/905325000000?text=Hello%20Asia%20Oil%2C%20I%20would%20like%20to%20request%20information"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 font-semibold transition"
            >
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>WhatsApp Desk</span>
            </a>

            {/* Language Dropdown */}
            <details className="relative [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded bg-white/10 px-2.5 py-1 text-xs font-semibold hover:bg-white/20 transition">
                <Globe className="size-3 text-amber-300" />
                <span>{locale.toUpperCase()}</span>
              </summary>
              <div className="absolute end-0 z-50 mt-2 min-w-44 rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-2xl">
                {PUBLISHED_LOCALES.map((code) => (
                  <a
                    key={code}
                    href={pathFor(code, page, articleId ? getDict(code).articles[articleId].slug : undefined)}
                    hrefLang={code}
                    lang={code}
                    className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition hover:bg-slate-100 ${
                      code === locale ? "text-emerald-700 font-bold bg-emerald-50" : ""
                    }`}
                  >
                    <span>{LOCALE_META[code].name}</span>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{code}</span>
                  </a>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Main Persistent Clean Sticky Header */}
      <HeaderShell className="site-header group sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b-2 border-slate-300 transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
          {/* Logo */}
          <a href={home} className="group/brand flex items-center gap-3.5" aria-label={BRAND_NAME}>
            <Mark className="transition duration-300 group-hover/brand:scale-105" />
            <Wordmark />
          </a>

          {/* Desktop Navigation Links (Pill Style) */}
          <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Primary">
            {NAV.map((item) => {
              const active = page === item
              return (
                <a
                  key={item}
                  href={pathFor(locale, item)}
                  className={`rounded-xl px-4 py-2 text-sm transition-all duration-150 ${
                    active
                      ? "bg-emerald-950 text-white font-black shadow-md border border-emerald-800"
                      : "text-slate-900 hover:bg-slate-100 hover:text-black font-extrabold"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {dict.nav[item]}
                </a>
              )
            })}
          </nav>

          {/* Right Action Button & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <a
              href={pathFor(locale, "quote")}
              className="btn-shine hidden sm:inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 hover:from-emerald-600 hover:to-teal-600 px-6 text-xs font-black text-white shadow-lg shadow-emerald-950/30 transition-all duration-200 hover:scale-105 active:scale-95 border border-emerald-400/30"
            >
              <span>📋</span>
              <span>{dict.ui.quote}</span>
            </a>

            {/* Mobile Menu */}
            <details className="lg:hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-xl border-2 border-slate-300 text-slate-950 hover:bg-slate-100 shadow-xs font-bold" aria-label={dict.ui.menu}>
                <Menu className="size-5" />
              </summary>
              <div className="fixed inset-x-0 bottom-0 top-[114px] group-data-[solid=true]:top-20 z-50 overflow-y-auto bg-white px-6 py-8 shadow-2xl border-t border-slate-200">
                <nav className="mx-auto grid max-w-lg gap-2" aria-label={dict.ui.menu}>
                  {[...NAV, ...MORE].map((item, index) => (
                    <a
                      key={item}
                      href={pathFor(locale, item)}
                      className="flex items-center justify-between border-b border-slate-100 py-3 text-base font-bold text-slate-800 hover:text-emerald-800"
                    >
                      <span>{dict.nav[item]}</span>
                      <span className="text-xs font-mono text-slate-400">0{index + 1}</span>
                    </a>
                  ))}

                  <a
                    href={pathFor(locale, "quote")}
                    className="mt-4 flex h-12 items-center justify-center rounded-xl bg-emerald-800 text-sm font-bold text-white shadow-lg hover:bg-emerald-900 transition"
                  >
                    {dict.ui.quote}
                  </a>

                  {/* Mobile Language Selection */}
                  <div className="border-t border-slate-200 pt-6 mt-4">
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Globe className="size-4 text-emerald-700" />
                        {dict.ui.language}
                      </span>
                      <span className="text-emerald-700 font-mono">{locale.toUpperCase()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {PUBLISHED_LOCALES.map((code) => (
                        <a
                          key={code}
                          href={pathFor(code, page, articleId ? getDict(code).articles[articleId].slug : undefined)}
                          hrefLang={code}
                          lang={code}
                          className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                            code === locale
                              ? "border-emerald-700 bg-emerald-50 text-emerald-800 font-bold"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>{LOCALE_META[code].name}</span>
                          <span className="text-[10px] font-mono uppercase text-slate-400">{code}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </details>
          </div>
        </div>
      </HeaderShell>

      {/* Main Page Content */}
      <main id="content">{children}</main>

      {/* Modern High-Prestige Corporate Footer */}
      <footer className="bg-[#0b1c14] text-[#f7f1e3] border-t border-emerald-950/30">
        <div className="mx-auto max-w-7xl px-5 pt-20 pb-12 md:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Column 1: Brand & Ports */}
            <div className="lg:col-span-4">
              <a href={home} className="flex items-center gap-3">
                <Mark className="size-11" />
                <span className="leading-tight">
                  <span className="font-display block text-2xl font-extrabold tracking-tight text-white">
                    ASIA OIL
                  </span>
                  <span className="text-[0.65rem] font-bold tracking-[0.2em] text-emerald-400 uppercase">
                    {BRAND_TAGLINE}
                  </span>
                </span>
              </a>

              <p className="mt-6 text-sm leading-relaxed text-[#f7f1e3]/75">
                {dict.footer.note}
              </p>

              <div className="mt-6 space-y-2 text-xs text-[#f7f1e3]/80">
                <div className="flex items-center gap-2">
                  <Ship className="size-4 text-emerald-400" />
                  <span>
                    {locale === "tr"
                      ? "Mersin Uluslararası Limanı (MIP) & İzmir Limanı"
                      : "Mersin International Port (MIP) & Izmir Seaport"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-amber-400" />
                  <a href={`mailto:${settings.publicEmail || "export@asiaoil.com.tr"}`} className="text-amber-300 hover:underline">
                    {settings.publicEmail || "export@asiaoil.com.tr"}
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Products */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold tracking-widest uppercase text-emerald-400">
                {dict.nav.sunflower}
              </h4>
              <div className="mt-5 space-y-2.5 text-xs text-[#f7f1e3]/75">
                <a href={pathFor(locale, "sunflower")} className="block hover:text-white transition">
                  {dict.nav.sunflower} (HS 1512.19)
                </a>
                <a href={pathFor(locale, "olive")} className="block hover:text-white transition">
                  {dict.nav.olive} (HS 1509.20)
                </a>
                <a href={pathFor(locale, "wholesale")} className="block hover:text-white transition">
                  {dict.nav.wholesale} & Flexitank
                </a>
                <a href={pathFor(locale, "privateLabel")} className="block hover:text-white transition">
                  {dict.nav.privateLabel}
                </a>
              </div>
            </div>

            {/* Column 3: Logistics & Corporate */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold tracking-widest uppercase text-emerald-400">
                {dict.nav.trade}
              </h4>
              <div className="mt-5 space-y-2.5 text-xs text-[#f7f1e3]/75">
                <a href={pathFor(locale, "trade")} className="block hover:text-white transition">
                  {dict.nav.trade} (FOB / CIF)
                </a>
                <a href={pathFor(locale, "quality")} className="block hover:text-white transition">
                  {dict.nav.quality}
                </a>
                <a href={pathFor(locale, "about")} className="block hover:text-white transition">
                  {dict.nav.about}
                </a>
                <a href={pathFor(locale, "contact")} className="block hover:text-white transition">
                  {dict.nav.contact}
                </a>
                <a href={pathFor(locale, "quote")} className="block hover:text-white transition">
                  {dict.nav.quote}
                </a>
              </div>
            </div>

            {/* Column 4: Insights & Legal */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold tracking-widest uppercase text-emerald-400">
                {dict.nav.insights}
              </h4>
              <div className="mt-5 space-y-2.5 text-xs text-[#f7f1e3]/75">
                {ARTICLE_IDS.map((id) => (
                  <a
                    key={id}
                    className="block hover:text-white transition truncate"
                    href={pathFor(locale, "insights", getDict(locale).articles[id].slug)}
                  >
                    {dict.articles[id].title}
                  </a>
                ))}
                <a href={pathFor(locale, "faq")} className="block hover:text-white transition">
                  {dict.nav.faq}
                </a>
                <a href={pathFor(locale, "privacy")} className="block hover:text-white transition">
                  {dict.nav.privacy}
                </a>
              </div>
            </div>
          </div>

          {/* Sub Footer Rights & Badges */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-[#f7f1e3]/50">
            <p>© {new Date().getFullYear()} Asia Oil Türkiye. {dict.footer.rights}</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-emerald-400 font-medium">
              <span>ISO 22000:2018</span>
              <span>•</span>
              <span>{locale === "tr" ? "Helal & Koşer" : "Halal & Kosher"}</span>
              <span>•</span>
              <span>{locale === "tr" ? "EUR.1 Dolaşım Belgesi" : "EUR.1 Movement Certificate"}</span>
              <span>•</span>
              <span>IOC Standards</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
