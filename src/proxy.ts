import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
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

  if (pathname.startsWith("/admin")) {
    headers.set("x-locale", "tr")
    if (!pathname.startsWith("/admin/login") && !request.cookies.get("nilasya_session")) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.next({ request: { headers } })
  }

  const first = pathname.split("/").filter(Boolean)[0]
  if (!first || !isLocale(first)) {
    const locale = preferredLocale(request.headers.get("accept-language"))
    return NextResponse.redirect(new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url))
  }

  headers.set("x-locale", first)
  const response = NextResponse.next({ request: { headers } })
  if (!request.cookies.get("nilasya_vid")) {
    response.cookies.set("nilasya_vid", crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    })
  }
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}
