/**
 * Kernel Detective: Cyber Forensics - LogicScope Diagnostic Tool
 * Virtual Breadboard, Logic Gate Simulator, UART Waveform Analyzer, and FSK Demodulator.
 */

import { sound } from '../audio.js';

export class LogicScopeTool {
    constructor(container) {
        this.container = container;
        this.activeCase = null;
    }

    render(currentCase) {
        this.activeCase = currentCase;
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'tool-pane-inner logic-scope-pane';

        // Header status bar
        const header = document.createElement('div');
        header.className = 'tool-sub-header';
        header.innerHTML = `
            <div class="tool-title-group">
                <span class="tool-icon">⚡</span>
                <span class="tool-name">LogicScope v3.8 [CIRCUIT & SIGNAL ANALYZER]</span>
            </div>
            <div class="tool-meta">
                <span class="badge">SAMPLE: 100 MSa/s</span>
                <span class="badge highlight">TRIGGER: CH1 RISING</span>
            </div>
        `;
        wrapper.appendChild(header);

        const content = document.createElement('div');
        content.className = 'logic-content-container';

        if (currentCase.evidence.type === 'logic_circuit') {
            this.renderBreadboardCircuit(content, currentCase.evidence);
        } else if (currentCase.evidence.type === 'fsk_signal') {
            this.renderFskOscilloscope(content, currentCase.evidence);
        } else if (currentCase.evidence.type === 'uart_frame') {
            this.renderUartWaveform(content, currentCase.evidence);
        } else {
            this.renderGeneralOscilloscope(content, currentCase.evidence);
        }

        wrapper.appendChild(content);
        this.container.appendChild(wrapper);
    }

    renderBreadboardCircuit(container, evidence) {
        const box = document.createElement('div');
        box.className = 'circuit-sim-box';
        box.innerHTML = `
            <div class="circuit-header">
                <h4>🔌 Virtual TTL Breadboard: Gate Logic Simulator</h4>
                <p class="desc">Circuit Equation: <code>Output = (A AND B) OR (NOT C AND A)</code>. Toggle inputs to observe output state.</p>
            </div>
            <div class="circuit-board">
                <div class="circuit-inputs">
                    <div class="input-switch-group">
                        <label>Badge A (Input A):</label>
                        <button class="switch-btn" id="switch-a" data-val="0">0 (LOW)</button>
                    </div>
                    <div class="input-switch-group">
                        <label>Badge B (Input B):</label>
                        <button class="switch-btn" id="switch-b" data-val="0">0 (LOW)</button>
                    </div>
                    <div class="input-switch-group">
                        <label>Keycard C (Input C):</label>
                        <button class="switch-btn" id="switch-c" data-val="0">0 (LOW)</button>
                    </div>
                </div>

                <div class="circuit-schematic-diagram">
                    <div class="gate-node and-gate">
                        <div class="gate-label">AND (A, B)</div>
                        <div class="gate-status" id="status-and">0</div>
                    </div>
                    <div class="gate-node not-gate">
                        <div class="gate-label">NOT (C)</div>
                        <div class="gate-status" id="status-not">1</div>
                    </div>
                    <div class="gate-node or-gate">
                        <div class="gate-label">OR GATE (FINAL)</div>
                        <div class="gate-status" id="status-output">0</div>
                    </div>
                </div>

                <div class="circuit-output-panel">
                    <div class="led-indicator" id="circuit-led">
                        <div class="led-bulb"></div>
                        <span class="led-text" id="led-label">LOCK ENGAGED (0)</span>
                    </div>
                </div>
            </div>
        `;

        let stateA = 0, stateB = 0, stateC = 0;

        const updateCircuit = () => {
            const andOut = (stateA === 1 && stateB === 1) ? 1 : 0;
            const notOut = stateC === 0 ? 1 : 0;
            const and2Out = (notOut === 1 && stateA === 1) ? 1 : 0;
            const finalOut = (andOut === 1 || and2Out === 1) ? 1 : 0;

            box.querySelector('#status-and').textContent = andOut;
            box.querySelector('#status-not').textContent = notOut;
            box.querySelector('#status-output').textContent = finalOut;

            const led = box.querySelector('#circuit-led');
            const ledLabel = box.querySelector('#led-label');

            if (finalOut === 1) {
                led.className = 'led-indicator active';
                ledLabel.textContent = 'SOLENOID HIGH: DOOR UNLOCKED (1)';
            } else {
                led.className = 'led-indicator';
                ledLabel.textContent = 'LOCK ENGAGED: ACCESS DENIED (0)';
            }
        };

        const setupSwitch = (id, getter, setter) => {
            const btn = box.querySelector(id);
            btn.addEventListener('click', () => {
                sound.playToggle();
                const newVal = getter() === 0 ? 1 : 0;
                setter(newVal);
                btn.dataset.val = newVal;
                btn.textContent = newVal === 1 ? '1 (HIGH)' : '0 (LOW)';
                btn.className = `switch-btn ${newVal === 1 ? 'active' : ''}`;
                updateCircuit();
            });
        };

        setupSwitch('#switch-a', () => stateA, (v) => { stateA = v; });
        setupSwitch('#switch-b', () => stateB, (v) => { stateB = v; });
        setupSwitch('#switch-c', () => stateC, (v) => { stateC = v; });

        container.appendChild(box);
    }

