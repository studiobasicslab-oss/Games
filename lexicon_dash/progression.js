/**
 * LEXICON DASH - Progression, Economy & Cosmetic Shop Engine
 * Star Dust soft currency, Player Level/XP, ELO rating, Mastery Badges, and Themes
 */

const THEMES_CONFIG = {
    'cyberpunk': {
        id: 'cyberpunk',
        name: 'Cyberpunk Neon',
        price: 0,
        unlocked: true,
        preview: 'linear-gradient(135deg, #090d16, #1e1b4b)',
        accent: '#06b6d4',
        accentGlow: 'rgba(6, 182, 212, 0.4)'
    },
    'tokyo_midnight': {
        id: 'tokyo_midnight',
        name: 'Tokyo Midnight',
        price: 400,
        unlocked: false,
        preview: 'linear-gradient(135deg, #180928, #3b0764)',
        accent: '#ec4899',
        accentGlow: 'rgba(236, 72, 153, 0.4)'
    },
    'retro_steampunk': {
        id: 'retro_steampunk',
        name: 'Retro Parchment',
        price: 750,
        unlocked: false,
        preview: 'linear-gradient(135deg, #1c1917, #292524)',
        accent: '#f59e0b',
        accentGlow: 'rgba(245, 158, 11, 0.4)'
    },
    'deep_space': {
        id: 'deep_space',
        name: 'Deep Space Orbit',
        price: 1200,
        unlocked: false,
        preview: 'linear-gradient(135deg, #030712, #0f172a)',
        accent: '#8b5cf6',
        accentGlow: 'rgba(139, 92, 246, 0.4)'
    },
    'golden_arcade': {
        id: 'golden_arcade',
        name: 'Golden Arcade Champion',
        price: 2000,
        unlocked: false,
        preview: 'linear-gradient(135deg, #1e1b18, #3e2723)',
        accent: '#eab308',
        accentGlow: 'rgba(234, 179, 8, 0.5)'
    }
};

const AVATARS_CONFIG = [
    { id: 'avatar_fox', name: 'Cyber Fox', emoji: '🦊', price: 0, unlocked: true },
    { id: 'avatar_owl', name: 'Scholar Owl', emoji: '🦉', price: 150, unlocked: false },
    { id: 'avatar_dragon', name: 'Astral Dragon', emoji: '🐲', price: 350, unlocked: false },
    { id: 'avatar_robot', name: 'Quantum Bot', emoji: '🤖', price: 600, unlocked: false },
    { id: 'avatar_alien', name: 'Nebula Nomad', emoji: '👽', price: 900, unlocked: false },
    { id: 'avatar_crown', name: 'Trivia Monarch', emoji: '👑', price: 1500, unlocked: false }
];

const BADGES_CONFIG = [
    { id: 'first_blood', name: 'Word Striker', desc: 'Submit your first verified word', icon: '⚡', target: 1 },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Reach a 3x Combo streak in Speed Gauntlet', icon: '🔥', target: 1 },
    { id: 'cosmologist', name: 'Cosmologist', desc: 'Submit 8 unique Space or Constellation items', icon: '🚀', target: 8 },
    { id: 'alchemist', name: 'Alchemist', desc: 'Submit 8 unique Chemical Elements', icon: '🧪', target: 8 },
    { id: 'dino_master', name: 'Dino Hunter', desc: 'Submit 8 Prehistoric Creatures', icon: '🦖', target: 8 },
    { id: 'grid_architect', name: 'Grid Architect', desc: 'Solve a Daily Grid puzzle completely', icon: '🧩', target: 1 },
    { id: 'arena_champion', name: 'Arena Titan', desc: 'Win 3 Arena Tournaments against bots', icon: '🏆', target: 3 },
    { id: 'rare_connoisseur', name: 'Gem of Lexicon', desc: 'Submit 5 Rare Tier (80%+ rarity) words', icon: '💎', target: 5 }
];

class ProgressionEngine {
    constructor() {
        this.load();
    }

