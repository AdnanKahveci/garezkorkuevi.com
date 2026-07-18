import { isLiteMode } from '../scare-engine/ExperienceState';
import { sampleLibrary } from './SampleLibrary';
import {
  startHorrorDrone,
  playJumpscareStinger,
  playHorrorEvent,
  HORROR_EVENTS,
  type HorrorEventType,
} from './HorrorSounds';

export type SoundChannel =
  | 'ambient'
  | 'wind'
  | 'metal'
  | 'whisper'
  | 'door'
  | 'footsteps'
  | 'heartbeat'
  | 'jumpscare'
  | 'witch'
  | 'master';

export interface ChannelConfig {
  volume: number;
  enabled: boolean;
}

const DEFAULT_VOLUMES: Record<SoundChannel, number> = {
  master: 1,
  ambient: 0.85,
  wind: 0.2,
  metal: 0.15,
  whisper: 0.12,
  door: 0.3,
  footsteps: 0.22,
  heartbeat: 0.2,
  jumpscare: 0.85,
  witch: 0.8,
};

const LITE_VOLUMES: Record<SoundChannel, number> = {
  master: 1,
  ambient: 0.8,
  wind: 0.1,
  metal: 0.12,
  whisper: 0.08,
  door: 0.25,
  footsteps: 0.18,
  heartbeat: 0.18,
  jumpscare: 0.8,
  witch: 0.75,
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private channels: Map<SoundChannel, ChannelConfig> = new Map();
  private gainNodes: Map<SoundChannel, GainNode> = new Map();
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private initialized = false;
  private paused = false;
  private reservationDuck = false;
  private eventTimer: ReturnType<typeof setTimeout> | null = null;
  private masterEnabled = true;
  private lite = false;
  private stopDrone: (() => void) | null = null;
  private lastEvent: HorrorEventType | null = null;

  constructor() {
    this.applyVolumeProfile(false);
  }

  private applyVolumeProfile(lite: boolean): void {
    const profile = lite ? LITE_VOLUMES : DEFAULT_VOLUMES;
    Object.keys(profile).forEach((ch) => {
      this.channels.set(ch as SoundChannel, { volume: profile[ch as SoundChannel], enabled: true });
    });
  }

  private hctx(channel: SoundChannel) {
    return {
      ctx: this.ctx!,
      destination: this.gainNodes.get(channel) || this.masterGain!,
      volume: this.getChannelVolume(channel),
      lite: this.lite,
    };
  }

  async init(): Promise<void> {
    await this.prepareFromGesture();
  }

  /** Kullanıcı tıklamasında hızlı başlat — dosya yüklemesini beklemez */
  async prepareFromGesture(): Promise<void> {
    if (this.initialized) {
      await this.resume();
      return;
    }

    this.lite = isLiteMode();
    this.applyVolumeProfile(this.lite);

    this.ctx = new AudioContext();
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -20;
    this.compressor.knee.value = 8;
    this.compressor.ratio.value = 3;
    this.compressor.attack.value = 0.005;
    this.compressor.release.value = 0.2;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.getChannelVolume('master');
    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.ctx.destination);

    const channelList: SoundChannel[] = [
      'ambient', 'wind', 'metal', 'whisper', 'door', 'footsteps', 'heartbeat', 'jumpscare', 'witch',
    ];
    channelList.forEach((ch) => {
      const gain = this.ctx!.createGain();
      gain.gain.value = this.getChannelVolume(ch);
      gain.connect(this.masterGain!);
      this.gainNodes.set(ch, gain);
    });

    this.initialized = true;
    this.masterEnabled = true;
    this.setupVisibilityHandler();
    await this.resume();
  }

  /** Arka plan MP3 hazır olana kadar bekle */
  async ensureAmbientReady(): Promise<boolean> {
    if (!this.ctx) return false;
    return sampleLibrary.ensureAmbient(this.ctx);
  }

  /** Jumpscare MP3 hazır olana kadar bekle */
  async ensureJumpscareReady(): Promise<boolean> {
    if (!this.ctx) return false;
    return sampleLibrary.ensureJumpscare(this.ctx);
  }

  loadRemainingSamples(): void {
    if (!this.ctx) return;
    void sampleLibrary.preloadRest(this.ctx);
  }

  private setupVisibilityHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pause();
      else if (this.masterEnabled) {
        void this.resume().then(() => this.startAmbient());
      }
    });
  }

  private getChannelVolume(channel: SoundChannel): number {
    const config = this.channels.get(channel);
    const master = this.channels.get('master');
    if (!config || !master) return 0;
    if (!config.enabled || !master.enabled) return 0;
    if (channel === 'master') return master.volume;
    let vol = config.volume;
    if (this.reservationDuck && channel !== 'jumpscare' && channel !== 'witch') vol *= 0.25;
    return vol;
  }

  private updateGain(channel: SoundChannel): void {
    if (channel === 'master' && this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.getChannelVolume('master'), this.ctx.currentTime, 0.08);
      return;
    }
    const gain = this.gainNodes.get(channel);
    if (gain && this.ctx) {
      gain.gain.setTargetAtTime(this.getChannelVolume(channel), this.ctx.currentTime, 0.1);
    }
  }

  setChannelVolume(channel: SoundChannel, volume: number): void {
    const config = this.channels.get(channel);
    if (config) {
      config.volume = Math.max(0, Math.min(1, volume));
      this.updateGain(channel);
    }
  }

  setChannelEnabled(channel: SoundChannel, enabled: boolean): void {
    const config = this.channels.get(channel);
    if (config) {
      config.enabled = enabled;
      this.updateGain(channel);
    }
  }

  setMasterEnabled(enabled: boolean): void {
    this.masterEnabled = enabled;
    this.setChannelEnabled('master', enabled);
    if (!enabled) {
      this.stopScheduledSounds();
      this.stopAllAmbient();
    } else if (!this.paused) {
      this.startAmbient();
    }
  }

  setReservationDuck(duck: boolean): void {
    this.reservationDuck = duck;
    this.gainNodes.forEach((_, ch) => this.updateGain(ch));
  }

  duckAmbient(duck: boolean): void {
    const ambient = this.gainNodes.get('ambient');
    if (ambient && this.ctx) {
      const target = duck ? this.getChannelVolume('ambient') * 0.08 : this.getChannelVolume('ambient');
      ambient.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  startAmbient(): void {
    if (!this.ctx || !this.initialized || !this.masterEnabled) return;
    this.stopAllAmbient();

    this.startAmbientLoop();
  }

  private startAmbientLoop(): void {
    if (!this.ctx) return;
    const ambientCtx = this.hctx('ambient');

    const stop = sampleLibrary.playLoop(
      this.ctx,
      ambientCtx.destination,
      'ambientLoop',
      ambientCtx.volume * 1.15,
    );

    if (stop) {
      this.stopDrone = stop;
    } else {
      this.stopDrone = startHorrorDrone({
        ctx: this.ctx,
        destination: ambientCtx.destination,
        volume: ambientCtx.volume * 0.34,
        lite: this.lite,
      });
    }
  }

  playJumpscareSound(): void {
    if (!this.ctx || !this.masterEnabled) return;

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    const dest = this.gainNodes.get('jumpscare') || this.masterGain!;
    const vol = this.getChannelVolume('jumpscare');

    // Dosyanın ilk 2,43 saniyesi sessiz; doğrudan sesin başladığı noktadan çal.
    if (!sampleLibrary.play(this.ctx, dest, 'jumpscare', vol, { offset: 2.43 })) {
      playJumpscareStinger(this.hctx('jumpscare'));
    }
  }

  private stopScheduledSounds(): void {
    if (this.eventTimer) {
      clearTimeout(this.eventTimer);
      this.eventTimer = null;
    }
  }

  playDoorCreak(): void {
    if (!this.ctx || !this.masterEnabled) return;
    playHorrorEvent('door', this.hctx('door'));
  }

  playFootstep(): void {
    if (!this.ctx || !this.masterEnabled) return;
    playHorrorEvent('clang', { ...this.hctx('footsteps'), volume: this.getChannelVolume('footsteps') * 0.4 });
  }

  playHeartbeat(): void {
    if (!this.ctx || !this.masterEnabled) return;
    playHorrorEvent('heartbeat', this.hctx('heartbeat'));
  }

  playWitchLaugh(_intense = false): void {
    /* gülme sesi pasif */
  }

  /** Rastgele korku olayı — çeşitlilik için son olayı tekrar etmez */
  playRandomHorrorEvent(intense = false): void {
    if (!this.ctx || !this.masterEnabled || this.paused) return;

    let pool = [...HORROR_EVENTS].filter((e) => e !== 'witch' && e !== 'giggle');
    if (this.lite) pool = pool.filter((e) => e !== 'thunder');
    if (this.lastEvent) pool = pool.filter((e) => e !== this.lastEvent);
    if (pool.length === 0) return;

    const type = pool[Math.floor(Math.random() * pool.length)];
    this.lastEvent = type;

    const channelMap: Record<HorrorEventType, SoundChannel> = {
      witch: 'witch',
      scream: 'whisper',
      clang: 'metal',
      door: 'door',
      heartbeat: 'heartbeat',
      giggle: 'witch',
      thunder: 'ambient',
    };

    const ch = channelMap[type];
    const hctx = this.hctx(ch);

    if (type === 'scream' && sampleLibrary.has('horrorSting')) {
      const vol = this.getChannelVolume('whisper') * 0.7;
      sampleLibrary.play(this.ctx, this.gainNodes.get('whisper') || this.masterGain!, 'horrorSting', vol, { rate: 0.95 });
      return;
    }

    playHorrorEvent(type, hctx, intense || type === 'scream');
  }

  stopAllAmbient(): void {
    this.stopScheduledSounds();
    this.stopDrone?.();
    this.stopDrone = null;
  }

  pause(): void {
    if (this.ctx?.state === 'running') {
      this.ctx.suspend();
      this.paused = true;
    }
  }

  async resume(): Promise<void> {
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
      this.paused = false;
    }
  }

  isMasterEnabled(): boolean {
    return this.masterEnabled;
  }

  isContextRunning(): boolean {
    return Boolean(this.ctx && this.ctx.state === 'running' && this.masterEnabled && this.initialized);
  }

  destroy(): void {
    this.stopAllAmbient();
    sampleLibrary.clear();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.compressor = null;
    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const audioManager = new AudioManager();
