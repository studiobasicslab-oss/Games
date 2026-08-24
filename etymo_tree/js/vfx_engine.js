/**
 * Etymo-Tree: The Root Shifter - VFX Engine
 * Ancient rune glyph particles, illuminated manuscript constellations, tree branch energy lines
 */

class VFXEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.runes = ['*méh₂tēr', '*ph₂tḗr', '*ḱwṓn', '*déḱm̥', '*h₂stḗr', '*wódr̥', '*ǵenh₁', '*bʰréh₂tēr', 'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ'];
        this.particles = [];
        this.treeArcs = [];
        this.width = 0;
        this.height = 0;

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        this.resize();
        this.initGlyphs();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    initGlyphs() {
        this.particles = [];
        const count = 30;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                text: this.runes[Math.floor(Math.random() * this.runes.length)],
                alpha: 0.05 + Math.random() * 0.12,
                size: 11 + Math.random() * 8
            });
        }
    }

    spawnLinguisticFlash(x, y, color = '#f59e0b') {
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 3.5;
            this.particles.push({
                type: 'spark',
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                life: 1.0,
                decay: 0.03
            });
        }
    }

    loop() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Floating Ancestral Glyphs
        this.ctx.font = '12px "JetBrains Mono", monospace';
        this.ctx.textAlign = 'center';

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            if (p.type === 'spark') {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
                this.ctx.save();
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = Math.max(0, p.life);
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
                if (p.life <= 0) this.particles.splice(i, 1);
                continue;
            }

            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = '#f59e0b';
            this.ctx.fillText(p.text, p.x, p.y);
            this.ctx.restore();
        }

        requestAnimationFrame(this.loop);
    }
}
