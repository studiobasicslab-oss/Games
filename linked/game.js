/**
 * LINKED: Four Degrees of Connection — Main Engine
 * Orchestrates gameplay loops, UI rendering, Web Audio FX, canvas synapse particles,
 * hint progression, speedrun timer, and score persistence.
 */

import { CURATED_PUZZLES, CONNECTION_TYPES, DIFFICULTY_LEVELS, GAME_MODES, CONCEPT_DICTIONARY } from "./data/puzzles.js";
import { validateConnection, validateFullChain, searchConcepts, findConceptMeta } from "./validator.js";

// ==========================================
// GAME STATE
// ==========================================
const state = {
    mode: "knowledge",
    puzzleIndex: 0,
    currentPuzzle: null,
    // [Start, Slot1, Slot2, Slot3, Slot4, End]
    chain: ["", "", "", "", "", ""],
    linkResults: [null, null, null, null, null],
    hintsRevealed: { 0: false, 1: false, 2: false },
    activeSlotIndex: 0,
    timerSeconds: 60,
    timerMax: 60,
    timerRunning: false,
    timerInterval: null,
    soundEnabled: true,
    stats: {
        played: 0,
        solved: 0,
        bestScore: 0,
        streak: 0,
        lastDailyDate: null
    }
};

// ==========================================
// AUDIO SYNTHESIZER (Web Audio API)
// ==========================================
class SoundSynth {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    playTone(freq, type = "sine", duration = 0.15, gainVal = 0.1) {
        if (!state.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn("Audio error:", e);
        }
    }

    sfxValid(stars = 3) {
        const base = stars === 3 ? 587.33 : (stars === 2 ? 523.25 : 440);
        this.playTone(base, "sine", 0.12, 0.15);
        setTimeout(() => this.playTone(base * 1.25, "triangle", 0.2, 0.12), 80);
    }

    sfxInvalid() {
        this.playTone(220, "sawtooth", 0.2, 0.1);
        setTimeout(() => this.playTone(185, "sawtooth", 0.25, 0.1), 100);
    }

    sfxHint() {
        this.playTone(659.25, "sine", 0.1, 0.08);
        setTimeout(() => this.playTone(880, "sine", 0.15, 0.1), 80);
        setTimeout(() => this.playTone(1046.5, "sine", 0.2, 0.08), 160);
    }

    sfxWin() {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, "triangle", 0.35, 0.18), i * 120);
        });
    }

    sfxTick() {
        this.playTone(800, "sine", 0.03, 0.04);
    }
}

const audio = new SoundSynth();

// ==========================================
// SYNAPSE PARTICLES CANVAS BACKGROUND
// ==========================================
function initSynapseCanvas() {
    const canvas = document.getElementById("synapse-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = Math.min(Math.floor(window.innerWidth / 30), 45);

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? "rgba(6, 182, 212, " : "rgba(168, 85, 247, "
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + "0.6)";
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const alpha = (1 - dist / 130) * 0.25;
                    ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(render);
    }
    render();
}

