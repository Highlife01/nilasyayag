import { Globe2, Ship, ShieldCheck, ArrowUpRight, MapPin, Clock } from "lucide-react"
import { pathFor, type Locale } from "@/lib/i18n/config"

interface Corridor {
  id: string
  region: { tr: string; en: string }
  transit: { tr: string; en: string }
  ports: string[]
  compliance: string[]
  incoterms: string
}

const CORRIDORS: Corridor[] = [
  {
    id: "gcc-mena",
    region: {
      tr: "Orta Doğu & Körfez (GCC)",
      en: "Middle East & GCC Markets",
    },
    transit: {
      tr: "4 – 10 Gün Deniz Transit",
      en: "4 – 10 Days Ocean Transit",
    },
    ports: ["Jebel Ali (UAE)", "Jeddah & Dammam (KSA)", "Hamad (Qatar)", "Shuwaikh (Kuwait)", "Aqaba & Sohar"],
    compliance: ["GSO / SFDA Halal", "AR/EN Dual Label", "COO & Health Cert"],
    incoterms: "FOB Mersin • CIF",
  },
  {
    id: "eu-uk",
    region: {
      tr: "Avrupa Birliği (AB-27) & İngiltere",
      en: "European Union (EU-27) & UK",
    },
    transit: {
      tr: "4 – 12 Gün Deniz Transit",
      en: "4 – 12 Days Ocean Transit",
    },
    ports: ["Rotterdam & Antwerp", "Hamburg & Bremerhaven", "Felixstowe (UK)", "Marseille & Genoa", "Valencia & Piraeus"],
    compliance: ["EUR.1 Duty-Free", "EU Reg 1169/2011", "ISO 22000 & IOC"],
    incoterms: "FOB İzmir/MIP • CIF",
  },
  {
    id: "africa",
    region: {
      tr: "Kuzey, Batı ve Doğu Afrika",
      en: "North, West & East Africa",
    },
    transit: {
      tr: "3 – 18 Gün Deniz Transit",
      en: "3 – 18 Days Ocean Transit",
    },
    ports: ["Alexandria & Casablanca", "Dakar & Abidjan", "Tema & Lagos (Apapa)", "Mombasa & Dar es Salaam", "Djibouti"],
    compliance: ["SGS / BV Inspection", "ECTN / SONCAP / PVoC", "FR/AR/EN Label"],
    incoterms: "FOB Mersin • CFR/CIF",
  },
  {
    id: "cis-central-asia",
    region: {
      tr: "Orta Asya, Kafkasya & BDT (CIS)",
      en: "Central Asia, Caucasus & CIS",
    },
    transit: {
      tr: "4 – 14 Gün Multimodal",
      en: "4 – 14 Days Multimodal",
    },
    ports: ["Novorossiysk", "Poti & Batumi", "Aktau & Turkmenbashi", "Tashkent & Almaty", "Baku"],
    compliance: ["EAC / GOST Standard", "RU/Local Labeling", "Phytosanitary & COA"],
    incoterms: "FOB • CIF • DAP",
  },
  {
    id: "americas",
    region: {
      tr: "Kuzey ve Güney Amerika",
      en: "North & South America",
    },
    transit: {
      tr: "16 – 26 Gün Okyanus Transit",
      en: "16 – 26 Days Transatlantic",
    },
    ports: ["New York / Newark", "Houston & Savannah", "Montreal & Toronto", "Veracruz & Manzanillo", "Santos & Callao"],
    compliance: ["US FDA FSVP Ready", "Nutrition Facts Panel", "Kosher & Non-GMO"],
    incoterms: "FOB • CIF Port",
  },
  {
    id: "apac",
    region: {
      tr: "Asya-Pasifik & Uzak Doğu",
      en: "Asia-Pacific & Far East",
    },
    transit: {
      tr: "18 – 28 Gün Okyanus Transit",
      en: "18 – 28 Days Ocean Transit",
    },
    ports: ["Singapore & Port Klang", "Jakarta & Manila", "Busan (Korea)", "Tokyo & Yokohama", "Colombo"],
    compliance: ["Codex Stan 210", "Halal & COA Lot Test", "24,000L Flexitank"],
    incoterms: "FOB Mersin • CIF",
  },
]

