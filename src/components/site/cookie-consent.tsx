import type { Dict } from "@/content/types"
import { pathFor, type Locale } from "@/lib/i18n/config"

const LABELS: Record<Locale, string> = {
  tr: "Çerez tercihleri", en: "Cookie preferences", ar: "تفضيلات ملفات تعريف الارتباط",
  ru: "Настройки файлов cookie", de: "Cookie-Einstellungen", fr: "Préférences des cookies",
  es: "Preferencias de cookies", it: "Preferenze dei cookie",
}

export function CookieConsent({ locale, dict, returnTo, consent }: { locale: Locale; dict: Dict; returnTo: string; consent: string | undefined }) {
  const controls = (
    <form method="post" action="/api/consent" className="mt-3 flex flex-wrap gap-2">
      <input type="hidden" name="next" value={returnTo} />
      <button type="submit" name="choice" value="all" className="min-h-11 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">
        {dict.consent.accept}
      </button>
      <button type="submit" name="choice" value="necessary" className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">
        {dict.consent.reject}
      </button>
    </form>
  )
  const text = <p className="text-sm leading-relaxed">{dict.consent.text} <a href={pathFor(locale, "privacy")} className="underline underline-offset-2">{dict.nav.privacy}</a></p>
  if (consent === "all" || consent === "necessary") {
    return (
      <details className="mt-5 max-w-xl text-[#f7f1e3]">
        <summary className="cursor-pointer text-sm underline underline-offset-4">{LABELS[locale]}</summary>
        <div className="mt-3 rounded-xl border border-white/20 p-4">{text}{controls}</div>
      </details>
    )
  }
  return (
    <aside aria-label={LABELS[locale]} className="fixed inset-x-4 bottom-24 z-[60] rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl sm:inset-x-auto sm:start-6 sm:bottom-6 sm:w-[calc(100%_-_13rem)] sm:max-w-xl">
      {text}{controls}
    </aside>
  )
}