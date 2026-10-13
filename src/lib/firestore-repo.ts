import { createHash } from "node:crypto"
import { createRequire } from "node:module"
import path from "node:path"
import type * as AdminApp from "firebase-admin/app"
import type * as AdminFirestore from "firebase-admin/firestore"
import type { Firestore } from "firebase-admin/firestore"
import { normalizeControl, type Control, type Inquiry, type Repo, type SessionRecord } from "@/lib/model"

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

function byNewest(a: Inquiry, b: Inquiry) {
  if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1
  return a.id < b.id ? 1 : a.id === b.id ? 0 : -1
}

export function createFirestoreRepo(db: Firestore = database()): Repo {
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
    getControl,

    async getSettings() {
      try {
        if (settingsCache && Date.now() - settingsCache.at < SETTINGS_TTL) return structuredClone(settingsCache.control.settings)
        return (await getControl()).settings
      } catch {
        return structuredClone(settingsCache?.control.settings ?? normalizeControl(null).settings)
      }
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
      return db.runTransaction(async (tx) => {
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
      const { FieldPath } = getAdmin().firestore
      const snaps = await Promise.all(
        LEADS.map((name) => {
          const base = db.collection(name)
          const filtered = filter?.status ? base.where("status", "==", filter.status) : base
          let query = filtered.orderBy("createdAt", "desc").orderBy(FieldPath.documentId(), "desc")
          if (filter?.before) query = query.startAfter(filter.before.createdAt, filter.before.id)
          return query.limit(limit).get()
        }),
      )
      return snaps
        .flatMap((snap) => snap.docs.map((doc) => doc.data() as Inquiry))
        .sort(byNewest)
        .slice(0, limit)
    },

    async updateInquiry(id, fn) {
      const ref = await findRef(id)
      if (!ref) return null
      return db.runTransaction(async (tx) => {
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
          .sort(byNewest),
      }
    },
  }
}

