import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { Firestore } from "firebase-admin/firestore"
import { createFileRepo } from "@/lib/file-repo"
import { createFirestoreRepo } from "@/lib/firestore-repo"
import { submitInquiry } from "@/lib/inquiry-service"
import { createMemoryRepo, emptyControl, type Inquiry, type Repo } from "@/lib/model"
import { SUPERADMIN_EMAIL } from "@/lib/site"

const io = vi.hoisted(() => ({ readFile: vi.fn(), mkdir: vi.fn(), writeFile: vi.fn(), rename: vi.fn() }))
const cookieJar = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }))

vi.mock("node:fs/promises", () => io)
vi.mock("server-only", () => ({}))
vi.mock("next/headers", () => ({
  cookies: async () => cookieJar,
  headers: async () => new Headers({ origin: "http://localhost:43123", host: "localhost:43123" }),
}))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  io.readFile.mockReset().mockRejectedValue(Object.assign(new Error("missing"), { code: "ENOENT" }))
  io.mkdir.mockReset().mockResolvedValue(undefined)
  io.writeFile.mockReset().mockResolvedValue(undefined)
  io.rename.mockReset().mockResolvedValue(undefined)
  cookieJar.get.mockReset().mockReturnValue(undefined)
  cookieJar.set.mockReset()
  vi.stubEnv("NODE_ENV", "test")
  vi.stubEnv("FIREBASE_SERVICE_ACCOUNT_JSON", undefined)
  vi.stubEnv("FIREBASE_USE_ADC", undefined)
  vi.stubEnv("FIREBASE_WEB_API_KEY", undefined)
  vi.stubEnv("K_SERVICE", undefined)
  vi.stubEnv("NILASYA_ALLOW_FILE_STORE", undefined)
  vi.stubEnv("NILASYA_ADMIN_PASSWORD", "test-password")
  vi.stubEnv("NILASYA_SESSION_SECRET", "a-test-session-secret-with-at-least-32-characters")
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

function validRaw(now: number): Record<string, string> {
  return {
    company: "North Mill",
    contactName: "Ada Lorca",
    email: "ada@northmill.example",
    phone: "+49 30 000",
    country: "Germany",
    destinationPort: "Hamburg",
    product: "sunflower",
    orderType: "container",
    quantity: "1 x 20ft",
    packaging: "flexitank",
    message: "Please quote one container of sunflower oil for Hamburg.",
    consent: "yes",
    locale: "en",
    formType: "rfq",
    renderedAt: String(now - 5000),
  }
}

function inquiry(): Inquiry {
  return {
    id: "inquiry-test-123",
    createdAt: new Date().toISOString(),
    collection: "rfq_requests",
    formType: "rfq",
    status: "new",
    assignee: "",
    company: "North Mill",
    contactName: "Ada Lorca",
    email: "ada@northmill.example",
    phone: "+49 30 000",
    country: "Germany",
    destinationPort: "Hamburg",
    product: "sunflower",
    orderType: "container",
    quantity: "1 x 20ft",
    packaging: "flexitank",
    message: "Please quote one container of sunflower oil for Hamburg.",
    locale: "en",
    consent: true,
    ipHash: "test",
    notification: { status: "queued", detail: "Waiting for the mailer." },
    notes: [],
    history: [],
  }
}

function submit(repo: Repo, notify = vi.fn(async (): Promise<Inquiry["notification"]> => ({ status: "sent", detail: "test" }))) {
  const now = Date.now()
  return submitInquiry(repo, validRaw(now), { now, ip: "203.0.113.10", salt: "test", notify })
}

