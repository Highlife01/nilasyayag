import { beforeEach, describe, expect, it, vi } from "vitest"
import { Children, isValidElement, type ReactElement, type ReactNode } from "react"
import { existsSync } from "node:fs"
import path from "node:path"
import { ARTICLE_IDS, articleIdBySlug, getDict } from "@/content/index"
import { PUBLISHED_LOCALES, STATIC_PAGES, insightBase, matchStatic, pathFor, preferredLocale } from "@/lib/i18n/config"
import { createMemoryRepo, type Inquiry } from "@/lib/model"
import sitemap from "@/app/sitemap"

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  getRepo: vi.fn(),
  authenticate: vi.fn(),
  endSession: vi.fn(),
}))

vi.mock("@/server/session", () => ({ requireUser: mocks.requireUser, authenticate: mocks.authenticate, endSession: mocks.endSession }))
vi.mock("@/server/runtime", () => ({ getRepo: mocks.getRepo }))
vi.mock("@/server/request", () => ({ clientIp: () => "203.0.113.1" }))
vi.mock("next/headers", () => ({ headers: async () => new Headers() }))
vi.mock("next/navigation", () => ({
  redirect: (url: string) => { throw new Error(`redirect:${url}`) },
  notFound: () => { throw new Error("not-found") },
}))

import OverviewPage from "@/app/admin/(desk)/page"
import LeadsPage from "@/app/admin/(desk)/leads/page"
import LeadPage from "@/app/admin/(desk)/leads/[id]/page"
import { loginAction, logoutAction, updateLeadAction } from "@/server/admin-actions"

beforeEach(() => {
  vi.resetAllMocks()
  mocks.requireUser.mockResolvedValue({ email: "sales@example.test", role: "sales" })
  mocks.getRepo.mockResolvedValue(createMemoryRepo())
  mocks.authenticate.mockResolvedValue({ ok: true, role: "sales" })
})

type ElementProps = { children?: ReactNode; href?: string; value?: string }
function elements(node: ReactNode): ReactElement<ElementProps>[] {
  return Children.toArray(node).flatMap((child) => isValidElement<ElementProps>(child) ? [child, ...elements(child.props.children)] : [])
}

function viewText(node: ReactNode): string {
  return Children.toArray(node).map((child) => {
    if (isValidElement<ElementProps>(child)) return viewText(child.props.children)
    return typeof child === "string" || typeof child === "number" ? String(child) : ""
  }).join(" ")
}

function inquiry(id: string, overrides: Partial<Inquiry> = {}): Inquiry {
  return {
    id, createdAt: "2026-10-01T12:00:00.000Z", collection: "rfq_requests", formType: "rfq", status: "new", assignee: "",
    company: `Buyer ${id}`, contactName: "Private contact", email: "private@buyer.example", phone: "+90 555 1234567",
    country: "Germany", destinationPort: "Hamburg", product: "sunflower", orderType: "container", quantity: "1 container",
    packaging: "Flexitank", message: "Please send a wholesale quotation.", locale: "en", consent: true, ipHash: "hash",
    notification: { status: "queued", detail: "" }, notes: [], history: [], ...overrides,
  }
}

describe("admin data authorization", () => {
  it.each(["editor", "analyst"])("does not query CRM data for %s", async (role) => {
    mocks.requireUser.mockResolvedValue({ email: "member@example.test", role })
    const view = await OverviewPage()
    expect(mocks.requireUser).toHaveBeenCalledWith("analytics")
    expect(mocks.getRepo).not.toHaveBeenCalled()
    expect(viewText(view)).not.toContain("private@buyer.example")
  })

  it("checks authentication before opening the repository", async () => {
    mocks.requireUser.mockResolvedValue(null)
    await expect(OverviewPage()).rejects.toThrow("redirect:/admin/login")
    expect(mocks.getRepo).not.toHaveBeenCalled()
  })

  it("uses repository totals when more than 1,000 inquiries exist", async () => {
    const repo = createMemoryRepo({ inquiries: Array.from({ length: 1002 }, (_, index) => inquiry(String(index))) })
    const overviewSpy = vi.spyOn(repo, "overview")
    mocks.getRepo.mockResolvedValue(repo)
    const view = await OverviewPage()
    expect(overviewSpy).toHaveBeenCalledOnce()
    const serialized = viewText(view)
    expect(serialized).toContain("1002")
    expect(serialized).toContain("Son 1.000 kayıt")
  })
})

