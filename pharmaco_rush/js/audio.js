/**
 * PHARMACO-RUSH: Procedural Audio Synthesizer (Web Audio API)
 * High-fidelity medical telemetry beeps, defibrillator charge hums, Code Blue alarms, and UI SFX.
 */

class PharmaAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isInitialized = false;
        this.lastHeartbeatTime = 0;
        this.flatlineOsc = null;
        this.alarmInterval = null;
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.isInitialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported or blocked", e);
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
        if (this.isMuted) {
            this.stopFlatline();
            this.stopAlarm();
        }
        return this.isMuted;
    }

    // Play realistic EKG QRS monitor blip with frequency scaled by heart rate
    playQRSBeep(hr, rhythm = 'normal') {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Pitch mapping: 50 bpm -> ~600Hz, 150 bpm -> ~950Hz, SVT 200+ -> ~1150Hz
        let baseFreq = 650 + Math.min(Math.max((hr - 60) * 4.5, -200), 550);
        if (rhythm === 'vfib' || rhythm === 'vtach') {
            baseFreq += (Math.random() - 0.5) * 180;
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = rhythm === 'vfib' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, now + 0.02);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.06);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Syringe delivery push sound (plunger click + liquid hiss)
    playDrugAdminister() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        
        // Mechanical click
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(1400, now);
        clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        clickGain.gain.setValueAtTime(0.2, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.05);

        // Fluid rush noise
        const bufferSize = this.ctx.sampleRate * 0.18;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2400, now);
        filter.Q.setValueAtTime(3.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now + 0.02);
        noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.06);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now + 0.02);
    }

    // Defibrillator charging capacitor whine
    playDefibCharge(durationSec = 2.0) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + durationSec);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.14, now + durationSec * 0.9);
        gain.gain.linearRampToValueAtTime(0.01, now + durationSec);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + durationSec);
    }

    // 200J Defibrillator Discharge Shock Thump
    playDefibShock() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Sub-bass heavy thump
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(120, now);
        bassOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

        bassGain.gain.setValueAtTime(0.45, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);

        bassOsc.start(now);
        bassOsc.stop(now + 0.4);

        // High voltage snap
        const snapOsc = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snapOsc.type = 'sawtooth';
        snapOsc.frequency.setValueAtTime(3200, now);
        snapOsc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

        snapGain.gain.setValueAtTime(0.25, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        snapOsc.connect(snapGain);
        snapGain.connect(this.ctx.destination);

        snapOsc.start(now);
        snapOsc.stop(now + 0.09);
    }

    // Critical Hospital Code Blue 3-tone chime
    playCodeBlueAlarm() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const tones = [880, 988, 1174]; // A5, B5, D6
        const now = this.ctx.currentTime;

        tones.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + index * 0.12;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.11);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.12);
        });
    }

    // Continuous flatline tone (Asystole)
    startFlatline() {
        if (this.isMuted || this.flatlineOsc) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        this.flatlineOsc = this.ctx.createOscillator();
        this.flatlineGain = this.ctx.createGain();

        this.flatlineOsc.type = 'sine';
        this.flatlineOsc.frequency.setValueAtTime(800, now);

        this.flatlineGain.gain.setValueAtTime(0.01, now);
        this.flatlineGain.gain.linearRampToValueAtTime(0.16, now + 0.2);

        this.flatlineOsc.connect(this.flatlineGain);
        this.flatlineGain.connect(this.ctx.destination);

        this.flatlineOsc.start(now);
    }

    stopFlatline() {
        if (this.flatlineOsc) {
            try {
                this.flatlineGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
                setTimeout(() => {
                    if (this.flatlineOsc) {
                        this.flatlineOsc.stop();
                        this.flatlineOsc.disconnect();
                        this.flatlineOsc = null;
                    }
                }, 100);
            } catch (e) {}
        }
    }

    // Success Fanfare (Patient Stabilized / Case Solved)
    playSuccessFanfare() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + idx * 0.1;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.22, startTime + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }

    // UI Click feedback
    playClick() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
    }
}

window.pharmaAudio = new PharmaAudioEngine();
