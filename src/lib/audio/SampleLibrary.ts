/**
 * MP3/WAV ses örnekleri — yalnızca dosyalardan çalar
 */

export const SAMPLE_URLS = {
  ambientLoop: '/audio/effects/ringtone.mp3',
  jumpscare: '/audio/effects/jumpscare.mp3',
  horrorSting: '/audio/effects/jumpscare.mp3',
} as const;

export type SampleId = keyof typeof SAMPLE_URLS;

class SampleLibrary {
  private buffers = new Map<SampleId, AudioBuffer>();
  private rawData = new Map<string, ArrayBuffer>();
  private fetchPromises = new Map<string, Promise<ArrayBuffer | null>>();
  private decodePromises = new Map<string, Promise<boolean>>();

  /** Sayfa açılınca dosyaları indir (decode yok — tarayıcı izni gerekmez) */
  prefetchFiles(): void {
    if (typeof window === 'undefined') return;
    const urls = [...new Set(Object.values(SAMPLE_URLS))];
    urls.forEach((url) => {
      if (this.rawData.has(url) || this.fetchPromises.has(url)) return;
      const promise = fetch(url)
        .then((res) => (res.ok ? res.arrayBuffer() : null))
        .catch(() => null);
      this.fetchPromises.set(url, promise);
      void promise.then((data) => {
        if (data) this.rawData.set(url, data);
        this.fetchPromises.delete(url);
      });
    });
  }

  private async getRawData(url: string): Promise<ArrayBuffer | null> {
    if (this.rawData.has(url)) return this.rawData.get(url)!;
    const pending = this.fetchPromises.get(url);
    if (pending) return pending;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.arrayBuffer();
      this.rawData.set(url, data);
      return data;
    } catch {
      return null;
    }
  }

  private async decodeUrl(ctx: AudioContext, id: SampleId, url: string): Promise<boolean> {
    if (this.buffers.has(id)) return true;

    const existing = this.decodePromises.get(url);
    if (existing) {
      const ok = await existing;
      return ok && this.buffers.has(id);
    }

    const promise = (async () => {
      try {
        const raw = await this.getRawData(url);
        if (!raw) {
          console.warn('Ses yüklenemedi:', url);
          return false;
        }
        const buffer = await ctx.decodeAudioData(raw.slice(0));
        this.buffers.set(id, buffer);
        (Object.keys(SAMPLE_URLS) as SampleId[]).forEach((otherId) => {
          if (SAMPLE_URLS[otherId] === url) this.buffers.set(otherId, buffer);
        });
        return true;
      } catch (err) {
        console.warn('Ses decode hatası:', url, err);
        return false;
      } finally {
        this.decodePromises.delete(url);
      }
    })();

    this.decodePromises.set(url, promise);
    return promise;
  }

  /** Arka plan döngüsünü hazırla — ilk tıklamada öncelikli */
  async ensureAmbient(ctx: AudioContext): Promise<boolean> {
    return this.decodeUrl(ctx, 'ambientLoop', SAMPLE_URLS.ambientLoop);
  }

  /** Jumpscare sesini önceden decode et — tetik anında gecikme olmasın */
  async ensureJumpscare(ctx: AudioContext): Promise<boolean> {
    return this.decodeUrl(ctx, 'jumpscare', SAMPLE_URLS.jumpscare);
  }

  async preload(ctx: AudioContext): Promise<void> {
    const ids = Object.keys(SAMPLE_URLS) as SampleId[];
    await Promise.all(ids.map((id) => this.decodeUrl(ctx, id, SAMPLE_URLS[id])));
  }

  async preloadRest(ctx: AudioContext): Promise<void> {
    const others = (Object.keys(SAMPLE_URLS) as SampleId[]).filter((id) => id !== 'ambientLoop');
    await Promise.all(others.map((id) => this.decodeUrl(ctx, id, SAMPLE_URLS[id])));
  }

  has(id: SampleId): boolean {
    return this.buffers.has(id);
  }

  play(
    ctx: AudioContext,
    destination: AudioNode,
    id: SampleId,
    volume: number,
    options: { rate?: number; offset?: number; duration?: number } = {},
  ): boolean {
    const buffer = this.buffers.get(id);
    if (!buffer) return false;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = options.rate ?? 1;

    const gain = ctx.createGain();
    gain.gain.value = Math.max(0, volume);

    source.connect(gain);
    gain.connect(destination);

    const offset = options.offset ?? 0;
    const dur = options.duration ?? buffer.duration - offset;
    source.start(ctx.currentTime, offset, Math.min(dur, buffer.duration - offset));
    return true;
  }

  playLoop(
    ctx: AudioContext,
    destination: AudioNode,
    id: SampleId,
    volume: number,
  ): (() => void) | null {
    const buffer = this.buffers.get(id);
    if (!buffer) return null;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = Math.max(0, volume);

    source.connect(gain);
    gain.connect(destination);
    source.start(ctx.currentTime);

    return () => {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
      source.disconnect();
      gain.disconnect();
    };
  }

  clear(): void {
    this.buffers.clear();
    this.decodePromises.clear();
  }
}

export const sampleLibrary = new SampleLibrary();

// Sayfa yüklenir yüklenmez ses dosyalarını indir
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => sampleLibrary.prefetchFiles());
  } else {
    sampleLibrary.prefetchFiles();
  }
}
