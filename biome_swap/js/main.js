/**
 * Biome Swap: The Keystone Balance - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    const audio = new AudioEngine();
    const vfx = new VFXEngine('vfx-canvas');
    const ecology = new EcologyEngine(audio, vfx);

    let currentMode = 'campaign'; // 'campaign', 'survival', 'sandbox'
    let currentScenarioIndex = 0;
    let selectedCard = null;
    let playerHand = [];
    let isAutoTicking = false;
    let autoTickTimer = null;

    // DOM Elements
    const elDay = document.getElementById('hud-day');
    const elEnergy = document.getElementById('hud-energy');
    const elBiodiversity = document.getElementById('hud-biodiversity');
    const elProducersBar = document.getElementById('pyramid-producers-bar');
    const elHerbivoresBar = document.getElementById('pyramid-herbivores-bar');
    const elPredatorsBar = document.getElementById('pyramid-predators-bar');
    const elApexBar = document.getElementById('pyramid-apex-bar');

    const elGrid = document.getElementById('ecosystem-grid');
    const elHand = document.getElementById('cards-hand');
    const elCascadeLog = document.getElementById('cascade-log-list');

    const elScenarioTitle = document.getElementById('scenario-title');
    const elScenarioDesc = document.getElementById('scenario-desc');
    const elScenarioTarget = document.getElementById('scenario-target');
    const elScenarioHint = document.getElementById('scenario-hint');

    const btnStepDay = document.getElementById('btn-step-day');
    const btnAutoSim = document.getElementById('btn-auto-sim');
    const btnAudioToggle = document.getElementById('btn-toggle-audio');
    const btnHelp = document.getElementById('btn-help');
    const modalHelp = document.getElementById('modal-help');
    const modalVictory = document.getElementById('modal-victory');
    const btnNextScenario = document.getElementById('btn-next-scenario');
    const btnRetryScenario = document.getElementById('btn-retry-scenario');
    const btnCloseHelp = document.getElementById('btn-close-help');

    const modeNavBtns = document.querySelectorAll('.mode-nav-btn');

    // Draw hand from cards database
    function drawHand(count = 5) {
        playerHand = [];
        for (let i = 0; i < count; i++) {
            const randomCard = OPERATOR_CARDS[Math.floor(Math.random() * OPERATOR_CARDS.length)];
            playerHand.push({ ...randomCard, uniqueId: 'h_' + Math.random().toString(36).substr(2, 6) });
        }
    }

    // Load Scenario
    function loadScenario(index) {
        currentScenarioIndex = index;
        const scenario = RESTORATION_SCENARIOS[currentScenarioIndex];
        if (!scenario) return;

        elScenarioTitle.textContent = scenario.title;
        elScenarioDesc.textContent = scenario.description;
        elScenarioTarget.textContent = `Target Biodiversity: ≥ ${scenario.targetBiodiversity} | Max Days: ${scenario.maxDays}`;
        elScenarioHint.textContent = `💡 Hint: ${scenario.hint}`;

        ecology.loadScenario(scenario);
        drawHand(5);
        selectedCard = null;
        renderAll();
    }

    // Render Grid & All UI
    function renderAll() {
        const metrics = ecology.calculateMetrics();

        // 1. HUD Stats
        if (elDay) elDay.textContent = ecology.day;
        if (elEnergy) elEnergy.textContent = `${ecology.energyAvailable} kcal`;
        if (elBiodiversity) elBiodiversity.textContent = `${metrics.biodiversityScore}/100`;

        // 2. Trophic Pyramid Bars
        if (elProducersBar) elProducersBar.style.width = `${Math.min(100, metrics.avgProducers)}%`;
        if (elHerbivoresBar) elHerbivoresBar.style.width = `${Math.min(100, metrics.avgHerbivores)}%`;
        if (elPredatorsBar) elPredatorsBar.style.width = `${Math.min(100, metrics.avgPredators * 2)}%`;
        if (elApexBar) elApexBar.style.width = `${Math.min(100, metrics.avgApex * 3)}%`;

        // 3. 4x4 Ecological Grid
        if (elGrid) {
            elGrid.innerHTML = '';
            for (let r = 0; r < ecology.gridSize; r++) {
                for (let c = 0; c < ecology.gridSize; c++) {
                    const cell = ecology.grid[r][c];
                    const tileEl = document.createElement('div');
                    tileEl.className = `grid-tile biome-${cell.biome} ${cell.isWetland ? 'wetland' : ''} ${cell.invasive > 20 ? 'invasive-alert' : ''}`;
                    tileEl.dataset.r = r;
                    tileEl.dataset.c = c;

                    // Choose prominent species emoji
                    let mainIcon = '🌱';
                    if (cell.biome === 'reef') mainIcon = '🪸';
                    if (cell.biome === 'tundra') mainIcon = '❄️';
                    if (cell.biome === 'savanna') mainIcon = '🌾';

                    if (cell.apex >= 15) {
                        mainIcon = cell.biome === 'forest' ? '🐺' : cell.biome === 'reef' ? '🦦' : '🦁';
                    } else if (cell.herbivores >= 35) {
                        mainIcon = cell.biome === 'reef' ? '🟣' : '🦌'; // Sea urchin or deer
                    }
                    if (cell.invasive >= 30) mainIcon = '🐸'; // Invasive pest

                    tileEl.innerHTML = `
                        <div class="tile-icon">${mainIcon}</div>
                        <div class="tile-trophic-meters">
                            <div class="meter-row" title="Producers (Plants/Kelp)">
                                <span class="meter-lbl">P:</span>
                                <div class="meter-bar"><div class="fill prod" style="width: ${cell.producers}%;"></div></div>
                            </div>
                            <div class="meter-row" title="Herbivores">
                                <span class="meter-lbl">H:</span>
                                <div class="meter-bar"><div class="fill herb" style="width: ${cell.herbivores}%;"></div></div>
                            </div>
                            <div class="meter-row" title="Apex / Keystones">
                                <span class="meter-lbl">A:</span>
                                <div class="meter-bar"><div class="fill apex" style="width: ${cell.apex * 2}%;"></div></div>
                            </div>
                            ${cell.invasive > 0 ? `
                            <div class="meter-row" title="Invasive Threat">
                                <span class="meter-lbl" style="color:#ef4444;">I:</span>
                                <div class="meter-bar"><div class="fill inv" style="width: ${cell.invasive}%;"></div></div>
                            </div>` : ''}
                        </div>
                    `;

                    // Tile click listener for card placement
                    tileEl.addEventListener('click', () => {
                        if (selectedCard) {
                            const success = ecology.applyCard(selectedCard, r, c);
                            if (success) {
                                // Remove used card from hand and draw replacement
                                playerHand = playerHand.filter(cd => cd.uniqueId !== selectedCard.uniqueId);
                                if (playerHand.length < 4) drawHand(1);
                                selectedCard = null;
                                renderAll();
                            }
                        }
                    });

                    elGrid.appendChild(tileEl);
                }
            }
        }

        // 4. Hand Cards
        if (elHand) {
            elHand.innerHTML = '';
            playerHand.forEach(card => {
                const cardEl = document.createElement('div');
                cardEl.className = `op-card type-${card.type} ${selectedCard && selectedCard.uniqueId === card.uniqueId ? 'selected' : ''} ${ecology.energyAvailable < card.cost ? 'disabled' : ''}`;
                cardEl.innerHTML = `
                    <div class="card-top">
                        <span class="card-icon">${card.icon}</span>
                        <span class="card-cost">⚡ ${card.cost}</span>
                    </div>
                    <div class="card-title">${card.name}</div>
                    <div class="card-desc">${card.description}</div>
                `;

                cardEl.addEventListener('click', () => {
                    if (ecology.energyAvailable >= card.cost) {
                        selectedCard = selectedCard && selectedCard.uniqueId === card.uniqueId ? null : card;
                        renderAll();
                    }
                });

                elHand.appendChild(cardEl);
            });
        }

        // 5. Cascade Log
        if (elCascadeLog) {
            elCascadeLog.innerHTML = '';
            if (ecology.activeCascades.length === 0) {
                elCascadeLog.innerHTML = '<div class="empty-hint">No active trophic cascades triggered yet. Rebalance predator-prey chains!</div>';
            } else {
                ecology.activeCascades.slice(-4).reverse().forEach(casc => {
                    const div = document.createElement('div');
                    div.className = 'cascade-entry';
                    div.innerHTML = `✨ <b>CASCADE TRIGGER:</b> ${casc}`;
                    elCascadeLog.appendChild(div);
                });
            }
        }

        // 6. Victory condition check in Campaign
        if (currentMode === 'campaign') {
            checkScenarioVictory(metrics);
        }
    }

    function checkScenarioVictory(metrics) {
        const scenario = RESTORATION_SCENARIOS[currentScenarioIndex];
        if (!scenario) return;

        if (metrics.biodiversityScore >= scenario.targetBiodiversity) {
            audio.playEcosystemBloom();
            setTimeout(() => {
                const vicTitle = document.getElementById('victory-title');
                const vicMsg = document.getElementById('victory-msg');
                const vicStats = document.getElementById('victory-stats');

                if (vicTitle) vicTitle.textContent = "🌿 ECOSYSTEM RESTORATION COMPLETE!";
                if (vicMsg) vicMsg.textContent = `Splendid ecological stewardship! You restored the ${scenario.biome} keystone balance in ${ecology.day} days.`;
                if (vicStats) {
                    vicStats.innerHTML = `
                        <div class="stat-pill">Biodiversity: <b>${metrics.biodiversityScore}/100</b></div>
                        <div class="stat-pill">Solar Flux: <b>${ecology.energyAvailable} kcal</b></div>
                        <div class="stat-pill">Cascades Fired: <b>${ecology.activeCascades.length}</b></div>
                    `;
                }
                if (modalVictory) modalVictory.style.display = 'flex';
            }, 600);
        }
    }

    // Step Day listener
    if (btnStepDay) btnStepDay.addEventListener('click', () => {
        ecology.stepSimulation();
        renderAll();
    });

    // Auto Simulation toggle
    if (btnAutoSim) btnAutoSim.addEventListener('click', () => {
        isAutoTicking = !isAutoTicking;
        btnAutoSim.textContent = isAutoTicking ? '⏸️ Pause Sim' : '▶️ Real-Time Sim';
        btnAutoSim.classList.toggle('primary', isAutoTicking);

        if (isAutoTicking) {
            autoTickTimer = setInterval(() => {
                ecology.stepSimulation();
                renderAll();
            }, 1800);
        } else {
            if (autoTickTimer) clearInterval(autoTickTimer);
            autoTickTimer = null;
        }
    });

    // Audio Mute Toggle
    if (btnAudioToggle) btnAudioToggle.addEventListener('click', () => {
        const muted = audio.toggleMute();
        btnAudioToggle.textContent = muted ? '🔇' : '🔊';
    });

    // Modals
    if (btnHelp && modalHelp) btnHelp.addEventListener('click', () => modalHelp.style.display = 'flex');
    if (btnCloseHelp && modalHelp) btnCloseHelp.addEventListener('click', () => modalHelp.style.display = 'none');
    if (btnRetryScenario && modalVictory) btnRetryScenario.addEventListener('click', () => {
        modalVictory.style.display = 'none';
        loadScenario(currentScenarioIndex);
    });
    if (btnNextScenario && modalVictory) btnNextScenario.addEventListener('click', () => {
        modalVictory.style.display = 'none';
        if (currentScenarioIndex < RESTORATION_SCENARIOS.length - 1) {
            loadScenario(currentScenarioIndex + 1);
        }
    });

    // Mode Navigation
    modeNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            if (autoTickTimer) {
                clearInterval(autoTickTimer);
                autoTickTimer = null;
                isAutoTicking = false;
                if (btnAutoSim) btnAutoSim.textContent = '▶️ Real-Time Sim';
            }

            if (currentMode === 'campaign') {
                loadScenario(currentScenarioIndex);
            } else if (currentMode === 'survival') {
                startSurvivalMode();
            } else if (currentMode === 'sandbox') {
                startSandboxMode();
            }
        });
    });

    function startSurvivalMode() {
        elScenarioTitle.textContent = "🛡️ Biosphere Survival: Invasive Defense";
        elScenarioDesc.textContent = "Continuous waves of climate shocks and invasive pests threaten the biosphere. Hold the line!";
        elScenarioTarget.textContent = "Survive as many days as possible above 50 Biodiversity!";
        elScenarioHint.textContent = "Deploy Biocontrol agents rapidly when invasive frogs / lionfish emerge.";

        ecology.initGrid('forest');
        ecology.energyAvailable = 150;
        ecology.invasiveThreats = ['cane_toad', 'lionfish', 'kudzu'];
        drawHand(5);
        renderAll();
    }

    function startSandboxMode() {
        elScenarioTitle.textContent = "🔬 Free Ecological Sandbox";
        elScenarioDesc.textContent = "Unlimited solar energy. Experiment freely with Lotka-Volterra dynamics and trophic chain cascades.";
        elScenarioTarget.textContent = "Sandbox Mode Active";
        elScenarioHint.textContent = "Plant polycultures and observe natural predator-prey oscillations.";

        ecology.initGrid('forest');
        ecology.energyAvailable = 999;
        drawHand(5);
        renderAll();
    }

    // Initialize
    loadScenario(0);
});
