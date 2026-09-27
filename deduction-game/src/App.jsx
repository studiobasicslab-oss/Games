import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, HelpCircle, Target } from 'lucide-react';
import { WORDS, PREDEFINED_QUESTIONS } from './gameLogic';

function App() {
  const [mysteryWordObj, setMysteryWordObj] = useState(null);
  const [history, setHistory] = useState([]);
  const [questionsLeft, setQuestionsLeft] = useState(20);
  const [guess, setGuess] = useState('');
  const [gameState, setGameState] = useState('playing'); // playing, won, lost

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Pick a random word
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setMysteryWordObj(randomWord);
    setHistory([]);
    setQuestionsLeft(20);
    setGuess('');
    setGameState('playing');
  };

  const askQuestion = (question) => {
    if (questionsLeft <= 0 || gameState !== 'playing') return;

    const answer = mysteryWordObj.attributes[question.attribute];
    
    setHistory([...history, { question: question.text, answer, id: question.id }]);
    setQuestionsLeft(prev => prev - 1);

    if (questionsLeft - 1 === 0 && gameState === 'playing') {
      // You can still make a final guess if questions run out, but we don't automatically lose unless they fail a guess.
    }
  };

  const submitGuess = (e) => {
    e.preventDefault();
    if (!guess.trim() || gameState !== 'playing') return;

    if (guess.trim().toUpperCase() === mysteryWordObj.word) {
      setGameState('won');
    } else {
      setQuestionsLeft(prev => prev - 1);
      setHistory([...history, { question: `Is it ${guess}?`, answer: 'No', id: `guess-${Date.now()}` }]);
      if (questionsLeft - 1 <= 0) {
        setGameState('lost');
      }
    }
    setGuess('');
  };

  if (!mysteryWordObj) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <header>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Enigma
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          20 Questions to deduce the Mystery Word
        </motion.p>
      </header>

      <div className="main-content">
        <motion.div 
          className="glass-panel deduction-board"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2><Brain size={24} /> Deduction Board</h2>
          
          <div className="question-history">
            <AnimatePresence>
              {history.length === 0 && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 0.5 }} 
                  style={{ textAlign: 'center', margin: '2rem 0' }}
                >
                  Ask your first question to begin building the model.
                </motion.p>
              )}
              {history.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="history-item"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  layout
                >
                  <span className="history-question">{item.question}</span>
                  <span className={`history-answer answer-${item.answer}`}>{item.answer}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div 
          className="glass-panel controls-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Remaining</span>
              <span className="stat-value">{questionsLeft}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Difficulty</span>
              <span className="stat-value" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                {mysteryWordObj.difficulty}
              </span>
            </div>
          </div>

          <div>
            <h2><HelpCircle size={20} /> Inquire</h2>
            <div className="question-list">
              {PREDEFINED_QUESTIONS.map(q => {
                const alreadyAsked = history.some(h => h.id === q.id);
                return (
                  <button 
                    key={q.id} 
                    className="btn-question"
                    onClick={() => askQuestion(q)}
                    disabled={alreadyAsked || questionsLeft <= 0}
                  >
                    {q.text}
                  </button>
                )
              })}
            </div>
          </div>

          <form className="guess-section" onSubmit={submitGuess}>
            <h2><Target size={20} /> Solve</h2>
            <input 
              type="text" 
              className="guess-input"
              placeholder="I think it's a..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={questionsLeft <= 0}
            />
            <button type="submit" className="btn-submit" disabled={!guess.trim() || questionsLeft <= 0}>
              Make Guess (Costs 1)
            </button>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {gameState !== 'playing' && (
          <motion.div 
            className="game-over-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`modal-content ${gameState}`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <h2>{gameState === 'won' ? 'Brilliant Deduction!' : 'Out of Questions!'}</h2>
              <p>The mystery word was:</p>
              <div className="mystery-word-reveal">{mysteryWordObj.word}</div>
              <p>Category: {mysteryWordObj.category}</p>
              
              <button className="btn-play-again" onClick={startNewGame}>
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
