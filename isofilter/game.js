/**
 * ISOFILTER: Nuclear Sorting Facility Game Engine
 * Modes: LOGIC LAB (Puzzles) & SORT RUSH (Arcade Endless)
 */

import { ISOTOPES, ISOTOPE_MAP, getIsotope, getRandomIsotope } from './isotopes.js';
import { sound } from './audio.js';
import { evaluateGate, formatGateLabel, BOOLEAN_OPS } from './logic_engine.js';
import { LEVELS, getLevel } from './levels.js';

class IsoFilterEngine {
    constructor() {
        this.mode = 'logic_lab'; // 'logic_lab' | 'sort_rush'
        
        // Canvas & Rendering
        this.canvas = document.getElementById('machineCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.dpr = window.devicePixelRatio || 1;
        this.width = 800;
        this.height = 520;

        // Logic Lab State
        this.currentLevelId = 1;
        this.currentLevel = getLevel(1);
        this.placedGates = [null, null]; // Slots for gates in pipeline
        this.selectedPaletteGate = null;
        this.selectedSlotIndex = 0;
        this.simulationRunning = false;
        this.simIsotopesQueue = [];
        this.activeCapsules = [];
        this.sortedCounts = {}; // { bin_a: [isotopes], bin_b: [isotopes] }

        // Sort Rush State
        this.rushRunning = false;
        this.rushScore = 0;
        this.rushStreak = 0;
        this.maxRushStreak = 0;
        this.rushMultiplier = 1;
        this.rushHazard = 0; // 0 to 3 max errors before meltdown
        this.rushSpeed = 2.4;
        this.rushSpawnTimer = 0;
        this.rushActiveGateConfig = null;
        this.rushGateManualToggle = false; // Player can flip diverter
        this.flowState = false;
        this.rushBins = [
            { id: 'rush_a', label: 'HAZARD / RADIOACTIVE', color: '#eab308', matchRule: { type: 'radioactive', value: true } },
            { id: 'rush_b', label: 'SAFE / STABLE', color: '#10b981', matchRule: { type: 'radioactive', value: false } }
        ];

        // Visual effects
        this.particles = [];
        this.floatingTexts = [];
        this.gateArmAngles = [0, 0]; // For mechanical animation
        this.conveyorOffset = 0;
        this.lastFrameTime = performance.now();

        // Level Completion Storage
        this.levelStars = JSON.parse(localStorage.getItem('isofilter_stars') || '{}');
        this.highScore = Number(localStorage.getItem('isofilter_highscore') || 0);

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.bindDOM();
        this.loadLevel(this.currentLevelId);
        this.populateCodex();
        this.renderLevelSelectGrid();

        // Start animation loop
        requestAnimationFrame((t) => this.loop(t));
    }

    resizeCanvas() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        if (this.ctx) {
            this.ctx.scale(this.dpr, this.dpr);
        }
    }

