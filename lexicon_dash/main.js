/**
 * LEXICON DASH - Main Game Controller & UI Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mode Instances
    let dailyMode = null;
    let gauntletMode = null;
    let arenaMode = null;
    let currentMode = 'daily';
    let dailyGridSize = 3;

    // HUD Elements
    const hudDust = document.getElementById('hud-dust-val');
    const hudLevel = document.getElementById('hud-level-val');
    const hudElo = document.getElementById('hud-elo-val');

    function updateHUD() {
        if (window.ProgressionEngine) {
            hudDust.textContent = window.ProgressionEngine.starDust;
            hudLevel.textContent = window.ProgressionEngine.level;
            hudElo.textContent = window.ProgressionEngine.elo;
        }
    }

    function showToast(msg, icon = '✨') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // TAB NAVIGATION
    // ==========================================
    const tabs = document.querySelectorAll('.nav-tab');
    const views = {
        daily: document.getElementById('view-daily'),
        gauntlet: document.getElementById('view-gauntlet'),
        arena: document.getElementById('view-arena')
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.getAttribute('data-mode');
            switchTab(mode);
        });
    });

    function switchTab(mode) {
        currentMode = mode;
        tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-mode') === mode));
        Object.entries(views).forEach(([m, el]) => {
            if (el) el.classList.toggle('active', m === mode);
        });

        if (mode === 'daily' && !dailyMode) {
            initDailyMode();
        } else if (mode === 'gauntlet' && !gauntletMode) {
            initGauntletMode();
        } else if (mode === 'arena' && !arenaMode) {
            initArenaMode();
        }
    }

    // ==========================================
    // MODE 1: DAILY GRIDLOCK CONTROLLER
    // ==========================================
    function initDailyMode() {
        dailyMode = new window.GameModes.DailyGridMode(dailyGridSize);
        renderDailyGrid();
    }

    function renderDailyGrid() {
        const matrixEl = document.getElementById('daily-matrix');
        if (!matrixEl || !dailyMode) return;

        matrixEl.style.gridTemplateColumns = `140px repeat(${dailyMode.size}, 1fr)`;
        matrixEl.innerHTML = '';

        // Top-left blank cell
        const cornerCell = document.createElement('div');
        cornerCell.style.display = 'flex';
        cornerCell.style.alignItems = 'center';
        cornerCell.style.justifyContent = 'center';
        cornerCell.style.fontSize = '0.8rem';
        cornerCell.style.color = 'var(--text-muted)';
        cornerCell.style.fontWeight = '700';
        cornerCell.textContent = 'CATEGORIES';
        matrixEl.appendChild(cornerCell);

        // Column Letter Headers
        for (let c = 0; c < dailyMode.size; c++) {
            const colHeader = document.createElement('div');
            colHeader.className = 'grid-col-header';
            colHeader.textContent = dailyMode.letters[c];
            matrixEl.appendChild(colHeader);
        }

        // Rows (Category Header + Input Cells)
        for (let r = 0; r < dailyMode.size; r++) {
            const catId = dailyMode.categories[r];
            const cat = window.LexiconDB.getCategory(catId);
            const tier = CATEGORY_TIERS[cat.tier.toUpperCase()];

            // Row Header
            const rowHeader = document.createElement('div');
            rowHeader.className = 'grid-row-header';
            rowHeader.innerHTML = `
                <div>${cat.icon || '📌'} ${cat.name}</div>
                <div class="cat-tier" style="color: ${tier.color};">${tier.name} (${tier.multiplier}x)</div>
            `;
            matrixEl.appendChild(rowHeader);

            // Row Cells
            for (let c = 0; c < dailyMode.size; c++) {
                const cellData = dailyMode.grid[r][c];
                const cellEl = document.createElement('div');
                cellEl.className = `grid-cell ${cellData.status} ${cellData.rarityTier || ''}`;
                cellEl.id = `cell-${r}-${c}`;

                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = `${dailyMode.letters[c]}...`;
                input.value = cellData.word || '';
                input.autocomplete = 'off';
                input.spellcheck = false;

                const meta = document.createElement('div');
                meta.className = 'grid-cell-meta';
                meta.innerHTML = `
                    <span class="cell-status-chip">${cellData.status === 'valid' ? '✓ ' + cellData.points + ' pts' : (cellData.status === 'invalid' ? '✗' : '')}</span>
                    <span class="cell-rarity-chip">${cellData.result?.rarity ? cellData.result.rarity + '% rare' : ''}</span>
                `;

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        input.blur();
                        // Focus next cell in row or next row
                        const nextCol = (c + 1) % dailyMode.size;
                        const nextRow = nextCol === 0 ? (r + 1) % dailyMode.size : r;
                        const nextCell = document.querySelector(`#cell-${nextRow}-${nextCol} input`);
                        if (nextCell) nextCell.focus();
                    }
                });

                input.addEventListener('change', async () => {
                    const val = input.value.trim();
                    const validation = await dailyMode.setCellWord(r, c, val);
                    
                    if (validation.isValid) {
                        cellEl.className = `grid-cell valid ${dailyMode.grid[r][c].rarityTier}`;
                        meta.innerHTML = `
                            <span class="cell-status-chip">✓ ${dailyMode.grid[r][c].points} pts</span>
                            <span class="cell-rarity-chip">${validation.rarity}% rare</span>
                        `;
                        if (window.AudioEngine) window.AudioEngine.playSuccess(validation.rarity >= 70);
                        if (window.VFXEngine) window.VFXEngine.burstAtElement(cellEl, '#10b981', 12);
                    } else if (val) {
                        cellEl.className = 'grid-cell invalid';
                        meta.innerHTML = `<span class="cell-status-chip" style="color: var(--danger);">✗ ${validation.reason || 'Invalid'}</span>`;
                        if (window.AudioEngine) window.AudioEngine.playError();
                    } else {
                        cellEl.className = 'grid-cell empty';
                        meta.innerHTML = '';
                    }

                    updateDailyStats();
                });

                cellEl.appendChild(input);
                cellEl.appendChild(meta);
                matrixEl.appendChild(cellEl);
            }
        }
        updateDailyStats();
    }

    function updateDailyStats() {
        if (!dailyMode) return;
        const scoreEl = document.getElementById('daily-score-val');
        const timerEl = document.getElementById('daily-timer-val');
        if (scoreEl) scoreEl.textContent = dailyMode.getTotalScore();
        if (timerEl) timerEl.textContent = dailyMode.getDurationString();
        updateHUD();
    }

    // Daily Mode Buttons
    const sizeToggleBtn = document.getElementById('daily-grid-size-toggle');
    if (sizeToggleBtn) {
        sizeToggleBtn.addEventListener('click', () => {
            dailyGridSize = dailyGridSize === 3 ? 4 : 3;
            sizeToggleBtn.textContent = `Size: ${dailyGridSize}x${dailyGridSize}`;
            initDailyMode();
        });
    }

    const shareBtn = document.getElementById('daily-share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (!dailyMode) return;
            const text = dailyMode.generateShareText();
            navigator.clipboard.writeText(text).then(() => {
                showToast('Score Card copied to clipboard!', '📋');
            }).catch(() => {
                showToast('Share text ready!', '📋');
            });
        });
    }

    const resetBtn = document.getElementById('daily-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (dailyMode) {
                dailyMode.generateGrid();
                renderDailyGrid();
            }
        });
    }

    // ==========================================
    // MODE 2: SPEED GAUNTLET CONTROLLER
    // ==========================================
    function initGauntletMode() {
        gauntletMode = new window.GameModes.SpeedGauntletMode();
        renderGauntletCards();
    }

    function renderGauntletCards() {
        const container = document.getElementById('gauntlet-cards-container');
        const letterBadge = document.getElementById('gauntlet-letter');
        const letterText = document.getElementById('gauntlet-letter-text');
        if (!container || !gauntletMode) return;

        letterBadge.textContent = gauntletMode.activeLetter;
        letterText.textContent = gauntletMode.activeLetter;

        container.innerHTML = '';
        gauntletMode.categoryCards.forEach((catId, index) => {
            const cat = window.LexiconDB.getCategory(catId);
            const tier = CATEGORY_TIERS[cat.tier.toUpperCase()];
            const isCompleted = gauntletMode.completedCardIndices.has(index);

            const card = document.createElement('div');
            card.className = `gauntlet-card ${isCompleted ? 'completed' : ''}`;
            card.innerHTML = `
                <div class="gauntlet-card-info">
                    <h3>${cat.icon || '⚡'} ${cat.name}</h3>
                    <div style="font-size: 0.72rem; color: ${tier.color}; font-weight: 700;">${tier.name} (${tier.baseScore} pts)</div>
                </div>
                <div class="gauntlet-input-wrap">
                    <input type="text" class="gauntlet-input" id="gauntlet-input-${index}" placeholder="Type word starting with '${gauntletMode.activeLetter}'..." ${isCompleted ? 'disabled' : ''} autocomplete="off" spellcheck="false">
                </div>
            `;

            const input = card.querySelector('input');
            input.addEventListener('input', () => {
                if (window.AudioEngine) window.AudioEngine.playKeyClick();
            });

            input.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter') {
                    const rawVal = input.value.trim();
                    if (!rawVal) return;

                    const res = await gauntletMode.submitAnswer(index, rawVal);
                    if (res.isValid) {
                        card.classList.add('completed');
                        input.disabled = true;
                        if (window.VFXEngine) {
                            window.VFXEngine.burstAtElement(card, '#38bdf8', 16);
                            window.VFXEngine.addFloatingText(`+${res.points} pts`, window.innerWidth / 2, window.innerHeight / 2 - 50);
                        }
                        updateGauntletUI();

                        // Focus next available input
                        const nextIndex = (index + 1) % 5;
                        const nextInput = document.getElementById(`gauntlet-input-${nextIndex}`);
                        if (nextInput && !nextInput.disabled) nextInput.focus();
                    } else {
                        if (window.VFXEngine) window.VFXEngine.shakeScreen(6, 200);
                        showToast(res.reason || 'Invalid word', '❌');
                    }
                }
            });

            container.appendChild(card);
        });

        updateGauntletUI();
    }

    function updateGauntletUI() {
        if (!gauntletMode) return;
        const timerEl = document.getElementById('gauntlet-timer');
        const scoreEl = document.getElementById('gauntlet-score');
        const streakEl = document.getElementById('gauntlet-streak-val');
        const comboGauge = document.getElementById('gauntlet-combo-gauge');

        if (timerEl) {
            timerEl.textContent = `${gauntletMode.timeRemaining}s`;
            timerEl.classList.toggle('urgent', gauntletMode.timeRemaining <= 10);
        }
        if (scoreEl) scoreEl.textContent = gauntletMode.score;
        if (streakEl) streakEl.textContent = gauntletMode.streak;
        if (comboGauge) comboGauge.classList.toggle('active', gauntletMode.streak >= 2);
        updateHUD();
    }

    const gauntletStartBtn = document.getElementById('gauntlet-start-btn');
    if (gauntletStartBtn) {
        gauntletStartBtn.addEventListener('click', () => {
            if (!gauntletMode) initGauntletMode();
            gauntletStartBtn.style.display = 'none';

            gauntletMode.start(
                (time) => updateGauntletUI(),
                (summary) => {
                    gauntletStartBtn.style.display = 'inline-block';
                    gauntletStartBtn.textContent = '🔁 PLAY AGAIN';
                    showToast(`Gauntlet Complete! Score: ${summary.score} | +${summary.starDustEarned} ⭐`, '🏆');
                    updateHUD();
                }
            );
            renderGauntletCards();

            // Focus first input
            setTimeout(() => {
                const firstInput = document.getElementById('gauntlet-input-0');
                if (firstInput) firstInput.focus();
            }, 100);
        });
    }

    // ==========================================
    // MODE 3: MULTIPLAYER ARENA CONTROLLER
    // ==========================================
    function initArenaMode() {
        arenaMode = new window.GameModes.MultiplayerArenaMode({
            avatar: '🦊',
            elo: window.ProgressionEngine?.elo || 1000
        });
        setupArenaUI();
    }

    function setupArenaUI() {
        if (!arenaMode) return;
        arenaMode.startRound(
            () => updateArenaUI(),
            (phase) => handleArenaPhaseChange(phase)
        );
        renderArenaSlots();
        renderArenaBots();
        updateArenaUI();
    }

    function renderArenaSlots() {
        const container = document.getElementById('arena-slots-container');
        if (!container || !arenaMode) return;

        container.innerHTML = '';
        arenaMode.categories.forEach((catId, index) => {
            const cat = window.LexiconDB.getCategory(catId);
            const tier = CATEGORY_TIERS[cat.tier.toUpperCase()];

            const slot = document.createElement('div');
            slot.className = 'gauntlet-card';
            slot.style.padding = '0.75rem 1rem';
            slot.innerHTML = `
                <div style="min-width: 140px;">
                    <div style="font-weight: 700; font-size: 0.9rem;">${cat.icon || '📌'} ${cat.name}</div>
                    <div style="font-size: 0.65rem; color: ${tier.color};">${tier.name}</div>
                </div>
                <div class="gauntlet-input-wrap">
                    <input type="text" class="gauntlet-input" id="arena-input-${index}" placeholder="Starts with '${arenaMode.currentLetter}'..." autocomplete="off" spellcheck="false">
                </div>
            `;

            const input = slot.querySelector('input');
            input.addEventListener('change', async () => {
                const rawVal = input.value.trim();
                if (!rawVal) return;
                const validation = await arenaMode.submitHumanWord(catId, rawVal);
                if (validation.isValid) {
                    slot.classList.add('completed');
                    if (window.VFXEngine) window.VFXEngine.burstAtElement(slot, '#10b981', 12);
                } else {
                    slot.classList.remove('completed');
                }
                updateArenaUI();
            });

            container.appendChild(slot);
        });
    }

    function renderArenaBots() {
        const roster = document.getElementById('arena-bot-roster');
        if (!roster || !arenaMode) return;

        roster.innerHTML = '';
        arenaMode.bots.forEach(bot => {
            const card = document.createElement('div');
            card.className = 'bot-card';
            card.id = `bot-card-${bot.id}`;
            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem;">${bot.avatar}</span>
                    <div>
                        <div style="font-weight: 700; font-size: 0.85rem;">${bot.name} <span style="font-size: 0.7rem; color: var(--text-muted);">(${bot.personality})</span></div>
                        <div style="font-size: 0.7rem; color: #a855f7;">ELO ${bot.elo} • ${bot.score} pts</div>
                    </div>
                </div>
                <div style="width: 70px;">
                    <div style="font-size: 0.7rem; text-align: right; color: var(--text-muted); font-weight: 700;" id="bot-count-${bot.id}">0/6</div>
                    <div class="bot-progress-bar">
                        <div class="bot-progress-fill" id="bot-fill-${bot.id}"></div>
                    </div>
                </div>
            `;
            roster.appendChild(card);
        });
    }

    function updateArenaUI() {
        if (!arenaMode) return;
        const letterEl = document.getElementById('arena-current-letter');
        const roundEl = document.getElementById('arena-round-num');
        const timerEl = document.getElementById('arena-timer');
        const banner = document.getElementById('arena-emergency-banner');

        if (letterEl) letterEl.textContent = arenaMode.currentLetter;
        if (roundEl) roundEl.textContent = arenaMode.round;

        if (arenaMode.isEmergencyBuzzerActive) {
            banner.style.display = 'block';
            if (timerEl) timerEl.textContent = `${arenaMode.emergencyCountdown}s`;
        } else {
            banner.style.display = 'none';
            if (timerEl) timerEl.textContent = `${arenaMode.timeRemaining}s`;
        }

        // Update bot progress bars
        arenaMode.bots.forEach(bot => {
            const count = Object.keys(bot.answers).length;
            const countEl = document.getElementById(`bot-count-${bot.id}`);
            const fillEl = document.getElementById(`bot-fill-${bot.id}`);
            if (countEl) countEl.textContent = `${count}/6`;
            if (fillEl) fillEl.style.width = `${(count / 6) * 100}%`;
        });

        updateHUD();
    }

    const buzzerBtn = document.getElementById('arena-buzzer-btn');
    if (buzzerBtn) {
        buzzerBtn.addEventListener('click', () => {
            if (arenaMode) {
                const slammed = arenaMode.slamBuzzer('human', () => updateArenaUI(), (p) => handleArenaPhaseChange(p));
                if (slammed) {
                    showToast('You SLAMMED the Buzzer! Emergency Countdown Active!', '🚨');
                }
            }
        });
    }

    function handleArenaPhaseChange(phase) {
        if (phase === 'peer_review') {
            openPeerReviewModal();
        } else if (phase === 'round_summary' || phase === 'match_end') {
            openStandingsModal();
        }
    }

    function openPeerReviewModal() {
        const modal = document.getElementById('modal-peer-review');
        const disputesList = document.getElementById('peer-review-disputes-list');
        if (!modal || !disputesList || !arenaMode) return;

        disputesList.innerHTML = '';

        if (arenaMode.disputes.length === 0) {
            disputesList.innerHTML = `<div style="text-align: center; color: var(--success); font-weight: 700; padding: 1.5rem;">All player and bot submissions were verified cleanly without flags! 🎯</div>`;
        } else {
            arenaMode.disputes.forEach((disp, idx) => {
                const item = document.createElement('div');
                item.className = 'glass-panel';
                item.style.padding = '0.85rem';
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.alignItems = 'center';
                item.innerHTML = `
                    <div>
                        <div style="font-weight: 700; font-size: 0.95rem;">${disp.avatar} ${disp.playerName} entered <strong style="color: #f59e0b;">"${disp.word}"</strong></div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Category: ${disp.categoryName}</div>
                    </div>
                    <div style="display: flex; gap: 0.4rem;" id="vote-actions-${idx}">
                        <button class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; background: var(--success);" id="btn-accept-${idx}">Accept</button>
                        <button class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; border-color: var(--danger); color: var(--danger);" id="btn-reject-${idx}">Reject</button>
                    </div>
                `;

                const btnAcc = item.querySelector(`#btn-accept-${idx}`);
                const btnRej = item.querySelector(`#btn-reject-${idx}`);

                btnAcc.addEventListener('click', () => {
                    const status = arenaMode.voteDispute(idx, true);
                    item.querySelector(`#vote-actions-${idx}`).innerHTML = `<span style="font-weight: 700; color: var(--success);">Accepted (Votes: ${disp.votes.accept}-${disp.votes.reject})</span>`;
                });

                btnRej.addEventListener('click', () => {
                    const status = arenaMode.voteDispute(idx, false);
                    item.querySelector(`#vote-actions-${idx}`).innerHTML = `<span style="font-weight: 700; color: var(--danger);">Rejected (Votes: ${disp.votes.accept}-${disp.votes.reject})</span>`;
                });

                disputesList.appendChild(item);
            });
        }

        modal.classList.add('active');
    }

    const peerReviewContBtn = document.getElementById('peer-review-continue-btn');
    if (peerReviewContBtn) {
        peerReviewContBtn.addEventListener('click', () => {
            const modal = document.getElementById('modal-peer-review');
            if (modal) modal.classList.remove('active');
            if (arenaMode) {
                arenaMode.finishPeerReview((p) => handleArenaPhaseChange(p));
            }
        });
    }

    function openStandingsModal() {
        const modal = document.getElementById('modal-standings');
        const titleEl = document.getElementById('standings-title');
        const leaderboardEl = document.getElementById('standings-leaderboard');
        const rewardsEl = document.getElementById('standings-rewards');
        const actionBtn = document.getElementById('standings-action-btn');

        if (!modal || !leaderboardEl || !arenaMode) return;

        const standings = arenaMode.getStandings();
        leaderboardEl.innerHTML = '';

        standings.forEach((p, idx) => {
            const row = document.createElement('div');
            row.className = 'glass-panel';
            row.style.padding = '0.75rem 1rem';
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.alignItems = 'center';
            if (p.id === 'human') {
                row.style.borderColor = 'var(--accent)';
                row.style.background = 'rgba(var(--accent-rgb), 0.15)';
            }
            row.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-weight: 900; font-size: 1.1rem; color: ${idx === 0 ? '#fbbf24' : 'var(--text-muted)'};">#${idx + 1}</span>
                    <span style="font-size: 1.4rem;">${p.avatar}</span>
                    <span style="font-weight: 700;">${p.name}</span>
                </div>
                <div style="font-weight: 900; font-size: 1.1rem; color: var(--accent);">${p.score} pts</div>
            `;
            leaderboardEl.appendChild(row);
        });

        if (arenaMode.phase === 'match_end') {
            titleEl.textContent = '🏆 Tournament Final Standings';
            actionBtn.textContent = 'Play Again';
            rewardsEl.innerHTML = `Rewards Claimed: +${Math.floor(arenaMode.humanPlayer.score / 15)} ⭐ Star Dust • XP Updated!`;
        } else {
            titleEl.textContent = `Round ${arenaMode.round} Summary`;
            actionBtn.textContent = 'Next Round';
            rewardsEl.innerHTML = '';
        }

        modal.classList.add('active');
    }

    const standingsActionBtn = document.getElementById('standings-action-btn');
    if (standingsActionBtn) {
        standingsActionBtn.addEventListener('click', () => {
            const modal = document.getElementById('modal-standings');
            if (modal) modal.classList.remove('active');

            if (arenaMode.phase === 'match_end') {
                initArenaMode();
            } else {
                arenaMode.nextRound(() => updateArenaUI(), (p) => handleArenaPhaseChange(p));
                renderArenaSlots();
                renderArenaBots();
                updateArenaUI();
            }
        });
    }

    // ==========================================
    // MODALS CONTROLLER (SHOP, PROFILE, HELP, AUDIO)
    // ==========================================
    function setupShopModal() {
        const themesContainer = document.getElementById('shop-themes-container');
        const avatarsContainer = document.getElementById('shop-avatars-container');
        if (!themesContainer || !avatarsContainer || !window.ProgressionEngine) return;

        // Populate Themes
        themesContainer.innerHTML = '';
        Object.entries(THEMES_CONFIG).forEach(([themeId, cfg]) => {
            const isUnlocked = window.ProgressionEngine.unlockedThemes.includes(themeId);
            const isEquipped = window.ProgressionEngine.currentTheme === themeId;

            const card = document.createElement('div');
            card.className = 'glass-panel';
            card.style.padding = '0.85rem';
            card.style.background = cfg.preview;
            card.style.borderRadius = '12px';
            card.innerHTML = `
                <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.25rem;">${cfg.name}</div>
                <div style="font-size: 0.75rem; color: ${cfg.accent}; margin-bottom: 0.75rem;">${cfg.price > 0 ? cfg.price + ' ⭐' : 'Free'}</div>
                <button class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; width: 100%;" id="btn-theme-${themeId}">
                    ${isEquipped ? '✓ Equipped' : (isUnlocked ? 'Equip' : `Unlock (${cfg.price}⭐)`)}
                </button>
            `;

            const btn = card.querySelector(`#btn-theme-${themeId}`);
            btn.addEventListener('click', () => {
                if (isUnlocked) {
                    window.ProgressionEngine.applyTheme(themeId);
                    window.ProgressionEngine.save();
                    setupShopModal();
                    showToast(`Equipped ${cfg.name}!`, '🎨');
                } else {
                    if (window.ProgressionEngine.unlockTheme(themeId)) {
                        setupShopModal();
                        updateHUD();
                        showToast(`Unlocked ${cfg.name}!`, '🎉');
                    } else {
                        showToast('Not enough Star Dust!', '⚠️');
                    }
                }
            });

            themesContainer.appendChild(card);
        });

        // Populate Avatars
        avatarsContainer.innerHTML = '';
        AVATARS_CONFIG.forEach(av => {
            const isUnlocked = window.ProgressionEngine.unlockedAvatars.includes(av.id);
            const isEquipped = window.ProgressionEngine.currentAvatar === av.id;

            const card = document.createElement('div');
            card.className = 'glass-panel';
            card.style.padding = '0.75rem';
            card.style.textAlign = 'center';
            card.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 0.25rem;">${av.emoji}</div>
                <div style="font-weight: 700; font-size: 0.8rem;">${av.name}</div>
                <div style="font-size: 0.7rem; color: #fbbf24; margin-bottom: 0.5rem;">${av.price > 0 ? av.price + ' ⭐' : 'Free'}</div>
                <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; width: 100%;" id="btn-avatar-${av.id}">
                    ${isEquipped ? 'Equipped' : (isUnlocked ? 'Equip' : 'Unlock')}
                </button>
            `;

            const btn = card.querySelector(`#btn-avatar-${av.id}`);
            btn.addEventListener('click', () => {
                if (isUnlocked) {
                    window.ProgressionEngine.currentAvatar = av.id;
                    window.ProgressionEngine.save();
                    setupShopModal();
                    showToast(`Equipped ${av.name}!`, '🦊');
                } else {
                    if (window.ProgressionEngine.unlockAvatar(av.id)) {
                        setupShopModal();
                        updateHUD();
                        showToast(`Unlocked ${av.name}!`, '🎉');
                    } else {
                        showToast('Not enough Star Dust!', '⚠️');
                    }
                }
            });

            avatarsContainer.appendChild(card);
        });
    }

    function setupProfileModal() {
        if (!window.ProgressionEngine) return;
        const levelEl = document.getElementById('profile-level');
        const eloEl = document.getElementById('profile-elo');
        const avatarEl = document.getElementById('profile-avatar-display');
        const wordsFoundEl = document.getElementById('stat-words-found');
        const maxStreakEl = document.getElementById('stat-max-streak');
        const arenaWinsEl = document.getElementById('stat-arena-wins');
        const badgesContainer = document.getElementById('profile-badges-container');

        levelEl.textContent = window.ProgressionEngine.level;
        eloEl.textContent = window.ProgressionEngine.elo;

        const currentAv = AVATARS_CONFIG.find(a => a.id === window.ProgressionEngine.currentAvatar) || AVATARS_CONFIG[0];
        avatarEl.textContent = currentAv.emoji;

        wordsFoundEl.textContent = window.ProgressionEngine.stats.correctWords;
        maxStreakEl.textContent = `${window.ProgressionEngine.stats.maxStreak}x`;
        arenaWinsEl.textContent = window.ProgressionEngine.stats.arenaWins;

        // Badges
        badgesContainer.innerHTML = '';
        BADGES_CONFIG.forEach(b => {
            const isUnlocked = window.ProgressionEngine.isBadgeUnlocked(b.id);
            const currentProg = window.ProgressionEngine.badgesProgress[b.id] || 0;

            const card = document.createElement('div');
            card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div style="font-size: 2rem;">${b.icon}</div>
                <div>
                    <div style="font-weight: 800; font-size: 0.9rem; color: ${isUnlocked ? '#fbbf24' : 'var(--text-muted)'};">${b.name}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${b.desc}</div>
                    <div style="font-size: 0.68rem; font-weight: 700; color: var(--accent); margin-top: 2px;">Progress: ${currentProg}/${b.target}</div>
                </div>
            `;
            badgesContainer.appendChild(card);
        });
    }

    // Bind Modals Trigger Buttons
    document.getElementById('btn-shop')?.addEventListener('click', () => {
        setupShopModal();
        document.getElementById('modal-shop')?.classList.add('active');
    });

    document.getElementById('btn-profile')?.addEventListener('click', () => {
        setupProfileModal();
        document.getElementById('modal-profile')?.classList.add('active');
    });

    document.getElementById('btn-help')?.addEventListener('click', () => {
        document.getElementById('modal-help')?.classList.add('active');
    });

    const audioBtn = document.getElementById('btn-audio');
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            if (window.AudioEngine) {
                const isMuted = window.AudioEngine.toggleMute();
                audioBtn.textContent = isMuted ? '🔇' : '🔊';
                showToast(isMuted ? 'Sound Muted' : 'Sound Enabled', '🔊');
            }
        });
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-close');
            document.getElementById(target)?.classList.remove('active');
        });
    });

    // Close modal on background click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });

    // Boot initial state
    updateHUD();
    initDailyMode();
});
