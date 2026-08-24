/**
 * Packet Run: The Microarchitect - Levels & Benchmark Database
 */

const CPU_LEVELS = [
    {
        id: 1,
        title: "Stage 01: Dual ALU Ignition",
        category: "Basics",
        description: "Welcome Dispatch Unit. You have 2 parallel ALUs. Route these independent instructions without any pipeline stalls.",
        targetIPC: 1.0,
        maxCycles: 8,
        instructions: [
            { op: 'ADD', rd: 'R0', rs1: '#5', rs2: '#3', label: 'ADD R0, #5, #3' },
            { op: 'ADD', rd: 'R1', rs1: '#10', rs2: '#2', label: 'ADD R1, #10, #2' },
            { op: 'SUB', rd: 'R2', rs1: '#20', rs2: '#7', label: 'SUB R2, #20, #7' },
            { op: 'ADD', rd: 'R3', rs1: '#1', rs2: '#4', label: 'ADD R3, #1, #4' }
        ],
        registers: { R0: 0, R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0 },
        memory: {},
        tips: "Because none of these 4 instructions share registers, dual ALUs can crunch them in parallel!"
    },
    {
        id: 2,
        title: "Stage 02: RAW Hazard Intercept",
        category: "Hazards",
        description: "Instruction 2 needs R0 from Instruction 1 (Read-After-Write hazard). Reorder the independent Instruction 3 ahead to keep both ALUs busy!",
        targetIPC: 0.8,
        maxCycles: 8,
        instructions: [
            { op: 'ADD', rd: 'R0', rs1: '#8', rs2: '#4', label: 'ADD R0, #8, #4' },
            { op: 'ADD', rd: 'R1', rs1: 'R0', rs2: '#5', label: 'ADD R1, R0, #5' }, // RAW on R0!
            { op: 'ADD', rd: 'R2', rs1: '#15', rs2: '#10', label: 'ADD R2, #15, #10' }, // Independent!
            { op: 'SUB', rd: 'R3', rs1: '#50', rs2: '#20', label: 'SUB R3, #50, #20' }
        ],
        registers: { R0: 0, R1: 0, R2: 0, R3: 0 },
        memory: {},
        tips: "Drag 'ADD R2, #15, #10' into the dispatch slot to execute while R0 is being computed."
    },
    {
        id: 3,
        title: "Stage 03: Cache Hierarchy Access",
        category: "Memory",
        description: "Load data from addresses [0x00] and [0x04]. L1 Cache responds in 1 cycle, while cold RAM fetches take 8 cycles!",
        targetIPC: 0.6,
        maxCycles: 18,
        instructions: [
            { op: 'LOAD', rd: 'R0', addr: 0, label: 'LOAD R0, [0x00]' },
            { op: 'ADD', rd: 'R1', rs1: '#2', rs2: '#3', label: 'ADD R1, #2, #3' },
            { op: 'LOAD', rd: 'R2', addr: 0, label: 'LOAD R2, [0x00]' }, // Will HIT L1 Cache!
            { op: 'ADD', rd: 'R3', rs1: 'R1', rs2: '#10', label: 'ADD R3, R1, #10' }
        ],
        registers: { R0: 0, R1: 0, R2: 0, R3: 0 },
        memory: { 0: 42, 4: 99 },
        tips: "Notice how the second LOAD to [0x00] is a lightning-fast L1 cache hit."
    },
    {
        id: 4,
        title: "Stage 04: Dynamic Branch Prediction",
        category: "Branches",
        description: "A loop counter tests if R0 == 0. Predict whether the branch jumps to keep speculative execution running without pipeline flush penalty.",
        targetIPC: 0.75,
        maxCycles: 12,
        instructions: [
            { op: 'ADD', rd: 'R0', rs1: '#2', rs2: '#0', label: 'ADD R0, #2, #0' },
            { op: 'SUB', rd: 'R0', rs1: 'R0', rs2: '#1', label: 'SUB R0, R0, #1' },
            { op: 'BEQ', rs1: 'R0', rs2: '#0', offset: 2, label: 'BEQ R0, #0, +2' },
            { op: 'ADD', rd: 'R1', rs1: '#100', rs2: '#50', label: 'ADD R1, #100, #50' },
            { op: 'ADD', rd: 'R2', rs1: '#7', rs2: '#7', label: 'ADD R2, #7, #7' }
        ],
        registers: { R0: 2, R1: 0, R2: 0 },
        memory: {},
        tips: "2-bit saturating counter learns whether loops are typically taken."
    },
    {
        id: 5,
        title: "Stage 05: Vector Multiply-Accumulate",
        category: "Compute",
        description: "MUL takes 2 cycles. Interleave additions and multiplications to avoid stalling execution pipelines.",
        targetIPC: 0.9,
        maxCycles: 10,
        instructions: [
            { op: 'MUL', rd: 'R0', rs1: '#3', rs2: '#4', label: 'MUL R0, #3, #4' },
            { op: 'ADD', rd: 'R1', rs1: '#5', rs2: '#6', label: 'ADD R1, #5, #6' },
            { op: 'MUL', rd: 'R2', rs1: '#2', rs2: '#8', label: 'MUL R2, #2, #8' },
            { op: 'ADD', rd: 'R3', rs1: '#20', rs2: '#30', label: 'ADD R3, #20, #30' },
            { op: 'ADD', rd: 'R4', rs1: 'R0', rs2: 'R2', label: 'ADD R4, R0, R2' }
        ],
        registers: { R0: 0, R1: 0, R2: 0, R3: 0, R4: 0 },
        memory: {},
        tips: "Execute independent additions while the multiplier units are computing."
    },
    {
        id: 6,
        title: "Stage 06: Out-of-Order Memory Interleave",
        category: "Memory",
        description: "Hide high-latency RAM loads behind independent arithmetic instructions.",
        targetIPC: 0.8,
        maxCycles: 15,
        instructions: [
            { op: 'LOAD', rd: 'R0', addr: 4, label: 'LOAD R0, [0x04]' },
            { op: 'ADD', rd: 'R1', rs1: '#12', rs2: '#8', label: 'ADD R1, #12, #8' },
            { op: 'SUB', rd: 'R2', rs1: '#40', rs2: '#15', label: 'SUB R2, #40, #15' },
            { op: 'ADD', rd: 'R3', rs1: 'R0', rs2: '#1', label: 'ADD R3, R0, #1' }
        ],
        registers: { R0: 0, R1: 0, R2: 0, R3: 0 },
        memory: { 4: 77 },
        tips: "Out-of-Order dispatch lets R1 and R2 finish before R0 arrives from RAM."
    },
    {
        id: 7,
        title: "Stage 07: Fibonacci Core Sequence",
        category: "Algorithms",
        description: "Step through the fundamental recurrence F(n) = F(n-1) + F(n-2) with minimal bubble stalls.",
        targetIPC: 0.85,
        maxCycles: 14,
        instructions: [
            { op: 'ADD', rd: 'R0', rs1: '#1', rs2: '#0', label: 'ADD R0, #1, #0' }, // F1 = 1
            { op: 'ADD', rd: 'R1', rs1: '#1', rs2: '#0', label: 'ADD R1, #1, #0' }, // F2 = 1
            { op: 'ADD', rd: 'R2', rs1: 'R0', rs2: 'R1', label: 'ADD R2, R0, R1' }, // F3 = 2
            { op: 'ADD', rd: 'R3', rs1: 'R1', rs2: 'R2', label: 'ADD R3, R1, R2' }, // F4 = 3
            { op: 'ADD', rd: 'R4', rs1: 'R2', rs2: 'R3', label: 'ADD R4, R2, R3' }  // F5 = 5
        ],
        registers: { R0: 0, R1: 0, R2: 0, R3: 0, R4: 0 },
        memory: {},
        tips: "Data forwarding moves completed writeback values straight to operand registers."
    },
    {
        id: 8,
        title: "Stage 08: Store-Forwarding & Cache Flush",
        category: "Memory",
        description: "Store computed values to memory and immediately verify cache tag updates.",
        targetIPC: 0.7,
        maxCycles: 16,
        instructions: [
            { op: 'ADD', rd: 'R0', rs1: '#10', rs2: '#25', label: 'ADD R0, #10, #25' },
            { op: 'STORE', rs1: 'R0', addr: 8, label: 'STORE R0, [0x08]' },
            { op: 'ADD', rd: 'R1', rs1: '#5', rs2: '#5', label: 'ADD R1, #5, #5' },
            { op: 'LOAD', rd: 'R2', addr: 8, label: 'LOAD R2, [0x08]' } // L1 Hit on newly written address
        ],
        registers: { R0: 0, R1: 0, R2: 0 },
        memory: { 8: 0 },
        tips: "The L1 Cache updates immediately upon Store commit, making subsequent loads instant."
    },
    {
        id: 9,
        title: "Stage 09: Matrix Stride Optimization",
        category: "Algorithms",
        description: "Process memory addresses with spatial locality to achieve 100% cache hit rates.",
        targetIPC: 0.9,
        maxCycles: 16,
        instructions: [
            { op: 'LOAD', rd: 'R0', addr: 0, label: 'LOAD R0, [0x00]' },
            { op: 'LOAD', rd: 'R1', addr: 1, label: 'LOAD R1, [0x01]' },
            { op: 'LOAD', rd: 'R2', addr: 2, label: 'LOAD R2, [0x02]' },
            { op: 'ADD', rd: 'R3', rs1: 'R0', rs2: 'R1', label: 'ADD R3, R0, R1' },
            { op: 'ADD', rd: 'R4', rs1: 'R3', rs2: 'R2', label: 'ADD R4, R3, R2' }
        ],
        registers: { R0: 0, R1: 0, R2: 0, R3: 0, R4: 0 },
        memory: { 0: 10, 1: 20, 2: 30 },
        tips: "Sequential addresses leverage cache spatial locality."
    },
    {
        id: 10,
        title: "Stage 10: Crypto Hash Compression Round",
        category: "Compute",
        description: "Dense mixed operations: additions, subtractions, and multiplications demanding peak ALU utilization.",
        targetIPC: 1.1,
        maxCycles: 14,
        instructions: [
            { op: 'ADD', rd: 'R0', rs1: '#11', rs2: '#22', label: 'ADD R0, #11, #22' },
            { op: 'MUL', rd: 'R1', rs1: '#3', rs2: '#7', label: 'MUL R1, #3, #7' },
            { op: 'SUB', rd: 'R2', rs1: '#99', rs2: '#33', label: 'SUB R2, #99, #33' },
            { op: 'ADD', rd: 'R3', rs1: '#5', rs2: '#15', label: 'ADD R3, #5, #15' },
            { op: 'MUL', rd: 'R4', rs1: 'R1', rs2: '#2', label: 'MUL R4, R1, #2' },
            { op: 'ADD', rd: 'R5', rs1: 'R0', rs2: 'R2', label: 'ADD R5, R0, R2' }
        ],
        registers: { R0: 0, R1: 0, R2: 0, R3: 0, R4: 0, R5: 0 },
        memory: {},
        tips: "Reorder R3 arithmetic before R4 multiply to keep ALUs saturated."
    },
    {
        id: 11,
        title: "Stage 11: Branch Storm & Loop Unroll",
        category: "Branches",
        description: "Multiple branch evaluations. Keep the 2-bit branch predictor locked onto the taken loop path.",
        targetIPC: 0.95,
        maxCycles: 16,
        instructions: [
            { op: 'ADD', rd: 'R0', rs1: '#3', rs2: '#0', label: 'ADD R0, #3, #0' },
            { op: 'SUB', rd: 'R0', rs1: 'R0', rs2: '#1', label: 'SUB R0, R0, #1' },
            { op: 'BNE', rs1: 'R0', rs2: '#0', offset: 2, label: 'BNE R0, #0, +2' },
            { op: 'ADD', rd: 'R1', rs1: '#8', rs2: '#8', label: 'ADD R1, #8, #8' },
            { op: 'SUB', rd: 'R2', rs1: '#100', rs2: '#20', label: 'SUB R2, #100, #20' }
        ],
        registers: { R0: 3, R1: 0, R2: 0 },
        memory: {},
        tips: "High branch accuracy avoids the devastating 3-cycle flush penalty!"
    },
    {
        id: 12,
        title: "Stage 12: The Grand Superscalar Benchmark",
        category: "Mastery",
        description: "Final certification: Achieve an Instructions Per Cycle (IPC) ≥ 1.25 across 8 complex mixed instructions.",
        targetIPC: 1.25,
        maxCycles: 12,
        instructions: [
            { op: 'ADD', rd: 'R0', rs1: '#10', rs2: '#20', label: 'ADD R0, #10, #20' },
            { op: 'ADD', rd: 'R1', rs1: '#30', rs2: '#40', label: 'ADD R1, #30, #40' },
            { op: 'MUL', rd: 'R2', rs1: '#4', rs2: '#5', label: 'MUL R2, #4, #5' },
            { op: 'SUB', rd: 'R3', rs1: '#80', rs2: '#15', label: 'SUB R3, #80, #15' },
            { op: 'LOAD', rd: 'R4', addr: 0, label: 'LOAD R4, [0x00]' },
            { op: 'ADD', rd: 'R5', rs1: 'R0', rs2: 'R1', label: 'ADD R5, R0, R1' },
            { op: 'ADD', rd: 'R6', rs1: 'R2', rs2: 'R3', label: 'ADD R6, R2, R3' },
            { op: 'STORE', rs1: 'R5', addr: 4, label: 'STORE R5, [0x04]' }
        ],
        registers: { R0: 0, R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0 },
        memory: { 0: 99, 4: 0 },
        tips: "Flawless out-of-order dispatch keeps every ALU and LSU executing in lockstep!"
    }
];

// Helper to parse simple assembly string in Sandbox Mode
function parseAssembly(code) {
    const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith(';'));
    const instructions = [];
    lines.forEach(line => {
        const parts = line.replace(/,/g, ' ').split(/\s+/);
        const op = parts[0].toUpperCase();
        if (op === 'ADD' || op === 'SUB' || op === 'MUL') {
            instructions.push({ op, rd: parts[1], rs1: parts[2], rs2: parts[3], label: line });
        } else if (op === 'LOAD') {
            const addrStr = parts[2].replace(/[\[\]]/g, '');
            const addr = parseInt(addrStr, 10) || 0;
            instructions.push({ op, rd: parts[1], addr, label: line });
        } else if (op === 'STORE') {
            const addrStr = parts[2].replace(/[\[\]]/g, '');
            const addr = parseInt(addrStr, 10) || 0;
            instructions.push({ op, rs1: parts[1], addr, label: line });
        } else if (op === 'BEQ' || op === 'BNE') {
            const offset = parseInt(parts[3], 10) || 1;
            instructions.push({ op, rs1: parts[1], rs2: parts[2], offset, label: line });
        } else if (op === 'NOP') {
            instructions.push({ op: 'NOP', label: 'NOP' });
        }
    });
    return instructions;
}
