# Korku Deneyimi — Sinematik Animasyon Sistemi

Etkileşimli korku deneyimi web sitesi. Astro + TypeScript + GSAP ile geliştirilmiştir.

## Kurulum

```bash
npm install
npm run dev
```

## Production Build (cPanel)

```bash
npm run build
```

`dist/` klasörünün içeriğini cPanel `public_html` klasörüne yükleyin.
`contact.php` dosyası `public/` altında olduğu için otomatik olarak `dist/` içine kopyalanır.

## Özellikler

- Sinematik giriş kapısı (ses/sessiz/azaltılmış hareket)
- El feneri imleci (masaüstü)
- Örümcek ağları ve hareketli örümcekler
- Katmanlı sis ve parçacık sistemi
- Gizli silüetler
- GSAP ScrollTrigger korku sahneleri
- Kontrollü jumpscare (oturum başına 1 kez)
- Web Audio API ortam sesi
- Glitch ve VHS efektleri
- Sayfa geçiş animasyonları
- Korku seviyesi ayarı (Hafif/Normal/Yoğun)
- PHP iletişim formu
- Erişilebilirlik kontrolleri

## Yapılandırma

- `public/contact.php` — E-posta adresini güncelleyin
- `public/audio/` — Production ses dosyalarını ekleyin
- `public/images/` — Gerçek görsellerle SVG placeholder'ları değiştirin

## Test Senaryoları

Giriş ekranından farklı modları seçerek test edin:
- Sesli / Sessiz deneyim
- Hareketleri azalt
- Korku seviyesi: Hafif / Normal / Yoğun
- Header'daki ayarlar panelinden jumpscare ve efektleri kapatma
