"use client"

import { useState } from "react"
import { ArrowUpRight, Calculator, CheckCircle2, Container, Package, Ship, Sparkles } from "lucide-react"
import { pathFor, type Locale } from "@/lib/i18n/config"

type ProductType = "sunflower" | "olive" | "both"
type PackagingType = "1L_PET" | "5L_TIN" | "18L_TIN" | "FLEXITANK"
type ContainerType = "20ft" | "40ft"

const PACKAGING_LABELS: Record<PackagingType, { tr: string; en: string; capacity: string }> = {
  "1L_PET": { tr: "1 Litre PET Şişe (12'li Koli)", en: "1L PET Bottle (12-pack carton)", capacity: "~24.000 Şişe / FCL" },
  "5L_TIN": { tr: "5 Litre İhracat Tenekesi (4'lü Koli)", en: "5L Export Tin (4-pack carton)", capacity: "~4.400 Teneke / FCL" },
  "18L_TIN": { tr: "18 Litre Profesyonel Teneke", en: "18L Foodservice Tin", capacity: "~1.200 Teneke / FCL" },
  "FLEXITANK": { tr: "22.000 Litre Dökme Flexitank", en: "22.000L Bulk Flexitank", capacity: "~21.5 Metrik Ton / 20ft" },
}

const PORT_PRESETS = [
  { label: "Mersin (FOB)", value: "Mersin Port (MIP), Türkiye" },
  { label: "Jebel Ali (UAE)", value: "Jebel Ali, UAE" },
  { label: "Rotterdam (NL)", value: "Rotterdam, Netherlands" },
  { label: "Jeddah (KSA)", value: "Jeddah, Saudi Arabia" },
  { label: "New York (USA)", value: "New York, USA" },
  { label: "Alexandria (EG)", value: "Alexandria, Egypt" },
]

