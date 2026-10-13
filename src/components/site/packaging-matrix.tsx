"use client"

import { useState } from "react"
import type { Locale } from "@/lib/i18n/config"
import { Package, Box, ArrowUpRight, Check, Sparkles } from "lucide-react"
import type { Dict } from "@/content/types"
import { commerceCopy, packagingLabel } from "@/content/commerce-ui"

interface PackagingCategory {
  id: "retail" | "horeca" | "bulk"
  name: Record<Locale, string>
  subtitle: Record<Locale, string>
  items: {
    size: string
    title: Record<Locale, string>
    packing: Record<Locale, string>
    fcl20: string
    shelfLife: string
    features: Record<Locale, string[]>
    badge?: Record<Locale, string>
  }[]
}

const CATEGORIES: PackagingCategory[] = [
  {
    id: "retail",
    name: {
      tr: "Perakende PET Grubu",
      en: "Retail PET Line",
      ar: "مجموعة عبوات التجزئة PET",
      ru: "Розничная ПЭТ линейка",
      de: "Einzelhandel PET-Linie",
      fr: "Gamme PET Détail",
      es: "Línea PET Minorista",
      it: "Linea PET Retail",
    },
    subtitle: {
      tr: "0.5L'den 5L'ye Ergonomik & Dayanıklı Şişeler",
      en: "0.5L to 5L Ergonomic & UV-Protected Bottles",
      ar: "من 0.5 لتر حتى 5 لتر عبوات متينة وعصرية",
      ru: "От 0.5 л до 5 л с защитой от УФ и удобными ручками",
      de: "0,5L bis 5L ergonomische & UV-geschützte Flaschen",
      fr: "Bouteilles ergonomiques 0.5L à 5L anti-UV",
      es: "Botellas ergonómicas de 0.5L a 5L con protección UV",
      it: "Bottiglie ergonomiche da 0,5L a 5L protette da UV",
    },
    items: [
      {
        size: "0.5L & 1.0L",
        title: {
          tr: "Standart & İnce Belli PET Şişe",
          en: "Standard & Ergonomic PET Bottle",
          ar: "عبوة PET قياسية مريحة 1 لتر",
          ru: "Стандартная ПЭТ бутылка 0.5л и 1л",
          de: "Standard & ergonomische PET-Flasche",
          fr: "Bouteille PET ergonomique 0.5L & 1L",
          es: "Botella PET ergonómica 0.5L y 1L",
          it: "Bottiglia PET ergonomica 0,5L e 1L",
        },
        packing: {
          tr: "12 veya 15 Şişe / Koli",
          en: "12 or 15 Bottles / Carton Box",
          ar: "12 أو 15 عبوة في الكرتون",
          ru: "12 или 15 бутылок в коробке",
          de: "12 oder 15 Flaschen / Karton",
          fr: "12 ou 15 bouteilles par carton",
          es: "12 o 15 botellas por caja",
          it: "12 o 15 bottiglie per scatola",
        },
        fcl20: "~1.700 Koli / 20' FCL (~22.950 L)",
        shelfLife: "24 Ay (Sıvı Azot Dozajlı)",
        features: {
          tr: ["Gıdaya uygun kristal şeffaf PET", "Damlatmaz kilitli emniyet kapağı", "Palet üzerinde maksimum istif gücü"],
          en: ["Food-grade crystal virgin PET", "Drip-free tamper-evident cap", "Optimized pallet stacking strength"],
          ar: ["بلاستيك PET بكر شفاف صالح للغذاء", "غطاء محكم ضد التسرب والعبث", "قوة رص ممتازة على الطبالي"],
          ru: ["Пищевой первичный ПЭТ пластик", "Контроль первого вскрытия", "Высокая прочность штабелирования"],
          de: ["Lebensmittelechtes Primär-PET", "Tropffreier Originalitätsverschluss", "Maximale Palettenstabilität"],
          fr: ["PET vierge de qualité alimentaire", "Bouchon inviolable anti-goutte", "Excellente tenue sur palette"],
          es: ["PET virgen de grado alimentario", "Tapón de seguridad antigoteo", "Excelente resistencia al apilado"],
          it: ["PET vergine per uso alimentare", "Tappo di sicurezza salvagoccia", "Elevata resistenza su pallet"],
        },
        badge: {
          tr: "En Çok Satan",
          en: "Top Exporter",
          ar: "الأكثر مبيعاً",
          ru: "Хит продаж",
          de: "Bestseller",
          fr: "Meilleure vente",
          es: "Más vendido",
          it: "Più venduto",
        },
      },
      {
        size: "2.0L",
        title: {
          tr: "Aile Boyu PET Şişe",
          en: "Family Size Ergonomic PET",
          ar: "عبوة عائلية 2 لتر PET",
          ru: "Семейный формат 2.0л ПЭТ",
          de: "Familienpackung 2,0L PET",
          fr: "Format familial 2.0L PET",
          es: "Formato familiar 2.0L PET",
          it: "Formato famiglia 2,0L PET",
        },
        packing: {
          tr: "6 Şişe / Koli",
          en: "6 Bottles / Carton Box",
          ar: "6 عبوات في الكرتون",
          ru: "6 бутылок в коробке",
          de: "6 Flaschen / Karton",
          fr: "6 bouteilles par carton",
          es: "6 botellas por caja",
          it: "6 bottiglie per scatola",
        },
        fcl20: "~1.800 Koli / 20' FCL (~21.600 L)",
        shelfLife: "24 Ay (Sıvı Azot Dozajlı)",
        features: {
          tr: ["Konforlu tutuş kanalları", "Düşük gramaj, yüksek mukavemet", "Özel etiket (Private Label) uyumlu"],
          en: ["Comfort grip side ribs", "Lightweight yet high rigidity", "Private label branding ready"],
          ar: ["قنوات إمساك جانبية مريحة", "وزن خفيف مع متانة عالية", "جاهز لعلامتك التجارية الخاصة"],
          ru: ["Ребра жесткости для удобного хвата", "Облегченный вес и прочность", "Подходит для Private Label"],
          de: ["Ergonomische Griffmulden", "Geringes Gewicht, hohe Festigkeit", "Private Label fähig"],
          fr: ["Rainures de préhension pratiques", "Légèreté et haute rigidité", "Adapté à la marque blanche"],
          es: ["Estrías laterales ergonómicas", "Ligera y de alta resistencia", "Apto para marca privada"],
          it: ["Scanalature ergonomiche", "Leggero e ad alta rigidità", "Pronto per Private Label"],
        },
      },
      {
        size: "4.5L & 5.0L",
        title: {
          tr: "Kulplu Köşeli PET Şişe",
          en: "Square Handle PET Jug",
          ar: "جالون مربع بمقبض 5 لتر PET",
          ru: "Квадратная канистра с ручкой 5.0л",
          de: "Eckige PET-Kanne mit Tragegriff",
          fr: "Bidon PET carré avec poignée 5.0L",
          es: "Garrafa cuadrada PET con asa 5.0L",
          it: "Tanica quadrata PET con manico 5.0L",
        },
        packing: {
          tr: "4 Şişe / Koli veya Şrink",
          en: "4 Jugs / Carton or Shrink Wrap",
          ar: "4 جوالين في الكرتون أو التغليف الحراري",
          ru: "4 канистры в коробке или термопленке",
          de: "4 Kannen / Karton oder Schrumpffolie",
          fr: "4 bidons par carton ou film rétractable",
          es: "4 garrafas por caja o retractilado",
          it: "4 taniche per cartone o termoretraibile",
        },
        fcl20: "~1.000 Koli / 20' FCL (~20.000 L)",
        shelfLife: "24 Ay (Sıvı Azot Dozajlı)",
        features: {
          tr: ["Entegre ergonomik taşıma kulpu", "Konteyner içi %100 hacim optimizasyonu", "Devrilmeye ve çökmeye dayanıklı gövde"],
          en: ["Heavy-duty integrated carry handle", "Optimal container cube utilization", "Reinforced crush-resistant structure"],
          ar: ["مقبض حمل مدمج شديد التحمل", "استغلال مثالي لحجم الحاوية", "هيكل مقوى مقاوم للصدمات والضغط"],
          ru: ["Прочная встроенная ручка", "100% полезного объема контейнера", "Усиленная геометрия стенок"],
          de: ["Robuster integrierter Tragegriff", "Optimale Raumausnutzung im Container", "Knickfeste Eckstruktur"],
          fr: ["Poignée intégrée ultra-résistante", "Remplissage optimal des conteneurs", "Parois renforcées antichoc"],
          es: ["Asa ergonómica de alta resistencia", "Aprovechamiento cúbico total", "Estructura antivuelco"],
          it: ["Manico ergonomico rinforzato", "Massima efficienza di carico", "Struttura resistente agli urti"],
        },
        badge: {
          tr: "Popüler Hacim",
          en: "Popular Volume",
          ar: "حجم شائع",
          ru: "Популярный объем",
          de: "Beliebtes Format",
          fr: "Format populaire",
          es: "Volumen popular",
          it: "Formato richiesto",
        },
      },
    ],
  },
  {
    id: "horeca",
    name: {
      tr: "Horeca & Laklı Teneke",
      en: "Foodservice Tins",
      ar: "صفائح الهوريكا المعدنية",
      ru: "Жестяные банки для HoReCa",
      de: "Gastronomie & Weißblech",
      fr: "Boîtes fer-blanc HoReCa",
      es: "Latas barnizadas HoReCa",
      it: "Lattine laccate HoReCa",
    },
    subtitle: {
      tr: "5L, 10L ve 18L Işık Geçirmez Profesyonel Ambalaj",
      en: "5L, 10L & 18L Lightproof Professional Tins",
      ar: "صفائح 5 و 10 و 18 لتر معتمة للمطابخ الاحترافية",
      ru: "5л, 10л и 18л светонепроницаемая жесть для ресторанов",
      de: "5L, 10L & 18L lichtundurchlässige Profi-Dosen",
      fr: "Boîtes 5L, 10L & 18L opaques pour cuisines professionnelles",
      es: "Latas de 5L, 10L y 18L para hostelería",
      it: "Lattine da 5L, 10L e 18L per ristorazione",
    },
    items: [
      {
        size: "5.0L Teneke",
        title: {
          tr: "Laklı Baskılı İhracat Tenekesi",
          en: "Lacquered Printed Export Tin",
          ar: "صفيحة معدنية مطلية ومطبوعة 5 لتر",
          ru: "Экспортная литографированная банка 5.0л",
          de: "Lackierte bedruckte Export-Blechdose",
          fr: "Boîte fer-blanc vernie imprimée 5.0L",
          es: "Lata barnizada e impresa para exportación 5.0L",
          it: "Lattina laccata e litografata 5.0L",
        },
        packing: {
          tr: "4 Teneke / Koli",
          en: "4 Tins / Carton Box",
          ar: "4 صفائح في الكرتون",
          ru: "4 банки в коробке",
          de: "4 Dosen / Karton",
          fr: "4 boîtes par carton",
          es: "4 latas por caja",
          it: "4 lattine per scatola",
        },
        fcl20: "~950 Koli / 20' FCL (~19.000 L)",
        shelfLife: "24 Ay (Işık ve Hava Geçirmez)",
        features: {
          tr: ["İçi gıda lakı kaplı paslanmaz teneke", "Geri çekilebilir körüklü dökme kapağı", "Işık geçirmediği için sıfır oksidasyon"],
          en: ["Food-grade internal gold lacquer", "Retractable pull-up spout cap", "Zero oxidation through 100% light block"],
          ar: ["طلاء داخلي صالح للغذاء مقاوم للصدأ", "غطاء سحب مرن مانع للانسكاب", "حماية كاملة من الضوء والأكسدة"],
          ru: ["Внутренний пищевой лак от коррозии", "Вытяжной носик-дозатор", "100% защита от света и окисления"],
          de: ["Lebensmittellackierung innen", "Ausziehbarer Teleskopverschluss", "Keine Oxidation durch Lichtschutz"],
          fr: ["Vernis intérieur de qualité alimentaire", "Bec verseur télescopique pratique", "Zéro oxydation due à la lumière"],
          es: ["Barniz interior apto para alimentos", "Tapón telescópico antigoteo", "Cero oxidación por bloqueo de luz"],
          it: ["Laccatura interna per alimenti", "Beccuccio telescopico estraibile", "Zero ossidazione da luce solare"],
        },
      },
      {
        size: "18.0L Teneke",
        title: {
          tr: "Büyük Boy Horeca Tenekesi",
          en: "Bulk Foodservice Standard Tin",
          ar: "صفيحة هوريكا كبرى 18 لتر",
          ru: "Промышленная жестяная банка 18.0л",
          de: "Große Gastronomie-Dose 18,0L",
          fr: "Boîte standard HoReCa 18.0L",
          es: "Lata grande para hostelería 18.0L",
          it: "Lattina industriale HoReCa 18.0L",
        },
        packing: {
          tr: "Tekli / Paletli veya Dökme",
          en: "Individual / Palletized or Loose Stowed",
          ar: "فردي / على طبالي أو رص مباشر",
          ru: "Поштучно на паллетах или навалом",
          de: "Einzeln / Auf Palette oder lose gestaut",
          fr: "À l'unité / Palettisé ou vrac conteneur",
          es: "Individual / En palets o estiba suelta",
          it: "Singola / Su pallet o stivata libera",
        },
        fcl20: "~680 - 720 Teneke / 20' FCL (~12.600 L)",
        shelfLife: "24 Ay (Endüstriyel Koruma)",
        features: {
          tr: ["Geniş kulplu çelik gövde", "Kızartma ve toplu yemek üretimine uygun", "Deniz aşırı nakliyeye dayanıklı takviyeli nervürler"],
          en: ["Heavy-duty welded steel body with handle", "Ideal for deep frying & catering facilities", "Corrugated ribs built for long ocean voyages"],
          ar: ["هيكل فولاذي متين مع مقبض قوي", "مثالية للمطاعم ومصانع الأغذية والقلي", "أضلاع تقوية لتحمل الشحن البحري الطويل"],
          ru: ["Усиленный сварной корпус с ручкой", "Идеально для фритюра и пищевых производств", "Ребра жесткости для морской качки"],
          de: ["Robuster Stahlkorpus mit Tragebügel", "Ideal für Großküchen & Frittierbetriebe", "Verstärkte Sicken für Überseetransport"],
          fr: ["Corps en acier soudé avec poignée", "Idéal pour friture et restauration collective", "Nervures renforcées pour transport maritime"],
          es: ["Cuerpo de acero soldado con asa resistente", "Ideal para freidoras industriales y catering", "Nervaduras reforzadas para fletes marítimos"],
          it: ["Corpo in acciaio rinforzato con manico", "Ideale per frittura e ristorazione collettiva", "Nervature per lunghe tratte marittime"],
        },
        badge: {
          tr: "Horeca Favorisi",
          en: "Horeca Choice",
          ar: "خيار المطاعم المفضل",
          ru: "Выбор ресторанов",
          de: "Gastro-Favorit",
          fr: "Choix HoReCa",
          es: "Preferido HoReCa",
          it: "Preferito HoReCa",
        },
      },
    ],
  },
  {
    id: "bulk",
    name: {
      tr: "Endüstriyel & Dökme",
      en: "Industrial & Bulk",
      ar: "الشحن الصناعي والسائب",
      ru: "Промышленная и наливная тара",
      de: "Industrie & Großgebinde",
      fr: "Industriel & Vrac",
      es: "Industrial y a granel",
      it: "Industriale e sfuso",
    },
    subtitle: {
      tr: "Varil (200L), IBC Tank (1000L) & Flexitank (24.000L)",
      en: "Drums (200L), IBC Tanks (1000L) & Flexitank (24,000L)",
      ar: "براميل (200 لتر)، خزانات IBC (1000 لتر) وفليكسيتانك (24,000 لتر)",
      ru: "Бочки (200л), кубы IBC (1000л) и флекситанки (24 000л)",
      de: "Fässer (200L), IBC-Tanks (1000L) & Flexitanks (24.000L)",
      fr: "Fûts (200L), Cuves IBC (1000L) & Flexitank (24.000L)",
      es: "Bidones (200L), Tanques IBC (1000L) y Flexitanks (24.000L)",
      it: "Fusti (200L), Cisterne IBC (1000L) e Flexitank (24.000L)",
    },
    items: [
      {
        size: "200 L Varil",
        title: {
          tr: "Gıda Tipi Çelik / Plastik Varil",
          en: "Food-Grade Steel / Plastic Drum",
          ar: "براميل حديد / بلاستيك صالحة للغذاء 200 لتر",
          ru: "Пищевая бочка металл / пластик 200л",
          de: "Lebensmittelechtes Stahl- / Kunststofffass",
          fr: "Fût acier / plastique alimentaire 200L",
          es: "Bidón de acero / plástico alimentario 200L",
          it: "Fusto in acciaio / plastica alimentare 200L",
        },
        packing: {
          tr: "Palet Başı 4 Varil",
          en: "4 Drums / Pallet",
          ar: "4 براميل على كل طبلية",
          ru: "4 бочки на паллете",
          de: "4 Fässer pro Palette",
          fr: "4 fûts par palette",
          es: "4 bidones por palet",
          it: "4 fusti per pallet",
        },
        fcl20: "80 Varil / 20' FCL (~16.000 L / 14.700 kg)",
        shelfLife: "24 Ay (Hava Geçirmez Mühür)",
        features: {
          tr: ["Gıda epoksi astarlı iç yüzey", "Bung kapağı güvenlik mühürlü", "Fabrika dolum tesisleri için ideal"],
          en: ["Internal food epoxy liner", "Sealed 2-inch bung plugs", "Ideal for food processing plants"],
          ar: ["طلاء إيبوكسي داخلي مخصص للأغذية", "أغطية سدادة مع أختام أمان", "مثالية لمصانع تصنيع الأغذية"],
          ru: ["Внутреннее пищевое эпоксидное покрытие", "Пломбируемые пробки 2 дюйма", "Оптимально для перерабатывающих заводов"],
          de: ["Lebensmittel-Epoxidbeschichtung innen", "Versiegelte Spundverschlüsse", "Ideal für Lebensmittelverarbeiter"],
          fr: ["Revêtement intérieur époxy alimentaire", "Bouchons de bonde scellés", "Parfait pour les usines agroalimentaires"],
          es: ["Revestimiento interior epoxi alimentario", "Tapones de 2 pulgadas precintados", "Ideal para procesadores de alimentos"],
          it: ["Rivestimento interno epossidico alimentare", "Tappi sigillabili da 2 pollici", "Ottimale per industrie alimentari"],
        },
      },
      {
        size: "1.000 L IBC",
        title: {
          tr: "Çelik Kafesli IBC Tank",
          en: "Intermediate Bulk Container (IBC)",
          ar: "خزان IBC ذو هيكل حديدي 1000 لتر",
          ru: "Еврокуб IBC в металлической обрешетке",
          de: "IBC-Container mit Stahlkäfig",
          fr: "Cuve IBC avec armature acier 1000L",
          es: "Contenedor IBC con jaula de acero",
          it: "Cisterna IBC con gabbia in acciaio 1000L",
        },
        packing: {
          tr: "Entegre Çelik/Plastik Palet",
          en: "Integrated Steel / Plastic Pallet Base",
          ar: "قاعدة طبلية فولاذية مدمجة",
          ru: "Интегрированный поддон",
          de: "Integrierte Stahl-/Kunststoffpalette",
          fr: "Palette intégrée acier/plastique",
          es: "Base de palet integrada",
          it: "Pallet integrato in acciaio/plastica",
        },
        fcl20: "20 IBC Tank / 20' FCL (~20.000 L / 18.400 kg)",
        shelfLife: "24 Ay (Steril Vana & Kapak)",
        features: {
          tr: ["FDA onaylı yüksek yoğunluklu HDPE", "Alt tahliye vanası (camlock adaptörlü)", "Forklift ile hızlı elleçleme"],
          en: ["FDA-compliant high density HDPE bottle", "Bottom discharge ball valve with camlock", "Fast forklift & crane handling"],
          ar: ["بلاستيك HDPE عالي الكثافة معتمد من FDA", "صمام تفريغ سفلي سريع التوصيل", "مناولة سريعة بالرافعات الشوكية"],
          ru: ["Емкость из пищевого ПНД (сертификат FDA)", "Нижний кран для удобного слива", "Быстрая перегрузка вилочным погрузчиком"],
          de: ["FDA-konformer HDPE-Innenbehälter", "Bodenkugelhahn mit Camlock-Anschluss", "Schnelles Handling per Gabelstapler"],
          fr: ["Polyéthylène haute densité certifié FDA", "Vanne de vidange inférieure avec raccord", "Manutention rapide au chariot élévateur"],
          es: ["Polietileno HDPE certificado FDA", "Válvula de descarga inferior con camlock", "Manipulación rápida con carretilla elevadora"],
          it: ["Bottiglia in HDPE approvata FDA", "Valvola di scarico inferiore con camlock", "Movimentazione rapida con muletto"],
        },
      },
      {
        size: "24.000 L Flexitank",
        title: {
          tr: "Konteyner İçi Çok Katmanlı Flexitank",
          en: "Multi-Layer Ocean Flexitank",
          ar: "خزان فليكسيتانك متعدد الطبقات 24,000 لتر",
          ru: "Многослойный флекситанк для 20' контейнера",
          de: "Mehrlagiger Flexitank für 20'-Container",
          fr: "Flexitank multicouche pour conteneur 20'",
          es: "Flexitank multicapa para contenedor 20'",
          it: "Flexitank multistrato per container 20'",
        },
        packing: {
          tr: "20' Standart Kuru Yük Konteyneri İçi",
          en: "Installed in 20' Standard Dry Box (DV)",
          ar: "يتم تركيبه داخل حاوية جافة 20 قدم",
          ru: "Монтируется внутри стандартного 20' DC контейнера",
          de: "Einbau in 20' Standard-Seecontainer",
          fr: "Installé dans conteneur dry 20' standard",
          es: "Instalado en contenedor seco estándar de 20'",
          it: "Installato in container standard da 20'",
        },
        fcl20: "1 Flexitank / 20' FCL (24.000 L / 21.600 kg)",
        shelfLife: "Varış Noktasına Kadar Tam Koruma",
        features: {
          tr: ["Maksimum navlun ve hacim tasarrufu", "Tek kullanımlık gıda tipi steril EVOH bariyer", "Mersin MIP Limanı'ndan doğrudan yükleme"],
          en: ["Highest freight & logistics efficiency", "Single-use sterile food-grade EVOH barrier", "Direct filling & pumping at Mersin Port"],
          ar: ["أقصى توفير في تكاليف الشحن واللوجستيات", "طبقة حاجز EVOH معقمة أحادية الاستخدام", "تحميل وضخ مباشر في ميناء مرسين MIP"],
          ru: ["Максимальная экономия на морском фрахте", "Стерильный пищевой барьер EVOH", "Прямая заправка в порту Мерсин"],
          de: ["Höchste Fracht- & Volumeneffizienz", "Einweg-EVOH-Barriere für Lebensmittel", "Direktbefüllung im Seehafen Mersin"],
          fr: ["Efficacité logistique et fret maximale", "Barrière EVOH stérile à usage unique", "Remplissage direct au port de Mersin"],
          es: ["Máxima eficiencia de flete y volumen", "Barrera EVOH estéril de un solo uso", "Llenado directo en el puerto de Mersin"],
          it: ["Massima efficienza di nolo marittimo", "Barriera EVOH sterile monouso", "Riempimento diretto al porto di Mersin"],
        },
        badge: {
          tr: "En Ekonomik Navlun",
          en: "Best Freight Rate",
          ar: "أفضل تكلفة شحن",
          ru: "Лучшая ставка фрахта",
          de: "Beste Frachtkosten",
          fr: "Meilleur coût fret",
          es: "Mejor flete marítimo",
          it: "Miglior nolo marittimo",
        },
      },
    ],
  },
]

