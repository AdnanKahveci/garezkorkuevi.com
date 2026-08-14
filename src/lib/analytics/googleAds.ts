import { GOOGLE_ADS } from '@/config/analytics';

/** GTM "Randevu rezervasyonu" etiketini tetikler — dönüşüm yalnızca GTM üzerinden gider. */
export function trackGoogleAdsLeadConversion(source?: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'google_ads_lead',
    gads_conversion_send_to: GOOGLE_ADS.conversionSendTo,
    ...(source ? { lead_source: source } : {}),
  });
}

export function trackWhatsAppClick(source?: string) {
  trackGoogleAdsLeadConversion(source ? `whatsapp:${source}` : 'whatsapp');
}

export function trackBookingCtaClick(source?: string) {
  trackGoogleAdsLeadConversion(source ? `booking:${source}` : 'booking');
}

export function trackReservationSubmit() {
  trackGoogleAdsLeadConversion('reservation_form');
}
