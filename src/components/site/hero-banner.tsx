"use client"

import Image from "next/image"
import { useState, useEffect, useSyncExternalStore } from "react"
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Ship, Sparkles, CheckCircle2 } from "lucide-react"
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
      titlePart1: isTr ? "Dünya Pazarları İçin Yüksek Saflıkta " : "Pure Seed & Olive Oil Excellence for ",
      titleHighlight: isTr ? "Bitkisel Sıvı Yağ İhracatı" : "Global Markets",
      description: isTr
        ? "Yıllık 120.000 ton entegre rafinasyon kapasitesi; Mersin Uluslararası Limanı (MIP) çıkışlı rafine ayçiçek yağı, natürel sızma zeytinyağı ve Private Label ihracatı."
        : "120,000 MT annual refining capacity producing crystal-clear sunflower oil, cold-pressed Aegean olive oil, and private-label packaging for international distributors.",
      badges: isTr
        ? ["120.000 MT Yıllık Kapasite", "Çok Kademeli Vinterizasyon", "ISO 22000 & Helal Sertifikalı"]
        : ["120,000 MT Annual Capacity", "Multi-Stage Winterization", "ISO 22000 & Halal Certified"],
      specs: [
        { label: isTr ? "Yıllık Rafinasyon" : "Annual Capacity", val: "120.000 MT" },
        { label: isTr ? "Ana Yükleme Limanı" : "Main Seaport", val: "Mersin (MIP)" },
        { label: isTr ? "Teslimat Terimleri" : "Incoterms", val: "FOB / CIF / CFR" },
        { label: isTr ? "Akreditasyon" : "Certification", val: "ISO 22000 & Helal" },
      ],
      productParam: "sunflower",
      cardIcon: "🏭",
      cardBadge: isTr ? "ENTEGRE FABRİKA KAPASİTESİ" : "FACTORY PRODUCTION SCALE",
      tabTitle: isTr ? "ENTEGRE RAFİNASYON TESİSİ" : "HIGH-TECH REFINING PLANT",
      alt: "Asia Oil - High-Tech Edible Oil Refinery Plant",
    },
    {
      id: "sunflower",
      src: "/media/hero/1.webp",
      kicker: isTr ? "CODEX STAN 210 • RAFİNE AYÇİÇEK YAĞI" : "CODEX STAN 210 • REFINED SUNFLOWER OIL",
      titlePart1: isTr ? "İnce Rafine, Kokusuz & 232°C " : "Fine Refined, Odorless & 232°C ",
      titleHighlight: isTr ? "Yüksek Duman Noktası" : "High Smoke Point",
      description: isTr
        ? "FFA < %0.10 serbest asitlik, altın sarısı kristal berraklık ve 0.5L'den 18L tenekeye ve flexitanka kadar eksiksiz ihracat ambalajları."
        : "Ultra-low FFA < 0.10% acidity, brilliant crystal golden clarity, packaged from 0.5L PET to 18L export tins and bulk flexitanks.",
      badges: isTr
        ? ["FFA < %0.10 Minimum Asitlik", "232°C Yüksek Duman Noktası", "Sıvı Azot ile Oksijensiz Dolum"]
        : ["FFA < 0.10% Ultra-Low Acidity", "232°C High Smoke Point", "Nitrogen Headspace Flush"],
      specs: [
        { label: isTr ? "Serbest Asitlik" : "Free Fatty Acid", val: "FFA < %0.10" },
        { label: isTr ? "Duman Noktası" : "Smoke Point", val: "232°C (Sabit)" },
        { label: isTr ? "Ambalaj Seçenekleri" : "Packaging", val: "1L - 18L & Flexi" },
        { label: isTr ? "Standart" : "Standard", val: "Codex Stan 210" },
      ],
      productParam: "sunflower",
      cardIcon: "🌻",
      cardBadge: isTr ? "CANLI AYÇİÇEK ANALİZ FÖYÜ" : "SUNFLOWER OIL LAB SPEC",
      tabTitle: isTr ? "RAFİNE AYÇİÇEK YAĞI" : "REFINED SUNFLOWER OIL",
      alt: "Asia Oil - Refined Sunflower Oil Export",
    },
    {
      id: "olive",
      src: "/media/hero/banner-signature.webp",
      kicker: isTr ? "EGE VE AKDENİZ • SOĞUK SIKIM ZEYTİNYAĞI" : "AEGEAN & MEDITERRANEAN • COLD-PRESSED OLIVE OIL",
      titlePart1: isTr ? "Erken Hasat Ege Zeytinlerinden " : "Cold-Pressed Early Harvest Aegean ",
      titleHighlight: isTr ? "Soğuk Sıkım Natürel Sızma" : "Extra Virgin Olive Oil",
      description: isTr
        ? "27°C altında soğuk mekanik sıkımla üretilen, zengin polifenol ve düşük asit oranına sahip üstün lezzetli natürel sızma ve riviera zeytinyağları."
        : "Mechanical cold extraction below 27°C, rich polyphenols, balanced fruitiness, and low acidity in dark Marasca glass bottles and export tins.",
      badges: isTr
        ? ["Soğuk Sıkım (≤ 27°C)", "Zengin Doğal Polifenoller", "IOC Extra Virgin Standardı"]
        : ["Cold Pressed (≤ 27°C)", "High Natural Polyphenols", "IOC Extra Virgin Standard"],
      specs: [
        { label: isTr ? "Sıkım Sıcaklığı" : "Extraction Temp", val: "≤ 27°C (Cold)" },
        { label: isTr ? "Oleik Asit Değeri" : "Acidity", val: "≤ %0.80 Extra" },
        { label: isTr ? "Polifenol Düzeyi" : "Polyphenols", val: "350+ mg/kg" },
        { label: isTr ? "Menşe Bölgesi" : "Origin", val: "Ege / Ayvalık" },
      ],
      productParam: "olive",
      cardIcon: "🫒",
      cardBadge: isTr ? "EGE SIZMA ZEYTİNYAĞI" : "AEGEAN EXTRA VIRGIN SPEC",
      tabTitle: isTr ? "SOĞUK SIKIM ZEYTİNYAĞI" : "AEGEAN EXTRA VIRGIN",
      alt: "Asia Oil - Cold-Pressed Olive Oil Collection",
    },
    {
      id: "privatelabel",
      src: "/media/hero/3.webp",
      kicker: isTr ? "ÖZEL MARKA • PRİVATE LABEL & MULTİ-AMBALAJ" : "PRIVATE LABEL OEM & RETAIL PACKAGING",
      titlePart1: isTr ? "Markanıza Özel Ambalaj, " : "Retail-Ready Private Label & ",
      titleHighlight: isTr ? "Etiketleme & Barkod Çözümleri" : "OEM Packaging for Your Brand",
      description: isTr
        ? "PET şişe, ihracat tenekesi veya 22.000L flexitank; hedef pazarınızın dillerinde yasal etiket tasarımı ve karton baskı."
        : "PET bottles, food-grade tins, and 22,000L flexitanks with certified multilingual labeling and carton design.",
      badges: isTr
        ? ["Özel Marka & Dil Etiketleme", "0.5L - 18L & Flexitank", "EAN Barkod & İhracat Kolisi"]
        : ["Private Label & Multilingual", "0.5L to 18L & Flexitank", "EAN Barcode & Export Carton"],
      specs: [
        { label: isTr ? "Şişe & Teneke Hacmi" : "Bottle & Tin Sizes", val: "0.5L - 18L Teneke" },
        { label: isTr ? "Dökme / Flexitank" : "Bulk Flexitank", val: "21.5 - 24 MT" },
        { label: isTr ? "Çok Dilli Etiket" : "Label Compliance", val: "AB / GCC / FDA" },
        { label: isTr ? "Minimum Sipariş" : "MOQ", val: "1x20' FCL" },
      ],
      productParam: "both",
      cardIcon: "🏷️",
      cardBadge: isTr ? "ÖZEL MARKA & OEM AMBALAJ" : "PRIVATE LABEL OEM DESK",
      tabTitle: isTr ? "ÖZEL MARKA & OEM AMBALAJ" : "PRIVATE LABEL OEM",
      alt: "Asia Oil - Private Label Packaging Solutions",
    },
    {
      id: "maritime",
      src: "/media/hero/05-port-dawn.webp",
      kicker: isTr ? "MERSİN PORT (MIP) & İZMİR LİMANI • GLOBAL SEVKİYAT" : "MERSIN PORT (MIP) & IZMIR • GLOBAL DISPATCH",
      titlePart1: isTr ? "Akdeniz'in Ana Kapısından " : "Container Logistics from Mersin MIP to ",
      titleHighlight: isTr ? "60+ Ülkeye Konteyner İhracatı" : "60+ Countries Worldwide",
      description: isTr
        ? "FOB, CFR, CIF teslimat koşulları; EUR.1, Menşe Şahadetnamesi, Helal ve SGS / Bureau Veritas bağımsız gözetim dosyası."
        : "FOB, CFR, CIF Incoterms; full documentation with EUR.1, Certificate of Origin, and SGS surveyor seal.",
      badges: isTr
        ? ["Mersin Port (MIP) Terminali", "20' / 40' FCL & Flexitank", "SGS & Bureau Veritas Denetimi"]
        : ["Mersin Port (MIP) Terminal", "20' / 40' FCL & Flexitank", "SGS & Bureau Veritas Inspection"],
      specs: [
        { label: isTr ? "Ana Sevkiyat Terminali" : "Dispatch Port", val: "Mersin (MIP) Limanı" },
        { label: isTr ? "Konteyner Tipleri" : "Container Types", val: "20' / 40' / Flexitank" },
        { label: isTr ? "Gümrük & Dolaşım" : "Customs Certs", val: "EUR.1 & Menşe" },
        { label: isTr ? "Gözetim & Mühür" : "Inspection Seal", val: "SGS / Bureau Veritas" },
      ],
      productParam: "sunflower",
      cardIcon: "🚢",
      cardBadge: isTr ? "LİMAN SEVKİYAT & SÖRVEY" : "PORT LOGISTICS & SURVEY",
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
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-white text-slate-900 select-none border-b border-slate-200">
      {/* Background Image Carousel with Vibrant Presentation & Soft Mask */}
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
              className={`object-cover object-center transform transition-transform duration-[9000ms] ${
                idx === active ? "scale-105" : "scale-100"
              }`}
            />
            {/* Fine-tuned readability gradient mask: Keeps right imagery vibrant while making left text crystal clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/80 via-50% to-white/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent via-60% to-white/40" />
          </div>
        ))}
      </div>

      {/* Engineering Blueprint Grid Overlay */}
      <div className="hero-grid absolute inset-0 z-0 opacity-45 pointer-events-none" />

      {/* Main Content Area */}
      <div className="container-x relative z-10 pt-16 sm:pt-20 lg:pt-24 pb-12 flex-1 flex flex-col justify-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: High-Impact Typography & Action Suite */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* High-Tech Glowing Status Radar Chip */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50/90 border border-emerald-300 text-emerald-900 text-xs font-black tracking-widest uppercase shadow-sm backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
              </span>
              <span>{current.kicker}</span>
            </div>

            {/* Majestic Ultra-Bold Headline with Emerald/Gold Gradient Accents */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-slate-900">
              <span>{current.titlePart1}</span>
              <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 bg-clip-text text-transparent drop-shadow-xs">
                {current.titleHighlight}
              </span>
            </h1>

            {/* Clear, Authoritative B2B Paragraph */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-medium">
              {current.description}
            </p>

            {/* 3 Value-Assurance Badges */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {current.badges.map((badgeText) => (
                <span
                  key={badgeText}
                  className="px-3.5 py-1.5 rounded-xl bg-white/95 border border-slate-300/80 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md flex items-center gap-2 transition hover:border-emerald-500 hover:text-emerald-900"
                >
                  <span className="grid size-4 place-items-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
                    ✓
                  </span>
                  <span>{badgeText}</span>
                </span>
              ))}
            </div>

            {/* High-Impact CTA Button Group */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href={pathFor(locale, "quote")}
                className="btn-shine px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-emerald-700/30 ring-4 ring-emerald-500/15 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>📦</span>
                <span>{isTr ? "Resmi Teklif İste (RFQ)" : "Request a Quote (RFQ)"}</span>
              </a>

              <a
                href="https://wa.me/905325000000?text=Hello%20Asia%20Oil%2C%20I%20would%20like%20to%20request%20a%20B2B%20quotation"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-xl bg-white hover:bg-emerald-50/90 border-2 border-emerald-500/80 text-emerald-900 font-bold text-sm shadow-md backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>WhatsApp: +90 532 500 00 00</span>
              </a>

              <a
                href="#products-catalog"
                className="px-6 py-4 rounded-xl bg-slate-100 hover:bg-white border border-slate-300 text-slate-800 font-bold text-sm shadow-xs backdrop-blur-md hover:border-slate-400 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isTr ? "Ürünleri İnceleyin" : "Explore Products"}</span>
                <ArrowRight className="size-4 rtl:-scale-x-100" />
              </a>
            </div>

            {/* Quick Fast-Response Trust Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <Sparkles className="size-3.5 text-amber-500" />
                <span>{isTr ? "2 Saatte Proforma Yanıtı" : "Proforma within 2 Hours"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Ship className="size-3.5 text-emerald-600" />
                <span>Mersin Port (MIP) & İzmir FOB/CIF</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>SGS / Bureau Veritas Gözetimi</span>
              </span>
            </div>
          </div>

          {/* Right Column: High-Tech Floating Live Spec Terminal Card (Desktop Highlight) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
            <div className="relative rounded-3xl border-2 border-emerald-500/20 bg-white/95 p-7 shadow-2xl backdrop-blur-2xl ring-8 ring-slate-900/[0.02]">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-xl shadow-md text-white">
                    {current.cardIcon}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-700 block">
                      {current.cardBadge}
                    </span>
                    <span className="font-display text-sm font-black text-slate-900">
                      {current.tabTitle}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                  <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  VERIFIED
                </span>
              </div>

              {/* 4-Field Specification Matrix */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {current.specs.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {item.label}
                    </span>
                    <span className="mt-1 block font-mono text-xs font-black text-slate-900 truncate">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Fast Quote Button inside Card */}
              <a
                href={`${pathFor(locale, "quote")}?product=${current.productParam}`}
                className="mt-6 flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white text-xs font-extrabold shadow-md transition-all duration-200 group"
              >
                <span>{isTr ? "Bu Spesifikasyonla Teklif İste" : "Request Spec Quotation"}</span>
                <ArrowRight className="size-3.5 transition group-hover:translate-x-1 rtl:-scale-x-100" />
              </a>

              {/* Guarantee Micro-Footnote */}
              <p className="mt-3 text-center text-[10px] font-medium text-slate-400">
                {isTr ? "EUR.1 Dolaşım Belgesi & Akredite Laboratuvar Raporu Dahil" : "Includes EUR.1 Certificate & Accredited Lab Analysis"}
              </p>
            </div>
          </div>
        </div>

        {/* Floating Prev/Next Slide Arrows */}
        <div className="hidden sm:flex items-center gap-3 absolute top-1/2 -translate-y-1/2 right-6 z-20">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={labels.previous}
            className="w-12 h-12 rounded-full bg-white/95 hover:bg-white border border-slate-300 text-slate-800 grid place-items-center shadow-lg backdrop-blur-md transition hover:scale-110 active:scale-90 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={labels.next}
            className="w-12 h-12 rounded-full bg-white/95 hover:bg-white border border-slate-300 text-slate-800 grid place-items-center shadow-lg backdrop-blur-md transition hover:scale-110 active:scale-90 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 rtl:-scale-x-100" />
          </button>
        </div>
      </div>

      {/* 5-Slide Interactive Controller Bar at Bottom */}
      <div className="relative z-10 border-t border-slate-200 bg-white/95 backdrop-blur-xl py-4 shadow-sm">
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
                  className={`relative text-left p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                    idx === 4 ? "col-span-2 sm:col-span-1" : ""
                  } ${
                    isSelected
                      ? "border-2 bg-white border-emerald-600 shadow-lg ring-4 ring-emerald-500/15"
                      : "border bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                    <span className={`inline-flex items-center justify-center size-6 rounded-lg text-xs font-black ${
                      isSelected ? "bg-emerald-600 text-white" : "bg-slate-200/80 text-slate-500"
                    }`}>
                      0{idx + 1}
                    </span>
                    {isSelected && (
                      <span className="text-emerald-700 font-sans text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                        AKTİF
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-extrabold line-clamp-1 leading-snug ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                    {s.tabTitle}
                  </p>
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-b-2xl animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Infinite High-Contrast Dark Marquee Ticker */}
      <div className="relative z-10 border-t border-emerald-950/20 bg-[#092217] text-emerald-100 py-3 overflow-hidden shadow-inner" aria-hidden="true">
        <div className="marquee flex w-max gap-8 font-mono text-[11px] uppercase tracking-[.25em] text-emerald-200/80 font-bold">
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>DIRECT REFINERY EXPORTER</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>MERSIN MIP CONTAINER TERMINAL</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>EXTRA VIRGIN OLIVE OIL (≤ 27°C)</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>REFINED SUNFLOWER OIL (FFA &lt; 0.10%)</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>CODEX STAN 210 CERTIFIED</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>SGS &amp; BUREAU VERITAS PRE-SHIPMENT SURVEY</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>22,000L BULK FLEXITANK</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>PRIVATE LABEL OEM &amp; MULTILINGUAL</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>ISO 22000 &amp; HALAL &amp; KOSHER</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>DIRECT REFINERY EXPORTER</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>MERSIN MIP CONTAINER TERMINAL</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>EXTRA VIRGIN OLIVE OIL (≤ 27°C)</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>REFINED SUNFLOWER OIL (FFA &lt; 0.10%)</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>CODEX STAN 210 CERTIFIED</span>
        </div>
      </div>
    </section>
  )
}