export function GlobalTradeCorridors({ locale }: { locale: Locale }) {
  const isTr = locale === "tr"

  return (
    <section
      id="global-trade-corridors"
      className="relative bg-white py-24 md:py-28 border-t border-slate-200"
      aria-labelledby="corridors-heading"
    >
      <div className="mx-auto w-full px-5 sm:px-8 lg:px-14 xl:px-20 2xl:px-28">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-200 border border-emerald-500/40 shadow-sm">
              <Globe2 className="size-3.5 text-amber-400" />
              <span>
                {isTr
                  ? "KÜRESEL LOJİSTİK AĞI & DENİZYOLU KORİDORLARI"
                  : "WORLDWIDE MARITIME LOGISTICS & TRADE CORRIDORS"}
              </span>
            </div>
            <h2
              id="corridors-heading"
              className="font-display mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl"
            >
              {isTr
                ? "Mersin (MIP) ve İzmir Limanlarından 6 Kıtaya Doğrudan Sevkiyat"
                : "Direct Seaport Dispatch from Mersin (MIP) & İzmir to 6 Continents"}
            </h2>
            <p className="geo-summary mt-3 text-base text-slate-700 leading-relaxed font-medium">
              {isTr
                ? "Türkiye'nin stratejik Akdeniz ve Ege çıkış kapılarından 60+ ülkeye FOB, CFR ve CIF teslimat. Her bölge için gümrük mevzuatına tam uyumlu evrak seti (EUR.1, Menşe Şahadetnamesi, Helal, Kosher, FDA, SGS) ve konteyner/flexitank planlaması."
                : "Strategically positioned at Mersin International Port (36.7950°N, 34.6400°E) and İzmir Seaport (38.4400°N, 27.1430°E), Asia Oil executes fast FOB, CFR, and CIF container and 24,000L flexitank shipments with full destination-country regulatory compliance."}
            </p>
          </div>

          <a
            href={pathFor(locale, "trade")}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-slate-950 hover:bg-emerald-900 px-6 text-xs font-black text-white shadow-md transition"
          >
            <Ship className="size-4 text-amber-400" />
            <span>{isTr ? "İhracat Prosedürlerini İncele" : "View Global Trade & Incoterms"}</span>
            <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </a>
        </div>

        {/* 6 Global Region Cards Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CORRIDORS.map((c, idx) => (
            <article
              key={c.id}
              className="group relative flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-slate-50/60 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600 hover:bg-white hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <span className="font-mono inline-flex size-8 items-center justify-center rounded-xl bg-emerald-950 text-xs font-black text-amber-300">
                    0{idx + 1}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-900 border border-emerald-300">
                    <Clock className="size-3 text-emerald-700" />
                    <span>{isTr ? c.transit.tr : c.transit.en}</span>
                  </span>
                </div>

                <h3 className="font-display mt-5 text-xl font-black text-slate-950 group-hover:text-emerald-900 transition">
                  {isTr ? c.region.tr : c.region.en}
                </h3>

                {/* Target Discharge Ports */}
                <div className="mt-4">
                  <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <MapPin className="size-3.5 text-emerald-700" />
                    <span>{isTr ? "Başlıca Varış Limanları" : "Primary Discharge Ports"}</span>
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.ports.map((port) => (
                      <span
                        key={port}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-800"
                      >
                        {port}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compliance & Documentation Badges */}
                <div className="mt-4 pt-3 border-t border-slate-200/70">
                  <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <ShieldCheck className="size-3.5 text-amber-600" />
                    <span>{isTr ? "Bölgesel Uyumluluk & Belgeler" : "Regional Compliance & Certs"}</span>
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.compliance.map((comp) => (
                      <span
                        key={comp}
                        className="rounded-lg bg-emerald-950/90 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-200"
                      >
                        ✓ {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono font-black text-slate-600">{c.incoterms}</span>
                <a
                  href={`${pathFor(locale, "quote")}?destinationPort=${encodeURIComponent(c.ports[0])}`}
                  className="inline-flex items-center gap-1 font-black text-emerald-800 hover:text-emerald-950"
                >
                  <span>{isTr ? "Navlun Teklifi Al" : "Request CIF Quote"}</span>
                  <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
