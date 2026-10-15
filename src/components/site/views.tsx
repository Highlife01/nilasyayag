import Image from "next/image"
import type { CSSProperties } from "react"
import { ArrowRight, ArrowUpRight, Phone, Ship, CheckCircle2, ShieldCheck, Sparkles, Mail, ChevronDown } from "lucide-react"
import { ARTICLE_IDS } from "@/content/index"
import type { Dict, PageCopy } from "@/content/types"
import { pathFor, type Locale, type StaticPage } from "@/lib/i18n/config"
import { still, type Frame } from "@/lib/media"
import { InquiryForm, type InitialInquiryValues } from "@/components/site/inquiry-form"
import { QuoteCalculator } from "@/components/site/quote-calculator"
import { HeroBanner } from "@/components/site/hero-banner"
import { StatsStrip } from "@/components/site/stats-strip"
import { ProductShowcase } from "@/components/site/product-showcase"
import { ProductionPipeline } from "@/components/site/production-pipeline"
import { PackagingMatrix } from "@/components/site/packaging-matrix"
import { CertificationsStrip } from "@/components/site/certifications-strip"
import { WhyUsSection } from "@/components/site/why-us"
import type { Settings } from "@/lib/model"

const container = "mx-auto w-full px-5 sm:px-8 lg:px-14 xl:px-20 2xl:px-28"
const vars = (values: Record<string, string>) => values as CSSProperties

/** Headline split into words; each word slides up from a mask with a stagger. */
function Words({ text, start = 0, step = 0.055 }: { text: string; start?: number; step?: number }) {
  return text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`} className="mask-word">
      <span style={vars({ "--i": `${start + index * step}s` })}>{word}</span>{" "}
    </span>
  ))
}

function Kicker({ children, tone = "dark" }: { children: string; tone?: "dark" | "light" }) {
  return (
    <p className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest ${tone === "light" ? "text-amber-300" : "text-emerald-800"}`}>
      <span className="h-0.5 w-6 bg-current rounded-full" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

export function HomeView({ locale, dict }: { locale: Locale; dict: Dict; frames?: Frame[] }) {
  return (
    <>
      {/* Immersive Full-Bleed 5-Slide Hero Section with Controller & Marquee */}
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

      {/* Key Figures & Authority Stats Strip */}
      <StatsStrip locale={locale} />

      {/* B2B Excellence: Why Sourcing Teams Choose Asia Oil (4-Card Grid) */}
      <WhyUsSection locale={locale} />

      {/* Flagship Products Showcase with Catalog Cards, Specifications & Formats */}
      <ProductShowcase locale={locale} />

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
              <ArticleCard key={id} href={pathFor(locale, "insights", dict.articles[id].slug)} index={index} kicker={dict.articles[id].kicker} title={dict.articles[id].h1} text={dict.articles[id].lede} label={dict.ui.explore} />
            ))}
          </div>
        </div>
      </section>

      <Closing locale={locale} dict={dict} />
    </>
  )
}

function ArticleCard({ href, index, kicker, title, text, label }: { href: string; index: number; kicker: string; title: string; text: string; label?: string }) {
  return (
    <a
      href={href}
      className="reveal group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-600 hover:shadow-2xl md:p-10"
      style={vars({ "--d": `${(index % 2) * 6}%` })}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-200 border border-emerald-500/40 shadow-sm">
          <Sparkles className="size-3 text-amber-400" />
          <span>{kicker}</span>
        </span>
        <span className="font-mono inline-flex size-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-700 transition group-hover:bg-emerald-700 group-hover:text-white">
          0{index + 1}
        </span>
      </div>
      <div>
        <h3 className="font-display mt-7 text-2xl font-black leading-snug text-slate-950 group-hover:text-emerald-800 transition md:text-3xl">
          {title}
        </h3>
        <p className="mt-3.5 text-sm md:text-base leading-relaxed text-slate-600 font-medium">{text}</p>
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-extrabold text-slate-900 transition group-hover:bg-emerald-700 group-hover:text-white">
            <span>{label || "İncele"}</span>
            <ArrowUpRight className="size-4 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
          </span>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            ASIA OIL DESK
          </span>
        </div>
      </div>
    </a>
  )
}

