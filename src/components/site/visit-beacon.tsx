"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

interface NavigatorUAData {
  getHighEntropyValues?: (hints: string[]) => Promise<{ model?: string; platformVersion?: string }>
}

export function VisitBeacon({ consent }: { consent?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastSentRef = useRef<{ key: string; at: number } | null>(null)

  useEffect(() => {
    // Do not start non-essential analytics tracking without explicit consent
    if (consent !== "all") return

    const utmSource = searchParams.get("utm_source") || ""
    const utmMedium = searchParams.get("utm_medium") || ""
    const utmCampaign = searchParams.get("utm_campaign") || ""
    const utmTerm = searchParams.get("utm_term") || ""
    const utmContent = searchParams.get("utm_content") || ""

    const eventKey = `${pathname}|${utmSource}|${utmMedium}|${utmCampaign}`
    const now = Date.now()
    if (lastSentRef.current && lastSentRef.current.key === eventKey && now - lastSentRef.current.at < 4000) {
      return
    }
    lastSentRef.current = { key: eventKey, at: now }

    let cancelled = false

    async function send() {
      let clientModel = ""
      let clientPlatformVersion = ""
      try {
        const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData }).userAgentData
        if (uaData?.getHighEntropyValues) {
          const hints = await uaData.getHighEntropyValues(["model", "platformVersion"])
          if (hints.model) clientModel = hints.model
          if (hints.platformVersion) clientPlatformVersion = hints.platformVersion
        }
      } catch {
        // High-entropy hints are optional
      }

      if (cancelled) return

      const screenW = typeof window !== "undefined" && window.screen?.width ? window.screen.width : 0
      const screenH = typeof window !== "undefined" && window.screen?.height ? window.screen.height : 0
      const screenSize = screenW > 0 && screenH > 0 ? `${screenW}x${screenH}` : "Veri alınamadı"

      let timezone = "Europe/Istanbul (UTC+3)"
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        if (tz) timezone = `${tz} (Sunucu: UTC+3)`
      } catch {
        // Fallback timezone
      }

      const payload = JSON.stringify({
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer || "" : "",
        language: typeof navigator !== "undefined" ? navigator.language || "" : "",
        screenSize,
        timezone,
        clientModel,
        clientPlatformVersion,
        utm: {
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_term: utmTerm,
          utm_content: utmContent,
        },
      })

      if (!navigator.sendBeacon?.("/api/analytics/collect", payload)) {
        fetch("/api/analytics/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => undefined)
      }
    }

    void send()
    return () => {
      cancelled = true
    }
  }, [pathname, searchParams, consent])

  return null
}
