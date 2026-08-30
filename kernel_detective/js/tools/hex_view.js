/**
 * Kernel Detective: Cyber Forensics - HexView Diagnostic Tool
 * Renders interactive Hex grids, ASCII view, byte offsets, paper-tape punches, and Hamming ECC bit repairers.
 */

import { sound } from '../audio.js';

export class HexViewTool {
    constructor(container) {
        this.container = container;
        this.activeCase = null;
    }

    render(currentCase) {
        this.activeCase = currentCase;
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'tool-pane-inner hex-view-pane';

        // Header status bar
        const header = document.createElement('div');
        header.className = 'tool-sub-header';
        header.innerHTML = `
            <div class="tool-title-group">
                <span class="tool-icon">👾</span>
                <span class="tool-name">HexView v4.2 [RAW BYTE FORENSICS]</span>
            </div>
            <div class="tool-meta">
                <span class="badge">OFFSET: 0x00000000</span>
                <span class="badge highlight">MODE: 8-BIT / BIG-ENDIAN</span>
            </div>
        `;
        wrapper.appendChild(header);

        // Tool Content according to case
        const content = document.createElement('div');
        content.className = 'hex-grid-container';

        if (currentCase.evidence.type === 'paper_tape') {
            this.renderPaperTapeView(content, currentCase.evidence);
        } else if (currentCase.evidence.type === 'hamming_block') {
            this.renderHammingView(content, currentCase.evidence);
        } else if (currentCase.evidence.type === 'lsb_bytes') {
            this.renderLsbView(content, currentCase.evidence);
        } else {
            this.renderGenericHexView(content, currentCase.evidence);
        }

        wrapper.appendChild(content);
        this.container.appendChild(wrapper);
    }

    renderPaperTapeView(container, evidence) {
        const tapeBox = document.createElement('div');
        tapeBox.className = 'paper-tape-display';
        tapeBox.innerHTML = `
            <div class="tape-header">
                <h4>📜 8-Channel Punched Paper Tape Scanner</h4>
                <p class="desc">Each vertical column represents 1 byte (Ch 8 = MSB, Ch 1 = LSB). Sprocket holes guide the clock.</p>
            </div>
            <div class="tape-strip" id="tape-strip"></div>
            <div class="tape-decoded-preview" id="tape-preview">
                <span class="label">Interactive ASCII Decoder:</span>
                <div class="tape-decoded-chars" id="decoded-chars"></div>
            </div>
        `;

        const tapeStrip = tapeBox.querySelector('#tape-strip');
        const previewContainer = tapeBox.querySelector('#decoded-chars');

        evidence.rawBytes.forEach((byteData, idx) => {
            const col = document.createElement('div');
            col.className = 'tape-column';
            col.title = `Byte #${idx}: 0x${byteData.hex} (${byteData.binary}) -> '${byteData.char}'`;

            let holesHtml = '';
            for (let ch = 7; ch >= 0; ch--) {
                const isHole = byteData.punch[7 - ch] === 1;
                holesHtml += `<div class="tape-hole ${isHole ? 'punched' : 'solid'}"></div>`;
                if (ch === 4) {
                    // Sprocket guide hole
                    holesHtml += `<div class="tape-sprocket"></div>`;
                }
            }

            col.innerHTML = `
                <div class="col-idx">#${idx}</div>
                <div class="holes-stack">${holesHtml}</div>
                <div class="col-hex">0x${byteData.hex}</div>
                <div class="col-ascii">'${byteData.char}'</div>
            `;

            col.addEventListener('click', () => {
                sound.playKeypress();
                document.querySelectorAll('.tape-column').forEach(c => c.classList.remove('selected'));
                col.classList.add('selected');
            });

            tapeStrip.appendChild(col);

            const charBadge = document.createElement('span');
            charBadge.className = 'char-badge';
            charBadge.textContent = byteData.char;
            previewContainer.appendChild(charBadge);
        });

        container.appendChild(tapeBox);
    }

