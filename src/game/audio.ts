/**
 * GTA Cotonou - Web Audio API procedural synthesis & Gemini TTS Integration
 * 100% procedural sound effects and dynamic speech generation
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private radioGain: GainNode | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenTimer: number | null = null;
  private radioLoopTimer: number | null = null;
  private isMuted: boolean = false;
  private ttsAudioElement: HTMLAudioElement | null = null;

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.masterGain);

      this.radioGain = this.ctx.createGain();
      this.radioGain.gain.value = 0.45;
      this.radioGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  }

  public resume() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, this.ctx.currentTime);
    }
    if (this.ttsAudioElement && muted) {
      this.ttsAudioElement.pause();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Engine sound modulation based on speed (0 to 1)
  public updateEngine(speedRatio: number, isDriving: boolean, isMoto: boolean = false) {
    if (!this.ctx || this.isMuted || !isDriving) {
      if (this.engineGain) this.engineGain.gain.value = 0;
      return;
    }

    if (!this.engineOsc) {
      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = isMoto ? 'sawtooth' : 'triangle';
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.value = 0.15;
      this.engineOsc.connect(this.engineGain);
      this.engineGain.connect(this.sfxGain!);
      this.engineOsc.start();
    }

    const baseFreq = isMoto ? 90 : 55;
    const maxFreq = isMoto ? 260 : 180;
    const targetFreq = baseFreq + Math.abs(speedRatio) * (maxFreq - baseFreq);
    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
    this.engineGain?.gain.setTargetAtTime(0.12 + Math.abs(speedRatio) * 0.15, this.ctx.currentTime, 0.08);
  }

  public stopEngine() {
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  // Police 2-tone siren
  public setPoliceSiren(active: boolean) {
    if (!this.ctx) return;
    if (!active || this.isMuted) {
      if (this.sirenGain) this.sirenGain.gain.value = 0;
      if (this.sirenTimer) {
        clearInterval(this.sirenTimer);
        this.sirenTimer = null;
      }
      return;
    }

    if (!this.sirenOsc) {
      this.sirenOsc = this.ctx.createOscillator();
      this.sirenOsc.type = 'sawtooth';
      this.sirenGain = this.ctx.createGain();
      this.sirenGain.gain.value = 0.18;
      this.sirenOsc.connect(this.sirenGain);
      this.sirenGain.connect(this.sfxGain!);
      this.sirenOsc.start();
    }

    if (this.sirenGain) this.sirenGain.gain.value = 0.18;
    if (!this.sirenTimer) {
      let toggle = false;
      this.sirenTimer = window.setInterval(() => {
        if (!this.sirenOsc || !this.ctx) return;
        toggle = !toggle;
        this.sirenOsc.frequency.setValueAtTime(toggle ? 780 : 580, this.ctx.currentTime);
      }, 400);
    }
  }

  // Car Horn
  public playHorn() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(370, now);
    osc2.frequency.setValueAtTime(440, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain!);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  }

  // Metal collision / crash
  public playCrash(severity: number = 1) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const dur = Math.min(0.5, 0.2 + severity * 0.2);
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.1));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(Math.min(0.5, 0.25 * severity), now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);

    noise.start(now);
  }

  // Punch impact
  public playPunch() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain!);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Gunshot
  public playGunshot() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);

    noise.start(now);
  }

  // Money pickup chime
  public playCashChime() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    [880, 1320].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  // Mission fanfares
  public playMissionStart() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [293.66, 369.99, 440.0, 587.33]; // D, F#, A, D
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);

      gain.gain.setValueAtTime(0.2, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.35);
    });
  }

  public playMissionSuccess() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);

      gain.gain.setValueAtTime(0.3, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.6);
    });
  }

  // Procedural Afrobeat radio rhythm loop
  public startRadioStation(stationId: string) {
    this.stopRadio();
    if (!this.ctx || this.isMuted) return;

    let step = 0;
    // Chords and bassline frequencies
    const bassline = stationId === 'police_scanner'
      ? [110, 110, 146.83, 130.81]
      : [130.81, 146.83, 164.81, 174.61];

    this.radioLoopTimer = window.setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;

      // Bass beat
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassline[step % bassline.length], now);
      bassGain.gain.setValueAtTime(0.12, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      bassOsc.connect(bassGain);
      bassGain.connect(this.radioGain!);
      bassOsc.start(now);
      bassOsc.stop(now + 0.3);

      // Hi-hat groove
      if (step % 2 === 0) {
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
        const out = noiseBuffer.getChannelData(0);
        for (let i = 0; i < out.length; i++) out[i] = (Math.random() * 2 - 1) * 0.3;
        const hat = this.ctx.createBufferSource();
        hat.buffer = noiseBuffer;
        const hatFilter = this.ctx.createBiquadFilter();
        hatFilter.type = 'highpass';
        hatFilter.frequency.value = 6000;
        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime(0.06, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        hat.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(this.radioGain!);
        hat.start(now);
      }

      step++;
    }, 280);
  }

  public stopRadio() {
    if (this.radioLoopTimer) {
      clearInterval(this.radioLoopTimer);
      this.radioLoopTimer = null;
    }
  }

  // Gemini 3.8 Flash TTS caller
  public async playGeminiTTS(text: string, speaker: string = 'Boss'): Promise<void> {
    if (this.isMuted) return;

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          speaker,
          style: 'Energetic African crime underworld boss in Cotonou',
        }),
      });

      const data = await res.json();

      if (data.audio) {
        if (this.ttsAudioElement) {
          this.ttsAudioElement.pause();
        }
        this.ttsAudioElement = new Audio(data.audio);
        this.ttsAudioElement.volume = 0.9;
        await this.ttsAudioElement.play();
        return;
      }
    } catch (err) {
      console.warn('Gemini TTS API request failed, using speech synthesis fallback', err);
    }

    // Fallback: Web SpeechSynthesis API in French
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }
}

export const sound = new SoundManager();
