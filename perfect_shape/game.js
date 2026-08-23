import { GeometryEngine } from './geometry_engine.js';
import { AudioEngine } from './audio_engine.js';
import { _$syncDataState, auth } from '../firebase_setup.js';

class PerfectShapeGame {
    constructor() {
        this.geo = new GeometryEngine();
        this.audio = new AudioEngine();

        // Canvas & Elements
        this.canvas = document.getElementById('paint-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvasWrapper = document.getElementById('canvas-wrapper');

        // State
        this.mode = 'gauntlet'; // 'gauntlet' | 'practice' | 'rush' | 'freestyle'
        this.currentLevelIndex = 0;
        this.selectedPracticeShape = 'circle';
        
        this.isDrawing = false;
        this.rawPoints = [];
        this.lastEvaluation = null;
        this.particles = [];
        this.animationFrameId = null;

        // Settings / Toggles
        this.showHeatmap = true;
        this.showGhost = true;
        this.streak = 0;
        this.unlockedLevels = 1;
        this.levelScores = {}; // { levelIndex: { bestScore, stars } }
        this.theme = 'cyber'; // 'cyber' | 'blueprint' | 'minimal'

        // Rush Mode State
        this.rushTimer = null;
        this.rushTimeLeft = 60;
        this.rushScore = 0;
        this.rushActive = false;
        this.rushTargetShape = 'circle';

        // Level Definitions
        this.levels = [
            { id: 'circle', name: 'Circle', target: 'circle', hint: 'Draw a round closed loop in one smooth motion', passScore: 80, stars: [85, 92, 97] },
            { id: 'square', name: 'Square', target: 'square', hint: 'Draw 4 equal sides with 90° sharp corners', passScore: 80, stars: [85, 91, 96] },
            { id: 'triangle', name: 'Triangle', target: 'triangle', hint: 'Draw an equilateral triangle with 3 equal sides', passScore: 78, stars: [82, 89, 95] },
            { id: 'line', name: 'Laser Line', target: 'line', hint: 'Draw a laser-straight line in any direction', passScore: 85, stars: [90, 95, 98] },
            { id: 'diamond', name: 'Diamond', target: 'diamond', hint: 'Draw a 4-sided rhombus balanced on its vertex', passScore: 80, stars: [85, 90, 96] },
            { id: 'star', name: '5-Point Star', target: 'star', hint: 'Draw a classic 5-pointed star', passScore: 75, stars: [80, 88, 94] },
            { id: 'heart', name: 'Heart', target: 'heart', hint: 'Draw a symmetrical heart with a top dip and bottom point', passScore: 75, stars: [80, 88, 95] },
            { id: 'hexagon', name: 'Hexagon', target: 'hexagon', hint: 'Draw a 6-sided symmetrical polygon', passScore: 78, stars: [82, 90, 96] }
        ];

        this.initStorage();
        this.initDPI();
        this.initDOM();
        this.initEvents();
        this.updateUIForMode();
        this.startRenderLoop();
    }

    initStorage() {
        try {
            const savedLevels = localStorage.getItem('perfect_shape_unlocked');
            if (savedLevels) this.unlockedLevels = Math.max(1, parseInt(savedLevels, 10));

            const savedScores = localStorage.getItem('perfect_shape_scores');
            if (savedScores) this.levelScores = JSON.parse(savedScores);

            const savedStreak = localStorage.getItem('perfect_shape_streak');
            if (savedStreak) this.streak = parseInt(savedStreak, 10);

            const savedTheme = localStorage.getItem('perfect_shape_theme');
            if (savedTheme) this.setTheme(savedTheme);
        } catch (e) {
            console.warn('LocalStorage error:', e);
        }
    }

    saveState() {
        try {
            localStorage.setItem('perfect_shape_unlocked', this.unlockedLevels.toString());
            localStorage.setItem('perfect_shape_scores', JSON.stringify(this.levelScores));
            localStorage.setItem('perfect_shape_streak', this.streak.toString());
        } catch (e) {}
    }

    initDPI() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvasWrapper.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        this.ctx.scale(dpr, dpr);
        this.dpr = dpr;
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
    }

