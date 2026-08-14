import type { FearLevel } from './ExperienceState';

export interface FearLevelConfig {
  jumpscareEnabled: boolean;
  ambientVolume: number;
  fastShadows: boolean;
  silhouetteCount: number;
  fogIntensity: number;
  glitchFrequency: number;
  spiderCount: number;
}

const configs: Record<FearLevel, FearLevelConfig> = {
  light: {
    jumpscareEnabled: false,
    ambientVolume: 0.15,
    fastShadows: false,
    silhouetteCount: 1,
    fogIntensity: 0.3,
    glitchFrequency: 0.3,
    spiderCount: 2,
  },
  normal: {
    jumpscareEnabled: true,
    ambientVolume: 0.35,
    fastShadows: true,
    silhouetteCount: 2,
    fogIntensity: 0.6,
    glitchFrequency: 0.6,
    spiderCount: 4,
  },
  intense: {
    jumpscareEnabled: true,
    ambientVolume: 0.55,
    fastShadows: true,
    silhouetteCount: 4,
    fogIntensity: 0.9,
    glitchFrequency: 1.0,
    spiderCount: 6,
  },
};

export function getFearConfig(level: FearLevel): FearLevelConfig {
  return configs[level];
}

export const FEAR_LEVEL_LABELS: Record<FearLevel, string> = {
  light: 'Hafif',
  normal: 'Normal',
  intense: 'Yoğun',
};
