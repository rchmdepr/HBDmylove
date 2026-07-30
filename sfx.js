/**
 * SFX.JS - Web Audio Sound Synthesizer & Audio Manager
 * Memastikan semua efek suara (click, unlock, error, confetti cheer, & musik) 
 * langsung berbunyi merdu tanpa ketergantungan file eksternal!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmAudio = null;
    this.isPlayingBgm = false;
    this.isMuted = false;
    this.synthInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Efek suara Tombol Klik
  playClick() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Efek Suara Jawaban Salah (Shake & Buzzer)
  playError() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.setValueAtTime(180, this.ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(140, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Efek Suara Mendapatkan Kunci (Chime Kunci Terbuka)
  playKeyUnlock() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.07);
      osc.stop(this.ctx.currentTime + idx * 0.07 + 0.3);
    });
  }

  // Efek Suara Fanfare Puncak (Confetti Unlocking)
  playCelebrationFanfare() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const chordNotes = [
      [523.25, 659.25, 783.99],       // C Major
      [587.33, 698.46, 880.00],       // Dm
      [659.25, 783.99, 987.77],       // Em
      [1046.50, 1318.51, 1567.98]     // High C Major
    ];

    chordNotes.forEach((chord, cIdx) => {
      chord.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + cIdx * 0.22);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + cIdx * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + cIdx * 0.22 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + cIdx * 0.22);
        osc.stop(this.ctx.currentTime + cIdx * 0.22 + 0.6);
      });
    });
  }

  // Memutar Musik Latar (Custom MP3 atau Synth Melody Romantis)
  startBgm() {
    this.init();
    if (this.isPlayingBgm) return;
    this.isPlayingBgm = true;

    const config = window.BIRTHDAY_CONFIG || {};
    const customUrl = config.audio && config.audio.customAudioUrl;

    if (customUrl) {
      if (customUrl.includes('youtube.com') || customUrl.includes('youtu.be')) {
        let videoId = '';
        if (customUrl.includes('v=')) {
          videoId = customUrl.split('v=')[1].split('&')[0];
        } else if (customUrl.includes('youtu.be/')) {
          videoId = customUrl.split('youtu.be/')[1].split('?')[0];
        }
        
        if (videoId) {
          this.ytIframe = document.createElement('iframe');
          this.ytIframe.style.display = 'none';
          this.ytIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1`;
          this.ytIframe.allow = "autoplay";
          document.body.appendChild(this.ytIframe);
          return;
        }
      }

      try {
        this.bgmAudio = new Audio(customUrl);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = this.isMuted ? 0 : 0.6;
        this.bgmAudio.play().catch(err => {
          console.log("Autoplay custom audio prevented, falling back to synth:", err);
          this.startSynthBgm();
        });
        return;
      } catch (e) {
        console.warn("Failed to load custom audio URL, fallback to synth", e);
      }
    }

    // Fallback: Sintesis melodi piano romantic ambient dengan Web Audio API
    this.startSynthBgm();
  }

  startSynthBgm() {
    if (!this.ctx) return;
    
    // Melodi romantis sederhana (Canon in D / Soft Chords)
    const melody = [
      { note: 261.63, duration: 1.2 }, // C4
      { note: 329.63, duration: 1.2 }, // E4
      { note: 392.00, duration: 1.2 }, // G4
      { note: 493.88, duration: 1.2 }, // B4
      { note: 440.00, duration: 1.2 }, // A4
      { note: 349.23, duration: 1.2 }, // F4
      { note: 329.63, duration: 1.2 }, // E4
      { note: 293.66, duration: 1.2 }, // D4
    ];

    let noteIndex = 0;
    const playNextSynthNote = () => {
      if (!this.isPlayingBgm || !this.ctx || this.isMuted) return;

      const item = melody[noteIndex % melody.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(item.note, this.ctx.currentTime);
      // Tambahkan kehangatan harmonic
      osc.frequency.exponentialRampToValueAtTime(item.note * 1.002, this.ctx.currentTime + item.duration);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + item.duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + item.duration);

      noteIndex++;
    };

    playNextSynthNote();
    this.synthInterval = setInterval(playNextSynthNote, 1000);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted;
    }
    if (this.ytIframe && this.ytIframe.contentWindow) {
      this.ytIframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: this.isMuted ? 'mute' : 'unMute',
        args: []
      }), '*');
    }
    return this.isMuted;
  }

  stopBgm() {
    this.isPlayingBgm = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    if (this.ytIframe) {
      this.ytIframe.remove();
      this.ytIframe = null;
    }
  }
}

window.soundEngine = new SoundEngine();
