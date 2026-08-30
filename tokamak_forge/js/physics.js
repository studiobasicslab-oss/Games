/**
 * TOKAMAK FORGE: Particle Physics & Fusion Collision Engine
 * 2D Circular Rigid Body Dynamics, Magnetic Containment Torus, Radioisotope Decay Clocks & Merging.
 */

class TokamakPhysicsEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.sparks = [];
        this.shockwaves = [];
        this.dropX = 250;
        this.chamberWidth = 500;
        this.chamberHeight = 650;
        this.gravity = 980; // pixels / s^2
        this.magneticStrength = 0; // Triggered by pinch pulse
        this.containmentLineY = 120; // Overflow danger threshold
        this.overflowTimer = 0;
        this.totalEnergyYieldMeV = 0;
        this.fusionsCount = 0;
        this.isQuenched = false;
        this.isEraComplete = false;
        this.currentEra = null;
    }

    bindCanvas(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.chamberWidth = canvasElement.width;
        this.chamberHeight = canvasElement.height;
    }

    reset(eraData) {
        this.particles = [];
        this.sparks = [];
        this.shockwaves = [];
        this.currentEra = eraData;
        this.totalEnergyYieldMeV = 0;
        this.fusionsCount = 0;
        this.isQuenched = false;
        this.isEraComplete = false;
        this.overflowTimer = 0;
        this.dropX = this.chamberWidth * 0.5;
    }

    // Spawn and drop an isotope into the reactor
    spawnParticle(isotopeId, x = null, y = 60, vx = 0, vy = 0) {
        const iso = window.TOKAMAK_DATA.isotopes.find(i => i.id === isotopeId);
        if (!iso) return null;

        const posX = x !== null ? x : this.dropX;
        const p = {
            id: Math.random().toString(36).substr(2, 9),
            isotopeId: iso.id,
            symbol: iso.symbol,
            name: iso.name,
            Z: iso.Z,
            N: iso.N,
            A: iso.A,
            radius: iso.radius,
            color: iso.color,
            glow: iso.glow,
            mass: iso.massAmu,
            x: Math.max(iso.radius + 10, Math.min(this.chamberWidth - iso.radius - 10, posX)),
            y: y,
            vx: vx + (Math.random() - 0.5) * 20,
            vy: vy,
            halfLifeRemaining: iso.isStable ? Infinity : iso.halfLifeSec,
            halfLifeMax: iso.halfLifeSec,
            isStable: iso.isStable,
            decayProduct: iso.decayProduct,
            decayMode: iso.decayMode,
            fusesWith: iso.fusesWith,
            scale: 0.2, // Spawn pop-in animation
            spawnAge: 0,
            isMerging: false
        };

        this.particles.push(p);
        window.tokamakAudio.playParticleDrop();
        return p;
    }

    // Magnetic Pinch Pulse (Spacebar / Button)
    applyMagneticPinch() {
        if (this.isQuenched) return;
        window.tokamakAudio.playMagneticPulse();

        const centerX = this.chamberWidth * 0.5;
        const centerY = this.chamberHeight * 0.65;

        // Shockwave visual
        this.shockwaves.push({
            x: centerX,
            y: centerY,
            radius: 10,
            maxRadius: this.chamberWidth * 0.7,
            color: "rgba(6, 182, 212, 0.8)",
            lineWidth: 4,
            alpha: 1.0
        });

        // Pull particles toward center and down from overflow
        this.particles.forEach(p => {
            const dx = centerX - p.x;
            const dy = centerY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            p.vx += (dx / dist) * 220;
            p.vy += (dy / dist) * 220 + 80;
        });
    }

    // Update Physics Simulation Step (dt in seconds)
    update(dtSec) {
        if (this.isQuenched || this.isEraComplete) return;

        const dt = Math.min(dtSec, 0.05);

        // 1. Update particles kinematics
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Pop-in scale
            if (p.scale < 1.0) {
                p.scale = Math.min(1.0, p.scale + dt * 5.0);
            }

            // Gravity & velocity
            p.vy += this.gravity * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // Air/plasma friction drag
            p.vx *= 0.992;
            p.vy *= 0.992;

            // Wall collisions (Left, Right, Bottom)
            const leftBound = p.radius + 15;
            const rightBound = this.chamberWidth - p.radius - 15;
            const bottomBound = this.chamberHeight - p.radius - 15;

            if (p.x < leftBound) {
                p.x = leftBound;
                p.vx = -p.vx * 0.55;
            } else if (p.x > rightBound) {
                p.x = rightBound;
                p.vx = -p.vx * 0.55;
            }

            if (p.y > bottomBound) {
                p.y = bottomBound;
                p.vy = -p.vy * 0.45;
                p.vx *= 0.92; // ground friction
            }

            // 2. Radioactive Half-Life Decay Timer
            if (!p.isStable && p.halfLifeRemaining !== Infinity) {
                p.halfLifeRemaining -= dt;

                // Geiger audio warning when decaying
                if (p.halfLifeRemaining < 3.0 && Math.random() < 0.15) {
                    window.tokamakAudio.playGeigerClicks(1);
                }

                // Decay Event Triggered!
                if (p.halfLifeRemaining <= 0) {
                    this.triggerIsotopeDecay(p, i);
                    continue;
                }
            }
        }

        // 3. Particle-Particle Collisions and Fusion Merging
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                if (!p1 || !p2 || p1.isMerging || p2.isMerging) continue;

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = p1.radius + p2.radius;

                if (dist < minDist && dist > 0) {
                    // Check if these two can fuse!
                    const fusionResult = this.checkFusionReaction(p1, p2);

                    if (fusionResult) {
                        // Mark for fusion
                        p1.isMerging = true;
                        p2.isMerging = true;
                        this.executeFusion(p1, p2, fusionResult, i, j);
                        return; // restart frame to prevent indexing issues
                    } else {
                        // Elastic collision resolution
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const overlap = minDist - dist;

                        // Separate
                        p1.x -= nx * overlap * 0.5;
                        p1.y -= ny * overlap * 0.5;
                        p2.x += nx * overlap * 0.5;
                        p2.y += ny * overlap * 0.5;

                        // Relative velocity along normal
                        const kx = p1.vx - p2.vx;
                        const ky = p1.vy - p2.vy;
                        const p = 2 * (nx * kx + ny * ky) / (p1.mass + p2.mass);

                        p1.vx -= p * p2.mass * nx * 0.65;
                        p1.vy -= p * p2.mass * ny * 0.65;
                        p2.vx += p * p1.mass * nx * 0.65;
                        p2.vy += p * p1.mass * ny * 0.65;
                    }
                }
            }
        }

        // 4. Update Sparks & Shockwaves
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const s = this.sparks[i];
            s.x += s.vx * dt;
            s.y += s.vy * dt;
            s.alpha -= dt * 2.0;
            if (s.alpha <= 0) this.sparks.splice(i, 1);
        }

        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            sw.radius += dt * 350;
            sw.alpha -= dt * 1.8;
            if (sw.alpha <= 0) this.shockwaves.splice(i, 1);
        }

        // 5. Overflow Line Containment Check
        let hasOverflow = false;
        for (const p of this.particles) {
            if (p.y - p.radius < this.containmentLineY && Math.abs(p.vy) < 20) {
                hasOverflow = true;
                break;
            }
        }

        if (hasOverflow) {
            this.overflowTimer += dt;
            if (Math.random() < 0.1) window.tokamakAudio.playQuenchAlarm();
            if (this.overflowTimer > 5.0) {
                this.triggerQuench("Magnetic containment collapse: Plasma overflowed torus threshold!");
            }
        } else {
            this.overflowTimer = Math.max(0, this.overflowTimer - dt * 0.8);
        }

        // 6. Check Era Goals
        this.checkEraProgression();
    }

    checkFusionReaction(p1, p2) {
        if (p1.fusesWith && p1.fusesWith[p2.isotopeId]) {
            return { product: p1.fusesWith[p2.isotopeId].product, energyMeV: p1.fusesWith[p2.isotopeId].energyMeV };
        }
        if (p2.fusesWith && p2.fusesWith[p1.isotopeId]) {
            return { product: p2.fusesWith[p1.isotopeId].product, energyMeV: p2.fusesWith[p1.isotopeId].energyMeV };
        }
        return null;
    }

    executeFusion(p1, p2, fusionResult, idx1, idx2) {
        const midX = (p1.x + p2.x) * 0.5;
        const midY = (p1.y + p2.y) * 0.5;

        // Remove the two old particles
        this.particles = this.particles.filter(p => p.id !== p1.id && p.id !== p2.id);

        // Spawn merged product
        const newParticle = this.spawnParticle(fusionResult.product, midX, midY, (p1.vx + p2.vx) * 0.3, (p1.vy + p2.vy) * 0.3 - 50);

        // Update score & energy
        this.totalEnergyYieldMeV += fusionResult.energyMeV;
        this.fusionsCount++;

        // Audio & Visual Effects
        window.tokamakAudio.playFusionBurst(newParticle ? newParticle.A : 4);

        // Create Sparks
        for (let i = 0; i < 24; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 220;
            this.sparks.push({
                x: midX,
                y: midY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: newParticle ? newParticle.color : "#67e8f9",
                size: 2 + Math.random() * 3,
                alpha: 1.0
            });
        }

        // Shockwave
        this.shockwaves.push({
            x: midX,
            y: midY,
            radius: 8,
            maxRadius: 100,
            color: newParticle ? newParticle.glow : "rgba(255, 255, 255, 0.8)",
            lineWidth: 3,
            alpha: 1.0
        });
    }

    triggerIsotopeDecay(p, index) {
        window.tokamakAudio.playGeigerClicks(5);

        const x = p.x;
        const y = p.y;
        const decayProduct = p.decayProduct;

        // Remove decaying isotope
        this.particles.splice(index, 1);

        // Spawn daughter product
        if (decayProduct === "He4" && p.isotopeId === "Be8") {
            // Be8 splits into two He4
            this.spawnParticle("He4", x - 15, y, -80, -40);
            this.spawnParticle("He4", x + 15, y, 80, -40);
        } else if (decayProduct) {
            this.spawnParticle(decayProduct, x, y, (Math.random() - 0.5) * 40, -30);
        }

        // Radiation particle burst
        for (let i = 0; i < 16; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 120 + Math.random() * 180;
            this.sparks.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: "#f43f5e",
                size: 3,
                alpha: 1.0
            });
        }
    }

    triggerQuench(reason) {
        this.isQuenched = true;
        window.tokamakAudio.playQuenchAlarm();
    }

    checkEraProgression() {
        if (!this.currentEra || this.isEraComplete) return;

        // Check if all required target elements exist in chamber
        const hasAllTargets = this.currentEra.targetElements.every(reqId => {
            return this.particles.some(p => p.isotopeId === reqId);
        });

        const hasYield = this.totalEnergyYieldMeV >= this.currentEra.targetYieldMeV;

        if (hasAllTargets && hasYield) {
            this.isEraComplete = true;
            window.tokamakAudio.playEraComplete();
        }
    }

    // Render Canvas
    render() {
        if (!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.fillStyle = "#05070d";
        ctx.fillRect(0, 0, width, height);

        // Draw Tokamak Magnetic Torus Chamber Walls
        ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
        ctx.lineWidth = 4;
        ctx.strokeRect(15, 15, width - 30, height - 30);

        // Torus magnetic field grid lines
        ctx.strokeStyle = "rgba(6, 182, 212, 0.05)";
        ctx.lineWidth = 1;
        for (let y = 50; y < height - 30; y += 40) {
            ctx.beginPath();
            ctx.moveTo(15, y); ctx.lineTo(width - 15, y);
            ctx.stroke();
        }

        // Containment Overflow Danger Line
        ctx.strokeStyle = this.overflowTimer > 0 ? "rgba(244, 63, 94, 0.8)" : "rgba(234, 179, 8, 0.35)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(15, this.containmentLineY);
        ctx.lineTo(width - 15, this.containmentLineY);
        ctx.stroke();
        ctx.setLineDash([]);

        if (this.overflowTimer > 0) {
            ctx.fillStyle = "rgba(244, 63, 94, 0.9)";
            ctx.font = "bold 11px 'JetBrains Mono', monospace";
            ctx.fillText(`⚠️ CONTAINMENT BREACH IN ${(5.0 - this.overflowTimer).toFixed(1)}s`, 25, this.containmentLineY - 8);
        }

        // Draw Drop Aim Marker
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(this.dropX, 20);
        ctx.lineTo(this.dropX, this.containmentLineY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Render Shockwaves
        this.shockwaves.forEach(sw => {
            ctx.save();
            ctx.strokeStyle = sw.color;
            ctx.lineWidth = sw.lineWidth;
            ctx.globalAlpha = Math.max(0, sw.alpha);
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        });

        // Render Sparks
        this.sparks.forEach(s => {
            ctx.save();
            ctx.fillStyle = s.color;
            ctx.globalAlpha = Math.max(0, s.alpha);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Render Isotopes
        this.particles.forEach(p => {
            const r = p.radius * p.scale;

            // Halo Glow
            const grad = ctx.createRadialGradient(p.x, p.y, r * 0.4, p.x, p.y, r * 1.5);
            grad.addColorStop(0, p.color);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Core Sphere
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();

            // Inner 3D Highlight
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.beginPath();
            ctx.arc(p.x - r * 0.3, p.y - r * 0.3, r * 0.35, 0, Math.PI * 2);
            ctx.fill();

            // Radioactive Decay Progress Ring
            if (!p.isStable && p.halfLifeRemaining !== Infinity) {
                const frac = Math.max(0, p.halfLifeRemaining / p.halfLifeMax);
                ctx.strokeStyle = "#f43f5e";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(p.x, p.y, r + 4, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * frac);
                ctx.stroke();
            }

            // Symbol Text
            ctx.fillStyle = "#090d16";
            ctx.font = `bold ${Math.max(10, Math.round(r * 0.65))}px 'JetBrains Mono', monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(p.symbol, p.x, p.y);
        });
    }
}

window.tokamakEngine = new TokamakPhysicsEngine();
