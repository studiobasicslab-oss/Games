/**
 * Rubik's Rings — Main Application Controller
 * Wires CubeState ↔ RingsUI ↔ Cube3D and handles UI controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  const cube = new CubeState();
  const rings = new RingsUI('rings-canvas', cube);
  const cube3d = new Cube3D('cube3d-container', cube);

  // UI Elements
  const moveCountEl = document.getElementById('move-count');
  const statusEl = document.getElementById('status-text');
  const timerEl = document.getElementById('timer-display');
  
  // Timer State
  let timerInterval = null;
  let startTime = null;
  let isTimerRunning = false;
  let isScrambling = false;

  // Visual Bridge: Ring Hover -> 3D Cube Highlight
  rings.onRingHover = (faceMove) => {
    cube3d.highlightFace(faceMove);
  };

  function formatTime(ms) {
    const totalMs = ms;
    const mins = Math.floor(totalMs / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const hund = Math.floor((totalMs % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${hund.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    if (isTimerRunning || cube.isSolved()) return;
    isTimerRunning = true;
    startTime = performance.now();
    timerInterval = setInterval(() => {
      timerEl.textContent = formatTime(performance.now() - startTime);
    }, 50);
  }

  function stopTimer() {
    if (!isTimerRunning) return;
    isTimerRunning = false;
    clearInterval(timerInterval);
  }

  function resetTimer() {
    stopTimer();
    timerEl.textContent = '00:00.00';
  }

  cube.onChange((move) => {
    if (isScrambling) return; // Don't update game logic during scramble animation
    
    if (moveCountEl) moveCountEl.textContent = cube.moveCount;
    
    // Start timer on first user move if not solved
    if (!isTimerRunning && cube.moveCount > 0 && !cube.isSolved() && move !== 'reset') {
      startTimer();
    }

    if (statusEl) {
      if (cube.isSolved() && cube.moveCount > 0) {
        statusEl.textContent = '🎉 SOLVED!';
        statusEl.classList.add('solved');
        document.getElementById('game-container').classList.add('is-solved');
        stopTimer();
      } else {
        statusEl.textContent = move === 'reset' ? 'Ready' : `Last move: ${move}`;
        statusEl.classList.remove('solved');
        document.getElementById('game-container').classList.remove('is-solved');
      }
    }
  });

  // Action Buttons
  document.getElementById('btn-scramble').addEventListener('click', () => {
    if (isScrambling || rings.animating) return;
    const moves = cube.scramble(20);
    resetTimer();
    isScrambling = true;
    statusEl.textContent = 'Scrambling...';
    
    // Animate moves sequentially
    let i = 0;
    function next() {
      if (i < moves.length) {
        rings.applyMoveExternal(moves[i], 0.25, next); // 4x speed
        i++;
      } else {
        isScrambling = false;
        cube.moveCount = 0;
        if (moveCountEl) moveCountEl.textContent = '0';
        statusEl.textContent = 'Scrambled! Solve it.';
      }
    }
    next();
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    if (isScrambling || rings.animating) return;
    cube.reset();
    resetTimer();
    statusEl.textContent = 'Ready';
  });

  document.getElementById('btn-undo').addEventListener('click', () => {
    if (isScrambling || rings.animating) return;
    cube.undo();
  });

  document.getElementById('btn-redo').addEventListener('click', () => {
    if (isScrambling || rings.animating) return;
    cube.redo();
  });

  // Move buttons
  const moveButtons = document.querySelectorAll('[data-move]');
  moveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isScrambling || rings.animating) return;
      rings.applyMoveExternal(btn.dataset.move);
    });
  });

  // Keyboard mapping
  const keyMap = {
    'u': 'U', 'd': 'D', 'f': 'F', 'b': 'B', 'r': 'R', 'l': 'L',
    'm': 'M', 'e': 'E', 's': 'S'
  };

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || isScrambling || rings.animating) return;
    
    const key = e.key.toLowerCase();
    
    if (keyMap[key]) {
      const move = keyMap[key] + (e.shiftKey ? "'" : "");
      rings.applyMoveExternal(move);
    } else if (key === 'z') {
      cube.undo();
    } else if (key === 'y') {
      cube.redo();
    } else if (key === 'escape') {
      cube.reset();
      resetTimer();
    }
  });

  // Initial setup
  cube.reset();
  resetTimer();
});
