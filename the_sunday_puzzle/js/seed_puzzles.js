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
      ["C", "A", "C", "A", "O"],
      ["A", "L", "O", "H", "A"],
      ["B", "I", "R", "E", "T"],
      ["A", "B", "U", "S", "E"],
      ["L", "I", "M", "E", "S"]
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, text: "Chocolate source" },
        { num: 6, row: 1, col: 0, text: "Island greeting" },
        { num: 7, row: 2, col: 0, text: "Clerical cap (abbr/var)" },
        { num: 8, row: 3, col: 0, text: "Misuse of power" },
        { num: 9, row: 4, col: 0, text: "Citrus fruits" }
      ],
      down: [
        { num: 1, row: 0, col: 0, text: "Secret political clique" },
        { num: 2, row: 0, col: 1, text: "Excuses for absence" },
        { num: 3, row: 0, col: 2, text: "Central core (var)" },
        { num: 4, row: 0, col: 3, text: "Say hoarse greetings" },
        { num: 5, row: 0, col: 4, text: "Grains" }
      ]
    }
  },
  {
    solution: [
      ["A", "B", "B", "A", "S"],
      ["R", "E", "O", "U", "T"],
      ["G", "A", "U", "G", "E"],
      ["O", "R", "G", "A", "N"],
      ["N", "S", "H", "E", "S"]
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, text: "Fathers (Arabic)" },
        { num: 6, row: 1, col: 0, text: "Re-issue (abbr)" },
        { num: 7, row: 2, col: 0, text: "Measuring instrument" },
        { num: 8, row: 3, col: 0, text: "Musical instrument" },
        { num: 9, row: 4, col: 0, text: "Female pronouns" }
      ],
      down: [
        { num: 1, row: 0, col: 0, text: "Inert gas" },
        { num: 2, row: 0, col: 1, text: "Animal friend" },
        { num: 3, row: 0, col: 2, text: "Tree branch" },
        { num: 4, row: 0, col: 3, text: "Augments" },
        { num: 5, row: 0, col: 4, text: "Saint (abbr)" }
      ]
    }
  },
  {
    solution: [
      ["W", "A", "T", "E", "R"],
      ["A", "B", "O", "D", "E"],
      ["T", "O", "W", "E", "L"],
      ["E", "D", "E", "N", "S"],
      ["R", "E", "L", "S", "T"]
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, text: "Clear liquid" },
        { num: 6, row: 1, col: 0, text: "Dwelling" },
        { num: 7, row: 2, col: 0, text: "Bath accessory" },
        { num: 8, row: 3, col: 0, text: "Paradises" },
        { num: 9, row: 4, col: 0, text: "Nonsense word" }
      ],
      down: [
        { num: 1, row: 0, col: 0, text: "Drink" },
        { num: 2, row: 0, col: 1, text: "To abide" },
        { num: 3, row: 0, col: 2, text: "Dry" },
        { num: 4, row: 0, col: 3, text: "Gardens" },
        { num: 5, row: 0, col: 4, text: "Anagram" }
      ]
    }
  },
  {
    solution: [
      ["S", "P", "I", "C", "E"],
      ["P", "O", "C", "O", "X"],
      ["O", "M", "E", "G", "A"],
      ["O", "P", "E", "N", "S"],
      ["K", "E", "B", "A", "B"]
    ],
    clues: {
      across: [
        { num: 1, row: 0, col: 0, text: "Flavoring" },
        { num: 6, row: 1, col: 0, text: "A little (musical)" },
        { num: 7, row: 2, col: 0, text: "Greek letter" },
        { num: 8, row: 3, col: 0, text: "Unlocks" },
        { num: 9, row: 4, col: 0, text: "Skewered meat" }
      ],
      down: [
        { num: 1, row: 0, col: 0, text: "Scare" },
        { num: 2, row: 0, col: 1, text: "Apple fruit" },
        { num: 3, row: 0, col: 2, text: "Frosty" },
        { num: 4, row: 0, col: 3, text: "Cog" },
        { num: 5, row: 0, col: 4, text: "Old partners" }
      ]
    }
  }
];

/* --------------------------------------------------------------------------
   CONNECTIONS POOL
   -------------------------------------------------------------------------- */
