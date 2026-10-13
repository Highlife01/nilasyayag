import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import { analyticsAllowed, consentRedirect } from "@/lib/consent"
import { proxy } from "@/proxy"
import { POST as updateConsent } from "@/app/api/consent/route"
import { POST as collectVisit } from "@/app/api/analytics/collect/route"

const state = vi.hoisted(() => ({ cookies: new Map<string, string>(), getRepo: vi.fn(), recordVisit: vi.fn() }))
vi.mock("server-only", () => ({}))
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (name: string) => state.cookies.has(name) ? { value: state.cookies.get(name) } : undefined }),
  headers: async () => new Headers(),
}))
vi.mock("@/server/runtime", () => ({ getRepo: state.getRepo }))

beforeEach(() => {
  state.cookies.clear()
  vi.clearAllMocks()
  state.getRepo.mockResolvedValue({ recordVisit: state.recordVisit })
})

function consentRequest(choice: string, next = "/tr") {
  return new Request("http://localhost:43123/api/consent", {
    method: "POST",
    headers: { origin: "http://localhost:43123", host: "localhost:43123" },
    body: new URLSearchParams({ choice, next }),
  })
}

function visitRequest() {
  return new Request("http://localhost:43123/api/analytics/collect", { method: "POST", body: JSON.stringify({ path: "/en" }) })
}

describe("consent and tracking", () => {
  it.each([undefined, "necessary", "invalid"])("does not write or count tracking without explicit consent: %s", async (choice) => {
    if (choice) state.cookies.set("nilasya_consent", choice)
    const request = new NextRequest("http://localhost:43123/en", { headers: choice ? { cookie: `nilasya_consent=${choice}` } : {} })
    expect(proxy(request).cookies.get("nilasya_vid")).toBeUndefined()
    expect((await collectVisit(visitRequest())).status).toBe(204)
    expect(state.getRepo).not.toHaveBeenCalled()
    expect(analyticsAllowed(choice)).toBe(false)
  })

  it("creates a tracking cookie and records a visit only after acceptance", async () => {
    state.cookies.set("nilasya_consent", "all")
    state.cookies.set("nilasya_vid", "accepted-visitor")
    const request = new NextRequest("http://localhost:43123/en", { headers: { cookie: "nilasya_consent=all" } })
    expect(proxy(request).cookies.get("nilasya_vid")?.value).toBeTruthy()
    expect((await collectVisit(visitRequest())).status).toBe(204)
    expect(state.recordVisit).toHaveBeenCalledWith(expect.objectContaining({ path: "/en", locale: "en" }), "accepted-visitor")
  })

  it("revokes the tracking cookie when analytics consent is withdrawn", async () => {
    const response = await updateConsent(consentRequest("necessary"))
    expect(response.cookies.get("nilasya_consent")?.value).toBe("necessary")
    expect(response.cookies.get("nilasya_vid")?.maxAge).toBe(0)
    const request = new NextRequest("http://localhost:43123/tr", { headers: { cookie: "nilasya_vid=legacy-id" } })
    expect(proxy(request).cookies.get("nilasya_vid")?.maxAge).toBe(0)
  })

  it("returns to the same local origin and preserves quotation selections", async () => {
    const next = "/tr/teklif-iste?product=olive&quantity=2%20x%2040ft"
    const response = await updateConsent(consentRequest("all", next))
    expect(response.status).toBe(303)
    expect(response.headers.get("location")).toBe(`http://localhost:43123${next}`)
    expect(response.cookies.get("nilasya_vid")?.value).toBeTruthy()
  })

  it("rejects cross-origin preference submissions", async () => {
    const request = consentRequest("all")
    request.headers.set("origin", "https://example.invalid")
    expect((await updateConsent(request)).status).toBe(403)
  })

  it("rejects invalid choices instead of granting consent", async () => {
    const response = await updateConsent(consentRequest("invalid"))
    expect(response.status).toBe(400)
    expect(response.cookies.get("nilasya_consent")).toBeUndefined()
  })

  it("keeps optional analytics from failing a page when storage is unavailable", async () => {
    state.cookies.set("nilasya_consent", "all")
    state.getRepo.mockRejectedValueOnce(new Error("storage unavailable"))
    expect((await collectVisit(visitRequest())).status).toBe(204)
  })
})

describe("consent redirect validation", () => {
  it.each(["//example.invalid", "/\\example.invalid", "https://example.invalid", "/\t/example.invalid", "javascript:alert(1)", " /en"])("blocks external redirect input: %s", (value) => {
    expect(consentRedirect(value, "http://localhost:43123/api/consent").href).toBe("http://localhost:43123/en")
  })
})