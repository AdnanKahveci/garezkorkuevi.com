/**
 * Prosedürel korku ses sentezi — katmanlı, sinematik efektler
 */

export interface HorrorSoundContext {
  ctx: AudioContext;
  destination: AudioNode;
  volume: number;
  lite?: boolean;
}

function noiseBuffer(ctx: AudioContext, seconds: number, fade = false): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    let v = Math.random() * 2 - 1;
    if (fade) v *= 1 - i / len;
    data[i] = v;
  }
  return buf;
}

function createReverb(ctx: AudioContext, seconds = 1.8, decay = 2.5): ConvolverNode {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

function connectWithReverb(
  ctx: AudioContext,
  source: AudioNode,
  dest: AudioNode,
  vol: number,
  reverbMix = 0.35,
  useReverb = true,
): void {
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  dry.gain.value = vol * (1 - reverbMix);
  wet.gain.value = vol * reverbMix;

  source.connect(dry);
  dry.connect(dest);

  if (useReverb) {
    const rev = createReverb(ctx);
    source.connect(rev);
    rev.connect(wet);
    wet.connect(dest);
  }
}

/** Derin yeraltı drone — gerilim tabanı */
export function startHorrorDrone({ ctx, destination, volume, lite }: HorrorSoundContext): () => void {
  const nodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
  const gains: GainNode[] = [];

  const bus = ctx.createGain();
  bus.gain.value = volume;

  const freqs = lite ? [48, 51] : [42, 46.5, 49];
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = i === 0 ? 'sawtooth' : 'sine';
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = 0.12 / freqs.length;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 180;
    osc.connect(lp);
    lp.connect(g);
    g.connect(bus);
    osc.start();
    nodes.push(osc);
    gains.push(g);
  });

  // Yavaş nefes — filter sweep
  const lfo = ctx.createOscillator();
  const lfoG = ctx.createGain();
  lfo.frequency.value = 0.08;
  lfoG.gain.value = 60;
  const sweepFilter = ctx.createBiquadFilter();
  sweepFilter.type = 'lowpass';
  sweepFilter.frequency.value = 120;
  lfo.connect(lfoG);
  lfoG.connect(sweepFilter.frequency);
  bus.connect(sweepFilter);
  sweepFilter.connect(destination);
  lfo.start();
  nodes.push(lfo);

  if (!lite) {
    const wind = ctx.createBufferSource();
    wind.buffer = noiseBuffer(ctx, 2);
    wind.loop = true;
    const wf = ctx.createBiquadFilter();
    wf.type = 'bandpass';
    wf.frequency.value = 400;
    wf.Q.value = 0.8;
    const wg = ctx.createGain();
    wg.gain.value = 0.04;
    wind.connect(wf);
    wf.connect(wg);
    wg.connect(bus);
    wind.start();
    nodes.push(wind);
  }

  return () => {
    nodes.forEach((n) => { try { n.stop(); } catch { /* */ } });
    bus.disconnect();
  };
}

/** Uzaktan fısıltı rüzgarı */
export function startWhisperWind({ ctx, destination, volume }: HorrorSoundContext): () => void {
  const wind = ctx.createBufferSource();
  wind.buffer = noiseBuffer(ctx, 1.5);
  wind.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2200;
  bp.Q.value = 4;
  const g = ctx.createGain();
  g.gain.value = volume * 0.35;
  wind.connect(bp);
  bp.connect(g);
  g.connect(destination);
  wind.start();
  return () => { try { wind.stop(); } catch { /* */ } };
}

