/** İletişim / rezervasyon — WhatsApp numarası (ülke kodu ile, + olmadan) */
export const WHATSAPP_NUMBER = '905551234567';

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function buildReservationWhatsAppUrl(guests: string, name?: string): string {
  const lines = [
    'Merhaba, Garez Korku Evi rezervasyon talebi:',
    `Kişi sayısı: ${guests}`,
  ];
  if (name?.trim()) lines.push(`İsim: ${name.trim()}`);
  lines.push('Uygun tarih için dönüş yapabilir misiniz?');

  return `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join('\n'))}`;
}
