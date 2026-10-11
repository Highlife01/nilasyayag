import { writeFileSync } from "node:fs"
import path from "node:path"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nilasyayag.web.app"
const root = path.resolve(import.meta.dirname, "..")

const PUBLISHED_LOCALES = ["tr", "en", "ar", "ru", "de", "fr", "es", "it"]

const STATIC_PAGES = [
  "home",
  "sunflower",
  "olive",
  "wholesale",
  "trade",
  "privateLabel",
  "quality",
  "about",
  "insights",
  "quote",
  "contact",
  "faq",
  "privacy",
]

const SLUGS = {
  en: {
    sunflower: "products/sunflower-oil",
    olive: "products/olive-oil",
    wholesale: "wholesale-edible-oils",
    trade: "international-trade",
    privateLabel: "private-label",
    quality: "quality-documents",
    about: "about",
    insights: "insights",
    quote: "request-a-quote",
    contact: "contact",
    faq: "faq",
    privacy: "privacy",
  },
  tr: {
    sunflower: "urunler/aycicek-yagi",
    olive: "urunler/zeytinyagi",
    wholesale: "toptan-yag",
    trade: "uluslararasi-ticaret",
    privateLabel: "ozel-marka",
    quality: "kalite-belgeleri",
    about: "hakkimizda",
    insights: "rehber",
    quote: "teklif-iste",
    contact: "iletisim",
    faq: "sss",
    privacy: "gizlilik",
  },
  ar: {
    sunflower: "products/sunflower-oil",
    olive: "products/olive-oil",
    wholesale: "wholesale",
    trade: "international-trade",
    privateLabel: "private-label",
    quality: "quality",
    about: "about",
    insights: "insights",
    quote: "request-a-quote",
    contact: "contact",
    faq: "faq",
    privacy: "privacy",
  },
  ru: {
    sunflower: "produkty/podsolnechnoe-maslo",
    olive: "produkty/olivkovoe-maslo",
    wholesale: "opt",
    trade: "mezhdunarodnaya-torgovlya",
    privateLabel: "sobstvennaya-marka",
    quality: "kachestvo",
    about: "o-kompanii",
    insights: "materialy",
    quote: "zapros",
    contact: "kontakty",
    faq: "voprosy",
    privacy: "konfidencialnost",
  },
  de: {
    sunflower: "produkte/sonnenblumenoel",
    olive: "produkte/olivenoel",
    wholesale: "grosshandel",
    trade: "internationaler-handel",
    privateLabel: "eigenmarke",
    quality: "qualitaet",
    about: "ueber-uns",
    insights: "einblicke",
    quote: "angebot",
    contact: "kontakt",
    faq: "fragen",
    privacy: "datenschutz",
  },
  fr: {
    sunflower: "produits/huile-de-tournesol",
    olive: "produits/huile-d-olive",
    wholesale: "vente-en-gros",
    trade: "commerce-international",
    privateLabel: "marque-distributeur",
    quality: "qualite",
    about: "a-propos",
    insights: "guides",
    quote: "demande-de-devis",
    contact: "contact",
    faq: "faq",
    privacy: "confidentialite",
  },
  es: {
    sunflower: "productos/aceite-de-girasol",
    olive: "productos/aceite-de-oliva",
    wholesale: "venta-mayorista",
    trade: "comercio-internacional",
    privateLabel: "marca-blanca",
    quality: "calidad",
    about: "sobre-nosotros",
    insights: "guias",
    quote: "solicitar-cotizacion",
    contact: "contacto",
    faq: "preguntas",
    privacy: "privacidad",
  },
  it: {
    sunflower: "prodotti/olio-di-girasole",
    olive: "prodotti/olio-di-oliva",
    wholesale: "ingrosso",
    trade: "commercio-internazionale",
    privateLabel: "marca-privata",
    quality: "qualita",
    about: "chi-siamo",
    insights: "guide",
    quote: "richiesta-offerta",
    contact: "contatto",
    faq: "domande",
    privacy: "privacy",
  },
}

