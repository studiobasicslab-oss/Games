/**
 * ChronoTrace: The Anachronism Paradox
 * Core Game Controller & Interactive SVG Graph Visualizer
 */

class ChronoTraceApp {
    constructor() {
        this.currentMode = 'daily'; // 'daily', 'campaign', 'fog', 'codex'
        this.graphEngine = null;
        this.currentPath = []; // array of node IDs
        this.traversedEdges = []; // array of { from, to, valid }
        this.paradoxCount = 0;
        this.maxFogHp = 3;
        this.currentFogHp = 3;
        this.fogDepth = 1;
        this.selectedChapterId = 'chapter_1';
        this.currentDailyDate = this.getTodayDateString();
        
        // Active Relic State
        this.activeRelic = null; // 'lens', 'shield', 'glimpse'
        this.shieldActive = false;

        // Pan & Zoom graph state
        this.panX = 0;
        this.panY = 0;
        this.zoom = 1.0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;

        this.selectedNodeForInspect = null;
        this.timerInterval = null;
        this.timeElapsedSeconds = 0;
    }

    getTodayDateString() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    init() {
        // Initialize VFX background
        const bgCanvas = document.getElementById('vfx-canvas');
        if (bgCanvas && window.vfxEngine) {
            window.vfxEngine.init(bgCanvas);
        }

        this.bindEvents();
        this.updateHUD();
        this.setMode('daily');
    }

