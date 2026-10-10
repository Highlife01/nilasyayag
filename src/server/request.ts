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
  const host = headers.get("x-forwarded-host") || headers.get("host")
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
