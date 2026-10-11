"use client"

import { useRef, type PointerEvent, type ReactNode } from "react"

/** Dark section wrapper: a soft gold glow follows the pointer. Pure CSS when idle. */
export function Spotlight({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const onMove = (event: PointerEvent<HTMLElement>) => {
    const element = ref.current
    if (!element) return
    const box = element.getBoundingClientRect()
    element.style.setProperty("--mx", `${event.clientX - box.left}px`)
    element.style.setProperty("--my", `${event.clientY - box.top}px`)
  }
  return (
    <section ref={ref} onPointerMove={onMove} className={`spotlight ${className}`}>
      {children}
    </section>
  )
}