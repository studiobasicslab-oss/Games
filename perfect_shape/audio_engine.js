/**
 * Synthesizer Audio Engine for Perfect Shape
 * Generates soothing ASMR pencil/stylus friction and celestial bell chimes.
 */

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.drawGain = null;
        this.drawFilter = null;
        this.noiseNode = null;
        this.subTone = null;
        this.isDrawing = false;
        
        // Load preferences
        const savedMute = localStorage.getItem('perfect_shape_mute');
        if (savedMute === 'true') {
            this.enabled = false;
        }
    }

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleSound() {
        this.enabled = !this.enabled;
        localStorage.setItem('perfect_shape_mute', (!this.enabled).toString());
        if (this.enabled) {
            this.init();
            this.playClick();
        }
        return this.enabled;
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(900, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.035);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.035);
        } catch (e) {}
    }

    createNoiseBuffer() {
        if (!this.ctx) return null;
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds loop
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        // Generate soft brown/pink noise (soothing texture, not harsh static)
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Gain boost
        }
        return buffer;
    }

    startDrawSound(speed = 1) {
        if (!this.enabled || this.isDrawing) return;
        this.init();
        try {
            this.isDrawing = true;
            const now = this.ctx.currentTime;

            // 1. Soft Textured Noise (Pencil on canvas friction)
            const noiseBuffer = this.createNoiseBuffer();
            if (noiseBuffer) {
                this.noiseNode = this.ctx.createBufferSource();
                this.noiseNode.buffer = noiseBuffer;
                this.noiseNode.loop = true;

                this.drawFilter = this.ctx.createBiquadFilter();
                this.drawFilter.type = 'bandpass';
                this.drawFilter.frequency.setValueAtTime(750, now);
                this.drawFilter.Q.setValueAtTime(1.2, now);

                this.drawGain = this.ctx.createGain();
                this.drawGain.gain.setValueAtTime(0.0001, now);
                this.drawGain.gain.linearRampToValueAtTime(0.035, now + 0.04);

                this.noiseNode.connect(this.drawFilter);
                this.drawFilter.connect(this.drawGain);
                this.drawGain.connect(this.ctx.destination);
                this.noiseNode.start();
            }

            // 2. Very subtle warm harmonic undertone
            this.subTone = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            this.subTone.type = 'sine';
            this.subTone.frequency.setValueAtTime(280, now);
            subGain.gain.setValueAtTime(0.0001, now);
            subGain.gain.linearRampToValueAtTime(0.012, now + 0.05);

            this.subTone.connect(subGain);
            subGain.connect(this.ctx.destination);
            this.subTone.start();
            this.subGain = subGain;

        } catch (e) {}
    }

    updateDrawPitch(velocity) {
        if (!this.enabled || !this.isDrawing || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Modulate filter cutoff smoothly with drawing speed
            if (this.drawFilter) {
                const targetFreq = Math.min(1400, 500 + velocity * 18);
                this.drawFilter.frequency.setTargetAtTime(targetFreq, now, 0.05);
            }
            if (this.subTone) {
                const targetPitch = Math.min(420, 240 + velocity * 4);
                this.subTone.frequency.setTargetAtTime(targetPitch, now, 0.05);
            }
        } catch (e) {}
    }

    stopDrawSound() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        try {
            const now = this.ctx ? this.ctx.currentTime : 0;
            if (this.drawGain && this.ctx) {
                this.drawGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
            }
            if (this.subGain && this.ctx) {
                this.subGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
            }
            setTimeout(() => {
                if (this.noiseNode) {
                    try { this.noiseNode.stop(); this.noiseNode.disconnect(); } catch (e) {}
                    this.noiseNode = null;
                }
                if (this.subTone) {
                    try { this.subTone.stop(); this.subTone.disconnect(); } catch (e) {}
                    this.subTone = null;
                }
            }, 60);
        } catch (e) {}
    }

    playScoreTick(ratio) {
        if (!this.enabled) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const baseFreq = 320 + ratio * 520;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.025);
        } catch (e) {}
    }

    playScoreReveal(score) {
        if (!this.enabled) return;
        this.init();
        try {
            if (score >= 95) {
                // Celestial harp / bell major chord (C5, E5, G5, B5, C6)
                const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
                notes.forEach((freq, idx) => {
                    setTimeout(() => {
                        this.playBellNote(freq, 0.45);
                    }, idx * 60);
                });
            } else if (score >= 85) {
                const notes = [440, 554.37, 659.25, 880]; // A major
                notes.forEach((freq, idx) => {
                    setTimeout(() => {
                        this.playBellNote(freq, 0.35);
                    }, idx * 70);
                });
            } else if (score >= 70) {
                const notes = [392, 493.88, 587.33]; // G major
                notes.forEach((freq, idx) => {
                    setTimeout(() => {
                        this.playBellNote(freq, 0.25);
                    }, idx * 80);
                });
            } else {
                this.playBellNote(330, 0.18);
                setTimeout(() => this.playBellNote(293.66, 0.2), 110);
            }
        } catch (e) {}
    }

    playBellNote(freq, duration) {
        if (!this.enabled || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }
}
