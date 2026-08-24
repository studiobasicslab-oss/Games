/**
 * Packet Run: The Microarchitect - CPU Core Simulation
 * Accurate cycle-stepped superscalar / out-of-order execution engine
 */

class CPUCore {
    constructor(audioEngine, vfxEngine) {
        this.audio = audioEngine;
        this.vfx = vfxEngine;

        this.clockCycle = 0;
        this.pc = 0;
        this.instructionsRetired = 0;
        this.stallsCount = 0;
        this.flushesCount = 0;
        this.cacheAccesses = 0;
        this.cacheHitsL1 = 0;
        this.cacheHitsL2 = 0;
        this.branchPredictionsCorrect = 0;
        this.branchPredictionsTotal = 0;

        // Architectural State
        this.registers = new Array(8).fill(0); // R0 - R7
        this.flags = { Z: 0, N: 0 };
        this.memory = new Array(32).fill(0);

        // Cache Hierarchy (tags and data)
        this.l1Cache = [
            { tag: null, data: 0, age: 0, valid: false },
            { tag: null, data: 0, age: 0, valid: false },
            { tag: null, data: 0, age: 0, valid: false },
            { tag: null, data: 0, age: 0, valid: false }
        ];

        this.l2Cache = [
            { tag: null, data: 0, age: 0, valid: false },
            { tag: null, data: 0, age: 0, valid: false },
            { tag: null, data: 0, age: 0, valid: false },
            { tag: null, data: 0, age: 0, valid: false },
            { tag: null, data: 0, age: 0, valid: false },
            { tag: null, data: 0, age: 0, valid: false },
            { tag: null, data: 0, age: 0, valid: false },
            { tag: null, data: 0, age: 0, valid: false }
        ];

        // 2-bit Saturating Branch Predictor (0: Strongly NT, 1: Weakly NT, 2: Weakly T, 3: Strongly T)
        this.branchPredictorState = 2; // Default Weakly Taken

        // Pipeline Buffers
        this.program = []; // All instructions for current level/program
        this.fetchBuffer = [];
        this.decodeBuffer = [];
        this.dispatchWindow = []; // Reservation station (playable OoO queue, max 4)
        this.maxDispatchSize = 4;

        // Execution Units
        this.execUnits = {
            alu0: { busy: false, inst: null, cyclesLeft: 0, result: null },
            alu1: { busy: false, inst: null, cyclesLeft: 0, result: null },
            lsu: { busy: false, inst: null, cyclesLeft: 0, stage: 'IDLE', result: null },
            bru: { busy: false, inst: null, cyclesLeft: 0, result: null }
        };

        this.writebackQueue = [];
        this.rob = []; // Reorder Buffer for in-order retirement
        this.isHalted = false;
        this.isRunning = false;
        this.clockSpeedMs = 600; // ms per cycle in auto mode
        this.timer = null;
        this.onCycleTick = null;
    }

    loadProgram(instructions, initialRegisters = {}, initialMemory = {}) {
        this.reset();
        this.program = instructions.map((inst, idx) => ({
            ...inst,
            id: 'inst_' + (idx + 1) + '_' + Math.random().toString(36).substr(2, 4),
            origIndex: idx,
            state: 'QUEUE', // QUEUE, FETCHED, DECODED, DISPATCHED, EXECUTING, WRITEBACK, RETIRED
            speculative: false
        }));

        // Load initial state
        for (let i = 0; i < 8; i++) {
            this.registers[i] = initialRegisters['R' + i] !== undefined ? initialRegisters['R' + i] : 0;
        }
        for (let addr in initialMemory) {
            this.memory[parseInt(addr, 10)] = initialMemory[addr];
        }
    }

    reset() {
        this.clockCycle = 0;
        this.pc = 0;
        this.instructionsRetired = 0;
        this.stallsCount = 0;
        this.flushesCount = 0;
        this.cacheAccesses = 0;
        this.cacheHitsL1 = 0;
        this.cacheHitsL2 = 0;
        this.branchPredictionsCorrect = 0;
        this.branchPredictionsTotal = 0;

        this.registers.fill(0);
        this.flags = { Z: 0, N: 0 };
        this.memory.fill(0);

        this.l1Cache.forEach(line => { line.tag = null; line.data = 0; line.valid = false; line.age = 0; });
        this.l2Cache.forEach(line => { line.tag = null; line.data = 0; line.valid = false; line.age = 0; });
        this.branchPredictorState = 2;

        this.fetchBuffer = [];
        this.decodeBuffer = [];
        this.dispatchWindow = [];
        this.writebackQueue = [];
        this.rob = [];
        this.isHalted = false;

        this.execUnits = {
            alu0: { busy: false, inst: null, cyclesLeft: 0, result: null },
            alu1: { busy: false, inst: null, cyclesLeft: 0, result: null },
            lsu: { busy: false, inst: null, cyclesLeft: 0, stage: 'IDLE', result: null },
            bru: { busy: false, inst: null, cyclesLeft: 0, result: null }
        };

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isRunning = false;
    }

