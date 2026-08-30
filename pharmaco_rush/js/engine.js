/**
 * PHARMACO-RUSH: Physiology & Pharmacodynamic Engine (PK/PD Simulation)
 * Real-time differential ODE solvers for hemodynamics, active drug binding kinetics, and canvas EKG oscilloscopes.
 */

class PharmaEngine {
    constructor() {
        this.patient = null;
        this.activeDrugs = []; // { drugId, dose, unit, route, initialDose, timeRemaining, maxDuration, effectCoeff }
        this.historyLogs = [];
        this.ekgPoints = [];
        this.ekgSweepX = 0;
        this.canvas = null;
        this.ctx = null;
        this.lastFrameTime = performance.now();
        this.lastHeartbeatTime = 0;
        this.isDefibCharging = false;
        this.isDefibReady = false;
        this.isStabilized = false;
        this.isDead = false;
    }

    loadCase(caseData) {
        this.patient = {
            id: caseData.id,
            name: caseData.patient.name,
            title: caseData.title,
            badge: caseData.badge,
            difficulty: caseData.difficulty,
            presentation: caseData.patient.presentation,
            lungs: caseData.patient.lungs,
            pupils: caseData.patient.pupils,
            toxidrome: caseData.patient.toxidrome,
            rhythm: caseData.patient.rhythm,
            rhythmName: caseData.patient.rhythmName,
            debrief: caseData.debrief,
            correctDrugs: caseData.correctDrugs,
            lethalMistakes: caseData.lethalMistakes,
            targetVitals: caseData.targetVitals,

            // Live state variables
            hr: caseData.patient.vitals.hr,
            sbp: caseData.patient.vitals.sbp,
            dbp: caseData.patient.vitals.dbp,
            spo2: caseData.patient.vitals.spo2,
            glucose: caseData.patient.vitals.glucose,
            rr: caseData.patient.vitals.rr,
            temp: caseData.patient.vitals.temp,

            // Baseline targets for stability assessment
            baselineHr: caseData.patient.vitals.hr,
            baselineSbp: caseData.patient.vitals.sbp,
            baselineSpo2: caseData.patient.vitals.spo2,
            baselineGlucose: caseData.patient.vitals.glucose,
            
            // Physiological counters
            timeInCriticalShockSec: 0,
            stabilityProgress: 0 // 0 to 100%
        };

        this.activeDrugs = [];
        this.historyLogs = [
            { time: "00:00", text: `Emergency Triage initiated: ${this.patient.presentation}`, type: "system" }
        ];
        this.isStabilized = false;
        this.isDead = false;
        this.isDefibCharging = false;
        this.isDefibReady = false;
        this.ekgSweepX = 0;
        this.ekgPoints = [];
    }

    bindCanvas(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
    }

    // Administer a drug or electrical intervention
    administerDrug(drugId, dose, route) {
        if (this.isDead || this.isStabilized) return { success: false, reason: "Case ended" };

        const drug = window.PHARMA_DATA.drugs.find(d => d.id === drugId);
        if (!drug) return { success: false, reason: "Unknown drug" };

        // Play SFX
        if (drug.id === 'defibrillation') {
            window.pharmaAudio.playDefibShock();
        } else if (drug.id === 'synchronized_cardioversion') {
            window.pharmaAudio.playDefibShock();
        } else {
            window.pharmaAudio.playDrugAdminister();
        }

        // Check if this was a lethal contraindicated mistake
        const isMistake = this.patient.lethalMistakes.includes(drug.id);
        const isCorrect = this.patient.correctDrugs.includes(drug.id);

        const activeEntry = {
            id: drug.id,
            name: drug.name,
            dose: dose,
            unit: drug.unit,
            route: route,
            timeRemaining: drug.halfLifeSec * 1.5,
            maxDuration: drug.halfLifeSec * 1.5,
            halfLifeSec: drug.halfLifeSec,
            effects: drug.effects,
            receptors: drug.receptors,
            isMistake: isMistake,
            isCorrect: isCorrect
        };

        this.activeDrugs.push(activeEntry);

        // Immediate Log
        const logMsg = `Administered ${drug.name} [${dose} ${drug.unit}] via ${route}`;
        this.logEvent(logMsg, isMistake ? "danger" : isCorrect ? "success" : "info");

        // Immediate Intervention Mechanics
        this.processImmediateIntervention(drug, dose, route, isMistake);

        return { success: true, drug: drug, isMistake: isMistake, isCorrect: isCorrect };
    }

