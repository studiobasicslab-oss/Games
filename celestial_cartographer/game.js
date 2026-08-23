/**
 * Master Game Controller for The Celestial Cartographer
 * Coordinates Journey Mode, Daily Stargaze, Time Attack Sky Relay,
 * Interactive Planetarium Sandbox, Pointer Star Navigation, and Codex Lore.
 */

import { CONSTELLATIONS, CHAPTERS, DAILY_CHALLENGES, SPECTRAL_COLORS, DEEP_SKY_OBJECTS } from './stars_data.js';
import { CelestialAudioEngine } from './audio_engine.js';
import { CelestialEngine } from './celestial_engine.js';

class CelestialCartographerGame {
    constructor() {
        this.audio = new CelestialAudioEngine();
        this.canvas = document.getElementById('sky-canvas');
        this.engine = new CelestialEngine(this.canvas, {
            onStarClick: (star) => this.handleStarClick(star),
            onStarConnect: (s1, s2) => this.handleStarConnect(s1, s2)
        });

        // Game State
        this.currentMode = 'journey'; // 'journey' | 'daily' | 'relay' | 'planetarium'
        this.currentChapterIndex = 0;
        this.currentConstellationIndex = 0;
        this.completedConstellations = new Set();
        this.userCustomLines = [];

        // Time Attack / Relay State
        this.relayTimer = null;
        this.relayTimeRemaining = 60.0;
        this.relayScore = 0;
        this.relayStreak = 0;
        this.relayTargetConstellation = null;

        // Daily Challenge State
        this.dailyTimer = null;
        this.dailyTimeRemaining = 90.0;

        // UI Element References
        this.initDOMReferences();
        this.initEventListeners();

        // Load saved progress
        this.loadProgress();

        // Start engine loop
        this.engine.setConstellations(CONSTELLATIONS);
        this.loadChapter(this.currentChapterIndex);
        this.startRenderLoop();
    }

