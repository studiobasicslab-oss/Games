/**
 * Rubik's Cube State Engine
 * 
 * Represents a 3x3 Rubik's Cube with 6 faces × 9 facelets = 54 cells.
 * Faces: U(0), F(1), R(2), D(3), B(4), L(5)
 * Each face is a 3×3 array indexed [row][col]:
 *   [0][0] [0][1] [0][2]
 *   [1][0] [1][1] [1][2]
 *   [2][0] [2][1] [2][2]
 * 
 * Standard colors:
 *   U = white, F = green, R = red, D = yellow, B = blue, L = orange
 */

const FACES = { U: 0, F: 1, R: 2, D: 3, B: 4, L: 5 };
const FACE_NAMES = ['U', 'F', 'R', 'D', 'B', 'L'];
const COLORS = ['white', 'green', 'red', 'yellow', 'blue', 'orange'];

class CubeState {
  constructor() {
    this.state = this.solved();
    this.moveCount = 0;
    this.history = [];
    this.redoStack = [];
    this.listeners = [];
  }

  /** Create a solved cube state */
  solved() {
    return COLORS.map(color =>
      Array.from({ length: 3 }, () => Array(3).fill(color))
    );
  }

  /** Deep clone the state */
  clone() {
    return this.state.map(face => face.map(row => [...row]));
  }

  /** Get the color at face/row/col */
  get(face, row, col) {
    return this.state[face][row][col];
  }

  /** Check if solved */
  isSolved() {
    return this.state.every(face => {
      const center = face[1][1];
      return face.every(row => row.every(cell => cell === center));
    });
  }

  /** Register a change listener */
  onChange(fn) {
    this.listeners.push(fn);
  }

  /** Notify listeners */
  _notify(move) {
    this.listeners.forEach(fn => fn(move, this));
  }

  /** Rotate a face 90° clockwise (just the face stickers, not adjacent strips) */
  _rotateFaceCW(faceIdx) {
    const f = this.state[faceIdx];
    const n = [
      [f[2][0], f[1][0], f[0][0]],
      [f[2][1], f[1][1], f[0][1]],
      [f[2][2], f[1][2], f[0][2]],
    ];
    this.state[faceIdx] = n;
  }

  /** Rotate a face 90° counter-clockwise */
  _rotateFaceCCW(faceIdx) {
    const f = this.state[faceIdx];
    const n = [
      [f[0][2], f[1][2], f[2][2]],
      [f[0][1], f[1][1], f[2][1]],
      [f[0][0], f[1][0], f[2][0]],
    ];
    this.state[faceIdx] = n;
  }

  /**
   * Apply a named move: U, U', F, F', R, R', D, D', B, B', L, L'
   * Prime (') = counter-clockwise
   */
  applyMove(move, isInternal = false) {
    const isPrime = move.includes("'");
    const face = move.replace("'", "").replace("2", "");
    const isDouble = move.includes("2");

    const times = isDouble ? 2 : 1;
    for (let t = 0; t < times; t++) {
      if (isPrime) {
        this._applyMoveCCW(face);
      } else {
        this._applyMoveCW_clean(face);
      }
    }

    if (!isInternal) {
      this.history.push(move);
      this.redoStack = [];
      this.moveCount++;
    }

    this._notify(move);
  }

  /** Undo the last move */
  undo() {
    if (this.history.length === 0) return false;
    const move = this.history.pop();
    this.redoStack.push(move);
    
    // Inverse move
    let inverse;
    if (move.includes('2')) inverse = move;
    else if (move.includes("'")) inverse = move.replace("'", "");
    else inverse = move + "'";

    this.applyMove(inverse, true);
    this.moveCount--;
    return true;
  }

  /** Redo a previously undone move */
  redo() {
    if (this.redoStack.length === 0) return false;
    const move = this.redoStack.pop();
    this.history.push(move);
    this.applyMove(move, true);
    this.moveCount++;
    return true;
  }

  _applyMoveCCW(face) {
    // CCW = 3x CW
    this._applyMoveCW_clean(face);
    this._applyMoveCW_clean(face);
    this._applyMoveCW_clean(face);
  }

