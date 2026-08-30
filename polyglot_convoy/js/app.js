/**
 * POLYGLOT CONVOY: Main UI Application Controller
 * Real-time keyboard event capture, conveyor render, WPM telemetry, and modal workflows.
 */

document.addEventListener('DOMContentLoaded', () => {
    const engine = window.polyglotEngine;
    const audio = window.polyglotAudio;
    const data = window.POLYGLOT_DATA;

    let currentMissionIndex = 0;
    let score = parseInt(localStorage.getItem('polyglot_score') || '0', 10);
    let solvedMissions = JSON.parse(localStorage.getItem('polyglot_solved') || '[]');

    // DOM Elements
    const missionListEl = document.getElementById('mission-list');
    const hudScore = document.getElementById('hud-score');
    const hudSolved = document.getElementById('hud-solved');

    // Telemetry Displays
    const valWpm = document.getElementById('val-wpm');
    const valAccuracy = document.getElementById('val-accuracy');
    const valStreak = document.getElementById('val-streak');
    const valMultiplier = document.getElementById('val-multiplier');
    const valTimer = document.getElementById('val-timer');

    // Mission Dossier
    const missionTitleEl = document.getElementById('mission-title');
    const missionBadgeEl = document.getElementById('mission-badge');
    const missionDescEl = document.getElementById('mission-desc');
    const missionTargetWpm = document.getElementById('mission-target-wpm');
    const missionPearlEl = document.getElementById('mission-pearl');
    const missionProgressFill = document.getElementById('mission-progress-fill');
    const missionProgressText = document.getElementById('mission-progress-text');

    // Conveyor Track
    const activeSourcePhraseEl = document.getElementById('active-source-phrase');
    const activeSourceHintEl = document.getElementById('active-source-hint');
    const typingBoxesContainer = document.getElementById('typing-boxes-container');
    const upcomingQueueEl = document.getElementById('upcoming-queue');
    const hiddenTypingInput = document.getElementById('hidden-typing-input');

    // Modals
    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    const btnGrammarCodex = document.getElementById('btn-grammar-codex');
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
            const lang = data.languages[m.language] || { flag: "🌐", name: "Multi" };
            const item = document.createElement('button');
            item.className = `mission-nav-item ${isCurrent ? 'active' : ''} ${isSolved ? 'solved' : ''}`;
            item.innerHTML = `
                <div class="mission-nav-header">
                    <span class="mission-idx">#${String(m.id).padStart(2, '0')}</span>
                    <span class="mission-status">${isSolved ? '⚡ TRANSLATED' : '📦 IN TRANSIT'}</span>
                </div>
                <div class="mission-title-text">${lang.flag} ${m.title}</div>
                <div class="mission-wpm-text">Target: ${m.wpmTarget} WPM // ${m.phrases.length} Phrases</div>
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

        const lang = data.languages[m.language] || { flag: "🌐", name: "Multilingual" };
        missionTitleEl.textContent = `${lang.flag} ${m.title}`;
        missionBadgeEl.textContent = m.badge;
        missionDescEl.textContent = m.description;
        missionTargetWpm.textContent = `${m.wpmTarget} WPM`;
        missionPearlEl.textContent = m.grammarPearl;

        renderConveyor();
        renderMissionList();
        modalResult.classList.add('hidden');

        // Focus hidden input for mobile keyboards
        hiddenTypingInput.focus();
    }

    // Render Conveyor Track & Letter Boxes
    function renderConveyor() {
        const targetObj = engine.getCurrentTargetPhrase();
        if (!targetObj) return;

        activeSourcePhraseEl.textContent = targetObj.source;
        activeSourceHintEl.textContent = `💡 Hint: ${targetObj.hint}`;

        // Render Letter Boxes for Current Target
        typingBoxesContainer.innerHTML = '';
        const targetStr = targetObj.target.toUpperCase();
        const typedStr = engine.typedBuffer;

        for (let i = 0; i < targetStr.length; i++) {
            const expectedChar = targetStr[i];
            const typedChar = typedStr[i];
            const isCurrent = i === typedStr.length;

            const box = document.createElement('div');
            box.className = `type-letter-box ${isCurrent ? 'current' : ''} ${expectedChar === ' ' ? 'space' : ''}`;

            if (typedChar !== undefined) {
                box.classList.add('matched');
                box.textContent = typedChar === ' ' ? '␣' : typedChar;
            } else {
                box.textContent = expectedChar === ' ' ? '␣' : expectedChar;
            }

            typingBoxesContainer.appendChild(box);
        }

        // Render Upcoming Queue
        upcomingQueueEl.innerHTML = '';
        const remaining = engine.activePhrases.slice(engine.currentPhraseIndex + 1);
        if (remaining.length === 0) {
            upcomingQueueEl.innerHTML = '<div class="text-xs text-slate-500 font-mono italic">Final dispatch in progress!</div>';
        } else {
            remaining.forEach((p, idx) => {
                const item = document.createElement('div');
                item.className = 'queue-pill';
                item.textContent = `#${idx + 2} ${p.source}`;
                upcomingQueueEl.appendChild(item);
            });
        }
    }

    // Keyboard Event Listener
    window.addEventListener('keydown', (e) => {
        if (engine.isMissionComplete || engine.isFailed) return;
        audio.ensureContext();

        if (e.key === 'Backspace') {
            e.preventDefault();
            engine.handleBackspace();
            renderConveyor();
            return;
        }

        // Accept alphanumeric and space
        if (e.key.length === 1) {
            e.preventDefault();
            engine.processKeystroke(e.key);
            renderConveyor();
        }
    });

    // Hidden input support for mobile
    hiddenTypingInput.addEventListener('input', (e) => {
        if (e.data) {
            engine.processKeystroke(e.data[e.data.length - 1]);
            renderConveyor();
        }
        hiddenTypingInput.value = "";
    });

    document.body.addEventListener('click', () => {
        hiddenTypingInput.focus();
    });

    // Audio Toggle
    btnAudioToggle.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        btnAudioToggle.innerHTML = isMuted ? '🔇 <span class="hidden sm:inline">MUTED</span>' : '🔊 <span class="hidden sm:inline">SFX: ON</span>';
    });

    // Grammar Codex Modal
    btnGrammarCodex.addEventListener('click', () => {
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
        data.missions.forEach(m => {
            const card = document.createElement('div');
            card.className = 'codex-card';
            card.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <h4 class="font-bold text-sm text-cyan-400">${m.title}</h4>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">${m.badge}</span>
                </div>
                <p class="text-xs text-amber-300/90 leading-relaxed font-mono">${m.grammarPearl}</p>
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

    // Main Loop (60 FPS)
    let lastTime = performance.now();
    function gameLoop(time) {
        const dtSec = (time - lastTime) * 0.001;
        lastTime = time;

        engine.update(dtSec);
        updateUI();

        requestAnimationFrame(gameLoop);
    }

    function updateUI() {
        if (!engine.currentMission) return;

        // Telemetry
        const wpm = engine.calculateWPM();
        valWpm.textContent = wpm;
        valAccuracy.textContent = `${engine.calculateAccuracy()}%`;
        valStreak.textContent = engine.comboStreak;
        valMultiplier.textContent = `${engine.multiplier}X`;

        const min = Math.floor(engine.timeRemainingSec / 60);
        const sec = Math.floor(engine.timeRemainingSec % 60);
        valTimer.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

        // Progress
        const total = engine.activePhrases.length;
        const current = engine.currentPhraseIndex;
        const progPct = Math.min(100, Math.round((current / total) * 100));
        missionProgressFill.style.width = `${progPct}%`;
        missionProgressText.textContent = `${progPct}% (${current}/${total})`;

        // Modals
        if (engine.isMissionComplete && modalResult.classList.contains('hidden')) {
            showSuccessModal();
        } else if (engine.isFailed && modalResult.classList.contains('hidden')) {
            showFailedModal();
        }
    }

    function showSuccessModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "CONVOY DELIVERED!";
        resultTitle.className = "text-3xl font-black text-emerald-400 mb-2";
        resultBadge.textContent = "⚡ TRANSLATION DISPATCH COMPLETE";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50";
        resultPearl.textContent = engine.currentMission.grammarPearl;

        const bonus = 1500;
        resultBonus.textContent = `+${bonus} PTS // WPM: ${engine.calculateWPM()} // ACC: ${engine.calculateAccuracy()}%`;

        if (!solvedMissions.includes(engine.currentMission.id)) {
            solvedMissions.push(engine.currentMission.id);
            localStorage.setItem('polyglot_solved', JSON.stringify(solvedMissions));
            score += bonus;
            localStorage.setItem('polyglot_score', score.toString());
            updateHUD();
            renderMissionList();
        }
    }

    function showFailedModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "CONVOY MISSED DEADLINE";
        resultTitle.className = "text-3xl font-black text-rose-500 mb-2";
        resultBadge.textContent = "⏱️ TELEPRINTER TIMEOUT";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50";
        resultPearl.textContent = "Review the vocabulary and grammar rules in the Codex to increase your typing velocity!";
        resultBonus.textContent = "+0 PTS (Try Again)";
    }

    // Initial Setup
    renderMissionList();
    loadMission(0);
    requestAnimationFrame(gameLoop);
});
