export type SessionBag = {
  admin?: string
  consent?: "all" | "necessary"
  vid?: string
  sid?: string
}

type CookieReader = {
  get(name: string): { value: string } | undefined
}

export function parseSessionBag(rawSessionCookie?: string | null, jar?: CookieReader): SessionBag {
  const bag: SessionBag = {}
  const raw = (rawSessionCookie ?? jar?.get("__session")?.value ?? "").trim()

  if (raw) {
    if (raw.includes("=")) {
      const params = new URLSearchParams(raw)
      const admin = params.get("admin")?.trim()
      const consent = params.get("consent")?.trim()
      const vid = params.get("vid")?.trim()
      const sid = params.get("sid")?.trim()
      if (admin) bag.admin = admin
      if (consent === "all" || consent === "necessary") bag.consent = consent
      if (vid) bag.vid = vid
      if (sid) bag.sid = sid
    } else if (raw.split(".").length === 3) {
      // Backward compatibility if __session holds a raw JWT
      bag.admin = raw
    }
  }

  if (!bag.admin) {
    const legacyAdmin = jar?.get("nilasya_session")?.value?.trim()
    if (legacyAdmin) bag.admin = legacyAdmin
  }
  if (!bag.consent) {
    const legacyConsent = jar?.get("nilasya_consent")?.value?.trim()
    if (legacyConsent === "all" || legacyConsent === "necessary") {
      bag.consent = legacyConsent
    }
  }
  if (!bag.vid) {
    const legacyVid = jar?.get("nilasya_vid")?.value?.trim()
    if (legacyVid) bag.vid = legacyVid
  }
  if (!bag.sid) {
    const legacySid = jar?.get("nilasya_sid")?.value?.trim()
    if (legacySid) bag.sid = legacySid
  }

  return bag
}

export function serializeSessionBag(bag: SessionBag): string {
  const params = new URLSearchParams()
  if (bag.admin) params.set("admin", bag.admin)
  if (bag.consent) params.set("consent", bag.consent)
  if (bag.vid) params.set("vid", bag.vid)
  if (bag.sid) params.set("sid", bag.sid)
  return params.toString()
}
