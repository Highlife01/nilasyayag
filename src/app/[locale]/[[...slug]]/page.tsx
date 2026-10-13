import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { articleIdBySlug, getDict } from "@/content/index"
import { SiteFrame } from "@/components/site/chrome"
import { ArticleIndex, ArticleView, HomeView, StandardPage } from "@/components/site/views"
import { insightBase, isLocale, matchStatic, pathFor, type Locale, type StaticPage } from "@/lib/i18n/config"
import { heroFrames } from "@/lib/media"
import { getRepo } from "@/server/runtime"
import { CONTACT_PHONE, siteUrl } from "@/lib/site"
import { normalizeControl } from "@/lib/model"
import { parseQuoteQuery, quoteReturnPath } from "@/lib/quote"
import { VisitBeacon } from "@/components/site/visit-beacon"

type Params = { locale: string; slug?: string[] }

function formIssuedAt() {
  return Date.now()
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolved = await resolve(params)
  if (!resolved) return {}
  const { locale, dict, page, article } = resolved
  const copy = article ? dict.articles[article] : page === "home" ? null : page === "insights" ? dict.insights : page === "faq" ? dict.faq : page === "privacy" ? dict.privacy : dict.pages[page]
  const title = page === "home" ? dict.nav.home : copy?.title || dict.nav.home
  const description = page === "home" ? dict.metaDescription : copy?.description || dict.metaDescription
  const canonical = siteUrl() + pathFor(locale, page, article ? dict.articles[article].slug : undefined)
  const languages: Record<string, string> = { "x-default": siteUrl() + pathFor("en", page, article ? getDict("en").articles[article].slug : undefined) }
  for (const code of ["tr", "en", "ar", "ru", "de", "fr", "es", "it"] as Locale[]) {
    languages[code] = siteUrl() + pathFor(code, page, article ? getDict(code).articles[article].slug : undefined)
  }
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, siteName: "Asia Oil", locale },
    robots: { index: true, follow: true },
  }
}

async function resolve(params: Promise<Params>) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return null
  const dict = getDict(locale)
  const parts = slug ?? []
  if (parts.length === 0) return { locale, dict, page: "home" as StaticPage, article: null }
  if (parts.length === 2 && parts[0] === insightBase(locale)) {
    const article = articleIdBySlug(locale, parts[1] || "")
    if (!article) return null
    return { locale, dict, page: "insights" as StaticPage, article }
  }
  const page = matchStatic(locale, parts)
  if (!page) return null
  return { locale, dict, page, article: null }
}

export default async function LocalePage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolved = await resolve(params)
  if (!resolved) notFound()
  const { locale, dict, page, article } = resolved
  const query = await searchParams
  const prefill = parseQuoteQuery(query)
  let settings = normalizeControl(null).settings
  try {
    settings = await (await getRepo()).getSettings()
  } catch (error) {
    console.warn("Public settings unavailable:", error)
  }
  const jar = await cookies()
  const consent = jar.get("nilasya_consent")?.value
  const articleSlug = article ? dict.articles[article].slug : undefined
  const returnTo = page === "quote" ? quoteReturnPath(locale, query) : pathFor(locale, page, articleSlug)
  const issuedAt = formIssuedAt()
  return (
    <SiteFrame locale={locale} dict={dict} page={page} articleSlug={articleSlug} settings={settings} consent={consent} returnTo={returnTo}>
      {consent === "all" ? <VisitBeacon /> : null}
      {page === "home" ? <HomeView locale={locale} dict={dict} frames={heroFrames()} /> : null}
      {page === "insights" && !article ? <ArticleIndex locale={locale} dict={dict} /> : null}
      {article ? <ArticleView locale={locale} dict={dict} id={article} /> : null}
      {page !== "home" && page !== "insights" ? (
        <StandardPage locale={locale} dict={dict} page={page} settings={settings} issuedAt={issuedAt} prefill={prefill} />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Corporation",
              name: "Asia Oil",
              legalName: "Asia Oil",
              url: siteUrl(),
              logo: `${siteUrl()}/icon.svg`,
              image: `${siteUrl()}/media/hero/master-banner.webp`,
              email: "export@asiaoil.com.tr",
              telephone: CONTACT_PHONE,
              address: {
                "@type": "PostalAddress",
                addressCountry: "TR",
                addressLocality: "Mersin / İzmir",
                addressRegion: "Akdeniz & Ege",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "36.7950",
                longitude: "34.6400",
              },
              areaServed: [
                { "@type": "AdministrativeArea", name: "Worldwide" },
                { "@type": "AdministrativeArea", name: "Middle East" },
                { "@type": "AdministrativeArea", name: "European Union" },
                { "@type": "AdministrativeArea", name: "North America" },
                { "@type": "AdministrativeArea", name: "Africa" },
                { "@type": "AdministrativeArea", name: "Central Asia" },
              ],
              knowsAbout: [
                "Refined Sunflower Oil (HS 1512.19)",
                "Extra Virgin Olive Oil (HS 1509.20)",
                "Bulk Edible Oil Export",
                "FOB Mersin & CIF Port Logistics",
                "Private Label Edible Oils",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "export@asiaoil.com.tr",
                contactType: "sales and export desk",
                availableLanguage: ["Turkish", "English", "Arabic", "Russian", "German", "French", "Spanish", "Italian"],
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Asia Oil",
              url: siteUrl(),
              inLanguage: ["tr", "en", "ar", "ru", "de", "fr", "es", "it"],
            },
          ]),
        }}
      />
    </SiteFrame>
  )
}
