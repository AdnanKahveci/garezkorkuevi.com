import { GOOGLE_ADS } from '@/config/analytics';

<<<<<<< HEAD
/**
 * GTM'deki "Randevu rezervasyonu" etiketini tetikler.
 * Dönüşüm AW-18382386124/KgZVCMaTnOAcEMzns71E — GTM panelinde tanımlı.
 */
export function trackGoogleAdsLeadConversion(source?: string) {
=======
function gtagSafe(...args: unknown[]) {
  if (typeof window.gtag === 'function') window.gtag(...args);
}

/** Google Ads lead dönüşümü: AW-18382386124/KgZVCMaTnOAcEMzns71E */
export function trackGoogleAdsLeadConversion(source?: string) {
  gtagSafe('event', 'conversion', {
    send_to: GOOGLE_ADS.conversionSendTo,
  });

>>>>>>> 0e972ed62c8ae1f1e46518c188eec536512231af
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
