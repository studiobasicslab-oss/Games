/**
 * ============================================================================
 * ONLY ONE RULE - Advanced Cognitive Rule Engine & Game Controller
 * Features 5 Difficulty Tiers, Exception Handling, Reversal Dynamics & Fairness Validation
 * ============================================================================
 */

// Canvas roundRect Polyfill for universal cross-browser compatibility
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
}

// ----------------------------------------------------------------------------
// 1. CONFIGURATION & CONSTANTS
// ----------------------------------------------------------------------------
const CONFIG = {
    LIVES_START: 3,
    BASE_SCORE: 100,
    SPEED_BONUS_MAX: 100,
    INITIAL_RULE_DURATION: 5.0, // seconds
    MIN_RULE_DURATION: 2.2,     // seconds
    TRANSITION_DURATION: 0.38,  // 380ms transition
    MAX_SIMULTANEOUS_OBJECTS: 8,
    COLORS: {
        red: { name: 'RED', hex: '#ff3366', light: '#ff668f', rgb: '255, 51, 102' },
        blue: { name: 'BLUE', hex: '#00d4ff', light: '#5ce1e6', rgb: '0, 212, 255' },
        green: { name: 'GREEN', hex: '#00ff88', light: '#66ffb3', rgb: '0, 255, 136' },
        yellow: { name: 'YELLOW', hex: '#ffea00', light: '#fff159', rgb: '255, 234, 0' },
        purple: { name: 'PURPLE', hex: '#c040fb', light: '#d982fd', rgb: '192, 64, 251' }
    },
    SHAPES: ['circle', 'square', 'triangle', 'diamond'],
    LANES: ['left', 'middle', 'right'],
    STORAGE_KEYS: {
        BEST_SCORE: 'oor_best_score',
        BEST_COMBO: 'oor_best_combo',
        BEST_RULES: 'oor_best_rules',
        MUTED: 'oor_sound_muted'
    }
};

// ----------------------------------------------------------------------------
// 2. PROCEDURAL SOUND SYNTHESIZER (Web Audio API - Pentatonic Scale)
// ----------------------------------------------------------------------------
class SoundFX {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem(CONFIG.STORAGE_KEYS.MUTED) === 'true';
        this.pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem(CONFIG.STORAGE_KEYS.MUTED, this.isMuted);
        return this.isMuted;
    }

    playCorrect(combo = 1) {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            const pitchIndex = (combo - 1) % this.pentatonic.length;
            const octaveMultiplier = Math.floor((combo - 1) / this.pentatonic.length);
            const freq = this.pentatonic[pitchIndex] * Math.pow(1.5, Math.min(1.2, octaveMultiplier * 0.4));

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.12);

            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.16);
        } catch (e) {
            console.warn('Audio play error', e);
        }
    }

    playMistake() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(65, now + 0.22);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.24);
        } catch (e) {
            console.warn('Audio play error', e);
        }
    }

    playRuleChange(isReversal = false) {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            if (isReversal) {
                // Dramatic reversal chime (descending sweep then energetic up-pip)
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
                osc.frequency.exponentialRampToValueAtTime(900, now + 0.22);
            } else {
                // Crisp standard switch sweep
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
            }

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.22);
        } catch (e) {
            console.warn('Audio play error', e);
        }
    }

    playGameOver() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.55);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.65);
        } catch (e) {
            console.warn('Audio play error', e);
        }
    }
}

// ----------------------------------------------------------------------------
// 3. STRUCTURED RULE GENERATION & EVALUATION SYSTEM
// ----------------------------------------------------------------------------
class RuleEngine {
    constructor() {
        this.colorKeys = Object.keys(CONFIG.COLORS);
        this.shapes = CONFIG.SHAPES;
        this.lanes = CONFIG.LANES;
        this.lastRule = null;
        this.reversalCooldown = 0;
    }

    /**
     * Determine active difficulty tier from player score, completed rules, and game state
     */
    getDifficultyLevel(score, rulesCleared) {
        if (rulesCleared < 6 && score < 500) {
            return 1; // Difficulty 1: Single attribute
        } else if (rulesCleared < 12 && score < 1200) {
            return 2; // Difficulty 2: Two attributes (+ occasional reversals)
        } else if (rulesCleared < 20 && score < 2200) {
            return 3; // Difficulty 3: Spatial rules
        } else if (rulesCleared < 30 && score < 3500) {
            return 4; // Difficulty 4: Exceptions
        } else {
            return 5; // Difficulty 5: Master blend of all tiers + active reversals
        }
    }

    /**
     * Generates a validated, unambiguous, cognitively engaging rule
     */
    generateNextRule(score, rulesCleared) {
        const currentTier = this.getDifficultyLevel(score, rulesCleared);
        let rule = null;
        let attempts = 0;

        while (attempts < 20) {
            attempts++;

            // Check for Difficulty 5 (Rule Reversal) opportunity
            if (currentTier >= 2 && this.reversalCooldown <= 0 && this.lastRule && Math.random() < 0.28) {
                rule = this._generateReversalRule(this.lastRule);
                if (rule && this.validateRule(rule)) {
                    this.reversalCooldown = 3; // wait at least 3 rules before next reversal
                    this.lastRule = rule;
                    return rule;
                }
            }

            // Pick a tier up to current maximum unlocked tier
            let targetTier = currentTier;
            if (currentTier > 1) {
                const weights = this._getTierWeights(currentTier);
                targetTier = this._pickWeightedTier(weights);
            }

            rule = this._buildRuleForTier(targetTier);

            // Validate rule logic & ensure it is not identical to last rule
            if (rule && this.validateRule(rule)) {
                if (!this.lastRule || !this._areRulesIdentical(rule, this.lastRule)) {
                    if (this.reversalCooldown > 0) this.reversalCooldown--;
                    this.lastRule = rule;
                    return rule;
                }
            }
        }

        // Safe fallback
        rule = this._buildDifficulty1Rule();
        this.lastRule = rule;
        return rule;
    }

