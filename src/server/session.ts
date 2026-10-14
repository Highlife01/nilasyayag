import "server-only"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { parseSessionBag, serializeSessionBag } from "@/lib/cookies-packed"
import { can, safeEqual, type Action, type Role } from "@/lib/domain"
import { firestoreConfigured, getRepo } from "@/server/runtime"
import { SUPERADMIN_EMAIL } from "@/lib/site"

// Firebase Hosting only forwards the `__session` cookie to Cloud Run / Cloud Functions backends.
const COOKIE = "__session"
const LEGACY_COOKIE = "nilasya_session"
const MAX_AGE = 60 * 60 * 24 * 5

function secret() {
  const value = process.env.NILASYA_SESSION_SECRET
  if (!value) throw new Error("NILASYA_SESSION_SECRET is missing")
  return new TextEncoder().encode(value)
}

export async function signSession(email: string, role: Role, sessionVersion: number, sid: string) {
  return new SignJWT({ role, sv: sessionVersion, email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setJti(sid)
    .setIssuedAt()
    .setExpirationTime("5d")
    .sign(secret())
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  }
}

export type SessionUser = { email: string; role: Role; sessionVersion: number; sid: string }

async function verify(token: string) {
  const verified = await jwtVerify(token, secret(), { algorithms: ["HS256"] })
  return {
    email: String(verified.payload.email || verified.payload.sub || "").toLowerCase(),
    sv: Number(verified.payload.sv),
    sid: String(verified.payload.jti || ""),
  }
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies()
  const bag = parseSessionBag(jar.get(COOKIE)?.value, jar)
  const token = bag.admin
  if (!token) return null
  try {
    const { email, sv, sid } = await verify(token)
    if (!sid) return null
    const repo = await getRepo()
    const [control, session] = await Promise.all([repo.getControl(), repo.getSession(sid)])
    if (sv !== control.sessionVersion) return null
    if (!session || session.email !== email || session.expiresAt < new Date().toISOString()) return null
    const user = control.users.find((item) => item.email.toLowerCase() === email && item.active)
    if (!user) return null
    const role: Role = email === SUPERADMIN_EMAIL ? "superadmin" : user.role
    return { email, role, sessionVersion: sv, sid }
  } catch {
    return null
  }
}

export async function requireUser(action?: Action) {
  const user = await readSession()
  if (!user) return null
  if (action && !can(user.role, action)) return null
  return user
}

export async function authenticate(email: string, password: string, _otp?: string) {
  const normalized = email.trim().toLowerCase()
  const repo = await getRepo()
  const control = await repo.getControl()
  const firebaseKey = process.env.FIREBASE_WEB_API_KEY
  const adminPassword = process.env.NILASYA_ADMIN_PASSWORD

  let identityOk = false
  if (normalized === SUPERADMIN_EMAIL && adminPassword && safeEqual(password, adminPassword)) {
    identityOk = true
  } else if (firebaseKey && firestoreConfigured()) {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, password, returnSecureToken: true }),
      },
    )
    identityOk = response.ok
  }

  if (!identityOk) return { ok: false as const, reason: "credentials" as const }

  const user = control.users.find((item) => item.email.toLowerCase() === normalized && item.active)
  if (!user) return { ok: false as const, reason: "credentials" as const }
  const role: Role = normalized === SUPERADMIN_EMAIL ? "superadmin" : user.role

  const now = new Date()
  const sid = crypto.randomUUID()
  await repo.createSession({
    id: sid,
    email: normalized,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + MAX_AGE * 1000).toISOString(),
  })
  const token = await signSession(normalized, role, control.sessionVersion, sid)
  const jar = await cookies()
  const bag = parseSessionBag(jar.get(COOKIE)?.value, jar)
  bag.admin = token
  jar.set(COOKIE, serializeSessionBag(bag), sessionCookieOptions())
  jar.set(LEGACY_COOKIE, token, sessionCookieOptions())
  return { ok: true as const, role }
}

export async function endSession() {
  const jar = await cookies()
  const bag = parseSessionBag(jar.get(COOKIE)?.value, jar)
  const token = bag.admin
  delete bag.admin
  const remaining = serializeSessionBag(bag)
  if (remaining) {
    jar.set(COOKIE, remaining, { ...sessionCookieOptions(), maxAge: 60 * 60 * 24 * 180 })
  } else {
    jar.set(COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 })
  }
  jar.set(LEGACY_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 })
  if (!token) return
  try {
    const { sid } = await verify(token)
    if (sid) await (await getRepo()).deleteSession(sid)
  } catch {
    // An unverifiable token has nothing stored to revoke.
  }
}

export { COOKIE }
