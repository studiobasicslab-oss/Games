/**
 * Etymo-Tree: The Root Shifter - Procedural Web Audio Engine
 * Ancient lyre arpeggios, phonetic resonant glissandos, sound-law shift chimes, cipher solve fanfares.
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientGain = null;
        this.isInitialized = false;

        try {
            const saved = localStorage.getItem('etymo_tree_muted');
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
            localStorage.setItem('etymo_tree_muted', JSON.stringify(this.isMuted));
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
            this.ambientGain.gain.exponentialRampToValueAtTime(0.035, t + 2.5);

            // Ancient resonant drone (D Dorian mode fundamental: D2 73.4Hz + A2 110Hz)
            const osc1 = this.ctx.createOscillator();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(73.4, t);

            const osc2 = this.ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(110.0, t);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(280, t);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);
            osc1.start();
            osc2.start();
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

    playLawShift() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(392, t); // G4
            osc.frequency.exponentialRampToValueAtTime(784, t + 0.12); // G5 glissando

            gain.gain.setValueAtTime(0.08, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.18);
        } catch (e) {}
    }

    playRootSelect() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, t); // C5
            osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.08); // E5

            gain.gain.setValueAtTime(0.07, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.12);
        } catch (e) {}
    }

    playFalseFriendTrap() {
        if (this.isMuted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(240, t);
            osc.frequency.linearRampToValueAtTime(120, t + 0.2);

            gain.gain.setValueAtTime(0.09, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.25);
        } catch (e) {}
    }

    playCipherSuccess() {
        if (this.isMuted || !this.ctx) return;
        try {
            const harpNotes = [440, 554.37, 659.25, 880, 1108.73, 1318.5]; // A major ancient harp
            const t = this.ctx.currentTime;
            harpNotes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t + idx * 0.06);
                gain.gain.setValueAtTime(0.08, t + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.45);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + idx * 0.06);
                osc.stop(t + idx * 0.06 + 0.5);
            });
        } catch (e) {}
    }
}