export function PackagingMatrix({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [activeTab, setActiveTab] = useState<"retail" | "horeca" | "bulk">("retail")
  const currentCategory = CATEGORIES.find((c) => c.id === activeTab) ?? CATEGORIES[0]
  const copy = commerceCopy(locale)

  return (
    <section className="bg-[#f8fafc] py-24 md:py-32 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-800 border border-slate-300">
              <Box className="size-3.5 text-emerald-700" />
              <span>
                {dict.articles.packaging.kicker}
              </span>
            </div>
            <h2 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
              <span className="text-emerald-gradient">{dict.articles.packaging.h1}</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 md:text-base">
            {dict.articles.packaging.lede}
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="mt-12 flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeTab
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`group flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-bold transition duration-300 ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-lg shadow-emerald-950/20"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Package className={`size-4 ${isActive ? "text-amber-300" : "text-emerald-700"}`} />
                <span>{cat.name[locale] || cat.name.en}</span>
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-sm font-semibold text-emerald-800">
          {currentCategory.subtitle[locale] || currentCategory.subtitle.en}
        </p>

        {/* Packaging Items Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentCategory.items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-2xl"
            >
              {/* Badge if present */}
              {item.badge && (
                <div className="absolute top-6 right-6 rtl:left-6 rtl:right-auto">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-900 border border-amber-200">
                    <Sparkles className="size-3 text-amber-600" />
                    {item.badge[locale] || item.badge.en}
                  </span>
                </div>
              )}

              <div>
                <span className="font-mono text-xs font-bold tracking-widest text-emerald-700 uppercase">
                  {packagingLabel(item.size, locale)}
                </span>
                <h3 className="font-display mt-2 text-2xl font-bold text-slate-900">
                  {item.title[locale] || item.title.en}
                </h3>

                {/* Key Specs Table */}
                <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      {dict.form.packaging}
                    </span>
                    <span className="font-bold text-slate-900">
                      {item.packing[locale] || item.packing.en}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                    <span className="text-slate-500 font-medium">
                      {copy.capacity}
                    </span>
                    <span className="font-bold text-emerald-800">
                      {packagingLabel(item.fcl20, locale).replace(/Koli/g, copy.cartons).replace(/Tank/g, "IBC")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                    <span className="text-slate-500 font-medium">
                      {copy.shelfLife}
                    </span>
                    <span className="font-bold text-slate-900">
                      {copy.confirm}
                    </span>
                  </div>
                </div>

                {/* Feature Checkpoints */}
                <ul className="mt-5 space-y-2 text-xs text-slate-600">
                  {(item.features[locale] || item.features.en).map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-slate-100">
                <a
                  href={`mailto:export@asiaoil.com.tr?subject=${encodeURIComponent(
                    `${dict.ui.quote}: ${packagingLabel(item.size, locale)} ${item.title[locale]}`
                  )}`}
                  className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-800 transition duration-300 hover:bg-emerald-800 hover:text-white"
                >
                  <span>{dict.ui.quote}</span>
                  <ArrowUpRight className="size-3.5 transition group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl:-scale-x-100" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
