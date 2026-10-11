import { SUPERADMIN_EMAIL, EXPORT_EMAIL } from "@/lib/site"
import type { InquiryStatus, Role } from "@/lib/domain"

export type Note = { id: string; at: string; author: string; body: string }
export type History = { at: string; status: InquiryStatus; actor: string }

export type Inquiry = {
  id: string
  createdAt: string
  collection: "rfq_requests" | "contact_submissions"
  formType: "rfq" | "contact"
  status: InquiryStatus
  assignee: string
  company: string
  contactName: string
  email: string
  phone: string
  country: string
  destinationPort: string
  product: "sunflower" | "olive" | "both"
  orderType: "container" | "bulk" | "distribution"
  quantity: string
  packaging: string
  message: string
  locale: string
  consent: true
  ipHash: string
  notification: { status: "sent" | "queued" | "failed"; detail: string }
  notes: Note[]
  history: History[]
}

export type Settings = {
  legalName: string
  publicEmail: string
  notifyEmail: string
  phone: string
  whatsapp: string
  address: string
  city: string
  country: string
  linkedin: string
  instagram: string
}

export type Visit = { date: string; locale: string; path: string; country: string }
export type Audit = { id: string; at: string; actor: string; action: string; detail: string }
export type User = { id: string; email: string; role: Role; active: boolean; createdAt: string }
export type MfaState = { enabled: boolean; secret: string; pendingSecret: string }
export type SessionRecord = { id: string; email: string; createdAt: string; expiresAt: string }

export type Control = {
  settings: Settings
  users: User[]
  mfa: MfaState
  sessionVersion: number
}

export type Overview = {
  total: number
  fresh: number
  visits: number
  visitors: number
  recent: Inquiry[]
}

export function emptyControl(now = new Date().toISOString()): Control {
  return {
    settings: {
      legalName: "Asia Oil",
      publicEmail: EXPORT_EMAIL,
      notifyEmail: EXPORT_EMAIL,
      phone: "",
      whatsapp: "",
      address: "",
      city: "",
      country: "Türkiye",
      linkedin: "",
      instagram: "",
    },
    users: [{ id: "superadmin", email: SUPERADMIN_EMAIL, role: "superadmin", active: true, createdAt: now }],
    mfa: { enabled: false, secret: "", pendingSecret: "" },
    sessionVersion: 1,
  }
}

export function normalizeControl(input: Partial<Control> | null | undefined): Control {
  const base = emptyControl()
  const control: Control = {
    settings: { ...base.settings, ...(input?.settings ?? {}) },
    users: input?.users?.length ? input.users.map((user) => ({ ...user })) : base.users,
    mfa: { ...base.mfa, ...(input?.mfa ?? {}) },
    sessionVersion: input?.sessionVersion || 1,
  }
  if (!control.users.some((user) => user.email.toLowerCase() === SUPERADMIN_EMAIL)) control.users.unshift(base.users[0])
  for (const user of control.users) {
    if (user.email.toLowerCase() === SUPERADMIN_EMAIL) {
      user.role = "superadmin"
      user.active = true
    }
  }
  return control
}

export type Repo = {
  getControl: () => Promise<Control>
  getSettings: () => Promise<Settings>
  createSession: (session: SessionRecord) => Promise<void>
  getSession: (id: string) => Promise<SessionRecord | null>
  deleteSession: (id: string) => Promise<void>
  /** Records one hit and returns false once `limit` hits fall inside the window. */
  consumeRate: (key: string, limit: number, windowMs: number, now: number) => Promise<boolean>
  createInquiry: (inquiry: Inquiry, audit: Audit) => Promise<void>
  setNotification: (inquiry: Inquiry, notification: Inquiry["notification"]) => Promise<void>
  getInquiry: (id: string) => Promise<Inquiry | null>
  listInquiries: (filter?: { status?: InquiryStatus; limit?: number }) => Promise<Inquiry[]>
  updateInquiry: (id: string, fn: (lead: Inquiry) => Audit | null) => Promise<Inquiry | null>
  appendAudit: (audit: Audit) => Promise<void>
  recordVisit: (visit: Visit, visitorId?: string) => Promise<void>
  overview: (since: string) => Promise<Overview>
}

export type Snapshot = {
  control: Control
  inquiries: Inquiry[]
  audits: Audit[]
  visits: (Visit & { count: number })[]
  visitors: { date: string; id: string }[]
  sessions: SessionRecord[]
  rates: Record<string, number[]>
}

