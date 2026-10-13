export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://www.asiaoil.com.tr"
  return raw.replace(/\/$/, "")
}

export const SUPERADMIN_EMAIL = "cebrailkara@gmail.com"
export const EXPORT_EMAIL = "export@asiaoil.com.tr"
export const BRAND = "Asia Oil"
export const CONTACT_PHONE = "+90 533 684 01 75"
export const WHATSAPP_NUMBER = "905336840175"
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
