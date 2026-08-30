/**
 * Kernel Detective: Cyber Forensics - KernelInspector Diagnostic Tool
 * MMU Page Table Walker, Spectre Cache Latency Profiler & DRAM Rowhammer Matrix.
 */

import { sound } from '../audio.js';

export class KernelInspectorTool {
    constructor(container) {
        this.container = container;
        this.activeCase = null;
    }

    render(currentCase) {
        this.activeCase = currentCase;
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'tool-pane-inner kernel-inspector-pane';

        // Header status bar
        const header = document.createElement('div');
        header.className = 'tool-sub-header';
        header.innerHTML = `
            <div class="tool-title-group">
                <span class="tool-icon">🧠</span>
                <span class="tool-name">KernelInspector v6.0 [MMU & MICROARCHITECTURAL PROFILER]</span>
            </div>
            <div class="tool-meta">
                <span class="badge">CR3: 0x0000000000100000</span>
                <span class="badge highlight">RING: RING 0 (KERNEL SUPERVISOR)</span>
            </div>
        `;
        wrapper.appendChild(header);

        const content = document.createElement('div');
        content.className = 'kernel-content-layout';

        if (currentCase.evidence.type === 'cache_timing') {
            this.renderSpectreCacheProfiler(content, currentCase.evidence);
        } else if (currentCase.evidence.type === 'virtual_address') {
            this.renderPageTableWalker(content, currentCase.evidence);
        } else if (currentCase.evidence.type === 'dram_activation') {
            this.renderRowhammerMatrix(content, currentCase.evidence);
        } else {
            this.renderGeneralKernelView(content, currentCase.evidence);
        }

        wrapper.appendChild(content);
        this.container.appendChild(wrapper);
    }

    renderSpectreCacheProfiler(container, evidence) {
        const box = document.createElement('div');
        box.className = 'spectre-profiler-box';
        box.innerHTML = `
            <div class="spectre-header">
                <h4>⏱️ Flush+Reload CPU Cycle Latency Histogram (256 Memory Pages)</h4>
                <p class="desc">Cache Hit (< 40 cycles) indicates speculative access. Cache Miss (> 150 cycles) indicates unaccessed page.</p>
            </div>
            <div class="spectre-histogram-container">
                <div class="histogram-bars" id="histogram-bars"></div>
            </div>
            <div class="spectre-summary-card">
                <div class="hit-report">
                    <span class="lbl">Detected Cache Hit:</span>
                    <span class="val highlight">Page Index: 0x4B ('K') | Latency: 32 CPU Cycles [L1/L2 HIT]</span>
                </div>
                <div class="miss-report">
                    <span class="lbl">All Other Pages (0x00..0x4A, 0x4C..0xFF):</span>
                    <span class="val">Average Latency: ~220 CPU Cycles [DRAM CACHE MISS]</span>
                </div>
            </div>
        `;

        const barsContainer = box.querySelector('#histogram-bars');
        for (let i = 0; i < 64; i++) {
            const pageHex = (i * 4).toString(16).toUpperCase().padStart(2, '0');
            const isHit = pageHex === '48' || pageHex === '4C'; // around 0x4B

            const bar = document.createElement('div');
            bar.className = `hist-bar ${isHit ? 'hit-bar' : 'miss-bar'}`;
            const heightPercent = isHit ? 18 : 88; // Lower latency = lower height or vice versa
            bar.style.height = `${heightPercent}%`;
            bar.title = `Page 0x${pageHex}: ${isHit ? '32 cycles (HIT)' : '224 cycles (MISS)'}`;

            bar.addEventListener('click', () => {
                sound.playKeypress();
            });

            barsContainer.appendChild(bar);
        }

        container.appendChild(box);
    }

    renderPageTableWalker(container, evidence) {
        const box = document.createElement('div');
        box.className = 'page-walker-box';
        box.innerHTML = `
            <div class="walker-header">
                <h4>🗺️ x86-64 4-Level MMU Virtual Address Translation</h4>
                <p class="desc">Virtual Address: <code>${evidence.virtualAddress}</code></p>
            </div>
            <div class="paging-levels-grid">
                <div class="level-card">
                    <div class="lvl-name">PML4 (Bits 47..39)</div>
                    <div class="lvl-val">Index: 0x0FF</div>
                </div>
                <div class="level-card">
                    <div class="lvl-name">PDPT (Bits 38..30)</div>
                    <div class="lvl-val">Index: 0x1FE</div>
                </div>
                <div class="level-card">
                    <div class="lvl-name">PD (Bits 29..21)</div>
                    <div class="lvl-val">Index: 0x002</div>
                </div>
                <div class="level-card">
                    <div class="lvl-name">PT (Bits 20..12)</div>
                    <div class="lvl-val">Index: 0x012</div>
                </div>
                <div class="level-card highlight">
                    <div class="lvl-name">OFFSET (Bits 11..0)</div>
                    <div class="lvl-val highlight-val">Offset: 0x000</div>
                </div>
            </div>
        `;
        container.appendChild(box);
    }

    renderRowhammerMatrix(container, evidence) {
        const box = document.createElement('div');
        box.className = 'rowhammer-box';
        box.innerHTML = `
            <div class="dram-header">
                <h4>💥 DRAM Bank Physical Wordline & Bit-Flip Matrix</h4>
                <p class="desc">Double-sided aggressive hammering on aggressor rows induced electromagnetic bit corruption in victim Row #42.</p>
            </div>
            <div class="dram-rows">
                <div class="dram-row aggressor">
                    <span class="row-tag">Aggressor Row N-1 (Active Pulse)</span>
                    <div class="row-pulses">⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡</div>
                </div>
                <div class="dram-row victim">
                    <span class="row-tag">Victim Row N (PTE Target)</span>
                    <div class="bit-flip-indicator">
                        <span>PTE Bit 1 (R/W): 0 (Read-Only)</span>
                        <span class="arrow">➔</span>
                        <span class="highlight-val">FLIPPED TO 1 (Read/Write Supervisor)</span>
                    </div>
                </div>
                <div class="dram-row aggressor">
                    <span class="row-tag">Aggressor Row N+1 (Active Pulse)</span>
                    <div class="row-pulses">⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡</div>
                </div>
            </div>
        `;
        container.appendChild(box);
    }

    renderGeneralKernelView(container, evidence) {
        const box = document.createElement('div');
        box.className = 'general-kernel-box';
        box.innerHTML = `
            <div class="kernel-info-card">
                <h4>🛡️ Linux Kernel Ring 0 Supervisor</h4>
                <p>System Call Table Address: <code>0xffffffff81e001e0</code></p>
            </div>
        `;
        container.appendChild(box);
    }
}
