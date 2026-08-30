/**
 * POLYGLOT CONVOY: Translation Stream & Speed Typing Engine
 * Real-time keystroke matching, live WPM calculations, combo multipliers, and conveyor belt physics.
 */

class PolyglotEngine {
    constructor() {
        this.currentMission = null;
        this.activePhrases = []; // phrases currently on conveyor
        this.currentPhraseIndex = 0;
        this.typedBuffer = ""; // what user has typed for current active phrase
        this.totalCorrectChars = 0;
        this.totalErrors = 0;
        this.startTime = null;
        this.elapsedSec = 0;
        this.comboStreak = 0;
        this.maxCombo = 0;
        this.multiplier = 1;
        this.timeRemainingSec = 75;
        this.isMissionComplete = false;
        this.isFailed = false;
    }

    loadMission(missionData) {
        this.currentMission = missionData;
        this.activePhrases = JSON.parse(JSON.stringify(missionData.phrases));
        this.currentPhraseIndex = 0;
        this.typedBuffer = "";
        this.totalCorrectChars = 0;
        this.totalErrors = 0;
        this.startTime = performance.now();
        this.elapsedSec = 0;
        this.comboStreak = 0;
        this.maxCombo = 0;
        this.multiplier = 1;
        this.timeRemainingSec = missionData.durationSec;
        this.isMissionComplete = false;
        this.isFailed = false;
    }

    getCurrentTargetPhrase() {
        if (!this.activePhrases || this.currentPhraseIndex >= this.activePhrases.length) return null;
        return this.activePhrases[this.currentPhraseIndex];
    }

    // Process Player Keyboard Character
    processKeystroke(char) {
        if (this.isMissionComplete || this.isFailed) return { valid: false };

        const targetObj = this.getCurrentTargetPhrase();
        if (!targetObj) return { valid: false };

        const targetString = targetObj.target.toUpperCase();
        const expectedChar = targetString[this.typedBuffer.length];
        const inputChar = char.toUpperCase();

        if (inputChar === expectedChar) {
            // Correct Keystroke
            this.typedBuffer += inputChar;
            this.totalCorrectChars++;
            this.comboStreak++;
            if (this.comboStreak > this.maxCombo) this.maxCombo = this.comboStreak;

            // Multiplier progression
            this.updateMultiplier();

            window.polyglotAudio.playKeypress();

            // Check if whole phrase completed
            if (this.typedBuffer.length === targetString.length) {
                this.completeCurrentPhrase();
                return { valid: true, phraseCompleted: true };
            }

            return { valid: true, charMatched: true };
        } else {
            // Mistyped Keystroke
            this.totalErrors++;
            this.comboStreak = 0;
            this.multiplier = 1;
            window.polyglotAudio.playMistypeError();
            return { valid: false, error: true, expected: expectedChar, received: inputChar };
        }
    }

    // Handle Backspace
    handleBackspace() {
        if (this.typedBuffer.length > 0) {
            this.typedBuffer = this.typedBuffer.slice(0, -1);
            window.polyglotAudio.playKeypress();
        }
    }

    updateMultiplier() {
        const oldMult = this.multiplier;
        if (this.comboStreak >= 30) this.multiplier = 8;
        else if (this.comboStreak >= 18) this.multiplier = 4;
        else if (this.comboStreak >= 8) this.multiplier = 2;
        else this.multiplier = 1;

        if (this.multiplier > oldMult) {
            window.polyglotAudio.playStreakSurge(this.multiplier);
        }
    }

    completeCurrentPhrase() {
        window.polyglotAudio.playPhraseComplete();
        this.currentPhraseIndex++;
        this.typedBuffer = "";

        // Check if all mission phrases completed!
        if (this.currentPhraseIndex >= this.activePhrases.length) {
            this.isMissionComplete = true;
            window.polyglotAudio.playMissionSuccess();
        }
    }

    // Calculate Real-Time WPM (Standard: 5 characters = 1 word)
    calculateWPM() {
        if (this.elapsedSec < 1) return 0;
        const minutes = this.elapsedSec / 60;
        const words = this.totalCorrectChars / 5;
        return Math.round(words / minutes);
    }

    // Calculate Accuracy Percentage
    calculateAccuracy() {
        const total = this.totalCorrectChars + this.totalErrors;
        if (total === 0) return 100;
        return Math.round((this.totalCorrectChars / total) * 100);
    }

    // Update Timer & Conveyor Step
    update(dtSec) {
        if (this.isMissionComplete || this.isFailed) return;

        this.elapsedSec += dtSec;
        this.timeRemainingSec -= dtSec;

        if (this.timeRemainingSec <= 0) {
            this.timeRemainingSec = 0;
            this.isFailed = true;
            window.polyglotAudio.playMistypeError();
        }
    }
}

window.polyglotEngine = new PolyglotEngine();