    _getTierWeights(maxTier) {
        if (maxTier === 2) return { 1: 0.45, 2: 0.55 };
        if (maxTier === 3) return { 1: 0.20, 2: 0.40, 3: 0.40 };
        if (maxTier === 4) return { 1: 0.15, 2: 0.30, 3: 0.25, 4: 0.30 };
        return { 1: 0.10, 2: 0.25, 3: 0.25, 4: 0.25, 5: 0.15 };
    }

    _pickWeightedTier(weights) {
        const rand = Math.random();
        let cumulative = 0;
        for (const [tierStr, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (rand <= cumulative) {
                return parseInt(tierStr);
            }
        }
        return 1;
    }

    _buildRuleForTier(tier) {
        switch (tier) {
            case 1: return this._buildDifficulty1Rule();
            case 2: return this._buildDifficulty2Rule();
            case 3: return this._buildDifficulty3Rule();
            case 4: return this._buildDifficulty4Rule();
            case 5:
                if (this.lastRule) {
                    const rev = this._generateReversalRule(this.lastRule);
                    if (rev) return rev;
                }
                return this._buildDifficulty4Rule();
            default:
                return this._buildDifficulty1Rule();
        }
    }

    // ------------------------------------------------------------------------
    // DIFFICULTY 1 — Single attribute
    // Examples: COLLECT RED, AVOID BLUE, COLLECT CIRCLES, AVOID TRIANGLES
    // ------------------------------------------------------------------------
    _buildDifficulty1Rule() {
        const action = Math.random() < 0.65 ? 'collect' : 'avoid';
        const isColor = Math.random() < 0.5;

        if (isColor) {
            const c = this._randomColor();
            const actionText = action === 'collect' ? 'COLLECT' : 'AVOID';
            const badgeType = action === 'collect' ? 'collect' : 'avoid';
            return {
                tier: 1,
                action: action,
                colour: c,
                shape: 'any',
                lane: 'any',
                exception: { type: 'none', colour: 'none', shape: 'none', lane: 'none' },
                badge: actionText,
                badgeType: badgeType,
                text: `${actionText} ${CONFIG.COLORS[c].name}`,
                html: `${actionText} <span class="kw-chip kw-color-${c}">● ${CONFIG.COLORS[c].name}</span>`
            };
        } else {
            const s = this._randomShape();
            const actionText = action === 'collect' ? 'COLLECT' : 'AVOID';
            const badgeType = action === 'collect' ? 'collect' : 'avoid';
            return {
                tier: 1,
                action: action,
                colour: 'any',
                shape: s,
                lane: 'any',
                exception: { type: 'none', colour: 'none', shape: 'none', lane: 'none' },
                badge: actionText,
                badgeType: badgeType,
                text: `${actionText} ${this._pluralShape(s)}`,
                html: `${actionText} <span class="kw-chip kw-shape-badge">${this._shapeIcon(s)} ${this._pluralShape(s)}</span>`
            };
        }
    }

    // ------------------------------------------------------------------------
    // DIFFICULTY 2 — Two attributes
    // Examples: COLLECT RED CIRCLES, AVOID BLUE SQUARES, COLLECT GREEN TRIANGLES
    // ------------------------------------------------------------------------
    _buildDifficulty2Rule() {
        const action = Math.random() < 0.6 ? 'collect' : 'avoid';
        const c = this._randomColor();
        const s = this._randomShape();
        const actionText = action === 'collect' ? 'COLLECT' : 'AVOID';
        const badgeType = action === 'collect' ? 'collect' : 'avoid';

        return {
            tier: 2,
            action: action,
            colour: c,
            shape: s,
            lane: 'any',
            exception: { type: 'none', colour: 'none', shape: 'none', lane: 'none' },
            badge: actionText,
            badgeType: badgeType,
            text: `${actionText} ${CONFIG.COLORS[c].name} ${this._pluralShape(s)}`,
            html: `${actionText} <span class="kw-chip kw-color-${c}">● ${CONFIG.COLORS[c].name}</span> <span class="kw-chip kw-shape-badge">${this._shapeIcon(s)} ${this._pluralShape(s)}</span>`
        };
    }

    // ------------------------------------------------------------------------
    // DIFFICULTY 3 — Spatial rules
    // Examples: ONLY THE LEFT LANE MATTERS, COLLECT RED ON THE LEFT, AVOID BLUE ON THE RIGHT
    // ------------------------------------------------------------------------
    _buildDifficulty3Rule() {
        const rand = Math.random();
        const lane = this._randomLane();
        const laneLabel = lane === 'left' ? '← LEFT' : lane === 'right' ? 'RIGHT →' : '● MIDDLE';

        if (rand < 0.4) {
            // Pure lane filter
            return {
                tier: 3,
                action: 'collect',
                colour: 'any',
                shape: 'any',
                lane: lane,
                exception: { type: 'none', colour: 'none', shape: 'none', lane: 'none' },
                badge: 'LANE ONLY',
                badgeType: 'lane',
                text: `ONLY ${lane.toUpperCase()} LANE`,
                html: `ONLY <span class="kw-chip kw-lane-badge">${laneLabel} LANE</span>`
            };
        } else if (rand < 0.7) {
            // Color on lane
            const action = Math.random() < 0.65 ? 'collect' : 'avoid';
            const c = this._randomColor();
            const actionText = action === 'collect' ? 'COLLECT' : 'AVOID';
            const badgeType = action === 'collect' ? 'collect' : 'avoid';
            return {
                tier: 3,
                action: action,
                colour: c,
                shape: 'any',
                lane: lane,
                exception: { type: 'none', colour: 'none', shape: 'none', lane: 'none' },
                badge: actionText,
                badgeType: badgeType,
                text: `${actionText} ${CONFIG.COLORS[c].name} ON ${lane.toUpperCase()}`,
                html: `${actionText} <span class="kw-chip kw-color-${c}">● ${CONFIG.COLORS[c].name}</span> ON <span class="kw-chip kw-lane-badge">${laneLabel}</span>`
            };
        } else {
            // Shape on lane
            const action = Math.random() < 0.65 ? 'collect' : 'avoid';
            const s = this._randomShape();
            const actionText = action === 'collect' ? 'COLLECT' : 'AVOID';
            const badgeType = action === 'collect' ? 'collect' : 'avoid';
            return {
                tier: 3,
                action: action,
                colour: 'any',
                shape: s,
                lane: lane,
                exception: { type: 'none', colour: 'none', shape: 'none', lane: 'none' },
                badge: actionText,
                badgeType: badgeType,
                text: `${actionText} ${this._pluralShape(s)} ON ${lane.toUpperCase()}`,
                html: `${actionText} <span class="kw-chip kw-shape-badge">${this._shapeIcon(s)} ${this._pluralShape(s)}</span> ON <span class="kw-chip kw-lane-badge">${laneLabel}</span>`
            };
        }
    }

    // ------------------------------------------------------------------------
    // DIFFICULTY 4 — Exceptions
    // Examples: COLLECT RED, BUT NOT CIRCLES | AVOID BLUE, EXCEPT TRIANGLES | COLLECT CIRCLES, IGNORE GREEN
    // ------------------------------------------------------------------------
    _buildDifficulty4Rule() {
        const rand = Math.random();

        if (rand < 0.5) {
            // Color primary with Shape exception
            const action = Math.random() < 0.6 ? 'collect' : 'avoid';
            const c = this._randomColor();
            const s = this._randomShape();

            if (action === 'collect') {
                const phrase = Math.random() < 0.5 ? 'BUT NOT' : 'IGNORE';
                return {
                    tier: 4,
                    action: 'collect',
                    colour: c,
                    shape: 'any',
                    lane: 'any',
                    exception: { type: 'shape', colour: 'none', shape: s, lane: 'none' },
                    badge: 'EXCEPTION',
                    badgeType: 'exception',
                    text: `COLLECT ${CONFIG.COLORS[c].name}, ${phrase} ${this._pluralShape(s)}`,
                    html: `COLLECT <span class="kw-chip kw-color-${c}">● ${CONFIG.COLORS[c].name}</span>, ${phrase} <span class="kw-chip kw-shape-badge">${this._shapeIcon(s)} ${this._pluralShape(s)}</span>`
                };
            } else {
                return {
                    tier: 4,
                    action: 'avoid',
                    colour: c,
                    shape: 'any',
                    lane: 'any',
                    exception: { type: 'shape', colour: 'none', shape: s, lane: 'none' },
                    badge: 'EXCEPTION',
                    badgeType: 'exception',
                    text: `AVOID ${CONFIG.COLORS[c].name}, EXCEPT ${this._pluralShape(s)}`,
                    html: `AVOID <span class="kw-chip kw-color-${c}">● ${CONFIG.COLORS[c].name}</span>, EXCEPT <span class="kw-chip kw-shape-badge">${this._shapeIcon(s)} ${this._pluralShape(s)}</span>`
                };
            }
        } else {
            // Shape primary with Color exception
            const action = Math.random() < 0.6 ? 'collect' : 'avoid';
            const s = this._randomShape();
            const c = this._randomColor();

            if (action === 'collect') {
                const phrase = Math.random() < 0.5 ? 'EXCEPT' : 'IGNORE';
                return {
                    tier: 4,
                    action: 'collect',
                    colour: 'any',
                    shape: s,
                    lane: 'any',
                    exception: { type: 'color', colour: c, shape: 'none', lane: 'none' },
                    badge: 'EXCEPTION',
                    badgeType: 'exception',
                    text: `COLLECT ${this._pluralShape(s)}, ${phrase} ${CONFIG.COLORS[c].name}`,
                    html: `COLLECT <span class="kw-chip kw-shape-badge">${this._shapeIcon(s)} ${this._pluralShape(s)}</span>, ${phrase} <span class="kw-chip kw-color-${c}">● ${CONFIG.COLORS[c].name}</span>`
                };
            } else {
                return {
                    tier: 4,
                    action: 'avoid',
                    colour: 'any',
                    shape: s,
                    lane: 'any',
                    exception: { type: 'color', colour: c, shape: 'none', lane: 'none' },
                    badge: 'EXCEPTION',
                    badgeType: 'exception',
                    text: `AVOID ${this._pluralShape(s)}, EXCEPT ${CONFIG.COLORS[c].name}`,
                    html: `AVOID <span class="kw-chip kw-shape-badge">${this._shapeIcon(s)} ${this._pluralShape(s)}</span>, EXCEPT <span class="kw-chip kw-color-${c}">● ${CONFIG.COLORS[c].name}</span>`
                };
            }
        }
    }

    // ------------------------------------------------------------------------
    // DIFFICULTY 5 — Rule Reversal
    // Intentionally conflicts with player's previous behavior
    // ------------------------------------------------------------------------
    _generateReversalRule(prevRule) {
        if (!prevRule) return null;

        // Invert action: Collect -> Avoid, Avoid -> Collect
        const newAction = prevRule.action === 'collect' ? 'avoid' : 'collect';
        const actionPrefix = newAction === 'collect' ? 'NOW COLLECT' : 'NOW AVOID';

        if (prevRule.colour !== 'any' && prevRule.shape === 'any' && prevRule.lane === 'any') {
            // Color Reversal: COLLECT RED -> AVOID RED
            const c = prevRule.colour;
            return {
                tier: 5,
                action: newAction,
                colour: c,
                shape: 'any',
                lane: 'any',
                exception: { type: 'none', colour: 'none', shape: 'none', lane: 'none' },
                badge: 'REVERSAL ↺',
                badgeType: 'reversal',
                text: `${actionPrefix} ${CONFIG.COLORS[c].name}`,
                html: `${actionPrefix} <span class="kw-chip kw-color-${c}">● ${CONFIG.COLORS[c].name}</span>`
            };
        } else if (prevRule.shape !== 'any' && prevRule.colour === 'any' && prevRule.lane === 'any') {
            // Shape Reversal: COLLECT CIRCLES -> AVOID CIRCLES
            const s = prevRule.shape;
            return {
                tier: 5,
                action: newAction,
                colour: 'any',
                shape: s,
                lane: 'any',
                exception: { type: 'none', colour: 'none', shape: 'none', lane: 'none' },
                badge: 'REVERSAL ↺',
                badgeType: 'reversal',
                text: `${actionPrefix} ${this._pluralShape(s)}`,
                html: `${actionPrefix} <span class="kw-chip kw-shape-badge">${this._shapeIcon(s)} ${this._pluralShape(s)}</span>`
            };
        } else if (prevRule.colour !== 'any' && prevRule.shape !== 'any') {
            // Two-attribute reversal: COLLECT RED CIRCLES -> AVOID RED CIRCLES
            const c = prevRule.colour;
            const s = prevRule.shape;
            return {
                tier: 5,
                action: newAction,
                colour: c,
                shape: s,
                lane: 'any',
                exception: { type: 'none', colour: 'none', shape: 'none', lane: 'none' },
                badge: 'REVERSAL ↺',
                badgeType: 'reversal',
                text: `${actionPrefix} ${CONFIG.COLORS[c].name} ${this._pluralShape(s)}`,
                html: `${actionPrefix} <span class="kw-chip kw-color-${c}">● ${CONFIG.COLORS[c].name}</span> <span class="kw-chip kw-shape-badge">${this._shapeIcon(s)} ${this._pluralShape(s)}</span>`
            };
        }

        return null;
    }

    // ------------------------------------------------------------------------
    // VALIDATION & EVALUATION LOGIC
    // ------------------------------------------------------------------------
    /**
     * Validates that a rule is logically sound and has valid object combinations
     */
    validateRule(rule) {
        if (!rule || !rule.action) return false;
        if (rule.action !== 'collect' && rule.action !== 'avoid') return false;

        // Ensure at least one dimension is specified (not all 'any')
        const hasDimension = rule.colour !== 'any' || rule.shape !== 'any' || rule.lane !== 'any';
        if (!hasDimension) return false;

        // Count how many possible combinations are valid out of 60 possible objects (5 colors * 4 shapes * 3 lanes)
        let validCombinations = 0;
        let totalCombinations = 0;

        for (const c of this.colorKeys) {
            for (const s of this.shapes) {
                for (const l of this.lanes) {
                    totalCombinations++;
                    const mockObj = { colour: c, shape: s, lane: l };
                    const evalResult = this.evaluateClick(mockObj, rule);
                    if (evalResult.isValid) {
                        validCombinations++;
                    }
                }
            }
        }

        // Rule must have at least 1 valid target combination and cannot make 100% of objects invalid
        return validCombinations > 0 && validCombinations < totalCombinations;
    }

    _areRulesIdentical(r1, r2) {
        return (
            r1.action === r2.action &&
            r1.colour === r2.colour &&
            r1.shape === r2.shape &&
            r1.lane === r2.lane &&
            r1.exception.type === r2.exception.type &&
            r1.exception.colour === r2.exception.colour &&
            r1.exception.shape === r2.exception.shape
        );
    }

    /**
     * Evaluates a click on an object under the active rule with exception support
     * @returns {Object} { isValid: boolean, isAvoidViolation: boolean }
     */
    evaluateClick(obj, rule) {
        const matchesPrimary = (
            (rule.colour === 'any' || obj.colour === rule.colour) &&
            (rule.shape === 'any' || obj.shape === rule.shape) &&
            (rule.lane === 'any' || obj.lane === rule.lane)
        );

        let matchesException = false;
        if (rule.exception && rule.exception.type !== 'none') {
            if (rule.exception.type === 'shape' && obj.shape === rule.exception.shape) {
                matchesException = true;
            } else if (rule.exception.type === 'color' && obj.colour === rule.exception.colour) {
                matchesException = true;
            } else if (rule.exception.type === 'lane' && obj.lane === rule.exception.lane) {
                matchesException = true;
            }
        }

        if (rule.action === 'collect') {
            // Target is an object that matches primary condition AND does NOT match exception
            const isTarget = matchesPrimary && !matchesException;
            return {
                isValid: isTarget,
                isAvoidViolation: false
            };
        } else if (rule.action === 'avoid') {
            // Forbidden object is an object that matches primary condition AND does NOT match exception
            // (If exception matches, the object is spared from avoidance and safe to collect!)
            const isForbidden = matchesPrimary && !matchesException;
            return {
                isValid: !isForbidden,
                isAvoidViolation: isForbidden
            };
        }

        return { isValid: false, isAvoidViolation: false };
    }

    _randomColor() {
        return this.colorKeys[Math.floor(Math.random() * this.colorKeys.length)];
    }

    _randomShape() {
        return this.shapes[Math.floor(Math.random() * this.shapes.length)];
    }

    _randomLane() {
        return this.lanes[Math.floor(Math.random() * this.lanes.length)];
    }

    _pluralShape(shape) {
        if (shape === 'circle') return 'CIRCLES';
        if (shape === 'square') return 'SQUARES';
        if (shape === 'triangle') return 'TRIANGLES';
        if (shape === 'diamond') return 'DIAMONDS';
        return shape.toUpperCase();
    }

    _shapeIcon(shape) {
        if (shape === 'circle') return '●';
        if (shape === 'square') return '■';
        if (shape === 'triangle') return '▲';
        if (shape === 'diamond') return '◆';
        return '✦';
    }
}

// ----------------------------------------------------------------------------
// 4. GAME OBJECTS, SHOCKWAVES & PARTICLES
// ----------------------------------------------------------------------------
class GameObject {
    constructor(props) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.x = props.x;
        this.y = props.y;
        this.radius = props.radius || 32;
        this.colour = props.colour;
        this.shape = props.shape;
        this.lane = props.lane;
        this.vx = props.vx || 0;
        this.vy = props.vy || 60;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 1.2;
        this.spawnTime = performance.now();
        this.age = 0;
        this.scale = 0.1;
        this.targetScale = 1.0;
        this.opacity = 1.0;
        this.isDead = false;
        this.isPopping = false;
        this.popProgress = 0;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update(dt, canvasHeight) {
        this.age += dt;
        this.pulsePhase += dt * 3.0;

        if (this.scale < this.targetScale && !this.isPopping) {
            this.scale = Math.min(this.targetScale, this.scale + dt * 6.0);
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.rotation += this.vRot * dt;

        if (this.isPopping) {
            this.popProgress += dt * 5.0;
            this.scale = 1.0 + Math.sin(this.popProgress * Math.PI) * 0.4;
            this.opacity = Math.max(0, 1.0 - this.popProgress);
            if (this.popProgress >= 1.0) {
                this.isDead = true;
            }
        }

        if (this.y - this.radius > canvasHeight + 60 || this.y + this.radius < -100) {
            this.isDead = true;
        }
    }

    containsPoint(px, py) {
        const hitRadius = this.radius * 1.35;
        const dx = px - this.x;
        const dy = py - this.y;
        return (dx * dx + dy * dy) <= (hitRadius * hitRadius);
    }

    draw(ctx) {
        if (this.isDead || this.opacity <= 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const breath = (this.isPopping) ? 1.0 : (1.0 + Math.sin(this.pulsePhase) * 0.04);
        const finalScale = this.scale * breath;
        ctx.scale(finalScale, finalScale);
        ctx.globalAlpha = this.opacity;

        const colorData = CONFIG.COLORS[this.colour] || CONFIG.COLORS.blue;
        const mainColor = colorData.hex;
        const lightColor = colorData.light;

        ctx.shadowColor = mainColor;
        ctx.shadowBlur = 18;

        ctx.fillStyle = mainColor;
        ctx.strokeStyle = lightColor;
        ctx.lineWidth = 3;

        const r = this.radius;

        switch (this.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fill();
                break;

            case 'square':
                const size = r * 1.7;
                const half = size / 2;
                ctx.beginPath();
                ctx.roundRect(-half, -half, size, size, 8);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.roundRect(-half * 0.4, -half * 0.4, size * 0.4, size * 0.4, 4);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fill();
                break;

            case 'triangle':
                ctx.beginPath();
                const h = r * 1.8;
                ctx.moveTo(0, -h * 0.6);
                ctx.lineTo(r * 1.0, h * 0.5);
                ctx.lineTo(-r * 1.0, h * 0.5);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -r * 1.25);
                ctx.lineTo(r * 0.9, 0);
                ctx.lineTo(0, r * 1.25);
                ctx.lineTo(-r * 0.9, 0);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
        }

        ctx.restore();
    }
}

class Shockwave {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 10;
        this.maxRadius = 75;
        this.life = 1.0;
        this.decay = 3.5;
    }