export function QuoteCalculator({ locale = "tr" }: { locale?: string }) {
  const [product, setProduct] = useState<ProductType>("sunflower")
  const [packaging, setPackaging] = useState<PackagingType>("5L_TIN")
  const [containerType, setContainerType] = useState<ContainerType>("40ft")
  const [quantity, setQuantity] = useState<number>(2)
  const [destinationPort, setDestinationPort] = useState<string>("Jebel Ali, UAE")

  const isTr = locale === "tr"
  const packInfo = PACKAGING_LABELS[packaging]
  const targetLocale = (["tr", "en", "ar", "ru", "de", "fr", "es", "it"].includes(locale) ? locale : "tr") as Locale
  const quotePath = pathFor(targetLocale, "quote")

  const rfqUrl = `${quotePath}?product=${product}&orderType=container&quantity=${quantity}&packaging=${encodeURIComponent(packaging)}&containerType=${containerType}&destinationPort=${encodeURIComponent(destinationPort)}`
  const estMetricTons = (quantity * (containerType === "40ft" ? 26.5 : 21.5)).toFixed(1)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#d4af37]/30 bg-gradient-to-b from-[#131b11] via-[#0e150d] to-[#080d07] p-6 sm:p-10 text-[#f7f1e3] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* Background ambient gold aura */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(143,166,91,0.15),transparent_70%)] blur-3xl" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-light/30 bg-gold-light/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-light">
            <Calculator className="h-3.5 w-3.5" />
            <span>{isTr ? "Hızlı B2B Hacim & İhracat Hesaplayıcı" : "Quick B2B Volume & Export Estimator"}</span>
          </div>
          <h3 className="font-display mt-3 text-2xl font-bold text-white sm:text-3xl">
            {isTr ? "Konteyner ve Ambalajınızı Seçin" : "Configure Your Container & Packaging"}
          </h3>
          <p className="mt-1 text-sm text-[#f7f1e3]/70">
            {isTr
              ? "Mersin Uluslararası Limanı (MIP) çıkışlı ihracat için anında ön konfigürasyon yapın."
              : "Pre-configure your shipment dispatched from Mersin International Port (MIP)."}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs">
          <Ship className="h-4 w-4 text-emerald-400" />
          <span className="text-white font-medium">Mersin (TRMIP) / FOB & CIF</span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Controls */}
        <div className="space-y-6">
          {/* Step 1: Product */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              1. {isTr ? "Ürün Grubu" : "Product Category"}
            </label>
            <div className="mt-2.5 grid grid-cols-3 gap-2.5">
              {[
                { id: "sunflower", label: isTr ? "Ayçiçek Yağı" : "Sunflower Oil", sub: "Codex STAN 210" },
                { id: "olive", label: isTr ? "Zeytinyağı" : "Olive Oil", sub: "IOC Extra Virgin" },
                { id: "both", label: isTr ? "Karma FCL" : "Mixed FCL", sub: isTr ? "İkili Yükleme" : "Dual Load" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProduct(item.id as ProductType)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                    product === item.id
                      ? "border-[#d4af37] bg-[#d4af37]/15 text-white shadow-sm"
                      : "border-white/10 bg-white/[0.03] text-[#f7f1e3]/70 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className="mt-0.5 text-[10px] text-[#f7f1e3]/50">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Packaging */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              2. {isTr ? "Ambalaj Formatı" : "Packaging Format"}
            </label>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {(Object.keys(PACKAGING_LABELS) as PackagingType[]).map((pkg) => (
                <button
                  key={pkg}
                  type="button"
                  onClick={() => setPackaging(pkg)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                    packaging === pkg
                      ? "border-[#d4af37] bg-[#d4af37]/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-[#f7f1e3]/70 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Package className="h-4 w-4 text-gold-light mb-1.5" />
                  <span className="text-xs font-bold leading-tight">
                    {pkg === "1L_PET" ? "1L PET" : pkg === "5L_TIN" ? "5L Teneke" : pkg === "18L_TIN" ? "18L Teneke" : "22.000L Flexi"}
                  </span>
                  <span className="mt-1 text-[10px] text-[#f7f1e3]/50">
                    {pkg === "FLEXITANK" ? "Dökme" : isTr ? "Kolili" : "Cartons"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Container Type & Quantity */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                3. {isTr ? "Konteyner Tipi" : "Container Size"}
              </label>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {[
                  { id: "20ft", label: "20ft DC (~21.5 MT)" },
                  { id: "40ft", label: "40ft HC (~26.5 MT)" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setContainerType(c.id as ContainerType)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition ${
                      containerType === c.id
                        ? "border-[#d4af37] bg-[#d4af37]/15 text-white"
                        : "border-white/10 bg-white/[0.03] text-[#f7f1e3]/70 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <Container className="h-3.5 w-3.5" />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                4. {isTr ? "Miktar (FCL Konteyner)" : "Quantity (FCL Containers)"}
              </label>
              <div className="mt-2.5 flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-[#d4af37]"
                />
                <span className="flex h-10 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 font-mono text-base font-bold text-gold-light">
                  {quantity}x
                </span>
              </div>
            </div>
          </div>

          {/* Destination Port Input */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                5. {isTr ? "Varış Limanı / Ülke" : "Destination Seaport / Country"}
              </label>
              <span className="text-[10px] text-[#f7f1e3]/50">
                {isTr ? "FOB Mersin veya CIF" : "FOB Mersin or CIF"}
              </span>
            </div>
            <div className="mt-2.5 flex gap-2">
              <input
                type="text"
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                placeholder={isTr ? "Örn: Jebel Ali, Rotterdam, New York, Jeddah..." : "e.g. Jebel Ali, Rotterdam, New York, Jeddah..."}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none"
              />
            </div>
            {/* Quick Port Presets */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-[#f7f1e3]/40 mr-0.5">{isTr ? "Hızlı Seç:" : "Quick Select:"}</span>
              {PORT_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setDestinationPort(p.value)}
                  className={`rounded-lg border px-2 py-0.5 text-[10px] font-medium transition cursor-pointer ${
                    destinationPort === p.value
                      ? "border-[#d4af37] bg-[#d4af37]/20 text-white"
                      : "border-white/10 bg-white/[0.02] text-[#f7f1e3]/60 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Config Summary Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-gold-light/20 bg-white/[0.04] p-6 backdrop-blur">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              <Sparkles className="h-4 w-4 text-gold-light" />
              <span>{isTr ? "Konfigürasyon Özeti" : "Shipment Summary"}</span>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <span className="text-[#f7f1e3]/60">{isTr ? "Ürün:" : "Product:"}</span>
                <span className="font-semibold text-white">
                  {product === "sunflower"
                    ? isTr ? "Rafine Ayçiçek Yağı" : "Refined Sunflower Oil"
                    : product === "olive"
                    ? isTr ? "Natürel Sızma Zeytinyağı" : "Extra Virgin Olive Oil"
                    : isTr ? "Karma (Ayçiçek + Zeytinyağı)" : "Mixed (Sunflower + Olive)"}
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <span className="text-[#f7f1e3]/60">{isTr ? "Format:" : "Format:"}</span>
                <span className="text-right font-medium text-white max-w-[14rem]">
                  {isTr ? packInfo.tr : packInfo.en}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[#f7f1e3]/60">{isTr ? "Tahmini Yük:" : "Capacity / FCL:"}</span>
                <span className="font-mono text-xs text-gold-light">{packInfo.capacity}</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[#f7f1e3]/60">{isTr ? "Hacim:" : "Total Volume:"}</span>
                <span className="font-bold text-white text-right">
                  {quantity} x {containerType} FCL{" "}
                  <span className="block font-mono text-[11px] font-normal text-gold-light">~{estMetricTons} MT Net</span>
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[#f7f1e3]/60">{isTr ? "Varış:" : "Destination:"}</span>
                <span className="font-semibold text-emerald-400">{destinationPort || "FOB Mersin"}</span>
              </div>
            </div>

            {/* Quality assurances */}
            <div className="mt-6 rounded-xl bg-white/[0.03] p-3 text-[11px] text-[#f7f1e3]/70 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {isTr
                    ? "SGS / Bureau Veritas Bağımsız Gözetim Raporu"
                    : "SGS / Bureau Veritas Third-Party Inspection Report"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {isTr
                    ? "Helal & ISO 22000 Sertifikalı Fabrika Üretimi"
                    : "Halal & ISO 22000 Certified Production Facility"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <a
              href={rfqUrl}
              className="btn-shine group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f0dba6] to-[#d4af37] px-6 text-sm font-bold text-slate-950 shadow-lg shadow-gold/20 transition hover:scale-[1.02]"
            >
              <span>{isTr ? "Bu Konfigürasyonla Teklif İste" : "Request Official Quotation"}</span>
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
