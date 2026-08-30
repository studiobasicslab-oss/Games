/**
 * Geo Detective - Main Application Controller
 */

class GeoDetectiveApp {
    constructor() {
        this.cases = window.GEO_CASES || [];
        this.currentCaseIndex = 0;
        this.currentClueIndex = 0;
        this.activeCase = null;
        this.solvedCases = this.loadSolvedCases();
        this.currentCaseClueHistory = [];
        this.hintsUnlocked = 0;
        this.stats = this.loadStats();
        this.currentNote = localStorage.getItem('geo_detective_notes') || '';
        this.isTyping = false;
    }

    init() {
        this.bindEvents();
        this.loadInitialCase();
        this.renderCaseSelectorList();
        this.updateStatsUI();
        this.initNotes();
    }

    loadSolvedCases() {
        try {
            return JSON.parse(localStorage.getItem('geo_detective_solved_cases')) || {};
        } catch (e) {
            return {};
        }
    }

    saveSolvedCase(caseId) {
        this.solvedCases[caseId] = {
            solvedAt: new Date().toISOString(),
            hintsUsed: this.hintsUnlocked
        };
        localStorage.setItem('geo_detective_solved_cases', JSON.stringify(this.solvedCases));
    }

    loadStats() {
        try {
            return JSON.parse(localStorage.getItem('geo_detective_stats')) || {
                casesSolved: 0,
                cluesSolved: 0,
                incorrectGuesses: 0,
                hintsRequested: 0
            };
        } catch (e) {
            return { casesSolved: 0, cluesSolved: 0, incorrectGuesses: 0, hintsRequested: 0 };
        }
    }

    saveStats() {
        localStorage.setItem('geo_detective_stats', JSON.stringify(this.stats));
        this.updateStatsUI();
    }

    loadInitialCase(index = 0) {
        this.currentCaseIndex = index;
        this.activeCase = this.cases[this.currentCaseIndex] || this.cases[0];
        this.currentClueIndex = 0;
        this.currentCaseClueHistory = [];
        this.hintsUnlocked = 0;

        // Initialize or update Map
        if (!window.geoMapEngine.map) {
            window.geoMapEngine.init('recon-map', this.activeCase.initialCenter, this.activeCase.initialZoom);
        } else {
            window.geoMapEngine.clearMarkers();
            window.geoMapEngine.flyToLocation(this.activeCase.initialCenter[0], this.activeCase.initialCenter[1], this.activeCase.initialZoom);
        }

        this.renderCaseHeader();
        this.renderActiveClue();
        this.renderEvidenceLog();
        this.hideSolvedModal();
    }

    renderCaseHeader() {
        const caseObj = this.activeCase;
        if (!caseObj) return;

        document.getElementById('case-num-badge').textContent = caseObj.caseNumber;
        document.getElementById('case-title').textContent = caseObj.title;
        document.getElementById('case-category-badge').textContent = caseObj.typeBadge;
        document.getElementById('case-difficulty-badge').textContent = `Diff: ${caseObj.difficulty}`;
        document.getElementById('case-region-badge').textContent = `📍 ${caseObj.locationRegion}`;
        document.getElementById('case-briefing-text').textContent = caseObj.briefing;

        this.updateClueProgressHUD();
    }

