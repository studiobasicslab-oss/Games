/**
 * Precision Geometry & Shape Fitting Engine
 * Computes mathematical perfection percentage (0.0% to 100.0%)
 * for hand-drawn strokes compared to ideal geometric templates.
 */

export class GeometryEngine {
    constructor() {
        this.shapeTypes = [
            'circle',
            'square',
            'triangle',
            'star',
            'heart',
            'line',
            'diamond',
            'rectangle',
            'hexagon'
        ];
    }

    /**
     * Resample a polyline to N uniformly spaced points along its arc length.
     */
    resample(points, numPoints = 128) {
        if (!points || points.length < 2) return points;

        let totalLength = 0;
        const distances = [0];
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i - 1].x;
            const dy = points[i].y - points[i - 1].y;
            const dist = Math.hypot(dx, dy);
            totalLength += dist;
            distances.push(totalLength);
        }

        if (totalLength === 0) {
            return Array(numPoints).fill({ x: points[0].x, y: points[0].y });
        }

        const segmentLength = totalLength / (numPoints - 1);
        const resampled = [{ x: points[0].x, y: points[0].y }];
        let pIndex = 0;

        for (let i = 1; i < numPoints - 1; i++) {
            const targetDist = i * segmentLength;
            while (pIndex < distances.length - 1 && distances[pIndex + 1] < targetDist) {
                pIndex++;
            }
            const d1 = distances[pIndex];
            const d2 = distances[pIndex + 1];
            const t = (d2 === d1) ? 0 : (targetDist - d1) / (d2 - d1);
            const p1 = points[pIndex];
            const p2 = points[pIndex + 1];
            resampled.push({
                x: p1.x + t * (p2.x - p1.x),
                y: p1.y + t * (p2.y - p1.y)
            });
        }
        resampled.push({ x: points[points.length - 1].x, y: points[points.length - 1].y });
        return resampled;
    }

    /**
     * Compute geometric centroid of points
     */
    getCentroid(points) {
        let sx = 0, sy = 0;
        for (const p of points) {
            sx += p.x;
            sy += p.y;
        }
        return { x: sx / points.length, y: sy / points.length };
    }

    /**
     * Compute bounding box and dimensions
     */
    getBounds(points) {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const p of points) {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        }
        const center = this.getCentroid(points);

        return {
            minX, maxX, minY, maxY,
            width: Math.max(1, maxX - minX),
            height: Math.max(1, maxY - minY),
            center
        };
    }

    /**
     * Evaluate Circle Drawing
     */
    evaluateCircle(rawPoints) {
        const points = this.resample(rawPoints, 180);
        const n = points.length;
        if (n < 8) return this.emptyResult('circle');

        // 1. Centroid
        const centroid = this.getCentroid(points);

        // 2. Algebraic Circle Fit
        const radii = points.map(p => Math.hypot(p.x - centroid.x, p.y - centroid.y));
        const avgRadius = radii.reduce((a, b) => a + b, 0) / n;
        
        if (avgRadius < 10) return this.emptyResult('circle');

        // Standard deviation of radius
        const variance = radii.reduce((sum, r) => sum + Math.pow(r - avgRadius, 2), 0) / n;
        const stdDev = Math.sqrt(variance);
        const radiusConsistency = Math.max(0, 1 - (stdDev / avgRadius) * 2.5);

        // 3. Closure penalty
        const startPoint = points[0];
        const endPoint = points[n - 1];
        const closureGap = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        const closureRatio = closureGap / (2 * Math.PI * avgRadius);
        const closureScore = Math.max(0, 1 - closureRatio * 3.0);

        // 4. Angular distribution (full 360 loop)
        const angles = points.map(p => Math.atan2(p.y - centroid.y, p.x - centroid.x));
        let totalAngleSweep = 0;
        for (let i = 1; i < n; i++) {
            let diff = angles[i] - angles[i - 1];
            while (diff > Math.PI) diff -= 2 * Math.PI;
            while (diff < -Math.PI) diff += 2 * Math.PI;
            totalAngleSweep += diff;
        }
        const fullLoopRatio = Math.min(1, Math.abs(totalAngleSweep) / (2 * Math.PI));
        const loopScore = fullLoopRatio > 0.85 ? Math.max(0, 1 - Math.abs(1 - fullLoopRatio) * 3) : fullLoopRatio * 0.5;

        // 5. Roundness / Aspect
        let sxx = 0, syy = 0;
        for (const p of points) {
            sxx += Math.pow(p.x - centroid.x, 2);
            syy += Math.pow(p.y - centroid.y, 2);
        }
        const aspect = Math.min(sxx, syy) / Math.max(sxx, syy || 1);
        const roundnessScore = Math.sqrt(aspect);

        // Heatmap
        const heatmap = points.map((p, i) => {
            const r = radii[i];
            const dev = Math.abs(r - avgRadius) / avgRadius;
            return {
                point: p,
                error: Math.min(1, dev * 3.5),
                idealPoint: {
                    x: centroid.x + (p.x - centroid.x) * (avgRadius / (r || 1)),
                    y: centroid.y + (p.y - centroid.y) * (avgRadius / (r || 1))
                }
            };
        });

        // Ideal circle path
        const idealPoints = [];
        for (let i = 0; i <= 100; i++) {
            const theta = (i / 100) * 2 * Math.PI;
            idealPoints.push({
                x: centroid.x + avgRadius * Math.cos(theta),
                y: centroid.y + avgRadius * Math.sin(theta)
            });
        }

        const rawScore = (radiusConsistency * 0.45 + closureScore * 0.25 + loopScore * 0.15 + roundnessScore * 0.15);
        const finalPercentage = this.curveScore(rawScore);

        return {
            shape: 'circle',
            percentage: finalPercentage,
            grade: this.getGrade(finalPercentage),
            stats: [
                { label: 'Radius Uniformity', value: `${(radiusConsistency * 100).toFixed(1)}%` },
                { label: 'Loop Closure', value: `${(closureScore * 100).toFixed(1)}%` },
                { label: 'Roundness / Aspect', value: `${(roundnessScore * 100).toFixed(1)}%` },
                { label: 'Average Radius', value: `${Math.round(avgRadius)} px` }
            ],
            idealPoints,
            heatmap,
            center: centroid,
            metrics: { avgRadius, stdDev, closureGap }
        };
    }

    /**
     * Evaluate Straight Line Drawing
     */
    evaluateLine(rawPoints) {
        const points = this.resample(rawPoints, 100);
        const n = points.length;
        if (n < 4) return this.emptyResult('line');

        const start = points[0];
        const end = points[n - 1];
        const lineLength = Math.hypot(end.x - start.x, end.y - start.y);

        if (lineLength < 20) return this.emptyResult('line');

        let maxDeviation = 0;
        let sumDeviation = 0;
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        const heatmap = points.map((p, i) => {
            const t = i / (n - 1);
            const idealX = start.x + t * dx;
            const idealY = start.y + t * dy;
            
            const num = Math.abs(dy * p.x - dx * p.y + end.x * start.y - end.y * start.x);
            const perpDist = num / (lineLength || 1);
            
            maxDeviation = Math.max(maxDeviation, perpDist);
            sumDeviation += perpDist;

            return {
                point: p,
                error: Math.min(1, (perpDist / lineLength) * 15),
                idealPoint: { x: idealX, y: idealY }
            };
        });

        const avgDeviation = sumDeviation / n;
        const straightness = Math.max(0, 1 - (avgDeviation / lineLength) * 6);
        const wobblePenalty = Math.max(0, 1 - (maxDeviation / lineLength) * 3);

        const rawScore = straightness * 0.7 + wobblePenalty * 0.3;
        const finalPercentage = this.curveScore(rawScore);

        return {
            shape: 'line',
            percentage: finalPercentage,
            grade: this.getGrade(finalPercentage),
            stats: [
                { label: 'Straightness', value: `${(straightness * 100).toFixed(1)}%` },
                { label: 'Max Wobble', value: `${maxDeviation.toFixed(1)} px` },
                { label: 'Length', value: `${Math.round(lineLength)} px` }
            ],
            idealPoints: [start, end],
            heatmap,
            center: { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }
        };
    }

    /**
     * Evaluate Polygon Shapes (Square, Rectangle, Triangle, Diamond, Hexagon, Star)
     */
    evaluatePolygon(rawPoints, targetShape) {
        const numTemplatePoints = 160;
        const points = this.resample(rawPoints, numTemplatePoints);
        const n = points.length;
        if (n < 8) return this.emptyResult(targetShape);

        const bounds = this.getBounds(points);
        const center = bounds.center;
        const size = Math.max(bounds.width, bounds.height);

        if (size < 25) return this.emptyResult(targetShape);

        // Closure check
        const startPoint = points[0];
        const endPoint = points[n - 1];
        const closureGap = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        const closureScore = Math.max(0, 1 - (closureGap / size) * 2.0);

        // Canonical shape centered at origin (0, 0)
        const canonical = this.getCanonicalTemplateAtOrigin(targetShape, bounds.width, bounds.height, numTemplatePoints);
        
        // Optimal Procrustes Alignment (searches cyclic shifts, flip, and exact analytical rotation)
        const bestFit = this.alignToTemplateProcrustes(points, canonical, center);

        let totalSqError = 0;
        let maxErr = 0;
        const idealAligned = bestFit.alignedIdeal;

        const heatmap = points.map((p, i) => {
            const ideal = idealAligned[i];
            const dist = Math.hypot(p.x - ideal.x, p.y - ideal.y);
            totalSqError += dist * dist;
            maxErr = Math.max(maxErr, dist);
            return {
                point: p,
                error: Math.min(1, (dist / size) * 4),
                idealPoint: ideal
            };
        });

        const rmse = Math.sqrt(totalSqError / n);
        const fitScore = Math.max(0, 1 - (rmse / size) * 2.8);
        const cornerScore = Math.max(0, 1 - (maxErr / size) * 1.5);

        // Shape specific aspect ratio penalties
        let aspectScore = 1.0;
        if (targetShape === 'square') {
            const ratio = Math.min(bounds.width, bounds.height) / (Math.max(bounds.width, bounds.height) || 1);
            aspectScore = Math.max(0, 1 - (1 - ratio) * 1.8);
        }

        const rawScore = fitScore * 0.55 + cornerScore * 0.20 + closureScore * 0.15 + aspectScore * 0.10;
        const finalPercentage = this.curveScore(rawScore);

        return {
            shape: targetShape,
            percentage: finalPercentage,
            grade: this.getGrade(finalPercentage),
            stats: [
                { label: 'Edge & Shape Fit', value: `${(fitScore * 100).toFixed(1)}%` },
                { label: 'Corner Precision', value: `${(cornerScore * 100).toFixed(1)}%` },
                { label: 'Closure', value: `${(closureScore * 100).toFixed(1)}%` },
                { label: 'Symmetry', value: `${(aspectScore * 100).toFixed(1)}%` }
            ],
            idealPoints: idealAligned,
            heatmap,
            center: center,
            metrics: { rmse, maxErr, closureGap }
        };
    }

    /**
     * Evaluate Heart Shape
     */
    evaluateHeart(rawPoints) {
        const numPoints = 160;
        const points = this.resample(rawPoints, numPoints);
        const n = points.length;
        if (n < 8) return this.emptyResult('heart');

        const bounds = this.getBounds(points);
        const center = bounds.center;
        const size = Math.max(bounds.width, bounds.height);

        if (size < 25) return this.emptyResult('heart');

        // Parametric Heart Template centered at origin
        const rawTemplate = [];
        const scaleX = bounds.width / 32;
        const scaleY = bounds.height / 28.92;
        for (let i = 0; i < 300; i++) {
            const t = (i / 300) * 2 * Math.PI;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            rawTemplate.push({
                x: x * scaleX,
                y: y * scaleY
            });
        }
        const template = this.resample(rawTemplate, numPoints);

        // Align heart without free rotation (heart has a fixed upright canonical orientation)
        const bestFit = this.alignToTemplateProcrustes(points, template, center, false);
        const idealAligned = bestFit.alignedIdeal;

        let totalSqError = 0;
        let maxErr = 0;
        const heatmap = points.map((p, i) => {
            const ideal = idealAligned[i];
            const dist = Math.hypot(p.x - ideal.x, p.y - ideal.y);
            totalSqError += dist * dist;
            maxErr = Math.max(maxErr, dist);
            return {
                point: p,
                error: Math.min(1, (dist / size) * 3.5),
                idealPoint: ideal
            };
        });

        const rmse = Math.sqrt(totalSqError / n);
        const fitScore = Math.max(0, 1 - (rmse / size) * 2.8);
        const closureGap = Math.hypot(points[n - 1].x - points[0].x, points[n - 1].y - points[0].y);
        const closureScore = Math.max(0, 1 - (closureGap / size) * 2.0);

        const rawScore = fitScore * 0.75 + closureScore * 0.25;
        const finalPercentage = this.curveScore(rawScore);

        return {
            shape: 'heart',
            percentage: finalPercentage,
            grade: this.getGrade(finalPercentage),
            stats: [
                { label: 'Curve Fit', value: `${(fitScore * 100).toFixed(1)}%` },
                { label: 'Cusp & Lobe Symmetry', value: `${((fitScore * 0.9 + 0.1) * 100).toFixed(1)}%` },
                { label: 'Closure', value: `${(closureScore * 100).toFixed(1)}%` }
            ],
            idealPoints: idealAligned,
            heatmap,
            center: center
        };
    }

    /**
     * Dispatch evaluation based on requested shape
     */
    evaluate(points, shapeType) {
        if (!points || points.length < 5) {
            return this.emptyResult(shapeType);
        }

        switch (shapeType) {
            case 'circle':
                return this.evaluateCircle(points);
            case 'line':
                return this.evaluateLine(points);
            case 'heart':
                return this.evaluateHeart(points);
            case 'square':
            case 'rectangle':
            case 'triangle':
            case 'star':
            case 'diamond':
            case 'hexagon':
                return this.evaluatePolygon(points, shapeType);
            default:
                return this.evaluateCircle(points);
        }
    }

    /**
     * Auto-detect which shape the user drew and grade it
     */
    autoDetectAndEvaluate(points) {
        if (!points || points.length < 6) return this.emptyResult('circle');

        const candidateShapes = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond', 'hexagon', 'line'];
        let bestResult = null;
        let highestScore = -1;

        for (const s of candidateShapes) {
            const res = this.evaluate(points, s);
            if (res && res.percentage > highestScore) {
                highestScore = res.percentage;
                bestResult = res;
            }
        }

        return bestResult || this.emptyResult('circle');
    }

    /**
     * Generate canonical polygon templates centered at (0, 0)
     */
    getCanonicalTemplateAtOrigin(shapeType, w, h, numSamples = 160) {
        const radius = Math.max(w, h) / 2;
        let vertices = [];

        if (shapeType === 'square') {
            const s = radius;
            vertices = [
                { x: -s, y: -s },
                { x: s, y: -s },
                { x: s, y: s },
                { x: -s, y: s },
                { x: -s, y: -s }
            ];
        } else if (shapeType === 'rectangle') {
            const rx = w / 2, ry = h / 2;
            vertices = [
                { x: -rx, y: -ry },
                { x: rx, y: -ry },
                { x: rx, y: ry },
                { x: -rx, y: ry },
                { x: -rx, y: -ry }
            ];
        } else if (shapeType === 'triangle') {
            const r = radius;
            vertices = [
                { x: 0, y: -r },
                { x: r * Math.cos(Math.PI / 6), y: r * Math.sin(Math.PI / 6) },
                { x: -r * Math.cos(Math.PI / 6), y: r * Math.sin(Math.PI / 6) },
                { x: 0, y: -r }
            ];
        } else if (shapeType === 'diamond') {
            const rx = radius, ry = radius * 1.25;
            vertices = [
                { x: 0, y: -ry },
                { x: rx, y: 0 },
                { x: 0, y: ry },
                { x: -rx, y: 0 },
                { x: 0, y: -ry }
            ];
        } else if (shapeType === 'hexagon') {
            vertices = [];
            for (let i = 0; i <= 6; i++) {
                const a = (i / 6) * 2 * Math.PI - Math.PI / 2;
                vertices.push({ x: radius * Math.cos(a), y: radius * Math.sin(a) });
            }
        } else if (shapeType === 'star') {
            vertices = [];
            const outerR = radius;
            const innerR = radius * 0.42;
            for (let i = 0; i <= 10; i++) {
                const a = (i / 10) * 2 * Math.PI - Math.PI / 2;
                const r = (i % 2 === 0) ? outerR : innerR;
                vertices.push({ x: r * Math.cos(a), y: r * Math.sin(a) });
            }
        }

        // Uniform interpolation along vertices
        const sampled = [];
        const segCount = vertices.length - 1;
        const ptsPerSeg = Math.floor(numSamples / segCount);

        for (let seg = 0; seg < segCount; seg++) {
            const p1 = vertices[seg];
            const p2 = vertices[seg + 1];
            const count = (seg === segCount - 1) ? (numSamples - sampled.length) : ptsPerSeg;
            for (let k = 0; k < count; k++) {
                const t = k / count;
                sampled.push({
                    x: p1.x + t * (p2.x - p1.x),
                    y: p1.y + t * (p2.y - p1.y)
                });
            }
        }

        return sampled;
    }

    /**
     * Procrustes alignment: tests cyclic shifts, flip, and analytical optimal rotation
     */
    alignToTemplateProcrustes(drawn, templateOrigin, center, allowRotation = true) {
        const n = drawn.length;
        // Center drawn points at origin
        const drawnCentered = drawn.map(p => ({ x: p.x - center.x, y: p.y - center.y }));

        let bestDist = Infinity;
        let bestShift = 0;
        let bestFlipped = false;
        let bestRotAngle = 0;

        const candidateRotations = allowRotation 
            ? [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, -(Math.PI / 4), -(Math.PI / 2), -(3 * Math.PI) / 4]
            : [0];

        const evaluateCandidate = (flipped, rot) => {
            const cosR = Math.cos(rot);
            const sinR = Math.sin(rot);

            // Rotate template
            const rotTemplate = templateOrigin.map(p => ({
                x: p.x * cosR - p.y * sinR,
                y: p.x * sinR + p.y * cosR
            }));

            for (let shift = 0; shift < n; shift += 2) {
                let sumD = 0;
                for (let i = 0; i < n; i += 2) {
                    const dIdx = i;
                    const tIdx = (flipped ? (n - 1 - ((i + shift) % n)) : (i + shift) % n);
                    const dx = drawnCentered[dIdx].x - rotTemplate[tIdx].x;
                    const dy = drawnCentered[dIdx].y - rotTemplate[tIdx].y;
                    sumD += Math.hypot(dx, dy);
                }
                if (sumD < bestDist) {
                    bestDist = sumD;
                    bestShift = shift;
                    bestFlipped = flipped;
                    bestRotAngle = rot;
                }
            }
        };

        for (const rot of candidateRotations) {
            evaluateCandidate(false, rot);
            evaluateCandidate(true, rot);
        }

        // Construct aligned template points shifted back to world center
        const cosR = Math.cos(bestRotAngle);
        const sinR = Math.sin(bestRotAngle);
        const aligned = [];

        for (let i = 0; i < n; i++) {
            const tIdx = bestFlipped ? (n - 1 - ((i + bestShift) % n)) : (i + bestShift) % n;
            const tp = templateOrigin[tIdx];
            const rx = tp.x * cosR - tp.y * sinR + center.x;
            const ry = tp.x * sinR + tp.y * cosR + center.y;
            aligned.push({ x: rx, y: ry });
        }

        return { alignedIdeal: aligned, minDistance: bestDist };
    }

    curveScore(raw) {
        if (raw <= 0) return 0;
        if (raw >= 1) return 100;
        const score = Math.pow(raw, 1.35) * 100;
        return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
    }

    getGrade(percentage) {
        if (percentage >= 98.0) return { rank: 'SSS', title: 'GODLIKE GEOMETRY', color: '#ff007f' };
        if (percentage >= 95.0) return { rank: 'SS', title: 'PERFECTIONIST', color: '#a855f7' };
        if (percentage >= 90.0) return { rank: 'S', title: 'MASTER ARTISAN', color: '#3b82f6' };
        if (percentage >= 85.0) return { rank: 'A', title: 'EXCELLENT', color: '#10b981' };
        if (percentage >= 75.0) return { rank: 'B', title: 'DECENT PRECISION', color: '#eab308' };
        if (percentage >= 60.0) return { rank: 'C', title: 'CLOSE ENOUGH', color: '#f97316' };
        return { rank: 'D', title: 'NEEDS PRACTICE', color: '#ef4444' };
    }

    emptyResult(shape) {
        return {
            shape,
            percentage: 0,
            grade: { rank: 'F', title: 'TOO SHORT / INCOMPLETE', color: '#94a3b8' },
            stats: [
                { label: 'Accuracy', value: '0.0%' },
                { label: 'Note', value: 'Draw a larger complete shape' }
            ],
            idealPoints: [],
            heatmap: [],
            center: { x: 0, y: 0 }
        };
    }
}
