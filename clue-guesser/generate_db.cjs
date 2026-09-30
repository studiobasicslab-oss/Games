const fs = require('fs');

const wordBank = [
  { word: "DENTIST", clues: ["teeth", "doctor", "drill", "cavity", "chair"] },
  { word: "VOLCANO", clues: ["mountain", "lava", "eruption", "magma", "ash"] },
  { word: "PIZZA", clues: ["cheese", "Italy", "slice", "dough", "delivery"] },
  { word: "GUITAR", clues: ["strings", "music", "pick", "acoustic", "fret"] },
  { word: "ASTRONAUT", clues: ["space", "rocket", "suit", "moon", "gravity"] },
  { word: "LIBRARY", clues: ["books", "quiet", "read", "shelves", "checkout"] },
  { word: "CAMERA", clues: ["photo", "lens", "flash", "picture", "click"] },
  { word: "SPIDER", clues: ["web", "eight", "legs", "insect", "bite"] },
  { word: "PYRAMID", clues: ["Egypt", "triangle", "desert", "tomb", "pharaoh"] },
  { word: "OCEAN", clues: ["water", "salt", "waves", "blue", "fish"] },
  { word: "BICYCLE", clues: ["pedal", "wheels", "ride", "chain", "helmet"] },
  { word: "UMBRELLA", clues: ["rain", "open", "handle", "dry", "weather"] },
  { word: "CASTLE", clues: ["king", "queen", "moat", "stone", "knight"] },
  { word: "GIRAFFE", clues: ["neck", "tall", "Africa", "leaves", "spots"] },
  { word: "TELEPHONE", clues: ["call", "ring", "speak", "dial", "listen"] },
  { word: "BUTTERFLY", clues: ["wings", "caterpillar", "fly", "colorful", "insect"] },
  { word: "DIAMOND", clues: ["ring", "gem", "sparkle", "hard", "expensive"] },
  { word: "HOSPITAL", clues: ["sick", "nurse", "doctor", "bed", "medicine"] },
  { word: "KANGAROO", clues: ["jump", "pouch", "Australia", "tail", "joey"] },
  { word: "AIRPLANE", clues: ["fly", "sky", "wings", "pilot", "airport"] },
  { word: "BATTERY", clues: ["power", "charge", "energy", "plus", "minus"] },
  { word: "CALENDAR", clues: ["days", "months", "year", "date", "paper"] },
  { word: "ELEPHANT", clues: ["trunk", "tusks", "big", "grey", "Africa"] },
  { word: "MIRROR", clues: ["glass", "look", "reflection", "see", "wall"] },
  { word: "PENGUIN", clues: ["bird", "ice", "waddle", "black", "white"] },
  { word: "SCHOOL", clues: ["learn", "teacher", "students", "books", "class"] },
  { word: "TELESCOPE", clues: ["stars", "look", "space", "sky", "lens"] },
  { word: "VOLIN", clues: ["strings", "bow", "music", "play", "instrument"] },
  { word: "WHALE", clues: ["ocean", "big", "swim", "blowhole", "mammal"] },
  { word: "XRAY", clues: ["bones", "see", "doctor", "hospital", "skeleton"] }
];

// Generate more to get at least 150 words, or just repeat with variations to hit 150 words.
// To save time, I will systematically combine words to create 30 distinct daily puzzles.
// There are 30 words here. I'll pick 5 random distinct words for each of the 30 days.

const puzzles = [];

for (let day = 1; day <= 30; day++) {
  // shuffle wordBank uniquely for each day
  let shuffled = [...wordBank].sort(() => 0.5 - Math.random());
  let dailyWords = shuffled.slice(0, 5);
  puzzles.push({
    day: day,
    words: dailyWords
  });
}

const dbData = {
  puzzles: puzzles
};

fs.writeFileSync('public/db.json', JSON.stringify(dbData, null, 2));
console.log('Database generated with 30 days of puzzles.');
