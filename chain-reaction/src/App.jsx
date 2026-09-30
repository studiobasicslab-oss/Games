import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const getDayIndex = () => {
  const epoch = new Date('2024-01-01').getTime();
  const today = new Date().getTime();
  const diffDays = Math.floor((today - epoch) / (1000 * 60 * 60 * 24));
  return (diffDays % 30) + 1;
};

function App() {
  const [chain, setChain] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [guess, setGuess] = useState('');
  const [revealedLetters, setRevealedLetters] = useState(0);
  const [cluesUsed, setCluesUsed] = useState(0);
  const [status, setStatus] = useState('loading');
  const [errorState, setErrorState] = useState(false);
  const [correctState, setCorrectState] = useState(false);
  const [dayNumber, setDayNumber] = useState(1);

  useEffect(() => {
    loadPuzzle();
  }, []);

  const loadPuzzle = async () => {
    try {
      const res = await fetch('/db.json');
      const data = await res.json();
      const targetDay = getDayIndex();
      setDayNumber(targetDay);

      const puzzle = data.puzzles.find(p => p.day === targetDay) || data.puzzles[0];
      setChain(puzzle.chain);
      resetGame();
    } catch (err) {
      console.error("Failed to load chain puzzle", err);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setRevealedLetters(0);
    setCluesUsed(0);
    setGuess('');
    setStatus('playing');
    setErrorState(false);
    setCorrectState(false);
  };

  const triggerConfetti = () => {
    const duration = 2500;
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

  const targetWord = chain[currentIndex + 1];

  const handleGuess = (e) => {
    e.preventDefault();
    if (!guess.trim() || status !== 'playing' || correctState) return;

    if (guess.toUpperCase() === targetWord) {
      setCorrectState(true);
      setErrorState(false);
      
      setTimeout(() => {
        setGuess('');
        setRevealedLetters(0);
        
        if (currentIndex + 1 >= chain.length - 1) {
          setStatus('won');
          triggerConfetti();
        } else {
          setCurrentIndex(prev => prev + 1);
        }
        setCorrectState(false);
      }, 600); // Wait for correct animation to play
    } else {
      setErrorState(true);
      setTimeout(() => setErrorState(false), 500);
    }
  };

  const useClue = () => {
    if (revealedLetters < targetWord.length - 1) {
      setRevealedLetters(prev => prev + 1);
      setCluesUsed(prev => prev + 1);
      setErrorState(false);
    }
  };

  const renderTargetWord = () => {
    if (!targetWord) return null;
    let display = '';
    for (let i = 0; i < targetWord.length; i++) {
      if (i < revealedLetters) {
        display += targetWord[i] + ' ';
      } else {
        display += '_ ';
      }
    }
    return display.trim();
  };

  if (status === 'loading' || chain.length === 0) {
    return <div className="container">Loading Today's Chain...</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>Word Chain</h1>
        <p>Daily Puzzle #{dayNumber}</p>
      </header>

      <div className="chain-display">
        <AnimatePresence mode="popLayout">
          {chain.slice(0, currentIndex + 1).map((word, idx) => (
            <motion.div 
              key={`known-${idx}`}
              className="word-row word-known"
              initial={{ rotateX: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotateX: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              layout
            >
              {word}
            </motion.div>
          ))}
          
          {status === 'playing' && (
            <motion.div 
              key={`target-${currentIndex}`}
              className="word-row word-target"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              {renderTargetWord()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {status === 'playing' && (
        <form className="controls" onSubmit={handleGuess}>
          <div className="input-row">
            <motion.input 
              type="text"
              className={`guess-input ${errorState ? 'error' : ''} ${correctState ? 'correct' : ''}`}
              placeholder="Next word..."
              value={guess}
              onChange={e => setGuess(e.target.value)}
              disabled={correctState}
              autoFocus
              animate={
                errorState ? { x: [-10, 10, -10, 10, 0] } :
                correctState ? { scale: [1, 1.05, 1], borderColor: ['rgba(255,255,255,0.1)', '#22c55e', '#22c55e'] } :
                {}
              }
              transition={{ duration: 0.4 }}
              style={{
                boxShadow: correctState ? '0 0 15px rgba(34, 197, 94, 0.5)' : 'none'
              }}
            />
            <button type="submit" className="btn btn-submit" disabled={correctState}>Guess</button>
          </div>
          <button 
            type="button" 
            className="btn btn-clue" 
            onClick={useClue}
            disabled={revealedLetters >= targetWord.length - 1 || correctState}
          >
            Reveal Letter
          </button>
          <div className="clues-used">Clues used: {cluesUsed}</div>
        </form>
      )}

      <AnimatePresence>
        {status === 'won' && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.5, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.6 }}
            >
              <h2>Chain Complete!</h2>
              <p>You completed today's chain using {cluesUsed} clues.</p>
              <button onClick={resetGame}>Retry Chain</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
