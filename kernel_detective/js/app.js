/**
 * Kernel Detective: Cyber Forensics - Main Application Orchestrator
 * Controls case lifecycle, tool swapping, verdict submission, audio, and UI state.
 */

import { sound } from './audio.js';
import { CASES } from './cases.js';
import { MANUALS } from './manuals.js';
import { HexViewTool } from './tools/hex_view.js';
import { LogicScopeTool } from './tools/logic_scope.js';
import { PacketSnifferTool } from './tools/packet_sniffer.js';
import { TraceDbgTool } from './tools/trace_dbg.js';
import { CryptoLabTool } from './tools/crypto_lab.js';
import { KernelInspectorTool } from './tools/kernel_inspector.js';

class KernelDetectiveApp {
    constructor() {
        this.cases = CASES;
        this.currentCaseIndex = 0;
        this.solvedCases = new Set();
        this.score = 0;
        this.activeToolName = 'hex_view';
        this.tools = {};
    }

    init() {
        this.loadProgress();
        this.setupTools();
        this.setupEventListeners();
        this.renderCaseList();
        this.loadCase(this.currentCaseIndex);
    }

    setupTools() {
        const workbench = document.getElementById('workbench-tool-mount');
        this.tools = {
            hex_view: new HexViewTool(workbench),
            logic_scope: new LogicScopeTool(workbench),
            packet_sniffer: new PacketSnifferTool(workbench),
            trace_dbg: new TraceDbgTool(workbench),
            crypto_lab: new CryptoLabTool(workbench),
            kernel_inspector: new KernelInspectorTool(workbench)
        };
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('kernel_detective_save');
            if (saved) {
                const data = JSON.parse(saved);
                this.solvedCases = new Set(data.solved || []);
                this.score = data.score || 0;
            }
        } catch (e) {
            console.warn('Progress load failed, resetting.', e);
        }
        this.updateHudStats();
    }

    saveProgress() {
        try {
            const data = {
                solved: Array.from(this.solvedCases),
                score: this.score
            };
            localStorage.setItem('kernel_detective_save', JSON.stringify(data));
        } catch (e) {
            console.warn('Progress save failed.', e);
        }
        this.updateHudStats();
    }

    updateHudStats() {
        const solvedCountEl = document.getElementById('hud-solved-count');
        const scoreEl = document.getElementById('hud-score');
        const rankEl = document.getElementById('hud-rank');

        if (solvedCountEl) solvedCountEl.textContent = `${this.solvedCases.size} / ${this.cases.length}`;
        if (scoreEl) scoreEl.textContent = `${this.score} PTS`;

        if (rankEl) {
            const count = this.solvedCases.size;
            if (count >= 20) rankEl.textContent = 'RING 0 ARCHITECT';
            else if (count >= 16) rankEl.textContent = 'KERNEL EXPLOIT DEV';
            else if (count >= 12) rankEl.textContent = 'REVERSE ENGINEER';
            else if (count >= 8) rankEl.textContent = 'NETWORK FORENSIC';
            else if (count >= 4) rankEl.textContent = 'JUNIOR INVESTIGATOR';
            else rankEl.textContent = 'TRAINEE DETECTIVE';
        }
    }

    loadCase(index) {
        if (index < 0 || index >= this.cases.length) return;
        this.currentCaseIndex = index;
        const currentCase = this.cases[index];

        sound.playDiskSeek();

        // Update Case Header & Briefing
        document.getElementById('case-number-badge').textContent = `CASE #${currentCase.number.toString().padStart(2, '0')}`;
        document.getElementById('case-act-badge').textContent = currentCase.actName;
        document.getElementById('case-title').textContent = currentCase.title;
        document.getElementById('case-difficulty').textContent = currentCase.difficulty;
        document.getElementById('case-briefing-text').textContent = currentCase.briefing;
        document.getElementById('evidence-name').textContent = currentCase.evidence.name;
        document.getElementById('evidence-desc').textContent = currentCase.evidence.description || 'Raw digital forensic artifact';
        document.getElementById('case-question-text').textContent = currentCase.question;

        // Reset Verdict input
        const answerInput = document.getElementById('verdict-input');
        if (answerInput) {
            answerInput.value = '';
            answerInput.focus();
        }

        // Switch to case's recommended primary tool
        this.switchTool(currentCase.primaryTool || 'hex_view');

        // Update manual reference button
        const manualBtn = document.getElementById('btn-open-case-manual');
        if (manualBtn && currentCase.manualId) {
            manualBtn.dataset.manualId = currentCase.manualId;
            manualBtn.textContent = `📖 Read ${currentCase.manualId.toUpperCase()} Spec`;
        }

        this.renderCaseList();
    }

    switchTool(toolName) {
        if (!this.tools[toolName]) return;
        this.activeToolName = toolName;

        // Update Tool Tab Buttons
        document.querySelectorAll('.tool-tab-btn').forEach(btn => {
            if (btn.dataset.tool === toolName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Render tool
        const currentCase = this.cases[this.currentCaseIndex];
        this.tools[toolName].render(currentCase);
    }

    submitVerdict() {
        const input = document.getElementById('verdict-input');
        if (!input) return;

        const userAns = input.value.trim().toLowerCase();
        const currentCase = this.cases[this.currentCaseIndex];
        const expected = currentCase.expectedAnswer.toLowerCase();

        const terminalOutput = document.getElementById('terminal-feedback');

        // Check if answer is correct (exact match or includes expected answer)
        const isCorrect = userAns === expected || userAns.includes(expected) || expected.includes(userAns) && userAns.length >= 3;

        if (isCorrect) {
            sound.playSuccess();
            terminalOutput.innerHTML = `<span class="text-success">✅ [CASE CLOSED] VERDICT VERIFIED: Match confirmed! Evidence parsed successfully.</span>`;

            if (!this.solvedCases.has(currentCase.id)) {
                this.solvedCases.add(currentCase.id);
                this.score += 250;
                this.saveProgress();
            }

            // Trigger confetti / modal
            this.showVictoryModal(currentCase);
        } else {
            sound.playError();
            terminalOutput.innerHTML = `<span class="text-error">❌ [ACCESS DENIED] INVALID VERDICT: Hash/signature mismatch. Review manuals and re-examine artifacts.</span>`;
        }
    }

    showVictoryModal(caseData) {
        const modal = document.getElementById('victory-modal');
        if (!modal) return;

        document.getElementById('victory-title').textContent = `CASE #${caseData.number} SOLVED: ${caseData.title}`;
        document.getElementById('victory-summary').textContent = `Excellent forensic work! The mystery behind "${caseData.title}" has been cracked using genuine computing principles.`;

        modal.classList.add('show');
    }

    openManual(manualId) {
        const manual = MANUALS[manualId] || MANUALS['ascii_binary'];
        const modal = document.getElementById('manual-modal');
        if (!modal) return;

        sound.playExecute();

        document.getElementById('manual-title').textContent = manual.title;
        document.getElementById('manual-category').textContent = manual.category;
        
        // Simple markdown formatter for manuals
        let html = manual.content
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '<p></p>')
            .replace(/^- (.*$)/gim, '<li>$1</li>');

        document.getElementById('manual-body').innerHTML = html;
        modal.classList.add('show');
    }

    renderCaseList() {
        const caseListContainer = document.getElementById('case-nav-list');
        if (!caseListContainer) return;

        caseListContainer.innerHTML = '';

        this.cases.forEach((c, idx) => {
            const isSolved = this.solvedCases.has(c.id);
            const isCurrent = idx === this.currentCaseIndex;

            const item = document.createElement('div');
            item.className = `case-nav-item ${isCurrent ? 'current' : ''} ${isSolved ? 'solved' : ''}`;
            item.innerHTML = `
                <div class="case-nav-num">${c.number.toString().padStart(2, '0')}</div>
                <div class="case-nav-info">
                    <div class="case-nav-title">${c.title}</div>
                    <div class="case-nav-meta">Act ${c.act} · ${c.difficulty}</div>
                </div>
                <div class="case-nav-status">${isSolved ? '✅' : '🔒'}</div>
            `;

            item.addEventListener('click', () => {
                sound.playKeypress();
                this.loadCase(idx);
            });

            caseListContainer.appendChild(item);
        });
    }

    setupEventListeners() {
        // Tool Switcher Buttons
        document.querySelectorAll('.tool-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                sound.playKeypress();
                this.switchTool(btn.dataset.tool);
            });
        });

        // Submit Verdict Button & Enter key
        const submitBtn = document.getElementById('btn-submit-verdict');
        const verdictInput = document.getElementById('verdict-input');

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitVerdict());
        }

        if (verdictInput) {
            verdictInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.submitVerdict();
                } else {
                    sound.playKeypress();
                }
            });
        }

        // Hint Button
        const hintBtn = document.getElementById('btn-show-hint');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                sound.playExecute();
                const currentCase = this.cases[this.currentCaseIndex];
                const terminalOutput = document.getElementById('terminal-feedback');
                terminalOutput.innerHTML = `<span class="text-hint">💡 [INVESTIGATOR HINT]: ${currentCase.hint}</span>`;
            });
        }

        // Case Manual Reference Button
        const manualBtn = document.getElementById('btn-open-case-manual');
        if (manualBtn) {
            manualBtn.addEventListener('click', () => {
                const manualId = manualBtn.dataset.manualId || 'ascii_binary';
                this.openManual(manualId);
            });
        }

        // Top HUD Manuals Archive Button
        const topManualsBtn = document.getElementById('btn-all-manuals');
        if (topManualsBtn) {
            topManualsBtn.addEventListener('click', () => {
                this.openManual('ascii_binary');
            });
        }

        // Audio Mute Toggle
        const audioBtn = document.getElementById('btn-toggle-audio');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                const isMuted = sound.toggleMute();
                audioBtn.textContent = isMuted ? '🔇' : '🔊';
                audioBtn.title = isMuted ? 'Sound Muted' : 'Sound Enabled';
            });
        }

        // Modal Close Buttons
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                sound.playKeypress();
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
            });
        });

        // Next Case Button in Victory Modal
        const nextCaseBtn = document.getElementById('btn-next-case');
        if (nextCaseBtn) {
            nextCaseBtn.addEventListener('click', () => {
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
                if (this.currentCaseIndex + 1 < this.cases.length) {
                    this.loadCase(this.currentCaseIndex + 1);
                }
            });
        }
    }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new KernelDetectiveApp();
    app.init();
    window.kernelApp = app;
});
