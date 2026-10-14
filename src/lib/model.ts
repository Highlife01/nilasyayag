import { SUPERADMIN_EMAIL, EXPORT_EMAIL } from "@/lib/site"
import type { InquiryStatus, Role } from "@/lib/domain"
import type { BotClassification, DeviceType } from "@/lib/analytics"

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
  sessionId?: string
  isTest?: boolean
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

export type VisitorEvent = {
  id: string
  at: string
  type: "pageview" | "contact_submit" | "rfq_submit"
  path: string
  locale: string
  referrer: string
  detail?: string
}

export type VisitorSession = {
  id: string
  visitorId: string
  consentGranted: boolean
  isTest: boolean
  startedAt: string
  lastActivityAt: string
  timezone: string
  countryCode: string
  countryName: string
  region: string
  city: string
  geoSource: string
  deviceType: DeviceType
  deviceBrand: string
  deviceModel: string
  osName: string
  osVersion: string
  browserName: string
  browserVersion: string
  language: string
  screenSize: string
  entryPage: string
  lastPage: string
  visitedPages: string[]
  referrer: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  durationSeconds: number
  pageViews: number
  converted: boolean
  conversionTypes: ("contact" | "rfq")[]
  inquiryIds: string[]
  botStatus: BotClassification
  botReason: string
  events: VisitorEvent[]
}

export type AuthLog = {
  id: string
  at: string
  timezone: string
  email: string
  result: "success" | "failed"
  reason: "ok" | "credentials" | "otp" | "rate_limit" | "inactive"
  countryCode: string
  countryName: string
  region: string
  city: string
  deviceType: DeviceType
  deviceBrand: string
  deviceModel: string
  osName: string
  osVersion: string
  browserName: string
  browserVersion: string
  isTest?: boolean
}

export type AnalyticsFilter = {
  from?: string
  to?: string
  country?: string
  deviceType?: string
  browser?: string
  page?: string
  converted?: "all" | "yes" | "no" | "contact" | "rfq"
  botFilter?: "human_only" | "all" | "bot_only" | "uncertain_only"
  includeTest?: boolean
  pageIndex?: number
  pageSize?: number
}

export type AnalyticsDashboardData = {
  fetchedAt: string
  retentionDays: number
  activeWindowMinutes: number
  summary: {
    totalVisits: number
    totalSessions: number
    uniqueVisitors: number
    uniqueVisitorsWithCookie: number
    activeVisitors: number
    convertedSessions: number
    contactConversions: number
    rfqConversions: number
    botSessionsExcluded: number
    testSessionsExcluded: number
  }
  distributions: {
    countries: { label: string; code: string; count: number }[]
    devices: { label: string; count: number }[]
    os: { label: string; count: number }[]
    browsers: { label: string; count: number }[]
    sources: { label: string; count: number }[]
    topPages: { path: string; views: number; sessions: number }[]
    dailySeries: { date: string; visits: number; sessions: number; conversions: number }[]
  }
  pagination: {
    pageIndex: number
    pageSize: number
    totalRows: number
    totalPages: number
  }
  sessions: VisitorSession[]
  availableFilters: {
    countries: string[]
    browsers: string[]
    pages: string[]
  }
}

export type Control = {
  settings: Settings
  users: User[]
  mfa: MfaState
  sessionVersion: number
  analyticsRetentionDays: number
}

export type Overview = {
  total: number
  fresh: number
  visits: number
  visitors: number
  recent: Inquiry[]
}

export type TrackVisitPayload = {
  sessionId: string
  visitorId: string
  consentGranted: boolean
  isTest: boolean
  at: string
  timezone: string
  path: string
  locale: string
  referrer: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  countryCode: string
  countryName: string
  region: string
  city: string
  geoSource: string
  deviceType: DeviceType
  deviceBrand: string
  deviceModel: string
  osName: string
  osVersion: string
  browserName: string
  browserVersion: string
  language: string
  screenSize: string
  botStatus: BotClassification
  botReason: string
}

export const ACTIVE_VISITOR_WINDOW_MINUTES = 5

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
    analyticsRetentionDays: 90,
  }
}

