/**
 * LINKED - Puzzles and Knowledge Graph Database
 * Contains curated puzzles across difficulties and modes, canonical chains,
 * hint tracks, concept dictionaries, and semantic relationship graph.
 */

export const CONNECTION_TYPES = {
    PERSON: { id: "person", label: "Person", icon: "👤", color: "#60a5fa", description: "Historical figures, celebrities, scientists, creators" },
    PLACE: { id: "place", label: "Place", icon: "📍", color: "#34d399", description: "Countries, cities, landmarks, celestial bodies" },
    OBJECT: { id: "object", label: "Object", icon: "📦", color: "#f59e0b", description: "Artifacts, tools, everyday items, devices" },
    EVENT: { id: "event", label: "Event", icon: "⚡", color: "#f43f5e", description: "Historical events, missions, discoveries, phenomena" },
    FOOD: { id: "food", label: "Food & Drink", icon: "🍕", color: "#fb923c", description: "Ingredients, dishes, beverages, cuisine" },
    POPCULTURE: { id: "popculture", label: "Pop Culture", icon: "🎬", color: "#a855f7", description: "Movies, actors, games, music, characters" },
    SCIENCE: { id: "science", label: "Science & Nature", icon: "🔬", color: "#06b6d4", description: "Theories, elements, physics, biology, animals" },
    WORD: { id: "word", label: "Word Association", icon: "🔗", color: "#ec4899", description: "Etymology, puns, compound words, symbolism" }
};

export const DIFFICULTY_LEVELS = {
    EASY: { id: "easy", label: "Easy", color: "#10b981", icon: "🟢", desc: "Strong, direct, intuitive connections" },
    MEDIUM: { id: "medium", label: "Medium", color: "#f59e0b", icon: "🟡", desc: "Requires domain knowledge & cultural memory" },
    HARD: { id: "hard", label: "Hard", color: "#ef4444", icon: "🔴", desc: "Requires lateral thinking & historical leaps" },
    INSANE: { id: "insane", label: "Insane", color: "#a855f7", icon: "🟣", desc: "Wildly indirect but logically brilliant" }
};

export const GAME_MODES = {
    DAILY: { id: "daily", name: "Daily Four", icon: "🌎", description: "Today's synchronized global puzzle. 60s timer." },
    KNOWLEDGE: { id: "knowledge", name: "Knowledge", icon: "🧠", description: "Science, History, Geography, Inventions." },
    POPCULTURE: { id: "popculture", name: "Pop Culture", icon: "🎬", description: "Movies, Music, Gaming, Superheroes." },
    EVERYDAY: { id: "everyday", name: "Everyday", icon: "🍔", description: "Food, Objects, Brands, Daily Life." },
    CHAOS: { id: "chaos", name: "Chaos", icon: "😈", description: "Unpredictable pairings requiring insane lateral jumps." },
    ENDLESS: { id: "endless", name: "Free Play", icon: "✨", description: "Procedural puzzles across all difficulty levels." },
    SPEEDRUN: { id: "speedrun", name: "Speed Duel", icon: "⚔️", description: "60-second adrenaline race for max star quality." }
};

