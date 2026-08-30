/**
 * PHARMACO-RUSH: Main Application Controller
 * Manages game state, UI events, category switching, pharmacopeia modal, and loop.
 */

document.addEventListener('DOMContentLoaded', () => {
    const engine = window.pharmaEngine;
    const audio = window.pharmaAudio;
    const data = window.PHARMA_DATA;

    let currentCaseIndex = 0;
    let selectedDrug = data.drugs[0];
    let selectedRoute = selectedDrug.routes[0];
    let selectedDose = selectedDrug.typicalDose;
    let gameMode = 'campaign'; // 'campaign' | 'endless'
    let score = parseInt(localStorage.getItem('pharmaco_score') || '0', 10);
    let solvedCases = JSON.parse(localStorage.getItem('pharmaco_solved') || '[]');

    // DOM Elements
    const ekgCanvas = document.getElementById('ekg-canvas');
    const caseListEl = document.getElementById('case-list');
    const drugGridEl = document.getElementById('drug-grid');
    const categoryTabs = document.querySelectorAll('.cat-tab');
    
    // Telemetry display elements
    const valHr = document.getElementById('val-hr');
    const valBp = document.getElementById('val-bp');
    const valMap = document.getElementById('val-map');
    const valSpo2 = document.getElementById('val-spo2');
    const valGlucose = document.getElementById('val-glucose');
    const valRr = document.getElementById('val-rr');
    const valTemp = document.getElementById('val-temp');
    const rhythmNameEl = document.getElementById('rhythm-name');
    const stabilityBar = document.getElementById('stability-fill');
    const stabilityText = document.getElementById('stability-text');
    const shockWarning = document.getElementById('shock-warning');

    // Patient Dossier
    const patientNameEl = document.getElementById('patient-name');
    const patientCaseBadge = document.getElementById('patient-case-badge');
    const patientPresentationEl = document.getElementById('patient-presentation');
    const patientPupilsEl = document.getElementById('patient-pupils');
    const patientLungsEl = document.getElementById('patient-lungs');
    const patientToxidromeEl = document.getElementById('patient-toxidrome');
    const targetsListEl = document.getElementById('targets-list');

    // Drug Administer Panel
    const selDrugName = document.getElementById('selected-drug-name');
    const selDrugCategory = document.getElementById('selected-drug-category');
    const selDrugBadge = document.getElementById('selected-drug-badge');
    const selDrugIndication = document.getElementById('selected-drug-indication');
    const selDrugPearl = document.getElementById('selected-drug-pearl');
    const doseSlider = document.getElementById('dose-slider');
    const doseValDisplay = document.getElementById('dose-val-display');
    const doseUnitDisplay = document.getElementById('dose-unit-display');
    const routeSelectContainer = document.getElementById('route-select-container');
    const btnAdminister = document.getElementById('btn-administer');
    const activeDrugsList = document.getElementById('active-drugs-list');
    const eventLogsList = document.getElementById('event-logs-list');

    // HUD
    const hudScore = document.getElementById('hud-score');
    const hudSolved = document.getElementById('hud-solved');
    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    const btnPharmacopeia = document.getElementById('btn-pharmacopeia');
    const modalPharmacopeia = document.getElementById('modal-pharmacopeia');
    const btnClosePharmModal = document.getElementById('btn-close-pharm-modal');
    const pharmacopeiaContent = document.getElementById('pharmacopeia-content');

    // Result Modal
    const modalResult = document.getElementById('modal-result');
    const resultTitle = document.getElementById('result-title');
    const resultBadge = document.getElementById('result-badge');
    const resultDebrief = document.getElementById('result-debrief');
    const resultScoreBonus = document.getElementById('result-score-bonus');
    const btnNextCase = document.getElementById('btn-next-case');
    const btnRetryCase = document.getElementById('btn-retry-case');

    // Initialize Canvas
    engine.bindCanvas(ekgCanvas);
    function resizeCanvas() {
        const rect = ekgCanvas.getBoundingClientRect();
        ekgCanvas.width = rect.width * window.devicePixelRatio;
        ekgCanvas.height = rect.height * window.devicePixelRatio;
        const ctx = ekgCanvas.getContext('2d');
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Render HUD
    function updateHUD() {
        hudScore.textContent = `${score.toLocaleString()} PTS`;
        hudSolved.textContent = `${solvedCases.length} / ${data.cases.length}`;
    }
    updateHUD();

    // Render Case Navigation List
    function renderCaseList() {
        caseListEl.innerHTML = '';
        data.cases.forEach((c, idx) => {
            const isSolved = solvedCases.includes(c.id);
            const isCurrent = idx === currentCaseIndex;
            const item = document.createElement('button');
            item.className = `case-item ${isCurrent ? 'active' : ''} ${isSolved ? 'solved' : ''}`;
            item.innerHTML = `
                <div class="case-item-header">
                    <span class="case-idx">#${String(c.id).padStart(2, '0')}</span>
                    <span class="case-status">${isSolved ? '✅ STABILIZED' : '⚠️ ACTIVE'}</span>
                </div>
                <div class="case-title">${c.title}</div>
                <div class="case-diff">${c.difficulty}</div>
            `;
            item.addEventListener('click', () => {
                audio.playClick();
                loadCase(idx);
            });
            caseListEl.appendChild(item);
        });
    }

    // Load Case
    function loadCase(idx) {
        currentCaseIndex = idx;
        const c = data.cases[idx];
        engine.loadCase(c);

        // Update Dossier
        patientNameEl.textContent = c.patient.name;
        patientCaseBadge.textContent = c.badge;
        patientPresentationEl.textContent = c.patient.presentation;
        patientPupilsEl.textContent = c.patient.pupils;
        patientLungsEl.textContent = c.patient.lungs;
        patientToxidromeEl.textContent = c.patient.toxidrome;

        // Render Targets
        renderTargets(c.targetVitals);
        renderCaseList();
        modalResult.classList.add('hidden');
    }

    function renderTargets(targets) {
        targetsListEl.innerHTML = '';
        if (targets.sbpMin) addTargetPill(`SBP ≥ ${targets.sbpMin} mmHg`);
        if (targets.sbpMax) addTargetPill(`SBP ≤ ${targets.sbpMax} mmHg`);
        if (targets.spo2Min) addTargetPill(`SpO2 ≥ ${targets.spo2Min}%`);
        if (targets.hrMin) addTargetPill(`HR ≥ ${targets.hrMin} bpm`);
        if (targets.hrMax) addTargetPill(`HR ≤ ${targets.hrMax} bpm`);
        if (targets.glucoseMin) addTargetPill(`Glucose ≥ ${targets.glucoseMin} mg/dL`);
        if (targets.glucoseMax) addTargetPill(`Glucose ≤ ${targets.glucoseMax} mg/dL`);
        if (targets.rrMin) addTargetPill(`RR ≥ ${targets.rrMin} /min`);
    }

    function addTargetPill(text) {
        const pill = document.createElement('span');
        pill.className = 'target-pill';
        pill.textContent = `🎯 ${text}`;
        targetsListEl.appendChild(pill);
    }

    // Render Drug Selector Grid
    function renderDrugs(category = 'all') {
        drugGridEl.innerHTML = '';
        const filtered = category === 'all' 
            ? data.drugs 
            : data.drugs.filter(d => d.category === category);

        filtered.forEach(d => {
            const isSelected = selectedDrug.id === d.id;
            const btn = document.createElement('button');
            btn.className = `drug-btn ${isSelected ? 'active' : ''} cat-${d.category}`;
            btn.innerHTML = `
                <div class="drug-name">${d.name}</div>
                <div class="drug-category-tag">${d.categoryName}</div>
            `;
            btn.addEventListener('click', () => {
                audio.playClick();
                selectDrug(d);
            });
            drugGridEl.appendChild(btn);
        });
    }

    // Select Drug and update Dosage/Route Controls
    function selectDrug(drug) {
        selectedDrug = drug;
        selDrugName.textContent = drug.name;
        selDrugCategory.textContent = drug.categoryName;
        selDrugBadge.textContent = drug.badge;
        selDrugIndication.textContent = drug.indication;
        selDrugPearl.textContent = drug.pearl;

        doseSlider.min = drug.doseMin;
        doseSlider.max = drug.doseMax;
        doseSlider.step = drug.step;
        doseSlider.value = drug.typicalDose;
        selectedDose = drug.typicalDose;

        doseValDisplay.textContent = selectedDose;
        doseUnitDisplay.textContent = drug.unit;

        // Render Routes
        routeSelectContainer.innerHTML = '';
        selectedRoute = drug.preferredRoute;
        drug.routes.forEach(r => {
            const rBtn = document.createElement('button');
            rBtn.className = `route-btn ${r === selectedRoute ? 'active' : ''}`;
            rBtn.textContent = r;
            rBtn.addEventListener('click', () => {
                audio.playClick();
                document.querySelectorAll('.route-btn').forEach(b => b.classList.remove('active'));
                rBtn.classList.add('active');
                selectedRoute = r;
            });
            routeSelectContainer.appendChild(rBtn);
        });

        renderDrugs(document.querySelector('.cat-tab.active').dataset.cat);
    }

    // Dose Slider input
    doseSlider.addEventListener('input', (e) => {
        selectedDose = parseFloat(e.target.value);
        doseValDisplay.textContent = selectedDose;
    });

    // Administer Button
    btnAdminister.addEventListener('click', () => {
        audio.ensureContext();
        const res = engine.administerDrug(selectedDrug.id, selectedDose, selectedRoute);
        if (res.success) {
            btnAdminister.classList.add('pulse-press');
            setTimeout(() => btnAdminister.classList.remove('pulse-press'), 300);
        }
    });

    // Category Tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            audio.playClick();
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderDrugs(tab.dataset.cat);
        });
    });

    // Audio Toggle
    btnAudioToggle.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        btnAudioToggle.innerHTML = isMuted ? '🔇 <span class="hidden sm:inline">MUTED</span>' : '🔊 <span class="hidden sm:inline">SFX: ON</span>';
    });

    // Pharmacopeia Modal
    btnPharmacopeia.addEventListener('click', () => {
        audio.playClick();
        renderPharmacopeiaArchive();
        modalPharmacopeia.classList.remove('hidden');
    });

    btnClosePharmModal.addEventListener('click', () => {
        audio.playClick();
        modalPharmacopeia.classList.add('hidden');
    });

    function renderPharmacopeiaArchive() {
        pharmacopeiaContent.innerHTML = '';
        data.drugs.forEach(d => {
            const card = document.createElement('div');
            card.className = 'pharm-card';
            card.innerHTML = `
                <div class="pharm-card-header">
                    <h4>${d.name}</h4>
                    <span class="badge">${d.badge}</span>
                </div>
                <div class="pharm-detail"><strong>Category:</strong> ${d.categoryName}</div>
                <div class="pharm-detail"><strong>Typical Dose:</strong> ${d.typicalDose} ${d.unit} via ${d.preferredRoute}</div>
                <div class="pharm-detail"><strong>Indications:</strong> ${d.indication}</div>
                <div class="pharm-detail"><strong>Contraindications:</strong> <span class="text-rose-400">${d.contraindication}</span></div>
                <div class="pharm-pearl">💡 <strong>Clinical Pearl:</strong> ${d.pearl}</div>
            `;
            pharmacopeiaContent.appendChild(card);
        });
    }

    // Modal Action Buttons
    btnNextCase.addEventListener('click', () => {
        audio.playClick();
        if (currentCaseIndex < data.cases.length - 1) {
            loadCase(currentCaseIndex + 1);
        } else {
            loadCase(0);
        }
    });

    btnRetryCase.addEventListener('click', () => {
        audio.playClick();
        loadCase(currentCaseIndex);
    });

    // Main Game Loop (60 FPS)
    let lastTime = performance.now();
    function gameLoop(time) {
        const dtSec = Math.min((time - lastTime) * 0.001, 0.1);
        lastTime = time;

        engine.update(dtSec);
        engine.renderEKG();
        updateUI();

        requestAnimationFrame(gameLoop);
    }

    function updateUI() {
        const p = engine.patient;
        if (!p) return;

        // Vitals
        valHr.textContent = Math.round(p.hr);
        valBp.textContent = `${Math.round(p.sbp)}/${Math.round(p.dbp)}`;
        const map = Math.round((p.sbp + 2 * p.dbp) / 3);
        valMap.textContent = `MAP ${map}`;
        valSpo2.textContent = `${Math.round(p.spo2)}%`;
        valGlucose.textContent = Math.round(p.glucose);
        valRr.textContent = Math.round(p.rr);
        valTemp.textContent = `${p.temp.toFixed(1)}°C`;
        rhythmNameEl.textContent = p.rhythmName;

        // Vitals Color-coding
        valHr.className = p.hr < 45 || p.hr > 150 ? 'vital-num danger' : (p.hr < 60 || p.hr > 100 ? 'vital-num warning' : 'vital-num');
        valBp.className = p.sbp < 85 || p.sbp > 180 ? 'vital-num danger' : (p.sbp < 100 || p.sbp > 140 ? 'vital-num warning' : 'vital-num');
        valSpo2.className = p.spo2 < 88 ? 'vital-num danger' : (p.spo2 < 93 ? 'vital-num warning' : 'vital-num');

        // Shock warning badge
        if (p.timeInCriticalShockSec > 2) {
            shockWarning.classList.remove('hidden');
            shockWarning.textContent = `🚨 CRITICAL HYPOPERFUSION (${Math.ceil(12 - p.timeInCriticalShockSec)}s TO ARREST)`;
        } else {
            shockWarning.classList.add('hidden');
        }

        // Stability Progress
        stabilityBar.style.width = `${p.stabilityProgress}%`;
        stabilityText.textContent = `${Math.round(p.stabilityProgress)}%`;

        // Active Drugs
        renderActiveDrugs();

        // Event Logs
        renderEventLogs();

        // Check End Conditions
        if (engine.isStabilized && modalResult.classList.contains('hidden')) {
            showStabilizedModal();
        } else if (engine.isDead && modalResult.classList.contains('hidden')) {
            showDeadModal();
        }
    }

    function renderActiveDrugs() {
        activeDrugsList.innerHTML = '';
        if (engine.activeDrugs.length === 0) {
            activeDrugsList.innerHTML = '<div class="no-drugs">No active infusions circulating</div>';
            return;
        }

        engine.activeDrugs.forEach(d => {
            const pct = Math.max(0, Math.round((d.timeRemaining / d.maxDuration) * 100));
            const pill = document.createElement('div');
            pill.className = `active-drug-pill ${d.isMistake ? 'border-rose-500/80 bg-rose-950/40' : 'border-cyan-500/40 bg-slate-900/60'}`;
            pill.innerHTML = `
                <div class="flex justify-between items-center text-xs">
                    <span class="font-bold text-white">${d.name} (${d.dose} ${d.unit})</span>
                    <span class="font-mono text-cyan-400">${Math.ceil(d.timeRemaining)}s</span>
                </div>
                <div class="active-drug-bar-bg">
                    <div class="active-drug-bar-fill" style="width: ${pct}%;"></div>
                </div>
            `;
            activeDrugsList.appendChild(pill);
        });
    }

    function renderEventLogs() {
        eventLogsList.innerHTML = '';
        engine.historyLogs.slice(0, 15).forEach(log => {
            const row = document.createElement('div');
            row.className = `log-entry log-${log.type}`;
            row.innerHTML = `<span class="log-time">[${log.time}]</span> <span class="log-text">${log.text}</span>`;
            eventLogsList.appendChild(row);
        });
    }

    function showStabilizedModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "PATIENT STABILIZED";
        resultTitle.className = "text-3xl font-black text-emerald-400 mb-2";
        resultBadge.textContent = "✅ HEMODYNAMIC GOALS MET";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50";
        resultDebrief.textContent = engine.patient.debrief;

        const bonus = 1000;
        resultScoreBonus.textContent = `+${bonus} PTS`;
        
        if (!solvedCases.includes(engine.patient.id)) {
            solvedCases.push(engine.patient.id);
            localStorage.setItem('pharmaco_solved', JSON.stringify(solvedCases));
            score += bonus;
            localStorage.setItem('pharmaco_score', score.toString());
            updateHUD();
            renderCaseList();
        }
    }

    function showDeadModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "PATIENT EXPIRED";
        resultTitle.className = "text-3xl font-black text-rose-500 mb-2";
        resultBadge.textContent = "💀 CODE BLUE FLATLINE";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50";
        resultDebrief.textContent = `Clinical Review: ${engine.patient.debrief}`;
        resultScoreBonus.textContent = `+0 PTS (Review Contraindications)`;
    }

    // Initial Setup
    renderCaseList();
    renderDrugs('all');
    selectDrug(data.drugs[0]);
    loadCase(0);

    // Start Loop
    requestAnimationFrame(gameLoop);
});
