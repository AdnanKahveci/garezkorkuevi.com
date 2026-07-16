import { savePreferences } from '../scare-engine/ExperienceState';
import { audioManager } from './AudioManager';

let gestureUnlockAttached = false;

async function startSound(): Promise<boolean> {
  savePreferences({ audio: 'sound', gatePassed: true, sessionStarted: true });
  await audioManager.prepareFromGesture();
  await Promise.all([
    audioManager.ensureAmbientReady(),
    audioManager.ensureJumpscareReady(),
  ]);
  audioManager.setChannelVolume('master', 1);
  audioManager.setMasterEnabled(true);
  audioManager.startAmbient();
  audioManager.loadRemainingSamples();
  window.dispatchEvent(new CustomEvent('audio-ready'));
  return audioManager.isContextRunning();
}

function attachGestureUnlock(): void {
  if (gestureUnlockAttached || typeof document === 'undefined') return;
  gestureUnlockAttached = true;

  const unlock = () => {
    void startSound();
  };

  document.addEventListener('pointerdown', unlock, { once: true, capture: true, passive: true });
  document.addEventListener('touchstart', unlock, { once: true, capture: true, passive: true });
  document.addEventListener('keydown', unlock, { once: true, capture: true });
}

/** İlk dokunuşta sesi aç (gate geçilmiş sayfa yenilemesi için) */
export function ensureGestureAudioUnlock(): void {
  attachGestureUnlock();
}

/** Sesli deneyimi başlat — kullanıcı tıklaması ile */
export async function bootstrapSoundExperience(): Promise<boolean> {
  try {
    return await startSound();
  } catch (err) {
    console.warn('Ses başlatılamadı:', err);
    ensureGestureAudioUnlock();
    return false;
  }
}

export function isSoundEnabled(): boolean {
  return audioManager.isMasterEnabled() && audioManager.isContextRunning();
}
