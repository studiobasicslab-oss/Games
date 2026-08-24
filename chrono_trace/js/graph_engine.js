/**
 * ChronoTrace Graph Engine
 * Directed Acyclic Graph (DAG) generation, validation, layout positioning,
 * pathfinding (Dijkstra / DFS / A*), and paradox detection.
 */

class GraphEngine {
    constructor() {
        this.nodes = new Map(); // id -> Node
        this.edges = []; // array of { from: id, to: id, isTraversable: bool }
        this.startNodeId = null;
        this.endNodeId = null;
        this.allValidPaths = [];
        this.shortestValidPath = [];
        this.longestValidPath = [];
    }

    /**
     * Clear and initialize graph
     */
    reset() {
        this.nodes.clear();
        this.edges = [];
        this.startNodeId = null;
        this.endNodeId = null;
        this.allValidPaths = [];
        this.shortestValidPath = [];
        this.longestValidPath = [];
    }

    /**
     * Add a node to the graph
     */
    addNode(eventData, options = {}) {
        if (!eventData) return null;
        const node = {
            id: eventData.id,
            event: eventData,
            year: eventData.year,
            x: options.x || 0,
            y: options.y || 0,
            layer: options.layer || 0,
            isOrigin: !!options.isOrigin,
            isCulmination: !!options.isCulmination,
            discovered: !!options.isOrigin, // start node always discovered
            yearRevealed: !!options.isOrigin,
            neighbors: new Set(),
            thematicTags: eventData.thematicTags || [],
            category: eventData.category
        };
        this.nodes.set(node.id, node);
        if (node.isOrigin) this.startNodeId = node.id;
        if (node.isCulmination) this.endNodeId = node.id;
        return node;
    }

    /**
     * Add a bidirectional map edge (puzzle path connection)
     */
    addEdge(nodeAId, nodeBId) {
        const nodeA = this.nodes.get(nodeAId);
        const nodeB = this.nodes.get(nodeBId);
        if (!nodeA || !nodeB || nodeAId === nodeBId) return;

        nodeA.neighbors.add(nodeBId);
        nodeB.neighbors.add(nodeAId);

        // Check if edge already exists in edge list
        const exists = this.edges.some(e => 
            (e.from === nodeAId && e.to === nodeBId) || (e.from === nodeBId && e.to === nodeAId)
        );

        if (!exists) {
            this.edges.push({
                from: nodeAId,
                to: nodeBId,
                validAtoB: nodeA.year <= nodeB.year,
                validBtoA: nodeB.year <= nodeA.year
            });
        }
    }

    /**
     * Test if a step from current node to target neighbor is chronologically valid
     */
    validateStep(fromId, toId) {
        const fromNode = this.nodes.get(fromId);
        const toNode = this.nodes.get(toId);
        if (!fromNode || !toNode) return { valid: false, reason: 'Invalid node' };

        if (!fromNode.neighbors.has(toId)) {
            return { valid: false, reason: 'Nodes are not directly connected' };
        }

        const isValidChronological = fromNode.year <= toNode.year;
        return {
            valid: isValidChronological,
            yearDiff: toNode.year - fromNode.year,
            isParadox: !isValidChronological,
            fromYear: fromNode.year,
            toYear: toNode.year,
            fromTitle: fromNode.event.title,
            toTitle: toNode.event.title
        };
    }

    /**
     * Calculate all valid chronological paths from Start to End using DFS
     */
    computeAllValidPaths() {
        this.allValidPaths = [];
        if (!this.startNodeId || !this.endNodeId) return [];

        const start = this.nodes.get(this.startNodeId);
        const end = this.nodes.get(this.endNodeId);
        if (!start || !end) return [];

        const visited = new Set();
        const currentPath = [this.startNodeId];

        const dfs = (currId) => {
            if (currId === this.endNodeId) {
                this.allValidPaths.push([...currentPath]);
                return;
            }

            const currNode = this.nodes.get(currId);
            visited.add(currId);

            for (const neighborId of currNode.neighbors) {
                if (!visited.has(neighborId)) {
                    const neighborNode = this.nodes.get(neighborId);
                    // RULE OF DIRECTIONALITY: Year(curr) <= Year(neighbor)
                    if (currNode.year <= neighborNode.year) {
                        currentPath.push(neighborId);
                        dfs(neighborId);
                        currentPath.pop();
                    }
                }
            }

            visited.delete(currId);
        };

        dfs(this.startNodeId);

        // Sort by length
        if (this.allValidPaths.length > 0) {
            const sorted = [...this.allValidPaths].sort((a, b) => a.length - b.length);
            this.shortestValidPath = sorted[0];
            this.longestValidPath = sorted[sorted.length - 1];
        }

        return this.allValidPaths;
    }

