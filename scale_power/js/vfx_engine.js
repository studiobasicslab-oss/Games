/**
 * Scale: The Power of Ten - VFX & Procedural Scale Viewport Engine
 */

class VFXEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.currentScaleExp = 0; // Exponent (e.g. -15 to +26)
        this.targetScaleExp = 0;
        this.animPhase = 0;
        this.stars = [];
        this.quarks = [];
        this.dnaNodes = [];

        this.width = 0;
        this.height = 0;

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        this.resize();
        this.initScaleElements();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    initScaleElements() {
        this.stars = [];
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: 0.5 + Math.random() * 2,
                alpha: 0.2 + Math.random() * 0.8
            });
        }

        this.quarks = [
            { x: -30, y: -20, color: '#ef4444', label: 'Up' },
            { x: 30, y: -20, color: '#3b82f6', label: 'Up' },
            { x: 0, y: 35, color: '#10b981', label: 'Down' }
        ];

        this.dnaNodes = [];
        for (let i = 0; i < 20; i++) {
            this.dnaNodes.push({ y: i * 15, phase: i * 0.4 });
        }
    }

    setScaleExponent(exp) {
        this.targetScaleExp = exp;
    }

    loop() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.animPhase += 0.03;

        // Smooth zoom interpolation
        this.currentScaleExp += (this.targetScaleExp - this.currentScaleExp) * 0.1;
        const exp = this.currentScaleExp;

        const cx = this.width / 2;
        const cy = this.height / 2;

        // 1. Cosmic Background Starfield
        const starAlpha = Math.max(0.1, Math.min(1.0, (exp + 5) / 20));
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(s => {
            this.ctx.globalAlpha = s.alpha * starAlpha;
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0;

        // 2. Render Scale Layer based on current exponent
        if (exp <= -12) {
            // Subatomic / Quarks Realm
            this.renderQuarkRealm(cx, cy);
        } else if (exp > -12 && exp <= -7) {
            // DNA & Atomic Orbitals
            this.renderAtomicRealm(cx, cy);
        } else if (exp > -7 && exp <= -3) {
            // Cellular & Microscopic
            this.renderCellularRealm(cx, cy);
        } else if (exp > -3 && exp <= 4) {
            // Macroscopic / Organism
            this.renderMacroscopicRealm(cx, cy);
        } else if (exp > 4 && exp <= 12) {
            // Planetary / Solar System
            this.renderPlanetaryRealm(cx, cy);
        } else {
            // Galactic & Cosmic Web
            this.renderCosmicWebRealm(cx, cy);
        }

        requestAnimationFrame(this.loop);
    }

    renderQuarkRealm(cx, cy) {
        this.ctx.save();
        this.ctx.translate(cx, cy);

        // Gluon flux tubes
        this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.quarks.forEach((q, i) => {
            const next = this.quarks[(i + 1) % this.quarks.length];
            this.ctx.moveTo(q.x, q.y);
            this.ctx.lineTo(next.x, next.y);
        });
        this.ctx.stroke();

        // Quark charges
        this.quarks.forEach(q => {
            const pulse = Math.sin(this.animPhase * 2 + q.x) * 3;
            this.ctx.fillStyle = q.color;
            this.ctx.shadowColor = q.color;
            this.ctx.shadowBlur = 16;
            this.ctx.beginPath();
            this.ctx.arc(q.x, q.y, 14 + pulse, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.restore();
    }

    renderAtomicRealm(cx, cy) {
        this.ctx.save();
        this.ctx.translate(cx, cy);

        // Rotating Electron Orbitals
        for (let i = 0; i < 3; i++) {
            this.ctx.save();
            this.ctx.rotate(this.animPhase + (i * Math.PI / 3));
            this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 110, 40, 0, 0, Math.PI * 2);
            this.ctx.stroke();

            // Electron particle
            const ex = Math.cos(this.animPhase * 3) * 110;
            const ey = Math.sin(this.animPhase * 3) * 40;
            this.ctx.fillStyle = '#00f0ff';
            this.ctx.shadowColor = '#00f0ff';
            this.ctx.shadowBlur = 12;
            this.ctx.beginPath();
            this.ctx.arc(ex, ey, 5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        // Nucleus
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.shadowColor = '#f59e0b';
        this.ctx.shadowBlur = 20;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    renderCellularRealm(cx, cy) {
        this.ctx.save();
        this.ctx.translate(cx, cy);

        // Biological Cell Membrane
        this.ctx.strokeStyle = '#10b981';
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        this.ctx.lineWidth = 4;
        this.ctx.shadowColor = '#10b981';
        this.ctx.shadowBlur = 15;

        this.ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
            const r = 90 + Math.sin(a * 5 + this.animPhase) * 6;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (a === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Organelle Nucleus
        this.ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(20, -10, 25, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    renderMacroscopicRealm(cx, cy) {
        this.ctx.save();
        this.ctx.translate(cx, cy);

        // Human / Earth horizon ring
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = '#38bdf8';
        this.ctx.shadowBlur = 12;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 80, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
        this.ctx.fill();
        this.ctx.restore();
    }

    renderPlanetaryRealm(cx, cy) {
        this.ctx.save();
        this.ctx.translate(cx, cy);

        // Planet Sphere with Saturn Rings
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.shadowColor = '#f59e0b';
        this.ctx.shadowBlur = 24;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 65, 0, Math.PI * 2);
        this.ctx.fill();

        // Concentric Rings
        this.ctx.save();
        this.ctx.rotate(0.35);
        this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
        this.ctx.lineWidth = 14;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 140, 28, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();

        this.ctx.restore();
    }

    renderCosmicWebRealm(cx, cy) {
        this.ctx.save();
        this.ctx.translate(cx, cy);

        // Spiral Galaxy Arms
        this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
        this.ctx.lineWidth = 3;
        for (let arm = 0; arm < 2; arm++) {
            this.ctx.beginPath();
            const armOffset = arm * Math.PI;
            for (let r = 10; r < 140; r += 4) {
                const theta = r * 0.05 + this.animPhase * 0.5 + armOffset;
                const x = Math.cos(theta) * r;
                const y = Math.sin(theta) * r;
                if (r === 10) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
        }

        // Galactic Supermassive Core
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#a855f7';
        this.ctx.shadowBlur = 30;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 15, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}