    logEvent(text, type = "info") {
        const now = new Date();
        const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        this.historyLogs.unshift({ time: timeStr, text: text, type: type });
        if (this.historyLogs.length > 30) this.historyLogs.pop();
    }

    processImmediateIntervention(drug, dose, route, isMistake) {
        // Shock in V-Fib / pVT
        if (drug.id === 'defibrillation') {
            if (this.patient.rhythm === 'vfib' || this.patient.rhythm === 'vtach') {
                this.logEvent("⚡ 200J BIPHASIC SHOCK DELIVERED! Myocardium depolarized.", "success");
                // 85% chance to convert to Sinus Rhythm if shockable
                this.patient.rhythm = 'sinus_tachycardia';
                this.patient.rhythmName = "Sinus Tachycardia (Post-Shock)";
                this.patient.hr = 110;
                this.patient.sbp = 90;
                this.patient.dbp = 55;
                this.patient.spo2 = 88;
                this.logEvent("Pulse restored! ROSC (Return of Spontaneous Circulation) achieved!", "success");
            } else {
                this.logEvent("⚠️ INAPPROPRIATE SHOCK: Defibrillated a non-shockable rhythm! Risk of myocardial stunning!", "danger");
                this.patient.sbp -= 20;
            }
        }

        // Synchronized Cardioversion for Unstable SVT/VT with pulse
        if (drug.id === 'synchronized_cardioversion') {
            if (this.patient.rhythm === 'vtach' || this.patient.rhythm === 'svt') {
                this.logEvent("🫀 R-Wave Synced Cardioversion fired successfully on QRS peak!", "success");
                this.patient.rhythm = 'normal_sinus';
                this.patient.rhythmName = "Normal Sinus Rhythm (78 bpm)";
                this.patient.hr = 78;
                this.patient.sbp = 118;
                this.patient.dbp = 74;
                this.patient.spo2 = 97;
            }
        }

        // Adenosine Rapid Push (Temporary Asystole -> Reset)
        if (drug.id === 'adenosine') {
            if (this.patient.rhythm === 'svt') {
                this.logEvent("⏱️ Adenosine produced transient AV nodal conduction block (3s Asystole)...", "info");
                setTimeout(() => {
                    if (this.patient && !this.isDead) {
                        this.patient.rhythm = 'normal_sinus';
                        this.patient.rhythmName = "Normal Sinus Rhythm (75 bpm)";
                        this.patient.hr = 75;
                        this.patient.sbp = 116;
                        this.patient.dbp = 72;
                        this.logEvent("✨ Conversion achieved! SA Node resumed sinus rhythm.", "success");
                    }
                }, 2500);
            }
        }

        // Calcium Gluconate in Hyperkalemia
        if (drug.id === 'calcium_gluconate') {
            if (this.patient.rhythm === 'hyperkalemia_peaked') {
                this.logEvent("⚡ Calcium Gluconate stabilized cardiomyocyte resting threshold potential.", "success");
                this.patient.rhythm = 'sinus_tachycardia';
                this.patient.rhythmName = "Sinus Rhythm with normalized QRS";
            }
        }

        // Sodium Bicarbonate in TCA Wide-Complex
        if (drug.id === 'sodium_bicarbonate') {
            if (this.patient.rhythm === 'tca_wide_complex') {
                this.logEvent("🧪 Serum alkalinization unbound TCA from cardiac fast Na+ channels. QRS narrowed!", "success");
                this.patient.rhythm = 'sinus_tachycardia';
                this.patient.rhythmName = "Sinus Tachycardia (QRS < 100ms)";
            }
        }

        // Lethal Mistake penalty
        if (isMistake) {
            this.patient.sbp = Math.max(0, this.patient.sbp - 35);
            this.patient.spo2 = Math.max(0, this.patient.spo2 - 25);
            this.patient.hr = Math.max(0, this.patient.hr - 30);
            this.logEvent(`🚨 CRITICAL ERROR: ${drug.name} is contraindicated in this condition! Severe hemodynamic collapse!`, "danger");
            window.pharmaAudio.playCodeBlueAlarm();
        }
    }

