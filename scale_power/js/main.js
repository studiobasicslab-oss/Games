/**
 * Scale: The Power of Ten - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    const audio = new AudioEngine();
    const vfx = new VFXEngine('vfx-canvas');
    const fermi = new FermiEngine(audio, vfx);

    let currentMode = 'odyssey'; // 'odyssey', 'fermi', 'explorer'
    let currentExp = 0;

    // DOM Elements
    const elScore = document.getElementById('hud-score');
    const elExponentVal = document.getElementById('hud-exponent-val');
    const elScaleSlider = document.getElementById('scale-zoom-slider');
    const elObjectName = document.getElementById('object-name');
    const elObjectSize = document.getElementById('object-size');
    const elObjectDesc = document.getElementById('object-desc');
    const elForceName = document.getElementById('force-name');
    const elForceRange = document.getElementById('force-range');
    const elForceMeterFill = document.getElementById('force-meter-fill');

    const fermiCard = document.getElementById('fermi-challenge-card');
    const elFermiQuestion = document.getElementById('fermi-question');
    const elFermiResult = document.getElementById('fermi-result-msg');
    const btnSubmitFermi = document.getElementById('btn-submit-fermi');
    const btnNextFermi = document.getElementById('btn-next-fermi');

    const btnAudioToggle = document.getElementById('btn-toggle-audio');
    const btnHelp = document.getElementById('btn-help');
    const modalHelp = document.getElementById('modal-help');
    const btnCloseHelp = document.getElementById('btn-close-help');
    const modeNavBtns = document.querySelectorAll('.mode-nav-btn');

    function updateScaleUI(exp) {
        currentExp = exp;
        if (elScaleSlider) elScaleSlider.value = exp;
        if (elExponentVal) elExponentVal.textContent = `10^${exp >= 0 ? '+' : ''}${exp} m`;

        const obj = fermi.setExponent(exp);
        const force = fermi.getDominantForce();

        if (elObjectName) elObjectName.textContent = obj.name;
        if (elObjectSize) elObjectSize.textContent = `Dimension: ${obj.size}`;
        if (elObjectDesc) elObjectDesc.textContent = obj.desc;

        if (elForceName) {
            elForceName.textContent = force.name;
            elForceName.style.color = force.color;
        }
        if (elForceRange) elForceRange.textContent = `Active: ${force.range}`;
        if (elForceMeterFill) {
            elForceMeterFill.style.background = force.color;
            const norm = ((exp + 18) / 44) * 100;
            elForceMeterFill.style.width = `${norm}%`;
        }

        if (elScore) elScore.textContent = fermi.score;
    }

    function loadFermiChallenge(index) {
        fermi.currentChallengeIndex = index;
        const challenge = FERMI_CHALLENGES[fermi.currentChallengeIndex];
        if (!challenge) return;

        if (elFermiQuestion) elFermiQuestion.textContent = challenge.question;
        if (elFermiResult) {
            elFermiResult.textContent = "Adjust the scale slider above to your best estimation, then click Submit Estimation!";
            elFermiResult.className = "fermi-result info";
        }
        if (btnSubmitFermi) btnSubmitFermi.style.display = 'inline-block';
        if (btnNextFermi) btnNextFermi.style.display = 'none';
    }

    // Slider input event
    if (elScaleSlider) {
        elScaleSlider.addEventListener('input', (e) => {
            const exp = parseInt(e.target.value, 10);
            updateScaleUI(exp);
        });
    }

    // Wheel zooming
    window.addEventListener('wheel', (e) => {
        if (e.deltaY < 0) {
            if (currentExp < 26) updateScaleUI(currentExp + 1);
        } else {
            if (currentExp > -18) updateScaleUI(currentExp - 1);
        }
    }, { passive: true });

    // Submit Fermi Guess
    if (btnSubmitFermi) {
        btnSubmitFermi.addEventListener('click', () => {
            const res = fermi.evaluateFermiGuess(currentExp);
            if (!res) return;

            if (elFermiResult) {
                elFermiResult.textContent = `${res.message} ${res.explanation}`;
                elFermiResult.className = `fermi-result ${res.rating}`;
            }

            btnSubmitFermi.style.display = 'none';
            if (btnNextFermi) {
                btnNextFermi.style.display = 'inline-block';
                btnNextFermi.textContent = fermi.currentChallengeIndex < FERMI_CHALLENGES.length - 1 ? 'Next Challenge ➔' : 'Odyssey Complete!';
            }

            if (elScore) elScore.textContent = fermi.score;
        });
    }

    if (btnNextFermi) {
        btnNextFermi.addEventListener('click', () => {
            if (fermi.currentChallengeIndex < FERMI_CHALLENGES.length - 1) {
                loadFermiChallenge(fermi.currentChallengeIndex + 1);
            } else {
                alert(`Cosmic Odyssey Finished! Total Fermi Score: ${fermi.score}`);
                loadFermiChallenge(0);
            }
        });
    }

    // Audio Toggle
    if (btnAudioToggle) {
        btnAudioToggle.addEventListener('click', () => {
            const muted = audio.toggleMute();
            btnAudioToggle.textContent = muted ? '🔇' : '🔊';
        });
    }

    // Help Modal
    if (btnHelp && modalHelp) btnHelp.addEventListener('click', () => modalHelp.style.display = 'flex');
    if (btnCloseHelp && modalHelp) btnCloseHelp.addEventListener('click', () => modalHelp.style.display = 'none');

    // Mode Nav
    modeNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;

            if (currentMode === 'odyssey') {
                if (fermiCard) fermiCard.style.display = 'block';
                loadFermiChallenge(0);
            } else if (currentMode === 'fermi') {
                if (fermiCard) fermiCard.style.display = 'block';
                loadFermiChallenge(Math.floor(Math.random() * FERMI_CHALLENGES.length));
            } else if (currentMode === 'explorer') {
                if (fermiCard) fermiCard.style.display = 'none';
            }
        });
    });

    // Initialize
    updateScaleUI(0);
    loadFermiChallenge(0);
});
