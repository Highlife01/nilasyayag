import { createHash } from "node:crypto"
import { createRequire } from "node:module"
import path from "node:path"
import type * as AdminApp from "firebase-admin/app"
import type * as AdminFirestore from "firebase-admin/firestore"
import type { Firestore } from "firebase-admin/firestore"
import {
  applyConversionToSession,
  buildAnalyticsDashboardData,
  mergeVisitorEventIntoSession,
  normalizeControl,
  type AuthLog,
  type Control,
  type Inquiry,
  type Repo,
  type SessionRecord,
  type VisitorSession,
} from "@/lib/model"

function getAdmin() {
  try {
    const req = createRequire(import.meta.url)
    return {
      app: req("firebase-admin/app") as typeof AdminApp,
      firestore: req("firebase-admin/firestore") as typeof AdminFirestore,
    }
  } catch {
    const req = createRequire(path.join(process.cwd(), "package.json"))
    return {
      app: req("firebase-admin/app") as typeof AdminApp,
      firestore: req("firebase-admin/firestore") as typeof AdminFirestore,
    }
  }
}

const LEADS = ["rfq_requests", "contact_submissions"] as const
const CONTROL = "control/state"
const SETTINGS_TTL = 60_000

function database(): Firestore {
  const { app, firestore } = getAdmin()
  if (!app.getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    app.initializeApp({
      credential: raw ? app.cert(JSON.parse(raw)) : app.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || undefined,
    })
  }
  return firestore.getFirestore()
}

const key = (value: string) => createHash("sha256").update(value).digest("hex").slice(0, 40)