function Closing({ locale, dict }: { locale: Locale; dict: Dict }) {
  const isTr = locale === "tr"
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
          <span>✓ {isTr ? "Helal & Kosher Sertifikalı" : "Halal & Kosher Certified"}</span>
          <span>✓ Mersin International Port (MIP)</span>
          <span>✓ {isTr ? "EUR.1 Dolaşım Sertifikası" : "EUR.1 Movement Certificate"}</span>
        </div>
      </div>
    </section>
  )
}

export function ArticleIndex({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <>
      <PageIntro locale={locale} dict={dict} copy={dict.insights} image={still("port")} crumbs={crumbs(locale, dict, "insights")} />
      <section className="relative bg-gradient-to-b from-slate-100/80 via-white to-slate-50 py-20 md:py-28 border-t border-slate-200">
        <div className={`${container} grid gap-8 md:grid-cols-2`}>
          {ARTICLE_IDS.map((id, index) => (
            <ArticleCard key={id} href={pathFor(locale, "insights", dict.articles[id].slug)} index={index} kicker={dict.articles[id].kicker} title={dict.articles[id].title} text={dict.articles[id].description} label={dict.ui.read} />
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
        locale={locale}
        dict={dict}
        copy={article}
        image={still(id === "packaging" ? "warehouse" : id === "documents" ? "port" : "sunflower")}
        crumbs={[...crumbs(locale, dict, "insights"), { href: pathFor(locale, "insights", article.slug), label: article.title }]}
      />
      <CopyBody copy={article} locale={locale} dict={dict} />
      <section className="border-t border-slate-200 bg-slate-100/70 py-20 md:py-24">
        <div className={container}>
          <div className="mb-10 flex items-center justify-between">
            <div>
              <Kicker>{dict.nav.insights}</Kicker>
              <h2 className="font-display mt-2 text-2xl font-black text-slate-950 md:text-4xl">
                {locale === "tr" ? "Diğer İhracat Rehberleri" : "Further Export Briefings"}
              </h2>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {others.map((other, index) => (
              <ArticleCard key={other} href={pathFor(locale, "insights", dict.articles[other].slug)} index={index} kicker={dict.articles[other].kicker} title={dict.articles[other].title} text={dict.articles[other].description} label={dict.ui.read} />
            ))}
          </div>
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
  initialInquiry,
}: {
  locale: Locale
  dict: Dict
  page: Exclude<StaticPage, "home" | "insights">
  settings: Settings
  issuedAt: number
  product?: string
  initialInquiry?: InitialInquiryValues
}) {
  const copy = page === "faq" ? dict.faq : page === "privacy" ? dict.privacy : dict.pages[page]
  const image =
    page === "sunflower" ? still("sunflower") : page === "olive" ? still("olive") : page === "wholesale" || page === "trade" || page === "privateLabel" ? still("warehouse") : still("port")
  const commercial = page === "sunflower" || page === "olive" || page === "wholesale" || page === "trade" || page === "privateLabel"
  const form = page === "quote" || page === "contact"
  return (
    <>
      <PageIntro locale={locale} dict={dict} copy={copy} image={image} crumbs={crumbs(locale, dict, page)} page={page} />
      {form ? (
        <section className="relative bg-gradient-to-b from-slate-100/90 via-white to-slate-50 py-20 md:py-28 border-t border-slate-200">
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className={`${container} relative z-10 grid gap-12 lg:grid-cols-[minmax(0,4.3fr)_minmax(0,7.7fr)]`}>
            <aside className="lg:sticky lg:top-28 lg:self-start space-y-6">
              {/* Executive Dark Desk Card */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-900/60 bg-gradient-to-br from-[#092217] via-[#061810] to-[#030d08] p-8 text-white shadow-2xl">
                <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-emerald-500/15 blur-2xl" />
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/90 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-300 border border-emerald-500/40">
                  <ShieldCheck className="size-3.5 text-amber-400" />
                  <span>{locale === "tr" ? "B2B İhracat Masası" : "B2B Export Desk"}</span>
                </div>
                <h3 className="font-display mt-5 text-2xl md:text-3xl font-black text-white">
                  {page === "quote" ? dict.nav.quote : dict.nav.contact}
                </h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  {dict.form.contactIntro || (locale === "tr"
                    ? "Talebiniz doğrudan Mersin Uluslararası Limanı (MIP) ihracat masamıza iletilir. İncelemenin ardından resmi proforma fatura ve laboratuvar spesifikasyon dosyası tarafınıza sunulur."
                    : "Your RFQ goes straight to our Mersin Port export desk. Proforma invoice and spec sheet provided upon review.")}
                </p>

                <div className="mt-6 space-y-3.5 pt-6 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-3 text-emerald-100 font-semibold">
                    <span className="grid size-8 place-items-center rounded-xl bg-white/10 text-emerald-300 shrink-0">
                      <Ship className="size-4" />
                    </span>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-emerald-300/70">
                        {locale === "tr" ? "Ana Çıkış Limanları" : "Primary Dispatch Ports"}
                      </span>
                      <span>Mersin Port (MIP) & İzmir Seaport</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-emerald-100 font-semibold">
                    <span className="grid size-8 place-items-center rounded-xl bg-white/10 text-amber-300 shrink-0">
                      <Mail className="size-4" />
                    </span>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-emerald-300/70">
                        {locale === "tr" ? "Resmi İhracat E-Posta" : "Official Export Desk"}
                      </span>
                      <a href={`mailto:${settings.publicEmail || "export@asiaoil.com.tr"}`} className="text-amber-300 font-bold hover:underline">
                        {settings.publicEmail || "export@asiaoil.com.tr"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Steps Executive Timeline */}
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-7 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-900">
                    {locale === "tr" ? "4 Adımda İhracat Süreci" : "4-Step Quotation Workflow"}
                  </h4>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-200">
                    FOB / CIF
                  </span>
                </div>
                <ol className="mt-5 space-y-5">
                  {dict.home.steps.map((step, index) => (
                    <li key={step.t} className="relative flex items-start gap-3.5">
                      <span className="font-mono flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-950 text-xs font-black text-emerald-300 shadow-sm">
                        0{index + 1}
                      </span>
                      <div>
                        <span className="block text-sm font-black text-slate-950">{step.t}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-slate-600 font-medium">{step.d}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-white p-8 md:p-12 shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-500" />
              {page === "quote" ? (
                <InquiryForm dict={dict} locale={locale} formType="rfq" product={product} initialValues={initialInquiry} issuedAt={issuedAt} />
              ) : (
                <InquiryForm dict={dict} locale={locale} formType="contact" initialValues={initialInquiry} issuedAt={issuedAt} />
              )}
            </div>
          </div>
        </section>
      ) : null}
      {!form ? <CopyBody copy={copy} locale={locale} dict={dict} page={page} /> : null}
      {page === "sunflower" || page === "olive" ? <Spec family={page === "sunflower" ? dict.nav.sunflower : dict.nav.olive} page={page} locale={locale} /> : null}
      {commercial ? (
        <section className="bg-gradient-to-b from-slate-900 via-[#071d14] to-slate-950 py-20 text-white border-t border-emerald-950/40">
          <div className={container}>
            <QuoteCalculator locale={locale} />
          </div>
        </section>
      ) : null}
      {page === "faq" ? (
        <section className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100/70 py-20 pb-28 border-t border-slate-200">
          <div className="mx-auto max-w-5xl px-5 md:px-10">
            <div className="mb-12 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-200 border border-emerald-500/40 shadow-sm">
                <Sparkles className="size-3.5 text-amber-400" />
                <span>{locale === "tr" ? "Sıkça Sorulan Sorular" : "Frequently Asked Questions"}</span>
              </span>
              <h2 className="font-display mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                {locale === "tr" ? "B2B İhracat ve Sipariş Rehberi" : "B2B Export & Ordering Guide"}
              </h2>
            </div>
            <div className="space-y-4">
              {dict.faq.items.map((item, idx) => (
                <details
                  key={item.q}
                  open={idx === 0}
                  className="group rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-md transition-all hover:border-emerald-500 open:border-emerald-700 open:ring-4 open:ring-emerald-600/10 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 transition">
                    <div className="flex items-center gap-4">
                      <span className="font-mono inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-700 transition group-open:bg-emerald-800 group-open:text-white">
                        0{idx + 1}
                      </span>
                      <span className="font-display text-lg font-black leading-snug text-slate-950 group-hover:text-emerald-800 md:text-2xl">
                        {item.q}
                      </span>
                    </div>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 transition duration-300 group-open:rotate-180 group-open:bg-emerald-800 group-open:text-white">
                      <ChevronDown className="size-4" aria-hidden="true" />
                    </span>
                  </summary>
                  <div className="acc">
                    <p className="max-w-4xl pt-5 pl-13 text-sm md:text-base leading-relaxed text-slate-700 font-medium">
                      {item.a}
                    </p>
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

function Spec({ family, page, locale }: { family: string; page?: string; locale?: Locale }) {
  const isTr = locale === "tr"
  const isOlive = page === "olive"

  const chemicalSpecs = isOlive
    ? [
        {
          name: isTr ? "Gümrük Tarife İstatistik Pozisyonu (GTİP / HS Code)" : "Harmonized System Code (HS Code)",
          value: isTr ? "1509.20.00.00 (Natürel Sızma Zeytinyağı)" : "1509.20.00.00 (Extra Virgin Olive Oil)",
        },
        {
          name: isTr ? "Serbest Yağ Asitliği (Oleik Asit Cinsinden)" : "Free Fatty Acidity (as Oleic Acid)",
          value: isTr ? "≤ %0.80 (Standart İhracat) / ≤ %0.40 (Ultra Premium)" : "≤ 0.80% (Standard Export) / ≤ 0.40% (Ultra Premium)",
          highlight: true,
        },
        {
          name: isTr ? "Peroksit Değeri" : "Peroxide Value",
          value: "≤ 15 meq O₂/kg",
        },
        {
          name: isTr ? "Ultraviyole Spektrofotometrik Analiz (K232)" : "UV Absorbance (K232)",
          value: "≤ 2.50",
        },
        {
          name: isTr ? "Ultraviyole Spektrofotometrik Analiz (K270)" : "UV Absorbance (K270)",
          value: "≤ 0.22",
        },
        {
          name: isTr ? "Delta K Değeri (ΔK)" : "Delta K (ΔK)",
          value: "≤ 0.01",
        },
        {
          name: isTr ? "Sıkım Yöntemi & Sıcaklığı" : "Extraction Method & Temperature",
          value: isTr ? "Soğuk Sıkım (Cold Pressed) ≤ 27°C (Hasattan sonra ilk 12 saatte)" : "Continuous Cold Extraction ≤ 27°C within 12h of harvest",
          highlight: true,
        },
        {
          name: isTr ? "Duyusal & Organoleptik Profil" : "Sensory & Organoleptic Profile",
          value: isTr ? "Meyvemsi, dengeli acılık ve yakıcılık, taze çimen ve enginar notaları" : "Medium/Intense fruity, balanced bitterness and pungency, green herbaceous notes",
        },
        {
          name: isTr ? "Çıkış Limanı & Menşei" : "Seaport & Origin",
          value: isTr ? "Mersin Uluslararası Limanı (MIP) & İzmir Limanı / Ege & Akdeniz Menşei" : "Mersin Port (MIP) & Izmir Seaport / Aegean & Mediterranean Origin",
        },
      ]
    : [
        {
          name: isTr ? "Gümrük Tarife İstatistik Pozisyonu (GTİP / HS Code)" : "Harmonized System Code (HS Code)",
          value: isTr ? "1512.19.90.00 (Rafine Ayçiçek Yağı)" : "1512.19.90.00 (Refined Sunflower Oil)",
        },
        {
          name: isTr ? "Serbest Yağ Asitliği (Oleik Asit Cinsinden)" : "Free Fatty Acidity (FFA as Oleic)",
          value: isTr ? "≤ %0.10 (Standart İhracat Spesifikasyonu)" : "≤ 0.10% (Standard Export Specification)",
          highlight: true,
        },
        {
          name: isTr ? "Peroksit Değeri (Fabrika Çıkış)" : "Peroxide Value (Ex-Factory)",
          value: "≤ 1.0 meq O₂/kg",
        },
        {
          name: isTr ? "Nem ve Uçucu Madde Oranı" : "Moisture & Volatile Matter",
          value: "≤ 0.05%",
        },
        {
          name: isTr ? "Renk (Lovibond 5 ¼” Hücrede)" : "Color (Lovibond 5 ¼” Cell)",
          value: isTr ? "≤ 1.0 Kırmızı / 10 Sarı (Berrak, açık altın sarısı)" : "≤ 1.0 Red / 10 Yellow (Clear golden yellow)",
        },
        {
          name: isTr ? "Dumanlanma Noktası (Smoke Point)" : "Smoke Point",
          value: isTr ? "≥ 232°C (Yüksek termal stabilite & kızartma direnci)" : "≥ 232°C (High thermal stability & deep frying resilience)",
          highlight: true,
        },
        {
          name: isTr ? "Koku ve Tat" : "Odor and Taste",
          value: isTr ? "Doğal nötr, yabancı koku ve tortudan tamamen arındırılmış" : "Bland, neutral, completely free from foreign odors and rancidity",
        },
        {
          name: isTr ? "Yoğunluk (20°C)" : "Specific Gravity (20°C)",
          value: "0.918 – 0.923 g/cm³",
        },
        {
          name: isTr ? "Çıkış Limanı & Menşei" : "Seaport & Origin",
          value: isTr ? "Mersin Uluslararası Limanı (MIP) / Çukurova & Trakya Menşei" : "Mersin Port (MIP), Türkiye / Mediterranean Hub",
        },
      ]

  const packagingList = [
    {
      format: "1L PET",
      carton: isTr ? "12 / 15 Şişe" : "12 / 15 Bottles",
      fcl: isTr ? "~24.000 L / 20ft FCL" : "~24,000 L / 20ft FCL",
      pallets: isTr ? "10-11 Euro Palet" : "10-11 Euro Pallets",
    },
    {
      format: "2L PET",
      carton: isTr ? "6 Şişe" : "6 Bottles",
      fcl: isTr ? "~22.000 L / 20ft FCL" : "~22,000 L / 20ft FCL",
      pallets: isTr ? "10-11 Euro Palet" : "10-11 Euro Pallets",
    },
    {
      format: isTr ? "5L PET / Teneke" : "5L PET / Tin Can",
      carton: isTr ? "4 Adet" : "4 Units",
      fcl: isTr ? "~4.400 Koli / 40ft HC" : "~4,400 Cartons / 40ft HC",
      pallets: isTr ? "Standart İhracat Paleti" : "Standard Export Pallet",
    },
    {
      format: isTr ? "18L Profesyonel Teneke" : "18L Industrial Tin Can",
      carton: isTr ? "Tekli Teneke" : "Single Tin Can",
      fcl: isTr ? "~1.200 Adet / 20ft" : "~1,200 Units / 20ft",
      pallets: isTr ? "Metal takviyeli palet" : "Reinforced Industrial Pallet",
    },
    {
      format: isTr ? "22.000L Flexitank" : "22,000L Flexitank",
      carton: isTr ? "Dökme / Flexitank" : "Bulk / Single Liner",
      fcl: isTr ? "21.500 - 22.000 L / 20ft" : "21,500 - 22,000 L / 20ft",
      pallets: isTr ? "Tek yönlü gıdaya uygun astar" : "Food-grade single-use liner",
    },
  ]

  return (
    <section className="bg-slate-100/70 pb-24 pt-6 border-t border-slate-200/80">
      <div className={container}>
        <div className="overflow-hidden rounded-3xl border-2 border-slate-300 bg-white shadow-2xl">
          {/* Accredited COA Dark Header Banner */}
          <div className="bg-gradient-to-r from-[#092217] via-[#061810] to-[#0b291c] px-8 py-8 text-white md:px-12 md:py-10 border-b-2 border-emerald-900">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-mono font-black uppercase tracking-widest text-amber-300 border border-white/15">
                  <Sparkles className="size-3.5 text-amber-400" />
                  <span>{family} • COA LAB SPEC</span>
                </span>
                <h2 className="font-display mt-3 text-2xl font-black text-white md:text-4xl">
                  {isTr ? "Laboratuvar Analiz ve Kimyasal Spesifikasyon Föyü" : "Accredited Laboratory & Chemical Specification Sheet"}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-950/90 px-4 py-2.5 text-xs font-black text-emerald-300 border border-emerald-500/40 shadow-md">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span>ISO 22000 &amp; {isOlive ? "IOC" : "Codex Stan 210"}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
              <dl className="divide-y divide-slate-200">
                {chemicalSpecs.map((item) => (
                  <div
                    key={item.name}
                    className={`grid gap-2 px-6 py-4.5 md:grid-cols-[20rem_1fr] md:gap-8 items-center transition hover:bg-slate-50 ${
                      item.highlight ? "bg-emerald-50/70" : ""
                    }`}
                  >
                    <dt className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-slate-700">
                      <span className={`size-2 rounded-full ${item.highlight ? "bg-emerald-600" : "bg-slate-300"}`} />
                      <span>{item.name}</span>
                    </dt>
                    <dd className={`text-sm md:text-base flex flex-wrap items-center justify-between gap-2 ${item.highlight ? "text-emerald-950 font-black" : "text-slate-900 font-semibold"}`}>
                      <span>{item.value}</span>
                      {item.highlight ? (
                        <span className="rounded-full bg-emerald-800 px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider text-white">
                          GARANTİLİ DEĞER
                        </span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Packaging & Logistics Specs Table */}
            <div className="mt-12">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-black text-slate-950 md:text-2xl">
                    {isTr ? "İhracat Ambalajlama & Konteyner Yükleme Matrisi" : "Export Packaging & Container Freight Matrix"}
                  </h3>
                  <p className="mt-1 text-xs md:text-sm font-medium text-slate-600">
                    {isTr
                      ? "Mersin (MIP) ve İzmir Limanı çıkışlı 20' DC, 40' HC ve Flexitank standart konteyner yükleme kapasiteleri."
                      : "Standard 20' DC, 40' HC, and bulk Flexitank loading capacities from Mersin (MIP) and Izmir Seaport."}
                  </p>
                </div>
                {locale ? (
                  <a
                    href={`${pathFor(locale, "quote")}?product=${isOlive ? "olive" : "sunflower"}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-emerald-700"
                  >
                    <span>{isTr ? "Bu Spesifikasyonla Teklif İste" : "Request Spec Quotation"}</span>
                    <ArrowRight className="size-3.5 rtl:-scale-x-100" />
                  </a>
                ) : null}
              </div>

              <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-xs uppercase font-black tracking-wider text-white">
                    <tr>
                      <th className="px-6 py-4">{isTr ? "Ambalaj Formatı" : "Packaging Format"}</th>
                      <th className="px-6 py-4">{isTr ? "Koli İçi Adet" : "Carton Qty"}</th>
                      <th className="px-6 py-4">{isTr ? "FCL Kapasitesi" : "FCL Loading Capacity"}</th>
                      <th className="px-6 py-4">{isTr ? "Paletleme Standardı" : "Palletizing Standard"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {packagingList.map((p) => (
                      <tr key={p.format} className="hover:bg-emerald-50/40 transition">
                        <td className="px-6 py-4 font-black text-slate-950">{p.format}</td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{p.carton}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-black text-emerald-900">
                            {p.fcl}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">{p.pallets}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CopyBody({ copy, locale, dict, page }: { copy: PageCopy; locale?: Locale; dict?: Dict; page?: StaticPage }) {
  const isTr = locale === "tr"
  const productParam = page === "olive" ? "olive" : page === "sunflower" ? "sunflower" : "both"

  return (
    <section className="relative bg-gradient-to-b from-slate-100/90 via-white to-slate-100/60 py-20 md:py-28 border-t border-slate-200">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className={`${container} relative z-10 grid gap-12 lg:grid-cols-[minmax(0,3.8fr)_minmax(0,8.2fr)]`}>
        <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start space-y-6">
          {/* Sticky Section Index Card */}
          <nav className="overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-white shadow-xl" aria-label={copy.kicker}>
            <div className="bg-slate-950 px-6 py-4 text-white flex items-center justify-between">
              <span className="text-[11px] font-mono font-black uppercase tracking-widest text-amber-400">
                {copy.kicker}
              </span>
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <ol className="p-5 space-y-2 text-sm">
              {copy.sections.map((section, index) => (
                <li key={section.h}>
                  <a
                    href={`#s-${index + 1}`}
                    className="group flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-950 font-bold"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-black text-slate-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                        0{index + 1}
                      </span>
                      <span className="truncate">{section.h}</span>
                    </div>
                    <ArrowRight className="size-3.5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700 rtl:-scale-x-100" />
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Direct B2B Export Desk Sticky Card */}
          {locale && dict ? (
            <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-900/60 bg-gradient-to-br from-[#092217] via-[#061810] to-[#030d08] p-6 text-white shadow-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-mono font-black uppercase tracking-wider text-emerald-300">
                <Ship className="size-3.5 text-amber-400" />
                <span>MERSİN PORT (MIP) &amp; İZMİR</span>
              </div>
              <h3 className="font-display mt-3.5 text-lg font-black text-white leading-snug">
                {isTr ? "Konteyner Bazlı Proforma & Numune Talebi" : "Request FCL Proforma & Lab Sample"}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                {isTr
                  ? "FOB, CFR ve CIF teslim şekilleriyle 20' / 40' FCL ve Flexitank yüklemeleri için ihracat masamızdan 2 saat içinde fiyat alın."
                  : "Receive a formal FOB/CIF proforma invoice and COA spec sheet from our export desk within 2 hours."}
              </p>
              <a
                href={`${pathFor(locale, "quote")}?product=${productParam}`}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 text-xs font-black text-slate-950 shadow-lg transition hover:from-amber-400 hover:to-amber-500"
              >
                <span>{dict.ui.quote}</span>
                <ArrowUpRight className="size-4 rtl:-scale-x-100" />
              </a>
            </div>
          ) : null}
        </aside>

        <article className="space-y-8">
          {copy.sections.map((section, index) => (
            <section
              key={section.h}
              id={`s-${index + 1}`}
              className="reveal group relative overflow-hidden scroll-mt-32 rounded-3xl border-2 border-slate-200/90 bg-white p-8 md:p-12 shadow-lg transition hover:border-emerald-600/60 hover:shadow-xl"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-500" />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2.5">
                  <span className="font-mono inline-flex size-9 items-center justify-center rounded-xl bg-emerald-950 text-xs font-black text-emerald-300 shadow-sm">
                    0{index + 1}
                  </span>
                  <span className="text-[11px] font-mono font-black uppercase tracking-widest text-emerald-800">
                    {copy.kicker}
                  </span>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                  ISO 22000 • SGS VERIFIED
                </span>
              </div>

              <h2 className="font-display mt-5 text-2xl font-black tracking-tight text-slate-950 md:text-4xl leading-tight">
                {section.h}
              </h2>

              <div className="mt-5 space-y-4">
                {section.p.map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraph}
                    className={`leading-relaxed ${
                      paragraphIndex === 0
                        ? "text-base md:text-lg text-slate-800 font-semibold"
                        : "text-sm md:text-base text-slate-600 font-medium"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.b ? (
                <ul className="mt-8 grid gap-3.5 sm:grid-cols-2 pt-6 border-t border-slate-100">
                  {section.b.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3.5 rounded-2xl border-2 border-slate-200/80 bg-slate-50/80 p-4 text-sm font-extrabold text-slate-900 transition hover:border-emerald-500 hover:bg-emerald-50/40"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white shadow-sm">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                      </span>
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

function PageIntro({
  copy,
  image,
  crumbs,
  locale,
  dict,
  page,
}: {
  copy: PageCopy
  image: string
  crumbs: { href: string; label: string }[]
  locale?: Locale
  dict?: Dict
  page?: StaticPage
}) {
  const isTr = locale === "tr"
  const productParam = page === "olive" ? "olive" : page === "sunflower" ? "sunflower" : "both"

  return (
    <section className="relative isolate flex min-h-[54vh] lg:min-h-[60vh] flex-col justify-center overflow-hidden bg-[#061810] text-white py-16 md:py-24 border-b-2 border-emerald-900/60">
      {/* Background High-Contrast Image & Multi-Layer Gradient */}
      <div className="hero-parallax absolute inset-0 -z-20">
        <Image src={image} alt="" fill priority quality={78} className="hero-zoom object-cover opacity-40" sizes="100vw" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#04120c] via-[#061c13]/90 via-60% to-[#04120c]/65" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(16,185,129,0.20),transparent_70%)]" />
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-20" />

      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 2xl:px-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Breadcrumbs, Kicker, Headline, Lede & Trust Pills */}
          <div className="lg:col-span-7 xl:col-span-8">
            <nav
              className="rise mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide text-emerald-200 backdrop-blur-md"
              aria-label="Breadcrumb"
            >
              {crumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-2">
                  {index > 0 ? <span className="text-emerald-400/60">/</span> : null}
                  <a
                    href={crumb.href}
                    className={`transition hover:text-white ${index === crumbs.length - 1 ? "text-white font-extrabold" : "text-emerald-200/85"}`}
                    aria-current={index === crumbs.length - 1 ? "page" : undefined}
                  >
                    {crumb.label}
                  </a>
                </span>
              ))}
            </nav>

            <div className="rise rise-1">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-emerald-950/90 border border-emerald-400/40 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-300 shadow-lg">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{copy.kicker}</span>
              </div>
            </div>

            <h1 className="font-display mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
              <Words text={copy.h1} start={0.15} />
            </h1>

            <p className="rise rise-3 mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-200 font-medium">
              {copy.lede}
            </p>

            {/* Quick Authority Badges */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              {[
                "ISO 22000 & HACCP",
                "Mersin Port (MIP) & İzmir FOB/CIF",
                "SGS / Bureau Veritas Gözetimi",
                "EUR.1 & COA Analiz Sertifikası",
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md"
                >
                  <span className="size-1.5 rounded-full bg-amber-400" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Glassmorphic Executive Export Desk Summary Card */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-7 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-md">
                    <Ship className="size-5" />
                  </span>
                  <div>
                    <span className="block text-[10px] font-mono font-black uppercase tracking-widest text-amber-300">
                      ASIA OIL EXPORT DESK
                    </span>
                    <span className="font-display text-base font-black text-white">
                      {isTr ? "Doğrudan Fabrika & Liman Çıkışı" : "Direct Refinery & Port Dispatch"}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/90 border border-emerald-400/40 px-2.5 py-1 text-[10px] font-black text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                    {isTr ? "Sevkiyat Limanı" : "Dispatch Port"}
                  </span>
                  <span className="mt-1 block font-mono font-black text-white">Mersin MIP / İzmir</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                    {isTr ? "Teslim Şekli" : "Incoterms"}
                  </span>
                  <span className="mt-1 block font-mono font-black text-white">FOB • CFR • CIF</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                    {isTr ? "Yükleme Tipi" : "Loading Mode"}
                  </span>
                  <span className="mt-1 block font-mono font-black text-white">20&apos; / 40&apos; / Flexitank</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                    {isTr ? "Proforma Süresi" : "Response SLA"}
                  </span>
                  <span className="mt-1 block font-mono font-black text-amber-300">
                    {isTr ? "≤ 2 Saat Yanıt" : "≤ 2 Hours SLA"}
                  </span>
                </div>
              </div>

              {locale && dict && page !== "quote" ? (
                <a
                  href={`${pathFor(locale, "quote")}?product=${productParam}`}
                  className="btn-shine mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-xs font-black text-slate-950 shadow-xl transition hover:from-amber-400 hover:to-amber-500"
                >
                  <span>{dict.ui.quote}</span>
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
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
