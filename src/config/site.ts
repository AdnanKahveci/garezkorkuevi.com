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
const MAP_QUERY =
  'Cevizli Mah. Bağdat Cad. Güvenli Sk. No:2 Daire:8 34844 Maltepe İstanbul';

export const BUSINESS = {
  city: 'İstanbul',
  district: 'Maltepe',
  streetAddress: 'Cevizli Mah. Bağdat Cad., Güvenli Sk. No:2 Daire: 8',
  postalCode: '34844',
  phoneDisplay: '0545 504 27 39',
  phoneE164: '905455042739',
  email: '',
  openingHours: '',
  /** Google Haritalar konum sayfası */
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`,
  /** Google Haritalar yol tarifi */
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`,
  /** Sayfada gömülü harita */
  mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=16&output=embed`,
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
