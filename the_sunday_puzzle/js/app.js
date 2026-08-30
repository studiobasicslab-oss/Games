/**
 * The Sunday Puzzle - Main Application Controller
 * Handles edition routing, persistence, progress tracking, celebration modal,
 * newspaper animations, margin scratchpad, and inverted answers fold.
 */

class SundayApp {
  constructor() {
    this.editions = window.SUNDAY_EDITIONS || [];
    this.currentEditionId = this.loadCurrentEditionId();
    this.storageKey = 'sunday_puzzle_save_v2';
    this.savedData = this.loadState();
    this.puzzleManager = null;
    
    this.init();
  }

  loadCurrentEditionId() {
    return localStorage.getItem('sunday_current_edition') || this.editions[0]?.id || 'issue_35';
  }

  loadState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Could not load save state", e);
      return {};
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.savedData));
      localStorage.setItem('sunday_current_edition', this.currentEditionId);
    } catch (e) {
      console.warn("Could not save state", e);
    }
  }

  getEditionState(editionId) {
    if (!this.savedData[editionId]) {
      this.savedData[editionId] = {
        puzzles: {},
        scratchpad: "",
        completedAt: null
      };
    }
    return this.savedData[editionId];
  }

  init() {
    this.bindHeaderControls();
    this.bindScratchpad();
    this.bindInvertedAnswers();
    this.loadEdition(this.currentEditionId);
    this.bindModalEvents();
  }

  bindHeaderControls() {
    // Edition selector dropdown
    const select = document.getElementById('edition-select');
    if (select) {
      select.innerHTML = this.editions.map(ed => `
        <option value="${ed.id}" ${ed.id === this.currentEditionId ? 'selected' : ''}>
          Issue No. ${ed.issueNumber} — ${ed.dateFormatted.split(',')[1]?.trim() || ed.dateFormatted}
        </option>
      `).join('');

      select.addEventListener('change', (e) => {
        window.sundayAudio.playPaperFlip();
        this.loadEdition(e.target.value);
      });
    }

    // Audio Mute toggle
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = window.sundayAudio.toggleMute();
        audioBtn.innerHTML = isMuted ? '🔇 <span class="btn-label">Muted</span>' : '✏️ <span class="btn-label">Pencil Audio: ON</span>';
        this.showToast(isMuted ? "Pencil sound muted" : "Pencil sounds enabled");
      });
    }

    // Print button
    const printBtn = document.getElementById('print-edition-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Reset edition button
    const resetBtn = document.getElementById('reset-edition-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Erase all pencil marks and restart today's Sunday edition?")) {
          window.sundayAudio.playEraser();
          this.savedData[this.currentEditionId] = { puzzles: {}, scratchpad: "", completedAt: null };
          this.saveState();
          this.loadEdition(this.currentEditionId);
          this.showToast("Edition reset. Fresh paper ready!");
        }
      });
    }
  }

  bindScratchpad() {
    const scratchpad = document.getElementById('margin-scratchpad');
    if (scratchpad) {
      scratchpad.addEventListener('input', (e) => {
        const editionState = this.getEditionState(this.currentEditionId);
        editionState.scratchpad = e.target.value;
        this.saveState();
        window.sundayAudio.playPencil(0.9 + Math.random() * 0.3);
      });
    }
  }

  bindInvertedAnswers() {
    const btn = document.getElementById('flip-answers-btn');
    const content = document.getElementById('answers-inverted-text');
    if (btn && content) {
      btn.addEventListener('click', () => {
        window.sundayAudio.playPaperFlip();
        const isRevealed = content.classList.toggle('is-revealed');
        btn.innerHTML = isRevealed ? '🔄 Invert Back' : '🔄 Turn Paper Upside Down';
        this.showToast(isRevealed ? "Answers right-side up" : "Answers upside down");
      });
    }
  }

  loadEdition(editionId) {
    this.currentEditionId = editionId;
    this.saveState();

    const edition = this.editions.find(e => e.id === editionId) || this.editions[0];
    const editionState = this.getEditionState(edition.id);

    // Update Masthead
    const dateEl = document.getElementById('edition-date-text');
    if (dateEl) dateEl.textContent = edition.dateFormatted;

    const issueNoEl = document.getElementById('edition-issue-no');
    if (issueNoEl) issueNoEl.textContent = `ISSUE NO. ${edition.issueNumber}`;

    const subtitleEl = document.getElementById('edition-subtitle-text');
    if (subtitleEl) subtitleEl.textContent = edition.subtitle;

    const weatherEl = document.getElementById('weather-text');
    if (weatherEl) weatherEl.innerHTML = `<span class="weather-icon">☕</span> ${edition.weatherNote}`;

    const quoteEl = document.getElementById('editor-quote');
    if (quoteEl) quoteEl.textContent = edition.editorQuote;

    // Restore Scratchpad notes
    const scratchpad = document.getElementById('margin-scratchpad');
    if (scratchpad) {
      scratchpad.value = editionState.scratchpad || "";
    }

    // Update Inverted Solutions Box
    this.updateInvertedSolutions(edition);

    // Render Puzzles
    const container = document.getElementById('puzzles-container');
    if (container) {
      this.puzzleManager = new window.PuzzleManager(edition, editionState.puzzles, (puzzleId, solvedCount, totalCount) => {
        this.updateProgress(solvedCount, totalCount);
        this.saveState();
        if (solvedCount === totalCount && !editionState.completedAt) {
          editionState.completedAt = new Date().toISOString();
          this.saveState();
          setTimeout(() => this.showCelebrationModal(edition), 700);
        }
      });

      this.puzzleManager.renderAll(container);
      this.updateProgress(this.puzzleManager.getSolvedCount(), edition.puzzles.length);
    }
  }

  updateInvertedSolutions(edition) {
    const content = document.getElementById('answers-inverted-text');
    if (!content) return;

    let lines = [`<strong>Issue No. ${edition.issueNumber} Solutions:</strong><br>`];
    edition.puzzles.forEach(p => {
      if (p.type === 'crossword') {
        const grid = p.perfectGrid?.solution || p.cleanGrid?.solution || p.solution;
        const words = grid.map(row => row.join('')).join(', ');
        lines.push(`[${p.num} Crossword: ${words}]`);
      } else if (p.type === 'logic') {
        const correct = p.options.find(o => o.id === p.correctOptionId)?.text || p.correctOptionId;
        lines.push(`[${p.num} Logic: ${correct}]`);
      } else if (p.type === 'word_ladder') {
        const steps = [p.startWord, ...p.steps.map(s => s.solution), p.goalWord].join(' → ');
        lines.push(`[${p.num} Five Letters: ${steps}]`);
      } else if (p.type === 'visual_anomaly') {
        const correct = p.watches?.find(w => w.flaw)?.label || p.correctId;
        lines.push(`[${p.num} Visual: ${correct}]`);
      } else if (p.type === 'mystery') {
        const suspect = p.suspects?.find(s => s.id === p.correctSuspectId)?.name || p.correctSuspectId;
        lines.push(`[${p.num} Mystery: ${suspect}]`);
      }
    });

    content.innerHTML = lines.join('<br>');
    content.classList.remove('is-revealed');
    const btn = document.getElementById('flip-answers-btn');
    if (btn) btn.innerHTML = '🔄 Turn Paper Upside Down';
  }

  updateProgress(solvedCount, totalCount) {
    const meter = document.getElementById('progress-meter-text');
    if (meter) {
      meter.innerHTML = `<span class="progress-big">${solvedCount} / ${totalCount}</span> SOLVED`;
    }

    const stamp = document.getElementById('masthead-complete-stamp');
    if (stamp) {
      if (solvedCount === totalCount) {
        stamp.style.display = 'block';
        stamp.classList.add('rubber-stamp-slam');
      } else {
        stamp.style.display = 'none';
      }
    }
  }

  showCelebrationModal(edition) {
    const modal = document.getElementById('celebration-modal');
    if (!modal) return;

    window.sundayAudio.playStamp();
    setTimeout(() => window.sundayAudio.playVictory(), 200);

    const editionTitle = document.getElementById('modal-edition-name');
    if (editionTitle) editionTitle.textContent = `ISSUE NO. ${edition.issueNumber} (${edition.dateFormatted})`;

    modal.classList.add('is-open');
  }

  bindModalEvents() {
    const modal = document.getElementById('celebration-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const shareBtn = document.getElementById('share-result-btn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('is-open');
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const text = `📰 THE SUNDAY PUZZLE — 5 / 5 Solved! Finished today's broadsheet edition over coffee. ☕✨`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast("Copied Sunday completion clipping to clipboard!");
          });
        }
      });
    }
  }

  showToast(message) {
    let toast = document.getElementById('newspaper-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'newspaper-toast';
      toast.className = 'newspaper-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.sundayApp = new SundayApp();
});
