import { requireUser } from "@/server/session"
import { redirect } from "next/navigation"
import { siteUrl } from "@/lib/site"
import { ARTICLE_IDS, getDict } from "@/content/index"
import { LOCALE_META, PUBLISHED_LOCALES, pathFor } from "@/lib/i18n/config"
import {
  Search,
  CheckCircle2,
  ExternalLink,
  Bot,
  FileCode,
  ShieldCheck,
} from "lucide-react"

export const metadata = {
  title: "SEO & GEO Merkezi · Asia Oil Control Center",
  robots: { index: false, follow: false },
}

export default async function SeoAdminPage() {
  if (!(await requireUser("seo"))) redirect("/admin")
  const base = siteUrl()

  const languages = PUBLISHED_LOCALES.map((code) => ({ code, name: LOCALE_META[code].name, path: pathFor(code, "home"), status: "Yayımlı" }))
  const english = getDict("en")
  const geoQuestions = ARTICLE_IDS.map((id) => ({
    q: english.articles[id].h1,
    slug: pathFor("en", "insights", english.articles[id].slug),
    readiness: "İçerik yayımlı",
    summary: english.articles[id].description,
  }))

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a67c3d]">
          <Search className="h-4 w-4" />
          <span>Arama Motoru & Yapay Zekâ Keşfi</span>
        </div>
        <h1 className="font-display mt-1 text-3xl font-bold text-slate-900">
          SEO & GEO Kontrol Merkezi
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Google, Bing ve LLM arama motorları (ChatGPT, Gemini, Google AI Overviews) için semantik içerik ve teknik indeksleme durumu
        </p>
      </div>

      {/* Technical Scorecard */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Hreflang & Diller</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="font-display text-3xl font-bold text-slate-900 mt-2">8 Dil + x-default</p>
          <p className="text-xs text-slate-500 mt-1">Karşılıklı hreflang etiketleri devrede</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Schema.org JSON-LD</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="font-display text-3xl font-bold text-slate-900 mt-2">Kuruluş & WebSite</p>
          <p className="text-xs text-slate-500 mt-1">Sayfalarda kuruluş ve web sitesi bilgileri</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">XML Sitemap</span>
            <FileCode className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <a
              href={`${base}/sitemap.xml`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-display text-2xl font-bold text-slate-900 hover:text-blue-600 transition"
            >
              <span>sitemap.xml</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tüm dillerin dinamik XML haritası</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Robots & Canonical</span>
            <ShieldCheck className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <a
              href={`${base}/robots.txt`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-display text-2xl font-bold text-slate-900 hover:text-purple-600 transition"
            >
              <span>robots.txt</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-xs text-slate-500 mt-1">Arama botları için tam taranabilirlik</p>
        </div>
      </div>

      {/* GEO: Generative Engine Optimization Section */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/50 via-white to-amber-50/30 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-purple-900 font-bold text-base">
          <Bot className="h-5 w-5 text-purple-600" />
          <span>Yapay Zekâ Keşif Modeli (GEO Readiness)</span>
        </div>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-3xl">
          Yayımlı rehberler alıcıların ihracat sorularını yanıtlar. Arama motorlarının bu içerikleri indeksleme veya kaynak gösterme durumu bu panel tarafından ölçülmez.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {geoQuestions.map((geo, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-slate-900">Alıcı Sorusu #{i + 1}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  {geo.readiness}
                </span>
              </div>
              <h3 className="font-display font-semibold text-base text-slate-900 mt-2">
                &ldquo;{geo.q}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {geo.summary}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-400">{geo.slug}</span>
                <a
                  href={geo.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#a67c3d] hover:underline inline-flex items-center gap-1"
                >
                  <span>Rehberi Aç</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multilingual URLs and Hreflang Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">8 Dil Hreflang ve URL İndeksleme Haritası</h2>
          <p className="text-xs text-slate-500 mt-0.5">Google uluslararası çok dilli web yönergelerine tam uyumlu mimari</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Dil Kodu</th>
                <th className="px-4 py-3">Dil Adı</th>
                <th className="px-4 py-3">Ön Ek & Kök URL</th>
                <th className="px-5 py-3 text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {languages.map((l) => (
                <tr key={l.code} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3 font-mono font-bold text-slate-900">{l.code}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{l.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{base}{l.path}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
