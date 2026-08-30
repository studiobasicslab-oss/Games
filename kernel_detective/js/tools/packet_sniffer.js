/**
 * Kernel Detective: Cyber Forensics - PacketSniffer Diagnostic Tool
 * Wireshark-style Network Packet Dissector, TCP Handshake & Header Checksum Analyzer.
 */

import { sound } from '../audio.js';

export class PacketSnifferTool {
    constructor(container) {
        this.container = container;
        this.activeCase = null;
        this.selectedPacketIndex = 0;
    }

    render(currentCase) {
        this.activeCase = currentCase;
        this.selectedPacketIndex = 0;
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'tool-pane-inner packet-sniffer-pane';

        // Header status bar
        const header = document.createElement('div');
        header.className = 'tool-sub-header';
        header.innerHTML = `
            <div class="tool-title-group">
                <span class="tool-icon">🌐</span>
                <span class="tool-name">PacketSniffer v2.9 [PCAP PROTOCOL DISSECTOR]</span>
            </div>
            <div class="tool-meta">
                <span class="badge">FILTER: tcp.port == 443 || ip.proto == 6</span>
                <span class="badge highlight">PACKETS: ${currentCase.evidence.packets ? currentCase.evidence.packets.length : 3}</span>
            </div>
        `;
        wrapper.appendChild(header);

        const content = document.createElement('div');
        content.className = 'pcap-dissector-layout';

        const packets = currentCase.evidence.packets || [
            { id: 1, src: "192.168.1.50", dst: "10.0.0.1", flags: "SYN", seq: 1000, ack: 0, valid: true },
            { id: 2, src: "10.0.0.1", dst: "192.168.1.50", flags: "SYN-ACK", seq: 5000, ack: 1001, valid: true },
            { id: 3, src: "192.168.1.99", dst: "10.0.0.1", flags: "ACK+DATA", seq: 1001, ack: 9999, valid: false, note: "Rogue injection" }
        ];

        // Top table: Packet List
        const listSection = document.createElement('div');
        listSection.className = 'packet-list-section';
        listSection.innerHTML = `
            <table class="packet-list-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Source IP</th>
                        <th>Destination IP</th>
                        <th>Protocol</th>
                        <th>Flags</th>
                        <th>Seq No</th>
                        <th>Ack No</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="packet-tbody"></tbody>
            </table>
        `;

        // Bottom section: Packet Tree Dissector
        const detailSection = document.createElement('div');
        detailSection.className = 'packet-details-section';
        detailSection.id = 'packet-details';

        const renderDetails = (pkt) => {
            detailSection.innerHTML = `
                <div class="tree-header">
                    <h4>📦 Packet #${pkt.id} Frame Breakdown</h4>
                </div>
                <div class="protocol-tree">
                    <div class="tree-node">
                        <span class="node-arrow">▶</span>
                        <strong>Frame ${pkt.id}:</strong> 66 bytes on wire (528 bits), 66 bytes captured
                    </div>
                    <div class="tree-node">
                        <span class="node-arrow">▶</span>
                        <strong>Ethernet II:</strong> Src: 00:50:56:c0:00:08, Dst: 00:0c:29:4f:8e:35
                    </div>
                    <div class="tree-node ${!pkt.valid ? 'flagged' : ''}">
                        <span class="node-arrow">▼</span>
                        <strong>Internet Protocol Version 4 (IPv4):</strong> Src: ${pkt.src}, Dst: ${pkt.dst}
                        <div class="tree-sub-list">
                            <div>Version: 4 | Header Length: 20 bytes</div>
                            <div>Differentiated Services Field: 0x00</div>
                            <div>Total Length: 52 bytes</div>
                            <div>Time to Live (TTL): 64</div>
                            <div>Protocol: TCP (6)</div>
                            <div class="${!pkt.valid ? 'checksum-err' : 'checksum-ok'}">
                                Header Checksum: ${!pkt.valid ? '0xDEAD [INCORRECT / SUSPECTED SPOOF]' : '0x3F41 [CORRECT]'}
                            </div>
                        </div>
                    </div>
                    <div class="tree-node ${!pkt.valid ? 'flagged' : ''}">
                        <span class="node-arrow">▼</span>
                        <strong>Transmission Control Protocol (TCP):</strong> Src Port: 54321, Dst Port: 443
                        <div class="tree-sub-list">
                            <div>Sequence Number (raw): <strong>${pkt.seq}</strong></div>
                            <div>Acknowledgment Number (raw): <strong class="${!pkt.valid ? 'ack-err' : ''}">${pkt.ack}</strong> ${!pkt.valid ? '⚠️ (Mismatched ACK expected 5001)' : ''}</div>
                            <div>Flags: [${pkt.flags}]</div>
                            ${pkt.note ? `<div class="note-box"><strong>FORENSIC NOTE:</strong> ${pkt.note}</div>` : ''}
                        </div>
                    </div>
                </div>
            `;
        };

        const tbody = listSection.querySelector('#packet-tbody');
        packets.forEach((pkt, idx) => {
            const tr = document.createElement('tr');
            tr.className = `packet-row ${idx === 0 ? 'selected' : ''} ${!pkt.valid ? 'spoofed-row' : ''}`;
            tr.innerHTML = `
                <td>${pkt.id}</td>
                <td class="ip-src">${pkt.src}</td>
                <td class="ip-dst">${pkt.dst}</td>
                <td>TCP</td>
                <td><span class="flag-badge">${pkt.flags}</span></td>
                <td>${pkt.seq}</td>
                <td class="${!pkt.valid ? 'ack-mismatch' : ''}">${pkt.ack}</td>
                <td>${pkt.valid ? '<span class="status-ok">NORMAL</span>' : '<span class="status-alert">ROGUE / SPOOFED</span>'}</td>
            `;

            tr.addEventListener('click', () => {
                sound.playKeypress();
                tbody.querySelectorAll('.packet-row').forEach(r => r.classList.remove('selected'));
                tr.classList.add('selected');
                renderDetails(pkt);
            });

            tbody.appendChild(tr);
        });

        renderDetails(packets[0]);

        content.appendChild(listSection);
        content.appendChild(detailSection);
        wrapper.appendChild(content);
        this.container.appendChild(wrapper);
    }
}
