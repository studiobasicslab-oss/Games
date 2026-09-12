import { Simulator } from '../engine/Simulator.js';
import { levels } from '../data/levels.js';

let currentLevel = levels[0];
let simulator = null;
let runInterval = null;

// DOM Elements
const editor = document.getElementById('code-editor');
const lineNumbers = document.getElementById('line-numbers');
const cycleCounter = document.getElementById('cycle-counter');
const registersDisplay = document.getElementById('registers-display');
const statusMessage = document.getElementById('status-message');
const levelSelect = document.getElementById('level-select');
const levelDesc = document.getElementById('level-description');

const btnStep = document.getElementById('btn-step');
const btnRun = document.getElementById('btn-run');
const btnReset = document.getElementById('btn-reset');

function updateLineNumbers() {
  const lines = editor.value.split('\n').length;
  lineNumbers.innerHTML = Array(lines).fill(0).map((_, i) => `<div>${i + 1}</div>`).join('');
}

function loadLevel(level) {
  currentLevel = level;
  levelSelect.value = level.id;
  
  let goalText = level.description;
  if (level.goal.type === 'match_register') {
    goalText += `<br><br><strong>Goal:</strong> Set ${level.goal.register} to ${level.goal.value} within ${level.goal.maxCycles} cycles.`;
  }
  levelDesc.innerHTML = goalText;
  
  resetSimulator();
}

function resetSimulator() {
  stopRun();
  simulator = new Simulator(currentLevel.initialState);
  updateUI();
  statusMessage.textContent = 'IDLE';
  statusMessage.className = 'status';
}

function updateUI() {
  cycleCounter.textContent = `CYCLES: ${simulator.cycles}`;
  
  registersDisplay.innerHTML = Object.entries(simulator.registers)
    .map(([reg, val]) => `
      <div class="register-box">
        <span class="reg-name">${reg}</span>
        <span class="reg-val">${val}</span>
      </div>
    `).join('');

  if (simulator.status === 'ERROR') {
    statusMessage.textContent = simulator.errorMsg;
    statusMessage.className = 'status error';
  } else if (simulator.status === 'SUCCESS') {
    statusMessage.textContent = 'SUCCESS! Level Complete.';
    statusMessage.className = 'status success';
  } else if (simulator.status === 'FAILED') {
    statusMessage.textContent = `FAILED: ${simulator.errorMsg}`;
    statusMessage.className = 'status error';
  } else if (simulator.status === 'RUNNING' || simulator.status === 'READY') {
    statusMessage.textContent = simulator.status;
    statusMessage.className = 'status running';
  } else {
    statusMessage.textContent = simulator.status;
    statusMessage.className = 'status';
  }
}

function step() {
  if (simulator.status === 'IDLE' || simulator.status === 'ERROR' || simulator.status === 'SUCCESS' || simulator.status === 'FAILED') {
    simulator.loadProgram(editor.value);
  }
  
  simulator.step();
  simulator.checkGoal(currentLevel.goal);
  updateUI();
  
  if (simulator.status === 'SUCCESS' || simulator.status === 'FAILED' || simulator.status === 'ERROR') {
    stopRun();
  }
}

function toggleRun() {
  if (runInterval) {
    stopRun();
    return;
  }
  
  if (simulator.status === 'IDLE' || simulator.status === 'ERROR' || simulator.status === 'SUCCESS' || simulator.status === 'FAILED') {
    simulator.loadProgram(editor.value);
  }
  
  btnRun.textContent = 'STOP';
  runInterval = setInterval(() => {
    step();
  }, 200); // 200ms per cycle
}

function stopRun() {
  if (runInterval) {
    clearInterval(runInterval);
    runInterval = null;
    btnRun.textContent = 'RUN';
  }
}

function initLevels() {
  levelSelect.innerHTML = levels.map(l => `<option value="${l.id}">${l.title}</option>`).join('');
  levelSelect.addEventListener('change', (e) => {
    const selectedLevel = levels.find(l => l.id == e.target.value);
    if (selectedLevel) {
      loadLevel(selectedLevel);
    }
  });
}

// Event Listeners
editor.addEventListener('input', updateLineNumbers);
btnStep.addEventListener('click', step);
btnRun.addEventListener('click', toggleRun);
btnReset.addEventListener('click', resetSimulator);

// Init
initLevels();
updateLineNumbers();
loadLevel(levels[0]);
