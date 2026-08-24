/**
 * Etymo-Tree: The Root Shifter - Historical Linguistics Engine
 */

class LinguisticsEngine {
    constructor(audioEngine, vfxEngine) {
        this.audio = audioEngine;
        this.vfx = vfxEngine;

        this.currentPuzzle = null;
        this.selectedRoot = null;
        this.appliedLaws = [];
        this.identifiedFalseFriends = [];
        this.score = 0;
        this.solved = false;
    }

    loadPuzzle(puzzleData) {
        this.currentPuzzle = puzzleData;
        this.selectedRoot = null;
        this.appliedLaws = [];
        this.identifiedFalseFriends = [];
        this.solved = false;
    }

    // Apply Sound Law to current ancestral root
    applySoundLaw(lawId) {
        if (!this.currentPuzzle) return null;
        const law = SOUND_LAWS.find(l => l.id === lawId);
        if (!law) return null;

        if (this.appliedLaws.includes(lawId)) {
            // Toggle off
            this.appliedLaws = this.appliedLaws.filter(id => id !== lawId);
        } else {
            this.appliedLaws.push(lawId);
        }

        if (this.audio) this.audio.playLawShift();
        if (this.vfx) this.vfx.spawnLinguisticFlash(window.innerWidth / 2, window.innerHeight / 2, '#f59e0b');

        return this.computeTransformedWord();
    }

    selectRoot(protoRoot) {
        this.selectedRoot = protoRoot;
        if (this.audio) this.audio.playRootSelect();
        return this.checkSolution();
    }

    toggleFalseFriend(wordId) {
        if (this.identifiedFalseFriends.includes(wordId)) {
            this.identifiedFalseFriends = this.identifiedFalseFriends.filter(id => id !== wordId);
        } else {
            this.identifiedFalseFriends.push(wordId);
            const word = this.currentPuzzle.words.find(w => w.id === wordId);
            if (word && word.isFalseFriend) {
                if (this.audio) this.audio.playCipherSuccess();
            } else {
                if (this.audio) this.audio.playFalseFriendTrap();
            }
        }
        return this.checkSolution();
    }

    computeTransformedWord() {
        if (!this.selectedRoot) return '—';
        let word = this.selectedRoot.replace(/\*/g, '');

        this.appliedLaws.forEach(lawId => {
            const law = SOUND_LAWS.find(l => l.id === lawId);
            if (law && law.transform) {
                word = law.transform(word);
            }
        });

        return word;
    }

    checkSolution() {
        if (!this.currentPuzzle || !this.selectedRoot) return { isCorrect: false, message: 'Select a Proto-Root hypothesis.' };

        const isRootCorrect = this.selectedRoot === this.currentPuzzle.correctRoot;
        const requiredLaws = this.currentPuzzle.targetBranchLaw ? [this.currentPuzzle.targetBranchLaw] : [];
        const hasRequiredLaws = requiredLaws.every(l => this.appliedLaws.includes(l));

        const correctFalseFriends = this.currentPuzzle.words.filter(w => w.isFalseFriend).map(w => w.id);
        const falseFriendsMatch = correctFalseFriends.length === this.identifiedFalseFriends.length &&
            correctFalseFriends.every(id => this.identifiedFalseFriends.includes(id));

        if (isRootCorrect && hasRequiredLaws && falseFriendsMatch) {
            this.solved = true;
            this.score += 500;
            if (this.audio) this.audio.playCipherSuccess();
            return { isCorrect: true, message: '✨ Decryption Complete! Ancient Proto-Indo-European root and sound laws verified.' };
        }

        if (!isRootCorrect) {
            return { isCorrect: false, message: 'Proto-Root does not match the comparative cognate group.' };
        }
        if (!hasRequiredLaws) {
            return { isCorrect: false, message: 'Apply the correct historical sound law (e.g. Grimm\'s Law) to bridge ancient and modern forms.' };
        }
        if (!falseFriendsMatch) {
            return { isCorrect: false, message: 'Identify the deceptive false cognate / loanword trap among modern words!' };
        }

        return { isCorrect: false, message: 'Analyzing phonological shifts...' };
    }
}

const SOUND_LAWS = [
    {
        id: 'grimms_law_p_f',
        name: "Grimm's Law (p ➔ f, t ➔ th, k ➔ h)",
        branch: "Proto-Germanic",
        description: "PIE voiceless stops become Germanic voiceless fricatives: *ph₂tḗr ➔ Father, *ḱwṓn ➔ Hound, *tréyes ➔ Three.",
        transform: (w) => w.replace(/p/g, 'f').replace(/t/g, 'th').replace(/k/g, 'h').replace(/ḱ/g, 'h')
    },
    {
        id: 'high_german_shift',
        name: "High German Consonant Shift (d ➔ t, t ➔ z/ss)",
        branch: "Old High German",
        description: "Germanic stops shift in German: English 'Water' ➔ German 'Wasser', 'Father' ➔ 'Vater'.",
        transform: (w) => w.replace(/d/g, 't').replace(/t/g, 'ss').replace(/th/g, 't')
    },
    {
        id: 'palatalization_satem',
        name: "Satem Palatalization (ḱ ➔ ś/sh, ǵ ➔ j)",
        branch: "Indo-Iranian / Slavic",
        description: "Velar stops palatalize into sibilants: PIE *ḱm̥tóm ➔ Sanskrit 'Śatam', Avestan 'Satem'.",
        transform: (w) => w.replace(/ḱ/g, 'ś').replace(/k/g, 's').replace(/ǵ/g, 'j')
    },
    {
        id: 'romance_lenition',
        name: "Romance Intervocalic Lenition (p ➔ b ➔ v)",
        branch: "Italic / Romance",
        description: "Latin intervocalic voiceless stops soften in Spanish and French: Capra ➔ Cabra / Chèvre.",
        transform: (w) => w.replace(/p/g, 'b').replace(/t/g, 'd')
    }
];
