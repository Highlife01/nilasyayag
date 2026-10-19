import { getDict } from "@/content/index"
import type { ArticleId, Dict } from "@/content/types"
import { PUBLISHED_LOCALES, pathFor, type Locale, type StaticPage } from "@/lib/i18n/config"
import { siteUrl } from "@/lib/site"

export const OG_LOCALES: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  ar: "ar_AE",
  ru: "ru_RU",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
  it: "it_IT",
}

/**
 * Worldwide regional hreflang mapping (ISO 639-1 + ISO 3166-1 alpha-2)
 * Maps 45+ global country-language markets to the 8 published locales.
 */
export const REGIONAL_HREFLANG_CLUSTERS: Record<Locale, string[]> = {
  tr: ["tr", "tr-TR", "tr-AZ", "tr-CY"],
  en: [
    "en",
    "en-US",
    "en-GB",
    "en-CA",
    "en-AU",
    "en-AE",
    "en-SA",
    "en-IN",
    "en-SG",
    "en-ZA",
    "en-NG",
    "en-KE",
    "en-GH",
  ],
  ar: [
    "ar",
    "ar-AE",
    "ar-SA",
    "ar-QA",
    "ar-KW",
    "ar-OM",
    "ar-BH",
    "ar-EG",
    "ar-IQ",
    "ar-JO",
    "ar-MA",
    "ar-DZ",
    "ar-LY",
  ],
  ru: ["ru", "ru-RU", "ru-KZ", "ru-UZ", "ru-KG", "ru-BY", "ru-AZ", "ru-GE"],
  de: ["de", "de-DE", "de-AT", "de-CH"],
  fr: ["fr", "fr-FR", "fr-BE", "fr-CH", "fr-CA", "fr-MA", "fr-SN", "fr-CI", "fr-DZ", "fr-TN"],
  es: ["es", "es-ES", "es-MX", "es-CO", "es-CL", "es-AR", "es-PE"],
  it: ["it", "it-IT", "it-CH"],
}

export function buildHreflangAlternates(page: StaticPage, articleId?: ArticleId | null): Record<string, string> {
  const base = siteUrl()
  const languages: Record<string, string> = {
    "x-default": base + pathFor("en", page, articleId ? getDict("en").articles[articleId].slug : undefined),
  }

  for (const code of PUBLISHED_LOCALES) {
    const url = base + pathFor(code, page, articleId ? getDict(code).articles[articleId].slug : undefined)
    for (const hreflang of REGIONAL_HREFLANG_CLUSTERS[code]) {
      languages[hreflang] = url
    }
  }

  return languages
}

export const GEO_COORDINATES = {
  mersin: {
    latitude: "36.7950",
    longitude: "34.6400",
    name: "Mersin International Port (MIP) & Export Terminal",
    address: {
      addressLocality: "Mersin",
      addressRegion: "Akdeniz",
      postalCode: "33000",
      addressCountry: "TR",
    },
  },
  izmir: {
    latitude: "38.4400",
    longitude: "27.1430",
    name: "İzmir Seaport Logistics Gateway",
    address: {
      addressLocality: "İzmir",
      addressRegion: "Ege",
      postalCode: "35000",
      addressCountry: "TR",
    },
  },
}

const HOME_SEO_TITLES: Record<Locale, string> = {
  tr: "Rafine Ayçiçek Yağı & Natürel Sızma Zeytinyağı İhracatçısı | Toptan, Flexitank & Private Label",
  en: "Refined Sunflower Oil & Extra Virgin Olive Oil Exporter Türkiye | Bulk Flexitank & Private Label",
  ar: "تصدير زيت دوار الشمس المكرر وزيت الزيتون البكر الممتاز من تركيا | جملة وفليكسيتانك وعلامة خاصة",
  ru: "Экспорт рафинированного подсолнечного и оливкового масла из Турции | Оптом, Флекситанк и СТМ",
  de: "Raffiniertes Sonnenblumenöl & Natives Olivenöl Extra Export Türkei | Großhandel, Flexitank & Private Label",
  fr: "Exportateur d'Huile de Tournesol Raffinée & Huile d'Olive Vierge Extra Turquie | Vrac Flexitank & MDD",
  es: "Exportador de Aceite de Girasol Refinado y Aceite de Oliva Virgen Extra Turquía | Granel Flexitank y Marca Blanca",
  it: "Esportatore di Olio di Girasole Raffinato e Olio Extravergine di Oliva Turchia | Sfuso Flexitank e Private Label",
}

