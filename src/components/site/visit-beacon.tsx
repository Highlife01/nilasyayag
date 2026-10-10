"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function VisitBeacon() {
  const pathname = usePathname()
  useEffect(() => {
    const body = JSON.stringify({ path: pathname })
    if (!navigator.sendBeacon?.("/api/analytics/collect", body)) {
      fetch("/api/analytics/collect", { method: "POST", body, keepalive: true }).catch(() => undefined)
    }
  }, [pathname])
  return null
}