    initDOM() {
        this.modeButtons = document.querySelectorAll('.mode-pill');
        this.streakCounter = document.getElementById('streak-counter');
        this.totalStarsCounter = document.getElementById('total-stars');
        this.shapeSelectorContainer = document.getElementById('shape-selector-container');
        
        this.targetPrompt = document.getElementById('target-prompt');
        this.targetBadge = document.getElementById('target-badge');
        this.targetShapeName = document.getElementById('target-shape-name');
        this.targetHint = document.getElementById('target-hint');
        this.liveIndicator = document.getElementById('live-indicator');

        this.ringMeter = document.getElementById('ring-meter');
        this.scorePercentageText = document.getElementById('score-percentage-text');
        this.rankBadge = document.getElementById('rank-badge');
        this.evalTitle = document.getElementById('eval-title');
        this.evalSubtitle = document.getElementById('eval-subtitle');
        
        this.metricValues = [
            document.getElementById('m-val-1'),
            document.getElementById('m-val-2'),
            document.getElementById('m-val-3'),
            document.getElementById('m-val-4')
        ];
        this.metricLabels = document.querySelectorAll('.m-label');

        this.starElements = [
            document.getElementById('star-1'),
            document.getElementById('star-2'),
            document.getElementById('star-3')
        ];

        this.btnNextLevel = document.getElementById('btn-next-level');
        this.btnShareCard = document.getElementById('btn-share-card');
        this.btnClear = document.getElementById('btn-clear-canvas');
        this.btnToggleHeatmap = document.getElementById('btn-toggle-heatmap');
        this.btnToggleGhost = document.getElementById('btn-toggle-ghost');
        this.btnTheme = document.getElementById('theme-toggle-btn');
        this.btnSound = document.getElementById('sound-toggle-btn');

        this.rushTimerContainer = document.getElementById('rush-timer-container');
        this.rushTimerVal = document.getElementById('rush-timer-val');
        this.rushScoreVal = document.getElementById('rush-score-val');
        this.rushProgressFill = document.getElementById('rush-progress-fill');

        this.updateTotalStarsUI();
        this.streakCounter.textContent = this.streak;
    }

