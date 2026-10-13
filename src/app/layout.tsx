import type { Metadata } from "next"
import { Cormorant_Garamond, Manrope, Noto_Naskh_Arabic } from "next/font/google"
import { headers } from "next/headers"
import Script from "next/script"
import { isLocale, LOCALE_META } from "@/lib/i18n/config"
import { BRAND, siteUrl } from "@/lib/site"
import "./globals.css"

const GA_ID = "G-BNY3CZ52EP"

const sans = Manrope({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-outfit" })
const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
})
const arabic = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["500", "600", "700"], variable: "--font-arabic" })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${BRAND} — Global B2B Edible Oil Export`, template: `%s · ${BRAND}` },
  description: "Asia Oil supplies premium refined sunflower oil (HS 1512.19) and certified olive oil (HS 1509.20) from Türkiye. B2B wholesale quotations, flexitanks, and private label bottling.",
  applicationName: BRAND,
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
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  other: {
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
  return (
    <html lang={LOCALE_META[locale].html} dir={LOCALE_META[locale].dir} className={`${sans.variable} ${display.variable} ${arabic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  )
}
