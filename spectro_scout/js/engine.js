/**
 * SPECTRO-SCOUT: Spectroscopic Analysis & Doppler Solver Engine
 * Wavelength-to-RGB Conversion, Photon Transmission Curves, Doppler Shifting, and Chemical Correlation.
 */

class SpectroEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentSystem = null;
        this.userDopplerKmS = 0; // -150 to +150 km/s
        this.selectedChemicals = new Set(); // User-toggled chemical identifications
        this.isDopplerLocked = false;
        this.isSurveyComplete = false;
        this.noiseTime = 0;
    }

    bindCanvas(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
    }

    loadSystem(systemData) {
        this.currentSystem = systemData;
        this.userDopplerKmS = 0;
        this.selectedChemicals.clear();
        this.isDopplerLocked = false;
        this.isSurveyComplete = false;
    }

    // Set Doppler Compensation Velocity
    setDopplerShift(kmS) {
        this.userDopplerKmS = Math.max(-150, Math.min(150, kmS));
        window.spectroAudio.playDopplerSweep(this.userDopplerKmS);

        // Check if Doppler is aligned within tolerance (±4 km/s)
        const error = Math.abs(this.userDopplerKmS - this.currentSystem.targetDopplerKmS);
        if (error <= 4 && !this.isDopplerLocked) {
            this.isDopplerLocked = true;
            window.spectroAudio.playChemicalLock();
        } else if (error > 6) {
            this.isDopplerLocked = false;
        }

        this.checkSurveyCompletion();
    }

    // Toggle Chemical Molecule Identification
    toggleChemical(chemId) {
        if (this.selectedChemicals.has(chemId)) {
            this.selectedChemicals.delete(chemId);
        } else {
            this.selectedChemicals.add(chemId);
            window.spectroAudio.playChemicalLock();
        }
        this.checkSurveyCompletion();
    }

    // Check if user correctly identified all true molecules while aligned
    checkSurveyCompletion() {
        if (!this.currentSystem || this.isSurveyComplete) return;

        if (!this.isDopplerLocked) return;

        const trueChems = this.currentSystem.trueChemicals;
        const allCorrect = trueChems.every(c => this.selectedChemicals.has(c));
        const noExtras = Array.from(this.selectedChemicals).every(c => trueChems.includes(c));

        if (allCorrect && noExtras && this.selectedChemicals.size > 0) {
            this.isSurveyComplete = true;
            window.spectroAudio.playBiosignatureFanfare();
        }
    }

    // Convert Wavelength (nm) to RGB Hex/String (380nm UV to 950nm IR)
    wavelengthToRGB(wl) {
        let r = 0, g = 0, b = 0;

        if (wl >= 380 && wl < 440) {
            r = -(wl - 440) / (440 - 380);
            g = 0.0;
            b = 1.0;
        } else if (wl >= 440 && wl < 490) {
            r = 0.0;
            g = (wl - 440) / (490 - 440);
            b = 1.0;
        } else if (wl >= 490 && wl < 510) {
            r = 0.0;
            g = 1.0;
            b = -(wl - 510) / (510 - 490);
        } else if (wl >= 510 && wl < 580) {
            r = (wl - 510) / (580 - 510);
            g = 1.0;
            b = 0.0;
        } else if (wl >= 580 && wl < 645) {
            r = 1.0;
            g = -(wl - 645) / (645 - 580);
            b = 0.0;
        } else if (wl >= 645 && wl <= 780) {
            r = 1.0;
            g = 0.0;
            b = 0.0;
        } else {
            // Near Infrared (780 - 950nm) represented as deep ruby/crimson fade
            const irFrac = Math.max(0, 1.0 - (wl - 780) / 170);
            r = 0.7 * irFrac;
            g = 0.1 * irFrac;
            b = 0.3 * irFrac;
        }

        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }

    // Render Continuous Spectrum and Absorption Dips
    render() {
        if (!this.canvas || !this.ctx || !this.currentSystem) return;
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.noiseTime += 0.02;

        ctx.fillStyle = "#04060a";
        ctx.fillRect(0, 0, width, height);

        const spectrumY = 25;
        const spectrumHeight = 85;
        const curveY = 145;
        const curveHeight = 160;

        const minWl = 380;
        const maxWl = 950;
        const wlRange = maxWl - minWl;

        // Compute effective Doppler offset (Target - User dialed compensation)
        const residualDoppler = this.currentSystem.targetDopplerKmS - this.userDopplerKmS;
        // Doppler factor: lambda_obs = lambda_0 * (1 + v/c), c ~ 300,000 km/s
        const dopplerMultiplier = 1 + (residualDoppler / 3000); // scaled for clear visible playability

        // 1. Draw Spectrum Bar
        for (let x = 0; x < width; x++) {
            const fraction = x / width;
            const wl = minWl + fraction * wlRange;
            ctx.fillStyle = this.wavelengthToRGB(wl);
            ctx.fillRect(x, spectrumY, 1, spectrumHeight);
        }

        // 2. Compute Photon Transmission Flux Curve across Wavelengths
        const fluxPoints = [];
        const activeTrueLines = [];

        this.currentSystem.trueChemicals.forEach(chemId => {
            const template = window.SPECTRO_DATA.chemicalTemplates.find(t => t.id === chemId);
            if (template) {
                template.lines.forEach(lineWl => {
                    activeTrueLines.push({
                        wl: lineWl * dopplerMultiplier,
                        color: template.color,
                        name: template.name
                    });
                });
            }
        });

        for (let x = 0; x < width; x++) {
            const fraction = x / width;
            const currentWl = minWl + fraction * wlRange;

            // Baseline 100% transmission with telescope sensor noise
            let transmission = 0.88 + Math.sin(x * 0.08 + this.noiseTime) * 0.015;

            // Subtract absorption dips
            for (const line of activeTrueLines) {
                const dist = Math.abs(currentWl - line.wl);
                if (dist < 18) {
                    const dip = (1 - dist / 18) * 0.65;
                    transmission -= dip;
                }
            }

            transmission = Math.max(0.1, Math.min(1.0, transmission));
            fluxPoints.push({ x: x, y: curveY + (1 - transmission) * curveHeight, trans: transmission });
        }

        // Draw Dark Absorption Lines onto Rainbow Bar
        activeTrueLines.forEach(line => {
            const lineX = ((line.wl - minWl) / wlRange) * width;
            if (lineX >= 0 && lineX <= width) {
                // Dark Fraunhofer shadow line
                ctx.fillStyle = "rgba(4, 6, 10, 0.92)";
                ctx.fillRect(lineX - 2, spectrumY, 4, spectrumHeight);
            }
        });

        // 3. Draw Transmission Curve Graph Grid
        ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
        ctx.lineWidth = 1;
        for (let y = curveY; y <= curveY + curveHeight; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // Draw Transmission Flux Curve Line
        ctx.strokeStyle = this.isDopplerLocked ? "#38bdf8" : "#f59e0b";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        fluxPoints.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // 4. Draw Overlay Chemical Markers for User-Toggled Molecules
        this.selectedChemicals.forEach(chemId => {
            const template = window.SPECTRO_DATA.chemicalTemplates.find(t => t.id === chemId);
            if (template) {
                template.lines.forEach(lineWl => {
                    const restX = ((lineWl - minWl) / wlRange) * width;
                    if (restX >= 0 && restX <= width) {
                        ctx.strokeStyle = template.color;
                        ctx.lineWidth = 2;
                        ctx.setLineDash([4, 4]);
                        ctx.beginPath();
                        ctx.moveTo(restX, spectrumY);
                        ctx.lineTo(restX, curveY + curveHeight);
                        ctx.stroke();
                        ctx.setLineDash([]);

                        // Top marker arrow
                        ctx.fillStyle = template.color;
                        ctx.beginPath();
                        ctx.moveTo(restX, spectrumY - 2);
                        ctx.lineTo(restX - 4, spectrumY - 8);
                        ctx.lineTo(restX + 4, spectrumY - 8);
                        ctx.closePath();
                        ctx.fill();
                    }
                });
            }
        });

        // Wavelength scale labels (nm)
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText("380 nm (UV)", 6, spectrumY - 6);
        ctx.fillText("550 nm (Visible Green)", width * 0.32, spectrumY - 6);
        ctx.fillText("700 nm (Red)", width * 0.62, spectrumY - 6);
        ctx.fillText("950 nm (Near-IR)", width - 95, spectrumY - 6);
    }
}

window.spectroEngine = new SpectroEngine();
