export class Parser {
  /**
   * Parses a single line of assembly into an instruction object.
   * Supported instructions:
   * MOV dest, src (e.g., MOV R2, R1 or MOV R1, 42)
   * ADD dest, src1, src2 (e.g., ADD R3, R1, R2)
   * SUB dest, src1, src2
   */
  static parseLine(line) {
    line = line.trim();
    if (!line || line.startsWith('//')) {
      return { type: 'NOOP' };
    }

    const parts = line.split(/[\s,]+/).filter(Boolean);
    const op = parts[0].toUpperCase();

    if (op === 'MOV') {
      return { type: 'MOV', dest: parts[1], src: parts[2] };
    } else if (op === 'ADD') {
      return { type: 'ADD', dest: parts[1], src1: parts[2], src2: parts[3] };
    } else if (op === 'SUB') {
      return { type: 'SUB', dest: parts[1], src1: parts[2], src2: parts[3] };
    }

    throw new Error(`Unknown instruction: ${op}`);
  }

  static parseProgram(code) {
    const lines = code.split('\n');
    return lines.map(line => this.parseLine(line));
  }
}
