/**
 * The Sunday Puzzle - Interactive Puzzle Controllers
 * Tactile, responsive game logic for each newspaper puzzle type.
 */

class PuzzleManager {
  constructor(edition, state, onPuzzleSolved) {
    this.edition = edition;
    this.state = state; // { [puzzleId]: { solved: boolean, data: ... } }
    this.onPuzzleSolved = onPuzzleSolved;
    this.controllers = {};
  }

  renderAll(container) {
    container.innerHTML = '';
    this.edition.puzzles.forEach((puzzle, index) => {
      const section = document.createElement('article');
      section.className = `puzzle-section puzzle-${puzzle.type}`;
      section.id = `puzzle-block-${puzzle.id}`;
      if (this.state[puzzle.id]?.solved) {
        section.classList.add('is-solved');
      }

      // Newspaper puzzle header with stars & difficulty
      const starsHtml = '★'.repeat(puzzle.stars) + '☆'.repeat(5 - puzzle.stars);
      section.innerHTML = `
        <div class="puzzle-header">
          <div class="puzzle-meta">
            <span class="puzzle-num">${puzzle.num}</span>
            <span class="puzzle-stars" title="Difficulty: ${puzzle.stars}/5">${starsHtml}</span>
          </div>
          <h2 class="puzzle-title">${puzzle.name}</h2>
          <p class="puzzle-intro">${puzzle.intro}</p>
        </div>
        <div class="puzzle-body" id="puzzle-body-${puzzle.id}"></div>
        <div class="stamp-overlay" id="stamp-${puzzle.id}">
          <div class="rubber-stamp">SOLVED</div>
        </div>
      `;

      container.appendChild(section);
      const body = section.querySelector(`#puzzle-body-${puzzle.id}`);
      this.initController(puzzle, body);
    });
  }

  initController(puzzle, bodyEl) {
    switch (puzzle.type) {
      case 'crossword':
        this.controllers[puzzle.id] = new CrosswordController(puzzle, bodyEl, this);
        break;
      case 'logic':
        this.controllers[puzzle.id] = new LogicController(puzzle, bodyEl, this);
        break;
      case 'word_ladder':
        this.controllers[puzzle.id] = new WordLadderController(puzzle, bodyEl, this);
        break;
      case 'visual_anomaly':
        this.controllers[puzzle.id] = new VisualController(puzzle, bodyEl, this);
        break;
      case 'mystery':
        this.controllers[puzzle.id] = new MysteryController(puzzle, bodyEl, this);
        break;
    }
  }

  markSolved(puzzleId, silent = false) {
    if (!this.state[puzzleId]) this.state[puzzleId] = {};
    this.state[puzzleId].solved = true;

    const block = document.getElementById(`puzzle-block-${puzzleId}`);
    if (block) {
      block.classList.add('is-solved');
    }

    if (!silent) {
      window.sundayAudio.playStamp();
      setTimeout(() => window.sundayAudio.playVictory(), 250);
    }

    if (this.onPuzzleSolved) {
      this.onPuzzleSolved(puzzleId, this.getSolvedCount(), this.edition.puzzles.length);
    }
  }

  getSolvedCount() {
    return this.edition.puzzles.filter(p => this.state[p.id]?.solved).length;
  }
}

/* ==========================================================================
   1. MINI CROSSWORD CONTROLLER
   ========================================================================== */
