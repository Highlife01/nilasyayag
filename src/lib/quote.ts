import { pathFor, type Locale } from "@/lib/i18n/config"

export const QUOTE_PRODUCTS = ["sunflower", "olive", "both"] as const
export const QUOTE_PACKAGING = ["1L_PET", "5L_TIN", "18L_TIN", "FLEXITANK"] as const
export const QUOTE_CONTAINERS = ["20ft", "40ft"] as const
const ORDER_TYPES = ["container", "bulk", "distribution"] as const

export type QuoteProduct = (typeof QUOTE_PRODUCTS)[number]
export type QuotePackaging = (typeof QUOTE_PACKAGING)[number]
export type QuoteContainer = (typeof QUOTE_CONTAINERS)[number]
export type QuotePrefill = {
  product?: QuoteProduct
  orderType?: (typeof ORDER_TYPES)[number]
  quantity?: string
  packaging?: string
  destinationPort?: string
}
type Query = Record<string, string | string[] | undefined>

function choice<T extends string>(value: string | string[] | undefined, options: readonly T[]): T | undefined {
  return typeof value === "string" && options.includes(value as T) ? (value as T) : undefined
}

function boundedText(value: string | string[] | undefined, limit: number): string | undefined {
  if (typeof value !== "string") return undefined
  const clean = value.replace(/[\u0000-\u001f\u007f]/g, "").trim()
  return clean && clean.length <= limit ? clean : undefined
}

export function parseQuoteQuery(query: Query): QuotePrefill {
  const product = choice(query.product, QUOTE_PRODUCTS)
  const orderType = choice(query.orderType, ORDER_TYPES)
  const containerType = choice(query.containerType, QUOTE_CONTAINERS)
  const rawQuantity = typeof query.quantity === "string" ? query.quantity : ""
  const count = /^\d{1,2}$/.test(rawQuantity) ? Number(rawQuantity) : 0
  const quantity = count >= 1 && count <= 20 ? `${count}${containerType ? ` x ${containerType} FCL` : ""}` : undefined
  return {
    product,
    orderType,
    quantity,
    packaging: boundedText(query.packaging, 300),
    destinationPort: boundedText(query.destinationPort, 120),
  }
}

export function quoteUrl(locale: Locale, configuration: {
  product: QuoteProduct
  orderType: "container" | "bulk" | "distribution"
  quantity: number
  containerType: QuoteContainer
  packaging: QuotePackaging
  destinationPort: string
}) {
  const query = new URLSearchParams({
    product: configuration.product,
    orderType: configuration.orderType,
    quantity: String(configuration.quantity),
    containerType: configuration.containerType,
    packaging: configuration.packaging,
    destinationPort: configuration.destinationPort,
  })
  return `${pathFor(locale, "quote")}?${query}`
}

export function quoteReturnPath(locale: Locale, query: Query) {
  const prefill = parseQuoteQuery(query)
  const retained = new URLSearchParams()
  if (prefill.product) retained.set("product", prefill.product)
  if (prefill.orderType) retained.set("orderType", prefill.orderType)
  if (prefill.quantity) retained.set("quantity", prefill.quantity.split(" ")[0])
  const containerType = choice(query.containerType, QUOTE_CONTAINERS)
  if (containerType) retained.set("containerType", containerType)
  if (prefill.packaging) retained.set("packaging", prefill.packaging)
  if (prefill.destinationPort) retained.set("destinationPort", prefill.destinationPort)
  const suffix = retained.toString()
  return `${pathFor(locale, "quote")}${suffix ? `?${suffix}` : ""}`
}