    update(dt) {
        this.radius += (this.maxRadius - this.radius) * 12.0 * dt;
        this.life -= this.decay * dt;
    }

    draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life * 0.8);
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.lineWidth = Math.max(1, 3.5 * this.life);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 260 + 90;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 5 + 3;
        this.life = 1.0;
        this.decay = Math.random() * 2.8 + 1.8;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vx *= 0.94;
        this.vy *= 0.94;
        this.life -= this.decay * dt;
    }

    draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ----------------------------------------------------------------------------
// 5. MAIN GAME CONTROLLER
// ----------------------------------------------------------------------------
class OnlyOneRuleGame {
    constructor() {
        this.sound = new SoundFX();
        this.ruleEngine = new RuleEngine();

        // Canvas & DOM References
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.floatingTextContainer = document.getElementById('floating-text-container');
        this.ambientGlow = document.getElementById('ambient-glow');

        // HUD Elements
        this.hud = document.getElementById('hud');
        this.scoreVal = document.getElementById('score-val');
        this.comboVal = document.getElementById('combo-val');
        this.comboPill = document.getElementById('combo-pill');
        this.livesContainer = document.getElementById('lives-container');
        this.hearts = this.livesContainer.querySelectorAll('.heart');
        this.laneGuides = document.getElementById('lane-guides');

        // Rule UI Elements
        this.ruleContainer = document.getElementById('rule-container');
        this.ruleCard = document.getElementById('rule-card');
        this.ruleTag = document.getElementById('rule-tag');
        this.ruleText = document.getElementById('rule-text');
        this.ruleActionBadge = document.getElementById('rule-action-badge');
        this.ruleVisualHints = document.getElementById('rule-visual-hints');
        this.ruleTimerBar = document.getElementById('rule-timer-bar');

        // Screens & Overlays
        this.startScreen = document.getElementById('start-screen');
        this.gameoverScreen = document.getElementById('gameover-screen');
        this.pauseScreen = document.getElementById('pause-screen');

        // Game State
        this.isPlaying = false;
        this.isPaused = false;
        this.isTransitioning = false;
        this.transitionTimer = 0;

        this.score = 0;
        this.combo = 1;
        this.maxCombo = 1;
        this.lives = CONFIG.LIVES_START;
        this.rulesSurvived = 0;
        this.totalClicks = 0;
        this.correctClicks = 0;

        this.currentRule = null;
        this.ruleDuration = CONFIG.INITIAL_RULE_DURATION;
        this.ruleTimeRemaining = CONFIG.INITIAL_RULE_DURATION;

        this.objects = [];
        this.particles = [];
        this.shockwaves = [];
        this.spawnTimer = 0;

        this.lastFrameTime = performance.now();
        this.laneBoundaries = { left: { min: 0, max: 0 }, middle: { min: 0, max: 0 }, right: { min: 0, max: 0 } };

        this.initEventListeners();
        this.resizeCanvas();
        this.updateStartScreenStats();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());

