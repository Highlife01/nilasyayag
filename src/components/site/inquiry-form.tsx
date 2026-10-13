"use client"

import type { ReactNode } from "react"
import { WHATSAPP_URL } from "@/lib/site"
import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe2,
  PackageCheck,
  Container,
  Anchor,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  MessageCircle,
  Loader2,
  ChevronDown,
  Layers,
} from "lucide-react"
import { COUNTRIES } from "@/lib/countries"
import type { Dict } from "@/content/types"
import { submitInquiryAction, type FormState } from "@/server/inquiry-action"

export interface InitialInquiryValues {
  product?: string
  orderType?: string
  quantity?: string
  packaging?: string
  destinationPort?: string
  containerType?: string
  company?: string
}

function Submit({ label, locale }: { label: string; locale: string }) {
  const { pending } = useFormStatus()
  const isTr = locale === "tr"
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-shine group relative flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-950 px-8 text-sm font-bold text-white shadow-xl shadow-emerald-950/20 transition-all hover:scale-[1.01] hover:from-emerald-900 hover:to-black disabled:opacity-75 disabled:pointer-events-none sm:w-auto cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin text-emerald-300" />
          <span>{isTr ? "Talebiniz İletiliyor..." : "Submitting Inquiry..."}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
        </>
      )}
    </button>
  )
}

function inputContainerClass(hasError: boolean) {
  return `relative flex items-center rounded-xl border bg-white shadow-xs transition-all duration-200 ${
    hasError
      ? "border-rose-400 ring-2 ring-rose-500/20 bg-rose-50/20"
      : "border-slate-300 hover:border-slate-400 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/15"
  }`
}

function formatPrefillPackaging(code: string | undefined, locale: string): string {
  if (!code) return ""
  const isTr = locale === "tr"
  if (code === "1L_PET") return isTr ? "1 Litre PET Şişe (12'li Koli)" : "1L PET Bottle (12-pack carton)"
  if (code === "5L_TIN") return isTr ? "5 Litre İhracat Tenekesi (4'lü Koli)" : "5L Export Tin (4-pack carton)"
  if (code === "18L_TIN") return isTr ? "18 Litre Profesyonel Teneke" : "18L Foodservice Tin"
  if (code === "FLEXITANK") return isTr ? "22.000 Litre Dökme Flexitank" : "22,000L Bulk Flexitank"
  return code
}

function formatPrefillQuantity(qty: string | undefined, containerType: string | undefined, locale: string): string {
  if (!qty) return ""
  const isTr = locale === "tr"
  const cType = containerType ? ` (${containerType})` : ""
  if (/^\d+$/.test(qty)) {
    return isTr ? `${qty} x FCL Konteyner${cType}` : `${qty} x FCL Container${cType}`
  }
  return qty
}

function localizeError(error: string | undefined, locale: string, fieldName: string): string | undefined {
  if (!error) return undefined
  const isTr = locale === "tr"
  if (error === "required") {
    if (fieldName === "consent") {
      return isTr ? "Lütfen bilgilendirme onayını işaretleyiniz." : "Please accept the confirmation checkbox."
    }
    return isTr ? "Bu alan zorunludur." : "This field is required."
  }
  if (error.toLowerCase().includes("email")) {
    return isTr ? "Geçerli bir kurumsal e-posta adresi giriniz." : "Please enter a valid business email."
  }
  if (error.toLowerCase().includes("at least 10") || error.toLowerCase().includes("min")) {
    return isTr ? "Lütfen en az 10 karakterlik açıklama yazınız." : "Please enter at least 10 characters."
  }
  return error
}

