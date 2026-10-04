import { useState, useEffect } from 'react';
import './index.css';

const CATEGORIES = [
  {
    id: 'artifacts',
    name: 'ARTIFACTS',
    items: [
      { id: 'crystal', label: 'Crystal', image: '/artifacts/artifact_crystal.jpg' },
      { id: 'cube', label: 'Cube', image: '/artifacts/artifact_cube.jpg' },
      { id: 'orb', label: 'Orb', image: '/artifacts/artifact_orb.jpg' },
      { id: 'prism', label: 'Prism', image: '/artifacts/artifact_prism.jpg' },
      { id: 'pyramid', label: 'Pyramid', image: '/artifacts/artifact_pyramid.jpg' },
      { id: 'sphere', label: 'Sphere', image: '/artifacts/artifact_sphere.jpg' }
    ]
  },
  {
    id: 'food',
    name: 'FOOD',
    items: [
      { id: 'apple', label: 'Apple', image: '/food/apple.svg' },
      { id: 'banana', label: 'Banana', image: '/food/banana.svg' },
      { id: 'pizza', label: 'Pizza', image: '/food/pizza.svg' },
      { id: 'burger', label: 'Burger', image: '/food/burger.svg' },
      { id: 'donut', label: 'Donut', image: '/food/donut.svg' },
      { id: 'sushi', label: 'Sushi', image: '/food/sushi.svg' }
    ]
  },
  {
    id: 'drinks',
    name: 'DRINKS',
    items: [
      { id: 'cola', label: 'Cola', image: '/drinks/cola.svg' },
      { id: 'orange_soda', label: 'Orange soda', image: '/drinks/orange_soda.svg' },
      { id: 'lemonade', label: 'Lemonade', image: '/drinks/lemonade.svg' },
      { id: 'juice', label: 'Juice', image: '/drinks/juice.svg' },
      { id: 'coffee', label: 'Coffee', image: '/drinks/coffee.svg' },
      { id: 'milk', label: 'Milk', image: '/drinks/milk.svg' }
    ]
  },
  {
    id: 'space',
    name: 'SPACE',
    items: [
      { id: 'mercury', label: 'Mercury', image: '/space/mercury.svg' },
      { id: 'venus', label: 'Venus', image: '/space/venus.svg' },
      { id: 'earth', label: 'Earth', image: '/space/earth.svg' },
      { id: 'mars', label: 'Mars', image: '/space/mars.svg' },
      { id: 'jupiter', label: 'Jupiter', image: '/space/jupiter.svg' },
      { id: 'saturn', label: 'Saturn', image: '/space/saturn.svg' },
      { id: 'uranus', label: 'Uranus', image: '/space/uranus.svg' },
      { id: 'neptune', label: 'Neptune', image: '/space/neptune.svg' }
    ]
  },
  {
    id: 'animals',
    name: 'ANIMALS',
    items: [
      { id: 'cat', label: 'Cat', image: '/animals/cat.svg' },
      { id: 'dog', label: 'Dog', image: '/animals/dog.svg' },
      { id: 'elephant', label: 'Elephant', image: '/animals/elephant.svg' },
      { id: 'tiger', label: 'Tiger', image: '/animals/tiger.svg' },
      { id: 'penguin', label: 'Penguin', image: '/animals/penguin.svg' },
      { id: 'shark', label: 'Shark', image: '/animals/shark.svg' },
      { id: 'fox', label: 'Fox', image: '/animals/fox.svg' },
      { id: 'rabbit', label: 'Rabbit', image: '/animals/rabbit.svg' }
    ]
  },
  {
    id: 'countries',
    name: 'COUNTRIES',
    items: [
      { id: 'india', label: 'India', image: '/countries/india.svg' },
      { id: 'japan', label: 'Japan', image: '/countries/japan.svg' },
      { id: 'brazil', label: 'Brazil', image: '/countries/brazil.svg' },
      { id: 'canada', label: 'Canada', image: '/countries/canada.svg' },
      { id: 'egypt', label: 'Egypt', image: '/countries/egypt.svg' },
      { id: 'france', label: 'France', image: '/countries/france.svg' },
      { id: 'australia', label: 'Australia', image: '/countries/australia.svg' },
      { id: 'mexico', label: 'Mexico', image: '/countries/mexico.svg' }
    ]
  },
  {
    id: 'computer',
    name: 'COMPUTER',
    items: [
      { id: 'cpu', label: 'CPU', image: '/computer/cpu.svg' },
      { id: 'ram', label: 'RAM', image: '/computer/ram.svg' },
      { id: 'ssd', label: 'SSD', image: '/computer/ssd.svg' },
      { id: 'gpu', label: 'GPU', image: '/computer/gpu.svg' },
      { id: 'keyboard', label: 'Keyboard', image: '/computer/keyboard.svg' },
      { id: 'mouse', label: 'Mouse', image: '/computer/mouse.svg' },
      { id: 'monitor', label: 'Monitor', image: '/computer/monitor.svg' },
      { id: 'motherboard', label: 'Motherboard', image: '/computer/motherboard.svg' }
    ]
  }
];

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