    updateClueProgressHUD() {
        const total = this.activeCase.clues.length;
        const current = this.currentClueIndex + 1;
        document.getElementById('clue-step-counter').textContent = `CLUE ${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        
        // Progress bar
        const pct = ((this.currentClueIndex) / total) * 100;
        const bar = document.getElementById('case-progress-bar');
        if (bar) bar.style.width = `${pct}%`;
    }

    renderActiveClue() {
        const clue = this.activeCase.clues[this.currentClueIndex];
        if (!clue) return;

        this.hintsUnlocked = 0;
        this.updateHintsUI();

        // Clue titles and type
        document.getElementById('clue-badge-type').textContent = clue.evidenceType;
        document.getElementById('clue-title-text').textContent = clue.title;
        
        // Animated typewriter text for clue
        const textContainer = document.getElementById('clue-narrative-text');
        this.typewriterEffect(textContainer, clue.clueText);

        document.getElementById('clue-prompt-question').textContent = clue.taskPrompt;
        const input = document.getElementById('player-answer-input');
        input.value = '';
        input.placeholder = clue.inputPlaceholder || "Enter deduced location or name...";
        input.focus();

        // Clear feedback banner
        const feedbackEl = document.getElementById('clue-feedback-banner');
        feedbackEl.classList.add('hidden');
        feedbackEl.innerHTML = '';

        // Configure External Map Launchers for Current Clue
        this.setupMapLaunchers(clue);
    }

    setupMapLaunchers(clue) {
        const btnMaps = document.getElementById('btn-open-gmaps');
        const btnStreet = document.getElementById('btn-open-streetview');
        const btnEarth = document.getElementById('btn-open-earth');

        if (btnMaps) {
            btnMaps.onclick = () => {
                window.geoAudio.playClick();
                window.geoMapEngine.openGoogleMapsSearch(this.activeCase.locationRegion);
            };
        }
        if (btnStreet) {
            btnStreet.onclick = () => {
                window.geoAudio.playClick();
                window.geoMapEngine.openStreetView(clue.coordinates.lat, clue.coordinates.lng);
            };
        }
        if (btnEarth) {
            btnEarth.onclick = () => {
                window.geoAudio.playClick();
                window.geoMapEngine.openGoogleEarth(clue.coordinates.lat, clue.coordinates.lng);
            };
        }
    }

    typewriterEffect(element, text) {
        if (!element) return;
        element.innerHTML = '';
        this.isTyping = true;
        let index = 0;

        const interval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                if (index % 3 === 0) {
                    window.geoAudio.playTypewriter();
                }
                index++;
            } else {
                clearInterval(interval);
                this.isTyping = false;
            }
        }, 14);
    }

    normalizeText(str) {
        return (str || '')
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove diacritics / accents
            .replace(/['".,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    handleSubmitAnswer() {
        const input = document.getElementById('player-answer-input');
        const rawGuess = input.value.trim();
        if (!rawGuess) return;

        const clue = this.activeCase.clues[this.currentClueIndex];
        const normalizedGuess = this.normalizeText(rawGuess);

        // Check if guess matches any accepted answers
        const isMatch = clue.acceptedAnswers.some(ans => {
            const normAns = this.normalizeText(ans);
            return normalizedGuess === normAns || normalizedGuess.includes(normAns) || normAns.includes(normalizedGuess);
        });

        if (isMatch) {
            this.handleCorrectClue(clue, rawGuess);
        } else {
            this.handleIncorrectClue(clue, rawGuess, normalizedGuess);
        }
    }

    handleCorrectClue(clue, rawGuess) {
        window.geoAudio.playCorrect();
        this.stats.cluesSolved++;
        this.saveStats();

        // Mark solved waypoint on map
        window.geoMapEngine.addEvidenceMarker(
            clue.coordinates.lat,
            clue.coordinates.lng,
            clue.title,
            clue.verificationStory.replace(/\*\*/g, ''),
            true
        );
        window.geoMapEngine.flyToLocation(clue.coordinates.lat, clue.coordinates.lng, clue.mapZoom || 15);

        // Show verified feedback
        const feedbackEl = document.getElementById('clue-feedback-banner');
        feedbackEl.className = 'p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/70 text-emerald-200 text-sm mb-4 animate-fade-in flex items-start gap-3';
        feedbackEl.innerHTML = `
            <div class="text-xl">✅</div>
            <div>
                <div class="font-bold text-emerald-300 uppercase text-xs tracking-wider mb-1 font-mono">DEDUCTION VERIFIED</div>
                <div>${clue.verificationStory}</div>
            </div>
        `;

        // Record into case history
        this.currentCaseClueHistory.push({
            clueNumber: clue.clueNumber,
            title: clue.title,
            answer: rawGuess,
            story: clue.verificationStory,
            coordinates: clue.coordinates
        });

        this.renderEvidenceLog();

        // Check if case is completely solved
        if (this.currentClueIndex + 1 >= this.activeCase.clues.length) {
            setTimeout(() => {
                this.handleCaseCompleted();
            }, 1200);
        } else {
            // Next clue button or auto proceed
            setTimeout(() => {
                this.currentClueIndex++;
                this.updateClueProgressHUD();
                this.renderActiveClue();
            }, 2000);
        }
    }

    handleIncorrectClue(clue, rawGuess, normalizedGuess) {
        this.stats.incorrectGuesses++;
        this.saveStats();

        const feedbackEl = document.getElementById('clue-feedback-banner');
        feedbackEl.classList.remove('hidden');

        // Check smart feedback table
        let customMessage = null;
        if (clue.smartFeedback) {
            for (let [triggerKey, reply] of Object.entries(clue.smartFeedback)) {
                if (normalizedGuess.includes(this.normalizeText(triggerKey))) {
                    customMessage = reply;
                    break;
                }
            }
        }

        if (customMessage) {
            window.geoAudio.playWarm();
            feedbackEl.className = 'p-4 rounded-xl border border-amber-500/40 bg-amber-950/70 text-amber-200 text-sm mb-4 animate-fade-in flex items-start gap-3';
            feedbackEl.innerHTML = `
                <div class="text-xl">🧭</div>
                <div>
                    <div class="font-bold text-amber-300 uppercase text-xs tracking-wider mb-1 font-mono">INTELLIGENCE RADAR FEEDBACK</div>
                    <div>${customMessage}</div>
                </div>
            `;
        } else {
            window.geoAudio.playWrong();
            feedbackEl.className = 'p-4 rounded-xl border border-rose-500/40 bg-rose-950/70 text-rose-200 text-sm mb-4 animate-fade-in flex items-start gap-3';
            feedbackEl.innerHTML = `
                <div class="text-xl">❌</div>
                <div>
                    <div class="font-bold text-rose-300 uppercase text-xs tracking-wider mb-1 font-mono">INCORRECT RECONNAISSANCE</div>
                    <div>Location coordinates do not match field evidence. Re-examine the clue wording or request HQ Intel.</div>
                </div>
            `;
        }
    }

    requestHint() {
        const clue = this.activeCase.clues[this.currentClueIndex];
        if (!clue || !clue.hints) return;

        if (this.hintsUnlocked < clue.hints.length) {
            this.hintsUnlocked++;
            this.stats.hintsRequested++;
            this.saveStats();
            window.geoAudio.playClick();
            this.updateHintsUI();
        }
    }

    updateHintsUI() {
        const clue = this.activeCase.clues[this.currentClueIndex];
        const container = document.getElementById('hints-container');
        const btnHint = document.getElementById('btn-request-hint');

        if (!container || !clue) return;

        if (this.hintsUnlocked === 0) {
            container.innerHTML = `<div class="text-xs text-slate-500 italic">No HQ intelligence requested yet. Press the button above if you need a field tip.</div>`;
            if (btnHint) btnHint.disabled = false;
        } else {
            let html = '';
            for (let i = 0; i < this.hintsUnlocked; i++) {
                html += `
                    <div class="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-amber-200 mb-2 flex items-start gap-2">
                        <span class="font-mono text-amber-400 font-bold">#${i + 1}:</span>
                        <span>${clue.hints[i]}</span>
                    </div>
                `;
            }
            container.innerHTML = html;

            if (this.hintsUnlocked >= clue.hints.length) {
                if (btnHint) {
                    btnHint.disabled = true;
                    btnHint.textContent = "All Intel Unlocked";
                }
            } else {
                if (btnHint) {
                    btnHint.disabled = false;
                    btnHint.textContent = `Request Next Intel Brief (${this.hintsUnlocked}/${clue.hints.length})`;
                }
            }
        }
    }

    renderEvidenceLog() {
        const listEl = document.getElementById('evidence-items-list');
        if (!listEl) return;

        if (this.currentCaseClueHistory.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-6 text-slate-500 text-xs italic">
                    Awaiting first verified field deduction...
                </div>
            `;
            return;
        }

