"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Locale } from "@/lib/i18n/config"
import { pathFor } from "@/lib/i18n/config"

type Props = {
  locale: Locale
  whatsappNumber?: string
  labels: {
    previous: string
    next: string
    pause: string
    play: string
    slide: string
  }
}

type SlideData = {
  image: string
  tag: Record<Locale, string>
  title: Record<Locale, string>
  subtitle: Record<Locale, string>
  highlights: Record<Locale, [string, string, string]>
}

const SLIDES: SlideData[] = [
  {
    image: "/media/hero/hero-1.webp",
    tag: {
      tr: "ENDÜSTRİYEL RAFİNASYON & OTOMATİK DOLUM TESİSİ",
      en: "CONTINUOUS REFINING & AUTOMATED BOTTLING PLANT",
      ar: "مصنع التكرير المستمر والتعبئة الآلية عالية السرعة",
      fr: "RAFFINERIE CONTINUE & LIGNE D'EMBOUTEILLAGE AUTOMATISÉE",
      de: "KONTINUIERLICHE RAFFINERIE & AUTOMATISIERTE ABFÜLLUNG",
      es: "REFINERÍA CONTINUA Y PLANTA DE ENVASADO AUTOMATIZADO",
      ru: "НЕПРЕРЫВНАЯ РАФИНАЦИЯ И АВТОМАТИЗИРОВАННЫЙ РОЗЛИВ",
      it: "RAFFINERIA CONTINUA E IMPIANTO DI IMBOTTIGLIAMENTO AUTOMATICO",
    },
    title: {
      tr: "Bitkisel Yağ Üretiminde İhracat Odaklı Rafinasyon",
      en: "Export-Engineered Edible Oil Refining & Bottling",
      ar: "تكرير وتعبئة الزيوت النباتية بمعايير التصدير العالمية",
      fr: "Raffinage et Conditionnement d'Huiles Alimentaires pour l'Export",
      de: "Exportorientierte Speiseöl-Raffination & Hochleistungsabfüllung",
      es: "Refinación y Envasado de Aceites Comestibles para Exportación",
      ru: "Экспортно-ориентированная рафинация и розлив пищевых масел",
      it: "Raffinazione e Confezionamento di Oli Alimentari per l'Export",
    },
    subtitle: {
      tr: "Avrupa, Orta Doğu, Afrika ve Amerika pazarlarındaki distribütörler için ISO 22000, FSSC 22000, Helal ve Kosher sertifikalı tam otomatik PET, teneke ve dökme dolum hatları.",
      en: "High-speed automated PET, tinplate, and bulk filling lines certified to ISO 22000, FSSC 22000, Halal, and Kosher standards for global importers and retail chains.",
      ar: "خطوط تعبئة آلية عالية السرعة للعبوات البلاستيكية والصفائح المعدنية والسائبة بشهادات ISO 22000 وFSSC 22000 وحلال وكوشير للمستوردين حول العالم.",
      fr: "Lignes de remplissage automatisées PET, bidons métalliques et vrac certifiées ISO 22000, FSSC 22000, Halal et Casher pour les importateurs mondiaux.",
      de: "Vollautomatische PET-, Weißblech- und Bulk-Abfülllinien nach ISO 22000, FSSC 22000, Halal und Koscher für internationale Importeure und Handelsketten.",
      es: "Líneas automatizadas de llenado en PET, hojalata y granel certificadas bajo ISO 22000, FSSC 22000, Halal y Kosher para importadores globales.",
      ru: "Высокоскоростные линии розлива в ПЭТ, жестяную тару и флекситанки, сертифицированные по ISO 22000, FSSC 22000, Halal и Kosher.",
      it: "Linee di riempimento automatizzate per PET, banda stagnata e sfuso certificate ISO 22000, FSSC 22000, Halal e Kosher per importatori globali.",
    },
    highlights: {
      tr: ["ISO 22000 & FSSC 22000", "Çok Hatlı Otomatik Dolum", "Parti Bazlı COA Analizi"],
      en: ["ISO 22000 & FSSC 22000", "Multi-Line Automated Filling", "Batch-Level COA Analytics"],
      ar: ["شهادات ISO 22000 وFSSC 22000", "خطوط تعبئة آلية متطورة", "شهادة تحليل COA لكل تشغيلة"],
      fr: ["ISO 22000 & FSSC 22000", "Embouteillage Automatisé", "Analyse COA par Lot"],
      de: ["ISO 22000 & FSSC 22000", "Automatische Mehrlinien-Abfüllung", "Chargen-COA-Laboranalyse"],
      es: ["ISO 22000 y FSSC 22000", "Envasado Automatizado", "Análisis COA por Lote"],
      ru: ["ISO 22000 и FSSC 22000", "Автоматизированный розлив", "Лабораторный COA на партию"],
      it: ["ISO 22000 & FSSC 22000", "Imbottigliamento Automatizzato", "Analisi COA per Lotto"],
    },
  },
  {
    image: "/media/hero/hero-2.webp",
    tag: {
      tr: "RAFİNE VİNTERİZE AYÇİÇEK YAĞI SERİSİ",
      en: "REFINED WINTERIZED SUNFLOWER OIL RANGE",
      ar: "مجموعة زيت عباد الشمس المكرر والمنقى",
      fr: "GAMME D'HUILE DE TOURNESOL RAFFINÉE HIVÉRISÉE",
      de: "RAFFINIERTES WINTERISIERTES SONNENBLUMENÖL",
      es: "GAMA DE ACEITE DE GIRASOL REFINADO WINTERIZADO",
      ru: "РАФИНИРОВАННОЕ ВИНТЕРИЗИРОВАННОЕ ПОДСОЛНЕЧНОЕ МАСЛО",
      it: "GAMMA DI OLIO DI GIRASOLE RAFFINATO WINTERIZZATO",
    },
    title: {
      tr: "Perakende PET ve Endüstriyel Tenekede Kristal Berraklık",
      en: "Crystal-Clear Refined Sunflower Oil in PET & Tin",
      ar: "زيت عباد الشمس المكرر فائق النقاء بعبوات التجزئة والجملة",
      fr: "Huile de Tournesol Raffinée Cristalline en PET et Bidons",
      de: "Kristallklares Sonnenblumenöl in Retail-PET & Industriedosen",
      es: "Aceite de Girasol Refinado Cristalino en PET y Lata Industrial",
      ru: "Кристально чистое подсолнечное масло в ПЭТ и жестяной таре",
      it: "Olio di Girasole Raffinato Cristallino in PET e Latta Industriale",
    },
    subtitle: {
      tr: "Codex Alimentarius CXS 210-1999 standardında (FFA ≤ %0,10, Peroksit ≤ 1,0 meq O₂/kg), azot yastıklamalı 1L, 2L, 5L ergonomik PET şişe ve 10L/18L/20L ihracat tenekeleri.",
      en: "Refined, bleached, winterized, and deodorized to Codex CXS 210-1999 (FFA ≤ 0.10%, Peroxide ≤ 1.0 meq O₂/kg) in nitrogen-flushed 1L, 2L, 5L PET bottles and 18L export tins.",
      ar: "مكرر ومنقى ومزال الرائحة وفق معيار كودكس CXS 210-1999 (حموضة ≤ 0.10%) بعبوات PET سعة 1 و2 و5 لتر وصفائح معدنية 18 لتر محمية بالنيتروجين.",
      fr: "Raffinée, hivérisée et désodorisée selon Codex CXS 210-1999 (FFA ≤ 0,10 %) en bouteilles PET 1L, 2L, 5L sous azote et bidons métalliques d'exportation 18L.",
      de: "Raffiniert, winterisiert und desodoriert nach Codex CXS 210-1999 (FFA ≤ 0,10 %) in stickstoffüberlagerten 1L-, 2L-, 5L-PET-Flaschen und 18L-Exportkanistern.",
      es: "Refinado, winterizado y desodorizado según Codex CXS 210-1999 (FFA ≤ 0,10 %) en botellas PET de 1L, 2L, 5L con nitrógeno y latas de exportación de 18L.",
      ru: "Рафинированное дезодорированное масло по стандарту Codex CXS 210-1999 (FFA ≤ 0,10%) в ПЭТ-бутылках 1л, 2л, 5л под азотом и канистрах 18л.",
      it: "Raffinato, winterizzato e deodorato secondo Codex CXS 210-1999 (FFA ≤ 0,10%) in bottiglie PET da 1L, 2L, 5L sotto azoto e latte export da 18L.",
    },
    highlights: {
      tr: ["FFA ≤ %0,10 · Lovibond ≤ 1,2R", "1L / 2L / 5L PET & 18L Teneke", "24 Ay Azot Korumalı Raf Ömrü"],
      en: ["FFA ≤ 0.10% · Lovibond ≤ 1.2R", "1L / 2L / 5L PET & 18L Tin", "24-Month Nitrogen-Flushed Shelf Life"],
      ar: ["حموضة ≤ 0.10% ونقاء فائق", "عبوات 1 و2 و5 لتر وصفائح 18 لتر", "صلاحية 24 شهراً بحماية النيتروجين"],
      fr: ["FFA ≤ 0,10 % · Lovibond ≤ 1,2R", "PET 1L / 2L / 5L & Bidon 18L", "Conservation 24 Mois sous Azote"],
      de: ["FFA ≤ 0,10 % · Lovibond ≤ 1,2R", "1L / 2L / 5L PET & 18L Weißblech", "24 Monate Haltbarkeit unter Stickstoff"],
      es: ["FFA ≤ 0,10 % · Lovibond ≤ 1,2R", "PET 1L / 2L / 5L y Lata 18L", "24 Meses de Vida Útil con Nitrógeno"],
      ru: ["FFA ≤ 0,10% · Lovibond ≤ 1,2R", "ПЭТ 1л / 2л / 5л и жесть 18л", "Срок годности 24 месяца под азотом"],
      it: ["FFA ≤ 0,10% · Lovibond ≤ 1,2R", "PET 1L / 2L / 5L e Latta 18L", "24 Mesi di Conservazione sotto Azoto"],
    },
  },
  {
    image: "/media/hero/hero-3.webp",
    tag: {
      tr: "AKDENİZ SOĞUK SIKIM SIZMA & RİVİERA ZEYTİNYAĞI",
      en: "MEDITERRANEAN EXTRA VIRGIN & RIVIERA OLIVE OIL",
      ar: "زيت الزيتون البكر الممتاز والريفييرا من البحر المتوسط",
      fr: "HUILE D'OLIVE VIERGE EXTRA & RIVIERA MÉDITERRANÉENNE",
      de: "MEDITERRANES NATIVES OLIVENÖL EXTRA & RIVIERA",
      es: "ACEITE DE OLIVA VIRGEN EXTRA Y RIVIERA DEL MEDITERRÁNEO",
      ru: "СРЕДИЗЕМНОМОРСКОЕ ОЛИВКОВОЕ МАСЛО EXTRA VIRGIN И RIVIERA",
      it: "OLIO EXTRA VERGINE DI OLIVA E RIVIERA DEL MEDITERRANEO",
    },
    title: {
      tr: "Otantik Akdeniz Zeytinyağında Kurumsal İhracat Kalitesi",
      en: "Cold-Pressed Extra Virgin & Riviera Olive Oil Collection",
      ar: "تشكيلة زيت الزيتون البكر الممتاز المعصور على البارد للتصدير",
      fr: "Collection d'Huile d'Olive Vierge Extra Première Pression à Froid",
      de: "Kaltgepresstes Natives Olivenöl Extra & Riviera für den Welthandel",
      es: "Colección de Aceite de Oliva Virgen Extra Prensado en Frío",
      ru: "Коллекция оливкового масла Extra Virgin холодного отжима",
      it: "Collezione di Olio Extra Vergine di Oliva Estratto a Freddo",
    },
    subtitle: {
      tr: "IOC (Uluslararası Zeytin Konseyi) standartlarına tam uyumlu (< 27°C soğuk sıkım, serbest asitlik ≤ %0,8), UV korumalı koyu Marasca/Dorica cam şişeler ve 3L/5L laklı teneke ambalajlar.",
      en: "Compliant with International Olive Council (IOC) standards (< 27°C cold extraction, acidity ≤ 0.8%) in UV-shielded dark Marasca/Dorica glass bottles and 3L/5L lacquered tins.",
      ar: "مطابق لمعايير المجلس الدولي للزيتون IOC (عصر بارد أقل من 27 درجة مئوية، حموضة ≤ 0.8%) في زجاجات ماراسكا داكنة وصفائح معدنية 3 و5 لتر.",
      fr: "Conforme aux normes du Conseil Oléicole International (extraction à froid < 27 °C, acidité ≤ 0,8 %) en bouteilles verre sombre Marasca/Dorica et bidons 3L/5L.",
      de: "Konform mit den Standards des Internationalen Olivenrates IOC (< 27 °C Kaltpressung, Säuregehalt ≤ 0,8 %) in dunklen Marasca-Glasflaschen und 3L/5L-Dosen.",
      es: "Conforme a las normas del Consejo Oleícola Internacional COI (extracción en frío < 27 °C, acidez ≤ 0,8 %) en botellas Marasca oscuras y latas de 3L/5L.",
      ru: "Соответствует стандартам Международного совета по оливкам IOC (холодный отжим < 27°C, кислотность ≤ 0,8%) в темном стекле Marasca и жести 3л/5л.",
      it: "Conforme agli standard del Consiglio Oleicolo Internazionale COI (estrazione a freddo < 27 °C, acidità ≤ 0,8%) in bottiglie Marasca scure e latte da 3L/5L.",
    },
    highlights: {
      tr: ["IOC Standartlarında Soğuk Sıkım", "500ml / 1L Marasca Cam & 5L Teneke", "Tek Bahçe & Kupaj İzlenebilirliği"],
      en: ["IOC-Certified Cold Extraction", "500ml / 1L Marasca Glass & 5L Tin", "Single-Origin Grove Traceability"],
      ar: ["عصر بارد معتمد من IOC", "زجاج ماراسكا 500 مل / 1 لتر وصفيحة 5 لتر", "تتبع كامل للمصدر والجودة"],
      fr: ["Extraction à Froid Certifiée IOC", "Verre Marasca 500ml / 1L & Bidon 5L", "Traçabilité des Oliveraies"],
      de: ["IOC-zertifizierte Kaltpressung", "500ml / 1L Marasca-Glas & 5L Dose", "Lückenlose Herkunftsrückverfolgung"],
      es: ["Extracción en Frío Certificada COI", "Vidrio Marasca 500ml / 1L y Lata 5L", "Trazabilidad de Origen Completa"],
      ru: ["Холодный отжим по стандарту IOC", "Стекло Marasca 500мл / 1л и жесть 5л", "Полная прослеживаемость партий"],
      it: ["Estrazione a Freddo Certificata COI", "Vetro Marasca 500ml / 1L e Latta 5L", "Tracciabilità Completa di Filiera"],
    },
  },
  {
    image: "/media/hero/hero-4.webp",
    tag: {
      tr: "PRIVATE LABEL (ÖZEL MARKA / OEM) & HORECA AMBALAJ",
      en: "PRIVATE LABEL OEM & HORECA BULK PACKAGING",
      ar: "تصنيع العلامات التجارية الخاصة OEM وعبوات هوريكا بالجملة",
      fr: "MARQUE DISTRIBUTEUR (MDD / OEM) & CONDITIONNEMENT HORECA",
      de: "PRIVATE LABEL (HANDELSMARKEN / OEM) & HORECA-GEBINDE",
      es: "MARCA PRIVADA (OEM) Y ENVASES INDUSTRIALES HORECA",
      ru: "ЧАСТНАЯ МАРКА (СТМ / OEM) И УПАКОВКА ДЛЯ HORECA",
      it: "PRIVATE LABEL (MARCHIO PRIVATO / OEM) E FORMATI HORECA",
    },
    title: {
      tr: "Markanıza Özel Etiket, Ambalaj ve Akredite COA Kalitesi",
      en: "Turnkey Private Label OEM & HoReCa Bulk Packaging",
      ar: "حلول متكاملة للعلامات التجارية الخاصة وعبوات الفنادق والمطاعم",
      fr: "Solutions Clés en Main Marque Distributeur & Emballages HoReCa",
      de: "Schlüsselfertige Handelsmarken-Abfüllung & HoReCa-Großgebinde",
      es: "Soluciones Llave en Mano de Marca Privada y Formato HoReCa",
      ru: "Комплексное производство под вашей маркой (СТМ) и тара HoReCa",
      it: "Produzione Chiavi in Mano Private Label e Confezioni HoReCa",
    },
    subtitle: {
      tr: "Ulusal market zincirleri ve gıda distribütörleri için hedef ülke mevzuatına uygun çok dilli etiket, litografik baskılı teneke, GS1 barkodlama ve ihracat kolisi üretimi.",
      en: "Multilingual regulatory label adaptation, lithographed tinplate printing, GS1 barcoding, and double-wall export cartons tailored for supermarket chains and foodservice distributors.",
      ar: "تصميم ملصقات متعددة اللغات مطابقة للوائح البلد المستورد وطباعة صفائح معدنية وترميز GS1 وكراتين تصدير مزدوجة لسلاسل المتاجر والموزعين.",
      fr: "Étiquetage multilingue réglementaire, impression lithographique sur métal, codes-barres GS1 et cartons double cannelure pour la grande distribution et la RHF.",
      de: "Mehrsprachige Etikettierung nach Zielland-Verordnung, lithografischer Blechdruck, GS1-Codierung und Exportkartons für Supermarktketten und Großhandel.",
      es: "Etiquetado multilingüe normativo, impresión litográfica en hojalata, códigos GS1 y cajas de exportación de doble pared para cadenas minoristas.",
      ru: "Многоязычная этикетка по стандартам страны импорта, литография на жести, штрихкоды GS1 и усиленные экспортные короба для торговых сетей.",
      it: "Etichettatura multilingue normativa, stampa litografica su banda stagnata, codici GS1 e cartoni export a doppia onda per GDO e distributori.",
    },
    highlights: {
      tr: ["Çok Dilli Etiket & Litografi", "HoReCa 10L / 18L / 20L Teneke", "5 İş Gününde Numune & Teklif"],
      en: ["Multilingual Label & Lithography", "HoReCa 10L / 18L / 20L Tins", "5-Day Sample & Technical Quote"],
      ar: ["طباعة ملصقات وصفائح مخصصة", "عبوات هوريكا 10 و18 و20 لتر", "عينات وعرض سعر فني خلال 5 أيام"],
      fr: ["Étiquetage Multilingue & Litho", "Bidons HoReCa 10L / 18L / 20L", "Échantillons & Devis sous 5 Jours"],
      de: ["Mehrsprachiges Etikett & Litho", "HoReCa 10L / 18L / 20L Kanister", "Muster & Angebot in 5 Werktagen"],
      es: ["Etiqueta Multilingüe y Litografía", "Latas HoReCa 10L / 18L / 20L", "Muestras y Cotización en 5 Días"],
      ru: ["Многоязычная этикетка и литография", "Тара HoReCa 10л / 18л / 20л", "Образцы и расчет за 5 дней"],
      it: ["Etichetta Multilingue e Litografia", "Latte HoReCa 10L / 18L / 20L", "Campioni e Offerta in 5 Giorni"],
    },
  },
  {
    image: "/media/hero/hero-5.webp",
    tag: {
      tr: "DOĞRUDAN FABRİKA İHRACAT OFİSİ & LİMAN LOJİSTİĞİ",
      en: "DIRECT FACTORY EXPORT DESK & PORT LOGISTICS",
      ar: "مكتب التصدير المباشر من المصنع والخدمات اللوجستية البحرية",
      fr: "BUREAU D'EXPORTATION DIRECTE USINE & LOGISTIQUE PORTUAIRE",
      de: "DIREKTER WERKSEXPORT & INTERNATIONALE HAFENLOGISTIK",
      es: "OFICINA DE EXPORTACIÓN DIRECTA DE FÁBRICA Y LOGÍSTICA PORTUARIA",
      ru: "ПРЯМОЙ ЭКСПОРТНЫЙ ОТДЕЛ ЗАВОДА И ПОРТОВАЯ ЛОГИСТИКА",
      it: "UFFICIO EXPORT DIRETTO DI FABBRICA E LOGISTICA PORTUALE",
    },
    title: {
      tr: "Konteyner, Flexitank ve Palet Bazlı Doğrudan İhracat",
      en: "Container, Flexitank & Pallet-Scale Direct Export",
      ar: "شحن مباشر بالحاويات والفلكسي تانك والطبليات من ميناء مرسين",
      fr: "Logistique d'Exportation par Conteneur, Flexitank & Palette",
      de: "Container-, Flexitank- & Paletten-Direktlieferung ab Werk",
      es: "Exportación Directa por Contenedor, Flexitank y Palet",
      ru: "Прямые поставки в контейнерах, флекситанках и на паллетах",
      it: "Logistica Export Diretta per Container, Flexitank e Pallet",
    },
    subtitle: {
      tr: "Mersin ve İskenderun limanlarından FOB, CIF, CFR, DAP ve EXW teslim şekilleriyle 20' FCL, 40' HC ve 24 MT Flexitank yüklemeleri, SGS gözetimi ve tam ihracat evrak desteği.",
      en: "20ft FCL, 40ft HC, and 24 MT Flexitank vessel loadings from Mersin and Iskenderun ports under FOB, CIF, CFR, DAP, or EXW Incoterms with SGS survey and full customs documentation.",
      ar: "تحميل حاويات 20 قدم و40 قدم هاي كيوب وفلكسي تانك 24 طن من ميناءي مرسين وإسكندرون بشروط FOB وCIF وCFR وDAP مع فحص SGS وكامل وثائق التصدير.",
      fr: "Chargements 20' FCL, 40' HC et Flexitank 24 MT depuis les ports de Mersin et Iskenderun sous Incoterms FOB, CIF, CFR, DAP ou EXW avec inspection SGS.",
      de: "20'-FCL-, 40'-HC- und 24-MT-Flexitank-Verladungen ab den Häfen Mersin und Iskenderun unter FOB, CIF, CFR, DAP oder EXW inklusive SGS-Inspektion und Zolldokumenten.",
      es: "Cargas en contenedor 20' FCL, 40' HC y Flexitank de 24 TM desde los puertos de Mersin e Iskenderun bajo Incoterms FOB, CIF, CFR, DAP o EXW con inspección SGS.",
      ru: "Отгрузка контейнеров 20' FCL, 40' HC и флекситанков 24 т из портов Мерсин и Искендерун на условиях FOB, CIF, CFR, DAP и EXW с инспекцией SGS.",
      it: "Imbarchi 20' FCL, 40' HC e Flexitank da 24 MT dai porti di Mersin e Iskenderun con resa FOB, CIF, CFR, DAP o EXW, ispezione SGS e documentazione doganale.",
    },
    highlights: {
      tr: ["FOB / CIF / CFR / DAP / EXW", "20' FCL · 40' HC · 24 MT Flexitank", "SGS Gözetimi & Tam İhracat Evrakı"],
      en: ["FOB / CIF / CFR / DAP / EXW", "20' FCL · 40' HC · 24 MT Flexitank", "SGS Inspection & Export Dossier"],
      ar: ["شروط FOB / CIF / CFR / DAP", "حاويات 20 و40 قدم وفلكسي تانك 24 طن", "فحص SGS ووثائق تصدير كاملة"],
      fr: ["Incoterms FOB / CIF / CFR / DAP", "20' FCL · 40' HC · Flexitank 24 MT", "Inspection SGS & Liasse Export"],
      de: ["FOB / CIF / CFR / DAP / EXW", "20' FCL · 40' HC · 24 MT Flexitank", "SGS-Prüfung & Exportdokumente"],
      es: ["FOB / CIF / CFR / DAP / EXW", "20' FCL · 40' HC · Flexitank 24 TM", "Inspección SGS y Dossier Export"],
      ru: ["FOB / CIF / CFR / DAP / EXW", "20' FCL · 40' HC · Флекситанк 24 т", "Инспекция SGS и полный пакет документов"],
      it: ["FOB / CIF / CFR / DAP / EXW", "20' FCL · 40' HC · Flexitank 24 MT", "Ispezione SGS e Documenti Export"],
    },
  },
]

