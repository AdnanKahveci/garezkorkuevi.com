/** Kenardan geçen görseller — korkunç yüz */
export const CREATURE_SILHOUETTES = [
  '/images/jumpscare/garez-yuz.png',
] as const;

export function randomCreatureSilhouette(_exclude?: string): string {
  return '/images/jumpscare/garez-yuz.png';
}

export function creatureForDirection(_direction: 'left' | 'right'): string {
  return '/images/jumpscare/garez-yuz.png';
}
