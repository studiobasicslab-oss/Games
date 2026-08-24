/**
 * Biome Swap: The Keystone Balance - Ecology & Trophic Cascade Engine
 */

class EcologyEngine {
    constructor(audioEngine, vfxEngine) {
        this.audio = audioEngine;
        this.vfx = vfxEngine;

        this.day = 1;
        this.solarFluxKcal = 10000; // Solar energy budget
        this.gridSize = 4; // 4x4 tiles
        this.grid = [];
        this.activeBiome = 'forest'; // 'forest', 'reef', 'tundra', 'savanna'
        this.biodiversityScore = 0;
        this.activeCascades = [];
        this.invasiveThreats = [];
        this.isCollapsing = false;
        this.hand = [];
        this.deck = [];
        this.energyAvailable = 100;

        this.initGrid();
    }

    initGrid(biome = 'forest') {
        this.activeBiome = biome;
        this.grid = [];
        for (let r = 0; r < this.gridSize; r++) {
            const row = [];
            for (let c = 0; c < this.gridSize; c++) {
                row.push({
                    r, c,
                    biome: this.activeBiome,
                    soilHealth: 50,
                    moisture: 50,
                    producers: 20, // Plant / Kelp / Algae biomass (0-100)
                    herbivores: 40, // Herbivore population (0-100)
                    predators: 5,  // Mesopredators (0-100)
                    apex: 0,       // Keystone Apex predators (0-100)
                    invasive: 0,   // Invasive pests (0-100)
                    isWetland: false,
                    isUrchinBarren: false
                });
            }
            this.grid.push(row);
        }
    }

    loadScenario(scenario) {
        this.day = 1;
        this.energyAvailable = scenario.initialEnergy || 100;
        this.activeBiome = scenario.biome;
        this.initGrid(scenario.biome);

        // Apply scenario tile modifiers
        scenario.tiles.forEach(t => {
            if (this.grid[t.r] && this.grid[t.r][t.c]) {
                const cell = this.grid[t.r][t.c];
                if (t.producers !== undefined) cell.producers = t.producers;
                if (t.herbivores !== undefined) cell.herbivores = t.herbivores;
                if (t.predators !== undefined) cell.predators = t.predators;
                if (t.apex !== undefined) cell.apex = t.apex;
                if (t.invasive !== undefined) cell.invasive = t.invasive;
                if (t.soilHealth !== undefined) cell.soilHealth = t.soilHealth;
                if (t.moisture !== undefined) cell.moisture = t.moisture;
            }
        });

        this.activeCascades = [];
        this.invasiveThreats = scenario.initialInvasives || [];
        this.calculateMetrics();
    }

    applyCard(card, targetR, targetC) {
        if (this.energyAvailable < card.cost) return false;
        const cell = this.grid[targetR][targetC];
        if (!cell) return false;

        this.energyAvailable -= card.cost;
        if (this.audio) this.audio.playCardDrop(card.type);

        // Apply card effects
        if (card.effects.producers) cell.producers = Math.min(100, Math.max(0, cell.producers + card.effects.producers));
        if (card.effects.herbivores) cell.herbivores = Math.min(100, Math.max(0, cell.herbivores + card.effects.herbivores));
        if (card.effects.predators) cell.predators = Math.min(100, Math.max(0, cell.predators + card.effects.predators));
        if (card.effects.apex) cell.apex = Math.min(100, Math.max(0, cell.apex + card.effects.apex));
        if (card.effects.invasive) cell.invasive = Math.min(100, Math.max(0, cell.invasive + card.effects.invasive));
        if (card.effects.soilHealth) cell.soilHealth = Math.min(100, Math.max(0, cell.soilHealth + card.effects.soilHealth));
        if (card.effects.moisture) cell.moisture = Math.min(100, Math.max(0, cell.moisture + card.effects.moisture));

        // Area of effect to adjacent tiles if specified
        if (card.aoe) {
            const neighbors = this.getNeighbors(targetR, targetC);
            neighbors.forEach(n => {
                if (card.effects.producers) n.producers = Math.min(100, Math.max(0, n.producers + Math.round(card.effects.producers * 0.5)));
                if (card.effects.herbivores) n.herbivores = Math.min(100, Math.max(0, n.herbivores + Math.round(card.effects.herbivores * 0.5)));
                if (card.effects.apex) n.apex = Math.min(100, Math.max(0, n.apex + Math.round(card.effects.apex * 0.5)));
            });
        }

        this.checkCascades(targetR, targetC);
        this.calculateMetrics();
        return true;
    }

    checkCascades(r, c) {
        const cell = this.grid[r][c];

        // 1. Yellowstone Wolf-Willow-Beaver Cascade
        if (cell.biome === 'forest' && cell.apex >= 15 && cell.herbivores >= 10) {
            cell.herbivores = Math.max(10, cell.herbivores - 15);
            cell.producers = Math.min(100, cell.producers + 30);
            cell.moisture = Math.min(100, cell.moisture + 25);
            cell.isWetland = true;
            this.triggerCascade("Yellowstone Trophic Cascade: Wolves regulate elk, willow forests flourish, and beavers engineer lush wetlands!");
        }

        // 2. Pacific Sea Otter - Urchin Barren Recovery
        if (cell.biome === 'reef' && cell.apex >= 15 && cell.herbivores >= 30) {
            cell.herbivores = Math.max(5, cell.herbivores - 25); // Urchins reduced
            cell.producers = Math.min(100, cell.producers + 45); // Kelp forest recovers
            cell.isUrchinBarren = false;
            this.triggerCascade("Pacific Kelp Cascade: Sea otters devour urchin barrens, allowing gigantic kelp forests to re-bloom!");
        }

        // 3. Savanna Apex Balance
        if (cell.biome === 'savanna' && cell.apex >= 15 && cell.herbivores >= 40) {
            cell.herbivores = Math.max(15, cell.herbivores - 20);
            cell.producers = Math.min(100, cell.producers + 25);
            this.triggerCascade("Serengeti Cascade: Lions prevent destructive overgrazing, sustaining the great migratory river banks!");
        }

        // 4. Arctic Permafrost Moss Recovery
        if (cell.biome === 'tundra' && cell.apex >= 10 && cell.herbivores <= 25) {
            cell.producers = Math.min(100, cell.producers + 35);
            cell.soilHealth = Math.min(100, cell.soilHealth + 20);
            this.triggerCascade("Arctic Permafrost Cascade: Keystone predators preserve insulating tundra peat moss and carbon sinks!");
        }
    }