    bindDOM() {
        // Tab switching
        document.getElementById('tabLogicLab')?.addEventListener('click', () => this.setMode('logic_lab'));
        document.getElementById('tabSortRush')?.addEventListener('click', () => this.setMode('sort_rush'));

        // Controls
        document.getElementById('btnStartSim')?.addEventListener('click', () => this.startLogicLabSim());
        document.getElementById('btnResetPipeline')?.addEventListener('click', () => this.resetPipeline());
        document.getElementById('btnStartRush')?.addEventListener('click', () => this.startSortRush());
        document.getElementById('btnFlipGate')?.addEventListener('click', () => this.toggleRushDiverter());

        // Modals
        document.getElementById('btnOpenCodex')?.addEventListener('click', () => this.openModal('codexModal'));
        document.getElementById('btnCloseCodex')?.addEventListener('click', () => this.closeModal('codexModal'));
        document.getElementById('btnOpenLevels')?.addEventListener('click', () => this.openModal('levelsModal'));
        document.getElementById('btnCloseLevels')?.addEventListener('click', () => this.closeModal('levelsModal'));
        document.getElementById('btnCloseVictory')?.addEventListener('click', () => this.closeModal('victoryModal'));
        document.getElementById('btnNextLevel')?.addEventListener('click', () => this.nextLevel());
        document.getElementById('btnCloseGameOver')?.addEventListener('click', () => this.closeModal('gameOverModal'));
        document.getElementById('btnRestartRush')?.addEventListener('click', () => {
            this.closeModal('gameOverModal');
            this.startSortRush();
        });

        // Audio mute
        document.getElementById('btnMute')?.addEventListener('click', (e) => {
            const isMuted = sound.toggleMute();
            e.currentTarget.classList.toggle('active-glow', isMuted);
            e.currentTarget.innerHTML = isMuted ? '🔇 MUTED' : '🔊 AUDIO';
        });

        // Keyboard Controls
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (this.mode === 'sort_rush' && this.rushRunning) {
                    e.preventDefault();
                    this.toggleRushDiverter();
                } else if (this.mode === 'logic_lab' && !this.simulationRunning) {
                    e.preventDefault();
                    this.startLogicLabSim();
                }
            } else if (e.code === 'KeyM') {
                sound.toggleMute();
            } else if (e.code === 'KeyR') {
                if (this.mode === 'logic_lab') this.resetPipeline();
            }
        });

        // Canvas Click for gate slots / interactive diverters
        this.canvas?.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.handleCanvasClick(mouseX, mouseY);
        });
    }

    setMode(mode) {
        sound.playClick();
        this.mode = mode;
        this.simulationRunning = false;
        this.rushRunning = false;
        this.activeCapsules = [];
        this.particles = [];
        this.floatingTexts = [];
        this.setFlowState(false);

        document.getElementById('tabLogicLab')?.classList.toggle('active', mode === 'logic_lab');
        document.getElementById('tabSortRush')?.classList.toggle('active', mode === 'sort_rush');

        document.getElementById('logicLabControls').style.display = mode === 'logic_lab' ? 'flex' : 'none';
        document.getElementById('sortRushControls').style.display = mode === 'sort_rush' ? 'flex' : 'none';
        document.getElementById('logicLabSidebar').style.display = mode === 'logic_lab' ? 'flex' : 'none';
        document.getElementById('sortRushSidebar').style.display = mode === 'sort_rush' ? 'flex' : 'none';

        if (mode === 'logic_lab') {
            this.loadLevel(this.currentLevelId);
        } else {
            this.prepareSortRush();
        }
    }

    // ==========================================
    // LOGIC LAB IMPLEMENTATION
    // ==========================================

    loadLevel(levelId) {
        this.currentLevelId = levelId;
        this.currentLevel = getLevel(levelId);
        this.placedGates = new Array(this.currentLevel.maxGates).fill(null);
        this.selectedPaletteGate = null;
        this.selectedSlotIndex = 0;
        this.simulationRunning = false;
        this.activeCapsules = [];
        this.sortedCounts = {};
        this.currentLevel.bins.forEach(b => this.sortedCounts[b.id] = []);

        // Update CRT Monitor & Labels
        const crtTitle = document.getElementById('crtLevelTitle');
        if (crtTitle) crtTitle.textContent = this.currentLevel.title;

        const crtDesc = document.getElementById('crtLevelDesc');
        if (crtDesc) {
            crtDesc.innerHTML = `<strong>MISSION:</strong> ${this.currentLevel.briefing}<br><br>
            <strong>GATE BUDGET:</strong> ${this.currentLevel.maxGates} max (Solve in ≤ ${this.currentLevel.optimalGates} for 3 ⭐)`;
        }

        const queueDisplay = document.getElementById('crtQueueDisplay');
        if (queueDisplay) {
            queueDisplay.textContent = `QUEUE (${this.currentLevel.isotopeFeed.length}): ${this.currentLevel.isotopeFeed.join(' • ')}`;
        }

        this.renderGatePalette();
        this.renderTargetBins();
        this.updateHUD();
    }

    renderGatePalette() {
        const container = document.getElementById('gatePaletteContainer');
        if (!container) return;
        container.innerHTML = '';

        this.currentLevel.availableGates.forEach((gate, idx) => {
            const card = document.createElement('div');
            card.className = `gate-card ${this.selectedPaletteGate === gate ? 'selected' : ''}`;
            card.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:0.2rem;">
                    <span class="gate-card-title">${gate.label}</span>
                    <span style="font-size:0.68rem; color:#94a3b8; font-family:var(--font-mono);">${formatGateLabel(gate.config)}</span>
                </div>
                <span class="gate-badge">CHIP ${idx + 1}</span>
            `;
            card.addEventListener('click', () => {
                sound.playClick();
                this.selectedPaletteGate = gate;
                this.renderGatePalette();
                // If a slot is targeted, assign immediately
                if (this.selectedSlotIndex !== null && this.selectedSlotIndex < this.placedGates.length) {
                    this.placedGates[this.selectedSlotIndex] = gate;
                    sound.playGateClunk('left');
                }
            });
            container.appendChild(card);
        });
    }

    renderTargetBins() {
        const container = document.getElementById('targetBinsContainer');
        if (!container) return;
        container.innerHTML = '';

        this.currentLevel.bins.forEach((bin) => {
            const card = document.createElement('div');
            card.className = 'bin-target-card';
            card.style.borderLeftColor = bin.color;
            const currentCount = this.sortedCounts[bin.id] ? this.sortedCounts[bin.id].length : 0;
            card.innerHTML = `
                <span class="bin-target-label" style="color:${bin.color}">${bin.label}</span>
                <span class="bin-target-count" id="count_${bin.id}">${currentCount} items</span>
            `;
            container.appendChild(card);
        });
    }

    resetPipeline() {
        sound.playClick();
        this.placedGates = new Array(this.currentLevel.maxGates).fill(null);
        this.simulationRunning = false;
        this.activeCapsules = [];
        this.sortedCounts = {};
        this.currentLevel.bins.forEach(b => this.sortedCounts[b.id] = []);
        this.renderTargetBins();
    }

    startLogicLabSim() {
        if (this.simulationRunning) return;
        sound.resume();
        sound.playClick();

        // Check if all gate slots have been configured
        const hasUnset = this.placedGates.some(g => g === null);
        if (hasUnset) {
            this.showFloatingText(this.width / 2, this.height / 2, '⚠️ INSTALL ALL GATES FIRST!', '#ef4444');
            sound.playErrorBuzz();
            return;
        }

        this.simulationRunning = true;
        this.activeCapsules = [];
        this.sortedCounts = {};
        this.currentLevel.bins.forEach(b => this.sortedCounts[b.id] = []);
        this.renderTargetBins();

        // Prepare isotope feed
        this.simIsotopesQueue = [...this.currentLevel.isotopeFeed];
        this.spawnNextSimCapsule();
    }

    spawnNextSimCapsule() {
        if (!this.simulationRunning) return;
        if (this.simIsotopesQueue.length === 0) {
            // All capsules processed, check victory condition after a brief delay
            setTimeout(() => this.evaluatePuzzleOutcome(), 1200);
            return;
        }

        const isoId = this.simIsotopesQueue.shift();
        const isotope = getIsotope(isoId);
        if (!isotope) return;

        const capsule = {
            isotope: isotope,
            x: 60,
            y: this.height * 0.45,
            targetX: 60,
            targetY: this.height * 0.45,
            progress: 0,
            currentGateIdx: 0,
            passedGates: [],
            destinationBin: null,
            speed: 3.2,
            scale: 1,
            glow: isotope.radioactive ? 1 : 0
        };

        this.activeCapsules.push(capsule);
        sound.playGeigerClick(isotope.radioactive ? 2 : 0.5);

        // Schedule next capsule spawn
        setTimeout(() => this.spawnNextSimCapsule(), 1400);
    }

    evaluatePuzzleOutcome() {
        if (!this.simulationRunning) return;
        this.simulationRunning = false;

        // Check each bin against match rules
        let allCorrect = true;
        let totalProcessed = 0;

        for (const bin of this.currentLevel.bins) {
            const items = this.sortedCounts[bin.id] || [];
            totalProcessed += items.length;
            for (const iso of items) {
                const matches = evaluateGate(iso, bin.matchRule);
                if (!matches) {
                    allCorrect = false;
                    break;
                }
            }
            if (!allCorrect) break;
        }

        if (allCorrect && totalProcessed === this.currentLevel.isotopeFeed.length) {
            // Victory!
            const usedGates = this.placedGates.filter(g => g !== null).length;
            const stars = usedGates <= this.currentLevel.optimalGates ? 3 : 2;
            this.levelStars[this.currentLevelId] = Math.max(this.levelStars[this.currentLevelId] || 0, stars);
            localStorage.setItem('isofilter_stars', JSON.stringify(this.levelStars));

            sound.playVictoryFanfare();
            this.openVictoryModal(stars);
        } else {
            sound.playErrorBuzz();
            this.showFloatingText(this.width / 2, this.height / 2, '❌ PROTOCOL FAILED - MISROUTED ISOTOPES', '#ef4444');
        }
    }

    openVictoryModal(stars) {
        const modal = document.getElementById('victoryModal');
        const starsEl = document.getElementById('victoryStars');
        const summaryEl = document.getElementById('victorySummary');

        if (starsEl) starsEl.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
        if (summaryEl) {
            summaryEl.innerHTML = `Level ${this.currentLevelId} Completed Successfully!<br>
            All <strong>${this.currentLevel.isotopeFeed.length}</strong> isotopes correctly routed through logic pipeline.`;
        }

        if (modal) modal.classList.add('open');
        this.renderLevelSelectGrid();
    }

    nextLevel() {
        this.closeModal('victoryModal');
        if (this.currentLevelId < LEVELS.length) {
            this.loadLevel(this.currentLevelId + 1);
        } else {
            this.loadLevel(1);
        }
    }

    // ==========================================
    // SORT RUSH (ARCADE MODE)
    // ==========================================

    prepareSortRush() {
        this.rushRunning = false;
        this.rushScore = 0;
        this.rushStreak = 0;
        this.rushMultiplier = 1;
        this.rushHazard = 0;
        this.rushSpeed = 2.5;
        this.rushGateManualToggle = false;
        this.activeCapsules = [];
        this.setFlowState(false);
        this.updateHUD();

        const crtDesc = document.getElementById('crtRushDesc');
        if (crtDesc) {
            crtDesc.innerHTML = `<strong>ARCADE MODE:</strong> Divert incoming isotopes into correct bins in real time! Press <strong>[SPACE]</strong> or click <strong>TOGGLE DIVERTER</strong>.<br><br>3 errors will cause a <strong>CRITICAL MELTDOWN</strong>.`;
        }
    }

    startSortRush() {
        sound.resume();
        sound.playClick();
        this.rushRunning = true;
        this.rushScore = 0;
        this.rushStreak = 0;
        this.rushMultiplier = 1;
        this.rushHazard = 0;
        this.rushSpeed = 2.6;
        this.rushSpawnTimer = 0;
        this.activeCapsules = [];
        this.particles = [];
        this.floatingTexts = [];
        this.setFlowState(false);
        this.updateHUD();

        document.getElementById('btnStartRush').textContent = 'RESTART RUSH';
        this.showFloatingText(this.width / 2, this.height / 2, '⚡ RUSH ENGAGED!', '#06b6d4');
    }

    toggleRushDiverter() {
        this.rushGateManualToggle = !this.rushGateManualToggle;
        sound.playGateClunk(this.rushGateManualToggle ? 'right' : 'left');
        const btn = document.getElementById('btnFlipGate');
        if (btn) {
            btn.textContent = this.rushGateManualToggle ? 'DIVERTER: UPPER (RADIOACTIVE)' : 'DIVERTER: LOWER (STABLE)';
        }
    }

    setFlowState(active) {
        if (this.flowState === active) return;
        this.flowState = active;
        sound.setFlowState(active);
        const tag = document.getElementById('flowStateTag');
        if (tag) tag.style.display = active ? 'flex' : 'none';
    }

    spawnRushCapsule() {
        const isotope = getRandomIsotope();
        const capsule = {
            isotope: isotope,
            x: 50,
            y: this.height * 0.5,
            progress: 0,
            speed: this.rushSpeed,
            scale: 1,
            glow: isotope.radioactive ? 1 : 0
        };
        this.activeCapsules.push(capsule);
        sound.playGeigerClick(isotope.radioactive ? 2.5 : 0.8);
    }

    handleRushSortOutcome(capsule, routedUpper) {
        // Upper bin = Radioactive (rush_a), Lower bin = Stable (rush_b)
        const isRadioactive = capsule.isotope.radioactive;
        const correct = (routedUpper && isRadioactive) || (!routedUpper && !isRadioactive);

        if (correct) {
            this.rushStreak++;
            this.maxRushStreak = Math.max(this.maxRushStreak, this.rushStreak);
            
            // Multiplier steps
            this.rushMultiplier = Math.min(8, 1 + Math.floor(this.rushStreak / 4));
            if (this.rushStreak >= 8) {
                this.setFlowState(true);
            }

            const points = 100 * this.rushMultiplier * (this.flowState ? 2 : 1);
            this.rushScore += points;

            sound.playBinAccept(this.rushStreak > 5);
            sound.playStreakChime(this.rushStreak);

            this.createSparks(capsule.x, capsule.y, isRadioactive ? '#22c55e' : '#38bdf8');
            this.showFloatingText(capsule.x, capsule.y - 20, `+${points} (${this.rushStreak}x STREAK)`, '#22c55e');

            // Slightly ramp up speed
            this.rushSpeed = Math.min(6.5, 2.6 + (this.rushScore / 2500) * 0.4);
        } else {
            // Mistake
            this.rushStreak = 0;
            this.rushMultiplier = 1;
            this.rushHazard++;
            this.setFlowState(false);

            sound.playErrorBuzz();
            this.createSparks(capsule.x, capsule.y, '#ef4444', 25);
            this.showFloatingText(capsule.x, capsule.y - 20, '⚠️ CONTAMINATION ERROR!', '#ef4444');

            if (this.rushHazard >= 3) {
                this.triggerMeltdown();
            }
        }
        this.updateHUD();
    }

    triggerMeltdown() {
        this.rushRunning = false;
        this.setFlowState(false);
        sound.playErrorBuzz();

        // Check high score
        if (this.rushScore > this.highScore) {
            this.highScore = this.rushScore;
            localStorage.setItem('isofilter_highscore', String(this.highScore));
            
            // Sync with global Arcade Firebase leaderboards if available
            if (window._$syncDataState) {
                const hash = btoa(this.highScore + "_ARCADE_SECURE");
                window._$syncDataState('isofilter', this.highScore, hash);
            }
        }

        const modal = document.getElementById('gameOverModal');
        const scoreEl = document.getElementById('gameOverScore');
        const streakEl = document.getElementById('gameOverStreak');
        const bestEl = document.getElementById('gameOverBest');

        if (scoreEl) scoreEl.textContent = this.rushScore.toLocaleString();
        if (streakEl) streakEl.textContent = `Max Streak: ×${this.maxRushStreak}`;
        if (bestEl) bestEl.textContent = `Best: ${this.highScore.toLocaleString()}`;

        if (modal) modal.classList.add('open');
    }

    // ==========================================
    // RENDERING & SIMULATION LOOP
    // ==========================================

    loop(timestamp) {
        const dt = (timestamp - this.lastFrameTime) / 1000;
        this.lastFrameTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        this.conveyorOffset = (this.conveyorOffset + 2) % 20;

        // Logic Lab Active Capsules Physics
        if (this.mode === 'logic_lab') {
            for (let i = this.activeCapsules.length - 1; i >= 0; i--) {
                const cap = this.activeCapsules[i];
                this.updateLogicLabCapsule(cap, dt);
                if (cap.progress >= 1) {
                    // Capsule reached bin
                    this.onLogicLabCapsuleArrival(cap);
                    this.activeCapsules.splice(i, 1);
                }
            }
        }

        // Sort Rush Spawning & Capsule Physics
        if (this.mode === 'sort_rush' && this.rushRunning) {
            this.rushSpawnTimer += dt;
            const spawnInterval = Math.max(1.1, 2.4 - (this.rushScore / 5000) * 0.5);
            if (this.rushSpawnTimer >= spawnInterval) {
                this.rushSpawnTimer = 0;
                this.spawnRushCapsule();
            }

            for (let i = this.activeCapsules.length - 1; i >= 0; i--) {
                const cap = this.activeCapsules[i];
                cap.x += cap.speed;

                // Diverter Gate at x = width * 0.5
                const gateX = this.width * 0.5;
                if (cap.x >= gateX - 10 && cap.x <= gateX + 10) {
                    if (!cap.routed) {
                        cap.routed = true;
                        cap.targetY = this.rushGateManualToggle ? this.height * 0.28 : this.height * 0.72;
                    }
                }

                if (cap.routed && cap.targetY !== undefined) {
                    cap.y += (cap.targetY - cap.y) * 0.1;
                }

                // Hit Bin at right edge
                if (cap.x >= this.width - 90) {
                    const routedUpper = cap.y < this.height * 0.5;
                    this.handleRushSortOutcome(cap, routedUpper);
                    this.activeCapsules.splice(i, 1);
                }
            }
        }

        // Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= dt * 1.5;
            if (p.alpha <= 0) this.particles.splice(i, 1);
        }

        // Update Floating Texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= dt * 35;
            ft.alpha -= dt * 0.8;
            if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
        }
    }

    updateLogicLabCapsule(cap, dt) {
        cap.progress += dt * 0.35;
        const gateCount = this.placedGates.length;

        if (gateCount === 1) {
            // Single gate layout: Gate 1 at x = 0.45
            const gateX = this.width * 0.45;
            const startX = 80;
            const endX = this.width - 100;

            if (cap.progress < 0.4) {
                cap.x = startX + (gateX - startX) * (cap.progress / 0.4);
                cap.y = this.height * 0.5;
            } else {
                // Evaluated at gate
                if (!cap.evaluated) {
                    cap.evaluated = true;
                    const gateConfig = this.placedGates[0]?.config;
                    cap.matches = evaluateGate(cap.isotope, gateConfig);
                    cap.destY = cap.matches ? this.height * 0.28 : this.height * 0.72;
                    cap.destinationBin = cap.matches ? this.currentLevel.bins[0] : this.currentLevel.bins[1];
                    sound.playGateClunk(cap.matches ? 'left' : 'right');
                }
                const p2 = (cap.progress - 0.4) / 0.6;
                cap.x = gateX + (endX - gateX) * p2;
                cap.y += (cap.destY - cap.y) * 0.12;
            }
        } else if (gateCount === 2) {
            // 2 Gate cascading layout: Gate 1 at x = 0.35, Gate 2 at x = 0.65
            const g1X = this.width * 0.35;
            const g2X = this.width * 0.65;
            const startX = 80;
            const endX = this.width - 100;

            if (cap.progress < 0.3) {
                cap.x = startX + (g1X - startX) * (cap.progress / 0.3);
                cap.y = this.height * 0.5;
            } else if (cap.progress < 0.6) {
                if (!cap.g1Evaluated) {
                    cap.g1Evaluated = true;
                    const matches1 = evaluateGate(cap.isotope, this.placedGates[0]?.config);
                    cap.g1Matches = matches1;
                    if (matches1) {
                        cap.destY = this.height * 0.22;
                        cap.destinationBin = this.currentLevel.bins[0];
                    } else {
                        cap.destY = this.height * 0.55;
                    }
                    sound.playGateClunk(matches1 ? 'left' : 'right');
                }
                const p = (cap.progress - 0.3) / 0.3;
                cap.x = g1X + (g2X - g1X) * p;
                cap.y += (cap.destY - cap.y) * 0.12;
            } else {
                if (!cap.g2Evaluated) {
                    cap.g2Evaluated = true;
                    if (!cap.g1Matches) {
                        const matches2 = evaluateGate(cap.isotope, this.placedGates[1]?.config);
                        cap.destY = matches2 ? this.height * 0.52 : this.height * 0.82;
                        cap.destinationBin = matches2 ? this.currentLevel.bins[1] : (this.currentLevel.bins[2] || this.currentLevel.bins[1]);
                        sound.playGateClunk(matches2 ? 'left' : 'right');
                    }
                }
                const p = (cap.progress - 0.6) / 0.4;
                cap.x = g2X + (endX - g2X) * p;
                cap.y += (cap.destY - cap.y) * 0.12;
            }
        }
    }

    onLogicLabCapsuleArrival(cap) {
        if (!cap.destinationBin) return;
        this.sortedCounts[cap.destinationBin.id].push(cap.isotope);
        
        sound.playBinAccept(false);
        this.createSparks(cap.x, cap.y, cap.destinationBin.color);
        this.renderTargetBins();
    }

    render() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // Draw dark laboratory conveyor tracks
        this.drawConveyorTracks(ctx);

        // Draw mechanical logic gates / diverters
        this.drawLogicGates(ctx);

        // Draw receptacle bins
        this.drawReceptacleBins(ctx);

        // Draw active animated capsules
        this.drawCapsules(ctx);

        // Draw particle effects
        this.drawParticles(ctx);

        // Draw floating text popups
        this.drawFloatingTexts(ctx);
    }

    drawConveyorTracks(ctx) {
        ctx.save();

        if (this.mode === 'logic_lab') {
            const gateCount = this.placedGates.length;
            if (gateCount === 1) {
                // Main feeder line
                this.drawTrackSegment(ctx, 40, this.height * 0.5, this.width * 0.45, this.height * 0.5);
                // Branch A (True) -> Upper
                this.drawTrackSegment(ctx, this.width * 0.45, this.height * 0.5, this.width - 100, this.height * 0.28);
                // Branch B (False) -> Lower
                this.drawTrackSegment(ctx, this.width * 0.45, this.height * 0.5, this.width - 100, this.height * 0.72);
            } else {
                // 2 Gates 3 Bins
                this.drawTrackSegment(ctx, 40, this.height * 0.5, this.width * 0.35, this.height * 0.5);
                this.drawTrackSegment(ctx, this.width * 0.35, this.height * 0.5, this.width - 100, this.height * 0.22);
                this.drawTrackSegment(ctx, this.width * 0.35, this.height * 0.5, this.width * 0.65, this.height * 0.55);
                this.drawTrackSegment(ctx, this.width * 0.65, this.height * 0.55, this.width - 100, this.height * 0.52);
                this.drawTrackSegment(ctx, this.width * 0.65, this.height * 0.55, this.width - 100, this.height * 0.82);
            }
        } else {
            // Sort Rush: Dual branch diverter
            this.drawTrackSegment(ctx, 40, this.height * 0.5, this.width * 0.5, this.height * 0.5);
            this.drawTrackSegment(ctx, this.width * 0.5, this.height * 0.5, this.width - 100, this.height * 0.28);
            this.drawTrackSegment(ctx, this.width * 0.5, this.height * 0.5, this.width - 100, this.height * 0.72);
        }

        ctx.restore();
    }

    drawTrackSegment(ctx, x1, y1, x2, y2) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 28;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Inner glowing rail
        ctx.strokeStyle = this.flowState ? 'rgba(34, 197, 94, 0.4)' : 'rgba(6, 182, 212, 0.25)';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Animated conveyor tread dashes
        ctx.save();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 12]);
        ctx.lineDashOffset = -this.conveyorOffset;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    drawLogicGates(ctx) {
        ctx.save();

        if (this.mode === 'logic_lab') {
            const gateCount = this.placedGates.length;
            const positions = gateCount === 1 ? [this.width * 0.45] : [this.width * 0.35, this.width * 0.65];
            const yPositions = gateCount === 1 ? [this.height * 0.5] : [this.height * 0.5, this.height * 0.55];

            positions.forEach((gx, idx) => {
                const gy = yPositions[idx];
                const gate = this.placedGates[idx];
                const isSelected = this.selectedSlotIndex === idx;

                // Gate housing
                ctx.fillStyle = isSelected ? '#1e293b' : '#0f172a';
                ctx.strokeStyle = isSelected ? '#22c55e' : '#38bdf8';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(gx - 55, gy - 36, 110, 72, 10);
                ctx.fill();
                ctx.stroke();

                // Laser scan line
                ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(gx, gy - 28);
                ctx.lineTo(gx, gy + 28);
                ctx.stroke();

                // Text inside gate
                ctx.textAlign = 'center';
                ctx.font = 'bold 11px "JetBrains Mono", monospace';
                ctx.fillStyle = '#fff';
                if (gate) {
                    ctx.fillText(gate.label, gx, gy - 6);
                    ctx.fillStyle = '#38bdf8';
                    ctx.font = '9px "JetBrains Mono", monospace';
                    ctx.fillText(formatGateLabel(gate.config), gx, gy + 12);
                } else {
                    ctx.fillStyle = '#64748b';
                    ctx.fillText(`[GATE SLOT ${idx + 1}]`, gx, gy - 4);
                    ctx.fillStyle = '#22c55e';
                    ctx.font = '9px "JetBrains Mono", monospace';
                    ctx.fillText('CLICK TO SET', gx, gy + 14);
                }
            });
        } else {
            // Sort Rush Gate
            const gx = this.width * 0.5;
            const gy = this.height * 0.5;
            
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = this.rushGateManualToggle ? '#ef4444' : '#10b981';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(gx - 60, gy - 40, 120, 80, 12);
            ctx.fill();
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.fillStyle = '#fff';
            ctx.fillText('ACTIVE DIVERTER', gx, gy - 12);
            
            ctx.fillStyle = this.rushGateManualToggle ? '#ef4444' : '#10b981';
            ctx.font = 'bold 10px "JetBrains Mono", monospace';
            ctx.fillText(this.rushGateManualToggle ? 'UPPER: ☢️ HAZARD' : 'LOWER: 🛡️ STABLE', gx, gy + 10);
            
            ctx.fillStyle = '#64748b';
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillText('[SPACE] TO FLIP', gx, gy + 26);
        }

        ctx.restore();
    }

    drawReceptacleBins(ctx) {
        ctx.save();
        const bins = this.mode === 'logic_lab' ? this.currentLevel.bins : this.rushBins;

        bins.forEach((bin, idx) => {
            let bx = this.width - 80;
            let by = this.height * 0.5;

            if (bins.length === 2) {
                by = idx === 0 ? this.height * 0.28 : this.height * 0.72;
            } else if (bins.length === 3) {
                if (idx === 0) by = this.height * 0.22;
                else if (idx === 1) by = this.height * 0.52;
                else by = this.height * 0.82;
            }

            // Receptacle bin canister
            ctx.fillStyle = '#0d131f';
            ctx.strokeStyle = bin.color || '#38bdf8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(bx - 35, by - 28, 70, 56, 8);
            ctx.fill();
            ctx.stroke();

            // Label
            ctx.textAlign = 'center';
            ctx.font = 'bold 10px "JetBrains Mono", monospace';
            ctx.fillStyle = bin.color || '#fff';
            ctx.fillText(bin.label.split(':')[0] || 'BIN', bx, by - 6);

            // Item count badge
            const count = this.sortedCounts[bin.id] ? this.sortedCounts[bin.id].length : 0;
            ctx.font = 'bold 12px "JetBrains Mono", monospace';
            ctx.fillStyle = '#fff';
            ctx.fillText(this.mode === 'logic_lab' ? `${count} ISO` : (idx === 0 ? '☢️' : '🛡️'), bx, by + 14);
        });

        ctx.restore();
    }

    drawCapsules(ctx) {
        ctx.save();

        this.activeCapsules.forEach((cap) => {
            const iso = cap.isotope;
            const x = cap.x;
            const y = cap.y;

            // Radiation glow
            if (iso.radioactive) {
                const grad = ctx.createRadialGradient(x, y, 5, x, y, 26);
                grad.addColorStop(0, `${iso.color}88`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, 26, 0, Math.PI * 2);
                ctx.fill();
            }

            // Outer capsule metal shell
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = iso.color || '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(x, y, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Inner isotope symbol
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(iso.id, x, y - 1);
        });

        ctx.restore();
    }

    drawParticles(ctx) {
        ctx.save();
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    drawFloatingTexts(ctx) {
        ctx.save();
        this.floatingTexts.forEach(ft => {
            ctx.font = 'bold 13px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = ft.color;
            ctx.globalAlpha = Math.max(0, ft.alpha);
            ctx.fillText(ft.text, ft.x, ft.y);
        });
        ctx.restore();
    }

    createSparks(x, y, color = '#22c55e', count = 16) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 1.5 + Math.random() * 2.5,
                color,
                alpha: 1
            });
        }
    }

    showFloatingText(x, y, text, color = '#fff') {
        this.floatingTexts.push({ x, y, text, color, alpha: 1.2 });
    }

    handleCanvasClick(x, y) {
        if (this.mode === 'logic_lab') {
            const gateCount = this.placedGates.length;
            const positions = gateCount === 1 ? [this.width * 0.45] : [this.width * 0.35, this.width * 0.65];
            const yPositions = gateCount === 1 ? [this.height * 0.5] : [this.height * 0.5, this.height * 0.55];

            positions.forEach((gx, idx) => {
                const gy = yPositions[idx];
                if (Math.abs(x - gx) < 55 && Math.abs(y - gy) < 36) {
                    sound.playClick();
                    this.selectedSlotIndex = idx;
                    if (this.selectedPaletteGate) {
                        this.placedGates[idx] = this.selectedPaletteGate;
                        sound.playGateClunk('left');
                    }
                }
            });
        } else if (this.mode === 'sort_rush') {
            const gx = this.width * 0.5;
            const gy = this.height * 0.5;
            if (Math.abs(x - gx) < 60 && Math.abs(y - gy) < 40) {
                this.toggleRushDiverter();
            }
        }
    }

    updateHUD() {
        if (this.mode === 'logic_lab') {
            document.getElementById('hudLevelNum').textContent = `PROTOCOL 0${this.currentLevelId}`;
            const stars = this.levelStars[this.currentLevelId] || 0;
            document.getElementById('hudScoreVal').textContent = '⭐'.repeat(stars) || 'UNSOLVED';
            document.getElementById('hudStreakVal').textContent = `MAX GATES: ${this.currentLevel.maxGates}`;
        } else {
            document.getElementById('hudLevelNum').textContent = '⚡ SORT RUSH';
            document.getElementById('hudScoreVal').textContent = this.rushScore.toLocaleString();
            document.getElementById('hudStreakVal').textContent = `×${this.rushStreak} (MAX ×${this.maxRushStreak})`;
        }
    }

    // ==========================================
    // CODEX & LEVEL SELECT MODALS
    // ==========================================

    populateCodex() {
        const grid = document.getElementById('codexGrid');
        if (!grid) return;
        grid.innerHTML = '';

        ISOTOPES.forEach(iso => {
            const card = document.createElement('div');
            card.className = 'isotope-codex-card';
            card.style.borderLeft = `3px solid ${iso.color}`;
            card.innerHTML = `
                <div class="isotope-card-head">
                    <span class="iso-sym" style="color:${iso.color}">${iso.id}</span>
                    <span style="font-size:0.75rem;">${iso.icon} ${iso.element}</span>
                </div>
                <div class="iso-prop-row"><span>Mass Number:</span> <strong>${iso.mass} amu</strong></div>
                <div class="iso-prop-row"><span>Atomic Number (Z):</span> <strong>${iso.atomicNumber}</strong></div>
                <div class="iso-prop-row"><span>Classification:</span> <strong>${iso.category}</strong></div>
                <div class="iso-prop-row"><span>Half-Life:</span> <strong>${iso.halfLifeDisplay}</strong></div>
                <div class="iso-prop-row"><span>Decay Mode:</span> <strong>${iso.decayMode}</strong></div>
                <div class="iso-prop-row"><span>Fissile Fuel:</span> <strong>${iso.fissile ? 'YES ⚡' : 'NO'}</strong></div>
                <p class="iso-desc">${iso.desc}</p>
            `;
            grid.appendChild(card);
        });
    }

    renderLevelSelectGrid() {
        const grid = document.getElementById('levelSelectGrid');
        if (!grid) return;
        grid.innerHTML = '';

        LEVELS.forEach(lvl => {
            const card = document.createElement('div');
            const isCurrent = lvl.id === this.currentLevelId;
            const stars = this.levelStars[lvl.id] || 0;
            card.className = `level-card ${isCurrent ? 'current' : ''}`;
            card.innerHTML = `
                <span class="level-number">${lvl.id}</span>
                <span style="font-size:0.68rem; color:#94a3b8; font-family:var(--font-mono);">${lvl.title.split(':')[1] || lvl.title}</span>
                <span class="level-stars">${stars > 0 ? '⭐'.repeat(stars) : '☆☆☆'}</span>
            `;
            card.addEventListener('click', () => {
                sound.playClick();
                this.closeModal('levelsModal');
                this.setMode('logic_lab');
                this.loadLevel(lvl.id);
            });
            grid.appendChild(card);
        });
    }

    openModal(modalId) {
        sound.playClick();
        document.getElementById(modalId)?.classList.add('open');
    }

    closeModal(modalId) {
        sound.playClick();
        document.getElementById(modalId)?.classList.remove('open');
    }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new IsoFilterEngine();
});
