import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { parseSessionBag } from "@/lib/cookies-packed"
import { isLocale, preferredLocale } from "@/lib/i18n/config"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  const headers = new Headers(request.headers)
  headers.set("x-pathname", pathname)
  const bag = parseSessionBag(request.cookies.get("__session")?.value, request.cookies)

  if (pathname.startsWith("/admin")) {
    headers.set("x-locale", "tr")
    if (!pathname.startsWith("/admin/login") && !bag.admin) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.next({ request: { headers } })
  }

  const first = pathname.split("/").filter(Boolean)[0]
  if (!first || !isLocale(first)) {
    const locale = preferredLocale(request.headers.get("accept-language"))
    const redirectRes = NextResponse.redirect(new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url))
    redirectRes.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400")
    redirectRes.headers.set("Vary", "Accept-Language")
    return redirectRes
  }

  headers.set("x-locale", first)
  const response = NextResponse.next({ request: { headers } })

  // Enable CDN Edge Caching for public pages (Firebase Hosting & Google CDN)
  response.headers.set("Cache-Control", "public, max-age=120, s-maxage=3600, stale-while-revalidate=86400")

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}
