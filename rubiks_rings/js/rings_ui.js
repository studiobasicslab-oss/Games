/**
 * Rubik's Rings — 2D Ring Visualization (v4 — Full 6-face, 54 beads)
 *
 * All 54 facelets of a 3×3 Rubik's Cube are mapped onto 3 overlapping
 * ring sets. Each ring set has 3 concentric circles, giving 9 individual
 * rotatable rings total (6 face moves + 3 middle-slice moves).
 *
 * Each pair of ring sets produces TWO intersection zones:
 *   - "Inner" (between the two centers) → one face
 *   - "Outer" (on the far side) → the opposite face
 *
 * 3 pairs × 2 zones = 6 face grids × 9 facelets = 54 beads.
 *
 * Ring set / face mapping:
 *   Pair (0,1) inner → U   |  Pair (0,1) outer → D
 *   Pair (0,2) inner → R   |  Pair (0,2) outer → L
 *   Pair (1,2) inner → F   |  Pair (1,2) outer → B
 *
 * Ring-to-move mapping (CW drag):
 *   Set 0: ring0→U, ring1→E', ring2→D'
 *   Set 1: ring0→R, ring1→M', ring2→L'
 *   Set 2: ring0→F, ring1→S,  ring2→B'
 */

class RingsUI {
  constructor(canvasId, cubeState) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.cube = cubeState;
    this.dpr = window.devicePixelRatio || 1;

    this.onRingHover = null; // Callback: (faceMoveString) => void

    this.centers = [];
    this.ringRadii = [];
    this.beads = [];

    // Drag state — targets a specific ring (setIdx, ringIdx)
    this.dragTarget = null;  // { setIdx, ringIdx }
    this.dragStartAngle = 0;
    this.dragCurrentDelta = 0;
    this.isDragging = false;
    this.hoveredRing = null; // { setIdx, ringIdx }

    // Animation state
    this.animating = false;
    this.animTarget = null;  // { setIdx, ringIdx }
    this.animAngle = 0;
    this.animGoal = 0;

    // Ring set → face mapping for move names
    // [setIdx][ringIdx] → cube move for CW rotation
    this.ringToMoveCW = [
      ['U',  "E'", "D'"],  // Set 0: inner=U, mid=E', outer=D'
      ['R',  "M'", "L'"],  // Set 1: inner=R, mid=M', outer=L'
      ['F',  'S',  "B'"],  // Set 2: inner=F, mid=S,  outer=B'
    ];

    // Color palette
    this.colorMap = {
      white:  '#E8E8E8', green:  '#00D46A', red:    '#FF3B3B',
      yellow: '#FFD93D', blue:   '#3B82F6', orange: '#FF8C42',
    };
    this.glowColorMap = {
      white:  'rgba(232,232,232,0.5)', green:  'rgba(0,212,106,0.5)',
      red:    'rgba(255,59,59,0.5)',   yellow: 'rgba(255,217,61,0.5)',
      blue:   'rgba(59,130,246,0.5)',  orange: 'rgba(255,140,66,0.5)',
    };

    this._resize();
    this._bindEvents();
    this._computeLayout();
    this.render();

