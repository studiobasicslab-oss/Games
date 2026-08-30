/**
 * CRIPTO-CIPHER: Procedural Audio Engine (Web Audio API)
 * Mechanical teleprinters, Morse code audio telegraphs, radio tuning heterodynes, and rotor clicks.
 */

class CriptoAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isInitialized = false;
        this.radioStaticSource = null;
        this.radioStaticGain = null;
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.isInitialized = true;
            this.startRadioStatic();
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    ensureContext() {
        if (!this.isInitialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.radioStaticGain) {
            this.radioStaticGain.gain.setValueAtTime(this.isMuted ? 0 : 0.02, this.ctx ? this.ctx.currentTime : 0);
        }
        return this.isMuted;
    }

    // Ambient Cold War Shortwave Radio Static & Dial Heterodyne
    startRadioStatic() {
        if (!this.ctx || this.radioStaticSource) return;
        const now = this.ctx.currentTime;

        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        this.radioStaticSource = this.ctx.createBufferSource();
        this.radioStaticSource.buffer = buffer;
        this.radioStaticSource.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(2.5, now);

        this.radioStaticGain = this.ctx.createGain();
        this.radioStaticGain.gain.setValueAtTime(this.isMuted ? 0 : 0.02, now);

        this.radioStaticSource.connect(filter);
        filter.connect(this.radioStaticGain);
        this.radioStaticGain.connect(this.ctx.destination);

        this.radioStaticSource.start(now);
    }

    // Mechanical Typewriter / Teletype Key Clack
    playTeletypeClack() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Metallic impact
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800 + Math.random() * 400, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
    }

    // Morse Code Dit / Dah Beep (800 Hz)
    playMorseBeep(isDah = false) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const duration = isDah ? 0.12 : 0.045;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.005);
        gain.gain.setValueAtTime(0.15, now + duration - 0.005);
        gain.gain.linearRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.01);
    }

    // Enigma Rotor Wheel Mechanical Step Click
    playRotorStep() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
    }

    // Decryption Cracked Success Teleprinter Bell
    playSuccessBell() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [880, 1174.66, 1760]; // A5, D6, A6 bell harmonics
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.65);
        });
    }

    playClick() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.03);
    }
}

window.criptoAudio = new CriptoAudioEngine();
