/**
 * Kernel Detective: Cyber Forensics - TraceDbg Diagnostic Tool
 * Interactive x86-64 Assembly Disassembler, CPU Register Pane & Stack Frame Forensics.
 */

import { sound } from '../audio.js';

export class TraceDbgTool {
    constructor(container) {
        this.container = container;
        this.activeCase = null;
        this.currentStep = 0;
    }

    render(currentCase) {
        this.activeCase = currentCase;
        this.currentStep = 0;
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'tool-pane-inner trace-dbg-pane';

        // Header status bar
        const header = document.createElement('div');
        header.className = 'tool-sub-header';
        header.innerHTML = `
            <div class="tool-title-group">
                <span class="tool-icon">🛠️</span>
                <span class="tool-name">TraceDbg v5.1 [x86-64 INTERACTIVE REVERSER]</span>
            </div>
            <div class="tool-meta">
                <span class="badge">ARCH: AMD64 / ELF-64</span>
                <span class="badge highlight">STATE: BREAKPOINT HIT</span>
            </div>
        `;
        wrapper.appendChild(header);

        const content = document.createElement('div');
        content.className = 'dbg-layout-grid';

        // Left pane: Disassembly view
        const disasmCol = document.createElement('div');
        disasmCol.className = 'dbg-disasm-col';

        let instructions = [];
        if (currentCase.evidence.instructions) {
            instructions = currentCase.evidence.instructions;
        } else if (currentCase.evidence.disassembly) {
            instructions = currentCase.evidence.disassembly.split('\n');
        } else if (currentCase.evidence.gadgets) {
            instructions = currentCase.evidence.gadgets;
        } else {
            instructions = [
                "0x401000: mov rax, [rdi]",
                "0x401004: xor rax, 0x5a",
                "0x401008: cmp rax, 0x18",
                "0x40100c: je 0x401050 <disarm_device>",
                "0x40100e: jmp 0x401080 <detonate>"
            ];
        }

        disasmCol.innerHTML = `
            <div class="dbg-sub-title">
                <span>⚡ Disassembly Listing (RIP: 0x0000000000401000)</span>
                <div class="dbg-controls">
                    <button class="dbg-step-btn" id="btn-dbg-step">▶ Step Into (F7)</button>
                    <button class="dbg-step-btn" id="btn-dbg-reset">⏮ Reset (F9)</button>
                </div>
            </div>
            <div class="disasm-code-lines" id="disasm-lines">
                ${instructions.map((line, idx) => `
                    <div class="asm-line ${idx === 0 ? 'current-rip' : ''}" data-idx="${idx}">
                        <span class="asm-marker">${idx === 0 ? '➡' : ' '}</span>
                        <span class="asm-text">${line}</span>
                    </div>
                `).join('')}
            </div>
        `;

        // Right pane: Registers & Stack Frames
        const sideCol = document.createElement('div');
        sideCol.className = 'dbg-side-col';

        sideCol.innerHTML = `
            <div class="dbg-registers-card">
                <div class="card-title">🖥️ CPU Registers (AMD64)</div>
                <div class="reg-grid">
                    <div class="reg-item"><span class="reg-name">RAX:</span> <span class="reg-val" id="reg-rax">0x0000000000000042</span></div>
                    <div class="reg-item"><span class="reg-name">RBX:</span> <span class="reg-val">0x0000000000000000</span></div>
                    <div class="reg-item"><span class="reg-name">RDI:</span> <span class="reg-val" id="reg-rdi">0x00007fffffffe400</span></div>
                    <div class="reg-item"><span class="reg-name">RSI:</span> <span class="reg-val">0x0000000000000001</span></div>
                    <div class="reg-item"><span class="reg-name">RSP:</span> <span class="reg-val">0x00007fffffffe3f0</span></div>
                    <div class="reg-item"><span class="reg-name">RBP:</span> <span class="reg-val">0x00007fffffffe440</span></div>
                    <div class="reg-item"><span class="reg-name">RIP:</span> <span class="reg-val" id="reg-rip">0x0000000000401000</span></div>
                    <div class="reg-item"><span class="reg-name">EFLAGS:</span> <span class="reg-val">[ZF:1 CF:0 PF:1]</span></div>
                </div>
            </div>

            <div class="dbg-stack-card">
                <div class="card-title">📚 Stack Frame Forensics</div>
                <div class="stack-view">
                    <div class="stack-row"><span class="addr">0x7fffffffe448:</span> <span class="val highlight-rip">&lt;__libc_start_main+243&gt; [Saved RIP]</span></div>
                    <div class="stack-row"><span class="addr">0x7fffffffe440:</span> <span class="val">0x00007fffffffe460 [Saved RBP]</span></div>
                    <div class="stack-row"><span class="addr">0x7fffffffe400:</span> <span class="val">"0x42" (User input buffer [64 bytes])</span></div>
                </div>
            </div>
        `;

        const stepBtn = disasmCol.querySelector('#btn-dbg-step');
        const resetBtn = disasmCol.querySelector('#btn-dbg-reset');

        stepBtn.addEventListener('click', () => {
            sound.playKeypress();
            this.currentStep = (this.currentStep + 1) % instructions.length;
            disasmCol.querySelectorAll('.asm-line').forEach((l, i) => {
                if (i === this.currentStep) {
                    l.classList.add('current-rip');
                    l.querySelector('.asm-marker').textContent = '➡';
                } else {
                    l.classList.remove('current-rip');
                    l.querySelector('.asm-marker').textContent = ' ';
                }
            });
        });

        resetBtn.addEventListener('click', () => {
            sound.playExecute();
            this.currentStep = 0;
            disasmCol.querySelectorAll('.asm-line').forEach((l, i) => {
                if (i === 0) {
                    l.classList.add('current-rip');
                    l.querySelector('.asm-marker').textContent = '➡';
                } else {
                    l.classList.remove('current-rip');
                    l.querySelector('.asm-marker').textContent = ' ';
                }
            });
        });

        content.appendChild(disasmCol);
        content.appendChild(sideCol);
        wrapper.appendChild(content);
        this.container.appendChild(wrapper);
    }
}
