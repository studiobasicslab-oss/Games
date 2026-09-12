const MORSE_DICT = {
    'A': ['dot', 'dash'], 'B': ['dash', 'dot', 'dot', 'dot'],
    'C': ['dash', 'dot', 'dash', 'dot'], 'D': ['dash', 'dot', 'dot'],
    'E': ['dot'], 'F': ['dot', 'dot', 'dash', 'dot'],
    'G': ['dash', 'dash', 'dot'], 'H': ['dot', 'dot', 'dot', 'dot'],
    'I': ['dot', 'dot'], 'J': ['dot', 'dash', 'dash', 'dash'],
    'K': ['dash', 'dot', 'dash'], 'L': ['dot', 'dash', 'dot', 'dot'],
    'M': ['dash', 'dash'], 'N': ['dash', 'dot'],
    'O': ['dash', 'dash', 'dash'], 'P': ['dot', 'dash', 'dash', 'dot'],
    'Q': ['dash', 'dash', 'dot', 'dash'], 'R': ['dot', 'dash', 'dot'],
    'S': ['dot', 'dot', 'dot'], 'T': ['dash'],
    'U': ['dot', 'dot', 'dash'], 'V': ['dot', 'dot', 'dot', 'dash'],
    'W': ['dot', 'dash', 'dash'], 'X': ['dash', 'dot', 'dot', 'dash'],
    'Y': ['dash', 'dot', 'dash', 'dash'], 'Z': ['dash', 'dash', 'dot', 'dot']
};

const letters = ['E', 'T', 'A', 'O', 'I', 'N', 'S', 'R', 'H', 'L']; 

let gameMode = ''; // 'learn', 'time_attack', 'endless'
let isPlaying = false;
let score = 0;
let combo = 0;
let timeLeft = 60;
let timerInterval = null;

let currentLetter = '';
let expectedSequence = [];
let currentNoteIndex = 0;

let spaceDownTime = 0;
const DASH_THRESHOLD = 150; 

// DOM Elements
const mainMenu = document.getElementById('main-menu');
const gameUI = document.getElementById('game-ui');
const gameOverScreen = document.getElementById('game-over-screen');

const modeDisplay = document.getElementById('mode-display');
const timerDisplay = document.getElementById('timer-display');
const timeEl = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const comboDisplay = document.getElementById('combo');
const targetLetterDisplay = document.getElementById('target-letter-display');
const hintDisplay = document.getElementById('hint-display');
const feedbackDisplay = document.getElementById('feedback-display');
const hitZone = document.getElementById('hit-zone');
const notesTrack = document.getElementById('notes-track');
const finalScoreEl = document.getElementById('final-score');

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(duration) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

function startGame(mode) {
    gameMode = mode;
    isPlaying = true;
    score = 0;
    combo = 0;
    timeLeft = 60;
    
    mainMenu.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameUI.classList.remove('hidden');
    
    updateHUD();
    
    if (mode === 'learn') {
        modeDisplay.textContent = 'Learn Mode';
        timerDisplay.classList.add('hidden');
        hintDisplay.classList.remove('hidden');
    } else if (mode === 'time_attack') {
        modeDisplay.textContent = 'Time Attack';
        timerDisplay.classList.remove('hidden');
        hintDisplay.classList.add('hidden');
        startTimer();
    } else {
        modeDisplay.textContent = 'Endless Rhythm';
        timerDisplay.classList.add('hidden');
        hintDisplay.classList.add('hidden');
    }
    
    nextLetter();
    requestAnimationFrame(gameLoop);
}

function exitGame() {
    isPlaying = false;
    if (timerInterval) clearInterval(timerInterval);
    gameUI.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    clearTrack();
}

function returnToMenu() {
    gameOverScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
}

function startTimer() {
    timeEl.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    gameUI.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreEl.textContent = score;
    clearTrack();
}

// Animation / Visuals
let activeNotes = [];
let lastTime = 0;
let noteSpeed = 200; // pixels per second

