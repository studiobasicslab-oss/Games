/**
 * Celestial Projection & Canvas Rendering Engine
 * Handles 3D spherical trigonometry, stereographic projection, star rendering,
 * diffraction spikes, interactive star-linking, pointer ray-casting,
 * stardust particle dynamics, and mythological art overlays.
 */

import { SPECTRAL_COLORS, DEEP_SKY_OBJECTS } from './stars_data.js';

export class CelestialEngine {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.onStarClick = options.onStarClick || null;
        this.onStarConnect = options.onStarConnect || null;
        this.onPointerLock = options.onPointerLock || null;

        // Viewport & Projection State
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dpr = window.devicePixelRatio || 1;

        this.viewCenterRA = 11.0; // hours (0-24)
        this.viewCenterDec = 55.0; // degrees (-90 to +90)
        this.targetRA = 11.0;
        this.targetDec = 55.0;
        this.zoom = 1.0; // field of view factor
        this.targetZoom = 1.0;
        this.rotationAngle = 0; // Astrolabe rotation

        // Visual Toggles
        this.showArtwork = true;
        this.showLabels = true;
        this.showSpectralColors = true;
        this.showLightYearParallax = false;
        this.showDeepSky = true;
        this.showPointerGuide = true;
        this.showAzimuthGrid = true;
        this.activeCulture = 'greek';

        // Interactive Linking State
        this.allStars = []; // Flattened star catalog
        this.constellations = [];
        this.activeConstellation = null;
        this.connectedEdges = new Set(); // Strings "starA-starB"
        this.dragStartStar = null;
        this.mousePos = { x: 0, y: 0 };
        this.isDragging = false;
        this.isPanning = false;
        this.panStart = { x: 0, y: 0 };

        // Pointer Wayfinding State
        this.pointerRayActive = false;
        this.pointerProgress = 0;
        this.pointerLocked = false;
        this.customLines = []; // User sandbox lines

        // Particles & Animations
        this.particles = [];
        this.backgroundStars = [];
        this.time = 0;

        this.initBackgroundStars();
        this.bindEvents();
        this.resize();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width || window.innerWidth;
        this.height = rect.height || window.innerHeight;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    initBackgroundStars() {
        this.backgroundStars = [];
        const count = 1200;
        for (let i = 0; i < count; i++) {
            this.backgroundStars.push({
                ra: Math.random() * 24,
                dec: (Math.random() - 0.5) * 180,
                mag: 3.5 + Math.random() * 3.5,
                twinkleSpeed: 0.02 + Math.random() * 0.05,
                twinklePhase: Math.random() * Math.PI * 2,
                color: ['#bbccff', '#ffffff', '#fff4e8', '#ffd2a1'][Math.floor(Math.random() * 4)]
            });
        }
    }

    setConstellations(constellationList) {
        this.constellations = constellationList;
        // Build unified star list
        const starMap = new Map();
        constellationList.forEach(c => {
            c.stars.forEach(s => {
                if (!starMap.has(s.id)) {
                    starMap.set(s.id, { ...s, constellationId: c.id });
                }
            });
        });
        this.allStars = Array.from(starMap.values());
    }

    focusOnConstellation(cId, smooth = true) {
        const c = this.constellations.find(item => item.id === cId);
        if (!c) return;
        this.activeConstellation = c;
        if (smooth) {
            this.targetRA = c.centerRA;
            this.targetDec = c.centerDec;
            this.targetZoom = c.difficulty >= 3 ? 1.15 : 0.95;
        } else {
            this.viewCenterRA = c.centerRA;
            this.viewCenterDec = c.centerDec;
            this.zoom = c.difficulty >= 3 ? 1.15 : 0.95;
            this.targetRA = this.viewCenterRA;
            this.targetDec = this.viewCenterDec;
            this.targetZoom = this.zoom;
        }
    }