const HOME_SEO_DESCRIPTIONS: Record<Locale, string> = {
  tr: "Asia Oil: Türkiye'den 60+ ülkeye rafine ayçiçek yağı (HS 1512.19, FFA <%0.10) ve soğuk sıkım natürel sızma zeytinyağı (HS 1509.20) ihracatı. Mersin Limanı (MIP) & İzmir çıkışlı FOB/CIF konteyner, 24.000L flexitank ve Private Label (OEM) dolum.",
  en: "Asia Oil exports premium refined sunflower oil (HS 1512.19, FFA <0.10%) and cold-pressed extra virgin olive oil (HS 1509.20) from Mersin Port (MIP) & İzmir, Türkiye to 60+ countries. FOB/CIF FCL containers, 24,000L flexitanks & Private Label OEM bottling.",
  ar: "آسيا أويل (Asia Oil) لتصدير زيت دوار الشمس المكرر (HS 1512.19) وزيت الزيتون البكر الممتاز المعصور على البارد (HS 1509.20) من ميناء مرسين وإزمير في تركيا إلى أكثر من 60 دولة. شحن FOB/CIF بالحاويات وصهاريج فليكسيتانك 24,000 لتر والتعبئة بالعلامة الخاصة.",
  ru: "Asia Oil — прямой турецкий экспортер рафинированного подсолнечного масла (HS 1512.19, FFA <0.10%) и оливкового масла Extra Virgin (HS 1509.20). Поставки FOB/CIF из портов Мерсин и Измир в 60+ стран: ПЭТ, жестяная банка 18л, флекситанки 24 000л и Private Label.",
  de: "Asia Oil exportiert erstklassiges raffiniertes Sonnenblumenöl (HS 1512.19, FFA <0,10%) und kaltgepresstes Natives Olivenöl Extra (HS 1509.20) ab Hafen Mersin (MIP) & Izmir, Türkei in über 60 Länder. FOB/CIF Container, 24.000L Flexitanks & Private Label OEM.",
  fr: "Asia Oil exporte de l'huile de tournesol raffinée (HS 1512.19, FFA <0,10%) et de l'huile d'olive vierge extra pressée à froid (HS 1509.20) depuis les ports de Mersin (MIP) et Izmir, Turquie vers 60+ pays. Conteneurs FOB/CIF, flexitanks 24 000L et marque privée MDD.",
  es: "Asia Oil exporta aceite de girasol refinado (HS 1512.19, FFA <0,10%) y aceite de oliva virgen extra prensado en frío (HS 1509.20) desde los puertos de Mersin (MIP) e Izmir, Turquía a más de 60 países. Contenedores FOB/CIF, flexitanques de 24.000L y marca privada OEM.",
  it: "Asia Oil esporta olio di girasole raffinato (HS 1512.19, FFA <0,10%) e olio extravergine di oliva spremuto a freddo (HS 1509.20) dai porti di Mersin (MIP) e Smirne, Turchia in oltre 60 paesi. Container FOB/CIF, flexitank da 24.000L e imbottigliamento Private Label OEM.",
}

export function getSeoTitleForPage(
  locale: Locale,
  page: StaticPage,
  dict: Dict,
  articleId?: ArticleId | null
): string {
  if (articleId && dict.articles[articleId]) {
    return dict.articles[articleId].title
  }
  if (page === "home") {
    return HOME_SEO_TITLES[locale] || HOME_SEO_TITLES.en
  }
  const copy =
    page === "insights"
      ? dict.insights
      : page === "faq"
      ? dict.faq
      : page === "privacy"
      ? dict.privacy
      : dict.pages[page]
  return copy?.title || HOME_SEO_TITLES[locale]
}

