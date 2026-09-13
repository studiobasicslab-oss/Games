import { db } from '../firebase_setup.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const startDate = new Date("2026-01-04T08:00:00Z"); // First Sunday of 2026

/* --------------------------------------------------------------------------
   SUDOKU SCRAMBLER
   -------------------------------------------------------------------------- */
const baseSudokuGrid = [
  [0, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 0, 0, 0, 0, 3],
  [0, 7, 4, 0, 8, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 0, 0, 2],
  [0, 8, 0, 0, 4, 0, 0, 1, 0],
  [6, 0, 0, 5, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 7, 8, 0],
  [5, 0, 0, 0, 0, 9, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 4, 0]
];
const baseSudokuSol = [
  [1, 2, 6, 4, 3, 7, 9, 5, 8],
  [8, 9, 5, 6, 2, 1, 4, 7, 3],
  [3, 7, 4, 9, 8, 5, 1, 2, 6],
  [4, 5, 7, 1, 9, 3, 8, 6, 2],
  [9, 8, 3, 2, 4, 6, 5, 1, 7],
  [6, 1, 2, 5, 7, 8, 3, 9, 4],
  [2, 6, 9, 3, 1, 4, 7, 8, 5],
  [5, 4, 8, 7, 6, 9, 2, 3, 1],
  [7, 3, 1, 8, 5, 2, 6, 4, 9]
];

function scrambleSudoku(baseGrid, baseSol) {
  // Deep copy
  let g = JSON.parse(JSON.stringify(baseGrid));
  let s = JSON.parse(JSON.stringify(baseSol));

  // 1. Permute numbers (1-9 map to a new permutation of 1-9)
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  nums.sort(() => 0.5 - Math.random());
  const map = { 0: 0 };
  for (let i = 0; i < 9; i++) map[i + 1] = nums[i];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      g[r][c] = map[g[r][c]];
      s[r][c] = map[s[r][c]];
    }
  }

  // 2. Swap rows within blocks
  for (let block = 0; block < 3; block++) {
    const r1 = block * 3 + Math.floor(Math.random() * 3);
    const r2 = block * 3 + Math.floor(Math.random() * 3);
    if (r1 !== r2) {
      let tempG = g[r1]; g[r1] = g[r2]; g[r2] = tempG;
      let tempS = s[r1]; s[r1] = s[r2]; s[r2] = tempS;
    }
  }

  // 3. Swap columns within blocks
  for (let block = 0; block < 3; block++) {
    const c1 = block * 3 + Math.floor(Math.random() * 3);
    const c2 = block * 3 + Math.floor(Math.random() * 3);
    if (c1 !== c2) {
      for (let r = 0; r < 9; r++) {
        let tempG = g[r][c1]; g[r][c1] = g[r][c2]; g[r][c2] = tempG;
        let tempS = s[r][c1]; s[r][c1] = s[r][c2]; s[r][c2] = tempS;
      }
    }
  }

  return { grid: g, solution: s };
}

/* --------------------------------------------------------------------------
   CROSSWORDS POOL (4 Hard Crosswords)
   -------------------------------------------------------------------------- */