describe("storage failures", () => {
  it("does not grant access when a Firestore control read fails, even after public settings fall back", async () => {
    const unavailable = new Error("store unavailable")
    const db = { doc: () => ({ get: vi.fn().mockRejectedValue(unavailable) }) } as unknown as Firestore
    const repo = createFirestoreRepo(db)

    await expect(repo.getSettings()).resolves.toEqual(emptyControl().settings)
    await expect(repo.getControl()).rejects.toBe(unavailable)
  })

  it("propagates failed Firestore rate transactions and durable writes", async () => {
    const unavailable = new Error("store unavailable")
    const ref = {
      set: vi.fn().mockRejectedValue(unavailable),
      delete: vi.fn().mockRejectedValue(unavailable),
      update: vi.fn().mockRejectedValue(unavailable),
      get: vi.fn().mockRejectedValue(unavailable),
    }
    const db = {
      collection: () => ({ doc: () => ref }),
      runTransaction: vi.fn().mockRejectedValue(unavailable),
      batch: () => ({ set: vi.fn(), commit: vi.fn().mockRejectedValue(unavailable) }),
    } as unknown as Firestore
    const repo = createFirestoreRepo(db)
    const lead = inquiry()
    const audit = { id: "audit-test-123", at: lead.createdAt, actor: "website", action: "inquiry.create", detail: lead.id }

    await expect(repo.consumeRate("login:test", 8, 1000, Date.now())).rejects.toBe(unavailable)
    await expect(repo.createInquiry(lead, audit)).rejects.toBe(unavailable)
    await expect(repo.createSession({ id: "session-test-123", email: SUPERADMIN_EMAIL, createdAt: lead.createdAt, expiresAt: lead.createdAt })).rejects.toBe(unavailable)
    await expect(repo.getSession("session-test-123")).rejects.toBe(unavailable)
    await expect(repo.deleteSession("session-test-123")).rejects.toBe(unavailable)
    await expect(repo.appendAudit(audit)).rejects.toBe(unavailable)
    await expect(repo.setNotification(lead, { status: "sent", detail: "test" })).rejects.toBe(unavailable)
  })

  it.each(["{broken", "null", "[]"])("preserves a corrupt runtime file containing %s", async (data) => {
    io.readFile.mockResolvedValue(data)
    const repo = createFileRepo("data/runtime.json")

    await expect(repo.getControl()).rejects.toThrow()
    await expect(repo.createSession({ id: "session-test-123", email: SUPERADMIN_EMAIL, createdAt: "now", expiresAt: "later" })).rejects.toThrow()
    expect(io.writeFile).not.toHaveBeenCalled()
  })

  it("does not reset runtime data after a permissions error", async () => {
    const denied = Object.assign(new Error("access denied"), { code: "EACCES" })
    io.readFile.mockRejectedValue(denied)
    const repo = createFileRepo("data/runtime.json")

    await expect(repo.getControl()).rejects.toBe(denied)
    expect(io.writeFile).not.toHaveBeenCalled()
  })

  it("initializes a missing file and rolls back a failed durable write before accepting another", async () => {
    const repo = createFileRepo("data/runtime.json")
    const lead = inquiry()
    const audit = { id: "audit-test-123", at: lead.createdAt, actor: "website", action: "inquiry.create", detail: lead.id }
    io.writeFile.mockRejectedValueOnce(new Error("disk full"))

    await expect(repo.createInquiry(lead, audit)).rejects.toThrow("disk full")
    await expect(repo.listInquiries()).resolves.toEqual([])
    await repo.createInquiry(lead, audit)
    expect((await repo.listInquiries()).map((row) => row.id)).toEqual([lead.id])
  })
})

describe("production repository selection", () => {
  it("requires an explicit opt-in for a production file repository", async () => {
    vi.stubEnv("NODE_ENV", "production")
    const { getRepo } = await import("@/server/runtime")

    await expect(getRepo()).rejects.toThrow("Firestore is required")
    expect(io.readFile).not.toHaveBeenCalled()
  })

  it("allows an explicitly configured production file repository", async () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("NILASYA_ALLOW_FILE_STORE", "1")
    const { getRepo } = await import("@/server/runtime")

    await expect((await getRepo()).getControl()).resolves.toMatchObject({ sessionVersion: 1 })
  })

  it("does not replace an unavailable configured Firestore with a fresh file repository", async () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("FIREBASE_USE_ADC", "1")
    vi.stubEnv("NILASYA_ALLOW_FILE_STORE", "1")
    const firestore = await import("@/lib/firestore-repo")
    const unavailable = new Error("Firestore initialization failed")
    vi.spyOn(firestore, "createFirestoreRepo").mockImplementationOnce(() => { throw unavailable })
    const { getRepo } = await import("@/server/runtime")

    await expect(getRepo()).rejects.toBe(unavailable)
    expect(io.readFile).not.toHaveBeenCalled()
  })
})

describe("inquiry failure responses", () => {
  it.each(["consumeRate", "createInquiry"] as const)("returns unavailable when %s fails and never sends a notification", async (operation) => {
    const repo = createMemoryRepo()
    vi.spyOn(repo, operation).mockRejectedValue(new Error("store unavailable"))
    const notify = vi.fn(async (): Promise<Inquiry["notification"]> => ({ status: "sent", detail: "test" }))

    await expect(submit(repo, notify)).resolves.toEqual({ ok: false, code: "unavailable" })
    expect(notify).not.toHaveBeenCalled()
    expect(await repo.listInquiries()).toEqual([])
  })

  it("keeps a saved inquiry successful when sending the notification fails", async () => {
    const repo = createMemoryRepo()
    const notify = vi.fn<() => Promise<Inquiry["notification"]>>().mockRejectedValue(new Error("mailer unavailable"))

    expect((await submit(repo, notify)).ok).toBe(true)
    const saved = await repo.listInquiries()
    expect(saved).toHaveLength(1)
    expect(saved[0].notification.status).toBe("failed")
  })

  it("keeps a saved inquiry successful when its notification status cannot be persisted", async () => {
    const repo = createMemoryRepo()
    vi.spyOn(repo, "setNotification").mockRejectedValue(new Error("store unavailable"))
    vi.spyOn(console, "warn").mockImplementation(() => undefined)

    expect((await submit(repo)).ok).toBe(true)
    expect(await repo.listInquiries()).toHaveLength(1)
  })

  it("returns unavailable from the public action when repository initialization fails", async () => {
    const runtime = await import("@/server/runtime")
    vi.spyOn(runtime, "getRepo").mockRejectedValue(new Error("store unavailable"))
    const { submitInquiryAction } = await import("@/server/inquiry-action")

    await expect(submitInquiryAction({ ok: true }, new FormData())).resolves.toEqual({ ok: false, code: "unavailable" })
  })
})

