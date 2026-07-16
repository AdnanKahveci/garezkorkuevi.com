let lowPerfMode = false;
let rafId: number | null = null;
const callbacks: Set<() => void> = new Set();
let pageVisible = true;

export function initPerformanceMonitor(): void {
  lowPerfMode = detectLowPerformance();
  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    if (!pageVisible) stopAnimationLoop();
    else startAnimationLoop();
  });
}

function detectLowPerformance(): boolean {
  if (window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window) return true;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  if (conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '3g') return true;
  return false;
}

export function isLowPerfMode(): boolean {
  return lowPerfMode;
}

export function isPageVisible(): boolean {
  return pageVisible;
}

export function onAnimationFrame(cb: () => void): () => void {
  callbacks.add(cb);
  if (callbacks.size === 1) startAnimationLoop();
  return () => {
    callbacks.delete(cb);
    if (callbacks.size === 0) stopAnimationLoop();
  };
}

function startAnimationLoop(): void {
  if (rafId !== null || !pageVisible) return;
  const loop = () => {
    callbacks.forEach((cb) => cb());
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
}

function stopAnimationLoop(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function randomDelay(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
