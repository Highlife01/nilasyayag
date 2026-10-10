"use client"

import { useSyncExternalStore, type ReactNode } from "react"

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true })
  return () => window.removeEventListener("scroll", callback)
}

const scrolled = () => window.scrollY > 24

export function HeaderShell({ className, children }: { className: string; children: ReactNode }) {
  const solid = useSyncExternalStore(subscribe, scrolled, () => false)
  return (
    <header className={className} data-solid={solid}>
      {children}
    </header>
  )
}
