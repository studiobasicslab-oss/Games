// ChronoTree: Universal Evolution Graph & Games Controller

(function () {
  'use strict';

  // ========================================================
  // DATA & STATE
  // ========================================================
  const data = window.UNIVERSAL_TREE_DATA || [];
  const epochs = window.CHRONO_EPOCHS || [];
  const alchemyRecipes = window.ALCHEMY_RECIPES || [];
  const startingElements = window.ALCHEMY_STARTING_ELEMENTS || [];
  const chronoQuestions = window.CHRONO_ORDER_ROUNDS || [];

  const nodeMap = new Map(data.map(n => [n.id, n]));

  let currentAppMode = 'explorer'; // 'explorer', 'alchemist', 'chrono-order'

  // Explorer State
  let currentCategory = 'all';
  let searchQuery = '';
  let activeViewMode = 'tree'; // 'tree' or 'canvas'
  let isAutopilotRunning = false;
  let autopilotInterval = null;
  let isMuted = false;

  // 2D Canvas View Pan/Zoom State
  let panX = window.innerWidth / 2 - 400;
  let panY = 150;
  let zoomLevel = 0.85;
  let isDraggingCanvas = false;
  let dragStartX = 0;
  let dragStartY = 0;

  // Alchemy Game State
  const unlockedElementIds = new Set(startingElements.map(e => e.id));
  let alchemySlot1 = null;
  let alchemySlot2 = null;
  let alchemyCategoryFilter = 'all';
  let alchemySearchQuery = '';

  // Chrono-Order Game State
  let chronoRoundIndex = 0;
  let chronoScore = 0;
  let chronoStreak = 0;
  let chronoLives = 3;
  let isRoundAnswered = false;
  let shuffledQuestions = [...chronoQuestions];

  // ========================================================
  // COSMIC AUDIO SYNTHESIZER
  // ========================================================
  class CosmicAudioEngine {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playHoverTone(freq = 440) {
      if (isMuted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
      } catch (e) {}
    }

    playSuccessChord() {
      if (isMuted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
        notes.forEach((freq, idx) => {
          setTimeout(() => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.42);
          }, idx * 45);
        });
      } catch (e) {}
    }

    playFailTone() {
      if (isMuted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
      } catch (e) {}
    }
  }

  const audio = new CosmicAudioEngine();

  // ========================================================
  // STARFIELD BACKGROUND
  // ========================================================
  function initStarfield() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const starCount = 200;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.2 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2
    }));

    function animateStars(time) {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        const currentAlpha =
          star.alpha + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, currentAlpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      });

      requestAnimationFrame(animateStars);
    }

    requestAnimationFrame(animateStars);
  }

  // ========================================================
  // DOM REFERENCES
  // ========================================================
  // Mode Nav
  const modeNav = document.getElementById('mode-nav');
  const explorerView = document.getElementById('explorer-view');
  const alchemistView = document.getElementById('alchemist-view');
  const chronoOrderView = document.getElementById('chrono-order-view');
  const alchemistCountBadge = document.getElementById('alchemist-count-badge');
  const explorerSearchWrapper = document.getElementById('explorer-search-wrapper');

  // Explorer DOM
  const treeContainer = document.getElementById('tree-scroll-container');
  const treeNodesList = document.getElementById('tree-nodes-list');
  const treeSvg = document.getElementById('tree-filaments-svg');
  const canvasContainer = document.getElementById('canvas-mode-container');
  const canvasWorld = document.getElementById('canvas-world');
  const canvasNodesContainer = document.getElementById('canvas-nodes-container');
  const canvasSvg = document.getElementById('canvas-filaments-svg');
  const searchInput = document.getElementById('search-input');
  const filterChips = document.getElementById('filter-chips');
  const viewToggleBtn = document.getElementById('view-toggle-btn');
  const viewModeLabel = document.getElementById('view-mode-label');
  const cruiseBtn = document.getElementById('cruise-btn');
  const cruiseIcon = document.getElementById('cruise-icon');
  const autopilotBanner = document.getElementById('autopilot-banner');
  const stopCruiseBtn = document.getElementById('stop-cruise-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const epochDock = document.getElementById('epoch-dock');

  // Inspector DOM
  const inspectorBackdrop = document.getElementById('inspector-backdrop');
  const closeInspectorBtn = document.getElementById('close-inspector-btn');
  const drawerIcon = document.getElementById('drawer-icon');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerEpoch = document.getElementById('drawer-epoch');
  const gaugeFill = document.getElementById('gauge-fill');
  const gaugePercentLabel = document.getElementById('gauge-percent-label');
  const drawerDesc = document.getElementById('drawer-desc');
  const drawerFunfact = document.getElementById('drawer-funfact');
  const drawerParentsList = document.getElementById('drawer-parents-list');
  const drawerChildrenList = document.getElementById('drawer-children-list');
  const drawerParentsSection = document.getElementById('drawer-parents-section');
  const drawerChildrenSection = document.getElementById('drawer-children-section');
  const drawerTagsList = document.getElementById('drawer-tags-list');

  // Alchemy DOM
  const fusionSlot1 = document.getElementById('fusion-slot-1');
  const fusionSlot2 = document.getElementById('fusion-slot-2');
  const fuseBtn = document.getElementById('fuse-btn');
  const clearSlotsBtn = document.getElementById('clear-slots-btn');
  const oracleHintBtn = document.getElementById('oracle-hint-btn');
  const reactionBanner = document.getElementById('alchemy-reaction-banner');
  const reactionIcon = document.getElementById('reaction-icon');
  const reactionTitle = document.getElementById('reaction-title');
  const reactionDesc = document.getElementById('reaction-desc');
  const elementsInventoryGrid = document.getElementById('elements-inventory-grid');
  const inventoryCount = document.getElementById('inventory-count');
  const alchemySearchInput = document.getElementById('alchemy-search-input');
  const alchemyCatFilters = document.getElementById('alchemy-cat-filters');
  const alchemyRankTitle = document.getElementById('alchemy-rank-title');
  const alchemyUnlockedText = document.getElementById('alchemy-unlocked-text');
  const alchemyPercentText = document.getElementById('alchemy-percent-text');
  const alchemyStatsFill = document.getElementById('alchemy-stats-fill');
  const alchemyTreeList = document.getElementById('alchemy-tree-list');

  // Chrono-Order DOM
  const chronoScoreEl = document.getElementById('chrono-score');
  const chronoStreakEl = document.getElementById('chrono-streak');
  const chronoRoundCounterEl = document.getElementById('chrono-round-counter');
  const chronoLivesEl = document.getElementById('chrono-lives');
  const chronoBadgeEl = document.getElementById('chrono-badge');
  const chronoQuestionTextEl = document.getElementById('chrono-question-text');
  const duelCardA = document.getElementById('duel-card-a');
  const duelCardB = document.getElementById('duel-card-b');
  const duelIconA = document.getElementById('duel-icon-a');
  const duelNameA = document.getElementById('duel-name-a');
  const duelEpochA = document.getElementById('duel-epoch-a');
  const duelIconB = document.getElementById('duel-icon-b');
  const duelNameB = document.getElementById('duel-name-b');
  const duelEpochB = document.getElementById('duel-epoch-b');
  const chronoExplanationCard = document.getElementById('chrono-explanation-card');
  const resultEmoji = document.getElementById('result-emoji');
  const resultStatusText = document.getElementById('result-status-text');
  const explanationBodyText = document.getElementById('explanation-body-text');
  const chronoNextBtn = document.getElementById('chrono-next-btn');
  const chronoFinishCard = document.getElementById('chrono-finish-card');
  const finishFinalScore = document.getElementById('finish-final-score');
  const chronoRestartBtn = document.getElementById('chrono-restart-btn');

  // ========================================================
  // MASTER MODE SWITCHING
  // ========================================================
  modeNav.addEventListener('click', e => {
    const btn = e.target.closest('.mode-tab-btn');
    if (!btn) return;

    modeNav.querySelectorAll('.mode-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const targetMode = btn.dataset.mode;
    switchMode(targetMode);
  });

  function switchMode(mode) {
    currentAppMode = mode;
    audio.playHoverTone(520);

    // Toggle View Containers
    explorerView.classList.remove('active');
    alchemistView.classList.remove('active');
    chronoOrderView.classList.remove('active');

    if (mode === 'explorer') {
      explorerView.classList.add('active');
      explorerSearchWrapper.style.display = 'block';
      viewToggleBtn.style.display = 'flex';
      cruiseBtn.style.display = 'flex';
      renderTreeScrollMode();
    } else if (mode === 'alchemist') {
      alchemistView.classList.add('active');
      explorerSearchWrapper.style.display = 'none';
      viewToggleBtn.style.display = 'none';
      cruiseBtn.style.display = 'none';
      renderAlchemyInventory();
      renderAlchemyTreePreview();
    } else if (mode === 'chrono-order') {
      chronoOrderView.classList.add('active');
      explorerSearchWrapper.style.display = 'none';
      viewToggleBtn.style.display = 'none';
      cruiseBtn.style.display = 'none';
      initChronoOrderGame();
    }
  }

  // ========================================================
  // MODE 1: EXPLORER ENGINE
  // ========================================================
  function renderTreeScrollMode() {
    treeNodesList.innerHTML = '';
    const filtered = getFilteredData();

    if (filtered.length === 0) {
      treeNodesList.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 18px; color: #fff; margin-bottom: 6px;">No cosmic events found</h3>
          <p style="font-size: 13px;">Try searching for a different keyword or reset filters.</p>
        </div>
      `;
      drawTreeFilaments();
      return;
    }

    filtered.forEach((node, index) => {
      const isRoot = index === 0 && node.id === 'big-bang';
      const sideClass = isRoot ? 'center-root' : index % 2 === 0 ? 'left' : 'right';

      const wrapper = document.createElement('div');
      wrapper.className = `tree-node-wrapper ${sideClass}`;
      wrapper.id = `tree-node-${node.id}`;
      wrapper.dataset.nodeId = node.id;

      const childrenCount = (node.children || []).length;
      const parentsCount = (node.parents || []).length;

      wrapper.innerHTML = `
        ${!isRoot ? '<div class="trunk-anchor-node" style="border-color: ' + node.color + '"></div>' : ''}
        <div class="node-card" style="--node-color: ${node.color}">
          <div class="node-header">
            <div class="node-icon-box" style="border-color: ${node.color}40">${node.icon}</div>
            <div class="node-title-group">
              <h3 class="node-title">${node.title}</h3>
              <div class="node-epoch">⏱️ ${node.timeEpoch}</div>
              <span class="node-category-tag" style="color: ${node.color}; border: 1px solid ${node.color}40">${node.categoryLabel}</span>
            </div>
          </div>
          <p class="node-summary">${node.summary}</p>
          <div class="node-footer">
            <div class="node-branches-count">
              <span>🌱 ${childrenCount} Branches</span>
              ${parentsCount > 0 ? `<span style="color: var(--text-subtle); margin-left: 8px;">← ${parentsCount} Roots</span>` : ''}
            </div>
            <div class="inspect-hint">
              <span>Inspect Lore</span>
              <span>→</span>
            </div>
          </div>
        </div>
      `;

      wrapper.addEventListener('click', () => {
        audio.playSuccessChord();
        openInspector(node.id);
      });

      wrapper.addEventListener('mouseenter', () => {
        const hash = node.title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        audio.playHoverTone(300 + (hash % 500));
      });

      treeNodesList.appendChild(wrapper);
    });

    setupScrollObserver();
    setTimeout(drawTreeFilaments, 100);
  }

  function drawTreeFilaments() {
    if (activeViewMode !== 'tree' || currentAppMode !== 'explorer') return;

    const stream = document.querySelector('.tree-stream');
    if (!stream) return;

    const rect = stream.getBoundingClientRect();
    treeSvg.setAttribute('width', rect.width);
    treeSvg.setAttribute('height', stream.scrollHeight);
    treeSvg.style.width = rect.width + 'px';
    treeSvg.style.height = stream.scrollHeight + 'px';

    const trunkX = rect.width / 2;
    let pathsHtml = '';

    const wrappers = document.querySelectorAll('.tree-node-wrapper');
    wrappers.forEach(wrapper => {
      const card = wrapper.querySelector('.node-card');
      const nodeId = wrapper.dataset.nodeId;
      const node = nodeMap.get(nodeId);
      if (!card || !node) return;

      const nodeY = wrapper.offsetTop + wrapper.offsetHeight / 2;
      const isLeft = wrapper.classList.contains('left');
      const isCenter = wrapper.classList.contains('center-root');

      if (!isCenter) {
        let cardEdgeX = isLeft
          ? wrapper.offsetLeft + card.offsetWidth
          : wrapper.offsetLeft + (wrapper.offsetWidth - card.offsetWidth);

        const controlX1 = isLeft ? cardEdgeX + 40 : cardEdgeX - 40;
        const controlX2 = isLeft ? trunkX - 20 : trunkX + 20;

        pathsHtml += `
          <path class="filament-path filament-pulse"
                d="M ${trunkX} ${nodeY} C ${controlX2} ${nodeY}, ${controlX1} ${nodeY}, ${cardEdgeX} ${nodeY}"
                stroke="${node.color}"
                style="color: ${node.color}" />
        `;
      }
    });

    treeSvg.innerHTML = pathsHtml;
  }

  function setupScrollObserver() {
    const wrappers = document.querySelectorAll('.tree-node-wrapper');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { root: treeContainer, threshold: 0.1 }
    );
    wrappers.forEach(w => observer.observe(w));
  }

  function renderCanvasMode() {
    canvasNodesContainer.innerHTML = '';
    const filtered = getFilteredData();
    const positions = compute2DTreeLayout(filtered);

    filtered.forEach(node => {
      const pos = positions.get(node.id) || { x: 0, y: 0 };
      const el = document.createElement('div');
      el.className = 'canvas-node';
      el.id = `canvas-node-${node.id}`;
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
      el.style.setProperty('--node-color', node.color);

      el.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 20px;">${node.icon}</span>
          <div>
            <h4 style="font-family: var(--font-display); font-size: 13px; font-weight: 700; color: #fff; line-height: 1.2;">${node.title}</h4>
            <div style="font-family: var(--font-mono); font-size: 10px; color: ${node.color}; font-weight: 700;">${node.timeEpoch}</div>
          </div>
        </div>
        <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${node.summary}</p>
      `;

      el.addEventListener('click', e => {
        e.stopPropagation();
        audio.playSuccessChord();
        openInspector(node.id);
      });

      canvasNodesContainer.appendChild(el);
    });

    drawCanvasFilaments(positions);
    updateCanvasTransform();
  }

  function compute2DTreeLayout(nodes) {
    const posMap = new Map();
    const colSpacing = 340;
    const rowSpacing = 160;

    let currentY = 100;
    const categoryColMap = { cosmos: -1, earth: -0.5, life: 0, human: 0.5, tech: 1, science: 1.5 };

    nodes.forEach((node, i) => {
      const colOffset = (categoryColMap[node.category] || 0) * colSpacing;
      const stagger = Math.sin(i * 1.3) * 60;
      const x = 800 + colOffset + stagger;
      const y = currentY;
      posMap.set(node.id, { x, y });
      currentY += rowSpacing;
    });

    return posMap;
  }

  function drawCanvasFilaments(positions) {
    let svgHtml = '';
    const nodeWidth = 250;
    const nodeHeight = 80;

    data.forEach(node => {
      const parentPos = positions.get(node.id);
      if (!parentPos) return;

      (node.children || []).forEach(childId => {
        const childPos = positions.get(childId);
        if (!childPos) return;

        const startX = parentPos.x + nodeWidth / 2;
        const startY = parentPos.y + nodeHeight;
        const endX = childPos.x + nodeWidth / 2;
        const endY = childPos.y;
        const midY = (startY + endY) / 2;

        svgHtml += `
          <path class="filament-path"
                d="M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}"
                stroke="${node.color}"
                style="color: ${node.color}; opacity: 0.75;" />
        `;
      });
    });

    canvasSvg.setAttribute('width', 3000);
    canvasSvg.setAttribute('height', 16000);
    canvasSvg.innerHTML = svgHtml;
  }

  function updateCanvasTransform() {
    canvasWorld.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  }

  function setupCanvasGestures() {
    canvasContainer.addEventListener('mousedown', e => {
      if (e.target.closest('.canvas-node') || e.target.closest('.canvas-controls-overlay')) return;
      isDraggingCanvas = true;
      dragStartX = e.clientX - panX;
      dragStartY = e.clientY - panY;
    });

    window.addEventListener('mousemove', e => {
      if (!isDraggingCanvas) return;
      panX = e.clientX - dragStartX;
      panY = e.clientY - dragStartY;
      updateCanvasTransform();
    });

    window.addEventListener('mouseup', () => {
      isDraggingCanvas = false;
    });

    canvasContainer.addEventListener('wheel', e => {
      e.preventDefault();
      const zoomDelta = -e.deltaY * 0.0012;
      const newZoom = Math.min(2.0, Math.max(0.3, zoomLevel + zoomDelta));
      const rect = canvasContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      panX = mouseX - (mouseX - panX) * (newZoom / zoomLevel);
      panY = mouseY - (mouseY - panY) * (newZoom / zoomLevel);
      zoomLevel = newZoom;
      updateCanvasTransform();
    }, { passive: false });

    document.getElementById('zoom-in-btn').addEventListener('click', () => {
      zoomLevel = Math.min(2.0, zoomLevel + 0.2);
      updateCanvasTransform();
    });

    document.getElementById('zoom-out-btn').addEventListener('click', () => {
      zoomLevel = Math.max(0.3, zoomLevel - 0.2);
      updateCanvasTransform();
    });

    document.getElementById('zoom-reset-btn').addEventListener('click', () => {
      zoomLevel = 0.85;
      panX = window.innerWidth / 2 - 800;
      panY = 150;
      updateCanvasTransform();
    });
  }

  // Inspector Telemetry Modal
  function openInspector(nodeId) {
    const node = nodeMap.get(nodeId);
    if (!node) return;

    drawerIcon.innerText = node.icon;
    drawerTitle.innerText = node.title;
    drawerEpoch.innerText = `⏱️ ${node.timeEpoch}`;
    drawerEpoch.style.color = node.color;
    drawerDesc.innerText = node.description;
    drawerFunfact.innerHTML = `<strong>💡 Deep Cosmic Metric:</strong> ${node.funFact}`;

    const maxYears = 13800000000;
    const progress = Math.min(100, Math.max(0, ((maxYears - node.yearsAgo) / maxYears) * 100));
    gaugeFill.style.width = `${progress.toFixed(2)}%`;
    gaugePercentLabel.innerText = `${progress.toFixed(2)}% of cosmic timeline reached`;

    if (node.parents && node.parents.length > 0) {
      drawerParentsSection.style.display = 'block';
      drawerParentsList.innerHTML = node.parents
        .map(pId => {
          const parent = nodeMap.get(pId);
          if (!parent) return '';
          return `
            <button class="branch-link-pill" data-target="${parent.id}">
              <span>${parent.icon}</span>
              <span>${parent.title}</span>
            </button>
          `;
        })
        .join('');
    } else {
      drawerParentsSection.style.display = 'none';
      drawerParentsList.innerHTML = '';
    }

    if (node.children && node.children.length > 0) {
      drawerChildrenSection.style.display = 'block';
      drawerChildrenList.innerHTML = node.children
        .map(cId => {
          const child = nodeMap.get(cId);
          if (!child) return '';
          return `
            <button class="branch-link-pill" data-target="${child.id}">
              <span>${child.icon}</span>
              <span>${child.title}</span>
            </button>
          `;
        })
        .join('');
    } else {
      drawerChildrenSection.style.display = 'none';
      drawerChildrenList.innerHTML = '';
    }

    document.querySelectorAll('.branch-link-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        closeInspector();
        jumpToNode(targetId);
      });
    });

    drawerTagsList.innerHTML = (node.tags || [])
      .map(tag => `<span class="tag-badge">#${tag}</span>`)
      .join('');

    inspectorBackdrop.classList.add('open');
  }

  function closeInspector() {
    inspectorBackdrop.classList.remove('open');
  }

  closeInspectorBtn.addEventListener('click', closeInspector);
  inspectorBackdrop.addEventListener('click', e => {
    if (e.target === inspectorBackdrop) closeInspector();
  });

  function jumpToNode(nodeId) {
    if (activeViewMode === 'tree') {
      const el = document.getElementById(`tree-node-${nodeId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlightNodeCard(el.querySelector('.node-card'));
      }
    } else {
      const el = document.getElementById(`canvas-node-${nodeId}`);
      if (el) {
        const nodeX = parseFloat(el.style.left);
        const nodeY = parseFloat(el.style.top);
        panX = window.innerWidth / 2 - nodeX * zoomLevel - 125 * zoomLevel;
        panY = window.innerHeight / 2 - nodeY * zoomLevel - 40 * zoomLevel;
        updateCanvasTransform();
        highlightNodeCard(el);
      }
    }
  }

  function highlightNodeCard(cardEl) {
    if (!cardEl) return;
    cardEl.style.transition = 'box-shadow 0.3s ease, transform 0.3s ease';
    cardEl.style.boxShadow = '0 0 40px #00e5ff, 0 0 80px #e040fb';
    cardEl.style.transform = 'scale(1.08)';
    setTimeout(() => {
      cardEl.style.boxShadow = '';
      cardEl.style.transform = '';
    }, 1500);
  }

  function getFilteredData() {
    return data.filter(node => {
      const matchCat = currentCategory === 'all' || node.category === currentCategory;
      const matchQuery =
        !searchQuery ||
        node.title.toLowerCase().includes(searchQuery) ||
        node.summary.toLowerCase().includes(searchQuery) ||
        node.timeEpoch.toLowerCase().includes(searchQuery) ||
        (node.tags && node.tags.some(t => t.toLowerCase().includes(searchQuery)));
      return matchCat && matchQuery;
    });
  }

  filterChips.addEventListener('click', e => {
    const btn = e.target.closest('.chip-btn');
    if (!btn) return;
    filterChips.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    audio.playHoverTone(480);
    if (activeViewMode === 'tree') renderTreeScrollMode();
    else renderCanvasMode();
  });

  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    if (activeViewMode === 'tree') renderTreeScrollMode();
    else renderCanvasMode();
  });

  function initEpochDock() {
    epochDock.innerHTML = '<div class="epoch-dock-label">Epochs:</div>';
    epochs.forEach(ep => {
      const btn = document.createElement('button');
      btn.className = 'epoch-jump-btn';
      btn.dataset.targetId = ep.targetId;
      btn.innerText = ep.label;
      btn.addEventListener('click', () => {
        epochDock.querySelectorAll('.epoch-jump-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        audio.playHoverTone(520);
        jumpToNode(ep.targetId);
      });
      epochDock.appendChild(btn);
    });
  }

  viewToggleBtn.addEventListener('click', () => {
    if (activeViewMode === 'tree') {
      activeViewMode = 'canvas';
      treeContainer.style.display = 'none';
      canvasContainer.style.display = 'block';
      viewModeLabel.innerText = 'Tree Stream';
      renderCanvasMode();
    } else {
      activeViewMode = 'tree';
      canvasContainer.style.display = 'none';
      treeContainer.style.display = 'block';
      viewModeLabel.innerText = 'Canvas View';
      renderTreeScrollMode();
    }
    audio.playSuccessChord();
  });

  function toggleAutopilot() {
    isAutopilotRunning = !isAutopilotRunning;
    if (isAutopilotRunning) {
      cruiseIcon.innerText = '⏸️';
      cruiseBtn.classList.add('active');
      autopilotBanner.classList.add('active');
      if (activeViewMode !== 'tree') {
        activeViewMode = 'tree';
        canvasContainer.style.display = 'none';
        treeContainer.style.display = 'block';
        viewModeLabel.innerText = 'Canvas View';
        renderTreeScrollMode();
      }
      autopilotInterval = setInterval(() => {
        treeContainer.scrollTop += 2.5;
        if (treeContainer.scrollTop + treeContainer.clientHeight >= treeContainer.scrollHeight - 10) {
          toggleAutopilot();
        }
      }, 25);
    } else {
      cruiseIcon.innerText = '▶️';
      cruiseBtn.classList.remove('active');
      autopilotBanner.classList.remove('active');
      clearInterval(autopilotInterval);
    }
  }

  cruiseBtn.addEventListener('click', toggleAutopilot);
  stopCruiseBtn.addEventListener('click', toggleAutopilot);

  audioToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    audioIcon.innerText = isMuted ? '🔇' : '🔊';
  });

  treeContainer.addEventListener('scroll', () => {
    requestAnimationFrame(drawTreeFilaments);
  });

  window.addEventListener('resize', () => {
    if (activeViewMode === 'tree') drawTreeFilaments();
  });

  // ========================================================
  // MODE 2: COSMIC ALCHEMIST ENGINE
  // ========================================================
  function getElementById(id) {
    const startElem = startingElements.find(e => e.id === id);
    if (startElem) return startElem;
    const node = nodeMap.get(id);
    if (node) {
      return {
        id: node.id,
        name: node.title,
        icon: node.icon,
        category: node.category,
        color: node.color
      };
    }
    return { id, name: id, icon: '⚛️', category: 'cosmos', color: '#00e5ff' };
  }

  function renderAlchemyInventory() {
    elementsInventoryGrid.innerHTML = '';
    const unlockedList = Array.from(unlockedElementIds).map(getElementById);

    const filtered = unlockedList.filter(elem => {
      const matchCat = alchemyCategoryFilter === 'all' || elem.category === alchemyCategoryFilter;
      const matchQuery = !alchemySearchQuery || elem.name.toLowerCase().includes(alchemySearchQuery);
      return matchCat && matchQuery;
    });

    inventoryCount.innerText = unlockedList.length;
    alchemistCountBadge.innerText = `${unlockedList.length}/60`;

    // Update Stats Rank
    const totalGoals = 60;
    const pct = Math.min(100, (unlockedList.length / totalGoals) * 100);
    alchemyStatsFill.style.width = `${pct.toFixed(1)}%`;
    alchemyUnlockedText.innerText = `${unlockedList.length} of ${totalGoals} Discovered`;
    alchemyPercentText.innerText = `${pct.toFixed(1)}%`;

    if (unlockedList.length < 10) alchemyRankTitle.innerText = '✨ Stardust Initiate';
    else if (unlockedList.length < 20) alchemyRankTitle.innerText = '🌋 Planetary Shaper';
    else if (unlockedList.length < 35) alchemyRankTitle.innerText = '🧬 Primordial Biologist';
    else if (unlockedList.length < 50) alchemyRankTitle.innerText = '🏛️ Civilization Architect';
    else alchemyRankTitle.innerText = '🌌 Cosmic Master of Time';

    filtered.forEach(elem => {
      const card = document.createElement('div');
      card.className = 'element-item-card';
      card.style.setProperty('--elem-color', elem.color || '#00e5ff');
      card.innerHTML = `
        <div class="elem-card-icon">${elem.icon}</div>
        <div class="elem-card-name">${elem.name}</div>
        <div class="elem-card-cat">${elem.category}</div>
      `;

      card.addEventListener('click', () => {
        audio.playHoverTone(400);
        putElementIntoSlot(elem);
      });

      elementsInventoryGrid.appendChild(card);
    });
  }

  function putElementIntoSlot(elem) {
    if (!alchemySlot1) {
      alchemySlot1 = elem;
      renderFusionSlot(fusionSlot1, elem);
    } else if (!alchemySlot2) {
      alchemySlot2 = elem;
      renderFusionSlot(fusionSlot2, elem);
    } else {
      alchemySlot1 = elem;
      renderFusionSlot(fusionSlot1, elem);
    }
  }

  function renderFusionSlot(slotEl, elem) {
    if (!elem) {
      slotEl.className = 'fusion-slot';
      slotEl.innerHTML = `<div class="slot-empty-hint">Drop Element ${slotEl.dataset.slot}</div>`;
      slotEl.style.removeProperty('--slot-color');
    } else {
      slotEl.className = 'fusion-slot filled';
      slotEl.style.setProperty('--slot-color', elem.color || '#00e5ff');
      slotEl.innerHTML = `
        <div class="slot-element-icon">${elem.icon}</div>
        <div class="slot-element-name">${elem.name}</div>
      `;
    }
  }

  fusionSlot1.addEventListener('click', () => {
    alchemySlot1 = null;
    renderFusionSlot(fusionSlot1, null);
    audio.playHoverTone(300);
  });

  fusionSlot2.addEventListener('click', () => {
    alchemySlot2 = null;
    renderFusionSlot(fusionSlot2, null);
    audio.playHoverTone(300);
  });

  clearSlotsBtn.addEventListener('click', () => {
    alchemySlot1 = null;
    alchemySlot2 = null;
    renderFusionSlot(fusionSlot1, null);
    renderFusionSlot(fusionSlot2, null);
    audio.playHoverTone(280);
  });

  // Synthesize / Fuse
  fuseBtn.addEventListener('click', () => {
    if (!alchemySlot1 || !alchemySlot2) {
      showReactionFeedback('⚠️ Incomplete Synthesis', 'Select two elements into both fusion slots first!', '⚠️');
      audio.playFailTone();
      return;
    }

    const id1 = alchemySlot1.id;
    const id2 = alchemySlot2.id;

    // Check Recipes
    const match = alchemyRecipes.find(
      r =>
        (r.inputs[0] === id1 && r.inputs[1] === id2) ||
        (r.inputs[0] === id2 && r.inputs[1] === id1)
    );

    if (match) {
      const isNew = !unlockedElementIds.has(match.result);
      unlockedElementIds.add(match.result);

      audio.playSuccessChord();
      const node = nodeMap.get(match.result);
      const title = node ? node.title : match.name;
      const desc = node ? node.summary : 'A new cosmic milestone unlocked!';

      showReactionFeedback(
        isNew ? `🎉 NEW DISCOVERY: ${match.name}!` : `✨ Synthesis: ${match.name}`,
        desc,
        match.icon
      );

      renderAlchemyInventory();
      renderAlchemyTreePreview();

      // Highlight in right preview
      setTimeout(() => {
        const previewItem = document.getElementById(`alchemy-preview-${match.result}`);
        if (previewItem) {
          previewItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    } else {
      audio.playFailTone();
      showReactionFeedback(
        '❄️ Reaction Incompatible',
        `No known cosmic reaction occurs between ${alchemySlot1.name} and ${alchemySlot2.name}. Try combining other building blocks!`,
        '💨'
      );
    }
  });

  function showReactionFeedback(title, desc, icon = '✨') {
    reactionIcon.innerText = icon;
    reactionTitle.innerText = title;
    reactionDesc.innerText = desc;
  }

  // Oracle Hint
  oracleHintBtn.addEventListener('click', () => {
    audio.playHoverTone(600);
    const availableRecipe = alchemyRecipes.find(
      r =>
        !unlockedElementIds.has(r.result) &&
        unlockedElementIds.has(r.inputs[0]) &&
        unlockedElementIds.has(r.inputs[1])
    );

    if (availableRecipe) {
      const elemA = getElementById(availableRecipe.inputs[0]);
      const elemB = getElementById(availableRecipe.inputs[1]);
      showReactionFeedback(
        '💡 Cosmic Oracle Vision',
        `The universe whispers: Try fusing "${elemA.name}" with "${elemB.name}" to unlock ${availableRecipe.name}!`,
        '🔮'
      );
    } else {
      showReactionFeedback(
        '🔮 Oracle Contemplation',
        'You have unlocked all currently craftable elements from your inventory! Use newly synthesized breakthroughs to branch out further.',
        '🌌'
      );
    }
  });

  // Alchemy Filters
  alchemyCatFilters.addEventListener('click', e => {
    const btn = e.target.closest('.alch-cat-btn');
    if (!btn) return;
    alchemyCatFilters.querySelectorAll('.alch-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    alchemyCategoryFilter = btn.dataset.cat;
    renderAlchemyInventory();
  });

  alchemySearchInput.addEventListener('input', e => {
    alchemySearchQuery = e.target.value.trim().toLowerCase();
    renderAlchemyInventory();
  });

  function renderAlchemyTreePreview() {
    alchemyTreeList.innerHTML = '';

    data.forEach(node => {
      const isUnlocked = unlockedElementIds.has(node.id);
      const item = document.createElement('div');
      item.className = `alchemy-tree-node-item ${isUnlocked ? 'unlocked' : 'locked'}`;
      item.id = `alchemy-preview-${node.id}`;
      item.style.setProperty('--node-color', node.color);

      item.innerHTML = `
        <div class="node-item-icon">${isUnlocked ? node.icon : '🔒'}</div>
        <div class="node-item-info">
          <div class="node-item-title">${isUnlocked ? node.title : 'Unknown Milestone'}</div>
          <div class="node-item-epoch">${node.timeEpoch}</div>
        </div>
      `;

      if (isUnlocked) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
          audio.playHoverTone(500);
          putElementIntoSlot(getElementById(node.id));
        });
      }

      alchemyTreeList.appendChild(item);
    });
  }

  // ========================================================
  // MODE 3: CHRONO-ORDER GAME ENGINE
  // ========================================================
  function initChronoOrderGame() {
    chronoRoundIndex = 0;
    chronoScore = 0;
    chronoStreak = 0;
    chronoLives = 3;
    isRoundAnswered = false;
    shuffledQuestions = [...chronoQuestions].sort(() => Math.random() - 0.5);

    chronoFinishCard.classList.remove('active');
    chronoExplanationCard.classList.remove('active');
    document.querySelector('.duel-cards-grid').style.display = 'grid';

    updateChronoHUD();
    loadChronoRound();
  }

  function updateChronoHUD() {
    chronoScoreEl.innerText = chronoScore;
    chronoStreakEl.innerText = `🔥 ${chronoStreak}x`;
    chronoRoundCounterEl.innerText = `${chronoRoundIndex + 1} / ${shuffledQuestions.length}`;
    chronoLivesEl.innerText = '❤️'.repeat(Math.max(0, chronoLives)) + '🖤'.repeat(Math.max(0, 3 - chronoLives));
  }

  function loadChronoRound() {
    isRoundAnswered = false;
    chronoExplanationCard.classList.remove('active');

    duelCardA.className = 'duel-card';
    duelCardB.className = 'duel-card';

    if (chronoRoundIndex >= shuffledQuestions.length || chronoLives <= 0) {
      showChronoFinishScreen();
      return;
    }

    const q = shuffledQuestions[chronoRoundIndex];
    chronoBadgeEl.innerText = q.badge || 'DEEP TIME PARADOX';
    chronoQuestionTextEl.innerText = q.question;

    duelIconA.innerText = q.optionA.icon;
    duelNameA.innerText = q.optionA.name;
    duelEpochA.innerText = '???';

    duelIconB.innerText = q.optionB.icon;
    duelNameB.innerText = q.optionB.name;
    duelEpochB.innerText = '???';

    updateChronoHUD();
  }

  function handleChronoChoice(selectedOption) {
    if (isRoundAnswered || chronoLives <= 0) return;
    isRoundAnswered = true;

    const q = shuffledQuestions[chronoRoundIndex];
    const isCorrect = selectedOption === q.correctOption;

    duelEpochA.innerText = `⏱️ ${q.optionA.epoch}`;
    duelEpochB.innerText = `⏱️ ${q.optionB.epoch}`;

    if (isCorrect) {
      audio.playSuccessChord();
      chronoStreak += 1;
      const points = 100 * Math.max(1, chronoStreak);
      chronoScore += points;

      if (selectedOption === 'A') duelCardA.classList.add('correct');
      else duelCardB.classList.add('correct');

      resultEmoji.innerText = '🎉';
      resultStatusText.innerText = `Brilliant! +${points} pts (Streak: ${chronoStreak}x)`;
      resultStatusText.style.color = 'var(--accent-green)';
    } else {
      audio.playFailTone();
      chronoStreak = 0;
      chronoLives -= 1;

      if (selectedOption === 'A') duelCardA.classList.add('wrong');
      else duelCardB.classList.add('wrong');

      if (q.correctOption === 'A') duelCardA.classList.add('correct');
      else duelCardB.classList.add('correct');

      resultEmoji.innerText = '💥';
      resultStatusText.innerText = `Timeline Paradox! -1 Life`;
      resultStatusText.style.color = 'var(--accent-red)';
    }

    updateChronoHUD();

    explanationBodyText.innerText = q.explanation;
    chronoExplanationCard.classList.add('active');

    if (chronoLives <= 0) {
      chronoNextBtn.innerText = 'See Final Score ➔';
    } else if (chronoRoundIndex >= shuffledQuestions.length - 1) {
      chronoNextBtn.innerText = 'Victory Results 🏆';
    } else {
      chronoNextBtn.innerText = 'Next Paradox ➔';
    }
  }

  duelCardA.addEventListener('click', () => handleChronoChoice('A'));
  duelCardB.addEventListener('click', () => handleChronoChoice('B'));

  chronoNextBtn.addEventListener('click', () => {
    audio.playHoverTone(500);
    if (chronoLives <= 0 || chronoRoundIndex >= shuffledQuestions.length - 1) {
      showChronoFinishScreen();
    } else {
      chronoRoundIndex += 1;
      loadChronoRound();
    }
  });

  function showChronoFinishScreen() {
    chronoExplanationCard.classList.remove('active');
    document.querySelector('.duel-cards-grid').style.display = 'none';

    finishFinalScore.innerText = `${chronoScore} pts`;

    if (chronoLives <= 0) {
      document.getElementById('finish-icon').innerText = '⏳';
      document.getElementById('finish-title').innerText = 'Timeline Fractured!';
      document.getElementById('finish-desc').innerText =
        'You ran out of lives while navigating deep time. Review the paradoxes and try again!';
    } else {
      document.getElementById('finish-icon').innerText = '🏆';
      document.getElementById('finish-title').innerText = 'Chrono-Master Omniscient!';
      document.getElementById('finish-desc').innerText =
        'You successfully untangled the grandest chronological mysteries of universal history!';
    }

    chronoFinishCard.classList.add('active');
  }

  chronoRestartBtn.addEventListener('click', () => {
    audio.playSuccessChord();
    initChronoOrderGame();
  });

  // ========================================================
  // INITIALIZATION
  // ========================================================
  initStarfield();
  initEpochDock();
  setupCanvasGestures();
  renderTreeScrollMode();

})();
