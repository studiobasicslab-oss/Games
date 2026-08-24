/**
 * Biome Swap: The Keystone Balance - VFX Engine
 * Ambient spores, trophic energy flows, lush ecological bloom ripples
 */

class VFXEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.blooms = [];
        this.energyFlows = [];
        this.width = 0;
        this.height = 0;

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        this.resize();
        this.initSpores();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    initSpores() {
        this.particles = [];
        const count = 45;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -0.2 - Math.random() * 0.5,
                radius: 1 + Math.random() * 2.5,
                alpha: 0.2 + Math.random() * 0.5,
                color: Math.random() > 0.4 ? '#10b981' : '#38bdf8'
            });
        }
    }

    spawnBloomRipple(x, y, color = '#10b981') {
        this.blooms.push({
            x, y,
            radius: 5,
            maxRadius: 120 + Math.random() * 60,
            color,
            alpha: 0.9,
            speed: 3
        });
    }

    spawnEnergyFlow(fromX, fromY, toX, toY, color = '#facc15') {
        this.energyFlows.push({
            fromX, fromY, toX, toY,
            progress: 0,
            speed: 0.03,
            color,
            size: 4
        });
    }

    loop() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Spores
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < 0) p.y = this.height;
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // 2. Blooms
        for (let i = this.blooms.length - 1; i >= 0; i--) {
            const b = this.blooms[i];
            b.radius += b.speed;
            b.alpha = 1 - (b.radius / b.maxRadius);

            this.ctx.save();
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = b.color;
            this.ctx.globalAlpha = Math.max(0, b.alpha);
            this.ctx.shadowColor = b.color;
            this.ctx.shadowBlur = 12;
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();

            if (b.radius >= b.maxRadius) {
                this.blooms.splice(i, 1);
            }
        }

        // 3. Energy Flows
        for (let i = this.energyFlows.length - 1; i >= 0; i--) {
            const f = this.energyFlows[i];
            f.progress += f.speed;
            const cx = f.fromX + (f.toX - f.fromX) * f.progress;
            const cy = f.fromY + (f.toY - f.fromY) * f.progress;

            this.ctx.save();
            this.ctx.fillStyle = f.color;
            this.ctx.shadowColor = f.color;
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, f.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            if (f.progress >= 1.0) {
                this.spawnBloomRipple(f.toX, f.toY, f.color);
                this.energyFlows.splice(i, 1);
            }
        }

        requestAnimationFrame(this.loop);
    }
}