    // Step the physics / physiological differential equations
    update(dtSec) {
        if (!this.patient || this.isDead || this.isStabilized) return;

        // 1. Process active pharmacokinetics (half-life clearance)
        let deltaHr = 0;
        let deltaMap = 0;
        let deltaSpo2 = 0;
        let deltaGlucose = 0;
        let deltaRr = 0;

        for (let i = this.activeDrugs.length - 1; i >= 0; i--) {
            const entry = this.activeDrugs[i];
            entry.timeRemaining -= dtSec;

            // Exponential decay concentration curve
            const concentrationFraction = Math.max(0, entry.timeRemaining / entry.maxDuration);
            const eff = entry.effects;

            if (eff.hr) deltaHr += (eff.hr * concentrationFraction * (entry.dose / (entry.effects.typicalDose || 1))) * 0.08 * dtSec;
            if (eff.map) deltaMap += (eff.map * concentrationFraction) * 0.12 * dtSec;
            if (eff.spo2) deltaSpo2 += (eff.spo2 * concentrationFraction) * 0.15 * dtSec;
            if (eff.glucose) deltaGlucose += (eff.glucose * concentrationFraction) * 0.25 * dtSec;
            if (eff.rr) deltaRr += (eff.rr * concentrationFraction) * 0.15 * dtSec;

            if (entry.timeRemaining <= 0) {
                this.activeDrugs.splice(i, 1);
            }
        }

        // 2. Apply delta changes
        this.patient.hr = Math.max(0, Math.min(260, this.patient.hr + deltaHr));
        this.patient.sbp = Math.max(0, Math.min(280, this.patient.sbp + deltaMap * 1.3));
        this.patient.dbp = Math.max(0, Math.min(160, this.patient.dbp + deltaMap * 0.7));
        this.patient.spo2 = Math.max(0, Math.min(100, this.patient.spo2 + deltaSpo2));
        this.patient.glucose = Math.max(10, Math.min(600, this.patient.glucose + deltaGlucose));
        this.patient.rr = Math.max(0, Math.min(45, this.patient.rr + deltaRr));

        // 3. Assess Patient Viability / Death Checks
        if (this.patient.sbp <= 20 || this.patient.spo2 <= 30 || (this.patient.hr <= 15 && this.patient.rhythm !== 'asystole')) {
            this.patient.timeInCriticalShockSec += dtSec;
            if (this.patient.timeInCriticalShockSec > 12) {
                this.triggerDeath("Irreversible hypoxic/cardiogenic shock & multi-organ failure.");
                return;
            }
        } else {
            this.patient.timeInCriticalShockSec = Math.max(0, this.patient.timeInCriticalShockSec - dtSec * 0.5);
        }

        // 4. Assess Stabilization Targets
        const targets = this.patient.targetVitals;
        let isPassingAll = true;

        if (targets.sbpMin && this.patient.sbp < targets.sbpMin) isPassingAll = false;
        if (targets.sbpMax && this.patient.sbp > targets.sbpMax) isPassingAll = false;
        if (targets.spo2Min && this.patient.spo2 < targets.spo2Min) isPassingAll = false;
        if (targets.hrMin && this.patient.hr < targets.hrMin) isPassingAll = false;
        if (targets.hrMax && this.patient.hr > targets.hrMax) isPassingAll = false;
        if (targets.glucoseMin && this.patient.glucose < targets.glucoseMin) isPassingAll = false;
        if (targets.glucoseMax && this.patient.glucose > targets.glucoseMax) isPassingAll = false;
        if (targets.rrMin && this.patient.rr < targets.rrMin) isPassingAll = false;

        // Check that lethal rhythms are converted
        if (['vfib', 'vtach', 'asystole'].includes(this.patient.rhythm)) {
            isPassingAll = false;
        }

        if (isPassingAll) {
            this.patient.stabilityProgress = Math.min(100, this.patient.stabilityProgress + dtSec * 22);
            if (this.patient.stabilityProgress >= 100) {
                this.triggerStabilization();
            }
        } else {
            this.patient.stabilityProgress = Math.max(0, this.patient.stabilityProgress - dtSec * 15);
        }

        // 5. Trigger Sound Beeps synced with real HR
        const now = performance.now();
        if (this.patient.hr > 20 && !this.isDead) {
            const beatIntervalMs = (60 / this.patient.hr) * 1000;
            if (now - this.lastHeartbeatTime >= beatIntervalMs) {
                this.lastHeartbeatTime = now;
                window.pharmaAudio.playQRSBeep(this.patient.hr, this.patient.rhythm);
            }
        }
    }

    triggerDeath(reason) {
        this.isDead = true;
        this.patient.hr = 0;
        this.patient.sbp = 0;
        this.patient.dbp = 0;
        this.patient.spo2 = 0;
        this.patient.rhythm = 'asystole';
        this.patient.rhythmName = "Asystole (Flatline)";
        this.logEvent(`💀 PATIENT LOST: ${reason}`, "danger");
        window.pharmaAudio.startFlatline();
    }