    bindEvents() {
        // Mode Tabs
        document.querySelectorAll('.mode-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                if (mode) this.setMode(mode);
            });
        });

        // Audio Mute Button
        const audioBtn = document.getElementById('btn-toggle-audio');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                const isMuted = window.audioEngine.toggleMute();
                audioBtn.innerHTML = isMuted ? '🔇' : '🔊';
                audioBtn.title = isMuted ? 'Unmute Sound FX' : 'Mute Sound FX';
            });
        }

        // Help Modal Button
        const helpBtn = document.getElementById('btn-help');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showModal('modal-help'));
        }

        // Codex Button
        const codexBtn = document.getElementById('btn-codex');
        if (codexBtn) {
            codexBtn.addEventListener('click', () => this.setMode('codex'));
        }

        // Modal Close Buttons
        document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el) {
                    this.closeAllModals();
                }
            });
        });

        // Graph pan and zoom events
        const graphViewport = document.getElementById('graph-viewport');
        if (graphViewport) {
            graphViewport.addEventListener('mousedown', (e) => this.onGraphMouseDown(e));
            window.addEventListener('mousemove', (e) => this.onGraphMouseMove(e));
            window.addEventListener('mouseup', () => this.onGraphMouseUp());
            graphViewport.addEventListener('wheel', (e) => this.onGraphWheel(e), { passive: false });

            // Touch support for mobile devices
            graphViewport.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
            graphViewport.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
            graphViewport.addEventListener('touchend', () => this.onGraphMouseUp());
        }

        // Zoom controls
        const btnZoomIn = document.getElementById('btn-zoom-in');
        const btnZoomOut = document.getElementById('btn-zoom-out');
        const btnZoomReset = document.getElementById('btn-zoom-reset');

        if (btnZoomIn) btnZoomIn.addEventListener('click', () => this.applyZoom(0.15));
        if (btnZoomOut) btnZoomOut.addEventListener('click', () => this.applyZoom(-0.15));
        if (btnZoomReset) btnZoomReset.addEventListener('click', () => this.resetPanZoom());

        // Reset/Undo buttons
        const btnResetPath = document.getElementById('btn-reset-path');
        const btnUndoStep = document.getElementById('btn-undo-step');
        if (btnResetPath) btnResetPath.addEventListener('click', () => this.resetCurrentPath());
        if (btnUndoStep) btnUndoStep.addEventListener('click', () => this.undoLastStep());

        // Relic Buttons in Fog Mode
        document.querySelectorAll('.relic-card-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const relicType = e.currentTarget.dataset.relic;
                this.useRelic(relicType);
            });
        });

        // Daily Date Picker
        const dailyDateInput = document.getElementById('daily-date-picker');
        if (dailyDateInput) {
            dailyDateInput.value = this.currentDailyDate;
            dailyDateInput.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.currentDailyDate = e.target.value;
                    this.loadDailyMode();
                }
            });
        }

        // Daily Share Button in victory modal
        const btnShareDaily = document.getElementById('btn-share-daily-card');
        if (btnShareDaily) {
            btnShareDaily.addEventListener('click', () => this.shareDailyResults());
        }
    }

    setMode(mode) {
        this.currentMode = mode;
        
        // Update nav buttons
        document.querySelectorAll('.mode-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // View Visibility
        const graphContainer = document.getElementById('graph-main-container');
        const codexView = document.getElementById('codex-container');
        const campaignChapterBar = document.getElementById('campaign-chapter-bar');
        const fogHudBar = document.getElementById('fog-hud-bar');
        const dailyHudBar = document.getElementById('daily-hud-bar');

        if (mode === 'codex') {
            if (graphContainer) graphContainer.style.display = 'none';
            if (codexView) codexView.style.display = 'block';
            this.renderCodexGallery();
            return;
        }

        if (graphContainer) graphContainer.style.display = 'flex';
        if (codexView) codexView.style.display = 'none';

        if (campaignChapterBar) campaignChapterBar.style.display = mode === 'campaign' ? 'flex' : 'none';
        if (fogHudBar) fogHudBar.style.display = mode === 'fog' ? 'flex' : 'none';
        if (dailyHudBar) dailyHudBar.style.display = mode === 'daily' ? 'flex' : 'none';

        if (mode === 'daily') {
            this.loadDailyMode();
        } else if (mode === 'campaign') {
            this.loadCampaignMode();
        } else if (mode === 'fog') {
            this.loadFogMode();
        }
    }

    loadDailyMode() {
        this.startTimer();
        const dailyData = window.GameModesManager.generateDailyGraph(this.currentDailyDate);
        this.graphEngine = dailyData.engine;
        
        // Layout nodes
        this.graphEngine.applyLayeredLayout(960, 560);
        this.initPathWithOrigin();
        this.renderGraph();
        this.updateHUD();

        // Update info panel
        const titleEl = document.getElementById('mission-mode-title');
        const subEl = document.getElementById('mission-mode-sub');
        if (titleEl) titleEl.innerText = `Daily Timeline Web (#${this.currentDailyDate})`;
        if (subEl) subEl.innerText = `Weave a seamless causal path from ${dailyData.origin.title} to ${dailyData.culmination.title}.`;
    }

    loadCampaignMode() {
        this.startTimer();
        const chapters = window.GameModesManager.campaignChapters;
        this.renderCampaignChapterSelector();

        const chapterData = window.GameModesManager.buildCampaignGraph(this.selectedChapterId);
        if (chapterData) {
            this.graphEngine = chapterData.engine;
            this.graphEngine.applyLayeredLayout(960, 560);
            this.initPathWithOrigin();
            this.renderGraph();
            this.updateHUD();

            const titleEl = document.getElementById('mission-mode-title');
            const subEl = document.getElementById('mission-mode-sub');
            if (titleEl) titleEl.innerText = chapterData.chapter.title;
            if (subEl) subEl.innerText = chapterData.chapter.description;
        }
    }

    loadFogMode() {
        this.startTimer();
        this.currentFogHp = this.maxFogHp;
        this.fogDepth = 1;
        
        // Generate random puzzle for Fog mode
        this.graphEngine = window.GraphEngine.generateRandomPuzzle(window.HISTORICAL_EVENTS, 14, 2.5);
        this.graphEngine.applyLayeredLayout(960, 560);
        this.initPathWithOrigin();
        this.renderGraph();
        this.updateHUD();

        const titleEl = document.getElementById('mission-mode-title');
        const subEl = document.getElementById('mission-mode-sub');
        if (titleEl) titleEl.innerText = `Fog of Time — Sector ${this.fogDepth}`;
        if (subEl) subEl.innerText = `Traverse uncharted temporal horizons. Use Relics wisely to evade paradox rift collapse.`;
    }

    renderCampaignChapterSelector() {
        const bar = document.getElementById('campaign-chapter-list');
        if (!bar) return;

        bar.innerHTML = '';
        const chapters = window.GameModesManager.campaignChapters;
        const progress = window.progressionManager.state.campaignProgress;

        chapters.forEach((ch, idx) => {
            const chState = progress[ch.id] || (idx === 0 ? { unlocked: true, stars: 0 } : { unlocked: false, stars: 0 });
            const btn = document.createElement('button');
            btn.className = `chapter-select-btn ${ch.id === this.selectedChapterId ? 'active' : ''} ${!chState.unlocked ? 'locked' : ''}`;
            
            const starIcons = '⭐'.repeat(chState.stars || 0) + '☆'.repeat(3 - (chState.stars || 0));
            btn.innerHTML = `
                <div class="ch-num">${idx + 1}</div>
                <div class="ch-info">
                    <div class="ch-name">${ch.title.split(':')[1] || ch.title}</div>
                    <div class="ch-stars">${chState.unlocked ? starIcons : '🔒 Locked'}</div>
                </div>
            `;

            if (chState.unlocked) {
                btn.addEventListener('click', () => {
                    this.selectedChapterId = ch.id;
                    this.loadCampaignMode();
                });
            }

            bar.appendChild(btn);
        });
    }

    initPathWithOrigin() {
        this.currentPath = [this.graphEngine.startNodeId];
        this.traversedEdges = [];
        this.paradoxCount = 0;
        this.resetPanZoom();

        // Reveal Origin event in Codex
        const startNode = this.graphEngine.nodes.get(this.graphEngine.startNodeId);
        if (startNode) {
            startNode.yearRevealed = true;
            window.progressionManager.unlockCodexEvent(startNode.id);
            this.inspectNode(startNode);
        }
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timeElapsedSeconds = 0;
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timeElapsedSeconds++;
            this.updateTimerDisplay();
        }, 1000);
    }

    updateTimerDisplay() {
        const timerEl = document.getElementById('hud-timer-display');
        if (!timerEl) return;
        const m = Math.floor(this.timeElapsedSeconds / 60);
        const s = this.timeElapsedSeconds % 60;
        timerEl.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    /**
     * SVG & Canvas Graph Rendering
     */
    renderGraph() {
        const svg = document.getElementById('graph-svg-layer');
        if (!svg || !this.graphEngine) return;

        svg.innerHTML = ''; // clear previous render

        const currentNodeId = this.currentPath[this.currentPath.length - 1];
        const currentNode = this.graphEngine.nodes.get(currentNodeId);

        // Group container with pan & zoom transform
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('id', 'graph-zoom-group');
        g.setAttribute('transform', `translate(${this.panX}, ${this.panY}) scale(${this.zoom})`);
        svg.appendChild(g);

        // Defs for glowing filters and gradients
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="glow-paradox" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <linearGradient id="active-path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00f5d4" />
                <stop offset="50%" stop-color="#9b5de5" />
                <stop offset="100%" stop-color="#fee440" />
            </linearGradient>
        `;
        g.appendChild(defs);

        // 1. Draw Edges
        this.graphEngine.edges.forEach(edge => {
            const nodeA = this.graphEngine.nodes.get(edge.from);
            const nodeB = this.graphEngine.nodes.get(edge.to);
            if (!nodeA || !nodeB) return;

            // Fog check: edge is hidden if both nodes are shrouded in Fog mode
            if (this.currentMode === 'fog') {
                const aVisible = this.isNodeVisibleInFog(nodeA.id);
                const bVisible = this.isNodeVisibleInFog(nodeB.id);
                if (!aVisible && !bVisible) return;
            }

            const isTraversed = this.isEdgeInTraversedPath(nodeA.id, nodeB.id);
            const isFrontier = (nodeA.id === currentNodeId || nodeB.id === currentNodeId);

            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            // Smooth bezier curve connecting nodes
            const midX = (nodeA.x + nodeB.x) / 2;
            const d = `M ${nodeA.x} ${nodeA.y} C ${midX} ${nodeA.y}, ${midX} ${nodeB.y}, ${nodeB.x} ${nodeB.y}`;
            pathEl.setAttribute('d', d);

            if (isTraversed) {
                pathEl.setAttribute('class', 'graph-edge traversed');
            } else if (isFrontier) {
                pathEl.setAttribute('class', 'graph-edge frontier');
            } else {
                pathEl.setAttribute('class', 'graph-edge default');
            }

            g.appendChild(pathEl);
        });

        // 2. Draw Nodes
        this.graphEngine.nodes.forEach(node => {
            // Fog Mode visibility test
            const isFogShrouded = this.currentMode === 'fog' && !this.isNodeVisibleInFog(node.id);
            const isCurrent = node.id === currentNodeId;
            const isVisited = this.currentPath.includes(node.id);
            const isNeighbor = currentNode && currentNode.neighbors.has(node.id);
            const isEnd = node.isCulmination;
            const isStart = node.isOrigin;

            const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            nodeGroup.setAttribute('transform', `translate(${node.x}, ${node.y})`);
            nodeGroup.setAttribute('class', `graph-node-group ${isCurrent ? 'current-active' : ''} ${isVisited ? 'visited' : ''} ${isNeighbor && !isVisited ? 'valid-frontier' : ''} ${isFogShrouded ? 'fog-shrouded' : ''}`);
            nodeGroup.setAttribute('data-id', node.id);

            // Node Outer Aura Ring
            if (isCurrent || isEnd) {
                const aura = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                aura.setAttribute('r', isCurrent ? '34' : '30');
                aura.setAttribute('class', isCurrent ? 'node-aura current' : 'node-aura end');
                nodeGroup.appendChild(aura);
            }

            // Node Base Circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', '24');
            circle.setAttribute('class', `node-circle ${isCurrent ? 'current' : isVisited ? 'visited' : isNeighbor ? 'frontier' : 'unvisited'}`);
            circle.setAttribute('stroke', window.HISTORICAL_ERAS[node.event.era]?.color || '#00f5d4');
            nodeGroup.appendChild(circle);

            // Category Icon Badge
            const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            iconText.setAttribute('text-anchor', 'middle');
            iconText.setAttribute('dy', '0.35em');
            iconText.setAttribute('class', 'node-icon-text');
            iconText.textContent = isFogShrouded ? '🌫️' : node.event.icon;
            nodeGroup.appendChild(iconText);

            // Year Badge (Revealed when visited or when Oracle lens used)
            if (!isFogShrouded) {
                const yearBadge = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                yearBadge.setAttribute('text-anchor', 'middle');
                yearBadge.setAttribute('y', '38');
                yearBadge.setAttribute('class', `node-year-badge ${node.yearRevealed ? 'revealed' : 'hidden-year'}`);
                yearBadge.textContent = node.yearRevealed ? node.event.yearDisplay : '???';
                nodeGroup.appendChild(yearBadge);

                // Title label snippet
                const titleLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                titleLabel.setAttribute('text-anchor', 'middle');
                titleLabel.setAttribute('y', '-32');
                titleLabel.setAttribute('class', 'node-title-label');
                const truncatedTitle = node.event.title.length > 22 ? node.event.title.substring(0, 20) + '…' : node.event.title;
                titleLabel.textContent = truncatedTitle;
                nodeGroup.appendChild(titleLabel);
            }

            // Node Interactivity
            nodeGroup.addEventListener('mouseenter', () => {
                if (!isFogShrouded) {
                    window.audioEngine.playNodeHover(1.0 + (this.currentPath.indexOf(node.id) * 0.1));
                    this.inspectNode(node);
                }
            });

            nodeGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.isDragging) return;
                this.handleNodeClick(node.id);
            });

            g.appendChild(nodeGroup);
        });

        this.renderActivePathStrip();
    }

    isNodeVisibleInFog(nodeId) {
        if (this.currentMode !== 'fog') return true;
        // Node is visible if it is in the current path, or is directly adjacent to current node
        const currentNodeId = this.currentPath[this.currentPath.length - 1];
        if (this.currentPath.includes(nodeId)) return true;
        
        const curr = this.graphEngine.nodes.get(currentNodeId);
        if (curr && curr.neighbors.has(nodeId)) return true;

        return false;
    }

    isEdgeInTraversedPath(idA, idB) {
        for (let i = 0; i < this.currentPath.length - 1; i++) {
            const u = this.currentPath[i];
            const v = this.currentPath[i + 1];
            if ((u === idA && v === idB) || (u === idB && v === idA)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Node Click & Step Validation (Graph Traversal + Chronological Rule)
     */
    handleNodeClick(targetNodeId) {
        const currentNodeId = this.currentPath[this.currentPath.length - 1];
        const currentNode = this.graphEngine.nodes.get(currentNodeId);
        const targetNode = this.graphEngine.nodes.get(targetNodeId);

        if (!currentNode || !targetNode) return;

        // If clicking currently active node or already visited node in path, just inspect it
        if (this.currentPath.includes(targetNodeId)) {
            this.inspectNode(targetNode);
            return;
        }

        // Check if target is a connected neighbor on the puzzle map
        if (!currentNode.neighbors.has(targetNodeId)) {
            this.showToast('⚠️ Nodes are not directly connected in the temporal web!', 'warning');
            return;
        }

        // VALIDATION: RULE OF DIRECTIONALITY
        // Step is valid iff Year(A) <= Year(B)
        const stepValidation = this.graphEngine.validateStep(currentNodeId, targetNodeId);

        if (stepValidation.valid) {
            // SUCCESSFUL CHRONOLOGICAL STEP!
            this.currentPath.push(targetNodeId);
            targetNode.yearRevealed = true;
            window.progressionManager.unlockCodexEvent(targetNode.id);

            // Play musical pentatonic audio chime
            window.audioEngine.playNodeSelect(this.currentPath.length);

            // VFX burst at target node
            const screenCoords = this.nodeToScreenCoords(targetNode);
            window.vfxEngine.triggerNodeBurst(screenCoords.x, screenCoords.y, window.CATEGORIES[targetNode.category]?.color || '#00f5d4', 28);

            this.inspectNode(targetNode);
            this.renderGraph();
            this.updateHUD();

            // Check Win Condition: Reached Culmination Node
            if (targetNode.isCulmination) {
                this.handleTimelineVictory();
            }

        } else {
            // ANACHRONISM PARADOX TRAP!
            this.handleParadoxTrap(currentNode, targetNode, stepValidation);
        }
    }

    handleParadoxTrap(fromNode, toNode, validation) {
        // Trigger Paradox audio and screen-shake fissure
        window.audioEngine.playParadoxTrap();
        const screenCoords = this.nodeToScreenCoords(toNode);
        window.vfxEngine.triggerParadoxFracture(screenCoords.x, screenCoords.y);

        this.paradoxCount++;
        window.progressionManager.state.totalParadoxesTriggered++;

        // Reveal the trap date so the player learns the historical timeline
        toNode.yearRevealed = true;

        if (this.currentMode === 'fog') {
            // In Fog mode, deduct HP unless Shield is active
            if (this.shieldActive) {
                this.shieldActive = false;
                this.showToast('🛡️ Paradox Shield absorbed the timeline rift!', 'success');
            } else {
                this.currentFogHp--;
                this.showToast(`💥 Anachronism Paradox! Rift stability: ${this.currentFogHp}/${this.maxFogHp}`, 'danger');
                if (this.currentFogHp <= 0) {
                    this.handleTimelineCollapse();
                    return;
                }
            }
        } else {
            this.showToast(`💥 Paradox: "${toNode.event.title}" (${toNode.event.yearDisplay}) occurred BEFORE "${fromNode.event.title}" (${fromNode.event.yearDisplay})!`, 'danger');
        }

        this.renderGraph();
        this.updateHUD();
    }

    undoLastStep() {
        if (this.currentPath.length <= 1) return;
        this.currentPath.pop();
        window.audioEngine.playUndo();
        
        const currentActive = this.graphEngine.nodes.get(this.currentPath[this.currentPath.length - 1]);
        if (currentActive) this.inspectNode(currentActive);
        
        this.renderGraph();
        this.updateHUD();
    }

    resetCurrentPath() {
        if (this.graphEngine) {
            this.initPathWithOrigin();
            this.renderGraph();
            this.updateHUD();
        }
    }

    useRelic(relicType) {
        const relics = window.progressionManager.state.relicsInventory;
        if (!relics[relicType] || relics[relicType] <= 0) {
            this.showToast(`⚠️ No ${relicType} relics remaining in inventory!`, 'warning');
            return;
        }

        const currentNodeId = this.currentPath[this.currentPath.length - 1];
        const currentNode = this.graphEngine.nodes.get(currentNodeId);
        if (!currentNode) return;

        if (relicType === 'lens') {
            // Reveal 1 unrevealed neighbor's year
            const unrevealedNeighbors = Array.from(currentNode.neighbors)
                .map(id => this.graphEngine.nodes.get(id))
                .filter(n => n && !n.yearRevealed);

            if (unrevealedNeighbors.length === 0) {
                this.showToast('🔍 All adjacent timestamps are already revealed!', 'info');
                return;
            }

            const target = unrevealedNeighbors[0];
            target.yearRevealed = true;
            relics.lens--;
            window.audioEngine.playRelicUse();
            this.showToast(`🔍 Chronometer Lens revealed: ${target.event.title} (${target.event.yearDisplay})!`, 'success');

        } else if (relicType === 'shield') {
            this.shieldActive = true;
            relics.shield--;
            window.audioEngine.playRelicUse();
            this.showToast('🛡️ Paradox Shield activated for your next step!', 'success');

        } else if (relicType === 'anchor') {
            relics.anchor--;
            this.undoLastStep();
            window.audioEngine.playRelicUse();
            this.showToast('⏳ Temporal Anchor rewound your previous step!', 'success');

        } else if (relicType === 'glimpse') {
            // Highlights all valid forward neighbors
            relics.glimpse--;
            window.audioEngine.playRelicUse();
            let validCount = 0;
            currentNode.neighbors.forEach(nId => {
                const neighbor = this.graphEngine.nodes.get(nId);
                if (neighbor && currentNode.year <= neighbor.year) {
                    neighbor.yearRevealed = true;
                    validCount++;
                }
            });
            this.showToast(`👁️ Oracle\'s Glimpse illuminated ${validCount} valid forward paths!`, 'success');
        }

        window.progressionManager.saveState();
        this.renderGraph();
        this.updateHUD();
    }

    /**
     * Victory & Defeat Handlers
     */
    handleTimelineVictory() {
        clearInterval(this.timerInterval);
        window.audioEngine.playVictory();

        const scoreData = this.graphEngine.calculatePathScore(this.currentPath, this.paradoxCount);
        
        // Award XP and check achievements
        window.progressionManager.unlockAchievement('first_timeline');
        if (this.paradoxCount === 0) {
            window.progressionManager.unlockAchievement('flawless_weaver');
        }

        // Check science synergy
        if (scoreData.categoryStreaks >= 3) {
            window.progressionManager.unlockAchievement('science_synergy');
        }

        if (this.currentMode === 'campaign') {
            const ch = window.GameModesManager.campaignChapters.find(c => c.id === this.selectedChapterId);
            let stars = 1;
            if (ch && ch.starScores) {
                if (scoreData.totalScore >= ch.starScores[2]) stars = 3;
                else if (scoreData.totalScore >= ch.starScores[1]) stars = 2;
            }
            window.progressionManager.recordCampaignVictory(this.selectedChapterId, scoreData.totalScore, stars);
        } else if (this.currentMode === 'daily') {
            window.progressionManager.state.dailyCompletions[this.currentDailyDate] = {
                score: scoreData.totalScore,
                path: this.currentPath,
                paradoxes: this.paradoxCount
            };
            window.progressionManager.saveState();
        }

        this.showVictoryModal(scoreData);
    }

    handleTimelineCollapse() {
        clearInterval(this.timerInterval);
        const collapseModal = document.getElementById('modal-collapse');
        if (collapseModal) {
            this.showModal('modal-collapse');
        }
    }

    showVictoryModal(scoreData) {
        const modal = document.getElementById('modal-victory');
        if (!modal) return;

        const scoreVal = document.getElementById('victory-score-val');
        const nodesVal = document.getElementById('victory-nodes-count');
        const paradoxVal = document.getElementById('victory-paradox-count');
        const synergyVal = document.getElementById('victory-synergy-val');
        const timelineList = document.getElementById('victory-timeline-sequence');

        if (scoreVal) scoreVal.innerText = `${scoreData.totalScore} pts`;
        if (nodesVal) nodesVal.innerText = scoreData.nodesTraversed;
        if (paradoxVal) paradoxVal.innerText = this.paradoxCount;
        if (synergyVal) synergyVal.innerText = `+${scoreData.synergyBonus} pts`;

        // Render timeline sequence cards
        if (timelineList) {
            timelineList.innerHTML = '';
            this.currentPath.forEach((nodeId, idx) => {
                const node = this.graphEngine.nodes.get(nodeId);
                if (!node) return;
                const card = document.createElement('div');
                card.className = 'victory-step-card';
                card.innerHTML = `
                    <div class="step-num">${idx + 1}</div>
                    <div class="step-icon">${node.event.icon}</div>
                    <div class="step-info">
                        <div class="step-title">${node.event.title}</div>
                        <div class="step-year">${node.event.yearDisplay}</div>
                    </div>
                `;
                timelineList.appendChild(card);
            });
        }

        this.showModal('modal-victory');
    }

    shareDailyResults() {
        const scoreData = this.graphEngine.calculatePathScore(this.currentPath, this.paradoxCount);
        const cardText = window.GameModesManager.generateShareCard(
            this.currentDailyDate,
            this.currentPath,
            this.paradoxCount,
            scoreData.totalScore,
            true
        );

        if (navigator.clipboard) {
            navigator.clipboard.writeText(cardText).then(() => {
                this.showToast('📋 Daily Share Card copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('📋 Copied!', 'success');
            });
        }
    }

    /**
     * Node Inspector Panel
     */
    inspectNode(node) {
        this.selectedNodeForInspect = node;
        const panel = document.getElementById('node-inspect-card');
        if (!panel || !node) return;

        const iconEl = document.getElementById('inspect-icon');
        const titleEl = document.getElementById('inspect-title');
        const yearEl = document.getElementById('inspect-year');
        const eraEl = document.getElementById('inspect-era');
        const descEl = document.getElementById('inspect-desc');
        const loreEl = document.getElementById('inspect-lore');
        const tagsEl = document.getElementById('inspect-tags');

        if (iconEl) iconEl.innerText = node.event.icon;
        if (titleEl) titleEl.innerText = node.event.title;
        if (yearEl) yearEl.innerText = node.yearRevealed ? node.event.yearDisplay : '??? Hidden Timestamp';
        if (eraEl) {
            const era = window.HISTORICAL_ERAS[node.event.era];
            eraEl.innerText = era ? `${era.name} (${era.span})` : node.event.era;
            eraEl.style.color = era?.color || '#00f5d4';
        }
        if (descEl) descEl.innerText = node.event.description;
        if (loreEl) loreEl.innerText = `"${node.event.loreSnippet}"`;

        if (tagsEl) {
            tagsEl.innerHTML = '';
            (node.event.thematicTags || []).forEach(tag => {
                const span = document.createElement('span');
                span.className = 'inspect-tag';
                span.innerText = `#${tag}`;
                tagsEl.appendChild(span);
            });
        }
    }

    renderActivePathStrip() {
        const strip = document.getElementById('active-path-strip');
        if (!strip || !this.graphEngine) return;

        strip.innerHTML = '';
        this.currentPath.forEach((nodeId, idx) => {
            const node = this.graphEngine.nodes.get(nodeId);
            if (!node) return;

            const chip = document.createElement('div');
            chip.className = `path-chip ${idx === this.currentPath.length - 1 ? 'active' : ''}`;
            chip.innerHTML = `
                <span class="chip-icon">${node.event.icon}</span>
                <span class="chip-title">${node.event.title}</span>
                <span class="chip-year">${node.event.yearDisplay}</span>
            `;
            chip.addEventListener('click', () => this.inspectNode(node));
            strip.appendChild(chip);

            if (idx < this.currentPath.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'path-arrow';
                arrow.innerText = '➔';
                strip.appendChild(arrow);
            }
        });
    }

    /**
     * Codex Gallery Renderer
     */
    renderCodexGallery() {
        const grid = document.getElementById('codex-grid');
        if (!grid) return;

        grid.innerHTML = '';
        const unlockedIds = window.progressionManager.state.unlockedCodex || [];
        const allEvents = [...window.HISTORICAL_EVENTS].sort((a, b) => a.year - b.year);

        const countEl = document.getElementById('codex-unlocked-count');
        if (countEl) countEl.innerText = `${unlockedIds.length} / ${allEvents.length}`;

        allEvents.forEach(ev => {
            const isUnlocked = unlockedIds.includes(ev.id);
            const card = document.createElement('div');
            card.className = `codex-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            if (isUnlocked) {
                card.innerHTML = `
                    <div class="codex-card-header">
                        <span class="codex-icon">${ev.icon}</span>
                        <span class="codex-year">${ev.yearDisplay}</span>
                    </div>
                    <h3 class="codex-title">${ev.title}</h3>
                    <p class="codex-desc">${ev.description}</p>
                    <div class="codex-lore">"${ev.loreSnippet}"</div>
                `;
            } else {
                card.innerHTML = `
                    <div class="codex-card-header">
                        <span class="codex-icon">🔒</span>
                        <span class="codex-year">???</span>
                    </div>
                    <h3 class="codex-title">Undiscovered Timeline Node</h3>
                    <p class="codex-desc">Traverse the fractured web in Daily or Campaign modes to record this event in the Codex.</p>
                `;
            }
            grid.appendChild(card);
        });
    }

    /**
     * HUD and State updates
     */
    updateHUD() {
        const state = window.progressionManager.state;
        
        // Player stats
        const lvlEl = document.getElementById('hud-level-val');
        const titleEl = document.getElementById('hud-weaver-title');
        const paradoxCountEl = document.getElementById('hud-paradox-val');
        const fogHpEl = document.getElementById('hud-fog-hp');
        const scoreEl = document.getElementById('hud-score-val');

        if (lvlEl) lvlEl.innerText = state.level;
        if (titleEl) titleEl.innerText = state.title;
        if (paradoxCountEl) paradoxCountEl.innerText = this.paradoxCount;
        if (fogHpEl) fogHpEl.innerText = `${this.currentFogHp}/${this.maxFogHp}`;

        if (scoreEl && this.graphEngine) {
            const scoreData = this.graphEngine.calculatePathScore(this.currentPath, this.paradoxCount);
            scoreEl.innerText = scoreData.totalScore;
        }

        // Relics counts in Fog HUD
        const relics = state.relicsInventory || {};
        ['lens', 'shield', 'anchor', 'glimpse'].forEach(r => {
            const countEl = document.getElementById(`relic-count-${r}`);
            if (countEl) countEl.innerText = relics[r] || 0;
        });
    }

    /**
     * Pan & Zoom Controls
     */
    onGraphMouseDown(e) {
        this.isDragging = true;
        this.dragStartX = e.clientX - this.panX;
        this.dragStartY = e.clientY - this.panY;
    }

    onGraphMouseMove(e) {
        if (!this.isDragging) return;
        this.panX = e.clientX - this.dragStartX;
        this.panY = e.clientY - this.dragStartY;
        this.applyTransform();
    }

    onGraphMouseUp() {
        this.isDragging = false;
    }

    onTouchStart(e) {
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.dragStartX = e.touches[0].clientX - this.panX;
            this.dragStartY = e.touches[0].clientY - this.panY;
        }
    }

    onTouchMove(e) {
        if (!this.isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        this.panX = e.touches[0].clientX - this.dragStartX;
        this.panY = e.touches[0].clientY - this.dragStartY;
        this.applyTransform();
    }

    onGraphWheel(e) {
        e.preventDefault();
        const zoomDelta = e.deltaY < 0 ? 0.1 : -0.1;
        this.applyZoom(zoomDelta);
    }

    applyZoom(delta) {
        this.zoom = Math.max(0.6, Math.min(2.0, this.zoom + delta));
        this.applyTransform();
    }

    resetPanZoom() {
        this.panX = 0;
        this.panY = 0;
        this.zoom = 1.0;
        this.applyTransform();
    }

    applyTransform() {
        const g = document.getElementById('graph-zoom-group');
        if (g) {
            g.setAttribute('transform', `translate(${this.panX}, ${this.panY}) scale(${this.zoom})`);
        }
    }

    nodeToScreenCoords(node) {
        const svg = document.getElementById('graph-svg-layer');
        if (!svg) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const rect = svg.getBoundingClientRect();
        return {
            x: rect.left + this.panX + node.x * this.zoom,
            y: rect.top + this.panY + node.y * this.zoom
        };
    }

    /**
     * Modals and Toasts
     */
    showModal(modalId) {
        this.closeAllModals();
        const m = document.getElementById(modalId);
        if (m) m.classList.add('active');
    }

    closeAllModals() {
        document.querySelectorAll('.modal-wrapper').forEach(m => m.classList.remove('active'));
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-bubble toast-${type}`;
        toast.innerText = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
    window.chronoTraceApp = new ChronoTraceApp();
    window.chronoTraceApp.init();
});
