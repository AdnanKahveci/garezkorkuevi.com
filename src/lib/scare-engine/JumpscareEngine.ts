import { getPreferences, isReducedMotion, getEffectiveFearLevel } from './ExperienceState';
import { getFearConfig } from './FearLevel';
import { JUMPSCARE_FACE_IMAGE } from '@/config/jumpscare';

export interface JumpscareConditions {
  gatePassed: boolean;
  minTimeElapsed: boolean;
  inHorrorScene: boolean;
  notInForm: boolean;
  menuClosed: boolean;
  lightboxClosed: boolean;
  notInReservation: boolean;
  reducedMotionOff: boolean;
  notShownThisSession: boolean;
  jumpscareEnabled: boolean;
}

const MIN_DELAY_MS = 6000;
let siteEntryTime = Date.now();
let scrollJumpscareShownThisPage = false;
let jumpscareInProgress = false;
let conditions: Partial<JumpscareConditions> = {};

export function initJumpscareEngine(): void {
  siteEntryTime = Date.now();
  scrollJumpscareShownThisPage = false;
  jumpscareInProgress = false;
  updateConditions();
  window.addEventListener('experience-prefs-changed', () => updateConditions());
  document.addEventListener('focusin', checkFormFocus);
  document.addEventListener('focusout', checkFormFocus);
  window.addEventListener('horror-menu-state', (event) => {
    const { open = false } = (event as CustomEvent<{ open?: boolean }>).detail || {};
    setMenuOpen(Boolean(open));
  });
}

function checkFormFocus(): void {
  const active = document.activeElement;
  conditions.notInForm = !(active && (
    active.tagName === 'INPUT' ||
    active.tagName === 'TEXTAREA' ||
    active.tagName === 'SELECT'
  ));
}

export function updateConditions(partial?: Partial<JumpscareConditions>): void {
  const prefs = getPreferences();
  const fearConfig = getFearConfig(getEffectiveFearLevel());

  conditions = {
    gatePassed: prefs.gatePassed,
    minTimeElapsed: Date.now() - siteEntryTime >= MIN_DELAY_MS,
    inHorrorScene: conditions.inHorrorScene ?? false,
    notInForm: conditions.notInForm ?? true,
    menuClosed: conditions.menuClosed ?? true,
    lightboxClosed: conditions.lightboxClosed ?? true,
    notInReservation: conditions.notInReservation ?? true,
    reducedMotionOff: !isReducedMotion(),
    notShownThisSession: !scrollJumpscareShownThisPage,
    jumpscareEnabled: prefs.jumpscareEnabled && fearConfig.jumpscareEnabled,
    ...partial,
  };
}

export function canTriggerScrollJumpscare(): boolean {
  updateConditions();
  const c = conditions as JumpscareConditions;
  return (
    c.gatePassed &&
    c.minTimeElapsed &&
    c.inHorrorScene &&
    c.notInForm &&
    c.menuClosed &&
    c.lightboxClosed &&
    c.notInReservation &&
    c.reducedMotionOff &&
    c.notShownThisSession &&
    c.jumpscareEnabled &&
    !jumpscareInProgress
  );
}

export function canTriggerBookingJumpscare(): boolean {
  const prefs = getPreferences();
  const fearConfig = getFearConfig(getEffectiveFearLevel());
  return (
    prefs.gatePassed &&
    !isReducedMotion() &&
    !jumpscareInProgress &&
    prefs.jumpscareEnabled &&
    fearConfig.jumpscareEnabled
  );
}

export function isJumpscareInProgress(): boolean {
  return jumpscareInProgress;
}

export function setHorrorSceneActive(active: boolean): void {
  updateConditions({ inHorrorScene: active });
}

export function setMenuOpen(open: boolean): void {
  updateConditions({ menuClosed: !open });
}

export function setLightboxOpen(open: boolean): void {
  updateConditions({ lightboxClosed: !open });
}

