/**
 * LINKED - Semantic Connection Validation & Quality Scoring Engine
 * Analyzes semantic pairs, rates connection strength (⭐⭐⭐, ⭐⭐, ⭐, ❌),
 * identifies connection types, and produces human-readable factual rationales.
 */

import { CONCEPT_GRAPH, CONCEPT_DICTIONARY, CONNECTION_TYPES } from "./data/puzzles.js";

// Helper: Normalize concept string for matching
export function normalizeConcept(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .trim()
        .replace(/^(the|a|an)\s+/i, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, " ");
}

// Find concept in dictionary or graph
export function findConceptMeta(conceptName) {
    const norm = normalizeConcept(conceptName);
    if (!norm) return null;

    // Check direct graph entry
    if (CONCEPT_GRAPH[norm]) {
        return { ...CONCEPT_GRAPH[norm], key: norm };
    }

    // Check graph synonyms
    for (const [k, data] of Object.entries(CONCEPT_GRAPH)) {
        if (data.synonyms && data.synonyms.some(s => normalizeConcept(s) === norm)) {
            return { ...data, key: k };
        }
    }

    // Check dictionary
    const dictMatch = CONCEPT_DICTIONARY.find(item => {
        const itemNorm = normalizeConcept(item.name);
        return itemNorm === norm || (item.synonyms && item.synonyms.some(s => normalizeConcept(s) === norm));
    });

    if (dictMatch) {
        return {
            name: dictMatch.name,
            type: dictMatch.type || "object",
            tags: dictMatch.tags || [],
            key: normalizeConcept(dictMatch.name),
            links: {}
        };
    }

    // Dynamic fallback for user custom words
    return {
        name: conceptName.trim(),
        type: inferTypeFromWord(conceptName),
        tags: [normalizeConcept(conceptName)],
        key: norm,
        links: {},
        isCustom: true
    };
}

// Infer category type for arbitrary terms
function inferTypeFromWord(word) {
    const w = word.toLowerCase();
    if (w.includes("city") || w.includes("state") || w.includes("country") || w.includes("ocean") || w.includes("island") || w.includes("mountain")) return "place";
    if (w.includes("war") || w.includes("revolution") || w.includes("mission") || w.includes("era") || w.includes("olympics") || w.includes("festival")) return "event";
    if (w.includes("sauce") || w.includes("cheese") || w.includes("bread") || w.includes("fruit") || w.includes("juice") || w.includes("pie") || w.includes("tea") || w.includes("coffee")) return "food";
    if (w.includes("film") || w.includes("movie") || w.includes("song") || w.includes("album") || w.includes("game") || w.includes("series") || w.includes("marvel")) return "popculture";
    if (w.includes("gravity") || w.includes("atom") || w.includes("space") || w.includes("cell") || w.includes("theory") || w.includes("energy") || w.includes("soil")) return "science";
    return "object";
}

/**
 * Validate a single connection between Node A and Node B
 * @param {string} from - Source concept
 * @param {string} to - Destination concept
 * @returns {object} Validation result
 */