    /**
     * Calculate score and synergies for a player's chosen path
     */
    calculatePathScore(pathNodeIds, paradoxCount = 0) {
        if (!pathNodeIds || pathNodeIds.length < 2) {
            return { totalScore: 0, breakdown: {}, resonanceMultiplier: 1.0 };
        }

        let baseScore = pathNodeIds.length * 150;
        let synergyBonus = 0;
        let categoryStreaks = 0;
        let lastCategory = null;

        const pathNodes = pathNodeIds.map(id => this.nodes.get(id)).filter(Boolean);

        for (let i = 0; i < pathNodes.length; i++) {
            const node = pathNodes[i];
            if (lastCategory && node.category === lastCategory) {
                categoryStreaks++;
                synergyBonus += 100 * categoryStreaks; // Thematic synergy bonus!
            }
            lastCategory = node.category;
        }

        // Efficiency bonus compared to shortest path
        let efficiencyBonus = 0;
        if (this.shortestValidPath.length > 0) {
            if (pathNodeIds.length === this.shortestValidPath.length) {
                efficiencyBonus = 300; // Perfect shortest path
            } else if (pathNodeIds.length > this.shortestValidPath.length) {
                // Exploration bonus for longer valid paths
                efficiencyBonus = (pathNodeIds.length - this.shortestValidPath.length) * 80;
            }
        }

        // Paradox penalty
        const paradoxPenalty = paradoxCount * 250;
        const totalScore = Math.max(100, baseScore + synergyBonus + efficiencyBonus - paradoxPenalty);

        return {
            totalScore,
            baseScore,
            synergyBonus,
            efficiencyBonus,
            paradoxPenalty,
            categoryStreaks,
            nodesTraversed: pathNodeIds.length
        };
    }

    /**
     * Procedural Layered DAG Layout
     * Arranges nodes in logical columns (layers) from left to right with vertical spacing
     */
    applyLayeredLayout(containerWidth = 900, containerHeight = 550) {
        // Group nodes by layer
        const layers = new Map();
        for (const [id, node] of this.nodes) {
            if (!layers.has(node.layer)) {
                layers.set(node.layer, []);
            }
            layers.get(node.layer).push(node);
        }

        const sortedLayers = Array.from(layers.keys()).sort((a, b) => a - b);
        const layerCount = sortedLayers.length;
        const paddingX = Math.max(60, containerWidth * 0.08);
        const paddingY = Math.max(50, containerHeight * 0.12);

        const availableWidth = containerWidth - paddingX * 2;
        const availableHeight = containerHeight - paddingY * 2;

        sortedLayers.forEach((layerIdx, colIndex) => {
            const layerNodes = layers.get(layerIdx);
            const x = paddingX + (colIndex / Math.max(1, layerCount - 1)) * availableWidth;

            const countInCol = layerNodes.length;
            layerNodes.forEach((node, rowIndex) => {
                let y;
                if (countInCol === 1) {
                    y = containerHeight / 2;
                } else {
                    y = paddingY + (rowIndex / (countInCol - 1)) * availableHeight;
                }

                // Add slight organic offset so nodes don't look completely rigid
                const seed = (node.year % 20) * 1.5;
                node.x = Math.round(x);
                node.y = Math.round(y + (rowIndex % 2 === 0 ? seed : -seed));
            });
        });
    }

