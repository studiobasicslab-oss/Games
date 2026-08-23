/**
 * Web Audio Synthesizer Engine for The Celestial Cartographer
 * Procedurally generates ethereal cosmic pads, crystal star chimes,
 * brass astrolabe ratchet clicks, and navigational pointer hums.
 */

export class CelestialAudioEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.ambientGain = null;
        this.padOscs = [];
        this.droneActive = false;

        const savedMute = localStorage.getItem('celestial_mute');
        if (savedMute === 'true') {
            this.enabled = false;
        }

        // Pentatonic / Pythagorean celestial scale frequencies (Hz)
        this.starNotes = [
            261.63, // C4
            293.66, // D4
            329.63, // E4
            392.00, // G4
            440.00, // A4
            523.25, // C5
            587.33, // D5
            659.25, // E5
            783.99, // G5
            880.00, // A5
            1046.50 // C6
        ];
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

    toggleSound() {
        this.enabled = !this.enabled;
        localStorage.setItem('celestial_mute', (!this.enabled).toString());
        if (this.enabled) {
            this.init();
            this.playAstrolabeClick();
            this.startAmbientDrone();
        } else {
            this.stopAmbientDrone();
        }
        return this.enabled;
    }

    startAmbientDrone() {
        if (!this.enabled || this.droneActive) return;
        this.init();
        if (!this.ctx) return;

        try {
            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
            this.ambientGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3.0);

            // Filter for deep space atmosphere
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(320, this.ctx.currentTime);

            // 3 Harmonic drone oscillators for celestial chord (F - C - G drone)
            const freqs = [87.31, 130.81, 196.00];
            this.padOscs = freqs.map((freq, i) => {
                const osc = this.ctx.createOscillator();
                osc.type = i === 0 ? 'triangle' : 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

                // Subtle detune for shimmer
                osc.detune.setValueAtTime((i - 1) * 3, this.ctx.currentTime);

                osc.connect(filter);
                osc.start();
                return osc;
            });

            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);
            this.droneActive = true;
        } catch (e) {
            console.warn('Ambient drone error:', e);
        }
    }

    stopAmbientDrone() {
        if (!this.droneActive || !this.ambientGain || !this.ctx) return;
        try {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
            setTimeout(() => {
                this.padOscs.forEach(osc => {
                    try { osc.stop(); osc.disconnect(); } catch (e) {}
                });
                this.padOscs = [];
                this.droneActive = false;
            }, 1000);
        } catch (e) {
            this.droneActive = false;
        }
    }

    // Play crystal chime when player touches or links a star
    playStarChime(stepIndex = 0) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const noteIdx = Math.min(stepIndex, this.starNotes.length - 1);
            const baseFreq = this.starNotes[noteIdx % this.starNotes.length];

            // Fundamental sine bell
            const osc = this.ctx.createOscillator();
            const oscHarmonic = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq, now);

            // Shimmer overtone (octave + fifth)
            oscHarmonic.type = 'sine';
            oscHarmonic.frequency.setValueAtTime(baseFreq * 2.76, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

            osc.connect(gain);
            oscHarmonic.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            oscHarmonic.start(now);
            osc.stop(now + 1.45);
            oscHarmonic.stop(now + 1.45);
        } catch (e) {}
    }

    // Sound when a pointer ray begins casting
    playPointerRay(progress = 0) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            const startFreq = 220 + progress * 300;
            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(startFreq + 150, now + 0.12);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    }

    // Pointer target lock sound
    playPointerLock() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const chords = [523.25, 659.25, 783.99, 1046.5]; // C Major sparkle

            chords.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.04);

                gain.gain.setValueAtTime(0.001, now + idx * 0.04);
                gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.04 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.04);
                osc.stop(now + idx * 0.04 + 1.25);
            });
        } catch (e) {}
    }

    // Triumph arpeggio when constellation is successfully chartered
    playConstellationComplete() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];

            notes.forEach((freq, idx) => {
                const noteTime = now + idx * 0.08;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.001, noteTime);
                gain.gain.linearRampToValueAtTime(0.14, noteTime + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.0);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 2.05);
            });
        } catch (e) {}
    }

    // Vintage brass astrolabe wheel ratchet click
    playAstrolabeClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.02);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.02);
        } catch (e) {}
    }

    // Soft wrong connect hint tone
    playErrorTone() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.18);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.18);
        } catch (e) {}
    }
}
