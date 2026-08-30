/**
 * CRIPTO-CIPHER: Main UI Application Controller
 * Frequency analysis visualization, substitution keyboard matrix, rotor controls, and timer loop.
 */

document.addEventListener('DOMContentLoaded', () => {
    const engine = window.criptoEngine;
    const audio = window.criptoAudio;
    const data = window.CRIPTO_DATA;

    let currentInterceptIndex = 0;
    let selectedCipherChar = 'A';
    let score = parseInt(localStorage.getItem('cripto_score') || '0', 10);
    let solvedIntercepts = JSON.parse(localStorage.getItem('cripto_solved') || '[]');

    // DOM Elements
    const interceptListEl = document.getElementById('intercept-list');
    const hudScore = document.getElementById('hud-score');
    const hudSolved = document.getElementById('hud-solved');

    // Intercept Header & Dossier
    const interceptTitleEl = document.getElementById('intercept-title');
    const interceptBadgeEl = document.getElementById('intercept-badge');
    const interceptOriginEl = document.getElementById('intercept-origin');
    const interceptHintEl = document.getElementById('intercept-hint');
    const cipherTypeTextEl = document.getElementById('cipher-type-text');
    const timerDisplay = document.getElementById('timer-display');
    const accuracyBarFill = document.getElementById('accuracy-bar-fill');
    const accuracyText = document.getElementById('accuracy-text');

    // Teleprinter Displays
    const rawCiphertextEl = document.getElementById('raw-ciphertext');
    const livePlaintextEl = document.getElementById('live-plaintext');

    // Controls Containers
    const caesarControls = document.getElementById('caesar-controls');
    const caesarShiftSlider = document.getElementById('caesar-shift-slider');
    const caesarShiftVal = document.getElementById('caesar-shift-val');

    const vigenereControls = document.getElementById('vigenere-controls');
    const vigenereInput = document.getElementById('vigenere-input');

    const enigmaControls = document.getElementById('enigma-controls');
    const rotor1Val = document.getElementById('rotor-1-val');
    const rotor2Val = document.getElementById('rotor-2-val');
    const rotor3Val = document.getElementById('rotor-3-val');

    const substitutionControls = document.getElementById('substitution-controls');
    const substGrid = document.getElementById('subst-grid');
    const plainCharPicker = document.getElementById('plain-char-picker');

    const freqChartEl = document.getElementById('freq-chart-bars');

    // Modals
    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    const btnFieldManual = document.getElementById('btn-field-manual');
    const modalManual = document.getElementById('modal-manual');
    const btnCloseManual = document.getElementById('btn-close-manual');

    const modalResult = document.getElementById('modal-result');
    const resultTitle = document.getElementById('result-title');
    const resultBadge = document.getElementById('result-badge');
    const resultDebrief = document.getElementById('result-debrief');
    const resultBonus = document.getElementById('result-bonus');
    const btnNextIntercept = document.getElementById('btn-next-intercept');
    const btnRetryIntercept = document.getElementById('btn-retry-intercept');

    function updateHUD() {
        hudScore.textContent = `${score.toLocaleString()} PTS`;
        hudSolved.textContent = `${solvedIntercepts.length} / ${data.intercepts.length}`;
    }
    updateHUD();

    // Render Intercept Navigation List
    function renderInterceptList() {
        interceptListEl.innerHTML = '';
        data.intercepts.forEach((item, idx) => {
            const isSolved = solvedIntercepts.includes(item.id);
            const isCurrent = idx === currentInterceptIndex;
            const btn = document.createElement('button');
            btn.className = `intercept-nav-item ${isCurrent ? 'active' : ''} ${isSolved ? 'solved' : ''}`;
            btn.innerHTML = `
                <div class="intercept-nav-header">
                    <span class="intercept-idx">#${String(item.id).padStart(2, '0')}</span>
                    <span class="intercept-status">${isSolved ? '🔓 CRACKED' : '🔒 ENCRYPTED'}</span>
                </div>
                <div class="intercept-title-text">${item.title}</div>
                <div class="intercept-type-text">${item.cipherTypeName}</div>
            `;
            btn.addEventListener('click', () => {
                audio.playClick();
                loadIntercept(idx);
            });
            interceptListEl.appendChild(btn);
        });
    }

    function loadIntercept(idx) {
        currentInterceptIndex = idx;
        const intercept = data.intercepts[idx];
        engine.loadIntercept(intercept);

        interceptTitleEl.textContent = intercept.title;
        interceptBadgeEl.textContent = intercept.badge;
        interceptOriginEl.textContent = intercept.origin;
        interceptHintEl.textContent = intercept.hint;
        cipherTypeTextEl.textContent = intercept.cipherTypeName;
        rawCiphertextEl.textContent = intercept.ciphertext;

        // Toggle Control Panels depending on Cipher Type
        caesarControls.classList.add('hidden');
        vigenereControls.classList.add('hidden');
        enigmaControls.classList.add('hidden');
        substitutionControls.classList.add('hidden');

        if (intercept.cipherType === 'caesar') {
            caesarControls.classList.remove('hidden');
            caesarShiftSlider.value = 0;
            caesarShiftVal.textContent = '0';
        } else if (intercept.cipherType === 'vigenere') {
            vigenereControls.classList.remove('hidden');
            vigenereInput.value = '';
        } else if (intercept.cipherType === 'enigma') {
            enigmaControls.classList.remove('hidden');
            updateEnigmaDisplay();
        } else {
            substitutionControls.classList.remove('hidden');
            renderSubstitutionGrid();
            renderPlainCharPicker();
        }

        renderFrequencyChart();
        renderInterceptList();
        modalResult.classList.add('hidden');
    }

    // Render Frequency Comparison Histogram
    function renderFrequencyChart() {
        freqChartEl.innerHTML = '';
        const letters = Object.keys(data.englishFreq);

        letters.slice(0, 15).forEach(ch => {
            const engPct = data.englishFreq[ch] || 0;
            const cipherPct = engine.ciphertextLetterFreq[ch] || 0;

            const col = document.createElement('div');
            col.className = 'freq-col';
            col.innerHTML = `
                <div class="freq-bars-pair">
                    <div class="freq-bar-eng" style="height: ${Math.min(100, engPct * 6)}px;" title="English standard: ${engPct}%"></div>
                    <div class="freq-bar-cipher" style="height: ${Math.min(100, cipherPct * 6)}px;" title="Ciphertext: ${cipherPct}%"></div>
                </div>
                <span class="freq-label">${ch}</span>
            `;
            freqChartEl.appendChild(col);
        });
    }

    // Render Substitution Matrix
    function renderSubstitutionGrid() {
        substGrid.innerHTML = '';
        const cipherUnique = Array.from(new Set(engine.currentIntercept.ciphertext.replace(/[^A-Z]/g, ''))).sort();

        cipherUnique.forEach(ch => {
            const mapped = engine.userSubstitution[ch] || '_';
            const isSelected = selectedCipherChar === ch;
            const cell = document.createElement('button');
            cell.className = `subst-cell ${isSelected ? 'active' : ''}`;
            cell.innerHTML = `
                <span class="cipher-letter">${ch}</span>
                <span class="arrow-sym">↓</span>
                <span class="plain-letter ${mapped !== '_' ? 'text-emerald-400 font-bold' : 'text-slate-500'}">${mapped}</span>
            `;
            cell.addEventListener('click', () => {
                audio.playClick();
                selectedCipherChar = ch;
                renderSubstitutionGrid();
            });
            substGrid.appendChild(cell);
        });
    }

    function renderPlainCharPicker() {
        plainCharPicker.innerHTML = '';
        for (let i = 65; i <= 90; i++) {
            const ch = String.fromCharCode(i);
            const btn = document.createElement('button');
            btn.className = 'plain-picker-btn';
            btn.textContent = ch;
            btn.addEventListener('click', () => {
                audio.ensureContext();
                engine.setSubstitution(selectedCipherChar, ch);
                renderSubstitutionGrid();
            });
            plainCharPicker.appendChild(btn);
        }

        // Clear key button
        const clearBtn = document.createElement('button');
        clearBtn.className = 'plain-picker-btn clear';
        clearBtn.textContent = '⌫ CLEAR';
        clearBtn.addEventListener('click', () => {
            audio.ensureContext();
            engine.setSubstitution(selectedCipherChar, null);
            renderSubstitutionGrid();
        });
        plainCharPicker.appendChild(clearBtn);
    }

    // Caesar Shift Slider
    caesarShiftSlider.addEventListener('input', (e) => {
        audio.ensureContext();
        const shift = parseInt(e.target.value, 10);
        caesarShiftVal.textContent = shift;
        engine.setCaesarShift(shift);
    });

    // Vigenere Keyword Input
    vigenereInput.addEventListener('input', (e) => {
        audio.ensureContext();
        engine.setVigenereKey(e.target.value);
    });

    // Enigma Rotor Buttons
    document.querySelectorAll('.rotor-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            audio.ensureContext();
            const rotorIdx = parseInt(btn.dataset.rotor, 10);
            const delta = parseInt(btn.dataset.delta, 10);
            engine.stepRotor(rotorIdx, delta);
            updateEnigmaDisplay();
        });
    });

    function updateEnigmaDisplay() {
        rotor1Val.textContent = String(engine.enigmaRotors[0]).padStart(2, '0');
        rotor2Val.textContent = String(engine.enigmaRotors[1]).padStart(2, '0');
        rotor3Val.textContent = String(engine.enigmaRotors[2]).padStart(2, '0');
    }

    // Keyboard type-to-substitute
    window.addEventListener('keydown', (e) => {
        if (engine.currentIntercept && engine.currentIntercept.cipherType === 'monoalphabetic') {
            const key = e.key.toUpperCase();
            if (key >= 'A' && key <= 'Z' && key.length === 1) {
                audio.ensureContext();
                engine.setSubstitution(selectedCipherChar, key);
                renderSubstitutionGrid();
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                audio.ensureContext();
                engine.setSubstitution(selectedCipherChar, null);
                renderSubstitutionGrid();
            }
        }
    });

    // Audio Toggle
    btnAudioToggle.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        btnAudioToggle.innerHTML = isMuted ? '🔇 <span class="hidden sm:inline">MUTED</span>' : '🔊 <span class="hidden sm:inline">SFX: ON</span>';
    });

    // Field Manual Modal
    btnFieldManual.addEventListener('click', () => {
        audio.playClick();
        modalManual.classList.remove('hidden');
    });

    btnCloseManual.addEventListener('click', () => {
        audio.playClick();
        modalManual.classList.add('hidden');
    });

    // Modal Actions
    btnNextIntercept.addEventListener('click', () => {
        audio.playClick();
        if (currentInterceptIndex < data.intercepts.length - 1) {
            loadIntercept(currentInterceptIndex + 1);
        } else {
            loadIntercept(0);
        }
    });

    btnRetryIntercept.addEventListener('click', () => {
        audio.playClick();
        loadIntercept(currentInterceptIndex);
    });

    // Main Game Loop (60 FPS)
    let lastTime = performance.now();
    function gameLoop(time) {
        const dtSec = (time - lastTime) * 0.001;
        lastTime = time;

        engine.update(dtSec);
        updateUI();

        requestAnimationFrame(gameLoop);
    }

    function updateUI() {
        if (!engine.currentIntercept) return;

        // Update Plaintext Teleprinter Screen
        livePlaintextEl.textContent = engine.getDecodedText();

        // Accuracy & Timer
        const acc = engine.getAccuracyPercentage();
        accuracyText.textContent = `${acc}%`;
        accuracyBarFill.style.width = `${acc}%`;

        const min = Math.floor(engine.timeRemainingSec / 60);
        const sec = Math.floor(engine.timeRemainingSec % 60);
        timerDisplay.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

        // Modals
        if (engine.isDecrypted && modalResult.classList.contains('hidden')) {
            showSuccessModal();
        } else if (engine.isTimeExpired && modalResult.classList.contains('hidden')) {
            showExpiredModal();
        }
    }

    function showSuccessModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "SIGNAL DECRYPTED!";
        resultTitle.className = "text-3xl font-black text-emerald-400 mb-2";
        resultBadge.textContent = "🔓 INTEL RECOVERED";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50";
        resultDebrief.textContent = engine.currentIntercept.debrief;

        const bonus = 1000;
        resultBonus.textContent = `+${bonus} PTS // CIPHER BROKEN`;

        if (!solvedIntercepts.includes(engine.currentIntercept.id)) {
            solvedIntercepts.push(engine.currentIntercept.id);
            localStorage.setItem('cripto_solved', JSON.stringify(solvedIntercepts));
            score += bonus;
            localStorage.setItem('cripto_score', score.toString());
            updateHUD();
            renderInterceptList();
        }
    }

    function showExpiredModal() {
        modalResult.classList.remove('hidden');
        resultTitle.textContent = "FREQUENCY HOPPED // LOST";
        resultTitle.className = "text-3xl font-black text-rose-500 mb-2";
        resultBadge.textContent = "⚠️ SIGNAL SELF-DESTRUCT";
        resultBadge.className = "px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50";
        resultDebrief.textContent = `Cryptanalytic Analysis: ${engine.currentIntercept.debrief}`;
        resultBonus.textContent = "+0 PTS (Try Again)";
    }

    // Initial Setup
    renderInterceptList();
    loadIntercept(0);
    requestAnimationFrame(gameLoop);
});