class CrosswordController {
  constructor(puzzle, container, manager) {
    this.puzzle = puzzle;
    this.container = container;
    this.manager = manager;
    this.grid = puzzle.perfectGrid?.solution || puzzle.cleanGrid?.solution || puzzle.solution;
    this.clues = puzzle.perfectGrid?.clues || puzzle.cleanGrid?.clues || puzzle.clues;
    this.size = 5;
    this.cursor = { r: 0, c: 0, dir: 'across' }; // 'across' or 'down'
    this.userGrid = Array(5).fill(null).map(() => Array(5).fill(''));

    // Restore saved inputs if any
    const saved = this.manager.state[puzzle.id]?.userGrid;
    if (saved && Array.isArray(saved)) {
      this.userGrid = saved;
    }

    this.render();
    if (this.manager.state[puzzle.id]?.solved) {
      this.revealFull();
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="crossword-wrapper">
        <div class="crossword-grid-container">
          <div class="crossword-grid" style="grid-template-columns: repeat(${this.size}, 1fr);" id="cw-grid-${this.puzzle.id}" tabindex="0">
            ${this.renderCells()}
          </div>
          <div class="crossword-actions">
            <button type="button" class="paper-btn check-cw-btn">Check Grid</button>
            <button type="button" class="paper-btn-subtle reveal-letter-btn">Hint Letter</button>
            <button type="button" class="paper-btn-subtle clear-cw-btn">Clear</button>
          </div>
        </div>

        <div class="crossword-clues">
          <div class="clue-column">
            <h4 class="clue-heading">ACROSS</h4>
            <ul class="clue-list" id="across-clues-${this.puzzle.id}">
              ${this.clues.across.map(c => `
                <li class="clue-item" data-dir="across" data-row="${c.row}" data-col="${c.col}" data-num="${c.num}">
                  <strong>${c.num}.</strong> ${c.text}
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="clue-column">
            <h4 class="clue-heading">DOWN</h4>
            <ul class="clue-list" id="down-clues-${this.puzzle.id}">
              ${this.clues.down.map(c => `
                <li class="clue-item" data-dir="down" data-row="${c.row}" data-col="${c.col}" data-num="${c.num}">
                  <strong>${c.num}.</strong> ${c.text}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.updateHighlight();
  }

  renderCells() {
    let html = '';
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.userGrid[r][c] || '';
        let numLabel = '';
        // Find if this cell has a clue number
        const acrossMatch = this.clues.across.find(cl => cl.row === r && cl.col === c);
        const downMatch = this.clues.down.find(cl => cl.row === r && cl.col === c);
        if (acrossMatch) numLabel = acrossMatch.num;
        else if (downMatch) numLabel = downMatch.num;

        html += `
          <div class="cw-cell" data-row="${r}" data-col="${c}" id="cw-cell-${r}-${c}">
            ${numLabel ? `<span class="cw-num">${numLabel}</span>` : ''}
            <input type="text" class="cw-input" maxlength="1" value="${val}" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" data-row="${r}" data-col="${c}">
          </div>
        `;
      }
    }
    return html;
  }

  bindEvents() {
    const gridEl = this.container.querySelector('.crossword-grid');
    const inputs = this.container.querySelectorAll('.cw-input');

    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        const r = parseInt(e.target.dataset.row);
        const c = parseInt(e.target.dataset.col);
        this.cursor.r = r;
        this.cursor.c = c;
        this.updateHighlight();
      });

      input.addEventListener('click', (e) => {
        const r = parseInt(e.target.dataset.row);
        const c = parseInt(e.target.dataset.col);
        if (this.cursor.r === r && this.cursor.c === c) {
          // Toggle direction on second tap
          this.cursor.dir = this.cursor.dir === 'across' ? 'down' : 'across';
        }
        this.cursor.r = r;
        this.cursor.c = c;
        this.updateHighlight();
      });