// ==========================================
// PUZZLE LOADING & MODE MANAGEMENT
// ==========================================
function loadStats() {
    try {
        const saved = localStorage.getItem("linked_game_stats");
        if (saved) {
            state.stats = { ...state.stats, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn("Could not load stats", e);
    }
    updateHudStats();
}

function saveStats() {
    try {
        localStorage.setItem("linked_game_stats", JSON.stringify(state.stats));
    } catch (e) {}
    updateHudStats();
}

function updateHudStats() {
    const elBest = document.getElementById("hud-best-score");
    if (elBest) elBest.textContent = state.stats.bestScore;
    const elStreak = document.getElementById("hud-streak");
    if (elStreak) elStreak.textContent = state.stats.streak;
}

// Determine Daily Puzzle based on today's UTC date string
function getDailyPuzzle() {
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = (hash << 5) - hash + today.charCodeAt(i);
        hash |= 0;
    }
    const idx = Math.abs(hash) % CURATED_PUZZLES.length;
    const puz = { ...CURATED_PUZZLES[idx] };
    puz.id = `daily-${today}`;
    puz.title = `Daily Four (${today})`;
    return puz;
}

export function switchMode(modeId) {
    state.mode = modeId;

    // Update active tab buttons
    document.querySelectorAll(".mode-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.mode === modeId);
    });

    let puzzleList = CURATED_PUZZLES;
    if (modeId === "daily") {
        state.currentPuzzle = getDailyPuzzle();
    } else if (modeId === "knowledge") {
        puzzleList = CURATED_PUZZLES.filter(p => p.mode === "knowledge" || p.difficulty === "easy");
        state.currentPuzzle = puzzleList[state.puzzleIndex % puzzleList.length];
    } else if (modeId === "popculture") {
        puzzleList = CURATED_PUZZLES.filter(p => p.mode === "popculture");
        state.currentPuzzle = puzzleList[state.puzzleIndex % puzzleList.length];
    } else if (modeId === "everyday") {
        puzzleList = CURATED_PUZZLES.filter(p => p.mode === "everyday");
        state.currentPuzzle = puzzleList[state.puzzleIndex % puzzleList.length];
    } else if (modeId === "chaos") {
        puzzleList = CURATED_PUZZLES.filter(p => p.mode === "chaos" || p.difficulty === "insane");
        state.currentPuzzle = puzzleList[state.puzzleIndex % puzzleList.length];
    } else {
        // Endless / Speedrun: Pick random
        const randIdx = Math.floor(Math.random() * CURATED_PUZZLES.length);
        state.currentPuzzle = CURATED_PUZZLES[randIdx];
    }

    startPuzzle(state.currentPuzzle);
}

export function startPuzzle(puzzle) {
    state.currentPuzzle = puzzle;
    state.chain = [puzzle.start.name, "", "", "", "", puzzle.end.name];
    state.linkResults = [null, null, null, null, null];
    state.hintsRevealed = { 0: false, 1: false, 2: false };
    state.activeSlotIndex = 0;

    // Timer config
    stopTimer();
    const hasTimer = state.mode === "daily" || state.mode === "speedrun";
    const timerBox = document.getElementById("puzzle-timer-box");
    if (timerBox) timerBox.style.display = hasTimer ? "flex" : "none";

    if (hasTimer) {
        state.timerSeconds = 60;
        state.timerMax = 60;
        startTimer();
    }

    renderGameUI();
}

// ==========================================
// TIMER MANAGEMENT
// ==========================================
function startTimer() {
    stopTimer();
    state.timerRunning = true;
    updateTimerUI();

    state.timerInterval = setInterval(() => {
        if (state.timerSeconds > 0) {
            state.timerSeconds--;
            updateTimerUI();
            if (state.timerSeconds <= 10) {
                audio.sfxTick();
            }
        } else {
            stopTimer();
            onTimeExpired();
        }
    }, 1000);
}

