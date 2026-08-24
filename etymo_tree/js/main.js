/**
 * Etymo-Tree: The Root Shifter - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    const audio = new AudioEngine();
    const vfx = new VFXEngine('vfx-canvas');
    const ling = new LinguisticsEngine(audio, vfx);

    let currentMode = 'campaign';
    let currentPuzzleIndex = 0;
    let speedTimer = null;
    let speedTimeLeft = 60;

    // DOM Elements
    const elScore = document.getElementById('hud-score');
    const elPuzzleIndex = document.getElementById('hud-puzzle-index');
    const elConceptTitle = document.getElementById('concept-title');
    const elConceptMeaning = document.getElementById('concept-meaning');
    const elTransformedWord = document.getElementById('transformed-word-display');
    const elStatusMsg = document.getElementById('status-message');

    const elRootButtons = document.getElementById('root-candidates-list');
    const elSoundLaws = document.getElementById('sound-laws-list');
    const elWordsGrid = document.getElementById('cognates-words-grid');

    const btnAudioToggle = document.getElementById('btn-toggle-audio');
    const btnHelp = document.getElementById('btn-help');
    const modalHelp = document.getElementById('modal-help');
    const modalVictory = document.getElementById('modal-victory');
    const btnNextPuzzle = document.getElementById('btn-next-puzzle');
    const btnRetryPuzzle = document.getElementById('btn-retry-puzzle');
    const btnCloseHelp = document.getElementById('btn-close-help');

    const modeNavBtns = document.querySelectorAll('.mode-nav-btn');

    function loadPuzzle(index) {
        currentPuzzleIndex = index;
        const puzzle = ETYMO_PUZZLES[currentPuzzleIndex];
        if (!puzzle) return;

        ling.loadPuzzle(puzzle);

        elPuzzleIndex.textContent = `${index + 1}/${ETYMO_PUZZLES.length}`;
        elConceptTitle.textContent = puzzle.concept;
        elConceptMeaning.textContent = `Concept Core: "${puzzle.meaning}"`;
        elStatusMsg.textContent = "Select a reconstructed Proto-Indo-European (PIE) root hypothesis below.";
        elStatusMsg.className = "status-msg info";

        renderAll();
    }

    function renderAll() {
        const puzzle = ling.currentPuzzle;
        if (!puzzle) return;

        // 1. Top HUD
        if (elScore) elScore.textContent = ling.score;

        // 2. Transformed Word
        if (elTransformedWord) {
            elTransformedWord.textContent = ling.computeTransformedWord();
        }

        // 3. Root Candidates
        if (elRootButtons) {
            elRootButtons.innerHTML = '';
            puzzle.rootCandidates.forEach(root => {
                const btn = document.createElement('button');
                btn.className = `root-btn ${ling.selectedRoot === root ? 'selected' : ''}`;
                btn.innerHTML = `<span class="rune-glyph">✦</span> <code>${root}</code>`;
                btn.addEventListener('click', () => {
                    const res = ling.selectRoot(root);
                    handleValidationResult(res);
                    renderAll();
                });
                elRootButtons.appendChild(btn);
            });
        }

        // 4. Sound Laws Shifter
        if (elSoundLaws) {
            elSoundLaws.innerHTML = '';
            SOUND_LAWS.forEach(law => {
                const isApplied = ling.appliedLaws.includes(law.id);
                const lawCard = document.createElement('div');
                lawCard.className = `law-card ${isApplied ? 'applied' : ''}`;
                lawCard.innerHTML = `
                    <div class="law-header">
                        <span class="law-branch">${law.branch}</span>
                        <span class="law-status">${isApplied ? '✓ ACTIVE' : '+ APPLY'}</span>
                    </div>
                    <div class="law-name">${law.name}</div>
                    <div class="law-desc">${law.description}</div>
                `;

                lawCard.addEventListener('click', () => {
                    ling.applySoundLaw(law.id);
                    const res = ling.checkSolution();
                    handleValidationResult(res);
                    renderAll();
                });

                elSoundLaws.appendChild(lawCard);
            });
        }

        // 5. Cognate Words & False Friend Matrix
        if (elWordsGrid) {
            elWordsGrid.innerHTML = '';
            puzzle.words.forEach(word => {
                const isFlagged = ling.identifiedFalseFriends.includes(word.id);
                const card = document.createElement('div');
                card.className = `word-card ${isFlagged ? 'flagged-trap' : ''}`;
                card.innerHTML = `
                    <div class="word-lang">${word.lang}</div>
                    <div class="word-term">${word.term}</div>
                    <button class="btn-flag-trap" title="Flag as False Cognate / Non-IE Loanword">
                        ${isFlagged ? '⚠️ Trap Identified' : '🔍 Cognate / Trap?'}
                    </button>
                `;

                const flagBtn = card.querySelector('.btn-flag-trap');
                flagBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const res = ling.toggleFalseFriend(word.id);
                    handleValidationResult(res);
                    renderAll();
                });

                elWordsGrid.appendChild(card);
            });
        }
    }

    function handleValidationResult(res) {
        if (!res) return;
        elStatusMsg.textContent = res.message;
        if (res.isCorrect) {
            elStatusMsg.className = "status-msg success";
            setTimeout(() => {
                showVictoryModal();
            }, 600);
        } else {
            elStatusMsg.className = "status-msg warning";
        }
    }

    function showVictoryModal() {
        const puzzle = ling.currentPuzzle;
        const vicTitle = document.getElementById('victory-title');
        const vicMsg = document.getElementById('victory-msg');
        const vicExplanation = document.getElementById('victory-explanation');

        if (vicTitle) vicTitle.textContent = "📜 PROTO-ROOT DECIPHERED!";
        if (vicMsg) vicMsg.textContent = `Brilliant philological deduction! You reconstructed the ancestral form ${puzzle.correctRoot}.`;
        if (vicExplanation) vicExplanation.textContent = puzzle.explanation;

        if (modalVictory) modalVictory.style.display = 'flex';
    }

    // Audio Mute Toggle
    if (btnAudioToggle) btnAudioToggle.addEventListener('click', () => {
        const muted = audio.toggleMute();
        btnAudioToggle.textContent = muted ? '🔇' : '🔊';
    });

    // Modals
    if (btnHelp && modalHelp) btnHelp.addEventListener('click', () => modalHelp.style.display = 'flex');
    if (btnCloseHelp && modalHelp) btnCloseHelp.addEventListener('click', () => modalHelp.style.display = 'none');
    if (btnRetryPuzzle && modalVictory) btnRetryPuzzle.addEventListener('click', () => {
        modalVictory.style.display = 'none';
        loadPuzzle(currentPuzzleIndex);
    });
    if (btnNextPuzzle && modalVictory) btnNextPuzzle.addEventListener('click', () => {
        modalVictory.style.display = 'none';
        if (currentPuzzleIndex < ETYMO_PUZZLES.length - 1) {
            loadPuzzle(currentPuzzleIndex + 1);
        }
    });

    // Mode Navigation
    modeNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            if (speedTimer) { clearInterval(speedTimer); speedTimer = null; }

            if (currentMode === 'campaign') {
                loadPuzzle(currentPuzzleIndex);
            } else if (currentMode === 'speed') {
                startSpeedMode();
            } else if (currentMode === 'tree') {
                loadPuzzle(0);
                elConceptTitle.textContent = "Comparative Language Tree Sandbox";
                elConceptMeaning.textContent = "Freely toggle phonetic sound laws to observe ancient word evolution.";
            }
        });
    });

    function startSpeedMode() {
        speedTimeLeft = 45;
        loadPuzzle(Math.floor(Math.random() * ETYMO_PUZZLES.length));
        elConceptTitle.textContent = "⚡ Speed Shifter Challenge";
        elConceptMeaning.textContent = `Time Remaining: ${speedTimeLeft}s! Decipher as many roots as possible.`;

        speedTimer = setInterval(() => {
            speedTimeLeft--;
            elConceptMeaning.textContent = `Time Remaining: ${speedTimeLeft}s!`;
            if (speedTimeLeft <= 0) {
                clearInterval(speedTimer);
                speedTimer = null;
                alert(`Time is up! Your Final Philology Score: ${ling.score}`);
            }
        }, 1000);
    }

    // Initialize
    loadPuzzle(0);
});
