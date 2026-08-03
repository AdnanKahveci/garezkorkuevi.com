import { trackBookingCtaClick, trackPhoneCall, trackWhatsAppClick } from './googleAds';

function linkLabel(link: HTMLAnchorElement): string {
  return (link.textContent || link.getAttribute('aria-label') || 'link').trim().slice(0, 40);
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

      if (/wa\.me|whatsapp\.com/i.test(href)) {
        trackWhatsAppClick(linkLabel(link));
        return;
      }

      if (href.startsWith('tel:')) {
        trackPhoneCall();
        return;
      }

      const url = new URL(href, window.location.href);
      if (url.hash === '#rezervasyon') {
        trackBookingCtaClick(linkLabel(link));
      }
    },
    { capture: true, passive: true },
  );
}
