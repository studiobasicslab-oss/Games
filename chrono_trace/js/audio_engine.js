/**
 * ChronoTrace Audio Engine
 * Real-time procedural sound synthesizer using Web Audio API
 * No external sound files required!
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientGain = null;
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.isAmbientPlaying = false;
        this.initOnFirstInteraction = this.initOnFirstInteraction.bind(this);

        // Try to load mute state
        try {
            const saved = localStorage.getItem('chronotrace_audio_muted');
            if (saved !== null) {
                this.isMuted = JSON.parse(saved);
            }
        } catch (e) {}

        // Bind auto-init listeners
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
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    initOnFirstInteraction() {
        if (!this.ctx) {
            this.init();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this.isAmbientPlaying && !this.isMuted) {
            this.startAmbient();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        try {
            localStorage.setItem('chronotrace_audio_muted', JSON.stringify(this.isMuted));
        } catch (e) {}

        if (this.isMuted) {
            this.stopAmbient();
        } else {
            this.startAmbient();
            this.playNodeSelect();
        }
        return this.isMuted;
    }

    startAmbient() {
        if (this.isMuted || !this.ctx || this.isAmbientPlaying) return;
        try {
            const now = this.ctx.currentTime;
            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.setValueAtTime(0.001, now);
            this.ambientGain.gain.exponentialRampToValueAtTime(0.04, now + 3);

            // Sub harmonic drone (432Hz harmonic 54Hz)
            this.ambientOsc1 = this.ctx.createOscillator();
            this.ambientOsc1.type = 'sine';
            this.ambientOsc1.frequency.setValueAtTime(54, now);

            // Subtle beating osc (54.5Hz)
            this.ambientOsc2 = this.ctx.createOscillator();
            this.ambientOsc2.type = 'triangle';
            this.ambientOsc2.frequency.setValueAtTime(54.6, now);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(140, now);

            this.ambientOsc1.connect(filter);
            this.ambientOsc2.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);

            this.ambientOsc1.start();
            this.ambientOsc2.start();
            this.isAmbientPlaying = true;
        } catch (e) {
            console.warn('Ambient error', e);
        }
    }

    stopAmbient() {
        if (!this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;
        try {
            const now = this.ctx.currentTime;
            this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
            setTimeout(() => {
                try {
                    if (this.ambientOsc1) this.ambientOsc1.stop();
                    if (this.ambientOsc2) this.ambientOsc2.stop();
                } catch (err) {}
                this.isAmbientPlaying = false;
            }, 600);
        } catch (e) {
            this.isAmbientPlaying = false;
        }
    }

    playNodeHover(pitchFactor = 1.0) {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const freq = 440 * pitchFactor;
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + 0.08);

            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    }

    playNodeSelect(stepIndex = 0) {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Pentatonic scale harmonic progression based on stepIndex
            const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
            const baseFreq = pentatonic[stepIndex % pentatonic.length] || 329.63;

            // Dual resonant bell sound
            [1, 2.01, 3.02].forEach((mult, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = i === 0 ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(baseFreq * mult, now);

                const vol = 0.15 / (i + 1);
                gain.gain.setValueAtTime(vol, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.45);
            });
        } catch (e) {}
    }

    playParadoxTrap() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            
            // Dissonant tritone shockwave
            const freqs = [311.13, 220.00, 155.56, 110.00];
            freqs.forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = idx % 2 === 0 ? 'sawtooth' : 'square';
                osc.frequency.setValueAtTime(f, now);
                osc.frequency.exponentialRampToValueAtTime(f * 0.5, now + 0.5);

                // Distortion bandpass filter
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(600, now);
                filter.Q.setValueAtTime(3, now);

                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.55);
            });
        } catch (e) {}
    }

    playUndo() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(260, now + 0.15);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {}
    }

    playRelicUse() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Shimmering arpeggio
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.05);

                gain.gain.setValueAtTime(0.1, now + i * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.25);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + i * 0.05);
                osc.stop(now + i * 0.05 + 0.25);
            });
        } catch (e) {}
    }

    playVictory() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Majestic chord progression: Cmaj -> Gmaj -> Fmaj -> Cmaj9
            const notes = [
                { f: 261.63, t: 0 },
                { f: 329.63, t: 0.1 },
                { f: 392.00, t: 0.2 },
                { f: 523.25, t: 0.3 },
                { f: 659.25, t: 0.45 },
                { f: 783.99, t: 0.6 },
                { f: 1046.50, t: 0.75 }
            ];

            notes.forEach(n => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(n.f, now + n.t);

                gain.gain.setValueAtTime(0.15, now + n.t);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + 1.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + n.t);
                osc.stop(now + n.t + 1.2);
            });
        } catch (e) {}
    }
}

// Global instance
const audioEngine = new AudioEngine();
if (typeof window !== 'undefined') {
    window.audioEngine = audioEngine;
}