function clearTrack() {
    notesTrack.innerHTML = '';
    activeNotes = [];
}

function spawnNotes(sequence) {
    clearTrack();
    let xOffset = 600; // Start at right edge
    const spacing = 80;
    
    sequence.forEach((type, index) => {
        const el = document.createElement('div');
        el.className = `visual-note ${type}`;
        el.style.left = `${xOffset}px`;
        notesTrack.appendChild(el);
        
        activeNotes.push({
            el: el,
            type: type,
            x: xOffset,
            hit: false
        });
        
        xOffset += (type === 'dash' ? 120 : spacing);
    });
}

function getHintString(sequence) {
    return sequence.map(t => t === 'dot' ? '&middot;' : '&minus;').join(' ');
}

function nextLetter() {
    currentLetter = letters[Math.floor(Math.random() * letters.length)];
    expectedSequence = MORSE_DICT[currentLetter];
    currentNoteIndex = 0;
    
    targetLetterDisplay.textContent = currentLetter;
    targetLetterDisplay.style.color = 'var(--secondary-color)';
    feedbackDisplay.textContent = '';
    
    if (gameMode === 'learn') {
        hintDisplay.innerHTML = getHintString(expectedSequence);
    }
    
    // Adjust speed based on mode/combo
    noteSpeed = gameMode === 'learn' ? 100 : 200 + (combo * 10);
    spawnNotes(expectedSequence);
}

function updateHUD() {
    scoreDisplay.textContent = score;
    comboDisplay.textContent = combo;
}

function showFeedback(msg, color) {
    feedbackDisplay.textContent = msg;
    feedbackDisplay.style.color = color;
    targetLetterDisplay.style.color = color;
}

function processInput(type) {
    if (!isPlaying) return;
    
    // In rhythm mode, check if the current active note is in the hit zone (x between 40 and 110)
    // For prototype simplicity, we just check sequence correctness.
    if (expectedSequence[currentNoteIndex] === type) {
        // Correct input
        if (activeNotes[currentNoteIndex]) {
            activeNotes[currentNoteIndex].el.classList.add('hit');
            activeNotes[currentNoteIndex].hit = true;
        }
        
        currentNoteIndex++;
        
        if (currentNoteIndex === expectedSequence.length) {
            score += 100 + (combo * 10);
            combo++;
            updateHUD();
            showFeedback('PERFECT!', '#00ff00');
            setTimeout(nextLetter, 500);
        } else {
            showFeedback('GOOD', '#ffff00');
        }
    } else {
        // Wrong input
        combo = 0;
        updateHUD();
        showFeedback('MISS', '#ff0000');
        currentNoteIndex = 0; // reset
        clearTrack();
        spawnNotes(expectedSequence); // restart visual sequence
    }
}

// Main Game Loop for movement
function gameLoop(timestamp) {
    if (!isPlaying) return;
    
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    
    // Move notes
    activeNotes.forEach(note => {
        if (!note.hit) {
            note.x -= noteSpeed * dt;
            note.el.style.left = `${note.x}px`;
            
            // If note goes past hit zone (approx x < 20) and not hit, it's a miss
            if (note.x < 20 && gameMode !== 'learn') { // Learn mode doesn't penalize slow tapping
                 // Note missed
                 combo = 0;
                 updateHUD();
                 showFeedback('MISS (Too Slow)', '#ff0000');
                 currentNoteIndex = 0;
                 clearTrack();
                 spawnNotes(expectedSequence);
            }
        }
    });
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!isPlaying) return;
        
        if (spaceDownTime === 0) {
            spaceDownTime = performance.now();
            hitZone.classList.add('hit-zone-active');
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && spaceDownTime > 0) {
        e.preventDefault();
        const holdDuration = performance.now() - spaceDownTime;
        spaceDownTime = 0;
        hitZone.classList.remove('hit-zone-active');
        
        if (holdDuration >= DASH_THRESHOLD) {
            playBeep(0.3);
            processInput('dash');
        } else {
            playBeep(0.1);
            processInput('dot');
        }
    }
});
