import "server-only"

export function clientIp(headers: Headers) {
  const fastly = headers.get("fastly-client-ip")?.trim()
  if (fastly) return fastly
  const chain = (headers.get("x-forwarded-for") || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
  return chain[0] || headers.get("x-real-ip") || "unknown"
}

export function sameOrigin(headers: Headers) {
  const origin = headers.get("origin")
  if (!origin) return false
  try {
    const originHost = new URL(origin).host.toLowerCase()
    const candidates = [headers.get("x-forwarded-host"), headers.get("host")]
      .filter(Boolean)
      .flatMap((h) => String(h).split(","))
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean)
    return candidates.includes(originHost)
  } catch {
    return false
  }
}
