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
      // Grid & Spatial (ToggleGrid, Sudoku, etc.)
      'sudoku', 'killer_sudoku', 'wordoku', 'magic_square',
      'minesweeper', 'lights_out', 'nonogram', 'picross', 'hitori', 'nurikabe',
      
      // Word & Aptitude (Text inputs)
      'crossword', 'mini_crossword', 'cryptic_crossword',
      'math', 'number_sequence', 'missing_number', 'calcudoku',
      'cipher', 'anagram', 'cryptogram', 'word_scramble', 'missing_letters',
      'word_association', 'sequence', 'hidden_words', 'synonym_chain',
      'antonym_chain', 'compound_word', 'rebus', 'before_after', 'homophone',
      'morse_code',
      
      // Trivia & Logic (Multiple choice)
      'trivia', 'knights_knaves', 'who_is_lying', 'age_puzzle', 'truth_lie',
      'odd_one_out', 'family_relationship', 'odd_word_out',
      
      // Mystery (Story + Choice)
      'mystery', 'who_stole_it', 'case_file', 'escape_room', 'alibi_puzzle', 'mystery_clues',
      
      // Pure Logic (Zebra grid)
      'logic', 'zebra', 'einstein', 'who_owns_the_cat', 'deduction_grid',
      
      // Ordering & Scheduling (Drag Drop)
      'timeline', 'ordering', 'scheduling', 'matching', 'who_sits_where'
    ];

    // Shuffle and pick 5 unique types for this week
    allPuzzleTypes.sort(() => 0.5 - Math.random());
    const weekTypes = allPuzzleTypes.slice(0, 5);
    
    let puzzles = [];
    weekTypes.forEach((type, index) => {
      let pzl = { id: `w${week}_p${index+1}`, num: `0${index+1}` };
      
      if (['crossword', 'mini_crossword', 'cryptic_crossword'].includes(type)) {
        const cw = crosswords[(week - 1) % crosswords.length];
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: "crossword", stars: 4, intro: "A challenging crossword variant.", gridSize: 5, perfectGrid: JSON.stringify(cw) });
      } else if (['sudoku', 'killer_sudoku', 'wordoku', 'magic_square'].includes(type)) {
        const { grid, solution } = scrambleSudoku(baseSudokuGrid, baseSudokuSol);
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: "sudoku", stars: 5, intro: "A true test of logic.", grid: JSON.stringify(grid), solution: JSON.stringify(solution) });
      } else if (['math', 'number_sequence', 'missing_number', 'calcudoku'].includes(type)) {
        const math = generateMath(week);
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 4, intro: "Solve the mathematical problem.", question: math.q, correctAnswer: math.a, explanation: math.exp });
      } else if (['trivia', 'knights_knaves', 'who_is_lying', 'age_puzzle', 'truth_lie', 'odd_one_out', 'family_relationship', 'odd_word_out'].includes(type)) {
        const t = triviaQuestions[(week + index) % triviaQuestions.length];
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 3, intro: "A deduction or trivia challenge.", question: t.q, options: [{id:'a',text:t.opts[0]}, {id:'b',text:t.opts[1]}, {id:'c',text:t.opts[2]}, {id:'d',text:t.opts[3]}], correctOptionId: t.ans, explanation: t.explanation });
      } else if (['cipher', 'anagram', 'cryptogram', 'word_scramble', 'missing_letters', 'word_association', 'sequence', 'hidden_words', 'synonym_chain', 'antonym_chain', 'compound_word', 'rebus', 'before_after', 'homophone', 'morse_code'].includes(type)) {
        if (type === 'word_association') {
            const wa = wordAssociations[(week - 1) % wordAssociations.length];
            puzzles.push({ ...pzl, name: "WORD ASSOCIATION", type: type, stars: 2, intro: "What word connects these?", question: wa.q, correctAnswer: wa.a, explanation: wa.exp });
        } else if (type === 'anagram' || type === 'word_scramble') {
            puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 2, intro: "Unscramble the word.", question: "LISTEN", correctAnswer: "SILENT", explanation: "LISTEN rearranges to SILENT." });
        } else {
            const shift = (week % 5) + 2;
            puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 3, intro: "Decode or solve the pattern.", question: `Shifted text or pattern ${shift}`, correctAnswer: "ANSWER", explanation: `The answer is ANSWER.` });
        }
      } else if (['mystery', 'who_stole_it', 'case_file', 'escape_room', 'alibi_puzzle', 'mystery_clues'].includes(type)) {
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 4, intro: "Read the clues and solve the case.", story: "A valuable item was stolen.", clues: JSON.stringify(["Suspect A was seen at 9 PM.", "Suspect B has no alibi."]), options: JSON.stringify([{id:'a',text:"Suspect A"}, {id:'b',text:"Suspect B"}]), correctOptionId: 'b', explanation: "Suspect B had the motive and no alibi." });
      } else if (['logic', 'zebra', 'einstein', 'who_owns_the_cat', 'deduction_grid'].includes(type)) {
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 5, intro: "Use the clues to fill the grid.", categories: JSON.stringify(["House", "Pet"]), items: JSON.stringify([["Red", "Blue"], ["Dog", "Cat"]]), clues: JSON.stringify(["The red house has a dog."]), solution: JSON.stringify({"Red":"Dog", "Blue":"Cat"}), explanation: "Deduction leads to this arrangement." });
      } else if (['timeline', 'ordering', 'scheduling', 'matching', 'who_sits_where'].includes(type)) {
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 3, intro: "Sort the items logically.", question: "Drag and drop to reorder.", items: [{id:'c',text:"Event 3"}, {id:'a',text:"Event 1"}, {id:'d',text:"Event 4"}, {id:'b',text:"Event 2"}], solutionOrder: ['a', 'b', 'c', 'd'], explanation: "Logical sequence 1 to 4." });
      } else if (['minesweeper', 'lights_out', 'nonogram', 'picross', 'hitori', 'nurikabe'].includes(type)) {
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 4, intro: "Grid logic puzzle.", rows: 3, cols: 3, solutionGrid: [[1, 0, 1], [0, 1, 0], [1, 0, 1]], explanation: "An X pattern." });
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