/** Cadı gülüşü — formant katmanlı, artan tempo */
export function playWitchCackle({ ctx, destination, volume, lite }: HorrorSoundContext, intense = false): void {
  const now = ctx.currentTime;
  const pattern = intense
    ? [0, 0.11, 0.21, 0.32, 0.44, 0.58, 0.78, 1.05]
    : lite
      ? [0, 0.15, 0.32, 0.55, 0.85]
      : [0, 0.13, 0.26, 0.4, 0.55, 0.75, 1.0];

  const formants = lite ? [650, 1400] : [580, 950, 2100];

  pattern.forEach((offset, i) => {
    const start = now + offset;
    const isLast = i === pattern.length - 1;
    const dur = isLast ? 0.65 : 0.09 + Math.random() * 0.05;
    const pitchBase = intense ? 340 + i * 45 : 300 + i * 38;
    const pitchEnd = isLast ? pitchBase * 0.45 : pitchBase * (1.2 + Math.random() * 0.15);
    const pan = (i % 2 === 0 ? -1 : 1) * (0.4 + Math.random() * 0.3);

    const syllableBus = ctx.createGain();
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    syllableBus.connect(panner);
    panner.connect(destination);

    // Vokal çekirdek
    ['sawtooth', 'square'].forEach((type, ti) => {
      const osc = ctx.createOscillator();
      osc.type = type as OscillatorType;
      osc.frequency.setValueAtTime(pitchBase, start);
      osc.frequency.exponentialRampToValueAtTime(Math.max(90, pitchEnd), start + dur);
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.001, start);
      og.gain.linearRampToValueAtTime(volume * (ti === 0 ? 0.35 : 0.12), start + 0.015);
      og.gain.exponentialRampToValueAtTime(0.001, start + dur);
      formants.forEach((f) => {
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = f + i * 30;
        bp.Q.value = 2.5;
        osc.connect(bp);
        bp.connect(og);
      });
      og.connect(syllableBus);
      osc.start(start);
      osc.stop(start + dur + 0.05);
    });

    // Nefes / hırıltı
    const breath = ctx.createBufferSource();
    breath.buffer = noiseBuffer(ctx, dur, true);
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 1500 + i * 200;
    bpf.Q.value = 1.8;
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.001, start);
    bg.gain.linearRampToValueAtTime(volume * 0.25, start + 0.01);
    bg.gain.exponentialRampToValueAtTime(0.001, start + dur);
    breath.connect(bpf);
    bpf.connect(bg);
    bg.connect(syllableBus);
    breath.start(start);
    breath.stop(start + dur + 0.05);

    // Son hecede düşüş çığlığı
    if (isLast && !lite) {
      const scream = ctx.createOscillator();
      scream.type = 'sawtooth';
      scream.frequency.setValueAtTime(pitchBase * 1.5, start + dur * 0.3);
      scream.frequency.exponentialRampToValueAtTime(120, start + dur);
      const sg = ctx.createGain();
      sg.gain.setValueAtTime(0.001, start + dur * 0.3);
      sg.gain.linearRampToValueAtTime(volume * 0.2, start + dur * 0.5);
      sg.gain.exponentialRampToValueAtTime(0.001, start + dur);
      scream.connect(sg);
      sg.connect(syllableBus);
      scream.start(start + dur * 0.3);
      scream.stop(start + dur + 0.05);
    }
  });
}

