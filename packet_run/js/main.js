/**
 * Packet Run: The Microarchitect - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    const audio = new AudioEngine();
    const vfx = new VFXEngine('vfx-canvas');
    const cpu = new CPUCore(audio, vfx);

    let currentMode = 'campaign'; // 'campaign', 'endless', 'sandbox'
    let currentLevelIndex = 0;
    let score = 0;
    let endlessTimer = null;
    let endlessScore = 0;
    let isDragging = false;
    let draggedIndex = null;

    // DOM Elements
    const elClockCycle = document.getElementById('hud-clock-cycle');
    const elIPC = document.getElementById('hud-ipc');
    const elRetired = document.getElementById('hud-retired');
    const elStalls = document.getElementById('hud-stalls');
    const elFlushes = document.getElementById('hud-flushes');
    const elCacheHit = document.getElementById('hud-cache-hit');
    const elBranchAcc = document.getElementById('hud-branch-acc');
    const elScore = document.getElementById('hud-score');

    const elFetchQueue = document.getElementById('fetch-queue-list');
    const elDispatchWindow = document.getElementById('dispatch-window-list');
    const elAlu0 = document.getElementById('unit-alu0');
    const elAlu1 = document.getElementById('unit-alu1');
    const elLsu = document.getElementById('unit-lsu');
    const elBru = document.getElementById('unit-bru');
    const elRegistersGrid = document.getElementById('registers-grid');
    const elL1Cache = document.getElementById('l1-cache-list');
    const elL2Cache = document.getElementById('l2-cache-list');
    const elMemoryGrid = document.getElementById('ram-memory-grid');
    const elBranchStateText = document.getElementById('branch-predictor-state-text');
    const elBranchDial = document.getElementById('branch-predictor-dial');

    const elLevelTitle = document.getElementById('level-title');
    const elLevelDesc = document.getElementById('level-desc');
    const elLevelTarget = document.getElementById('level-target');
    const elLevelTips = document.getElementById('level-tips');

    const btnStep = document.getElementById('btn-step');
    const btnRun = document.getElementById('btn-run');
    const btnPause = document.getElementById('btn-pause');
    const btnReset = document.getElementById('btn-reset');
    const btnSpeed1 = document.getElementById('btn-speed-1x');
    const btnSpeed2 = document.getElementById('btn-speed-2x');
    const btnSpeed5 = document.getElementById('btn-speed-5x');

    const btnAudioToggle = document.getElementById('btn-toggle-audio');
    const btnHelp = document.getElementById('btn-help');
    const modalHelp = document.getElementById('modal-help');
    const modalVictory = document.getElementById('modal-victory');
    const btnNextLevel = document.getElementById('btn-next-level');
    const btnRetryLevel = document.getElementById('btn-retry-level');
    const btnCloseHelp = document.getElementById('btn-close-help');

    const modeNavBtns = document.querySelectorAll('.mode-nav-btn');
    const sandboxPanel = document.getElementById('sandbox-panel');
    const btnAssembleRun = document.getElementById('btn-assemble-run');
    const textareaAsm = document.getElementById('sandbox-asm-code');

    // Register UI initialization
    function initRegistersUI() {
        if (!elRegistersGrid) return;
        elRegistersGrid.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const div = document.createElement('div');
            div.className = 'reg-cell';
            div.id = `reg-cell-${i}`;
            div.innerHTML = `
                <span class="reg-name">R${i}</span>
                <span class="reg-val" id="reg-val-${i}">0</span>
            `;
            elRegistersGrid.appendChild(div);
        }
    }

    // Memory UI initialization
    function initMemoryUI() {
        if (!elMemoryGrid) return;
        elMemoryGrid.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const div = document.createElement('div');
            div.className = 'mem-cell';
            div.id = `mem-cell-${i}`;
            div.innerHTML = `
                <span class="mem-addr">0x${i.toString(16).toUpperCase().padStart(2, '0')}</span>
                <span class="mem-val" id="mem-val-${i}">0</span>
            `;
            elMemoryGrid.appendChild(div);
        }
    }

    // Load Campaign Level
    function loadLevel(index) {
        currentLevelIndex = index;
        const level = CPU_LEVELS[currentLevelIndex];
        if (!level) return;

        elLevelTitle.textContent = level.title;
        elLevelDesc.textContent = level.description;
        elLevelTarget.textContent = `Target IPC: ≥ ${level.targetIPC} | Max Cycles: ${level.maxCycles}`;
        elLevelTips.textContent = `💡 Hint: ${level.tips}`;

        cpu.loadProgram(level.instructions, level.registers, level.memory);
        renderAll();
    }

    // Render All CPU Components
    function renderAll() {
        const stats = cpu.getStats();

        // 1. Top HUD stats
        if (elClockCycle) elClockCycle.textContent = stats.clockCycle;
        if (elIPC) elIPC.textContent = stats.ipc;
        if (elRetired) elRetired.textContent = stats.instructionsRetired;
        if (elStalls) elStalls.textContent = stats.stallsCount;
        if (elFlushes) elFlushes.textContent = stats.flushesCount;
        if (elCacheHit) elCacheHit.textContent = `${stats.cacheHitRate}%`;
        if (elBranchAcc) elBranchAcc.textContent = `${stats.branchAccuracy}%`;
        if (elScore) elScore.textContent = score;

        // 2. Fetch / Decode Queue
        if (elFetchQueue) {
            elFetchQueue.innerHTML = '';
            const upcoming = cpu.program.slice(cpu.pc, cpu.pc + 4);
            if (upcoming.length === 0 && cpu.decodeBuffer.length === 0) {
                elFetchQueue.innerHTML = '<div class="empty-hint">Fetch Buffer Idle</div>';
            } else {
                cpu.decodeBuffer.forEach(inst => {
                    const el = document.createElement('div');
                    el.className = 'inst-badge decoding';
                    el.innerHTML = `<span class="tag">DEC</span> <code>${inst.label || inst.op}</code>`;
                    elFetchQueue.appendChild(el);
                });
                upcoming.forEach(inst => {
                    const el = document.createElement('div');
                    el.className = 'inst-badge fetching';
                    el.innerHTML = `<span class="tag">IF</span> <code>${inst.label || inst.op}</code>`;
                    elFetchQueue.appendChild(el);
                });
            }
        }

        // 3. Dispatch Window (Reservation Station) - Interactive Drag & Drop / Reorder
        if (elDispatchWindow) {
            elDispatchWindow.innerHTML = '';
            if (cpu.dispatchWindow.length === 0) {
                elDispatchWindow.innerHTML = '<div class="empty-hint">Reservation Stations Empty</div>';
            } else {
                cpu.dispatchWindow.forEach((inst, idx) => {
                    const hazard = cpu.checkDataHazards(inst);
                    const el = document.createElement('div');
                    el.className = `dispatch-card ${hazard.hasHazard ? 'hazard-raw' : 'ready'}`;
                    el.draggable = true;
                    el.dataset.index = idx;

                    let hazardBadge = hazard.hasHazard 
                        ? `<span class="hazard-tag">⚠️ RAW (Wait ${hazard.hazardRegs.join(',')})</span>`
                        : `<span class="ready-tag">✓ Ready</span>`;

                    el.innerHTML = `
                        <div class="card-header">
                            <span class="slot-idx">#${idx + 1}</span>
                            ${hazardBadge}
                        </div>
                        <div class="inst-code">${inst.label || inst.op}</div>
                        <div class="card-footer">
                            <button class="btn-micro btn-move-up" ${idx === 0 ? 'disabled' : ''} title="Move Earlier">▲</button>
                            <button class="btn-micro btn-move-down" ${idx === cpu.dispatchWindow.length - 1 ? 'disabled' : ''} title="Move Later">▼</button>
                        </div>
                    `;

                    // Drag & Drop events
                    el.addEventListener('dragstart', (e) => {
                        draggedIndex = idx;
                        e.dataTransfer.effectAllowed = 'move';
                        el.classList.add('dragging');
                    });
                    el.addEventListener('dragend', () => {
                        el.classList.remove('dragging');
                        draggedIndex = null;
                    });
                    el.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                    });
                    el.addEventListener('drop', (e) => {
                        e.preventDefault();
                        if (draggedIndex !== null && draggedIndex !== idx) {
                            cpu.reorderDispatch(draggedIndex, idx);
                            renderAll();
                        }
                    });

                    // Quick micro buttons
                    const upBtn = el.querySelector('.btn-move-up');
                    const downBtn = el.querySelector('.btn-move-down');
                    if (upBtn) upBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        cpu.reorderDispatch(idx, idx - 1);
                        renderAll();
                    });
                    if (downBtn) downBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        cpu.reorderDispatch(idx, idx + 1);
                        renderAll();
                    });

                    elDispatchWindow.appendChild(el);
                });
            }
        }

        // 4. Execution Units
        updateExecUnitUI(elAlu0, cpu.execUnits.alu0, 'ALU 0');
        updateExecUnitUI(elAlu1, cpu.execUnits.alu1, 'ALU 1');
        updateExecUnitUI(elLsu, cpu.execUnits.lsu, 'LSU (Memory)');
        updateExecUnitUI(elBru, cpu.execUnits.bru, 'BRU (Branch)');

        // 5. Registers
        for (let i = 0; i < 8; i++) {
            const valEl = document.getElementById(`reg-val-${i}`);
            const cellEl = document.getElementById(`reg-cell-${i}`);
            if (valEl) {
                const oldVal = valEl.textContent;
                const newVal = cpu.registers[i];
                valEl.textContent = newVal;
                if (oldVal !== String(newVal) && stats.clockCycle > 0) {
                    cellEl.classList.add('updated');
                    setTimeout(() => cellEl.classList.remove('updated'), 600);
                }
            }
        }

        // 6. Memory Table
        for (let i = 0; i < 16; i++) {
            const memValEl = document.getElementById(`mem-val-${i}`);
            if (memValEl) {
                memValEl.textContent = cpu.memory[i];
            }
        }

        // 7. L1 & L2 Cache
        if (elL1Cache) {
            elL1Cache.innerHTML = '';
            cpu.l1Cache.forEach((line, idx) => {
                const div = document.createElement('div');
                div.className = `cache-line ${line.valid ? 'valid' : 'empty'}`;
                div.innerHTML = line.valid 
                    ? `<span class="line-tag">Tag: 0x${line.tag.toString(16).toUpperCase()}</span><span class="line-data">${line.data}</span>`
                    : `<span class="line-tag">Line ${idx}</span><span class="line-data">[Empty]</span>`;
                elL1Cache.appendChild(div);
            });
        }
        if (elL2Cache) {
            elL2Cache.innerHTML = '';
            cpu.l2Cache.forEach((line, idx) => {
                const div = document.createElement('div');
                div.className = `cache-line ${line.valid ? 'valid' : 'empty'}`;
                div.innerHTML = line.valid 
                    ? `<span class="line-tag">Tag: 0x${line.tag.toString(16).toUpperCase()}</span><span class="line-data">${line.data}</span>`
                    : `<span class="line-tag">L2 #${idx}</span><span class="line-data">[Empty]</span>`;
                elL2Cache.appendChild(div);
            });
        }

        // 8. Branch Predictor Dial
        if (elBranchStateText && elBranchDial) {
            const states = ['Strongly Not Taken (00)', 'Weakly Not Taken (01)', 'Weakly Taken (10)', 'Strongly Taken (11)'];
            elBranchStateText.textContent = states[cpu.branchPredictorState];
            const angles = [-45, -15, 15, 45];
            elBranchDial.style.transform = `rotate(${angles[cpu.branchPredictorState]}deg)`;
        }

        // 9. Check Victory / Halt in Campaign
        if (stats.isHalted && currentMode === 'campaign') {
            checkLevelVictory(stats);
        }
    }

    function updateExecUnitUI(el, unit, unitName) {
        if (!el) return;
        if (unit.busy && unit.inst) {
            el.className = 'unit-box active';
            el.innerHTML = `
                <div class="unit-name">${unitName} <span class="badge-busy">BUSY</span></div>
                <div class="unit-inst"><code>${unit.inst.label || unit.inst.op}</code></div>
                <div class="unit-cycles">Remaining: ${unit.cyclesLeft} cyc</div>
            `;
        } else {
            el.className = 'unit-box idle';
            el.innerHTML = `
                <div class="unit-name">${unitName} <span class="badge-idle">IDLE</span></div>
                <div class="unit-inst text-muted">— Ready —</div>
                <div class="unit-cycles">0 cyc</div>
            `;
        }
    }

    function checkLevelVictory(stats) {
        const level = CPU_LEVELS[currentLevelIndex];
        const achievedIPC = parseFloat(stats.ipc);
        const passed = achievedIPC >= (level.targetIPC * 0.9) && stats.clockCycle <= level.maxCycles + 4;

        setTimeout(() => {
            const vicTitle = document.getElementById('victory-title');
            const vicMsg = document.getElementById('victory-msg');
            const vicStats = document.getElementById('victory-stats');

            if (passed) {
                const bonus = Math.round(achievedIPC * 1000) - stats.stallsCount * 50;
                score += Math.max(200, bonus);
                if (vicTitle) vicTitle.textContent = "⚡ STAGE OPTIMIZATION COMPLETE!";
                if (vicMsg) vicMsg.textContent = `Superb dispatching! You achieved an IPC of ${stats.ipc} across ${stats.clockCycle} clock cycles.`;
                if (btnNextLevel) btnNextLevel.style.display = currentLevelIndex < CPU_LEVELS.length - 1 ? 'inline-block' : 'none';
            } else {
                if (vicTitle) vicTitle.textContent = "⚠️ PIPELINE EFFICIENCY WARNING";
                if (vicMsg) vicMsg.textContent = `IPC was ${stats.ipc} (Target: ${level.targetIPC}) with ${stats.stallsCount} pipeline stalls. Reorder independent instructions to maximize ALU parallelization!`;
                if (btnNextLevel) btnNextLevel.style.display = 'none';
            }

            if (vicStats) {
                vicStats.innerHTML = `
                    <div class="stat-pill">Cycles: <b>${stats.clockCycle}</b></div>
                    <div class="stat-pill">IPC: <b>${stats.ipc}</b></div>
                    <div class="stat-pill">Stalls: <b>${stats.stallsCount}</b></div>
                    <div class="stat-pill">Cache Hit: <b>${stats.cacheHitRate}%</b></div>
                `;
            }

            if (modalVictory) modalVictory.style.display = 'flex';
        }, 500);
    }

    // CPU Cycle Hook
    cpu.onCycleTick = () => {
        renderAll();
    };

    // Button Listeners
    if (btnStep) btnStep.addEventListener('click', () => {
        cpu.pause();
        cpu.stepCycle();
    });

    if (btnRun) btnRun.addEventListener('click', () => {
        cpu.startAutoRun(cpu.clockSpeedMs);
    });

    if (btnPause) btnPause.addEventListener('click', () => {
        cpu.pause();
        renderAll();
    });

    if (btnReset) btnReset.addEventListener('click', () => {
        cpu.pause();
        if (currentMode === 'campaign') {
            loadLevel(currentLevelIndex);
        } else if (currentMode === 'sandbox') {
            assembleAndLoadSandbox();
        }
    });

    if (btnSpeed1) btnSpeed1.addEventListener('click', () => {
        setActiveSpeed(btnSpeed1, 700);
    });
    if (btnSpeed2) btnSpeed2.addEventListener('click', () => {
        setActiveSpeed(btnSpeed2, 350);
    });
    if (btnSpeed5) btnSpeed5.addEventListener('click', () => {
        setActiveSpeed(btnSpeed5, 120);
    });

    function setActiveSpeed(btn, ms) {
        document.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cpu.clockSpeedMs = ms;
        if (cpu.isRunning) {
            cpu.startAutoRun(ms);
        }
    }

    // Audio Mute Toggle
    if (btnAudioToggle) btnAudioToggle.addEventListener('click', () => {
        const muted = audio.toggleMute();
        btnAudioToggle.textContent = muted ? '🔇' : '🔊';
        btnAudioToggle.classList.toggle('muted', muted);
    });

    // Modals
    if (btnHelp && modalHelp) btnHelp.addEventListener('click', () => modalHelp.style.display = 'flex');
    if (btnCloseHelp && modalHelp) btnCloseHelp.addEventListener('click', () => modalHelp.style.display = 'none');
    if (btnRetryLevel && modalVictory) btnRetryLevel.addEventListener('click', () => {
        modalVictory.style.display = 'none';
        loadLevel(currentLevelIndex);
    });
    if (btnNextLevel && modalVictory) btnNextLevel.addEventListener('click', () => {
        modalVictory.style.display = 'none';
        if (currentLevelIndex < CPU_LEVELS.length - 1) {
            loadLevel(currentLevelIndex + 1);
        }
    });

    // Mode Navigation
    modeNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            cpu.pause();

            if (currentMode === 'campaign') {
                if (sandboxPanel) sandboxPanel.style.display = 'none';
                loadLevel(currentLevelIndex);
            } else if (currentMode === 'endless') {
                if (sandboxPanel) sandboxPanel.style.display = 'none';
                startEndlessOverclock();
            } else if (currentMode === 'sandbox') {
                if (sandboxPanel) sandboxPanel.style.display = 'block';
                assembleAndLoadSandbox();
            }
        });
    });

    // Sandbox Assembly compiler
    function assembleAndLoadSandbox() {
        if (!textareaAsm) return;
        const code = textareaAsm.value;
        const parsed = parseAssembly(code);
        if (parsed.length === 0) return;

        elLevelTitle.textContent = "Assembly Sandbox Lab";
        elLevelDesc.textContent = "Custom microcode running on the superscalar execution pipeline.";
        elLevelTarget.textContent = `Compiled: ${parsed.length} Instructions`;
        elLevelTips.textContent = "Observe RAW hazards, branch predictions, and cache hits in real-time!";

        cpu.loadProgram(parsed, {}, { 0: 42, 4: 100, 8: 7 });
        renderAll();
    }

    if (btnAssembleRun) btnAssembleRun.addEventListener('click', () => {
        assembleAndLoadSandbox();
        cpu.startAutoRun(cpu.clockSpeedMs);
    });

    // Endless Overclock Mode
    function startEndlessOverclock() {
        elLevelTitle.textContent = "⚡ Endless Clock Stress Test";
        elLevelDesc.textContent = "The CPU clock frequency accelerates continuously! Reorder instructions to clear bubbles before the pipeline overflows.";
        elLevelTarget.textContent = "Survive as many instruction cycles as possible!";
        elLevelTips.textContent = "Keep IPC high to earn Overclock multipliers!";

        const ops = ['ADD', 'SUB', 'MUL', 'LOAD', 'STORE'];
        const randomProgram = [];
        for (let i = 0; i < 40; i++) {
            const op = ops[Math.floor(Math.random() * ops.length)];
            const rA = `R${Math.floor(Math.random() * 6)}`;
            const rB = `R${Math.floor(Math.random() * 6)}`;
            const rC = `R${Math.floor(Math.random() * 6)}`;
            if (op === 'ADD' || op === 'SUB') {
                randomProgram.push({ op, rd: rA, rs1: rB, rs2: `#${Math.floor(Math.random() * 20)}`, label: `${op} ${rA}, ${rB}, #${Math.floor(Math.random() * 20)}` });
            } else if (op === 'MUL') {
                randomProgram.push({ op, rd: rA, rs1: rB, rs2: `#${Math.floor(Math.random() * 8)}`, label: `MUL ${rA}, ${rB}, #${Math.floor(Math.random() * 8)}` });
            } else if (op === 'LOAD') {
                const addr = Math.floor(Math.random() * 8) * 2;
                randomProgram.push({ op, rd: rA, addr, label: `LOAD ${rA}, [0x0${addr}]` });
            } else if (op === 'STORE') {
                const addr = Math.floor(Math.random() * 8) * 2;
                randomProgram.push({ op, rs1: rA, addr, label: `STORE ${rA}, [0x0${addr}]` });
            }
        }

        cpu.loadProgram(randomProgram, { R0: 5, R1: 10, R2: 2, R3: 7 }, { 0: 10, 2: 20, 4: 30, 6: 40 });
        renderAll();
        cpu.startAutoRun(500);
    }

    // Initialize UI
    initRegistersUI();
    initMemoryUI();
    loadLevel(0);
});