        document.getElementById('start-btn').addEventListener('click', () => {
            this.sound.init();
            this.startGame();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.sound.init();
            this.startGame();
        });

        document.getElementById('sound-btn').addEventListener('click', () => {
            const isMuted = this.sound.toggleMute();
            this.updateSoundIcon(isMuted);
        });

        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('resume-btn').addEventListener('click', () => this.togglePause(false));
        document.getElementById('quit-btn').addEventListener('click', () => this.quitToMenu());

        document.getElementById('share-btn').addEventListener('click', () => this.shareScore());

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                if (!this.isPlaying) {
                    if (this.startScreen.classList.contains('active') || this.gameoverScreen.classList.contains('active')) {
                        e.preventDefault();
                        this.sound.init();
                        this.startGame();
                    }
                }
            } else if (e.code === 'KeyP' || e.code === 'Escape') {
                if (this.isPlaying) {
                    this.togglePause();
                }
            } else if (e.code === 'KeyM') {
                const isMuted = this.sound.toggleMute();
                this.updateSoundIcon(isMuted);
            }
        });

        const handlePointer = (e) => {
            if (!this.isPlaying || this.isPaused) return;

            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            this.handlePlayerClick(x, y);
        };

        this.canvas.addEventListener('mousedown', handlePointer);
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handlePointer(e);
        }, { passive: false });

        this.updateSoundIcon(this.sound.isMuted);
    }

    updateSoundIcon(isMuted) {
        const onIcon = document.getElementById('sound-on-icon');
        const offIcon = document.getElementById('sound-off-icon');
        if (isMuted) {
            onIcon.classList.add('hidden');
            offIcon.classList.remove('hidden');
        } else {
            onIcon.classList.remove('hidden');
            offIcon.classList.add('hidden');
        }
    }

    resizeCanvas() {
        const stage = document.getElementById('game-stage');
        const dpr = window.devicePixelRatio || 1;
        const rect = stage.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) return;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.resetTransform();
        this.ctx.scale(dpr, dpr);

        this.stageWidth = rect.width;
        this.stageHeight = rect.height;

        const third = this.stageWidth / 3;
        this.laneBoundaries = {
            left: { min: 0, max: third },
            middle: { min: third, max: third * 2 },
            right: { min: third * 2, max: this.stageWidth }
        };
    }

    updateStartScreenStats() {
        const bestScore = localStorage.getItem(CONFIG.STORAGE_KEYS.BEST_SCORE) || 0;
        const bestCombo = localStorage.getItem(CONFIG.STORAGE_KEYS.BEST_COMBO) || 0;
        const bestRules = localStorage.getItem(CONFIG.STORAGE_KEYS.BEST_RULES) || 0;

        document.getElementById('start-best-score').textContent = parseInt(bestScore).toLocaleString();
        document.getElementById('start-best-combo').textContent = `×${bestCombo}`;
        document.getElementById('start-best-rules').textContent = bestRules;
    }

    startGame() {
        this.isPlaying = true;
        this.isPaused = false;
        this.isTransitioning = false;

        this.score = 0;
        this.combo = 1;
        this.maxCombo = 1;
        this.lives = CONFIG.LIVES_START;
        this.rulesSurvived = 0;
        this.totalClicks = 0;
        this.correctClicks = 0;

        this.objects = [];
        this.particles = [];
        this.shockwaves = [];
        this.spawnTimer = 0;

        this.ruleDuration = CONFIG.INITIAL_RULE_DURATION;
        this.ruleTimeRemaining = this.ruleDuration;

        this.resizeCanvas();

        this.scoreVal.textContent = '0';
        this.updateComboDisplay();
        this.updateLivesDisplay();

        this.hud.classList.remove('hidden');
        this.laneGuides.classList.remove('hidden');
        document.getElementById('pause-btn').classList.remove('hidden');

        this.startScreen.classList.remove('active');
        this.startScreen.classList.add('hidden');
        this.gameoverScreen.classList.remove('active');
        this.gameoverScreen.classList.add('hidden');
        this.pauseScreen.classList.remove('active');
        this.pauseScreen.classList.add('hidden');

        this.applyNewRule(true);
    }

    applyNewRule(isInitial = false) {
        if (!isInitial) {
            this.rulesSurvived++;
        }

        // Pacing & timing progression curve:
        // Score 0: 5.0s | Score 500: 4.3s | Score 1200: 3.7s | Score 2200: 3.2s | Score 3500+: 2.6s -> 2.2s
        let targetDuration = CONFIG.INITIAL_RULE_DURATION - (this.score / 1200) * 0.45 - (this.rulesSurvived * 0.04);
        this.ruleDuration = Math.max(CONFIG.MIN_RULE_DURATION, targetDuration);
        this.ruleTimeRemaining = this.ruleDuration;

        this.currentRule = this.ruleEngine.generateNextRule(this.score, this.rulesSurvived);

        const isReversal = this.currentRule.badgeType === 'reversal';
        if (!isInitial) {
            this.sound.playRuleChange(isReversal);
        }

        // Update UI
        this.ruleText.innerHTML = this.currentRule.html;
        this.ruleActionBadge.textContent = this.currentRule.badge;
        this.ruleActionBadge.className = `rule-badge ${this.currentRule.badgeType}`;

        this.ruleCard.className = `rule-card mode-${this.currentRule.badgeType} flash-new`;

        // Update lane highlight
        const cols = this.laneGuides.querySelectorAll('.lane-col');
        cols.forEach(col => {
            if (this.currentRule.lane !== 'any' && col.dataset.lane === this.currentRule.lane) {
                col.classList.add('highlight');
            } else {
                col.classList.remove('highlight');
            }
        });

        // Ambient glow tint
        if (this.currentRule.colour !== 'any' && CONFIG.COLORS[this.currentRule.colour]) {
            const rgb = CONFIG.COLORS[this.currentRule.colour].rgb;
            this.ambientGlow.style.background = `radial-gradient(ellipse at center, rgba(${rgb}, 0.20) 0%, rgba(0,0,0,0) 70%)`;
        } else {
            this.ambientGlow.style.background = `radial-gradient(ellipse at center, rgba(0, 212, 255, 0.12) 0%, rgba(0,0,0,0) 70%)`;
        }

        this.isTransitioning = true;
        this.transitionTimer = CONFIG.TRANSITION_DURATION;

        this.ruleTag.textContent = isReversal ? 'REVERSAL!' : 'NEW RULE';
        this.ruleTag.classList.add('visible');
        setTimeout(() => {
            this.ruleTag.classList.remove('visible');
        }, 500);
    }

    handlePlayerClick(clickX, clickY) {
        this.totalClicks++;

        let clickedObjIndex = -1;
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];
            if (!obj.isDead && !obj.isPopping && obj.containsPoint(clickX, clickY)) {
                clickedObjIndex = i;
                break;
            }
        }

        if (clickedObjIndex !== -1) {
            const obj = this.objects[clickedObjIndex];
            const evaluation = this.ruleEngine.evaluateClick(obj, this.currentRule);

            if (evaluation.isValid) {
                this.correctClicks++;
                this.handleCorrectAction(obj);
            } else {
                this.handleMistakeAction(obj, evaluation.isAvoidViolation);
            }
        }
    }

    handleCorrectAction(obj) {
        obj.isPopping = true;

        const timeAlive = (performance.now() - obj.spawnTime) / 1000;
        const speedRatio = Math.max(0, 1 - (timeAlive / 1.8));
        const speedBonus = Math.round(CONFIG.SPEED_BONUS_MAX * speedRatio);

        const pointsEarned = (CONFIG.BASE_SCORE + speedBonus) * this.combo;
        this.score += pointsEarned;
        this.combo++;
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }

        this.sound.playCorrect(this.combo);

        const colorHex = CONFIG.COLORS[obj.colour]?.hex || '#ffffff';

        this.shockwaves.push(new Shockwave(obj.x, obj.y, colorHex));
        this.createParticleBurst(obj.x, obj.y, colorHex, 14);

        let labelText = `+${pointsEarned.toLocaleString()}`;
        if (speedBonus > 40) labelText += ` ⚡`;
        this.showFloatingText(obj.x, obj.y, labelText, colorHex);

        this.scoreVal.textContent = this.score.toLocaleString();
        this.updateComboDisplay(true);
    }

    handleMistakeAction(obj, isAvoidViolation) {
        obj.isPopping = true;

        this.lives--;
        this.combo = 1;

        this.sound.playMistake();
        this.triggerScreenShake();

        this.shockwaves.push(new Shockwave(obj.x, obj.y, '#ff3366'));
        this.createParticleBurst(obj.x, obj.y, '#ff3366', 22);

        const reasonText = isAvoidViolation ? 'AVOID VIOLATION! -♥' : 'WRONG TARGET! -♥';
        this.showFloatingText(obj.x, obj.y, reasonText, '#ff3366');

        this.updateComboDisplay();
        this.updateLivesDisplay();

        if (this.lives <= 0) {
            this.triggerGameOver();
        }
    }

    triggerScreenShake() {
        const stage = document.getElementById('game-wrapper');
        stage.classList.remove('screen-shake');
        void stage.offsetWidth;
        stage.classList.add('screen-shake');

        const flash = document.createElement('div');
        flash.className = 'damage-flash';
        stage.appendChild(flash);
        setTimeout(() => flash.remove(), 250);
    }

    createParticleBurst(x, y, color, count = 14) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    showFloatingText(x, y, text, color = '#fff') {
        const span = document.createElement('span');
        span.className = 'floating-label';
        span.textContent = text;
        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
        span.style.color = color;
        span.style.textShadow = `0 0 12px ${color}`;

        this.floatingTextContainer.appendChild(span);
        setTimeout(() => {
            if (span.parentNode) span.parentNode.removeChild(span);
        }, 650);
    }

    updateComboDisplay(bump = false) {
        this.comboVal.textContent = `× ${this.combo}`;
        if (this.combo >= 5) {
            this.comboPill.classList.add('super');
        } else {
            this.comboPill.classList.remove('super');
        }

        if (bump) {
            this.comboPill.classList.remove('bump');
            void this.comboPill.offsetWidth;
            this.comboPill.classList.add('bump');
        }
    }

    updateLivesDisplay() {
        this.hearts.forEach((heart, idx) => {
            if (idx < this.lives) {
                heart.className = 'heart full';
            } else {
                if (!heart.classList.contains('lost')) {
                    heart.className = 'heart lost shatter';
                }
            }
        });
    }

    togglePause(forceState) {
        if (!this.isPlaying) return;
        this.isPaused = forceState !== undefined ? forceState : !this.isPaused;

        if (this.isPaused) {
            this.pauseScreen.classList.add('active');
            this.pauseScreen.classList.remove('hidden');
        } else {
            this.pauseScreen.classList.remove('active');
            this.pauseScreen.classList.add('hidden');
            this.lastFrameTime = performance.now();
        }
    }

    quitToMenu() {
        this.isPlaying = false;
        this.isPaused = false;
        this.pauseScreen.classList.remove('active');
        this.pauseScreen.classList.add('hidden');
        this.gameoverScreen.classList.remove('active');
        this.gameoverScreen.classList.add('hidden');
        this.hud.classList.add('hidden');
        this.laneGuides.classList.add('hidden');
        document.getElementById('pause-btn').classList.add('hidden');
        this.startScreen.classList.remove('hidden');
        this.startScreen.classList.add('active');
        this.updateStartScreenStats();
    }

    triggerGameOver() {
        this.isPlaying = false;
        this.sound.playGameOver();

        const currentBest = parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.BEST_SCORE) || '0');
        const currentBestCombo = parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.BEST_COMBO) || '0');
        const currentBestRules = parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.BEST_RULES) || '0');

        let isNewRecord = false;
        if (this.score > currentBest) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.BEST_SCORE, this.score);
            isNewRecord = true;
        }
        if (this.maxCombo > currentBestCombo) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.BEST_COMBO, this.maxCombo);
        }
        if (this.rulesSurvived > currentBestRules) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.BEST_RULES, this.rulesSurvived);
        }

        document.getElementById('gameover-score').textContent = this.score.toLocaleString();
        document.getElementById('gameover-best-score').textContent = Math.max(this.score, currentBest).toLocaleString();
        document.getElementById('gameover-best-combo').textContent = `×${Math.max(this.maxCombo, currentBestCombo)}`;
        document.getElementById('gameover-rules-survived').textContent = this.rulesSurvived;

        const accuracy = this.totalClicks > 0 ? Math.round((this.correctClicks / this.totalClicks) * 100) : 0;
        document.getElementById('gameover-accuracy').textContent = `${accuracy}%`;

        const newRecordPill = document.getElementById('new-record-pill');
        if (isNewRecord && this.score > 0) {
            newRecordPill.classList.remove('hidden');
        } else {
            newRecordPill.classList.add('hidden');
        }

        setTimeout(() => {
            this.hud.classList.add('hidden');
            this.laneGuides.classList.add('hidden');
            document.getElementById('pause-btn').classList.add('hidden');
            this.gameoverScreen.classList.add('active');
            this.gameoverScreen.classList.remove('hidden');
        }, 280);
    }

    shareScore() {
        const text = `I survived ${this.rulesSurvived} rules and scored ${this.score.toLocaleString()} points in ONLY ONE RULE! 🕹️🔥 Can you beat me?`;
        if (navigator.share) {
            navigator.share({
                title: 'ONLY ONE RULE Arcade Score',
                text: text,
                url: window.location.href
            }).catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                const btn = document.getElementById('share-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = `<span>Copied to Clipboard!</span>`;
                setTimeout(() => { btn.innerHTML = originalText; }, 2000);
            });
        }
    }

    // ------------------------------------------------------------------------
    // FAIRNESS-GUARANTEED OBJECT SPAWNER
    // ------------------------------------------------------------------------
    updateSpawner(dt) {
        this.spawnTimer += dt;
        const spawnInterval = Math.max(0.42, 0.85 - (this.rulesSurvived * 0.012));

        if (this.spawnTimer >= spawnInterval && this.objects.length < CONFIG.MAX_SIMULTANEOUS_OBJECTS) {
            this.spawnTimer = 0;
            this.spawnFairObject();
        }
    }

    spawnFairObject() {
        const colorKeys = Object.keys(CONFIG.COLORS);
        const shapes = CONFIG.SHAPES;
        const lanes = CONFIG.LANES;

        let chosenColour;
        let chosenShape;
        let chosenLane;

        // Guaranteed fairness: Ensure at least 55% of spawns are valid target clicks
        const isTargetSpawn = Math.random() < 0.55;

        if (this.currentRule) {
            if (isTargetSpawn) {
                // Generate a valid object that satisfies rule evaluation
                let validFound = false;
                let tries = 0;
                while (!validFound && tries < 20) {
                    tries++;
                    const testC = colorKeys[Math.floor(Math.random() * colorKeys.length)];
                    const testS = shapes[Math.floor(Math.random() * shapes.length)];
                    const testL = lanes[Math.floor(Math.random() * lanes.length)];
                    const evalRes = this.ruleEngine.evaluateClick({ colour: testC, shape: testS, lane: testL }, this.currentRule);
                    if (evalRes.isValid) {
                        chosenColour = testC;
                        chosenShape = testS;
                        chosenLane = testL;
                        validFound = true;
                    }
                }
            } else {
                // Generate distractor object (including exception objects or forbidden objects)
                let distractorFound = false;
                let tries = 0;
                while (!distractorFound && tries < 20) {
                    tries++;
                    const testC = colorKeys[Math.floor(Math.random() * colorKeys.length)];
                    const testS = shapes[Math.floor(Math.random() * shapes.length)];
                    const testL = lanes[Math.floor(Math.random() * lanes.length)];
                    const evalRes = this.ruleEngine.evaluateClick({ colour: testC, shape: testS, lane: testL }, this.currentRule);
                    if (!evalRes.isValid) {
                        chosenColour = testC;
                        chosenShape = testS;
                        chosenLane = testL;
                        distractorFound = true;
                    }
                }
            }
        }

        // Fallbacks if random generation didn't hit
        if (!chosenColour) chosenColour = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        if (!chosenShape) chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
        if (!chosenLane) chosenLane = lanes[Math.floor(Math.random() * lanes.length)];

        const laneBounds = this.laneBoundaries[chosenLane] || { min: 0, max: this.stageWidth };
        const padding = 45;
        const posX = Math.random() * (laneBounds.max - laneBounds.min - padding * 2) + laneBounds.min + padding;
        const posY = -45;

        const baseSpeed = 75 + Math.min(95, this.rulesSurvived * 3.5);
        const vy = Math.random() * 35 + baseSpeed;
        const vx = (Math.random() - 0.5) * 18;
        const radius = Math.random() * 8 + 26;

        this.objects.push(new GameObject({
            x: posX,
            y: posY,
            vx: vx,
            vy: vy,
            radius: radius,
            colour: chosenColour,
            shape: chosenShape,
            lane: chosenLane
        }));
    }

    // ------------------------------------------------------------------------
    // MAIN GAME TICK & RENDER
    // ------------------------------------------------------------------------
    gameLoop(currentTime) {
        const dt = Math.min(0.1, (currentTime - this.lastFrameTime) / 1000);
        this.lastFrameTime = currentTime;

        if (this.isPlaying && !this.isPaused) {
            this.ruleTimeRemaining -= dt;

            const timerRatio = Math.max(0, this.ruleTimeRemaining / this.ruleDuration);
            this.ruleTimerBar.style.transform = `scaleX(${timerRatio})`;

            if (this.ruleTimeRemaining <= 1.2) {
                this.ruleTimerBar.classList.add('urgent');
            } else {
                this.ruleTimerBar.classList.remove('urgent');
            }

            if (this.isTransitioning) {
                this.transitionTimer -= dt;
                if (this.transitionTimer <= 0) {
                    this.isTransitioning = false;
                }
            }

            if (this.ruleTimeRemaining <= 0) {
                this.applyNewRule(false);
            }

            this.updateSpawner(dt);

            const speedMult = this.isTransitioning ? 0.65 : 1.0;

            for (let i = this.objects.length - 1; i >= 0; i--) {
                const obj = this.objects[i];
                obj.update(dt * speedMult, this.stageHeight);
                if (obj.isDead) {
                    this.objects.splice(i, 1);
                }
            }

            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.update(dt);
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }

            for (let i = this.shockwaves.length - 1; i >= 0; i--) {
                const s = this.shockwaves[i];
                s.update(dt);
                if (s.life <= 0) {
                    this.shockwaves.splice(i, 1);
                }
            }
        }

        this.renderCanvas();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    renderCanvas() {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        for (const s of this.shockwaves) {
            s.draw(this.ctx);
        }

        for (const p of this.particles) {
            p.draw(this.ctx);
        }

        for (const obj of this.objects) {
            obj.draw(this.ctx);
        }
    }
}

// ----------------------------------------------------------------------------
// INITIALIZE ON DOM READY
// ----------------------------------------------------------------------------
function initOnlyOneRule() {
    if (!window.gameInstance) {
        window.gameInstance = new OnlyOneRuleGame();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOnlyOneRule);
} else {
    initOnlyOneRule();
}
