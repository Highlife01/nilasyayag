export function analyticsAllowed(consent: string | undefined) {
  return consent === "all"
}

export function consentRedirect(value: unknown, requestUrl: string): URL {
  const base = new URL(requestUrl)
  const fallback = new URL("/en", base)
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(value)) return fallback
  try {
    const destination = new URL(value, base)
    return destination.origin === base.origin ? destination : fallback
  } catch {
    return fallback
  }
}
