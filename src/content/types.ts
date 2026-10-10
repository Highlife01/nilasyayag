export type Section = { h: string; p: string[]; b?: string[] }
export type PageCopy = {
  title: string
  description: string
  kicker: string
  h1: string
  lede: string
  sections: Section[]
}
export type ArticleId = "quotation" | "packaging" | "documents" | "distributor"

export type Dict = {
  metaDescription: string
  nav: {
    home: string
    sunflower: string
    olive: string
    wholesale: string
    trade: string
    privateLabel: string
    quality: string
    about: string
    insights: string
    quote: string
    contact: string
    faq: string
    privacy: string
  }
  ui: {
    skip: string
    quote: string
    explore: string
    read: string
    menu: string
    language: string
    allInsights: string
    specifications: string
    shipsFrom: string
    shipsFromValue: string
    model: string
    modelValue: string
    packing: string
    packingValue: string
    family: string
    pause: string
    play: string
    previous: string
    next: string
    slide: string
    photo: string
  }
  hero: { kicker: string; title: string; lede: string; alt: string }[]
  home: {
    bar: string
    collectionsKicker: string
    collectionsTitle: string
    sunText: string
    oliveText: string
    principlesKicker: string
    principlesTitle: string
    principles: { t: string; d: string }[]
    processKicker: string
    processTitle: string
    steps: { t: string; d: string }[]
    bandKicker: string
    bandTitle: string
    bandText: string
    answersKicker: string
    answersTitle: string
    closingTitle: string
    closingText: string
  }
  pages: Record<"sunflower" | "olive" | "wholesale" | "trade" | "privateLabel" | "quality" | "about" | "contact" | "quote", PageCopy>
  insights: PageCopy
  articles: Record<ArticleId, PageCopy & { slug: string }>
  faq: PageCopy & { items: { q: string; a: string }[] }
  privacy: PageCopy
  form: {
    product: string
    sunflower: string
    olive: string
    both: string
    orderType: string
    container: string
    bulk: string
    distribution: string
    company: string
    contactName: string
    email: string
    phone: string
    country: string
    destination: string
    quantity: string
    packaging: string
    message: string
    consent: string
    submit: string
    success: string
    invalid: string
    tooFast: string
    stale: string
    rate: string
    selectCountry: string
    other: string
    otherLabel: string
    honeypot: string
    quantityPh: string
    packagingPh: string
    messagePh: string
    contactIntro: string
  }
  footer: { note: string; rights: string }
  consent: { text: string; accept: string; reject: string }
  notFound: { title: string; text: string }
}