    initDOMReferences() {
        // Mode Selector Pills
        this.modeBtnJourney = document.getElementById('mode-btn-journey');
        this.modeBtnDaily = document.getElementById('mode-btn-daily');
        this.modeBtnRelay = document.getElementById('mode-btn-relay');
        this.modeBtnPlanetarium = document.getElementById('mode-btn-planetarium');

        // Header & HUD
        this.headerChapterLabel = document.getElementById('header-chapter-label');
        this.starCounter = document.getElementById('star-counter');
        this.soundToggleBtn = document.getElementById('sound-toggle-btn');
        this.soundIconOn = document.getElementById('sound-icon-on');
        this.soundIconOff = document.getElementById('sound-icon-off');
        this.codexBtn = document.getElementById('codex-btn');
        this.chaptersBtn = document.getElementById('chapters-btn');

        // Wayfinding Banner
        this.wayfindingBanner = document.getElementById('wayfinding-banner');
        this.chapterEraText = document.getElementById('chapter-era-text');
        this.targetConstellationTitle = document.getElementById('target-constellation-title');
        this.targetObjectiveText = document.getElementById('target-objective-text');
        this.chapterStepper = document.getElementById('chapter-stepper');

        // Astrolabe & Pointer Pill
        this.astrolabeWidget = document.getElementById('astrolabe-widget');
        this.azimuthSlider = document.getElementById('azimuth-slider');
        this.azimuthVal = document.getElementById('azimuth-val');
        this.celestialCoordsText = document.getElementById('celestial-coords-text');
        this.pointerGuidancePill = document.getElementById('pointer-guidance-pill');
        this.pointerInstructionText = document.getElementById('pointer-instruction-text');
        this.pointerAlignBtn = document.getElementById('pointer-align-btn');

        // Tools Palette
        this.btnToggleArtwork = document.getElementById('btn-toggle-artwork');
        this.btnToggleLabels = document.getElementById('btn-toggle-labels');
        this.btnToggleColors = document.getElementById('btn-toggle-colors');
        this.btnToggleParallax = document.getElementById('btn-toggle-parallax');
        this.btnToggleDSO = document.getElementById('btn-toggle-dso');

        // Time Attack HUD
        this.timerHud = document.getElementById('timer-hud');
        this.timerVal = document.getElementById('timer-val');
        this.relayScoreElem = document.getElementById('relay-score');
        this.relayMultiplierElem = document.getElementById('relay-multiplier');

        // Sandbox Toolbar
        this.sandboxToolbar = document.getElementById('sandbox-toolbar');
        this.sandboxClearBtn = document.getElementById('sandbox-clear-btn');
        this.sandboxSaveBtn = document.getElementById('sandbox-save-btn');

        // Toast & Modals
        this.celebrationToast = document.getElementById('celebration-toast');
        this.toastTitle = document.getElementById('toast-title');
        this.toastSubtitle = document.getElementById('toast-subtitle');

        this.codexModal = document.getElementById('codex-modal');
        this.closeCodexBtn = document.getElementById('close-codex-btn');
        this.codexCultureTabs = document.getElementById('codex-culture-tabs');
        this.codexLoreText = document.getElementById('codex-lore-text');
        this.codexStarTbody = document.getElementById('codex-star-tbody');

        this.chaptersModal = document.getElementById('chapters-modal');
        this.closeChaptersBtn = document.getElementById('close-chapters-btn');
        this.chaptersContainer = document.getElementById('chapters-container');

        this.dailyModal = document.getElementById('daily-modal');
        this.closeDailyBtn = document.getElementById('close-daily-btn');
        this.dailyTitle = document.getElementById('daily-title');
        this.dailyDateLabel = document.getElementById('daily-date-label');
        this.dailyFlavorText = document.getElementById('daily-flavor-text');
        this.startDailyChallengeBtn = document.getElementById('start-daily-challenge-btn');

        this.victoryModal = document.getElementById('victory-modal');
        this.closeVictoryBtn = document.getElementById('close-victory-btn');
        this.victoryTitle = document.getElementById('victory-title');
        this.victorySubtitle = document.getElementById('victory-subtitle');
        this.victoryBadgeIcon = document.getElementById('victory-badge-icon');
        this.victoryBadgeTitle = document.getElementById('victory-badge-title');
        this.victoryBadgeDesc = document.getElementById('victory-badge-desc');
        this.nextChapterBtn = document.getElementById('next-chapter-btn');
        this.replayChapterBtn = document.getElementById('replay-chapter-btn');

        this.relayOverModal = document.getElementById('relay-over-modal');
        this.closeRelayBtn = document.getElementById('close-relay-btn');
        this.relayFinalScore = document.getElementById('relay-final-score');
        this.relayFinalCount = document.getElementById('relay-final-count');
        this.relayFinalStreak = document.getElementById('relay-final-streak');
        this.relayRetryBtn = document.getElementById('relay-retry-btn');
        this.relayViewLeaderboardBtn = document.getElementById('relay-view-leaderboard-btn');
    }