      input.addEventListener('keydown', (e) => {
        const r = parseInt(e.target.dataset.row);
        const c = parseInt(e.target.dataset.col);

        if (e.key === 'Backspace') {
          window.sundayAudio.playEraser();
          if (!input.value) {
            e.preventDefault();
            this.moveCursor(-1);
            const prevInput = this.getCellInput(this.cursor.r, this.cursor.c);
            if (prevInput) {
              prevInput.value = '';
              this.userGrid[this.cursor.r][this.cursor.c] = '';
              prevInput.focus();
            }
          } else {
            this.userGrid[r][c] = '';
          }
          this.saveProgress();
          return;
        }

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.cursor.dir = 'across';
          this.cursor.c = Math.min(this.size - 1, c + 1);
          this.focusCurrent();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.cursor.dir = 'across';
          this.cursor.c = Math.max(0, c - 1);
          this.focusCurrent();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.cursor.dir = 'down';
          this.cursor.r = Math.min(this.size - 1, r + 1);
          this.focusCurrent();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.cursor.dir = 'down';
          this.cursor.r = Math.max(0, r - 1);
          this.focusCurrent();
        }
      });

      input.addEventListener('input', (e) => {
        const val = (e.target.value || '').toUpperCase().replace(/[^A-Z]/g, '');
        e.target.value = val;
        const r = parseInt(e.target.dataset.row);
        const c = parseInt(e.target.dataset.col);
        this.userGrid[r][c] = val;

        if (val) {
          window.sundayAudio.playPencil(1.0 + (r * 0.05));
          this.moveCursor(1);
          this.focusCurrent();
        }
        this.saveProgress();
        this.checkIfCompleteAuto();
      });
    });

    // Clue clicks
    this.container.querySelectorAll('.clue-item').forEach(item => {
      item.addEventListener('click', () => {
        const r = parseInt(item.dataset.row);
        const c = parseInt(item.dataset.col);
        const dir = item.dataset.dir;
        this.cursor.r = r;
        this.cursor.c = c;
        this.cursor.dir = dir;
        this.focusCurrent();
        this.updateHighlight();
        window.sundayAudio.playPencil(1.2);
      });
    });

    // Buttons
    this.container.querySelector('.check-cw-btn').addEventListener('click', () => {
      this.validate(true);
    });

    this.container.querySelector('.reveal-letter-btn').addEventListener('click', () => {
      this.revealSingleLetter();
    });

    this.container.querySelector('.clear-cw-btn').addEventListener('click', () => {
      if (confirm("Clear current crossword letters?")) {
        window.sundayAudio.playEraser();
        this.userGrid = Array(5).fill(null).map(() => Array(5).fill(''));
        this.container.querySelectorAll('.cw-input').forEach(i => i.value = '');
        this.saveProgress();
      }
    });
  }

  getCellInput(r, c) {
    return this.container.querySelector(`.cw-input[data-row="${r}"][data-col="${c}"]`);
  }

  focusCurrent() {
    const input = this.getCellInput(this.cursor.r, this.cursor.c);
    if (input) {
      input.focus();
      this.updateHighlight();
    }
  }

  moveCursor(step) {
    if (this.cursor.dir === 'across') {
      let nextC = this.cursor.c + step;
      if (nextC >= 0 && nextC < this.size) {
        this.cursor.c = nextC;
      }
    } else {
      let nextR = this.cursor.r + step;
      if (nextR >= 0 && nextR < this.size) {
        this.cursor.r = nextR;
      }
    }
  }

  updateHighlight() {
    this.container.querySelectorAll('.cw-cell').forEach(cell => {
      cell.classList.remove('is-active', 'is-word-highlight');
    });
    this.container.querySelectorAll('.clue-item').forEach(clue => {
      clue.classList.remove('is-active-clue');
    });

    const activeCell = this.container.querySelector(`#cw-cell-${this.cursor.r}-${this.cursor.c}`);
    if (activeCell) activeCell.classList.add('is-active');

    // Highlight entire current word in across or down line
    for (let i = 0; i < this.size; i++) {
      const r = this.cursor.dir === 'across' ? this.cursor.r : i;
      const c = this.cursor.dir === 'across' ? i : this.cursor.c;
      const cell = this.container.querySelector(`#cw-cell-${r}-${c}`);
      if (cell) cell.classList.add('is-word-highlight');
    }

    // Highlight active clue
    const activeClue = this.container.querySelector(`.clue-item[data-dir="${this.cursor.dir}"][data-row="${this.cursor.dir === 'across' ? this.cursor.r : 0}"][data-col="${this.cursor.dir === 'down' ? this.cursor.c : 0}"]`);
    if (activeClue) activeClue.classList.add('is-active-clue');
  }

  saveProgress() {
    if (!this.manager.state[this.puzzle.id]) {
      this.manager.state[this.puzzle.id] = {};
    }
    this.manager.state[this.puzzle.id].userGrid = this.userGrid;
    if (window.sundayApp) window.sundayApp.saveState();
  }

  validate(alertFeedback = false) {
    let allFilled = true;
    let allCorrect = true;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const user = (this.userGrid[r][c] || '').toUpperCase();
        const expected = (this.grid[r][c] || '').toUpperCase();
        if (!user) allFilled = false;
        if (user !== expected) allCorrect = false;
      }
    }

    if (allCorrect) {
      this.manager.markSolved(this.puzzle.id);
      this.revealFull();
    } else if (alertFeedback) {
      if (!allFilled) {
        window.sundayApp.showToast("Keep going! Fill in all the letters first.");
      } else {
        window.sundayApp.showToast("A few letters need correction. Double-check your crossing clues!");
        window.sundayAudio.playEraser();
      }
    }
  }

  checkIfCompleteAuto() {
    let isFull = true;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.userGrid[r][c]) isFull = false;
      }
    }
    if (isFull) {
      this.validate(false);
    }
  }

  revealSingleLetter() {
    const r = this.cursor.r;
    const c = this.cursor.c;
    const correctLetter = this.grid[r][c];
    this.userGrid[r][c] = correctLetter;
    const input = this.getCellInput(r, c);
    if (input) input.value = correctLetter;
    window.sundayAudio.playPencil(0.8);
    this.saveProgress();
    this.checkIfCompleteAuto();
  }

  revealFull() {
    this.container.querySelectorAll('.cw-input').forEach(i => {
      i.disabled = true;
      i.classList.add('is-locked-solved');
    });
    this.container.querySelectorAll('.paper-btn, .paper-btn-subtle').forEach(b => b.style.display = 'none');
  }
}

