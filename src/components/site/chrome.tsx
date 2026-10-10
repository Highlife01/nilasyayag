import type { ReactNode } from "react"
import { ArrowUpRight, Globe, Menu } from "lucide-react"
import { ARTICLE_IDS, articleIdBySlug, getDict } from "@/content/index"
import type { Dict } from "@/content/types"
import { LOCALE_META, PUBLISHED_LOCALES, pathFor, type Locale, type StaticPage } from "@/lib/i18n/config"
import type { Settings } from "@/lib/model"
import { HeaderShell } from "@/components/site/header-shell"

const NAV: StaticPage[] = ["sunflower", "olive", "wholesale", "trade", "insights", "about"]
const MORE: StaticPage[] = ["privateLabel", "quality", "faq", "contact", "privacy"]

const navLink =
  "relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-gold-light after:transition-transform after:duration-500 hover:after:scale-x-100 group-data-[solid=true]:after:bg-gold"

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 3c4.6 6.1 8 10.6 8 15.2A8 8 0 0 1 8 18.2C8 13.6 11.4 9.1 16 3Z" fill="currentColor" opacity="0.9" />
      <path d="M16 13.5c2.4 3.1 3.8 5.3 3.8 7.4a3.8 3.8 0 0 1-7.6 0c0-2.1 1.4-4.3 3.8-7.4Z" fill="#121a0d" opacity="0.35" />
    </svg>
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
    <div className="min-h-full bg-paper text-ink">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2">
        {dict.ui.skip}
      </a>
      <HeaderShell className="group fixed inset-x-0 top-0 z-50 text-[#f7f1e3] transition-[background-color,color,box-shadow] duration-500 data-[solid=true]:bg-paper/85 data-[solid=true]:text-ink data-[solid=true]:shadow-[0_1px_0_rgba(166,124,61,0.25)] data-[solid=true]:backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
          <a href={home} className="flex items-center gap-3" aria-label="Nilasya Sofralık Yağ">
            <Mark className="size-8 text-gold-light group-data-[solid=true]:text-gold" />
            <span className="leading-none">
              <span className="font-display block text-[1.7rem] tracking-[0.18em]">NILASYA</span>
              <span className="mt-1 block text-[0.58rem] tracking-[0.42em] opacity-70">SOFRALIK YAĞ</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-[0.82rem] tracking-wide xl:flex" aria-label="Primary">
            {NAV.map((item) => (
              <a key={item} href={pathFor(locale, item)} className={`${navLink} ${page === item ? "after:scale-x-100" : ""}`} aria-current={page === item ? "page" : undefined}>
                {dict.nav[item]}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <details className="relative [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex h-10 cursor-pointer list-none items-center gap-2 px-2 text-[0.82rem]">
                <Globe className="size-4 opacity-80" aria-hidden="true" />
                <span className="hidden sm:inline">{LOCALE_META[locale].name}</span>
                <span className="sm:hidden">{locale.toUpperCase()}</span>
              </summary>
              <div className="absolute end-0 z-50 mt-3 min-w-48 border border-[#e6dcc6] bg-paper p-2 text-ink shadow-[0_24px_60px_-20px_rgba(18,26,13,0.35)]">
                {PUBLISHED_LOCALES.map((code) => (
                  <a
                    key={code}
                    href={pathFor(code, page, articleId ? getDict(code).articles[articleId].slug : undefined)}
                    hrefLang={code}
                    lang={code}
                    className={`flex items-center justify-between px-3 py-2 text-sm transition hover:bg-[#f1e9d6] ${code === locale ? "text-gold" : ""}`}
                  >
                    {LOCALE_META[code].name}
                    <span className="text-[0.65rem] tracking-widest opacity-50">{code.toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </details>
            <a
              href={pathFor(locale, "quote")}
              className="hidden h-11 items-center gap-2 bg-gold-light px-5 text-[0.82rem] font-medium tracking-wide text-ink transition hover:bg-[#f0dba6] sm:inline-flex group-data-[solid=true]:bg-olive group-data-[solid=true]:text-[#f7f1e3] group-data-[solid=true]:hover:bg-leaf"
            >
              {dict.ui.quote}
              <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </a>
            <details className="xl:hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="grid size-11 cursor-pointer list-none place-items-center" aria-label={dict.ui.menu}>
                <Menu className="size-5" aria-hidden="true" />
              </summary>
              <div className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-olive-deep px-6 py-10 text-[#f7f1e3]">
                <nav className="mx-auto grid max-w-xl gap-1" aria-label={dict.ui.menu}>
                  {[...NAV, ...MORE].map((item) => (
                    <a key={item} href={pathFor(locale, item)} className="font-display border-b border-white/10 py-3 text-3xl">
                      {dict.nav[item]}
                    </a>
                  ))}
                  <a href={pathFor(locale, "quote")} className="mt-8 inline-flex h-12 items-center justify-center bg-gold-light text-ink">
                    {dict.ui.quote}
                  </a>
                </nav>
              </div>
            </details>
          </div>
        </div>
      </HeaderShell>

      <main id="content">{children}</main>

      <footer className="grain overflow-hidden bg-olive-deep text-[#f7f1e3]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-12 pt-20 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10">
          <div>
            <a href={home} className="flex items-center gap-3">
              <Mark className="size-9 text-gold-light" />
              <span className="font-display text-3xl tracking-[0.18em]">NILASYA</span>
            </a>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-[#f7f1e3]/65">{dict.footer.note}</p>
            {settings.publicEmail ? (
              <a className="mt-6 inline-flex items-center gap-2 text-sm text-gold-light hover:underline" href={`mailto:${settings.publicEmail}`}>
                {settings.publicEmail}
              </a>
            ) : null}
            {settings.phone ? <p className="mt-2 text-sm text-[#f7f1e3]/80">{settings.phone}</p> : null}
            <p className="mt-2 text-sm text-[#f7f1e3]/50">{settings.country}</p>
          </div>
          <FooterColumn title={dict.nav.sunflower}>
            <FooterLink locale={locale} page="sunflower" label={dict.nav.sunflower} />
            <FooterLink locale={locale} page="olive" label={dict.nav.olive} />
            <FooterLink locale={locale} page="wholesale" label={dict.nav.wholesale} />
            <FooterLink locale={locale} page="privateLabel" label={dict.nav.privateLabel} />
          </FooterColumn>
          <FooterColumn title={dict.nav.trade}>
            <FooterLink locale={locale} page="trade" label={dict.nav.trade} />
            <FooterLink locale={locale} page="quality" label={dict.nav.quality} />
            <FooterLink locale={locale} page="about" label={dict.nav.about} />
            <FooterLink locale={locale} page="contact" label={dict.nav.contact} />
            <FooterLink locale={locale} page="quote" label={dict.nav.quote} />
          </FooterColumn>
          <FooterColumn title={dict.nav.insights}>
            {ARTICLE_IDS.map((id) => (
              <a key={id} className="block text-sm leading-snug text-[#f7f1e3]/70 transition hover:text-gold-light" href={pathFor(locale, "insights", getDict(locale).articles[id].slug)}>
                {dict.articles[id].title}
              </a>
            ))}
            <FooterLink locale={locale} page="faq" label={dict.nav.faq} />
            <FooterLink locale={locale} page="privacy" label={dict.nav.privacy} />
          </FooterColumn>
        </div>
        <p className="font-display text-outline pointer-events-none select-none px-5 text-center text-[20vw] leading-[0.8] tracking-[0.06em] md:px-10" aria-hidden="true">
          NILASYA
        </p>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-[#f7f1e3]/50 md:flex-row md:items-center md:justify-between md:px-10">
            <span>{dict.footer.rights}</span>
            <span>{dict.home.bar}</span>
          </div>
        </div>
      </footer>
      {consent ? null : <Consent locale={locale} dict={dict} />}
    </div>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="kicker text-gold-light">{title}</p>
      <div className="mt-6 grid gap-3">{children}</div>
    </div>
  )
}

function FooterLink({ locale, page, label }: { locale: Locale; page: StaticPage; label: string }) {
  return (
    <a className="block text-sm text-[#f7f1e3]/70 transition hover:text-gold-light" href={pathFor(locale, page)}>
      {label}
    </a>
  )
}

function Consent({ locale, dict }: { locale: Locale; dict: Dict }) {
  const next = pathFor(locale, "home")
  return (
    <div className="fixed bottom-4 start-4 end-4 z-40 border border-[#e6dcc6] bg-paper/95 p-5 text-sm text-ink shadow-[0_30px_80px_-30px_rgba(18,26,13,0.5)] backdrop-blur-xl sm:end-auto sm:max-w-sm">
      <p className="leading-relaxed text-[#4a453c]">{dict.consent.text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <form action="/api/consent" method="post">
          <input type="hidden" name="choice" value="all" />
          <input type="hidden" name="next" value={next} />
          <button className="h-10 bg-olive px-4 text-[#f7f1e3] transition hover:bg-leaf" type="submit">
            {dict.consent.accept}
          </button>
        </form>
        <form action="/api/consent" method="post">
          <input type="hidden" name="choice" value="necessary" />
          <input type="hidden" name="next" value={next} />
          <button className="h-10 border border-olive/40 px-4 transition hover:border-olive" type="submit">
            {dict.consent.reject}
          </button>
        </form>
      </div>
    </div>
  )
}