function stopTimer() {
    state.timerRunning = false;
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

function updateTimerUI() {
    const elTime = document.getElementById("timer-display");
    const elBar = document.getElementById("timer-bar-fill");
    if (elTime) elTime.textContent = `${state.timerSeconds}s`;
    if (elBar) {
        const pct = (state.timerSeconds / state.timerMax) * 100;
        elBar.style.width = `${pct}%`;
    }
}

function onTimeExpired() {
    audio.sfxInvalid();
    alert("⏰ Time is up! Review your chain or try again.");
}

// ==========================================
// UI RENDERING
// ==========================================
function renderGameUI() {
    const puz = state.currentPuzzle;
    if (!puz) return;

    // Header / Banner
    const elTitle = document.getElementById("puzzle-title");
    if (elTitle) elTitle.textContent = puz.title || "Four Degrees Bridge";

    const elDiff = document.getElementById("puzzle-difficulty-badge");
    if (elDiff) {
        const diffInfo = DIFFICULTY_LEVELS[puz.difficulty.toUpperCase()] || DIFFICULTY_LEVELS.MEDIUM;
        elDiff.textContent = `${diffInfo.icon} ${diffInfo.label}`;
        elDiff.style.borderColor = diffInfo.color;
        elDiff.style.color = diffInfo.color;
    }

    // Terminal Start Node
    const elStartIcon = document.getElementById("start-node-icon");
    const elStartTitle = document.getElementById("start-node-title");
    const elStartClue = document.getElementById("start-node-clue");
    if (elStartIcon) elStartIcon.textContent = puz.start.icon || "🌟";
    if (elStartTitle) elStartTitle.textContent = puz.start.name;
    if (elStartClue) elStartClue.textContent = puz.start.clue || "Starting concept";

    // Terminal End Node
    const elEndIcon = document.getElementById("end-node-icon");
    const elEndTitle = document.getElementById("end-node-title");
    const elEndClue = document.getElementById("end-node-clue");
    if (elEndIcon) elEndIcon.textContent = puz.end.icon || "🎯";
    if (elEndTitle) elEndTitle.textContent = puz.end.name;
    if (elEndClue) elEndClue.textContent = puz.end.clue || "Target destination";

    // Intermediate Slots (1 to 4)
    for (let slot = 1; slot <= 4; slot++) {
        const inputEl = document.getElementById(`slot-input-${slot}`);
        const cardEl = document.getElementById(`slot-card-${slot}`);
        const val = state.chain[slot] || "";
        
        if (inputEl) {
            inputEl.value = val;
        }

        if (cardEl) {
            cardEl.className = "node-card node-intermediate";
            if (val.trim() !== "") {
                const linkRes = state.linkResults[slot - 1];
                if (linkRes && linkRes.valid) {
                    cardEl.classList.add("valid-slot");
                } else if (linkRes && !linkRes.valid) {
                    cardEl.classList.add("invalid-slot");
                }
            }
        }
    }

    // Render Connector Link Pills
    renderConnectorBridges();

    // Render Hints
    renderHints();

    // Focus active slot
    const activeInput = document.getElementById(`slot-input-${state.activeSlotIndex + 1}`);
    if (activeInput) activeInput.focus();
}

function renderConnectorBridges() {
    for (let i = 0; i < 5; i++) {
        const bridgeEl = document.getElementById(`bridge-${i}`);
        const pillEl = document.getElementById(`bridge-pill-${i}`);
        const res = state.linkResults[i];

        if (!bridgeEl || !pillEl) continue;

        if (!res) {
            bridgeEl.className = "connector-bridge";
            pillEl.className = "connector-pill";
            pillEl.innerHTML = `<span class="pill-stars">⏳</span> Connect`;
        } else if (res.valid) {
            bridgeEl.className = "connector-bridge active-link";
            pillEl.className = `connector-pill pill-star-${res.score}`;
            pillEl.innerHTML = `<span class="pill-stars">${res.stars}</span> ${res.qualityText}`;
        } else {
            bridgeEl.className = "connector-bridge";
            pillEl.className = "connector-pill pill-invalid";
            pillEl.innerHTML = `<span class="pill-stars">❌</span> Invalid Link`;
        }
    }
}

function renderHints() {
    const puz = state.currentPuzzle;
    const hints = puz.hints || [];

    for (let h = 0; h < 3; h++) {
        const card = document.getElementById(`hint-card-${h}`);
        const body = document.getElementById(`hint-body-${h}`);
        const btn = document.getElementById(`btn-hint-${h}`);

        if (!card || !body || !btn) continue;

        const isRevealed = state.hintsRevealed[h];
        if (isRevealed) {
            card.classList.add("revealed");
            btn.style.display = "none";

            if (h === 0) {
                // Hint 1: Category
                const typeKey = (hints[0]?.type || "object").toUpperCase();
                const typeObj = CONNECTION_TYPES[typeKey] || CONNECTION_TYPES.OBJECT;
                body.innerHTML = `<strong>Category:</strong> Next step is a <span style="color:${typeObj.color}">${typeObj.icon} ${typeObj.label}</span>.`;
            } else if (h === 1) {
                // Hint 2: Starting letter
                const letter = hints[0]?.letter || "A";
                body.innerHTML = `<strong>First Letter:</strong> Starts with letter <strong style="color:var(--accent-amber)">"${letter}"</strong>.`;
            } else if (h === 2) {
                // Hint 3: Full clue text
                const text = hints[0]?.text || "Think about direct historical and physical associations.";
                body.innerHTML = `<strong>Contextual Clue:</strong> "${text}"`;
            }
        } else {
            card.classList.remove("revealed");
            btn.style.display = "inline-block";
            body.innerHTML = `<span style="color:var(--text-dim)">Hint locked. Click below to reveal.</span>`;
        }
    }
}

// ==========================================
// PLAYER ACTIONS & VALIDATION
// ==========================================
export function submitSlotInput(slotIndex) {
    const inputEl = document.getElementById(`slot-input-${slotIndex}`);
    if (!inputEl) return;

    const value = inputEl.value.trim();
    if (!value) return;

    state.chain[slotIndex] = value;

    // Validate link with previous node
    const prevNode = state.chain[slotIndex - 1];
    const res = validateConnection(prevNode, value);
    state.linkResults[slotIndex - 1] = res;

    if (res.valid) {
        audio.sfxValid(res.score);
    } else {
        audio.sfxInvalid();
    }

    // If slot 4 (the final intermediate slot) is filled, also validate link to END node!
    if (slotIndex === 4) {
        const endNode = state.chain[5];
        const endRes = validateConnection(value, endNode);
        state.linkResults[4] = endRes;
    }

    renderConnectorBridges();

    // Check if entire chain is complete & valid
    checkFullChainCompletion();

    // Advance focus to next slot if valid and not at end
    if (res.valid && slotIndex < 4) {
        state.activeSlotIndex = slotIndex;
        const nextInput = document.getElementById(`slot-input-${slotIndex + 1}`);
        if (nextInput && !nextInput.value.trim()) {
            nextInput.focus();
        }
    }
}

export function clearSlot(slotIndex) {
    state.chain[slotIndex] = "";
    state.linkResults[slotIndex - 1] = null;
    if (slotIndex === 4) state.linkResults[4] = null;

    const inputEl = document.getElementById(`slot-input-${slotIndex}`);
    if (inputEl) {
        inputEl.value = "";
        inputEl.focus();
    }

    renderGameUI();
}

export function unlockHint(hintIndex) {
    audio.init();
    state.hintsRevealed[hintIndex] = true;
    audio.sfxHint();
    renderHints();
}

function checkFullChainCompletion() {
    const fullRes = validateFullChain(state.chain);

    if (fullRes.isComplete) {
        stopTimer();
        if (fullRes.valid) {
            audio.sfxWin();
            setTimeout(() => showVictoryScorecard(fullRes), 400);
        } else {
            audio.sfxInvalid();
        }
    }
}

// ==========================================
// RATIONALE & SCORECARD MODALS
// ==========================================
export function showRationaleModal(bridgeIndex) {
    const from = state.chain[bridgeIndex];
    const to = state.chain[bridgeIndex + 1] || "???";
    const res = state.linkResults[bridgeIndex];

    const modal = document.getElementById("rationale-modal");
    const elTitle = document.getElementById("modal-link-pair");
    const elStars = document.getElementById("modal-link-stars");
    const elReason = document.getElementById("modal-link-reason");

    if (!modal) return;

    if (elTitle) elTitle.textContent = `${from}  ➔  ${to}`;
    if (elStars) elStars.textContent = res ? `${res.stars} (${res.qualityText})` : "Pending Connection";
    if (elReason) {
        elReason.textContent = res ? res.reason : "Enter an intermediate concept to test and evaluate the semantic connection.";
    }

    modal.classList.add("active");
}

export function closeRationaleModal() {
    const modal = document.getElementById("rationale-modal");
    if (modal) modal.classList.remove("active");
}

export function showVictoryScorecard(fullRes) {
    // Calculate hint penalty
    const hintsCount = Object.values(state.hintsRevealed).filter(Boolean).length;
    const finalScore = Math.max(0, fullRes.totalScore - hintsCount);

    // Update stats
    state.stats.played++;
    state.stats.solved++;
    state.stats.bestScore = Math.max(state.stats.bestScore, finalScore);
    state.stats.streak++;
    saveStats();

    const modal = document.getElementById("scorecard-modal");
    const elStars = document.getElementById("scorecard-stars-display");
    const elRank = document.getElementById("scorecard-rank-display");
    const elTable = document.getElementById("scorecard-table-body");

    if (!modal) return;

    if (elStars) {
        elStars.textContent = `⭐ ${finalScore} / ${fullRes.maxScore}`;
    }
    if (elRank) {
        elRank.textContent = fullRes.rankTitle;
    }

    if (elTable) {
        elTable.innerHTML = fullRes.links.map((link, i) => `
            <tr>
                <td style="font-weight:600; color:var(--text-main);">${link.from} ➔ ${link.to}</td>
                <td style="text-align:center;">${link.stars}</td>
                <td style="color:var(--text-muted); font-size:0.82rem;">${link.qualityText}</td>
            </tr>
        `).join("");
    }

    modal.classList.add("active");
}

export function closeScorecardModal() {
    const modal = document.getElementById("scorecard-modal");
    if (modal) modal.classList.remove("active");
}

export function copyShareableChain() {
    const puz = state.currentPuzzle;
    const fullRes = validateFullChain(state.chain);
    const hintsCount = Object.values(state.hintsRevealed).filter(Boolean).length;
    const finalScore = Math.max(0, fullRes.totalScore - hintsCount);

    const shareText = `🔗 LINKED: Four Degrees\n` +
        `Puzzle: ${puz.start.name} ➔ ${puz.end.name}\n` +
        `Score: ⭐ ${finalScore}/${fullRes.maxScore} (${fullRes.rankTitle})\n` +
        `Path:\n` +
        state.chain.map((c, i) => i === 0 ? `🌙 ${c}` : (i === 5 ? `🎯 ${c}` : ` ↓ ${c}`)).join("\n") +
        `\n\nPlay at: Basic Studio Labs`;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            alert("📋 Scorecard and chain copied to clipboard!");
        });
    }
}