/** Jumpscare — darbe + çığlık + sub drop */
export function playJumpscareStinger({ ctx, destination, volume, lite }: HorrorSoundContext): void {
  const now = ctx.currentTime;

  // Darbe
  const impact = ctx.createBufferSource();
  impact.buffer = noiseBuffer(ctx, 0.08, true);
  const impactG = ctx.createGain();
  impactG.gain.setValueAtTime(volume * 1.2, now);
  impactG.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  const impactF = ctx.createBiquadFilter();
  impactF.type = 'highpass';
  impactF.frequency.value = 800;
  impact.connect(impactF);
  impactF.connect(impactG);
  impactG.connect(destination);
  impact.start(now);
  impact.stop(now + 0.1);

  // Sub drop
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(90, now);
  sub.frequency.exponentialRampToValueAtTime(28, now + 0.5);
  const subG = ctx.createGain();
  subG.gain.setValueAtTime(volume * 0.9, now);
  subG.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
  sub.connect(subG);
  subG.connect(destination);
  sub.start(now);
  sub.stop(now + 0.6);

  // Çığlık sweep
  const scream = ctx.createOscillator();
  scream.type = 'sawtooth';
  scream.frequency.setValueAtTime(lite ? 350 : 280, now + 0.04);
  scream.frequency.exponentialRampToValueAtTime(lite ? 1200 : 2200, now + 0.18);
  scream.frequency.exponentialRampToValueAtTime(180, now + 0.45);
  const screamG = ctx.createGain();
  screamG.gain.setValueAtTime(0.001, now + 0.04);
  screamG.gain.linearRampToValueAtTime(volume * 0.85, now + 0.1);
  screamG.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  const screamF = ctx.createBiquadFilter();
  screamF.type = 'bandpass';
  screamF.frequency.value = 1400;
  screamF.Q.value = 1.2;
  scream.connect(screamF);
  screamF.connect(screamG);
  connectWithReverb(ctx, screamG, destination, 1, lite ? 0.15 : 0.4, !lite);
  scream.start(now + 0.04);
  scream.stop(now + 0.55);

  // Ters whoosh
  if (!lite) {
    const whoosh = ctx.createBufferSource();
    whoosh.buffer = noiseBuffer(ctx, 0.35, true);
    whoosh.playbackRate.setValueAtTime(0.3, now);
    whoosh.playbackRate.linearRampToValueAtTime(1.8, now + 0.3);
    const wG = ctx.createGain();
    wG.gain.setValueAtTime(volume * 0.3, now);
    wG.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    const wF = ctx.createBiquadFilter();
    wF.type = 'bandpass';
    wF.frequency.value = 600;
    whoosh.connect(wF);
    wF.connect(wG);
    wG.connect(destination);
    whoosh.start(now);
    whoosh.stop(now + 0.4);
  }
}

/** Uzaktan çığlık — koridordan gelen ses */
export function playDistantScream({ ctx, destination, volume, lite }: HorrorSoundContext): void {
  const now = ctx.currentTime;
  const dur = lite ? 0.7 : 1.1;

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.linearRampToValueAtTime(1400, now + dur * 0.35);
  osc.frequency.exponentialRampToValueAtTime(200, now + dur);

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx, dur, true);

  const mix = ctx.createGain();
  mix.gain.setValueAtTime(0.001, now);
  mix.gain.linearRampToValueAtTime(volume * 0.55, now + 0.08);
  mix.gain.exponentialRampToValueAtTime(0.001, now + dur);

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1100;
  bp.Q.value = 2;

  osc.connect(bp);
  noise.connect(bp);
  bp.connect(mix);
  connectWithReverb(ctx, mix, destination, 1, 0.55, !lite);

  osc.start(now);
  osc.stop(now + dur + 0.05);
  noise.start(now);
  noise.stop(now + dur + 0.05);
}

/** Metal zincir / kapı gıcırtısı */
export function playMetalClang({ ctx, destination, volume }: HorrorSoundContext): void {
  const now = ctx.currentTime;
  const dur = 0.6;

  const partials = [420, 680, 1100, 1750];
  partials.forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(volume * 0.15, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur * (0.5 + i * 0.1));
    osc.connect(g);
    connectWithReverb(ctx, g, destination, 1, 0.5, true);
    osc.start(now);
    osc.stop(now + dur + 0.1);
  });

  const clang = ctx.createBufferSource();
  clang.buffer = noiseBuffer(ctx, 0.05, true);
  const cg = ctx.createGain();
  cg.gain.setValueAtTime(volume * 0.5, now);
  cg.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2000;
  clang.connect(hp);
  hp.connect(cg);
  cg.connect(destination);
  clang.start(now);
  clang.stop(now + 0.15);
}

