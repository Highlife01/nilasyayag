import type { MetadataRoute } from "next"
import { ARTICLE_IDS, getDict } from "@/content/index"
import { PUBLISHED_LOCALES, STATIC_PAGES, pathFor, type StaticPage } from "@/lib/i18n/config"
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
  const now = new Date()
  const urls: MetadataRoute.Sitemap = []

  for (const locale of PUBLISHED_LOCALES) {
    // 1. Static Pages
    for (const page of STATIC_PAGES) {
      const languages: Record<string, string> = {}
      for (const code of PUBLISHED_LOCALES) {
        languages[code] = siteUrl() + pathFor(code, page)
      }
      languages["x-default"] = siteUrl() + pathFor("en", page)

      urls.push({
        url: siteUrl() + pathFor(locale, page),
        lastModified: now,
        changeFrequency: getPageChangeFrequency(page),
        priority: getPagePriority(page),
        alternates: { languages },
      })
    }

    // 2. Technical Insights Articles
    for (const id of ARTICLE_IDS) {
      const languages: Record<string, string> = {}
      for (const code of PUBLISHED_LOCALES) {
        languages[code] = siteUrl() + pathFor(code, "insights", getDict(code).articles[id].slug)
      }
      languages["x-default"] = siteUrl() + pathFor("en", "insights", getDict("en").articles[id].slug)

      urls.push({
        url: siteUrl() + pathFor(locale, "insights", getDict(locale).articles[id].slug),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages },
      })
    }
  }

  return urls
}
