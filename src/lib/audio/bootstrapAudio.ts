import { savePreferences } from '../scare-engine/ExperienceState';
import { audioManager } from './AudioManager';

let gestureUnlockAttached = false;
let startPromise: Promise<boolean> | null = null;

async function startSound(): Promise<boolean> {
  savePreferences({ audio: 'sound', gatePassed: true, sessionStarted: true });
  await audioManager.prepareFromGesture();
  audioManager.setChannelVolume('master', 0.72);
  audioManager.setMasterEnabled(true);

  // MP3 decode edilmesini beklemeden prosedürel drone ile anında sesli geri bildirim ver.
  audioManager.startAmbient();
  window.dispatchEvent(new CustomEvent('audio-ready', { detail: { volume: 0.72 } }));

  void Promise.all([
    audioManager.ensureAmbientReady(),
    audioManager.ensureJumpscareReady(),
  ]).then(([ambientReady]) => {
    if (ambientReady && audioManager.isContextRunning()) audioManager.startAmbient();
    audioManager.loadRemainingSamples();
  });

  return audioManager.isContextRunning();
}

function attachGestureUnlock(): void {
  if (gestureUnlockAttached || typeof document === 'undefined') return;
  gestureUnlockAttached = true;

  const unlock = () => {
    document.removeEventListener('pointerdown', unlock, true);
    document.removeEventListener('touchstart', unlock, true);
    document.removeEventListener('keydown', unlock, true);
    gestureUnlockAttached = false;
    void bootstrapSoundExperience();
  };

  document.addEventListener('pointerdown', unlock, { capture: true, passive: true });
  document.addEventListener('touchstart', unlock, { capture: true, passive: true });
  document.addEventListener('keydown', unlock, { capture: true });
}

/** İlk dokunuşta sesi aç (gate geçilmiş sayfa yenilemesi için) */
export function ensureGestureAudioUnlock(): void {
  attachGestureUnlock();
}

/** Sesli deneyimi başlat — kullanıcı tıklaması ile */
export async function bootstrapSoundExperience(): Promise<boolean> {
  if (startPromise) return startPromise;

  startPromise = (async () => {
  try {
    return await startSound();
  } catch (err) {
    console.warn('Ses başlatılamadı:', err);
    ensureGestureAudioUnlock();
    return false;
    } finally {
      startPromise = null;
    }
  })();

  return startPromise;
}

export function isSoundEnabled(): boolean {
  return audioManager.isMasterEnabled() && audioManager.isContextRunning();
}
