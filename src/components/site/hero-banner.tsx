"use client"

import Image from "next/image"
import { useState, useEffect, useSyncExternalStore } from "react"
import { ChevronLeft, ChevronRight, ArrowRight, Phone } from "lucide-react"
import { pathFor, type Locale } from "@/lib/i18n/config"

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

const INTERVAL = 7000
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

  const isTr = locale === "tr"

  const slides = [
    {
      id: "refinery",
      src: "/media/hero/master-banner.webp",
      kicker: isTr ? "TAM ENTEGRE BİTKİSEL YAĞ RAFİNASYON TESİSİ • TÜRKİYE" : "HIGH-TECH EDIBLE OIL REFINING PLANT • TÜRKIYE",
      title: isTr
        ? "Dünya Pazarları İçin Yüksek Saflıkta Bitkisel Sıvı Yağ İhracatı"
        : "Pure Seed & Olive Oil Excellence for Global Markets",
      description: isTr
        ? "Yıllık 120.000 ton entegre rafinasyon kapasitesi; Mersin Uluslararası Limanı (MIP) çıkışlı rafine ayçiçek yağı, natürel sızma zeytinyağı ve Private Label ihracatı."
        : "120,000 MT annual refining capacity producing crystal-clear sunflower oil, cold-pressed Aegean olive oil, and private-label packaging for international distributors.",
      badges: isTr
        ? ["120.000 MT Yıllık Kapasite", "Çok Kademeli Vinterizasyon", "ISO 22000 & Helal Sertifikalı"]
        : ["120,000 MT Annual Capacity", "Multi-Stage Winterization", "ISO 22000 & Halal Certified"],
      tabTitle: isTr ? "ENTEGRE RAFİNASYON TESİSİ" : "HIGH-TECH REFINING PLANT",
      alt: "Asia Oil - High-Tech Edible Oil Refinery Plant",
    },
    {
      id: "sunflower",
      src: "/media/hero/1.webp",
      kicker: isTr ? "CODEX STAN 210 • RAFİNE AYÇİÇEK YAĞI" : "CODEX STAN 210 • REFINED SUNFLOWER OIL",
      title: isTr
        ? "İnce Rafine, Kokusuz & 232°C Yüksek Duman Noktası"
        : "Fine Refined, Odorless & 232°C High Smoke Point",
      description: isTr
        ? "FFA < %0.10 serbest asitlik, altın sarısı kristal berraklık ve 0.5L'den 18L tenekeye ve flexitanka kadar eksiksiz ihracat ambalajları."
        : "Ultra-low FFA < 0.10% acidity, brilliant crystal golden clarity, packaged from 0.5L PET to 18L export tins and bulk flexitanks.",
      badges: isTr
        ? ["FFA < %0.10 Minimum Asitlik", "232°C Yüksek Duman Noktası", "Sıvı Azot ile Oksijensiz Dolum"]
        : ["FFA < 0.10% Ultra-Low Acidity", "232°C High Smoke Point", "Nitrogen Headspace Flush"],
      tabTitle: isTr ? "RAFİNE AYÇİÇEK YAĞI" : "REFINED SUNFLOWER OIL",
      alt: "Asia Oil - Refined Sunflower Oil Export",
    },
    {
      id: "olive",
      src: "/media/hero/banner-signature.webp",
      kicker: isTr ? "EGE VE AKDENİZ • SOĞUK SIKIM ZEYTİNYAĞI" : "AEGEAN & MEDITERRANEAN • COLD-PRESSED OLIVE OIL",
      title: isTr
        ? "Erken Hasat Ege Zeytinlerinden Soğuk Sıkım Natürel Sızma"
        : "Cold-Pressed Early Harvest Aegean Extra Virgin Olive Oil",
      description: isTr
        ? "27°C altında soğuk mekanik sıkımla üretilen, zengin polifenol ve düşük asit oranına sahip üstün lezzetli natürel sızma ve riviera zeytinyağları."
        : "Mechanical cold extraction below 27°C, rich polyphenols, balanced fruitiness, and low acidity in dark Marasca glass bottles and export tins.",
      badges: isTr
        ? ["Soğuk Sıkım (≤ 27°C)", "Zengin Doğal Polifenoller", "IOC Extra Virgin Standardı"]
        : ["Cold Pressed (≤ 27°C)", "High Natural Polyphenols", "IOC Extra Virgin Standard"],
      tabTitle: isTr ? "SOĞUK SIKIM ZEYTİNYAĞI" : "AEGEAN EXTRA VIRGIN",
      alt: "Asia Oil - Cold-Pressed Olive Oil Collection",
    },
    {
      id: "privatelabel",
      src: "/media/hero/3.webp",
      kicker: isTr ? "ÖZEL MARKA • PRİVATE LABEL & MULTİ-AMBALAJ" : "PRIVATE LABEL OEM & RETAIL PACKAGING",
      title: isTr
        ? "Markanıza Özel Ambalaj, Etiketleme & Barkod Çözümleri"
        : "Retail-Ready Private Label & OEM Packaging for Your Brand",
      description: isTr
        ? "PET şişe, ihracat tenekesi veya 22.000L flexitank; hedef pazarınızın dillerinde yasal etiket tasarımı ve karton baskı."
        : "PET bottles, food-grade tins, and 22,000L flexitanks with certified multilingual labeling and carton design.",
      badges: isTr
        ? ["Özel Marka & Dil Etiketleme", "0.5L - 18L & Flexitank", "EAN Barkod & İhracat Kolisi"]
        : ["Private Label & Multilingual", "0.5L to 18L & Flexitank", "EAN Barcode & Export Carton"],
      tabTitle: isTr ? "ÖZEL MARKA & OEM AMBALAJ" : "PRIVATE LABEL OEM",
      alt: "Asia Oil - Private Label Packaging Solutions",
    },
    {
      id: "maritime",
      src: "/media/hero/05-port-dawn.webp",
      kicker: isTr ? "MERSİN PORT (MIP) & İZMİR LİMANI • GLOBAL SEVKİYAT" : "MERSIN PORT (MIP) & IZMIR • GLOBAL DISPATCH",
      title: isTr
        ? "Akdeniz'in Ana Kapısından 60+ Ülkeye Konteyner İhracatı"
        : "Container Logistics from Mersin International Port to 60+ Countries",
      description: isTr
        ? "FOB, CFR, CIF teslimat koşulları; EUR.1, Menşe Şahadetnamesi, Helal ve SGS / Bureau Veritas bağımsız gözetim dosyası."
        : "FOB, CFR, CIF Incoterms; full documentation with EUR.1, Certificate of Origin, and SGS surveyor seal.",
      badges: isTr
        ? ["Mersin Port (MIP) Terminali", "20' / 40' FCL & Flexitank", "SGS & Bureau Veritas Denetimi"]
        : ["Mersin Port (MIP) Terminal", "20' / 40' FCL & Flexitank", "SGS & Bureau Veritas Inspection"],
      tabTitle: isTr ? "GLOBAL LİMAN SEVKİYATI" : "DIRECT PORT EXPORT",
      alt: "Asia Oil - Mersin Port Container Loading",
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

  const current = slides[active]

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden bg-slate-50 text-slate-900 select-none border-b border-slate-200/80">
      {/* Background Image Carousel with Smooth Crossfade & Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            aria-hidden={idx !== active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`object-cover object-center transform transition-transform duration-[8000ms] ${
                idx === active ? "scale-105" : "scale-100"
              }`}
            />
            {/* Soft readable gradient mask identical to asiaplast benchmark */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/85 via-45% to-white/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent via-55% to-white/60" />
          </div>
        ))}
      </div>

      {/* Engineering Blueprint Grid Overlay */}
      <div className="hero-grid absolute inset-0 z-0 opacity-40 pointer-events-none" />

      {/* Main Content Area */}
      <div className="container-x relative z-10 pt-16 sm:pt-24 pb-12 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Top Live Status Chip */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-black tracking-widest uppercase shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{current.kicker}</span>
          </div>

          {/* Majestic Bold Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900">
            {current.title}
          </h1>

          {/* Description Paragraph */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
            {current.description}
          </p>

          {/* 3 Value-Assurance Badges */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {current.badges.map((badgeText) => (
              <span
                key={badgeText}
                className="px-3.5 py-1.5 rounded-xl bg-white/95 hover:bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-md flex items-center gap-2 transition hover:border-emerald-300"
              >
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{badgeText}</span>
              </span>
            ))}
          </div>

          {/* High-Impact CTA Button Group */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={pathFor(locale, "quote")}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span>📦</span>
              <span>{isTr ? "Resmi Teklif İste" : "Request a Quote"}</span>
            </a>

            <a
              href="https://wa.me/905325000000?text=Hello%20Asia%20Oil%2C%20I%20would%20like%20to%20request%20a%20B2B%20quotation"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-white hover:bg-emerald-50/80 border border-emerald-300 text-emerald-800 font-bold text-sm shadow-xs backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>WhatsApp: +90 532 500 00 00</span>
            </a>

            <a
              href="#products-catalog"
              className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-xs backdrop-blur-md hover:border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isTr ? "Ürünleri İnceleyin" : "Explore Products"}</span>
              <ArrowRight className="size-4 rtl:-scale-x-100" />
            </a>
          </div>
        </div>

        {/* Floating Prev/Next Slide Arrows */}
        <div className="hidden sm:flex items-center gap-3 absolute top-1/2 -translate-y-1/2 right-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={labels.previous}
            className="w-12 h-12 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-800 grid place-items-center shadow-md backdrop-blur-md transition hover:scale-110 active:scale-90 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={labels.next}
            className="w-12 h-12 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-800 grid place-items-center shadow-md backdrop-blur-md transition hover:scale-110 active:scale-90 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 rtl:-scale-x-100" />
          </button>
        </div>
      </div>

      {/* 5-Slide Interactive Controller Bar at Bottom */}
      <div className="relative z-10 border-t border-slate-200/80 bg-white/85 backdrop-blur-xl py-4">
        <div className="container-x">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {slides.map((s, idx) => {
              const isSelected = active === idx
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActive(idx)
                    setPlaying(false)
                  }}
                  className={`relative text-left p-3.5 rounded-2xl transition duration-300 cursor-pointer ${
                    idx === 4 ? "col-span-2 sm:col-span-1" : ""
                  } ${
                    isSelected
                      ? "border bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                      : "border bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                    <span className={isSelected ? "text-emerald-700 font-extrabold" : "text-slate-400"}>
                      0{idx + 1}
                    </span>
                    {isSelected && (
                      <span className="text-emerald-600 font-sans text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-bold line-clamp-1 leading-snug ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                    {s.tabTitle}
                  </p>
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-b-2xl animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Infinite High-Contrast Marquee Ticker */}
      <div className="relative z-10 border-t border-slate-200/80 bg-slate-100/90 py-2.5 overflow-hidden" aria-hidden="true">
        <div className="marquee flex w-max gap-8 font-mono text-[11px] uppercase tracking-[.25em] text-slate-500">
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>DIRECT REFINERY EXPORTER</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>MERSIN MIP CONTAINER TERMINAL</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>EXTRA VIRGIN OLIVE OIL</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>REFINED SUNFLOWER OIL</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>CODEX STAN 210 CERTIFIED</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>SGS / BV PRE-SHIPMENT SURVEY</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>22,000L BULK FLEXITANK</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>PRIVATE LABEL OEM</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>ISO 22000 &amp; HALAL</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>DIRECT REFINERY EXPORTER</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>MERSIN MIP CONTAINER TERMINAL</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>EXTRA VIRGIN OLIVE OIL</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>REFINED SUNFLOWER OIL</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>CODEX STAN 210 CERTIFIED</span>
          <span className="whitespace-nowrap flex items-center gap-4"><span className="text-emerald-600 font-bold">•</span>SGS / BV PRE-SHIPMENT SURVEY</span>
        </div>
      </div>
    </section>
  )
}
