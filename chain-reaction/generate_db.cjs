const fs = require('fs');

const chains = [
  ["FIRE", "MAN", "UP", "HILL", "SIDE", "KICK"],
  ["WATER", "FALL", "OUT", "BACK", "PACK", "ANIMAL"],
  ["SUN", "LIGHT", "HOUSE", "WORK", "OUT", "FIT"],
  ["SNOW", "BALL", "PARK", "WAY", "SIDE", "WALK"],
  ["NIGHT", "TIME", "LINE", "UP", "BEAT", "BOX"],
  ["RAIN", "BOW", "TIE", "BREAK", "FAST", "FOOD"],
  ["BLACK", "BIRD", "WATCH", "DOG", "HOUSE", "PARTY"],
  ["BLUE", "BERRY", "FARM", "LAND", "MARK", "DOWN"],
  ["GOLD", "RUSH", "HOUR", "GLASS", "DOOR", "BELL"],
  ["SILVER", "LINING", "UP", "START", "OVER", "TIME"],
  ["GREEN", "HOUSE", "FLY", "WHEEL", "CHAIR", "LIFT"],
  ["RED", "HOT", "DOG", "WOOD", "WORK", "SHOP"],
  ["WHITE", "BOARD", "GAME", "PLAN", "AHEAD", "TIME"],
  ["ICE", "CREAM", "PUFF", "PIECE", "WORK", "MAN"],
  ["COLD", "SHOULDER", "PAD", "LOCK", "SMITH", "SON"],
  ["HOT", "CAKE", "WALK", "OUT", "DOOR", "STEP"],
  ["SWEET", "HEART", "BEAT", "DOWN", "TOWN", "SQUARE"],
  ["SOUR", "DOUGH", "NUT", "SHELL", "SHOCK", "WAVE"],
  ["BITTER", "SWEET", "TOOTH", "PICK", "POCKET", "BOOK"],
  ["SALTY", "DOG", "EAR", "RING", "LEADER", "SHIP"],
  ["FAST", "TRACK", "RECORD", "PLAYER", "PIANO", "KEY"],
  ["SLOW", "DOWN", "FALL", "OUT", "CAST", "AWAY"],
  ["HIGH", "WAY", "WARD", "ROBE", "HOOK", "UP"],
  ["LOW", "KEY", "HOLE", "PUNCH", "LINE", "DANCE"],
  ["BIG", "TIME", "TABLE", "SPOON", "FEED", "BACK"],
  ["SMALL", "TALK", "SHOW", "CASE", "STUDY", "HALL"],
  ["GOOD", "NIGHT", "CLUB", "HOUSE", "WIFE", "LIFE"],
  ["BAD", "GUY", "WIRE", "TAP", "WATER", "FALL"],
  ["NEW", "YEAR", "BOOK", "MARK", "TIME", "OUT"],
  ["OLD", "SCHOOL", "YARD", "STICK", "PIN", "WHEEL"]
];

const puzzles = chains.map((chain, index) => {
  return {
    day: index + 1,
    chain: chain
  };
});

fs.writeFileSync('public/db.json', JSON.stringify({ puzzles }, null, 2));
console.log('Database generated with 30 word chains.');
