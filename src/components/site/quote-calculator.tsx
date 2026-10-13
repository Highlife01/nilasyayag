"use client"

import { useState } from "react"
import { ArrowUpRight, Calculator, CheckCircle2, Container, Package, Ship, Sparkles } from "lucide-react"
import type { Dict } from "@/content/types"
import { commerceCopy, packagingLabel } from "@/content/commerce-ui"
import type { Locale } from "@/lib/i18n/config"
import { QUOTE_PACKAGING, quoteUrl, type QuoteProduct, type QuotePackaging, type QuoteContainer } from "@/lib/quote"

type ProductType = QuoteProduct
type PackagingType = QuotePackaging
type ContainerType = QuoteContainer

export function QuoteCalculator({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [product, setProduct] = useState<ProductType>("sunflower")
  const [packaging, setPackaging] = useState<PackagingType>("5L_TIN")
  const [containerType, setContainerType] = useState<ContainerType>("40ft")
  const [quantity, setQuantity] = useState<number>(2)
  const [destinationPort, setDestinationPort] = useState<string>("Jebel Ali, UAE")

  const form = dict.form
  const copy = commerceCopy(locale)
  const rfqUrl = quoteUrl(locale, { product, orderType: "container", quantity, containerType, packaging, destinationPort })

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
            <span>{dict.home.processKicker}</span>
          </div>
          <h3 className="font-display mt-3 text-2xl font-bold text-white sm:text-3xl">
            {copy.configure}
          </h3>
          <p className="mt-1 text-sm text-[#f7f1e3]/70">
            {copy.configLede}
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
              1. {form.product}
            </label>
            <div className="mt-2.5 grid grid-cols-3 gap-2.5">
              {[
                { id: "sunflower", label: form.sunflower, sub: dict.pages.sunflower.kicker },
                { id: "olive", label: form.olive, sub: dict.pages.olive.kicker },
                { id: "both", label: form.both, sub: form.container },
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
              2. {form.packaging}
            </label>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {QUOTE_PACKAGING.map((pkg) => (
                <button
                  key={pkg}
                  type="button"
                  onClick={() => { setPackaging(pkg); if (pkg === "FLEXITANK") setContainerType("20ft") }}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                    packaging === pkg
                      ? "border-[#d4af37] bg-[#d4af37]/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-[#f7f1e3]/70 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Package className="h-4 w-4 text-gold-light mb-1.5" />
                  <span className="text-xs font-bold leading-tight">
                    {packagingLabel(pkg, locale)}
                  </span>
                  <span className="mt-1 text-[10px] text-[#f7f1e3]/50">
                    {pkg === "FLEXITANK" ? form.bulk : copy.cartons}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Container Type & Quantity */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                3. {copy.containerSize}
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
                    disabled={packaging === "FLEXITANK" && c.id === "40ft"}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
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
                4. {form.quantity} (FCL)
              </label>
              <div className="mt-2.5 flex items-center gap-3">
                <input
                  type="range"
                  aria-label={form.quantity}
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
            <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              5. {form.destination}
            </label>
            <div className="mt-2.5 flex gap-2">
              <input
                type="text"
                aria-label={form.destination}
                maxLength={120}
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                placeholder={copy.portPh}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Config Summary Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-gold-light/20 bg-white/[0.04] p-6 backdrop-blur">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              <Sparkles className="h-4 w-4 text-gold-light" />
              <span>{copy.summary}</span>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <span className="text-[#f7f1e3]/60">{form.product}:</span>
                <span className="font-semibold text-white">
                  {product === "sunflower" ? form.sunflower : product === "olive" ? form.olive : form.both}
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <span className="text-[#f7f1e3]/60">{form.packaging}:</span>
                <span className="text-right font-medium text-white max-w-[14rem]">
                  {packagingLabel(packaging, locale)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[#f7f1e3]/60">{copy.capacity}:</span>
                <span className="font-mono text-xs text-gold-light">{copy.confirm}</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[#f7f1e3]/60">{form.quantity}:</span>
                <span className="font-bold text-white">
                  {quantity} x {containerType} FCL
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[#f7f1e3]/60">{form.destination}:</span>
                <span className="font-semibold text-emerald-400">{destinationPort || "FOB Mersin"}</span>
              </div>
            </div>

            {/* Quality assurances */}
            <div className="mt-6 rounded-xl bg-white/[0.03] p-3 text-[11px] text-[#f7f1e3]/70 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{dict.pages.quality.sections[0].h}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{copy.verification}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <a
              href={rfqUrl}
              className="btn-shine group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f0dba6] to-[#d4af37] px-6 text-sm font-bold text-slate-950 shadow-lg shadow-gold/20 transition hover:scale-[1.02]"
            >
              <span>{dict.ui.quote}</span>
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
