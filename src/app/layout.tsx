import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Manrope, Noto_Naskh_Arabic } from "next/font/google"
import { headers } from "next/headers"
import { PwaRegister } from "@/components/site/pwa-register"
import { isLocale, LOCALE_META } from "@/lib/i18n/config"
import { BRAND, siteUrl } from "@/lib/site"
import "./globals.css"

const sans = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-outfit",
})
const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
})
const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-arabic",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#092217" },
    { media: "(prefers-color-scheme: dark)", color: "#092217" },
  ],
  colorScheme: "light",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${BRAND} — Global B2B Edible Oil Export`, template: `%s · ${BRAND}` },
  description: "Asia Oil supplies premium refined sunflower oil (HS 1512.19) and certified olive oil (HS 1509.20) from Türkiye. B2B wholesale quotations, flexitanks, and private label bottling.",
  applicationName: BRAND,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: BRAND,
    statusBarStyle: "black-translucent",
  },
  authors: [{ name: "Asia Oil Export Desk", url: siteUrl() }],
  creator: BRAND,
  publisher: BRAND,
  category: "Agri-Food Commodities & Edible Oils",
  classification: "International B2B Commodity Export",
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: ["/favicon.ico"],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#092217",
    "msapplication-TileImage": "/icon-192.png",
    "geo.region": "TR-33",
    "geo.placename": "Mersin, Akdeniz, Türkiye",
    "geo.position": "36.7950;34.6400",
    "ICBM": "36.7950, 34.6400",
    "geo.country": "TR",
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers()
  const raw = headerList.get("x-locale") || "en"
  const locale = isLocale(raw) ? raw : "en"
  const fontVars = locale === "ar" ? `${sans.variable} ${display.variable} ${arabic.variable}` : `${sans.variable} ${display.variable}`
  return (
    <html lang={LOCALE_META[locale].html} dir={LOCALE_META[locale].dir} className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <PwaRegister />
      </body>
    </html>
  )
}
