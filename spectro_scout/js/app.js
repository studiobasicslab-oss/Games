/**
 * SPECTRO-SCOUT: Main UI Application Controller
 * Manages Doppler slider, chemical overlay buttons, telemetry HUD, and discovery results.
 */

document.addEventListener('DOMContentLoaded', () => {
    const engine = window.spectroEngine;
    const audio = window.spectroAudio;
    const data = window.SPECTRO_DATA;

    let currentTargetIndex = 0;
    let score = parseInt(localStorage.getItem('spectro_score') || '0', 10);
    let solvedTargets = JSON.parse(localStorage.getItem('spectro_solved') || '[]');

    // DOM Elements
    const canvas = document.getElementById('spectro-canvas');
    const targetListEl = document.getElementById('target-list');

    // Telemetry Displays
    const hudScore = document.getElementById('hud-score');
    const hudSolved = document.getElementById('hud-solved');
    const starNameEl = document.getElementById('star-name');
    const planetNameEl = document.getElementById('planet-name');
    const systemBadgeEl = document.getElementById('system-badge');
    const systemDistanceEl = document.getElementById('system-distance');
    const systemTempEl = document.getElementById('system-temp');
    const systemDescEl = document.getElementById('system-desc');

    const valDoppler = document.getElementById('val-doppler');
    const dopplerSlider = document.getElementById('doppler-slider');
    const dopplerStatusBadge = document.getElementById('doppler-status-badge');
    const habitabilityFill = document.getElementById('habitability-fill');
    const habitabilityText = document.getElementById('habitability-text');

    const chemicalDeck = document.getElementById('chemical-deck');

    // Modals
    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    const btnAtlas = document.getElementById('btn-spectral-atlas');
    const modalAtlas = document.getElementById('modal-atlas');
    const btnCloseAtlas = document.getElementById('btn-close-atlas');
    const atlasGrid = document.getElementById('atlas-grid');

    const modalResult = document.getElementById('modal-result');
    const resultTitle = document.getElementById('result-title');
    const resultBadge = document.getElementById('result-badge');
    const resultDebrief = document.getElementById('result-debrief');
    const resultBonus = document.getElementById('result-bonus');
    const btnNextSystem = document.getElementById('btn-next-system');
    const btnRetrySystem = document.getElementById('btn-retry-system');

    // Initialize Canvas
    engine.bindCanvas(canvas);
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function updateHUD() {
        hudScore.textContent = `${score.toLocaleString()} PTS`;
        hudSolved.textContent = `${solvedTargets.length} / ${data.targets.length}`;
    }
    updateHUD();

    // Render Target List
    function renderTargetList() {
        targetListEl.innerHTML = '';
        data.targets.forEach((target, idx) => {
            const isSolved = solvedTargets.includes(target.id);
            const isCurrent = idx === currentTargetIndex;
            const item = document.createElement('button');
            item.className = `target-nav-item ${isCurrent ? 'active' : ''} ${isSolved ? 'solved' : ''}`;
            item.innerHTML = `
                <div class="target-nav-header">
                    <span class="target-idx">#${String(target.id).padStart(2, '0')}</span>
                    <span class="target-status">${isSolved ? '🔭 CLASSIFIED' : '✨ UNKNOWN'}</span>
                </div>
                <div class="target-title-text">${target.planetName}</div>
                <div class="target-star-text">${target.starName}</div>
            `;
            item.addEventListener('click', () => {
                audio.playClick();
                loadSystem(idx);
            });
            targetListEl.appendChild(item);
        });
    }

    function loadSystem(idx) {
        currentTargetIndex = idx;
        const target = data.targets[idx];
        engine.loadSystem(target);

        starNameEl.textContent = target.starName;
        planetNameEl.textContent = target.planetName;
        systemBadgeEl.textContent = target.badge;
        systemDistanceEl.textContent = target.distanceLy;
        systemTempEl.textContent = `${target.temperatureK} K`;
        systemDescEl.textContent = target.description;

        dopplerSlider.value = 0;
        valDoppler.textContent = '0 km/s';

        renderChemicalDeck();
        renderTargetList();
        modalResult.classList.add('hidden');
    }

    // Render Chemical Template Deck
    function renderChemicalDeck() {
        chemicalDeck.innerHTML = '';
        data.chemicalTemplates.forEach(t => {
            const isSelected = engine.selectedChemicals.has(t.id);
            const btn = document.createElement('button');
            btn.className = `chem-template-btn ${isSelected ? 'active' : ''}`;
            btn.style.borderColor = isSelected ? t.color : 'rgba(51, 65, 85, 0.7)';
            btn.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-xs" style="color: ${t.color}">${t.name}</span>
                    <span class="badge-pill">${t.badge}</span>
                </div>
                <div class="text-[10px] text-slate-400 font-mono">Lines: ${t.lines.join('nm, ')}nm</div>
            `;
            btn.addEventListener('click', () => {
                audio.ensureContext();
                engine.toggleChemical(t.id);
                renderChemicalDeck();
            });
            chemicalDeck.appendChild(btn);
        });
    }

    // Doppler Slider Input
    dopplerSlider.addEventListener('input', (e) => {
        audio.ensureContext();
        const val = parseInt(e.target.value, 10);
        valDoppler.textContent = `${val > 0 ? '+' : ''}${val} km/s`;
        engine.setDopplerShift(val);
    });

    // Audio Toggle
    btnAudioToggle.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        btnAudioToggle.innerHTML = isMuted ? '🔇 <span class="hidden sm:inline">MUTED</span>' : '🔊 <span class="hidden sm:inline">SFX: ON</span>';
    });

    // Atlas Modal
    btnAtlas.addEventListener('click', () => {
        audio.playClick();
        renderAtlas();
        modalAtlas.classList.remove('hidden');
    });

    btnCloseAtlas.addEventListener('click', () => {
        audio.playClick();
        modalAtlas.classList.add('hidden');
    });

    function renderAtlas() {
        atlasGrid.innerHTML = '';
        data.chemicalTemplates.forEach(t => {
            const card = document.createElement('div');
            card.className = 'atlas-card';
            card.style.borderColor = `${t.color}50`;
            card.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-bold text-sm" style="color: ${t.color}">${t.name}</h4>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">${t.badge}</span>
                </div>
                <div class="text-xs text-amber-300 font-mono mb-2">Key Absorption Lines: ${t.lines.join(' nm, ')} nm</div>
                <p class="text-xs text-slate-300 leading-relaxed">${t.desc}</p>
            `;
            atlasGrid.appendChild(card);
        });
    }

    // Modal Actions
    btnNextSystem.addEventListener('click', () => {
        audio.playClick();
        if (currentTargetIndex < data.targets.length - 1) {
            loadSystem(currentTargetIndex + 1);
        } else {
            loadSystem(0);
        }
    });

    btnRetrySystem.addEventListener('click', () => {
        audio.playClick();
        loadSystem(currentTargetIndex);
    });

    // Main Game Loop (60 FPS)
    function gameLoop() {
        engine.render();
        updateUI();
        requestAnimationFrame(gameLoop);
    }

    function updateUI() {
        if (!engine.currentSystem) return;

        // Doppler lock status
        if (engine.isDopplerLocked) {
            dopplerStatusBadge.textContent = "🔒 DOPPLER ALIGNED";
            dopplerStatusBadge.className = "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50";
        } else {
            dopplerStatusBadge.textContent = "⚠️ DOPPLER UNALIGNED";
            dopplerStatusBadge.className = "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50";
        }

        // Habitability Score
        const hab = engine.currentSystem.habitableScore;
        habitabilityText.textContent = `${hab}%`;
        habitabilityFill.style.width = `${hab}%`;

        // Modals
        if (engine.isSurveyComplete && modalResult.classList.contains('hidden')) {
            showDiscoveryModal();
        }
    }

    function showDiscoveryModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "ATMOSPHERE CLASSIFIED!";
        resultTitle.className = "text-3xl font-black text-cyan-400 mb-2";
        resultBadge.textContent = "✨ EXOPLANET SURVEY COMPLETE";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/50";
        resultDebrief.textContent = engine.currentSystem.debrief;

        const bonus = 1200;
        resultBonus.textContent = `+${bonus} PTS // SPECTRUM SOLVED`;

        if (!solvedTargets.includes(engine.currentSystem.id)) {
            solvedTargets.push(engine.currentSystem.id);
            localStorage.setItem('spectro_solved', JSON.stringify(solvedTargets));
            score += bonus;
            localStorage.setItem('spectro_score', score.toString());
            updateHUD();
            renderTargetList();
        }
    }

    // Initial Setup
    renderTargetList();
    loadSystem(0);
    requestAnimationFrame(gameLoop);
});
