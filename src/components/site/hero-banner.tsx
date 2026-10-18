"use client"

import Image from "next/image"
import { useState, useEffect, useSyncExternalStore } from "react"
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Ship, Sparkles, Pause, Play } from "lucide-react"
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
      kicker: isTr ? "TAM ENTEGRE BİTKİSEL YAĞ RAFİNASYON TESİSİ • TÜRKİYE" : "HIGH-TECH EDIBLE OIL REFINING PLANT • TÜRKİYE",
      titlePart1: isTr ? "Dünya Pazarları İçin Yüksek Saflıkta " : "Pure Seed & Olive Oil Excellence for ",
      titleHighlight: isTr ? "Bitkisel Sıvı Yağ İhracatı" : "Global Markets",
      description: isTr
        ? "Yıllık 120.000 ton entegre rafinasyon kapasitesi; Mersin Uluslararası Limanı (MIP) ve İzmir Limanı çıkışlı rafine ayçiçek yağı (HS 1512.19), natürel sızma zeytinyağı (HS 1509.20) ve Private Label ihracatı."
        : "120,000 MT annual refining capacity producing crystal-clear sunflower oil (HS 1512.19), cold-pressed Aegean extra virgin olive oil (HS 1509.20), and private-label packaging for 60+ countries.",
      badges: isTr
        ? ["120.000 MT Yıllık Kapasite", "Çok Kademeli Vinterizasyon", "ISO 22000, Helal & Kosher"]
        : ["120,000 MT Annual Capacity", "Multi-Stage Winterization", "ISO 22000, Halal & Kosher"],
      specs: [
        { label: isTr ? "Yıllık Rafinasyon" : "Annual Capacity", val: "120.000 MT" },
        { label: isTr ? "Ana Yükleme Limanı" : "Main Seaports", val: "Mersin MIP & İzmir" },
        { label: isTr ? "Teslimat Terimleri" : "Incoterms 2020", val: "FOB / CIF / CFR" },
        { label: isTr ? "Akreditasyon" : "Certification", val: "ISO 22000 & Helal" },
      ],
      productParam: "sunflower",
      cardIcon: "🏭",
      cardBadge: isTr ? "ENTEGRE FABRİKA KAPASİTESİ" : "FACTORY PRODUCTION SCALE",
      tabTitle: isTr ? "ENTEGRE RAFİNASYON TESİSİ" : "HIGH-TECH REFINING PLANT",
      alt: "Asia Oil - Refined Sunflower Oil & Extra Virgin Olive Oil Global Export Collection from Anatolia to the World",
    },
    {
      id: "sunflower",
      src: "/media/stills/sunflower.webp",
      kicker: isTr ? "CODEX STAN 210 • RAFİNE AYÇİÇEK YAĞI (HS 1512.19)" : "CODEX STAN 210 • REFINED SUNFLOWER OIL (HS 1512.19)",
      titlePart1: isTr ? "İnce Rafine, Kokusuz & 232°C " : "Fine Refined, Odorless & 232°C ",
      titleHighlight: isTr ? "Yüksek Duman Noktası" : "High Smoke Point",
      description: isTr
        ? "FFA < %0.10 serbest asitlik, altın sarısı kristal berraklık ve 0.5L PET şişeden 18L tenekeye ve 24.000L flexitanka kadar eksiksiz ihracat ambalajları."
        : "Ultra-low FFA < 0.10% acidity, brilliant crystal golden clarity, packaged from 0.5L PET bottles to 18L export tins and 24,000L bulk flexitanks.",
      badges: isTr
        ? ["FFA < %0.10 Minimum Asitlik", "232°C Yüksek Duman Noktası", "Sıvı Azot ile Oksijensiz Dolum"]
        : ["FFA < 0.10% Ultra-Low Acidity", "232°C High Smoke Point", "Nitrogen Headspace Flush"],
      specs: [
        { label: isTr ? "Serbest Asitlik" : "Free Fatty Acid", val: "FFA < %0.10" },
        { label: isTr ? "Duman Noktası" : "Smoke Point", val: "232°C (Sabit)" },
        { label: isTr ? "Ambalaj Seçenekleri" : "Packaging", val: "0.5L - 18L & Flexi" },
        { label: isTr ? "Standart & GTİP" : "Standard & HS", val: "HS 1512.19 · Codex" },
      ],
      productParam: "sunflower",
      cardIcon: "🌻",
      cardBadge: isTr ? "CANLI AYÇİÇEK ANALİZ FÖYÜ" : "SUNFLOWER OIL LAB SPEC",
      tabTitle: isTr ? "RAFİNE AYÇİÇEK YAĞI" : "REFINED SUNFLOWER OIL",
      alt: "Asia Oil - Pure Refined Sunflower Oil 1L PET Bottle and 5L Export Tin Can (HS 1512.19)",
    },
    {
      id: "olive",
      src: "/media/stills/olive.webp",
      kicker: isTr ? "EGE VE AKDENİZ • SOĞUK SIKIM ZEYTİNYAĞI (HS 1509.20)" : "AEGEAN & MEDITERRANEAN • COLD-PRESSED OLIVE OIL (HS 1509.20)",
      titlePart1: isTr ? "Erken Hasat Ege Zeytinlerinden " : "Cold-Pressed Early Harvest Aegean ",
      titleHighlight: isTr ? "Soğuk Sıkım Natürel Sızma" : "Extra Virgin Olive Oil",
      description: isTr
        ? "27°C altında soğuk mekanik sıkımla üretilen, zengin polifenol (>350 mg/kg) ve düşük asit oranına sahip üstün lezzetli natürel sızma ve riviera zeytinyağları."
        : "Mechanical cold extraction below 27°C, rich polyphenols (>350 mg/kg), balanced fruitiness, and low acidity in dark Marasca glass bottles and export tins.",
      badges: isTr
        ? ["Soğuk Sıkım (≤ 27°C)", "Zengin Doğal Polifenoller", "IOC Extra Virgin Standardı"]
        : ["Cold Pressed (≤ 27°C)", "High Natural Polyphenols", "IOC Extra Virgin Standard"],
      specs: [
        { label: isTr ? "Sıkım Sıcaklığı" : "Extraction Temp", val: "≤ 27°C (Cold)" },
        { label: isTr ? "Oleik Asit Değeri" : "Acidity", val: "≤ %0.80 Extra" },
        { label: isTr ? "Polifenol Düzeyi" : "Polyphenols", val: "350+ mg/kg" },
        { label: isTr ? "Menşe & GTİP" : "Origin & HS", val: "Ege · HS 1509.20" },
      ],
      productParam: "olive",
      cardIcon: "🫒",
      cardBadge: isTr ? "EGE SIZMA ZEYTİNYAĞI" : "AEGEAN EXTRA VIRGIN SPEC",
      tabTitle: isTr ? "SOĞUK SIKIM ZEYTİNYAĞI" : "AEGEAN EXTRA VIRGIN",
      alt: "Asia Oil - Cold-Pressed Extra Virgin Olive Oil Dark Glass Bottles (HS 1509.20)",
    },
    {
      id: "privatelabel",
      src: "/media/hero/banner-signature.webp",
      kicker: isTr ? "ÖZEL MARKA • PRİVATE LABEL & MULTİ-AMBALAJ" : "PRIVATE LABEL OEM & RETAIL PACKAGING",
      titlePart1: isTr ? "Markanıza Özel Ambalaj, " : "Retail-Ready Private Label & ",
      titleHighlight: isTr ? "Etiketleme & Barkod Çözümleri" : "OEM Packaging for Your Brand",
      description: isTr
        ? "PET şişe, litografili ihracat tenekesi veya 24.000L flexitank; hedef pazarınızın (AB, Körfez, ABD, Afrika) dillerinde yasal etiket tasarımı ve barkodlu koli."
        : "PET bottles, lithographed food-grade tins, and 24,000L flexitanks with certified multilingual labeling (EU, GCC, FDA, Africa) and custom carton design.",
      badges: isTr
        ? ["Özel Marka & Çok Dilli Etiket", "0.5L - 18L & Flexitank", "EAN Barkod & İhracat Kolisi"]
        : ["Private Label & Multilingual", "0.5L to 18L & Flexitank", "EAN Barcode & Export Carton"],
      specs: [
        { label: isTr ? "Şişe & Teneke Hacmi" : "Bottle & Tin Sizes", val: "0.5L - 18L Teneke" },
        { label: isTr ? "Dökme / Flexitank" : "Bulk Flexitank", val: "21.5 - 24 MT" },
        { label: isTr ? "Çok Dilli Etiket" : "Label Compliance", val: "EU / GCC / FDA" },
        { label: isTr ? "Minimum Sipariş" : "MOQ", val: "1x20' FCL" },
      ],
      productParam: "both",
      cardIcon: "🏷️",
      cardBadge: isTr ? "ÖZEL MARKA & OEM AMBALAJ" : "PRIVATE LABEL OEM DESK",
      tabTitle: isTr ? "ÖZEL MARKA & OEM AMBALAJ" : "PRIVATE LABEL OEM",
      alt: "Asia Oil - Private Label OEM Edible Oil PET Bottles and Tin Packaging Range",
    },
    {
      id: "maritime",
      src: "/media/stills/warehouse.webp",
      kicker: isTr ? "MERSİN PORT (MIP) & İZMİR LİMANI • GLOBAL SEVKİYAT" : "MERSIN PORT (MIP) & IZMIR • GLOBAL DISPATCH",
      titlePart1: isTr ? "Akdeniz'in Ana Kapısından " : "Container Logistics from Mersin MIP to ",
      titleHighlight: isTr ? "60+ Ülkeye Konteyner İhracatı" : "60+ Countries Worldwide",
      description: isTr
        ? "FOB, CFR, CIF teslimat koşulları; EUR.1 Dolaşım Belgesi, Menşe Şahadetnamesi, Helal/Kosher ve SGS / Bureau Veritas bağımsız gözetim dosyası."
        : "FOB, CFR, CIF Incoterms 2020; complete export dossier with EUR.1, Certificate of Origin, Phytosanitary, and SGS / Bureau Veritas surveyor seal.",
      badges: isTr
        ? ["Mersin Port (MIP) Terminali", "20' / 40' FCL & Flexitank", "SGS & Bureau Veritas Denetimi"]
        : ["Mersin Port (MIP) Terminal", "20' / 40' FCL & Flexitank", "SGS & Bureau Veritas Inspection"],
      specs: [
        { label: isTr ? "Ana Sevkiyat Terminali" : "Dispatch Port", val: "Mersin (MIP) & İzmir" },
        { label: isTr ? "Konteyner Tipleri" : "Container Types", val: "20' / 40' / Flexitank" },
        { label: isTr ? "Gümrük & Dolaşım" : "Customs Certs", val: "EUR.1 & COO" },
        { label: isTr ? "Gözetim & Mühür" : "Inspection Seal", val: "SGS / Bureau Veritas" },
      ],
      productParam: "sunflower",
      cardIcon: "🚢",
      cardBadge: isTr ? "LİMAN SEVKİYAT & SÖRVEY" : "PORT LOGISTICS & SURVEY",
      tabTitle: isTr ? "GLOBAL LİMAN SEVKİYATI" : "DIRECT PORT EXPORT",
      alt: "Asia Oil - Mersin International Port Container Terminal & Export Warehouse Loading",
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
    <section
      aria-label={isTr ? "Asia Oil Ana Vitrin ve Küresel İhracat Özeti" : "Asia Oil Hero Showcase & Global Export Desk"}
      className="relative flex flex-col overflow-hidden bg-white text-slate-950 border-b-2 border-slate-300"
    >
      {/* PART 1: FULL-VISIBILITY UNCROPPED HERO BANNER STAGE + 5-SLIDE SELECTOR (Fits 100% in First Screen) */}
      <div className="relative flex flex-col bg-[#061810]">
        {/* Full-Visibility Banner Stage: 100% of the hero artwork is visible without text/white-mask obstruction or cropping */}
        <div className="relative w-full aspect-[16/9] lg:aspect-auto lg:h-[calc(100dvh-12.5rem)] lg:min-h-[420px] lg:max-h-[760px] overflow-hidden bg-[#061810] select-none">
          {slides.map((slide, idx) => {
            const shouldRenderImage = idx === active || idx === (active + 1) % count || idx === (active - 1 + count) % count
            return (
              <div
                key={slide.id}
                aria-hidden={idx !== active}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  idx === active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {shouldRenderImage ? (
                  <>
                    {/* Ambient Blurred Edge Fill for Ultrawide / Tall Viewports */}
                    <Image
                      src={slide.src}
                      alt=""
                      fill
                      aria-hidden="true"
                      quality={50}
                      sizes="100vw"
                      className="object-cover object-center scale-110 blur-2xl opacity-60 brightness-75 pointer-events-none"
                    />
                    {/* Primary Full-Visibility Uncropped Hero Image (object-contain guarantees 100% of banner is visible) */}
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={idx === 0}
                      fetchPriority={idx === 0 ? "high" : "low"}
                      loading={idx === 0 ? "eager" : "lazy"}
                      quality={88}
                      sizes="100vw"
                      className="object-contain object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
                    />
                  </>
                ) : null}
              </div>
            )
          })}

          {/* Subtle Left / Right Carousel Controls */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={labels.previous}
            className="absolute start-3 sm:start-6 top-1/2 -translate-y-1/2 z-20 size-10 sm:size-12 rounded-full bg-slate-950/75 hover:bg-emerald-700 text-white border border-white/25 shadow-xl backdrop-blur-md grid place-items-center transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="size-5 sm:size-6 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={labels.next}
            className="absolute end-3 sm:end-6 top-1/2 -translate-y-1/2 z-20 size-10 sm:size-12 rounded-full bg-slate-950/75 hover:bg-emerald-700 text-white border border-white/25 shadow-xl backdrop-blur-md grid place-items-center transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="size-5 sm:size-6 rtl:-scale-x-100" />
          </button>

          {/* Top-Left Slide Counter & Play/Pause Pill */}
          <div className="absolute top-3 start-3 sm:top-5 sm:start-6 z-20 inline-flex items-center gap-2 rounded-full bg-slate-950/75 border border-white/20 px-3 py-1.5 text-xs font-mono font-bold text-white backdrop-blur-md shadow-lg">
            <span className="text-amber-400 font-black">0{active + 1}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/80">0{count}</span>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? labels.pause : labels.play}
              className="ms-1 grid size-6 place-items-center rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
            >
              {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
            </button>
          </div>
        </div>

        {/* 5-Slide Interactive Controller Bar at Bottom of Visual Stage */}
        <div className="relative z-20 border-t border-emerald-900/60 bg-[#071d14] py-3 shadow-lg">
          <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
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
                    className={`relative text-start p-2.5 sm:p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      idx === 4 ? "col-span-2 sm:col-span-1" : ""
                    } ${
                      isSelected
                        ? "border-2 bg-white border-amber-400 text-slate-950 shadow-lg ring-2 ring-amber-400/30"
                        : "border border-emerald-800/80 bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-100"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                      <span
                        className={`inline-flex items-center justify-center size-5 rounded-md text-[11px] font-black ${
                          isSelected ? "bg-emerald-800 text-white" : "bg-white/10 text-amber-300"
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      {isSelected && (
                        <span className="text-emerald-800 font-sans text-[10px] uppercase tracking-wider font-black flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-emerald-600 animate-ping" />
                          {isTr ? "AKTİF" : "ACTIVE"}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] sm:text-xs font-black line-clamp-1 leading-snug ${
                        isSelected ? "text-slate-950" : "text-white/90"
                      }`}
                    >
                      {s.tabTitle}
                    </p>
                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 rounded-b-xl" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: EXECUTIVE B2B HEADLINE, SEO H1, LIVE SPEC TERMINAL & DIRECT RFQ BAR */}
      <div className="relative z-10 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 py-10 sm:py-12 lg:py-14 border-t border-slate-200">
        <div className="hero-grid absolute inset-0 z-0 opacity-45 pointer-events-none" />
        <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
            {/* Left Column: High-Impact SEO H1 Typography & Action Suite */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
              {/* High-Tech Glowing Status Radar Chip */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-200 text-xs font-black tracking-widest uppercase shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-white font-extrabold">{current.kicker}</span>
              </div>

              {/* Primary SEO H1 Headline */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] text-slate-950 max-w-5xl">
                <span>{current.titlePart1}</span>
                <span className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 bg-clip-text text-transparent underline decoration-emerald-500/30 decoration-4 underline-offset-8">
                  {current.titleHighlight}
                </span>
              </h1>

              {/* Authoritative B2B GEO Summary Paragraph */}
              <p className="geo-summary text-base sm:text-lg text-slate-800 leading-relaxed max-w-3xl font-semibold">
                {current.description}
              </p>

              {/* 3 High-Contrast Value-Assurance Badges */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {current.badges.map((badgeText) => (
                  <span
                    key={badgeText}
                    className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-slate-300 text-xs font-extrabold text-slate-950 shadow-xs flex items-center gap-2 transition hover:border-emerald-600"
                  >
                    <span className="grid size-4 place-items-center rounded-full bg-emerald-700 text-white text-[10px] font-black">
                      ✓
                    </span>
                    <span>{badgeText}</span>
                  </span>
                ))}
              </div>

              {/* High-Impact CTA Button Group */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href={pathFor(locale, "quote")}
                  className="btn-shine px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm tracking-wide shadow-xl shadow-emerald-950/30 ring-4 ring-emerald-600/15 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5 cursor-pointer border border-emerald-400/30"
                >
                  <span>📦</span>
                  <span>{isTr ? "Resmi Teklif İste (RFQ)" : "Request a Quote (RFQ)"}</span>
                </a>

                <a
                  href="https://wa.me/905325000000?text=Hello%20Asia%20Oil%2C%20I%20would%20like%20to%20request%20a%20B2B%20quotation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-emerald-50 border-2 border-emerald-600 text-emerald-950 font-black text-sm shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>WhatsApp: +90 532 500 00 00</span>
                </a>

                <a
                  href="#products-catalog"
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-950 font-black text-sm shadow-sm hover:border-slate-500 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isTr ? "Ürünleri İnceleyin" : "Explore Products"}</span>
                  <ArrowRight className="size-4 rtl:-scale-x-100" />
                </a>
              </div>

              {/* Quick Fast-Response High-Contrast Trust Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-800 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-900">
                  <Sparkles className="size-4 text-amber-500 fill-amber-500" />
                  <span>{isTr ? "2 Saatte Proforma Yanıtı" : "Proforma within 2 Hours"}</span>
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1.5 text-slate-900">
                  <Ship className="size-4 text-emerald-700" />
                  <span>Mersin Port (MIP) &amp; İzmir FOB/CIF</span>
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1.5 text-slate-900">
                  <ShieldCheck className="size-4 text-emerald-700" />
                  <span>{isTr ? "SGS / Bureau Veritas Gözetimi" : "SGS / Bureau Veritas Inspection"}</span>
                </span>
              </div>
            </div>

            {/* Right Column: Live Spec Terminal Card (Visible on all screens) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="relative rounded-3xl border-2 border-slate-300 bg-white p-6 sm:p-7 shadow-xl">
                {/* Card Header */}
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-2xl shadow-md text-white">
                      {current.cardIcon}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-800 block">
                        {current.cardBadge}
                      </span>
                      <span className="font-display text-base font-black text-slate-950">
                        {current.tabTitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label={labels.previous}
                      className="size-8 rounded-full bg-slate-100 hover:bg-slate-950 hover:text-white border border-slate-300 text-slate-900 grid place-items-center transition cursor-pointer"
                    >
                      <ChevronLeft className="size-4 rtl:-scale-x-100" />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label={labels.next}
                      className="size-8 rounded-full bg-slate-100 hover:bg-slate-950 hover:text-white border border-slate-300 text-slate-900 grid place-items-center transition cursor-pointer"
                    >
                      <ChevronRight className="size-4 rtl:-scale-x-100" />
                    </button>
                  </div>
                </div>

                {/* 4-Field Specification Matrix */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {current.specs.map((item) => (
                    <div key={item.label} className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-600">
                        {item.label}
                      </span>
                      <span className="mt-1 block font-mono text-xs font-black text-slate-950 truncate">
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Fast Quote Button inside Card */}
                <a
                  href={`${pathFor(locale, "quote")}?product=${current.productParam}`}
                  className="mt-5 flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-emerald-900 text-white text-xs font-black shadow-lg transition-all duration-200 group"
                >
                  <span>{isTr ? "Bu Spesifikasyonla Teklif İste" : "Request Spec Quotation"}</span>
                  <ArrowRight className="size-4 transition group-hover:translate-x-1 rtl:-scale-x-100" />
                </a>

                {/* Guarantee Micro-Footnote */}
                <p className="mt-3 text-center text-[10px] font-bold text-slate-600">
                  {isTr
                    ? "✓ EUR.1 Dolaşım Belgesi & Akredite Laboratuvar Raporu"
                    : "✓ Includes EUR.1 Certificate & Accredited Lab Analysis"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite High-Contrast Dark Marquee Ticker */}
      <div className="relative z-10 border-t-2 border-emerald-950 bg-[#06170f] text-emerald-100 py-3.5 overflow-hidden shadow-inner" aria-hidden="true">
        <div className="marquee flex w-max gap-8 font-mono text-[11px] uppercase tracking-[.25em] text-white font-extrabold">
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>DIRECT REFINERY EXPORTER</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>MERSIN MIP &amp; IZMIR SEAPORT TERMINALS</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>EXTRA VIRGIN OLIVE OIL (HS 1509.20 · ≤ 27°C)</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>REFINED SUNFLOWER OIL (HS 1512.19 · FFA &lt; 0.10%)</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>CODEX STAN 210 &amp; IOC CERTIFIED</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>SGS &amp; BUREAU VERITAS PRE-SHIPMENT SURVEY</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>24,000L BULK FLEXITANK &amp; FCL</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>PRIVATE LABEL OEM &amp; MULTILINGUAL</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>ISO 22000 &amp; HALAL &amp; KOSHER</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>DIRECT REFINERY EXPORTER</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>MERSIN MIP &amp; IZMIR SEAPORT TERMINALS</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>EXTRA VIRGIN OLIVE OIL (HS 1509.20 · ≤ 27°C)</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-emerald-400 font-black">•</span>REFINED SUNFLOWER OIL (HS 1512.19 · FFA &lt; 0.10%)</span>
          <span className="whitespace-nowrap flex items-center gap-3"><span className="text-amber-400 font-black">•</span>CODEX STAN 210 &amp; IOC CERTIFIED</span>
        </div>
      </div>
    </section>
  )
}
