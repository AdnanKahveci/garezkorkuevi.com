import { isReducedMotion, getEffectiveFearLevel } from '../scare-engine/ExperienceState';
import { getFearConfig } from '../scare-engine/FearLevel';
import { isPageVisible } from './performance';

const GLITCH_CHARS = '█▓▒░@#$%&*!?/~\\|<>[]{}';

export function initGlitchSystem(): void {
  if (isReducedMotion()) return;

  const scheduleNext = () => {
    const config = getFearConfig(getEffectiveFearLevel());
    const baseInterval = 10000 + Math.random() * 15000;
    const interval = baseInterval / config.glitchFrequency;
    setTimeout(() => {
      if (isPageVisible()) triggerRandomGlitch();
      scheduleNext();
    }, interval);
  };
  scheduleNext();
}

function triggerRandomGlitch(): void {
  const elements = document.querySelectorAll('[data-glitch]');
  if (elements.length === 0) return;
  const el = elements[Math.floor(Math.random() * elements.length)] as HTMLElement;
  runGlitchOnElement(el);
}

export function runGlitchOnElement(el: HTMLElement, duration = 300): void {
  const original = el.textContent || '';
  const intensity = getFearConfig(getEffectiveFearLevel()).glitchFrequency;

  el.classList.add('glitch-active');
  let frame = 0;
  const maxFrames = Math.floor(duration / 50);

  const interval = setInterval(() => {
    if (frame >= maxFrames) {
      clearInterval(interval);
      el.textContent = original;
      el.classList.remove('glitch-active');
      return;
    }
    if (Math.random() < intensity * 0.5) {
      el.textContent = corruptText(original, 0.15);
    }
    frame++;
  }, 50);
}

function corruptText(text: string, rate: number): string {
  return text
    .split('')
    .map((ch) => (Math.random() < rate ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : ch))
    .join('');
}

export function addScanlineEffect(container: HTMLElement): void {
  const scanline = document.createElement('div');
  scanline.className = 'scanline-overlay';
  scanline.setAttribute('aria-hidden', 'true');
  container.appendChild(scanline);
}

export function addVHSNoise(container: HTMLElement): void {
  const noise = document.createElement('div');
  noise.className = 'vhs-noise';
  noise.setAttribute('aria-hidden', 'true');
  container.appendChild(noise);
}
