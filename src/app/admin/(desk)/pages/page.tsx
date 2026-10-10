import { ARTICLE_IDS, getDict } from "@/content/index"
import { redirect } from "next/navigation"
import { PUBLISHED_LOCALES, STATIC_PAGES, pathFor } from "@/lib/i18n/config"
import { requireUser } from "@/server/session"

export const metadata = { title: "Sayfalar", robots: { index: false, follow: false } }

export default async function PagesIndex() {
  if (!(await requireUser("seo"))) redirect("/admin")
  return (
    <div>
      <h1 className="font-display text-5xl">Sayfa haritası</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#5c574e]">Her dilde ayrı adres. Ana sayfa tek sayfa değildir; ürün, ticaret, rehber ve teklif kendi sayfalarındadır.</p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-start">
              <th className="py-2 pe-4">Sayfa</th>
              {PUBLISHED_LOCALES.map((locale) => (
                <th key={locale} className="py-2 pe-4">{locale}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STATIC_PAGES.map((page) => (
              <tr key={page} className="border-b border-[#e2dac8]">
                <td className="py-2 pe-4">{page}</td>
                {PUBLISHED_LOCALES.map((locale) => (
                  <td key={locale} className="py-2 pe-4">
                    <a className="underline" href={pathFor(locale, page)}>{pathFor(locale, page)}</a>
                  </td>
                ))}
              </tr>
            ))}
            {ARTICLE_IDS.map((id) => (
              <tr key={id} className="border-b border-[#e2dac8]">
                <td className="py-2 pe-4">{id}</td>
                {PUBLISHED_LOCALES.map((locale) => {
                  const href = pathFor(locale, "insights", getDict(locale).articles[id].slug)
                  return (
                    <td key={locale} className="py-2 pe-4">
                      <a className="underline" href={href}>{href}</a>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