    // Convert celestial coordinates (RA in hours 0-24, Dec in degrees -90..+90) to Screen Coordinates (x, y)
    projectToScreen(ra, dec, distLy = 100) {
        // Center RA/Dec difference
        let dRA = (ra - this.viewCenterRA) * 15; // convert hours to degrees (15 deg/hr)
        // Wrap delta RA across 360 degrees
        while (dRA > 180) dRA -= 360;
        while (dRA < -180) dRA += 360;

        const dDec = dec - this.viewCenterDec;

        // Spherical trigonometry projection
        const raRad = (dRA * Math.PI) / 180;
        const decRad = (dDec * Math.PI) / 180;
        const centerDecRad = (this.viewCenterDec * Math.PI) / 180;
        const starDecRad = (dec * Math.PI) / 180;

        // Orthographic/Gnomonic celestial sphere transform
        const cosC = Math.sin(centerDecRad) * Math.sin(starDecRad) +
                     Math.cos(centerDecRad) * Math.cos(starDecRad) * Math.cos(raRad);

        // Behind the horizon of current celestial sphere field
        if (cosC < 0.05) {
            return { x: -9999, y: -9999, visible: false, scale: 0 };
        }

        const k = 1 / (1 + cosC); // stereographic factor
        const rawX = k * Math.cos(starDecRad) * Math.sin(raRad);
        const rawY = k * (Math.cos(centerDecRad) * Math.sin(starDecRad) - Math.sin(centerDecRad) * Math.cos(starDecRad) * Math.cos(raRad));

        // Apply scale & astrolabe rotation
        const scale = Math.min(this.width, this.height) * 0.75 * this.zoom;
        
        let screenX = -rawX * scale; // Invert X for true sky map orientation (East on Left when looking up)
        let screenY = -rawY * scale;

        // Apply Light-Year 3D depth shift if active
        if (this.showLightYearParallax) {
            const depthFactor = Math.log10(Math.max(1, distLy)) * 12;
            screenX += Math.sin(this.time * 0.001) * depthFactor;
            screenY += Math.cos(this.time * 0.001) * (depthFactor * 0.5);
        }

        // Rotate around screen center
        const rotRad = (this.rotationAngle * Math.PI) / 180;
        const rotX = screenX * Math.cos(rotRad) - screenY * Math.sin(rotRad);
        const rotY = screenX * Math.sin(rotRad) + screenY * Math.cos(rotRad);

        return {
            x: this.width / 2 + rotX,
            y: this.height / 2 + rotY,
            visible: true,
            depth: cosC
        };
    }

    // Convert Screen (x, y) back to RA / Dec for custom point & star creation
    screenToSky(screenX, screenY) {
        const cx = screenX - this.width / 2;
        const cy = screenY - this.height / 2;
        const rotRad = (-this.rotationAngle * Math.PI) / 180;
        const unrotX = cx * Math.cos(rotRad) - cy * Math.sin(rotRad);
        const unrotY = cx * Math.sin(rotRad) + cy * Math.cos(rotRad);

        const scale = Math.min(this.width, this.height) * 0.75 * this.zoom;
        const rawX = -unrotX / scale;
        const rawY = -unrotY / scale;

        const dRA = (rawX * 180) / Math.PI / 15;
        const dDec = (rawY * 180) / Math.PI;

        let ra = (this.viewCenterRA + dRA) % 24;
        if (ra < 0) ra += 24;
        let dec = Math.max(-90, Math.min(90, this.viewCenterDec + dDec));

        return { ra, dec };
    }

    // Main Render Loop
    render() {
        this.time += 1;

        // Smooth camera lerp
        this.viewCenterRA += (this.targetRA - this.viewCenterRA) * 0.08;
        this.viewCenterDec += (this.targetDec - this.viewCenterDec) * 0.08;
        this.zoom += (this.targetZoom - this.zoom) * 0.08;

        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Render Cosmic Deep Space & Nebula Glow
        this.renderCosmicBackdrop();

        // 2. Render Azimuth / Celestial Latitude Grid
        if (this.showAzimuthGrid) {
            this.renderCelestialGrid();
        }

        // 3. Render Background Procedural Starfield
        this.renderBackgroundStars();

        // 4. Render Deep Sky Objects (M42, Andromeda, Pleiades)
        if (this.showDeepSky) {
            this.renderDeepSkyObjects();
        }

        // 5. Render Completed Constellation Artwork & Connected Lines
        this.renderConstellationArtAndLines();

        // 6. Render Pointer Star Rays and Navigational Guides
        if (this.showPointerGuide) {
            this.renderPointerRays();
        }

        // 7. Render Active Linking Drag Line
        this.renderActiveDragLine();

        // 8. Render Catalog Stars (Glow, Magnitude Size, Spectral Color, Labels)
        this.renderCatalogStars();

        // 9. Render Stardust Particles
        this.renderParticles();

        // 10. Render Brass Astrolabe Compass Reticle
        this.renderCompassReticle();
    }

