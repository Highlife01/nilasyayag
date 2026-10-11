"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useSyncExternalStore } from "react"
import { ChevronLeft, ChevronRight, Pause, Play, Ship, Sparkles, Heart, Globe, Package, Award, Leaf } from "lucide-react"
import type { Locale } from "@/lib/i18n/config"

type HeroBannerProps = {
  locale: Locale
  labels: {
    previous: string
    next: string
    pause: string
    play: string
    slide: string
  }
}

const INTERVAL = 8000
const MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(MOTION_QUERY)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function getPrefersReducedMotion() {
  return window.matchMedia(MOTION_QUERY).matches
}

export function HeroBanner({ locale, labels }: HeroBannerProps) {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const reduced = useSyncExternalStore(subscribeMotion, getPrefersReducedMotion, () => false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isTr = locale === "tr"

  const slides = [
    {
      id: "anatolia",
      src: "/media/hero/master-banner.webp",
      badge: isTr ? "From Anatolia to the World • Ana Koleksiyon" : "From Anatolia to the World • Master Collection",
      alt: isTr
        ? "Asia Oil - Anadolu'dan Dünyaya Ayçiçek ve Zeytinyağı İhracatı"
        : "Asia Oil - Natural Goodness from Anatolia to the World",
      kicker: isTr ? "✦ ASIA OIL • Anadolu'nun Doğal Bereketi" : "✦ ASIA OIL • Natural Goodness from Anatolia",
      port: isTr ? "FOB Mersin & CIF Dünya Limanları" : "FOB Mersin & CIF Global Seaports",
      sunflowerDesc: isTr ? "500ml, 1L, 2L, 5L PET & Teneke • Max %0.10 FFA" : "500ml, 1L, 2L, 5L PET & Tin • Max 0.10% FFA",
      oliveDesc: isTr ? "Soğuk Sıkım (≤ 27°C) • 500ml, 1L Cam & 5L Teneke" : "Cold Pressed (≤ 27°C) • 500ml, 1L Glass & 5L Tin",
    },
    {
      id: "signature",
      src: "/media/hero/banner-signature.webp",
      badge: isTr ? "Asia Oil Signature • İhracat Ambalajları" : "Asia Oil Signature • Export Packaging Line",
      alt: isTr
        ? "Asia Oil - Premium Teneke ve Şişe Yağ Koleksiyonu"
        : "Asia Oil - Premium Bottled & Tinned Edible Oils Collection",
      kicker: isTr ? "✦ ASIA OIL • Üstün İhracat Standartları" : "✦ ASIA OIL • Premium Export Quality",
      port: isTr ? "Mersin Port (MIP) & İzmir Limanı" : "Mersin Port (MIP) & İzmir Seaport",
      sunflowerDesc: isTr ? "İnce Rafinasyon • Nötr Koku & Yüksek Duman Noktası" : "Fine Refined • Neutral Aroma & High Smoke Point",
      oliveDesc: isTr ? "Ege & Akdeniz Zeytinleri • Düşük Asit Oranı" : "Aegean & Mediterranean Olives • Low Acidity",
    },
  ]

  const count = slides.length

  useEffect(() => {
    if (reduced || !playing) return
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % count)
    }, INTERVAL)
    return () => window.clearInterval(timer)
  }, [playing, reduced, count])

  const go = (step: number) => {
    setActive((prev) => (prev + step + count) % count)
  }

  const features = isTr
    ? [
        { icon: Leaf, label: "%100 Doğal", sub: "Saf & Katkısız" },
        { icon: Award, label: "Üstün Kalite", sub: "Uluslararası Standart" },
        { icon: Heart, label: "Sağlıklı Tercih", sub: "Hafif & Besleyici" },
        { icon: Globe, label: "Küresel İhracat", sub: "FOB Mersin / CIF" },
        { icon: Sparkles, label: "Zengin Besin Değeri", sub: "E Vitamini & Omega" },
        { icon: Package, label: "Çeşitli Ambalaj", sub: "PET, Cam & Teneke" },
      ]
    : [
        { icon: Leaf, label: "100% Natural", sub: "Pure & Additive-Free" },
        { icon: Award, label: "Premium Quality", sub: "International Certified" },
        { icon: Heart, label: "Healthy Choice", sub: "Light & Nutritious" },
        { icon: Globe, label: "Global Export", sub: "FOB Mersin / CIF" },
        { icon: Sparkles, label: "Rich in Nutrients", sub: "Vitamin E & Omegas" },
        { icon: Package, label: "Various Packaging", sub: "PET, Glass & Tin" },
      ]

  return (
    <div ref={containerRef} className="rise rise-4 relative mt-12 w-full">
      {/* Visual Frame */}
      <div className="group relative w-full overflow-hidden rounded-2xl border border-gold/30 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] md:rounded-3xl">
        <div className="relative aspect-[16/9] w-full bg-[#0a0f08]">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === active ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
              }`}
              aria-hidden={idx !== active}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 0}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className={`object-cover transition-transform duration-1000 group-hover:scale-[1.015] ${
                  idx === active ? "hero-zoom" : ""
                }`}
              />
            </div>
          ))}
        </div>

        {/* Ambient vignettes */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/10 to-black/35" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2 md:top-6 md:left-6">
          <div className="rounded-full border border-white/20 bg-black/55 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-medium text-gold-light shadow-md md:text-xs">
            {slides[active]?.kicker}
          </div>
        </div>

        <div className="absolute top-3 right-3 z-30 hidden sm:flex items-center gap-2 md:top-6 md:right-6">
          <div className="rounded-full border border-emerald-400/30 bg-black/55 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-medium text-emerald-300 shadow-md md:text-xs flex items-center gap-1.5">
            <Ship className="size-3.5" />
            <span>{slides[active]?.port}</span>
          </div>
        </div>

        {/* Bottom Corner Product Spec Cards */}
        <div className="absolute bottom-16 left-3 z-30 hidden sm:block max-w-[280px] md:bottom-20 md:left-6">
          <div className="rounded-2xl border border-white/20 bg-black/65 backdrop-blur-md p-3 text-left shadow-lg">
            <span className="font-bold text-sun flex items-center gap-1.5 text-xs md:text-sm">
              <span>🌻</span> {isTr ? "Rafine Ayçiçek Yağı" : "Refined Sunflower Oil"}
            </span>
            <span className="mt-1 block text-[11px] leading-snug text-[#f7f1e3]/80">
              {slides[active]?.sunflowerDesc}
            </span>
          </div>
        </div>

        <div className="absolute bottom-16 right-3 z-30 hidden sm:block max-w-[280px] md:bottom-20 md:right-6">
          <div className="rounded-2xl border border-white/20 bg-black/65 backdrop-blur-md p-3 text-right shadow-lg">
            <span className="font-bold text-emerald-400 flex items-center justify-end gap-1.5 text-xs md:text-sm">
              <span>🫒</span> {isTr ? "Natürel Sızma Zeytinyağı" : "Extra Virgin Olive Oil"}
            </span>
            <span className="mt-1 block text-[11px] leading-snug text-[#f7f1e3]/80">
              {slides[active]?.oliveDesc}
            </span>
          </div>
        </div>

        {/* Center / Bottom Navigation Bar */}
        <div className="absolute bottom-3 inset-x-3 z-30 flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-black/60 px-3 py-2 backdrop-blur-md md:bottom-4 md:inset-x-6 md:px-4">
          {/* Slide Selectors / Tabs */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActive(idx)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition duration-300 ${
                  active === idx
                    ? "bg-gold-light text-ink shadow-sm"
                    : "text-[#f7f1e3]/70 hover:bg-white/10 hover:text-white"
                }`}
                aria-label={`${labels.slide} ${idx + 1}`}
                aria-pressed={active === idx}
              >
                <span className={`size-1.5 rounded-full ${active === idx ? "bg-ink" : "bg-gold-light/60"}`} />
                <span className="hidden xs:inline sm:inline">{slide.badge}</span>
                <span className="inline xs:hidden sm:hidden">{idx + 1}</span>
              </button>
            ))}
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={labels.previous}
              className="grid size-7 place-items-center rounded-md border border-white/15 text-[#f7f1e3] transition hover:border-gold-light hover:text-gold-light md:size-8"
            >
              <ChevronLeft className="size-3.5 rtl:-scale-x-100" />
            </button>

            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? labels.pause : labels.play}
              aria-pressed={playing}
              className="grid size-7 place-items-center rounded-md border border-white/15 text-[#f7f1e3] transition hover:border-gold-light hover:text-gold-light md:size-8"
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label={labels.next}
              className="grid size-7 place-items-center rounded-md border border-white/15 text-[#f7f1e3] transition hover:border-gold-light hover:text-gold-light md:size-8"
            >
              <ChevronRight className="size-3.5 rtl:-scale-x-100" />
            </button>

            <span className="ms-1 font-mono text-xs text-gold-light">
              {active + 1}/{count}
            </span>
          </div>
        </div>
      </div>

      {/* 6 Key Pillars Bar (Directly representing the badges from the master visual) */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <div
              key={i}
              className="group flex items-center gap-2.5 rounded-xl border border-gold/20 bg-black/40 p-2.5 backdrop-blur-sm transition duration-300 hover:border-gold-light/40 hover:bg-black/60"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-gold-light/10 text-gold-light transition duration-300 group-hover:bg-gold-light group-hover:text-ink">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-xs font-semibold text-[#f7f1e3] group-hover:text-gold-light">
                  {f.label}
                </p>
                <p className="truncate text-[10px] text-[#f7f1e3]/60">{f.sub}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