    // Check RAW (Read-After-Write) Hazards for an instruction in dispatch
    checkDataHazards(inst) {
        if (!inst) return { hasHazard: false, hazardRegs: [] };
        const neededRegs = [];
        if (inst.rs1 !== undefined) neededRegs.push(inst.rs1);
        if (inst.rs2 !== undefined) neededRegs.push(inst.rs2);
        if (inst.op === 'STORE' && inst.rd !== undefined) neededRegs.push(inst.rd);

        const hazardRegs = [];

        // Check active instructions in Execution units
        Object.values(this.execUnits).forEach(unit => {
            if (unit.busy && unit.inst && unit.inst.rd !== undefined && unit.inst.op !== 'STORE') {
                if (neededRegs.includes(unit.inst.rd)) {
                    hazardRegs.push(unit.inst.rd);
                }
            }
        });

        // Check Writeback queue
        this.writebackQueue.forEach(wb => {
            if (wb.inst && wb.inst.rd !== undefined && wb.inst.op !== 'STORE') {
                if (neededRegs.includes(wb.inst.rd)) {
                    hazardRegs.push(wb.inst.rd);
                }
            }
        });

        return {
            hasHazard: hazardRegs.length > 0,
            hazardRegs: [...new Set(hazardRegs)]
        };
    }

    // Step CPU by 1 clock cycle
    stepCycle() {
        if (this.isHalted) return;

        this.clockCycle++;
        if (this.audio) this.audio.playClockTick();

        // 1. RETIRE / COMMIT STAGE (ROB head)
        this.retireStage();

        // 2. WRITEBACK STAGE
        this.writebackStage();

        // 3. EXECUTE STAGE
        this.executeStage();

        // 4. DISPATCH / ISSUE STAGE
        this.dispatchStage();

        // 5. DECODE STAGE
        this.decodeStage();

        // 6. FETCH STAGE
        this.fetchStage();

        // Check completion
        if (this.pc >= this.program.length && 
            this.fetchBuffer.length === 0 && 
            this.decodeBuffer.length === 0 && 
            this.dispatchWindow.length === 0 && 
            !this.execUnits.alu0.busy && 
            !this.execUnits.alu1.busy && 
            !this.execUnits.lsu.busy && 
            !this.execUnits.bru.busy && 
            this.writebackQueue.length === 0) {
            this.isHalted = true;
            if (this.audio) this.audio.playVictory();
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.isRunning = false;
        }

        if (this.onCycleTick) {
            this.onCycleTick(this.getStats());
        }
    }

    retireStage() {
        while (this.rob.length > 0 && this.rob[0].readyToRetire) {
            const completed = this.rob.shift();
            completed.inst.state = 'RETIRED';
            this.instructionsRetired++;
            if (this.audio) this.audio.playInstructionComplete();
            if (this.vfx) this.vfx.spawnFlash('rgba(16, 185, 129, 0.15)');
        }
    }

    writebackStage() {
        for (let i = this.writebackQueue.length - 1; i >= 0; i--) {
            const wb = this.writebackQueue[i];
            const inst = wb.inst;

            // Commit to Architectural Register File or Memory
            if (inst.rd !== undefined && inst.op !== 'STORE') {
                const regIdx = typeof inst.rd === 'string' ? parseInt(inst.rd.replace('R', ''), 10) : inst.rd;
                this.registers[regIdx] = wb.result;

                // Flags update
                this.flags.Z = wb.result === 0 ? 1 : 0;
                this.flags.N = wb.result < 0 ? 1 : 0;
            } else if (inst.op === 'STORE') {
                const addr = wb.addr;
                this.memory[addr] = wb.result;
                this.writeToCache(addr, wb.result);
            }

            // Mark ROB entry ready
            const robEntry = this.rob.find(r => r.inst.id === inst.id);
            if (robEntry) robEntry.readyToRetire = true;

            this.writebackQueue.splice(i, 1);
        }
    }

