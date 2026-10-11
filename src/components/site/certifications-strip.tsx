import type { Locale } from "@/lib/i18n/config"
import { ShieldCheck, Award, FileCheck2, CheckCircle2, Globe } from "lucide-react"

interface Certificate {
  code: string
  title: Record<Locale, string>
  desc: Record<Locale, string>
  org: string
}

const CERTS: Certificate[] = [
  {
    code: "ISO 22000:2018",
    title: {
      tr: "Gıda Güvenliği Yönetim Sistemi",
      en: "Food Safety Management System",
      ar: "نظام إدارة سلامة الغذاء",
      ru: "Система менеджмента безопасности пищевой продукции",
      de: "Managementsystem für Lebensmittelsicherheit",
      fr: "Système de management de la sécurité des aliments",
      es: "Sistema de gestión de inocuidad de los alimentos",
      it: "Sistema di gestione della sicurezza alimentare",
    },
    desc: {
      tr: "HACCP tabanlı tehlike analizi ve kritik kontrol noktaları denetimi.",
      en: "HACCP-based hazard analysis and critical control point auditing.",
      ar: "تحليل المخاطر ونقاط التحكم الحرجة القائم على نظام HACCP.",
      ru: "Анализ рисков и критических контрольных точек на базе HACCP.",
      de: "HACCP-basierte Gefahrenanalyse und kritische Kontrollpunkte.",
      fr: "Analyse des dangers et points critiques basée sur HACCP.",
      es: "Análisis de peligros y puntos de control crítico basados en APPCC.",
      it: "Analisi dei pericoli e punti critici di controllo su base HACCP.",
    },
    org: "TÜV / IQNet Accredited",
  },
  {
    code: "ISO 9001:2015",
    title: {
      tr: "Kalite Yönetim Sistemi",
      en: "Quality Management System",
      ar: "نظام إدارة الجودة العالمي",
      ru: "Система менеджмента качества",
      de: "Qualitätsmanagementsystem",
      fr: "Système de management de la qualité",
      es: "Sistema de gestión de calidad",
      it: "Sistema di gestione della qualità",
    },
    desc: {
      tr: "Sürekli iyileştirme ve uluslararası müşteri memnuniyeti garantisi.",
      en: "Continuous process optimization and international customer satisfaction.",
      ar: "التحسين المستمر للعمليات وضمان رضا العملاء دولياً.",
      ru: "Непрерывное улучшение процессов и контроль удовлетворенности клиентов.",
      de: "Kontinuierliche Prozessoptimierung und Kundenzufriedenheit.",
      fr: "Optimisation continue des processus et satisfaction client.",
      es: "Optimización continua y garantía de satisfacción internacional.",
      it: "Ottimizzazione continua dei processi e soddisfazione del cliente.",
    },
    org: "Bureau Veritas Verified",
  },
  {
    code: "HALAL CERTIFIED",
    title: {
      tr: "Helal Gıda Uygunluk Belgesi",
      en: "Halal Food Compliance",
      ar: "شهادة الحلال المعتمدة دولياً",
      ru: "Сертификат соответствия Халяль",
      de: "Halal-Zertifizierung",
      fr: "Certification Halal",
      es: "Certificación Halal",
      it: "Certificazione Halal",
    },
    desc: {
      tr: "İslami kurallara ve helal üretim ilkelerine %100 uyumlu tesis ve ürünler.",
      en: "100% compliant with Islamic dietary laws and certified hygienic production.",
      ar: "مطابقة تامة للشريعة الإسلامية ومعايير الإنتاج الحلال والنظافة التامة.",
      ru: "100% соответствие канонам Ислама и стандартам чистоты производства.",
      de: "100% konform mit islamischen Speisevorschriften und Hygieneanforderungen.",
      fr: "100% conforme aux règles alimentaires islamiques et aux normes d'hygiène.",
      es: "100% conforme a las leyes islámicas y normas higiénicas de producción.",
      it: "Conformità al 100% con i precetti islamici e le norme igieniche.",
    },
    org: "SMIIC / World Halal Trust",
  },
  {
    code: "KOSHER CERTIFIED",
    title: {
      tr: "Kosher Uygunluk Sertifikası",
      en: "Kosher Certification",
      ar: "شهادة الكوشير المعتمدة",
      ru: "Кошерный сертификат соответствия",
      de: "Koscher-Zertifizierung",
      fr: "Certification Cacher",
      es: "Certificación Kosher",
      it: "Certificazione Kosher",
    },
    desc: {
      tr: "Yetkili hahamlık gözetiminde bitkisel saf yağ üretim onayı.",
      en: "Strictly audited pure vegetable oil processing under rabbinical supervision.",
      ar: "إنتاج زيت نباتي نقي وخالص خاضع للإشراف والتدقيق المعتمد.",
      ru: "Подтвержденная чистота растительного сырья под независимым контролем.",
      de: "Streng geprüfte reine Pflanzenölverarbeitung.",
      fr: "Huile végétale 100% pure auditée sous supervision reconnue.",
      es: "Aceite vegetal 100% puro procesado bajo estricta supervisión.",
      it: "Olio vegetale puro al 100% certificato secondo gli standard rabbinici.",
    },
    org: "Kosher Global Inspection",
  },
  {
    code: "EUR.1 & ORIGIN",
    title: {
      tr: "EUR.1 & Menşe Şahadetnamesi",
      en: "EUR.1 Movement & Origin Certificates",
      ar: "شهادة المنشأ وشهادة الحركة EUR.1",
      ru: "Сертификаты происхождения и EUR.1",
      de: "EUR.1 Warenverkehrsbescheinigung & Ursprung",
      fr: "Certificat de circulation EUR.1 & Origine",
      es: "Certificado de circulación EUR.1 y de origen",
      it: "Certificato di circolazione EUR.1 e di origine",
    },
    desc: {
      tr: "Gümrük muafiyeti ve tercihli ticaret anlaşmaları için tam resmi evrak.",
      en: "Customs duty exemptions and preferential trade agreement compliance.",
      ar: "إعفاءات جمركية وامتيازات بموجب اتفاقيات التجارة التفضيلية المتبادلة.",
      ru: "Таможенные преференции по международным торговым соглашениям.",
      de: "Zollpräferenzen und reibungslose Zollabfertigung bei Import.",
      fr: "Exonérations douanières et accords de commerce préférentiels.",
      es: "Exenciones aduaneras y convenios de comercio preferencial.",
      it: "Esenzioni doganali e accordi commerciali preferenziali.",
    },
    org: "Chamber of Commerce & Customs",
  },
  {
    code: "SGS / BV AUDIT",
    title: {
      tr: "Bağımsız Yükleme Gözetimi (SGS / BV)",
      en: "Independent Pre-Shipment Inspection",
      ar: "فحص مستقل قبل الشحن (SGS / BV)",
      ru: "Независимый сюрвейерский контроль (SGS / BV)",
      de: "Unabhängige Verladekontrolle (SGS / BV)",
      fr: "Inspection indépendante avant expédition",
      es: "Inspección independiente previa al embarque",
      it: "Ispezione indipendente pre-imbarco (SGS / BV)",
    },
    desc: {
      tr: "Mersin Limanı'nda gemi veya konteyner yüklemesi öncesi tarafsız analiz ve mühürleme.",
      en: "Neutral third-party sampling, laboratory analysis, and container sealing at port.",
      ar: "أخذ عينات محايدة وتحليل مخبري وختم الحاويات قبل الإبحار من الميناء.",
      ru: "Отбор проб, лабораторный анализ и опломбирование контейнеров в порту.",
      de: "Neutrale Probenahme, Laboranalyse und Containerverplombung im Hafen.",
      fr: "Échantillonnage neutre, analyses en laboratoire et scellés au port de départ.",
      es: "Muestreo neutral, análisis de laboratorio y precintado en puerto.",
      it: "Campionamento neutrale, analisi di laboratorio e sigillatura in porto.",
    },
    org: "SGS / Bureau Veritas On-Demand",
  },
]

