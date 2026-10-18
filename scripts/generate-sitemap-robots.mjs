import { writeFileSync } from "node:fs"
import path from "node:path"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.asiaoil.com.tr"
const root = path.resolve(import.meta.dirname, "..")

const PUBLISHED_LOCALES = ["tr", "en", "ar", "ru", "de", "fr", "es", "it"]

const REGIONAL_HREFLANG_CLUSTERS = {
  tr: ["tr", "tr-TR", "tr-AZ", "tr-CY"],
  en: ["en", "en-US", "en-GB", "en-CA", "en-AU", "en-AE", "en-SA", "en-IN", "en-SG", "en-ZA", "en-NG", "en-KE", "en-GH"],
  ar: ["ar", "ar-AE", "ar-SA", "ar-QA", "ar-KW", "ar-OM", "ar-BH", "ar-EG", "ar-IQ", "ar-JO", "ar-MA", "ar-DZ", "ar-LY"],
  ru: ["ru", "ru-RU", "ru-KZ", "ru-UZ", "ru-KG", "ru-BY", "ru-AZ", "ru-GE"],
  de: ["de", "de-DE", "de-AT", "de-CH"],
  fr: ["fr", "fr-FR", "fr-BE", "fr-CH", "fr-CA", "fr-MA", "fr-SN", "fr-CI", "fr-DZ", "fr-TN"],
  es: ["es", "es-ES", "es-MX", "es-CO", "es-CL", "es-AR", "es-PE"],
  it: ["it", "it-IT", "it-CH"],
}

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

// Verified exact article slugs matching src/content/*.ts
const ARTICLE_SLUGS = {
  tr: {
    quotation: "toplu-aycicek-yagi-teklifi",
    packaging: "ambalaj-secenekleri",
    documents: "ithalat-belgeleri",
    distributor: "distributor-hazirligi",
  },
  en: {
    quotation: "how-to-request-a-bulk-sunflower-oil-quotation",
    packaging: "packaging-options-for-edible-oil-buyers",
    documents: "documents-for-edible-oil-imports",
    distributor: "preparing-a-distribution-inquiry",
  },
  ar: {
    quotation: "talab-ard-zayt-dawwar-al-shams",
    packaging: "khiyarat-al-tabea",
    documents: "wathaiq-istiraad-al-zayt",
    distributor: "tahdir-talab-tawzee",
  },
  ru: {
    quotation: "kak-zaprosit-podsolnechnoe-maslo",
    packaging: "fasovka-pishchevogo-masla",
    documents: "dokumenty-dlya-importa-masla",
    distributor: "podgotovka-distributora",
  },
  de: {
    quotation: "sonnenblumenoel-angebot-anfragen",
    packaging: "verpackung-fuer-speiseoel",
    documents: "dokumente-fuer-speiseoelimporte",
    distributor: "vertriebsanfrage-vorbereiten",
  },
  fr: {
    quotation: "comment-demander-un-devis-huile-de-tournesol",
    packaging: "conditionnement-huile-alimentaire",
    documents: "documents-import-huile-alimentaire",
    distributor: "preparer-une-demande-de-distribution",
  },
  es: {
    quotation: "como-pedir-cotizacion-de-girasol",
    packaging: "envases-de-aceite-comestible",
    documents: "documentos-para-importar-aceite",
    distributor: "preparar-una-consulta-de-distribucion",
  },
  it: {
    quotation: "come-chiedere-offerta-olio-di-girasole",
    packaging: "confezioni-olio-alimentare",
    documents: "documenti-importazione-olio",
    distributor: "preparare-una-richiesta-di-distribuzione",
  },
}

function pathFor(locale, page, articleSlug) {
  if (page === "home") return `/${locale}`
  if (articleSlug) return `/${locale}/${SLUGS[locale].insights}/${articleSlug}`
  return `/${locale}/${SLUGS[locale][page]}`
}

function getPriority(page) {
  if (page === "home") return "1.0"
  if (["sunflower", "olive", "wholesale"].includes(page)) return "0.9"
  if (["quote", "trade", "privateLabel", "quality"].includes(page)) return "0.8"
  if (["insights", "contact", "faq", "about"].includes(page)) return "0.7"
  return "0.3"
}

function getChangeFreq(page) {
  if (page === "home") return "daily"
  if (["sunflower", "olive", "wholesale", "quote", "trade", "insights", "faq"].includes(page)) return "weekly"
  if (["about", "quality", "contact", "privateLabel"].includes(page)) return "monthly"
  return "yearly"
}

function getImagesForPage(page) {
  if (page === "sunflower") {
    return [`${BASE_URL}/media/stills/sunflower.webp`, `${BASE_URL}/media/hero/master-banner.webp`]
  }
  if (page === "olive") {
    return [`${BASE_URL}/media/stills/olive.webp`, `${BASE_URL}/media/hero/master-banner.webp`]
  }
  if (page === "home") {
    return [
      `${BASE_URL}/media/hero/master-banner.webp`,
      `${BASE_URL}/media/stills/sunflower.webp`,
      `${BASE_URL}/media/stills/olive.webp`,
      `${BASE_URL}/media/hero/banner-signature.webp`,
      `${BASE_URL}/media/stills/warehouse.webp`,
    ]
  }
  return [`${BASE_URL}/media/hero/master-banner.webp`]
}

const today = new Date().toISOString().split("T")[0]

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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

    for (const imgUrl of getImagesForPage(page)) {
      xml += `    <image:image><image:loc>${imgUrl}</image:loc></image:image>\n`
    }

    // Alternates for all base and regional hreflang clusters
    for (const altLocale of PUBLISHED_LOCALES) {
      const altUrl = `${BASE_URL}${pathFor(altLocale, page)}`
      for (const code of REGIONAL_HREFLANG_CLUSTERS[altLocale]) {
        xml += `    <xhtml:link rel="alternate" hreflang="${code}" href="${altUrl}" />\n`
      }
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
    xml += `    <changefreq>weekly</changefreq>\n`
    xml += `    <priority>0.8</priority>\n`
    xml += `    <image:image><image:loc>${BASE_URL}/media/hero/master-banner.webp</image:loc></image:image>\n`

    for (const altLocale of PUBLISHED_LOCALES) {
      const altSlug = ARTICLE_SLUGS[altLocale][articleKey]
      const altUrl = `${BASE_URL}${pathFor(altLocale, "insights", altSlug)}`
      for (const code of REGIONAL_HREFLANG_CLUSTERS[altLocale]) {
        xml += `    <xhtml:link rel="alternate" hreflang="${code}" href="${altUrl}" />\n`
      }
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