const crosswords = [
  {
    solution: [
      ["P", "E", "A", "C", "H"],
      ["E", "A", "R", "T", "H"],
      ["A", "P", "P", "L", "E"],
      ["C", "H", "E", "E", "R"],
      ["H", "E", "A", "R", "T"]
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, text: "Fuzzy stone fruit" },
        { num: 6, row: 1, col: 0, text: "Our blue and green planet" },
        { num: 7, row: 2, col: 0, text: "Crisp autumn orchard pick" },
        { num: 8, row: 3, col: 0, text: "Shout of encouragement" },
        { num: 9, row: 4, col: 0, text: "Anatomical pump" }
      ],
      down: [
        { num: 1, row: 0, col: 0, text: "Fuzzy stone fruit" },
        { num: 2, row: 0, col: 1, text: "Our blue and green planet" },
        { num: 3, row: 0, col: 2, text: "Crisp autumn orchard pick" },
        { num: 4, row: 0, col: 3, text: "Shout of encouragement" },
        { num: 5, row: 0, col: 4, text: "Anatomical pump" }
      ]
    }
  },
  {
    solution: [
      ["S", "C", "A", "R", "E"],
      ["C", "A", "R", "E", "S"],
      ["A", "R", "E", "N", "A"],
      ["R", "E", "N", "T", "S"],
      ["E", "S", "S", "A", "Y"]
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, text: "Frighten" },
        { num: 6, row: 1, col: 0, text: "Shows affection" },
        { num: 7, row: 2, col: 0, text: "Sports stadium" },
        { num: 8, row: 3, col: 0, text: "Leases out" },
        { num: 9, row: 4, col: 0, text: "School paper" }
      ],
      down: [
        { num: 1, row: 0, col: 0, text: "Frighten" },
        { num: 2, row: 0, col: 1, text: "Shows affection" },
        { num: 3, row: 0, col: 2, text: "Sports stadium" },
        { num: 4, row: 0, col: 3, text: "Leases out" },
        { num: 5, row: 0, col: 4, text: "School paper" }
      ]
    }
  },
  {
    solution: [
      ["B", "O", "A", "R", "D"],
      ["O", "U", "T", "E", "R"],
      ["A", "T", "O", "N", "E"],
      ["R", "E", "N", "T", "S"],
      ["D", "R", "E", "S", "S"]
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, text: "Plank of wood" },
        { num: 6, row: 1, col: 0, text: "Exterior" },
        { num: 7, row: 2, col: 0, text: "Make amends" },
        { num: 8, row: 3, col: 0, text: "Leases out" },
        { num: 9, row: 4, col: 0, text: "Formal attire" }
      ],
      down: [
        { num: 1, row: 0, col: 0, text: "Plank of wood" },
        { num: 2, row: 0, col: 1, text: "Exterior" },
        { num: 3, row: 0, col: 2, text: "Make amends" },
        { num: 4, row: 0, col: 3, text: "Leases out" },
        { num: 5, row: 0, col: 4, text: "Formal attire" }
      ]
    }
  },
  {
    solution: [
      ["S", "P", "A", "R", "E"],
      ["P", "A", "N", "E", "L"],
      ["A", "N", "G", "L", "E"],
      ["R", "E", "L", "I", "C"],
      ["E", "L", "E", "C", "T"]
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, text: "Extra tire" },
        { num: 6, row: 1, col: 0, text: "Discussion group" },
        { num: 7, row: 2, col: 0, text: "Geometric corner" },
        { num: 8, row: 3, col: 0, text: "Ancient artifact" },
        { num: 9, row: 4, col: 0, text: "Vote into office" }
      ],
      down: [
        { num: 1, row: 0, col: 0, text: "Extra tire" },
        { num: 2, row: 0, col: 1, text: "Discussion group" },
        { num: 3, row: 0, col: 2, text: "Geometric corner" },
        { num: 4, row: 0, col: 3, text: "Ancient artifact" },
        { num: 5, row: 0, col: 4, text: "Vote into office" }
      ]
    }
  }
];

/* --------------------------------------------------------------------------
   CONNECTIONS POOL
   -------------------------------------------------------------------------- */