export function normalizeControl(input: Partial<Control> | null | undefined): Control {
  const base = emptyControl()
  const retentionRaw = Number(input?.analyticsRetentionDays)
  const analyticsRetentionDays = Number.isFinite(retentionRaw) && retentionRaw >= 7 && retentionRaw <= 365 ? Math.round(retentionRaw) : 90
  const control: Control = {
    settings: { ...base.settings, ...(input?.settings ?? {}) },
    users: input?.users?.length ? input.users.map((user) => ({ ...user })) : base.users,
    mfa: { ...base.mfa, ...(input?.mfa ?? {}) },
    sessionVersion: input?.sessionVersion || 1,
    analyticsRetentionDays,
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
  backendType: "firestore" | "file"
  getControl: () => Promise<Control>
  getSettings: () => Promise<Settings>
  updateRetentionDays: (days: number, actor: string) => Promise<void>
  createSession: (session: SessionRecord) => Promise<void>
  getSession: (id: string) => Promise<SessionRecord | null>
  deleteSession: (id: string) => Promise<void>
  /** Records one hit and returns false once `limit` hits fall inside the window. */
  consumeRate: (key: string, limit: number, windowMs: number, now: number) => Promise<boolean>
  createInquiry: (inquiry: Inquiry, audit: Audit) => Promise<void>
  setNotification: (inquiry: Inquiry, notification: Inquiry["notification"]) => Promise<void>
  getInquiry: (id: string) => Promise<Inquiry | null>
  listInquiries: (filter?: { status?: InquiryStatus; formType?: "rfq" | "contact"; includeTest?: boolean; limit?: number }) => Promise<Inquiry[]>
  updateInquiry: (id: string, fn: (lead: Inquiry) => Audit | null) => Promise<Inquiry | null>
  appendAudit: (audit: Audit) => Promise<void>
  recordVisit: (visit: Visit, visitorId?: string) => Promise<void>
  recordVisitorSessionEvent: (payload: TrackVisitPayload) => Promise<{ deduplicated: boolean; session: VisitorSession }>
  recordVisitorConversion: (sessionId: string, formType: "contact" | "rfq", inquiryId: string, path: string, locale: string, at: string) => Promise<void>
  recordAuthLog: (log: AuthLog) => Promise<void>
  listAuthLogs: (options?: { includeTest?: boolean; limit?: number }) => Promise<AuthLog[]>
  queryAnalytics: (filter?: AnalyticsFilter) => Promise<AnalyticsDashboardData>
  cleanupExpiredAnalytics: (nowMs?: number) => Promise<{ deletedSessions: number; deletedAuthLogs: number }>
  overview: (since: string) => Promise<Overview>
}

export type Snapshot = {
  control: Control
  inquiries: Inquiry[]
  audits: Audit[]
  visits: (Visit & { count: number })[]
  visitors: { date: string; id: string }[]
  visitorSessions: VisitorSession[]
  authLogs: AuthLog[]
  sessions: SessionRecord[]
  rates: Record<string, number[]>
}

type LegacyStore = Partial<Control> & {
  inquiries?: Inquiry[]
  audits?: Audit[]
  visits?: (Visit & { count: number })[]
  visitors?: { date: string; id: string }[]
  visitorSessions?: VisitorSession[]
  authLogs?: AuthLog[]
}

export function normalizeSnapshot(input: (Partial<Snapshot> & LegacyStore) | null | undefined): Snapshot {
  const control = normalizeControl(input?.control ?? input)
  return {
    control,
    inquiries: input?.inquiries ?? [],
    audits: (input?.audits ?? []).slice(0, 2000),
    visits: input?.visits ?? [],
    visitors: input?.visitors ?? [],
    visitorSessions: input?.visitorSessions ?? [],
    authLogs: (input?.authLogs ?? []).slice(0, 2000),
    sessions: input?.sessions ?? [],
    rates: input?.rates ?? {},
  }
}

const byNewest = (a: { createdAt: string }, b: { createdAt: string }) => (a.createdAt < b.createdAt ? 1 : -1)
const byLastActivityDesc = (a: VisitorSession, b: VisitorSession) => (a.lastActivityAt < b.lastActivityAt ? 1 : -1)

export function mergeVisitorEventIntoSession(existing: VisitorSession | null, payload: TrackVisitPayload): { deduplicated: boolean; session: VisitorSession } {
  const nowMs = Date.parse(payload.at) || Date.now()

  if (existing) {
    // Deduplication check: if the last pageview event was on the exact same path within 4 seconds, treat as duplicate refresh/beacon resend
    const lastEvent = existing.events[existing.events.length - 1]
    if (lastEvent && lastEvent.type === "pageview" && lastEvent.path === payload.path) {
      const lastMs = Date.parse(lastEvent.at) || 0
      if (Math.abs(nowMs - lastMs) < 4000) {
        return { deduplicated: true, session: structuredClone(existing) }
      }
    }

    const updated = structuredClone(existing)
    updated.lastActivityAt = payload.at
    updated.lastPage = payload.path
    if (!updated.visitedPages.includes(payload.path)) {
      updated.visitedPages.push(payload.path)
    }
    if (payload.visitorId && !updated.visitorId) {
      updated.visitorId = payload.visitorId
    }
    if (payload.consentGranted) {
      updated.consentGranted = true
    }
    if (payload.isTest) {
      updated.isTest = true
    }
    if (payload.screenSize && payload.screenSize !== "Veri alınamadı" && updated.screenSize === "Veri alınamadı") {
      updated.screenSize = payload.screenSize
    }
    if (payload.deviceModel && payload.deviceModel !== "Model belirlenemedi" && updated.deviceModel === "Model belirlenemedi") {
      updated.deviceModel = payload.deviceModel
      updated.deviceBrand = payload.deviceBrand
    }
    updated.pageViews += 1
    const startMs = Date.parse(updated.startedAt) || nowMs
    updated.durationSeconds = Math.max(0, Math.round((nowMs - startMs) / 1000))
    updated.events.push({
      id: crypto.randomUUID(),
      at: payload.at,
      type: "pageview",
      path: payload.path,
      locale: payload.locale,
      referrer: payload.referrer,
    })
    return { deduplicated: false, session: updated }
  }

  const fresh: VisitorSession = {
    id: payload.sessionId,
    visitorId: payload.visitorId,
    consentGranted: payload.consentGranted,
    isTest: payload.isTest,
    startedAt: payload.at,
    lastActivityAt: payload.at,
    timezone: payload.timezone || "Europe/Istanbul (UTC+3)",
    countryCode: payload.countryCode || "Bilinmiyor",
    countryName: payload.countryName || "Bilinmiyor",
    region: payload.region || "Bilinmiyor",
    city: payload.city || "Bilinmiyor",
    geoSource: payload.geoSource || "Sunucu Başlığı",
    deviceType: payload.deviceType || "Bilinmiyor",
    deviceBrand: payload.deviceBrand || "Bilinmiyor",
    deviceModel: payload.deviceModel || "Model belirlenemedi",
    osName: payload.osName || "Bilinmiyor",
    osVersion: payload.osVersion || "Bilinmiyor",
    browserName: payload.browserName || "Bilinmiyor",
    browserVersion: payload.browserVersion || "Bilinmiyor",
    language: payload.language || "Bilinmiyor",
    screenSize: payload.screenSize || "Veri alınamadı",
    entryPage: payload.path,
    lastPage: payload.path,
    visitedPages: [payload.path],
    referrer: payload.referrer || "Doğrudan Giriş",
    utmSource: payload.utmSource || "",
    utmMedium: payload.utmMedium || "",
    utmCampaign: payload.utmCampaign || "",
    utmTerm: payload.utmTerm || "",
    utmContent: payload.utmContent || "",
    durationSeconds: 0,
    pageViews: 1,
    converted: false,
    conversionTypes: [],
    inquiryIds: [],
    botStatus: payload.botStatus,
    botReason: payload.botReason,
    events: [
      {
        id: crypto.randomUUID(),
        at: payload.at,
        type: "pageview",
        path: payload.path,
        locale: payload.locale,
        referrer: payload.referrer || "Doğrudan Giriş",
      },
    ],
  }
  return { deduplicated: false, session: fresh }
}

export function applyConversionToSession(
  existing: VisitorSession,
  formType: "contact" | "rfq",
  inquiryId: string,
  path: string,
  locale: string,
  at: string,
): VisitorSession {
  const updated = structuredClone(existing)
  updated.converted = true
  if (!updated.conversionTypes.includes(formType)) {
    updated.conversionTypes.push(formType)
  }
  if (inquiryId && !updated.inquiryIds.includes(inquiryId)) {
    updated.inquiryIds.push(inquiryId)
  }
  if (at > updated.lastActivityAt) {
    updated.lastActivityAt = at
    const startMs = Date.parse(updated.startedAt) || Date.parse(at)
    const endMs = Date.parse(at) || startMs
    updated.durationSeconds = Math.max(0, Math.round((endMs - startMs) / 1000))
  }
  updated.events.push({
    id: crypto.randomUUID(),
    at,
    type: formType === "contact" ? "contact_submit" : "rfq_submit",
    path: path || updated.lastPage,
    locale: locale || "tr",
    referrer: updated.referrer,
    detail: formType === "contact" ? "İletişim formu gönderildi" : "Teklif talebi (RFQ) gönderildi",
  })
  return updated
}

export function buildAnalyticsDashboardData(
  allSessions: VisitorSession[],
  retentionDays: number,
  filter?: AnalyticsFilter,
  nowMs = Date.now(),
): AnalyticsDashboardData {
  const includeTest = Boolean(filter?.includeTest)
  const botFilter = filter?.botFilter || "human_only"

  let botSessionsExcluded = 0
  let testSessionsExcluded = 0

  // Available filter options from non-test sessions
  const countrySet = new Set<string>()
  const browserSet = new Set<string>()
  const pageSet = new Set<string>()

  for (const s of allSessions) {
    if (!includeTest && s.isTest) continue
    if (s.countryName) countrySet.add(s.countryName)
    if (s.browserName) browserSet.add(s.browserName)
    for (const p of s.visitedPages) {
      if (p) pageSet.add(p)
    }
  }

  const filtered = allSessions
    .filter((s) => {
      if (!includeTest && s.isTest) {
        testSessionsExcluded++
        return false
      }
      if (botFilter === "human_only" && s.botStatus === "bot") {
        botSessionsExcluded++
        return false
      }
      if (botFilter === "bot_only" && s.botStatus !== "bot") return false
      if (botFilter === "uncertain_only" && s.botStatus !== "uncertain") return false

      const day = s.startedAt.slice(0, 10)
      if (filter?.from && day < filter.from) return false
      if (filter?.to && day > filter.to) return false
      if (filter?.country && filter.country !== "all" && s.countryName !== filter.country && s.countryCode !== filter.country) {
        return false
      }
      if (filter?.deviceType && filter.deviceType !== "all" && s.deviceType !== filter.deviceType) {
        return false
      }
      if (filter?.browser && filter.browser !== "all" && s.browserName !== filter.browser) {
        return false
      }
      if (filter?.page && filter.page !== "all" && !s.visitedPages.includes(filter.page)) {
        return false
      }
      if (filter?.converted === "yes" && !s.converted) return false
      if (filter?.converted === "no" && s.converted) return false
      if (filter?.converted === "contact" && !s.conversionTypes.includes("contact")) return false
      if (filter?.converted === "rfq" && !s.conversionTypes.includes("rfq")) return false
      return true
    })
    .sort(byLastActivityDesc)

  const activeThresholdMs = nowMs - ACTIVE_VISITOR_WINDOW_MINUTES * 60 * 1000
  let totalVisits = 0
  let activeVisitors = 0
  let convertedSessions = 0
  let contactConversions = 0
  let rfqConversions = 0
  const uniqueCookieVisitorIds = new Set<string>()
  let sessionsWithoutVisitorId = 0

  const countryMap = new Map<string, { label: string; code: string; count: number }>()
  const deviceMap = new Map<string, number>()
  const osMap = new Map<string, number>()
  const browserMap = new Map<string, number>()
  const sourceMap = new Map<string, number>()
  const pageStats = new Map<string, { views: number; sessions: Set<string> }>()
  const dailyMap = new Map<string, { visits: number; sessions: number; conversions: number }>()

  for (const s of filtered) {
    totalVisits += s.pageViews
    if ((Date.parse(s.lastActivityAt) || 0) >= activeThresholdMs && s.botStatus !== "bot") {
      activeVisitors++
    }
    if (s.converted) convertedSessions++
    if (s.conversionTypes.includes("contact")) contactConversions++
    if (s.conversionTypes.includes("rfq")) rfqConversions++

    if (s.visitorId) {
      uniqueCookieVisitorIds.add(s.visitorId)
    } else {
      sessionsWithoutVisitorId++
    }

    // Country
    const cKey = s.countryName || "Bilinmiyor"
    const cEntry = countryMap.get(cKey) || { label: cKey, code: s.countryCode || "Bilinmiyor", count: 0 }
    cEntry.count += 1
    countryMap.set(cKey, cEntry)

    // Device
    const dKey =
      s.deviceType === "telefon"
        ? "Telefon"
        : s.deviceType === "tablet"
          ? "Tablet"
          : s.deviceType === "bilgisayar"
            ? "Bilgisayar"
            : "Bilinmiyor"
    deviceMap.set(dKey, (deviceMap.get(dKey) || 0) + 1)

    // OS
    const osKey = s.osName || "Bilinmiyor"
    osMap.set(osKey, (osMap.get(osKey) || 0) + 1)

    // Browser
    const bKey = s.browserName || "Bilinmiyor"
    browserMap.set(bKey, (browserMap.get(bKey) || 0) + 1)

    // Traffic Source
    const srcKey = s.utmSource
      ? `UTM: ${s.utmSource}${s.utmMedium ? ` / ${s.utmMedium}` : ""}`
      : s.referrer || "Doğrudan Giriş"
    sourceMap.set(srcKey, (sourceMap.get(srcKey) || 0) + 1)

    // Pages from events
    for (const ev of s.events) {
      if (ev.type === "pageview" && ev.path) {
        const entry = pageStats.get(ev.path) || { views: 0, sessions: new Set<string>() }
        entry.views += 1
        entry.sessions.add(s.id)
        pageStats.set(ev.path, entry)
      }
    }

    // Daily series
    const day = s.startedAt.slice(0, 10)
    const dStat = dailyMap.get(day) || { visits: 0, sessions: 0, conversions: 0 }
    dStat.visits += s.pageViews
    dStat.sessions += 1
    if (s.converted) dStat.conversions += 1
    dailyMap.set(day, dStat)
  }

  const pageSize = Math.min(100, Math.max(5, Number(filter?.pageSize) || 20))
  const totalRows = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
  const pageIndex = Math.min(totalPages, Math.max(1, Number(filter?.pageIndex) || 1))
  const startIdx = (pageIndex - 1) * pageSize
  const pagedSessions = structuredClone(filtered.slice(startIdx, startIdx + pageSize))

  return {
    fetchedAt: new Date(nowMs).toISOString(),
    retentionDays,
    activeWindowMinutes: ACTIVE_VISITOR_WINDOW_MINUTES,
    summary: {
      totalVisits,
      totalSessions: filtered.length,
      uniqueVisitors: uniqueCookieVisitorIds.size + sessionsWithoutVisitorId,
      uniqueVisitorsWithCookie: uniqueCookieVisitorIds.size,
      activeVisitors,
      convertedSessions,
      contactConversions,
      rfqConversions,
      botSessionsExcluded,
      testSessionsExcluded,
    },
    distributions: {
      countries: Array.from(countryMap.values()).sort((a, b) => b.count - a.count),
      devices: Array.from(deviceMap.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count),
      os: Array.from(osMap.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count),
      browsers: Array.from(browserMap.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count),
      sources: Array.from(sourceMap.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count),
      topPages: Array.from(pageStats.entries())
        .map(([path, stat]) => ({ path, views: stat.views, sessions: stat.sessions.size }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 15),
      dailySeries: Array.from(dailyMap.entries())
        .map(([date, stat]) => ({ date, ...stat }))
        .sort((a, b) => (a.date < b.date ? -1 : 1)),
    },
    pagination: {
      pageIndex,
      pageSize,
      totalRows,
      totalPages,
    },
    sessions: pagedSessions,
    availableFilters: {
      countries: Array.from(countrySet).sort(),
      browsers: Array.from(browserSet).sort(),
      pages: Array.from(pageSet).sort(),
    },
  }
}

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
    backendType: "file",
    async getControl() {
      return structuredClone(data.control)
    },
    async getSettings() {
      return structuredClone(data.control.settings)
    },
    updateRetentionDays(days, actor) {
      return write(() => {
        const clamped = Math.min(365, Math.max(7, Math.round(days)))
        data.control.analyticsRetentionDays = clamped
        data.audits.unshift({
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          actor,
          action: "analytics.retention.update",
          detail: `${clamped}d`,
        })
      })
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
      const includeTest = Boolean(filter?.includeTest)
      const rows = data.inquiries
        .filter((item) => {
          if (!includeTest && item.isTest) return false
          if (filter?.status && item.status !== filter.status) return false
          if (filter?.formType && item.formType !== filter.formType) return false
          return true
        })
        .sort(byNewest)
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
    recordVisitorSessionEvent(payload) {
      return write(() => {
        // Automatic retention cleanup on write
        const cutoffIso = new Date(Date.now() - data.control.analyticsRetentionDays * 24 * 60 * 60 * 1000).toISOString()
        data.visitorSessions = data.visitorSessions.filter((s) => s.lastActivityAt >= cutoffIso)

        const idx = data.visitorSessions.findIndex((s) => s.id === payload.sessionId)
        const existing = idx >= 0 ? data.visitorSessions[idx] : null
        const { deduplicated, session } = mergeVisitorEventIntoSession(existing, payload)
        if (!deduplicated) {
          if (idx >= 0) {
            data.visitorSessions[idx] = session
          } else {
            data.visitorSessions.unshift(session)
          }
        }
        return { deduplicated, session: structuredClone(session) }
      })
    },
    recordVisitorConversion(sessionId, formType, inquiryId, path, locale, at) {
      return write(() => {
        const idx = data.visitorSessions.findIndex((s) => s.id === sessionId)
        if (idx < 0) return
        data.visitorSessions[idx] = applyConversionToSession(
          data.visitorSessions[idx],
          formType,
          inquiryId,
          path,
          locale,
          at,
        )
      })
    },
    recordAuthLog(log) {
      return write(() => {
        const cutoffIso = new Date(Date.now() - data.control.analyticsRetentionDays * 24 * 60 * 60 * 1000).toISOString()
        data.authLogs = data.authLogs.filter((item) => item.at >= cutoffIso)
        data.authLogs.unshift(structuredClone(log))
        data.authLogs = data.authLogs.slice(0, 2000)
      })
    },
    async listAuthLogs(options) {
      const includeTest = Boolean(options?.includeTest)
      const limit = options?.limit ?? 100
      const rows = data.authLogs.filter((item) => includeTest || !item.isTest)
      return structuredClone(rows.slice(0, limit))
    },
    async queryAnalytics(filter) {
      return buildAnalyticsDashboardData(data.visitorSessions, data.control.analyticsRetentionDays, filter)
    },
    cleanupExpiredAnalytics(nowMs = Date.now()) {
      return write(() => {
        const cutoffIso = new Date(nowMs - data.control.analyticsRetentionDays * 24 * 60 * 60 * 1000).toISOString()
        const beforeSessions = data.visitorSessions.length
        const beforeAuth = data.authLogs.length
        data.visitorSessions = data.visitorSessions.filter((s) => s.lastActivityAt >= cutoffIso)
        data.authLogs = data.authLogs.filter((a) => a.at >= cutoffIso)
        return {
          deletedSessions: beforeSessions - data.visitorSessions.length,
          deletedAuthLogs: beforeAuth - data.authLogs.length,
        }
      })
    },
    async overview(since) {
      const day = since.slice(0, 10)
      const prodInquiries = data.inquiries.filter((i) => !i.isTest)
      return {
        total: prodInquiries.length,
        fresh: prodInquiries.filter((item) => item.status === "new").length,
        visits: data.visits.filter((item) => item.date >= day).reduce((sum, item) => sum + item.count, 0),
        visitors: data.visitors.filter((item) => item.date >= day).length,
        recent: structuredClone(prodInquiries.filter((item) => item.createdAt >= since).sort(byNewest).slice(0, 500)),
      }
    },
  }
}
