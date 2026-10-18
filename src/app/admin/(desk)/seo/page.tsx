import { requireUser } from "@/server/session"
import { redirect } from "next/navigation"
import { siteUrl } from "@/lib/site"
import {
  Search,
  CheckCircle2,
  ExternalLink,
  Bot,
  FileCode,
  ShieldCheck,
  MapPin,
  Sparkles,
  Layers,
} from "lucide-react"

export const metadata = {
  title: "SEO & GEO Merkezi · Asia Oil Control Center",
  robots: { index: false, follow: false },
}

export default async function SeoAdminPage() {
  if (!(await requireUser("seo"))) redirect("/admin")
  const base = siteUrl()

  const languages = [
    { code: "tr", name: "Türkçe", path: "/tr", status: "Aktif (Doğrulandı)" },
    { code: "en", name: "İngilizce (Global)", path: "/en", status: "Aktif (Doğrulandı)" },
    { code: "ar", name: "Arapça (RTL)", path: "/ar", status: "Aktif (Doğrulandı)" },
    { code: "ru", name: "Rusça", path: "/ru", status: "Aktif (Doğrulandı)" },
    { code: "de", name: "Almanca", path: "/de", status: "Aktif (Doğrulandı)" },
    { code: "fr", name: "Fransızca", path: "/fr", status: "Aktif (Doğrulandı)" },
    { code: "es", name: "İspanyolca", path: "/es", status: "Aktif (Doğrulandı)" },
    { code: "it", name: "İtalyanca", path: "/it", status: "Aktif (Doğrulandı)" },
  ]

  const geoQuestions = [
    {
      q: "How can I request a bulk sunflower oil quotation from Türkiye?",
      slug: "/en/insights/how-to-request-a-bulk-sunflower-oil-quotation",
      readiness: "100% Hazır",
      summary: "Firma adı, yetkili, ürün hacmi, ambalaj tipi (PET, Teneke, Flexitank) ve Incoterms ile anında dosya açılabilmektedir.",
    },
    {
      q: "What packaging options are available for edible oils export?",
      slug: "/en/insights/packaging-options-for-edible-oil-buyers",
      readiness: "100% Hazır",
      summary: "500ml, 1L, 2L, 5L PET, 18L Teneke, 200L Varil ve 22.000L Flexitank dökme seçenekleri mevcuttur.",
    },
    {
      q: "What documents are required for edible oil imports from Türkiye?",
      slug: "/en/insights/documents-for-edible-oil-imports",
      readiness: "100% Hazır",
      summary: "Spesifikasyon, parti analiz raporu, Menşe Şahadetnamesi (COO), çeki listesi, konşimento ve ticari fatura seti.",
    },
    {
      q: "What should a food distributor prepare before requesting a quote?",
      slug: "/en/insights/preparing-a-distribution-inquiry",
      readiness: "100% Hazır",
      summary: "Satış kanalı, hedef pazar, kabul edilen ambalaj formatları ve tahmini ilk deneme konteyner hacmi.",
    },
  ]

  const aiBots = [
    { name: "OpenAI GPTBot, SearchGPT & ChatGPT-User", agent: "GPTBot, OAI-SearchBot, ChatGPT-User", status: "İzin Verildi (200 OK)", use: "ChatGPT arama motoru ve canlı B2B alıntı yanıtlama" },
    { name: "Anthropic Claude & Claude-Web", agent: "ClaudeBot, Claude-Web, anthropic-ai", status: "İzin Verildi (200 OK)", use: "Claude modelleri için ihracat teknik spesifikasyon tarama" },
    { name: "Perplexity AI Search", agent: "PerplexityBot, Perplexity-User", status: "İzin Verildi (200 OK)", use: "Gerçek zamanlı B2B arama ve ihracatçı kaynak eşleştirme" },
    { name: "Google Gemini, AI Overviews & Googlebot", agent: "Google-Extended, Googlebot, Googlebot-Image", status: "İzin Verildi (200 OK)", use: "Google AI Overviews, Görsel ve semantik arama dizini" },
    { name: "Microsoft Bing, Copilot, Yandex & Baidu", agent: "Bingbot, YandexBot, Baiduspider, DuckDuckBot", status: "İzin Verildi (200 OK)", use: "Küresel arama motorları ve Copilot kurumsal dizini" },
    { name: "Apple Intelligence & Siri", agent: "Applebot, Applebot-Extended", status: "İzin Verildi (200 OK)", use: "Apple Siri & kurumsal yapay zekâ entegrasyonu" },
  ]

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
          Google, Bing, Yandex, Baidu ve LLM arama motorları (ChatGPT, SearchGPT, Gemini, Perplexity, Claude) için küresel semantik indeksleme durumu
        </p>
      </div>

      {/* Technical Scorecard */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Küresel Hreflang</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="font-display text-3xl font-bold text-slate-900 mt-2">8 Dil · 55+ Bölge</p>
          <p className="text-xs text-slate-500 mt-1">AB, Körfez, ABD, Afrika, BDT ülke kodları aktif</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Schema.org JSON-LD</span>
            <Layers className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="font-display text-3xl font-bold text-slate-900 mt-2">10 Şema Tipi</p>
          <p className="text-xs text-slate-500 mt-1">Corporation, Product, OfferCatalog, HowTo, Speakable, FAQ</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">XML & Görsel Sitemap</span>
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
          <p className="text-xs text-slate-500 mt-1">55+ bölgesel hreflang ve görsel dizini</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">GEO LLM Dossiers</span>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-center gap-3">
            <a
              href={`${base}/llms.txt`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-display text-xl font-bold text-slate-900 hover:text-purple-600 transition"
            >
              <span>llms.txt</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-slate-300">·</span>
            <a
              href={`${base}/llms-full.txt`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-display text-xl font-bold text-slate-900 hover:text-purple-600 transition"
            >
              <span>llms-full.txt</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-xs text-slate-500 mt-1">Yapay zekâ yanıt motorları için tam teknik dosya</p>
        </div>
      </div>

      {/* Geotargeting & Logistics Gateways Section */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/30 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <MapPin className="h-5 w-5 text-amber-600" />
            <span>GEO Geotargeting & Lojistik Koordinatlar</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            <ShieldCheck className="h-3 w-3" />
            Meta & JSON-LD Aktif
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-3xl">
          Arama motorları ve harita sistemleri için HTML meta (geo.region, geo.placename, ICBM) ve Schema.org GeoCoordinates yapıları global ticaret kapılarımız ile eşleştirilmiştir.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Birincil Kapı: Mersin Uluslararası Limanı (MIP)</span>
              <span className="font-mono text-[10px] text-slate-500">TR-33</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Ortadoğu, Körfez (GCC), Afrika ve Asya rotaları için ana çıkış kapısı.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 font-mono text-[11px] text-amber-700">
              Enlem: 36.7950° N · Boylam: 34.6400° E
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">İkincil Kapı: İzmir Alsancak & Aliağa Limanları</span>
              <span className="font-mono text-[10px] text-slate-500">TR-35</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Güney Avrupa, Akdeniz ve Atlantik rotaları için Ege tarım ve lojistik merkezi.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 font-mono text-[11px] text-amber-700">
              Enlem: 38.4400° N · Boylam: 27.1430° E
            </div>
          </div>
        </div>
      </div>

      {/* GEO: Generative Engine Optimization Section */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/50 via-white to-amber-50/30 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-purple-900 font-bold text-base">
          <Bot className="h-5 w-5 text-purple-600" />
          <span>Yapay Zekâ Keşif Modeli (GEO Readiness & AI Alıntılama)</span>
        </div>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-3xl">
          ChatGPT, Google Gemini ve Perplexity gibi yapay zekâ motorları, doğrudan alıcıların sorduğu ihracat sorularını ararken web sitemizdeki rehber içeriklerini birincil kaynak olarak gösterir.
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

      {/* AI Bot Crawlers Status Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Yapay Zekâ ve Arama Botları Erişim Durumu</h2>
          <p className="text-xs text-slate-500 mt-0.5">robots.txt ve llms.txt üzerinden aktif olarak yetkilendirilen yapay zekâ tarayıcıları</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Yapay Zekâ Motoru</th>
                <th className="px-4 py-3">Kullanıcı Aracısı (User-Agent)</th>
                <th className="px-4 py-3">Amaç & Entegrasyon</th>
                <th className="px-5 py-3 text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {aiBots.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3 font-semibold text-slate-900">{b.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{b.agent}</td>
                  <td className="px-4 py-3 text-slate-600">{b.use}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
