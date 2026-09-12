import { Parser } from './Parser.js';

export class Simulator {
  constructor(initialState) {
    this.registers = { ...initialState.registers };
    this.memory = { ...initialState.memory };
    this.cycles = 0;
    this.pc = 0; // Program Counter
    this.program = [];
    this.status = 'IDLE'; // IDLE, RUNNING, SUCCESS, FAILED, ERROR
    this.errorMsg = '';
  }

  loadProgram(code) {
    try {
      this.program = Parser.parseProgram(code);
      this.status = 'READY';
      this.errorMsg = '';
    } catch (e) {
      this.status = 'ERROR';
      this.errorMsg = e.message;
    }
  }

  getValue(operand) {
    if (this.registers.hasOwnProperty(operand)) {
      return this.registers[operand];
    }
    const val = parseInt(operand, 10);
    if (isNaN(val)) {
      throw new Error(`Invalid operand: ${operand}`);
    }
    return val;
  }

  step() {
    if (this.status === 'ERROR' || this.status === 'SUCCESS' || this.status === 'FAILED') {
      return;
    }
    if (this.pc >= this.program.length) {
      this.status = 'IDLE';
      return;
    }

    const inst = this.program[this.pc];
    this.cycles++;

    try {
      switch (inst.type) {
        case 'NOOP':
          // Do nothing
          break;
        case 'MOV':
          if (!this.registers.hasOwnProperty(inst.dest)) {
            throw new Error(`Invalid destination: ${inst.dest}`);
          }
          this.registers[inst.dest] = this.getValue(inst.src);
          break;
        case 'ADD':
          if (!this.registers.hasOwnProperty(inst.dest)) {
            throw new Error(`Invalid destination: ${inst.dest}`);
          }
          this.registers[inst.dest] = this.getValue(inst.src1) + this.getValue(inst.src2);
          break;
        case 'SUB':
          if (!this.registers.hasOwnProperty(inst.dest)) {
            throw new Error(`Invalid destination: ${inst.dest}`);
          }
          this.registers[inst.dest] = this.getValue(inst.src1) - this.getValue(inst.src2);
          break;
      }
      this.pc++;
    } catch (e) {
      this.status = 'ERROR';
      this.errorMsg = `Runtime Error at line ${this.pc + 1}: ${e.message}`;
    }
  }

  checkGoal(goal) {
    if (this.cycles > goal.maxCycles) {
      this.status = 'FAILED';
      this.errorMsg = 'Max cycles exceeded.';
      return false;
    }
    if (goal.type === 'match_register') {
      if (this.registers[goal.register] === goal.value) {
        this.status = 'SUCCESS';
        return true;
      }
    }
    return false;
  }
}