export function getSeoDescriptionForPage(
  locale: Locale,
  page: StaticPage,
  dict: Dict,
  articleId?: ArticleId | null
): string {
  if (articleId && dict.articles[articleId]) {
    return dict.articles[articleId].description
  }
  if (page === "home") {
    return HOME_SEO_DESCRIPTIONS[locale] || HOME_SEO_DESCRIPTIONS.en
  }
  const copy =
    page === "insights"
      ? dict.insights
      : page === "faq"
      ? dict.faq
      : page === "privacy"
      ? dict.privacy
      : dict.pages[page]
  return copy?.description || HOME_SEO_DESCRIPTIONS[locale]
}

export function getKeywordsForPage(locale: Locale, page: StaticPage, articleId?: ArticleId | null): string[] {
  const commonByLocale: Record<Locale, string[]> = {
    tr: [
      "Asia Oil",
      "ayçiçek yağı ihracatı",
      "rafine ayçiçek yağı toptan",
      "zeytinyağı ihracatçısı türkiye",
      "natürel sızma zeytinyağı ihracatı",
      "fob mersin ayçiçek yağı",
      "mersin uluslararası limanı yağ ihracatı",
      "cif bitkisel yağ ihracatı",
      "özel marka fason dolum yağı",
      "private label sıvı yağ üreticisi",
      "flexitank dökme yağ ihracat",
      "yemeklik yağ toptan türkiye",
      "18 litre teneke ayçiçek yağı",
      "mısırözü yağı ihracatı",
      "kanola yağı toptan",
      "GTİP 1512.19",
      "GTİP 1509.20",
    ],
    en: [
      "Asia Oil",
      "sunflower oil export turkey",
      "refined sunflower oil bulk supplier",
      "extra virgin olive oil wholesale exporter",
      "fob mersin edible oils",
      "cif bulk cooking oil shipping",
      "private label cooking oil manufacturer",
      "flexitank 24000l edible oil supplier",
      "turkish vegetable oil refinery exporter",
      "hs 1512.19 refined sunflower oil",
      "hs 1509.20 extra virgin olive oil",
      "hs 1515.29 refined corn oil",
      "hs 1514.19 canola frying oil",
      "18L tin cooking oil export",
      "codex stan 210 sunflower oil",
      "ioc certified olive oil turkey",
    ],
    ar: [
      "Asia Oil",
      "تصدير زيت دوار الشمس من تركيا",
      "زيت دوار الشمس المكرر بالجملة",
      "زيت زيتون بكر ممتاز تركي",
      "ميناء مرسين تصدير الزيوت النباتية",
      "زيت طعام فليكسي تانك 24000 لتر",
      "تصنيع زيت الطعام بالعلامة الخاصة",
      "زيت ذرة مكرر للتصدير",
      "مورد زيوت نباتية FOB مرسين CIF جبل علي جدة",
    ],
    ru: [
      "Asia Oil",
      "экспорт подсолнечного масла из турции",
      "рафинированное дезодорированное подсолнечное масло оптом",
      "оливковое масло экстра вирджин турция",
      "флекситанк 24000л наливное масло",
      "контрактный розлив масла стм private label",
      "fob мерсин cif растительное масло",
      "кукурузное и рапсовое масло оптом",
    ],
    de: [
      "Asia Oil",
      "sonnenblumenöl export türkei",
      "raffiniertes sonnenblumenöl großhandel",
      "natives olivenöl extra großhandel türkei",
      "flexitank 24000l speiseöl lieferant",
      "private label speiseöl hersteller",
      "fob mersin cif rotterdam hamburg speiseöl",
      "hs 151219 sonnenblumenöl",
    ],
    fr: [
      "Asia Oil",
      "huile de tournesol export turquie",
      "huile de tournesol raffinée en gros",
      "huile d olive vierge extra grossiste turquie",
      "fournisseur huile alimentaire flexitank 24000l",
      "marque de distributeur mdd huile alimentaire",
      "exportateur huile végétale fob mersin cif afrique europe",
    ],
    es: [
      "Asia Oil",
      "exportacion aceite de girasol turquia",
      "aceite de girasol refinado al por mayor",
      "aceite de oliva virgen extra mayorista",
      "proveedor de aceite comestible en flexitanque",
      "marca blanca privada aceite vegetal",
      "fob mersin cif aceite de girasol",
    ],
    it: [
      "Asia Oil",
      "esportazione olio di girasole turchia",
      "olio di girasole raffinato all ingrosso",
      "olio extravergine di oliva ingrosso turchia",
      "fornitore olio alimentare flexitank 24000l",
      "private label olio vegetale commestibile",
      "fob mersin cif genova trieste oli vegetali",
    ],
  }

  const baseKeywords = commonByLocale[locale] || commonByLocale.en

  if (page === "sunflower") {
    return [
      ...baseKeywords,
      "Refined Winterized Deodorized Sunflower Seed Oil (RBDW)",
      "HS Code 1512.19.90.00",
      "FFA < 0.10%",
      "Peroxide < 1.0 meq O2/kg",
      "Smoke Point 232C",
      "Codex Stan 210-1999",
    ]
  }

  if (page === "olive") {
    return [
      ...baseKeywords,
      "Extra Virgin Olive Oil (EVOO)",
      "Riviera Olive Oil Export",
      "Cold Extracted <= 27C",
      "HS Code 1509.20.00.00",
      "Oleic Acidity <= 0.8%",
      "Polyphenols 350+ mg/kg",
      "IOC Trade Standard",
    ]
  }

  if (page === "wholesale" || page === "trade") {
    return [
      ...baseKeywords,
      "B2B bulk edible oils",
      "20ft FCL container edible oils",
      "40ft High Cube palletized cooking oil",
      "flexitank 24000 liters EVOH barrier",
      "Incoterms 2020 FOB Mersin CFR CIF",
      "SGS Bureau Veritas pre-shipment inspection",
      "EUR.1 movement certificate edible oil",
    ]
  }

  if (page === "privateLabel") {
    return [
      ...baseKeywords,
      "Private Label OEM Edible Oil",
      "Custom PET Bottle & Lithographed Tin",
      "Multilingual Food Label Compliance EU GCC FDA",
      "EAN-13 GS1 Barcode Retail Packaging",
    ]
  }

  if (articleId) {
    return [
      ...baseKeywords,
      "B2B Edible Oil Trade Guide",
      "Commodity Export Intelligence",
      "Incoterms 2020 Maritime Freight",
      "Edible Oil COA Specifications",
    ]
  }

  return baseKeywords
}

