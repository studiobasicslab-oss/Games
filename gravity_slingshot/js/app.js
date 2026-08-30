/**
 * GRAVITY SLINGSHOT: Main Application Controller
 * Handles user controls, attitude rotations, flight telemetry HUD, mission transitions, and render loop.
 */

document.addEventListener('DOMContentLoaded', () => {
    const engine = window.slingshotEngine;
    const audio = window.slingshotAudio;
    const data = window.SLINGSHOT_DATA;

    let currentMissionIndex = 0;
    let score = parseInt(localStorage.getItem('slingshot_score') || '0', 10);
    let solvedMissions = JSON.parse(localStorage.getItem('slingshot_solved') || '[]');

    // DOM Elements
    const canvas = document.getElementById('flight-canvas');
    const missionListEl = document.getElementById('mission-list');

    // Telemetry Displays
    const hudScore = document.getElementById('hud-score');
    const hudSolved = document.getElementById('hud-solved');
    const valSpeed = document.getElementById('val-speed');
    const valDeltav = document.getElementById('val-deltav');
    const deltavFill = document.getElementById('deltav-fill');
    const valPrimaryDist = document.getElementById('val-primary-dist');
    const valTimeWarp = document.getElementById('val-timewarp');
    const captureProgressFill = document.getElementById('capture-progress-fill');
    const captureProgressText = document.getElementById('capture-progress-text');

    // Mission Briefing
    const missionTitleEl = document.getElementById('mission-title');
    const missionBadgeEl = document.getElementById('mission-badge');
    const missionGoalEl = document.getElementById('mission-goal');
    const missionPearlEl = document.getElementById('mission-pearl');

    // Flight Controls
    const btnThrust = document.getElementById('btn-thrust');
    const btnRotateLeft = document.getElementById('btn-rotate-left');
    const btnRotateRight = document.getElementById('btn-rotate-right');
    const btnWarp1x = document.getElementById('btn-warp-1x');
    const btnWarp5x = document.getElementById('btn-warp-5x');
    const btnWarp25x = document.getElementById('btn-warp-25x');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');

    // Modals
    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    const btnAstrodynamicsCodex = document.getElementById('btn-astrodynamics-codex');
    const modalCodex = document.getElementById('modal-codex');
    const btnCloseCodex = document.getElementById('btn-close-codex');
    const codexContent = document.getElementById('codex-content');

    const modalResult = document.getElementById('modal-result');
    const resultTitle = document.getElementById('result-title');
    const resultBadge = document.getElementById('result-badge');
    const resultPearl = document.getElementById('result-pearl');
    const resultBonus = document.getElementById('result-bonus');
    const btnNextMission = document.getElementById('btn-next-mission');
    const btnRetryMission = document.getElementById('btn-retry-mission');

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
        hudSolved.textContent = `${solvedMissions.length} / ${data.missions.length}`;
    }
    updateHUD();

    // Render Mission List
    function renderMissionList() {
        missionListEl.innerHTML = '';
        data.missions.forEach((m, idx) => {
            const isSolved = solvedMissions.includes(m.id);
            const isCurrent = idx === currentMissionIndex;
            const item = document.createElement('button');
            item.className = `mission-nav-item ${isCurrent ? 'active' : ''} ${isSolved ? 'solved' : ''}`;
            item.innerHTML = `
                <div class="mission-nav-header">
                    <span class="mission-idx">#${String(m.id).padStart(2, '0')}</span>
                    <span class="mission-status">${isSolved ? '🛰️ INSERTED' : '🪐 ACTIVE'}</span>
                </div>
                <div class="mission-title-text">${m.title}</div>
                <div class="mission-diff-text">${m.difficulty} // Δv ${m.deltaVBudget}m/s</div>
            `;
            item.addEventListener('click', () => {
                audio.playClick();
                loadMission(idx);
            });
            missionListEl.appendChild(item);
        });
    }

    function loadMission(idx) {
        currentMissionIndex = idx;
        const m = data.missions[idx];
        engine.loadMission(m);

        missionTitleEl.textContent = m.title;
        missionBadgeEl.textContent = m.badge;
        missionGoalEl.textContent = m.targetGoal;
        missionPearlEl.textContent = m.astrodynamicsPearl;

        renderMissionList();
        modalResult.classList.add('hidden');
    }

    // Keyboard Flight Controls
    const keysDown = {};
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
        keysDown[e.code] = true;

        if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
            engine.setThrust(true);
        }
        if (e.code === 'KeyR') {
            loadMission(currentMissionIndex);
        }
    });

    window.addEventListener('keyup', (e) => {
        keysDown[e.code] = false;
        if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
            engine.setThrust(false);
        }
    });

    // Touch & Button Controls
    btnThrust.addEventListener('mousedown', () => engine.setThrust(true));
    btnThrust.addEventListener('mouseup', () => engine.setThrust(false));
    btnThrust.addEventListener('mouseleave', () => engine.setThrust(false));
    btnThrust.addEventListener('touchstart', (e) => { e.preventDefault(); engine.setThrust(true); });
    btnThrust.addEventListener('touchend', (e) => { e.preventDefault(); engine.setThrust(false); });

    btnRotateLeft.addEventListener('click', () => engine.rotateProbe(-0.25));
    btnRotateRight.addEventListener('click', () => engine.rotateProbe(0.25));

    // Time Warp Controls
    function setWarp(warp) {
        audio.playClick();
        engine.timeWarp = warp;
        valTimeWarp.textContent = `${warp}X`;
        [btnWarp1x, btnWarp5x, btnWarp25x].forEach(b => b.classList.remove('active'));
        if (warp === 1) btnWarp1x.classList.add('active');
        if (warp === 5) btnWarp5x.classList.add('active');
        if (warp === 25) btnWarp25x.classList.add('active');
    }
    btnWarp1x.addEventListener('click', () => setWarp(1));
    btnWarp5x.addEventListener('click', () => setWarp(5));
    btnWarp25x.addEventListener('click', () => setWarp(25));

    // Zoom Controls
    btnZoomIn.addEventListener('click', () => {
        audio.playClick();
        engine.camera.zoom = Math.min(2.0, engine.camera.zoom + 0.2);
    });
    btnZoomOut.addEventListener('click', () => {
        audio.playClick();
        engine.camera.zoom = Math.max(0.3, engine.camera.zoom - 0.2);
    });

    // Audio Toggle
    btnAudioToggle.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        btnAudioToggle.innerHTML = isMuted ? '🔇 <span class="hidden sm:inline">MUTED</span>' : '🔊 <span class="hidden sm:inline">SFX: ON</span>';
    });

    // Codex Modal
    btnAstrodynamicsCodex.addEventListener('click', () => {
        audio.playClick();
        renderCodex();
        modalCodex.classList.remove('hidden');
    });

    btnCloseCodex.addEventListener('click', () => {
        audio.playClick();
        modalCodex.classList.add('hidden');
    });

    function renderCodex() {
        codexContent.innerHTML = '';
        data.formulas.forEach(f => {
            const card = document.createElement('div');
            card.className = 'codex-card';
            card.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <h4 class="font-bold text-cyan-400 text-sm">${f.name}</h4>
                </div>
                <div class="text-xs text-amber-300 font-mono mb-2 bg-slate-950/80 p-2 rounded border border-slate-800">${f.math}</div>
                <p class="text-xs text-slate-300 leading-relaxed">${f.desc}</p>
            `;
            codexContent.appendChild(card);
        });
    }

    // Modal Actions
    btnNextMission.addEventListener('click', () => {
        audio.playClick();
        if (currentMissionIndex < data.missions.length - 1) {
            loadMission(currentMissionIndex + 1);
        } else {
            loadMission(0);
        }
    });

    btnRetryMission.addEventListener('click', () => {
        audio.playClick();
        loadMission(currentMissionIndex);
    });

    // Main Game Loop (60 FPS)
    let lastTime = performance.now();
    function gameLoop(time) {
        const dtSec = (time - lastTime) * 0.001;
        lastTime = time;

        // Continuous rotation on key hold
        if (keysDown['ArrowLeft'] || keysDown['KeyA']) engine.rotateProbe(-2.5 * dtSec);
        if (keysDown['ArrowRight'] || keysDown['KeyD']) engine.rotateProbe(2.5 * dtSec);

        engine.update(dtSec);
        engine.render();
        updateUI();

        requestAnimationFrame(gameLoop);
    }

    function updateUI() {
        const p = engine.probe;
        if (!p) return;

        // Speed & Delta-V
        const speed = Math.round(Math.hypot(p.vx, p.vy));
        valSpeed.textContent = `${speed} m/s`;
        valDeltav.textContent = `${Math.round(p.deltaVRemaining)} m/s`;
        const dvFrac = Math.max(0, (p.deltaVRemaining / p.deltaVMax) * 100);
        deltavFill.style.width = `${dvFrac}%`;

        // Primary distance
        const primary = engine.celestialBodies[0];
        if (primary) {
            const dist = Math.round(Math.hypot(primary.x - p.x, primary.y - p.y));
            valPrimaryDist.textContent = `${dist} km`;
        }

        // Capture Progress
        const targetDuration = engine.currentMission ? engine.currentMission.targetCriteria.durationStableSec : 5;
        const progPct = Math.min(100, Math.round((engine.stableTimerSec / targetDuration) * 100));
        captureProgressFill.style.width = `${progPct}%`;
        captureProgressText.textContent = `${progPct}%`;

        // Modals
        if (engine.isMissionComplete && modalResult.classList.contains('hidden')) {
            showMissionSuccessModal();
        } else if (engine.isCrashed && modalResult.classList.contains('hidden')) {
            showCrashModal();
        }
    }

    function showMissionSuccessModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "ORBITAL CAPTURE CONFIRMED!";
        resultTitle.className = "text-3xl font-black text-cyan-400 mb-2";
        resultBadge.textContent = "🛰️ MISSION OBJECTIVES ACCOMPLISHED";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/50";
        resultPearl.textContent = engine.currentMission.astrodynamicsPearl;

        const bonus = 1500;
        resultBonus.textContent = `+${bonus} PTS // TRAJECTORY MASTER`;

        if (!solvedMissions.includes(engine.currentMission.id)) {
            solvedMissions.push(engine.currentMission.id);
            localStorage.setItem('slingshot_solved', JSON.stringify(solvedMissions));
            score += bonus;
            localStorage.setItem('slingshot_score', score.toString());
            updateHUD();
            renderMissionList();
        }
    }

    function showCrashModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "SPACECRAFT DESTROYED";
        resultTitle.className = "text-3xl font-black text-rose-500 mb-2";
        resultBadge.textContent = "💥 IMPACT / ESCAPE COLLAPSE";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50";
        resultPearl.textContent = "Remember: Adjust your burn vector at periapsis or apoapsis to raise your periapsis safely above the surface radius!";
        resultBonus.textContent = "+0 PTS (Recalculate Vector)";
    }

    // Initial Setup
    renderMissionList();
    loadMission(0);
    requestAnimationFrame(gameLoop);
});