export const CURATED_PUZZLES = [
    // 1. Moon Landing -> Peanut Butter Sandwich (User prompt showcase)
    {
        id: "puz-moon-pb",
        mode: "knowledge",
        difficulty: "hard",
        title: "Space & Spreads",
        start: { name: "Moon Landing", icon: "🌙", type: "event", clue: "1969 Apollo 11 human achievement" },
        end: { name: "Peanut Butter Sandwich", icon: "🥜", type: "food", clue: "Classic lunchroom staple" },
        canonicalChain: [
            { name: "Tang", type: "food", reason: "Tang was famously popularized during NASA's Gemini & Apollo space missions." },
            { name: "Orange", type: "food", reason: "Tang is an iconic orange-flavored powdered beverage mix." },
            { name: "Jam", type: "food", reason: "Oranges are made into marmalade/jam fruit preserves." },
            { name: "Peanut Butter", type: "food", reason: "Jam and peanut butter are the iconic duo in PB&J sandwiches." }
        ],
        altChains: [
            ["NASA", "Space Research", "Agriculture", "Peanuts"],
            ["Apollo 11", "Neil Armstrong", "Ohio", "Peanut Festival"]
        ],
        hints: [
            { step: 1, type: "food", letter: "T", text: "Think of an orange powdered drink famously brought into space by NASA." },
            { step: 2, type: "food", letter: "O", text: "What citrus fruit gives that space drink its distinct flavor?" },
            { step: 3, type: "food", letter: "J", text: "What sweet fruit spread pairs with peanut butter on sliced bread?" },
            { step: 4, type: "food", letter: "P", text: "What nutty spread is the primary ingredient before the sandwich is made?" }
        ]
    },

    // 2. Ancient Rome -> Pizza (User prompt showcase)
    {
        id: "puz-rome-pizza",
        mode: "everyday",
        difficulty: "easy",
        title: "Empire to Slice",
        start: { name: "Ancient Rome", icon: "🏛️", type: "place", clue: "The historic classical civilization on the Tiber" },
        end: { name: "Pizza", icon: "🍕", type: "food", clue: "Neapolitan flatbread with sauce and melted toppings" },
        canonicalChain: [
            { name: "Italy", type: "place", reason: "Rome is the capital and historical heart of modern Italy." },
            { name: "Tomatoes", type: "food", reason: "Tomatoes are a cornerstone of Italian cuisine and pomodoro sauces." },
            { name: "Mozzarella", type: "food", reason: "Fresh mozzarella and tomatoes form traditional Caprese and pasta pairings." },
            { name: "Crust", type: "food", reason: "Mozzarella and tomato sauce are baked together on yeast dough crust." }
        ],
        altChains: [
            ["Italy", "Naples", "Margherita", "Oven"],
            ["Colosseum", "Rome", "Italian Cuisine", "Mozzarella"]
        ],
        hints: [
            { step: 1, type: "place", letter: "I", text: "The modern country whose historical origin was the Roman Empire." },
            { step: 2, type: "food", letter: "T", text: "The red fruit essential to Italian sauces, brought from the Americas." },
            { step: 3, type: "food", letter: "M", text: "The classic white stretched-curd cheese made from buffalo or cow milk." },
            { step: 4, type: "food", letter: "B", text: "Or dough/sauce, the fundamental base prepared before baking a pie." }
        ]
    },

    // 3. Titanic -> Dream (User prompt showcase)
    {
        id: "puz-titanic-dream",
        mode: "popculture",
        difficulty: "medium",
        title: "Ocean to Subconscious",
        start: { name: "Titanic", icon: "🚢", type: "event", clue: "The historic 1912 passenger liner and blockbuster film" },
        end: { name: "Dream", icon: "💭", type: "science", clue: "A succession of images and thoughts during REM sleep" },
        canonicalChain: [
            { name: "Leonardo DiCaprio", type: "person", reason: "DiCaprio shot to global super-stardom portraying Jack Dawson in Titanic." },
            { name: "Inception", type: "popculture", reason: "DiCaprio starred as Dom Cobb in Christopher Nolan's mind-bending heist film." },
            { name: "Subconscious", type: "science", reason: "Inception is built entirely around infiltrating the human subconscious mind." },
            { name: "Lucid Dreaming", type: "science", reason: "The characters navigate layers of controlled lucid dreams." }
        ],
        altChains: [
            ["James Cameron", "Avatar", "Virtual Reality", "Sleep"],
            ["Atlantic Ocean", "Iceberg", "Nightmare", "Sleep"]
        ],
        hints: [
            { step: 1, type: "person", letter: "L", text: "The Oscar-winning lead actor who played Jack Dawson." },
            { step: 2, type: "popculture", letter: "I", text: "Christopher Nolan's 2010 blockbuster thriller starring this actor." },
            { step: 3, type: "science", letter: "S", text: "The psychological layer of the mind below conscious awareness." },
            { step: 4, type: "science", letter: "S", text: "The biological state of rest in which mental visions occur." }
        ]
    },

    // 4. Mona Lisa -> Guillotine (User prompt showcase)
    {
        id: "puz-monalisa-guillotine",
        mode: "knowledge",
        difficulty: "hard",
        title: "Masterpiece to Revolution",
        start: { name: "Mona Lisa", icon: "🎨", type: "object", clue: "Da Vinci's Renaissance masterpiece portrait" },
        end: { name: "Guillotine", icon: "⚔️", type: "object", clue: "Infamous mechanical execution device of the Reign of Terror" },
        canonicalChain: [
            { name: "Louvre Museum", type: "place", reason: "The Mona Lisa is permanently housed and displayed in the Louvre." },
            { name: "Paris", type: "place", reason: "The Louvre is located on the Right Bank of the Seine in Paris." },
            { name: "French Revolution", type: "event", reason: "Paris was the storm center of the 1789 French Revolution." },
            { name: "King Louis XVI", type: "person", reason: "The French Revolution resulted in the public execution of King Louis XVI." }
        ],
        altChains: [
            ["France", "French Revolution", "Robespierre", "Reign of Terror"],
            ["Leonardo da Vinci", "France", "French Monarchy", "Bastille"]
        ],
        hints: [
            { step: 1, type: "place", letter: "L", text: "The world's most visited art museum where this painting hangs." },
            { step: 2, type: "place", letter: "P", text: "The capital of France where this grand museum is located." },
            { step: 3, type: "event", letter: "F", text: "The major social and political upheaval that began in 1789." },
            { step: 4, type: "person", letter: "K", text: "The deposed monarch (or Robespierre) condemned to execution." }
        ]
    },

    // 5. Minecraft -> Furniture (User prompt showcase)
    {
        id: "puz-minecraft-furniture",
        mode: "everyday",
        difficulty: "insane",
        title: "Voxels to Flatpack",
        start: { name: "Minecraft", icon: "⛏️", type: "popculture", clue: "Bestselling voxel sandbox game created by Mojang" },
        end: { name: "Furniture", icon: "🪑", type: "object", clue: "Movable articles in a room like tables, chairs, and beds" },
        canonicalChain: [
            { name: "Sweden", type: "place", reason: "Minecraft was created and developed in Stockholm, Sweden by Mojang." },
            { name: "IKEA", type: "place", reason: "IKEA is the world-renowned Swedish multinational home design giant." },
            { name: "Flat-pack", type: "object", reason: "IKEA revolutionized the retail industry with self-assembly flat-pack design." },
            { name: "Bookshelf", type: "object", reason: "The Billy bookcase is one of the most famous flat-pack pieces in history." }
        ],
        altChains: [
            ["Wood Blocks", "Crafting Table", "Carpentry", "Chairs"],
            ["Sweden", "Stockholm", "Nordic Design", "Home Decor"]
        ],
        hints: [
            { step: 1, type: "place", letter: "S", text: "The Scandinavian nation where game studio Mojang is headquartered." },
            { step: 2, type: "place", letter: "I", text: "The blue-and-yellow Swedish multinational ready-to-assemble brand." },
            { step: 3, type: "object", letter: "F", text: "The modular assembly style (or Wood) used to package these goods." },
            { step: 4, type: "object", letter: "B", text: "A specific wooden room piece like a table, chair, or bookshelf." }
        ]
    },

    // 6. Volcano -> Chocolate (Daily Four showcase)
    {
        id: "puz-volcano-chocolate",
        mode: "chaos",
        difficulty: "hard",
        title: "Magma to Cocoa",
        start: { name: "Volcano", icon: "🌋", type: "science", clue: "A rupture in the crust allowing hot lava and volcanic ash to escape" },
        end: { name: "Chocolate", icon: "🍫", type: "food", clue: "Sweet delicacy made from roasted and ground cacao seeds" },
        canonicalChain: [
            { name: "Volcanic Soil", type: "science", reason: "Volcanic eruptions produce rich, mineral-dense volcanic soil." },
            { name: "Cacao Tree", type: "science", reason: "Cacao thrives exceptionally well in tropical, mineral-rich volcanic soils." },
            { name: "Cocoa Beans", type: "food", reason: "Cacao tree pods contain cocoa beans harvested for roasting." },
            { name: "Cocoa Butter", type: "food", reason: "Pressed cocoa beans yield cocoa butter and solids blended into chocolate bars." }
        ],
        altChains: [
            ["Lava", "Heat", "Melting", "Cocoa"],
            ["Hawaii", "Tropical Climate", "Plantation", "Cocoa"]
        ],
        hints: [
            { step: 1, type: "science", letter: "S", text: "Rich mineral-dense earth created by cooled magma and ash." },
            { step: 2, type: "science", letter: "C", text: "The tropical tree (Theobroma) that flourishes in rich volcanic soil." },
            { step: 3, type: "food", letter: "C", text: "The harvested seeds fermented and roasted from this tree's pods." },
            { step: 4, type: "food", letter: "C", text: "The fatty extract or powder ground from these roasted seeds." }
        ]
    },

    // 7. Einstein -> Black Hole (Knowledge)
    {
        id: "puz-einstein-blackhole",
        mode: "knowledge",
        difficulty: "easy",
        title: "Relativity to Singularity",
        start: { name: "Albert Einstein", icon: "🧠", type: "person", clue: "Theoretical physicist who developed general relativity" },
        end: { name: "Black Hole", icon: "🕳️", type: "science", clue: "A cosmic region of spacetime where gravity prevents anything from escaping" },
        canonicalChain: [
            { name: "General Relativity", type: "science", reason: "Einstein published the theory of General Relativity in 1915." },
            { name: "Spacetime Curvature", type: "science", reason: "General relativity describes gravity as the geometric warping of spacetime." },
            { name: "Gravitational Collapse", type: "science", reason: "Massive dying stars undergo catastrophic gravitational collapse." },
            { name: "Event Horizon", type: "science", reason: "Gravitational collapse forms an inescapable boundary known as an event horizon." }
        ],
        altChains: [
            ["Speed of Light", "Gravity", "Singularity", "Cosmos"],
            ["Nobel Prize", "Physics", "Astronomy", "Supernova"]
        ],
        hints: [
            { step: 1, type: "science", letter: "G", text: "His groundbreaking 1915 theory linking gravity with spacetime." },
            { step: 2, type: "science", letter: "S", text: "The 4-dimensional fabric of the universe warped by mass." },
            { step: 3, type: "science", letter: "G", text: "The physical process where a massive star collapses under its own weight." },
            { step: 4, type: "science", letter: "E", text: "The theoretical point-of-no-return boundary surrounding a singularity." }
        ]
    },

    // 8. Spider-Man -> New York City (Pop Culture)
    {
        id: "puz-spiderman-nyc",
        mode: "popculture",
        difficulty: "easy",
        title: "Web-Slinger to Metropolis",
        start: { name: "Spider-Man", icon: "🕷️", type: "popculture", clue: "Peter Parker, the friendly neighborhood Marvel hero" },
        end: { name: "New York City", icon: "🗽", type: "place", clue: "The Big Apple, home of Manhattan skyscrapers" },
        canonicalChain: [
            { name: "Marvel Comics", type: "popculture", reason: "Spider-Man was created by Stan Lee and Steve Ditko for Marvel Comics." },
            { name: "Stan Lee", type: "person", reason: "Stan Lee was the legendary comic writer and editor-in-chief of Marvel." },
            { name: "Queens", type: "place", reason: "Stan Lee set Peter Parker's hometown specifically in Forest Hills, Queens." },
            { name: "Manhattan", type: "place", reason: "Queens is one of the five historic boroughs connected to Manhattan in NYC." }
        ],
        altChains: [
            ["Web-Shooters", "Skyscrapers", "Empire State Building", "Manhattan"],
            ["Daily Bugle", "Newspaper", "Broadway", "Times Square"]
        ],
        hints: [
            { step: 1, type: "popculture", letter: "M", text: "The iconic comic book publishing powerhouse founded in NYC." },
            { step: 2, type: "person", letter: "S", text: "The co-creator who penned Spider-Man, the Avengers, and X-Men." },
            { step: 3, type: "place", letter: "Q", text: "The specific NYC borough where Peter Parker grew up with Aunt May." },
            { step: 4, type: "place", letter: "M", text: "The skyscraper island where Spidey swings between high-rises." }
        ]
    },

    // 9. Coffee -> Sneaker (Everyday)
    {
        id: "puz-coffee-sneaker",
        mode: "everyday",
        difficulty: "medium",
        title: "Brew to Footwear",
        start: { name: "Coffee", icon: "☕", type: "food", clue: "Dark roasted caffeinated morning beverage" },
        end: { name: "Sneakers", icon: "👟", type: "object", clue: "Athletic footwear designed for sports and street fashion" },
        canonicalChain: [
            { name: "Caffeine", type: "science", reason: "Coffee is world-famous for its natural energizing stimulant caffeine." },
            { name: "Morning Run", type: "event", reason: "Many athletes take caffeine before embarking on an energetic morning run." },
            { name: "Marathon", type: "event", reason: "Running routines lead into competitive distance endurance marathons." },
            { name: "Nike", type: "popculture", reason: "Nike pioneered modern lightweight cushioning designed for marathon runners." }
        ],
        altChains: [
            ["Coffee Shop", "Barista", "Uniform", "Shoes"],
            ["Energy", "Exercise", "Jogging", "Running Shoes"]
        ],
        hints: [
            { step: 1, type: "science", letter: "C", text: "The active stimulating compound in coffee that boosts physical endurance." },
            { step: 2, type: "event", letter: "R", text: "An athletic cardio workout frequently fueled by a morning brew." },
            { step: 3, type: "event", letter: "M", text: "A 26.2-mile road race where specialized performance gear is crucial." },
            { step: 4, type: "popculture", letter: "N", text: "The global sportswear brand with the Swoosh that makes athletic trainers." }
        ]
    },

    // 10. Samurai -> Microwave Oven (Chaos)
    {
        id: "puz-samurai-microwave",
        mode: "chaos",
        difficulty: "insane",
        title: "Katana to Magnetron",
        start: { name: "Samurai", icon: "⚔️", type: "person", clue: "Hereditary military nobility and warrior caste of feudal Japan" },
        end: { name: "Microwave Oven", icon: "📻", type: "object", clue: "Kitchen appliance heating food using dielectric radiation" },
        canonicalChain: [
            { name: "Katana", type: "object", reason: "Samurai famously wielded masterfully folded steel katana swords." },
            { name: "Steel Metallurgy", type: "science", reason: "Japanese swordsmiths advanced traditional carbon steel metallurgy." },
            { name: "Radar Antennas", type: "object", reason: "Modern high-frequency electromagnetic radar relies on metallic waveguides." },
            { name: "Percy Spencer", type: "person", reason: "Engineer Percy Spencer discovered cavity magnetrons melted candy, inventing the microwave." }
        ],
        altChains: [
            ["Japan", "Panasonic", "Electronics", "Kitchen Appliances"],
            ["Feudal Japan", "World War II", "Radar", "Magnetron"]
        ],
        hints: [
            { step: 1, type: "object", letter: "K", text: "The single-edged curved steel blade carried by samurai warriors." },
            { step: 2, type: "science", letter: "M", text: "The science of heating and forging metals and alloys." },
            { step: 3, type: "object", letter: "R", text: "The WWII detection technology that used radio waves and magnetrons." },
            { step: 4, type: "person", letter: "P", text: "The Raytheon engineer who noticed radar magnetrons melted his chocolate." }
        ]
    },

    // 11. Beethoven -> Silicon Valley (Knowledge)
    {
        id: "puz-beethoven-silicon",
        mode: "knowledge",
        difficulty: "hard",
        title: "Symphony to Silicon",
        start: { name: "Ludwig van Beethoven", icon: "🎼", type: "person", clue: "Legendary German composer of the 9th Symphony" },
        end: { name: "Silicon Valley", icon: "💻", type: "place", clue: "Global hub for high-tech innovation and software giants" },
        canonicalChain: [
            { name: "Ninth Symphony", type: "popculture", reason: "Beethoven composed the monumental Ode to Joy in his 9th Symphony." },
            { name: "Compact Disc", type: "object", reason: "Sony/Philips set the CD's 74-minute capacity specifically to fit Beethoven's 9th." },
            { name: "Sony", type: "popculture", reason: "Sony co-invented the CD and revolutionized optical data storage." },
            { name: "Computer Chip", type: "object", reason: "Optical and microchip storage catalyzed the personal computing revolution in Northern California." }
        ],
        altChains: [
            ["Music", "Synthesizer", "Microprocessor", "Tech Industry"],
            ["Piano", "Electronics", "Apple", "California"]
        ],
        hints: [
            { step: 1, type: "popculture", letter: "N", text: "His masterwork choral symphony containing the iconic 'Ode to Joy'." },
            { step: 2, type: "object", letter: "C", text: "The shiny optical audio disc format standardized to fit that entire symphony." },
            { step: 3, type: "popculture", letter: "S", text: "The Japanese tech giant (or Philips) that co-developed this digital disc." },
            { step: 4, type: "object", letter: "M", text: "Microchips / semiconductors powering tech devices in the Valley." }
        ]
    },

    // 12. Cleopatra -> Sunglasses (Pop Culture / Knowledge)
    {
        id: "puz-cleopatra-sunglasses",
        mode: "popculture",
        difficulty: "medium",
        title: "Pharaoh to Shades",
        start: { name: "Cleopatra", icon: "👑", type: "person", clue: "The last active ruler of the Ptolemaic Kingdom of Egypt" },
        end: { name: "Sunglasses", icon: "🕶️", type: "object", clue: "Protective eyewear designed to shield eyes from bright glare" },
        canonicalChain: [
            { name: "Egypt", type: "place", reason: "Cleopatra ruled ancient Egypt from the port city of Alexandria." },
            { name: "Sahara Desert", type: "place", reason: "Egypt is covered by the vast, scorching sands of the Sahara Desert." },
            { name: "Sunlight", type: "science", reason: "The desert climate experiences intense, unfiltered ultraviolet solar radiation." },
            { name: "Polarized Lenses", type: "science", reason: "Polarized lenses were invented to filter out blinding solar glare and UV rays." }
        ],
        altChains: [
            ["Kohl Eyeliner", "Eye Makeup", "Sun Glare", "UV Protection"],
            ["Alexandria", "Sun", "Glare", "Eyewear"]
        ],
        hints: [
            { step: 1, type: "place", letter: "E", text: "The ancient North African civilization along the Nile river." },
            { step: 2, type: "place", letter: "S", text: "The world's largest hot desert known for extreme heat and blinding sun." },
            { step: 3, type: "science", letter: "S", text: "The intense solar energy and radiant glare beaming from the sky." },
            { step: 4, type: "science", letter: "U", text: "UV rays or protective optical lenses designed to filter bright light." }
        ]
    }
];