    executeStage() {
        // --- ALU 0 ---
        if (this.execUnits.alu0.busy) {
            this.execUnits.alu0.cyclesLeft--;
            if (this.execUnits.alu0.cyclesLeft <= 0) {
                const inst = this.execUnits.alu0.inst;
                const res = this.calculateAlu(inst);
                this.writebackQueue.push({ inst, result: res });
                this.execUnits.alu0.busy = false;
                this.execUnits.alu0.inst = null;
                if (this.audio) this.audio.playAluExec(0);
            }
        }

        // --- ALU 1 ---
        if (this.execUnits.alu1.busy) {
            this.execUnits.alu1.cyclesLeft--;
            if (this.execUnits.alu1.cyclesLeft <= 0) {
                const inst = this.execUnits.alu1.inst;
                const res = this.calculateAlu(inst);
                this.writebackQueue.push({ inst, result: res });
                this.execUnits.alu1.busy = false;
                this.execUnits.alu1.inst = null;
                if (this.audio) this.audio.playAluExec(1);
            }
        }

        // --- LSU (Load / Store Unit with Cache Hierarchy) ---
        if (this.execUnits.lsu.busy) {
            this.execUnits.lsu.cyclesLeft--;
            if (this.execUnits.lsu.cyclesLeft <= 0) {
                const inst = this.execUnits.lsu.inst;
                if (inst.op === 'LOAD') {
                    const addr = this.resolveAddress(inst.addr);
                    const val = this.readFromCache(addr);
                    this.writebackQueue.push({ inst, result: val, addr });
                } else if (inst.op === 'STORE') {
                    const addr = this.resolveAddress(inst.addr);
                    const regIdx = parseInt(inst.rs1.replace('R', ''), 10);
                    const val = this.registers[regIdx];
                    this.writebackQueue.push({ inst, result: val, addr });
                }
                this.execUnits.lsu.busy = false;
                this.execUnits.lsu.inst = null;
            }
        }

        // --- Branch Execution Unit (BRU) ---
        if (this.execUnits.bru.busy) {
            this.execUnits.bru.cyclesLeft--;
            if (this.execUnits.bru.cyclesLeft <= 0) {
                const inst = this.execUnits.bru.inst;
                const actuallyTaken = this.evaluateBranch(inst);
                const predictedTaken = inst.predictedTaken;

                this.branchPredictionsTotal++;
                if (actuallyTaken === predictedTaken) {
                    this.branchPredictionsCorrect++;
                    if (this.audio) this.audio.playBranchPredict(true);
                    this.updateBranchPredictor(actuallyTaken);
                } else {
                    // Branch MISPREDICTION -> Flush pipeline penalty!
                    this.flushesCount++;
                    if (this.audio) this.audio.playBranchPredict(false);
                    if (this.vfx) this.vfx.spawnFlash('rgba(239, 68, 68, 0.4)');
                    this.flushPipeline(actuallyTaken ? inst.targetPc : inst.pcAfter);
                    this.updateBranchPredictor(actuallyTaken);
                }

                const robEntry = this.rob.find(r => r.inst.id === inst.id);
                if (robEntry) robEntry.readyToRetire = true;

                this.execUnits.bru.busy = false;
                this.execUnits.bru.inst = null;
            }
        }
    }