describe("lead filtering, pagination and updates", () => {
  it("finds an older status match beyond the newest 500 records", async () => {
    const rows = Array.from({ length: 501 }, (_, index) => inquiry(String(index), { createdAt: "2026-10-02T12:00:00.000Z" }))
    rows.push(inquiry("older-won", { status: "won" }))
    const repo = createMemoryRepo({ inquiries: rows })
    const listSpy = vi.spyOn(repo, "listInquiries")
    mocks.getRepo.mockResolvedValue(repo)
    const view = await LeadsPage({ searchParams: Promise.resolve({ status: "won" }) })
    expect(listSpy).toHaveBeenCalledWith({ status: "won", before: undefined, limit: 51 })
    expect(viewText(view)).toContain("Buyer older-won")
  })

  it("reaches the next page with a stable timestamp/id cursor", async () => {
    const rows = Array.from({ length: 60 }, (_, index) => inquiry(String(index).padStart(3, "0")))
    const repo = createMemoryRepo({ inquiries: rows })
    mocks.getRepo.mockResolvedValue(repo)
    const first = await LeadsPage({ searchParams: Promise.resolve({}) })
    const nextUrl = elements(first).map((element) => element.props.href).find((url) => url?.startsWith("/admin/leads?before="))
    expect(nextUrl).toBeDefined()
    const before = new URL(nextUrl!, "https://example.test").searchParams.get("before")!
    const second = await LeadsPage({ searchParams: Promise.resolve({ before }) })
    const firstCompanies = viewText(first)
    const secondCompanies = viewText(second)
    expect(firstCompanies).toContain("Buyer 010")
    expect(firstCompanies).not.toContain("Buyer 009")
    expect(secondCompanies).toContain("Buyer 009")
    expect(secondCompanies).not.toContain("Buyer 010")
  })

  it("offers only current and valid next statuses", async () => {
    mocks.getRepo.mockResolvedValue(createMemoryRepo({ inquiries: [inquiry("lead", { status: "new" })] }))
    const view = await LeadPage({ params: Promise.resolve({ id: "lead" }), searchParams: Promise.resolve({}) })
    const options = elements(view).filter((element) => element.type === "option").map((element) => element.props.value)
    expect(options).toEqual(["new", "contacted", "lost"])
  })

  it("rejects an invalid transition without changing assignee, notes or history", async () => {
    const original = inquiry("lead")
    const repo = createMemoryRepo({ inquiries: [original] })
    mocks.getRepo.mockResolvedValue(repo)
    const data = new FormData()
    data.set("id", "lead")
    data.set("status", "won")
    data.set("assignee", "changed@example.test")
    data.set("note", "Should not be saved")
    await expect(updateLeadAction(data)).rejects.toThrow("redirect:/admin/leads/lead?error=invalid-transition")
    expect(await repo.getInquiry("lead")).toEqual(original)
  })

  it("saves a permitted transition and its audit history", async () => {
    const repo = createMemoryRepo({ inquiries: [inquiry("lead")] })
    mocks.getRepo.mockResolvedValue(repo)
    const data = new FormData()
    data.set("id", "lead")
    data.set("status", "contacted")
    data.set("note", "Called the buyer")
    await expect(updateLeadAction(data)).rejects.toThrow("redirect:/admin/leads/lead?saved=1")
    const lead = await repo.getInquiry("lead")
    expect(lead?.status).toBe("contacted")
    expect(lead?.history).toEqual([expect.objectContaining({ status: "contacted", actor: "sales@example.test" })])
    expect(lead?.notes[0]?.body).toBe("Called the buyer")
  })
})

describe("login service errors", () => {
  it("reports storage outages as unavailable", async () => {
    const repo = createMemoryRepo()
    vi.spyOn(repo, "consumeRate").mockRejectedValue(new Error("storage unavailable"))
    mocks.getRepo.mockResolvedValue(repo)
    const data = new FormData()
    data.set("email", "sales@example.test")
    expect(await loginAction({ error: "" }, data)).toEqual({ error: "unavailable" })
    expect(mocks.authenticate).not.toHaveBeenCalled()
  })

  it("keeps a logout failure visible instead of redirecting as successful", async () => {
    mocks.endSession.mockRejectedValue(new Error("revocation unavailable"))
    expect(await logoutAction()).toEqual({ error: "Oturum kapatılamadı. Lütfen yeniden deneyin." })
  })
})

describe("single-source SEO routes", () => {
  it("publishes real static and article routes with reciprocal alternates", () => {
    const rows = sitemap()
    expect(rows).toHaveLength(PUBLISHED_LOCALES.length * (STATIC_PAGES.length + ARTICLE_IDS.length))
    expect(new Set(rows.map((entry) => entry.url)).size).toBe(rows.length)
    for (const entry of rows) {
      const [locale, ...parts] = new URL(entry.url).pathname.split("/").filter(Boolean)
      expect(PUBLISHED_LOCALES).toContain(locale)
      const code = locale as (typeof PUBLISHED_LOCALES)[number]
      if (parts[0] === insightBase(code) && parts.length === 2) expect(articleIdBySlug(code, parts[1])).not.toBeNull()
      else if (parts.length) expect(matchStatic(code, parts)).not.toBeNull()
      expect(Object.keys(entry.alternates!.languages!)).toHaveLength(PUBLISHED_LOCALES.length + 1)
    }
    const englishArticle = rows.find((entry) => new URL(entry.url).pathname === pathFor("en", "insights", getDict("en").articles.quotation.slug))!
    for (const locale of PUBLISHED_LOCALES) {
      expect(new URL(englishArticle.alternates!.languages![locale] as string).pathname).toBe(pathFor(locale, "insights", getDict(locale).articles.quotation.slug))
    }
  })

  it("has no public files shadowing metadata routes", () => {
    expect(existsSync(path.join(process.cwd(), "public", "sitemap.xml"))).toBe(false)
    expect(existsSync(path.join(process.cwd(), "public", "robots.txt"))).toBe(false)
  })
})

describe("language preferences", () => {
  it.each([
    ["de;q=0.2,en;q=0.9", "en"],
    ["de;q=0,en;q=0.5", "en"],
    ["fr-CA;q=0.9,en;q=0.8", "fr"],
    ["ru;q=0.8,tr;q=0.8", "ru"],
    ["de;q=invalid,en;q=0.5", "en"],
    ["en;q=0,*;q=0.5", "tr"],
  ])("selects %s as %s", (header, locale) => {
    expect(preferredLocale(header)).toBe(locale)
  })
})
