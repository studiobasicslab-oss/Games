/**
 * ChronoTrace Player Progression & Codex Manager
 * Manages player Level/XP, unlocked Codex entries, Achievements,
 * Campaign Stars, and local save state.
 */

class ProgressionManager {
    constructor() {
        this.storageKey = 'chronotrace_save_v1';
        this.state = this.loadState();
        this.achievementsList = this.initAchievementsList();
    }

    getDefaultState() {
        return {
            xp: 0,
            level: 1,
            title: 'Novice Time Weaver',
            totalTimelinesStabilized: 0,
            totalParadoxesTriggered: 0,
            dailyCompletions: {}, // dateStr -> { score, path, stars }
            campaignProgress: {
                chapter_1: { unlocked: true, stars: 0, bestScore: 0 }
            },
            unlockedCodex: ['cuneiform_writing', 'great_pyramid_giza'],
            relicsInventory: {
                lens: 2,     // Chronometer Lens
                shield: 1,   // Paradox Shield
                anchor: 1,   // Temporal Anchor
                glimpse: 1   // Oracle's Glimpse
            },
            fogHighDepth: 1,
            achievements: {} // id -> unlocked timestamp
        };
    }

    loadState() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                return Object.assign(this.getDefaultState(), parsed);
            }
        } catch (e) {
            console.warn('Could not load save state', e);
        }
        return this.getDefaultState();
    }

    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (e) {
            console.warn('Could not save state', e);
        }
    }

    initAchievementsList() {
        return [
            {
                id: 'first_timeline',
                title: 'First Quantum Step',
                desc: 'Stabilize your first historical timeline without collapsing the continuum.',
                icon: '⏳',
                xpReward: 150
            },
            {
                id: 'flawless_weaver',
                title: 'Flawless Synchronizer',
                desc: 'Complete any timeline route with 0 Paradoxes triggered.',
                icon: '✨',
                xpReward: 300
            },
            {
                id: 'science_synergy',
                title: 'Scientific Method',
                desc: 'Connect 4 or more Science & Technology events in a single continuous path.',
                icon: '🔬',
                xpReward: 250
            },
            {
                id: 'campaign_master',
                title: 'Chronomancer of Ages',
                desc: 'Earn 3 stars across 5 campaign chapters.',
                icon: '👑',
                xpReward: 600
            },
            {
                id: 'fog_explorer',
                title: 'Mist Walker',
                desc: 'Reach Depth 5 in Fog of Time mode.',
                icon: '🌫️',
                xpReward: 400
            },
            {
                id: 'codex_scholar',
                title: 'Grand Archivist',
                desc: 'Discover and unlock 30 historical events in your Codex.',
                icon: '📚',
                xpReward: 500
            }
        ];
    }

    addXP(amount) {
        this.state.xp += amount;
        const currentLevel = this.state.level;
        const requiredXP = currentLevel * 500;
        
        let leveledUp = false;
        if (this.state.xp >= requiredXP) {
            this.state.level++;
            this.state.xp -= requiredXP;
            this.updateTitle();
            leveledUp = true;
            
            // Give reward relics on level up
            this.state.relicsInventory.lens = (this.state.relicsInventory.lens || 0) + 1;
            this.state.relicsInventory.shield = (this.state.relicsInventory.shield || 0) + 1;
        }

        this.saveState();
        return { leveledUp, newLevel: this.state.level, title: this.state.title };
    }

    updateTitle() {
        const lvl = this.state.level;
        if (lvl >= 20) this.state.title = 'Chronomancer Prime';
        else if (lvl >= 15) this.state.title = 'Grand Temporal Architect';
        else if (lvl >= 10) this.state.title = 'Master Time Weaver';
        else if (lvl >= 7) this.state.title = 'Paradox Custodian';
        else if (lvl >= 4) this.state.title = 'Journeyman Chronologer';
        else if (lvl >= 2) this.state.title = 'Apprentice Weaver';
        else this.state.title = 'Novice Time Weaver';
    }

    unlockCodexEvent(eventId) {
        if (!this.state.unlockedCodex.includes(eventId)) {
            this.state.unlockedCodex.push(eventId);
            this.saveState();
            if (this.state.unlockedCodex.length >= 30) {
                this.unlockAchievement('codex_scholar');
            }
            return true;
        }
        return false;
    }

    unlockAchievement(achId) {
        if (!this.state.achievements[achId]) {
            this.state.achievements[achId] = Date.now();
            const ach = this.achievementsList.find(a => a.id === achId);
            if (ach) {
                this.addXP(ach.xpReward);
            }
            this.saveState();
            return ach;
        }
        return null;
    }

    recordCampaignVictory(chapterId, score, stars) {
        if (!this.state.campaignProgress[chapterId]) {
            this.state.campaignProgress[chapterId] = { unlocked: true, stars: 0, bestScore: 0 };
        }
        const record = this.state.campaignProgress[chapterId];
        record.stars = Math.max(record.stars, stars);
        record.bestScore = Math.max(record.bestScore, score);

        // Unlock next chapter
        const chapterNum = parseInt(chapterId.replace('chapter_', ''), 10);
        const nextChapterId = `chapter_${chapterNum + 1}`;
        if (!this.state.campaignProgress[nextChapterId]) {
            this.state.campaignProgress[nextChapterId] = { unlocked: true, stars: 0, bestScore: 0 };
        }

        this.state.totalTimelinesStabilized++;
        this.addXP(300 + stars * 100);

        // Check 3 star achievement
        let threeStarCount = 0;
        for (const k in this.state.campaignProgress) {
            if (this.state.campaignProgress[k].stars >= 3) threeStarCount++;
        }
        if (threeStarCount >= 5) {
            this.unlockAchievement('campaign_master');
        }

        this.saveState();
    }
}

// Global exposure
if (typeof window !== 'undefined') {
    window.progressionManager = new ProgressionManager();
}