type LegacyStore = Partial<Control> & {
  inquiries?: Inquiry[]
  audits?: Audit[]
  visits?: (Visit & { count: number })[]
  visitors?: { date: string; id: string }[]
}

export function normalizeSnapshot(input: (Partial<Snapshot> & LegacyStore) | null | undefined): Snapshot {
  const control = normalizeControl(input?.control ?? input)
  return {
    control,
    inquiries: input?.inquiries ?? [],
    audits: (input?.audits ?? []).slice(0, 2000),
    visits: input?.visits ?? [],
    visitors: input?.visitors ?? [],
    sessions: input?.sessions ?? [],
    rates: input?.rates ?? {},
  }
}

const byNewest = (a: Inquiry, b: Inquiry) => (a.createdAt < b.createdAt ? 1 : -1)

export function createMemoryRepo(initial?: Partial<Snapshot>, persist?: (snapshot: Snapshot) => Promise<void>): Repo {
  const data = normalizeSnapshot(initial)
  let chain = Promise.resolve()

  function write<T>(fn: () => T): Promise<T> {
    const run = chain.then(async () => {
      const result = fn()
      if (persist) await persist(data)
      return result
    })
    chain = run.then(
      () => undefined,
      () => undefined,
    )
    return run
  }

  return {
    async getControl() {
      return structuredClone(data.control)
    },
    async getSettings() {
      return structuredClone(data.control.settings)
    },
    createSession(session) {
      return write(() => {
        data.sessions = data.sessions.filter((item) => item.expiresAt > session.createdAt)
        data.sessions.push({ ...session })
      })
    },
    async getSession(id) {
      const found = data.sessions.find((item) => item.id === id)
      return found ? { ...found } : null
    },
    deleteSession(id) {
      return write(() => {
        data.sessions = data.sessions.filter((item) => item.id !== id)
      })
    },
    consumeRate(key, limit, windowMs, now) {
      return write(() => {
        const recent = (data.rates[key] ?? []).filter((stamp) => now - stamp < windowMs)
        if (recent.length >= limit) {
          data.rates[key] = recent
          return false
        }
        recent.push(now)
        data.rates[key] = recent
        return true
      })
    },
    createInquiry(inquiry, audit) {
      return write(() => {
        data.inquiries.unshift(structuredClone(inquiry))
        data.audits.unshift(audit)
      })
    },
    setNotification(inquiry, notification) {
      return write(() => {
        const row = data.inquiries.find((item) => item.id === inquiry.id)
        if (row) row.notification = notification
      })
    },
    async getInquiry(id) {
      const found = data.inquiries.find((item) => item.id === id)
      return found ? structuredClone(found) : null
    },
    async listInquiries(filter) {
      const rows = data.inquiries.filter((item) => !filter?.status || item.status === filter.status).sort(byNewest)
      return structuredClone(rows.slice(0, filter?.limit ?? 500))
    },
    updateInquiry(id, fn) {
      return write(() => {
        const row = data.inquiries.find((item) => item.id === id)
        if (!row) return null
        const draft = structuredClone(row)
        const audit = fn(draft)
        Object.assign(row, draft)
        if (audit) data.audits.unshift(audit)
        return structuredClone(row)
      })
    },
    appendAudit(audit) {
      return write(() => {
        data.audits.unshift(audit)
        data.audits = data.audits.slice(0, 2000)
      })
    },
    recordVisit(visit, visitorId) {
      return write(() => {
        const row = data.visits.find(
          (item) => item.date === visit.date && item.path === visit.path && item.locale === visit.locale && item.country === visit.country,
        )
        if (row) row.count += 1
        else data.visits.unshift({ ...visit, count: 1 })
        if (visitorId && !data.visitors.some((item) => item.date === visit.date && item.id === visitorId)) {
          data.visitors.unshift({ date: visit.date, id: visitorId })
        }
      })
    },
    async overview(since) {
      const day = since.slice(0, 10)
      return {
        total: data.inquiries.length,
        fresh: data.inquiries.filter((item) => item.status === "new").length,
        visits: data.visits.filter((item) => item.date >= day).reduce((sum, item) => sum + item.count, 0),
        visitors: data.visitors.filter((item) => item.date >= day).length,
        recent: structuredClone(data.inquiries.filter((item) => item.createdAt >= since).sort(byNewest).slice(0, 500)),
      }
    },
  }
}