    renderCosmicBackdrop() {
        const cx = this.width / 2;
        const cy = this.height / 2;
        const maxR = Math.max(this.width, this.height);

        // Radial space gradient with deep midnight indigo
        const grad = this.ctx.createRadialGradient(cx, cy, 50, cx, cy, maxR * 0.85);
        grad.addColorStop(0, '#0a0d1e');
        grad.addColorStop(0.4, '#060814');
        grad.addColorStop(0.8, '#03040a');
        grad.addColorStop(1, '#000003');

        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Nebula clouds
        this.ctx.save();
        const nebulaGrad1 = this.ctx.createRadialGradient(cx * 0.6, cy * 0.4, 40, cx * 0.6, cy * 0.4, maxR * 0.45);
        nebulaGrad1.addColorStop(0, 'rgba(88, 28, 135, 0.12)');
        nebulaGrad1.addColorStop(0.6, 'rgba(30, 27, 75, 0.06)');
        nebulaGrad1.addColorStop(1, 'transparent');
        this.ctx.fillStyle = nebulaGrad1;
        this.ctx.fillRect(0, 0, this.width, this.height);

        const nebulaGrad2 = this.ctx.createRadialGradient(cx * 1.4, cy * 1.3, 30, cx * 1.4, cy * 1.3, maxR * 0.4);
        nebulaGrad2.addColorStop(0, 'rgba(14, 116, 144, 0.1)');
        nebulaGrad2.addColorStop(0.6, 'rgba(12, 74, 96, 0.04)');
        nebulaGrad2.addColorStop(1, 'transparent');
        this.ctx.fillStyle = nebulaGrad2;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
    }

    renderCelestialGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.09)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([4, 6]);

        // Declination Circles (-60 to +80 every 20 deg)
        for (let dec = -60; dec <= 80; dec += 20) {
            this.ctx.beginPath();
            let first = true;
            for (let ra = 0; ra <= 24; ra += 0.5) {
                const pt = this.projectToScreen(ra, dec);
                if (pt.visible) {
                    if (first) { this.ctx.moveTo(pt.x, pt.y); first = false; }
                    else { this.ctx.lineTo(pt.x, pt.y); }
                }
            }
            this.ctx.stroke();
        }

        // Right Ascension Hour Meridians (every 2 hours)
        for (let ra = 0; ra < 24; ra += 2) {
            this.ctx.beginPath();
            let first = true;
            for (let dec = -80; dec <= 85; dec += 5) {
                const pt = this.projectToScreen(ra, dec);
                if (pt.visible) {
                    if (first) { this.ctx.moveTo(pt.x, pt.y); first = false; }
                    else { this.ctx.lineTo(pt.x, pt.y); }
                }
            }
            this.ctx.stroke();
        }

        this.ctx.setLineDash([]);
        this.ctx.restore();
    }

    renderBackgroundStars() {
        this.ctx.save();
        for (const s of this.backgroundStars) {
            const pt = this.projectToScreen(s.ra, s.dec);
            if (!pt.visible || pt.x < -10 || pt.x > this.width + 10 || pt.y < -10 || pt.y > this.height + 10) continue;

            const twinkle = 0.6 + 0.4 * Math.sin(this.time * s.twinkleSpeed + s.twinklePhase);
            const radius = Math.max(0.6, (6.5 - s.mag) * 0.55 * twinkle);

            this.ctx.fillStyle = s.color;
            this.ctx.globalAlpha = Math.min(1, Math.max(0.2, (6.5 - s.mag) * 0.25 * twinkle));
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    renderDeepSkyObjects() {
        this.ctx.save();
        for (const dso of DEEP_SKY_OBJECTS) {
            const pt = this.projectToScreen(dso.ra, dso.dec, dso.distLy);
            if (!pt.visible) continue;

            // Luminous nebula halo
            const pulse = 1 + 0.1 * Math.sin(this.time * 0.03);
            const grad = this.ctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, 35 * pulse);
            grad.addColorStop(0, dso.color);
            grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.08)');
            grad.addColorStop(1, 'transparent');

            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, 35 * pulse, 0, Math.PI * 2);
            this.ctx.fill();

            // Label
            this.ctx.font = '10px "Space Grotesk", sans-serif';
            this.ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${dso.icon} ${dso.name}`, pt.x, pt.y + 24);
        }
        this.ctx.restore();
    }

    renderConstellationArtAndLines() {
        this.ctx.save();

        this.constellations.forEach(c => {
            const isCompleted = this.isConstellationCompleted(c);
            const isCurrent = this.activeConstellation && this.activeConstellation.id === c.id;

            // Map stars to screen points
            const starPoints = new Map();
            c.stars.forEach(s => {
                const pt = this.projectToScreen(s.ra, s.dec, s.distLy);
                if (pt.visible) {
                    starPoints.set(s.id, pt);
                }
            });

            // 1. Constellation Stick Lines
            c.lines.forEach(([id1, id2]) => {
                const edgeKey = this.getEdgeKey(id1, id2);
                const isLinked = this.connectedEdges.has(edgeKey);
                const p1 = starPoints.get(id1);
                const p2 = starPoints.get(id2);

                if (p1 && p2) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);

                    if (isLinked || isCompleted) {
                        // Glowing completed laser gold/cyan line
                        this.ctx.strokeStyle = isCompleted ? 'rgba(255, 215, 0, 0.85)' : 'rgba(56, 189, 248, 0.8)';
                        this.ctx.lineWidth = 2.5;
                        this.ctx.shadowColor = isCompleted ? '#ffd700' : '#38bdf8';
                        this.ctx.shadowBlur = 12;
                        this.ctx.stroke();

                        // Shimmer core
                        this.ctx.strokeStyle = '#ffffff';
                        this.ctx.lineWidth = 1;
                        this.ctx.shadowBlur = 0;
                        this.ctx.stroke();
                    } else if (isCurrent) {
                        // Subtle guideline for player to discover
                        this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
                        this.ctx.lineWidth = 1.2;
                        this.ctx.setLineDash([3, 4]);
                        this.ctx.shadowBlur = 0;
                        this.ctx.stroke();
                        this.ctx.setLineDash([]);
                    }
                }
            });

            // 2. Constellation Artwork Overlay (Revealed when completed or in Planetarium)
            if (this.showArtwork && (isCompleted || this.showArtworkInPlanetarium)) {
                this.renderMythologicalArtwork(c, starPoints);
            }
        });

        // Render Custom User Lines (Sandbox mode)
        if (this.customLines.length > 0) {
            this.ctx.strokeStyle = 'rgba(244, 114, 182, 0.85)';
            this.ctx.lineWidth = 2;
            this.ctx.shadowColor = '#f472b6';
            this.ctx.shadowBlur = 8;
            this.customLines.forEach(([p1, p2]) => {
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
            });
            this.ctx.shadowBlur = 0;
        }

        this.ctx.restore();
    }

    renderMythologicalArtwork(c, starPoints) {
        // Center of constellation on screen
        let avgX = 0, avgY = 0, count = 0;
        starPoints.forEach(pt => {
            avgX += pt.x;
            avgY += pt.y;
            count++;
        });
        if (count === 0) return;
        avgX /= count;
        avgY /= count;

        this.ctx.save();
        this.ctx.translate(avgX, avgY);
        this.ctx.globalAlpha = 0.35 + 0.1 * Math.sin(this.time * 0.02);

        // Constellation Mythological Glyph / Halo
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
        this.ctx.lineWidth = 1.5;

        const pulseRadius = 60 * this.zoom;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, pulseRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.fill();

        // Constellation Name Banner
        this.ctx.font = '600 13px "Cinzel", serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(c.name.toUpperCase(), 0, -pulseRadius - 12);

        this.ctx.font = 'italic 10px "Space Grotesk", sans-serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fillText(c.title, 0, -pulseRadius + 2);

        this.ctx.restore();
    }

    renderPointerRays() {
        if (!this.activeConstellation || !this.activeConstellation.pointerGuide) return;
        const pg = this.activeConstellation.pointerGuide;
        const star1 = this.allStars.find(s => s.id === pg.from);
        const star2 = this.allStars.find(s => s.id === pg.to);
        const targetStar = this.allStars.find(s => s.id === pg.target);

        if (!star1 || !star2) return;

        const p1 = this.projectToScreen(star1.ra, star1.dec, star1.distLy);
        const p2 = this.projectToScreen(star2.ra, star2.dec, star2.distLy);

        if (!p1.visible || !p2.visible) return;

        this.ctx.save();

        // Calculate vector from star1 through star2
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) { this.ctx.restore(); return; }

        const ux = dx / dist;
        const uy = dy / dist;

        // Animated ray projection
        const rayLen = dist * pg.distanceMultiplier;
        const rayProgress = this.pointerLocked ? 1.0 : (0.4 + 0.6 * ((Math.sin(this.time * 0.05) + 1) / 2));
        const endX = p2.x + ux * rayLen * rayProgress;
        const endY = p2.y + uy * rayLen * rayProgress;

        // Pointer laser gradient
        const laserGrad = this.ctx.createLinearGradient(p2.x, p2.y, endX, endY);
        laserGrad.addColorStop(0, 'rgba(244, 63, 94, 0.9)');
        laserGrad.addColorStop(0.7, 'rgba(251, 146, 60, 0.7)');
        laserGrad.addColorStop(1, 'rgba(253, 224, 71, 0.9)');

        this.ctx.strokeStyle = laserGrad;
        this.ctx.lineWidth = 2.5;
        this.ctx.setLineDash([6, 4]);
        this.ctx.lineDashOffset = -this.time * 1.5;
        this.ctx.shadowColor = '#f43f5e';
        this.ctx.shadowBlur = 10;

        this.ctx.beginPath();
        this.ctx.moveTo(p2.x, p2.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Ticks for distance multiplier (1x, 2x, 3x, 4x, 5x)
        const perpX = -uy * 6;
        const perpY = ux * 6;
        for (let mult = 1; mult <= pg.distanceMultiplier; mult++) {
            const tx = p2.x + ux * dist * mult;
            const ty = p2.y + uy * dist * mult;
            this.ctx.beginPath();
            this.ctx.moveTo(tx - perpX, ty - perpY);
            this.ctx.lineTo(tx + perpX, ty + perpY);
            this.ctx.strokeStyle = '#fde047';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.font = '9px "JetBrains Mono", monospace';
            this.ctx.fillStyle = '#fde047';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${mult}x`, tx + perpX * 2, ty + perpY * 2);
        }

        // Pointer target reticle
        if (targetStar) {
            const tp = this.projectToScreen(targetStar.ra, targetStar.dec, targetStar.distLy);
            if (tp.visible) {
                const targetPulse = 18 + 5 * Math.sin(this.time * 0.08);
                this.ctx.strokeStyle = this.pointerLocked ? '#22c55e' : '#f43f5e';
                this.ctx.lineWidth = 1.8;
                this.ctx.beginPath();
                this.ctx.arc(tp.x, tp.y, targetPulse, 0, Math.PI * 2);
                this.ctx.stroke();

                // Crosshairs
                this.ctx.beginPath();
                this.ctx.moveTo(tp.x - targetPulse - 4, tp.y);
                this.ctx.lineTo(tp.x + targetPulse + 4, tp.y);
                this.ctx.moveTo(tp.x, tp.y - targetPulse - 4);
                this.ctx.lineTo(tp.x, tp.y + targetPulse + 4);
                this.ctx.stroke();

                // Wayfinding label
                this.ctx.font = 'bold 11px "Space Grotesk", sans-serif';
                this.ctx.fillStyle = this.pointerLocked ? '#4ade80' : '#fda4af';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(this.pointerLocked ? `★ LOCKED: ${targetStar.name}` : `TARGET: ${targetStar.name}`, tp.x, tp.y - targetPulse - 6);
            }
        }

        this.ctx.restore();
    }

    renderActiveDragLine() {
        if (!this.isDragging || !this.dragStartStar) return;
        const p1 = this.projectToScreen(this.dragStartStar.ra, this.dragStartStar.dec, this.dragStartStar.distLy);
        if (!p1.visible) return;

        this.ctx.save();
        const laserGrad = this.ctx.createLinearGradient(p1.x, p1.y, this.mousePos.x, this.mousePos.y);
        laserGrad.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
        laserGrad.addColorStop(1, 'rgba(216, 180, 254, 0.85)');

        this.ctx.strokeStyle = laserGrad;
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = '#38bdf8';
        this.ctx.shadowBlur = 14;

        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(this.mousePos.x, this.mousePos.y);
        this.ctx.stroke();

        // Tip reticle
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.mousePos.x, this.mousePos.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    renderCatalogStars() {
        this.ctx.save();

        this.allStars.forEach(s => {
            const pt = this.projectToScreen(s.ra, s.dec, s.distLy);
            if (!pt.visible || pt.x < -30 || pt.x > this.width + 30 || pt.y < -30 || pt.y > this.height + 30) return;

            const isHovered = this.getStarAt(this.mousePos.x, this.mousePos.y) === s;
            const isDragSource = this.dragStartStar === s;
            const isNavAnchor = s.isNavAnchor || false;

            // Apparent magnitude radius scaling
            // Brighter stars (lower mag, e.g. -1.46 to 1.5) get larger radius and glow
            const baseRadius = Math.max(3.2, (5.2 - s.mag) * 1.55);
            const radius = isHovered ? baseRadius * 1.4 : baseRadius;
            const starColor = this.showSpectralColors ? (SPECTRAL_COLORS[s.spec] || '#ffffff') : '#ffffff';

            // 1. First-Magnitude Diffraction Spike Crosshairs (for Sirius, Betelgeuse, Rigel, Vega, etc.)
            if (s.mag < 1.4 || isNavAnchor) {
                const spikeLen = (baseRadius * 4.5) * (1 + 0.08 * Math.sin(this.time * 0.06));
                this.ctx.strokeStyle = starColor;
                this.ctx.lineWidth = 1.0;
                this.ctx.globalAlpha = 0.6;
                this.ctx.beginPath();
                this.ctx.moveTo(pt.x - spikeLen, pt.y);
                this.ctx.lineTo(pt.x + spikeLen, pt.y);
                this.ctx.moveTo(pt.x, pt.y - spikeLen);
                this.ctx.lineTo(pt.x, pt.y + spikeLen);
                this.ctx.stroke();
            }

            // 2. Multi-layer Celestial Halo Glow
            const glowRadius = radius * (isHovered ? 4.5 : 3.0);
            const glowGrad = this.ctx.createRadialGradient(pt.x, pt.y, radius * 0.4, pt.x, pt.y, glowRadius);
            glowGrad.addColorStop(0, starColor);
            glowGrad.addColorStop(0.35, starColor + '80');
            glowGrad.addColorStop(1, 'transparent');

            this.ctx.fillStyle = glowGrad;
            this.ctx.globalAlpha = isHovered ? 0.95 : 0.75;
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, glowRadius, 0, Math.PI * 2);
            this.ctx.fill();

            // 3. Crisp White Core Disk
            this.ctx.fillStyle = '#ffffff';
            this.ctx.globalAlpha = 1.0;
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // 4. Anchor / Selected Ring
            if (isDragSource || isHovered) {
                this.ctx.strokeStyle = '#ffd700';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(pt.x, pt.y, radius + 5, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            // 5. Star Typography & Coordinates (Name, Bayer, Mag, Light Years)
            if (this.showLabels || isHovered || s.mag < 2.0) {
                this.renderStarLabel(s, pt, isHovered);
            }
        });

        this.ctx.restore();
    }

    renderStarLabel(s, pt, isHovered) {
        this.ctx.save();
        this.ctx.textAlign = 'left';

        const textX = pt.x + 12;
        const textY = pt.y + 4;

        // Primary Name
        this.ctx.font = isHovered ? '600 13px "Space Grotesk", sans-serif' : '500 11px "Space Grotesk", sans-serif';
        this.ctx.fillStyle = isHovered ? '#ffd700' : 'rgba(255, 255, 255, 0.9)';
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText(s.name, textX, textY);

        // Subtitle (Bayer & Magnitude or Cultural Lore Name)
        if (isHovered || this.showLabels) {
            this.ctx.font = '10px "JetBrains Mono", monospace';
            this.ctx.fillStyle = isHovered ? '#93c5fd' : 'rgba(186, 230, 253, 0.65)';
            const magText = `mag ${s.mag.toFixed(2)} | ${s.distLy} ly`;
            this.ctx.fillText(magText, textX, textY + 12);
        }

        this.ctx.restore();
    }

    renderParticles() {
        this.ctx.save();
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    renderCompassReticle() {
        this.ctx.save();
        const cx = this.width / 2;
        const cy = this.height / 2;
        const reticleRadius = Math.min(this.width, this.height) * 0.46;

        // Brass Astrolabe Outer Dial Ring
        this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, reticleRadius, 0, Math.PI * 2);
        this.ctx.stroke();

        // 360 Degree Ticks
        for (let deg = 0; deg < 360; deg += 10) {
            const rad = ((deg + this.rotationAngle) * Math.PI) / 180;
            const isMajor = deg % 30 === 0;
            const tickLen = isMajor ? 8 : 4;
            const r1 = reticleRadius - tickLen;
            const r2 = reticleRadius;

            this.ctx.beginPath();
            this.ctx.moveTo(cx + Math.cos(rad) * r1, cy + Math.sin(rad) * r1);
            this.ctx.lineTo(cx + Math.cos(rad) * r2, cy + Math.sin(rad) * r2);
            this.ctx.strokeStyle = isMajor ? 'rgba(255, 215, 0, 0.6)' : 'rgba(212, 175, 55, 0.25)';
            this.ctx.lineWidth = isMajor ? 1.5 : 1;
            this.ctx.stroke();

            // Degree text on major cardinals
            if (deg === 0 || deg === 90 || deg === 180 || deg === 270) {
                const labels = { 0: 'E', 90: 'S', 180: 'W', 270: 'N' };
                const textR = reticleRadius - 20;
                this.ctx.font = 'bold 12px "Cinzel", serif';
                this.ctx.fillStyle = '#ffd700';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(labels[deg], cx + Math.cos(rad) * textR, cy + Math.sin(rad) * textR);
            }
        }

        this.ctx.restore();
    }

    spawnStarConnectionParticles(x, y, color = '#ffd700') {
        for (let i = 0; i < 24; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 3.5;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 3,
                color: [color, '#38bdf8', '#ffffff', '#c084fc'][Math.floor(Math.random() * 4)],
                life: 1.0
            });
        }
    }

    getEdgeKey(id1, id2) {
        return [id1, id2].sort().join('___');
    }

    isConstellationCompleted(constellation) {
        if (!constellation || !constellation.lines) return false;
        return constellation.lines.every(([id1, id2]) => {
            return this.connectedEdges.has(this.getEdgeKey(id1, id2));
        });
    }

    getStarAt(screenX, screenY, hitRadius = 24) {
        let bestStar = null;
        let bestDist = hitRadius;

        for (const s of this.allStars) {
            const pt = this.projectToScreen(s.ra, s.dec, s.distLy);
            if (!pt.visible) continue;
            const dist = Math.hypot(screenX - pt.x, screenY - pt.y);
            if (dist < bestDist) {
                bestDist = dist;
                bestStar = s;
            }
        }
        return bestStar;
    }

    bindEvents() {
        const onPointerDown = (clientX, clientY, isSecondary = false) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            this.mousePos = { x, y };

            const star = this.getStarAt(x, y);

            if (isSecondary || !star) {
                // Free pan
                this.isPanning = true;
                this.panStart = { x, y, ra: this.targetRA, dec: this.targetDec };
            } else {
                // Star link begin
                this.isDragging = true;
                this.dragStartStar = star;
                if (this.onStarClick) this.onStarClick(star);
            }
        };

        const onPointerMove = (clientX, clientY) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            this.mousePos = { x, y };

            if (this.isPanning) {
                const dx = x - this.panStart.x;
                const dy = y - this.panStart.y;
                const scale = Math.min(this.width, this.height) * 0.75 * this.zoom;
                const dRA = (-dx / scale) * (180 / Math.PI) / 15;
                const dDec = (-dy / scale) * (180 / Math.PI);

                this.targetRA = (this.panStart.ra + dRA + 24) % 24;
                this.targetDec = Math.max(-85, Math.min(85, this.panStart.dec + dDec));
            }
        };

        const onPointerUp = (clientX, clientY) => {
            if (this.isDragging && this.dragStartStar) {
                const rect = this.canvas.getBoundingClientRect();
                const x = clientX - rect.left;
                const y = clientY - rect.top;
                const targetStar = this.getStarAt(x, y);

                if (targetStar && targetStar !== this.dragStartStar) {
                    if (this.onStarConnect) {
                        this.onStarConnect(this.dragStartStar, targetStar);
                    }
                }
            }
            this.isDragging = false;
            this.dragStartStar = null;
            this.isPanning = false;
        };

        // Mouse Listeners
        this.canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY, e.button === 2 || e.shiftKey));
        window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', (e) => onPointerUp(e.clientX, e.clientY));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Touch Listeners
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            if (e.changedTouches.length > 0) {
                onPointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        });

        // Wheel Zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
            this.targetZoom = Math.max(0.4, Math.min(3.5, this.targetZoom * zoomDelta));
        }, { passive: false });

        window.addEventListener('resize', () => this.resize());
    }
}
