import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl()
  const privateRoutes = ["/admin", "/admin/", "/api", "/api/"]
  const allowedPublic = ["/", "/llms.txt", "/llms-full.txt", "/sitemap.xml"]

  return {
    rules: [
      {
        userAgent: "*",
        allow: allowedPublic,
        disallow: privateRoutes,
      },
      // OpenAI ChatGPT & SearchGPT
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User"],
        allow: allowedPublic,
        disallow: privateRoutes,
      },
      // Anthropic Claude
      {
        userAgent: ["ClaudeBot", "Claude-Web", "anthropic-ai"],
        allow: allowedPublic,
        disallow: privateRoutes,
      },
      // Perplexity AI
      {
        userAgent: ["PerplexityBot", "Perplexity-User"],
        allow: allowedPublic,
        disallow: privateRoutes,
      },
      // Google Gemini & Extended & Search
      {
        userAgent: ["Google-Extended", "Googlebot", "Googlebot-Image", "GoogleOther"],
        allow: allowedPublic,
        disallow: privateRoutes,
      },
      // Bing, Yandex, Baidu, DuckDuckGo
      {
        userAgent: ["Bingbot", "YandexBot", "Baiduspider", "DuckDuckBot"],
        allow: allowedPublic,
        disallow: privateRoutes,
      },
      // Apple Intelligence & Siri
      {
        userAgent: ["Applebot", "Applebot-Extended"],
        allow: allowedPublic,
        disallow: privateRoutes,
      },
      // Meta, Amazon, Cohere, You.com & Enterprise AI Crawlers
      {
        userAgent: ["meta-externalagent", "Amazonbot", "Diffbot", "cohere-ai", "YouBot", "CCBot"],
        allow: allowedPublic,
        disallow: privateRoutes,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
