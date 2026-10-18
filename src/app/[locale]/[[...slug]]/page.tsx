import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { articleIdBySlug, getDict } from "@/content/index"
import { SiteFrame } from "@/components/site/chrome"
import { ArticleIndex, ArticleView, HomeView, StandardPage } from "@/components/site/views"
import { insightBase, isLocale, matchStatic, pathFor, type Locale, type StaticPage } from "@/lib/i18n/config"
import { heroFrames } from "@/lib/media"
import { getCorporateSettings } from "@/server/runtime"
import { siteUrl } from "@/lib/site"
import { VisitBeacon } from "@/components/site/visit-beacon"

import {
  buildHreflangAlternates,
  buildPageJsonLd,
  getKeywordsForPage,
  getSeoDescriptionForPage,
  getSeoTitleForPage,
  OG_LOCALES,
} from "@/lib/seo-schema"

type Params = { locale: string; slug?: string[] }

function formIssuedAt() {
  return Date.now()
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolved = await resolve(params)
  if (!resolved) return {}
  const { locale, dict, page, article } = resolved
  const title = getSeoTitleForPage(locale, page, dict, article)
  const description = getSeoDescriptionForPage(locale, page, dict, article)
  const canonical = siteUrl() + pathFor(locale, page, article ? dict.articles[article].slug : undefined)
  const languages = buildHreflangAlternates(page, article)
  const ogLocale = OG_LOCALES[locale] || "en_US"
  const alternateOgLocales = (["tr", "en", "ar", "ru", "de", "fr", "es", "it"] as Locale[])
    .filter((l) => l !== locale)
    .map((l) => OG_LOCALES[l])
  const keywords = getKeywordsForPage(locale, page, article)
  const ogImage =
    page === "sunflower"
      ? `${siteUrl()}/media/stills/sunflower.webp`
      : page === "olive"
      ? `${siteUrl()}/media/stills/olive.webp`
      : `${siteUrl()}/media/hero/master-banner.webp`

  return {
    title,
    description,
    keywords,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Asia Oil",
      locale: ogLocale,
      alternateLocale: alternateOgLocales,
      type: article ? "article" : "website",
      images: [
        {
          url: ogImage,
          width: 2400,
          height: 1344,
          alt: `${title} - Asia Oil Global Export`,
          type: "image/webp",
        },
      ],
      ...(article
        ? {
            publishedTime: "2025-01-15T08:00:00.000Z",
            modifiedTime: new Date().toISOString(),
            authors: ["Asia Oil Technical Export Desk"],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "geo.region": "TR-33;TR-35",
      "geo.placename": "Mersin International Port (MIP) & İzmir Seaport, Türkiye",
      "geo.position": "36.7950;34.6400",
      "ICBM": "36.7950, 34.6400",
      "geo.country": "TR",
      "DC.title": title,
      "DC.description": description,
      "DC.language": locale,
      "DC.coverage": "Worldwide",
      "llms-dossier": `${siteUrl()}/llms.txt`,
      "llms-full-dossier": `${siteUrl()}/llms-full.txt`,
      "format-detection": "telephone=yes, address=yes, email=yes",
    },
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
  const initialInquiry = {
    product: typeof query.product === "string" ? query.product : undefined,
    orderType: typeof query.orderType === "string" ? query.orderType : undefined,
    quantity: typeof query.quantity === "string" ? query.quantity : undefined,
    packaging: typeof query.packaging === "string" ? query.packaging : undefined,
    destinationPort: typeof query.destinationPort === "string" ? query.destinationPort : undefined,
    containerType: typeof query.containerType === "string" ? query.containerType : undefined,
  }
  const product = initialInquiry.product
  const settings = await getCorporateSettings()
  const articleSlug = article ? dict.articles[article].slug : undefined
  const issuedAt = formIssuedAt()
  const canonicalUrl = siteUrl() + pathFor(locale, page, articleSlug)

  const jsonLdGraph = buildPageJsonLd({
    locale,
    dict,
    page,
    articleId: article,
    canonicalUrl,
  })

  return (
    <SiteFrame locale={locale} dict={dict} page={page} articleSlug={articleSlug} settings={settings}>
      <Suspense fallback={null}>
        <VisitBeacon />
      </Suspense>
      {page === "home" ? <HomeView locale={locale} dict={dict} frames={heroFrames()} /> : null}
      {page === "insights" && !article ? <ArticleIndex locale={locale} dict={dict} /> : null}
      {article ? <ArticleView locale={locale} dict={dict} id={article} /> : null}
      {page !== "home" && page !== "insights" ? (
        <StandardPage locale={locale} dict={dict} page={page} settings={settings} issuedAt={issuedAt} product={product} initialInquiry={initialInquiry} />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdGraph),
        }}
      />
    </SiteFrame>
  )
}
