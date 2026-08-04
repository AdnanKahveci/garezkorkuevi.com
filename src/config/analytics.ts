/** Google Tag Manager */
export const GTM = {
  id: 'GTM-TWHHZ6TK',
} as const;

/** Google Ads — dönüşüm etiketleri panelden alınır (AW-XXXX/etiket formatında etiket kısmı). */
export const GOOGLE_ADS = {
  id: 'AW-18368375911',
  /** Boş bırakılırsa olay adı gönderilir; etiket eklenince dönüşüm sayılır. */
  conversions: {
    whatsapp: import.meta.env.PUBLIC_GADS_CONV_WHATSAPP || '',
    reservation: import.meta.env.PUBLIC_GADS_CONV_RESERVATION || '',
    phone: import.meta.env.PUBLIC_GADS_CONV_PHONE || '',
    bookingCta: import.meta.env.PUBLIC_GADS_CONV_BOOKING || '',
  },
} as const;

export type GoogleAdsConversionKey = keyof typeof GOOGLE_ADS.conversions;
