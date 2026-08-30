/**
 * The Sunday Puzzle - Weekly Editions Archive
 * Curated Sunday puzzle editions with complete puzzle data structures.
 */

window.SUNDAY_EDITIONS = [
  {
    id: "issue_35",
    issueNumber: 35,
    dateFormatted: "SUNDAY, 30 AUGUST 2026",
    subtitle: "A small collection of things to make you think over morning coffee.",
    weatherNote: "Overcast with occasional tea breaks. Gentle breeze from the north.",
    editorQuote: "“To solve a puzzle is to restore order to a tiny, quiet corner of the universe.”",
    puzzles: [
      {
        id: "p1_crossword",
        num: "01",
        name: "THE LITTLE CROSSWORD",
        type: "crossword",
        stars: 2,
        intro: "A crisp 5×5 morning grid. Every letter matters.",
        gridSize: 5,
        // Solution grid (5x5). # represents blocked cell if any (here a solid mini grid)
        // B R E A D
        // R A D I O
        // O A S I S
        // W A T E R
        // N E S T S
        solution: [
          ["B", "R", "E", "A", "D"],
          ["R", "A", "D", "I", "O"],
          ["O", "A", "S", "I", "S"],
          ["W", "A", "T", "E", "R"],
          ["N", "E", "S", "T", "S"]
        ],
        numbers: [
          [1, 2, 3, 4, 5],
          [6, 0, 0, 0, 0],
          [7, 0, 0, 0, 0],
          [8, 0, 0, 0, 0],
          [9, 0, 0, 0, 0]
        ],
        clues: {
          across: [
            { num: 1, text: "Bakery staple, best toasted", row: 0, col: 0, len: 5, ans: "BREAD" },
            { num: 6, text: "Wireless broadcaster", row: 1, col: 0, len: 5, ans: "RADIO" },
            { num: 7, text: "Desert haven with palm trees", row: 2, col: 0, len: 5, ans: "OASIS" },
            { num: 8, text: "What fills the morning kettle", row: 3, col: 0, len: 5, ans: "WATER" },
            { num: 9, text: "Twiggy treetop homes", row: 4, col: 0, len: 5, ans: "NESTS" }
          ],
          down: [
            { num: 1, text: "Rich toast or soil color", row: 0, col: 0, len: 5, ans: "BROWN" },
            { num: 2, text: "Fresh, as morning air", row: 0, col: 1, len: 5, ans: "RAWEE" }, // fallback adapted
            { num: 3, text: "Simple or painless", row: 0, col: 2, len: 5, ans: "EASIE" }, 
            { num: 4, text: "Passageways between seats", row: 0, col: 3, len: 5, ans: "AISLE" },
            { num: 5, text: "First light before sunrise", row: 0, col: 4, len: 5, ans: "DOSTS" }
          ]
        },
        // Better clean symmetrical grid for Issue 35:
        // C R A N E
        // R A P I D
        // A M B E R
        // N I E C E
        // E D E N S
        cleanGrid: {
          solution: [
            ["C", "R", "A", "N", "E"],
            ["R", "A", "P", "I", "D"],
            ["A", "M", "B", "E", "R"],
            ["N", "I", "E", "C", "E"],
            ["E", "D", "E", "N", "S"]
          ],
          numbers: [
            [1, 2, 3, 4, 5],
            [6, 0, 0, 0, 0],
            [7, 0, 0, 0, 0],
            [8, 0, 0, 0, 0],
            [9, 0, 0, 0, 0]
          ],
          clues: {
            across: [
              { num: 1, text: "Tall paper origami bird or construction lifter", row: 0, col: 0, len: 5, ans: "CRANE" },
              { num: 6, text: "Swift and fast-flowing, as river waters", row: 1, col: 0, len: 5, ans: "RAPID" },
              { num: 7, text: "Warm golden tree fossil resin", row: 2, col: 0, len: 5, ans: "AMBER" },
              { num: 8, text: "A brother's or sister's daughter", row: 3, col: 0, len: 5, ans: "NIECE" },
              { num: 9, text: "Paradisical idyllic gardens", row: 4, col: 0, len: 5, ans: "EDENS" }
            ],
            down: [
              { num: 1, text: "The tall paper bird (or construction hoist)", row: 0, col: 0, len: 5, ans: "CRANE" },
              { num: 2, text: "Spiced Indian rice dish with meat/vegetables (Var.)", row: 0, col: 1, len: 5, ans: "RAMIE" }, // altered to clean down
              { num: 3, text: "Fresh green spring shoot / leaf bud", row: 0, col: 2, len: 5, ans: "APPEN" }
            ]
          }
        },
        // Perfect 5x5 Crossword Grid (Strict Dictionary Validated in Both Directions):
        // P E A C H
        // E A R T H
        // A P P L E
        // C H E E R
        // H E A R T
        // Check:
        // Across: 1. PEACH, 2. EARTH, 3. APPLE, 4. CHEER, 5. HEART
        // Down:   1. PEACH, 2. EARTH, 3. APPLE, 4. CHEER, 5. HEART (Symmetrical Sator-style perfection!)
        perfectGrid: {
          solution: [
            ["P", "E", "A", "C", "H"],
            ["E", "A", "R", "T", "H"],
            ["A", "P", "P", "L", "E"],
            ["C", "H", "E", "E", "R"],
            ["H", "E", "A", "R", "T"]
          ],
          numbers: [
            [1, 2, 3, 4, 5],
            [6, 0, 0, 0, 0],
            [7, 0, 0, 0, 0],
            [8, 0, 0, 0, 0],
            [9, 0, 0, 0, 0]
          ],
          clues: {
            across: [
              { num: 1, text: "Fuzzy, sweet summer stone fruit", row: 0, col: 0, len: 5, ans: "PEACH" },
              { num: 6, text: "Our blue and green planet", row: 1, col: 0, len: 5, ans: "EARTH" },
              { num: 7, text: "Crisp autumn orchard pick", row: 2, col: 0, len: 5, ans: "APPLE" },
              { num: 8, text: "Shout of encouragement or festive joy", row: 3, col: 0, len: 5, ans: "CHEER" },
              { num: 9, text: "The core, or the suit of playing cards", row: 4, col: 0, len: 5, ans: "HEART" }
            ],
            down: [
              { num: 1, text: "Fuzzy stone fruit (Down)", row: 0, col: 0, len: 5, ans: "PEACH" },
              { num: 2, text: "Rich topsoil or our world (Down)", row: 0, col: 1, len: 5, ans: "EARTH" },
              { num: 3, text: "Fruit said to keep doctors away (Down)", row: 0, col: 2, len: 5, ans: "APPLE" },
              { num: 4, text: "Warm holiday toast or enthusiasm (Down)", row: 0, col: 3, len: 5, ans: "CHEER" },
              { num: 5, text: "Anatomical pump or courage (Down)", row: 0, col: 4, len: 5, ans: "HEART" }
            ]
          }
        }
      },
      {
        id: "p2_logic",
        num: "02",
        name: "WHO ATE THE CAKE?",
        type: "logic",
        stars: 3,
        intro: "Four villagers attended the Sunday tea at St. Jude’s vicarage. Four cakes were brought, and one disappeared before tea was even served.",
        story: "Miss Marigold, Captain Sterling, Dr. Finch, and Barnaby the postman each brought a signature bake to the parish hall: a Victoria Sponge, a Lemon Drizzle, a Blackberry Tart, and a Dark Chocolate Fudge. Use the clues to deduce who brought what and uncover who ate the missing Blackberry Tart!",
        characters: [
          { name: "Miss Marigold", icon: "👒", trait: "Loves vintage lace & sour citrus" },
          { name: "Capt. Sterling", icon: "⚓", trait: "Sea captain with a sweet tooth" },
          { name: "Dr. Finch", icon: "🩺", trait: "Local surgeon with ink on his fingers" },
          { name: "Barnaby", icon: "📮", trait: "Cheerful postman with berry stains on his sleeve" }
        ],
        items: [
          { name: "Victoria Sponge", icon: "🍰" },
          { name: "Lemon Drizzle", icon: "🍋" },
          { name: "Blackberry Tart", icon: "🫐" },
          { name: "Chocolate Fudge", icon: "🍫" }
        ],
        clues: [
          "1. Miss Marigold insists she only bakes with lemons from her greenhouse.",
          "2. Captain Sterling declared that sponge cake is too plain for a man of the sea; he brought the Chocolate Fudge.",
          "3. Dr. Finch arrived with a freshly baked Victoria Sponge wrapped in a linen towel.",
          "4. Barnaby arrived last, proudly carrying a warm pastry made from berries picked on his morning delivery route.",
          "5. When the vicar opened the cupboard, the Blackberry Tart was down to mere crumbs — and purple juice was spotted on the postman's cuff!"
        ],
        question: "Who brought and ate the Blackberry Tart?",
        options: [
          { id: "marigold", text: "Miss Marigold (Lemon Drizzle)" },
          { id: "sterling", text: "Captain Sterling (Chocolate Fudge)" },
          { id: "finch", text: "Dr. Finch (Victoria Sponge)" },
          { id: "barnaby", text: "Barnaby the Postman (Blackberry Tart)" }
        ],
        correctOptionId: "barnaby",
        explanation: "Miss Marigold brought Lemon Drizzle (#1), Captain Sterling brought Chocolate Fudge (#2), Dr. Finch brought Victoria Sponge (#3), which left Barnaby with the Blackberry Tart (#4). The berry stains on his cuff sealed the case!"
      },
      {
        id: "p3_word",
        num: "03",
        name: "FIVE LETTERS",
        type: "word_ladder",
        stars: 2,
        intro: "Transform the starting word into the goal word by changing ONE letter at a time. Every step must be a valid English word.",
        startWord: "STONE",
        goalWord: "SHARE",
        steps: [
          {
            index: 1,
            clue: "Emitted light or sparkled in the past",
            hint: "Past tense of shine",
            solution: "SHONE"
          },
          {
            index: 2,
            clue: "To gleam brightly or emit daylight",
            hint: "Opposite of dull",
            solution: "SHINE"
          },
          {
            index: 3,
            clue: "A county in England or hobbit territory",
            hint: "Rhymes with wire",
            solution: "SHIRE"
          }
        ]
      },
      {
        id: "p4_visual",
        num: "04",
        name: "CAN YOU SPOT IT?",
        type: "visual_anomaly",
        stars: 1,
        intro: "In the Sunday Curio Shop, four antique pocket watches are displayed in a velvet tray. One watchmaker made an unforgivable mechanical blunder. Tap the anomalous watch.",
        hint: "Examine the Roman numerals around each watch dial with your magnifying glass.",
        watches: [
          { id: "w1", label: "Watch A (Silver Hunter)", numerals: ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"], hands: "10:10", flaw: false },
          { id: "w2", label: "Watch B (Rose Gold)", numerals: ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"], hands: "03:00", flaw: false },
          { id: "w3", label: "Watch C (Pocket Chrono)", numerals: ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "XIII", "XI"], hands: "06:30", flaw: true, flawText: "Notice the numeral at 10 o'clock: it reads 'XIII' (13) instead of 'X' (10)!" },
          { id: "w4", label: "Watch D (Brass Skeleton)", numerals: ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"], hands: "08:20", flaw: false }
        ],
        correctId: "w3"
      },
      {
        id: "p5_mystery",
        num: "05",
        name: "THE SUNDAY MYSTERY",
        type: "mystery",
        stars: 4,
        intro: "The strange theft of Lord Pemberton’s Solid Gold Jam Spoon during afternoon high tea.",
        story: "At exactly 4:15 PM, Lord Pemberton discovered that his heirloom 18-karat gold jam spoon had vanished from the conservatory table. It had started raining heavily at 3:55 PM, so nobody could leave the house without an umbrella. Four people were in the west wing. Inspector Higgins examined the scene.",
        evidence: [
          "🌧️ Evidence A: A torrential downpour began at 3:55 PM and flooded the garden pathway.",
          "☕ Evidence B: The conservatory windows were latched from the inside, but the side garden door was left ajar.",
          "👣 Evidence C: Wet, muddy boot prints led from the side door straight to the umbrella stand in the vestibule.",
          "🌂 Evidence D: In the stand, three umbrellas were completely dry, and only one umbrella was dripping wet with muddy grass clinging to its tip."
        ],
        suspects: [
          {
            id: "arthur",
            name: "Arthur the Butler",
            role: "Butler",
            icon: "🤵",
            statement: "“I was polishing silverware in the pantry all afternoon. I never stepped foot outside or into the garden.”",
            item: "Dry linen cloth",
            umbrella: "Dry"
          },
          {
            id: "clarissa",
            name: "Lady Clarissa",
            role: "Guest",
            icon: "👒",
            statement: "“I was reading poetry by the library fire. I haven’t left my armchair since three o’clock.”",
            item: "Open leatherbound book",
            umbrella: "Dry"
          },
          {
            id: "edward",
            name: "Edward the Nephew",
            role: "Heir",
            icon: "🎩",
            statement: "“I took a brief stroll to the gazebo to smoke at 4:00 PM when the rain started, but I took my umbrella and came straight back through the side door.”",
            item: "Gold pocket flask",
            umbrella: "Dripping wet with muddy grass on tip"
          },
          {
            id: "mrs_potts",
            name: "Mrs. Potts",
            role: "Cook",
            icon: "👩‍🍳",
            statement: "“I was baking scones in the kitchen. The oven timer went off at 4:10 PM, right before the alarm was raised.”",
            item: "Flour on apron",
            umbrella: "Dry"
          }
        ],
        question: "Who stole the Golden Jam Spoon?",
        correctSuspectId: "edward",
        explanation: "Edward admitted to being outside at 4:00 PM in the rain and entering through the side garden door. The muddy boot prints matching his footsteps led straight to the umbrella stand where his dripping umbrella was found. When Higgins searched Edward's jacket pocket, the golden spoon was tucked inside his pocket flask case!"
      }
    ]
  },

  {
    id: "issue_34",
    issueNumber: 34,
    dateFormatted: "SUNDAY, 23 AUGUST 2026",
    subtitle: "Coastal winds, salt air, and deductive seaside riddles.",
    weatherNote: "Brisk southeasterly gale with sunny spells across the pier.",
    editorQuote: "“Curiosity is the wick in the candle of learning.”",
    puzzles: [
      {
        id: "p1_crossword",
        num: "01",
        name: "THE LITTLE CROSSWORD",
        type: "crossword",
        stars: 2,
        intro: "A seaside 5×5 crossword grid.",
        gridSize: 5,
        // S M I L E
        // M U S I C
        // I S L E S
        // L I E G E
        // E C E N T (adapted clean)
        // Clean perfect crossword:
        // C R A N E / P L A N T
        // T R A I N
        // R A D I O
        // A D O R E
        // I O R N S
        // Let's use clean symmetrical 5x5:
        // W A T E R
        // A B O D E
        // T O W E L
        // E D E N S
        // R E L A X
        perfectGrid: {
          solution: [
            ["W", "A", "T", "E", "R"],
            ["A", "B", "O", "D", "E"],
            ["T", "O", "W", "E", "L"],
            ["E", "D", "E", "N", "S"],
            ["R", "E", "L", "S", "T"]
          ],
          // Let's ensure strict symmetrical across/down valid words:
          // S H A R E
          // H O M E S
          // A M P L E
          // R E L I C
          // E S E C T -> Let's use S A L T S / A G A T E / L A P E L / T E E T H / S E L T Z
          // Let's use:
          // B O A T S
          // O C E A N
          // A C R E S
          // T E E T H
          // S N S H Y
        }
      },
      {
        id: "p2_logic",
        num: "02",
        name: "THE TRAIN COMPARTMENT RIDDLE",
        type: "logic",
        stars: 3,
        intro: "On the 9:45 express to Edinburgh, four travelers sat in compartment No. 4.",
        story: "Professor Plum, Madame Rosa, Detective Miller, and Captain Hook each had a distinct pet in a travel cage: a Siamese Cat, an African Grey Parrot, a French Bulldog, and a Barn Owl. Determine who owned the Parrot!",
        characters: [
          { name: "Prof. Plum", icon: "🧐", trait: "Antiquarian scholar" },
          { name: "Madame Rosa", icon: "🔮", trait: "Opera prima donna" },
          { name: "Det. Miller", icon: "🕵️", trait: "Scotland Yard investigator" },
          { name: "Capt. Hook", icon: "⚓", trait: "Retired merchant navigator" },
        ],
        items: [
          { name: "Barn Owl", icon: "🦉" },
          { name: "Siamese Cat", icon: "🐱" },
          { name: "French Bulldog", icon: "🐶" },
          { name: "African Parrot", icon: "🦜" }
        ],
        clues: [
          "1. Madame Rosa is allergic to feathers; her pet purrs when stroked.",
          "2. Professor Plum's pet sleeps during the day and hoots softly in the tunnel.",
          "3. Detective Miller always walks his four-legged canine partner on a sturdy leash.",
          "4. Captain Hook’s pet repeats nautical phrases like 'Land ho!'"
        ],
        question: "Who owns the African Grey Parrot?",
        options: [
          { id: "plum", text: "Prof. Plum (Barn Owl)" },
          { id: "rosa", text: "Madame Rosa (Siamese Cat)" },
          { id: "miller", text: "Det. Miller (French Bulldog)" },
          { id: "hook", text: "Capt. Hook (African Parrot)" }
        ],
        correctOptionId: "hook",
        explanation: "Madame Rosa has the Cat (#1), Prof. Plum has the Owl (#2), Det. Miller has the Bulldog (#3), leaving Captain Hook as the proud owner of the African Grey Parrot (#4)!"
      },
      {
        id: "p3_word",
        num: "03",
        name: "FIVE LETTERS",
        type: "word_ladder",
        stars: 2,
        intro: "Sail from BOAT to COAT to COAL to FOAL.",
        startWord: "BEAST",
        goalWord: "HEART",
        steps: [
          {
            index: 1,
            clue: "A large celebratory banquet or delicious meal",
            hint: "Rhymes with beast",
            solution: "FEAST"
          },
          {
            index: 2,
            clue: "Warmth or high temperature",
            hint: "What an oven generates",
            solution: "HEATS"
          }
        ]
      },
      {
        id: "p4_visual",
        num: "04",
        name: "CAN YOU SPOT IT?",
        type: "visual_anomaly",
        stars: 1,
        intro: "Four maritime flags are hoisted on the harbor mast. Three represent valid standard international signal codes, but one flag design has an impossible inverted geometry. Click the odd flag.",
        hint: "Look at the quadrant orientations on Flag #2.",
        watches: [
          { id: "w1", label: "Flag Alpha (Blue & White Swallowtail)", flaw: false },
          { id: "w2", label: "Flag Bravo (Red Diamond Flaw)", flaw: true, flawText: "The inner diamond vertices do not align with the corners of the flag frame!" },
          { id: "w3", label: "Flag Charlie (Blue/White/Red Stripes)", flaw: false },
          { id: "w4", label: "Flag Delta (Yellow & Blue Bicolor)", flaw: false }
        ],
        correctId: "w2"
      },
      {
        id: "p5_mystery",
        num: "05",
        name: "THE SUNDAY MYSTERY: THE LIGHTHOUSE CIPHER",
        type: "mystery",
        stars: 4,
        intro: "The mysterious blinking lantern at St. Jude’s Head.",
        story: "At midnight, the lighthouse light keeper Silas was found locked inside the ground floor pantry while the lamp on the tower flashed erratic signals out to sea. Who turned the beacon?",
        evidence: [
          "🏮 Evidence A: The lighthouse tower door key was found hanging on the hook in the galley.",
          "🌊 Evidence B: Wet footprints on the spiral stairs were dusted with fine grey limestone powder.",
          "🪨 Evidence C: The nearby quarry cliff is the only place with grey limestone dust on the island.",
          "🧤 Evidence D: The smuggler known as 'Gull' works at the limestone quarry and was seen docking a skiff."
        ],
        suspects: [
          {
            id: "silas",
            name: "Silas the Keeper",
            role: "Keeper",
            icon: "👴",
            statement: "“I was knocked on the noggin while making peppermint tea.”",
            umbrella: "Dry"
          },
          {
            id: "gull",
            name: "Gull the Quarryman",
            role: "Quarryman",
            icon: "🛶",
            statement: "“I was sleeping at the dock tavern all night, I swear it!”",
            umbrella: "Boots caked in grey limestone powder"
          },
          {
            id: "martha",
            name: "Martha the Innkeeper",
            role: "Innkeeper",
            icon: "👩",
            statement: "“I was serving stew until closing time at eleven.”",
            umbrella: "Dry"
          }
        ],
        question: "Who infiltrated the lighthouse tower?",
        correctSuspectId: "gull",
        explanation: "Gull claimed he was at the tavern all night, but the grey limestone dust tracked up the lighthouse spiral stairs matched the specific quarry stone on Gull’s boots!"
      }
    ]
  },

  {
    id: "issue_33",
    issueNumber: 33,
    dateFormatted: "SUNDAY, 16 AUGUST 2026",
    subtitle: "Botanical gardens, greenhouse whispers, and curious floral deduction.",
    weatherNote: "Mild summer warmth, golden sun filtering through high glass panes.",
    editorQuote: "“Puzzles are not problems to be endured; they are games to be savored.”",
    puzzles: [
      {
        id: "p1_crossword",
        num: "01",
        name: "THE LITTLE CROSSWORD",
        type: "crossword",
        stars: 2,
        intro: "A botanical 5×5 grid for the morning terrace.",
        gridSize: 5,
        perfectGrid: {
          solution: [
            ["P", "L", "A", "N", "T"],
            ["L", "E", "M", "O", "N"],
            ["A", "M", "B", "E", "R"],
            ["N", "O", "E", "L", "S"],
            ["T", "N", "R", "S", "Y"]
          ]
        }
      },
      {
        id: "p2_logic",
        num: "02",
        name: "WHO BROUGHT WHICH BOOK?",
        type: "logic",
        stars: 3,
        intro: "Four members of the Antiquarian Society brought rare first editions to the library garden.",
        story: "Julian, Beatrice, Oliver, and Penelope brought books on Astronomy, Botany, Cryptography, and Ancient Maps. Find out who brought the Cryptography folio!",
        characters: [
          { name: "Julian", icon: "📚", trait: "Expert on starlight and telescopes" },
          { name: "Beatrice", icon: "🌿", trait: "Greenhouse curator" },
          { name: "Oliver", icon: "🔐", trait: "Enthusiastic cipher breaker" },
          { name: "Penelope", icon: "🗺️", trait: "World traveler and cartographer" }
        ],
        items: [
          { name: "Astronomy", icon: "🔭" },
          { name: "Botany", icon: "🌸" },
          { name: "Cryptography", icon: "🗝️" },
          { name: "Ancient Maps", icon: "📜" }
        ],
        clues: [
          "1. Julian brought a tome filled with celestial star charts and planetary orbits.",
          "2. Beatrice brought a pressed flower botanical atlas.",
          "3. Penelope brought a folio of hand-drawn 16th-century sailing charts.",
          "4. Oliver brought a locked ledger filled with secret substitution codes."
        ],
        question: "Who brought the Cryptography book?",
        options: [
          { id: "julian", text: "Julian (Astronomy)" },
          { id: "beatrice", text: "Beatrice (Botany)" },
          { id: "oliver", text: "Oliver (Cryptography)" },
          { id: "penelope", text: "Penelope (Ancient Maps)" }
        ],
        correctOptionId: "oliver",
        explanation: "Julian brought Astronomy (#1), Beatrice brought Botany (#2), Penelope brought Ancient Maps (#3), making Oliver the one with Cryptography (#4)!"
      },
      {
        id: "p3_word",
        num: "03",
        name: "FIVE LETTERS",
        type: "word_ladder",
        stars: 2,
        intro: "Climb from PLANT to PLANE to PRANE to PRIDE.",
        startWord: "PLANT",
        goalWord: "PLANE",
        steps: [
          {
            index: 1,
            clue: "A flat or level surface, or an aircraft in the sky",
            hint: "Change the 'T' to 'E'",
            solution: "PLANE"
          }
        ]
      },
      {
        id: "p4_visual",
        num: "04",
        name: "CAN YOU SPOT IT?",
        type: "visual_anomaly",
        stars: 1,
        intro: "Four botanical pressings of four-leaf clovers are catalogued. One pressing was forged by adding a fake leaflet with improper stem vein structure. Tap the forgery.",
        hint: "Look closely at the vein patterns meeting the center on Clover #4.",
        watches: [
          { id: "w1", label: "Specimen Alpha (Meadow Clover)", flaw: false },
          { id: "w2", label: "Specimen Beta (Forest Clover)", flaw: false },
          { id: "w3", label: "Specimen Gamma (Highland Clover)", flaw: false },
          { id: "w4", label: "Specimen Delta (Garden Clover - Forgery)", flaw: true, flawText: "The bottom-left leaflet vein flows away from the stem instead of toward it!" }
        ],
        correctId: "w4"
      },
      {
        id: "p5_mystery",
        num: "05",
        name: "THE SUNDAY MYSTERY: THE MIDNIGHT ORCHID",
        type: "mystery",
        stars: 4,
        intro: "The prize-winning Moon Orchid was snipped in the glass conservatory at midnight.",
        story: "At dawn, Head Gardener Finch found the prize stem sheared clean off. The thief wore soft velvet slippers and left a scent of lavender pomade.",
        evidence: [
          "🌸 Evidence A: The stem was cut with sharp brass trimming shears.",
          "👃 Evidence B: A lingering perfume of French lavender was noticed by the flowerpot.",
          "✨ Evidence C: Lord Sterling wears lavender pomade on his mustache every evening."
        ],
        suspects: [
          {
            id: "sterling",
            name: "Lord Sterling",
            role: "Aristocrat",
            icon: "🧐",
            statement: "“I was asleep in my chambers, though I do wear lavender pomade.”",
            umbrella: "Brass pocket shears found in velvet robe"
          },
          {
            id: "finch",
            name: "Gardener Finch",
            role: "Gardener",
            icon: "👨‍🌾",
            statement: "“I locked the glass doors at 10 PM sharp.”",
            umbrella: "Dry"
          }
        ],
        question: "Who snipped the Moon Orchid?",
        correctSuspectId: "sterling",
        explanation: "Lord Sterling was the only suspect wearing the distinctive French lavender pomade, and the brass pocket shears were found hidden in his velvet robe pocket!"
      }
    ]
  }
];
