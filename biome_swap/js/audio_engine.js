/**
 * Biome Swap: The Keystone Balance - Procedural Web Audio Engine
 * Creates organic ambient nature soundscapes, cascade chimes, animal calls, and bloom fanfares.
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientGain = null;
        this.isInitialized = false;

        try {
            const saved = localStorage.getItem('biome_swap_muted');
            if (saved !== null) {
                this.isMuted = JSON.parse(saved);
            }
        } catch (e) {}

        this.initOnFirstInteraction = this.initOnFirstInteraction.bind(this);
        if (typeof window !== 'undefined') {
            window.addEventListener('click', this.initOnFirstInteraction, { once: true });
            window.addEventListener('keydown', this.initOnFirstInteraction, { once: true });
        }
    }

    init() {
        if (this.ctx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.isInitialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    initOnFirstInteraction() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this.isMuted) {
            this.startAmbient();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        try {
            localStorage.setItem('biome_swap_muted', JSON.stringify(this.isMuted));
        } catch (e) {}

        if (this.isMuted) {
            this.stopAmbient();
        } else {
            if (!this.ctx) this.init();
            if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
            this.startAmbient();
        }
        return this.isMuted;
    }

    startAmbient() {
        if (this.isMuted || !this.ctx || this.ambientGain) return;
        try {
            const t = this.ctx.currentTime;
            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.setValueAtTime(0.001, t);
            this.ambientGain.gain.exponentialRampToValueAtTime(0.04, t + 3.0);

            // Forest wind drone
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(96, t);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(250, t);

            osc.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);
            osc.start();
        } catch (e) {}
    }

    stopAmbient() {
        if (this.ambientGain && this.ctx) {
            try {
                this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
                setTimeout(() => { this.ambientGain = null; }, 550);
            } catch (e) {
                this.ambientGain = null;
            }
        }
    }

    playCardDrop(cardType = 'producer') {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';

            let baseFreq = 440;
            if (cardType === 'apex') baseFreq = 220;
            if (cardType === 'herbivore') baseFreq = 523.25;
            if (cardType === 'cascade') baseFreq = 659.25;

            osc.frequency.setValueAtTime(baseFreq, t);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.12);

            gain.gain.setValueAtTime(0.08, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.2);
        } catch (e) {}
    }

    playCascadeTrigger() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const chord = [330, 440, 554.37, 659.25, 880]; // E A C# E A (Majestic cascade)
            chord.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t + idx * 0.07);
                gain.gain.setValueAtTime(0, t);
                gain.gain.setValueAtTime(0.08, t + idx * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.5);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + idx * 0.07);
                osc.stop(t + idx * 0.07 + 0.55);
            });
        } catch (e) {}
    }

    playInvasiveAlert() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260, t);
            osc.frequency.setValueAtTime(220, t + 0.1);
            osc.frequency.setValueAtTime(196, t + 0.2);

            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.38);
        } catch (e) {}
    }

    playEcosystemBloom() {
        if (this.isMuted || !this.ctx) return;
        try {
            const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98]; // C E G C E G
            const t = this.ctx.currentTime;
            notes.forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, t + i * 0.08);
                gain.gain.setValueAtTime(0.07, t + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.4);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + i * 0.08);
                osc.stop(t + i * 0.08 + 0.45);
            });
        } catch (e) {}
    }
}