const ARTICLE_SLUGS = {
  tr: {
    quotation: "fob-mersin-cif-fiyat-teklifi-nasil-alinir",
    packaging: "ihracat-icin-en-uygun-yag-ambalaji-hangisi",
    documents: "bitkisel-yag-ihracatinda-zorunlu-belgeler",
    distributor: "turk-yagi-icin-bolgesel-distributorluk-avantajlari",
  },
  en: {
    quotation: "how-to-request-fob-cif-edible-oil-quotation",
    packaging: "best-edible-oil-packaging-for-export",
    documents: "mandatory-documents-for-edible-oil-export",
    distributor: "benefits-of-becoming-an-asia-oil-regional-distributor",
  },
  ar: {
    quotation: "how-to-request-fob-cif-edible-oil-quotation",
    packaging: "best-edible-oil-packaging-for-export",
    documents: "mandatory-documents-for-edible-oil-export",
    distributor: "benefits-of-becoming-an-asia-oil-regional-distributor",
  },
  ru: {
    quotation: "kak-zaprosit-ceny-fob-cif-rastitelnoe-maslo",
    packaging: "luchshaya-upakovka-masla-dlya-eksporta",
    documents: "dokumenty-dlya-eksporta-rastitelnogo-masla",
    distributor: "preimushchestva-distribyutorstva-asia-oil",
  },
  de: {
    quotation: "fob-cif-preisanfrage-speiseoel",
    packaging: "die-beste-verpackung-fuer-den-speiseoelexport",
    documents: "erforderliche-dokumente-fuer-den-speiseoelexport",
    distributor: "vorteile-einer-regionalen-vertriebspartnerschaft",
  },
  fr: {
    quotation: "comment-demander-un-devis-fob-cif-huile-alimentaire",
    packaging: "quel-emballage-choisir-pour-l-exportation-d-huile",
    documents: "documents-obligatoires-pour-l-exportation-d-huile",
    distributor: "avantages-de-devenir-distributeur-regional",
  },
  es: {
    quotation: "como-solicitar-cotizacion-fob-cif-aceite-comestible",
    packaging: "mejor-empaque-para-la-exportacion-de-aceite",
    documents: "documentos-obligatorios-para-la-exportacion-de-aceite",
    distributor: "ventajas-de-ser-distribuidor-regional-asia-oil",
  },
  it: {
    quotation: "come-richiedere-un-preventivo-fob-cif-olio-alimentare",
    packaging: "miglior-imballaggio-per-l-esportazione-di-olio",
    documents: "documenti-obbligatori-per-l-esportazione-di-olio",
    distributor: "vantaggi-di-diventare-distributore-regionale",
  },
}

function pathFor(locale, page, articleSlug) {
  if (page === "home") return `/${locale}`
  if (articleSlug) return `/${locale}/${SLUGS[locale].insights}/${articleSlug}`
  return `/${locale}/${SLUGS[locale][page]}`
}

function getPriority(page) {
  if (page === "home") return "1.0"
  if (["sunflower", "olive", "wholesale", "trade", "quote"].includes(page)) return "0.9"
  if (page === "insights") return "0.8"
  if (["quality", "about", "contact", "privateLabel"].includes(page)) return "0.7"
  if (page === "faq") return "0.6"
  return "0.3"
}

function getChangeFreq(page) {
  if (["home", "sunflower", "olive", "quote"].includes(page)) return "weekly"
  if (["insights", "wholesale", "trade"].includes(page)) return "weekly"
  if (["about", "quality", "contact", "faq"].includes(page)) return "monthly"
  return "yearly"
}

const today = new Date().toISOString().split("T")[0]

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`

// 1. Static Pages for each locale
for (const locale of PUBLISHED_LOCALES) {
  for (const page of STATIC_PAGES) {
    const url = `${BASE_URL}${pathFor(locale, page)}`
    xml += `  <url>\n`
    xml += `    <loc>${url}</loc>\n`
    xml += `    <lastmod>${today}</lastmod>\n`
    xml += `    <changefreq>${getChangeFreq(page)}</changefreq>\n`
    xml += `    <priority>${getPriority(page)}</priority>\n`

    // Alternates for all locales
    for (const altLocale of PUBLISHED_LOCALES) {
      const altUrl = `${BASE_URL}${pathFor(altLocale, page)}`
      xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${altUrl}" />\n`
    }
    const xDefaultUrl = `${BASE_URL}${pathFor("en", page)}`
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />\n`
    xml += `  </url>\n`
  }

  // 2. Articles in insights
  for (const articleKey of Object.keys(ARTICLE_SLUGS.tr)) {
    const slug = ARTICLE_SLUGS[locale][articleKey]
    const url = `${BASE_URL}${pathFor(locale, "insights", slug)}`
    xml += `  <url>\n`
    xml += `    <loc>${url}</loc>\n`
    xml += `    <lastmod>${today}</lastmod>\n`
    xml += `    <changefreq>monthly</changefreq>\n`
    xml += `    <priority>0.8</priority>\n`

    for (const altLocale of PUBLISHED_LOCALES) {
      const altSlug = ARTICLE_SLUGS[altLocale][articleKey]
      const altUrl = `${BASE_URL}${pathFor(altLocale, "insights", altSlug)}`
      xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${altUrl}" />\n`
    }
    const xDefaultSlug = ARTICLE_SLUGS.en[articleKey]
    const xDefaultUrl = `${BASE_URL}${pathFor("en", "insights", xDefaultSlug)}`
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />\n`
    xml += `  </url>\n`
  }
}

xml += `</urlset>\n`

const sitemapPath = path.join(root, "public", "sitemap.xml")
writeFileSync(sitemapPath, xml, "utf8")
console.log(`Generated: ${sitemapPath} (${xml.length} bytes)`)

// Generate robots.txt
const robotsTxt = `# Asia Oil (Nilasya Agro Foods) - Robots Configuration
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api
Disallow: /api/

# AI Crawlers & Scrapers
User-agent: GPTBot
Allow: /
Allow: /llms.txt
Disallow: /admin

User-agent: ClaudeBot
Allow: /
Allow: /llms.txt
Disallow: /admin

User-agent: PerplexityBot
Allow: /
Allow: /llms.txt
Disallow: /admin

User-agent: CCBot
Allow: /
Disallow: /admin

# Sitemaps & Host
Sitemap: ${BASE_URL}/sitemap.xml
Host: ${BASE_URL}
`

const robotsPath = path.join(root, "public", "robots.txt")
writeFileSync(robotsPath, robotsTxt, "utf8")
console.log(`Generated: ${robotsPath}`)
