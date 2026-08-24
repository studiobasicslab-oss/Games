/**
 * LEXICON DASH - Game Modes Engine
 * Mode 1: Daily Gridlock (3x3 / 4x4 Seeded Matrix)
 * Mode 2: Speed Gauntlet (60s Blitz Arcade)
 * Mode 3: Multiplayer Arena (Tournament with Bots, Slam Buzzer & Peer Review)
 */

class DailyGridMode {
    constructor(gridSize = 3, customDateStr = null) {
        this.size = gridSize; // 3 or 4
        this.dateStr = customDateStr || new Date().toISOString().split('T')[0];
        this.letters = [];
        this.categories = [];
        this.grid = []; // [row][col] = { word: '', result: null, points: 0, status: 'empty' }
        this.usedWords = new Set();
        this.startTime = null;
        this.endTime = null;
        this.isCompleted = false;
        this.generateGrid();
    }

    // Deterministic pseudo-random number generator using seed string
    createPRNG(seedStr) {
        let h = 1779033703 ^ seedStr.length;
        for (let i = 0; i < seedStr.length; i++) {
            h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
            h = (h << 13) | (h >>> 19);
        }
        return function() {
            h = Math.imul(h ^ (h >>> 16), 2246822507);
            h = Math.imul(h ^ (h >>> 13), 3266489909);
            return (h >>> 0) / 4294967296;
        };
    }

