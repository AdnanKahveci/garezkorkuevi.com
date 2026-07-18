# Garez Korku Evi

Astro, TypeScript ve GSAP ile geliştirilen; WhatsApp rezervasyonu, erişilebilir ses tercihleri ve kontrollü korku efektleri içeren statik web sitesi.

## Kurulum

```bash
npm install
copy .env.example .env
npm run dev -- --background
```

`.env` içindeki `PUBLIC_WHATSAPP_NUMBER` değerini gerçek işletme numarasıyla, ülke kodu kullanarak girin (`905xxxxxxxxx`).

İşletme adresi, e-posta, harita, çalışma saatleri ve sosyal hesaplar doğrulandığında `src/config/site.ts` içindeki `BUSINESS` alanını güncelleyip `detailsVerified` değerini `true` yapın. Doğrulanmayan bilgiler yapılandırılmış veriye eklenmez.

## Kalite ve üretim

```bash
npm run check
npm run build
npm run preview
```

`dist/` içeriği statik hosting veya cPanel `public_html` dizinine yüklenebilir. `robots.txt`, XML sitemap, sosyal paylaşım görseli, güvenlik başlıkları ve `llms.txt` derlemeye otomatik eklenir.

## Deneyim sistemi

- İlk kullanıcı hareketinde doğrudan ses başlatma ve Web Audio yedek atmosferi
- Açık ses/sessiz deneyim ve azaltılmış hareket seçimi
- Oturum başına en fazla bir kontrollü jumpscare
- Rezervasyon alanında efekt güvenli bölgesi
- Masaüstü el feneri, sis, silüet ve kaydırma sahneleri
- WhatsApp'a isim, kişi sayısı, tarih ve saat aktaran randevu formu

Geliştirme sunucusunu `npx astro dev stop`, `npx astro dev status` ve `npx astro dev logs` komutlarıyla yönetebilirsiniz.
