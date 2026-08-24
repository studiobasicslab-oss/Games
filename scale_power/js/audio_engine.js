/**
 * Scale: The Power of Ten - Procedural Web Audio Engine
 * Low-frequency cosmic drones, quantum pitch shifters, scale zoom sweeps, Fermi bullseye chimes.
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientGain = null;
        this.ambientOsc = null;
        this.isInitialized = false;

        try {
            const saved = localStorage.getItem('scale_power_muted');
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
            localStorage.setItem('scale_power_muted', JSON.stringify(this.isMuted));
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

            // Deep cosmic frequency drone (55Hz + 110Hz sub-bass)
            this.ambientOsc = this.ctx.createOscillator();
            this.ambientOsc.type = 'sine';
            this.ambientOsc.frequency.setValueAtTime(55, t);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(150, t);

            this.ambientOsc.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);
            this.ambientOsc.start();
        } catch (e) {}
    }

    stopAmbient() {
        if (this.ambientGain && this.ctx) {
            try {
                this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
                setTimeout(() => {
                    if (this.ambientOsc) {
                        try { this.ambientOsc.stop(); } catch(e){}
                        this.ambientOsc = null;
                    }
                    this.ambientGain = null;
                }, 550);
            } catch (e) {
                this.ambientGain = null;
            }
        }
    }

    playZoomSweep(exponent = 0) {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';

            // Map exponent (-18 to +26) to frequency range (100Hz to 1200Hz)
            const norm = (exponent + 18) / 44;
            const freq = 120 + norm * 880;

            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.03, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.06);
        } catch (e) {}
    }

    playBullseye() {
        if (this.isMuted || !this.ctx) return;
        try {
            const chord = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
            const t = this.ctx.currentTime;
            chord.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t + idx * 0.06);
                gain.gain.setValueAtTime(0.08, t + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.4);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + idx * 0.06);
                osc.stop(t + idx * 0.06 + 0.45);
            });
        } catch (e) {}
    }

    playCloseGuess() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, t);
            osc.frequency.exponentialRampToValueAtTime(660, t + 0.1);

            gain.gain.setValueAtTime(0.07, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.2);
        } catch (e) {}
    }

    playMiss() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, t);
            osc.frequency.linearRampToValueAtTime(90, t + 0.2);

            gain.gain.setValueAtTime(0.08, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.25);
        } catch (e) {}
    }
}
