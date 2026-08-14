import { trackBookingCtaClick, trackWhatsAppClick } from './googleAds';

function linkLabel(link: HTMLAnchorElement): string {
  return (link.textContent || link.getAttribute('aria-label') || 'link').trim().slice(0, 40);
}

function isBookingLink(link: HTMLAnchorElement, url: URL): boolean {
  if (link.dataset.gadsLead === 'booking') return true;
  return url.hash === '#rezervasyon';
}

function isWhatsAppLink(link: HTMLAnchorElement, href: string): boolean {
  if (link.dataset.gadsLead === 'whatsapp') return true;
  return /wa\.me|whatsapp\.com/i.test(href);
}

export function initGoogleAdsClickTracking() {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest('a[href]');
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.href;
      const url = new URL(href, window.location.href);

      if (isWhatsAppLink(link, href)) {
        trackWhatsAppClick(linkLabel(link));
        return;
      }

      if (isBookingLink(link, url)) {
        trackBookingCtaClick(linkLabel(link));
      }
    },
    { capture: true, passive: true },
  );
}