    triggerStabilization() {
        this.isStabilized = true;
        this.logEvent(`🎉 PATIENT STABILIZED! Normal perfusion and homeostasis restored.`, "success");
        window.pharmaAudio.playSuccessFanfare();
    }

    // Render ECG Lead II Waveform onto Canvas with glowing phosphor trail
    renderEKG() {
        if (!this.canvas || !this.ctx) return;
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const midY = height * 0.55;

        // Draw glowing sweep line erase
        ctx.fillStyle = "rgba(11, 15, 25, 0.12)";
        ctx.fillRect(0, 0, width, height);

        // Medical EKG grid
        ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
        ctx.lineWidth = 1;
        const gridSize = 20;
        ctx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
            ctx.moveTo(x, 0); ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.moveTo(0, y); ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Calculate Y value at current phase for rhythm
        const time = performance.now() * 0.001;
        const hr = this.patient ? this.patient.hr : 75;
        const rhythm = this.patient ? this.patient.rhythm : 'normal_sinus';

        let yOffset = 0;

        if (this.isDead || hr === 0 || rhythm === 'asystole') {
            // Flatline with slight wandering noise
            yOffset = (Math.random() - 0.5) * 2.5;
        } else if (rhythm === 'vfib') {
            // Chaotic coarse ventricular fibrillation
            yOffset = Math.sin(time * 28) * 35 + Math.sin(time * 19) * 22 + (Math.random() - 0.5) * 18;
        } else if (rhythm === 'vtach') {
            // Wide-complex regular saw-tooth
            const phase = (time * (hr / 60) * Math.PI * 2) % (Math.PI * 2);
            yOffset = -Math.sin(phase) * 55;
        } else {
            // Standard P-Q-R-S-T wave generation
            const beatPeriod = 60 / Math.max(30, hr);
            const cyclePhase = (time % beatPeriod) / beatPeriod; // 0 to 1

            if (cyclePhase < 0.12) {
                // Baseline
                yOffset = 0;
            } else if (cyclePhase < 0.22) {
                // P Wave (Atrial Depolarization)
                const pFrac = (cyclePhase - 0.12) / 0.10;
                yOffset = -Math.sin(pFrac * Math.PI) * (rhythm === 'svt' ? 0 : 10);
            } else if (cyclePhase < 0.28) {
                // PR Interval
                yOffset = 0;
            } else if (cyclePhase < 0.32) {
                // Q Dip
                yOffset = 6;
            } else if (cyclePhase < 0.38) {
                // R Peak (Ventricular Depolarization Spike)
                const rFrac = (cyclePhase - 0.32) / 0.06;
                yOffset = -Math.sin(rFrac * Math.PI) * 75;
            } else if (cyclePhase < 0.44) {
                // S Dip
                yOffset = 14;
            } else if (cyclePhase < 0.52) {
                // ST Segment
                yOffset = 0;
            } else if (cyclePhase < 0.72) {
                // T Wave (Ventricular Repolarization)
                const tFrac = (cyclePhase - 0.52) / 0.20;
                // Peaked T wave for hyperkalemia
                const tAmp = rhythm === 'hyperkalemia_peaked' ? 45 : 18;
                yOffset = -Math.sin(tFrac * Math.PI) * tAmp;
            } else {
                yOffset = 0;
            }
        }

        // Advance sweep
        this.ekgSweepX = (this.ekgSweepX + 3) % width;
        const currentY = midY + yOffset;

        // Clear beam head
        ctx.fillStyle = "#080b10";
        ctx.fillRect(this.ekgSweepX, 0, 18, height);

        // Store and draw points
        this.ekgPoints[this.ekgSweepX] = currentY;

        ctx.strokeStyle = this.isDead ? "#ef4444" : (rhythm === 'vfib' || rhythm === 'vtach') ? "#f59e0b" : "#10b981";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        let started = false;
        for (let x = 0; x < width; x++) {
            if (this.ekgPoints[x] !== undefined) {
                if (Math.abs(x - this.ekgSweepX) < 18) {
                    started = false; // Gap around sweep beam
                    continue;
                }
                if (!started) {
                    ctx.moveTo(x, this.ekgPoints[x]);
                    started = true;
                } else {
                    ctx.lineTo(x, this.ekgPoints[x]);
                }
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
    }
}

window.pharmaEngine = new PharmaEngine();