    triggerCascade(message) {
        this.activeCascades.push(message);
        if (this.audio) this.audio.playCascadeTrigger();
        if (this.vfx) this.vfx.spawnBloomRipple(window.innerWidth / 2, window.innerHeight / 2, '#10b981');
    }

    stepSimulation() {
        this.day++;
        this.energyAvailable = Math.min(150, this.energyAvailable + 25);

        // Process grid dynamics (Lotka-Volterra + Lindeman thermodynamic constraints)
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                const cell = this.grid[r][c];

                // 1. Producers grow based on soil health & solar flux
                const prodGrowth = (cell.soilHealth / 100) * 8 - (cell.herbivores * 0.12);
                cell.producers = Math.min(100, Math.max(0, cell.producers + prodGrowth));

                // 2. Herbivores eat producers (Starve if producers < 10)
                if (cell.producers > 15) {
                    const herbGrowth = (cell.producers * 0.08) - (cell.predators * 0.15) - (cell.apex * 0.25);
                    cell.herbivores = Math.min(100, Math.max(0, cell.herbivores + herbGrowth));
                } else {
                    cell.herbivores = Math.max(0, cell.herbivores - 8); // Starvation!
                }

                // 3. Predators eat herbivores
                if (cell.herbivores > 10) {
                    const predGrowth = (cell.herbivores * 0.06) - (cell.apex * 0.1);
                    cell.predators = Math.min(100, Math.max(0, cell.predators + predGrowth));
                } else {
                    cell.predators = Math.max(0, cell.predators - 5);
                }

                // 4. Apex predators require sufficient prey (Lindeman 10% rule)
                if (cell.herbivores + cell.predators > 20) {
                    cell.apex = Math.min(100, Math.max(0, cell.apex + 1));
                } else if (cell.apex > 0) {
                    cell.apex = Math.max(0, cell.apex - 2); // Apex famine
                }

                // 5. Invasive species spreading
                if (cell.invasive > 0) {
                    cell.invasive = Math.min(100, cell.invasive + 4);
                    cell.producers = Math.max(0, cell.producers - 3);
                    cell.soilHealth = Math.max(0, cell.soilHealth - 2);
                }
            }
        }

        // Random chance of invasive outbreak in endless/survival
        if (Math.random() < 0.15 && this.invasiveThreats.length > 0) {
            const randR = Math.floor(Math.random() * this.gridSize);
            const randC = Math.floor(Math.random() * this.gridSize);
            if (this.grid[randR][randC].invasive === 0) {
                this.grid[randR][randC].invasive = 25;
                if (this.audio) this.audio.playInvasiveAlert();
            }
        }

        this.calculateMetrics();
    }

    getNeighbors(r, c) {
        const neighbors = [];
        const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        offsets.forEach(([dr, dc]) => {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < this.gridSize && nc >= 0 && nc < this.gridSize) {
                neighbors.push(this.grid[nr][nc]);
            }
        });
        return neighbors;
    }

    calculateMetrics() {
        let totalProducers = 0;
        let totalHerbivores = 0;
        let totalPredators = 0;
        let totalApex = 0;
        let totalInvasive = 0;
        let totalSoil = 0;
        const totalCells = this.gridSize * this.gridSize;

        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                const cell = this.grid[r][c];
                totalProducers += cell.producers;
                totalHerbivores += cell.herbivores;
                totalPredators += cell.predators;
                totalApex += cell.apex;
                totalInvasive += cell.invasive;
                totalSoil += cell.soilHealth;
            }
        }

        const avgProducers = totalProducers / totalCells;
        const avgHerbivores = totalHerbivores / totalCells;
        const avgPredators = totalPredators / totalCells;
        const avgApex = totalApex / totalCells;
        const avgInvasive = totalInvasive / totalCells;
        const avgSoil = totalSoil / totalCells;

        // Shannon-Wiener inspired Biodiversity Index
        const richness = (avgProducers > 15 ? 1 : 0) + (avgHerbivores > 10 ? 1 : 0) + (avgPredators > 5 ? 1 : 0) + (avgApex > 2 ? 1 : 0);
        this.biodiversityScore = Math.round((richness * 20) + (avgSoil * 0.2) - (avgInvasive * 0.5));

        return {
            day: this.day,
            energyAvailable: this.energyAvailable,
            biodiversityScore: Math.max(0, this.biodiversityScore),
            avgProducers: Math.round(avgProducers),
            avgHerbivores: Math.round(avgHerbivores),
            avgPredators: Math.round(avgPredators),
            avgApex: Math.round(avgApex),
            avgInvasive: Math.round(avgInvasive),
            avgSoil: Math.round(avgSoil)
        };
    }
}
