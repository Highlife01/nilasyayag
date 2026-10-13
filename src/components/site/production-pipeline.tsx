"use client"

import { useState } from "react"
import { pathFor, type Locale } from "@/lib/i18n/config"
import { Sprout, Factory, Flame, Sparkles, Ship, CheckCircle2, ArrowRight } from "lucide-react"
import type { Dict } from "@/content/types"
import { commerceCopy } from "@/content/commerce-ui"

interface Stage {
  number: string
  title: Record<Locale, string>
  tagline: Record<Locale, string>
  description: Record<Locale, string>
  points: Record<Locale, string[]>
  metric: { value: string; label: Record<Locale, string> }
  icon: typeof Sprout
}

const STAGES: Stage[] = [
  {
    number: "01",
    title: {
      tr: "Sözleşmeli Tarım & Tohum Seçimi",
      en: "Contract Farming & Seed Selection",
      ar: "الزراعة التعاقدية واختيار البذور",
      ru: "Контрактное фермерство и отбор семян",
      de: "Vertragsanbau & Saatauswahl",
      fr: "Agriculture sous contrat & Sélection des graines",
      es: "Agricultura por contrato y selección de semillas",
      it: "Coltivazione a contratto e selezione dei semi",
    },
    tagline: {
      tr: "Bereketli Anadolu & Trakya Toprakları",
      en: "Fertile Anatolian & Thracian Soils",
      ar: "أراضي الأناضول وتراقيا الخصبة",
      ru: "Плодородные почвы Анатолии и Фракии",
      de: "Fruchtbare Böden Anatoliens & Thrakiens",
      fr: "Terres fertiles d'Anatolie et de Thrace",
      es: "Tierras fértiles de Anatolia y Tracia",
      it: "Terre fertili di Anatolia e Tracia",
    },
    description: {
      tr: "Yüksek oleik asit ve zengin yağ randımanına sahip seçkin ayçiçek tohumları ve Ege'nin kadim zeytinleri doğrudan üreticiden izlenebilir sözleşmeli tarım modeliyle kabul edilir.",
      en: "Selected sunflower seeds with high oleic content and Aegean olives are sourced directly from partner farmers under a strictly traceable contract agriculture model.",
      ar: "يتم الحصول على بذور عباد الشمس الممتازة ذات المحتوى العالي من حمض الأوليك وزيتون بحر إيجة مباشرة من المزارعين وفق نموذج زراعي موثوق وقابل للتتبع.",
      ru: "Отборные семена подсолнечника с высоким содержанием олеиновой кислоты и оливки Эгейского региона закупаются у проверенных фермеров по системе строгой прослеживаемости.",
      de: "Ausgewählte Sonnenblumenkerne mit hohem Ölsäuregehalt und Ägäis-Oliven werden von Vertragsbauern nach zertifizierten Standards bezogen.",
      fr: "Des graines de tournesol sélectionnées à haute teneur oléique et des olives égéennes sont achetées directement auprès de producteurs partenaires certifiés.",
      es: "Semillas de girasol de alto contenido oleico y aceitunas del Egeo seleccionadas bajo un modelo de agricultura por contrato totalmente trazable.",
      it: "Semi di girasole selezionati ad alto contenuto oleico e olive dell'Egeo raccolti secondo un rigoroso modello di tracciabilità.",
    },
    points: {
      tr: ["%100 Yerli ve Taranmış Tohum", "Sıfır Nem ve Yabancı Madde Kontrolü", "Tam Parti İzlenebilirliği"],
      en: ["100% Traceable Seeds", "Strict Moisture & Purity Check", "Batch Traceability"],
      ar: ["بذور خاضعة للرقابة 100%", "فحص دقيق للرطوبة والنقاوة", "تتبع شامل للدفعة"],
      ru: ["100% контроль сырья", "Проверка влажности и чистоты", "Сквозная прослеживаемость партий"],
      de: ["100% Rückverfolgbarkeit", "Strenge Feuchtigkeits- & Reinheitskontrolle", "Chargen-Tracking"],
      fr: ["Graines 100% contrôlées", "Contrôle rigoureux humidité & pureté", "Traçabilité des lots"],
      es: ["100% trazabilidad de semillas", "Control de humedad y pureza", "Seguimiento por lote"],
      it: ["Semi controllati al 100%", "Controllo umidità e purezza", "Tracciabilità di lotto"],
    },
    metric: {
      value: "%100",
      label: {
        tr: "Tohum İzlenebilirliği",
        en: "Traceable Origin",
        ar: "تتبع المنشأ",
        ru: "Прослеживаемость",
        de: "Rückverfolgbarkeit",
        fr: "Origine tracée",
        es: "Origen trazable",
        it: "Tracciabilità origine",
      },
    },
    icon: Sprout,
  },
  {
    number: "02",
    title: {
      tr: "Kırma & Ham Yağ Ekstraksiyonu",
      en: "Crushing & Oil Extraction",
      ar: "الجرش واستخلاص الزيت الخام",
      ru: "Дробление и экстракция сырого масла",
      de: "Zerkleinerung & Rohextraktion",
      fr: "Broyage & Extraction de l'huile brute",
      es: "Molienda y extracción de aceite crudo",
      it: "Frangitura ed estrazione olio grezzo",
    },
    tagline: {
      tr: "Mekanik Presleme & Düşük Sıcaklık Koruması",
      en: "Mechanical Pressing & Low Heat Extraction",
      ar: "عصر ميكانيكي وحماية درجات الحرارة",
      ru: "Механический отжим при низких температурах",
      de: "Mechanische Pressung & Kaltverfahren",
      fr: "Pression mécanique à basse température",
      es: "Prensado mecánico a baja temperatura",
      it: "Spremitura meccanica a bassa temperatura",
    },
    description: {
      tr: "Tohumlar modern kırıcılarda besin değerini, doğal E vitaminini ve antioksidan yapısını kaybetmeden düşük sıcaklık kontrollü presleme ünitelerinden geçirilir.",
      en: "Seeds are processed in cutting-edge crushing units under controlled temperatures to preserve natural Vitamin E, antioxidants, and optimal nutrient profiles.",
      ar: "تتم معالجة البذور في وحدات جرش متطورة تحت درجات حرارة محكومة للحفاظ على فيتامين E الطبيعي ومضادات الأكسدة والعناصر الغذائية الحيوية.",
      ru: "Семена бережно перерабатываются при контролируемой температуре для максимального сохранения витамина Е, антиоксидантов и полезных микроэлементов.",
      de: "Die Rohstoffe werden in modernen Pressanlagen temperaturkontrolliert verarbeitet, um natürliches Vitamin E und Antioxidantien zu schonen.",
      fr: "Les graines sont pressées à basse température dans des unités modernes afin de préserver la vitamine E naturelle et les antioxydants.",
      es: "Las semillas se procesan en unidades modernas a temperatura controlada para conservar la vitamina E natural y los antioxidantes.",
      it: "I semi vengono lavorati in impianti moderni a temperatura controllata per preservare la vitamina E naturale e gli antiossidanti.",
    },
    points: {
      tr: ["Düşük Isı Koruması", "Doğal E Vitamini & Tokoferol", "Yüksek Ham Yağ Verimi"],
      en: ["Low-Temperature Protection", "Preserved Vitamin E & Tocopherols", "High Purity Crude Oil"],
      ar: ["حماية حرارية منخفضة", "حفظ فيتامين E والتوكوفيرول", "زيت خام نقي وعالي الجودة"],
      ru: ["Щадящий температурный режим", "Сохранность витамина E", "Высокая чистота сырого масла"],
      de: ["Schonende Niedrigtemperatur", "Erhalt von Vitamin E & Tocopherolen", "Hohe Reinheit des Rohöls"],
      fr: ["Basse température préservée", "Maintien de la vitamine E", "Pureté optimale"],
      es: ["Baja temperatura controlada", "Conservación de vitamina E", "Aceite crudo de alta pureza"],
      it: ["Bassa temperatura", "Conservazione vitamina E", "Elevata purezza dell'olio grezzo"],
    },
    metric: {
      value: "E Vit.",
      label: {
        tr: "Doğal Tokoferol Koruması",
        en: "Natural Tocopherols",
        ar: "مضادات أكسدة طبيعية",
        ru: "Природные токоферолы",
        de: "Natürliche Tocopherole",
        fr: "Tocophérols naturels",
        es: "Tocoferoles naturales",
        it: "Tocoferoli naturali",
      },
    },
    icon: Factory,
  },
  {
    number: "03",
    title: {
      tr: "İleri Çok Kademeli Rafinasyon",
      en: "Advanced Multi-Stage Refining",
      ar: "التكرير المتطور متعدد المراحل",
      ru: "Многоступенчатая передовая рафинация",
      de: "Fortschrittliche Mehrstufen-Raffination",
      fr: "Raffinage avancé en plusieurs étapes",
      es: "Refinación avanzada multietapa",
      it: "Raffinazione avanzata multistadio",
    },
    tagline: {
      tr: "Asitsizleştirme, Ağartma, Vinterizasyon & Koku Giderme",
      en: "Deacidification, Bleaching, Winterization & Deodorization",
      ar: "إزالة الحموضة، التبييض، التشتية وإزالة الروائح",
      ru: "Нейтрализация, отбеливание, винтеризация и дезодорация",
      de: "Entsäuerung, Bleichung, Winterisierung & Dämpfung",
      fr: "Désacidification, Décoloration, Winterisation & Désodorisation",
      es: "Neutralización, blanqueo, winterización y desodorización",
      it: "Deacidificazione, sbiancamento, winterizzazione e deodorizzazione",
    },
    description: {
      tr: "Avrupa gıda normlarına uygun paslanmaz çelik kolonlarda vakum altında serbest yağ asitleri (FFA < %0.10) ayrıştırılır, soğukta kristalleşen mumlar (waxes) süzülür ve 232°C yüksek duman noktasına ulaşılır.",
      en: "Free fatty acids (FFA < 0.10%) and waxes are removed under high vacuum in stainless steel columns, yielding crystal-clear golden oil with a high smoke point exceeding 232°C.",
      ar: "تتم إزالة الأحماض الدهنية الحرة (FFA < 0.10%) والشموع تحت تفريغ هوائي دقيق في أعمدة استانلس ستيل، مما ينتج عنه زيت نقي ذهبي بنقطة احتراق تفوق 232°م.",
      ru: "Под глубоким вакуумом удаляются свободные жирные кислоты (FFA < 0.10%) и воски, обеспечивая идеальную прозрачность и высокую температуру дымления 232°C.",
      de: "Unter Vakuum werden freie Fettsäuren (FFA < 0,10%) und Wachse entfernt, was zu kristallklarem Speiseöl mit einem Rauchpunkt von über 232°C führt.",
      fr: "Les acides gras libres (FFA < 0,10%) et les cires sont éliminés sous vide poussé, garantissant une huile limpide et un point de fumée supérieur à 232°C.",
      es: "Los ácidos grasos libres (FFA < 0.10%) y las ceras se eliminan al vacío, logrando un aceite dorado y brillante con un punto de humo superior a 232°C.",
      it: "Gli acidi grassi liberi (FFA < 0,10%) e le cere vengono rimossi sotto vuoto, ottenendo un olio cristallino con punto di fumo superiore a 232°C.",
    },
    points: {
      tr: ["FFA < %0.10 (Minimum Asitlik)", "232°C Yüksek Duman Noktası", "Vinterize Edilmiş Kristal Berraklık"],
      en: ["FFA < 0.10% Ultra-Low Acidity", "232°C High Smoke Point", "Winterized Crystal Clarity"],
      ar: ["حموضة منخفضة جداً FFA < 0.10%", "نقطة دخان مرتفعة 232°م", "شفافية بلورية مشتّاة"],
      ru: ["Кислотность FFA < 0.10%", "Точка дымления 232°C", "Кристальная прозрачность"],
      de: ["FFA < 0,10% Ultra-niedrige Säure", "232°C Hoher Rauchpunkt", "Winterisierte Reinheit"],
      fr: ["FFA < 0,10% très faible acidité", "Point de fumée élevé 232°C", "Clarté cristalline"],
      es: ["FFA < 0.10% muy baja acidez", "Punto de humo alto 232°C", "Transparencia winterizada"],
      it: ["FFA < 0,10% bassissima acidità", "Punto di fumo 232°C", "Brillantezza cristallina"],
    },
    metric: {
      value: "<0.10%",
      label: {
        tr: "Serbest Asitlik (FFA)",
        en: "Free Fatty Acids",
        ar: "نسبة الحموضة الحرة",
        ru: "Свободные жирные кислоты",
        de: "Freie Fettsäuren",
        fr: "Acides gras libres",
        es: "Ácidos grasos libres",
        it: "Acidi grassi liberi",
      },
    },
    icon: Flame,
  },
  {
    number: "04",
    title: {
      tr: "Otomatik Steril Dolum & Ambalajlama",
      en: "Automated Sterile Bottling & Packaging",
      ar: "التعبئة والتغليف الآلي المعقم",
      ru: "Автоматизированный розлив и упаковка",
      de: "Automatische sterile Abfüllung & Verpackung",
      fr: "Mise en bouteille stérile & Conditionnement",
      es: "Embotellado y envasado estéril automatizado",
      it: "Imbottigliamento e confezionamento sterile",
    },
    tagline: {
      tr: "PET, Laklı İhracat Tenekesi & Sıvı Azot Dozajlama",
      en: "PET, Food-Grade Tins & Liquid Nitrogen Dosing",
      ar: "عبوات PET وصفائح تصدير مع حقن النيتروجين",
      ru: "ПЭТ, экспортная жесть и азотная подушка",
      de: "PET, Lebensmitteldosen & Stickstoffdosierung",
      fr: "Bouteilles PET, bidons fer-blanc & azote",
      es: "PET, latas barnizadas y dosificación de nitrógeno",
      it: "PET, lattine laccate e dosaggio di azoto",
    },
    description: {
      tr: "El değmeden çalışan yüksek hızlı dolum hatlarımızda her ambalaja sıvı azot damlatılarak tepe boşluğundaki oksijen atılır. Bu sayede yağ 24 ay boyunca ilk günkü tazeliğini korur.",
      en: "Fully automated high-speed filling lines inject food-grade liquid nitrogen into headspaces, eliminating oxygen and guaranteeing 24 months of freshness.",
      ar: "يتم حقن النيتروجين السائل الصالح للأغذية آلياً داخل العبوات للتخلص من الأكسجين، مما يضمن بقاء الزيت طازجاً لمدة 24 شهراً.",
      ru: "Автоматические высокоскоростные линии дозируют жидкий азот перед укупоркой, удаляя кислород и обеспечивая свежесть продукта до 24 месяцев.",
      de: "Automatisierte Hochgeschwindigkeitslinien dosieren flüssigen Stickstoff in die Flaschenhälse, um Sauerstoff zu verdrängen und 24 Monate Frische zu sichern.",
      fr: "Des lignes d'embouteillage robotisées injectent de l'azote liquide pour éliminer l'oxygène, assurant une fraîcheur préservée pendant 24 mois.",
      es: "Líneas automatizadas de alta velocidad dosifican nitrógeno líquido para eliminar el oxígeno, garantizando 24 meses de óptima frescura.",
      it: "Linee automatiche ad alta velocità dosano azoto liquido per eliminare l'ossigeno, garantendo 24 mesi di freschezza.",
    },
    points: {
      tr: ["Sıvı Azot ile Oksijensiz Dolum", "24 Ay Raf Ömrü Garantisi", "0.5L'den 18L'ye Dayanıklı Ambalaj"],
      en: ["Nitrogen Headspace Flush", "24-Month Shelf Life Guarantee", "0.5L to 18L Packaging Range"],
      ar: ["حقن النيتروجين لحماية الزيت", "صلاحية مضمونة 24 شهراً", "عبوات من 0.5 لتر حتى 18 لتر"],
      ru: ["Защита азотной подушкой", "Гарантия свежести 24 месяца", "Ассортимент от 0.5 л до 18 л"],
      de: ["Stickstoff-Versiegelung", "24 Monate garantierte Frische", "Gebinde von 0,5L bis 18L"],
      fr: ["Inertage sous azote", "Garantie 24 mois de conservation", "Formats de 0.5L à 18L"],
      es: ["Purga con nitrógeno líquido", "24 meses de vida útil", "Gama de 0.5L a 18L"],
      it: ["Inertizzazione con azoto", "24 mesi di shelf-life", "Formati da 0,5L a 18L"],
    },
    metric: {
      value: "24 Ay",
      label: {
        tr: "Garantili Raf Ömrü",
        en: "Shelf Life Guarantee",
        ar: "مدة الصلاحية",
        ru: "Срок хранения",
        de: "Mindesthaltbarkeit",
        fr: "Durée de conservation",
        es: "Vida útil garantizada",
        it: "Durata garantita",
      },
    },
    icon: Sparkles,
  },
  {
    number: "05",
    title: {
      tr: "Mersin MIP & İzmir Limanından Global Sevkiyat",
      en: "Maritime Port Dispatches (Mersin & Izmir)",
      ar: "شحن بحري عالمي عبر مينائي مرسين وإزمير",
      ru: "Морская логистика из портов Мерсин и Измир",
      de: "Seehafen-Direktexport (Mersin & Izmir)",
      fr: "Expéditions maritimes directes (Mersin & Izmir)",
      es: "Envíos marítimos desde Mersin e Izmir",
      it: "Spedizioni marittime da Mersin e Smirne",
    },
    tagline: {
      tr: "20'/40' FCL Konteyner, Flexitank & Dökme Gemi",
      en: "20'/40' FCL Containers, Flexitanks & Bulk Vessels",
      ar: "حاويات 20'/40' قدم، فليكسيتانك وسفن صب",
      ru: "20'/40' FCL контейнеры, флекситанки и навалом",
      de: "20'/40' FCL-Container, Flexitanks & Massengutschiffe",
      fr: "Conteneurs 20'/40' FCL, Flexitanks & Vrac maritime",
      es: "Contenedores 20'/40', flexitanks y buques a granel",
      it: "Container 20'/40' FCL, Flexitank e navi rinfusiere",
    },
    description: {
      tr: "Üretim tesislerimizden doğrudan Akdeniz'in en büyük konteyner limanı Mersin International Port (MIP) ve Ege'nin ana kapısı İzmir Limanı'na transfer. EUR.1, Menşe Şahadetnamesi, SGS/Bureau Veritas gözetimiyle 60+ ülkeye güvenli teslimat.",
      en: "Direct corridor to the Mediterranean's premier maritime hub, Mersin International Port (MIP), and Aegean Izmir Seaport. Full export documentation (EUR.1, Certificate of Origin, SGS inspection) shipped to 60+ countries.",
      ar: "شحن سريع ومباشر إلى ميناء مرسين الدولي (MIP) وميناء إزمير. نوفر كافة وثائق التصدير المعتمدة (EUR.1، شهادة المنشأ، فحص SGS) إلى أكثر من 60 دولة.",
      ru: "Прямой логистический коридор до крупнейшего порта Средиземноморья Mersin (MIP) и порта Измир. Полный комплект экспортных документов (EUR.1, Сертификат происхождения, сюрвейер SGS).",
      de: "Direkter Logistikkorridor zum Tiefseehafen Mersin (MIP) und Izmir Seaport. Vollständige Exportpapiere (EUR.1, Ursprungszeugnis, SGS-Inspektion) in über 60 Länder.",
      fr: "Corridor direct vers le port international de Mersin (MIP) et le port d'Izmir. Dossiers d'exportation complets (EUR.1, Certificat d'origine, inspection SGS) vers 60+ pays.",
      es: "Conexión directa con el puerto internacional de Mersin (MIP) y el puerto de Izmir. Documentación completa de exportación (EUR.1, Certificado de Origen, inspección SGS).",
      it: "Collegamento diretto con il porto di Mersin (MIP) e il porto di Smirne. Documentazione export completa (EUR.1, Certificato di origine, ispezione SGS).",
    },
    points: {
      tr: ["Mersin MIP & İzmir Liman Terminali", "FOB, CFR, CIF Teslimat Seçenekleri", "EUR.1, Helal, SGS Denetimi"],
      en: ["Direct Access to Mersin & Izmir Ports", "FOB, CFR, CIF Incoterms Available", "EUR.1, Halal & SGS Supervision"],
      ar: ["ربط مباشر بمينائي مرسين وإزمير", "شروط تسليم دولية FOB, CFR, CIF", "شهادات EUR.1 وحلال وفحص SGS"],
      ru: ["Прямой доступ к портам Мерсин и Измир", "Условия FOB, CFR, CIF", "Сертификаты EUR.1, Халяль, SGS"],
      de: ["Direktanbindung Mersin MIP & Izmir", "Lieferkonditionen FOB, CFR, CIF", "EUR.1, Halal & SGS Überwachung"],
      fr: ["Accès direct aux ports de Mersin & Izmir", "Conditions de livraison FOB, CFR, CIF", "EUR.1, Halal & Contrôle SGS"],
      es: ["Conexión directa Mersin MIP e Izmir", "Incoterms FOB, CFR, CIF disponibles", "Supervisión EUR.1, Halal y SGS"],
      it: ["Accesso diretto porti di Mersin e Smirne", "Incoterms FOB, CFR, CIF", "Sorveglianza EUR.1, Halal e SGS"],
    },
    metric: {
      value: "60+",
      label: {
        tr: "Global Ülke Ağı",
        en: "Global Countries",
        ar: "دولة حول العالم",
        ru: "Стран мира",
        de: "Länder weltweit",
        fr: "Pays mondiaux",
        es: "Países de destino",
        it: "Paesi serviti",
      },
    },
    icon: Ship,
  },
]

