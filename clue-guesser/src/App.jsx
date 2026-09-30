import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const TOTAL_CLUES_BUDGET = 20;
const WORDS_TO_WIN = 5;

const getDayIndex = () => {
  const epoch = new Date('2024-01-01').getTime();
  const today = new Date().getTime();
  const diffDays = Math.floor((today - epoch) / (1000 * 60 * 60 * 24));
  return (diffDays % 30) + 1;
};

function App() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [cluesUsed, setCluesUsed] = useState(0);
  const [cluesRevealedForCurrent, setCluesRevealedForCurrent] = useState(1);
  const [guess, setGuess] = useState('');
  const [gameState, setGameState] = useState('loading'); 
  const [dayNumber, setDayNumber] = useState(1);
  const [isError, setIsError] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadDailyPuzzle();
  }, []);

  const loadDailyPuzzle = async () => {
    try {
      const response = await fetch('/db.json');
      const data = await response.json();
      const targetDay = getDayIndex();
      setDayNumber(targetDay);
      
      const puzzle = data.puzzles.find(p => p.day === targetDay) || data.puzzles[0];
      setWords(puzzle.words);
      resetGameState();
    } catch (err) {
      console.error("Failed to load puzzle DB", err);
    }
  };

  const resetGameState = () => {
    setCurrentWordIndex(0);
    setCluesUsed(1); 
    setCluesRevealedForCurrent(1);
    setGuess('');
    setGameState('playing');
    setIsError(false);
    setIsCorrect(false);
  };

  const triggerConfetti = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const submitGuess = (e) => {
    e.preventDefault();
    if (!guess.trim() || gameState !== 'playing' || isCorrect) return;

    const currentWord = words[currentWordIndex].word;
    
    if (guess.trim().toUpperCase() === currentWord) {
      setIsCorrect(true);
      setIsError(false);

      setTimeout(() => {
        if (currentWordIndex + 1 >= WORDS_TO_WIN) {
          setGameState('won');
          triggerConfetti();
        } else {
          setCurrentWordIndex(prev => prev + 1);
          setCluesRevealedForCurrent(1);
          setCluesUsed(prev => prev + 1); 
          
          if (cluesUsed + 1 > TOTAL_CLUES_BUDGET) {
            setGameState('lost');
          }
        }
        setIsCorrect(false);
        setGuess('');
      }, 800); // 800ms delay to show the success animation
      
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);

      const currentWordCluesTotal = words[currentWordIndex].clues.length;
      
      if (cluesRevealedForCurrent < currentWordCluesTotal) {
        setCluesRevealedForCurrent(prev => prev + 1);
        setCluesUsed(prev => prev + 1);
        if (cluesUsed + 1 > TOTAL_CLUES_BUDGET) {
           setGameState('lost');
        }
      } else {
        setCluesUsed(prev => prev + 1);
        if (cluesUsed + 1 > TOTAL_CLUES_BUDGET) {
           setGameState('lost');
        }
      }
      setGuess('');
    }
  };

  if (gameState === 'loading' || words.length === 0) {
    return <div className="app-container" style={{color: 'var(--accent)', fontWeight: 'bold'}}>Loading Puzzle...</div>;
  }

  const currentWordData = words[currentWordIndex];
  const revealedClues = currentWordData.clues.slice(0, cluesRevealedForCurrent);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Clue Guesser</h1>
        <p style={{color: 'var(--text-secondary)'}}>Daily Puzzle #{dayNumber}</p>
      </div>

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Words Solved</span>
          <span className="stat-value">{currentWordIndex} / {WORDS_TO_WIN}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Clues Left</span>
          <motion.span 
            className="stat-value" 
            style={{ color: TOTAL_CLUES_BUDGET - cluesUsed < 5 ? 'var(--accent)' : 'inherit' }}
            key={cluesUsed}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
          >
            {TOTAL_CLUES_BUDGET - cluesUsed}
          </motion.span>
        </div>
      </div>

      <div className="clues-container">
        <AnimatePresence>
          {revealedClues.map((clue, index) => (
            <motion.div 
              key={`${currentWordIndex}-${index}`}
              className="clue-box"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {clue}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form className="guess-form" onSubmit={submitGuess}>
        <motion.input 
          type="text" 
          className={`guess-input ${isError ? 'error' : ''} ${isCorrect ? 'correct' : ''}`}
          placeholder="Type your guess..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={gameState !== 'playing' || isCorrect}
          autoFocus
          animate={
            isError ? { x: [-10, 10, -10, 10, 0] } : 
            isCorrect ? { scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 20px rgba(16, 185, 129, 0.8)", "0px 0px 0px rgba(16, 185, 129, 0)"] } : 
            {}
          }
          transition={{ duration: 0.4 }}
        />
        <button type="submit" className="btn-submit" disabled={!guess.trim() || gameState !== 'playing' || isCorrect}>
          Guess
        </button>
      </form>

      <AnimatePresence>
        {gameState !== 'playing' && (
          <motion.div 
            className="game-over-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className={`modal ${gameState}`}
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <h2>{gameState === 'won' ? 'Brilliant!' : 'Game Over'}</h2>
              <p>
                {gameState === 'won' 
                  ? `You solved today's puzzle with ${TOTAL_CLUES_BUDGET - cluesUsed} clues remaining.` 
                  : `You ran out of clues! The word was ${currentWordData.word}.`}
              </p>
              <button className="btn-play-again" onClick={resetGameState}>
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