    this.cube.onChange(() => {
      this._computeBeadPositions();
      this.render();
    });
  }

  // ─── Layout ─────────────────────────────────────────────

  _resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const size = Math.min(rect.width, 750);
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    this.canvas.width = size * this.dpr;
    this.canvas.height = size * this.dpr;
    this.size = size;
    this._computeLayout();
  }

  _computeLayout() {
    const s = this.size;
    const cx = s / 2;
    const cy = s * 0.48;

    // Equilateral triangle of ring-set centers — wider spread
    const sideLen = s * 0.30;
    const triH = sideLen * Math.sqrt(3) / 2;

    this.centers = [
      { x: cx,               y: cy - triH * 2 / 3 },  // 0: top
      { x: cx + sideLen / 2, y: cy + triH * 1 / 3 },  // 1: bottom-right
      { x: cx - sideLen / 2, y: cy + triH * 1 / 3 },  // 2: bottom-left
    ];

    // 3 concentric radii — BIG circles, well-spaced
    this.ringRadii = [s * 0.19, s * 0.27, s * 0.35];
    this.outerR = s * 0.39;
    this.ringHitThreshold = s * 0.028;

    this._computeBeadPositions();
  }

  // ─── Circle–Circle Intersection ─────────────────────────

  _circleIntersect(c1, r1, c2, r2) {
    const dx = c2.x - c1.x, dy = c2.y - c1.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) return null;
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const hSq = r1 * r1 - a * a;
    if (hSq < 0) return null;
    const h = Math.sqrt(hSq);
    const px = c1.x + a * dx / d, py = c1.y + a * dy / d;
    return [
      { x: px + h * dy / d, y: py - h * dx / d },  // point A
      { x: px - h * dy / d, y: py + h * dx / d },  // point B
    ];
  }

  /**
   * Compute ALL 54 bead positions.
   * For each ring-set pair, each radius combination (3×3 = 9) produces
   * 2 intersection points. Inner → one face, outer → opposite face.
   */
  _computeBeadPositions() {
    this.beads = [];
    const allFaces = this.cube.getAllFaces();

    const pairs = [
      { setA: 0, setB: 1, innerFace: 'U', outerFace: 'D' },
      { setA: 0, setB: 2, innerFace: 'R', outerFace: 'L' },
      { setA: 1, setB: 2, innerFace: 'F', outerFace: 'B' },
    ];

    pairs.forEach(({ setA, setB, innerFace, outerFace }) => {
      const cA = this.centers[setA];
      const cB = this.centers[setB];
      const mid = { x: (cA.x + cB.x) / 2, y: (cA.y + cB.y) / 2 };

      for (let rA = 0; rA < 3; rA++) {
        for (let rB = 0; rB < 3; rB++) {
          const pts = this._circleIntersect(cA, this.ringRadii[rA], cB, this.ringRadii[rB]);
          if (!pts) continue;

          // Determine inner vs outer
          const d0 = (pts[0].x - mid.x) ** 2 + (pts[0].y - mid.y) ** 2;
          const d1 = (pts[1].x - mid.x) ** 2 + (pts[1].y - mid.y) ** 2;
          const innerPt = d0 < d1 ? pts[0] : pts[1];
          const outerPt = d0 < d1 ? pts[1] : pts[0];

          // Inner bead
          this._addBead(innerFace, rA, rB, innerPt, setA, setB, cA, cB, allFaces);
          // Outer bead
          this._addBead(outerFace, rA, rB, outerPt, setA, setB, cA, cB, allFaces);
        }
      }
    });
  }

  _addBead(face, rA, rB, pt, setA, setB, cA, cB, allFaces) {
    const polarA = this._toPolar(pt.x, pt.y, cA);
    const polarB = this._toPolar(pt.x, pt.y, cB);

    this.beads.push({
      face, row: rA, col: rB,
      x: pt.x, y: pt.y,
      color: allFaces[face][rA][rB],
      // Which ring-set circles this bead sits on
      rings: [
        { setIdx: setA, ringIdx: rA },
        { setIdx: setB, ringIdx: rB },
      ],
      polars: {
        [`${setA}`]: polarA,
        [`${setB}`]: polarB,
      },
    });
  }

  _toPolar(x, y, c) {
    return { angle: Math.atan2(y - c.y, x - c.x), radius: Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2) };
  }

  _fromPolar(angle, radius, c) {
    return { x: c.x + Math.cos(angle) * radius, y: c.y + Math.sin(angle) * radius };
  }

  // ─── Input ──────────────────────────────────────────────

  _bindEvents() {
    const c = this.canvas;
    c.addEventListener('mousedown', e => this._onDown(e));
    c.addEventListener('mousemove', e => this._onMove(e));
    c.addEventListener('mouseup', () => this._onUp());
    c.addEventListener('mouseleave', () => { if (!this.isDragging) { this.hoveredRing = null; this.render(); } });
    c.addEventListener('touchstart', e => { e.preventDefault(); this._onDown(e.touches[0]); }, { passive: false });
    c.addEventListener('touchmove', e => { e.preventDefault(); this._onMove(e.touches[0]); }, { passive: false });
    c.addEventListener('touchend', () => this._onUp());
    window.addEventListener('resize', () => { this._resize(); this.render(); });
  }

  _pos(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (this.size / r.width), y: (e.clientY - r.top) * (this.size / r.height) };
  }

  /** Hit-test: find the specific ring (setIdx, ringIdx) under the pointer. */
  _hitRing(pos) {
    const thr = this.ringHitThreshold;
    let best = null, bestDist = Infinity;

    for (let si = 0; si < 3; si++) {
      const c = this.centers[si];
      const dist = Math.sqrt((pos.x - c.x) ** 2 + (pos.y - c.y) ** 2);

      for (let ri = 0; ri < 3; ri++) {
        const diff = Math.abs(dist - this.ringRadii[ri]);
        if (diff < thr && diff < bestDist) {
          bestDist = diff;
          best = { setIdx: si, ringIdx: ri };
        }
      }
    }
    return best;
  }

  _onDown(e) {
    if (this.animating) return;
    const pos = this._pos(e);
    const ring = this._hitRing(pos);
    if (ring) {
      this.isDragging = true;
      this.dragTarget = ring;
      const c = this.centers[ring.setIdx];
      this.dragStartAngle = Math.atan2(pos.y - c.y, pos.x - c.x);
      this.dragCurrentDelta = 0;
      this.canvas.style.cursor = 'grabbing';
    }
  }

  _onMove(e) {
    const pos = this._pos(e);

    if (this.isDragging && this.dragTarget) {
      const c = this.centers[this.dragTarget.setIdx];
      const cur = Math.atan2(pos.y - c.y, pos.x - c.x);
      let delta = cur - this.dragStartAngle;
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta < -Math.PI) delta += 2 * Math.PI;

      this.dragCurrentDelta = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, delta));
      this.render();

      if (Math.abs(delta) > Math.PI / 5) {
        const dir = delta > 0 ? 1 : -1;
        this.isDragging = false;
        this.dragCurrentDelta = 0;
        this.canvas.style.cursor = 'grab';
        this._triggerRotation(this.dragTarget, dir);
      }
    } else {
      const ring = this._hitRing(pos);
      const changed = !ring !== !this.hoveredRing ||
        (ring && this.hoveredRing && (ring.setIdx !== this.hoveredRing.setIdx || ring.ringIdx !== this.hoveredRing.ringIdx));
      if (changed) {
        this.hoveredRing = ring;
        this.canvas.style.cursor = ring ? 'grab' : 'default';
        this.render();
        
        // Notify external listener
        if (this.onRingHover) {
          if (ring) {
            const move = this.ringToMoveCW[ring.setIdx][ring.ringIdx].replace("'", "");
            this.onRingHover(move);
          } else {
            this.onRingHover(null);
          }
        }
      }
    }
  }

  _onUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.dragCurrentDelta = 0;
      this.canvas.style.cursor = 'default';
      this.render();
    }
  }

  // ─── Rotation ───────────────────────────────────────────

  _getMoveForRing(setIdx, ringIdx, direction) {
    const cwMove = this.ringToMoveCW[setIdx][ringIdx];
    if (direction > 0) return cwMove;
    // Invert the move
    return cwMove.includes("'") ? cwMove.replace("'", "") : cwMove + "'";
  }

  _triggerRotation(ring, direction, speedMultiplier = 1, onComplete = null) {
    const move = this._getMoveForRing(ring.setIdx, ring.ringIdx, direction);

    this.animating = true;
    this.animTarget = { ...ring };
    this.animAngle = 0;
    this.animGoal = (Math.PI / 2) * direction;

    const duration = 400 * speedMultiplier;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      this.animAngle = this.animGoal * eased;
      this.render();

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        this.animating = false;
        this.animAngle = 0;
        this.animTarget = null;
        this.cube.applyMove(move);
        if (onComplete) onComplete();
      }
    };
    requestAnimationFrame(tick);
  }

  /** External move trigger (from button clicks) */
  applyMoveExternal(move, speedMultiplier = 1, onComplete = null) {
    if (this.animating) {
      if (onComplete) onComplete();
      return;
    }

    // Find which ring this move maps to
    const baseFace = move.replace("'", "");
    const isPrime = move.includes("'");

    for (let si = 0; si < 3; si++) {
      for (let ri = 0; ri < 3; ri++) {
        const cwMove = this.ringToMoveCW[si][ri];
        const cwBase = cwMove.replace("'", "");
        if (cwBase === baseFace) {
          // Determine direction
          const cwIsPrime = cwMove.includes("'");
          let dir;
          if (cwMove === move) dir = 1;
          else if (this._invertMove(cwMove) === move) dir = -1;
          else if (isPrime !== cwIsPrime) dir = -1;
          else dir = 1;
          this._triggerRotation({ setIdx: si, ringIdx: ri }, dir, speedMultiplier, onComplete);
          return;
        }
      }
    }
    // Not mapped to a ring — apply directly
    this.cube.applyMove(move);
    if (onComplete) onComplete();
  }

  _invertMove(m) {
    return m.includes("'") ? m.replace("'", "") : m + "'";
  }

  // ─── Rendering ──────────────────────────────────────────

  render() {
    const ctx = this.ctx;
    const s = this.size;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, s, s);
    this._drawRings(ctx);
    this._drawBeads(ctx);
    this._drawLabels(ctx);
    ctx.restore();
  }

  /** Get the current rotation angle for a specific ring (from anim or drag). */
  _getRingAngle(setIdx, ringIdx) {
    if (this.animating && this.animTarget &&
        this.animTarget.setIdx === setIdx && this.animTarget.ringIdx === ringIdx) {
      return this.animAngle;
    }
    if (this.isDragging && this.dragTarget &&
        this.dragTarget.setIdx === setIdx && this.dragTarget.ringIdx === ringIdx) {
      return this.dragCurrentDelta;
    }
    return 0;
  }

  _isRingActive(setIdx, ringIdx) {
    if (this.animating && this.animTarget &&
        this.animTarget.setIdx === setIdx && this.animTarget.ringIdx === ringIdx) return true;
    if (this.isDragging && this.dragTarget &&
        this.dragTarget.setIdx === setIdx && this.dragTarget.ringIdx === ringIdx) return true;
    return false;
  }

  _isRingHovered(setIdx, ringIdx) {
    return this.hoveredRing &&
           this.hoveredRing.setIdx === setIdx &&
           this.hoveredRing.ringIdx === ringIdx;
  }

  _drawRings(ctx) {
    for (let si = 0; si < 3; si++) {
      const c = this.centers[si];

      for (let ri = 0; ri < 3; ri++) {
        const active = this._isRingActive(si, ri);
        const hovered = this._isRingHovered(si, ri);
        const angle = this._getRingAngle(si, ri);

        ctx.save();
        if (angle !== 0) {
          ctx.translate(c.x, c.y);
          ctx.rotate(angle);
          ctx.translate(-c.x, -c.y);
        }

        ctx.beginPath();
        ctx.arc(c.x, c.y, this.ringRadii[ri], 0, Math.PI * 2);

        if (active) {
          ctx.strokeStyle = 'rgba(163, 180, 252, 0.55)';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
          ctx.shadowBlur = 12;
        } else if (hovered) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      }
    }
  }

  _drawBeads(ctx) {
    const beadR = this.size * 0.012;

    this.beads.forEach(bead => {
      let { x, y, color, rings, polars } = bead;

      // Check if any of this bead's parent rings are currently rotating
      for (const r of rings) {
        const angle = this._getRingAngle(r.setIdx, r.ringIdx);
        if (angle !== 0) {
          const polar = polars[`${r.setIdx}`];
          if (polar) {
            const pos = this._fromPolar(polar.angle + angle, polar.radius, this.centers[r.setIdx]);
            x = pos.x;
            y = pos.y;
          }
          break; // only apply one rotation
        }
      }

      const fill = this.colorMap[color] || '#888';
      const glow = this.glowColorMap[color] || 'rgba(136,136,136,0.4)';

      // Glow
      ctx.save();
      ctx.shadowColor = glow;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, beadR, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();

      // Border
      ctx.beginPath();
      ctx.arc(x, y, beadR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Specular
      ctx.beginPath();
      ctx.arc(x - beadR * 0.2, y - beadR * 0.25, beadR * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fill();
    });
  }

  _drawLabels(ctx) {
    // Face labels at each intersection zone
    const pairs = [
      { setA: 0, setB: 1, inner: 'U', outer: 'D' },
      { setA: 0, setB: 2, inner: 'R', outer: 'L' },
      { setA: 1, setB: 2, inner: 'F', outer: 'B' },
    ];

    ctx.font = `500 ${this.size * 0.02}px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.15)';

    pairs.forEach(({ setA, setB, inner, outer }) => {
      const cA = this.centers[setA];
      const cB = this.centers[setB];
      const mid = { x: (cA.x + cB.x) / 2, y: (cA.y + cB.y) / 2 };

      // Inner label: between centers
      ctx.fillText(inner, mid.x, mid.y);

      // Outer label: on the far side (mirror of mid across line)
      // Direction from mid away from the third center
      const thirdCenter = this.centers[3 - setA - setB]; // the other center
      const dx = mid.x - thirdCenter.x;
      const dy = mid.y - thirdCenter.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const ox = mid.x + (dx / len) * this.size * 0.14;
      const oy = mid.y + (dy / len) * this.size * 0.14;
      ctx.fillText(outer, ox, oy);
    });
  }
}
