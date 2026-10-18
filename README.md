# Asia Oil

Uluslararası toptan ayçiçek yağı ve zeytinyağı sitesi. Her bölüm kendi adresinde yayınlanır. Sekiz dil açıktır: Türkçe, İngilizce, Arapça, Rusça, Almanca, Fransızca, İspanyolca ve İtalyanca.

## Sayfalar

Her dilin kendi yolu vardır.

| Sayfa | Türkçe | İngilizce |
| --- | --- | --- |
| Ana sayfa | `/tr` | `/en` |
| Ayçiçek yağı | `/tr/urunler/aycicek-yagi` | `/en/products/sunflower-oil` |
| Zeytinyağı | `/tr/urunler/zeytinyagi` | `/en/products/olive-oil` |
| Toptan | `/tr/toptan-yag` | `/en/wholesale-edible-oils` |
| İhracat | `/tr/uluslararasi-ticaret` | `/en/international-trade` |
| Özel marka | `/tr/ozel-marka` | `/en/private-label` |
| Kalite | `/tr/kalite-belgeleri` | `/en/quality-documents` |
| Kurumsal | `/tr/hakkimizda` | `/en/about` |
| Rehber | `/tr/rehber` | `/en/insights` |
| Teklif | `/tr/teklif-iste` | `/en/request-a-quote` |
| İletişim | `/tr/iletisim` | `/en/contact` |
| SSS | `/tr/sss` | `/en/faq` |
| Gizlilik | `/tr/gizlilik` | `/en/privacy` |

Rehberin altında dört ayrı yazı vardır. Almanca, Fransızca, İspanyolca, İtalyanca, Rusça ve Arapça adresler yönetim panelindeki Sayfalar ekranında listelenir.

## Çalıştırma

```bash
npm install
cp .env.example .env.local
npm run dev
```

Geliştirme adresi: `http://127.0.0.1:43123`

`NILASYA_SESSION_SECRET` ve `NILASYA_ADMIN_PASSWORD` değerlerini `.env.local` içine yazın. Parolayı depoya koymayın. Süper yönetici e-postası `cebrailkara@gmail.com`.

## Görseller

Hero dört kare döner: `public/media/hero/1.webp` … `4.webp`. Orijinaller `görsel/1.png` … `4.png` içinde durur. Bir orijinali değiştirdikten sonra WebP sürümlerini yeniden üretin:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\copy-gorsel.ps1
```

## Veri

Talepler sunucuda saklanır. Tarayıcıda localStorage veya sessionStorage kullanılmaz. Oturum HttpOnly çerezdir ve her oturum `admin_sessions` içinde kayıtlıdır; çıkış yapınca kayıt silinir ve çerez geçersiz olur.

Firestore şu durumlardan birinde kullanılır: `FIREBASE_SERVICE_ACCOUNT_JSON` tanımlı, `FIREBASE_USE_ADC=1`, ya da uygulama Cloud Run üzerinde çalışıyor. Koleksiyonlar:

| Koleksiyon | İçerik |
| --- | --- |
| `rfq_requests`, `contact_submissions` | Teklif ve iletişim talepleri |
| `control/state` | Ayarlar, kullanıcılar, MFA |
| `admin_sessions` | Açık yönetici oturumları |
| `audit_logs` | İşlem kayıtları |
| `analytics_visits`, `analytics_visitors` | Günlük ziyaret sayıları (yalnızca çerez izniyle) |
| `rate_limits` | Hız sınırı sayaçları |

`admin_sessions` ve `rate_limits` için Firestore TTL politikası `ttl` alanına göre açılabilir; süresi dolan kayıtlar kendiliğinden silinir.

Firestore yoksa geliştirmede `data/runtime.json` kullanılır. Production'da Firestore yoksa uygulama talebi kaybetmek yerine hata verir. Yerelde `next start` denemek için `NILASYA_ALLOW_FILE_STORE=1` verin.

Teklif formu sınırları: aynı IP için saatte 5, aynı e-posta için saatte 5, tüm site için saatte 300 talep. Firebase Hosting arkasında güvenilir bir istemci IP başlığı yoktur; IP sınırı tek başına yeterli sayılmamalıdır.

E-posta için `RESEND_API_KEY` ve `NOTIFY_FROM` gerekir. Anahtar yoksa talep panelde durur ve bildirim “sağlayıcı yapılandırılmadı” olarak işaretlenir.

## Komutlar

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## GitHub Actions

`.github/workflows/ci-deploy.yml` iki iş çalıştırır:

- **ci** — her push ve pull request'te `lint`, `typecheck`, `test`, `build`.
- **deploy** — yalnızca `main`'e push'ta ve CI geçtiyse `firebase deploy --only hosting:nilasyayag` (Next.js web frameworks). Dağıtım sonrası `https://nilasyayag.web.app/tr` için 200 kontrolü yapılır.

Deploy için depo ayarlarında (Settings → Secrets and variables → Actions) şunlar gerekir:

| Tür | Ad | Açıklama |
| --- | --- | --- |
| Secret | `FIREBASE_SERVICE_ACCOUNT` | `ajansonline` projesinde Firebase Hosting Admin + Cloud Functions Admin + Service Account User rolleri olan servis hesabının JSON anahtarı |
| Secret | `NILASYA_SESSION_SECRET` | Yönetici oturum imza anahtarı |
| Secret | `NILASYA_ADMIN_PASSWORD` | Süper yönetici parolası |
| Secret | `RESEND_API_KEY`, `NOTIFY_FROM` | E-posta bildirimi (isteğe bağlı) |
| Secret | `FIREBASE_WEB_API_KEY` | Diğer yönetici kullanıcıların Firebase Auth girişi için (isteğe bağlı) |
| Variable | `NEXT_PUBLIC_SITE_URL`, `NOTIFY_EMAIL` | Boşsa `https://www.asiaoil.com.tr` ve `export@asiaoil.com.tr` kullanılır |

İş akışı bu değerlerden `.env.local` üretir; Firebase CLI dosyayı Cloud Functions ortamına taşır. `DEPLOY.bat` / `DEPLOY.ps1` yerel dağıtım için kullanılmaya devam edebilir; ikisi aynı anda çalıştırılmamalıdır.

## Firebase Maliyet Optimizasyonu & Zamanlayici Notu (13.10.2026)

- **Deploy Gerekli mi?**: Hayir, zamanlayici (Cloud Scheduler) ayarlari Google Cloud uzerinde canli olarak guncellenmistir. Su an herhangi bir deploy yapilmasina gerek yoktur.
- **DEPLOY.bat Hakkinda**: Bu klasordeki DEPLOY.bat yalnizca hosting:nilasyayag dagitimi yapar; bot veya zamanlayici ayarlarini etkilemez ve guvenle calistirilabilir.
- **Ajans Online Bot Saatleri**:
  - scheduledNewsBot: Gunde 3 kez (08:00, 13:00, 19:00 - Turkiye Saati)
  - publishScheduledNews: Gunde 3 kez (08:15, 13:15, 19:15 - Turkiye Saati)
  - scheduledSocialDigest: Gunde 1 kez (20:00 - Turkiye Saati)
- **Maliyet Durumu**: Ayda ~13.680 tetiklemeden ayda ~210 tetiklemeye (%98,5 tasarruf) dusurulmus olup, Google Cloud'un aylik 2.000.000 ucretsiz cagri kotasi icinde kaldigi icin ek fatura cikarmaz.
