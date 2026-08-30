/**
 * TOKAMAK FORGE: Main Game Controller
 * Manages player inputs, drop queue, UI HUD, era progression, and physics loop.
 */

document.addEventListener('DOMContentLoaded', () => {
    const engine = window.tokamakEngine;
    const audio = window.tokamakAudio;
    const data = window.TOKAMAK_DATA;

    let currentEraIndex = 0;
    let nextIsotopeId = 'H1';
    let currentIsotopeId = 'H1';
    let score = parseInt(localStorage.getItem('tokamak_score') || '0', 10);
    let solvedEras = JSON.parse(localStorage.getItem('tokamak_solved') || '[]');

    // DOM Elements
    const canvas = document.getElementById('tokamak-canvas');
    const eraListEl = document.getElementById('era-list');
    
    // HUD Displays
    const hudScore = document.getElementById('hud-score');
    const hudSolved = document.getElementById('hud-solved');
    const valYield = document.getElementById('val-yield');
    const valQFactor = document.getElementById('val-q-factor');
    const valTemp = document.getElementById('val-temp');
    const valFusions = document.getElementById('val-fusions');
    const eraTitleEl = document.getElementById('era-title');
    const eraBadgeEl = document.getElementById('era-badge');
    const eraGoalEl = document.getElementById('era-goal');
    const eraLoreEl = document.getElementById('era-lore');
    const eraProgressFill = document.getElementById('era-progress-fill');
    const eraProgressText = document.getElementById('era-progress-text');

    // Drop Preview
    const currentIsoSymbol = document.getElementById('current-iso-symbol');
    const currentIsoName = document.getElementById('current-iso-name');
    const nextIsoSymbol = document.getElementById('next-iso-symbol');
    const btnMagneticPinch = document.getElementById('btn-magnetic-pinch');

    // Modals & Controls
    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    const btnNuclideChart = document.getElementById('btn-nuclide-chart');
    const modalNuclide = document.getElementById('modal-nuclide');
    const btnCloseNuclide = document.getElementById('btn-close-nuclide');
    const nuclideGrid = document.getElementById('nuclide-grid');

    const modalResult = document.getElementById('modal-result');
    const resultTitle = document.getElementById('result-title');
    const resultBadge = document.getElementById('result-badge');
    const resultLore = document.getElementById('result-lore');
    const resultBonus = document.getElementById('result-bonus');
    const btnNextEra = document.getElementById('btn-next-era');
    const btnRetryEra = document.getElementById('btn-retry-era');

    // Initialize Canvas
    engine.bindCanvas(canvas);
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        engine.chamberWidth = rect.width;
        engine.chamberHeight = rect.height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function updateHUD() {
        hudScore.textContent = `${score.toLocaleString()} PTS`;
        hudSolved.textContent = `${solvedEras.length} / ${data.campaignEras.length}`;
    }
    updateHUD();

    // Render Era Navigation List
    function renderEraList() {
        eraListEl.innerHTML = '';
        data.campaignEras.forEach((era, idx) => {
            const isSolved = solvedEras.includes(era.id);
            const isCurrent = idx === currentEraIndex;
            const item = document.createElement('button');
            item.className = `era-nav-item ${isCurrent ? 'active' : ''} ${isSolved ? 'solved' : ''}`;
            item.innerHTML = `
                <div class="era-nav-header">
                    <span class="era-idx">#${String(era.id).padStart(2, '0')}</span>
                    <span class="era-status">${isSolved ? '⭐ CONFINED' : '🔒 ACTIVE'}</span>
                </div>
                <div class="era-title-text">${era.title}</div>
                <div class="era-temp-text">${era.chamberTempMK} MK</div>
            `;
            item.addEventListener('click', () => {
                audio.playClick();
                loadEra(idx);
            });
            eraListEl.appendChild(item);
        });
    }

    function getRandomFromPool(pool) {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function rollNextIsotope() {
        currentIsotopeId = nextIsotopeId;
        const era = data.campaignEras[currentEraIndex];
        nextIsotopeId = getRandomFromPool(era.dropPool);

        // Update preview UI
        const curr = data.isotopes.find(i => i.id === currentIsotopeId);
        const next = data.isotopes.find(i => i.id === nextIsotopeId);

        if (curr) {
            currentIsoSymbol.textContent = curr.symbol;
            currentIsoSymbol.style.color = curr.color;
            currentIsoName.textContent = curr.name;
        }
        if (next) {
            nextIsoSymbol.textContent = next.symbol;
            nextIsoSymbol.style.color = next.color;
        }
    }

    function loadEra(idx) {
        currentEraIndex = idx;
        const era = data.campaignEras[idx];
        engine.reset(era);

        eraTitleEl.textContent = era.title;
        eraBadgeEl.textContent = era.era;
        eraGoalEl.textContent = era.targetGoal;
        eraLoreEl.textContent = era.lore;
        valTemp.textContent = `${era.chamberTempMK}M K`;

        nextIsotopeId = getRandomFromPool(era.dropPool);
        rollNextIsotope();

        renderEraList();
        modalResult.classList.add('hidden');
    }

    // Input Handling: Mouse & Touch Drop
    let isDropReady = true;

    function handleAim(clientX) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        engine.dropX = Math.max(30, Math.min(canvas.width - 30, mouseX));
    }

    function handleDrop() {
        if (!isDropReady || engine.isQuenched || engine.isEraComplete) return;
        audio.ensureContext();

        engine.spawnParticle(currentIsotopeId, engine.dropX, 40);
        rollNextIsotope();

        isDropReady = false;
        setTimeout(() => { isDropReady = true; }, 400); // 400ms cooldown between drops
    }

    canvas.addEventListener('mousemove', (e) => handleAim(e.clientX));
    canvas.addEventListener('click', () => handleDrop());

    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            e.preventDefault();
            handleAim(e.touches[0].clientX);
        }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleDrop();
    });

    // Spacebar / Button Magnetic Pinch
    function triggerPinch() {
        audio.ensureContext();
        engine.applyMagneticPinch();
        btnMagneticPinch.classList.add('scale-95');
        setTimeout(() => btnMagneticPinch.classList.remove('scale-95'), 150);
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            triggerPinch();
        }
    });

    btnMagneticPinch.addEventListener('click', triggerPinch);

    // Audio Toggle
    btnAudioToggle.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        btnAudioToggle.innerHTML = isMuted ? '🔇 <span class="hidden sm:inline">MUTED</span>' : '🔊 <span class="hidden sm:inline">SFX: ON</span>';
    });

    // Nuclide Modal
    btnNuclideChart.addEventListener('click', () => {
        audio.playClick();
        renderNuclideChart();
        modalNuclide.classList.remove('hidden');
    });

    btnCloseNuclide.addEventListener('click', () => {
        audio.playClick();
        modalNuclide.classList.add('hidden');
    });

    function renderNuclideChart() {
        nuclideGrid.innerHTML = '';
        data.isotopes.forEach(iso => {
            const card = document.createElement('div');
            card.className = 'nuclide-card';
            card.style.borderColor = `${iso.color}50`;
            card.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-2">
                        <span class="text-xl font-bold font-mono" style="color: ${iso.color}">${iso.symbol}</span>
                        <strong class="text-white text-sm">${iso.name}</strong>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono ${iso.isStable ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}">
                        ${iso.isStable ? 'STABLE' : 'RADIOACTIVE'}
                    </span>
                </div>
                <div class="text-xs text-slate-300 mb-1">
                    Protons (Z): <span class="text-white font-mono">${iso.Z}</span> | Neutrons (N): <span class="text-white font-mono">${iso.N}</span> | Mass: <span class="text-white font-mono">${iso.massAmu.toFixed(4)} u</span>
                </div>
                <div class="text-xs text-cyan-300 font-mono mb-2">
                    Binding Energy: ${iso.bindingEnergyPerNucleon} MeV/nucleon
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">${iso.lore}</p>
            `;
            nuclideGrid.appendChild(card);
        });
    }

    // Modal Actions
    btnNextEra.addEventListener('click', () => {
        audio.playClick();
        if (currentEraIndex < data.campaignEras.length - 1) {
            loadEra(currentEraIndex + 1);
        } else {
            loadEra(0);
        }
    });

    btnRetryEra.addEventListener('click', () => {
        audio.playClick();
        loadEra(currentEraIndex);
    });

    // Main Game Loop (60 FPS)
    let lastTime = performance.now();
    function gameLoop(time) {
        const dtSec = (time - lastTime) * 0.001;
        lastTime = time;

        engine.update(dtSec);
        engine.render();
        updateUI();

        requestAnimationFrame(gameLoop);
    }

    function updateUI() {
        valYield.textContent = `${Math.round(engine.totalEnergyYieldMeV)} MeV`;
        valFusions.textContent = engine.fusionsCount;

        // Q-factor calculation: Q = Yield / (Input power baseline ~ 50 MeV)
        const qFactor = Math.max(0.1, (engine.totalEnergyYieldMeV / 60)).toFixed(2);
        valQFactor.textContent = `Q = ${qFactor}`;
        valQFactor.className = qFactor >= 1.0 ? 'vital-num text-emerald-400' : 'vital-num text-cyan-400';

        // Progress
        const targetYield = engine.currentEra ? engine.currentEra.targetYieldMeV : 100;
        const progressPct = Math.min(100, Math.round((engine.totalEnergyYieldMeV / targetYield) * 100));
        eraProgressFill.style.width = `${progressPct}%`;
        eraProgressText.textContent = `${progressPct}%`;

        // Modals
        if (engine.isEraComplete && modalResult.classList.contains('hidden')) {
            showEraSuccessModal();
        } else if (engine.isQuenched && modalResult.classList.contains('hidden')) {
            showQuenchModal();
        }
    }

    function showEraSuccessModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "STELLAR IGNITION ACHIEVED!";
        resultTitle.className = "text-3xl font-black text-emerald-400 mb-2";
        resultBadge.textContent = "⭐ ERA CONFINED & SYNTHESIZED";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50";
        resultLore.textContent = engine.currentEra.lore;

        const bonus = 1200;
        resultBonus.textContent = `+${bonus} PTS // Q > 1.0 IGNITION`;

        if (!solvedEras.includes(engine.currentEra.id)) {
            solvedEras.push(engine.currentEra.id);
            localStorage.setItem('tokamak_solved', JSON.stringify(solvedEras));
            score += bonus;
            localStorage.setItem('tokamak_score', score.toString());
            updateHUD();
            renderEraList();
        }
    }

    function showQuenchModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "THERMAL QUENCH // COLLAPSE";
        resultTitle.className = "text-3xl font-black text-rose-500 mb-2";
        resultBadge.textContent = "💥 PLASMA OVERFLOW BREACH";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50";
        resultLore.textContent = "Magnetic confinement failed! Use the SPACEBAR Magnetic Pinch pulse to compress the plasma core before it overflows the torus threshold line.";
        resultBonus.textContent = "+0 PTS (Try Again)";
    }

    // Initial setup
    renderEraList();
    loadEra(0);
    requestAnimationFrame(gameLoop);
});
