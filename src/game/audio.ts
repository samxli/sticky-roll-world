/**
 * Web Audio API procedural sound synthesizer
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private rollOsc: OscillatorNode | null = null;
  private rollGain: GainNode | null = null;
  private rollFilter: BiquadFilterNode | null = null;
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
    if (this.isMuted && this.rollGain) {
      this.rollGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
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

  /**
   * Update rolling sound speed
   */
  public updateRolling(speed: number) {
    if (this.isMuted) {
      if (this.rollGain && this.ctx) {
        this.rollGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      return;
    }

    try {
      this.initCtx();
      if (!this.ctx) return;

      if (!this.rollOsc) {
        this.rollOsc = this.ctx.createOscillator();
        this.rollFilter = this.ctx.createBiquadFilter();
        this.rollGain = this.ctx.createGain();

        this.rollOsc.type = 'sawtooth';
        this.rollOsc.frequency.setValueAtTime(45, this.ctx.currentTime);

        this.rollFilter.type = 'lowpass';
        this.rollFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

        this.rollGain.gain.setValueAtTime(0, this.ctx.currentTime);

        this.rollOsc.connect(this.rollFilter);
        this.rollFilter.connect(this.rollGain);
        this.rollGain.connect(this.ctx.destination);

        this.rollOsc.start();
        this.isRolling = true;
      }

      if (this.rollGain && this.rollFilter && this.ctx) {
        const normSpeed = Math.min(1, speed / 15);
        const targetVol = normSpeed > 0.02 ? normSpeed * 0.12 : 0;
        const targetFilter = 100 + normSpeed * 300;

        this.rollGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.08);
        this.rollFilter.frequency.setTargetAtTime(targetFilter, this.ctx.currentTime, 0.08);
        this.rollOsc.frequency.setTargetAtTime(35 + normSpeed * 40, this.ctx.currentTime, 0.08);
      }
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
    if (this.rollGain && this.ctx) {
      this.rollGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }
}

export const soundEngine = new SoundEngine();