    load() {
        const saved = localStorage.getItem('lexicon_dash_progression');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.starDust = data.starDust || 0;
                this.xp = data.xp || 0;
                this.level = data.level || 1;
                this.elo = data.elo || 1000;
                this.currentTheme = data.currentTheme || 'cyberpunk';
                this.currentAvatar = data.currentAvatar || 'avatar_fox';
                this.unlockedThemes = data.unlockedThemes || ['cyberpunk'];
                this.unlockedAvatars = data.unlockedAvatars || ['avatar_fox'];
                this.stats = data.stats || {
                    totalWords: 0,
                    correctWords: 0,
                    highScoreDaily: 0,
                    highScoreGauntlet: 0,
                    arenaWins: 0,
                    maxStreak: 0,
                    rarestWord: { word: 'None', rarity: 0 },
                    categoryCounts: {}
                };
                this.badgesProgress = data.badgesProgress || {};
                return;
            } catch (e) {
                console.error("Failed to parse progression data", e);
            }
        }

        // Default state
        this.starDust = 150; // Starter bonus
        this.xp = 0;
        this.level = 1;
        this.elo = 1000;
        this.currentTheme = 'cyberpunk';
        this.currentAvatar = 'avatar_fox';
        this.unlockedThemes = ['cyberpunk'];
        this.unlockedAvatars = ['avatar_fox'];
        this.stats = {
            totalWords: 0,
            correctWords: 0,
            highScoreDaily: 0,
            highScoreGauntlet: 0,
            arenaWins: 0,
            maxStreak: 0,
            rarestWord: { word: 'None', rarity: 0 },
            categoryCounts: {}
        };
        this.badgesProgress = {};
        this.save();
    }

    save() {
        const data = {
            starDust: this.starDust,
            xp: this.xp,
            level: this.level,
            elo: this.elo,
            currentTheme: this.currentTheme,
            currentAvatar: this.currentAvatar,
            unlockedThemes: this.unlockedThemes,
            unlockedAvatars: this.unlockedAvatars,
            stats: this.stats,
            badgesProgress: this.badgesProgress
        };
        localStorage.setItem('lexicon_dash_progression', JSON.stringify(data));
        this.applyTheme(this.currentTheme);
    }

    addStarDust(amount) {
        this.starDust += Math.max(0, amount);
        this.save();
        if (window.AudioEngine) window.AudioEngine.playStarDust();
        return this.starDust;
    }

    spendStarDust(amount) {
        if (this.starDust >= amount) {
            this.starDust -= amount;
            this.save();
            return true;
        }
        return false;
    }

    addXP(amount) {
        this.xp += amount;
        const requiredForNext = this.getXPForNextLevel();
        if (this.xp >= requiredForNext) {
            this.xp -= requiredForNext;
            this.level += 1;
            this.addStarDust(100 + this.level * 25); // Level up currency bonus
            if (window.VFXEngine) window.VFXEngine.confettiCelebration();
            if (window.AudioEngine) window.AudioEngine.playVictory();
            return true; // Leveled up
        }
        this.save();
        return false;
    }

    getXPForNextLevel() {
        return 200 + (this.level - 1) * 150;
    }

    updateElo(delta) {
        this.elo = Math.max(500, this.elo + delta);
        this.save();
    }

    recordWordSubmission(word, categoryId, rarity, isCorrect, streak) {
        this.stats.totalWords++;
        if (isCorrect) {
            this.stats.correctWords++;
            if (streak > this.stats.maxStreak) {
                this.stats.maxStreak = streak;
            }
            if (rarity > (this.stats.rarestWord?.rarity || 0)) {
                this.stats.rarestWord = { word, rarity };
            }
            this.stats.categoryCounts[categoryId] = (this.stats.categoryCounts[categoryId] || 0) + 1;

            // Badges checks
            this.incrementBadge('first_blood', 1);
            if (streak >= 3) this.incrementBadge('speed_demon', 1);
            if (rarity >= 80) this.incrementBadge('rare_connoisseur', 1);

            if (['chemical_element'].includes(categoryId)) this.incrementBadge('alchemist', 1);
            if (['constellation', 'space_mission_rocket'].includes(categoryId)) this.incrementBadge('cosmologist', 1);
            if (['dinosaur'].includes(categoryId)) this.incrementBadge('dino_master', 1);
        }
        this.save();
    }

    incrementBadge(badgeId, amount = 1) {
        const badge = BADGES_CONFIG.find(b => b.id === badgeId);
        if (!badge) return;
        const current = this.badgesProgress[badgeId] || 0;
        if (current < badge.target) {
            this.badgesProgress[badgeId] = Math.min(badge.target, current + amount);
            if (this.badgesProgress[badgeId] >= badge.target) {
                // Badge unlocked!
                this.addStarDust(150);
                if (window.VFXEngine) window.VFXEngine.confettiCelebration();
            }
        }
    }

    isBadgeUnlocked(badgeId) {
        const badge = BADGES_CONFIG.find(b => b.id === badgeId);
        if (!badge) return false;
        return (this.badgesProgress[badgeId] || 0) >= badge.target;
    }

    applyTheme(themeId) {
        const theme = THEMES_CONFIG[themeId];
        if (!theme) return;
        this.currentTheme = themeId;
        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.setAttribute('data-theme', themeId);
        }
    }

    unlockTheme(themeId) {
        const theme = THEMES_CONFIG[themeId];
        if (!theme || this.unlockedThemes.includes(themeId)) return false;
        if (this.spendStarDust(theme.price)) {
            this.unlockedThemes.push(themeId);
            this.applyTheme(themeId);
            this.save();
            return true;
        }
        return false;
    }

    unlockAvatar(avatarId) {
        const avatar = AVATARS_CONFIG.find(a => a.id === avatarId);
        if (!avatar || this.unlockedAvatars.includes(avatarId)) return false;
        if (this.spendStarDust(avatar.price)) {
            this.unlockedAvatars.push(avatarId);
            this.currentAvatar = avatarId;
            this.save();
            return true;
        }
        return false;
    }
}

// Global Progression singleton
window.ProgressionEngine = new ProgressionEngine();
