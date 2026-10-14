import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"
import { createMemoryRepo, normalizeSnapshot, type Repo, type Snapshot } from "@/lib/model"

export function createFileRepo(filePath: string): Repo {
  let inner: Promise<Repo> | null = null

  async function save(snapshot: Snapshot) {
    await mkdir(path.dirname(filePath), { recursive: true })
    const temp = `${filePath}.${process.pid}.${Date.now()}.tmp`
    await writeFile(temp, JSON.stringify(snapshot), "utf8")
    await rename(temp, filePath)
  }

  async function load(): Promise<Repo> {
    let initial: Snapshot
    try {
      const content = await readFile(filePath, "utf8")
      initial = normalizeSnapshot(JSON.parse(content))
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
        initial = normalizeSnapshot(null)
      } else {
        throw new Error(`Yerel sunucu veri dosyası okunamadı: ${(err as Error)?.message || "Bilinmeyen hata"}`)
      }
    }
    return createMemoryRepo(initial, save)
  }

  const repo = () => {
    if (!inner) {
      inner = load().catch((err) => {
        inner = null
        throw err
      })
    }
    return inner
  }

  return {
    backendType: "file",
    getControl: async () => (await repo()).getControl(),
    getSettings: async () => (await repo()).getSettings(),
    updateRetentionDays: async (days, actor) => (await repo()).updateRetentionDays(days, actor),
    createSession: async (session) => (await repo()).createSession(session),
    getSession: async (id) => (await repo()).getSession(id),
    deleteSession: async (id) => (await repo()).deleteSession(id),
    consumeRate: async (key, limit, windowMs, now) => (await repo()).consumeRate(key, limit, windowMs, now),
    createInquiry: async (inquiry, audit) => (await repo()).createInquiry(inquiry, audit),
    setNotification: async (inquiry, notification) => (await repo()).setNotification(inquiry, notification),
    getInquiry: async (id) => (await repo()).getInquiry(id),
    listInquiries: async (filter) => (await repo()).listInquiries(filter),
    updateInquiry: async (id, fn) => (await repo()).updateInquiry(id, fn),
    appendAudit: async (audit) => (await repo()).appendAudit(audit),
    recordVisit: async (visit, visitorId) => (await repo()).recordVisit(visit, visitorId),
    recordVisitorSessionEvent: async (payload) => (await repo()).recordVisitorSessionEvent(payload),
    recordVisitorConversion: async (sessionId, formType, inquiryId, p, locale, at) =>
      (await repo()).recordVisitorConversion(sessionId, formType, inquiryId, p, locale, at),
    recordAuthLog: async (log) => (await repo()).recordAuthLog(log),
    listAuthLogs: async (options) => (await repo()).listAuthLogs(options),
    queryAnalytics: async (filter) => (await repo()).queryAnalytics(filter),
    cleanupExpiredAnalytics: async (nowMs) => (await repo()).cleanupExpiredAnalytics(nowMs),
    overview: async (since) => (await repo()).overview(since),
  }
}

export function runtimeFile() {
  return path.join(process.cwd(), "data", "runtime.json")
}
