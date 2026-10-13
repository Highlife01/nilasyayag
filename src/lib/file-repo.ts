import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"
import { createMemoryRepo, normalizeSnapshot, type Repo, type Snapshot } from "@/lib/model"

export function createFileRepo(filePath: string): Repo {
  let inner: Promise<Repo> | null = null

  async function save(snapshot: Snapshot) {
    await mkdir(path.dirname(filePath), { recursive: true })
    const temp = `${filePath}.${process.pid}.tmp`
    await writeFile(temp, JSON.stringify(snapshot), { encoding: "utf8", mode: 0o600 })
    await rename(temp, filePath)
  }

  async function load(): Promise<Repo> {
    let initial: Snapshot
    try {
      const parsed: unknown = JSON.parse(await readFile(filePath, "utf8"))
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("The runtime data file must contain an object")
      }
      initial = normalizeSnapshot(parsed)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
      initial = normalizeSnapshot(null)
    }
    return createMemoryRepo(initial, save)
  }

  const repo = () => (inner ??= load())

  return {
    getControl: async () => (await repo()).getControl(),
    getSettings: async () => (await repo()).getSettings(),
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
    overview: async (since) => (await repo()).overview(since),
  }
}

export function runtimeFile() {
  return path.join(process.cwd(), "data", "runtime.json")
}