    generateGrid() {
        const prng = this.createPRNG(this.dateStr + "_size_" + this.size);
        const allLetters = "ABCDEFGHIKLMNOPRSTUVW".split(""); // curated common letters
        
        // Pick unique letters for columns
        const shuffledLetters = [...allLetters].sort(() => prng() - 0.5);
        this.letters = shuffledLetters.slice(0, this.size);

        // Pick distinct categories for rows
        const allCatIds = window.LexiconDB.getAllCategoryIds();
        const shuffledCats = [...allCatIds].sort(() => prng() - 0.5);
        this.categories = shuffledCats.slice(0, this.size);

        // Initialize empty matrix
        this.grid = [];
        for (let r = 0; r < this.size; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.size; c++) {
                this.grid[r][c] = {
                    word: '',
                    result: null,
                    points: 0,
                    status: 'empty' // 'empty' | 'valid' | 'invalid'
                };
            }
        }
        this.startTime = Date.now();
        this.usedWords = new Set();
        this.isCompleted = false;
    }

    async setCellWord(row, col, rawWord) {
        const targetLetter = this.letters[col];
        const catId = this.categories[row];
        const clean = sanitizeInputWord(rawWord);

        // Check if word is already used in a different cell
        if (clean) {
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    if (r === row && c === col) continue;
                    if (this.grid[r][c].status === 'valid' && sanitizeInputWord(this.grid[r][c].word) === clean) {
                        return {
                            isValid: false,
                            reason: `"${rawWord}" was already used in another cell!`
                        };
                    }
                }
            }
        }

        if (!clean) {
            this.grid[row][col] = { word: '', result: null, points: 0, status: 'empty' };
            this.checkCompletion();
            return { isValid: false, reason: 'Empty input' };
        }

        const validation = await window.ValidationEngine.validateWord(rawWord, catId, targetLetter);
        if (validation.isValid) {
            const scoreData = window.ValidationEngine.calculateScore(validation, 1);
            this.grid[row][col] = {
                word: rawWord,
                result: validation,
                points: scoreData.points,
                rarityTier: scoreData.rarityTier,
                status: 'valid'
            };
        } else {
            this.grid[row][col] = {
                word: rawWord,
                result: validation,
                points: 0,
                rarityTier: 'invalid',
                status: 'invalid'
            };
        }

        this.checkCompletion();
        return validation;
    }

    checkCompletion() {
        let allFilled = true;
        let allValid = true;

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c].status === 'empty') {
                    allFilled = false;
                }
                if (this.grid[r][c].status !== 'valid') {
                    allValid = false;
                }
            }
        }

        if (allFilled && allValid && !this.isCompleted) {
            this.isCompleted = true;
            this.endTime = Date.now();
            if (window.ProgressionEngine) {
                window.ProgressionEngine.incrementBadge('grid_architect', 1);
                window.ProgressionEngine.addXP(300);
                window.ProgressionEngine.addStarDust(120);
            }
            if (window.AudioEngine) window.AudioEngine.playVictory();
            if (window.VFXEngine) window.VFXEngine.confettiCelebration();
        }

        return this.isCompleted;
    }

    getTotalScore() {
        let total = 0;
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                total += this.grid[r][c].points || 0;
            }
        }
        return total;
    }

    getDurationString() {
        const end = this.endTime || Date.now();
        const seconds = Math.floor((end - this.startTime) / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    generateShareText() {
        let text = `LEXICON DASH Daily Gridlock (${this.size}x${this.size})\n`;
        text += `📅 ${this.dateStr} | ⏱️ ${this.getDurationString()} | ⭐ ${this.getTotalScore()} pts\n\n`;

        for (let r = 0; r < this.size; r++) {
            let rowEmoji = '';
            for (let c = 0; c < this.size; c++) {
                const cell = this.grid[r][c];
                if (cell.status === 'valid') {
                    if (cell.rarityTier === 'rare') rowEmoji += '🟩 ';
                    else if (cell.rarityTier === 'frequent') rowEmoji += '🟦 ';
                    else rowEmoji += '🟨 ';
                } else if (cell.status === 'invalid') {
                    rowEmoji += '🟥 ';
                } else {
                    rowEmoji += '⬛ ';
                }
            }
            text += rowEmoji.trim() + '\n';
        }

        text += `\nPlay at: Lexicon Dash Trivia Gauntlet!`;
        return text;
    }
}

class SpeedGauntletMode {
    constructor() {
        this.timeRemaining = 60;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.activeLetter = 'A';
        this.categoryCards = []; // 5 categories
        this.completedCardIndices = new Set();
        this.timerInterval = null;
        this.isActive = false;
        this.starDustEarned = 0;
        this.wordsVerified = 0;
    }

    start(onTick, onFinish) {
        this.timeRemaining = 60;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.starDustEarned = 0;
        this.wordsVerified = 0;
        this.isActive = true;
        this.drawNewRound();

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (!this.isActive) return;
            this.timeRemaining--;

            if (this.timeRemaining <= 10 && this.timeRemaining > 0) {
                if (window.AudioEngine) window.AudioEngine.playTick(this.timeRemaining <= 5);
            }

            if (onTick) onTick(this.timeRemaining);

            if (this.timeRemaining <= 0) {
                this.finish(onFinish);
            }
        }, 1000);
    }

    drawNewRound() {
        const letters = "ABCDEFGHIKLMNOPRSTUVW".split("");
        this.activeLetter = letters[Math.floor(Math.random() * letters.length)];
        this.categoryCards = window.LexiconDB.getRandomCategories(5);
        this.completedCardIndices = new Set();
    }

    async submitAnswer(cardIndex, rawWord) {
        if (!this.isActive) return { isValid: false, reason: 'Game over' };

        const catId = this.categoryCards[cardIndex];
        if (this.completedCardIndices.has(cardIndex)) {
            return { isValid: false, reason: 'Category already completed!' };
        }

        const validation = await window.ValidationEngine.validateWord(rawWord, catId, this.activeLetter);
        if (validation.isValid) {
            this.streak++;
            if (this.streak > this.maxStreak) this.maxStreak = this.streak;
            this.wordsVerified++;

            // Time bonus: +3s
            this.timeRemaining += 3;

            const scoreData = window.ValidationEngine.calculateScore(validation, this.streak);
            this.score += scoreData.points;
            this.completedCardIndices.add(cardIndex);

            // Rare Star Bonus
            if (validation.rarity >= 75) {
                const bonusDust = Math.floor(validation.rarity / 5);
                this.starDustEarned += bonusDust;
                if (window.ProgressionEngine) window.ProgressionEngine.addStarDust(bonusDust);
            }

            // Audio & VFX
            if (this.streak >= 2 && window.AudioEngine) {
                window.AudioEngine.playCombo(this.streak);
            } else if (window.AudioEngine) {
                window.AudioEngine.playSuccess(validation.rarity >= 75);
            }

            // If all 5 cards in current letter set are cleared, trigger bonus and refresh set
            if (this.completedCardIndices.size >= 5) {
                this.timeRemaining += 8; // bonus +8s for full board clear
                this.score += 500;
                if (window.VFXEngine) window.VFXEngine.confettiCelebration();
                this.drawNewRound();
            }

            if (window.ProgressionEngine) {
                window.ProgressionEngine.recordWordSubmission(rawWord, catId, validation.rarity, true, this.streak);
            }

            return {
                isValid: true,
                points: scoreData.points,
                streak: this.streak,
                timeBonus: 3,
                scoreData: scoreData,
                allCleared: this.completedCardIndices.size === 0 // just renewed
            };
        } else {
            this.streak = 0;
            if (window.AudioEngine) window.AudioEngine.playError();
            return {
                isValid: false,
                reason: validation.reason
            };
        }
    }

    finish(onFinish) {
        this.isActive = false;
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = null;

        // Reward calculation
        const baseDust = Math.floor(this.score / 60);
        this.starDustEarned += baseDust;
        const xpEarned = Math.floor(this.score / 10);

        if (window.ProgressionEngine) {
            window.ProgressionEngine.addStarDust(baseDust);
            window.ProgressionEngine.addXP(xpEarned);
            if (this.score > window.ProgressionEngine.stats.highScoreGauntlet) {
                window.ProgressionEngine.stats.highScoreGauntlet = this.score;
                window.ProgressionEngine.save();
            }
        }

        if (window.AudioEngine) window.AudioEngine.playVictory();
        if (window.VFXEngine) window.VFXEngine.confettiCelebration();

        if (onFinish) {
            onFinish({
                score: this.score,
                wordsVerified: this.wordsVerified,
                maxStreak: this.maxStreak,
                starDustEarned: this.starDustEarned,
                xpEarned: xpEarned
            });
        }
    }

    stop() {
        this.isActive = false;
        if (this.timerInterval) clearInterval(this.timerInterval);
    }
}

