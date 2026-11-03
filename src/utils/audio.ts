/**
 * High-performance Web Audio API synthesizer for F1 Pit Stop sound effects.
 * No external audio files needed - immediate zero-latency playback.
 */

class F1AudioManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Pneumatic wheel gun loosening nut sound
  playWheelGunNut(index: number = 0, isFever: boolean = false) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // High-pressure air impact burst
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime((isFever ? 1800 : 1400) + index * 200, now);
    noiseFilter.Q.setValueAtTime(3, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(isFever ? 0.55 : 0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // Motor spinning tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isFever ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime((isFever ? 800 : 600) + index * 100, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Tire dismount & mount slam (with optional perfect punch)
  playTireMount(isPerfect: boolean = false) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Heavy rubber/metal impact
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isPerfect ? 180 : 140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

    gain.gain.setValueAtTime(isPerfect ? 0.75 : 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);

    // Metallic clink
    const clink = ctx.createOscillator();
    const clinkGain = ctx.createGain();
    clink.type = 'sine';
    clink.frequency.setValueAtTime(isPerfect ? 1600 : 1200, now);
    clink.frequency.exponentialRampToValueAtTime(700, now + 0.08);

    clinkGain.gain.setValueAtTime(0.3, now);
    clinkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    clink.connect(clinkGain);
    clinkGain.connect(ctx.destination);
    clink.start(now);
    clink.stop(now + 0.08);

    if (isPerfect) {
      this.playPerfectChime();
    }
  }

  // Perfect timing sweet-spot chime
  playPerfectChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [1046.5, 1318.5, 1568]; // C6, E6, G6 major triad
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.2, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.25);
    });
  }

  // Fever Mode activation surge
  playFeverSurge() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Arcade Time Bonus chime (+2s)
  playTimeBonus() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [880, 1174.66, 1760]; // A5, D6, A6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.25, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.3);
    });
  }

  // Fasten torque wrench ratcheting lock
  playFastenTorque(index: number = 0, isFever: boolean = false) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    for (let i = 0; i < 3; i++) {
      const clickTime = now + i * 0.03;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isFever ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime((isFever ? 900 : 800) + i * 150 + index * 100, clickTime);

      gain.gain.setValueAtTime(0.22, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.01, clickTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(clickTime);
      osc.stop(clickTime + 0.03);
    }
  }

  // Green light & F1 engine launch
  playCarLaunch() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Green gantry chime
    const bell = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(1046.5, now);
    bellGain.gain.setValueAtTime(0.4, now);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    bell.connect(bellGain);
    bellGain.connect(ctx.destination);
    bell.start(now);
    bell.stop(now + 0.35);

    // V6 turbo hybrid acceleration roar
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.65);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now + 0.05);
    filter.frequency.exponentialRampToValueAtTime(2800, now + 0.65);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + 0.05);
    osc.stop(now + 0.7);

    // Tire squeal burst
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
    }
    const squeal = ctx.createBufferSource();
    squeal.buffer = noiseBuffer;
    const squealFilter = ctx.createBiquadFilter();
    squealFilter.type = 'bandpass';
    squealFilter.frequency.setValueAtTime(2400, now + 0.08);
    squealFilter.Q.setValueAtTime(5, now + 0.08);

    const squealGain = ctx.createGain();
    squealGain.gain.setValueAtTime(0.2, now + 0.08);
    squealGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    squeal.connect(squealFilter);
    squealFilter.connect(squealGain);
    squealGain.connect(ctx.destination);
    squeal.start(now + 0.08);
  }

  // Misclick or Jam sound
  playErrorBuzz() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Radio beep
  playRadioBeep() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Countdown light beep
  playCountdownLight(isFinal: boolean = false) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 1200 : 700, now);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + (isFinal ? 0.3 : 0.15));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (isFinal ? 0.3 : 0.15));
  }
}

export const soundFx = new F1AudioManager();
