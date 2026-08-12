/** Google Tag Manager */
export const GTM = {
  id: 'GTM-TWHHZ6TK',
} as const;

/** Google Ads — dönüşüm etiketleri panelden alınır (AW-XXXX/etiket formatında etiket kısmı). */
export const GOOGLE_ADS = {
  id: 'AW-18382386124',
  conversionSendTo: 'AW-18382386124/KgZVCMaTnOAcEMzns71E',
  /** Boş bırakılırsa yalnızca conversionSendTo kullanılır. */
  conversions: {
    whatsapp: import.meta.env.PUBLIC_GADS_CONV_WHATSAPP || '',
    reservation: import.meta.env.PUBLIC_GADS_CONV_RESERVATION || '',
    phone: import.meta.env.PUBLIC_GADS_CONV_PHONE || '',
    bookingCta: import.meta.env.PUBLIC_GADS_CONV_BOOKING || '',
  },
} as const;

export type GoogleAdsConversionKey = keyof typeof GOOGLE_ADS.conversions;
