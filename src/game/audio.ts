/**
 * Web Audio API procedural sound synthesizer
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private rollOsc: OscillatorNode | null = null;
  private rollGain: GainNode | null = null;
  private rollFilter: BiquadFilterNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private isRolling: boolean = false;
  private musicInterval: number | null = null;
  private musicStep: number = 0;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.ctx) {
      const t = this.ctx.currentTime;
      if (this.rollGain) this.rollGain.gain.setValueAtTime(0, t);
      if (this.noiseGain) this.noiseGain.gain.setValueAtTime(0, t);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sound played when an object sticks to the ball
   * Pitch scales inversely with object size
   */
  public playStickSound(objectRadius: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Small items = higher pitch, huge buildings = deeper pitch
      const baseFreq = Math.max(120, Math.min(880, 520 / Math.max(0.2, objectRadius * 0.7)));
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq * 0.8, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.08);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);

      // Sub-thud for satisfaction
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(140, t);
      thudOsc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
      thudGain.gain.setValueAtTime(0.2, t);
      thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(t);
      thudOsc.stop(t + 0.11);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Sound played when ball hits something too large
   */
  public playBumpSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    } catch {
      // Ignore
    }
  }

  /**
   * Sound played when braking or gripping sharply with high traction
   */
  public playTractionScuffSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(240, t);
      filter.Q.setValueAtTime(1.5, t);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch {
      // Ignore
    }
  }

  /**
   * Sound played when hitting a size milestone
   */
  public playMilestoneSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.08);

        gain.gain.setValueAtTime(0, t + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, t + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + i * 0.08);
        osc.stop(t + i * 0.08 + 0.32);
      });
    } catch {
      // Ignore
    }
  }

  private getOrCreateNoiseBuffer(): AudioBuffer | null {
    if (this.noiseBuffer) return this.noiseBuffer;
    if (!this.ctx) return null;
    const sampleRate = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < sampleRate; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2 + white * 0.05) * 0.75;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * Update rolling sound speed (Smooth Marble: warm sub-bass hum + soft friction)
   */
  public updateRolling(speed: number) {
    if (this.isMuted) {
      if (this.ctx) {
        const t = this.ctx.currentTime;
        if (this.rollGain) this.rollGain.gain.setValueAtTime(0, t);
        if (this.noiseGain) this.noiseGain.gain.setValueAtTime(0, t);
      }
      return;
    }

    try {
      this.initCtx();
      if (!this.ctx) return;

      if (!this.rollOsc) {
        const t = this.ctx.currentTime;
        this.rollOsc = this.ctx.createOscillator();
        this.rollOsc.type = 'sine';
        this.rollOsc.frequency.setValueAtTime(48, t);

        this.rollFilter = this.ctx.createBiquadFilter();
        this.rollFilter.type = 'lowpass';
        this.rollFilter.frequency.setValueAtTime(140, t);

        this.rollGain = this.ctx.createGain();
        this.rollGain.gain.setValueAtTime(0, t);

        this.rollOsc.connect(this.rollFilter);
        this.rollFilter.connect(this.rollGain);
        this.rollGain.connect(this.ctx.destination);
        this.rollOsc.start();

        const buffer = this.getOrCreateNoiseBuffer();
        if (buffer) {
          this.noiseSource = this.ctx.createBufferSource();
          this.noiseSource.buffer = buffer;
          this.noiseSource.loop = true;
          this.noiseFilter = this.ctx.createBiquadFilter();
          this.noiseFilter.type = 'lowpass';
          this.noiseFilter.frequency.setValueAtTime(180, t);
          this.noiseGain = this.ctx.createGain();
          this.noiseGain.gain.setValueAtTime(0, t);
          this.noiseSource.connect(this.noiseFilter);
          this.noiseFilter.connect(this.noiseGain);
          this.noiseGain.connect(this.ctx.destination);
          this.noiseSource.start();
        }

        this.isRolling = true;
      }

      const t = this.ctx.currentTime;
      const normSpeed = Math.min(1, speed / 15);
      const isMoving = normSpeed > 0.02;

      const targetVol = isMoving ? normSpeed * 0.22 : 0;
      const targetNoiseVol = isMoving ? normSpeed * 0.04 : 0;
      const targetFreq = 48 + normSpeed * 32;
      const targetFilter = 130 + normSpeed * 120;

      this.rollGain?.gain.setTargetAtTime(targetVol, t, 0.08);
      this.rollOsc?.frequency.setTargetAtTime(targetFreq, t, 0.08);
      this.rollFilter?.frequency.setTargetAtTime(targetFilter, t, 0.08);
      this.noiseGain?.gain.setTargetAtTime(targetNoiseVol, t, 0.08);
    } catch {
      // Ignore
    }
  }

  /**
   * Boost dash sound effect
   */
  public playBoostSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(660, t + 0.25);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    } catch {
      // Ignore
    }
  }

  /**
   * Upbeat background ambient melodic loop
   */
  public startAmbientBGM() {
    if (this.musicInterval !== null) return;

    // Chords progression: Cmaj7 -> Am7 -> Fmaj7 -> G7
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C E G B
      [220.00, 261.63, 329.63, 392.00], // A C E G
      [174.61, 220.00, 261.63, 329.63], // F A C E
      [196.00, 246.94, 293.66, 349.23], // G B D F
    ];

    this.musicInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      try {
        const chordIndex = Math.floor(this.musicStep / 4) % chords.length;
        const noteIndex = this.musicStep % 4;
        const chord = chords[chordIndex];
        const freq = chord[noteIndex];

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 1.5, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.025, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.6);

        this.musicStep++;
      } catch {
        // Ignore
      }
    }, 450);
  }

  public stopAmbientBGM() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.ctx) {
      const t = this.ctx.currentTime;
      if (this.rollGain) this.rollGain.gain.setValueAtTime(0, t);
      if (this.noiseGain) this.noiseGain.gain.setValueAtTime(0, t);
    }
  }
}

export const soundEngine = new SoundEngine();