// ==========================================
// TOOLBOX & AUTOCOMPLETE SYSTEM
// ==========================================
function setupToolboxAndAutocomplete() {
    // Category chips
    document.querySelectorAll(".chip-type").forEach(chip => {
        chip.addEventListener("click", () => {
            const typeKey = chip.dataset.type;
            const drawer = document.getElementById("suggestions-drawer");
            if (!drawer) return;

            // Show matching concepts from dictionary
            const matches = CONCEPT_DICTIONARY.filter(item => item.type === typeKey).slice(0, 8);
            drawer.innerHTML = matches.map(m => `
                <button class="sugg-chip" data-concept="${m.name}">
                    ${m.name}
                </button>
            `).join("");
            drawer.classList.add("visible");

            // Attach click handler to suggestion chips
            drawer.querySelectorAll(".sugg-chip").forEach(sugg => {
                sugg.addEventListener("click", () => {
                    const concept = sugg.dataset.concept;
                    insertConceptIntoActiveSlot(concept);
                });
            });
        });
    });

    // Autocomplete on inputs
    for (let slot = 1; slot <= 4; slot++) {
        const inputEl = document.getElementById(`slot-input-${slot}`);
        if (!inputEl) continue;

        inputEl.addEventListener("focus", () => {
            state.activeSlotIndex = slot - 1;
        });

        inputEl.addEventListener("input", (e) => {
            const val = e.target.value;
            const drawer = document.getElementById("suggestions-drawer");
            if (!drawer) return;

            if (val.trim().length >= 2) {
                const matches = searchConcepts(val, 6);
                if (matches.length > 0) {
                    drawer.innerHTML = matches.map(m => `
                        <button class="sugg-chip" data-concept="${m.name}">
                            ${m.name}
                        </button>
                    `).join("");
                    drawer.classList.add("visible");

                    drawer.querySelectorAll(".sugg-chip").forEach(sugg => {
                        sugg.addEventListener("click", () => {
                            insertConceptIntoActiveSlot(sugg.dataset.concept);
                        });
                    });
                } else {
                    drawer.classList.remove("visible");
                }
            } else {
                drawer.classList.remove("visible");
            }
        });

        inputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                submitSlotInput(slot);
            }
        });
    }
}