    dispatchStage() {
        if (this.dispatchWindow.length === 0) return;

        // Try to dispatch instructions to available execution units (Out of Order!)
        for (let i = 0; i < this.dispatchWindow.length; i++) {
            const inst = this.dispatchWindow[i];
            const hazard = this.checkDataHazards(inst);

            if (hazard.hasHazard) {
                this.stallsCount++;
                if (this.audio) this.audio.playHazardStall();
                continue; // Cannot dispatch yet due to RAW hazard! (OoO will look at next instruction)
            }

            let dispatched = false;

            if (inst.op === 'ADD' || inst.op === 'SUB' || inst.op === 'MUL') {
                if (!this.execUnits.alu0.busy) {
                    this.execUnits.alu0.busy = true;
                    this.execUnits.alu0.inst = inst;
                    this.execUnits.alu0.cyclesLeft = inst.op === 'MUL' ? 2 : 1;
                    dispatched = true;
                } else if (!this.execUnits.alu1.busy) {
                    this.execUnits.alu1.busy = true;
                    this.execUnits.alu1.inst = inst;
                    this.execUnits.alu1.cyclesLeft = inst.op === 'MUL' ? 2 : 1;
                    dispatched = true;
                }
            } else if (inst.op === 'LOAD' || inst.op === 'STORE') {
                if (!this.execUnits.lsu.busy) {
                    this.execUnits.lsu.busy = true;
                    this.execUnits.lsu.inst = inst;
                    const addr = this.resolveAddress(inst.addr);
                    const cacheLatency = this.calculateCacheLatency(addr);
                    this.execUnits.lsu.cyclesLeft = cacheLatency;
                    dispatched = true;
                }
            } else if (inst.op === 'BEQ' || inst.op === 'BNE' || inst.op === 'JUMP') {
                if (!this.execUnits.bru.busy) {
                    this.execUnits.bru.busy = true;
                    this.execUnits.bru.inst = inst;
                    this.execUnits.bru.cyclesLeft = 1;
                    dispatched = true;
                }
            } else if (inst.op === 'NOP') {
                const robEntry = this.rob.find(r => r.inst.id === inst.id);
                if (robEntry) robEntry.readyToRetire = true;
                dispatched = true;
            }

            if (dispatched) {
                inst.state = 'EXECUTING';
                this.dispatchWindow.splice(i, 1);
                i--;
            }
        }
    }

    decodeStage() {
        while (this.decodeBuffer.length > 0 && this.dispatchWindow.length < this.maxDispatchSize) {
            const inst = this.decodeBuffer.shift();
            inst.state = 'DISPATCHED';
            this.dispatchWindow.push(inst);
        }
    }

    fetchStage() {
        if (this.pc >= this.program.length || this.decodeBuffer.length >= 2) return;

        const rawInst = this.program[this.pc];
        const inst = {
            ...rawInst,
            pcAfter: this.pc + 1,
            state: 'FETCHED'
        };

        this.rob.push({ inst, readyToRetire: false });

        // Branch Prediction Logic
        if (inst.op === 'BEQ' || inst.op === 'BNE' || inst.op === 'JUMP') {
            const predictedTaken = inst.op === 'JUMP' ? true : (this.branchPredictorState >= 2);
            inst.predictedTaken = predictedTaken;
            inst.targetPc = inst.offset !== undefined ? this.pc + inst.offset : (inst.target || 0);

            if (predictedTaken) {
                this.pc = inst.targetPc;
            } else {
                this.pc++;
            }
        } else {
            this.pc++;
        }

        this.decodeBuffer.push(inst);
    }

    flushPipeline(correctPc) {
        // Drop speculative instructions from fetch and decode buffers
        this.fetchBuffer = [];
        this.decodeBuffer = [];
        this.dispatchWindow = this.dispatchWindow.filter(inst => !inst.speculative);
        this.pc = correctPc;
    }

    updateBranchPredictor(taken) {
        if (taken) {
            this.branchPredictorState = Math.min(3, this.branchPredictorState + 1);
        } else {
            this.branchPredictorState = Math.max(0, this.branchPredictorState - 1);
        }
    }

    evaluateBranch(inst) {
        if (inst.op === 'JUMP') return true;
        const v1 = this.getRegValue(inst.rs1);
        const v2 = this.getRegValue(inst.rs2);
        if (inst.op === 'BEQ') return v1 === v2;
        if (inst.op === 'BNE') return v1 !== v2;
        return false;
    }

    calculateAlu(inst) {
        const v1 = this.getRegValue(inst.rs1);
        const v2 = this.getRegValue(inst.rs2);
        if (inst.op === 'ADD') return v1 + v2;
        if (inst.op === 'SUB') return v1 - v2;
        if (inst.op === 'MUL') return v1 * v2;
        return 0;
    }

    getRegValue(reg) {
        if (typeof reg === 'number') return reg;
        if (typeof reg === 'string') {
            if (reg.startsWith('R')) {
                const idx = parseInt(reg.replace('R', ''), 10);
                return this.registers[idx] || 0;
            }
            if (reg.startsWith('#') || !isNaN(parseInt(reg, 10))) {
                return parseInt(reg.replace('#', ''), 10);
            }
        }
        return 0;
    }

