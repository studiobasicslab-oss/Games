export const ALL_WORDS = [
  { word: "DENTIST", clues: ["teeth", "doctor", "drill", "cavity", "chair"] },
  { word: "VOLCANO", clues: ["mountain", "lava", "eruption", "magma", "ash"] },
  { word: "PIZZA", clues: ["cheese", "Italy", "slice", "dough", "delivery"] },
  { word: "GUITAR", clues: ["strings", "music", "pick", "acoustic", "fret"] },
  { word: "ASTRONAUT", clues: ["space", "rocket", "suit", "moon", "gravity"] },
  { word: "LIBRARY", clues: ["books", "quiet", "read", "shelves", "checkout"] },
  { word: "CAMERA", clues: ["photo", "lens", "flash", "picture", "click"] },
  { word: "SPIDER", clues: ["web", "eight", "legs", "insect", "bite"] },
  { word: "PYRAMID", clues: ["Egypt", "triangle", "desert", "tomb", "pharaoh"] },
  { word: "OCEAN", clues: ["water", "salt", "waves", "blue", "fish"] }
];

export function getRandomWords(count = 5) {
  const shuffled = [...ALL_WORDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
