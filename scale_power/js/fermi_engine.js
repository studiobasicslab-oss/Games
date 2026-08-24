/**
 * Scale: The Power of Ten - Fermi Estimation Engine & Scale Physics
 */

class FermiEngine {
    constructor(audioEngine, vfxEngine) {
        this.audio = audioEngine;
        this.vfx = vfxEngine;

        this.currentExponent = 0;
        this.score = 0;
        this.currentChallengeIndex = 0;
        this.solvedChallenges = 0;
    }

    setExponent(exp) {
        this.currentExponent = Math.max(-18, Math.min(26, exp));
        if (this.vfx) this.vfx.setScaleExponent(this.currentExponent);
        if (this.audio) this.audio.playZoomSweep(this.currentExponent);

        return this.getCurrentObject();
    }

    getCurrentObject() {
        // Find closest object in database
        let closest = SCALE_OBJECTS[0];
        let minDiff = 999;
        SCALE_OBJECTS.forEach(obj => {
            const diff = Math.abs(obj.exp - this.currentExponent);
            if (diff < minDiff) {
                minDiff = diff;
                closest = obj;
            }
        });
        return closest;
    }

    getDominantForce() {
        const exp = this.currentExponent;
        if (exp <= -14) return { name: "Strong Nuclear Force", color: "#f59e0b", range: "10⁻¹⁸ to 10⁻¹⁴ m" };
        if (exp > -14 && exp <= 4) return { name: "Electromagnetism & Chemistry", color: "#00f0ff", range: "10⁻¹³ to 10⁴ m" };
        if (exp > 4 && exp <= 23) return { name: "Universal Gravity", color: "#a855f7", range: "10⁵ to 10²³ m" };
        return { name: "Dark Energy & Cosmic Metric Expansion", color: "#ec4899", range: "10²⁴ to 10²⁶ m" };
    }

    evaluateFermiGuess(guessExp) {
        const challenge = FERMI_CHALLENGES[this.currentChallengeIndex];
        if (!challenge) return null;

        const diff = Math.abs(guessExp - challenge.correctExp);

        let earned = 0;
        let rating = 'miss';
        let message = '';

        if (diff === 0) {
            earned = 1000;
            rating = 'bullseye';
            message = `🎯 DIRECT HIT! Exact order of magnitude (10^${guessExp} m).`;
            if (this.audio) this.audio.playBullseye();
        } else if (diff <= challenge.tolerance) {
            earned = 600;
            rating = 'close';
            message = `✨ EXCELLENT! Within 1 order of magnitude (Actual: 10^${challenge.correctExp} m).`;
            if (this.audio) this.audio.playCloseGuess();
        } else if (diff <= 2) {
            earned = 250;
            rating = 'fair';
            message = `👍 FAIR ESTIMATION: Off by 2 orders of magnitude (Actual: 10^${challenge.correctExp} m).`;
            if (this.audio) this.audio.playCloseGuess();
        } else {
            earned = 0;
            rating = 'miss';
            message = `❌ WIDE ESTIMATION: Actual scale is 10^${challenge.correctExp} m (Off by ${diff} orders).`;
            if (this.audio) this.audio.playMiss();
        }

        this.score += earned;
        this.solvedChallenges++;

        return {
            rating,
            earned,
            diff,
            message,
            explanation: challenge.explanation,
            correctExp: challenge.correctExp
        };
    }
}