    resolveAddress(addr) {
        if (typeof addr === 'number') return addr % 32;
        if (typeof addr === 'string') {
            const clean = addr.replace(/[\[\]]/g, '');
            if (clean.startsWith('R')) {
                return this.getRegValue(clean) % 32;
            }
            return parseInt(clean, 16) || parseInt(clean, 10) || 0;
        }
        return 0;
    }

    calculateCacheLatency(addr) {
        this.cacheAccesses++;
        // Check L1
        const l1Hit = this.l1Cache.find(line => line.valid && line.tag === addr);
        if (l1Hit) {
            this.cacheHitsL1++;
            if (this.audio) this.audio.playCacheHit('L1');
            return 1; // 1 cycle
        }

        // Check L2
        const l2Hit = this.l2Cache.find(line => line.valid && line.tag === addr);
        if (l2Hit) {
            this.cacheHitsL2++;
            if (this.audio) this.audio.playCacheHit('L2');
            this.insertToL1(addr, l2Hit.data);
            return 3; // 3 cycles
        }

        // Cache Miss -> RAM
        if (this.audio) this.audio.playCacheMiss();
        const data = this.memory[addr];
        this.insertToL2(addr, data);
        this.insertToL1(addr, data);
        return 8; // 8 cycles RAM latency
    }

    readFromCache(addr) {
        return this.memory[addr];
    }

    writeToCache(addr, val) {
        // Write-through
        const l1Line = this.l1Cache.find(line => line.valid && line.tag === addr);
        if (l1Line) l1Line.data = val;
        const l2Line = this.l2Cache.find(line => line.valid && line.tag === addr);
        if (l2Line) l2Line.data = val;
    }

    insertToL1(tag, data) {
        let emptyLine = this.l1Cache.find(l => !l.valid);
        if (!emptyLine) {
            // LRU replacement
            emptyLine = this.l1Cache.reduce((oldest, current) => current.age > oldest.age ? current : oldest, this.l1Cache[0]);
        }
        this.l1Cache.forEach(l => l.age++);
        emptyLine.valid = true;
        emptyLine.tag = tag;
        emptyLine.data = data;
        emptyLine.age = 0;
    }

    insertToL2(tag, data) {
        let emptyLine = this.l2Cache.find(l => !l.valid);
        if (!emptyLine) {
            emptyLine = this.l2Cache.reduce((oldest, current) => current.age > oldest.age ? current : oldest, this.l2Cache[0]);
        }
        this.l2Cache.forEach(l => l.age++);
        emptyLine.valid = true;
        emptyLine.tag = tag;
        emptyLine.data = data;
        emptyLine.age = 0;
    }

    // Reorder instructions in the Dispatch Window (Out of Order user control)
    reorderDispatch(fromIdx, toIdx) {
        if (fromIdx < 0 || fromIdx >= this.dispatchWindow.length || toIdx < 0 || toIdx >= this.dispatchWindow.length) return;
        const item = this.dispatchWindow.splice(fromIdx, 1)[0];
        this.dispatchWindow.splice(toIdx, 0, item);
        if (this.audio) this.audio.playDragDrop();
    }

    startAutoRun(speedMs = 600) {
        this.clockSpeedMs = speedMs;
        this.isRunning = true;
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            if (this.isHalted) {
                clearInterval(this.timer);
                this.timer = null;
                this.isRunning = false;
                return;
            }
            this.stepCycle();
        }, this.clockSpeedMs);
    }

    pause() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isRunning = false;
    }

    getStats() {
        const ipc = this.clockCycle > 0 ? (this.instructionsRetired / this.clockCycle).toFixed(2) : '0.00';
        const hitRate = this.cacheAccesses > 0 ? Math.round(((this.cacheHitsL1 + this.cacheHitsL2) / this.cacheAccesses) * 100) : 100;
        const branchAcc = this.branchPredictionsTotal > 0 ? Math.round((this.branchPredictionsCorrect / this.branchPredictionsTotal) * 100) : 100;

        return {
            clockCycle: this.clockCycle,
            pc: this.pc,
            instructionsRetired: this.instructionsRetired,
            ipc,
            stallsCount: this.stallsCount,
            flushesCount: this.flushesCount,
            cacheHitRate: hitRate,
            branchAccuracy: branchAcc,
            isHalted: this.isHalted,
            isRunning: this.isRunning
        };
    }
}
