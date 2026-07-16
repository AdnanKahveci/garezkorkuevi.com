export type FearLevel = 'light' | 'normal' | 'intense';
export type AudioPreference = 'sound' | 'silent';
export type MotionPreference = 'full' | 'reduced';

export interface ExperiencePreferences {
  audio: AudioPreference;
  motion: MotionPreference;
  fearLevel: FearLevel;
  jumpscareEnabled: boolean;
  horrorEffectsEnabled: boolean;
  sessionStarted: boolean;
  gatePassed: boolean;
}

const STORAGE_KEY = 'horror-experience-prefs';

const defaults: ExperiencePreferences = {
  audio: 'sound',
  motion: 'full',
  fearLevel: 'intense',
  jumpscareEnabled: true,
  horrorEffectsEnabled: true,
  sessionStarted: true,
  gatePassed: true,
};

export function getPreferences(): ExperiencePreferences {
  if (typeof window === 'undefined') return { ...defaults };
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const merged = stored ? { ...defaults, ...JSON.parse(stored) } : { ...defaults };
    // Her sayfa yüklemesinde sesli + gate geçilmiş
    merged.audio = 'sound';
    merged.gatePassed = true;
    return merged;
  } catch { /* ignore */ }
  return { ...defaults };
}

export function savePreferences(prefs: Partial<ExperiencePreferences>): ExperiencePreferences {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('experience-prefs-changed', { detail: updated }));
  }
  return updated;
}

declare global {
  interface Window {
    __horrorBooted?: boolean;
  }
}

export function resetExperience(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem('horror-jumpscare-shown');
  sessionStorage.removeItem('horror-gate-passed');
  window.__horrorBooted = false;
  window.location.reload();
}

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const prefs = getPreferences();
  return prefs.motion === 'reduced';
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;
}

export function isLowPerformance(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (isMobile()) return true;
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  if (conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g') return true;
  if (conn?.effectiveType === '3g') return true;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;
  return false;
}

/** Mobil ve düşük performanslı cihazlar için hafif mod */
export function isLiteMode(): boolean {
  return isMobile() || isLowPerformance();
}

export function initMobilePerfMode(): void {
  if (typeof document === 'undefined') return;
  if (isLiteMode()) {
    document.documentElement.classList.add('lite-mode');
    document.body.classList.add('mobile-perf');
  }
}

export function getEffectiveFearLevel(): FearLevel {
  return 'intense';
}
