export class SoundEngine {
  private ctx: AudioContext | null = null;
  private nodes: Record<string, any> = {};
  private volumes: Record<string, GainNode> = {};

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(id: string, vol: number) {
    if (!this.volumes[id]) return;
    this.volumes[id].gain.setTargetAtTime(vol, this.ctx!.currentTime, 0.1);
  }

  stopAll() {
    Object.values(this.volumes).forEach(v => v.gain.value = 0);
  }

  playRain(vol: number) {
    this.init();
    if (!this.nodes['rain']) {
      const bufferSize = this.ctx!.sampleRate * 2;
      const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx!.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800; // Muffled rain

      const gain = this.ctx!.createGain();
      gain.gain.value = 0;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);
      noise.start();

      this.nodes['rain'] = noise;
      this.volumes['rain'] = gain;
    }
    this.setVolume('rain', vol);
  }

  playOcean(vol: number) {
    this.init();
    if (!this.nodes['ocean']) {
      const bufferSize = this.ctx!.sampleRate * 2;
      const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx!.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400; // Deep ocean

      // LFO for wave crashing effect
      const lfo = this.ctx!.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1; // 10 second wave cycle
      
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.value = 800; // Frequency variation
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      const gain = this.ctx!.createGain();
      gain.gain.value = 0;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);
      noise.start();

      this.nodes['ocean'] = noise;
      this.volumes['ocean'] = gain;
    }
    this.setVolume('ocean', vol);
  }

  playWhiteNoise(vol: number) {
    this.init();
    if (!this.nodes['whiteNoise']) {
      const bufferSize = this.ctx!.sampleRate * 2;
      const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx!.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 3000; 

      const gain = this.ctx!.createGain();
      gain.gain.value = 0;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);
      noise.start();

      this.nodes['whiteNoise'] = noise;
      this.volumes['whiteNoise'] = gain;
    }
    this.setVolume('whiteNoise', vol);
  }

  playForest(vol: number) {
    this.init();
    if (!this.nodes['forest']) {
      // Just some simple crickets/night bugs and occasional bird
      const osc1 = this.ctx!.createOscillator();
      osc1.frequency.value = 4000;
      
      const lfo = this.ctx!.createOscillator();
      lfo.frequency.value = 20; // fast chirp
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.value = 50;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfo.start();

      // Amplitude LFO to turn cricket on and off
      const amLfo = this.ctx!.createOscillator();
      amLfo.frequency.value = 0.5;
      const amGain = this.ctx!.createGain();
      amLfo.connect(amGain.gain);
      amLfo.start();

      osc1.connect(amGain);

      const gain = this.ctx!.createGain();
      gain.gain.value = 0;
      amGain.connect(gain);
      gain.connect(this.ctx!.destination);
      osc1.start();

      this.nodes['forest'] = osc1;
      this.volumes['forest'] = gain;
    }
    this.setVolume('forest', vol);
  }

  playPiano(vol: number) {
    this.init();
    if (!this.nodes['piano']) {
      // Create a drone chord (Cmaj9)
      const frequencies = [261.63, 329.63, 392.00, 493.88, 587.33];
      const masterGain = this.ctx!.createGain();
      masterGain.gain.value = 0;

      frequencies.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        const pan = this.ctx!.createStereoPanner();
        pan.pan.value = (Math.random() * 2) - 1;

        const volLFO = this.ctx!.createOscillator();
        volLFO.frequency.value = 0.05 + Math.random() * 0.1; // very slow swell
        const lfoGain = this.ctx!.createGain();
        lfoGain.gain.value = 0.5;
        volLFO.connect(lfoGain.gain);
        volLFO.start();

        const oscGain = this.ctx!.createGain();
        oscGain.gain.value = 0.5; // base

        osc.connect(lfoGain);
        lfoGain.connect(pan);
        pan.connect(masterGain);
        osc.start();
      });

      masterGain.connect(this.ctx!.destination);

      this.nodes['piano'] = true;
      this.volumes['piano'] = masterGain;
    }
    this.setVolume('piano', vol);
  }
}

export const soundEngine = new SoundEngine();
