/**
 * GRAVITY SLINGSHOT: Astrodynamics & Orbital Mechanics Engine
 * N-Body Gravitational Verlet Integrator, Real-Time Conic Trajectory Projection, and Astrodynamics Solvers.
 */

class SlingshotEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentMission = null;
        this.celestialBodies = [];
        this.probe = null;
        this.trajectoryPoints = [];
        this.exhaustParticles = [];
        this.orbitalHistory = [];
        this.camera = { x: 0, y: 0, zoom: 0.9 };
        this.timeWarp = 1; // 1x, 2x, 5x, 10x, 25x
        this.isThrusting = false;
        this.thrustVector = { x: 0, y: 0 }; // Normalized direction
        this.isCrashed = false;
        this.isMissionComplete = false;
        this.stableTimerSec = 0;
        this.maxSpeedRecorded = 0;
        this.hasSlingshotted = false;
    }

    bindCanvas(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
    }

    loadMission(missionData) {
        this.currentMission = missionData;
        this.isCrashed = false;
        this.isMissionComplete = false;
        this.stableTimerSec = 0;
        this.maxSpeedRecorded = 0;
        this.hasSlingshotted = false;
        this.orbitalHistory = [];
        this.exhaustParticles = [];
        this.timeWarp = 1;

        // Initialize Celestial Bodies
        this.celestialBodies = JSON.parse(JSON.stringify(missionData.celestialBodies));

        // Initialize Spacecraft Probe
        this.probe = {
            x: missionData.startPosition.x,
            y: missionData.startPosition.y,
            vx: missionData.startVelocity.vx,
            vy: missionData.startVelocity.vy,
            radius: 7,
            deltaVRemaining: missionData.deltaVBudget,
            deltaVMax: missionData.deltaVBudget,
            angle: Math.atan2(missionData.startVelocity.vy, missionData.startVelocity.vx),
            mass: 1.0
        };

        this.camera.x = this.probe.x;
        this.camera.y = this.probe.y;
    }

    // Set Thruster Direction & Fire
    setThrust(active, targetAngle = null) {
        this.isThrusting = active;
        if (active) {
            window.slingshotAudio.ensureContext();
            window.slingshotAudio.startEngineBurn();
            if (targetAngle !== null) {
                this.probe.angle = targetAngle;
                this.thrustVector = {
                    x: Math.cos(targetAngle),
                    y: Math.sin(targetAngle)
                };
            }
        } else {
            window.slingshotAudio.stopEngineBurn();
        }
    }

    // Adjust Probe Attitude (Angle)
    rotateProbe(deltaAngle) {
        if (!this.probe || this.isCrashed) return;
        this.probe.angle += deltaAngle;
        window.slingshotAudio.playRCSPulse();
    }

    // Physics Update Step
    update(dtSec) {
        if (!this.probe || this.isCrashed || this.isMissionComplete) return;

        // Apply time warp
        const totalDt = dtSec * this.timeWarp;
        const subSteps = Math.max(1, Math.min(10, Math.ceil(this.timeWarp * 0.5)));
        const dt = totalDt / subSteps;

        for (let step = 0; step < subSteps; step++) {
            this.physicsSubStep(dt);
        }

        // Camera follow probe
        this.camera.x += (this.probe.x - this.camera.x) * 0.1;
        this.camera.y += (this.probe.y - this.camera.y) * 0.1;

        // Calculate Forward Trajectory Projection Ray
        this.calculateTrajectoryPrediction();

        // Check Mission Goals
        this.checkMissionObjectives(totalDt);
    }

    physicsSubStep(dt) {
        // 1. Move Celestial Bodies on their orbits
        this.celestialBodies.forEach(b => {
            if (b.orbitRadius && b.orbitSpeed) {
                b.angle = (b.angle || 0) + b.orbitSpeed * dt;
                b.x = Math.cos(b.angle) * b.orbitRadius;
                b.y = Math.sin(b.angle) * b.orbitRadius;
            } else if (b.vx || b.vy) {
                b.x += (b.vx || 0) * dt;
                b.y += (b.vy || 0) * dt;
            }
        });

        // 2. Compute Gravitational Acceleration on Probe
        let ax = 0;
        let ay = 0;

        this.celestialBodies.forEach(b => {
            const dx = b.x - this.probe.x;
            const dy = b.y - this.probe.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            // Check surface impact
            if (dist < b.radius) {
                this.triggerCrash(`Impact with surface of ${b.name}!`);
                return;
            }

            // G = 1 in normalized units
            const force = b.mass / Math.max(distSq, 100);
            ax += (dx / dist) * force;
            ay += (dy / dist) * force;
        });

        // 3. Apply Engine Thrust & Delta-V Consumption
        if (this.isThrusting && this.probe.deltaVRemaining > 0) {
            const thrustAcc = 180; // m/s^2 acceleration
            const dvConsumed = thrustAcc * dt;
            this.probe.deltaVRemaining = Math.max(0, this.probe.deltaVRemaining - dvConsumed);

            const tx = Math.cos(this.probe.angle);
            const ty = Math.sin(this.probe.angle);
            ax += tx * thrustAcc;
            ay += ty * thrustAcc;

            // Spawn exhaust particles
            if (Math.random() < 0.6) {
                this.exhaustParticles.push({
                    x: this.probe.x - tx * 8,
                    y: this.probe.y - ty * 8,
                    vx: -tx * (150 + Math.random() * 80) + (Math.random() - 0.5) * 40,
                    vy: -ty * (150 + Math.random() * 80) + (Math.random() - 0.5) * 40,
                    alpha: 1.0,
                    size: 2 + Math.random() * 3
                });
            }

            if (this.probe.deltaVRemaining <= 0) {
                this.setThrust(false);
            }
        }

        // 4. Integrate Velocity and Position (Velocity Verlet)
        this.probe.vx += ax * dt;
        this.probe.vy += ay * dt;
        this.probe.x += this.probe.vx * dt;
        this.probe.y += this.probe.vy * dt;

        // Record speed
        const speed = Math.sqrt(this.probe.vx * this.probe.vx + this.probe.vy * this.probe.vy);
        if (speed > this.maxSpeedRecorded) {
            this.maxSpeedRecorded = speed;
        }

        // Gravity assist speed boost audio trigger
        if (speed > 450 && !this.hasSlingshotted) {
            this.hasSlingshotted = true;
            window.slingshotAudio.playSlingshotChime(speed / 500);
        }

        // Orbital breadcrumb history trail
        if (Math.random() < 0.2) {
            this.orbitalHistory.push({ x: this.probe.x, y: this.probe.y, alpha: 0.6 });
            if (this.orbitalHistory.length > 250) this.orbitalHistory.shift();
        }

        // Update exhaust particles
        for (let i = this.exhaustParticles.length - 1; i >= 0; i--) {
            const ep = this.exhaustParticles[i];
            ep.x += ep.vx * dt;
            ep.y += ep.vy * dt;
            ep.alpha -= dt * 3.5;
            if (ep.alpha <= 0) this.exhaustParticles.splice(i, 1);
        }
    }

    // Forward Trajectory Conic / N-Body Predictor (160 steps forward)
    calculateTrajectoryPrediction() {
        this.trajectoryPoints = [];
        let simX = this.probe.x;
        let simY = this.probe.y;
        let simVx = this.probe.vx;
        let simVy = this.probe.vy;
        const simDt = 0.05;

        for (let step = 0; step < 160; step++) {
            let tax = 0;
            let tay = 0;

            for (const b of this.celestialBodies) {
                const dx = b.x - simX;
                const dy = b.y - simY;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                if (dist < b.radius) {
                    this.trajectoryPoints.push({ x: simX, y: simY, impact: true });
                    return;
                }

                const force = b.mass / Math.max(distSq, 100);
                tax += (dx / dist) * force;
                tay += (dy / dist) * force;
            }

            simVx += tax * simDt;
            simVy += tay * simDt;
            simX += simVx * simDt;
            simY += simVy * simDt;

            this.trajectoryPoints.push({ x: simX, y: simY, impact: false });
        }
    }

    checkMissionObjectives(dtSec) {
        const crit = this.currentMission.targetCriteria;
        const speed = Math.sqrt(this.probe.vx * this.probe.vx + this.probe.vy * this.probe.vy);

        let isMeetingTarget = false;

        // Case 1: Distance to Target Body (Moon, Mars, Saturn, Comet, Oumuamua)
        if (crit.targetBody) {
            const target = this.celestialBodies.find(b => b.id === crit.targetBody);
            if (target) {
                const dist = Math.hypot(target.x - this.probe.x, target.y - this.probe.y);
                if (dist <= crit.maxDistanceToTarget) {
                    if (crit.maxRelativeVelocity) {
                        const relVx = this.probe.vx - (target.vx || 0);
                        const relVy = this.probe.vy - (target.vy || 0);
                        const relSpeed = Math.hypot(relVx, relVy);
                        if (relSpeed <= crit.maxRelativeVelocity) isMeetingTarget = true;
                    } else {
                        isMeetingTarget = true;
                    }
                }
            }
        }

        // Case 2: Speed Threshold Achieved (Oberth, Relativistic Pulsar, Black Hole)
        if (crit.minSpeedAchieved && speed >= crit.minSpeedAchieved) {
            isMeetingTarget = true;
        }

        // Case 3: Circular Orbit Periapsis (LEO)
        if (crit.minPeriapsis) {
            const earth = this.celestialBodies.find(b => b.id === 'earth');
            if (earth) {
                const dist = Math.hypot(earth.x - this.probe.x, earth.y - this.probe.y);
                if (dist >= crit.minPeriapsis && dist <= 240 && speed > 180 && speed < 280) {
                    isMeetingTarget = true;
                }
            }
        }

        if (isMeetingTarget) {
            this.stableTimerSec += dtSec;
            if (this.stableTimerSec >= crit.durationStableSec) {
                this.triggerVictory();
            }
        } else {
            this.stableTimerSec = Math.max(0, this.stableTimerSec - dtSec * 0.5);
        }
    }

    triggerCrash(reason) {
        this.isCrashed = true;
        this.setThrust(false);
        window.slingshotAudio.playImpact();
    }

    triggerVictory() {
        this.isMissionComplete = true;
        this.setThrust(false);
        window.slingshotAudio.playMissionSuccess();
    }

    // Render Canvas Scene
    render() {
        if (!this.canvas || !this.ctx) return;
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.fillStyle = "#03060c";
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        // Camera Center Transform
        ctx.translate(width * 0.5, height * 0.5);
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(-this.camera.x, -this.camera.y);

        // Draw Deep Space Starfield & Coordinate Grid
        ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
        ctx.lineWidth = 1;
        const gridSize = 150;
        for (let x = -2000; x <= 2000; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, -2000); ctx.lineTo(x, 2000); ctx.stroke();
        }
        for (let y = -2000; y <= 2000; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(-2000, y); ctx.lineTo(2000, y); ctx.stroke();
        }

        // Draw Celestial Bodies Orbit Guide Rings
        this.celestialBodies.forEach(b => {
            if (b.orbitRadius) {
                ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.arc(0, 0, b.orbitRadius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        });

        // Draw Orbital Breadcrumb History
        this.orbitalHistory.forEach(pt => {
            ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw Forward Trajectory Prediction Ray
        ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        let started = false;
        for (const pt of this.trajectoryPoints) {
            if (!started) {
                ctx.moveTo(pt.x, pt.y);
                started = true;
            } else {
                ctx.lineTo(pt.x, pt.y);
            }
            if (pt.impact) {
                // Red impact cross
                ctx.stroke();
                ctx.fillStyle = "#f43f5e";
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Celestial Bodies
        this.celestialBodies.forEach(b => {
            // Glow
            const grad = ctx.createRadialGradient(b.x, b.y, b.radius * 0.5, b.x, b.y, b.radius * 2.2);
            grad.addColorStop(0, b.color);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius * 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Sphere
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();

            // Name Label
            ctx.fillStyle = "#cbd5e1";
            ctx.font = "bold 11px 'JetBrains Mono', monospace";
            ctx.textAlign = "center";
            ctx.fillText(b.name.toUpperCase(), b.x, b.y + b.radius + 16);
        });

        // Draw Exhaust Particles
        this.exhaustParticles.forEach(ep => {
            ctx.save();
            ctx.fillStyle = "rgba(251, 146, 60, " + ep.alpha + ")";
            ctx.beginPath();
            ctx.arc(ep.x, ep.y, ep.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Draw Spacecraft Probe
        if (this.probe) {
            ctx.save();
            ctx.translate(this.probe.x, this.probe.y);
            ctx.rotate(this.probe.angle);

            // Probe Triangle Geometry
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(-8, -7);
            ctx.lineTo(-4, 0);
            ctx.lineTo(-8, 7);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Thrust flame when burning
            if (this.isThrusting) {
                ctx.fillStyle = "#f59e0b";
                ctx.beginPath();
                ctx.moveTo(-6, -4);
                ctx.lineTo(-18 - Math.random() * 8, 0);
                ctx.lineTo(-6, 4);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        }

        ctx.restore();
    }
}

window.slingshotEngine = new SlingshotEngine();
