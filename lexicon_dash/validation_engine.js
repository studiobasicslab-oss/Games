/**
 * LEXICON DASH - 3-Layer Strict Verification & Scoring Engine
 * Layer 1: Exact Hash/Set Match in Category (100% Score)
 * Layer 2: Levenshtein Fuzzy Match in Category (Dist <= 1, 90% Score)
 * Layer 3: Live Datamuse / Wikidata Semantic Category Check (100% Score)
 */

class ValidationEngine {
    constructor() {
        this.cache = new Map(); // [catId:cleanWord] -> result
    }

    /**
     * Compute Levenshtein distance between two normalized strings
     */
    levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    /**
     * Check if word starts with required target letter
     */
    startsWithTargetLetter(word, targetLetter) {
        if (!word || !targetLetter) return false;
        const clean = sanitizeInputWord(word);
        return clean.startsWith(targetLetter.toLowerCase());
    }

    /**
     * Main validation pipeline
     */
    async validateWord(rawWord, catId, targetLetter = null) {
        const clean = sanitizeInputWord(rawWord);
        if (!clean || clean.length < 2) {
            return {
                isValid: false,
                reason: 'Too short (min 2 letters)',
                layer: 0,
                scoreFactor: 0
            };
        }

        // Validate starting letter constraint
        if (targetLetter && !this.startsWithTargetLetter(clean, targetLetter)) {
            return {
                isValid: false,
                reason: `Must start with letter "${targetLetter.toUpperCase()}"`,
                layer: 0,
                scoreFactor: 0
            };
        }

        const cacheKey = `${catId}:${clean}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const category = window.LexiconDB.getCategory(catId);
        if (!category) {
            return { isValid: false, reason: 'Unknown category', layer: 0, scoreFactor: 0 };
        }

        // ==========================================
        // LAYER 1: Exact Hash / Set Lookup in Category
        // ==========================================
        if (window.LexiconDB.hasExact(catId, clean)) {
            const rarity = window.LexiconDB.getRarity(catId, clean);
            const result = {
                isValid: true,
                cleanWord: clean,
                matchedWord: rawWord.trim(),
                autoCorrected: false,
                layer: 1,
                layerName: 'Exact Match',
                scoreFactor: 1.0,
                rarity: rarity,
                tierId: category.tier,
                message: 'Verified exact match!'
            };
            this.cache.set(cacheKey, result);
            return result;
        }

        // ==========================================
        // LAYER 2: Levenshtein Fuzzy Match in Category
        // Allowed if word length >= 4 and dist <= 1
        // ==========================================
        const entries = category.entries || [];
        for (const entry of entries) {
            const cleanEntry = sanitizeInputWord(entry);
            // Must have same first letter
            if (cleanEntry[0] !== clean[0]) continue;

            const dist = this.levenshteinDistance(clean, cleanEntry);
            if (dist === 1 && clean.length >= 4) {
                const rarity = window.LexiconDB.getRarity(catId, cleanEntry);
                const result = {
                    isValid: true,
                    cleanWord: cleanEntry,
                    matchedWord: entry,
                    autoCorrected: true,
                    layer: 2,
                    layerName: 'Fuzzy Match (Typo Tolerance)',
                    scoreFactor: 0.9,
                    rarity: rarity,
                    tierId: category.tier,
                    message: `Auto-corrected to "${entry}" (90% score)`
                };
                this.cache.set(cacheKey, result);
                return result;
            }
        }

        // ==========================================
        // LAYER 3: Strict Semantic Fallback Check
        // Must match category keywords in definition
        // ==========================================
        const liveFallbackResult = await this.queryLiveFallback(rawWord, catId, clean, category);
        if (liveFallbackResult && liveFallbackResult.isValid) {
            // Auto-append to local registry
            window.LexiconDB.registerDynamicWord(catId, rawWord);
            const result = {
                isValid: true,
                cleanWord: clean,
                matchedWord: rawWord.trim(),
                autoCorrected: false,
                layer: 3,
                layerName: 'Live Trivia Enrichment',
                scoreFactor: 1.0,
                rarity: 92,
                tierId: category.tier,
                message: 'Enriched via live verification!'
            };
            this.cache.set(cacheKey, result);
            return result;
        }

        // Invalid word
        const failedResult = {
            isValid: false,
            cleanWord: clean,
            reason: `"${rawWord}" was not recognized in ${category.name}`,
            layer: 0,
            scoreFactor: 0
        };
        return failedResult;
    }

    /**
     * Layer 3: Query live Datamuse API and enforce category semantic keyword matching
     */
    async queryLiveFallback(rawWord, catId, cleanWord, category) {
        if (!category || !category.keywords || category.keywords.length === 0) {
            return { isValid: false };
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1500);

            // Query Datamuse word details with definitions and parts of speech
            const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(cleanWord)}&md=dp&max=1`;
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const match = data[0];
                    if (match.word && sanitizeInputWord(match.word) === cleanWord) {
                        const tags = match.tags || [];
                        const isNoun = tags.includes('n') || tags.includes('prop');
                        
                        // Most trivia categories are nouns (creatures, minerals, countries, professions, etc.)
                        const defs = match.defs || [];
                        const defsText = defs.join(' ').toLowerCase();

                        // Check if any category keyword matches as a distinct whole word
                        const keywords = category.keywords || [];
                        const hasCategoryMatch = keywords.some(kw => {
                            const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
                            return regex.test(defsText);
                        });

                        if (hasCategoryMatch) {
                            return { isValid: true };
                        }
                    }
                }
            }
        } catch (e) {
            // Graceful fallback if offline or timeout
        }
        return { isValid: false };
    }

    /**
     * Calculate score according to the formula:
     * Final Score = (Base Points * M_tier) * (1 + R_rarity / 100) * M_streak * LayerScoreFactor
     */
    calculateScore(validationResult, streakCount = 1) {
        if (!validationResult || !validationResult.isValid) {
            return {
                points: 0,
                basePoints: 0,
                tierMultiplier: 1.0,
                rarityBonus: 0,
                streakMultiplier: 1.0,
                rarityTier: 'invalid'
            };
        }

        const tiersMap = window.CATEGORY_TIERS || (typeof CATEGORY_TIERS !== 'undefined' ? CATEGORY_TIERS : null) || {};
        const tierInfo = tiersMap[validationResult.tierId?.toUpperCase()] || tiersMap.TIER_1 || { baseScore: 100, multiplier: 1.0 };
        const basePoints = tierInfo.baseScore;
        const tierMultiplier = tierInfo.multiplier;
        const rarity = validationResult.rarity || 50;
        
        // Streak multiplier: 1.0x -> 1.3x -> 1.8x -> max 2.5x
        let streakMultiplier = 1.0;
        if (streakCount >= 5) streakMultiplier = 2.5;
        else if (streakCount >= 3) streakMultiplier = 1.8;
        else if (streakCount >= 2) streakMultiplier = 1.3;

        const rarityRatio = 1 + (rarity / 100);
        const rawPoints = (basePoints * tierMultiplier) * rarityRatio * streakMultiplier * (validationResult.scoreFactor || 1.0);
        const finalPoints = Math.round(rawPoints);

        // Determine Rarity Tier for Emoji Output
        let rarityTier = 'common'; // 🟨
        if (rarity >= 70) rarityTier = 'rare'; // 🟩
        else if (rarity < 40) rarityTier = 'frequent'; // 🟦

        return {
            points: finalPoints,
            basePoints: basePoints,
            tierMultiplier: tierMultiplier,
            rarity: rarity,
            rarityBonus: Math.round((rarity / 100) * basePoints),
            streakMultiplier: streakMultiplier,
            rarityTier: rarityTier
        };
    }
}

// Global singleton instance
window.ValidationEngine = new ValidationEngine();
