/**
 * ISOFILTER: Procedural Web Audio Synthesizer
 * High-fidelity, zero-latency industrial laboratory sound design.
 */

class NuclearAudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.masterGain = null;
        this.isInitialized = false;
        this.flowStateActive = false;
        this.ambientHumNode = null;
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
            this.isInitialized = true;
            this.startAmbientHum();
        } catch (e) {
            console.warn("AudioContext not allowed yet or not supported:", e);
        }
    }

    resume() {
        if (!this.isInitialized) {
            this.init();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.35, this.ctx.currentTime);
        }
        return this.muted;
    }

    startAmbientHum() {
        if (!this.ctx || this.ambientHumNode) return;
        // Low industrial reactor turbine drone
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const humGain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, this.ctx.currentTime); // 55Hz A1 drone

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(110, this.ctx.currentTime);

        humGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(humGain);
        humGain.connect(this.masterGain);

        osc.start();
        this.ambientHumNode = { osc, humGain, filter };
    }

    /**
     * Heavy mechanical pneumatic gate CLUNK
     */
    playGateClunk(direction = 'left') {
        if (!this.ctx || this.muted) return;
        this.resume();

        const t = this.ctx.currentTime;
        
        // 1. Pneumatic hiss (white noise burst)
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1800, t);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start(t);

        // 2. Heavy steel mechanical thump
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        const baseFreq = direction === 'left' ? 140 : 160;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);

        oscGain.gain.setValueAtTime(0.4, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.13);
    }

    /**
     * Geiger Counter click crackle
     */
    playGeigerClick(intensity = 1) {
        if (!this.ctx || this.muted) return;
        this.resume();

        const count = Math.min(6, Math.max(1, Math.floor(intensity * 3)));
        for (let k = 0; k < count; k++) {
            const delay = (k * 0.015) + (Math.random() * 0.02);
            const t = this.ctx.currentTime + delay;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(3200 + Math.random() * 800, t);

            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.006);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t);
            osc.stop(t + 0.007);
        }
    }

    /**
     * Big metallic CLUNK when item hits the correct bin
     */
    playBinAccept(isBonus = false) {
        if (!this.ctx || this.muted) return;
        this.resume();

        const t = this.ctx.currentTime;

        // Resonant metallic thud
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';

        const pitch = isBonus ? 523.25 : 349.23; // C5 or F4
        osc1.frequency.setValueAtTime(pitch, t);
        osc1.frequency.exponentialRampToValueAtTime(pitch * 0.5, t + 0.25);

        osc2.frequency.setValueAtTime(pitch * 1.5, t);
        osc2.frequency.exponentialRampToValueAtTime(pitch * 0.75, t + 0.18);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.29);
        osc2.stop(t + 0.29);
    }

    /**
     * Harsh buzzer error when sorted into wrong bin
     */
    playErrorBuzz() {
        if (!this.ctx || this.muted) return;
        this.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.setValueAtTime(90, t + 0.1);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.linearRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.31);
    }

    /**
     * Streak multiplier crescendo
     */
    playStreakChime(streakCount) {
        if (!this.ctx || this.muted) return;
        this.resume();

        const t = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        const noteIdx = Math.min(notes.length - 1, Math.floor(streakCount / 2));
        const freq = notes[noteIdx];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 1.05, t + 0.15);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.26);
    }

    /**
     * FLOW STATE dynamic surge
     */
    setFlowState(active) {
        this.flowStateActive = active;
        if (!this.ambientHumNode || !this.ctx) return;
        const t = this.ctx.currentTime;
        if (active) {
            this.ambientHumNode.osc.frequency.setTargetAtTime(110, t, 0.2);
            this.ambientHumNode.filter.frequency.setTargetAtTime(450, t, 0.2);
            this.ambientHumNode.humGain.gain.setTargetAtTime(0.08, t, 0.2);
        } else {
            this.ambientHumNode.osc.frequency.setTargetAtTime(55, t, 0.5);
            this.ambientHumNode.filter.frequency.setTargetAtTime(110, t, 0.5);
            this.ambientHumNode.humGain.gain.setTargetAtTime(0.04, t, 0.5);
        }
    }

    /**
     * Victory jingle when solving puzzle
     */
    playVictoryFanfare() {
        if (!this.ctx || this.muted) return;
        this.resume();

        const t = this.ctx.currentTime;
        const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
        chords.forEach((pitch, i) => {
            const timeOffset = i * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(pitch, t + timeOffset);

            gain.gain.setValueAtTime(0.2, t + timeOffset);
            gain.gain.exponentialRampToValueAtTime(0.001, t + timeOffset + 0.4);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t + timeOffset);
            osc.stop(t + timeOffset + 0.41);
        });
    }

    /**
     * UI click
     */
    playClick() {
        if (!this.ctx || this.muted) return;
        this.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.03);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.035);
    }
}

export const sound = new NuclearAudioEngine();