const UI_COPY: Record<
  Locale,
  {
    ctaQuote: string
    ctaProducts: string
    activeBadge: string
  }
> = {
  tr: {
    ctaQuote: "Toptan Teklif Al (RFQ)",
    ctaProducts: "Ürün Kataloğu",
    activeBadge: "Aktif",
  },
  en: {
    ctaQuote: "Request Bulk Quote (RFQ)",
    ctaProducts: "Product Catalog",
    activeBadge: "Active",
  },
  ar: {
    ctaQuote: "اطلب عرض سعر للجملة",
    ctaProducts: "كتالوج المنتجات",
    activeBadge: "نشط",
  },
  fr: {
    ctaQuote: "Demander un Devis (RFQ)",
    ctaProducts: "Catalogue Produits",
    activeBadge: "Actif",
  },
  de: {
    ctaQuote: "Großhandelsangebot (RFQ)",
    ctaProducts: "Produktkatalog",
    activeBadge: "Aktiv",
  },
  es: {
    ctaQuote: "Solicitar Cotización (RFQ)",
    ctaProducts: "Catálogo de Productos",
    activeBadge: "Activo",
  },
  ru: {
    ctaQuote: "Запросить Оптовый Прайс",
    ctaProducts: "Каталог Продукции",
    activeBadge: "Активно",
  },
  it: {
    ctaQuote: "Richiedi Preventivo (RFQ)",
    ctaProducts: "Catalogo Prodotti",
    activeBadge: "Attivo",
  },
}

