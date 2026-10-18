import type { MetadataRoute } from "next"
import { ARTICLE_IDS, getDict } from "@/content/index"
import { PUBLISHED_LOCALES, STATIC_PAGES, pathFor, type StaticPage } from "@/lib/i18n/config"
import { buildHreflangAlternates } from "@/lib/seo-schema"
import { siteUrl } from "@/lib/site"

function getPagePriority(page: StaticPage): number {
  switch (page) {
    case "home":
      return 1.0
    case "sunflower":
    case "olive":
    case "wholesale":
      return 0.9
    case "quote":
    case "trade":
    case "privateLabel":
    case "quality":
      return 0.8
    case "insights":
    case "contact":
    case "faq":
    case "about":
      return 0.7
    case "privacy":
    default:
      return 0.3
  }
}

function getPageChangeFrequency(page: StaticPage): "daily" | "weekly" | "monthly" | "yearly" {
  switch (page) {
    case "home":
      return "daily"
    case "sunflower":
    case "olive":
    case "wholesale":
    case "quote":
    case "trade":
    case "insights":
    case "faq":
      return "weekly"
    case "privateLabel":
    case "quality":
    case "about":
    case "contact":
      return "monthly"
    case "privacy":
    default:
      return "yearly"
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  const now = new Date()
  const urls: MetadataRoute.Sitemap = []

  for (const locale of PUBLISHED_LOCALES) {
    // 1. Static Pages
    for (const page of STATIC_PAGES) {
      const languages = buildHreflangAlternates(page, null)
      const images =
        page === "sunflower"
          ? [`${base}/media/stills/sunflower.webp`, `${base}/media/hero/master-banner.webp`]
          : page === "olive"
          ? [`${base}/media/stills/olive.webp`, `${base}/media/hero/master-banner.webp`]
          : page === "home"
          ? [
              `${base}/media/hero/master-banner.webp`,
              `${base}/media/stills/sunflower.webp`,
              `${base}/media/stills/olive.webp`,
              `${base}/media/hero/banner-signature.webp`,
              `${base}/media/stills/warehouse.webp`,
            ]
          : [`${base}/media/hero/master-banner.webp`]

      urls.push({
        url: base + pathFor(locale, page),
        lastModified: now,
        changeFrequency: getPageChangeFrequency(page),
        priority: getPagePriority(page),
        alternates: { languages },
        images,
      })
    }

    // 2. Technical Insights Articles
    for (const id of ARTICLE_IDS) {
      const languages = buildHreflangAlternates("insights", id)

      urls.push({
        url: base + pathFor(locale, "insights", getDict(locale).articles[id].slug),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages },
        images: [`${base}/media/hero/master-banner.webp`],
      })
    }
  }

  return urls
}
