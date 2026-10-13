import type { MetadataRoute } from "next"
import { ARTICLE_IDS, getDict } from "@/content/index"
import { PUBLISHED_LOCALES, STATIC_PAGES, pathFor } from "@/lib/i18n/config"
import { siteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  const urls: MetadataRoute.Sitemap = []
  for (const locale of PUBLISHED_LOCALES) {
    for (const page of STATIC_PAGES) {
      const languages: Record<string, string> = {}
      for (const code of PUBLISHED_LOCALES) languages[code] = base + pathFor(code, page)
      languages["x-default"] = base + pathFor("en", page)
      urls.push({ url: base + pathFor(locale, page), alternates: { languages } })
    }
    for (const id of ARTICLE_IDS) {
      const languages: Record<string, string> = {}
      for (const code of PUBLISHED_LOCALES) languages[code] = base + pathFor(code, "insights", getDict(code).articles[id].slug)
      languages["x-default"] = base + pathFor("en", "insights", getDict("en").articles[id].slug)
      urls.push({
        url: base + pathFor(locale, "insights", getDict(locale).articles[id].slug),
        alternates: { languages },
      })
    }
  }
  return urls
}
