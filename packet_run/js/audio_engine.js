/**
 * Packet Run: The Microarchitect - Audio Engine
 * Procedural Web Audio API sound synthesizer
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientGain = null;
        this.ambientOsc = null;
        this.isInitialized = false;

        try {
            const saved = localStorage.getItem('packet_run_muted');
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
            localStorage.setItem('packet_run_muted', JSON.stringify(this.isMuted));
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
            this.ambientGain.gain.exponentialRampToValueAtTime(0.03, t + 2.0);

            // Low frequency silicon hum (60Hz + 120Hz harmonics)
            this.ambientOsc = this.ctx.createOscillator();
            this.ambientOsc.type = 'sine';
            this.ambientOsc.frequency.setValueAtTime(64, t);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(180, t);

            this.ambientOsc.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);
            this.ambientOsc.start();
        } catch (e) {
            console.warn('Ambient start failed', e);
        }
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

    playClockTick() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, t);
            osc.frequency.exponentialRampToValueAtTime(440, t + 0.02);
            gain.gain.setValueAtTime(0.02, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.03);
        } catch (e) {}
    }

    playAluExec(unit = 0) {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            const baseFreq = unit === 0 ? 523.25 : 659.25; // C5 or E5
            osc.frequency.setValueAtTime(baseFreq, t);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.06);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(baseFreq * 1.2, t);
            filter.Q.setValueAtTime(4, t);

            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.08);
        } catch (e) {}
    }

    playCacheHit(level = 'L1') {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const freq = level === 'L1' ? 1046.5 : 880; // C6 or A5
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + 0.08);

            gain.gain.setValueAtTime(0.07, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.13);
        } catch (e) {}
    }

    playCacheMiss() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, t);
            osc.frequency.linearRampToValueAtTime(110, t + 0.15);

            gain.gain.setValueAtTime(0.08, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.2);
        } catch (e) {}
    }

    playHazardStall() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.setValueAtTime(130, t + 0.05);

            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.13);
        } catch (e) {}
    }

    playBranchPredict(success = true) {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            if (success) {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, t); // D5
                osc.frequency.setValueAtTime(880, t + 0.05); // A5
                gain.gain.setValueAtTime(0.08, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            } else {
                // Mispredict flush
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(370, t);
                osc.frequency.linearRampToValueAtTime(140, t + 0.2);
                gain.gain.setValueAtTime(0.1, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            }
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + (success ? 0.16 : 0.25));
        } catch (e) {}
    }

    playInstructionComplete() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1318.5, t); // E6
            gain.gain.setValueAtTime(0.04, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.07);
        } catch (e) {}
    }

    playVictory() {
        if (this.isMuted || !this.ctx) return;
        try {
            const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C E G C E
            const t = this.ctx.currentTime;
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t + idx * 0.08);
                gain.gain.setValueAtTime(0, t);
                gain.gain.setValueAtTime(0.08, t + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + idx * 0.08);
                osc.stop(t + idx * 0.08 + 0.4);
            });
        } catch (e) {}
    }

    playDragDrop() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, t);
            osc.frequency.exponentialRampToValueAtTime(660, t + 0.04);
            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.06);
        } catch (e) {}
    }
}
