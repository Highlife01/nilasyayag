import type { ArticleId, Dict } from "@/content/types"
import type { Locale, StaticPage } from "@/lib/i18n/config"
import { pathFor } from "@/lib/i18n/config"
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

export function getKeywordsForPage(locale: Locale, page: StaticPage, articleId?: ArticleId | null): string[] {
  const commonByLocale: Record<Locale, string[]> = {
    tr: [
      "Asia Oil",
      "ayçiçek yağı ihracatı",
      "rafine ayçiçek yağı toptan",
      "zeytinyağı ihracatçısı türkiye",
      "fob mersin ayçiçek yağı",
      "cif bitkisel yağ ihracatı",
      "özel marka fason dolum yağı",
      "flexitank dökme yağ ihracat",
      "yemeklik yağ toptan türkiye",
    ],
    en: [
      "Asia Oil",
      "sunflower oil export turkey",
      "refined sunflower oil bulk",
      "extra virgin olive oil wholesale",
      "fob mersin edible oils",
      "cif bulk oil shipping",
      "private label cooking oil",
      "flexitank edible oil supplier",
      "turkish food commodity exporter",
      "hs 151219 sunflower oil",
      "hs 150920 olive oil",
    ],
    ar: [
      "زيت دوار الشمس تركيا",
      "تصدير زيت الطعام بالجملة",
      "زيت زيتون بكر ممتاز",
      "ميناء مرسين تصدير الزيوت",
      "زيت نباتي مكرر فليكسي تانك",
      "العلامة الخاصة لزيوت الطعام",
    ],
    ru: [
      "экспорт подсолнечного масла из турции",
      "рафинированное подсолнечное масло оптом",
      "оливковое масло экстра вирджин",
      "флекситанк наливное масло",
      "контрактный розлив сзмс",
      "fob мерсин растительное масло",
    ],
    de: [
      "sonnenblumenöl export türkei",
      "raffiniertes sonnenblumenöl großhandel",
      "natives olivenöl extra",
      "flexitank speiseöl lieferant",
      "private label speiseöl",
      "lebensmittelgroßhandel türkei",
    ],
    fr: [
      "huile de tournesol export turquie",
      "huile de tournesol raffinée en gros",
      "huile d olive vierge extra",
      "fournisseur huile flexitank",
      "marque de distributeur huile alimentaire",
      "exportateur agroalimentaire turquie",
    ],
    es: [
      "exportacion aceite de girasol turquia",
      "aceite de girasol refinado al por mayor",
      "aceite de oliva virgen extra",
      "proveedor de aceite en flexitanque",
      "marca privada aceite comestible",
      "fob mersin aceite de girasol",
    ],
    it: [
      "esportazione olio di girasole turchia",
      "olio di girasole raffinato all ingrosso",
      "olio extravergine di oliva",
      "fornitore olio alimentare flexitank",
      "private label olio commestibile",
      "cif porto spedizione oli vegetali",
    ],
  }

  const baseKeywords = commonByLocale[locale] || commonByLocale.en

  if (page === "sunflower") {
    return [
      ...baseKeywords,
      "Refined Sunflower Seed Oil",
      "HS Code 1512.19",
      "FFA < 0.10%",
      "Peroxide < 1.0 meq",
      "Deodorized sunflower oil",
    ]
  }

  if (page === "olive") {
    return [
      ...baseKeywords,
      "Extra Virgin Olive Oil",
      "Cold Extracted <= 27C",
      "HS Code 1509.20",
      "Acidity < 0.8%",
      "Aegean harvest olive oil",
    ]
  }

  if (page === "wholesale") {
    return [
      ...baseKeywords,
      "B2B bulk edible oils",
      "20ft container edible oils",
      "flexitank 24000 liters",
      "ocean freight container oils",
    ]
  }

  if (articleId) {
    return [
      ...baseKeywords,
      "Trade Guide",
      "B2B Export Intelligence",
      "Incoterms 2020",
      "Edible Oil Specifications",
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

export function buildPageJsonLd({ locale, dict, page, articleId, canonicalUrl }: BuildSchemaArgs): Record<string, unknown>[] {
  const base = siteUrl()
  const logoUrl = `${base}/icon.svg`
  const bannerImage = `${base}/media/hero/master-banner.webp`

  // 1. Corporation / Primary Organization Entity
  const corporationSchema = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    "@id": `${base}/#corporation`,
    name: "Asia Oil",
    legalName: "Asia Oil",
    alternateName: ["Nilasya Agro Foods", "Asia Yağ", "Asia Oil Global Export Desk"],
    url: base,
    logo: logoUrl,
    image: bannerImage,
    email: "export@asiaoil.com.tr",
    telephone: "+905325000000",
    description: dict.metaDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mersin International Port Export Zone & İzmir Agro Hub",
      addressLocality: "Mersin",
      addressRegion: "Akdeniz & Ege",
      postalCode: "33000",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO_COORDINATES.mersin.latitude,
      longitude: GEO_COORDINATES.mersin.longitude,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Worldwide" },
      { "@type": "AdministrativeArea", name: "European Union" },
      { "@type": "AdministrativeArea", name: "Middle East (GCC)" },
      { "@type": "AdministrativeArea", name: "North America" },
      { "@type": "AdministrativeArea", name: "Africa" },
      { "@type": "AdministrativeArea", name: "Central Asia" },
      { "@type": "AdministrativeArea", name: "United Kingdom" },
    ],
    knowsAbout: [
      "Refined Sunflower Oil (HS 1512.19)",
      "Extra Virgin Olive Oil (HS 1509.20)",
      "Bulk Flexitank Ocean Freight Logistics (24,000L)",
      "FOB Mersin & CIF Port International Shipping (Incoterms 2020)",
      "Private Label (OEM) Edible Oil Bottling",
      "Codex Alimentarius & IOC Food Standards",
    ],
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", name: "ISO 22000:2018 Food Safety Management System" },
      { "@type": "EducationalOccupationalCredential", name: "ISO 9001:2015 Quality Management System" },
      { "@type": "EducationalOccupationalCredential", name: "HACCP Food Safety Certification" },
      { "@type": "EducationalOccupationalCredential", name: "Halal Certified Production Lot Inspection" },
      { "@type": "EducationalOccupationalCredential", name: "Kosher Compliance Verification" },
      { "@type": "EducationalOccupationalCredential", name: "EUR.1 & Certificate of Origin Issuance" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+905325000000",
        contactType: "sales and export desk",
        email: "export@asiaoil.com.tr",
        areaServed: "Worldwide",
        availableLanguage: ["Turkish", "English", "Arabic", "Russian", "German", "French", "Spanish", "Italian"],
      },
    ],
    sameAs: [
      "https://github.com/Highlife01/nilasyayag",
    ],
  }

  // 2. WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: "Asia Oil",
    url: base,
    publisher: { "@id": `${base}/#corporation` },
    inLanguage: ["tr", "en", "ar", "ru", "de", "fr", "es", "it"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/${locale}/insights?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  // 3. Dynamic BreadcrumbList Schema
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
      const pageTitle = page === "faq"
        ? dict.nav.faq
        : page === "privacy"
        ? dict.nav.privacy
        : page === "insights"
        ? dict.nav.insights
        : dict.pages[page]?.title || page
      breadcrumbItems.push({
        name: pageTitle,
        url: canonicalUrl,
      })
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  const schemas: Record<string, unknown>[] = [corporationSchema, websiteSchema, breadcrumbSchema]

  // 4. FAQPage Schema (when on FAQ page, or inject on Home)
  if (page === "faq" || page === "home") {
    const faqItems = dict.faq.items || []
    if (faqItems.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
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

  // 5. Product Schema (when on sunflower, olive, or wholesale)
  if (page === "sunflower") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${canonicalUrl}#product`,
      name: locale === "tr" ? "Rafine Ayçiçek Yağı (İhracat Standardı)" : "Refined Sunflower Oil (Export Standard)",
      description: dict.pages.sunflower.description,
      image: `${base}/media/hero/1.webp`,
      brand: { "@id": `${base}/#corporation` },
      category: "Food > Edible Oils > Sunflower Seed Oil",
      sku: "AO-SUN-REF-151219",
      mpn: "HS-1512.19",
      countryOfOrigin: "TR",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        price: "1150",
        lowPrice: "1050",
        highPrice: "1350",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          priceType: "https://schema.org/ListPrice",
          unitCode: "TNE",
        },
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: canonicalUrl,
        seller: { "@id": `${base}/#corporation` },
        eligibleRegion: [
          { "@type": "AdministrativeArea", name: "Worldwide" },
        ],
      },
      additionalProperty: [
        { "@type": "PropertyValue", name: "Harmonized System Code", value: "HS 1512.19" },
        { "@type": "PropertyValue", name: "Free Fatty Acids (as Oleic)", value: "<= 0.10%" },
        { "@type": "PropertyValue", name: "Peroxide Value", value: "<= 1.0 meq O2/kg" },
        { "@type": "PropertyValue", name: "Smoke Point", value: "> 225 °C" },
        { "@type": "PropertyValue", name: "Color (Lovibond)", value: "Max 1.5 Red / 15 Yellow" },
      ],
    })
  } else if (page === "olive") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${canonicalUrl}#product`,
      name: locale === "tr" ? "Natürel Sızma Zeytinyağı (Soğuk Sıkım)" : "Extra Virgin Olive Oil (Cold Extracted)",
      description: dict.pages.olive.description,
      image: `${base}/media/hero/2.webp`,
      brand: { "@id": `${base}/#corporation` },
      category: "Food > Edible Oils > Olive Oil",
      sku: "AO-OLV-EVOO-150920",
      mpn: "HS-1509.20",
      countryOfOrigin: "TR",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        price: "6800",
        lowPrice: "6200",
        highPrice: "7900",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          priceType: "https://schema.org/ListPrice",
          unitCode: "TNE",
        },
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: canonicalUrl,
        seller: { "@id": `${base}/#corporation` },
        eligibleRegion: [
          { "@type": "AdministrativeArea", name: "Worldwide" },
        ],
      },
      additionalProperty: [
        { "@type": "PropertyValue", name: "Harmonized System Code", value: "HS 1509.20" },
        { "@type": "PropertyValue", name: "Free Acidity (as Oleic)", value: "<= 0.80%" },
        { "@type": "PropertyValue", name: "Extraction Method", value: "Cold Extracted <= 27°C" },
        { "@type": "PropertyValue", name: "Peroxide Value", value: "<= 15.0 meq O2/kg" },
        { "@type": "PropertyValue", name: "Standard", value: "International Olive Council (IOC)" },
      ],
    })
  }

  // 6. TechArticle / Article Schema (when reading an insight article)
  if (articleId && dict.articles[articleId]) {
    const article = dict.articles[articleId]
    schemas.push({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "@id": `${canonicalUrl}#article`,
      headline: article.title,
      description: article.description,
      image: bannerImage,
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
        "@type": "Corporation",
        name: "Asia Oil",
        logo: { "@type": "ImageObject", url: logoUrl },
      },
      articleSection: "B2B Commodity Export & Logistics",
      keywords: getKeywordsForPage(locale, "insights", articleId).join(", "),
    })
  }

  // 7. AboutPage / ContactPage Schema
  if (page === "about") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${canonicalUrl}#about`,
      name: dict.pages.about.title,
      description: dict.pages.about.description,
      mainEntity: { "@id": `${base}/#corporation` },
    })
  } else if (page === "contact") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${canonicalUrl}#contact`,
      name: dict.pages.contact.title,
      description: dict.pages.contact.description,
      mainEntity: { "@id": `${base}/#corporation` },
    })
  }

  return schemas
}