class MultiplayerArenaMode {
    constructor(playerProfile = null) {
        this.round = 1;
        this.maxRounds = 3;
        this.roundTime = 45;
        this.roundTimer = null;
        this.timeRemaining = 45;
        this.isEmergencyBuzzerActive = false;
        this.emergencyCountdown = 15;
        this.emergencyTimer = null;
        this.buzzerClaimedBy = null;

        this.humanPlayer = {
            id: 'human',
            name: 'You',
            avatar: playerProfile?.avatar || '🦊',
            elo: playerProfile?.elo || 1000,
            score: 0,
            answers: {}, // [catId]: { word, result, points, challenged: false }
            isBuzzerReady: false
        };

        this.bots = [
            { id: 'bot_titan', name: 'Trivia Titan', avatar: '🤖', elo: 1350, speed: 0.85, accuracy: 0.95, score: 0, personality: 'Analytical', answers: {} },
            { id: 'bot_lexi', name: 'Lexi the Nerd', avatar: '🦉', elo: 1200, speed: 0.65, accuracy: 0.90, score: 0, personality: 'Scholarly', answers: {} },
            { id: 'bot_sam', name: 'Speedy Sam', avatar: '⚡', elo: 1050, speed: 0.98, accuracy: 0.70, score: 0, personality: 'Impatient', answers: {} },
            { id: 'bot_carl', name: 'Casual Carl', avatar: '😎', elo: 900, speed: 0.45, accuracy: 0.65, score: 0, personality: 'Chilled', answers: {} }
        ];

        this.currentLetter = 'S';
        this.categories = []; // 6 slots per round
        this.isPhaseActive = false;
        this.phase = 'lobby'; // 'lobby' | 'playing' | 'emergency' | 'peer_review' | 'round_summary' | 'match_end'
        this.disputes = [];
    }

    startRound(onUpdate, onPhaseChange) {
        this.isPhaseActive = true;
        this.phase = 'playing';
        this.timeRemaining = this.roundTime;
        this.isEmergencyBuzzerActive = false;
        this.buzzerClaimedBy = null;
        this.disputes = [];

        // Random common letter
        const letters = "ABCDEFGHIKLMNOPRSTUVW".split("");
        this.currentLetter = letters[Math.floor(Math.random() * letters.length)];
        this.categories = window.LexiconDB.getRandomCategories(6);

        // Reset player & bot answers for round
        this.humanPlayer.answers = {};
        this.bots.forEach(bot => { bot.answers = {}; });

        // Simulate Bot typing asynchronously
        this.startBotSimulations(onUpdate);

        if (this.roundTimer) clearInterval(this.roundTimer);
        this.roundTimer = setInterval(() => {
            if (!this.isPhaseActive || this.isEmergencyBuzzerActive) return;
            this.timeRemaining--;

            if (onUpdate) onUpdate();

            if (this.timeRemaining <= 0) {
                this.triggerPeerReviewPhase(onPhaseChange);
            }
        }, 1000);

        if (onPhaseChange) onPhaseChange(this.phase);
    }