describe("authentication storage failures", () => {
  it("does not authenticate or write a session cookie when the MFA control cannot be read", async () => {
    const repo = createMemoryRepo()
    const unavailable = new Error("control unavailable")
    vi.spyOn(repo, "getControl").mockRejectedValue(unavailable)
    const createSession = vi.spyOn(repo, "createSession")
    const runtime = await import("@/server/runtime")
    vi.spyOn(runtime, "getRepo").mockResolvedValue(repo)
    const { authenticate } = await import("@/server/session")

    await expect(authenticate(SUPERADMIN_EMAIL, "test-password", "")).rejects.toBe(unavailable)
    expect(createSession).not.toHaveBeenCalled()
    expect(cookieJar.set).not.toHaveBeenCalled()
  })

  it("rejects enabled MFA with a missing secret", async () => {
    const control = emptyControl()
    control.mfa.enabled = true
    const repo = createMemoryRepo({ control })
    const createSession = vi.spyOn(repo, "createSession")
    const runtime = await import("@/server/runtime")
    vi.spyOn(runtime, "getRepo").mockResolvedValue(repo)
    const { authenticate } = await import("@/server/session")

    await expect(authenticate(SUPERADMIN_EMAIL, "test-password", "")).rejects.toThrow("MFA")
    expect(createSession).not.toHaveBeenCalled()
    expect(cookieJar.set).not.toHaveBeenCalled()
  })

  it("does not issue a cookie when the session cannot be persisted", async () => {
    const repo = createMemoryRepo()
    const unavailable = new Error("session unavailable")
    vi.spyOn(repo, "createSession").mockRejectedValue(unavailable)
    const runtime = await import("@/server/runtime")
    vi.spyOn(runtime, "getRepo").mockResolvedValue(repo)
    const { authenticate } = await import("@/server/session")

    await expect(authenticate(SUPERADMIN_EMAIL, "test-password", "")).rejects.toBe(unavailable)
    expect(cookieJar.set).not.toHaveBeenCalled()
  })

  it("rolls back the session and does not issue a cookie when the login audit cannot be saved", async () => {
    const repo = createMemoryRepo()
    const unavailable = new Error("audit unavailable")
    vi.spyOn(repo, "appendAudit").mockRejectedValue(unavailable)
    const createSession = vi.spyOn(repo, "createSession")
    const deleteSession = vi.spyOn(repo, "deleteSession")
    const runtime = await import("@/server/runtime")
    vi.spyOn(runtime, "getRepo").mockResolvedValue(repo)
    const { authenticate } = await import("@/server/session")

    await expect(authenticate(SUPERADMIN_EMAIL, "test-password", "")).rejects.toBe(unavailable)
    const sid = createSession.mock.calls[0][0].id
    expect(deleteSession).toHaveBeenCalledWith(sid)
    await expect(repo.getSession(sid)).resolves.toBeNull()
    expect(cookieJar.set).not.toHaveBeenCalled()
  })

  it("does not issue a cookie when both the login audit and rollback fail", async () => {
    const repo = createMemoryRepo()
    const unavailable = new Error("audit unavailable")
    vi.spyOn(repo, "appendAudit").mockRejectedValue(unavailable)
    const deleteSession = vi.spyOn(repo, "deleteSession").mockRejectedValue(new Error("rollback unavailable"))
    vi.spyOn(console, "warn").mockImplementation(() => undefined)
    const runtime = await import("@/server/runtime")
    vi.spyOn(runtime, "getRepo").mockResolvedValue(repo)
    const { authenticate } = await import("@/server/session")

    await expect(authenticate(SUPERADMIN_EMAIL, "test-password", "")).rejects.toBe(unavailable)
    expect(deleteSession).toHaveBeenCalledOnce()
    expect(cookieJar.set).not.toHaveBeenCalled()
  })

  it("does not report a successful logout when the session cannot be revoked", async () => {
    const repo = createMemoryRepo()
    const unavailable = new Error("revocation unavailable")
    vi.spyOn(repo, "deleteSession").mockRejectedValue(unavailable)
    const runtime = await import("@/server/runtime")
    vi.spyOn(runtime, "getRepo").mockResolvedValue(repo)
    const { endSession, signSession } = await import("@/server/session")
    const token = await signSession(SUPERADMIN_EMAIL, "superadmin", 1, "session-test-123")
    cookieJar.get.mockReturnValue({ value: token })

    await expect(endSession()).rejects.toBe(unavailable)
    expect(cookieJar.set).not.toHaveBeenCalled()
  })
})