/* ==========================================================================
   2. LOGIC CONTROLLER ("WHO ATE THE CAKE?")
   ========================================================================== */
class LogicController {
  constructor(puzzle, container, manager) {
    this.puzzle = puzzle;
    this.container = container;
    this.manager = manager;
    this.strikethroughClues = new Set();
    this.render();
  }

  render() {
    const isSolved = this.manager.state[this.puzzle.id]?.solved;

    this.container.innerHTML = `
      <div class="logic-wrapper">
        <div class="story-box">
          <p class="story-lead">${this.puzzle.story}</p>
        </div>

        <div class="characters-grid">
          ${this.puzzle.characters.map(char => `
            <div class="character-card">
              <span class="char-icon">${char.icon}</span>
              <div class="char-info">
                <span class="char-name">${char.name}</span>
                <span class="char-trait">${char.trait}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="logic-clues-box">
          <h4 class="box-title">DEDUCTION WITNESS STATEMENTS <span class="subtle-tip">(Tap a clue to pencil it out)</span></h4>
          <ul class="witness-statements">
            ${this.puzzle.clues.map((clue, idx) => `
              <li class="witness-clue" data-idx="${idx}">
                <span class="clue-check">◻</span>
                <span class="clue-text">${clue}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="deduction-verdict-box">
          <h4 class="box-title">THE CORONER'S QUESTION</h4>
          <p class="verdict-question">${this.puzzle.question}</p>
          <div class="options-group">
            ${this.puzzle.options.map(opt => `
              <button type="button" class="paper-choice-btn ${isSolved && opt.id === this.puzzle.correctOptionId ? 'is-correct' : ''}" data-id="${opt.id}">
                ${opt.text}
              </button>
            `).join('')}
          </div>
          <div class="logic-explanation" id="logic-exp-${this.puzzle.id}" style="${isSolved ? 'display:block;' : 'display:none;'}">
            <strong>Deduction Note:</strong> ${this.puzzle.explanation}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Strike-through clues for tactile newspaper feel
    this.container.querySelectorAll('.witness-clue').forEach(clueEl => {
      clueEl.addEventListener('click', () => {
        window.sundayAudio.playPencil(1.3);
        clueEl.classList.toggle('is-struck');
        const box = clueEl.querySelector('.clue-check');
        if (box) box.textContent = clueEl.classList.contains('is-struck') ? '☑' : '◻';
      });
    });

    // Options submission
    this.container.querySelectorAll('.paper-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.manager.state[this.puzzle.id]?.solved) return;
        const chosenId = btn.dataset.id;
        if (chosenId === this.puzzle.correctOptionId) {
          btn.classList.add('is-correct');
          this.container.querySelector(`#logic-exp-${this.puzzle.id}`).style.display = 'block';
          this.manager.markSolved(this.puzzle.id);
        } else {
          btn.classList.add('is-wrong');
          window.sundayAudio.playEraser();
          window.sundayApp.showToast("Not quite! Re-read the berry stains and delivery clues.");
          setTimeout(() => btn.classList.remove('is-wrong'), 1000);
        }
      });
    });
  }
}

