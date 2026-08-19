// --- AUDIO SYNTHESIZER ENGINE (Web Audio API - Zero external assets) ---
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('plantDetective_muted') === 'true';
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('plantDetective_muted', this.muted);
        return this.muted;
    }

    play(type, params = {}) {
        if (this.muted) return;
        try {
            this.init();
            const now = this.ctx.currentTime;

            if (type === 'click') {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.05);
            } 
            else if (type === 'scan') {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.15);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.18);
            }
            else if (type === 'correct') {
                // Harmonic uplifting chime with pitch scaling based on combo
                const combo = params.combo || 1;
                const baseFreq = 440 * Math.pow(1.08, Math.min(combo, 12));
                
                [0, 4, 7, 12].forEach((interval, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    const freq = baseFreq * Math.pow(2, interval / 12);
                    osc.frequency.setValueAtTime(freq, now + idx * 0.04);
                    
                    gain.gain.setValueAtTime(0, now + idx * 0.04);
                    gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.04 + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.35);
                    
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + idx * 0.04);
                    osc.stop(now + idx * 0.04 + 0.35);
                });
            }
            else if (type === 'comboMilestone') {
                // Grand triumphant fanfare
                const chord = [523.25, 659.25, 783.99, 1046.50];
                chord.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.06);
                    gain.gain.setValueAtTime(0.2, now + idx * 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.5);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now + idx * 0.06);
                    osc.stop(now + idx * 0.06 + 0.5);
                });
            }
            else if (type === 'wrong') {
                // Soft educational buzz/wobble (gentle, not punishing)
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.linearRampToValueAtTime(130, now + 0.25);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.25);
            }
            else if (type === 'clue') {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.linearRampToValueAtTime(900, now + 0.1);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.15);
            }
        } catch (e) {
            console.log('Audio playback error', e);
        }
    }
}

const audio = new SoundEngine();

// --- PARTICLE FX ENGINE ---
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('fx-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loop();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    burst(x, y, count = 28, colorSet = ['#10b981', '#34d399', '#f59e0b', '#6ee7b7']) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                size: 3 + Math.random() * 5,
                color: colorSet[Math.floor(Math.random() * colorSet.length)],
                life: 1,
                decay: 0.02 + Math.random() * 0.025,
                isLeaf: Math.random() > 0.6,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2
            });
        }
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // Gravity
            p.vx *= 0.98; // Air drag
            p.life -= p.decay;
            p.rotation += p.rotSpeed;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = p.color;

            if (p.isLeaf) {
                // Draw tiny botanical spore/leaf
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // Circle spark
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        requestAnimationFrame(() => this.loop());
    }
}

let fx;

// --- CLEARANCE RANKS ---
const CLEARANCE_RANKS = [
    { level: 1, title: "TRAINEE", minScore: 0 },
    { level: 2, title: "SLEUTH", minScore: 1200 },
    { level: 3, title: "TAXONOMIST", minScore: 2800 },
    { level: 4, title: "CHIEF BOTANIST", minScore: 5000 },
    { level: 5, title: "MASTER DETECTIVE", minScore: 8500 }
];

// --- GAME STATE ---
const state = {
    score: 0,
    bestScore: parseInt(localStorage.getItem('plantDetective_bestScore')) || 0,
    combo: 0,
    bestCombo: 0,
    lives: 3,
    level: 1,
    plantsAnalyzed: 0,
    currentPlant: null,
    currentQuestion: null,
    plantsQueue: [],
    discoveredPlants: new Set(JSON.parse(localStorage.getItem('plantDetective_discovered')) || []),
    feedbackOpen: false,
    clueUsedThisTurn: false,
    questionsAnsweredTotal: 0,
    correctCount: 0
};

// --- DOM ELEMENTS ---
const screens = {
    start: document.getElementById('screen-start'),
    game: document.getElementById('screen-game'),
    gameover: document.getElementById('screen-gameover'),
    encyclopedia: document.getElementById('screen-encyclopedia')
};

