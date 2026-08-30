/**
 * TOKAMAK FORGE: Procedural Audio Engine (Web Audio API)
 * Reactor magnetic humming, nuclear fusion detonations, Geiger counter radiation clicks, and UI SFX.
 */

class TokamakAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isInitialized = false;
        this.reactorHumGain = null;
        this.reactorHumOsc = null;
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.isInitialized = true;
            this.startReactorHum();
        } catch (e) {
            console.warn("Web Audio API blocked or not supported", e);
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
        if (this.reactorHumGain) {
            this.reactorHumGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx ? this.ctx.currentTime : 0);
        }
        return this.isMuted;
    }

    // Continuous Sub-bass Tokamak Torus Magnetic Plasma Hum
    startReactorHum() {
        if (!this.ctx || this.reactorHumOsc) return;
        const now = this.ctx.currentTime;
        
        this.reactorHumOsc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        this.reactorHumGain = this.ctx.createGain();

        this.reactorHumOsc.type = 'sawtooth';
        this.reactorHumOsc.frequency.setValueAtTime(60, now); // 60Hz AC grid hum

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(45, now);

        // Low-pass filter for deep smooth rumble
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, now);

        this.reactorHumGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, now);

        this.reactorHumOsc.connect(filter);
        subOsc.connect(filter);
        filter.connect(this.reactorHumGain);
        this.reactorHumGain.connect(this.ctx.destination);

        this.reactorHumOsc.start(now);
        subOsc.start(now);
    }

    // Particle Dropped into Tokamak Chamber
    playParticleDrop() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    // Nuclear Fusion Reaction Event (Massive resonant explosion chord)
    playFusionBurst(massNumber = 4) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Base frequency scales with atomic weight
        const baseFreq = 180 + Math.min(massNumber * 4, 300);

        // Sub bass thump
        const bass = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bass.type = 'sine';
        bass.frequency.setValueAtTime(baseFreq * 0.5, now);
        bass.frequency.exponentialRampToValueAtTime(40, now + 0.35);

        bassGain.gain.setValueAtTime(0.35, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        bass.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bass.start(now);
        bass.stop(now + 0.4);

        // High crystal chime (Energy release photon)
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'triangle';
        chime.frequency.setValueAtTime(baseFreq * 3, now);
        chime.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.25);

        chimeGain.gain.setValueAtTime(0.2, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start(now);
        chime.stop(now + 0.3);
    }

    // Geiger Counter Radiation Clicks (Random Poisson burst for decaying isotopes)
    playGeigerClicks(count = 3) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        for (let i = 0; i < count; i++) {
            const delay = Math.random() * 0.08;
            const now = this.ctx.currentTime + delay;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(2400 + Math.random() * 800, now);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.02);
        }
    }

    // Magnetic Pinch Field Pulse (Spacebar / Tap trigger)
    playMagneticPulse() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    // Thermal Quench / Chamber Overflow Alarm
    playQuenchAlarm() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.linearRampToValueAtTime(320, now + 0.25);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Era Complete Stellar Ignition Fanfare
    playEraComplete() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4 major arpeggio
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + idx * 0.08;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.45);
        });
    }

    playClick() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.03);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
    }
}

window.tokamakAudio = new TokamakAudioEngine();