    startBotSimulations(onUpdate) {
        this.bots.forEach(bot => {
            this.categories.forEach((catId, index) => {
                // Calculate bot delay based on speed
                const delay = 4000 + (index * 3500 * (1 - bot.speed * 0.4)) + (Math.random() * 3000);
                setTimeout(() => {
                    if (!this.isPhaseActive || this.phase === 'peer_review' || this.phase === 'round_summary') return;

                    const willSucceed = Math.random() < bot.accuracy;
                    const entries = window.LexiconDB.getEntriesForCategory(catId);
                    const validStarting = entries.filter(w => sanitizeInputWord(w).startsWith(this.currentLetter.toLowerCase()));

                    let chosenWord = '';
                    if (willSucceed && validStarting.length > 0) {
                        chosenWord = validStarting[Math.floor(Math.random() * validStarting.length)];
                    } else {
                        // Typos or random words
                        chosenWord = validStarting.length > 0 ? validStarting[0].slice(0, -1) + 'x' : this.currentLetter + "fake";
                    }

                    const val = willSucceed && validStarting.length > 0 ? {
                        isValid: true,
                        cleanWord: sanitizeInputWord(chosenWord),
                        matchedWord: chosenWord,
                        rarity: 65 + Math.floor(Math.random() * 25),
                        tierId: window.LexiconDB.getCategory(catId).tier,
                        scoreFactor: 1.0
                    } : { isValid: false };

                    bot.answers[catId] = {
                        word: chosenWord,
                        result: val,
                        points: val.isValid ? window.ValidationEngine.calculateScore(val, 1).points : 0
                    };

                    if (onUpdate) onUpdate();

                    // Check if bot finished all 6 categories and hits buzzer first
                    if (Object.keys(bot.answers).length >= 6 && !this.isEmergencyBuzzerActive && Math.random() < 0.6) {
                        this.slamBuzzer(bot.id, onUpdate, null);
                    }
                }, delay);
            });
        });
    }

    async submitHumanWord(catId, rawWord) {
        const validation = await window.ValidationEngine.validateWord(rawWord, catId, this.currentLetter);
        let scoreData = { points: 0 };
        if (validation.isValid) {
            scoreData = window.ValidationEngine.calculateScore(validation, 1);
            if (window.AudioEngine) window.AudioEngine.playSuccess();
        } else {
            if (window.AudioEngine) window.AudioEngine.playError();
        }

        this.humanPlayer.answers[catId] = {
            word: rawWord,
            result: validation,
            points: scoreData.points
        };

        return validation;
    }

    slamBuzzer(senderId, onUpdate, onPhaseChange) {
        if (this.isEmergencyBuzzerActive) return false;
        this.isEmergencyBuzzerActive = true;
        this.buzzerClaimedBy = senderId;
        this.emergencyCountdown = 15;
        this.phase = 'emergency';

        if (window.AudioEngine) window.AudioEngine.playBuzzer();
        if (window.VFXEngine) window.VFXEngine.triggerBuzzerShockwave();

        if (this.roundTimer) clearInterval(this.roundTimer);

        if (this.emergencyTimer) clearInterval(this.emergencyTimer);
        this.emergencyTimer = setInterval(() => {
            this.emergencyCountdown--;

            if (window.AudioEngine && this.emergencyCountdown <= 10) {
                window.AudioEngine.playTick(this.emergencyCountdown <= 5);
            }

            if (onUpdate) onUpdate();

            if (this.emergencyCountdown <= 0) {
                clearInterval(this.emergencyTimer);
                this.triggerPeerReviewPhase(onPhaseChange);
            }
        }, 1000);

        if (onPhaseChange) onPhaseChange('emergency');
        return true;
    }