/**
 * Encyclopedic concept knowledge graph for semantic validation & dynamic connections.
 * Maps concepts to their categories, synonyms, direct relationships, and contextual reasons.
 */
export const CONCEPT_GRAPH = {
    // --- SPACE & ASTRONOMY ---
    "moon landing": {
        name: "Moon Landing",
        type: "event",
        synonyms: ["apollo 11", "lunar landing", "moon mission", "1969 moon landing"],
        tags: ["space", "nasa", "history", "apollo", "technology"],
        links: {
            "tang": { score: 3, type: "food", reason: "Tang powdered drink was famously brought on NASA Apollo spaceflights and marketed with astronauts." },
            "apollo 11": { score: 3, type: "event", reason: "Apollo 11 was the historic American spaceflight that landed humans on the Moon in 1969." },
            "nasa": { score: 3, type: "popculture", reason: "NASA is the United States federal agency that conceived and executed the Moon Landing." },
            "neil armstrong": { score: 3, type: "person", reason: "Neil Armstrong was the commander of Apollo 11 and first human to walk on the lunar surface." },
            "moon": { score: 3, type: "place", reason: "The Moon is Earth's only natural satellite where the historic landing took place." },
            "telescope": { score: 2, type: "object", reason: "Telescopes allowed astronomers to map the lunar surface before mission landings." },
            "space research": { score: 3, type: "science", reason: "The Moon landing was a pivotal milestone in international space exploration and scientific research." }
        }
    },
    "tang": {
        name: "Tang",
        type: "food",
        synonyms: ["tang drink", "powdered drink", "space drink"],
        tags: ["food", "drink", "orange", "nasa", "space", "powder"],
        links: {
            "orange": { score: 3, type: "food", reason: "Tang's flagship and most famous flavor is powdered citrus orange." },
            "citrus": { score: 3, type: "food", reason: "Tang mimics the tart, sweet flavor profile of natural citrus fruits." },
            "powdered drink": { score: 3, type: "food", reason: "Tang is manufactured as a dehydrated instant powdered beverage." },
            "nasa": { score: 3, type: "popculture", reason: "Tang became an iconic American household name after NASA selected it for Mercury & Apollo flights." },
            "fruit": { score: 2, type: "food", reason: "Tang is marketed as a vitamin-fortified fruit-flavored beverage." }
        }
    },
    "orange": {
        name: "Orange",
        type: "food",
        synonyms: ["oranges", "orange fruit", "citrus sinensis"],
        tags: ["fruit", "food", "citrus", "vitamin c", "breakfast"],
        links: {
            "jam": { score: 3, type: "food", reason: "Oranges are cooked with sugar into orange marmalade and fruit preserves." },
            "marmalade": { score: 3, type: "food", reason: "Marmalade is the classic fruit preserve prepared from boiled oranges and peel." },
            "fruit": { score: 3, type: "food", reason: "Orange is one of the most widely cultivated citrus tree fruits in the world." },
            "vitamin c": { score: 3, type: "science", reason: "Oranges are universally recognized for their high concentration of Vitamin C." },
            "juice": { score: 3, type: "food", reason: "Orange juice is a staple morning breakfast beverage." },
            "apple": { score: 2, type: "food", reason: "Apples and oranges are the classic paired benchmark of fruit comparisons." },
            "peanut butter": { score: 1, type: "food", reason: "Both are pantry foods, but pairing orange directly with peanut butter is weak and uncommon." }
        }
    },
    "jam": {
        name: "Jam",
        type: "food",
        synonyms: ["jelly", "marmalade", "fruit preserves"],
        tags: ["food", "spread", "fruit", "sweet", "breakfast"],
        links: {
            "peanut butter": { score: 3, type: "food", reason: "Jam and peanut butter are the timeless complementary ingredients in PB&J." },
            "bread": { score: 3, type: "food", reason: "Jam is traditionally spread over slices of toasted or fresh bread." },
            "toast": { score: 3, type: "food", reason: "Warm toast is the quintessential morning surface for fruit jam." },
            "peanut butter sandwich": { score: 3, type: "food", reason: "Jam is combined with peanut butter inside classic sandwich slices." }
        }
    },
    "peanut butter": {
        name: "Peanut Butter",
        type: "food",
        synonyms: ["pb", "peanut paste", "peanut spread"],
        tags: ["food", "spread", "peanuts", "sandwich", "lunch"],
        links: {
            "peanut butter sandwich": { score: 3, type: "food", reason: "Peanut butter is the foundational filling of a peanut butter sandwich." },
            "peanuts": { score: 3, type: "food", reason: "Peanut butter is produced by grinding roasted peanuts into a smooth paste." },
            "bread": { score: 3, type: "food", reason: "Peanut butter is layered across sliced bread to form sandwiches." },
            "jam": { score: 3, type: "food", reason: "Jam and peanut butter are famous culinary partners." },
            "sandwich": { score: 3, type: "food", reason: "Peanut butter is one of the world's most popular sandwich spreads." }
        }
    },
    "peanut butter sandwich": {
        name: "Peanut Butter Sandwich",
        type: "food",
        synonyms: ["pb sandwich", "pb&j", "peanut butter and jelly"],
        tags: ["food", "sandwich", "lunch", "snack"],
        links: {
            "peanut butter": { score: 3, type: "food", reason: "Peanut butter is the primary spread component inside the sandwich." },
            "bread": { score: 3, type: "food", reason: "Sandwiches require two enclosing slices of bread." },
            "lunch": { score: 2, type: "food", reason: "Peanut butter sandwiches are a standard staple of packed school lunches." }
        }
    },

    // --- ANCIENT ROME TO PIZZA ---
    "ancient rome": {
        name: "Ancient Rome",
        type: "place",
        synonyms: ["roman empire", "rome", "roman republic", "romans"],
        tags: ["history", "italy", "civilization", "empire", "europe"],
        links: {
            "italy": { score: 3, type: "place", reason: "Ancient Rome was centered in the Italian peninsula, the homeland of modern Italy." },
            "colosseum": { score: 3, type: "place", reason: "The Colosseum is the monumental Roman amphitheater built in the heart of Rome." },
            "latin": { score: 3, type: "word", reason: "Latin was the official language of Ancient Rome that birthed Romance languages." },
            "julius caesar": { score: 3, type: "person", reason: "Julius Caesar was the Roman general and dictator who transformed the Republic." },
            "mediterranean": { score: 2, type: "place", reason: "The Roman Empire enveloped the entire Mediterranean coastline (Mare Nostrum)." }
        }
    },
    "italy": {
        name: "Italy",
        type: "place",
        synonyms: ["italian republic", "italia"],
        tags: ["country", "europe", "food", "culture", "geography"],
        links: {
            "tomatoes": { score: 3, type: "food", reason: "Tomatoes became the defining ingredient of Italian culinary traditions." },
            "naples": { score: 3, type: "place", reason: "Naples is the southern Italian coastal city credited with inventing modern pizza." },
            "rome": { score: 3, type: "place", reason: "Rome is the historic and current capital of Italy." },
            "mozzarella": { score: 3, type: "food", reason: "Mozzarella cheese originated in southern Italy." },
            "pasta": { score: 3, type: "food", reason: "Pasta is Italy's signature national food." },
            "pizza": { score: 3, type: "food", reason: "Pizza is one of Italy's greatest global cultural and culinary exports." }
        }
    },
    "tomatoes": {
        name: "Tomatoes",
        type: "food",
        synonyms: ["tomato", "pomodoro", "tomato sauce"],
        tags: ["food", "vegetable", "fruit", "sauce", "italian"],
        links: {
            "mozzarella": { score: 3, type: "food", reason: "Tomatoes and mozzarella form the core combination of Caprese salad and pizza toppings." },
            "cheese": { score: 3, type: "food", reason: "Melted cheese and tomato sauce form the primary duo in Italian-American baked dishes." },
            "tomato sauce": { score: 3, type: "food", reason: "Tomatoes are simmered into marinara and pizza sauce." },
            "pizza": { score: 3, type: "food", reason: "Tomato sauce is the signature red spread on traditional pizza pies." }
        }
    },
    "mozzarella": {
        name: "Mozzarella",
        type: "food",
        synonyms: ["mozzarella cheese", "fresh mozzarella"],
        tags: ["cheese", "dairy", "food", "pizza", "italian"],
        links: {
            "cheese": { score: 3, type: "food", reason: "Mozzarella is a mild, semi-soft white Italian curd cheese." },
            "pizza": { score: 3, type: "food", reason: "Mozzarella is the quintessential melt cheese on authentic Neapolitan pizza." },
            "crust": { score: 2, type: "food", reason: "Mozzarella is layered over stretched yeast pizza crust before firing." }
        }
    },
    "cheese": {
        name: "Cheese",
        type: "food",
        synonyms: ["dairy cheese", "formaggio"],
        tags: ["dairy", "food", "ingredient"],
        links: {
            "pizza": { score: 3, type: "food", reason: "Grated and melted cheese is an essential defining component of pizza." },
            "milk": { score: 3, type: "food", reason: "Cheese is produced by coagulating dairy milk." },
            "mozzarella": { score: 3, type: "food", reason: "Mozzarella is one of the most widely consumed cheeses in the world." }
        }
    },
    "pizza": {
        name: "Pizza",
        type: "food",
        synonyms: ["pizza pie", "neapolitan pizza", "slice"],
        tags: ["food", "italian", "dinner", "fast food"],
        links: {
            "cheese": { score: 3, type: "food", reason: "Melted cheese is baked on top of the pizza sauce." },
            "italy": { score: 3, type: "place", reason: "Pizza originated in Naples, Italy in the 18th/19th century." },
            "dough": { score: 3, type: "food", reason: "Fermented wheat dough forms the circular crust of a pizza." }
        }
    },

    // --- TITANIC TO DREAM ---
    "titanic": {
        name: "Titanic",
        type: "event",
        synonyms: ["rms titanic", "titanic movie", "shipwreck"],
        tags: ["ship", "history", "movie", "ocean", "disaster"],
        links: {
            "leonardo dicaprio": { score: 3, type: "person", reason: "Leonardo DiCaprio starred as Jack Dawson in James Cameron's 1997 epic Titanic." },
            "james cameron": { score: 3, type: "person", reason: "James Cameron wrote and directed the blockbuster film Titanic." },
            "atlantic ocean": { score: 3, type: "place", reason: "The RMS Titanic sank in the North Atlantic Ocean after hitting an iceberg." },
            "iceberg": { score: 3, type: "science", reason: "A massive glacial iceberg punctured Titanic's hull on April 14, 1912." }
        }
    },
    "leonardo dicaprio": {
        name: "Leonardo DiCaprio",
        type: "person",
        synonyms: ["dicaprio", "leo dicaprio"],
        tags: ["actor", "hollywood", "movies", "oscar"],
        links: {
            "inception": { score: 3, type: "popculture", reason: "DiCaprio starred as master thief Dom Cobb in the sci-fi thriller Inception." },
            "titanic": { score: 3, type: "popculture", reason: "DiCaprio gained worldwide fame playing Jack Dawson in Titanic." },
            "martin scorsese": { score: 3, type: "person", reason: "Scorsese and DiCaprio have collaborated on multiple acclaimed feature films." },
            "the revenant": { score: 3, type: "popculture", reason: "DiCaprio won his first Academy Award for Best Actor in The Revenant." }
        }
    },
    "inception": {
        name: "Inception",
        type: "popculture",
        synonyms: ["inception movie", "christopher nolan inception"],
        tags: ["movie", "sci-fi", "dreams", "nolan", "cinema"],
        links: {
            "dream": { score: 3, type: "science", reason: "Inception's entire plot centers on entering and manipulating shared subconscious dreams." },
            "subconscious": { score: 3, type: "science", reason: "The extraction heists in Inception target secrets buried in the subconscious mind." },
            "christopher nolan": { score: 3, type: "person", reason: "Christopher Nolan wrote and directed the 2010 mind-bending film Inception." },
            "lucid dreaming": { score: 3, type: "science", reason: "The architects in Inception practice conscious control during lucid dreams." }
        }
    },
    "subconscious": {
        name: "Subconscious",
        type: "science",
        synonyms: ["unconscious", "subconscious mind", "psyche"],
        tags: ["psychology", "mind", "brain", "dreams"],
        links: {
            "dream": { score: 3, type: "science", reason: "Dreams are vivid visual manifestations generated by the subconscious during sleep." },
            "psychology": { score: 3, type: "science", reason: "The subconscious is a central concept in psychoanalysis and cognitive psychology." },
            "sigmund freud": { score: 3, type: "person", reason: "Sigmund Freud authored The Interpretation of Dreams regarding the unconscious mind." }
        }
    },
    "dream": {
        name: "Dream",
        type: "science",
        synonyms: ["dreams", "dreaming", "nightmare"],
        tags: ["mind", "sleep", "psychology", "brain"],
        links: {
            "sleep": { score: 3, type: "science", reason: "Dreams occur primarily during the rapid eye movement (REM) phase of sleep." },
            "inception": { score: 3, type: "popculture", reason: "Inception is the most famous modern film focused entirely on dream heists." },
            "subconscious": { score: 3, type: "science", reason: "Dreams process unconscious memories and emotional experiences." }
        }
    },

    // --- MINECRAFT TO FURNITURE ---
    "minecraft": {
        name: "Minecraft",
        type: "popculture",
        synonyms: ["mojang", "minecraft game"],
        tags: ["gaming", "video games", "sweden", "sandbox"],
        links: {
            "sweden": { score: 3, type: "place", reason: "Minecraft was originally created by Markus Persson in Stockholm, Sweden." },
            "mojang": { score: 3, type: "popculture", reason: "Mojang Studios is the Swedish video game developer behind Minecraft." },
            "blocks": { score: 3, type: "object", reason: "Minecraft's iconic voxel world is built entirely from 3D textured blocks." },
            "crafting table": { score: 3, type: "object", reason: "Players assemble tools and decorative items on a 3x3 crafting grid." }
        }
    },
    "sweden": {
        name: "Sweden",
        type: "place",
        synonyms: ["kingdom of sweden", "sverige"],
        tags: ["country", "scandinavia", "europe", "ikea", "design"],
        links: {
            "ikea": { score: 3, type: "place", reason: "IKEA was founded in Älmhult, Sweden in 1943 by Ingvar Kamprad." },
            "stockholm": { score: 3, type: "place", reason: "Stockholm is the capital and tech hub of Sweden." },
            "spotify": { score: 3, type: "popculture", reason: "Spotify was founded and developed in Stockholm, Sweden." },
            "scandinavia": { score: 3, type: "place", reason: "Sweden is the largest country in the Scandinavian region." }
        }
    },
    "ikea": {
        name: "IKEA",
        type: "place",
        synonyms: ["ikea store", "ingvar kamprad"],
        tags: ["furniture", "sweden", "retail", "home", "flatpack"],
        links: {
            "furniture": { score: 3, type: "object", reason: "IKEA is the world's largest furniture retailer, famous for minimalist home goods." },
            "flat-pack": { score: 3, type: "object", reason: "IKEA pioneered flat-pack self-assembly packaging for desks, chairs, and beds." },
            "meatballs": { score: 3, type: "food", reason: "IKEA stores are iconic for serving traditional Swedish meatballs." },
            "bookshelf": { score: 3, type: "object", reason: "The IKEA Billy Bookcase is one of the most widely owned pieces of furniture." }
        }
    },
    "furniture": {
        name: "Furniture",
        type: "object",
        synonyms: ["furnishings", "home decor", "chairs and tables"],
        tags: ["home", "wood", "interior", "living"],
        links: {
            "ikea": { score: 3, type: "place", reason: "IKEA is the leading global brand associated with ready-to-assemble furniture." },
            "wood": { score: 3, type: "object", reason: "Wood is the primary traditional material used in furniture craftsmanship." },
            "chair": { score: 3, type: "object", reason: "Chairs are one of the most fundamental articles of seating furniture." }
        }
    },

    // --- VOLCANO TO CHOCOLATE ---
    "volcano": {
        name: "Volcano",
        type: "science",
        synonyms: ["volcanic", "eruption", "magma chamber"],
        tags: ["geology", "earth", "nature", "lava", "mountains"],
        links: {
            "volcanic soil": { score: 3, type: "science", reason: "Volcanic ash and lava weather into nutrient-dense, fertile volcanic soil." },
            "lava": { score: 3, type: "science", reason: "Lava is molten rock expelled by a volcano during an eruption." },
            "hawaii": { score: 3, type: "place", reason: "The Hawaiian Islands were formed by active volcanic hotspot activity." },
            "magma": { score: 3, type: "science", reason: "Magma is the subterranean molten mineral mixture feeding volcanoes." }
        }
    },
    "volcanic soil": {
        name: "Volcanic Soil",
        type: "science",
        synonyms: ["andosol", "fertile volcanic ash", "volcanic earth"],
        tags: ["geology", "agriculture", "plants", "soil"],
        links: {
            "cacao tree": { score: 3, type: "science", reason: "Theobroma cacao flourishes in equatorial volcanic soils rich in potassium and nitrogen." },
            "agriculture": { score: 3, type: "science", reason: "Volcanic soils produce some of the most productive agricultural crop yields on Earth." },
            "coffee": { score: 3, type: "food", reason: "Gourmet coffee beans are predominantly grown on high-altitude volcanic mountain slopes." }
        }
    },
    "cacao tree": {
        name: "Cacao Tree",
        type: "science",
        synonyms: ["theobroma cacao", "cacao plant", "cocoa tree"],
        tags: ["plant", "botany", "chocolate", "agriculture"],
        links: {
            "cocoa beans": { score: 3, type: "food", reason: "Cacao trees produce large fruit pods filled with precious cocoa seeds/beans." },
            "chocolate": { score: 3, type: "food", reason: "All chocolate originates from the fermented seeds of the Theobroma cacao tree." },
            "tropical rainforest": { score: 3, type: "place", reason: "Cacao trees grow natively in humid tropical understory rainforests." }
        }
    },
    "cocoa beans": {
        name: "Cocoa Beans",
        type: "food",
        synonyms: ["cacao beans", "cocoa seeds"],
        tags: ["food", "ingredient", "chocolate", "roasting"],
        links: {
            "chocolate": { score: 3, type: "food", reason: "Cocoa beans are roasted, ground, and conched with sugar to create chocolate." },
            "cocoa butter": { score: 3, type: "food", reason: "Pressing cocoa beans separates cocoa solids from rich cocoa butter." }
        }
    },
    "chocolate": {
        name: "Chocolate",
        type: "food",
        synonyms: ["chocolate bar", "cocoa", "dark chocolate"],
        tags: ["food", "sweet", "dessert", "candy"],
        links: {
            "cocoa beans": { score: 3, type: "food", reason: "Chocolate is made by processing harvested and roasted cocoa beans." },
            "sugar": { score: 3, type: "food", reason: "Sugar balances the natural bitterness of raw cacao solids." },
            "dessert": { score: 3, type: "food", reason: "Chocolate is one of the world's premier sweet confectionery treats." }
        }
    }
};