const KEN_BURNS = ["kb-a", "kb-b", "kb-c", "kb-d", "kb-e"]

const MARQUEE_ITEMS = [
  "DIRECT EDIBLE OIL MANUFACTURER",
  "REFINED SUNFLOWER OIL EXPORTER",
  "EXTRA VIRGIN OLIVE OIL",
  "PRIVATE LABEL OEM BOTTLING",
  "1L - 5L PET & 18L TINPLATE",
  "24 MT FLEXITANK BULK",
  "ISO 22000 · FSSC 22000 · HALAL · KOSHER",
  "FOB MERSIN & CIF WORLDWIDE",
  "BATCH-LEVEL COA ANALYTICS",
]

export function HeroBanner({
  locale,
  whatsappNumber = "+90 543 975 01 32",
  labels,
}: Props) {
  // `cycle` increments on every slide change so the active image's Ken Burns run restarts via its key.
  const [slideState, setSlideState] = useState({ current: 0, previous: -1, cycle: 0 })
  const { current, previous, cycle } = slideState
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const isRtl = locale === "ar"
  const cleanWa = whatsappNumber.replace(/\D/g, "") || "905439750132"
  const ui = UI_COPY[locale] || UI_COPY.en

  const goTo = useCallback((resolve: (prev: number) => number) => {
    setSlideState((state) => {
      const next = ((resolve(state.current) % SLIDES.length) + SLIDES.length) % SLIDES.length
      if (next === state.current) return state
      return { current: next, previous: state.current, cycle: state.cycle + 1 }
    })
  }, [])

  const nextSlide = useCallback(() => goTo((prev) => prev + 1), [goTo])
  const prevSlide = useCallback(() => goTo((prev) => prev - 1), [goTo])

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextSlide, 7000)
    return () => clearInterval(interval)
  }, [isPaused, nextSlide])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0

    const update = () => {
      frame = 0
      if (motion.matches) {
        section.style.removeProperty("--hero-py")
        return
      }
      const offset = Math.min(section.offsetHeight, Math.max(0, -section.getBoundingClientRect().top))
      section.style.setProperty("--hero-py", `${(offset * 0.28).toFixed(1)}px`)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    motion.addEventListener("change", schedule)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      motion.removeEventListener("change", schedule)
    }
  }, [])

  const activeSlide = SLIDES[current]
  const tag = activeSlide.tag[locale] || activeSlide.tag.en
  const title = activeSlide.title[locale] || activeSlide.title.en
  const subtitle = activeSlide.subtitle[locale] || activeSlide.subtitle.en
  const highlights = activeSlide.highlights[locale] || activeSlide.highlights.en

  const whatsappPrefill = encodeURIComponent(
    locale === "tr"
      ? `Merhaba ASIA OIL, www.asiaoil.com.tr web sitenizden ulaşıyorum. "${title}" hakkında toptan ihracat teklifi almak istiyorum.`
      : `Hello ASIA OIL, I am contacting you via www.asiaoil.com.tr regarding "${title}". I would like to request a wholesale export quotation.`
  )

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-slate-50 text-slate-900 select-none border-b border-slate-200/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label={title}
    >
      {/* Background 4K Visual Showcase */}
      <div className="hero-stage absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {SLIDES.map((slide, idx) => {
          const isCurrent = idx === current
          const isPrevious = idx === previous
          const isNext = idx === (current + 1) % SLIDES.length
          const shouldRenderImg = idx === 0 || isCurrent || isPrevious || isNext
          const slideTitle = slide.title[locale] || slide.title.en
          // The current run gets a fresh key; the outgoing slide keeps its key so its motion freezes mid-fade.
          const imageKey = isCurrent ? `kb-${cycle}` : isPrevious ? `kb-${cycle - 1}` : slide.image
          return (
            <div
              key={slide.image}
              aria-hidden={!isCurrent}
              className={`hero-slide absolute inset-0 ${isCurrent ? "opacity-100" : "opacity-0"}`}
            >
              {shouldRenderImg && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={imageKey}
                  src={slide.image}
                  alt={slideTitle}
                  width={3840}
                  height={2160}
                  decoding={idx === 0 ? "sync" : "async"}
                  fetchPriority={idx === 0 ? "high" : "low"}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 w-full h-full object-cover object-right contrast-[1.08] saturate-[1.08] ${
                    isCurrent || isPrevious ? KEN_BURNS[idx % KEN_BURNS.length] : ""
                  } ${isPrevious ? "kb-hold" : ""}`}
                />
              )}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${
                  isRtl
                    ? "from-transparent via-white/92 via-62% to-white"
                    : "from-white via-white/92 via-38% to-transparent"
                }`}
              />
            </div>
          )
        })}
      </div>

      <div className="hero-grid absolute inset-0 z-0 opacity-25 pointer-events-none" />

      {/* Main Slide Content */}
      <div className="container-x relative z-10 pt-16 sm:pt-24 pb-12 flex-1 flex flex-col justify-center">
        <div key={cycle} className="max-w-3xl space-y-6">
          <div className="rise inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-700 text-white text-xs font-black tracking-widest uppercase shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{tag}</span>
          </div>

          <h1 className="rise rise-1 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.06] text-slate-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
            {title}
          </h1>

          <p className="rise rise-2 geo-summary text-base sm:text-lg text-slate-800 leading-relaxed max-w-2xl font-medium">
            {subtitle}
          </p>

          <div className="rise rise-3 flex flex-wrap gap-2.5 pt-2">
            {highlights.map((h) => (
              <span
                key={h}
                className="px-3.5 py-2 rounded-xl bg-white border-2 border-slate-300 text-xs font-extrabold text-slate-950 shadow-sm flex items-center gap-2 transition hover:border-emerald-600"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black inline-flex items-center justify-center">
                  ✓
                </span>
                {h}
              </span>
            ))}
          </div>

          <div className="rise rise-4 flex flex-wrap items-center gap-4 pt-4">
            <a
              href={pathFor(locale, "quote")}
              className="px-8 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 border-2 border-emerald-800 text-white font-black text-sm tracking-wide shadow-xl shadow-emerald-950/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <span>📦</span>
              <span>{ui.ctaQuote}</span>
            </a>

            <a
              href={`https://wa.me/${cleanWa}?text=${whatsappPrefill}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-white hover:bg-emerald-50 border-2 border-emerald-600 text-emerald-950 font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>WhatsApp: {whatsappNumber}</span>
            </a>

            <a
              href={pathFor(locale, "sunflower")}
              className="px-6 py-4 rounded-xl bg-slate-950 hover:bg-slate-800 border-2 border-slate-950 text-white font-extrabold text-sm shadow-md transition"
            >
              {ui.ctaProducts} &rarr;
            </a>
          </div>
        </div>

        {/* Left / Right Carousel Controls */}
        <div
          className={`hidden sm:flex items-center gap-3 absolute top-1/2 -translate-y-1/2 ${
            isRtl ? "left-6" : "right-6"
          }`}
        >
          <button
            type="button"
            onClick={prevSlide}
            aria-label={labels.previous}
            className="w-12 h-12 rounded-full bg-slate-950/90 hover:bg-emerald-700 border-2 border-white/90 text-white grid place-items-center shadow-xl transition hover:scale-110 active:scale-90 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label={labels.next}
            className="w-12 h-12 rounded-full bg-slate-950/90 hover:bg-emerald-700 border-2 border-white/90 text-white grid place-items-center shadow-xl transition hover:scale-110 active:scale-90 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Strip: 5 Slide Indicators */}
      <div className="relative z-10 border-t-2 border-slate-300 bg-white/95 backdrop-blur-xl py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
        <div className="container-x">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SLIDES.map((slide, i) => {
              const slideTitle = slide.tag[locale] || slide.tag.en
              const isActive = i === current
              return (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => goTo(() => i)}
                  className={`relative text-left p-3.5 rounded-2xl transition border-2 cursor-pointer ${
                    isActive
                      ? "bg-slate-950 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/30"
                      : "bg-slate-50 border-slate-300 hover:bg-white hover:border-emerald-600 text-slate-900 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono font-extrabold mb-1">
                    <span className={isActive ? "text-amber-400" : "text-emerald-800"}>
                      0{i + 1}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-sans text-[9px] uppercase tracking-wider font-black">
                        {ui.activeBadge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs font-extrabold line-clamp-1 leading-snug ${
                      isActive ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {slideTitle}
                  </p>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-b-2xl" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Marquee Ticker */}
      <div
        className="relative z-10 border-t border-slate-800 bg-slate-950 py-3 overflow-hidden"
        aria-hidden
      >
        <div className="marquee flex w-max gap-8 font-mono text-[11px] font-bold uppercase tracking-[.25em] text-slate-100">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((kw, i) => (
            <span key={`${kw}-${i}`} className="whitespace-nowrap flex items-center gap-4">
              <span className="text-amber-400 font-black">&bull;</span>
              {kw}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