        let html = '';
        this.currentCaseClueHistory.forEach((item, idx) => {
            html += `
                <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 mb-2.5 relative overflow-hidden group">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[10px] font-mono font-bold text-amber-400">WAYPOINT #${idx + 1}</span>
                        <span class="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">VERIFIED</span>
                    </div>
                    <div class="text-xs font-bold text-white mb-1">${item.title}</div>
                    <div class="text-[11px] text-slate-300">${item.story.replace(/\*\*/g, '')}</div>
                </div>
            `;
        });
        listEl.innerHTML = html;
    }

    handleCaseCompleted() {
        window.geoAudio.playCaseSolved();
        this.saveSolvedCase(this.activeCase.id);
        this.stats.casesSolved = Object.keys(this.solvedCases).length;
        this.saveStats();

        // Connect waypoints with chain line on map
        window.geoMapEngine.drawChainPolyline(this.activeCase.clues.map(c => c.coordinates));

        // Show Grand Reveal Board Modal
        this.showSolvedModal();
    }

    showSolvedModal() {
        const modal = document.getElementById('solved-modal');
        if (!modal) return;

        document.getElementById('solved-case-number').textContent = this.activeCase.caseNumber;
        document.getElementById('solved-case-title').textContent = this.activeCase.title;
        document.getElementById('solved-debrief-text').textContent = this.activeCase.debrief;

        // Render Reveal Chain (Red-string murder board chain)
        const chainContainer = document.getElementById('reveal-chain-container');
        if (chainContainer) {
            let chainHtml = '';
            this.activeCase.revealChain.forEach((step, idx) => {
                chainHtml += `
                    <div class="reveal-chain-node animate-fade-in" style="animation-delay: ${idx * 0.15}s;">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 text-xl font-bold shadow-lg shadow-amber-500/20">
                            ${step.icon || '📍'}
                        </div>
                        <div class="flex-1">
                            <div class="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">${step.step}</div>
                            <div class="text-sm font-bold text-white">${step.name}</div>
                            <div class="text-xs text-slate-400">${step.country}</div>
                        </div>
                    </div>
                    ${idx < this.activeCase.revealChain.length - 1 ? `
                        <div class="reveal-chain-connector">
                            <div class="w-0.5 h-6 bg-gradient-to-b from-amber-500 to-yellow-600 mx-auto"></div>
                        </div>
                    ` : ''}
                `;
            });
            chainContainer.innerHTML = chainHtml;
        }

        modal.classList.remove('hidden');
    }

    hideSolvedModal() {
        const modal = document.getElementById('solved-modal');
        if (modal) modal.classList.add('hidden');
    }

    renderCaseSelectorList() {
        const container = document.getElementById('case-selector-grid');
        if (!container) return;

        let html = '';
        this.cases.forEach((c, idx) => {
            const isSolved = !!this.solvedCases[c.id];
            const isActive = idx === this.currentCaseIndex;

            html += `
                <div onclick="window.geoApp.selectCase(${idx})" class="p-4 rounded-2xl border ${isActive ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900/60'} hover:border-slate-600 cursor-pointer transition-all duration-200">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-mono font-bold ${isActive ? 'text-amber-400' : 'text-slate-400'}">${c.caseNumber}</span>
                        ${isSolved ? '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">SOLVED</span>' : ''}
                    </div>
                    <div class="text-sm font-bold text-white mb-1">${c.title}</div>
                    <div class="text-xs text-slate-400 mb-2 line-clamp-2">${c.tagline}</div>
                    <div class="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span>${c.typeBadge}</span>
                        <span>•</span>
                        <span>${c.locationRegion}</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    selectCase(index) {
        window.geoAudio.playClick();
        this.loadInitialCase(index);
        this.renderCaseSelectorList();
        this.toggleCaseSelectorModal(false);
    }

    toggleCaseSelectorModal(show) {
        const modal = document.getElementById('case-selector-modal');
        if (!modal) return;
        if (show) {
            modal.classList.remove('hidden');
            this.renderCaseSelectorList();
        } else {
            modal.classList.add('hidden');
        }
    }

    initNotes() {
        const textarea = document.getElementById('field-notebook-textarea');
        if (!textarea) return;
        textarea.value = this.currentNote;

        textarea.addEventListener('input', (e) => {
            this.currentNote = e.target.value;
            localStorage.setItem('geo_detective_notes', this.currentNote);
        });
    }

    updateStatsUI() {
        const elSolved = document.getElementById('stat-cases-solved');
        const elClues = document.getElementById('stat-clues-solved');
        const elRank = document.getElementById('stat-detective-rank');

        const solvedCount = Object.keys(this.solvedCases).length;

        if (elSolved) elSolved.textContent = `${solvedCount} / ${this.cases.length}`;
        if (elClues) elClues.textContent = this.stats.cluesSolved;

        let rank = "Field Trainee";
        if (solvedCount >= 1) rank = "Junior Carto-Sleuth";
        if (solvedCount >= 3) rank = "Interpol Detective";
        if (solvedCount >= 5) rank = "Special Agent in Charge";
        if (solvedCount >= 7) rank = "Chief Earth Investigator";

        if (elRank) elRank.textContent = rank;
    }

    bindEvents() {
        // Submit button & Enter key
        const submitBtn = document.getElementById('btn-submit-answer');
        const input = document.getElementById('player-answer-input');

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handleSubmitAnswer());
        }

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.handleSubmitAnswer();
                }
            });
        }

        // Hint request button
        const btnHint = document.getElementById('btn-request-hint');
        if (btnHint) {
            btnHint.addEventListener('click', () => this.requestHint());
        }

        // Map layer toggles
        document.querySelectorAll('.map-layer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layer = e.currentTarget.dataset.layer;
                document.querySelectorAll('.map-layer-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                window.geoMapEngine.setLayer(layer);
                window.geoAudio.playClick();
            });
        });

        // Case selector modal toggles
        const btnOpenCases = document.getElementById('btn-open-cases');
        const btnCloseCases = document.getElementById('btn-close-cases');

        if (btnOpenCases) btnOpenCases.addEventListener('click', () => this.toggleCaseSelectorModal(true));
        if (btnCloseCases) btnCloseCases.addEventListener('click', () => this.toggleCaseSelectorModal(false));

        // Solved modal buttons
        const btnNextCase = document.getElementById('btn-modal-next-case');
        const btnCloseSolved = document.getElementById('btn-close-solved-modal');

        if (btnNextCase) {
            btnNextCase.addEventListener('click', () => {
                this.hideSolvedModal();
                const nextIdx = (this.currentCaseIndex + 1) % this.cases.length;
                this.selectCase(nextIdx);
            });
        }

        if (btnCloseSolved) {
            btnCloseSolved.addEventListener('click', () => this.hideSolvedModal());
        }

        // Audio toggle
        const btnMute = document.getElementById('btn-toggle-audio');
        if (btnMute) {
            btnMute.addEventListener('click', () => {
                const isEnabled = window.geoAudio.toggleMute();
                btnMute.textContent = isEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.geoApp = new GeoDetectiveApp();
    window.geoApp.init();
});
