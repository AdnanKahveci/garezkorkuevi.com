import { GOOGLE_ADS, type GoogleAdsConversionKey } from '@/config/analytics';

function gtagSafe(...args: unknown[]) {
  if (typeof window.gtag === 'function') window.gtag(...args);
}

function sendConversion(key: GoogleAdsConversionKey, eventName: string, params?: Record<string, unknown>) {
  const label = GOOGLE_ADS.conversions[key];
  if (label) {
    gtagSafe('event', 'conversion', { send_to: `${GOOGLE_ADS.id}/${label}`, ...params });
  }
  gtagSafe('event', eventName, { event_category: 'lead', ...params });
}

export function trackWhatsAppClick(source?: string) {
  sendConversion('whatsapp', 'whatsapp_click', { event_label: source || 'link' });
}

export function trackPhoneCall() {
  sendConversion('phone', 'phone_call');
}

export function trackBookingCtaClick(source?: string) {
  sendConversion('bookingCta', 'booking_cta_click', { event_label: source || 'cta' });
}

export function trackReservationSubmit(details?: { guests?: string }) {
  sendConversion('reservation', 'reservation_submit', {
    event_label: 'form',
    ...(details?.guests ? { value: Number(details.guests) } : {}),
  });
  gtagSafe('event', 'generate_lead', { event_category: 'lead', event_label: 'reservation_form' });
}
