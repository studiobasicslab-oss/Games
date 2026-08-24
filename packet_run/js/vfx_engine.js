/**
 * Packet Run: The Microarchitect - VFX Engine
 * Canvas 2D particle simulation, PCB circuit traces, bus data packet animations
 */

class VFXEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.busPackets = [];
        this.traces = [];
        this.width = 0;
        this.height = 0;
        this.clockPhase = 0;

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        this.resize();
        this.generateCircuitTraces();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    generateCircuitTraces() {
        this.traces = [];
        const count = Math.floor(this.width / 80);
        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const segments = [];
            let cx = x;
            let cy = y;
            const segCount = 3 + Math.floor(Math.random() * 4);
            for (let s = 0; s < segCount; s++) {
                const horizontal = Math.random() > 0.5;
                const len = 40 + Math.random() * 120;
                if (horizontal) {
                    cx += (Math.random() > 0.5 ? 1 : -1) * len;
                } else {
                    cy += (Math.random() > 0.5 ? 1 : -1) * len;
                }
                segments.push({ x: cx, y: cy });
            }
            this.traces.push({
                x, y,
                segments,
                alpha: 0.05 + Math.random() * 0.1,
                pulseOffset: Math.random() * Math.PI * 2,
                color: Math.random() > 0.3 ? '#00f0ff' : '#a855f7'
            });
        }
    }

    spawnSpark(x, y, color = '#00f0ff', count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4.5;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 1.5 + Math.random() * 2.5,
                color,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.03
            });
        }
    }

    spawnBusPulse(fromX, fromY, toX, toY, color = '#00f0ff', text = '') {
        this.busPackets.push({
            x: fromX,
            y: fromY,
            fromX,
            fromY,
            toX,
            toY,
            color,
            text,
            progress: 0,
            speed: 0.03 + Math.random() * 0.02,
            size: 6
        });
    }

    spawnFlash(color = 'rgba(0, 240, 255, 0.25)') {
        this.particles.push({
            type: 'flash',
            color,
            life: 1.0,
            decay: 0.04
        });
    }

    loop() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.clockPhase += 0.03;

        // 1. Draw circuit traces
        this.ctx.lineWidth = 1.5;
        this.traces.forEach(trace => {
            this.ctx.beginPath();
            this.ctx.moveTo(trace.x, trace.y);
            trace.segments.forEach(seg => {
                this.ctx.lineTo(seg.x, seg.y);
            });
            const pulse = (Math.sin(this.clockPhase + trace.pulseOffset) + 1) * 0.5;
            this.ctx.strokeStyle = trace.color;
            this.ctx.globalAlpha = trace.alpha * (0.6 + pulse * 0.4);
            this.ctx.stroke();

            // Trace node dots
            this.ctx.fillStyle = trace.color;
            this.ctx.beginPath();
            this.ctx.arc(trace.x, trace.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0;

        // 2. Draw bus packets
        for (let i = this.busPackets.length - 1; i >= 0; i--) {
            const p = this.busPackets[i];
            p.progress += p.speed;
            p.x = p.fromX + (p.toX - p.fromX) * p.progress;
            p.y = p.fromY + (p.toY - p.fromY) * p.progress;

            this.ctx.save();
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            if (p.text) {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '10px "JetBrains Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(p.text, p.x, p.y - 10);
            }
            this.ctx.restore();

            if (p.progress >= 1.0) {
                this.spawnSpark(p.toX, p.toY, p.color, 8);
                this.busPackets.splice(i, 1);
            }
        }

        // 3. Draw particles & flashes
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const part = this.particles[i];
            if (part.type === 'flash') {
                this.ctx.fillStyle = part.color;
                this.ctx.globalAlpha = part.life * 0.4;
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.ctx.globalAlpha = 1.0;
                part.life -= part.decay;
                if (part.life <= 0) this.particles.splice(i, 1);
                continue;
            }

            part.x += part.vx;
            part.y += part.vy;
            part.life -= part.decay;

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, part.life);
            this.ctx.fillStyle = part.color;
            this.ctx.shadowColor = part.color;
            this.ctx.shadowBlur = 6;
            this.ctx.beginPath();
            this.ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            if (part.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(this.loop);
    }
}