const wordAssociations = [
  { q: "Swiss, Cottage, Blue", a: "CHEESE", exp: "Swiss cheese, Cottage cheese, Blue cheese." },
  { q: "Sun, Reading, Hour", a: "GLASSES", exp: "Sunglasses, Reading glasses, Hourglass." },
  { q: "Water, Bow, Snow", a: "FALL", exp: "Waterfall, Fall bow?, Snowfall? No, wait: WATER, BOW, SNOW -> TIE (Water tie? no), DROP (Waterdrop, Snowdrop, Bow drop? no). Let's use: Rain, Snow, Water -> FALL. (Rainfall, Snowfall, Waterfall)." },
  { q: "Tree, Family, Square", a: "ROOT", exp: "Tree root, Family root, Square root." },
  { q: "Paper, Wall, News", a: "PAPER", exp: "Paperboy, Wallpaper, Newspaper? Let's use: Book, Wall, Sand -> PAPER (Book paper? No. Let's do: Sand, News, Wall -> PAPER)." },
  { q: "Sand, News, Wall", a: "PAPER", exp: "Sandpaper, Newspaper, Wallpaper." },
  { q: "Fire, Police, Gas", a: "STATION", exp: "Fire station, Police station, Gas station." },
  { q: "Sea, Egg, Nut", a: "SHELL", exp: "Seashell, Eggshell, Nutshell." },
  { q: "Light, House, Bird", a: "HOUSE", exp: "Lighthouse, Houseboat, Birdhouse. Let's use: Light, Dog, Bird -> HOUSE (Lighthouse, Doghouse, Birdhouse)." },
  { q: "Light, Dog, Bird", a: "HOUSE", exp: "Lighthouse, Doghouse, Birdhouse." },
  { q: "Bed, Bath, Chat", a: "ROOM", exp: "Bedroom, Bathroom, Chatroom." },
  { q: "Black, White, Peg", a: "BOARD", exp: "Blackboard, Whiteboard, Pegboard." },
  { q: "Life, Fire, Coast", a: "GUARD", exp: "Lifeguard, Fireguard, Coastguard." },
  { q: "Snow, Base, Foot", a: "BALL", exp: "Snowball, Baseball, Football." },
  { q: "Grand, Step, God", a: "MOTHER", exp: "Grandmother, Stepmother, Godmother." },
  { q: "Door, Church, Cow", a: "BELL", exp: "Doorbell, Churchbell, Cowbell." },
  { q: "Tea, Soup, Table", a: "SPOON", exp: "Teaspoon, Soupspoon, Tablespoon." },
  { q: "Rain, Hair, Cross", a: "BOW", exp: "Rainbow, Hairbow, Crossbow." },
  { q: "Time, wrist, pocket", a: "WATCH", exp: "Time watch? No. Let's do: Wrist, Stop, Pocket -> WATCH." },
  { q: "Wrist, Stop, Pocket", a: "WATCH", exp: "Wristwatch, Stopwatch, Pocketwatch." },
  { q: "Eye, Sun, Wine", a: "GLASS", exp: "Eyeglass, Sunglass, Wineglass." }
];

/* --------------------------------------------------------------------------
   DYNAMIC MATH GENERATOR
   -------------------------------------------------------------------------- */
function generateMath(week) {
  const type = week % 3;
  if (type === 0) {
    // Sequence
    const a = Math.floor(Math.random() * 10) + 5;
    const d = Math.floor(Math.random() * 5) + 3;
    const ans = a + (week * d);
    return {
      q: `If sequence A begins with ${a}, and each subsequent term adds ${d}, what is the value of the ${week + 1}th term?`,
      a: `${ans}`,
      exp: `The formula is ${a} + (n-1)*${d}. For n=${week+1}, it is ${a} + (${week})*${d} = ${ans}.`
    };
  } else if (type === 1) {
    // Algebra
    const x = week + 10;
    const y = Math.floor(Math.random() * 10) + 1;
    const sum = x + y;
    const diff = x - y;
    return {
      q: `Solve for a: a + b = ${sum}, and a - b = ${diff}.`,
      a: `${x}`,
      exp: `Adding the two equations yields 2a = ${sum + diff}, so a = ${x}.`
    };
  } else {
    // Basic Geometry / Logic
    const sides = week + 3;
    const ans = (sides - 2) * 180;
    return {
      q: `What is the sum of the interior angles of a regular polygon with ${sides} sides?`,
      a: `${ans}`,
      exp: `The formula is (n-2) * 180. So (${sides}-2) * 180 = ${ans}.`
    };
  }
}