/**
 * Universal category concept dictionary to power search suggestions,
 * keyboard autocompletion, and validation fallbacks.
 */
export const CONCEPT_DICTIONARY = [
    { name: "Moon Landing", type: "event", tags: ["space", "history", "nasa"] },
    { name: "Tang", type: "food", tags: ["drink", "space", "orange"] },
    { name: "Orange", type: "food", tags: ["fruit", "citrus", "food"] },
    { name: "Jam", type: "food", tags: ["spread", "fruit", "sweet"] },
    { name: "Peanut Butter", type: "food", tags: ["spread", "nut", "food"] },
    { name: "Peanut Butter Sandwich", type: "food", tags: ["sandwich", "lunch"] },
    { name: "Ancient Rome", type: "place", tags: ["history", "italy", "civilization"] },
    { name: "Italy", type: "place", tags: ["country", "europe", "cuisine"] },
    { name: "Tomatoes", type: "food", tags: ["vegetable", "fruit", "italian"] },
    { name: "Mozzarella", type: "food", tags: ["cheese", "dairy", "italian"] },
    { name: "Cheese", type: "food", tags: ["dairy", "food", "topping"] },
    { name: "Pizza", type: "food", tags: ["food", "italian", "dinner"] },
    { name: "Titanic", type: "event", tags: ["ship", "history", "movie"] },
    { name: "Leonardo DiCaprio", type: "person", tags: ["actor", "hollywood", "oscar"] },
    { name: "Inception", type: "popculture", tags: ["movie", "sci-fi", "nolan"] },
    { name: "Dream", type: "science", tags: ["mind", "sleep", "psychology"] },
    { name: "Subconscious", type: "science", tags: ["mind", "psychology", "brain"] },
    { name: "Mona Lisa", type: "object", tags: ["art", "louvre", "painting"] },
    { name: "Louvre Museum", type: "place", tags: ["museum", "paris", "art"] },
    { name: "Paris", type: "place", tags: ["city", "france", "capital"] },
    { name: "France", type: "place", tags: ["country", "europe", "history"] },
    { name: "French Revolution", type: "event", tags: ["history", "france", "1789"] },
    { name: "Guillotine", type: "object", tags: ["history", "france", "weapon"] },
    { name: "Minecraft", type: "popculture", tags: ["game", "voxel", "mojang"] },
    { name: "Sweden", type: "place", tags: ["country", "europe", "scandinavia"] },
    { name: "IKEA", type: "place", tags: ["furniture", "retail", "sweden"] },
    { name: "Furniture", type: "object", tags: ["home", "wood", "living"] },
    { name: "Volcano", type: "science", tags: ["nature", "geology", "lava"] },
    { name: "Volcanic Soil", type: "science", tags: ["geology", "earth", "agriculture"] },
    { name: "Cacao Tree", type: "science", tags: ["botany", "plant", "chocolate"] },
    { name: "Cocoa Beans", type: "food", tags: ["food", "agriculture", "chocolate"] },
    { name: "Chocolate", type: "food", tags: ["candy", "sweet", "dessert"] },
    { name: "Albert Einstein", type: "person", tags: ["physics", "nobel", "science"] },
    { name: "General Relativity", type: "science", tags: ["physics", "gravity", "space"] },
    { name: "Black Hole", type: "science", tags: ["space", "astronomy", "gravity"] },
    { name: "Spider-Man", type: "popculture", tags: ["marvel", "superhero", "comic"] },
    { name: "Marvel Comics", type: "popculture", tags: ["comics", "superheroes", "media"] },
    { name: "New York City", type: "place", tags: ["city", "usa", "manhattan"] },
    { name: "Coffee", type: "food", tags: ["drink", "caffeine", "morning"] },
    { name: "Caffeine", type: "science", tags: ["chemical", "stimulant", "energy"] },
    { name: "Marathon", type: "event", tags: ["sports", "running", "race"] },
    { name: "Nike", type: "popculture", tags: ["brand", "sports", "shoes"] },
    { name: "Sneakers", type: "object", tags: ["shoes", "fashion", "sports"] },
    { name: "Samurai", type: "person", tags: ["japan", "warrior", "history"] },
    { name: "Katana", type: "object", tags: ["sword", "steel", "japan"] },
    { name: "Microwave Oven", type: "object", tags: ["kitchen", "appliance", "tech"] },
    { name: "Ludwig van Beethoven", type: "person", tags: ["composer", "music", "classical"] },
    { name: "Compact Disc", type: "object", tags: ["audio", "technology", "sony"] },
    { name: "Silicon Valley", type: "place", tags: ["tech", "california", "software"] },
    { name: "Cleopatra", type: "person", tags: ["egypt", "history", "pharaoh"] },
    { name: "Sunglasses", type: "object", tags: ["eyewear", "sun", "fashion"] },
    { name: "Sun", type: "place", tags: ["star", "space", "solar system"] },
    { name: "Solar System", type: "science", tags: ["planets", "space", "sun"] },
    { name: "Gravity", type: "science", tags: ["physics", "force", "newton"] },
    { name: "Isaac Newton", type: "person", tags: ["scientist", "physics", "gravity"] },
    { name: "Apple", type: "food", tags: ["fruit", "newton", "tech"] },
    { name: "Steve Jobs", type: "person", tags: ["apple", "tech", "silicon valley"] },
    { name: "iPhone", type: "object", tags: ["phone", "apple", "technology"] },
    { name: "Internet", type: "science", tags: ["network", "web", "computer"] },
    { name: "Satellite", type: "object", tags: ["space", "orbit", "gps"] },
    { name: "GPS", type: "science", tags: ["navigation", "satellites", "map"] },
    { name: "Map", type: "object", tags: ["geography", "navigation", "cartography"] },
    { name: "Compass", type: "object", tags: ["navigation", "magnetism", "tool"] },
    { name: "Magnet", type: "object", tags: ["physics", "magnetic", "poles"] },
    { name: "Electricity", type: "science", tags: ["energy", "power", "physics"] },
    { name: "Lightbulb", type: "object", tags: ["invention", "edison", "light"] },
    { name: "Thomas Edison", type: "person", tags: ["inventor", "electricity", "america"] },
    { name: "Cinema", type: "popculture", tags: ["movies", "hollywood", "film"] },
    { name: "Hollywood", type: "place", tags: ["california", "movies", "los angeles"] },
    { name: "Los Angeles", type: "place", tags: ["city", "california", "usa"] },
    { name: "California", type: "place", tags: ["state", "usa", "west coast"] },
    { name: "Gold Rush", type: "event", tags: ["history", "california", "1849"] },
    { name: "Gold", type: "object", tags: ["metal", "element", "precious"] },
    { name: "Alchemy", type: "science", tags: ["history", "chemistry", "medieval"] },
    { name: "Chemistry", type: "science", tags: ["science", "molecules", "elements"] },
    { name: "Water", type: "science", tags: ["liquid", "h2o", "nature"] },
    { name: "Ocean", type: "place", tags: ["sea", "water", "marine"] },
    { name: "Whale", type: "science", tags: ["animal", "mammal", "ocean"] },
    { name: "Ambergris", type: "object", tags: ["whale", "perfume", "fragrance"] },
    { name: "Perfume", type: "object", tags: ["cosmetics", "fragrance", "paris"] },
    { name: "Silk", type: "object", tags: ["fabric", "china", "textile"] },
    { name: "Silk Road", type: "event", tags: ["history", "trade", "asia"] },
    { name: "China", type: "place", tags: ["country", "asia", "history"] },
    { name: "Great Wall of China", type: "place", tags: ["landmark", "china", "monument"] },
    { name: "Tea", type: "food", tags: ["drink", "china", "england"] },
    { name: "Boston Tea Party", type: "event", tags: ["history", "american revolution", "boston"] },
    { name: "Boston", type: "place", tags: ["city", "massachusetts", "usa"] },
    { name: "Harvard University", type: "place", tags: ["university", "boston", "education"] },
    { name: "Mark Zuckerberg", type: "person", tags: ["facebook", "tech", "harvard"] },
    { name: "Facebook", type: "popculture", tags: ["social media", "meta", "web"] },
    { name: "Virtual Reality", type: "science", tags: ["metaverse", "tech", "gaming"] },
    { name: "The Matrix", type: "popculture", tags: ["movie", "sci-fi", "vr"] },
    { name: "Keanu Reeves", type: "person", tags: ["actor", "matrix", "john wick"] },
    { name: "John Wick", type: "popculture", tags: ["movie", "action", "assassin"] },
    { name: "Dog", type: "science", tags: ["animal", "pet", "canine"] },
    { name: "Wolf", type: "science", tags: ["animal", "nature", "pack"] },
    { name: "Moon", type: "place", tags: ["space", "night", "lunar"] }
];
