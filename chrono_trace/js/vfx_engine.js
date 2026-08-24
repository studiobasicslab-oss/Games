/**
 * ChronoTrace Visual Effects (VFX) Engine
 * Handles background ambient chronon particles, interactive bursts,
 * screen-shake feedback, and rift fracture animations.
 */

class VFXEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.bursts = [];
        this.width = 0;
        this.height = 0;
        this.animFrameId = null;
        this.isRunning = false;
    }

    init(canvasElement) {
        if (!canvasElement) return;
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());
        this.createAmbientParticles();
        this.start();
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createAmbientParticles() {
        this.particles = [];
        const count = Math.min(80, Math.floor((this.width * this.height) / 18000));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2 + 0.8,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35 - 0.2, // slight upward drift
                alpha: Math.random() * 0.6 + 0.2,
                baseAlpha: Math.random() * 0.5 + 0.2,
                color: this.getRandomChrononColor(),
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    getRandomChrononColor() {
        const colors = [
            'rgba(0, 245, 212,', // cyan
            'rgba(155, 93, 229,', // purple
            'rgba(0, 187, 249,', // blue
            'rgba(241, 91, 181,', // magenta
            'rgba(254, 228, 64,'  // gold
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    triggerNodeBurst(x, y, color = '#00f5d4', count = 24) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            this.bursts.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 3.5 + 1.5,
                color: color,
                alpha: 1.0,
                decay: Math.random() * 0.03 + 0.02
            });
        }
    }

    triggerParadoxFracture(x, y) {
        // Red / purple jagged paradox rift particles
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 3;
            this.bursts.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 4 + 2,
                color: Math.random() > 0.4 ? '#ff0055' : '#9b5de5',
                alpha: 1.0,
                decay: Math.random() * 0.04 + 0.025
            });
        }

        // Screen shake
        const container = document.getElementById('graph-viewport') || document.body;
        container.classList.remove('shake-rift');
        void container.offsetWidth; // trigger reflow
        container.classList.add('shake-rift');
        setTimeout(() => container.classList.remove('shake-rift'), 600);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        const render = (time) => {
            if (!this.isRunning) return;
            this.update(time);
            this.draw(time);
            this.animFrameId = requestAnimationFrame(render);
        };
        this.animFrameId = requestAnimationFrame(render);
    }

    stop() {
        this.isRunning = false;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
        }
    }

    update(time) {
        // Update ambient particles
        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            p.alpha = p.baseAlpha + Math.sin(time * 0.002 + p.twinkleOffset) * 0.2;
        }

        // Update active bursts
        for (let i = this.bursts.length - 1; i >= 0; i--) {
            const b = this.bursts[i];
            b.x += b.vx;
            b.y += b.vy;
            b.vx *= 0.94; // friction
            b.vy *= 0.94;
            b.alpha -= b.decay;

            if (b.alpha <= 0) {
                this.bursts.splice(i, 1);
            }
        }
    }

    draw(time) {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw subtle background lines connecting close particles (temporal web mesh)
        const maxDist = 95;
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const lineAlpha = (1 - dist / maxDist) * 0.12;
                    this.ctx.strokeStyle = `rgba(0, 245, 212, ${lineAlpha})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw ambient particles
        for (let p of this.particles) {
            this.ctx.fillStyle = `${p.color} ${Math.max(0, p.alpha)})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Draw bursts
        for (let b of this.bursts) {
            this.ctx.fillStyle = b.color;
            this.ctx.globalAlpha = Math.max(0, b.alpha);
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0;
    }
}

// Global instance
const vfxEngine = new VFXEngine();
if (typeof window !== 'undefined') {
    window.vfxEngine = vfxEngine;
}