export function ProductionPipeline({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [activeStage, setActiveStage] = useState(0)
  const current = STAGES[activeStage]
  const Icon = current.icon
  const copy = commerceCopy(locale)

  return (
    <section className="bg-white py-24 md:py-32 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Section Heading */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <Factory className="size-3.5 text-emerald-600" />
              <span>
                {dict.home.processKicker}
              </span>
            </div>
            <h2 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
              <span className="text-emerald-gradient">{dict.home.processTitle}</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 md:text-base">
            {dict.pages.quality.lede}
          </p>
        </div>

        {/* Stage Selector Tabs */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {STAGES.map((s, idx) => {
            const SIcon = s.icon
            const isSelected = activeStage === idx
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition duration-300 md:p-5 cursor-pointer ${idx === 4 ? "col-span-2 sm:col-span-1" : ""} ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/70 shadow-lg shadow-emerald-950/5 ring-2 ring-emerald-600/20"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold tracking-wider ${isSelected ? "text-emerald-800" : "text-slate-400"}`}>
                    {copy.stage} {s.number}
                  </span>
                  <SIcon className={`size-4 transition duration-300 ${isSelected ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"}`} />
                </div>
                <h4 className="mt-4 text-sm font-bold text-slate-900 leading-snug">
                  {s.title[locale] || s.title.en}
                </h4>
                {isSelected && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* Active Stage Detailed Display Panel */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50/60 p-6 md:p-12 shadow-xl">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left: Stage Overview & Points */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-3.5 py-1 text-xs font-mono font-bold tracking-widest text-white">
                  {copy.stage} {current.number} / 05
                </span>
                <span className="text-xs font-semibold text-emerald-800 tracking-wide">
                  {current.tagline[locale] || current.tagline.en}
                </span>
              </div>

              <h3 className="font-display mt-4 text-3xl font-extrabold text-slate-900 md:text-5xl">
                {current.title[locale] || current.title.en}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                {activeStage === 4 ? dict.pages.trade.lede : current.description[locale]}
              </p>

              {/* Key Bullet Points */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {(activeStage === 4 ? [dict.ui.shipsFromValue, dict.pages.trade.kicker, copy.verification] : current.points[locale]).map((pt, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Stage Badge & Quick Metric */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg lg:col-span-4">
              <div className="relative flex size-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Icon className="size-10 text-emerald-700" />
              </div>

              <div className="mt-6 font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                <span className="text-emerald-800">{activeStage === 4 ? "FOB / CIF" : activeStage === 3 ? copy.confirm : current.metric.value}</span>
              </div>
              <p className="mt-1 text-xs font-bold tracking-wider uppercase text-slate-500">
                {activeStage === 4 ? dict.nav.trade : current.metric.label[locale]}
              </p>

              <a
                href={pathFor(locale, "quote")}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3 text-xs font-bold text-white transition duration-300 hover:bg-emerald-900 shadow-md shadow-emerald-950/10"
              >
                <span>{copy.documents}</span>
                <ArrowRight className="size-3.5 rtl:-scale-x-100" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