export function validateConnection(from, to) {
    if (!from || !to) {
        return {
            valid: false,
            score: 0,
            stars: "",
            type: "object",
            reason: "Missing connection node.",
            qualityText: "Invalid"
        };
    }

    const normA = normalizeConcept(from);
    const normB = normalizeConcept(to);

    if (normA === normB) {
        return {
            valid: false,
            score: 0,
            stars: "",
            type: "word",
            reason: "Loops back to the exact same concept.",
            qualityText: "Duplicate Node"
        };
    }

    const metaA = findConceptMeta(from);
    const metaB = findConceptMeta(to);

    // 1. Direct Graph Link (A -> B or B -> A)
    if (metaA?.links?.[normB]) {
        const link = metaA.links[normB];
        return buildResult(true, link.score, link.type, link.reason);
    }
    if (metaB?.links?.[normA]) {
        const link = metaB.links[normA];
        return buildResult(true, link.score, link.type, link.reason);
    }

    // Check if either is a synonym or alias in the other's links
    if (metaA?.links) {
        for (const [targetKey, link] of Object.entries(metaA.links)) {
            if (targetKey === normB || normalizeConcept(targetKey) === normB) {
                return buildResult(true, link.score, link.type, link.reason);
            }
        }
    }
    if (metaB?.links) {
        for (const [targetKey, link] of Object.entries(metaB.links)) {
            if (targetKey === normA || normalizeConcept(targetKey) === normA) {
                return buildResult(true, link.score, link.type, link.reason);
            }
        }
    }

    // 2. Tag & Taxonomy Overlap Analysis
    const tagsA = metaA?.tags || [];
    const tagsB = metaB?.tags || [];
    const sharedTags = tagsA.filter(t => tagsB.includes(t));

    if (sharedTags.length >= 2) {
        const connectionType = metaB.type || metaA.type || "science";
        return buildResult(
            true,
            3,
            connectionType,
            `Strong domain relationship through shared context (${sharedTags.slice(0, 2).join(", ")}).`
        );
    } else if (sharedTags.length === 1) {
        const connectionType = metaB.type || metaA.type || "object";
        return buildResult(
            true,
            2,
            connectionType,
            `Clear semantic link via shared category (${sharedTags[0]}).`
        );
    }

    // 3. Substring / Compound Word / Morphological Association
    const wordsA = normA.split(" ");
    const wordsB = normB.split(" ");
    const sharedWord = wordsA.find(w => w.length > 2 && wordsB.includes(w));

    if (sharedWord) {
        return buildResult(
            true,
            2,
            "word",
            `Direct linguistic and conceptual overlap on the root term "${sharedWord}".`
        );
    }

    // 4. Lateral Heuristic Match (Both knowable entities, weak but defensible)
    if (normA.length >= 3 && normB.length >= 3) {
        // If categories align or broad associations apply
        if (metaA.type === metaB.type && metaA.type !== "object") {
            return buildResult(
                true,
                1,
                metaB.type,
                `Lateral connection in the same overarching domain of ${CONNECTION_TYPES[metaB.type.toUpperCase()]?.label || metaB.type}.`
            );
        }

        // Generic defensible lateral jump
        return buildResult(
            true,
            1,
            "word",
            `Lateral associative connection between "${from}" and "${to}".`
        );
    }

    // 5. Unverifiable / Invalid
    return {
        valid: false,
        score: 0,
        stars: "❌",
        type: "object",
        reason: `The connection between "${from}" and "${to}" is too distant or unrelated.`,
        qualityText: "Invalid Link"
    };
}

// Build standardized score result object
function buildResult(valid, score, type, reason) {
    const starMap = { 3: "⭐⭐⭐", 2: "⭐⭐", 1: "⭐", 0: "❌" };
    const qualityMap = { 3: "Extremely Strong", 2: "Good Connection", 1: "Weak but Defensible", 0: "Invalid" };
    
    return {
        valid,
        score,
        stars: starMap[score] || "⭐",
        type: type || "object",
        reason: reason || "Valid conceptual connection.",
        qualityText: qualityMap[score] || "Valid"
    };
}

/**
 * Validate a full chain of nodes from start to end
 * @param {Array<string>} chain - [Start, Node1, Node2, Node3, Node4, End]
 * @returns {object} Full chain evaluation
 */
export function validateFullChain(chain) {
    if (!Array.isArray(chain) || chain.length < 2) {
        return { valid: false, totalScore: 0, maxScore: 0, links: [], isComplete: false };
    }

    const links = [];
    let totalScore = 0;
    let allValid = true;

    for (let i = 0; i < chain.length - 1; i++) {
        const from = chain[i];
        const to = chain[i + 1];
        
        if (!to || to.trim() === "") {
            allValid = false;
            links.push({
                from,
                to: "???",
                valid: false,
                score: 0,
                stars: "⏳",
                type: "object",
                reason: "Pending next node input.",
                qualityText: "Empty"
            });
            continue;
        }

        const res = validateConnection(from, to);
        if (!res.valid) allValid = false;
        totalScore += res.score;
        links.push({ from, to, ...res });
    }

    const maxScore = (chain.length - 1) * 3;
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    let rankTitle = "Unlinked Beginner";
    if (percentage >= 90) rankTitle = "🔥 Lateral Thinker";
    else if (percentage >= 75) rankTitle = "🧠 Synapse Grandmaster";
    else if (percentage >= 60) rankTitle = "⚡ Pattern Weaver";
    else if (percentage >= 40) rankTitle = "🧩 Curious Connector";

    return {
        valid: allValid,
        totalScore,
        maxScore,
        percentage,
        rankTitle,
        links,
        isComplete: chain.every(n => n && n.trim() !== "")
    };
}

/**
 * Autocomplete search through the concept dictionary
 */
export function searchConcepts(query, limit = 6) {
    if (!query || query.trim().length === 0) return [];
    const norm = normalizeConcept(query);
    
    return CONCEPT_DICTIONARY.filter(item => {
        const nameNorm = normalizeConcept(item.name);
        return nameNorm.includes(norm) || (item.tags && item.tags.some(t => t.includes(norm)));
    }).slice(0, limit);
}