function insertConceptIntoActiveSlot(conceptName) {
    const slot = state.activeSlotIndex + 1;
    const inputEl = document.getElementById(`slot-input-${slot}`);
    if (inputEl) {
        inputEl.value = conceptName;
        submitSlotInput(slot);
    }
    const drawer = document.getElementById("suggestions-drawer");
    if (drawer) drawer.classList.remove("visible");
}

// ==========================================
// INITIALIZATION
// ==========================================
export function initGame() {
    initSynapseCanvas();
    loadStats();
    setupToolboxAndAutocomplete();

    // Mode Buttons
    document.querySelectorAll(".mode-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            switchMode(btn.dataset.mode);
        });
    });

    // Sound toggle
    const soundBtn = document.getElementById("btn-sound-toggle");
    if (soundBtn) {
        soundBtn.addEventListener("click", () => {
            state.soundEnabled = !state.soundEnabled;
            soundBtn.textContent = state.soundEnabled ? "🔊" : "🔇";
        });
    }

    // Modal Close buttons
    const btnCloseModal = document.getElementById("btn-close-rationale");
    if (btnCloseModal) btnCloseModal.addEventListener("click", closeRationaleModal);

    const btnCloseScorecard = document.getElementById("btn-close-scorecard");
    if (btnCloseScorecard) btnCloseScorecard.addEventListener("click", closeScorecardModal);

    const btnShare = document.getElementById("btn-share-scorecard");
    if (btnShare) btnShare.addEventListener("click", copyShareableChain);

    const btnPlayNext = document.getElementById("btn-play-next");
    if (btnPlayNext) {
        btnPlayNext.addEventListener("click", () => {
            closeScorecardModal();
            state.puzzleIndex++;
            switchMode(state.mode);
        });
    }

    // Connector Bridge clicks
    for (let i = 0; i < 5; i++) {
        const pillEl = document.getElementById(`bridge-pill-${i}`);
        if (pillEl) {
            pillEl.addEventListener("click", () => showRationaleModal(i));
        }
    }

    // Slot submit and clear buttons
    for (let slot = 1; slot <= 4; slot++) {
        const btnSubmit = document.getElementById(`btn-slot-submit-${slot}`);
        if (btnSubmit) {
            btnSubmit.addEventListener("click", () => submitSlotInput(slot));
        }

        const btnClear = document.getElementById(`btn-slot-clear-${slot}`);
        if (btnClear) {
            btnClear.addEventListener("click", () => clearSlot(slot));
        }
    }

    // Hint buttons
    for (let h = 0; h < 3; h++) {
        const btnHint = document.getElementById(`btn-hint-${h}`);
        if (btnHint) {
            btnHint.addEventListener("click", () => unlockHint(h));
        }
    }

    // Start with Knowledge / Default mode
    switchMode("knowledge");
}

// Auto init when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGame);
} else {
    initGame();
}
