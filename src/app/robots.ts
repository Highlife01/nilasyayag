import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/api", "/api/"] },
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "CCBot"], allow: ["/", "/llms.txt"], disallow: ["/admin", "/api"] },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  }
}
