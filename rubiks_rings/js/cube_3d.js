/**
 * Rubik's Rings — 3D Cube Visualization (all 6 faces)
 *
 * Renders a 3D Rubik's Cube using CSS transforms showing all 6 faces.
 * Synchronizes with the CubeState engine.
 */

class Cube3D {
  constructor(containerId, cubeState) {
    this.container = document.getElementById(containerId);
    this.cube = cubeState;
    this.build();
    this.update();
    this.cube.onChange(() => this.update());
  }

  build() {
    this.container.innerHTML = '';

    const scene = document.createElement('div');
    scene.className = 'cube3d-scene';
    this.container.appendChild(scene);

    const cubeEl = document.createElement('div');
    cubeEl.className = 'cube3d-cube';
    scene.appendChild(cubeEl);
    this.cubeEl = cubeEl;

    this.faceEls = {};

    ['U', 'F', 'R', 'D', 'B', 'L'].forEach(face => {
      const faceEl = document.createElement('div');
      faceEl.className = `cube3d-face cube3d-face-${face}`;
      const cells = [];

      for (let r = 0; r < 3; r++) {
        const rowCells = [];
        for (let c = 0; c < 3; c++) {
          const cell = document.createElement('div');
          cell.className = 'cube3d-cell';
          faceEl.appendChild(cell);
          rowCells.push(cell);
        }
        cells.push(rowCells);
      }

      cubeEl.appendChild(faceEl);
      this.faceEls[face] = cells;
    });
  }

  highlightFace(face) {
    // face can be null to clear highlights
    ['U', 'F', 'R', 'D', 'B', 'L'].forEach(f => {
      const el = this.cubeEl.querySelector(`.cube3d-face-${f}`);
      if (el) {
        if (f === face) {
          el.classList.add('highlighted');
        } else {
          el.classList.remove('highlighted');
        }
      }
    });
  }

  update() {
    const faces = this.cube.getAllFaces();
    const colorHex = {
      white:  '#EAEAEA', green:  '#00D46A', red:    '#FF3B3B',
      yellow: '#FFD93D', blue:   '#3B82F6', orange: '#FF8C42',
    };

    ['U', 'F', 'R', 'D', 'B', 'L'].forEach(face => {
      const data = faces[face];
      const cells = this.faceEls[face];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          cells[r][c].style.backgroundColor = colorHex[data[r][c]] || '#444';
        }
      }
    });
  }
}