/** Kapı gıcırtısı — uzun gerilim */
export function playDoorGroan({ ctx, destination, volume }: HorrorSoundContext): void {
  const now = ctx.currentTime;
  const dur = 1.4;

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.linearRampToValueAtTime(95, now + dur);

  const creak = ctx.createBufferSource();
  creak.buffer = noiseBuffer(ctx, dur, true);

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(300, now);
  bp.frequency.linearRampToValueAtTime(120, now + dur);
  bp.Q.value = 3;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(volume * 0.5, now + 0.15);
  g.gain.setValueAtTime(volume * 0.45, now + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.001, now + dur);

  osc.connect(bp);
  creak.connect(bp);
  bp.connect(g);
  connectWithReverb(ctx, g, destination, 1, 0.45, true);

  osc.start(now);
  osc.stop(now + dur + 0.05);
  creak.start(now);
  creak.stop(now + dur + 0.05);
}

/** Kalp atışı — gerilim artışı */
export function playTensionHeartbeat({ ctx, destination, volume }: HorrorSoundContext): void {
  const now = ctx.currentTime;
  [0, 0.14].forEach((off, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = i === 0 ? 55 : 48;
    const g = ctx.createGain();
    const t = now + off;
    g.gain.setValueAtTime(volume * (i === 0 ? 0.7 : 0.35), t);
    g.gain.exponentialRampToValueAtTime(0.001, t + (i === 0 ? 0.12 : 0.08));
    osc.connect(g);
    g.connect(destination);
    osc.start(t);
    osc.stop(t + 0.15);
  });
}

/** Çocuk/karanlık kıkırdama — cadıya alternatif */
export function playCreepyGiggle({ ctx, destination, volume, lite }: HorrorSoundContext): void {
  const now = ctx.currentTime;
  const hits = lite ? 4 : 6;
  for (let i = 0; i < hits; i++) {
    const start = now + i * (0.12 + Math.random() * 0.06);
    const osc = ctx.createOscillator();
    osc.type = 'square';
    const f = 900 + Math.random() * 400;
    osc.frequency.setValueAtTime(f, start);
    osc.frequency.exponentialRampToValueAtTime(f * 0.6, start + 0.1);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, start);
    g.gain.linearRampToValueAtTime(volume * 0.3, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
    const pan = ctx.createStereoPanner();
    pan.pan.value = (Math.random() - 0.5) * 1.2;
    osc.connect(g);
    g.connect(pan);
    pan.connect(destination);
    osc.start(start);
    osc.stop(start + 0.15);
  }
}

/** Gök gürültüsü — uzak patlama */
export function playThunderRumble({ ctx, destination, volume }: HorrorSoundContext): void {
  const now = ctx.currentTime;
  const dur = 2.2;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx, dur, true);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(200, now);
  lp.frequency.linearRampToValueAtTime(60, now + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(volume * 0.55, now + 0.3);
  g.gain.exponentialRampToValueAtTime(0.001, now + dur);
  noise.connect(lp);
  lp.connect(g);
  connectWithReverb(ctx, g, destination, 1, 0.6, true);
  noise.start(now);
  noise.stop(now + dur + 0.1);
}

export type HorrorEventType =
  | 'witch'
  | 'scream'
  | 'clang'
  | 'door'
  | 'heartbeat'
  | 'giggle'
  | 'thunder';

export const HORROR_EVENTS: HorrorEventType[] = [
  'witch', 'scream', 'clang', 'door', 'heartbeat', 'giggle', 'thunder',
];

export function playHorrorEvent(
  type: HorrorEventType,
  hctx: HorrorSoundContext,
  intense = false,
): void {
  switch (type) {
    case 'witch': playWitchCackle(hctx, intense); break;
    case 'scream': playDistantScream(hctx); break;
    case 'clang': playMetalClang(hctx); break;
    case 'door': playDoorGroan(hctx); break;
    case 'heartbeat': playTensionHeartbeat(hctx); break;
    case 'giggle': playCreepyGiggle(hctx); break;
    case 'thunder': playThunderRumble(hctx); break;
  }
}