  _applyMoveCW_clean(face) {
    const s = this.state;
    const [U, F, R, D, B, L] = [0, 1, 2, 3, 4, 5];

    switch (face) {
      case 'U': {
        this._rotateFaceCW(U);
        const temp = [...s[F][0]];
        s[F][0] = [...s[R][0]];
        s[R][0] = [...s[B][0]];
        s[B][0] = [...s[L][0]];
        s[L][0] = temp;
        break;
      }
      case 'D': {
        this._rotateFaceCW(D);
        const temp = [...s[F][2]];
        s[F][2] = [...s[L][2]];
        s[L][2] = [...s[B][2]];
        s[B][2] = [...s[R][2]];
        s[R][2] = temp;
        break;
      }
      case 'F': {
        this._rotateFaceCW(F);
        const temp = [...s[U][2]];
        s[U][2] = [s[L][2][2], s[L][1][2], s[L][0][2]];
        [s[L][0][2], s[L][1][2], s[L][2][2]] = [s[D][0][0], s[D][0][1], s[D][0][2]];
        [s[D][0][0], s[D][0][1], s[D][0][2]] = [s[R][2][0], s[R][1][0], s[R][0][0]];
        [s[R][0][0], s[R][1][0], s[R][2][0]] = [temp[0], temp[1], temp[2]];
        break;
      }
      case 'B': {
        this._rotateFaceCW(B);
        const temp = [...s[U][0]];
        [s[U][0][0], s[U][0][1], s[U][0][2]] = [s[R][0][2], s[R][1][2], s[R][2][2]];
        [s[R][0][2], s[R][1][2], s[R][2][2]] = [s[D][2][2], s[D][2][1], s[D][2][0]];
        [s[D][2][0], s[D][2][1], s[D][2][2]] = [s[L][0][0], s[L][1][0], s[L][2][0]];
        [s[L][0][0], s[L][1][0], s[L][2][0]] = [temp[2], temp[1], temp[0]];
        break;
      }
      case 'R': {
        this._rotateFaceCW(R);
        const temp = [s[U][0][2], s[U][1][2], s[U][2][2]];
        [s[U][0][2], s[U][1][2], s[U][2][2]] = [s[F][0][2], s[F][1][2], s[F][2][2]];
        [s[F][0][2], s[F][1][2], s[F][2][2]] = [s[D][0][2], s[D][1][2], s[D][2][2]];
        [s[D][0][2], s[D][1][2], s[D][2][2]] = [s[B][2][0], s[B][1][0], s[B][0][0]];
        [s[B][0][0], s[B][1][0], s[B][2][0]] = [temp[2], temp[1], temp[0]];
        break;
      }
      case 'L': {
        this._rotateFaceCW(L);
        const temp = [s[U][0][0], s[U][1][0], s[U][2][0]];
        [s[U][0][0], s[U][1][0], s[U][2][0]] = [s[B][2][2], s[B][1][2], s[B][0][2]];
        [s[B][0][2], s[B][1][2], s[B][2][2]] = [s[D][2][0], s[D][1][0], s[D][0][0]];
        [s[D][0][0], s[D][1][0], s[D][2][0]] = [s[F][0][0], s[F][1][0], s[F][2][0]];
        [s[F][0][0], s[F][1][0], s[F][2][0]] = [temp[0], temp[1], temp[2]];
        break;
      }
      // --- Middle Slice Moves ---
      case 'M': {
        // M follows L convention: middle column between L and R
        const temp = [s[U][0][1], s[U][1][1], s[U][2][1]];
        [s[U][0][1], s[U][1][1], s[U][2][1]] = [s[B][2][1], s[B][1][1], s[B][0][1]];
        [s[B][0][1], s[B][1][1], s[B][2][1]] = [s[D][2][1], s[D][1][1], s[D][0][1]];
        [s[D][0][1], s[D][1][1], s[D][2][1]] = [s[F][0][1], s[F][1][1], s[F][2][1]];
        [s[F][0][1], s[F][1][1], s[F][2][1]] = [temp[0], temp[1], temp[2]];
        break;
      }
      case 'E': {
        // E follows D convention: middle row between U and D
        const temp = [...s[F][1]];
        s[F][1] = [...s[L][1]];
        s[L][1] = [...s[B][1]];
        s[B][1] = [...s[R][1]];
        s[R][1] = temp;
        break;
      }
      case 'S': {
        // S follows F convention: middle slice between F and B
        const temp = [...s[U][1]];
        s[U][1] = [s[L][2][1], s[L][1][1], s[L][0][1]];
        [s[L][0][1], s[L][1][1], s[L][2][1]] = [s[D][1][0], s[D][1][1], s[D][1][2]];
        [s[D][1][0], s[D][1][1], s[D][1][2]] = [s[R][2][1], s[R][1][1], s[R][0][1]];
        [s[R][0][1], s[R][1][1], s[R][2][1]] = [temp[0], temp[1], temp[2]];
        break;
      }
    }
  }

  /** Apply a sequence of moves (space-separated) */
  applyMoves(moveString) {
    const moves = moveString.trim().split(/\s+/);
    moves.forEach(m => this.applyMove(m));
  }

  /** Generate a random scramble sequence and reset cube */
  scramble(numMoves = 20) {
    const allMoves = ["U", "U'", "D", "D'", "F", "F'", "B", "B'", "R", "R'", "L", "L'"];
    this.state = this.solved();
    this.moveCount = 0;
    this.history = [];
    this.redoStack = [];
    const scrambleMoves = [];
    let lastFace = '';
    for (let i = 0; i < numMoves; i++) {
      let move;
      do {
        move = allMoves[Math.floor(Math.random() * allMoves.length)];
      } while (move[0] === lastFace);
      lastFace = move[0];
      scrambleMoves.push(move);
    }
    this._notify('reset'); // Notify UI to reset state before scramble animates
    return scrambleMoves;
  }

  /** Reset to solved */
  reset() {
    this.state = this.solved();
    this.moveCount = 0;
    this.history = [];
    this.redoStack = [];
    this._notify('reset');
  }

  /**
   * Get the 3 visible faces for the 2D ring mapping.
   * Returns { U: 3x3, F: 3x3, R: 3x3 } color arrays.
   */
  getVisibleFaces() {
    return {
      U: this.state[FACES.U].map(r => [...r]),
      F: this.state[FACES.F].map(r => [...r]),
      R: this.state[FACES.R].map(r => [...r]),
    };
  }

  /** Get all 6 faces for the 3D cube */
  getAllFaces() {
    return {
      U: this.state[FACES.U].map(r => [...r]),
      F: this.state[FACES.F].map(r => [...r]),
      R: this.state[FACES.R].map(r => [...r]),
      D: this.state[FACES.D].map(r => [...r]),
      B: this.state[FACES.B].map(r => [...r]),
      L: this.state[FACES.L].map(r => [...r]),
    };
  }
}