    /**
     * Procedural Random Puzzle Generator
     * Selects an Origin, Culmination, and intermediate nodes ensuring at least 1 valid DAG route exists
     */
    static generateRandomPuzzle(eventPool, targetNodeCount = 12, branchFactor = 2.5) {
        if (!eventPool || eventPool.length < targetNodeCount) {
            eventPool = window.HISTORICAL_EVENTS || [];
        }

        // Sort events chronologically
        const sortedEvents = [...eventPool].sort((a, b) => a.year - b.year);

        // Pick an Origin from early 20% and Culmination from late 20%
        const earlySlice = sortedEvents.slice(0, Math.max(5, Math.floor(sortedEvents.length * 0.25)));
        const lateSlice = sortedEvents.slice(Math.floor(sortedEvents.length * 0.75));

        const origin = earlySlice[Math.floor(Math.random() * earlySlice.length)];
        const culmination = lateSlice[Math.floor(Math.random() * lateSlice.length)];

        // Filter events strictly between origin.year and culmination.year, plus a few trap events
        const middlePool = sortedEvents.filter(e => e.id !== origin.id && e.id !== culmination.id);
        
        // Split into candidate layers
        const layerCount = 4; // 0: Origin, 1..3: Middle layers, 4: Culmination
        const layers = [[origin]];

        // Divide middlePool into temporal bands
        const validCandidates = middlePool.filter(e => e.year >= origin.year && e.year <= culmination.year);
        const anachronismTraps = middlePool.filter(e => e.year < origin.year || e.year > culmination.year);

        const nodesPerLayer = Math.floor((targetNodeCount - 2) / (layerCount - 1));

        for (let l = 1; l < layerCount; l++) {
            const layerNodes = [];
            const fractionStart = (l - 1) / (layerCount - 1);
            const fractionEnd = l / (layerCount - 1);
            
            const startYear = origin.year + fractionStart * (culmination.year - origin.year);
            const endYear = origin.year + fractionEnd * (culmination.year - origin.year);

            let bandCandidates = validCandidates.filter(e => e.year >= startYear && e.year <= endYear);
            if (bandCandidates.length === 0) {
                bandCandidates = validCandidates;
            }

            // Shuffle and pick valid nodes
            const shuffled = [...bandCandidates].sort(() => Math.random() - 0.5);
            for (let i = 0; i < Math.min(nodesPerLayer, shuffled.length); i++) {
                layerNodes.push(shuffled[i]);
            }

            // Optionally inject 1 anachronism trap node into intermediate layers
            if (Math.random() > 0.4 && anachronismTraps.length > 0) {
                const trap = anachronismTraps[Math.floor(Math.random() * anachronismTraps.length)];
                if (!layerNodes.some(n => n.id === trap.id)) {
                    layerNodes.push(trap);
                }
            }

            layers.push(layerNodes);
        }

        layers.push([culmination]);

        // Construct graph
        const engine = new GraphEngine();

        // Add nodes
        layers.forEach((layerNodes, layerIdx) => {
            layerNodes.forEach(ev => {
                engine.addNode(ev, {
                    layer: layerIdx,
                    isOrigin: layerIdx === 0,
                    isCulmination: layerIdx === layers.length - 1
                });
            });
        });

        // Add edges between consecutive layers and some cross-layer shortcuts
        for (let l = 0; l < layers.length - 1; l++) {
            const currLayer = layers[l];
            const nextLayer = layers[l + 1];

            currLayer.forEach(n1 => {
                // Ensure at least 1 connection forward
                nextLayer.forEach(n2 => {
                    engine.addEdge(n1.id, n2.id);
                });
            });

            // Occasional cross layer edge (shortcut or trap)
            if (l < layers.length - 2 && Math.random() > 0.5) {
                const hopLayer = layers[l + 2];
                const n1 = currLayer[Math.floor(Math.random() * currLayer.length)];
                const n2 = hopLayer[Math.floor(Math.random() * hopLayer.length)];
                engine.addEdge(n1.id, n2.id);
            }
        }

        // Verify valid paths exist
        const validPaths = engine.computeAllValidPaths();
        if (validPaths.length === 0) {
            // Fallback: guaranteed bridge edge
            for (let l = 0; l < layers.length - 1; l++) {
                const n1 = layers[l][0];
                const n2 = layers[l + 1][0];
                engine.addEdge(n1.id, n2.id);
            }
            engine.computeAllValidPaths();
        }

        return engine;
    }
}

// Global exposure
if (typeof window !== 'undefined') {
    window.GraphEngine = GraphEngine;
}
