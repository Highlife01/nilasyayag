import Image from "next/image"
import type { CSSProperties } from "react"
import { ArrowRight, ArrowUpRight, Plus, Phone, Ship, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"
import { ARTICLE_IDS } from "@/content/index"
import type { Dict, PageCopy } from "@/content/types"
import { pathFor, type Locale, type StaticPage } from "@/lib/i18n/config"
import { still, type Frame } from "@/lib/media"
import { InquiryForm } from "@/components/site/inquiry-form"
import { Showcase } from "@/components/site/hero"
import { Spotlight } from "@/components/site/motion"
import { QuoteCalculator } from "@/components/site/quote-calculator"
import { HeroBanner } from "@/components/site/hero-banner"
import { BRAND_NAME, Mark, Wordmark } from "@/components/site/chrome"
import type { Settings } from "@/lib/model"

const container = "mx-auto max-w-7xl px-5 md:px-10"
const goldButton = "btn-shine group inline-flex h-14 items-center gap-3 bg-gold-light text-sm font-medium tracking-wide text-ink transition hover:bg-[#f0dba6]"
const vars = (values: Record<string, string>) => values as CSSProperties

/** Headline split into words; each word slides up from a mask with a stagger. */
function Words({ text, start = 0, step = 0.055 }: { text: string; start?: number; step?: number }) {
  return text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`} className="mask-word">
      <span style={vars({ "--i": `${start + index * step}s` })}>{word}</span>{" "}
    </span>
  ))
}

function Blobs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <span className="float absolute -left-[10%] top-[10%] size-[44vw] rounded-full bg-[radial-gradient(circle,rgba(226,173,58,0.18),transparent_65%)] blur-3xl" />
      <span className="float-slow absolute -right-[12%] bottom-[-10%] size-[50vw] rounded-full bg-[radial-gradient(circle,rgba(143,166,91,0.16),transparent_65%)] blur-3xl" />
    </div>
  )
}

function splitTitle(title: string) {
  const at = title.indexOf(",")
  if (at < 0) return [title, ""] as const
  return [title.slice(0, at + 1), title.slice(at + 1).trim()] as const
}

function Kicker({ children, tone = "dark" }: { children: string; tone?: "dark" | "light" }) {
  return (
    <p className={`kicker flex items-center gap-3 ${tone === "light" ? "text-gold-light" : "text-gold"}`}>
      <span className="rule" aria-hidden="true" />
      {children}
    </p>
  )
}

export function HomeView({ locale, dict, frames }: { locale: Locale; dict: Dict; frames: Frame[] }) {
  const cover = frames[frames.length - 1]
  const posters = frames.slice(0, -1)
  const lead = dict.hero[0]
  const [titleStart, titleEnd] = splitTitle(lead?.title ?? dict.nav.home)
  const posterLinks: StaticPage[] = ["sunflower", "olive", "trade"]
  const slides = posters.map((frame, index) => {
    const copy = dict.hero[index + 1] ?? lead
    return {
      src: frame.src,
      alt: dict.hero[index]?.alt ?? `${dict.ui.photo} ${frame.index}`,
      kicker: copy?.kicker ?? BRAND_NAME,
      title: copy?.title ?? dict.nav.home,
      lede: copy?.lede ?? dict.metaDescription,
      href: pathFor(locale, posterLinks[index] ?? "quote"),
      cta: dict.ui.explore,
    }
  })
  const ribbon = dict.home.bar.split("·").map((part) => part.trim()).filter(Boolean)

  const titleWords = titleStart.split(" ").length
  return (
    <>
      <div className="curtain" aria-hidden="true">
        <div className="flex items-center gap-4 text-gold-light">
          <Mark className="size-12" />
          <Wordmark size="lg" />
        </div>
      </div>

      <section className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#0c1209] text-[#f7f1e3] pt-28 pb-16" style={vars({ "--base": "0.9s" })}>
        {/* Ambient atmospheric background glows */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(212,175,55,0.18),transparent_75%)]" />
        <div className="pointer-events-none absolute -left-40 top-40 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(143,166,91,0.18),transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-20 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12),transparent_70%)] blur-3xl" />

        <div className={`${container} flex flex-col items-center text-center`}>
          {/* Live Port / Export Desk Status Pill */}
          <div className="rise inline-flex items-center gap-2.5 rounded-full border border-gold-light/30 bg-black/40 px-4 py-1.5 text-xs text-gold-light backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide uppercase">
              {locale === "tr"
                ? "Canlı İhracat Masası • Mersin Port (MIP) & İzmir Limanı"
                : "Live Export Desk • Mersin Port (MIP) & İzmir Seaport"}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display mt-6 max-w-4xl text-[clamp(2.5rem,5.2vw,5.2rem)] font-bold leading-[1.02] tracking-tight drop-shadow-md text-white">
            <Words text={titleStart} start={0.1} />
            {titleEnd ? (
              <span className="text-gold-gradient block italic font-normal mt-1">
                <Words text={titleEnd} start={0.1 + titleWords * 0.055} />
              </span>
            ) : null}
          </h1>

          <p className="rise rise-3 mt-6 max-w-2xl text-base leading-relaxed text-[#f7f1e3]/80 md:text-lg">
            {lead?.lede ?? dict.metaDescription}
          </p>

          {/* Dual CTAs & Quality Badges */}
          <div className="rise rise-4 mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={pathFor(locale, "quote")} className={`${goldButton} px-8 rounded-full shadow-lg shadow-gold/20`}>
              <span>{dict.ui.quote}</span>
              <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
            </a>
            <a
              href="https://wa.me/905325000000?text=Hello%20Asia%20Oil%2C%20I%20would%20like%20to%20request%20a%20B2B%20quotation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-2.5 rounded-full border border-white/25 bg-white/5 px-7 text-sm font-medium text-white backdrop-blur-sm transition duration-300 hover:border-emerald-400 hover:bg-emerald-950/30 hover:text-emerald-300"
            >
              <Phone className="size-4 text-emerald-400" />
              <span>WhatsApp B2B Desk</span>
            </a>
            <a
              href={pathFor(locale, "sunflower")}
              className="inline-flex h-14 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm text-[#f7f1e3]/90 transition hover:border-sun hover:bg-sun/10 hover:text-sun"
            >
              <span className="size-2 rounded-full bg-sun" />
              <span>{dict.nav.sunflower}</span>
            </a>
            <a
              href={pathFor(locale, "olive")}
              className="inline-flex h-14 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm text-[#f7f1e3]/90 transition hover:border-[#8fa65b] hover:bg-[#8fa65b]/10 hover:text-[#c9d9a0]"
            >
              <span className="size-2 rounded-full bg-[#8fa65b]" />
              <span>{dict.nav.olive}</span>
            </a>
          </div>

          {/* Master Visual Hero Centerpiece Showcase */}
          <HeroBanner
            locale={locale}
            labels={{
              previous: dict.ui.previous,
              next: dict.ui.next,
              pause: dict.ui.pause,
              play: dict.ui.play,
              slide: dict.ui.slide,
            }}
          />
        </div>
      </section>

      <div className="marquee-mask overflow-hidden border-y border-gold/20 bg-paper py-5" aria-hidden="true">
        <div className="marquee flex w-max gap-12 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-12">
              {[...ribbon, ...ribbon].map((word, index) => (
                <span key={`${copy}-${index}`} className="font-display flex items-center gap-12 text-2xl italic text-olive/80 md:text-3xl">
                  {word}
                  <span className="text-base not-italic text-gold">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="bg-paper py-24 md:py-32">
        <div className={container}>
          <div className="reveal grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
            <div>
              <Kicker>{dict.home.collectionsKicker}</Kicker>
              <h2 className="font-display mt-6 text-5xl leading-[0.98] md:text-7xl">{dict.home.collectionsTitle}</h2>
            </div>
            <p className="max-w-md text-[#5c574e] md:justify-self-end">{dict.home.closingText}</p>
          </div>
          <div className="mt-16 flex flex-col gap-4 md:h-[78vh] md:min-h-[36rem] md:flex-row">
            <Collection
              href={pathFor(locale, "sunflower")}
              image={still("sunflower")}
              index="01"
              title={dict.nav.sunflower}
              text={dict.home.sunText}
              cta={dict.ui.explore}
              tint="from-[#3b2a06]/95 via-[#3b2a06]/35"
              accent="text-sun"
            />
            <Collection
              href={pathFor(locale, "olive")}
              image={still("olive")}
              index="02"
              title={dict.nav.olive}
              text={dict.home.oliveText}
              cta={dict.ui.explore}
              tint="from-[#121a0d]/95 via-[#121a0d]/35"
              accent="text-[#b8cc87]"
            />
          </div>
        </div>
      </section>

      {/* Modern B2B Volume & Export Estimator Section */}
      <section className="bg-paper py-20 border-t border-gold/15">
        <div className={container}>
          <div className="reveal mb-10 max-w-2xl">
            <Kicker>{locale === "tr" ? "İhracat Planlama" : "Export Planning"}</Kicker>
            <h2 className="font-display mt-4 text-4xl leading-tight md:text-5xl">
              {locale === "tr"
                ? "Konteyner ve Sevkiyatınızı Şimdi Yapılandırın"
                : "Configure Your Container & Shipment Now"}
            </h2>
            <p className="mt-3 text-base text-[#5c574e]">
              {locale === "tr"
                ? "Dilediğiniz ambalaj ve konteyner hacmini belirleyin; Mersin Limanı çıkışlı FOB veya CIF teslimat için tek tıkla resmi teklif isteyin."
                : "Select your desired packaging and container volume; request an official FOB or CIF quotation dispatched from Mersin Port in one click."}
            </p>
          </div>
          <QuoteCalculator locale={locale} />
        </div>
      </section>

      {slides.length ? (
        <Spotlight className="grain overflow-hidden bg-olive-deep py-24 md:py-32">
          <Blobs />
          <div className={container}>
            <Showcase slides={slides} labels={dict.ui} />
          </div>
        </Spotlight>
      ) : null}

      <section className="bg-ivory py-24 md:py-32">
        <div className={`${container} grid gap-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]`}>
          <div className="reveal lg:sticky lg:top-32 lg:self-start">
            <Kicker>{dict.home.principlesKicker}</Kicker>
            <h2 className="font-display mt-6 text-5xl leading-[0.98] md:text-6xl">{dict.home.principlesTitle}</h2>
          </div>
          <div className="grid gap-px bg-gold/25 sm:grid-cols-2">
            {dict.home.principles.map((item, index) => (
              <article
                key={item.t}
                className="reveal group relative overflow-hidden bg-ivory p-8 transition-colors duration-500 hover:bg-paper md:p-10"
                style={vars({ "--d": `${(index % 2) * 6}%` })}
              >
                <span className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-gold/10 opacity-0 blur-2xl transition duration-700 group-hover:opacity-100" aria-hidden="true" />
                <p className="font-display text-6xl text-gold/40 transition duration-500 group-hover:-translate-y-1 group-hover:text-gold">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="font-display mt-8 text-3xl">{item.t}</h3>
                <p className="mt-3 leading-relaxed text-[#5c574e]">{item.d}</p>
                <span className="mt-8 block h-px w-10 bg-gold/40 transition-[width] duration-700 group-hover:w-full" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grain overflow-hidden bg-olive py-24 text-[#f7f1e3] md:py-32">
        <div className={container}>
          <div className="reveal max-w-2xl">
            <Kicker tone="light">{dict.home.processKicker}</Kicker>
            <h2 className="font-display mt-6 text-5xl leading-[0.98] md:text-6xl">{dict.home.processTitle}</h2>
          </div>
          <ol className="relative mt-20 grid gap-12 md:grid-cols-4 md:gap-8">
            <span className="draw absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-gold-light/0 via-gold-light/60 to-gold-light/0 md:block" aria-hidden="true" />
            {dict.home.steps.map((step, index) => (
              <li key={step.t} className="reveal group relative" style={vars({ "--d": `${index * 5}%` })}>
                <span className="font-display relative grid size-14 place-items-center border border-gold-light/50 bg-olive text-xl text-gold-light transition duration-500 group-hover:bg-gold-light group-hover:text-ink">
                  <span className="absolute inset-0 scale-125 border border-gold-light/0 transition duration-700 group-hover:scale-150 group-hover:border-gold-light/30" aria-hidden="true" />
                  {index + 1}
                </span>
                <h3 className="font-display mt-8 text-3xl">{step.t}</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-[#f7f1e3]/70">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src={still("warehouse")} alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0c1008]/70 to-[#0c1008]/10 rtl:bg-gradient-to-l" />
        <div className={`${container} flex min-h-[80vh] items-center py-24`}>
          <div className="reveal-scale max-w-xl border border-white/15 bg-olive-deep/75 p-10 text-[#f7f1e3] backdrop-blur-md md:p-14">
            <Kicker tone="light">{dict.home.bandKicker}</Kicker>
            <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">{dict.home.bandTitle}</h2>
            <p className="mt-5 leading-relaxed text-[#f7f1e3]/75">{dict.home.bandText}</p>
            <a href={pathFor(locale, "wholesale")} className="btn-shine group mt-9 inline-flex h-12 items-center gap-3 border border-gold-light/60 px-6 text-sm text-gold-light transition hover:bg-gold-light hover:text-ink">
              {dict.nav.wholesale}
              <ArrowRight className="size-4 transition group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 md:py-32">
        <div className={container}>
          <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Kicker>{dict.home.answersKicker}</Kicker>
              <h2 className="font-display mt-6 text-5xl leading-[0.98] md:text-6xl">{dict.home.answersTitle}</h2>
            </div>
            <a href={pathFor(locale, "insights")} className="group link-draw inline-flex items-center gap-2 text-sm text-olive">
              {dict.ui.allInsights}
              <ArrowRight className="size-4 transition group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {ARTICLE_IDS.map((id, index) => (
              <ArticleCard key={id} href={pathFor(locale, "insights", dict.articles[id].slug)} index={index} kicker={dict.articles[id].kicker} title={dict.articles[id].h1} text={dict.articles[id].lede} />
            ))}
          </div>
        </div>
      </section>

      <Closing locale={locale} dict={dict} />
    </>
  )
}

function Collection({
  href,
  image,
  index,
  title,
  text,
  cta,
  tint,
  accent,
}: {
  href: string
  image: string
  index: string
  title: string
  text: string
  cta: string
  tint: string
  accent: string
}) {
  return (
    <a href={href} className="reveal-clip group relative isolate flex min-h-[30rem] flex-1 overflow-hidden text-[#f7f1e3] transition-[flex-grow] duration-700 ease-out md:hover:flex-[1.35]">
      <Image src={image} alt="" fill className="-z-20 object-cover transition duration-[1600ms] ease-out group-hover:scale-110" sizes="(min-width: 768px) 60vw, 100vw" />
      <div className={`absolute inset-0 -z-10 bg-gradient-to-t ${tint} to-transparent transition-opacity duration-700 group-hover:opacity-90`} />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="absolute inset-4 border border-white/0 transition duration-700 group-hover:border-white/20 md:inset-6" aria-hidden="true" />
      <div className="flex w-full flex-col justify-between p-8 md:p-12">
        <span className={`font-display text-7xl ${accent} opacity-80 transition duration-700 group-hover:translate-x-2 rtl:group-hover:-translate-x-2`}>{index}</span>
        <div>
          <h3 className="font-display text-5xl leading-none transition duration-700 group-hover:-translate-y-2 md:text-6xl">{title}</h3>
          <p className="mt-4 max-w-sm leading-relaxed text-[#f7f1e3]/80 transition duration-700 group-hover:-translate-y-1">{text}</p>
          <span className={`mt-8 inline-flex items-center gap-3 text-sm tracking-wide ${accent}`}>
            {cta}
            <span className="grid size-10 place-items-center border border-current transition duration-500 group-hover:bg-[#f7f1e3] group-hover:text-ink">
              <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </span>
          </span>
        </div>
      </div>
    </a>
  )
}

function ArticleCard({ href, index, kicker, title, text }: { href: string; index: number; kicker: string; title: string; text: string }) {
  return (
    <a
      href={href}
      className="reveal group relative flex flex-col justify-between overflow-hidden border border-[#e6dcc6] bg-white/60 p-8 transition duration-500 hover:-translate-y-1.5 hover:border-gold hover:bg-white hover:shadow-[0_30px_70px_-40px_rgba(18,26,13,0.45)] md:p-10"
      style={vars({ "--d": `${(index % 2) * 6}%` })}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100 rtl:origin-right" aria-hidden="true" />
      <div className="flex items-start justify-between gap-6">
        <p className="kicker text-gold">{kicker}</p>
        <span className="font-display text-2xl text-gold/40">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div>
        <h3 className="font-display mt-10 text-3xl leading-tight md:text-4xl">{title}</h3>
        <p className="mt-4 leading-relaxed text-[#5c574e]">{text}</p>
        <span className="mt-8 inline-flex size-11 items-center justify-center border border-olive/30 text-olive transition duration-500 group-hover:border-olive group-hover:bg-olive group-hover:text-[#f7f1e3]">
          <ArrowUpRight className="size-4 transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
        </span>
      </div>
    </a>
  )
}

function Closing({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <Spotlight className="grain relative overflow-hidden bg-olive-deep px-5 py-28 text-center text-[#f7f1e3] md:py-40">
      <Blobs />
      <div className="reveal mx-auto max-w-4xl">
        <span className="mx-auto block h-16 w-px bg-gradient-to-b from-transparent to-gold-light" aria-hidden="true" />
        <h2 className="font-display text-gold-gradient mt-10 text-5xl leading-[0.98] md:text-8xl">{dict.home.closingTitle}</h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-[#f7f1e3]/70">{dict.home.closingText}</p>
        <a href={pathFor(locale, "quote")} className={`${goldButton} mt-12 px-8`}>
          {dict.ui.quote}
          <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
        </a>
      </div>
    </Spotlight>
  )
}

export function ArticleIndex({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <>
      <PageIntro copy={dict.insights} image={still("port")} crumbs={crumbs(locale, dict, "insights")} />
      <section className="bg-paper py-20 md:py-28">
        <div className={`${container} grid gap-5 md:grid-cols-2`}>
          {ARTICLE_IDS.map((id, index) => (
            <ArticleCard key={id} href={pathFor(locale, "insights", dict.articles[id].slug)} index={index} kicker={dict.articles[id].kicker} title={dict.articles[id].title} text={dict.articles[id].description} />
          ))}
        </div>
      </section>
      <Closing locale={locale} dict={dict} />
    </>
  )
}

export function ArticleView({ locale, dict, id }: { locale: Locale; dict: Dict; id: keyof Dict["articles"] }) {
  const article = dict.articles[id]
  const others = ARTICLE_IDS.filter((item) => item !== id).slice(0, 2)
  return (
    <>
      <PageIntro
        copy={article}
        image={still(id === "packaging" ? "warehouse" : id === "documents" ? "port" : "sunflower")}
        crumbs={[...crumbs(locale, dict, "insights"), { href: pathFor(locale, "insights", article.slug), label: article.title }]}
      />
      <CopyBody copy={article} />
      <section className="border-t border-[#e6dcc6] bg-ivory py-20">
        <div className={`${container} grid gap-5 md:grid-cols-2`}>
          {others.map((other, index) => (
            <ArticleCard key={other} href={pathFor(locale, "insights", dict.articles[other].slug)} index={index} kicker={dict.articles[other].kicker} title={dict.articles[other].title} text={dict.articles[other].description} />
          ))}
        </div>
      </section>
      <Closing locale={locale} dict={dict} />
    </>
  )
}

export function StandardPage({
  locale,
  dict,
  page,
  settings,
  issuedAt,
  product,
}: {
  locale: Locale
  dict: Dict
  page: Exclude<StaticPage, "home" | "insights">
  settings: Settings
  issuedAt: number
  product?: string
}) {
  const copy = page === "faq" ? dict.faq : page === "privacy" ? dict.privacy : dict.pages[page]
  const image =
    page === "sunflower" ? still("sunflower") : page === "olive" ? still("olive") : page === "wholesale" || page === "trade" || page === "privateLabel" ? still("warehouse") : still("port")
  const commercial = page === "sunflower" || page === "olive" || page === "wholesale" || page === "trade" || page === "privateLabel"
  const form = page === "quote" || page === "contact"
  return (
    <>
      <PageIntro copy={copy} image={image} crumbs={crumbs(locale, dict, page)} />
      {form ? (
        <section className="bg-paper py-20 md:py-28">
          <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]`}>
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <Kicker>{dict.home.processKicker}</Kicker>
              <ol className="mt-8 grid gap-6">
                {dict.home.steps.map((step, index) => (
                  <li key={step.t} className="grid grid-cols-[2.5rem_1fr] gap-4">
                    <span className="font-display grid size-10 place-items-center border border-gold/50 text-gold">{index + 1}</span>
                    <span>
                      <span className="font-display block text-2xl">{step.t}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-[#5c574e]">{step.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              {page === "contact" ? <p className="mt-10 text-sm leading-relaxed text-[#5c574e]">{dict.form.contactIntro}</p> : null}
              {settings.publicEmail ? (
                <a href={`mailto:${settings.publicEmail}`} className="mt-6 inline-flex items-center gap-2 border-b border-gold pb-1 text-sm text-olive">
                  {settings.publicEmail}
                </a>
              ) : null}
            </aside>
            <div className="border border-[#e6dcc6] bg-white p-6 shadow-[0_40px_100px_-60px_rgba(18,26,13,0.5)] md:p-12">
              {page === "quote" ? (
                <InquiryForm dict={dict} locale={locale} formType="rfq" product={product} issuedAt={issuedAt} />
              ) : (
                <InquiryForm dict={dict} locale={locale} formType="contact" issuedAt={issuedAt} />
              )}
            </div>
          </div>
        </section>
      ) : null}
      {!form ? <CopyBody copy={copy} /> : null}
      {page === "sunflower" || page === "olive" ? <Spec dict={dict} family={page === "sunflower" ? dict.nav.sunflower : dict.nav.olive} /> : null}
      {page === "faq" ? (
        <section className="bg-paper pb-24">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            {dict.faq.items.map((item) => (
              <details key={item.q} className="group reveal border-b border-[#e6dcc6] [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 transition-colors hover:text-olive">
                  <span className="font-display text-2xl leading-snug md:text-3xl">{item.q}</span>
                  <span className="grid size-10 shrink-0 place-items-center border border-gold/50 text-gold transition duration-500 group-open:rotate-45 group-open:bg-gold group-open:text-white">
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                </summary>
                <div className="acc">
                  <p className="max-w-3xl pb-8 leading-relaxed text-[#4a453c]">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}
      {commercial ? <QuoteBand locale={locale} dict={dict} product={page === "olive" ? "olive" : page === "sunflower" ? "sunflower" : "both"} /> : null}
      {!form && !commercial ? <Closing locale={locale} dict={dict} /> : null}
    </>
  )
}

function QuoteBand({ locale, dict, product }: { locale: Locale; dict: Dict; product: string }) {
  return (
    <Spotlight className="grain relative overflow-hidden bg-olive-deep text-[#f7f1e3]">
      <Blobs />
      <div className={`${container} flex flex-col gap-10 py-20 md:flex-row md:items-center md:justify-between md:py-24`}>
        <div className="reveal max-w-2xl">
          <Kicker tone="light">{dict.nav.quote}</Kicker>
          <h2 className="font-display mt-6 text-4xl leading-tight md:text-6xl">{dict.home.closingTitle}</h2>
          <p className="mt-5 text-[#f7f1e3]/70">{dict.home.closingText}</p>
        </div>
        <a href={`${pathFor(locale, "quote")}?product=${product}`} className={`${goldButton} reveal w-fit shrink-0 px-8`}>
          {dict.ui.quote}
          <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
        </a>
      </div>
    </Spotlight>
  )
}

function Spec({ dict, family }: { dict: Dict; family: string }) {
  const rows = [
    [dict.ui.family, family],
    [dict.ui.shipsFrom, dict.ui.shipsFromValue],
    [dict.ui.model, dict.ui.modelValue],
    [dict.ui.packing, dict.ui.packingValue],
  ]
  return (
    <section className="bg-paper pb-24">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <div className="reveal-scale border border-[#e6dcc6] bg-ivory p-8 md:p-12">
          <Kicker>{family}</Kicker>
          <h2 className="font-display mt-5 text-4xl">{dict.ui.specifications}</h2>
          <dl className="mt-8 divide-y divide-[#e0d5bd] border-y border-[#e0d5bd]">
            {rows.map(([term, value]) => (
              <div key={term} className="reveal grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
                <dt className="kicker pt-1 text-stone">{term}</dt>
                <dd className="text-lg leading-relaxed">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function CopyBody({ copy }: { copy: PageCopy }) {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]`}>
        <nav className="hidden lg:sticky lg:top-32 lg:block lg:self-start" aria-label={copy.kicker}>
          <p className="kicker text-gold">{copy.kicker}</p>
          <ol className="mt-6 grid gap-3 border-s border-[#e6dcc6] ps-5 text-sm">
            {copy.sections.map((section, index) => (
              <li key={section.h}>
                <a href={`#s-${index + 1}`} className="link-draw text-[#5c574e] transition hover:text-olive">
                  {section.h}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="max-w-3xl">
          {copy.sections.map((section, index) => (
            <section key={section.h} id={`s-${index + 1}`} className="reveal scroll-mt-32 border-t border-[#e6dcc6] pt-10 first:border-t-0 first:pt-0 [&+section]:mt-14">
              <p className="font-display text-xl text-gold">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="font-display mt-3 text-4xl leading-tight md:text-5xl">{section.h}</h2>
              {section.p.map((paragraph, paragraphIndex) => (
                <p key={paragraph} className={`mt-5 leading-[1.8] text-[#3c3832] ${paragraphIndex === 0 ? "text-lg md:text-xl" : ""}`}>
                  {paragraph}
                </p>
              ))}
              {section.b ? (
                <ul className="mt-7 grid gap-3">
                  {section.b.map((item) => (
                    <li key={item} className="flex items-start gap-4 border border-[#ece3cf] bg-white/60 px-5 py-4">
                      <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                      <span className="text-[#3c3832]">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </div>
    </section>
  )
}

function PageIntro({ copy, image, crumbs }: { copy: PageCopy; image: string; crumbs: { href: string; label: string }[] }) {
  return (
    <section className="relative isolate flex min-h-[72vh] overflow-hidden bg-olive-deep text-[#f7f1e3]">
      <div className="hero-parallax absolute inset-0 -z-20">
        <Image src={image} alt="" fill priority className="hero-zoom object-cover" sizes="100vw" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0c1008] via-[#0c1008]/55 to-[#0c1008]/35" />
      <div className={`${container} hero-copy flex w-full flex-col justify-end pb-16 pt-36 md:pb-20`}>
        <nav className="rise mb-8 flex flex-wrap items-center gap-2 text-xs tracking-wide text-[#f7f1e3]/60" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {index > 0 ? <span className="text-gold-light/60">/</span> : null}
              <a href={crumb.href} className="transition hover:text-gold-light" aria-current={index === crumbs.length - 1 ? "page" : undefined}>
                {crumb.label}
              </a>
            </span>
          ))}
        </nav>
        <div className="rise rise-1">
          <Kicker tone="light">{copy.kicker}</Kicker>
        </div>
        <h1 className="font-display mt-6 max-w-5xl text-[clamp(2.75rem,6vw,5.75rem)] leading-[0.96] tracking-[-0.025em]">
          <Words text={copy.h1} start={0.2} />
        </h1>
        <p className="rise rise-3 mt-7 max-w-2xl text-lg leading-relaxed text-[#f7f1e3]/80">{copy.lede}</p>
      </div>
    </section>
  )
}

function crumbs(locale: Locale, dict: Dict, page: StaticPage) {
  return [
    { href: pathFor(locale, "home"), label: dict.nav.home },
    { href: pathFor(locale, page), label: dict.nav[page] },
  ]
}