    initEvents() {
        window.addEventListener('resize', () => {
            this.initDPI();
            this.redrawCanvas();
        });

        // Pointer / Touch drawing events on canvas
        const getCanvasCoords = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const startDrawing = (e) => {
            if (e.target !== this.canvas) return;
            e.preventDefault();
            this.isDrawing = true;
            this.rawPoints = [];
            this.lastEvaluation = null;
            const pt = getCanvasCoords(e);
            this.rawPoints.push({ x: pt.x, y: pt.y, time: Date.now() });

            this.audio.startDrawSound();
            this.liveIndicator.classList.remove('hidden');
            this.spawnParticles(pt.x, pt.y, 6);
        };

        const moveDrawing = (e) => {
            if (!this.isDrawing) return;
            e.preventDefault();
            const pt = getCanvasCoords(e);
            const prev = this.rawPoints[this.rawPoints.length - 1];
            
            // Filter out duplicate points too close
            if (prev) {
                const dist = Math.hypot(pt.x - prev.x, pt.y - prev.y);
                if (dist < 2) return;
                this.audio.updateDrawPitch(dist);
            }

            this.rawPoints.push({ x: pt.x, y: pt.y, time: Date.now() });
            this.spawnParticles(pt.x, pt.y, 2);
        };

        const endDrawing = (e) => {
            if (!this.isDrawing) return;
            e.preventDefault();
            this.isDrawing = false;
            this.audio.stopDrawSound();
            this.liveIndicator.classList.add('hidden');

            this.evaluateCurrentDrawing();
        };

        this.canvas.addEventListener('mousedown', startDrawing);
        window.addEventListener('mousemove', moveDrawing);
        window.addEventListener('mouseup', endDrawing);

        this.canvas.addEventListener('touchstart', startDrawing, { passive: false });
        window.addEventListener('touchmove', moveDrawing, { passive: false });
        window.addEventListener('touchend', endDrawing, { passive: false });
        window.addEventListener('touchcancel', endDrawing, { passive: false });

        // Mode Switching
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setMode(btn.getAttribute('data-mode'));
                this.audio.playClick();
            });
        });

        // Action Buttons
        this.btnClear.addEventListener('click', () => {
            this.clearCanvas();
            this.audio.playClick();
        });

        this.btnToggleHeatmap.addEventListener('click', () => {
            this.showHeatmap = !this.showHeatmap;
            this.btnToggleHeatmap.classList.toggle('active', this.showHeatmap);
            this.audio.playClick();
            this.redrawCanvas();
        });

        this.btnToggleGhost.addEventListener('click', () => {
            this.showGhost = !this.showGhost;
            this.btnToggleGhost.classList.toggle('active', this.showGhost);
            this.audio.playClick();
            this.redrawCanvas();
        });

        this.btnTheme.addEventListener('click', () => {
            const themes = ['cyber', 'blueprint', 'minimal'];
            const next = themes[(themes.indexOf(this.theme) + 1) % themes.length];
            this.setTheme(next);
            this.audio.playClick();
            this.showToast(`Theme: ${next.toUpperCase()}`);
        });

        this.btnSound.addEventListener('click', () => {
            const on = this.audio.toggleSound();
            document.getElementById('sound-icon-on').classList.toggle('hidden', !on);
            document.getElementById('sound-icon-off').classList.toggle('hidden', on);
            this.showToast(on ? 'Sound ON' : 'Sound OFF');
        });

        this.btnNextLevel.addEventListener('click', () => {
            this.audio.playClick();
            if (this.mode === 'gauntlet') {
                if (this.currentLevelIndex < this.levels.length - 1) {
                    this.currentLevelIndex++;
                    this.updateUIForMode();
                    this.clearCanvas();
                } else {
                    this.showToast('🏆 Master of Precision! All Levels Completed!');
                }
            } else if (this.mode === 'rush') {
                this.nextRushTarget();
                this.clearCanvas();
            } else {
                this.clearCanvas();
            }
        });

        this.btnShareCard.addEventListener('click', () => {
            this.exportScoreCard();
            this.audio.playClick();
        });
    }

    setTheme(themeName) {
        this.theme = themeName;
        document.body.className = `theme-${themeName}`;
        localStorage.setItem('perfect_shape_theme', themeName);
    }

    setMode(newMode) {
        if (this.mode === 'rush' && this.rushActive) {
            this.stopRushTimer();
        }
        this.mode = newMode;
        this.modeButtons.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-mode') === newMode);
        });

        if (newMode === 'rush') {
            this.canvasWrapper.classList.add('is-rush');
            this.startRushMode();
        } else {
            this.canvasWrapper.classList.remove('is-rush');
            this.rushTimerContainer.classList.add('hidden');
        }

        this.updateUIForMode();
        this.clearCanvas();
    }

    updateUIForMode() {
        this.shapeSelectorContainer.innerHTML = '';

        if (this.mode === 'gauntlet') {
            const currentLevel = this.levels[this.currentLevelIndex];
            this.targetBadge.textContent = `LEVEL ${this.currentLevelIndex + 1} OF ${this.levels.length}`;
            this.targetShapeName.textContent = currentLevel.name;
            this.targetHint.textContent = currentLevel.hint;
            this.btnNextLevel.textContent = (this.currentLevelIndex < this.levels.length - 1) ? 'Next Level →' : 'Replay Final Level';

            // Populate level tabs
            this.levels.forEach((lvl, idx) => {
                const btn = document.createElement('button');
                const isLocked = idx >= this.unlockedLevels;
                btn.className = `shape-tab-btn ${idx === this.currentLevelIndex ? 'active' : ''} ${isLocked ? 'locked' : ''}`;
                btn.innerHTML = `
                    <span>${isLocked ? '🔒' : '⭐'}</span>
                    <span>${lvl.name}</span>
                `;
                if (!isLocked) {
                    btn.addEventListener('click', () => {
                        this.currentLevelIndex = idx;
                        this.updateUIForMode();
                        this.clearCanvas();
                        this.audio.playClick();
                    });
                }
                this.shapeSelectorContainer.appendChild(btn);
            });

        } else if (this.mode === 'practice') {
            this.targetBadge.textContent = 'PRACTICE ARENA';
            this.targetShapeName.textContent = this.selectedPracticeShape;
            this.targetHint.textContent = 'Practice your muscle memory with infinite retries';
            this.btnNextLevel.textContent = 'Clear & Retry';

            const shapes = ['circle', 'square', 'triangle', 'line', 'diamond', 'star', 'heart', 'hexagon'];
            shapes.forEach(s => {
                const btn = document.createElement('button');
                btn.className = `shape-tab-btn ${s === this.selectedPracticeShape ? 'active' : ''}`;
                btn.innerHTML = `<span>${s.toUpperCase()}</span>`;
                btn.addEventListener('click', () => {
                    this.selectedPracticeShape = s;
                    this.updateUIForMode();
                    this.clearCanvas();
                    this.audio.playClick();
                });
                this.shapeSelectorContainer.appendChild(btn);
            });

        } else if (this.mode === 'freestyle') {
            this.targetBadge.textContent = 'AI SHAPE DETECTOR';
            this.targetShapeName.textContent = 'Anything (Auto-Detect)';
            this.targetHint.textContent = 'Draw any shape freely — AI will identify it and score your precision!';
            this.btnNextLevel.textContent = 'Draw Another';

        } else if (this.mode === 'rush') {
            this.targetBadge.textContent = 'SPEED RUSH';
            this.targetShapeName.textContent = this.rushTargetShape;
            this.targetHint.textContent = 'Draw as many accurate shapes as possible before time expires!';
            this.btnNextLevel.textContent = 'Skip Shape';
        }
    }

    startRushMode() {
        this.rushTimerContainer.classList.remove('hidden');
        this.rushTimeLeft = 60;
        this.rushScore = 0;
        this.rushActive = true;
        this.nextRushTarget();
        this.updateRushUI();

        if (this.rushTimer) clearInterval(this.rushTimer);
        this.rushTimer = setInterval(() => {
            this.rushTimeLeft--;
            this.updateRushUI();
            if (this.rushTimeLeft <= 0) {
                this.endRushMode();
            }
        }, 1000);
    }

    nextRushTarget() {
        const shapes = ['circle', 'square', 'triangle', 'line', 'diamond', 'star', 'heart', 'hexagon'];
        this.rushTargetShape = shapes[Math.floor(Math.random() * shapes.length)];
        this.targetShapeName.textContent = this.rushTargetShape;
    }

    updateRushUI() {
        this.rushTimerVal.textContent = `${this.rushTimeLeft}s`;
        this.rushScoreVal.textContent = this.rushScore;
        const pct = (this.rushTimeLeft / 60) * 100;
        this.rushProgressFill.style.width = `${pct}%`;
    }

    stopRushTimer() {
        this.rushActive = false;
        if (this.rushTimer) {
            clearInterval(this.rushTimer);
            this.rushTimer = null;
        }
    }

    async endRushMode() {
        this.stopRushTimer();
        this.showToast(`⏳ Time's Up! Final Rush Score: ${this.rushScore}`);
        this.audio.playScoreReveal(85);

        // Sync to Firebase Leaderboard if logged in
        try {
            const hash = btoa(this.rushScore + "_ARCADE_SECURE");
            await _$syncDataState('perfect_shape', this.rushScore, hash);
            this.showToast('🚀 High score synced to Arcade Leaderboard!');
        } catch (e) {
            console.log('Firebase sync note:', e);
        }
    }

    evaluateCurrentDrawing() {
        if (this.rawPoints.length < 5) {
            this.showToast('Stroke too short. Try again!');
            return;
        }

        let targetShape = 'circle';
        if (this.mode === 'gauntlet') {
            targetShape = this.levels[this.currentLevelIndex].target;
        } else if (this.mode === 'practice') {
            targetShape = this.selectedPracticeShape;
        } else if (this.mode === 'rush') {
            targetShape = this.rushTargetShape;
        }

        let result;
        if (this.mode === 'freestyle') {
            result = this.geo.autoDetectAndEvaluate(this.rawPoints);
        } else {
            result = this.geo.evaluate(this.rawPoints, targetShape);
        }

        this.lastEvaluation = result;
        this.animateScoreReveal(result);

        // Mode specific rewards & level unlocks
        if (this.mode === 'gauntlet') {
            const level = this.levels[this.currentLevelIndex];
            const passed = result.percentage >= level.passScore;
            
            // Calculate Stars
            let starsEarned = 0;
            if (result.percentage >= level.stars[0]) starsEarned = 1;
            if (result.percentage >= level.stars[1]) starsEarned = 2;
            if (result.percentage >= level.stars[2]) starsEarned = 3;

            // Save best score & stars for this level
            const existing = this.levelScores[this.currentLevelIndex] || { bestScore: 0, stars: 0 };
            this.levelScores[this.currentLevelIndex] = {
                bestScore: Math.max(existing.bestScore, result.percentage),
                stars: Math.max(existing.stars, starsEarned)
            };

            if (passed) {
                this.streak++;
                if (this.currentLevelIndex + 1 >= this.unlockedLevels && this.unlockedLevels < this.levels.length) {
                    this.unlockedLevels = this.currentLevelIndex + 2;
                    this.showToast(`🎉 Level ${this.currentLevelIndex + 2} Unlocked!`);
                }
            } else {
                this.streak = 0;
            }

            this.saveState();
            this.streakCounter.textContent = this.streak;
            this.updateTotalStarsUI();

        } else if (this.mode === 'rush' && this.rushActive) {
            if (result.percentage >= 75) {
                const points = Math.round(result.percentage * 10);
                this.rushScore += points;
                this.showToast(`+${points} pts (${result.percentage}%)`);
                this.nextRushTarget();
                setTimeout(() => this.clearCanvas(), 700);
            }
        }
    }

    animateScoreReveal(result) {
        const finalScore = result.percentage;
        let curr = 0;
        const duration = 750;
        const startTime = performance.now();

        // Animate SVG Ring & Text
        const circumference = 427.26; // 2 * PI * 68
        const targetOffset = circumference - (finalScore / 100) * circumference;

        const updateRing = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const val = (finalScore * ease).toFixed(1);

            this.scorePercentageText.textContent = `${val}%`;
            this.ringMeter.style.strokeDashoffset = (circumference - (finalScore * ease / 100) * circumference);
            this.ringMeter.style.stroke = result.grade.color;

            if (progress < 1) {
                this.audio.playScoreTick(progress);
                requestAnimationFrame(updateRing);
            } else {
                this.scorePercentageText.textContent = `${finalScore.toFixed(1)}%`;
                this.ringMeter.style.strokeDashoffset = targetOffset;
                this.rankBadge.textContent = result.grade.rank;
                this.rankBadge.style.background = result.grade.color;
                this.rankBadge.style.color = '#fff';

                this.evalTitle.textContent = result.grade.title;
                this.evalSubtitle.textContent = this.mode === 'freestyle' ? `Detected: ${result.shape.toUpperCase()}` : `Accuracy: ${finalScore}%`;

                // Update Metric values
                if (result.stats && result.stats.length) {
                    result.stats.forEach((st, i) => {
                        if (this.metricValues[i]) {
                            this.metricValues[i].textContent = st.value;
                            if (this.metricLabels[i]) this.metricLabels[i].textContent = st.label;
                        }
                    });
                }

                // Update Stars UI
                this.updateStarRating(finalScore);

                // Audio victory reveal
                this.audio.playScoreReveal(finalScore);

                // Celebration particles if score >= 90%
                if (finalScore >= 90 && result.center) {
                    this.spawnParticles(result.center.x, result.center.y, 40, true);
                }
            }
        };

        requestAnimationFrame(updateRing);
    }

    updateStarRating(score) {
        let stars = 0;
        if (score >= 80) stars = 1;
        if (score >= 88) stars = 2;
        if (score >= 95) stars = 3;

        this.starElements.forEach((el, idx) => {
            el.classList.toggle('active', idx < stars);
        });
    }

    updateTotalStarsUI() {
        let total = 0;
        Object.values(this.levelScores).forEach(s => {
            total += (s.stars || 0);
        });
        const maxStars = this.levels.length * 3;
        this.totalStarsCounter.textContent = `${total} / ${maxStars}`;
    }

    clearCanvas() {
        this.rawPoints = [];
        this.lastEvaluation = null;
        this.particles = [];
        this.scorePercentageText.textContent = '--%';
        this.ringMeter.style.strokeDashoffset = 427.26;
        this.rankBadge.textContent = 'READY';
        this.rankBadge.style.background = 'rgba(255,255,255,0.1)';
        this.rankBadge.style.color = 'var(--text-secondary)';
        this.evalTitle.textContent = 'Draw to Begin';
        this.evalSubtitle.textContent = 'Unleash your muscle memory';
        this.starElements.forEach(el => el.classList.remove('active'));
        this.metricValues.forEach(m => m.textContent = '--');
    }

    spawnParticles(x, y, count = 5, isBurst = false) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = isBurst ? (Math.random() * 6 + 2) : (Math.random() * 2 + 0.5);
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: isBurst ? (Math.random() * 0.02 + 0.015) : (Math.random() * 0.06 + 0.03),
                color: isBurst ? (Math.random() > 0.5 ? '#ff007f' : '#00f2fe') : '#00f2fe',
                size: isBurst ? (Math.random() * 4 + 2) : (Math.random() * 2.5 + 1)
            });
        }
    }

    startRenderLoop() {
        const render = () => {
            this.redrawCanvas();
            this.animationFrameId = requestAnimationFrame(render);
        };
        this.animationFrameId = requestAnimationFrame(render);
    }

    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // 1. Draw Ideal Ghost Template (if active and available)
        if (this.showGhost && this.lastEvaluation && this.lastEvaluation.idealPoints && this.lastEvaluation.idealPoints.length > 1) {
            this.drawIdealGhost(this.lastEvaluation.idealPoints);
        }

        // 2. Draw User Stroke with Deviation Heatmap or Laser Line
        if (this.rawPoints.length > 1) {
            if (this.showHeatmap && this.lastEvaluation && this.lastEvaluation.heatmap && this.lastEvaluation.heatmap.length > 1) {
                this.drawHeatmapStroke(this.lastEvaluation.heatmap);
            } else {
                this.drawLaserStroke(this.rawPoints);
            }
        }

        // 3. Draw Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    drawLaserStroke(points) {
        this.ctx.save();
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Outer Glow
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = '#00f2fe';
        this.ctx.strokeStyle = '#00f2fe';
        this.ctx.lineWidth = 4.5;

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);

        // Smooth Quadratic Bezier Curves
        for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        if (points.length > 1) {
            const last = points[points.length - 1];
            this.ctx.lineTo(last.x, last.y);
        }
        this.ctx.stroke();

        // Inner Bright Core
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawHeatmapStroke(heatmap) {
        this.ctx.save();
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        for (let i = 0; i < heatmap.length - 1; i++) {
            const item = heatmap[i];
            const nextItem = heatmap[i + 1];
            
            // Error gradient: 0 -> Emerald green, 0.3 -> Yellow, 0.7 -> Orange, 1.0 -> Red
            const err = (item.error + nextItem.error) / 2;
            let color = '#10b981'; // Green
            if (err > 0.6) color = '#ef4444'; // Red
            else if (err > 0.35) color = '#f97316'; // Orange
            else if (err > 0.15) color = '#eab308'; // Yellow

            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 4;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = color;
            this.ctx.moveTo(item.point.x, item.point.y);
            this.ctx.lineTo(nextItem.point.x, nextItem.point.y);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawIdealGhost(idealPoints) {
        this.ctx.save();
        this.ctx.setLineDash([6, 6]);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        this.ctx.lineWidth = 2.5;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = 'rgba(79, 172, 254, 0.8)';

        this.ctx.beginPath();
        this.ctx.moveTo(idealPoints[0].x, idealPoints[0].y);
        for (let i = 1; i < idealPoints.length; i++) {
            this.ctx.lineTo(idealPoints[i].x, idealPoints[i].y);
        }
        if (idealPoints.length > 2 && this.lastEvaluation.shape !== 'line') {
            this.ctx.closePath();
        }
        this.ctx.stroke();
        this.ctx.restore();
    }

    exportScoreCard() {
        if (!this.lastEvaluation || this.rawPoints.length < 5) {
            this.showToast('Draw a shape first to export your score!');
            return;
        }

        const expCanvas = document.getElementById('export-canvas');
        const eCtx = expCanvas.getContext('2d');
        const w = 800, h = 800;
        expCanvas.width = w;
        expCanvas.height = h;

        // Background
        eCtx.fillStyle = '#0a0d14';
        eCtx.fillRect(0, 0, w, h);

        // Radial ambient glow
        const grad = eCtx.createRadialGradient(w/2, h/2, 50, w/2, h/2, 400);
        grad.addColorStop(0, 'rgba(0, 242, 254, 0.15)');
        grad.addColorStop(1, 'rgba(10, 13, 20, 0)');
        eCtx.fillStyle = grad;
        eCtx.fillRect(0, 0, w, h);

        // Header text
        eCtx.fillStyle = '#94a3b8';
        eCtx.font = '600 20px "Space Grotesk", sans-serif';
        eCtx.fillText('THE ARCADE LABS • PRECISION GEOMETRY', 60, 80);

        eCtx.fillStyle = '#ffffff';
        eCtx.font = '800 48px "Space Grotesk", sans-serif';
        eCtx.fillText(`PERFECT ${this.lastEvaluation.shape.toUpperCase()}`, 60, 135);

        // Center Drawing Thumbnail
        // Compute bounding box to scale drawing into 400x400 box at (200, 200)
        const bounds = this.geo.getBoundsAndPCA(this.rawPoints);
        const pad = 40;
        const scale = Math.min((400 - pad * 2) / (bounds.width || 1), (400 - pad * 2) / (bounds.height || 1), 1.8);
        const offsetX = 400 - bounds.center.x * scale;
        const offsetY = 380 - bounds.center.y * scale;

        eCtx.save();
        eCtx.translate(offsetX, offsetY);
        eCtx.scale(scale, scale);

        // Ideal Ghost
        if (this.lastEvaluation.idealPoints) {
            eCtx.setLineDash([5, 5]);
            eCtx.strokeStyle = 'rgba(255,255,255,0.4)';
            eCtx.lineWidth = 3 / scale;
            eCtx.beginPath();
            eCtx.moveTo(this.lastEvaluation.idealPoints[0].x, this.lastEvaluation.idealPoints[0].y);
            this.lastEvaluation.idealPoints.forEach(p => eCtx.lineTo(p.x, p.y));
            if (this.lastEvaluation.shape !== 'line') eCtx.closePath();
            eCtx.stroke();
        }

        // User Stroke
        eCtx.setLineDash([]);
        eCtx.strokeStyle = '#00f2fe';
        eCtx.lineWidth = 5 / scale;
        eCtx.shadowBlur = 15;
        eCtx.shadowColor = '#00f2fe';
        eCtx.beginPath();
        eCtx.moveTo(this.rawPoints[0].x, this.rawPoints[0].y);
        this.rawPoints.forEach(p => eCtx.lineTo(p.x, p.y));
        eCtx.stroke();
        eCtx.restore();

        // Big Score at Bottom
        eCtx.fillStyle = this.lastEvaluation.grade.color;
        eCtx.font = '900 84px "Outfit", sans-serif';
        eCtx.fillText(`${this.lastEvaluation.percentage.toFixed(1)}%`, 60, 680);

        eCtx.fillStyle = '#ffffff';
        eCtx.font = '700 28px "Space Grotesk", sans-serif';
        eCtx.fillText(`RANK: ${this.lastEvaluation.grade.rank} • ${this.lastEvaluation.grade.title}`, 60, 725);

        // Export Download
        const link = document.createElement('a');
        link.download = `perfect_shape_${this.lastEvaluation.shape}_${this.lastEvaluation.percentage}pct.png`;
        link.href = expCanvas.toDataURL('image/png');
        link.click();
        this.showToast('📸 Snapshot saved to downloads!');
    }

    showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Start Game on DOM Load
window.addEventListener('DOMContentLoaded', () => {
    new PerfectShapeGame();
});
