"use client"

import Image from "next/image"
import { useEffect, useState, useSyncExternalStore } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

type Slide = { src: string; alt: string; kicker: string; title: string; lede: string; href: string; cta: string }
type Labels = { pause: string; play: string; previous: string; next: string; slide: string }

const INTERVAL = 7000
const MOTION = "(prefers-reduced-motion: reduce)"

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(MOTION)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function prefersReducedMotion() {
  return window.matchMedia(MOTION).matches
}

export function Showcase({ slides, labels }: { slides: Slide[]; labels: Labels }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reduced = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false)
  const count = slides.length

  useEffect(() => {
    if (reduced || !playing || count < 2) return
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % count), INTERVAL)
    return () => window.clearTimeout(timer)
  }, [index, playing, reduced, count])

  if (!count) return null
  const active = slides[index]
  const go = (step: number) => setIndex((value) => (value + step + count) % count)

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16" aria-roledescription="carousel">
      <div className="order-2 lg:order-1">
        <p className="kicker flex items-center gap-3 text-gold-light">
          <span className="rule" aria-hidden="true" />
          {active.kicker}
        </p>
        <h3 key={`t-${index}`} className="font-display rise mt-5 text-4xl leading-[1.02] text-[#f7f1e3] md:text-6xl">
          {active.title}
        </h3>
        <p key={`l-${index}`} className="rise rise-1 mt-6 max-w-md text-base leading-relaxed text-[#f7f1e3]/75">
          {active.lede}
        </p>
        <a
          href={active.href}
          className="group mt-9 inline-flex h-12 items-center gap-3 border border-gold-light/60 px-6 text-sm tracking-wide text-gold-light transition hover:bg-gold-light hover:text-ink"
        >
          {active.cta}
          <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
        </a>
        <div className="mt-12 flex items-center gap-3">
          <button type="button" onClick={() => go(-1)} aria-label={labels.previous} className="grid size-11 place-items-center border border-white/15 text-[#f7f1e3] transition hover:border-gold-light hover:text-gold-light">
            <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={labels.next} className="grid size-11 place-items-center border border-white/15 text-[#f7f1e3] transition hover:border-gold-light hover:text-gold-light">
            <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-pressed={playing}
            aria-label={playing ? labels.pause : labels.play}
            className="grid size-11 place-items-center border border-white/15 text-[#f7f1e3] transition hover:border-gold-light hover:text-gold-light"
          >
            {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          </button>
          <span className="ms-3 font-display text-2xl text-gold-light" aria-live="polite">
            {String(index + 1).padStart(2, "0")}
            <span className="text-base text-[#f7f1e3]/40"> / {String(count).padStart(2, "0")}</span>
          </span>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative">
          <div className="absolute -inset-3 border border-gold-light/25 md:-inset-5" aria-hidden="true" />
          <div className="relative aspect-[3/2] overflow-hidden bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
            {slides.map((slide, slideIndex) => (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-1000 ${slideIndex === index ? "opacity-100" : "opacity-0"}`}
                aria-hidden={slideIndex !== index}
              >
                <Image
                  src={slide.src}
                  alt={slideIndex === index ? slide.alt : ""}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className={`object-cover ${slideIndex === index ? "hero-zoom" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 md:gap-4">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(slideIndex)}
              aria-label={`${labels.slide} ${slideIndex + 1}`}
              aria-current={slideIndex === index ? "true" : undefined}
              className="group text-start"
            >
              <span className="relative block aspect-[3/2] overflow-hidden">
                <Image src={slide.src} alt="" fill sizes="20vw" className={`object-cover transition duration-500 ${slideIndex === index ? "opacity-100" : "opacity-40 group-hover:opacity-80"}`} />
              </span>
              <span className="mt-3 block h-px w-full bg-white/15">
                {slideIndex === index ? (
                  <span
                    key={`p-${index}-${playing}`}
                    className={`block h-px w-full bg-gold-light ${playing && !reduced ? "progress" : ""}`}
                    style={playing && !reduced ? { animationDuration: `${INTERVAL}ms` } : undefined}
                  />
                ) : null}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Showcase as Hero }

