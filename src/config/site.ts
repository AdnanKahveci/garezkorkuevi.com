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
 * İşletme bilgileri. detailsVerified true iken adres/telefon şema ve arayüzde görünür.
 */
export const BUSINESS = {
  city: 'İstanbul',
  district: 'Maltepe',
  streetAddress: 'Cevizli Mah. Bağdat Cad., Güvenli Sk. No:2 Daire: 8',
  postalCode: '34844',
  phoneDisplay: '0545 504 27 39',
  phoneE164: '905455042739',
  email: '',
  openingHours: '',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Cevizli+Mah.+Ba%C4%9Fdat+Cad.+G%C3%BCvenli+Sk.+No:2+Daire:8+34844+Maltepe+%C4%B0stanbul',
  instagramUrl: '',
  detailsVerified: true,
} as const;

/** Tek satırda görünen tam adres */
export const BUSINESS_ADDRESS = [
  BUSINESS.streetAddress,
  `${BUSINESS.postalCode} ${BUSINESS.district}/${BUSINESS.city}`,
].join(', ');

export const EXPERIENCE = {
  minGuests: 2,
  maxGuests: 8,
  durationLabel: 'yaklaşık 45 dakika',
  minimumAge: 12,
} as const;