export function createFirestoreRepo(): Repo {
  const db = database()
  let settingsCache: { at: number; control: Control } | null = null

  async function getControl(): Promise<Control> {
    const snap = await db.doc(CONTROL).get()
    const control = normalizeControl(snap.exists ? (snap.data() as Partial<Control>) : null)
    settingsCache = { at: Date.now(), control }
    return structuredClone(control)
  }

  async function findRef(id: string) {
    if (!/^[\w-]{8,64}$/.test(id)) return null
    const snaps = await Promise.all(LEADS.map((name) => db.collection(name).doc(id).get()))
    const hit = snaps.find((snap) => snap.exists)
    return hit ? hit.ref : null
  }

  return {
    backendType: "firestore",
    getControl,

    async getSettings() {
      if (settingsCache && Date.now() - settingsCache.at < SETTINGS_TTL) return structuredClone(settingsCache.control.settings)
      return (await getControl()).settings
    },

    async updateRetentionDays(days, actor) {
      const clamped = Math.min(365, Math.max(7, Math.round(days)))
      const batch = db.batch()
      batch.set(db.doc(CONTROL), { analyticsRetentionDays: clamped }, { merge: true })
      const auditId = crypto.randomUUID()
      batch.set(db.collection("audit_logs").doc(auditId), {
        id: auditId,
        at: new Date().toISOString(),
        actor,
        action: "analytics.retention.update",
        detail: `${clamped}d`,
      })
      await batch.commit()
      settingsCache = null
    },

    async createSession(session) {
      await db.collection("admin_sessions").doc(session.id).set({ ...session, ttl: new Date(session.expiresAt) })
    },

    async getSession(id) {
      if (!/^[\w-]{8,64}$/.test(id)) return null
      const snap = await db.collection("admin_sessions").doc(id).get()
      if (!snap.exists) return null
      const data = snap.data() as SessionRecord
      return { id: data.id, email: data.email, createdAt: data.createdAt, expiresAt: data.expiresAt }
    },

    async deleteSession(id) {
      if (!/^[\w-]{8,64}$/.test(id)) return
      await db.collection("admin_sessions").doc(id).delete()
    },

    async consumeRate(name, limit, windowMs, now) {
      const ref = db.collection("rate_limits").doc(key(name))
      return await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref)
        const hits = ((snap.data()?.hits as number[] | undefined) ?? []).filter((stamp) => now - stamp < windowMs)
        if (hits.length >= limit) return false
        hits.push(now)
        tx.set(ref, { hits, ttl: new Date(now + windowMs) })
        return true
      })
    },

    async createInquiry(inquiry, audit) {
      const batch = db.batch()
      batch.set(db.collection(inquiry.collection).doc(inquiry.id), inquiry)
      batch.set(db.collection("audit_logs").doc(audit.id), audit)
      await batch.commit()
    },

    async setNotification(inquiry, notification) {
      await db.collection(inquiry.collection).doc(inquiry.id).update({ notification })
    },

    async getInquiry(id) {
      const ref = await findRef(id)
      if (!ref) return null
      return (await ref.get()).data() as Inquiry
    },

    async listInquiries(filter) {
      const limit = filter?.limit ?? 500
      const includeTest = Boolean(filter?.includeTest)
      const collections = filter?.formType === "contact" ? (["contact_submissions"] as const) : filter?.formType === "rfq" ? (["rfq_requests"] as const) : LEADS
      const snaps = await Promise.all(
        collections.map((name) => {
          const base = db.collection(name)
          const query = filter?.status ? base.where("status", "==", filter.status) : base.orderBy("createdAt", "desc")
          return query.limit(limit).get()
        }),
      )
      return snaps
        .flatMap((snap) => snap.docs.map((doc) => doc.data() as Inquiry))
        .filter((item) => includeTest || !item.isTest)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .slice(0, limit)
    },

    async updateInquiry(id, fn) {
      const ref = await findRef(id)
      if (!ref) return null
      return await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref)
        if (!snap.exists) return null
        const draft = snap.data() as Inquiry
        const audit = fn(draft)
        tx.set(ref, draft)
        if (audit) tx.set(db.collection("audit_logs").doc(audit.id), audit)
        return draft
      })
    },

    async appendAudit(audit) {
      await db.collection("audit_logs").doc(audit.id).set(audit)
    },

    async recordVisit(visit, visitorId) {
      const batch = db.batch()
      const { FieldValue } = getAdmin().firestore
      batch.set(
        db.collection("analytics_visits").doc(`${visit.date}_${key(`${visit.path}|${visit.locale}|${visit.country}`)}`),
        { ...visit, count: FieldValue.increment(1) },
        { merge: true },
      )
      if (visitorId) batch.set(db.collection("analytics_visitors").doc(`${visit.date}_${key(visitorId)}`), { date: visit.date })
      await batch.commit()
    },

    async recordVisitorSessionEvent(payload) {
      const control = settingsCache?.control ?? (await getControl())
      const retentionDays = control.analyticsRetentionDays || 90
      const ttlDate = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000)
      const docId = /^[\w-]{8,64}$/.test(payload.sessionId) ? payload.sessionId : key(payload.sessionId)
      const ref = db.collection("visitor_sessions").doc(docId)

      return await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref)
        const existing = snap.exists ? (snap.data() as VisitorSession) : null
        const { deduplicated, session } = mergeVisitorEventIntoSession(existing, { ...payload, sessionId: docId })
        if (!deduplicated) {
          tx.set(ref, { ...session, ttl: ttlDate })
        }
        return { deduplicated, session }
      })
    },

    async recordVisitorConversion(sessionId, formType, inquiryId, p, locale, at) {
      if (!sessionId) return
      const docId = /^[\w-]{8,64}$/.test(sessionId) ? sessionId : key(sessionId)
      const ref = db.collection("visitor_sessions").doc(docId)
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref)
        if (!snap.exists) return
        const existing = snap.data() as VisitorSession
        const updated = applyConversionToSession(existing, formType, inquiryId, p, locale, at)
        tx.set(ref, updated, { merge: true })
      })
    },

    async recordAuthLog(log) {
      const control = settingsCache?.control ?? (await getControl())
      const retentionDays = control.analyticsRetentionDays || 90
      const ttlDate = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000)
      await db.collection("auth_logs").doc(log.id).set({ ...log, ttl: ttlDate })
    },

    async listAuthLogs(options) {
      const limit = options?.limit ?? 100
      const includeTest = Boolean(options?.includeTest)
      const control = settingsCache?.control ?? (await getControl())
      const cutoffIso = new Date(Date.now() - (control.analyticsRetentionDays || 90) * 24 * 60 * 60 * 1000).toISOString()
      const snap = await db.collection("auth_logs").where("at", ">=", cutoffIso).orderBy("at", "desc").limit(limit).get()
      return snap.docs
        .map((d) => d.data() as AuthLog)
        .filter((item) => includeTest || !item.isTest)
    },

    async queryAnalytics(filter) {
      const control = settingsCache?.control ?? (await getControl())
      const retentionDays = control.analyticsRetentionDays || 90
      const cutoffIso = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString()
      const snap = await db
        .collection("visitor_sessions")
        .where("lastActivityAt", ">=", cutoffIso)
        .orderBy("lastActivityAt", "desc")
        .limit(2000)
        .get()
      const sessions = snap.docs.map((d) => d.data() as VisitorSession)
      return buildAnalyticsDashboardData(sessions, retentionDays, filter)
    },

    async cleanupExpiredAnalytics(nowMs = Date.now()) {
      const control = await getControl()
      const cutoffIso = new Date(nowMs - (control.analyticsRetentionDays || 90) * 24 * 60 * 60 * 1000).toISOString()
      const [oldSessionsSnap, oldAuthSnap] = await Promise.all([
        db.collection("visitor_sessions").where("lastActivityAt", "<", cutoffIso).limit(400).get(),
        db.collection("auth_logs").where("at", "<", cutoffIso).limit(400).get(),
      ])
      const batch = db.batch()
      for (const doc of oldSessionsSnap.docs) batch.delete(doc.ref)
      for (const doc of oldAuthSnap.docs) batch.delete(doc.ref)
      if (!oldSessionsSnap.empty || !oldAuthSnap.empty) {
        await batch.commit()
      }
      return {
        deletedSessions: oldSessionsSnap.size,
        deletedAuthLogs: oldAuthSnap.size,
      }
    },

    async overview(since) {
      const { AggregateField } = getAdmin().firestore
      const day = since.slice(0, 10)
      const [totals, fresh, visits, visitors, recent] = await Promise.all([
        Promise.all(LEADS.map((name) => db.collection(name).count().get())),
        Promise.all(LEADS.map((name) => db.collection(name).where("status", "==", "new").count().get())),
        db.collection("analytics_visits").where("date", ">=", day).aggregate({ total: AggregateField.sum("count") }).get(),
        db.collection("analytics_visitors").where("date", ">=", day).count().get(),
        Promise.all(LEADS.map((name) => db.collection(name).where("createdAt", ">=", since).orderBy("createdAt", "desc").limit(500).get())),
      ])
      return {
        total: totals.reduce((sum, snap) => sum + snap.data().count, 0),
        fresh: fresh.reduce((sum, snap) => sum + snap.data().count, 0),
        visits: visits.data().total ?? 0,
        visitors: visitors.data().count,
        recent: recent
          .flatMap((snap) => snap.docs.map((doc) => doc.data() as Inquiry))
          .filter((item) => !item.isTest)
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
      }
    },
  }
}
