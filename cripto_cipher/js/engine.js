/**
 * CRIPTO-CIPHER: Cryptanalysis & Signal Decoding Engine
 * Frequency Histograms, Substitution Mappings, Vigenère Polyalphabetic Matrix, Enigma Rotors.
 */

class CriptoEngine {
    constructor() {
        this.currentIntercept = null;
        this.userSubstitution = {}; // { 'X': 'E', 'Q': 'T' }
        this.caesarShift = 0;
        this.vigenereKey = "";
        this.enigmaRotors = [1, 1, 1]; // Rotor I, II, III (1-26)
        this.ciphertextLetterFreq = {};
        this.timeRemainingSec = 90;
        this.isDecrypted = false;
        this.isTimeExpired = false;
    }

    loadIntercept(interceptData) {
        this.currentIntercept = interceptData;
        this.userSubstitution = {};
        this.caesarShift = 0;
        this.vigenereKey = "";
        this.enigmaRotors = [1, 1, 1];
        this.timeRemainingSec = interceptData.timeLimitSec;
        this.isDecrypted = false;
        this.isTimeExpired = false;

        // Initialize user substitution mapping
        for (let i = 65; i <= 90; i++) {
            const ch = String.fromCharCode(i);
            this.userSubstitution[ch] = null;
        }

        // Calculate Ciphertext Frequency Histogram
        this.calculateCiphertextFrequencies();
    }

    calculateCiphertextFrequencies() {
        this.ciphertextLetterFreq = {};
        const text = this.currentIntercept.ciphertext.toUpperCase();
        let totalLetters = 0;

        for (let i = 65; i <= 90; i++) {
            this.ciphertextLetterFreq[String.fromCharCode(i)] = 0;
        }

        for (const char of text) {
            if (char >= 'A' && char <= 'Z') {
                this.ciphertextLetterFreq[char] = (this.ciphertextLetterFreq[char] || 0) + 1;
                totalLetters++;
            }
        }

        // Normalize to percentages
        if (totalLetters > 0) {
            for (const k in this.ciphertextLetterFreq) {
                this.ciphertextLetterFreq[k] = parseFloat(((this.ciphertextLetterFreq[k] / totalLetters) * 100).toFixed(1));
            }
        }
    }

    // Set letter substitution mapping
    setSubstitution(cipherChar, plainChar) {
        if (!cipherChar || cipherChar < 'A' || cipherChar > 'Z') return;
        this.userSubstitution[cipherChar] = plainChar ? plainChar.toUpperCase() : null;
        window.criptoAudio.playTeletypeClack();
        this.checkDecryptionStatus();
    }

    // Set Caesar Shift
    setCaesarShift(shift) {
        this.caesarShift = (shift + 26) % 26;
        window.criptoAudio.playRotorStep();
        this.checkDecryptionStatus();
    }

    // Step Enigma Rotor
    stepRotor(rotorIndex, delta) {
        this.enigmaRotors[rotorIndex] = ((this.enigmaRotors[rotorIndex] - 1 + delta + 26) % 26) + 1;
        window.criptoAudio.playRotorStep();
        this.checkDecryptionStatus();
    }

    // Set Vigenere Key
    setVigenereKey(key) {
        this.vigenereKey = key.toUpperCase().replace(/[^A-Z]/g, '');
        window.criptoAudio.playTeletypeClack();
        this.checkDecryptionStatus();
    }

    // Generate Current Decoded Plaintext Candidate
    getDecodedText() {
        if (!this.currentIntercept) return "";
        const cipher = this.currentIntercept.ciphertext;
        const type = this.currentIntercept.cipherType;
        let result = "";

        if (type === 'caesar') {
            for (const ch of cipher) {
                if (ch >= 'A' && ch <= 'Z') {
                    const code = ch.charCodeAt(0) - 65;
                    const plainCode = (code - this.caesarShift + 26) % 26;
                    result += String.fromCharCode(65 + plainCode);
                } else {
                    result += ch;
                }
            }
        } else if (type === 'vigenere') {
            const key = this.vigenereKey || "A";
            let keyIdx = 0;
            for (const ch of cipher) {
                if (ch >= 'A' && ch <= 'Z') {
                    const cCode = ch.charCodeAt(0) - 65;
                    const kCode = key.charCodeAt(keyIdx % key.length) - 65;
                    const plainCode = (cCode - kCode + 26) % 26;
                    result += String.fromCharCode(65 + plainCode);
                    keyIdx++;
                } else {
                    result += ch;
                }
            }
        } else if (type === 'enigma') {
            const shift = (this.enigmaRotors[0] * 3 + this.enigmaRotors[1] * 7 + this.enigmaRotors[2]) % 26;
            for (const ch of cipher) {
                if (ch >= 'A' && ch <= 'Z') {
                    const code = ch.charCodeAt(0) - 65;
                    const plainCode = (code - shift + 26) % 26;
                    result += String.fromCharCode(65 + plainCode);
                } else {
                    result += ch;
                }
            }
        } else {
            // Monoalphabetic substitution
            for (const ch of cipher) {
                if (ch >= 'A' && ch <= 'Z') {
                    const mapped = this.userSubstitution[ch];
                    result += mapped ? mapped : '_';
                } else {
                    result += ch;
                }
            }
        }

        return result;
    }

    // Check if message is fully and correctly decrypted
    checkDecryptionStatus() {
        if (this.isDecrypted || this.isTimeExpired) return;

        const candidate = this.getDecodedText().replace(/[^A-Z]/g, '');
        const target = this.currentIntercept.plaintext.replace(/[^A-Z]/g, '');

        if (candidate === target) {
            this.isDecrypted = true;
            window.criptoAudio.playSuccessBell();
        }
    }

    // Calculate Completion Percentage
    getAccuracyPercentage() {
        if (!this.currentIntercept) return 0;
        const candidate = this.getDecodedText().replace(/[^A-Z]/g, '');
        const target = this.currentIntercept.plaintext.replace(/[^A-Z]/g, '');
        if (target.length === 0) return 0;

        let correct = 0;
        for (let i = 0; i < Math.min(candidate.length, target.length); i++) {
            if (candidate[i] === target[i]) correct++;
        }

        return Math.round((correct / target.length) * 100);
    }

    // Update Timer Loop
    update(dtSec) {
        if (this.isDecrypted || this.isTimeExpired) return;

        this.timeRemainingSec -= dtSec;

        // Morse code background telegraph blips
        if (Math.random() < 0.08) {
            window.criptoAudio.playMorseBeep(Math.random() > 0.5);
        }

        if (this.timeRemainingSec <= 0) {
            this.timeRemainingSec = 0;
            this.isTimeExpired = true;
        }
    }
}

window.criptoEngine = new CriptoEngine();
