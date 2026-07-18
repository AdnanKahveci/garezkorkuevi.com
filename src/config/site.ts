export const SITE = {
  name: 'Garez Korku Evi',
  shortName: 'Garez',
  url: 'https://garezkorkuevi.com',
  locale: 'tr_TR',
  language: 'tr',
  title: 'Korku Evi Deneyimi ve Rezervasyon | Garez Korku Evi',
  description:
    'Garez Korku Evi’nde canlı aktörler, karanlık parkurlar ve sinematik korku atmosferi seni bekliyor. Ekibini kur, WhatsApp üzerinden randevu talebi oluştur.',
  ogImage: '/images/og-garez-korku-evi.webp',
  keywords: [
    'korku evi',
    'Garez Korku Evi',
    'korku evi deneyimi',
    'korku evi rezervasyon',
    'canlı aktörlü korku evi',
    'korku oyunu',
    'evden kaçış oyunu',
  ],
} as const;

/**
 * İşletme bilgileri kesinleştiğinde bu alanları gerçek verilerle güncelleyin.
 * Doğrulanmamış adres/telefon LocalBusiness şemasına eklenmez.
 */
export const BUSINESS = {
  city: '',
  district: '',
  streetAddress: '',
  postalCode: '',
  phoneDisplay: '',
  phoneE164: '',
  email: '',
  openingHours: '',
  mapUrl: '',
  instagramUrl: '',
  detailsVerified: false,
} as const;

export const EXPERIENCE = {
  minGuests: 2,
  maxGuests: 8,
  durationLabel: 'yaklaşık 45 dakika',
  minimumAge: 12,
} as const;