    renderHammingView(container, evidence) {
        const eccBox = document.createElement('div');
        eccBox.className = 'ecc-analyzer-box';
        eccBox.innerHTML = `
            <div class="ecc-header">
                <h4>🛡️ Hamming(7,4) Single Error Correction Matrix</h4>
                <p class="desc">Codeword Bits (1 to 7). Click any bit to toggle state and test syndrome vectors.</p>
            </div>
            <div class="bit-interactive-row" id="ecc-bits-row"></div>
            <div class="syndrome-calc-panel" id="syndrome-panel"></div>
        `;

        const bitsRow = eccBox.querySelector('#ecc-bits-row');
        const syndromePanel = eccBox.querySelector('#syndrome-panel');

        let currentBits = [...evidence.bits];

        const updateSyndrome = () => {
            const b1 = currentBits[0], b2 = currentBits[1], b3 = currentBits[2];
            const b4 = currentBits[3], b5 = currentBits[4], b6 = currentBits[5], b7 = currentBits[6];

            const s1 = b1 ^ b3 ^ b5 ^ b7;
            const s2 = b2 ^ b3 ^ b6 ^ b7;
            const s3 = b4 ^ b5 ^ b6 ^ b7;
            const syndromeDecimal = (s3 << 2) | (s2 << 1) | s1;

            syndromePanel.innerHTML = `
                <div class="syndrome-equations">
                    <div class="eq-item">s1 = b1⊕b3⊕b5⊕b7 = ${b1}⊕${b3}⊕${b5}⊕${b7} = <span class="val">${s1}</span></div>
                    <div class="eq-item">s2 = b2⊕b3⊕b6⊕b7 = ${b2}⊕${b3}⊕${b6}⊕${b7} = <span class="val">${s2}</span></div>
                    <div class="eq-item">s3 = b4⊕b5⊕b6⊕b7 = ${b4}⊕${b5}⊕${b6}⊕${b7} = <span class="val">${s3}</span></div>
                </div>
                <div class="syndrome-result ${syndromeDecimal === 0 ? 'valid' : 'error'}">
                    <div class="syn-badge">Syndrome: [s3 s2 s1] = [${s3} ${s2} ${s1}] (${syndromeDecimal})</div>
                    <div class="syn-status">
                        ${syndromeDecimal === 0 
                            ? '✅ No Errors Detected! Codeword Valid.' 
                            : `⚠️ Error Detected at Bit #${syndromeDecimal}! Invert Bit #${syndromeDecimal} to repair.`}
                    </div>
                </div>
            `;
        };

        const renderBits = () => {
            bitsRow.innerHTML = '';
            const labels = ["p1 (Bit 1)", "p2 (Bit 2)", "d1 (Bit 3)", "p3 (Bit 4)", "d2 (Bit 5)", "d3 (Bit 6)", "d4 (Bit 7)"];
            currentBits.forEach((bit, i) => {
                const bitCard = document.createElement('div');
                bitCard.className = `bit-card ${bit === 1 ? 'one' : 'zero'}`;
                bitCard.innerHTML = `
                    <div class="bit-pos">${labels[i]}</div>
                    <div class="bit-val">${bit}</div>
                    <button class="bit-toggle-btn">Toggle</button>
                `;
                bitCard.querySelector('.bit-toggle-btn').addEventListener('click', () => {
                    sound.playToggle();
                    currentBits[i] = currentBits[i] === 1 ? 0 : 1;
                    renderBits();
                    updateSyndrome();
                });
                bitsRow.appendChild(bitCard);
            });
        };

        renderBits();
        updateSyndrome();
        container.appendChild(eccBox);
    }

    renderLsbView(container, evidence) {
        const lsbBox = document.createElement('div');
        lsbBox.className = 'lsb-analyzer-box';
        lsbBox.innerHTML = `
            <div class="lsb-header">
                <h4>🎨 Least Significant Bit (LSB) Steganography Filter</h4>
                <p class="desc">Extracting Bit 0 (LSB) from each sequential RGB Blue channel byte.</p>
            </div>
            <div class="lsb-table">
                <table class="hex-table">
                    <thead>
                        <tr>
                            <th>Channel Byte</th>
                            <th>Hex Value</th>
                            <th>Binary (8-bit)</th>
                            <th>Extracted Bit 0</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${evidence.bytes.map((b, idx) => {
                            const bin = b.toString(2).padStart(8, '0');
                            const lsb = b & 1;
                            return `
                                <tr>
                                    <td>Blue [Offset +${idx}]</td>
                                    <td class="hex-val">0x${b.toString(16).toUpperCase().padStart(2, '0')}</td>
                                    <td class="bin-val">${bin.slice(0, 7)}<span class="highlight-bit">${bin[7]}</span></td>
                                    <td class="lsb-val highlight-bit">${lsb}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        container.appendChild(lsbBox);
    }

    renderGenericHexView(container, evidence) {
        const hexBox = document.createElement('div');
        hexBox.className = 'generic-hex-inspector';
        hexBox.innerHTML = `
            <div class="hex-raw-view">
                <div class="hex-table-wrapper">
                    <table class="hex-dump-table">
                        <thead>
                            <tr>
                                <th>Offset</th>
                                <th>00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F</th>
                                <th>Decoded ASCII</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="offset">00000000</td>
                                <td class="bytes">7F 45 4C 46 02 01 01 00  00 00 00 00 00 00 00 00</td>
                                <td class="ascii">.ELF............</td>
                            </tr>
                            <tr>
                                <td class="offset">00000010</td>
                                <td class="bytes">02 00 3E 00 01 00 00 00  40 10 40 00 00 00 00 00</td>
                                <td class="ascii">..>.....@.@.....</td>
                            </tr>
                            <tr>
                                <td class="offset">00000020</td>
                                <td class="bytes">48 83 EC 08 48 89 7C 24  08 48 8B 44 24 08 C3 90</td>
                                <td class="ascii">H..H.|$.H.D$...</td>
                            </tr>
                            <tr>
                                <td class="offset">000001FE</td>
                                <td class="bytes highlight-cell">55 AA 00 00 00 00 00 00  00 00 00 00 00 00 00 00</td>
                                <td class="ascii">U...............</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.appendChild(hexBox);
    }
}
