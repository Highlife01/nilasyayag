import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/api", "/api/"] },
      { userAgent: "GPTBot", allow: ["/", "/llms.txt"], disallow: ["/admin"] },
      { userAgent: "ClaudeBot", allow: ["/", "/llms.txt"], disallow: ["/admin"] },
      { userAgent: "PerplexityBot", allow: ["/", "/llms.txt"], disallow: ["/admin"] },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  }
}