    renderFskOscilloscope(container, evidence) {
        const box = document.createElement('div');
        box.className = 'fsk-scope-box';
        box.innerHTML = `
            <div class="fsk-header">
                <h4>📡 Bell 103 FSK Demodulator & Audio Spectrogram</h4>
                <p class="desc">Mark Tone = 1270 Hz (Binary 1), Space Tone = 1070 Hz (Binary 0). Click tone to listen.</p>
            </div>
            <div class="tones-timeline">
                ${evidence.tones.map((tone, idx) => {
                    const isMark = tone === 1270;
                    return `
                        <div class="tone-slot ${isMark ? 'mark' : 'space'}" data-tone="${tone}">
                            <div class="tone-idx">Interval #${idx + 1}</div>
                            <div class="tone-wave">
                                <div class="sine-anim"></div>
                            </div>
                            <div class="tone-freq">${tone} Hz</div>
                            <div class="tone-bit">${isMark ? '1 (Mark)' : '0 (Space)'}</div>
                            <button class="tone-play-btn" data-freq="${tone}">🔊 Listen</button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        box.querySelectorAll('.tone-play-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const freq = parseInt(btn.dataset.freq, 10);
                sound.playModemChirp(freq === 1270);
            });
        });

        container.appendChild(box);
    }

    renderUartWaveform(container, evidence) {
        const box = document.createElement('div');
        box.className = 'uart-scope-box';
        box.innerHTML = `
            <div class="uart-header">
                <h4>📈 RS-232 / UART Digital Logic Analyzer</h4>
                <p class="desc">10-bit Serial Frame (Idle -> Start (0) -> Data b0..b7 (LSB-first) -> Stop (1)).</p>
            </div>
            <div class="waveform-canvas-container">
                <canvas id="uart-waveform" width="700" height="140"></canvas>
            </div>
            <div class="frame-bits-breakdown">
                <div class="bit-tag start">Start: 0</div>
                <div class="bit-tag data">b0: 1</div>
                <div class="bit-tag data">b1: 0</div>
                <div class="bit-tag data">b2: 0</div>
                <div class="bit-tag data">b3: 1</div>
                <div class="bit-tag data">b4: 0</div>
                <div class="bit-tag data">b5: 0</div>
                <div class="bit-tag data">b6: 1</div>
                <div class="bit-tag data">b7: 0</div>
                <div class="bit-tag stop">Stop: 1</div>
            </div>
        `;

        setTimeout(() => {
            const canvas = box.querySelector('#uart-waveform');
            if (canvas && canvas.getContext) {
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#060d17';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Grid lines
                ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
                ctx.lineWidth = 1;
                for (let x = 0; x < canvas.width; x += 65) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }

                // Digital Waveform
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 8;

                const bits = evidence.frame;
                const slotWidth = canvas.width / (bits.length + 1);
                const highY = 35;
                const lowY = 105;

                ctx.beginPath();
                ctx.moveTo(10, highY); // Idle state is high

                bits.forEach((bit, i) => {
                    const xStart = 10 + i * slotWidth;
                    const xEnd = xStart + slotWidth;
                    const targetY = bit === 1 ? highY : lowY;

                    ctx.lineTo(xStart, targetY);
                    ctx.lineTo(xEnd, targetY);
                });

                ctx.stroke();
            }
        }, 50);

        container.appendChild(box);
    }

    renderGeneralOscilloscope(container, evidence) {
        const box = document.createElement('div');
        box.className = 'general-scope-box';
        box.innerHTML = `
            <div class="scope-screen">
                <div class="scope-grid"></div>
                <div class="scope-trace"></div>
                <div class="scope-readout">
                    <span>CH1: 3.3V TTL</span>
                    <span>TIMING: 10us/div</span>
                    <span>TRIG: AUTO</span>
                </div>
            </div>
        `;
        container.appendChild(box);
    }
}
