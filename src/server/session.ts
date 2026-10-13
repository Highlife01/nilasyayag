import "server-only"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { can, safeEqual, type Action, type Role } from "@/lib/domain"
import { firestoreConfigured, getRepo } from "@/server/runtime"
import { SUPERADMIN_EMAIL } from "@/lib/site"
import * as OTPAuth from "otpauth"

const COOKIE = "nilasya_session"
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
  const verified = await jwtVerify(token, secret())
  return {
    email: String(verified.payload.email || verified.payload.sub || "").toLowerCase(),
    sv: Number(verified.payload.sv),
    sid: String(verified.payload.jti || ""),
  }
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
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

export async function authenticate(email: string, password: string, otp: string) {
  const normalized = email.trim().toLowerCase()
  const repo = await getRepo()
  const control = await repo.getControl()
  const firebaseKey = process.env.FIREBASE_WEB_API_KEY

  let identityOk = false
  if (firebaseKey && firestoreConfigured()) {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, password, returnSecureToken: true }),
      },
    )
    identityOk = response.ok
  } else if (normalized === SUPERADMIN_EMAIL && process.env.NILASYA_ADMIN_PASSWORD) {
    identityOk = safeEqual(password, process.env.NILASYA_ADMIN_PASSWORD)
  }

  if (!identityOk) return { ok: false as const, reason: "credentials" as const }

  const user = control.users.find((item) => item.email.toLowerCase() === normalized && item.active)
  if (!user) return { ok: false as const, reason: "credentials" as const }
  const role: Role = normalized === SUPERADMIN_EMAIL ? "superadmin" : user.role

  if (control.mfa.enabled) {
    if (!control.mfa.secret) throw new Error("MFA is enabled without a configured secret")
    const totp = new OTPAuth.TOTP({
      issuer: "Nilasya",
      label: SUPERADMIN_EMAIL,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(control.mfa.secret),
    })
    const delta = totp.validate({ token: otp.replace(/\s/g, ""), window: 1 })
    if (delta === null) return { ok: false as const, reason: "otp" as const }
  }

  const now = new Date()
  const sid = crypto.randomUUID()
  const token = await signSession(normalized, role, control.sessionVersion, sid)
  await repo.createSession({
    id: sid,
    email: normalized,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + MAX_AGE * 1000).toISOString(),
  })
  try {
    await repo.appendAudit({
      id: crypto.randomUUID(),
      at: now.toISOString(),
      actor: normalized,
      action: "auth.login",
      detail: role,
    })
  } catch (error) {
    try {
      await repo.deleteSession(sid)
    } catch {
      console.warn("The failed login session could not be removed; no session cookie was issued.")
    }
    throw error
  }
  const jar = await cookies()
  jar.set(COOKIE, token, sessionCookieOptions())
  return { ok: true as const, role }
}

export async function endSession() {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (token) {
    let sid: string | undefined
    try {
      sid = (await verify(token)).sid
    } catch {
      // An unverifiable token has nothing stored to revoke.
    }
    if (sid) await (await getRepo()).deleteSession(sid)
  }
  jar.set(COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 })
}

export { COOKIE }
