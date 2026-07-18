import { BUSINESS } from './site';

/** İletişim / rezervasyon — PUBLIC_WHATSAPP_NUMBER ülke kodu ile girilebilir. */
const configuredNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER || BUSINESS.phoneE164;
export const WHATSAPP_NUMBER = configuredNumber.replace(/\D/g, '');

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

interface ReservationDetails {
  guests: string;
  name?: string;
  date?: string;
  time?: string;
}

function formatDate(date?: string): string | undefined {
  if (!date) return undefined;
  const [year, month, day] = date.split('-');
  return year && month && day ? `${day}.${month}.${year}` : date;
}

export function buildReservationWhatsAppUrl({ guests, name, date, time }: ReservationDetails): string {
  const lines = [
    'Merhaba, Garez Korku Evi rezervasyon talebi:',
    `Kişi sayısı: ${guests}`,
  ];
  if (name?.trim()) lines.push(`İsim: ${name.trim()}`);
  if (date) lines.push(`Tercih edilen tarih: ${formatDate(date)}`);
  if (time) lines.push(`Tercih edilen saat: ${time}`);
  lines.push('Uygun tarih için dönüş yapabilir misiniz?');

  return `${WHATSAPP_URL}?text=${encodeURIComponent(lines.join('\n'))}`;
}
