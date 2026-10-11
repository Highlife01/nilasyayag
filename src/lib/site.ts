export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://nilasyayag.web.app"
  return raw.replace(/\/$/, "")
}

export const SUPERADMIN_EMAIL = "cebrailkara@gmail.com"
export const BRAND = "Asia Oil"