export function CertificationsStrip({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-[#0a1007] py-20 text-[#f7f1e3] border-t border-gold/25">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold-light">
            <Award className="size-4 text-gold" />
            <span>
              {locale === "tr"
                ? "Küresel Güvenilirlik & Gıda Güvenliği Standartları"
                : "Global Compliance & Food Safety Accreditations"}
            </span>
          </div>

          <h2 className="font-display mt-4 text-3xl font-bold text-white md:text-5xl">
            {locale === "tr" ? (
              <>
                Uluslararası Akreditasyonlar & <span className="text-gold-gradient italic font-normal">Sertifikalar</span>
              </>
            ) : (
              <>
                International Quality <span className="text-gold-gradient italic font-normal">Accreditations & Certificates</span>
              </>
            )}
          </h2>

          <p className="mt-3 max-w-2xl text-sm text-[#f7f1e3]/75 md:text-base">
            {locale === "tr"
              ? "Asia Oil ürünleri, tohum hasadından varış limanındaki gümrük tahliyesine kadar dünyanın en sıkı gıda hijyeni, kalite ve dış ticaret akreditasyonları altında teslim edilir."
              : "Asia Oil shipments are fully certified and strictly audited under global food safety, quality assurance, and international customs accreditation frameworks."}
          </p>
        </div>

        {/* Certificate Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CERTS.map((c, i) => (
            <div
              key={i}
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition duration-500 hover:border-gold/60 hover:bg-white/[0.08] hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-wider text-gold-light">
                    {c.code}
                  </span>
                  <ShieldCheck className="size-5 text-emerald-400 opacity-70 group-hover:opacity-100 transition" />
                </div>

                <h3 className="font-display mt-3 text-xl font-bold text-white group-hover:text-gold-light transition duration-300">
                  {c.title[locale] || c.title.en}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-[#f7f1e3]/70">
                  {c.desc[locale] || c.desc.en}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-[#f7f1e3]/50">
                <span>{c.org}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="size-3" />
                  {locale === "tr" ? "Aktif & Denetimli" : "Audited & Active"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