    initEventListeners() {
        // Mode Switchers
        this.modeBtnJourney.addEventListener('click', () => this.switchMode('journey'));
        this.modeBtnDaily.addEventListener('click', () => this.switchMode('daily'));
        this.modeBtnRelay.addEventListener('click', () => this.switchMode('relay'));
        this.modeBtnPlanetarium.addEventListener('click', () => this.switchMode('planetarium'));

        // Sound Toggle
        this.soundToggleBtn.addEventListener('click', () => {
            const isEnabled = this.audio.toggleSound();
            this.soundIconOn.classList.toggle('hidden', !isEnabled);
            this.soundIconOff.classList.toggle('hidden', isEnabled);
        });

        // Azimuth Astrolabe Slider
        this.azimuthSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            this.azimuthVal.textContent = `${val}°`;
            this.engine.rotationAngle = val;
            this.audio.playAstrolabeClick();
        });

        // Pointer Alignment Ray Button
        this.pointerAlignBtn.addEventListener('click', () => this.triggerPointerStarAlignment());

        // Visual Toggles
        this.btnToggleArtwork.addEventListener('click', () => {
            this.engine.showArtwork = !this.engine.showArtwork;
            this.btnToggleArtwork.classList.toggle('active', this.engine.showArtwork);
            this.audio.playAstrolabeClick();
        });

        this.btnToggleLabels.addEventListener('click', () => {
            this.engine.showLabels = !this.engine.showLabels;
            this.btnToggleLabels.classList.toggle('active', this.engine.showLabels);
            this.audio.playAstrolabeClick();
        });

        this.btnToggleColors.addEventListener('click', () => {
            this.engine.showSpectralColors = !this.engine.showSpectralColors;
            this.btnToggleColors.classList.toggle('active', this.engine.showSpectralColors);
            this.audio.playAstrolabeClick();
        });

        this.btnToggleParallax.addEventListener('click', () => {
            this.engine.showLightYearParallax = !this.engine.showLightYearParallax;
            this.btnToggleParallax.classList.toggle('active', this.engine.showLightYearParallax);
            this.audio.playAstrolabeClick();
        });

        this.btnToggleDSO.addEventListener('click', () => {
            this.engine.showDeepSky = !this.engine.showDeepSky;
            this.btnToggleDSO.classList.toggle('active', this.engine.showDeepSky);
            this.audio.playAstrolabeClick();
        });

        // Codex Modal Listeners
        this.codexBtn.addEventListener('click', () => this.openCodexModal());
        this.closeCodexBtn.addEventListener('click', () => this.codexModal.classList.remove('active'));
        this.codexCultureTabs.querySelectorAll('.lore-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.codexCultureTabs.querySelectorAll('.lore-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderCodexCultureLore(btn.dataset.culture);
            });
        });

        // Chapters Modal Listeners
        this.chaptersBtn.addEventListener('click', () => this.openChaptersModal());
        this.closeChaptersBtn.addEventListener('click', () => this.chaptersModal.classList.remove('active'));

        // Daily Challenge Listeners
        this.closeDailyBtn.addEventListener('click', () => this.dailyModal.classList.remove('active'));
        this.startDailyChallengeBtn.addEventListener('click', () => {
            this.dailyModal.classList.remove('active');
            this.startDailyStargazeChallenge();
        });

        // Victory Modal Listeners
        this.closeVictoryBtn.addEventListener('click', () => this.victoryModal.classList.remove('active'));
        this.nextChapterBtn.addEventListener('click', () => {
            this.victoryModal.classList.remove('active');
            this.currentChapterIndex = (this.currentChapterIndex + 1) % CHAPTERS.length;
            this.loadChapter(this.currentChapterIndex);
        });
        this.replayChapterBtn.addEventListener('click', () => {
            this.victoryModal.classList.remove('active');
            this.loadChapter(this.currentChapterIndex);
        });

        // Time Attack / Relay Modal Listeners
        this.closeRelayBtn.addEventListener('click', () => this.relayOverModal.classList.remove('active'));
        this.relayRetryBtn.addEventListener('click', () => {
            this.relayOverModal.classList.remove('active');
            this.startSkyRelay();
        });
        this.relayViewLeaderboardBtn.addEventListener('click', () => {
            window.location.href = '../leaderboard.html';
        });

        // Sandbox Custom Line Tools
        this.sandboxClearBtn.addEventListener('click', () => {
            this.engine.customLines = [];
            this.audio.playAstrolabeClick();
        });

        this.sandboxSaveBtn.addEventListener('click', () => {
            const name = prompt('Name your custom asterism:', 'The Celestial Voyager');
            if (name && this.engine.customLines.length > 0) {
                alert(`✨ Asterism "${name}" saved to your celestial atlas!`);
            }
        });
    }

    // =========================================================================
    // PROGRESSION & CHAPTER MANAGEMENT (JOURNEY MODE)
    // =========================================================================

    loadChapter(chapIdx) {
        this.currentChapterIndex = chapIdx;
        const chapter = CHAPTERS[chapIdx];
        this.currentConstellationIndex = 0;

        this.headerChapterLabel.textContent = `Chapter ${chapter.number}`;
        this.chapterEraText.textContent = `ERA: ${chapter.era.toUpperCase()}`;

        // Build Chapter Stepper Dots
        this.chapterStepper.innerHTML = '';
        chapter.constellations.forEach((cId, idx) => {
            const dot = document.createElement('div');
            dot.className = `step-dot ${idx === 0 ? 'active' : ''} ${this.completedConstellations.has(cId) ? 'completed' : ''}`;
            dot.id = `stepper-dot-${idx}`;
            this.chapterStepper.appendChild(dot);
        });

        this.loadConstellationInChapter(0);
    }

    loadConstellationInChapter(constellationIdx) {
        const chapter = CHAPTERS[this.currentChapterIndex];
        if (constellationIdx >= chapter.constellations.length) {
            this.triggerChapterVictory(chapter);
            return;
        }

        this.currentConstellationIndex = constellationIdx;
        const targetCId = chapter.constellations[constellationIdx];
        const constellation = CONSTELLATIONS.find(c => c.id === targetCId);

        if (!constellation) return;

        // Focus camera on constellation
        this.engine.focusOnConstellation(constellation.id);
        this.engine.pointerLocked = false;

        // Update HUD
        this.targetConstellationTitle.textContent = `${constellation.name} — ${constellation.title}`;
        this.targetObjectiveText.textContent = `Connect the glowing anchor stars of ${constellation.name} to illuminate the constellation.`;

        // Update Stepper
        this.chapterStepper.querySelectorAll('.step-dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === constellationIdx);
        });

        // Update Pointer Guidance Pill
        if (constellation.pointerGuide) {
            this.pointerGuidancePill.style.display = 'flex';
            this.pointerInstructionText.innerHTML = `<strong>Wayfinding Guide:</strong> ${constellation.pointerGuide.instruction}`;
        } else {
            this.pointerGuidancePill.style.display = 'none';
        }

        this.updateStarCounter();
    }

    // Handle Star Clicks & Connection Attempt
    handleStarClick(star) {
        this.audio.playStarChime(1);
    }

    handleStarConnect(star1, star2) {
        const edgeKey = this.engine.getEdgeKey(star1.id, star2.id);

        if (this.currentMode === 'planetarium') {
            // Add custom line in sandbox
            const p1 = this.engine.projectToScreen(star1.ra, star1.dec);
            const p2 = this.engine.projectToScreen(star2.ra, star2.dec);
            this.engine.customLines.push([p1, p2]);
            this.audio.playStarChime(this.engine.customLines.length);
            return;
        }

        // Validate if this connection belongs to the active target constellation
        const activeC = this.engine.activeConstellation;
        if (!activeC) return;

        const isValidLine = activeC.lines.some(([id1, id2]) => {
            return this.engine.getEdgeKey(id1, id2) === edgeKey;
        });

        if (isValidLine) {
            this.engine.connectedEdges.add(edgeKey);
            const connectedCountInConstellation = activeC.lines.filter(([id1, id2]) => {
                return this.engine.connectedEdges.has(this.engine.getEdgeKey(id1, id2));
            }).length;

            this.audio.playStarChime(connectedCountInConstellation);

            // Stardust particle burst
            const pt = this.engine.projectToScreen(star2.ra, star2.dec);
            this.engine.spawnStarConnectionParticles(pt.x, pt.y);

            // Check if constellation is fully completed
            if (this.engine.isConstellationCompleted(activeC)) {
                this.onConstellationCompleted(activeC);
            }
        } else {
            // Not a valid link
            this.audio.playErrorTone();
        }
    }

    onConstellationCompleted(constellation) {
        this.completedConstellations.add(constellation.id);
        this.saveProgress();
        this.audio.playConstellationComplete();
        this.updateStarCounter();

        // Celebration Toast
        this.showToast(`✨ ${constellation.name.toUpperCase()} CHARTED!`, `${constellation.title} is now illuminated across the cosmos.`);

        if (this.currentMode === 'relay') {
            this.relayScore += 150 * (1 + this.relayStreak * 0.2);
            this.relayStreak++;
            this.relayScoreElem.textContent = Math.floor(this.relayScore);
            this.relayMultiplierElem.textContent = `${(1 + this.relayStreak * 0.2).toFixed(1)}x MULTIPLIER`;
            setTimeout(() => this.pickNextRelayTarget(), 1200);
            return;
        }

        if (this.currentMode === 'daily') {
            this.stopDailyTimer();
            setTimeout(() => {
                alert(`🌟 Brilliant Navigation! You charted ${constellation.name} in ${(90 - this.dailyTimeRemaining).toFixed(1)}s!`);
                this.switchMode('journey');
            }, 1000);
            return;
        }

        // In Journey Mode, proceed to next constellation or trigger pointer alignment
        setTimeout(() => {
            this.loadConstellationInChapter(this.currentConstellationIndex + 1);
        }, 2200);
    }

    triggerPointerStarAlignment() {
        const activeC = this.engine.activeConstellation;
        if (!activeC || !activeC.pointerGuide) return;

        this.engine.pointerLocked = true;
        this.audio.playPointerLock();
        const targetStar = this.engine.allStars.find(s => s.id === activeC.pointerGuide.target);

        if (targetStar) {
            this.showToast(`🧭 COMPASS LOCKED!`, `Aligned with ${targetStar.name} (${targetStar.bayer}) at magnitude ${targetStar.mag.toFixed(2)}.`);
        }
    }

    triggerChapterVictory(chapter) {
        this.victoryTitle.textContent = `${chapter.title.toUpperCase()} RESTORED`;
        this.victorySubtitle = `${chapter.era}`;
        this.victoryBadgeTitle.textContent = chapter.rewardBadge;
        this.victoryBadgeDesc.textContent = chapter.storyIntro;
        this.victoryModal.classList.add('active');
        this.audio.playConstellationComplete();
    }

    // =========================================================================
    // GAME MODES (DAILY, TIME ATTACK RELAY, PLANETARIUM)
    // =========================================================================

    switchMode(mode) {
        this.currentMode = mode;
        this.stopRelayTimer();
        this.stopDailyTimer();

        // Update mode pill UI
        [this.modeBtnJourney, this.modeBtnDaily, this.modeBtnRelay, this.modeBtnPlanetarium].forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Toggle UI widgets based on mode
        this.wayfindingBanner.style.display = (mode === 'journey' || mode === 'daily') ? 'flex' : 'none';
        this.pointerGuidancePill.style.display = (mode === 'journey') ? 'flex' : 'none';
        this.timerHud.style.display = (mode === 'relay' || mode === 'daily') ? 'flex' : 'none';
        this.sandboxToolbar.style.display = (mode === 'planetarium') ? 'flex' : 'none';

        if (mode === 'journey') {
            this.loadChapter(this.currentChapterIndex);
        } else if (mode === 'daily') {
            this.openDailyModal();
        } else if (mode === 'relay') {
            this.startSkyRelay();
        } else if (mode === 'planetarium') {
            this.engine.showArtworkInPlanetarium = true;
            this.showToast('🪐 PLANETARIUM SANDBOX', 'Free-roam celestial dome. Drag to pan, scroll to zoom, toggle layers.');
        }

        this.audio.playAstrolabeClick();
    }

    // 1. Daily Stargaze Challenge
    openDailyModal() {
        const today = new Date();
        const daily = DAILY_CHALLENGES[today.getDate() % DAILY_CHALLENGES.length];
        this.dailyTitle.textContent = daily.title;
        this.dailyDateLabel.textContent = `Today: ${today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}`;
        this.dailyFlavorText.textContent = `${daily.flavor} [Hemisphere: ${daily.hemisphere}]`;
        this.dailyModal.classList.add('active');
    }

    startDailyStargazeChallenge() {
        const today = new Date();
        const daily = DAILY_CHALLENGES[today.getDate() % DAILY_CHALLENGES.length];
        const targetC = CONSTELLATIONS.find(c => c.id === daily.targetId);

        if (!targetC) return;
        this.engine.focusOnConstellation(targetC.id);

        this.targetConstellationTitle.textContent = `DAILY TARGET: ${targetC.name}`;
        this.targetObjectiveText.textContent = daily.flavor;

        this.dailyTimeRemaining = daily.timeLimitSec;
        this.timerVal.textContent = `${this.dailyTimeRemaining.toFixed(1)}s`;
        this.timerVal.classList.remove('warning');

        this.dailyTimer = setInterval(() => {
            this.dailyTimeRemaining -= 0.1;
            this.timerVal.textContent = `${Math.max(0, this.dailyTimeRemaining).toFixed(1)}s`;

            if (this.dailyTimeRemaining <= 15) {
                this.timerVal.classList.add('warning');
            }

            if (this.dailyTimeRemaining <= 0) {
                this.stopDailyTimer();
                alert(`⏳ Time expired for today's challenge! Try again anytime.`);
                this.switchMode('journey');
            }
        }, 100);
    }

    stopDailyTimer() {
        if (this.dailyTimer) {
            clearInterval(this.dailyTimer);
            this.dailyTimer = null;
        }
    }

    // 2. Time Attack / Sky Relay (60s Blitz)
    startSkyRelay() {
        this.relayTimeRemaining = 60.0;
        this.relayScore = 0;
        this.relayStreak = 0;
        this.relayScoreElem.textContent = '0';
        this.relayMultiplierElem.textContent = '1.0x MULTIPLIER';
        this.timerVal.classList.remove('warning');

        this.pickNextRelayTarget();

        this.relayTimer = setInterval(() => {
            this.relayTimeRemaining -= 0.1;
            this.timerVal.textContent = `${Math.max(0, this.relayTimeRemaining).toFixed(1)}s`;

            if (this.relayTimeRemaining <= 10) {
                this.timerVal.classList.add('warning');
            }

            if (this.relayTimeRemaining <= 0) {
                this.endSkyRelay();
            }
        }, 100);
    }

    pickNextRelayTarget() {
        const randC = CONSTELLATIONS[Math.floor(Math.random() * CONSTELLATIONS.length)];
        this.relayTargetConstellation = randC;
        this.engine.focusOnConstellation(randC.id);
        this.showToast(`TARGET: ${randC.name.toUpperCase()}`, `Connect ${randC.lines.length} anchor lines!`);
    }

    endSkyRelay() {
        this.stopRelayTimer();
        this.relayFinalScore.textContent = Math.floor(this.relayScore);
        this.relayFinalCount.textContent = `${this.relayStreak} Constellations`;
        this.relayFinalStreak.textContent = `${(1 + this.relayStreak * 0.2).toFixed(1)}x`;
        this.relayOverModal.classList.add('active');

        // Save Score
        this.saveRelayScore(Math.floor(this.relayScore));
    }

    stopRelayTimer() {
        if (this.relayTimer) {
            clearInterval(this.relayTimer);
            this.relayTimer = null;
        }
    }

    // =========================================================================
    // LORE CODEX & STAR CATALOG MODAL
    // =========================================================================

    openCodexModal() {
        const activeC = this.engine.activeConstellation || CONSTELLATIONS[0];
        document.getElementById('codex-modal-title').textContent = `${activeC.name} — Lore Codex`;
        document.getElementById('codex-modal-subtitle').textContent = activeC.description;

        this.renderCodexCultureLore('greek');
        this.renderCodexStarTable(activeC);
        this.codexModal.classList.add('active');
        this.audio.playAstrolabeClick();
    }

    renderCodexCultureLore(cultureKey) {
        const activeC = this.engine.activeConstellation || CONSTELLATIONS[0];
        const lore = activeC.lore[cultureKey] || 'Ancient records for this civilization are being cataloged by the expedition.';
        this.codexLoreText.innerHTML = `<strong>${cultureKey.toUpperCase()} ASTRONOMY & TRADITION:</strong><br><br>${lore}`;
    }

    renderCodexStarTable(constellation) {
        this.codexStarTbody.innerHTML = '';
        constellation.stars.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 600; color: ${SPECTRAL_COLORS[s.spec] || '#ffffff'};">${s.name}</td>
                <td style="font-family: var(--font-mono); color: var(--gold-brass);">${s.bayer}</td>
                <td><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${SPECTRAL_COLORS[s.spec]}; margin-right: 4px;"></span> Class ${s.spec}</td>
                <td style="font-family: var(--font-mono);">${s.mag.toFixed(2)}</td>
                <td style="font-family: var(--font-mono);">${s.distLy} ly</td>
                <td style="font-size: 0.8rem; color: #94a3b8;">${s.desc}</td>
            `;
            this.codexStarTbody.appendChild(tr);
        });
    }

    // Chapters Selector Modal
    openChaptersModal() {
        this.chaptersContainer.innerHTML = '';
        CHAPTERS.forEach((ch, idx) => {
            const isCurrent = idx === this.currentChapterIndex;
            const isCompleted = ch.constellations.every(cId => this.completedConstellations.has(cId));

            const card = document.createElement('div');
            card.className = `chapter-card ${isCompleted ? 'completed' : ''}`;
            card.innerHTML = `
                <div class="card-top-row">
                    <span class="chapter-badge-era">${ch.era}</span>
                    <span>${isCompleted ? '✅ Complete' : (isCurrent ? '⭐ Active' : '🔒 Available')}</span>
                </div>
                <div class="chapter-card-title">Chapter ${ch.number}: ${ch.title}</div>
                <div class="chapter-card-desc">${ch.subtitle}</div>
                <div style="font-size: 0.75rem; color: var(--gold-brass); margin-top: 0.25rem;">Reward: ${ch.rewardBadge}</div>
            `;
            card.addEventListener('click', () => {
                this.loadChapter(idx);
                this.chaptersModal.classList.remove('active');
            });
            this.chaptersContainer.appendChild(card);
        });
        this.chaptersModal.classList.add('active');
        this.audio.playAstrolabeClick();
    }

    // =========================================================================
    // UI TOASTS & PERSISTENCE
    // =========================================================================

    showToast(title, sub) {
        this.toastTitle.textContent = title;
        this.toastSubtitle.textContent = sub;
        this.celebrationToast.classList.add('show');
        setTimeout(() => {
            this.celebrationToast.classList.remove('show');
        }, 3400);
    }

    updateStarCounter() {
        this.starCounter.textContent = `${this.completedConstellations.size} / ${CONSTELLATIONS.length}`;
    }

    saveProgress() {
        try {
            localStorage.setItem('celestial_completed_constellations', JSON.stringify(Array.from(this.completedConstellations)));
        } catch (e) {}
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('celestial_completed_constellations');
            if (saved) {
                const arr = JSON.parse(saved);
                this.completedConstellations = new Set(arr);
                // Pre-populate connected edges for completed constellations
                CONSTELLATIONS.forEach(c => {
                    if (this.completedConstellations.has(c.id)) {
                        c.lines.forEach(([id1, id2]) => {
                            this.engine.connectedEdges.add(this.engine.getEdgeKey(id1, id2));
                        });
                    }
                });
            }
        } catch (e) {}
    }

    async saveRelayScore(score) {
        try {
            localStorage.setItem('celestial_best_relay_score', Math.max(score, parseInt(localStorage.getItem('celestial_best_relay_score') || '0', 10)));
            // Dynamic import of firebase setup if available
            const fb = await import('../firebase_setup.js');
            if (fb && fb.auth && fb.auth.currentUser) {
                const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                await addDoc(collection(fb.db, 'scores'), {
                    userId: fb.auth.currentUser.uid,
                    username: fb.auth.currentUser.displayName || 'Stargazer',
                    game: 'Celestial Cartographer',
                    score: score,
                    timestamp: serverTimestamp()
                });
            }
        } catch (e) {}
    }

    startRenderLoop() {
        const loop = () => {
            this.engine.render();
            // Update live RA/Dec coordinates in astrolabe HUD
            if (this.celestialCoordsText) {
                this.celestialCoordsText.textContent = `RA ${this.engine.viewCenterRA.toFixed(1)}h | ${this.engine.viewCenterDec >= 0 ? '+' : ''}${this.engine.viewCenterDec.toFixed(0)}°`;
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

// Instantiate game on window load
window.addEventListener('DOMContentLoaded', () => {
    window.game = new CelestialCartographerGame();
});