export function InquiryForm({
  dict,
  locale,
  formType,
  product,
  initialValues,
  issuedAt,
}: {
  dict: Dict
  locale: string
  formType: "rfq" | "contact"
  product?: string
  initialValues?: InitialInquiryValues
  issuedAt: number
}) {
  const [state, action] = useActionState(submitInquiryAction, { ok: false } as FormState)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [messageVal, setMessageVal] = useState("")

  const form = dict.form
  const isTr = locale === "tr"

  const errorFor = (name: string) => {
    const rawError = state.ok ? undefined : state.fields?.[name]
    return localizeError(rawError, locale, name)
  }

  const defaultProduct =
    initialValues?.product || (product === "olive" || product === "both" ? product : "sunflower")
  const defaultOrderType = initialValues?.orderType || "container"
  const defaultQuantity = formatPrefillQuantity(initialValues?.quantity, initialValues?.containerType, locale)
  const defaultPackaging = formatPrefillPackaging(initialValues?.packaging, locale)
  const defaultPort = initialValues?.destinationPort || ""

  const hasPrefill = Boolean(
    initialValues?.quantity || initialValues?.packaging || initialValues?.destinationPort
  )

  const banner =
    !state.ok && state.code === "fast"
      ? form.tooFast
      : !state.ok && state.code === "stale"
        ? form.stale
        : !state.ok && state.code === "rate"
          ? form.rate
          : !state.ok && state.code === "invalid"
            ? form.invalid
            : ""

  // Dedicated B2B Confirmation Screen upon successful submission
  if (state.ok && state.done) {
    const refCode = state.id ? `RFQ-${state.id.slice(0, 8).toUpperCase()}` : "RFQ-CONFIRMED"
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-b from-white via-emerald-50/20 to-white p-8 text-center shadow-xl md:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
          <CheckCircle2 className="size-10 text-emerald-700" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100/70 px-4 py-1.5 text-xs font-mono font-bold text-emerald-900">
          <span>{isTr ? "Talep Referans No:" : "Inquiry Reference ID:"}</span>
          <span className="text-emerald-950 underline decoration-emerald-500/50">{refCode}</span>
        </div>

        <h3 className="font-display mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl">
          {isTr ? "Talebiniz Başarıyla Alındı" : "Inquiry Successfully Registered"}
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
          {form.success ||
            (isTr
              ? "Talebiniz Mersin Uluslararası Limanı (MIP) ihracat masamıza ulaştı. Satış temsilcimiz belirttiğiniz iletişim kanalları üzerinden resmi proforma fatura ve güncel SGS analiz föyü ile en kısa sürede dönüş sağlayacaktır."
              : "Your procurement inquiry has reached our Mersin Port export desk. Our team will review your specifications and contact you with a formal proforma and laboratory COA.")}
        </p>

        {/* 3 Steps Next Action Timeline */}
        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-xs">
            <span className="font-mono text-xs font-bold text-emerald-700">01. {isTr ? "İNCELEME" : "REVIEW"}</span>
            <h5 className="mt-1.5 text-sm font-bold text-slate-900">
              {isTr ? "Şartname Kontrolü" : "Specification Check"}
            </h5>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              {isTr ? "Hacim, ambalaj tipi ve hedef liman navlun analizi yapılır." : "Volume, packaging format, and port freight terms analyzed."}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-xs">
            <span className="font-mono text-xs font-bold text-emerald-700">02. {isTr ? "TEKLİF" : "PROFORMA"}</span>
            <h5 className="mt-1.5 text-sm font-bold text-slate-900">
              {isTr ? "Proforma & Analiz" : "Proforma & COA"}
            </h5>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              {isTr ? "FOB/CIF birim fiyat teklifi ve akredite SGS laboratuvar föyü iletilir." : "Formal quotation with certified SGS laboratory specs sent."}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-xs">
            <span className="font-mono text-xs font-bold text-emerald-700">03. {isTr ? "SEVKİYAT" : "DISPATCH"}</span>
            <h5 className="mt-1.5 text-sm font-bold text-slate-900">
              {isTr ? "Liman Yüklemesi" : "Maritime Dispatch"}
            </h5>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              {isTr ? "Mersin MIP limanından konteyner mühürleme ve gümrükleme." : "Container sealing and customs clearance at Mersin MIP."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="size-3.5 text-slate-500" />
            <span>{isTr ? "Yeni Bir Talep Gönder" : "Submit Another Request"}</span>
          </button>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-950/15 transition hover:bg-emerald-900 cursor-pointer"
          >
            <MessageCircle className="size-4" />
            <span>{isTr ? "WhatsApp İhracat Hattı" : "WhatsApp Export Desk"}</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="grid gap-5 md:grid-cols-2" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="formType" value={formType} />
      <input type="hidden" name="renderedAt" value={String(issuedAt)} />

      {/* Honeypot field for bot deterrence */}
      <div className="hp" aria-hidden="true" style={{ display: "none" }}>
        <label htmlFor="website">{form.honeypot}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Prefill indicator notice */}
      {hasPrefill && !banner && (
        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50/80 px-4 py-3 text-xs text-emerald-900 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-600 shrink-0" />
            <span>
              {isTr
                ? "Hacim ve ihracat hesaplayıcı seçimleriniz forma otomatik olarak aktarıldı."
                : "Your export configurations from the calculator have been pre-filled."}
            </span>
          </div>
          <span className="shrink-0 rounded-lg bg-emerald-200/70 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-950 uppercase tracking-wider">
            {isTr ? "Aktarıldı" : "Pre-filled"}
          </span>
        </div>
      )}

      {/* Error alert banner */}
      {banner ? (
        <div className="md:col-span-2 flex items-center gap-2.5 rounded-xl border border-rose-300 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-900" role="alert">
          <AlertCircle className="size-4 text-rose-600 shrink-0" />
          <span>{banner}</span>
        </div>
      ) : null}

      {/* Company Name */}
      <Field label={form.company} name="company" error={errorFor("company")} required>
        <div className={inputContainerClass(Boolean(errorFor("company")))}>
          <div className="pointer-events-none pl-3.5 text-slate-400">
            <Building2 className="size-4" />
          </div>
          <input
            id="company"
            name="company"
            required
            defaultValue={initialValues?.company || ""}
            autoComplete="organization"
            placeholder={isTr ? "Örn: Anatolia Trade Ltd." : "e.g. Anatolia Trade Ltd."}
            className="h-12 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </Field>

      {/* Contact Person */}
      <Field label={form.contactName} name="contactName" error={errorFor("contactName")} required>
        <div className={inputContainerClass(Boolean(errorFor("contactName")))}>
          <div className="pointer-events-none pl-3.5 text-slate-400">
            <User className="size-4" />
          </div>
          <input
            id="contactName"
            name="contactName"
            required
            autoComplete="name"
            placeholder={isTr ? "Ad Soyad / Ünvan" : "Full Name / Title"}
            className="h-12 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </Field>

      {/* Email */}
      <Field label={form.email} name="email" error={errorFor("email")} required>
        <div className={inputContainerClass(Boolean(errorFor("email")))}>
          <div className="pointer-events-none pl-3.5 text-slate-400">
            <Mail className="size-4" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="export@company.com"
            className="h-12 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </Field>

      {/* Phone / WhatsApp */}
      <Field label={form.phone} name="phone" error={errorFor("phone")} required>
        <div className={inputContainerClass(Boolean(errorFor("phone")))}>
          <div className="pointer-events-none pl-3.5 text-slate-400">
            <Phone className="size-4" />
          </div>
          <input
            id="phone"
            name="phone"
            required
            autoComplete="tel"
            placeholder="+90 532 000 0000"
            className="h-12 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 font-mono"
          />
        </div>
      </Field>

      {/* Country Selection */}
      <Field label={form.country} name="country" error={errorFor("country")} required>
        <div className={inputContainerClass(Boolean(errorFor("country")))}>
          <div className="pointer-events-none pl-3.5 text-slate-400">
            <Globe2 className="size-4" />
          </div>
          <select
            id="country"
            name="country"
            required
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="h-12 w-full bg-transparent pl-3 pr-9 text-sm text-slate-900 outline-none cursor-pointer appearance-none"
          >
            <option value="" disabled>
              {form.selectCountry}
            </option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="OTHER">{form.other}</option>
          </select>
          <div className="pointer-events-none absolute right-3 text-slate-400">
            <ChevronDown className="size-4" />
          </div>
        </div>
      </Field>

      {/* Conditional Other Country */}
      {selectedCountry === "OTHER" ? (
        <Field label={form.otherLabel} name="countryOther" error={errorFor("countryOther")} required>
          <div className={inputContainerClass(Boolean(errorFor("countryOther")))}>
            <div className="pointer-events-none pl-3.5 text-slate-400">
              <Globe2 className="size-4" />
            </div>
            <input
              id="countryOther"
              name="countryOther"
              required
              placeholder={form.otherLabel}
              className="h-12 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </Field>
      ) : (
        <input type="hidden" name="countryOther" value="" />
      )}

      {/* Product Category */}
      <Field label={form.product} name="product" error={errorFor("product")}>
        <div className={inputContainerClass(Boolean(errorFor("product")))}>
          <div className="pointer-events-none pl-3.5 text-slate-400">
            <Sparkles className="size-4" />
          </div>
          <select
            id="product"
            name="product"
            defaultValue={defaultProduct}
            className="h-12 w-full bg-transparent pl-3 pr-9 text-sm text-slate-900 outline-none cursor-pointer appearance-none"
          >
            <option value="sunflower">{form.sunflower}</option>
            <option value="olive">{form.olive}</option>
            <option value="both">{form.both}</option>
          </select>
          <div className="pointer-events-none absolute right-3 text-slate-400">
            <ChevronDown className="size-4" />
          </div>
        </div>
      </Field>

      {/* Order Type */}
      <Field label={form.orderType} name="orderType" error={errorFor("orderType")}>
        <div className={inputContainerClass(Boolean(errorFor("orderType")))}>
          <div className="pointer-events-none pl-3.5 text-slate-400">
            <Container className="size-4" />
          </div>
          <select
            id="orderType"
            name="orderType"
            defaultValue={defaultOrderType}
            className="h-12 w-full bg-transparent pl-3 pr-9 text-sm text-slate-900 outline-none cursor-pointer appearance-none"
          >
            <option value="container">{form.container}</option>
            <option value="bulk">{form.bulk}</option>
            <option value="distribution">{form.distribution}</option>
          </select>
          <div className="pointer-events-none absolute right-3 text-slate-400">
            <ChevronDown className="size-4" />
          </div>
        </div>
      </Field>

      {/* RFQ Specific Fields */}
      {formType === "rfq" ? (
        <>
          {/* Target Quantity */}
          <Field label={form.quantity} name="quantity" error={errorFor("quantity")} required>
            <div className={inputContainerClass(Boolean(errorFor("quantity")))}>
              <div className="pointer-events-none pl-3.5 text-slate-400">
                <Layers className="size-4" />
              </div>
              <input
                id="quantity"
                name="quantity"
                required
                defaultValue={defaultQuantity}
                placeholder={form.quantityPh}
                className="h-12 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </Field>

          {/* Packaging Format */}
          <Field label={form.packaging} name="packaging" error={errorFor("packaging")} required>
            <div className={inputContainerClass(Boolean(errorFor("packaging")))}>
              <div className="pointer-events-none pl-3.5 text-slate-400">
                <PackageCheck className="size-4" />
              </div>
              <input
                id="packaging"
                name="packaging"
                required
                defaultValue={defaultPackaging}
                placeholder={form.packagingPh}
                className="h-12 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </Field>

          {/* Destination Seaport */}
          <Field label={form.destination} name="destinationPort" error={errorFor("destinationPort")} wide>
            <div className={inputContainerClass(Boolean(errorFor("destinationPort")))}>
              <div className="pointer-events-none pl-3.5 text-slate-400">
                <Anchor className="size-4" />
              </div>
              <input
                id="destinationPort"
                name="destinationPort"
                defaultValue={defaultPort}
                placeholder={isTr ? "Örn: Jebel Ali, Rotterdam, Mersin (FOB), Alexandria..." : "e.g. Jebel Ali, Rotterdam, Mersin (FOB), Alexandria..."}
                className="h-12 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </Field>
        </>
      ) : (
        <input type="hidden" name="quantity" value="" />
      )}

      {formType === "contact" ? <input type="hidden" name="packaging" value="" /> : null}
      {formType === "contact" ? <input type="hidden" name="destinationPort" value="" /> : null}

      {/* Commercial Message & Requirements */}
      <Field
        label={form.message}
        name="message"
        error={errorFor("message")}
        required
        wide
        hint={
          messageVal.length < 10
            ? isTr
              ? `Min. 10 karakter (${messageVal.length}/10)`
              : `Min 10 chars (${messageVal.length}/10)`
            : isTr
              ? `${messageVal.length} karakter`
              : `${messageVal.length} chars`
        }
      >
        <div
          className={`relative rounded-xl border bg-white shadow-xs transition-all duration-200 ${
            errorFor("message")
              ? "border-rose-400 ring-2 ring-rose-500/20 bg-rose-50/20"
              : "border-slate-300 hover:border-slate-400 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/15"
          }`}
        >
          <div className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400">
            <FileText className="size-4" />
          </div>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            value={messageVal}
            onChange={(e) => setMessageVal(e.target.value)}
            placeholder={form.messagePh}
            className="min-h-36 w-full resize-y bg-transparent pl-10 pr-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 leading-relaxed"
          />
        </div>
      </Field>

      {/* Consent Box */}
      <div
        className={`md:col-span-2 flex items-start gap-3 rounded-2xl border p-4 transition ${
          errorFor("consent") ? "border-rose-300 bg-rose-50/40" : "border-slate-200 bg-slate-50/70"
        }`}
      >
        <input
          id="consent"
          name="consent"
          type="checkbox"
          value="yes"
          required
          className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-emerald-800 focus:ring-emerald-600 cursor-pointer accent-emerald-800"
        />
        <label htmlFor="consent" className="text-xs leading-relaxed text-slate-700 font-medium cursor-pointer select-none">
          {form.consent}
        </label>
      </div>
      {errorFor("consent") ? (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 md:col-span-2">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{errorFor("consent")}</span>
        </p>
      ) : null}

      {/* Submit Button */}
      <div className="md:col-span-2 pt-2">
        <Submit label={form.submit} locale={locale} />
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  error,
  children,
  wide,
  required,
  hint,
}: {
  label: string
  name: string
  error?: string
  children: ReactNode
  wide?: boolean
  required?: boolean
  hint?: string
}) {
  return (
    <div className={wide ? "md:col-span-2 grid gap-1.5" : "grid gap-1.5"}>
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-700">
          <span>{label}</span>
          {required ? <span className="text-emerald-700">*</span> : null}
        </label>
        {hint ? <span className="text-[11px] text-slate-400 font-medium">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p id={`${name}-error`} className="flex items-center gap-1.5 text-xs font-semibold text-rose-600" role="alert">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}

