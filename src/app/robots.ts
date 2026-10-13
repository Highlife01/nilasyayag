import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl()
  const privateRoutes = ["/admin", "/admin/", "/api", "/api/"]

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt"],
        disallow: privateRoutes,
      },
      // OpenAI ChatGPT & SearchGPT
      {
        userAgent: ["GPTBot", "OAI-SearchBot"],
        allow: ["/", "/llms.txt"],
        disallow: privateRoutes,
      },
      // Anthropic Claude
      {
        userAgent: ["ClaudeBot", "anthropic-ai"],
        allow: ["/", "/llms.txt"],
        disallow: privateRoutes,
      },
      // Perplexity AI
      {
        userAgent: ["PerplexityBot"],
        allow: ["/", "/llms.txt"],
        disallow: privateRoutes,
      },
      // Google Gemini & Extended
      {
        userAgent: ["Google-Extended", "Googlebot"],
        allow: ["/", "/llms.txt"],
        disallow: privateRoutes,
      },
      // Apple Intelligence & Siri
      {
        userAgent: ["Applebot", "Applebot-Extended"],
        allow: ["/", "/llms.txt"],
        disallow: privateRoutes,
      },
      // Meta & Amazon
      {
        userAgent: ["meta-externalagent", "Amazonbot", "Diffbot", "cohere-ai"],
        allow: ["/", "/llms.txt"],
        disallow: privateRoutes,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
