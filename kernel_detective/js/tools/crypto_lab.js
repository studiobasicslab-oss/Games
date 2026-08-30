/**
 * Kernel Detective: Cyber Forensics - CryptoLab Diagnostic Tool
 * Interactive XOR Stream Cipher Workbench, Crib Dragging Slider & Hash Extension Studio.
 */

import { sound } from '../audio.js';

export class CryptoLabTool {
    constructor(container) {
        this.container = container;
        this.activeCase = null;
    }

    render(currentCase) {
        this.activeCase = currentCase;
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'tool-pane-inner crypto-lab-pane';

        // Header status bar
        const header = document.createElement('div');
        header.className = 'tool-sub-header';
        header.innerHTML = `
            <div class="tool-title-group">
                <span class="tool-icon">🔑</span>
                <span class="tool-name">CryptoLab v3.4 [CIPHER & CRYPTANALYSIS WORKBENCH]</span>
            </div>
            <div class="tool-meta">
                <span class="badge">MATH: BITWISE XOR ⊕</span>
                <span class="badge highlight">ENTROPY: 7.94 bits/byte</span>
            </div>
        `;
        wrapper.appendChild(header);

        const content = document.createElement('div');
        content.className = 'crypto-content-layout';

        if (currentCase.evidence.type === 'xor_stream') {
            this.renderXorCribDragger(content, currentCase.evidence);
        } else if (currentCase.evidence.type === 'hash_extension') {
            this.renderHashExtensionStudio(content, currentCase.evidence);
        } else {
            this.renderGenericCrypto(content, currentCase.evidence);
        }

        wrapper.appendChild(content);
        this.container.appendChild(wrapper);
    }

    renderXorCribDragger(container, evidence) {
        const box = document.createElement('div');
        box.className = 'xor-crib-box';
        box.innerHTML = `
            <div class="crib-header">
                <h4>🧪 Interactive Crib-Dragging & Keystream Reuse Canceller</h4>
                <p class="desc">C1 ⊕ C2 = P1 ⊕ P2. Enter candidate plaintext in P1 to dynamically compute P2.</p>
            </div>
            <div class="crib-interactive-form">
                <div class="input-row">
                    <label>Known Plaintext 1 (P1):</label>
                    <input type="text" id="crib-input-p1" value="${evidence.p1_known}" maxlength="16" class="mono-input">
                </div>
                <div class="xor-math-display">
                    <div class="math-line">
                        <span class="lbl">C1 ⊕ C2 Hex:</span>
                        <span class="val mono">${evidence.c1_xor_c2.map(h => '0x' + h.toString(16).padStart(2, '0')).join(' ')}</span>
                    </div>
                    <div class="math-line">
                        <span class="lbl">Derived Plaintext 2 (P2):</span>
                        <span class="val mono highlight-p2" id="derived-p2">ATLAS</span>
                    </div>
                </div>
            </div>
        `;

        const input = box.querySelector('#crib-input-p1');
        const output = box.querySelector('#derived-p2');

        const calculateP2 = () => {
            const p1Str = input.value;
            let result = '';
            for (let i = 0; i < evidence.c1_xor_c2.length; i++) {
                if (i < p1Str.length) {
                    const p1Char = p1Str.charCodeAt(i);
                    const xorVal = evidence.c1_xor_c2[i];
                    const p2Char = p1Char ^ xorVal;
                    result += String.fromCharCode(p2Char);
                } else {
                    result += '?';
                }
            }
            output.textContent = result;
        };

        input.addEventListener('input', () => {
            sound.playKeypress();
            calculateP2();
        });

        container.appendChild(box);
    }

    renderHashExtensionStudio(container, evidence) {
        const box = document.createElement('div');
        box.className = 'hash-ext-box';
        box.innerHTML = `
            <div class="hash-header">
                <h4>🔨 Merkle-Damgård Length Extension Attack Simulator</h4>
                <p class="desc">Appends unauthorized parameters by initializing MD5/SHA state registers with the existing signature.</p>
            </div>
            <div class="hash-stages">
                <div class="stage-card">
                    <div class="stage-num">STAGE 1: INTERCEPTED REQUEST</div>
                    <div class="stage-body">
                        <div><strong>Message:</strong> <code>user=guest</code> (Length: 10 bytes)</div>
                        <div><strong>Valid MAC Signature:</strong> <code>9e107d9d372bb6826bd81d3542a419d6</code></div>
                    </div>
                </div>
                <div class="stage-card">
                    <div class="stage-num">STAGE 2: COMPUTED MD5 PADDING</div>
                    <div class="stage-body">
                        <div>Bit Padding: <code>\\x80\\x00... [512-bit block alignment]</code></div>
                        <div>Length Field: <code>0x0000000000000050</code> (80 bits)</div>
                    </div>
                </div>
                <div class="stage-card highlight">
                    <div class="stage-num">STAGE 3: FORGED INJECTED PAYLOAD</div>
                    <div class="stage-body">
                        <div><strong>Injected Command:</strong> <code>&admin=1</code></div>
                        <div><strong>Forged MAC Signature:</strong> <code>7a2d48f98c11e3b246a48910cb4519f0</code></div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(box);
    }

    renderGenericCrypto(container, evidence) {
        const box = document.createElement('div');
        box.className = 'generic-crypto-box';
        box.innerHTML = `
            <div class="cipher-box">
                <h4>🔐 Cryptographic Analyzer</h4>
                <div class="entropy-meter">
                    <span>Shannon Entropy: 7.94 / 8.00 (High / Encrypted)</span>
                    <div class="bar-fill" style="width: 98%;"></div>
                </div>
            </div>
        `;
        container.appendChild(box);
    }
}
