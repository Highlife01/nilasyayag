"use client"

import type { ReactNode } from "react"
import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { COUNTRIES } from "@/lib/countries"
import type { Dict } from "@/content/types"
import { submitInquiryAction, type FormState } from "@/server/inquiry-action"

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="btn-shine h-13 w-full rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 px-8 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:from-emerald-900 hover:to-black sm:w-auto cursor-pointer"
    >
      {pending ? "…" : label}
    </Button>
  )
}

const fieldClass = "h-12! w-full rounded-xl! border border-slate-300! bg-white! px-4! text-sm text-slate-900 shadow-none transition focus-visible:border-emerald-600! focus-visible:ring-2! focus-visible:ring-emerald-600/20!"
const selectClass = "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 cursor-pointer"

export function InquiryForm({
  dict,
  locale,
  formType,
  product,
  issuedAt,
}: {
  dict: Dict
  locale: string
  formType: "rfq" | "contact"
  product?: string
  issuedAt: number
}) {
  const [state, action] = useActionState(submitInquiryAction, { ok: false } as FormState)
  const [selectedCountry, setSelectedCountry] = useState("")
  const form = dict.form
  const errorFor = (name: string) => (state.ok ? undefined : state.fields?.[name])
  const banner =
    state.ok && state.done
      ? form.success
      : !state.ok && state.code === "fast"
        ? form.tooFast
        : !state.ok && state.code === "stale"
          ? form.stale
          : !state.ok && state.code === "rate"
            ? form.rate
            : !state.ok && state.code === "invalid"
              ? form.invalid
              : ""

  return (
    <form action={action} className="grid gap-5 md:grid-cols-2" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="formType" value={formType} />
      <input type="hidden" name="renderedAt" value={String(issuedAt)} />
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">{form.honeypot}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {banner ? (
        <p className={`md:col-span-2 rounded-xl border px-5 py-4 text-sm font-medium ${state.ok ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-rose-300 bg-rose-50 text-rose-900"}`} role={state.ok ? "status" : "alert"}>
          {banner}
        </p>
      ) : null}
      <Field label={form.company} name="company" error={errorFor("company")}>
        <Input id="company" name="company" required className={fieldClass} autoComplete="organization" />
      </Field>
      <Field label={form.contactName} name="contactName" error={errorFor("contactName")}>
        <Input id="contactName" name="contactName" required className={fieldClass} autoComplete="name" />
      </Field>
      <Field label={form.email} name="email" error={errorFor("email")}>
        <Input id="email" name="email" type="email" required className={fieldClass} autoComplete="email" />
      </Field>
      <Field label={form.phone} name="phone" error={errorFor("phone")}>
        <Input id="phone" name="phone" required className={fieldClass} autoComplete="tel" />
      </Field>
      <Field label={form.country} name="country" error={errorFor("country")}>
        <select
          id="country"
          name="country"
          required
          className={selectClass}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="" disabled>
            {form.selectCountry}
          </option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
          <option value="OTHER">{form.other}</option>
        </select>
      </Field>
      {selectedCountry === "OTHER" ? (
        <Field label={form.otherLabel} name="countryOther" error={errorFor("countryOther")}>
          <Input id="countryOther" name="countryOther" required className={fieldClass} placeholder={form.otherLabel} />
        </Field>
      ) : (
        <input type="hidden" name="countryOther" value="" />
      )}
      <Field label={form.product} name="product" error={errorFor("product")}>
        <select id="product" name="product" className={selectClass} defaultValue={product === "olive" || product === "both" ? product : "sunflower"}>
          <option value="sunflower">{form.sunflower}</option>
          <option value="olive">{form.olive}</option>
          <option value="both">{form.both}</option>
        </select>
      </Field>
      <Field label={form.orderType} name="orderType" error={errorFor("orderType")}>
        <select id="orderType" name="orderType" className={selectClass} defaultValue="container">
          <option value="container">{form.container}</option>
          <option value="bulk">{form.bulk}</option>
          <option value="distribution">{form.distribution}</option>
        </select>
      </Field>
      {formType === "rfq" ? (
        <>
          <Field label={form.quantity} name="quantity" error={errorFor("quantity")}>
            <Input id="quantity" name="quantity" required className={fieldClass} placeholder={form.quantityPh} />
          </Field>
          <Field label={form.packaging} name="packaging" error={errorFor("packaging")}>
            <Input id="packaging" name="packaging" required className={fieldClass} placeholder={form.packagingPh} />
          </Field>
          <Field label={form.destination} name="destinationPort" error={errorFor("destinationPort")} wide>
            <Input id="destinationPort" name="destinationPort" className={fieldClass} />
          </Field>
        </>
      ) : (
        <input type="hidden" name="quantity" value="" />
      )}
      {formType === "contact" ? <input type="hidden" name="packaging" value="" /> : null}
      {formType === "contact" ? <input type="hidden" name="destinationPort" value="" /> : null}
      <Field label={form.message} name="message" error={errorFor("message")} wide>
        <Textarea id="message" name="message" required minLength={10} className="min-h-36 w-full rounded-xl! border border-slate-300! bg-white! px-4! py-3! text-sm text-slate-900 shadow-none transition focus-visible:border-emerald-600! focus-visible:ring-2! focus-visible:ring-emerald-600/20!" placeholder={form.messagePh} />
      </Field>
      <div className="md:col-span-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <input id="consent" name="consent" type="checkbox" value="yes" required className="mt-1 size-4 shrink-0 rounded border-slate-300 text-emerald-800 focus:ring-emerald-600 cursor-pointer" />
        <Label htmlFor="consent" className="text-xs leading-relaxed text-slate-700 font-medium cursor-pointer">
          {form.consent}
        </Label>
      </div>
      {errorFor("consent") ? <p className="text-xs font-semibold text-rose-600 md:col-span-2">{errorFor("consent")}</p> : null}
      <div className="md:col-span-2 pt-2">
        <Submit label={form.submit} />
      </div>
    </form>
  )
}

function Field({ label, name, error, children, wide }: { label: string; name: string; error?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "md:col-span-2 grid gap-1.5" : "grid gap-1.5"}>
      <Label htmlFor={name} className="text-xs font-bold uppercase tracking-wider text-slate-700">{label}</Label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-xs font-semibold text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
