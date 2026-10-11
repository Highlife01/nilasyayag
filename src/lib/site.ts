export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://www.asiaoil.com.tr"
  return raw.replace(/\/$/, "")
}

export const SUPERADMIN_EMAIL = "cebrailkara@gmail.com"
export const EXPORT_EMAIL = "export@asiaoil.com.tr"
export const BRAND = "Asia Oil"