/* ==========================================================================
   3. FIVE LETTERS (WORD LADDER)
   ========================================================================== */
class WordLadderController {
  constructor(puzzle, container, manager) {
    this.puzzle = puzzle;
    this.container = container;
    this.manager = manager;
    this.userAnswers = {}; // { [stepIdx]: string }
    this.render();
  }

  render() {
    const isSolved = this.manager.state[this.puzzle.id]?.solved;

    this.container.innerHTML = `
      <div class="word-ladder-wrapper">
        <div class="ladder-container">
          <!-- Start Word -->
          <div class="ladder-rung is-anchor">
            <span class="rung-tag">START</span>
            <div class="letter-tiles-row">
              ${this.puzzle.startWord.split('').map(l => `<span class="letter-tile fixed">${l}</span>`).join('')}
            </div>
            <span class="rung-clue-fixed">Given word</span>
          </div>

          <!-- Intermediate Steps -->
          ${this.puzzle.steps.map(step => `
            <div class="ladder-rung is-step" id="rung-${this.puzzle.id}-${step.index}">
              <span class="rung-tag">STEP ${step.index}</span>
              <div class="letter-tiles-row">
                ${Array(this.puzzle.startWord.length).fill('').map((_, cIdx) => `
                  <input type="text" class="letter-tile-input" maxlength="1" data-step="${step.index}" data-char="${cIdx}" autocomplete="off" autocapitalize="characters">
                `).join('')}
              </div>
              <div class="rung-clue-box">
                <span class="rung-clue-text">${step.clue}</span>
                <span class="rung-hint">Hint: ${step.hint}</span>
              </div>
            </div>
          `).join('')}

          <!-- Goal Word -->
          <div class="ladder-rung is-anchor">
            <span class="rung-tag">GOAL</span>
            <div class="letter-tiles-row">
              ${this.puzzle.goalWord.split('').map(l => `<span class="letter-tile fixed">${l}</span>`).join('')}
            </div>
            <span class="rung-clue-fixed">Destination</span>
          </div>
        </div>

        <div class="ladder-actions">
          <button type="button" class="paper-btn check-ladder-btn">Verify Ladder</button>
        </div>
      </div>
    `;

    this.bindEvents();
    if (isSolved) {
      this.fillSolved();
    }
  }

  bindEvents() {
    const inputs = this.container.querySelectorAll('.letter-tile-input');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const val = (e.target.value || '').toUpperCase().replace(/[^A-Z]/g, '');
        e.target.value = val;
        const step = parseInt(e.target.dataset.step);
        const cIdx = parseInt(e.target.dataset.char);

        if (val) {
          window.sundayAudio.playPencil(1.1);
          // Move to next character
          const next = this.container.querySelector(`.letter-tile-input[data-step="${step}"][data-char="${cIdx + 1}"]`);
          if (next) next.focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        const step = parseInt(e.target.dataset.step);
        const cIdx = parseInt(e.target.dataset.char);
        if (e.key === 'Backspace' && !input.value) {
          window.sundayAudio.playEraser();
          const prev = this.container.querySelector(`.letter-tile-input[data-step="${step}"][data-char="${cIdx - 1}"]`);
          if (prev) {
            prev.value = '';
            prev.focus();
          }
        }
      });
    });

    this.container.querySelector('.check-ladder-btn').addEventListener('click', () => {
      this.validate();
    });
  }

  validate() {
    let allCorrect = true;
    let allFilled = true;

    this.puzzle.steps.forEach(step => {
      let word = '';
      for (let i = 0; i < this.puzzle.startWord.length; i++) {
        const input = this.container.querySelector(`.letter-tile-input[data-step="${step.index}"][data-char="${i}"]`);
        const char = (input?.value || '').toUpperCase();
        if (!char) allFilled = false;
        word += char;
      }
      if (word !== step.solution.toUpperCase()) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      this.manager.markSolved(this.puzzle.id);
      this.fillSolved();
    } else {
      if (!allFilled) {
        window.sundayApp.showToast("Fill in all the letter boxes first!");
      } else {
        window.sundayAudio.playEraser();
        window.sundayApp.showToast("One or more steps are incorrect. Check the clues!");
      }
    }
  }

  fillSolved() {
    this.puzzle.steps.forEach(step => {
      const letters = step.solution.split('');
      letters.forEach((letter, i) => {
        const input = this.container.querySelector(`.letter-tile-input[data-step="${step.index}"][data-char="${i}"]`);
        if (input) {
          input.value = letter;
          input.disabled = true;
          input.classList.add('is-solved-tile');
        }
      });
    });
    const btn = this.container.querySelector('.check-ladder-btn');
    if (btn) btn.style.display = 'none';
  }
}