    triggerPeerReviewPhase(onPhaseChange) {
        if (this.roundTimer) clearInterval(this.roundTimer);
        if (this.emergencyTimer) clearInterval(this.emergencyTimer);
        this.phase = 'peer_review';

        // Collect disputable words (invalid or questionable)
        this.disputes = [];
        const allParticipants = [this.humanPlayer, ...this.bots];

        allParticipants.forEach(player => {
            this.categories.forEach(catId => {
                const ans = player.answers[catId];
                if (ans && ans.word) {
                    if (!ans.result?.isValid || ans.result?.autoCorrected) {
                        this.disputes.push({
                            playerId: player.id,
                            playerName: player.name,
                            avatar: player.avatar,
                            catId: catId,
                            categoryName: window.LexiconDB.getCategory(catId).name,
                            word: ans.word,
                            isChallenged: false,
                            status: 'pending', // 'pending' | 'accepted' | 'rejected'
                            votes: { accept: 0, reject: 0 }
                        });
                    }
                }
            });
        });

        if (onPhaseChange) onPhaseChange('peer_review');
    }

    voteDispute(disputeIndex, isAccept) {
        if (!this.disputes[disputeIndex]) return;
        const disp = this.disputes[disputeIndex];
        
        // Human vote
        if (isAccept) disp.votes.accept++;
        else disp.votes.reject++;

        // Simulate Bot votes
        this.bots.forEach(bot => {
            const botAccepts = Math.random() > 0.45;
            if (botAccepts) disp.votes.accept++;
            else disp.votes.reject++;
        });

        disp.status = disp.votes.accept >= disp.votes.reject ? 'accepted' : 'rejected';
        
        // If accepted by vote, grant points
        if (disp.status === 'accepted') {
            const player = [this.humanPlayer, ...this.bots].find(p => p.id === disp.playerId);
            if (player && player.answers[disp.catId]) {
                player.answers[disp.catId].points = 120; // Community pass points
            }
        }
        return disp.status;
    }

    finishPeerReview(onPhaseChange) {
        // Tally up round scores
        const participants = [this.humanPlayer, ...this.bots];
        participants.forEach(p => {
            let roundPoints = 0;
            this.categories.forEach(catId => {
                roundPoints += p.answers[catId]?.points || 0;
            });
            // Buzzer bonus (+100 pts)
            if (this.buzzerClaimedBy === p.id) {
                roundPoints += 100;
            }
            p.score += roundPoints;
        });

        if (this.round < this.maxRounds) {
            this.phase = 'round_summary';
        } else {
            this.phase = 'match_end';
            this.finalizeMatch();
        }

        if (onPhaseChange) onPhaseChange(this.phase);
    }

    nextRound(onUpdate, onPhaseChange) {
        if (this.round < this.maxRounds) {
            this.round++;
            this.startRound(onUpdate, onPhaseChange);
        }
    }

    finalizeMatch() {
        const standings = [this.humanPlayer, ...this.bots].sort((a, b) => b.score - a.score);
        const humanRank = standings.findIndex(p => p.id === 'human') + 1;

        if (window.ProgressionEngine) {
            let eloDelta = 0;
            let dustEarned = Math.floor(this.humanPlayer.score / 15);

            if (humanRank === 1) {
                eloDelta = +32;
                dustEarned += 250;
                window.ProgressionEngine.incrementBadge('arena_champion', 1);
                window.ProgressionEngine.stats.arenaWins++;
            } else if (humanRank === 2) {
                eloDelta = +14;
                dustEarned += 100;
            } else if (humanRank === 3) {
                eloDelta = -5;
                dustEarned += 50;
            } else {
                eloDelta = -20;
                dustEarned += 20;
            }

            window.ProgressionEngine.updateElo(eloDelta);
            window.ProgressionEngine.addStarDust(dustEarned);
            window.ProgressionEngine.addXP(Math.floor(this.humanPlayer.score / 5));
        }

        if (humanRank === 1) {
            if (window.AudioEngine) window.AudioEngine.playVictory();
            if (window.VFXEngine) window.VFXEngine.confettiCelebration();
        }
    }

    getStandings() {
        return [this.humanPlayer, ...this.bots].sort((a, b) => b.score - a.score);
    }
}

// Global Game Modes Controller
window.GameModes = {
    DailyGridMode,
    SpeedGauntletMode,
    MultiplayerArenaMode
};