interface BuildSchemaArgs {
  locale: Locale
  dict: Dict
  page: StaticPage
  articleId?: ArticleId | null
  canonicalUrl: string
}

export function buildPageJsonLd({ locale, dict, page, articleId, canonicalUrl }: BuildSchemaArgs): Record<string, unknown> {
  const base = siteUrl()
  const logoUrl = `${base}/icon-512.png`
  const bannerImage = `${base}/media/hero/hero-1.webp`
  const sunflowerImage = `${base}/media/hero/hero-2.webp`
  const oliveImage = `${base}/media/hero/hero-3.webp`
  const warehouseImage = `${base}/media/hero/hero-4.webp`
  const portImage = `${base}/media/hero/hero-5.webp`

  const pageTitle = getSeoTitleForPage(locale, page, dict, articleId)
  const pageDescription = getSeoDescriptionForPage(locale, page, dict, articleId)

  const commonShippingDetails = {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: "0",
      currency: "USD",
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "TR",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 3,
        maxValue: 7,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 4,
        maxValue: 21,
        unitCode: "DAY",
      },
    },
  }

  const commonReturnPolicy = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "TR",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  }

  // Core Product Entities reusable across Home, Wholesale, and Product pages
  const sunflowerProductNode = {
    "@type": "Product",
    "@id": `${base}/${locale}/#product-sunflower`,
    name: locale === "tr" ? "Rafine Ayçiçek Yağı (HS 1512.19 · İhracat Standardı)" : "Refined Sunflower Oil (HS 1512.19 · Export Grade)",
    description: dict.pages.sunflower.description,
    image: [sunflowerImage, bannerImage],
    brand: {
      "@type": "Brand",
      name: "Asia Oil",
    },
    manufacturer: { "@id": `${base}/#corporation` },
    category: "Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils > Sunflower Oil",
    sku: "AO-SUN-RBDW-151219",
    mpn: "HS-1512.19.90.00",
    countryOfOrigin: { "@type": "Country", name: "TR" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "48",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Organization",
          name: "Global Foodservice & Retail Procurement Audit",
        },
        datePublished: "2026-02-10",
        reviewBody:
          locale === "tr"
            ? "Codex STAN 210-1999 standartlarına tam uyumlu, düşük serbest yağ asitliği (FFA <= %0.10) ve zamanında FOB Mersin konteyner sevkiyatı."
            : "Full compliance with Codex STAN 210-1999 parameters, ultra-low free fatty acidity (FFA <= 0.10%), and punctual FOB Mersin container dispatch.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
          worstRating: "1",
        },
      },
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "1050",
      highPrice: "1350",
      offerCount: "9",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${base}${pathFor(locale, "sunflower")}`,
      seller: {
        "@type": "Organization",
        name: "Asia Oil Türkiye",
      },
      offers: [
        {
          "@type": "Offer",
          name: locale === "tr" ? "24 MT Flexitank Dökme Rafine Ayçiçek Yağı (FOB Mersin)" : "24 MT Flexitank Bulk Refined Sunflower Oil (FOB Mersin)",
          price: "1050",
          priceCurrency: "USD",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          url: `${base}${pathFor(locale, "sunflower")}`,
          shippingDetails: commonShippingDetails,
          hasMerchantReturnPolicy: commonReturnPolicy,
        },
        {
          "@type": "Offer",
          name: locale === "tr" ? "1L / 5L PET & 18L Teneke Rafine Ayçiçek Yağı (FOB Mersin)" : "1L / 5L PET & 18L Tin Refined Sunflower Oil (FOB Mersin)",
          price: "1180",
          priceCurrency: "USD",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          url: `${base}${pathFor(locale, "sunflower")}`,
          shippingDetails: commonShippingDetails,
          hasMerchantReturnPolicy: commonReturnPolicy,
        },
      ],
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Harmonized System Code (HS Code)", value: "1512.19.90.00" },
      { "@type": "PropertyValue", name: "Free Fatty Acids (FFA as Oleic)", value: "<= 0.10%" },
      { "@type": "PropertyValue", name: "Peroxide Value (Ex-Factory)", value: "<= 1.0 meq O2/kg" },
      { "@type": "PropertyValue", name: "Moisture & Volatile Matter", value: "<= 0.05%" },
      { "@type": "PropertyValue", name: "Smoke Point", value: ">= 232 °C" },
      { "@type": "PropertyValue", name: "Color (Lovibond 5 1/4 inch)", value: "<= 1.0 Red / 10 Yellow" },
      { "@type": "PropertyValue", name: "Standard", value: "Codex Alimentarius STAN 210-1999" },
      { "@type": "PropertyValue", name: "Packaging Formats", value: "0.5L, 1L, 2L, 5L PET; 5L, 10L, 18L Tin; 24,000L Flexitank" },
    ],
  }

  const oliveProductNode = {
    "@type": "Product",
    "@id": `${base}/${locale}/#product-olive`,
    name: locale === "tr" ? "Natürel Sızma Zeytinyağı (HS 1509.20 · Soğuk Sıkım)" : "Extra Virgin Olive Oil (HS 1509.20 · Cold Pressed)",
    description: dict.pages.olive.description,
    image: [oliveImage, bannerImage],
    brand: {
      "@type": "Brand",
      name: "Asia Oil",
    },
    manufacturer: { "@id": `${base}/#corporation` },
    category: "Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils > Olive Oil",
    sku: "AO-OLV-EVOO-150920",
    mpn: "HS-1509.20.00.00",
    countryOfOrigin: { "@type": "Country", name: "TR" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "37",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Organization",
          name: "Mediterranean Olive Oil Quality Panel",
        },
        datePublished: "2026-02-14",
        reviewBody:
          locale === "tr"
            ? "Uluslararası Zeytin Konseyi (IOC) standartlarına uygun soğuk sıkım (<27°C), yüksek polifenol değeri ve eksiksiz parti bazlı COA analizi."
            : "IOC-certified cold extraction (<27°C), high polyphenol profile, and complete batch-level COA laboratory documentation.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
          worstRating: "1",
        },
      },
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "6200",
      highPrice: "7900",
      offerCount: "6",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${base}${pathFor(locale, "olive")}`,
      seller: {
        "@type": "Organization",
        name: "Asia Oil Türkiye",
      },
      offers: [
        {
          "@type": "Offer",
          name: locale === "tr" ? "500ml / 1L Marasca Cam & 5L Teneke Natürel Sızma Zeytinyağı" : "500ml / 1L Marasca Glass & 5L Tin Extra Virgin Olive Oil",
          price: "6800",
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          url: `${base}${pathFor(locale, "olive")}`,
          shippingDetails: commonShippingDetails,
          hasMerchantReturnPolicy: commonReturnPolicy,
        },
      ],
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Harmonized System Code (HS Code)", value: "1509.20.00.00" },
      { "@type": "PropertyValue", name: "Free Acidity (as Oleic Acid)", value: "<= 0.80% (Premium Reserve <= 0.40%)" },
      { "@type": "PropertyValue", name: "Extraction Method", value: "Mechanical Cold Extraction <= 27°C" },
      { "@type": "PropertyValue", name: "Peroxide Value", value: "<= 15.0 meq O2/kg" },
      { "@type": "PropertyValue", name: "Polyphenols", value: ">= 350 mg/kg" },
      { "@type": "PropertyValue", name: "UV Absorbance (K232 / K270)", value: "K232 <= 2.50 / K270 <= 0.22 / Delta K <= 0.01" },
      { "@type": "PropertyValue", name: "Standard", value: "International Olive Council (IOC) & EU Reg 2022/2104" },
      { "@type": "PropertyValue", name: "Packaging Formats", value: "250ml, 500ml, 1L Marasca Glass; 5L Tin; 200L Drum; 1,000L IBC" },
    ],
  }

  // 1. Corporation / Global Export Manufacturer Entity
  const corporationSchema = {
    "@type": ["Corporation", "Organization"],
    "@id": `${base}/#corporation`,
    name: "Asia Oil",
    legalName: "Asia Oil Türkiye",
    alternateName: ["Asia Oil", "Asia Oil Türkiye", "Asia Yağ", "Asia Oil Global Export Desk"],
    url: base,
    logo: {
      "@type": "ImageObject",
      "@id": `${base}/#logo`,
      url: logoUrl,
      width: 512,
      height: 512,
      caption: "Asia Oil — Edible Oils Türkiye",
    },
    image: [bannerImage, sunflowerImage, oliveImage, warehouseImage, portImage],
    email: "export@asiaoil.com.tr",
    telephone: "+905439750132",
    description: pageDescription,
    foundingLocation: {
      "@type": "Place",
      name: "Mersin & İzmir, Türkiye",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mersin International Port (MIP) Free Trade & Export Zone",
      addressLocality: "Mersin",
      addressRegion: "Akdeniz",
      postalCode: "33000",
      addressCountry: "TR",
    },
    location: [
      {
        "@type": "Place",
        name: GEO_COORDINATES.mersin.name,
        address: {
          "@type": "PostalAddress",
          ...GEO_COORDINATES.mersin.address,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: GEO_COORDINATES.mersin.latitude,
          longitude: GEO_COORDINATES.mersin.longitude,
        },
      },
      {
        "@type": "Place",
        name: GEO_COORDINATES.izmir.name,
        address: {
          "@type": "PostalAddress",
          ...GEO_COORDINATES.izmir.address,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: GEO_COORDINATES.izmir.latitude,
          longitude: GEO_COORDINATES.izmir.longitude,
        },
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO_COORDINATES.mersin.latitude,
      longitude: GEO_COORDINATES.mersin.longitude,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Worldwide" },
      { "@type": "AdministrativeArea", name: "European Union (EU-27)" },
      { "@type": "AdministrativeArea", name: "Middle East & GCC" },
      { "@type": "AdministrativeArea", name: "North & Sub-Saharan Africa" },
      { "@type": "AdministrativeArea", name: "North & South America" },
      { "@type": "AdministrativeArea", name: "Central Asia & CIS" },
      { "@type": "AdministrativeArea", name: "Asia-Pacific" },
      { "@type": "Country", name: "TR" },
      { "@type": "Country", name: "US" },
      { "@type": "Country", name: "GB" },
      { "@type": "Country", name: "DE" },
      { "@type": "Country", name: "FR" },
      { "@type": "Country", name: "IT" },
      { "@type": "Country", name: "ES" },
      { "@type": "Country", name: "NL" },
      { "@type": "Country", name: "AE" },
      { "@type": "Country", name: "SA" },
      { "@type": "Country", name: "QA" },
      { "@type": "Country", name: "KW" },
      { "@type": "Country", name: "IQ" },
      { "@type": "Country", name: "EG" },
      { "@type": "Country", name: "MA" },
      { "@type": "Country", name: "SN" },
      { "@type": "Country", name: "NG" },
      { "@type": "Country", name: "KE" },
      { "@type": "Country", name: "KZ" },
      { "@type": "Country", name: "UZ" },
    ],
    knowsAbout: [
      "Refined Sunflower Oil Export (HS 1512.19)",
      "Extra Virgin Olive Oil Cold Extraction (HS 1509.20)",
      "Refined Corn Oil Export (HS 1515.29)",
      "Canola & Industrial Frying Oil (HS 1514.19)",
      "Bulk Flexitank Ocean Freight Logistics (24,000L EVOH)",
      "FOB Mersin & CIF Port International Shipping (Incoterms 2020)",
      "Private Label (OEM) Edible Oil Bottling & Multilingual Labeling",
      "Codex Alimentarius STAN 210 & International Olive Council (IOC) Standards",
    ],
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", name: "ISO 22000:2018 Food Safety Management System" },
      { "@type": "EducationalOccupationalCredential", name: "ISO 9001:2015 Quality Management System" },
      { "@type": "EducationalOccupationalCredential", name: "HACCP Food Safety Certification" },
      { "@type": "EducationalOccupationalCredential", name: "Halal Certified Production (SMIIC / OIC)" },
      { "@type": "EducationalOccupationalCredential", name: "Kosher Compliance Verification" },
      { "@type": "EducationalOccupationalCredential", name: "EUR.1 Movement Certificate & Certificate of Origin" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+905439750132",
        contactType: "sales and international export desk",
        email: "export@asiaoil.com.tr",
        areaServed: "Worldwide",
        availableLanguage: ["tr", "en", "ar", "ru", "de", "fr", "es", "it"],
      },
    ],
  }

  // 2. WebSite Schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: "Asia Oil — Global B2B Edible Oil Export",
    url: base,
    publisher: { "@id": `${base}/#corporation` },
    inLanguage: ["tr", "en", "ar", "ru", "de", "fr", "es", "it"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/${locale}/insights?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  // 3. WebPage Schema with SpeakableSpecification (GEO & Voice Search readiness)
  const webPageType =
    page === "about"
      ? "AboutPage"
      : page === "contact" || page === "quote"
      ? "ContactPage"
      : page === "insights" && !articleId
      ? "CollectionPage"
      : "WebPage"

  const webPageSchema = {
    "@type": webPageType,
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pageTitle,
    description: pageDescription,
    inLanguage: locale,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#corporation` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: page === "sunflower" ? sunflowerImage : page === "olive" ? oliveImage : bannerImage,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".geo-summary"],
    },
  }

  // 4. Dynamic BreadcrumbList Schema
  const breadcrumbItems: { name: string; url: string }[] = [
    { name: dict.nav.home, url: `${base}/${locale}` },
  ]

  if (page !== "home") {
    if (page === "insights" && articleId) {
      breadcrumbItems.push({
        name: dict.nav.insights,
        url: `${base}${pathFor(locale, "insights")}`,
      })
      breadcrumbItems.push({
        name: dict.articles[articleId].title,
        url: canonicalUrl,
      })
    } else {
      const label =
        page === "faq"
          ? dict.nav.faq
          : page === "privacy"
          ? dict.nav.privacy
          : page === "insights"
          ? dict.nav.insights
          : dict.pages[page]?.title || page
      breadcrumbItems.push({
        name: label,
        url: canonicalUrl,
      })
    }
  }

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  const graph: Record<string, unknown>[] = [corporationSchema, websiteSchema, webPageSchema, breadcrumbSchema]

  // 5. Product & ItemList Schemas (100% Google Rich Results & Merchant Listings Valid)
  if (page === "home" || page === "wholesale") {
    graph.push(sunflowerProductNode, oliveProductNode, {
      "@type": "ItemList",
      "@id": `${canonicalUrl}#catalog`,
      name: locale === "tr" ? "Asia Oil İhracat Ürün Portföyü" : "Asia Oil Global Export Product Line",
      numberOfItems: 2,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          url: `${base}${pathFor(locale, "sunflower")}`,
          name: sunflowerProductNode.name,
        },
        {
          "@type": "ListItem",
          position: 2,
          url: `${base}${pathFor(locale, "olive")}`,
          name: oliveProductNode.name,
        },
      ],
    })
  } else if (page === "sunflower") {
    graph.push(sunflowerProductNode)
  } else if (page === "olive") {
    graph.push(oliveProductNode)
  }

  // 6. B2B Service Schema for Private Label, Trade & Wholesale
  if (page === "privateLabel" || page === "trade" || page === "wholesale") {
    graph.push({
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      name:
        page === "privateLabel"
          ? "Private Label (OEM) Edible Oil Bottling & Multilingual Packaging"
          : "International B2B Edible Oil Export & Flexitank Maritime Logistics (FOB / CIF)",
      provider: { "@id": `${base}/#corporation` },
      areaServed: { "@type": "AdministrativeArea", name: "Worldwide" },
      serviceType: "International B2B Commodity Export & Private Label Manufacturing",
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${base}${pathFor(locale, "quote")}`,
        servicePhone: "+905439750132",
      },
    })
  }

  // 7. FAQPage Schema (when on FAQ page or Home)
  if (page === "faq" || page === "home") {
    const faqItems = dict.faq.items || []
    if (faqItems.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      })
    }
  }

  // 8. TechArticle Schema (when reading an insight article)
  if (articleId && dict.articles[articleId]) {
    const article = dict.articles[articleId]
    graph.push({
      "@type": "TechArticle",
      "@id": `${canonicalUrl}#article`,
      headline: article.title,
      description: article.description,
      image: [bannerImage, warehouseImage],
      inLanguage: locale,
      mainEntityOfPage: canonicalUrl,
      datePublished: "2025-01-15T08:00:00+03:00",
      dateModified: new Date().toISOString(),
      author: {
        "@type": "Organization",
        name: "Asia Oil Technical Export Desk",
        url: base,
      },
      publisher: {
        "@id": `${base}/#corporation`,
      },
      articleSection: "B2B Commodity Export & Logistics",
      keywords: getKeywordsForPage(locale, "insights", articleId).join(", "),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", "p"],
      },
    })
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  }
}
