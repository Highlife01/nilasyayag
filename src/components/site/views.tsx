import Image from "next/image"
import type { CSSProperties } from "react"
import { ArrowRight, ArrowUpRight, Plus, Phone, Ship, CheckCircle2, ShieldCheck, Sparkles, Mail, ChevronDown } from "lucide-react"
import { ARTICLE_IDS } from "@/content/index"
import type { Dict, PageCopy } from "@/content/types"
import { pathFor, type Locale, type StaticPage } from "@/lib/i18n/config"
import { still, type Frame } from "@/lib/media"
import { InquiryForm } from "@/components/site/inquiry-form"
import { Showcase } from "@/components/site/hero"
import { Spotlight } from "@/components/site/motion"
import { QuoteCalculator } from "@/components/site/quote-calculator"
import { HeroBanner } from "@/components/site/hero-banner"
import { StatsStrip } from "@/components/site/stats-strip"
import { ProductShowcase } from "@/components/site/product-showcase"
import { ProductionPipeline } from "@/components/site/production-pipeline"
import { PackagingMatrix } from "@/components/site/packaging-matrix"
import { CertificationsStrip } from "@/components/site/certifications-strip"
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
    <p className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest ${tone === "light" ? "text-amber-300" : "text-emerald-800"}`}>
      <span className="h-0.5 w-6 bg-current rounded-full" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

export function HomeView({ locale, dict, frames }: { locale: Locale; dict: Dict; frames: Frame[] }) {
  const cover = frames[frames.length - 1]
  const posters = frames.slice(0, -1)
  const lead = dict.hero[0]
  const [titleStart, titleEnd] = splitTitle(lead?.title ?? dict.nav.home)
  const ribbon = dict.home.bar.split("·").map((part) => part.trim()).filter(Boolean)
  const titleWords = titleStart.split(" ").length

  return (
    <>
      <section className="relative isolate flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#f5f8f5] via-white to-white text-slate-900 pt-12 pb-14 border-b border-slate-200/80">
        {/* Soft sunlit background glows */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.08),transparent_75%)]" />
        <div className="pointer-events-none absolute -left-40 top-40 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.08),transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-20 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.08),transparent_70%)] blur-3xl" />

        <div className={`${container} flex flex-col items-center text-center`}>
          {/* Live Port / Export Desk Status Pill */}
          <div className="rise inline-flex items-center gap-2.5 rounded-full border border-emerald-300 bg-white/95 px-5 py-2 text-xs text-emerald-900 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold tracking-wide uppercase">
              {locale === "tr"
                ? "Canlı İhracat Masası • Mersin Port (MIP) & İzmir Limanı"
                : "Live Export Desk • Mersin Port (MIP) & İzmir Seaport"}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display mt-6 max-w-4xl text-[clamp(2.5rem,5.2vw,4.8rem)] font-extrabold leading-[1.05] tracking-tight text-slate-900">
            <Words text={titleStart} start={0.1} />
            {titleEnd ? (
              <span className="text-emerald-gradient block font-extrabold mt-1">
                <Words text={titleEnd} start={0.1 + titleWords * 0.055} />
              </span>
            ) : null}
          </h1>

          <p className="rise rise-3 mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            {lead?.lede ?? dict.metaDescription}
          </p>

          {/* Dual CTAs & Quality Badges */}
          <div className="rise rise-4 mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={pathFor(locale, "quote")} className="btn-shine inline-flex h-13 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-950 px-8 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:from-emerald-900 hover:to-black">
              <span>{dict.ui.quote}</span>
              <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
            </a>
            <a
              href="https://wa.me/905325000000?text=Hello%20Asia%20Oil%2C%20I%20would%20like%20to%20request%20a%20B2B%20quotation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 items-center gap-2.5 rounded-2xl border border-emerald-300 bg-white px-7 text-sm font-bold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
            >
              <Phone className="size-4 text-emerald-600" />
              <span>WhatsApp B2B Desk</span>
            </a>
            <a
              href="#products-catalog"
              className="inline-flex h-13 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
            >
              <span>{dict.ui.explore}</span>
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

      {/* Key Figures & Authority Stats Strip */}
      <StatsStrip locale={locale} />

      {/* Flagship Products Showcase with Specifications & Formats */}
      <ProductShowcase locale={locale} />

      {/* Sleek High-Contrast Marquee Ticker */}
      <div className="marquee-mask overflow-hidden border-y border-emerald-950/20 bg-[#061e14] py-4.5" aria-hidden="true">
        <div className="marquee flex w-max gap-12 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-12">
              {[...ribbon, ...ribbon].map((word, index) => (
                <span key={`${copy}-${index}`} className="font-display flex items-center gap-12 text-sm md:text-base font-bold tracking-wider uppercase text-emerald-100">
                  {word}
                  <span className="text-amber-400">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Core Categories */}
      <section className="bg-slate-50/80 py-24 md:py-32 border-b border-slate-200/80">
        <div className={container}>
          <div className="reveal grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
            <div>
              <Kicker>{dict.home.collectionsKicker}</Kicker>
              <h2 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">{dict.home.collectionsTitle}</h2>
            </div>
            <p className="max-w-md text-slate-600 md:justify-self-end leading-relaxed">{dict.home.closingText}</p>
          </div>
          <div className="mt-14 flex flex-col gap-6 md:h-[72vh] md:min-h-[34rem] md:flex-row">
            <Collection
              href={pathFor(locale, "sunflower")}
              image={still("sunflower")}
              index="01"
              title={dict.nav.sunflower}
              text={dict.home.sunText}
              cta={dict.ui.explore}
              tint="from-[#1c1404]/90 via-[#1c1404]/30"
              accent="text-amber-400"
            />
            <Collection
              href={pathFor(locale, "olive")}
              image={still("olive")}
              index="02"
              title={dict.nav.olive}
              text={dict.home.oliveText}
              cta={dict.ui.explore}
              tint="from-[#09170e]/90 via-[#09170e]/30"
              accent="text-emerald-400"
            />
          </div>
        </div>
      </section>

      {/* 5-Stage Integrated Seed-to-Port Production Pipeline */}
      <ProductionPipeline locale={locale} />

      {/* Comprehensive Packaging Solutions Matrix */}
      <PackagingMatrix locale={locale} />

      {/* Modern B2B Volume & Export Estimator Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#071d14] to-slate-950 py-24 text-white border-t border-emerald-950/40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]" />
        <div className={container}>
          <div className="reveal mb-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Ship className="size-3.5" />
              <span>{locale === "tr" ? "İhracat Konteyner & Lojistik Masası" : "Export Container & Logistics Desk"}</span>
            </div>
            <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              {locale === "tr"
                ? "Konteyner ve Sevkiyatınızı Şimdi Yapılandırın"
                : "Configure Your Container & Shipment Now"}
            </h2>
            <p className="mt-3 text-base text-slate-300 leading-relaxed max-w-2xl">
              {locale === "tr"
                ? "Dilediğiniz ambalaj ve konteyner hacmini belirleyin; Mersin Limanı çıkışlı FOB veya CIF teslimat için tek tıkla resmi teklif isteyin."
                : "Select your desired packaging and container volume; request an official FOB or CIF quotation dispatched from Mersin Port in one click."}
            </p>
          </div>
          <QuoteCalculator locale={locale} />
        </div>
      </section>

      {/* International Accreditations & Quality Certifications */}
      <CertificationsStrip locale={locale} />

      {/* Corporate Principles & Trade Assurance */}
      <section className="bg-white py-24 md:py-32 border-t border-slate-200">
        <div className={`${container} grid gap-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]`}>
          <div className="reveal lg:sticky lg:top-32 lg:self-start">
            <Kicker>{dict.home.principlesKicker}</Kicker>
            <h2 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">{dict.home.principlesTitle}</h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-600">
              {locale === "tr"
                ? "Uluslararası B2B gıda ticaretinde şeffaflık, akredite denetim ve sözleşmeye sadakat ana ilkemizdir."
                : "Transparency, accredited lab testing, and contractual integrity are the cornerstones of our international trade."}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {dict.home.principles.map((item, index) => (
              <article
                key={item.t}
                className="reveal group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/60 p-8 transition-all duration-300 hover:border-emerald-500 hover:bg-white hover:shadow-xl md:p-10"
                style={vars({ "--d": `${(index % 2) * 6}%` })}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-extrabold text-emerald-700">0{index + 1}</span>
                  <ShieldCheck className="size-5 text-emerald-600/50 group-hover:text-emerald-600 transition" />
                </div>
                <h3 className="font-display mt-6 text-2xl font-bold text-slate-900 group-hover:text-emerald-900 transition">{item.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Export Workflow */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#092217] via-[#0b291c] to-[#071a12] py-24 text-white md:py-32 border-t border-emerald-950/40">
        <div className={container}>
          <div className="reveal max-w-2xl">
            <Kicker tone="light">{dict.home.processKicker}</Kicker>
            <h2 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">{dict.home.processTitle}</h2>
          </div>
          <ol className="relative mt-16 grid gap-6 md:grid-cols-4 md:gap-6">
            {dict.home.steps.map((step, index) => (
              <li key={step.t} className="reveal group relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition duration-300 hover:border-emerald-400/40 hover:bg-white/[0.08]" style={vars({ "--d": `${index * 5}%` })}>
                <span className="font-mono relative grid size-12 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300 text-lg font-bold border border-emerald-400/30 transition duration-300 group-hover:bg-emerald-500 group-hover:text-slate-950">
                  {index + 1}
                </span>
                <h3 className="font-display mt-6 text-xl font-bold text-white">{step.t}</h3>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-300">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Warehouse & Industrial Logistics Banner */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src={still("warehouse")} alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/30 rtl:bg-gradient-to-l" />
        <div className={`${container} flex min-h-[70vh] items-center py-24`}>
          <div className="reveal-scale max-w-xl rounded-3xl border border-white/20 bg-slate-950/85 p-10 text-white shadow-2xl backdrop-blur-xl md:p-14">
            <Kicker tone="light">{dict.home.bandKicker}</Kicker>
            <h2 className="font-display mt-5 text-3xl font-extrabold leading-tight text-white md:text-5xl">{dict.home.bandTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">{dict.home.bandText}</p>
            <a href={pathFor(locale, "wholesale")} className="btn-shine group mt-8 inline-flex h-12 items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-7 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-500">
              <span>{dict.nav.wholesale}</span>
              <ArrowRight className="size-4 transition group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Buyer Insights & Export Guides */}
      <section className="bg-slate-50 py-24 md:py-32 border-t border-slate-200">
        <div className={container}>
          <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Kicker>{dict.home.answersKicker}</Kicker>
              <h2 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">{dict.home.answersTitle}</h2>
            </div>
            <a href={pathFor(locale, "insights")} className="group inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950">
              <span>{dict.ui.allInsights}</span>
              <ArrowRight className="size-4 transition group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
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
    <a href={href} className="reveal-clip group relative isolate flex min-h-[30rem] flex-1 overflow-hidden rounded-3xl border border-slate-200/60 text-white shadow-md transition-[flex-grow] duration-700 ease-out md:hover:flex-[1.35]">
      <Image src={image} alt="" fill className="-z-20 object-cover transition duration-[1600ms] ease-out group-hover:scale-110" sizes="(min-width: 768px) 60vw, 100vw" />
      <div className={`absolute inset-0 -z-10 bg-gradient-to-t ${tint} to-transparent transition-opacity duration-700 group-hover:opacity-90`} />
      <div className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="flex w-full flex-col justify-between p-8 md:p-12">
        <span className={`font-mono text-2xl font-extrabold ${accent} opacity-90 transition duration-700 group-hover:translate-x-2 rtl:group-hover:-translate-x-2`}>{index}</span>
        <div>
          <h3 className="font-display text-4xl font-extrabold leading-tight transition duration-700 group-hover:-translate-y-2 md:text-5xl">{title}</h3>
          <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-white/85 transition duration-700 group-hover:-translate-y-1">{text}</p>
          <span className={`mt-7 inline-flex items-center gap-3 text-sm font-bold tracking-wide ${accent}`}>
            <span>{cta}</span>
            <span className="grid size-9 place-items-center rounded-full bg-white/20 backdrop-blur-md text-white transition duration-500 group-hover:bg-white group-hover:text-slate-950">
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
      className="reveal group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl md:p-10"
      style={vars({ "--d": `${(index % 2) * 6}%` })}
    >
      <div className="flex items-start justify-between gap-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
          <Sparkles className="size-3 text-emerald-600" />
          <span>{kicker}</span>
        </span>
        <span className="font-mono text-xs font-bold text-slate-400">0{index + 1}</span>
      </div>
      <div>
        <h3 className="font-display mt-7 text-2xl font-bold leading-snug text-slate-900 group-hover:text-emerald-800 transition md:text-3xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
        <span className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
          <span>İncele</span>
          <ArrowUpRight className="size-4 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
        </span>
      </div>
    </a>
  )
}

function Closing({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#092217] via-[#051810] to-[#020b07] px-5 py-28 text-center text-white md:py-36 border-t border-emerald-950/40">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.15),transparent_70%)]" />
      <div className="reveal mx-auto max-w-4xl">
        <span className="mx-auto block h-12 w-px bg-gradient-to-b from-transparent to-amber-400" aria-hidden="true" />
        <h2 className="font-display mt-8 text-4xl font-extrabold tracking-tight text-white md:text-7xl">
          {dict.home.closingTitle}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base md:text-lg text-slate-300 leading-relaxed">
          {dict.home.closingText}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={pathFor(locale, "quote")}
            className="btn-shine inline-flex h-14 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-9 text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-500"
          >
            <span>{dict.ui.quote}</span>
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </a>
          <a
            href="https://wa.me/905325000000?text=Hello%20Asia%20Oil%2C%20I%20would%20like%20to%20request%20information"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-8 text-sm font-bold text-white shadow-sm backdrop-blur-md transition hover:bg-white/20"
          >
            <Phone className="size-4 text-emerald-400" />
            <span>WhatsApp B2B Desk</span>
          </a>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-300/80 font-medium">
          <span>✓ ISO 22000:2018</span>
          <span>✓ Helal & Kosher</span>
          <span>✓ Mersin International Port (MIP)</span>
          <span>✓ EUR.1 Dolaşım Sertifikası</span>
        </div>
      </div>
    </section>
  )
}

export function ArticleIndex({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <>
      <PageIntro copy={dict.insights} image={still("port")} crumbs={crumbs(locale, dict, "insights")} />
      <section className="bg-slate-50/70 py-20 md:py-28 border-t border-slate-200">
        <div className={`${container} grid gap-6 md:grid-cols-2`}>
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
      <section className="border-t border-slate-200 bg-slate-50/80 py-20">
        <div className={`${container} grid gap-6 md:grid-cols-2`}>
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
        <section className="bg-slate-50/80 py-20 md:py-28 border-t border-slate-200">
          <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,4.2fr)_minmax(0,7.8fr)]`}>
            <aside className="lg:sticky lg:top-32 lg:self-start space-y-6">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>{locale === "tr" ? "B2B İhracat Masası" : "B2B Export Desk"}</span>
                </div>
                <h3 className="font-display mt-4 text-2xl font-bold text-slate-900">
                  {page === "quote" ? dict.nav.quote : dict.nav.contact}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {dict.form.contactIntro || (locale === "tr"
                    ? "Talebiniz doğrudan Mersin Uluslararası Limanı (MIP) ihracat masamıza iletilir. İncelemenin ardından resmi proforma fatura ve laboratuvar spesifikasyon dosyası tarafınıza sunulur."
                    : "Your RFQ goes straight to our Mersin Port export desk. Proforma invoice and spec sheet provided upon review.")}
                </p>

                <div className="mt-6 space-y-3 pt-6 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Ship className="size-4 text-emerald-600 shrink-0" />
                    <span>Mersin Port (MIP) & İzmir Seaport</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Mail className="size-4 text-amber-500 shrink-0" />
                    <a href={`mailto:${settings.publicEmail || "export@asiaoil.com.tr"}`} className="text-emerald-700 font-semibold hover:underline">
                      {settings.publicEmail || "export@asiaoil.com.tr"}
                    </a>
                  </div>
                </div>
              </div>

              {/* 4 Steps quick guidance */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {locale === "tr" ? "İhracat Süreci" : "Quotation Steps"}
                </h4>
                <ol className="mt-4 space-y-4">
                  {dict.home.steps.map((step, index) => (
                    <li key={step.t} className="flex items-start gap-3">
                      <span className="font-mono flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
                        0{index + 1}
                      </span>
                      <div>
                        <span className="block text-sm font-bold text-slate-900">{step.t}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{step.d}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-xl">
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
        <section className="bg-slate-50/70 py-20 pb-28 border-t border-slate-200">
          <div className="mx-auto max-w-4xl px-5 md:px-10">
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                <Sparkles className="size-3.5 text-emerald-600" />
                <span>{locale === "tr" ? "Sıkça Sorulan Sorular" : "Frequently Asked Questions"}</span>
              </span>
              <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                {locale === "tr" ? "B2B İhracat ve Sipariş Rehberi" : "B2B Export & Ordering Guide"}
              </h2>
            </div>
            <div className="space-y-4">
              {dict.faq.items.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 transition hover:text-emerald-800">
                    <span className="font-display text-xl font-bold leading-snug text-slate-900 group-hover:text-emerald-800 md:text-2xl">{item.q}</span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition duration-300 group-open:rotate-180 group-open:bg-emerald-100 group-open:text-emerald-800">
                      <ChevronDown className="size-4" aria-hidden="true" />
                    </span>
                  </summary>
                  <div className="acc">
                    <p className="max-w-3xl pt-5 text-sm md:text-base leading-relaxed text-slate-600">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#092217] via-[#051810] to-[#020b07] py-20 text-white md:py-28 border-t border-emerald-950/40">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.15),transparent_70%)]" />
      <div className={`${container} flex flex-col gap-10 md:flex-row md:items-center md:justify-between`}>
        <div className="reveal max-w-2xl">
          <Kicker tone="light">{dict.nav.quote}</Kicker>
          <h2 className="font-display mt-4 text-3xl font-extrabold text-white md:text-5xl">{dict.home.closingTitle}</h2>
          <p className="mt-4 text-sm md:text-base text-slate-300 leading-relaxed">{dict.home.closingText}</p>
        </div>
        <a
          href={`${pathFor(locale, "quote")}?product=${product}`}
          className="btn-shine inline-flex h-13 shrink-0 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-500"
        >
          <span>{dict.ui.quote}</span>
          <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </a>
      </div>
    </section>
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
    <section className="bg-slate-50/70 pb-24 border-t border-slate-200/80">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-12">
          <Kicker>{family}</Kicker>
          <h2 className="font-display mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl">{dict.ui.specifications}</h2>
          <dl className="mt-8 divide-y divide-slate-100 border-y border-slate-100">
            {rows.map(([term, value]) => (
              <div key={term} className="reveal grid gap-2 py-5 md:grid-cols-[16rem_1fr] md:gap-8">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-1">{term}</dt>
                <dd className="text-base md:text-lg font-medium text-slate-800 leading-relaxed">{value}</dd>
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
    <section className="bg-slate-50/70 py-20 md:py-28 border-t border-slate-200">
      <div className={`${container} grid gap-14 lg:grid-cols-[minmax(0,3.5fr)_minmax(0,8.5fr)]`}>
        <nav className="hidden lg:sticky lg:top-32 lg:block lg:self-start" aria-label={copy.kicker}>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">{copy.kicker}</p>
            <ol className="mt-5 space-y-3 text-sm">
              {copy.sections.map((section, index) => (
                <li key={section.h}>
                  <a
                    href={`#s-${index + 1}`}
                    className="block text-slate-600 transition hover:text-emerald-800 font-medium hover:translate-x-1 duration-200"
                  >
                    {section.h}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <article className="space-y-10">
          {copy.sections.map((section, index) => (
            <section
              key={section.h}
              id={`s-${index + 1}`}
              className="reveal scroll-mt-32 rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm"
            >
              <span className="font-mono inline-flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
                0{index + 1}
              </span>
              <h2 className="font-display mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">{section.h}</h2>
              {section.p.map((paragraph, paragraphIndex) => (
                <p key={paragraph} className={`mt-5 leading-relaxed text-slate-600 ${paragraphIndex === 0 ? "text-base md:text-lg text-slate-700 font-medium" : "text-sm md:text-base"}`}>
                  {paragraph}
                </p>
              ))}
              {section.b ? (
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {section.b.map((item) => (
                    <li key={item} className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 text-sm font-semibold text-slate-800">
                      <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
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
    <section className="relative isolate flex min-h-[44vh] md:min-h-[50vh] flex-col justify-center overflow-hidden bg-[#092217] text-white pt-28 pb-16">
      <div className="hero-parallax absolute inset-0 -z-20">
        <Image src={image} alt="" fill priority className="hero-zoom object-cover opacity-35" sizes="100vw" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061e14] via-[#092217]/80 to-[#04140e]/90" />
      <div className={`${container} flex w-full flex-col justify-center`}>
        <nav className="rise mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-emerald-200/80" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {index > 0 ? <span className="text-emerald-400/50">/</span> : null}
              <a href={crumb.href} className="transition hover:text-white" aria-current={index === crumbs.length - 1 ? "page" : undefined}>
                {crumb.label}
              </a>
            </span>
          ))}
        </nav>
        <div className="rise rise-1">
          <Kicker tone="light">{copy.kicker}</Kicker>
        </div>
        <h1 className="font-display mt-4 max-w-4xl text-3xl font-extrabold tracking-tight text-white md:text-6xl">
          <Words text={copy.h1} start={0.2} />
        </h1>
        <p className="rise rise-3 mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-slate-200">{copy.lede}</p>
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