/* ==========================================================================
   4. VISUAL ODD ONE OUT CONTROLLER
   ========================================================================== */
class VisualController {
  constructor(puzzle, container, manager) {
    this.puzzle = puzzle;
    this.container = container;
    this.manager = manager;
    this.render();
  }

  render() {
    const isSolved = this.manager.state[this.puzzle.id]?.solved;

    this.container.innerHTML = `
      <div class="visual-wrapper">
        <div class="visual-hint-banner">
          <span>🔍 ${this.puzzle.hint}</span>
        </div>

        <div class="watches-display">
          ${this.puzzle.watches.map((w, idx) => `
            <div class="watch-card ${isSolved && w.flaw ? 'is-correct' : ''}" data-id="${w.id}">
              <div class="watch-illustration">
                ${this.generateWatchSvg(w, idx)}
              </div>
              <span class="watch-label">${w.label}</span>
              ${w.flaw && isSolved ? `<p class="flaw-explanation">${w.flawText}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  generateWatchSvg(w, idx) {
    // Generate clean vintage woodcut/ink style pocket watch
    const numerals = w.numerals || ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    
    return `
      <svg class="watch-svg" viewBox="0 0 200 200" width="160" height="160">
        <!-- Watch Ring & Crown -->
        <circle cx="100" cy="18" r="14" fill="none" stroke="#2c2416" stroke-width="3"/>
        <rect x="94" y="24" width="12" height="12" fill="#2c2416" rx="2"/>
        
        <!-- Outer Casing -->
        <circle cx="100" cy="110" r="82" fill="#fdfbf7" stroke="#2c2416" stroke-width="4"/>
        <circle cx="100" cy="110" r="76" fill="none" stroke="#6b5e4c" stroke-width="1" stroke-dasharray="2,3"/>
        <circle cx="100" cy="110" r="70" fill="none" stroke="#2c2416" stroke-width="1.5"/>

        <!-- Numerals -->
        ${numerals.map((num, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const r = 54;
          const x = 100 + r * Math.cos(angle);
          const y = 114 + r * Math.sin(angle);
          return `<text x="${x}" y="${y}" font-family="'Playfair Display', serif" font-size="11" font-weight="700" fill="#2c2416" text-anchor="middle">${num}</text>`;
        }).join('')}

        <!-- Minute ticks -->
        ${Array(60).fill(0).map((_, i) => {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const r1 = 66;
          const r2 = i % 5 === 0 ? 61 : 64;
          const x1 = 100 + r1 * Math.cos(angle);
          const y1 = 110 + r1 * Math.sin(angle);
          const x2 = 100 + r2 * Math.cos(angle);
          const y2 = 110 + r2 * Math.sin(angle);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2c2416" stroke-width="${i % 5 === 0 ? '1.5' : '0.75'}"/>`;
        }).join('')}

        <!-- Hands -->
        <line x1="100" y1="110" x2="100" y2="72" stroke="#2c2416" stroke-width="3" stroke-linecap="round"/>
        <line x1="100" y1="110" x2="135" y2="110" stroke="#2c2416" stroke-width="2" stroke-linecap="round"/>
        <circle cx="100" cy="110" r="5" fill="#2c2416"/>
        <circle cx="100" cy="110" r="2" fill="#faf6ee"/>
      </svg>
    `;
  }

  bindEvents() {
    this.container.querySelectorAll('.watch-card').forEach(card => {
      card.addEventListener('click', () => {
        if (this.manager.state[this.puzzle.id]?.solved) return;
        const id = card.dataset.id;
        if (id === this.puzzle.correctId) {
          card.classList.add('is-correct');
          const flawEl = document.createElement('p');
          flawEl.className = 'flaw-explanation';
          const match = this.puzzle.watches.find(w => w.id === id);
          flawEl.textContent = match?.flawText || "Spot on! Anomaly identified.";
          card.appendChild(flawEl);
          this.manager.markSolved(this.puzzle.id);
        } else {
          card.classList.add('is-wrong');
          window.sundayAudio.playEraser();
          window.sundayApp.showToast("This watch is mechanically sound. Look at the numbers on the dials!");
          setTimeout(() => card.classList.remove('is-wrong'), 800);
        }
      });
    });
  }
}

/* ==========================================================================
   5. THE SUNDAY MYSTERY CONTROLLER
   ========================================================================== */
class MysteryController {
  constructor(puzzle, container, manager) {
    this.puzzle = puzzle;
    this.container = container;
    this.manager = manager;
    this.render();
  }

  render() {
    const isSolved = this.manager.state[this.puzzle.id]?.solved;

    this.container.innerHTML = `
      <div class="mystery-wrapper">
        <div class="case-file">
          <div class="case-header">
            <span class="confidential-tag">SCOTLAND YARD DOCKET</span>
            <h3 class="case-headline">THE STRANGE OCCURRENCE AT THE MANOR</h3>
          </div>
          <p class="case-text">${this.puzzle.story}</p>
        </div>

        <div class="evidence-box">
          <h4 class="box-title">PHYSICAL EVIDENCE LOG</h4>
          <div class="evidence-grid">
            ${this.puzzle.evidence.map(ev => `
              <div class="evidence-card">
                <span>${ev}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="suspects-lineup">
          <h4 class="box-title">PERSONS OF INTEREST & STATEMENTS</h4>
          <div class="suspects-grid">
            ${this.puzzle.suspects.map(s => `
              <div class="suspect-card ${isSolved && s.id === this.puzzle.correctSuspectId ? 'is-culprit' : ''}" data-id="${s.id}">
                <div class="suspect-avatar">${s.icon}</div>
                <div class="suspect-meta">
                  <span class="suspect-name">${s.name}</span>
                  <span class="suspect-role">${s.role}</span>
                </div>
                <p class="suspect-statement">${s.statement}</p>
                <div class="suspect-details">
                  <span class="detail-badge">Umbrella: ${s.umbrella}</span>
                </div>
                <button type="button" class="paper-btn accuse-btn" data-id="${s.id}">Accuse Suspect</button>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="case-verdict" id="case-verdict-${this.puzzle.id}" style="${isSolved ? 'display:block;' : 'display:none;'}">
          <div class="case-solved-box">
            <h4 class="solved-headline">CASE SOLVED BY INSPECTOR HIGGINS</h4>
            <p class="solved-text">${this.puzzle.explanation}</p>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelectorAll('.accuse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.manager.state[this.puzzle.id]?.solved) return;
        const id = btn.dataset.id;
        if (id === this.puzzle.correctSuspectId) {
          const card = this.container.querySelector(`.suspect-card[data-id="${id}"]`);
          if (card) card.classList.add('is-culprit');
          this.container.querySelector(`#case-verdict-${this.puzzle.id}`).style.display = 'block';
          this.manager.markSolved(this.puzzle.id);
        } else {
          window.sundayAudio.playEraser();
          window.sundayApp.showToast("The evidence contradicts this accusation. Check the wet umbrella and boot prints!");
          const card = this.container.querySelector(`.suspect-card[data-id="${id}"]`);
          if (card) {
            card.classList.add('is-wrong');
            setTimeout(() => card.classList.remove('is-wrong'), 1000);
          }
        }
      });
    });
  }
}

window.PuzzleManager = PuzzleManager;