export function setInReservation(inReservation: boolean): void {
  updateConditions({ notInReservation: !inReservation });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resetOverlayState(overlay: HTMLElement): void {
  overlay.classList.remove('jumpscare--shake', 'jumpscare--spotlight', 'jumpscare--booking', 'jumpscare--scroll');
  overlay.querySelector('.jumpscare__flash')?.classList.remove('jumpscare__flash--on');
  overlay.querySelector('.jumpscare__red-pulse')?.classList.remove('jumpscare__red-pulse--on');
  overlay.querySelectorAll('.jumpscare__shadow').forEach((s) => s.classList.remove('jumpscare__shadow--active'));
  overlay.querySelector('.jumpscare__image')?.classList.remove('jumpscare__image--visible', 'jumpscare__image--glitch', 'jumpscare__image--spotlight');
  const scream = overlay.querySelector('.jumpscare__scream') as HTMLElement | null;
  if (scream) scream.textContent = 'BORCUN HAZIR...';
  const cta = overlay.querySelector('.jumpscare__cta') as HTMLElement;
  if (cta) {
    cta.classList.remove('jumpscare__cta--visible');
    cta.hidden = true;
  }
}

function showCta(overlay: HTMLElement): void {
  const cta = overlay.querySelector('.jumpscare__cta') as HTMLElement | null;
  if (!cta) return;
  cta.hidden = false;
  requestAnimationFrame(() => cta.classList.add('jumpscare__cta--visible'));
}

function setScreamText(overlay: HTMLElement, text: string): void {
  const scream = overlay.querySelector('.jumpscare__scream') as HTMLElement | null;
  if (scream) scream.textContent = text;
}

/** Kaydırınca Olay Kayıtları ortasında — yüz + ardından randevu butonu */
export async function runScrollJumpscareSequence(
  overlay: HTMLElement,
  imageEl: HTMLElement,
  onSound: () => void,
  onAmbientDuck: (duck: boolean) => void,
): Promise<void> {
  if (jumpscareInProgress) return;
  jumpscareInProgress = true;
  scrollJumpscareShownThisPage = true;
  resetOverlayState(overlay);
  overlay.classList.add('jumpscare--scroll');

  const flash = overlay.querySelector('.jumpscare__flash');
  const redPulse = overlay.querySelector('.jumpscare__red-pulse');
  const shadowLeft = overlay.querySelector('.jumpscare__shadow--left');
  const shadowRight = overlay.querySelector('.jumpscare__shadow--right');

  onAmbientDuck(true);

  redPulse?.classList.add('jumpscare__red-pulse--on');
  overlay.classList.add('jumpscare--shake');
  flash?.classList.add('jumpscare__flash--on');

  // Yüz + ses aynı anda — gecikmesiz vuruş
  setScreamText(overlay, 'BORCUN HAZIR...');
  overlay.classList.add('jumpscare--spotlight');
  imageEl.classList.add('jumpscare__image--visible', 'jumpscare__image--glitch');
  shadowLeft?.classList.add('jumpscare__shadow--active');
  onSound();

  await wait(80);
  flash?.classList.remove('jumpscare__flash--on');
  await wait(2000);

  shadowRight?.classList.add('jumpscare__shadow--active');
  await wait(500);

  overlay.classList.remove('jumpscare--shake', 'jumpscare--spotlight');
  imageEl.classList.remove('jumpscare__image--visible', 'jumpscare__image--glitch');
  shadowLeft?.classList.remove('jumpscare__shadow--active');
  shadowRight?.classList.remove('jumpscare__shadow--active');
  redPulse?.classList.remove('jumpscare__red-pulse--on');
  await wait(250);

  showCta(overlay);
  onAmbientDuck(false);
  // CTA açık kalır — kapatılana / randevuya tıklayana kadar
}

/** Randevu Al tıklanınca — cesaret mesajı, sonra CTA / forma */
export async function runBookingJumpscareSequence(
  overlay: HTMLElement,
  imageEl: HTMLElement,
  onSound: () => void,
  onAmbientDuck: (duck: boolean) => void,
): Promise<void> {
  if (jumpscareInProgress) return;
  jumpscareInProgress = true;
  resetOverlayState(overlay);
  overlay.classList.add('jumpscare--booking');

  const flash = overlay.querySelector('.jumpscare__flash');
  const redPulse = overlay.querySelector('.jumpscare__red-pulse');

  onAmbientDuck(true);

  redPulse?.classList.add('jumpscare__red-pulse--on');
  overlay.classList.add('jumpscare--shake');
  flash?.classList.add('jumpscare__flash--on');

  setScreamText(overlay, 'GAREZE RANDEVU ALACAK KADAR CESARETİN VAR MI?');
  overlay.classList.add('jumpscare--spotlight');
  imageEl.classList.add('jumpscare__image--visible', 'jumpscare__image--glitch');
  onSound();

  await wait(80);
  flash?.classList.remove('jumpscare__flash--on');
  await wait(2000);

  overlay.classList.remove('jumpscare--shake', 'jumpscare--spotlight');
  imageEl.classList.remove('jumpscare__image--visible', 'jumpscare__image--glitch');
  redPulse?.classList.remove('jumpscare__red-pulse--on');
  await wait(200);

  showCta(overlay);
  onAmbientDuck(false);
}

export function closeJumpscareOverlay(overlay: HTMLElement): void {
  resetOverlayState(overlay);
  overlay.classList.remove('jumpscare--active', 'jumpscare--booking', 'jumpscare--scroll');
  jumpscareInProgress = false;
}

export function preloadJumpscareAssets(): void {
  const img = new Image();
  img.src = JUMPSCARE_FACE_IMAGE;
}
