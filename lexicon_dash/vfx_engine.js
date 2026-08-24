/**
 * LEXICON DASH - Canvas VFX & Micro-Animations Engine
 * Particle emitter, combo streaks, shockwaves, floating combat numbers, and confetti
 */

class VFXEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.floatingTexts = [];
        this.shockwaves = [];
        this.animFrame = null;
        this.initCanvas();
    }

    initCanvas() {
        this.canvas = document.getElementById('vfx-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'vfx-canvas';
            this.canvas.style.position = 'fixed';
            this.canvas.style.inset = '0';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '999';
            document.body.appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loop();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Trigger particle burst at specific coordinate or element
     */
    burstAtElement(element, color = '#38bdf8', count = 24) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        this.burst(x, y, color, count);
    }

    burst(x, y, color = '#38bdf8', count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                radius: 2 + Math.random() * 4,
                color: color,
                alpha: 1,
                decay: 0.02 + Math.random() * 0.02,
                gravity: 0.15,
                type: 'spark'
            });
        }
    }

    /**
     * Trigger Star Dust collection effect
     */
    starDustBurst(x, y, amount = 10) {
        for (let i = 0; i < amount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4.5;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                radius: 3 + Math.random() * 3,
                color: '#fbbf24',
                alpha: 1,
                decay: 0.015,
                gravity: 0.08,
                type: 'star',
                rot: Math.random() * Math.PI,
                vRot: (Math.random() - 0.5) * 0.2
            });
        }
    }

    /**
     * Trigger Slam Buzzer circular shockwave and screen shake
     */
    triggerBuzzerShockwave(x = window.innerWidth / 2, y = window.innerHeight / 2) {
        this.shockwaves.push({
            x, y,
            radius: 10,
            maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.6,
            lineWidth: 12,
            alpha: 1,
            color: '#ef4444',
            speed: 25
        });
        this.shakeScreen(10, 400);
    }

    /**
     * Floating text (+150 pts, COMBO x2, etc.)
     */
    addFloatingText(text, x, y, color = '#22c55e', size = 20) {
        this.floatingTexts.push({
            text, x, y,
            vy: -1.8,
            alpha: 1,
            color,
            size,
            decay: 0.015
        });
    }

    /**
     * Confetti blast for victory / grid completion
     */
    confettiCelebration() {
        const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];
        for (let i = 0; i < 90; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: -20,
                vx: (Math.random() - 0.5) * 4,
                vy: 2 + Math.random() * 5,
                radius: 4 + Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.005,
                gravity: 0.05,
                type: 'confetti',
                rot: Math.random() * Math.PI,
                vRot: (Math.random() - 0.5) * 0.2
            });
        }
    }

    /**
     * Screen shake utility
     */
    shakeScreen(intensity = 6, durationMs = 300) {
        const root = document.getElementById('game-container') || document.body;
        const start = performance.now();

        const shake = (now) => {
            const elapsed = now - start;
            if (elapsed < durationMs) {
                const damping = 1 - (elapsed / durationMs);
                const dx = (Math.random() - 0.5) * intensity * damping;
                const dy = (Math.random() - 0.5) * intensity * damping;
                root.style.transform = `translate(${dx}px, ${dy}px)`;
                requestAnimationFrame(shake);
            } else {
                root.style.transform = 'translate(0px, 0px)';
            }
        };
        requestAnimationFrame(shake);
    }

    loop() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Update & draw shockwaves
            for (let i = this.shockwaves.length - 1; i >= 0; i--) {
                const sw = this.shockwaves[i];
                sw.radius += sw.speed;
                sw.alpha -= (sw.radius / sw.maxRadius) * 0.04;
                sw.lineWidth = Math.max(1, sw.lineWidth * 0.95);

                if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
                    this.shockwaves.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = sw.color;
                this.ctx.globalAlpha = Math.max(0, sw.alpha);
                this.ctx.lineWidth = sw.lineWidth;
                this.ctx.stroke();
                this.ctx.restore();
            }

            // Update & draw particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity || 0;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.globalAlpha = Math.max(0, p.alpha);
                this.ctx.fillStyle = p.color;

                if (p.type === 'confetti') {
                    p.rot += p.vRot;
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.rot);
                    this.ctx.fillRect(-p.radius, -p.radius / 2, p.radius * 2, p.radius);
                } else if (p.type === 'star') {
                    p.rot += p.vRot;
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.rot);
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                this.ctx.restore();
            }

            // Update & draw floating numbers/texts
            for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
                const t = this.floatingTexts[i];
                t.y += t.vy;
                t.alpha -= t.decay;

                if (t.alpha <= 0) {
                    this.floatingTexts.splice(i, 1);
                    continue;
                }

                this.ctx.save();
                this.ctx.font = `bold ${t.size}px 'Outfit', sans-serif`;
                this.ctx.fillStyle = t.color;
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.lineWidth = 3;
                this.ctx.globalAlpha = Math.max(0, t.alpha);
                this.ctx.strokeText(t.text, t.x, t.y);
                this.ctx.fillText(t.text, t.x, t.y);
                this.ctx.restore();
            }
        }

        this.animFrame = requestAnimationFrame(() => this.loop());
    }
}

// Global VFX singleton
window.VFXEngine = new VFXEngine();