const ui = {
    bestScore: document.getElementById('ui-best-score'),
    level: document.getElementById('ui-level'),
    score: document.getElementById('ui-score'),
    floatingScoreContainer: document.getElementById('floating-score-container'),
    combo: document.getElementById('ui-combo'),
    comboRank: document.getElementById('ui-combo-rank'),
    comboFill: document.getElementById('ui-combo-fill'),
    clearanceTitle: document.getElementById('ui-clearance-title'),
    progressFill: document.getElementById('ui-progress-fill'),
    progressText: document.getElementById('ui-level-progress-text'),
    lives: document.getElementById('ui-lives'),
    
    // Containment Pod
    laser: document.getElementById('scanner-laser'),
    anomalyBanner: document.getElementById('ui-anomaly-banner'),
    specimenId: document.getElementById('ui-specimen-id'),
    plantImage: document.getElementById('ui-plant-image'),
    plantName: document.getElementById('ui-plant-name'),
    
    // Clue
    btnClue: document.getElementById('btn-clue'),
    cluePopup: document.getElementById('clue-popup'),
    clueText: document.getElementById('clue-text'),
    
    // Question Deck
    questionTag: document.getElementById('ui-question-tag'),
    question: document.getElementById('ui-question'),
    options: document.getElementById('ui-options'),
    
    // Feedback Dossier
    feedbackOverlay: document.getElementById('feedback-overlay'),
    feedbackIcon: document.getElementById('feedback-icon'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackExplanation: document.getElementById('feedback-explanation'),
    fileName: document.getElementById('file-name'),
    fileIcon: document.getElementById('file-icon'),
    fileCategory: document.getElementById('file-category'),
    fileGrowth: document.getElementById('file-growth'),
    fileReproduction: document.getElementById('file-reproduction'),
    fileScientific: document.getElementById('file-scientific'),
    fileHabitat: document.getElementById('file-habitat'),
    fileFact: document.getElementById('file-fact'),
    fileDiscoveryStamp: document.getElementById('file-discovery-stamp'),
    btnNext: document.getElementById('btn-next'),

    // End Screen
    endScore: document.getElementById('end-score'),
    endPlants: document.getElementById('end-plants'),
    endCombo: document.getElementById('end-combo'),
    endAccuracy: document.getElementById('end-accuracy'),
    endRank: document.getElementById('end-rank'),

    // Encyclopedia
    encyclopediaGrid: document.getElementById('encyclopedia-grid'),
    encyclopediaCount: document.getElementById('encyclopedia-count'),
    encyclopediaTotal: document.getElementById('encyclopedia-total'),
    encyclopediaProgressFill: document.getElementById('encyclopedia-progress-fill'),
    menuDiscoveredCount: document.getElementById('menu-discovered-count'),
    soundIcon: document.getElementById('sound-icon'),
    btnSoundToggle: document.getElementById('btn-sound-toggle')
};

// --- QUESTION GENERATOR ENGINE ---
const questionTypes = [
    {
        type: 'category',
        tag: "CATEGORY ANALYSIS",
        text: "Which botanical division does this specimen belong to?",
        getAnswer: (p) => p.category,
        getWrongAnswers: (p) => getDistractors(PlantData.categories, p.category, 3),
        minLevel: 1
    },
    {
        type: 'growthForm',
        tag: "MORPHOLOGY SCAN",
        text: "What is the primary growth form of this plant?",
        getAnswer: (p) => p.growthForm,
        getWrongAnswers: (p) => getDistractors(PlantData.growthForms, p.growthForm, 3),
        minLevel: 1
    },
    {
        type: 'reproduction',
        tag: "REPRODUCTION DIAGNOSTIC",
        text: "How does this plant propagate and reproduce?",
        getAnswer: (p) => p.reproduction,
        getWrongAnswers: (p) => getDistractors(PlantData.reproductions, p.reproduction, 2),
        minLevel: 2
    },
    {
        type: 'monocotDicot',
        tag: "EMBRYONIC TAXONOMY",
        text: "Is this flowering plant classified as a monocot or dicot?",
        getAnswer: (p) => p.monocotOrDicot,
        getWrongAnswers: (p) => PlantData.monocotDicot.filter(x => x !== p.monocotOrDicot),
        minLevel: 2,
        condition: (p) => p.category === "Flowering plant" && p.monocotOrDicot !== "Neither"
    },
    {
        type: 'habitat',
        tag: "ECO-BIOME MATCH",
        text: "Which ecosystem is this specimen adapted to thrive in?",
        getAnswer: (p) => p.habitat,
        getWrongAnswers: (p) => {
            const allHabitats = [...new Set(PlantData.plants.map(pl => pl.habitat))];
            return getDistractors(allHabitats, p.habitat, 3);
        },
        minLevel: 2
    },
    {
        type: 'adaptation',
        tag: "ADAPTIVE FEATURE SCAN",
        text: "What is this specimen's key evolutionary adaptation?",
        getAnswer: (p) => p.adaptation,
        getWrongAnswers: (p) => {
            const allAdaptations = [...new Set(PlantData.plants.map(pl => pl.adaptation))];
            return getDistractors(allAdaptations, p.adaptation, 3);
        },
        minLevel: 3
    }
];

// --- UTILITIES ---
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getDistractors(sourceArray, correctAnswer, count) {
    const distractors = sourceArray.filter(item => item !== correctAnswer);
    return shuffleArray(distractors).slice(0, count);
}

function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// --- GAMEPLAY LOOP & LOGIC ---
function initGame() {
    state.score = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.lives = 3;
    state.level = 1;
    state.plantsAnalyzed = 0;
    state.questionsAnsweredTotal = 0;
    state.correctCount = 0;
    state.feedbackOpen = false;

    // Build plant queue: Easy plants first, then progressive
    const available = shuffleArray(PlantData.plants);
    const tier1 = available.filter(p => p.difficulty === 1);
    const tier2 = available.filter(p => p.difficulty === 2);
    const tier3 = available.filter(p => p.difficulty >= 3);
    
    state.plantsQueue = [...tier1, ...tier2, ...tier3];

    updateHUD();
    switchScreen('game');
    nextTurn();
}

function nextTurn() {
    state.feedbackOpen = false;
    state.clueUsedThisTurn = false;
    ui.feedbackOverlay.classList.add('hidden');
    ui.cluePopup.classList.add('hidden');
    ui.options.innerHTML = '';

    if (state.lives <= 0) {
        endGame();
        return;
    }

    if (state.plantsQueue.length === 0) {
        state.plantsQueue = shuffleArray(PlantData.plants);
    }

    state.currentPlant = state.plantsQueue.shift();
    
    // Level Progression (every 5 specimens = next level)
    state.level = Math.floor(state.plantsAnalyzed / 5) + 1;

    // Trigger Laser Scanner Animation & Sound
    audio.play('scan');
    ui.laser.classList.remove('scanning');
    void ui.laser.offsetWidth; // Trigger reflow
    ui.laser.classList.add('scanning');

    generateQuestion();
    renderTurn();
    updateHUD();
}

function generateQuestion() {
    const p = state.currentPlant;
    
    // Filter questions matching current level and conditions
    let validQuestions = questionTypes.filter(q => 
        q.minLevel <= state.level && 
        (!q.condition || q.condition(p))
    );

    // If it's a trick plant at level >= 2, prioritize trick questions (Category or Growth Form)
    if (p.trick && Math.random() > 0.4) {
        validQuestions = validQuestions.filter(q => q.type === 'growthForm' || q.type === 'category' || q.type === 'monocotDicot');
    }

    const qTemplate = validQuestions[Math.floor(Math.random() * validQuestions.length)] || questionTypes[0];
    
    const correctAnswer = qTemplate.getAnswer(p);
    const wrongAnswers = qTemplate.getWrongAnswers(p);
    
    const allOptions = shuffleArray([correctAnswer, ...wrongAnswers]);
    
    state.currentQuestion = {
        tag: qTemplate.tag,
        text: qTemplate.text,
        options: allOptions,
        correctAnswer: correctAnswer
    };
}

function renderTurn() {
    const p = state.currentPlant;
    const q = state.currentQuestion;

    // Anomaly banner
    if (p.trick) {
        ui.anomalyBanner.classList.remove('hidden');
    } else {
        ui.anomalyBanner.classList.add('hidden');
    }

    ui.specimenId.textContent = `SPECIMEN #${String(state.plantsAnalyzed + 1).padStart(2, '0')}`;
    ui.plantImage.textContent = p.image;
    ui.plantName.textContent = p.name;
    
    ui.questionTag.textContent = q.tag;
    ui.question.textContent = q.text;

    // Render interactive option buttons with hotkey badges
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span>${opt}</span>
            <span class="option-hotkey">[${idx + 1}]</span>
        `;
        btn.onclick = () => handleAnswer(opt, btn);
        ui.options.appendChild(btn);
    });
}

function handleAnswer(selectedAnswer, btnElement) {
    if (state.feedbackOpen) return;

    state.feedbackOpen = true;
    state.questionsAnsweredTotal++;

    // Disable options
    const buttons = ui.options.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);

    const isCorrect = selectedAnswer === state.currentQuestion.correctAnswer;
    const p = state.currentPlant;
    
    const isNewDiscovery = isCorrect && !state.discoveredPlants.has(p.id);
    if (isNewDiscovery) {
        state.discoveredPlants.add(p.id);
        localStorage.setItem('plantDetective_discovered', JSON.stringify([...state.discoveredPlants]));
        updateDossierCount();
    }

    state.plantsAnalyzed++;

    if (isCorrect) {
        state.correctCount++;
        btnElement.classList.add('correct');
        handleCorrect(btnElement, isNewDiscovery);
    } else {
        btnElement.classList.add('wrong');
        buttons.forEach(b => {
            if (b.querySelector('span').textContent === state.currentQuestion.correctAnswer) {
                b.classList.add('correct');
            }
        });
        handleWrong();
    }

    updateHUD();
    showFeedback(isCorrect, isNewDiscovery);
}

function handleCorrect(btnElement, isNewDiscovery) {
    state.combo++;
    if (state.combo > state.bestCombo) state.bestCombo = state.combo;

    // Score calculation
    const baseScore = 100;
    const comboMultiplier = Math.min(state.combo, 8);
    const levelBonus = state.level * 25;
    const scoreGained = (baseScore * comboMultiplier) + levelBonus;
    
    state.score += scoreGained;

    // High score check
    if (state.score > state.bestScore) {
        state.bestScore = state.score;
        localStorage.setItem('plantDetective_bestScore', state.bestScore);
    }

    // Audio & FX
    if (state.combo === 3 || state.combo === 5 || state.combo === 8) {
        audio.play('comboMilestone');
    } else {
        audio.play('correct', { combo: state.combo });
    }

    // Particle burst from button position
    if (fx && btnElement) {
        const rect = btnElement.getBoundingClientRect();
        fx.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
    }

    // Floating Score Delta
    spawnFloatingScore(`+${scoreGained}${state.combo > 1 ? ` (×${state.combo} 🔥)` : ''}`);
}

function handleWrong() {
    state.combo = 0;
    state.lives--;
    audio.play('wrong');
}

function spawnFloatingScore(text) {
    const el = document.createElement('div');
    el.className = 'floating-score';
    el.textContent = text;
    ui.floatingScoreContainer.appendChild(el);
    setTimeout(() => el.remove(), 1200);
}

function updateHUD() {
    ui.score.textContent = state.score.toLocaleString();
    ui.bestScore.textContent = state.bestScore.toLocaleString();
    ui.level.textContent = state.level;
    
    // Level Progress Fill (5 plants per level)
    const progressInLevel = (state.plantsAnalyzed % 5);
    const pct = ((progressInLevel) / 5) * 100;
    ui.progressFill.style.width = `${pct}%`;
    ui.progressText.textContent = `Specimen ${progressInLevel + 1} / 5`;

    // Clearance Title
    const rankObj = [...CLEARANCE_RANKS].reverse().find(r => state.level >= r.level) || CLEARANCE_RANKS[0];
    ui.clearanceTitle.textContent = rankObj.title;

    // Combo Strip & Meter
    ui.combo.textContent = `×${state.combo}`;
    const comboFillPct = Math.min((state.combo / 8) * 100, 100);
    ui.comboFill.style.width = `${comboFillPct}%`;

    if (state.combo >= 8) {
        ui.comboRank.textContent = "MAX DETECTIVE ⚡";
    } else if (state.combo >= 5) {
        ui.comboRank.textContent = "FRENZY 🔥🔥";
    } else if (state.combo >= 3) {
        ui.comboRank.textContent = "IN THE ZONE 🔥";
    } else if (state.combo >= 2) {
        ui.comboRank.textContent = "HEATING UP";
    } else {
        ui.comboRank.textContent = "STANDARD";
    }

    // Lives
    let hearts = '';
    for (let i = 0; i < 3; i++) {
        hearts += (i < state.lives) ? '❤️' : '🖤';
    }
    ui.lives.textContent = hearts;
}

function showFeedback(isCorrect, isNewDiscovery) {
    const p = state.currentPlant;
    
    ui.feedbackIcon.className = `status-indicator-icon ${isCorrect ? 'success' : 'error'}`;
    ui.feedbackIcon.textContent = isCorrect ? "✓" : "✕";

    ui.feedbackTitle.textContent = isCorrect ? "CLASSIFICATION VERIFIED" : "MISCONCEPTION IDENTIFIED";
    ui.feedbackTitle.className = isCorrect ? "success-text" : "error-text";
    
    ui.feedbackExplanation.textContent = isCorrect 
        ? "Excellent botanical forensics. Morphological match confirmed."
        : `Diagnostic note: Correct classification is "${state.currentQuestion.correctAnswer}".`;

    // Dossier Stamp
    if (isNewDiscovery) {
        ui.fileDiscoveryStamp.textContent = "✨ NEW DISCOVERY";
        ui.fileDiscoveryStamp.style.borderColor = "var(--accent)";
        ui.fileDiscoveryStamp.style.color = "var(--accent)";
    } else {
        ui.fileDiscoveryStamp.textContent = "ARCHIVED";
        ui.fileDiscoveryStamp.style.borderColor = "var(--primary)";
        ui.fileDiscoveryStamp.style.color = "var(--primary)";
    }

    // Populate Dossier
    ui.fileIcon.textContent = p.image;
    ui.fileName.textContent = p.name.toUpperCase();
    ui.fileScientific.textContent = p.scientificName;
    ui.fileCategory.textContent = p.category;
    ui.fileGrowth.textContent = p.growthForm;
    ui.fileReproduction.textContent = p.reproduction;
    ui.fileHabitat.textContent = p.habitat;
    ui.fileFact.textContent = p.interestingFact;

    ui.feedbackOverlay.classList.remove('hidden');
}

function triggerClue() {
    if (state.feedbackOpen || state.clueUsedThisTurn) return;
    state.clueUsedThisTurn = true;
    audio.play('clue');
    ui.clueText.textContent = state.currentPlant.clue || "Inspect surface textures, leaves, and reproductive features.";
    ui.cluePopup.classList.remove('hidden');
}

function endGame() {
    const accuracy = state.questionsAnsweredTotal > 0 
        ? Math.round((state.correctCount / state.questionsAnsweredTotal) * 100) 
        : 0;

    ui.endScore.textContent = state.score.toLocaleString();
    ui.endPlants.textContent = state.plantsAnalyzed;
    ui.endCombo.textContent = `×${state.bestCombo}`;
    ui.endAccuracy.textContent = `${accuracy}%`;
    
    let rank = "Botanical Apprentice";
    if (state.score >= 8000) rank = "🌿 Chief Forensic Botanist";
    else if (state.score >= 4500) rank = "🔬 Senior Taxonomist";
    else if (state.score >= 2000) rank = "🔍 Botanical Sleuth";
    else rank = "🌱 Field Trainee";
    
    ui.endRank.textContent = rank;
    switchScreen('gameover');
}

// --- DOSSIER / ENCYCLOPEDIA ---
let currentFilter = 'all';

function renderEncyclopedia() {
    const total = PlantData.plants.length;
    const discoveredCount = state.discoveredPlants.size;
    
    ui.encyclopediaTotal.textContent = total;
    ui.encyclopediaCount.textContent = discoveredCount;
    ui.encyclopediaProgressFill.style.width = `${(discoveredCount / total) * 100}%`;
    
    ui.encyclopediaGrid.innerHTML = '';
    
    let filteredPlants = PlantData.plants;
    if (currentFilter === 'discovered') {
        filteredPlants = filteredPlants.filter(p => state.discoveredPlants.has(p.id));
    } else if (currentFilter === 'tricks') {
        filteredPlants = filteredPlants.filter(p => p.trick);
    }

    filteredPlants.forEach(p => {
        const isDiscovered = state.discoveredPlants.has(p.id);
        
        const card = document.createElement('div');
        card.className = `plant-card ${isDiscovered ? '' : 'locked'}`;
        
        card.innerHTML = `
            ${p.trick && isDiscovered ? '<span class="trick-indicator" title="Trick Specimen">⚠️</span>' : ''}
            <div class="emoji">${isDiscovered ? p.image : '❓'}</div>
            <div class="name">${isDiscovered ? p.name : 'Unknown Specimen'}</div>
            <div class="card-cat-tag">${isDiscovered ? p.category : 'Classified'}</div>
        `;
        
        if (isDiscovered) {
            card.onclick = () => {
                audio.play('click');
                showEncyclopediaModal(p);
            };
        }
        
        ui.encyclopediaGrid.appendChild(card);
    });
}

function showEncyclopediaModal(p) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="glass-panel modal-content">
            <div class="plant-file" style="margin-bottom:0">
                <div class="file-header">
                    <span class="file-icon">${p.image}</span>
                    <div class="file-title-wrap">
                        <h4 style="margin:0">${p.name.toUpperCase()}</h4>
                        <span class="scientific-name-tag">${p.scientificName}</span>
                    </div>
                </div>
                <div class="file-details-grid">
                    <div class="detail-box"><span class="detail-label">CATEGORY</span><span class="detail-val">${p.category}</span></div>
                    <div class="detail-box"><span class="detail-label">GROWTH</span><span class="detail-val">${p.growthForm}</span></div>
                    <div class="detail-box"><span class="detail-label">REPRODUCTION</span><span class="detail-val">${p.reproduction}</span></div>
                    <div class="detail-box"><span class="detail-label">HABITAT</span><span class="detail-val">${p.habitat}</span></div>
                </div>
                <div class="did-you-know-box">
                    <div class="dyk-title">🌟 BOTANICAL INTELLIGENCE</div>
                    <p>${p.interestingFact}</p>
                </div>
            </div>
            <button class="btn-primary" style="margin-top:14px; width:100%" id="btn-modal-close">CLOSE DOSSIER</button>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#btn-modal-close').onclick = () => {
        audio.play('click');
        modal.remove();
    };
    modal.onclick = (e) => {
        if (e.target === modal) {
            audio.play('click');
            modal.remove();
        }
    };
}

function updateDossierCount() {
    ui.menuDiscoveredCount.textContent = state.discoveredPlants.size;
    ui.bestScore.textContent = state.bestScore.toLocaleString();
}

// --- EVENT LISTENERS & KEYBOARD QUICK-PLAY ---
document.getElementById('btn-start').addEventListener('click', () => {
    audio.play('click');
    initGame();
});

document.getElementById('btn-next').addEventListener('click', () => {
    audio.play('click');
    nextTurn();
});

document.getElementById('btn-restart').addEventListener('click', () => {
    audio.play('click');
    initGame();
});

document.getElementById('btn-menu-encyclopedia').addEventListener('click', () => {
    audio.play('click');
    renderEncyclopedia();
    switchScreen('encyclopedia');
});

document.getElementById('btn-encyclopedia').addEventListener('click', () => {
    audio.play('click');
    renderEncyclopedia();
    switchScreen('encyclopedia');
});

document.getElementById('btn-back-home').addEventListener('click', () => {
    audio.play('click');
    updateDossierCount();
    switchScreen('start');
});

ui.btnClue.addEventListener('click', triggerClue);

// Dossier Filter Pills
document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
        audio.play('click');
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderEncyclopedia();
    });
});

// Audio Toggle
ui.btnSoundToggle.addEventListener('click', () => {
    const isMuted = audio.toggleMute();
    ui.soundIcon.textContent = isMuted ? '🔇' : '🔊';
    if (!isMuted) audio.play('click');
});

// Keyboard Quick-Play Support [1-4, Space, C, M]
window.addEventListener('keydown', (e) => {
    // Audio Toggle
    if (e.key === 'm' || e.key === 'M') {
        const isMuted = audio.toggleMute();
        ui.soundIcon.textContent = isMuted ? '🔇' : '🔊';
        return;
    }

    // If game screen is active
    if (screens.game.classList.contains('active')) {
        // Space / Enter advances feedback
        if (state.feedbackOpen && (e.code === 'Space' || e.code === 'Enter')) {
            e.preventDefault();
            audio.play('click');
            nextTurn();
            return;
        }

        // C triggers clue
        if (!state.feedbackOpen && (e.key === 'c' || e.key === 'C')) {
            e.preventDefault();
            triggerClue();
            return;
        }

        // 1, 2, 3, 4 selects option
        if (!state.feedbackOpen && ['1', '2', '3', '4'].includes(e.key)) {
            const index = parseInt(e.key) - 1;
            const buttons = ui.options.querySelectorAll('.option-btn');
            if (buttons[index] && !buttons[index].disabled) {
                buttons[index].click();
            }
        }
    }
});

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
    fx = new ParticleSystem();
    ui.soundIcon.textContent = audio.muted ? '🔇' : '🔊';
    updateDossierCount();
    switchScreen('start');
});
