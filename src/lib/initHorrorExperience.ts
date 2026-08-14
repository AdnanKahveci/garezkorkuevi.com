import { initScrollScenes, playSideShadowPass } from './animation/scrollScenes';
import { initGlitchSystem } from './animation/glitch';
import { initPerformanceMonitor, shuffleArray, randomDelay } from './animation/performance';
import { getPreferences, isReducedMotion, isLiteMode, initMobilePerfMode, getEffectiveFearLevel } from './scare-engine/ExperienceState';
import { getFearConfig } from './scare-engine/FearLevel';
import {
  initJumpscareEngine,
  canTriggerBookingJumpscare,
  canTriggerScrollJumpscare,
  runBookingJumpscareSequence,
  runScrollJumpscareSequence,
  closeJumpscareOverlay,
  setHorrorSceneActive,
} from './scare-engine/JumpscareEngine';
import { audioManager } from './audio/AudioManager';

declare global {
  interface Window {
    __horrorBooted?: boolean;
  }
}

let ambientLoopStarted = false;

function startAmbientShadows(): void {
  if (ambientLoopStarted || isReducedMotion() || isLiteMode() || !document.getElementById('hikaye')) return;
  ambientLoopStarted = true;

  setTimeout(() => {
    if (!document.hidden) playSideShadowPass('left', '30%');
  }, 9000);

  const loop = () => {
    const delay = 28000 + Math.random() * 18000;
    setTimeout(() => {
      if (!document.hidden && !isReducedMotion()) {
        playSideShadowPass(
          Math.random() > 0.5 ? 'left' : 'right',
          `${15 + Math.random() * 55}%`,
        );
      }
      loop();
    }, delay);
  };
  setTimeout(loop, 24000);
}

function initSilhouettes(): void {
  if (isReducedMotion()) return;

  const config = getFearConfig(getEffectiveFearLevel());
  const count = isLiteMode() ? 1 : config.silhouetteCount;
  const all = Array.from(document.querySelectorAll('[data-silhouette]')) as HTMLElement[];
  const active = shuffleArray(all).slice(0, count);

  all.forEach((el) => { el.style.display = 'none'; });

  active.forEach((el, i) => {
    el.style.display = '';
    const delay = randomDelay(2000 + i * 3000, 10000 + i * 2000);
    const duration = randomDelay(1500, 3500);

    setTimeout(() => {
      el.classList.add('hidden-silhouette--visible');
      setTimeout(() => el.classList.remove('hidden-silhouette--visible'), duration);
    }, delay);
  });
}

let scrollJumpscareTriggered = false;

function scrollToReservation(): void {
  document.getElementById('rezervasyon')?.scrollIntoView({ behavior: 'smooth' });
}

function initBookingJumpscare(): void {
  if (isReducedMotion()) return;

  const overlay = document.getElementById('jumpscare-overlay');
  const imageEl = overlay?.querySelector('.jumpscare__image') as HTMLElement;
  const dismiss = document.getElementById('jumpscare-dismiss');
  const bookingButtons = document.querySelectorAll<HTMLAnchorElement>('#jumpscare-cta-book, #jumpscare-quick-book');
  if (!overlay || !imageEl) return;

  initJumpscareEngine();

  dismiss?.addEventListener('click', () => closeJumpscareOverlay(overlay));

  bookingButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      closeJumpscareOverlay(overlay);
      setTimeout(() => scrollToReservation(), 150);
    });
  });

  let storySceneActive = false;
  let retryTimer: number | undefined;

  const runScrollScare = async () => {
    if (scrollJumpscareTriggered || !storySceneActive) return;
    if (!canTriggerScrollJumpscare()) {
      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(runScrollScare, 600);
      return;
    }
    scrollJumpscareTriggered = true;

    void audioManager.ensureJumpscareReady();
    overlay.classList.add('jumpscare--active');
    await runScrollJumpscareSequence(
      overlay,
      imageEl,
      () => audioManager.playJumpscareSound(),
      (duck) => audioManager.duckAmbient(duck),
    );
  };

  document.querySelectorAll<HTMLAnchorElement>('a[data-jumpscare-booking]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      if (!canTriggerBookingJumpscare()) {
        scrollToReservation();
        return;
      }

      overlay.classList.add('jumpscare--active');
      void runBookingJumpscareSequence(
        overlay,
        imageEl,
        () => audioManager.playJumpscareSound(),
        (duck) => audioManager.duckAmbient(duck),
      );
    });
  });

  const hikayeTrigger = document.getElementById('jumpscare-hikaye-trigger');
  if (hikayeTrigger) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          storySceneActive = entry.isIntersecting;
          setHorrorSceneActive(entry.isIntersecting);
          if (entry.isIntersecting) void runScrollScare();
          else window.clearTimeout(retryTimer);
        });
      },
      { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' },
    );
    observer.observe(hikayeTrigger);
  }

}

export function bootHorrorExperience(): void {
  if (window.__horrorBooted) return;
  window.__horrorBooted = true;

  document.body.classList.add('experience-active', 'horror-live');

  try {
    initPerformanceMonitor();
    initScrollScenes();
    if (!isLiteMode()) initGlitchSystem();
    startAmbientShadows();
    initSilhouettes();
    initBookingJumpscare();

    const ts = document.getElementById('vhs-timestamp');
    if (ts) {
      const now = new Date();
      ts.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    }
  } catch (err) {
    console.error('Horror init hatası:', err);
  }
}

export function setupHorrorBoot(): void {
  initMobilePerfMode();

  window.addEventListener('experience-started', bootHorrorExperience);

  if (getPreferences().gatePassed) bootHorrorExperience();

  document.addEventListener('DOMContentLoaded', () => {
    if (getPreferences().gatePassed) bootHorrorExperience();
  });
}