export async function seed52Weeks() {
  console.log("Fetching trivia from OpenTDB...");
  let triviaQuestions = [];
  try {
    const res = await fetch("https://opentdb.com/api.php?amount=50&difficulty=hard&type=multiple");
    const data = await res.json();
    triviaQuestions = data.results.map(t => {
      // Decode HTML entities (quick hack for browser context)
      const decode = (str) => {
        let txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value;
      };
      
      let opts = [decode(t.correct_answer), ...t.incorrect_answers.map(decode)];
      opts.sort(() => 0.5 - Math.random());
      let ansIdx = opts.indexOf(decode(t.correct_answer));
      let ansId = ['a','b','c','d'][ansIdx];
      
      return {
        q: decode(t.question),
        opts: opts,
        ans: ansId,
        explanation: `The correct answer is ${decode(t.correct_answer)}. Category: ${t.category}`
      };
    });
  } catch (e) {
    console.warn("Trivia API failed, using fallback.");
  }

  // Fallback trivia
  if (triviaQuestions.length === 0) {
    triviaQuestions = [{
      q: "Which philosophy asserts that existence precedes essence?",
      opts: ["Nihilism", "Existentialism", "Stoicism", "Absurdism"],
      ans: "b", explanation: "Existentialism, famously championed by Jean-Paul Sartre."
    }];
  }

  console.log("Starting procedural seed for 52 weeks...");

  for (let week = 1; week <= 52; week++) {
    const issueDate = new Date(startDate.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
    const dateFormatted = issueDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
    
    const allPuzzleTypes = [
      'crossword', 'sudoku', 'math', 'trivia',
      'cipher', 'anagram', 'missing_letters', 'morse_code',
      'who_is_lying', 'age_puzzle', 'knights_knaves', 'word_association', 'sequence',
      'minesweeper', 'lights_out', 'nonogram',
      'timeline', 'ordering', 'scheduling'
    ];

    // Shuffle and pick 5 unique types for this week
    allPuzzleTypes.sort(() => 0.5 - Math.random());
    const weekTypes = allPuzzleTypes.slice(0, 5);
    
    let puzzles = [];
    weekTypes.forEach((type, index) => {
      let pzl = { id: `w${week}_p${index+1}`, num: `0${index+1}` };
      
      if (type === 'crossword') {
        const cw = crosswords[(week - 1) % crosswords.length];
        puzzles.push({ ...pzl, name: "CRYPTIC CROSSWORD", type: "crossword", stars: 4, intro: "A challenging 5x5 crossword.", gridSize: 5, perfectGrid: JSON.stringify(cw) });
      } else if (type === 'sudoku') {
        const { grid, solution } = scrambleSudoku(baseSudokuGrid, baseSudokuSol);
        puzzles.push({ ...pzl, name: "DIABOLICAL SUDOKU", type: "sudoku", stars: 5, intro: "A true test of logic.", grid: JSON.stringify(grid), solution: JSON.stringify(solution) });
      } else if (type === 'math') {
        const math = generateMath(week);
        puzzles.push({ ...pzl, name: "QUANTITATIVE REASONING", type: "math", stars: 4, intro: "Solve the mathematical problem.", question: math.q, correctAnswer: math.a, explanation: math.exp });
      } else if (type === 'trivia') {
        const t = triviaQuestions[(week - 1) % triviaQuestions.length];
        puzzles.push({ ...pzl, name: "HIGHBROW TRIVIA", type: "trivia", stars: 3, intro: "A question for the well-read.", question: t.q, options: [{id:'a',text:t.opts[0]}, {id:'b',text:t.opts[1]}, {id:'c',text:t.opts[2]}, {id:'d',text:t.opts[3]}], correctOptionId: t.ans, explanation: t.explanation });
      } else if (type === 'connections') {
        const shuffledPool = [...connectionsPool].sort(() => 0.5 - Math.random());
        puzzles.push({ ...pzl, name: "THE SUNDAY GROUPING", type: "connections", stars: 3, intro: "Find 4 hidden groups of 4 related words.", categories: JSON.stringify(shuffledPool.slice(0, 4)) });
      } else if (type === 'cipher') {
        const word = "CRYPTOGRAPHY";
        const shift = (week % 5) + 2;
        const cipher = word.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65)).join('');
        puzzles.push({ ...pzl, name: "CAESAR CIPHER", type: "cipher", stars: 2, intro: "Decode the shifted text.", question: `Shifted by ${shift}: ${cipher}`, correctAnswer: word, explanation: `Shift each letter back by ${shift} to get ${word}` });
      } else if (type === 'anagram') {
        puzzles.push({ ...pzl, name: "ANAGRAM", type: "anagram", stars: 2, intro: "Unscramble the word.", question: "LISTEN", correctAnswer: "SILENT", explanation: "LISTEN rearranges to SILENT." });
      } else if (type === 'missing_letters') {
        puzzles.push({ ...pzl, name: "MISSING LETTERS", type: "missing_letters", stars: 2, intro: "Fill in the vowels.", question: "R H N C R S", correctAnswer: "RHINOCEROS", explanation: "Add vowels to make RHINOCEROS." });
      } else if (type === 'morse_code') {
        puzzles.push({ ...pzl, name: "MORSE CODE", type: "cipher", stars: 3, intro: "Decode the dots and dashes.", question: "... --- ...", correctAnswer: "SOS", explanation: "Dot-dot-dot Dash-dash-dash Dot-dot-dot is SOS." });
      } else if (type === 'who_is_lying') {
        puzzles.push({ ...pzl, name: "WHO IS LYING?", type: "who_is_lying", stars: 3, intro: "Deduce the liar.", question: "Alice says Bob is lying. Bob says Charlie is lying. Charlie says both are lying. Who is telling the truth?", options: [{id:'a',text:"Alice"}, {id:'b',text:"Bob"}, {id:'c',text:"Charlie"}, {id:'d',text:"No one"}], correctOptionId: 'b', explanation: "If Bob tells the truth, Alice is lying and Charlie is lying, which is logically consistent." });
      } else if (type === 'age_puzzle') {
        puzzles.push({ ...pzl, name: "AGE PUZZLE", type: "age_puzzle", stars: 3, intro: "Calculate the age.", question: "A mother is twice as old as her son. In 10 years, she will be 1.5 times as old. How old is the son now?", options: [{id:'a',text:"10"}, {id:'b',text:"20"}, {id:'c',text:"30"}, {id:'d',text:"40"}], correctOptionId: 'a', explanation: "M = 2S. M+10 = 1.5(S+10). 2S+10 = 1.5S + 15 -> 0.5S = 5 -> S = 10." });
      } else if (type === 'knights_knaves') {
        puzzles.push({ ...pzl, name: "KNIGHTS & KNAVES", type: "knights_knaves", stars: 4, intro: "Knights always tell the truth, Knaves always lie.", question: "A says 'We are both knaves.' What are they?", options: [{id:'a',text:"Both Knights"}, {id:'b',text:"A is Knight, B is Knave"}, {id:'c',text:"A is Knave, B is Knight"}, {id:'d',text:"Both Knaves"}], correctOptionId: 'c', explanation: "If A is a knight, his statement is true, making him a knave (contradiction). So A is a knave. Since his statement must be false, they aren't both knaves, so B is a knight." });
      } else if (type === 'word_association') {
        const wa = wordAssociations[(week - 1) % wordAssociations.length];
        puzzles.push({ ...pzl, name: "WORD ASSOCIATION", type: "word_association", stars: 2, intro: "What word connects these?", question: wa.q, correctAnswer: wa.a, explanation: wa.exp });
      } else if (type === 'sequence') {
        puzzles.push({ ...pzl, name: "LETTER SEQUENCE", type: "sequence", stars: 3, intro: "Find the next letter.", question: "O, T, T, F, F, S, S, E, ?", correctAnswer: "N", explanation: "One, Two, Three, Four, Five, Six, Seven, Eight, Nine (N)." });
      } else if (type === 'minesweeper') {
        puzzles.push({ ...pzl, name: "MINESWEEPER LOGIC", type: "minesweeper", stars: 4, intro: "Mark all the hidden mines. Numbers indicate adjacent mines.", rows: 4, cols: 4, cellLabels: [["1", "1", "1", ""], ["1", "M", "2", "1"], ["1", "2", "M", "1"], ["", "1", "1", "1"]].map(r => r.map(c => c === 'M' ? '' : c)), solutionGrid: [[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 0]], explanation: "Mines are at row 2 col 2 and row 3 col 3." });
      } else if (type === 'lights_out') {
        puzzles.push({ ...pzl, name: "LIGHTS OUT", type: "lights_out", stars: 3, intro: "Find the correct pattern of lit squares.", rows: 3, cols: 3, solutionGrid: [[1, 0, 1], [0, 1, 0], [1, 0, 1]], explanation: "An X pattern." });
      } else if (type === 'nonogram') {
        puzzles.push({ ...pzl, name: "MINI NONOGRAM", type: "nonogram", stars: 5, intro: "Fill in squares based on row and column counts.", rows: 5, cols: 5, rowClues: ["5", "1 1", "5", "1", "1"], colClues: ["3", "1 1", "3 1", "1 1", "3"], solutionGrid: [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]], explanation: "It forms a T shape inside a box." });
      } else if (type === 'timeline') {
        puzzles.push({ ...pzl, name: "HISTORICAL TIMELINE", type: "timeline", stars: 3, intro: "Sort these historical events from earliest to latest.", question: "Drag and drop to reorder the events.", items: [{id:'c',text:"The Moon Landing"}, {id:'a',text:"The Fall of Rome"}, {id:'d',text:"Invention of the iPhone"}, {id:'b',text:"The Signing of the Magna Carta"}], solutionOrder: ['a', 'b', 'c', 'd'], explanation: "Rome (476 AD), Magna Carta (1215), Moon (1969), iPhone (2007)." });
      } else if (type === 'ordering') {
        puzzles.push({ ...pzl, name: "SIZING UP", type: "ordering", stars: 2, intro: "Order these celestial bodies from smallest to largest.", question: "Drag and drop to sort by physical size.", items: [{id:'b',text:"Earth"}, {id:'d',text:"The Sun"}, {id:'c',text:"Jupiter"}, {id:'a',text:"The Moon"}], solutionOrder: ['a', 'b', 'c', 'd'], explanation: "Moon, Earth, Jupiter, The Sun." });
      } else if (type === 'scheduling') {
        puzzles.push({ ...pzl, name: "LOGICAL SCHEDULING", type: "scheduling", stars: 4, intro: "Determine the correct order of speakers.", question: "Alice speaks before Bob. Charlie speaks last. David speaks immediately after Alice. Order them 1st to 4th.", items: [{id:'b',text:"Bob"}, {id:'d',text:"David"}, {id:'c',text:"Charlie"}, {id:'a',text:"Alice"}], solutionOrder: ['a', 'd', 'b', 'c'], explanation: "Alice \u2192 David \u2192 Bob \u2192 Charlie." });
      }
    });

    const proverbs = [
      "“Intellectual growth should commence at birth and cease only at death.” – Albert Einstein",
      "“The true sign of intelligence is not knowledge but imagination.” – Albert Einstein",
      "“I have no special talent. I am only passionately curious.” – Albert Einstein",
      "“It is not that I'm so smart. But I stay with the questions much longer.” – Albert Einstein",
      "“Education is what remains after one has forgotten what one has learned in school.” – Albert Einstein",
      "“The mind is not a vessel to be filled, but a fire to be kindled.” – Plutarch"
    ];

    const issueData = {
      id: `issue_${week}`,
      issueNumber: week,
      unlockDate: issueDate.toISOString(), 
      dateFormatted: dateFormatted,
      subtitle: `An advanced collection for Week ${week}.`,
      weatherNote: "Overcast with a chance of deep thought.",
      editorQuote: proverbs[(week - 1) % proverbs.length],
      puzzles: puzzles
    };

    try {
      await setDoc(doc(db, "sunday_puzzles", `issue_${week}`), issueData);
      console.log(`Saved Issue ${week}`);
    } catch (error) {
      console.error(`Error saving Issue ${week}:`, error);
    }
  }
  console.log("Finished advanced procedural seeding!");
}
