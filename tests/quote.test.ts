import { describe, expect, it } from "vitest"
import { PUBLISHED_LOCALES, matchStatic, pathFor } from "@/lib/i18n/config"
import { parseQuoteQuery, quoteReturnPath, quoteUrl } from "@/lib/quote"
import { commerceCopy } from "@/content/commerce-ui"

describe("quotation configuration", () => {
  it("opens the correct quotation route and retains the complete configuration in every language", () => {
    for (const locale of PUBLISHED_LOCALES) {
      const url = new URL(quoteUrl(locale, { product: "olive", orderType: "container", quantity: 3, containerType: "40ft", packaging: "5L_TIN", destinationPort: "Jebel Ali, UAE" }), "https://example.test")
      expect(url.pathname).toBe(pathFor(locale, "quote"))
      expect(matchStatic(locale, url.pathname.split("/").slice(2))).toBe("quote")
      expect(parseQuoteQuery(Object.fromEntries(url.searchParams))).toEqual({ product: "olive", orderType: "container", quantity: "3 x 40ft FCL", packaging: "5L_TIN", destinationPort: "Jebel Ali, UAE" })
    }
  })

  it("rejects repeated, invalid, oversized and out-of-range prefill values", () => {
    expect(parseQuoteQuery({ product: ["olive", "both"], orderType: "invalid", quantity: "999999", containerType: "80ft", packaging: "x".repeat(301), destinationPort: "x".repeat(121) })).toEqual({ product: undefined, orderType: undefined, quantity: undefined, packaging: undefined, destinationPort: undefined })
    for (const quantity of ["0", "21", "-1", "2.5", "Infinity", "1e1"]) expect(parseQuoteQuery({ quantity }).quantity).toBeUndefined()
    expect(parseQuoteQuery({ product: "both", destinationPort: "  İzmir\n  " })).toMatchObject({ product: "both", destinationPort: "İzmir" })
  })

  it("preserves validated quotation choices across consent redirects", () => {
    const returnPath = quoteReturnPath("de", { product: "olive", quantity: "2", containerType: "20ft", packaging: "5L_TIN", destinationPort: "Hamburg", next: "https://other.test", utm: "ignored" })
    const url = new URL(returnPath, "https://example.test")
    expect(url.pathname).toBe("/de/angebot")
    expect(url.searchParams.has("next")).toBe(false)
    expect(url.searchParams.has("utm")).toBe(false)
    expect(parseQuoteQuery(Object.fromEntries(url.searchParams))).toMatchObject({ product: "olive", quantity: "2 x 20ft FCL", packaging: "5L_TIN", destinationPort: "Hamburg" })
  })

  it("provides a distinct service-unavailable message in all published languages", () => {
    expect(new Set(PUBLISHED_LOCALES.map((locale) => commerceCopy(locale).unavailable)).size).toBe(8)
  })
})
