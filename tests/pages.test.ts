import { describe, expect, it } from "vitest"
import { ARTICLE_IDS, articleIdBySlug, getDict } from "@/content/index"
import { PUBLISHED_LOCALES, matchStatic, pathFor } from "@/lib/i18n/config"
import { can, canTransition, inquirySchema } from "@/lib/domain"
import { createMemoryRepo, normalizeSnapshot } from "@/lib/model"
import { INQUIRY_LIMITS, submitInquiry } from "@/lib/inquiry-service"

describe("localized pages", () => {
  it("keeps sunflower and olive on their own urls", () => {
    expect(pathFor("en", "sunflower")).toBe("/en/products/sunflower-oil")
    expect(pathFor("tr", "sunflower")).toBe("/tr/urunler/aycicek-yagi")
    expect(pathFor("en", "olive")).toBe("/en/products/olive-oil")
    expect(pathFor("tr", "olive")).toBe("/tr/urunler/zeytinyagi")
    expect(matchStatic("en", ["products", "sunflower-oil"])).toBe("sunflower")
    expect(matchStatic("de", ["produkte", "olivenoel"])).toBe("olive")
  })

  it("publishes a distinct article url in every language", () => {
    const urls = new Set<string>()
    for (const locale of PUBLISHED_LOCALES) {
      for (const id of ARTICLE_IDS) {
        const slug = getDict(locale).articles[id].slug
        const url = pathFor(locale, "insights", slug)
        expect(urls.has(url)).toBe(false)
        urls.add(url)
        expect(articleIdBySlug(locale, slug)).toBe(id)
        expect(getDict(locale).articles[id].h1.length).toBeGreaterThan(8)
      }
    }
    expect(urls.size).toBe(PUBLISHED_LOCALES.length * ARTICLE_IDS.length)
  })
})

describe("inquiry", () => {
  it("stores a valid quotation and rejects a missing consent", async () => {
    const repo = createMemoryRepo()
    const base = {
      company: "North Mill",
      contactName: "Ada Lorca",
      email: "ada@northmill.example",
      phone: "+49 30 000",
      country: "Germany",
      countryOther: "",
      destinationPort: "Hamburg",
      product: "sunflower",
      orderType: "container",
      quantity: "1 x 20ft",
      packaging: "flexitank",
      message: "Please quote one container of sunflower oil for Hamburg.",
      consent: "yes",
      locale: "en",
      formType: "rfq",
      website: "",
      renderedAt: String(Date.now() - 5000),
    }
    const saved = await submitInquiry(repo, base, {
      ip: "203.0.113.10",
      salt: "test",
      now: Date.now(),
      notify: async () => ({ status: "queued", detail: "test" }),
    })
    expect(saved.ok).toBe(true)
    const [lead] = await repo.listInquiries()
    expect(lead?.collection).toBe("rfq_requests")
    expect(lead?.status).toBe("new")
    expect(lead?.notification.detail).toBe("test")
    const rejected = inquirySchema.safeParse({ ...base, consent: "no" })
    expect(rejected.success).toBe(false)
    expect(canTransition("new", "quoted")).toBe(false)
    expect(canTransition("new", "contacted")).toBe(true)
  })

  it("limits one email even when the ip changes", async () => {
    const repo = createMemoryRepo()
    const now = Date.now()
    const results = []
    for (let index = 0; index < INQUIRY_LIMITS.perEmail + 1; index += 1) {
      results.push(
        await submitInquiry(repo, { ...validRaw(now), email: "same@buyer.example" }, {
          ip: `198.51.100.${index}`,
          salt: "test",
          now,
          notify: async () => ({ status: "queued", detail: "test" }),
        }),
      )
    }
    expect(results.slice(0, INQUIRY_LIMITS.perEmail).every((result) => result.ok)).toBe(true)
    expect(results.at(-1)).toEqual({ ok: false, code: "rate" })
  })

  it("updates a lead and writes the audit in the same step", async () => {
    const repo = createMemoryRepo()
    const now = Date.now()
    const saved = await submitInquiry(repo, validRaw(now), {
      ip: "203.0.113.20",
      salt: "test",
      now,
      notify: async () => ({ status: "queued", detail: "test" }),
    })
    if (!saved.ok) throw new Error("expected a saved inquiry")
    const updated = await repo.updateInquiry(saved.id, (lead) => {
      lead.status = "contacted"
      return { id: "audit-1", at: new Date(now).toISOString(), actor: "sales@nilasya.example", action: "lead.update", detail: lead.id }
    })
    expect(updated?.status).toBe("contacted")
    expect((await repo.getInquiry(saved.id))?.status).toBe("contacted")
    expect(await repo.updateInquiry("missing-id", () => null)).toBeNull()
  })
})

describe("roles", () => {
  it("keeps leads away from editors and analysts", () => {
    expect(can("sales", "leads.write")).toBe(true)
    expect(can("editor", "leads")).toBe(false)
    expect(can("analyst", "leads")).toBe(false)
    expect(can("analyst", "leads.write")).toBe(false)
    expect(can("superadmin", "leads.write")).toBe(true)
  })
})

describe("stored data", () => {
  it("reads the old single-file layout", async () => {
    const legacy = normalizeSnapshot({
      sessionVersion: 3,
      settings: { phone: "+90 000" } as never,
      inquiries: [],
      visits: [{ date: "2026-10-01", path: "/en", locale: "en", country: "DE", count: 4 }],
    })
    expect(legacy.control.sessionVersion).toBe(3)
    expect(legacy.control.settings.phone).toBe("+90 000")
    expect(legacy.control.users.some((user) => user.role === "superadmin")).toBe(true)
    const repo = createMemoryRepo(legacy)
    await repo.recordVisit({ date: "2026-10-01", path: "/en", locale: "en", country: "DE" }, "v1")
    const overview = await repo.overview("2026-10-01T00:00:00.000Z")
    expect(overview.visits).toBe(5)
    expect(overview.visitors).toBe(1)
  })

  it("stops counting once the window is full", async () => {
    const repo = createMemoryRepo()
    const now = Date.now()
    expect(await repo.consumeRate("k", 2, 1000, now)).toBe(true)
    expect(await repo.consumeRate("k", 2, 1000, now)).toBe(true)
    expect(await repo.consumeRate("k", 2, 1000, now)).toBe(false)
    expect(await repo.consumeRate("k", 2, 1000, now + 1001)).toBe(true)
  })
})

function validRaw(now: number): Record<string, string> {
  return {
    company: "North Mill",
    contactName: "Ada Lorca",
    email: "ada@northmill.example",
    phone: "+49 30 000",
    country: "Germany",
    countryOther: "",
    destinationPort: "Hamburg",
    product: "sunflower",
    orderType: "container",
    quantity: "1 x 20ft",
    packaging: "flexitank",
    message: "Please quote one container of sunflower oil for Hamburg.",
    consent: "yes",
    locale: "en",
    formType: "rfq",
    website: "",
    renderedAt: String(now - 5000),
  }
}