const factorial = (n) => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

const calcPermutations = (n, r) => {
  if (r === undefined) r = n;
  return factorial(n) / factorial(n - r);
};

const STANDARD_LEVELS = [
  { hidden: 3, available: 3 },
  { hidden: 4, available: 4 },
  { hidden: 5, available: 5 },
  { hidden: 6, available: 6 },
  { hidden: 7, available: 7 },
  { hidden: 8, available: 8 },
];

const MYSTERY_LEVELS = [
  { hidden: 3, available: 4 },
  { hidden: 3, available: 5 },
  { hidden: 4, available: 5 },
  { hidden: 4, available: 6 },
  { hidden: 5, available: 6 },
  { hidden: 5, available: 7 },
  { hidden: 5, available: 8 },
  { hidden: 6, available: 8 },
];

export default function App() {
  const [view, setView] = useState('level-select'); 
  const [modeTab, setModeTab] = useState('standard');
  const [showStats, setShowStats] = useState(false);
  const [completedLevels, setCompletedLevels] = useState({}); 
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  
  const [currentLevelInfo, setCurrentLevelInfo] = useState(null);
  const [targetSequence, setTargetSequence] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(0);
  const [gameItems, setGameItems] = useState([]); 

  const [feedbackState, setFeedbackState] = useState(null);

  const initGame = (mode, levelIndex) => {
    const levelData = mode === 'standard' ? STANDARD_LEVELS[levelIndex] : MYSTERY_LEVELS[levelIndex];
    
    const levelItems = shuffleArray([...activeCategory.items]).slice(0, levelData.available);
    const hidden = shuffleArray([...levelItems]).slice(0, levelData.hidden);
    
    setCurrentLevelInfo({ mode, index: levelIndex, ...levelData });
    setGameItems(levelItems);
    setTargetSequence(hidden);
    setCurrentGuess(Array(levelData.hidden).fill(null));
    // Sort logic needs to handle objects vs strings, we can just use original index or leave as is
    setAvailableItems([...levelItems]); 
    setHistory([]);
    setIsSolved(false);
    setStartTime(Date.now());
    setFeedbackState(null);
    setView('playing');
  };

  const getItemId = (item) => typeof item === 'string' ? item : item.id;
  
  const handleAvailableItemClick = (item) => {
    if (isSolved) return;
    const emptyIndex = currentGuess.findIndex(slot => slot === null);
    if (emptyIndex !== -1) {
      const newGuess = [...currentGuess];
      newGuess[emptyIndex] = item;
      setCurrentGuess(newGuess);
      setAvailableItems(availableItems.filter(i => getItemId(i) !== getItemId(item)));
    }
  };

  const handleSlotClick = (index) => {
    if (isSolved || currentGuess[index] === null) return;
    const item = currentGuess[index];
    const newGuess = [...currentGuess];
    newGuess[index] = null;
    setCurrentGuess(newGuess);
    setAvailableItems([...availableItems, item]);
  };

  const handleDragStart = (e, item, sourceIndex = null) => {
    if (isSolved) return;
    e.dataTransfer.setData('item', getItemId(item));
    if (sourceIndex !== null) {
      e.dataTransfer.setData('sourceIndex', sourceIndex);
    }
  };

  const handleDropSlot = (e, index) => {
    if (isSolved) return;
    e.preventDefault();
    const itemId = e.dataTransfer.getData('item');
    const sourceIndex = e.dataTransfer.getData('sourceIndex');
    const item = gameItems.find(i => getItemId(i) === itemId);

    if (!item) return;

    const newGuess = [...currentGuess];
    let newAvailable = [...availableItems];

    if (sourceIndex !== '') {
      const sIdx = parseInt(sourceIndex, 10);
      const existingItem = newGuess[index];
      newGuess[index] = item;
      newGuess[sIdx] = existingItem;
      setCurrentGuess(newGuess);
    } else {
      const existingItem = newGuess[index];
      newGuess[index] = item;
      newAvailable = newAvailable.filter(i => getItemId(i) !== getItemId(item));
      if (existingItem) {
        newAvailable.push(existingItem);
      }
      setCurrentGuess(newGuess);
      setAvailableItems(newAvailable);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropPool = (e) => {
    if (isSolved) return;
    e.preventDefault();
    const itemId = e.dataTransfer.getData('item');
    const sourceIndex = e.dataTransfer.getData('sourceIndex');
    const item = gameItems.find(i => getItemId(i) === itemId);

    if (sourceIndex !== '') {
      const sIdx = parseInt(sourceIndex, 10);
      const newGuess = [...currentGuess];
      newGuess[sIdx] = null;
      setCurrentGuess(newGuess);
      setAvailableItems([...availableItems, item]);
    }
  };

  const submitGuess = () => {
    if (isSolved) return;
    if (currentGuess.includes(null)) return; 

    let correctCount = 0;
    for (let i = 0; i < currentGuess.length; i++) {
      if (getItemId(currentGuess[i]) === getItemId(targetSequence[i])) {
        correctCount++;
      }
    }

    const newHistory = [{
      guess: [...currentGuess],
      correct: correctCount
    }, ...history];
    
    setHistory(newHistory);

    if (correctCount === targetSequence.length) {
      setFeedbackState('solved');
      setTimeout(() => setIsSolved(true), 1500); 
      setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
      const levelKey = `${currentLevelInfo.mode}-${activeCategory.id}-${currentLevelInfo.index}`;
      setCompletedLevels({ ...completedLevels, [levelKey]: true });
    } else {
      if (correctCount === 0) {
        setFeedbackState('zero');
      } else {
        setFeedbackState('partial');
      }
      setTimeout(() => setFeedbackState(null), 1000);
      setCurrentGuess(Array(currentLevelInfo.hidden).fill(null));
      setAvailableItems([...gameItems]);
    }
  };

  const startNextLevel = () => {
    const list = currentLevelInfo.mode === 'standard' ? STANDARD_LEVELS : MYSTERY_LEVELS;
    if (currentLevelInfo.index + 1 < list.length) {
      initGame(currentLevelInfo.mode, currentLevelInfo.index + 1);
    } else {
      setView('level-select');
    }
  };

  const renderItemContent = (item, isHistory = false) => {
    if (typeof item === 'string') {
      return <span className={isHistory ? "history-text-pill" : "item-text"}>{item}</span>;
    }
    return (
      <img 
        src={item.image} 
        alt={item.label} 
        className={isHistory ? "history-image-pill" : "item-image"} 
      />
    );
  };

  if (view === 'level-select') {
    const levelsToRender = modeTab === 'standard' ? STANDARD_LEVELS : MYSTERY_LEVELS;

    return (
      <div className="app-container">
        <div className="game-board">
          <header className="level-header-main">
            <div className="lab-icon">🔬</div>
            <h1>Deduction Lab</h1>
            <p>Select subjects and initiate experiment.</p>
          </header>

          <div className="category-selector">
            <label>DATASET:</label>
            <div className="category-scroll">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  className={`cat-btn ${activeCategory.id === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mode-tabs">
            <button 
              className={`tab-btn ${modeTab === 'standard' ? 'active' : ''}`}
              onClick={() => setModeTab('standard')}
            >
              Standard
            </button>
            <button 
              className={`tab-btn ${modeTab === 'mystery' ? 'active' : ''}`}
              onClick={() => setModeTab('mystery')}
            >
              Mystery Set
            </button>
          </div>

          <div className="options-bar">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={showStats} 
                onChange={() => setShowStats(!showStats)} 
              />
              <span className="slider"></span>
              <span className="toggle-label">Show Statistics</span>
            </label>
          </div>

          <div className="level-grid">
            {levelsToRender.map((level, idx) => {
              if (level.available > activeCategory.items.length) {
                return (
                  <div key={`${modeTab}-${idx}`} className="level-card disabled">
                    <div className="level-card-header">
                      <h2>Exp. {idx + 1}</h2>
                    </div>
                    <div className="level-details">
                      <span className="object-count">Requires {level.available} items</span>
                    </div>
                  </div>
                );
              }

              const levelKey = `${modeTab}-${activeCategory.id}-${idx}`;
              const isCompleted = completedLevels[levelKey];
              const perms = calcPermutations(level.available, level.hidden);
              
              return (
                <div 
                  key={levelKey} 
                  className={`level-card ${isCompleted ? 'completed' : ''}`}
                  onClick={() => initGame(modeTab, idx)}
                >
                  <div className="level-card-header">
                    <h2>Exp. {idx + 1}</h2>
                    {isCompleted && <span className="completed-badge">✓ Solved</span>}
                  </div>
                  <div className="level-details">
                    <span className="object-count">{level.hidden} Hidden / {level.available} Subjects</span>
                  </div>
                  {showStats && (
                    <div className="level-stats fade-in">
                      {perms.toLocaleString()} permutations
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const hasNextLevel = currentLevelInfo.mode === 'standard' 
    ? (currentLevelInfo.index < STANDARD_LEVELS.length - 1 && STANDARD_LEVELS[currentLevelInfo.index + 1].available <= activeCategory.items.length)
    : (currentLevelInfo.index < MYSTERY_LEVELS.length - 1 && MYSTERY_LEVELS[currentLevelInfo.index + 1].available <= activeCategory.items.length);

  return (
    <div className="app-container">
      <div className="game-board">
        <header className="game-header">
          <button className="icon-btn" onClick={() => setView('level-select')}>
            ← Lab
          </button>
          <div>
            <h1>Exp. {currentLevelInfo.index + 1}</h1>
            <p className="subtitle-mode">[{activeCategory.name}]</p>
          </div>
          <div style={{width: 60}}></div>
        </header>

        {/* Observation Screen / Hidden Sequence */}
        <div className={`observation-screen ${feedbackState === 'solved' || isSolved ? 'solved' : ''}`}>
          <div className="screen-glass">
            <div className="hidden-sequence">
              {targetSequence.map((item, i) => (
                <div key={i} className={`hidden-item ${(feedbackState === 'solved' || isSolved) ? 'revealed' : ''} ${typeof item === 'object' ? 'image-box' : ''}`} style={{animationDelay: `${i * 0.15}s`, minWidth: typeof item === 'object' ? '80px' : '90px'}}>
                  <div className="hidden-item-inner" style={{width: '100%', height: '100%'}}>
                    <div className="hidden-item-front">❔</div>
                    <div className="hidden-item-back" style={{padding: typeof item === 'object' ? 0 : undefined}}>
                      {renderItemContent(item)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="screen-label">OBSERVATION CHAMBER</div>
        </div>

        {isSolved ? (
          <div className="success-banner pop-in">
            <h2>🎉 SEQUENCE VERIFIED 🎉</h2>
            <div className="stats">
              <div className="stat">
                <span className="stat-value">{history.length}</span>
                <span className="stat-label">Scans</span>
              </div>
              <div className="stat">
                <span className="stat-value">{timeTaken}s</span>
                <span className="stat-label">Time</span>
              </div>
            </div>
            <div className="success-actions">
              {hasNextLevel ? (
                <button className="primary-btn pulse-anim" onClick={startNextLevel}>Next Experiment</button>
              ) : (
                <button className="primary-btn pulse-anim" onClick={() => setView('level-select')}>Return to Lab</button>
              )}
            </div>
          </div>
        ) : (
          <div className="play-area fade-in">
            <div className={`board-section feedback-${feedbackState}`}>
              <h3>Reconstruction Bay</h3>
              <p className="instruction">Arrange subjects exactly as hidden.</p>
              
              <div className="slots-row">
                {currentGuess.map((slotItem, idx) => (
                  <div 
                    key={idx} 
                    className={`slot text-slot ${slotItem ? 'filled' : 'empty'} ${slotItem && typeof slotItem === 'object' ? 'image-box' : ''}`}
                    onClick={() => handleSlotClick(idx)}
                    onDrop={(e) => handleDropSlot(e, idx)}
                    onDragOver={handleDragOver}
                    draggable={slotItem !== null}
                    onDragStart={(e) => slotItem && handleDragStart(e, slotItem, idx)}
                  >
                    {slotItem && <div className="pop-in-fast" style={{width: '100%', height: '100%'}}>{renderItemContent(slotItem)}</div>}
                  </div>
                ))}
              </div>
              
              <button 
                className={`primary-btn submit-btn ${feedbackState ? `anim-${feedbackState}` : ''}`} 
                onClick={submitGuess}
                disabled={currentGuess.includes(null) || feedbackState !== null}
              >
                INITIATE SCAN
              </button>
            </div>

            <div 
              className="pool-section"
              onDrop={handleDropPool}
              onDragOver={handleDragOver}
            >
              <h3>Subject Pool</h3>
              <div className="pool-row">
                {availableItems.map((item, idx) => (
                  <div 
                    key={getItemId(item)} 
                    className={`pool-item text-pool-item ${typeof item === 'object' ? 'image-box' : ''}`}
                    onClick={() => handleAvailableItemClick(item)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                  >
                    {renderItemContent(item)}
                  </div>
                ))}
                {availableItems.length === 0 && (
                  <div className="pool-empty-state">No more subjects available</div>
                )}
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <h3>Scan Logs</h3>
            <div className="history-list">
              {history.map((entry, hIdx) => {
                const totalScans = history.length;
                const scanNum = totalScans - hIdx;
                
                return (
                  <div key={hIdx} className="history-entry pop-in-fast">
                    <div className="history-attempt-num">#{scanNum}</div>
                    <div className="history-guess text-history-guess">
                      {entry.guess.map((item, i) => (
                        <div key={i}>{renderItemContent(item, true)}</div>
                      ))}
                    </div>
                    <div className={`history-feedback ${entry.correct === currentLevelInfo.hidden ? 'solved' : (entry.correct === 0 ? 'zero' : 'partial')}`}>
                      {entry.correct} MATCH
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