const connectionsPool = [
  { name: "KINDS OF BEANS", words: ["LIMA", "PINTO", "COFFEE", "HUMAN"] },
  { name: "METEOROLOGICAL EVENTS", words: ["HAIL", "RAIN", "SNOW", "SLEET"] },
  { name: "FOUND ON A KEYBOARD", words: ["SPACE", "SHIFT", "ENTER", "COMMAND"] },
  { name: "SYNONYMS FOR FAST", words: ["QUICK", "RAPID", "SWIFT", "FLEET"] },
  { name: "PARTS OF A CAR", words: ["ENGINE", "BRAKE", "TIRE", "CLUTCH"] },
  { name: "SHADES OF BLUE", words: ["NAVY", "TEAL", "CYAN", "AZURE"] },
  { name: "TYPES OF DANCES", words: ["TANGO", "WALTZ", "SALSA", "SWING"] },
  { name: "THINGS WITH KEYS", words: ["PIANO", "LOCK", "FLORIDA", "MAP"] },
  { name: "SYNONYMS FOR HAPPY", words: ["GLAD", "JOYFUL", "MERRY", "CHEERFUL"] },
  { name: "FOUR SEASONS", words: ["SPRING", "SUMMER", "FALL", "WINTER"] },
  { name: "CARD SUITS", words: ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"] },
  { name: "PLANETS", words: ["MARS", "VENUS", "JUPITER", "SATURN"] },
  { name: "GREEK GODS", words: ["ZEUS", "APOLLO", "ARES", "HERMES"] },
  { name: "TYPES OF CLOUDS", words: ["CIRRUS", "STRATUS", "CUMULUS", "NIMBUS"] },
  { name: "FOOTWEAR", words: ["BOOT", "SHOE", "SANDAL", "SLIPPER"] },
  { name: "MEASUREMENTS", words: ["INCH", "MILE", "YARD", "FOOT"] },
  { name: "BIRD SPECIES", words: ["EAGLE", "HAWK", "FINCH", "ROBIN"] },
  { name: "EUROPEAN CAPITALS", words: ["PARIS", "BERLIN", "MADRID", "ROME"] },
  { name: "GOLF TERMS", words: ["BIRDIE", "EAGLE", "BOGEY", "PAR"] },
  { name: "PRECIOUS METALS", words: ["GOLD", "SILVER", "PLATINUM", "BRONZE"] }
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
    
    // Dynamic Sudoku
    const { grid: sGrid, solution: sSol } = scrambleSudoku(baseSudokuGrid, baseSudokuSol);
    
    // Dynamic Math
    const math = generateMath(week);

    // Trivia
    const trivia = triviaQuestions[(week - 1) % triviaQuestions.length];

    // Crossword (Rotate 4)
    const cw = crosswords[(week - 1) % crosswords.length];

    // Connections (Pick 4 random categories)
    const shuffledPool = [...connectionsPool].sort(() => 0.5 - Math.random());
    const weekCategories = shuffledPool.slice(0, 4);

    const puzzles = [
      {
        id: `w${week}_p1`,
        num: "01",
        name: "THE CRYPTIC CROSSWORD",
        type: "crossword",
        stars: 4,
        intro: "A challenging 5×5 crossword with tricky clues.",
        gridSize: 5,
        perfectGrid: JSON.stringify(cw)
      },
      {
        id: `w${week}_p2`,
        num: "02",
        name: "DIABOLICAL SUDOKU",
        type: "sudoku",
        stars: 5,
        intro: "A true test of logic. 9x9 layout.",
        grid: JSON.stringify(sGrid),
        solution: JSON.stringify(sSol)
      },
      {
        id: `w${week}_p3`,
        num: "03",
        name: "QUANTITATIVE REASONING",
        type: "math",
        stars: 4,
        intro: "Solve the mathematical problem.",
        question: math.q,
        correctAnswer: math.a,
        explanation: math.exp
      },
      {
        id: `w${week}_p4`,
        num: "04",
        name: "HIGHBROW TRIVIA",
        type: "trivia",
        stars: 3,
        intro: "A question for the well-read.",
        question: trivia.q,
        options: [
          { id: "a", text: trivia.opts[0] },
          { id: "b", text: trivia.opts[1] },
          { id: "c", text: trivia.opts[2] },
          { id: "d", text: trivia.opts[3] }
        ],
        correctOptionId: trivia.ans,
        explanation: trivia.explanation
      },
      {
        id: `w${week}_p5`,
        num: "05",
        name: "THE SUNDAY GROUPING",
        type: "connections",
        stars: 3,
        intro: "Find the 4 hidden groups of 4 related words.",
        categories: JSON.stringify(weekCategories)
      }
    ];

    const issueData = {
      id: `issue_${week}`,
      issueNumber: week,
      unlockDate: issueDate.toISOString(), 
      dateFormatted: dateFormatted,
      subtitle: `An advanced collection for Week ${week}.`,
      weatherNote: "Overcast with a chance of deep thought.",
      editorQuote: "“Intellectual growth should commence at birth and cease only at death.” – Albert Einstein",
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
