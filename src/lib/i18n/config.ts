export const PUBLISHED_LOCALES = ["tr", "en", "ar", "ru", "de", "fr", "es", "it"] as const
export type Locale = (typeof PUBLISHED_LOCALES)[number]

export const PREPARED_LOCALES: { code: string; name: string }[] = [
  { code: "pt", name: "Português" },
  { code: "nl", name: "Nederlands" },
  { code: "pl", name: "Polski" },
  { code: "uk", name: "Українська" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "hi", name: "हिन्दी" },
  { code: "ur", name: "اردو" },
  { code: "fa", name: "فارسی" },
  { code: "he", name: "עברית" },
  { code: "el", name: "Ελληνικά" },
  { code: "ro", name: "Română" },
  { code: "bg", name: "Български" },
  { code: "cs", name: "Čeština" },
  { code: "hu", name: "Magyar" },
  { code: "sv", name: "Svenska" },
  { code: "da", name: "Dansk" },
  { code: "nb", name: "Norsk" },
  { code: "fi", name: "Suomi" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "th", name: "ไทย" },
  { code: "vi", name: "Tiếng Việt" },
]

export const LOCALE_META: Record<Locale, { name: string; dir: "ltr" | "rtl"; html: string }> = {
  tr: { name: "Türkçe", dir: "ltr", html: "tr" },
  en: { name: "English", dir: "ltr", html: "en" },
  ar: { name: "العربية", dir: "rtl", html: "ar" },
  ru: { name: "Русский", dir: "ltr", html: "ru" },
  de: { name: "Deutsch", dir: "ltr", html: "de" },
  fr: { name: "Français", dir: "ltr", html: "fr" },
  es: { name: "Español", dir: "ltr", html: "es" },
  it: { name: "Italiano", dir: "ltr", html: "it" },
}

export type StaticPage =
  | "home"
  | "sunflower"
  | "olive"
  | "wholesale"
  | "trade"
  | "privateLabel"
  | "quality"
  | "about"
  | "insights"
  | "quote"
  | "contact"
  | "faq"
  | "privacy"

export const STATIC_PAGES: StaticPage[] = [
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

const SLUGS: Record<Locale, Record<Exclude<StaticPage, "home">, string>> = {
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

export function isLocale(value: string): value is Locale {
  return (PUBLISHED_LOCALES as readonly string[]).includes(value)
}

export function preferredLocale(header: string | null): Locale {
  if (!header) return "en"
  const parts = header.split(",").map((part) => part.split(";")[0]?.trim().toLowerCase() ?? "")
  for (const part of parts) {
    const base = part.split("-")[0]
    if (base && isLocale(base)) return base
  }
  return "en"
}

export function slugFor(locale: Locale, page: Exclude<StaticPage, "home">) {
  return SLUGS[locale][page]
}

export function pathFor(locale: Locale, page: StaticPage, articleSlug?: string) {
  if (page === "home") return `/${locale}`
  if (articleSlug) return `/${locale}/${slugFor(locale, "insights")}/${articleSlug}`
  return `/${locale}/${slugFor(locale, page)}`
}

export function matchStatic(locale: Locale, parts: string[]): Exclude<StaticPage, "home"> | null {
  const joined = parts.join("/")
  const entries = Object.entries(SLUGS[locale]) as [Exclude<StaticPage, "home">, string][]
  const found = entries.find(([, slug]) => slug === joined)
  return found ? found[0] : null
}

export function insightBase(locale: Locale) {
  return slugFor(locale, "insights")
}
