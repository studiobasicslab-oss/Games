/**
 * LEXICON DASH - Comprehensive Vocabulary & Trivia Database
 * 50+ Categories across 4 Tiers with Rarity Weights, Category Keywords & Validation Metadata
 */

const CATEGORY_TIERS = {
    TIER_1: { id: 'tier_1', name: 'Foundational', baseScore: 100, multiplier: 1.0, color: '#38bdf8', icon: '🌱' },
    TIER_2: { id: 'tier_2', name: 'Pop Culture & Arts', baseScore: 150, multiplier: 1.25, color: '#a855f7', icon: '🎬' },
    TIER_3: { id: 'tier_3', name: 'STEM & Geography', baseScore: 200, multiplier: 1.5, color: '#10b981', icon: '⚡' },
    TIER_4: { id: 'tier_4', name: 'Niche & Expert', baseScore: 300, multiplier: 2.0, color: '#f59e0b', icon: '👑' }
};
if (typeof window !== 'undefined') window.CATEGORY_TIERS = CATEGORY_TIERS;

const CATEGORIES_DATA = {
    // ==========================================
    // TIER 1: FOUNDATIONAL (1.0x, 100 pts)
    // ==========================================
    'first_name': {
        name: 'First Name',
        tier: 'tier_1',
        description: 'Common or notable given names across cultures.',
        icon: '👤',
        keywords: ['given name', 'name', 'forename', 'male name', 'female name', 'person', 'surname'],
        entries: [
            'Aaron', 'Abigail', 'Adam', 'Adrian', 'Aiden', 'Alexander', 'Alice', 'Amelia', 'Andrew', 'Anna', 'Anthony', 'Arthur', 'Asher', 'Astrid', 'Ava', 'Austin',
            'Benjamin', 'Bella', 'Beth', 'Blake', 'Bradley', 'Brandon', 'Brian', 'Brooke', 'Bruce', 'Bryan', 'Beatrice', 'Brenda', 'Boris', 'Bianca',
            'Caleb', 'Cameron', 'Carl', 'Carlos', 'Caroline', 'Carter', 'Catherine', 'Charles', 'Chloe', 'Christian', 'Christopher', 'Claire', 'Clara', 'Cole', 'Colin', 'Connor',
            'Daniel', 'David', 'Dean', 'Deborah', 'Declan', 'Dennis', 'Derek', 'Diana', 'Dominic', 'Donna', 'Douglas', 'Dylan', 'Daisy', 'Damian',
            'Edward', 'Eleanor', 'Eli', 'Elijah', 'Elizabeth', 'Ella', 'Elliot', 'Emily', 'Emma', 'Eric', 'Ethan', 'Eva', 'Evan', 'Evelyn', 'Ezra',
            'Felix', 'Fiona', 'Florence', 'Forrest', 'Frances', 'Francis', 'Frank', 'Franklin', 'Freddie', 'Freya', 'Faith', 'Finn',
            'Gabriel', 'Gage', 'Garrett', 'Gavin', 'Genevieve', 'George', 'Georgia', 'Gideon', 'Gillian', 'Grace', 'Grant', 'Gregory', 'Gemma', 'Graham',
            'Hailey', 'Hannah', 'Harper', 'Harrison', 'Harry', 'Hayden', 'Hazel', 'Henry', 'Holden', 'Hope', 'Hudson', 'Hunter', 'Helena', 'Hector',
            'Ian', 'Ibrahim', 'Ida', 'Ignacio', 'Imogen', 'Ingrid', 'Ira', 'Irene', 'Iris', 'Isaac', 'Isabel', 'Isabella', 'Isaiah', 'Ivan', 'Ivy',
            'Jack', 'Jackson', 'Jacob', 'Jade', 'James', 'Jane', 'Jasper', 'Jasmine', 'Jay', 'Jean', 'Jenna', 'Jennifer', 'Jeremiah', 'Jesse', 'Jessica', 'Joel', 'John', 'Jonah', 'Jonathan', 'Jordan', 'Joseph', 'Joshua', 'Julia', 'Julian', 'Justin',
            'Kai', 'Karen', 'Kate', 'Katherine', 'Kayla', 'Keanu', 'Keith', 'Kelly', 'Kelsey', 'Kendall', 'Kenneth', 'Kevin', 'Kian', 'Kira', 'Kyle',
            'Lana', 'Lance', 'Landon', 'Laura', 'Lauren', 'Lawrence', 'Layla', 'Leah', 'Leo', 'Leonardo', 'Levi', 'Liam', 'Lily', 'Lincoln', 'Logan', 'Louis', 'Lucas', 'Lucy', 'Luke', 'Luna', 'Lydia',
            'Mackenzie', 'Madeline', 'Madison', 'Magnus', 'Malcolm', 'Manuel', 'Marcus', 'Margaret', 'Maria', 'Marian', 'Mark', 'Marshall', 'Martin', 'Mason', 'Mateo', 'Matthew', 'Max', 'Maya', 'Megan', 'Melanie', 'Mia', 'Michael', 'Miles', 'Milo', 'Molly', 'Morgan',
            'Nadia', 'Naomi', 'Nathan', 'Nathaniel', 'Neil', 'Nicholas', 'Nicole', 'Nico', 'Nigel', 'Nina', 'Noah', 'Nolan', 'Nora',
            'Oliver', 'Olivia', 'Omar', 'Ophelia', 'Oscar', 'Owen', 'Otis', 'Orlando',
            'Paige', 'Parker', 'Patrick', 'Paul', 'Penelope', 'Peter', 'Peyton', 'Philip', 'Phoebe', 'Piper', 'Preston', 'Priscilla',
            'Quentin', 'Quincy', 'Quinn', 'Quade', 'Queen',
            'Rachel', 'Rafael', 'Ralph', 'Ramona', 'Ray', 'Raymond', 'Reagan', 'Rebecca', 'Reese', 'Richard', 'Riley', 'River', 'Robert', 'Robin', 'Roger', 'Roman', 'Ronan', 'Rowan', 'Ruby', 'Russell', 'Ryan',
            'Sabrina', 'Sadie', 'Sam', 'Samantha', 'Samuel', 'Sara', 'Sarah', 'Savannah', 'Sawyer', 'Scarlett', 'Scott', 'Sean', 'Sebastian', 'Serena', 'Seth', 'Shane', 'Shannon', 'Silas', 'Simon', 'Skyler', 'Sophia', 'Stella', 'Stephen', 'Steven',
            'Talia', 'Taylor', 'Theodore', 'Thomas', 'Timothy', 'Tobias', 'Toby', 'Travis', 'Trent', 'Trevor', 'Tristan', 'Tyler',
            'Ulysses', 'Uma', 'Uriah', 'Ursula', 'Uriel', 'Ugo', 'Uri', 'Ulric',
            'Valerie', 'Vanessa', 'Vaughn', 'Victor', 'Victoria', 'Vincent', 'Violet', 'Vivian', 'Valentin', 'Vera',
            'Walker', 'Walter', 'Warren', 'Wayne', 'Wesley', 'Weston', 'William', 'Willie', 'Willow', 'Wyatt', 'Wade', 'Winston',
            'Xander', 'Xavier', 'Ximena', 'Xena', 'Xia',
            'Yara', 'Yasmin', 'Yosef', 'Yusuf', 'Yvonne', 'Yael', 'Yuki',
            'Zachary', 'Zane', 'Zara', 'Zeke', 'Zoe', 'Zoey', 'Zelda', 'Zephyr'
        ]
    },
    'country': {
        name: 'Country',
        tier: 'tier_1',
        description: 'Sovereign nations and recognized states across the globe.',
        icon: '🌍',
        keywords: ['country', 'nation', 'sovereign state', 'republic', 'kingdom', 'territory', 'federation', 'principality'],
        entries: [
            'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
            'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
            'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Czechia',
            'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
            'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
            'Fiji', 'Finland', 'France',
            'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
            'Haiti', 'Honduras', 'Hungary',
            'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
            'Jamaica', 'Japan', 'Jordan',
            'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
            'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
            'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
            'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
            'Oman',
            'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
            'Qatar',
            'Romania', 'Russia', 'Rwanda',
            'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
            'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
            'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
            'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
            'Yemen',
            'Zambia', 'Zimbabwe'
        ]
    },
    'common_animal': {
        name: 'Common Animal',
        tier: 'tier_1',
        description: 'Terrestrial, aerial, or aquatic animal species.',
        icon: '🐾',
        keywords: ['animal', 'mammal', 'bird', 'reptile', 'amphibian', 'fish', 'insect', 'creature', 'species', 'fauna', 'crustacean', 'arachnid', 'vertebrate', 'invertebrate'],
        entries: [
            'Aardvark', 'Albatross', 'Alligator', 'Alpaca', 'Ant', 'Anteater', 'Antelope', 'Ape', 'Armadillo', 'Axolotl',
            'Baboon', 'Badger', 'Bat', 'Bear', 'Beaver', 'Bee', 'Beetle', 'Bison', 'Boar', 'Buffalo', 'Butterfly',
            'Camel', 'Canary', 'Capybara', 'Cat', 'Caterpillar', 'Cattle', 'Chamois', 'Cheetah', 'Chicken', 'Chimpanzee', 'Chinchilla', 'Chough', 'Cobra', 'Cockroach', 'Cormorant', 'Cougar', 'Coyote', 'Crab', 'Crane', 'Crocodile', 'Crow', 'Curlew',
            'Deer', 'Dingo', 'Dog', 'Dogfish', 'Dolphin', 'Donkey', 'Dotterel', 'Dove', 'Dragonfly', 'Duck', 'Dugong', 'Dunlin',
            'Eagle', 'Echidna', 'Eel', 'Eland', 'Elephant', 'Elk', 'Emu',
            'Falcon', 'Ferret', 'Finch', 'Flamingo', 'Fly', 'Fox', 'Frog',
            'Gazelle', 'Gecko', 'Gerbil', 'Giraffe', 'Gnat', 'Gnu', 'Goat', 'Goldfinch', 'Goldfish', 'Goose', 'Gorilla', 'Goshawk', 'Grasshopper', 'Grouse', 'Guanaco', 'Gull',
            'Hamster', 'Hare', 'Hawk', 'Hedgehog', 'Heron', 'Herring', 'Hippopotamus', 'Hornet', 'Horse', 'Human', 'Hummingbird', 'Hyena',
            'Ibex', 'Ibis', 'Iguana', 'Impala',
            'Jackal', 'Jaguar', 'Jay', 'Jellyfish',
            'Kangaroo', 'Kingfisher', 'Koala', 'Kookaburra', 'Kouprey', 'Kudu',
            'Lapwing', 'Lark', 'Lemur', 'Leopard', 'Lion', 'Llama', 'Lobster', 'Locust', 'Loris', 'Louse', 'Lyrebird',
            'Magpie', 'Mallard', 'Manatee', 'Mandrill', 'Mantis', 'Marten', 'Meerkat', 'Mink', 'Mole', 'Mongoose', 'Monkey', 'Moose', 'Mosquito', 'Mouse', 'Mule',
            'Narwhal', 'Newt', 'Nightingale',
            'Octopus', 'Okapi', 'Opossum', 'Oryx', 'Ostrich', 'Otter', 'Owl', 'Ox', 'Oyster',
            'Panther', 'Parrot', 'Partridge', 'Peafowl', 'Pelican', 'Penguin', 'Pheasant', 'Pig', 'Pigeon', 'Pony', 'Porcupine', 'Porpoise', 'Possum',
            'Quail', 'Quelea', 'Quokka', 'Quoll',
            'Rabbit', 'Raccoon', 'Rail', 'Ram', 'Rat', 'Raven', 'Red deer', 'Red panda', 'Reindeer', 'Rhinoceros', 'Rook',
            'Salamander', 'Salmon', 'Sandpiper', 'Sardine', 'Scorpion', 'Seahorse', 'Seal', 'Shark', 'Sheep', 'Shrew', 'Skunk', 'Sloth', 'Snail', 'Snake', 'Sparrow', 'Spider', 'Spoonbill', 'Squid', 'Squirrel', 'Starling', 'Stingray', 'Stork', 'Swallow', 'Swan',
            'Tapir', 'Tarsier', 'Termite', 'Tiger', 'Toad', 'Trout', 'Turkey', 'Turtle',
            'Uakari', 'Uguisu', 'Umbrellabird', 'Unau', 'Urchin', 'Urial', 'Urutu', 'Uromastyx',
            'Vampire bat', 'Vervet monkey', 'Vicuna', 'Viper', 'Vole', 'Vulture',
            'Wallaby', 'Walrus', 'Wasp', 'Weasel', 'Whale', 'Wildcat', 'Wolf', 'Wolverine', 'Wombat', 'Woodcock', 'Woodpecker', 'Worm', 'Wren',
            'Xanthid crab', 'Xenops', 'Xerus', 'X-ray tetra',
            'Yak', 'Yellowjacket',
            'Zebra', 'Zebu', 'Zorilla'
        ]
    },
    'fruit_vegetable': {
        name: 'Fruit or Vegetable',
        tier: 'tier_1',
        description: 'Edible botanicals, orchard fruits, greens, and roots.',
        icon: '🍎',
        keywords: ['fruit', 'vegetable', 'plant', 'edible', 'berry', 'citrus', 'herb', 'crop', 'culinary', 'tuber', 'root', 'botanical', 'produce'],
        entries: [
            'Apple', 'Apricot', 'Artichoke', 'Arugula', 'Asparagus', 'Avocado',
            'Banana', 'Beetroot', 'Bell pepper', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Bok choy', 'Broccoli', 'Brussels sprout', 'Butternut squash',
            'Cabbage', 'Cantaloupe', 'Carrot', 'Cauliflower', 'Celery', 'Cherry', 'Clementine', 'Coconut', 'Collard greens', 'Corn', 'Cranberry', 'Cucumber', 'Currant',
            'Date', 'Dragonfruit', 'Durian',
            'Eggplant', 'Elderberry', 'Endive',
            'Feijoa', 'Fennel', 'Fig',
            'Garlic', 'Ginger', 'Gooseberry', 'Grape', 'Grapefruit', 'Guava',
            'Honeydew', 'Huckleberry',
            'Jackfruit', 'Jicama',
            'Kale', 'Kiwi', 'Kohlrabi', 'Kumquat',
            'Leek', 'Lemon', 'Lettuce', 'Lime', 'Loganberry', 'Lychee',
            'Mandarin', 'Mango', 'Mangosteen', 'Melon', 'Mulberry', 'Mushroom',
            'Nectarine', 'Nutmeg',
            'Okra', 'Olive', 'Onion', 'Orange',
            'Papaya', 'Parsnip', 'Passionfruit', 'Peach', 'Pear', 'Pea', 'Pepper', 'Persimmon', 'Pineapple', 'Plantain', 'Plum', 'Pomegranate', 'Pomelo', 'Potato', 'Pumpkin',
            'Quince',
            'Radish', 'Raspberry', 'Rhubarb', 'Rutabaga',
            'Scallion', 'Shallot', 'Spinach', 'Squash', 'Strawberry', 'Sweet potato',
            'Tamarind', 'Tangerine', 'Taro', 'Tomato', 'Turnip',
            'Ugli fruit', 'Ube', 'Ulluco',
            'Vanilla bean', 'Velvet apple',
            'Watercress', 'Watermelon', 'Wax gourd',
            'Xigua', 'Ximenia',
            'Yam', 'Yautia', 'Yuzu',
            'Zucchini'
        ]
    },
    'city': {
        name: 'World City',
        tier: 'tier_1',
        description: 'Major global metropolitan areas and capital cities.',
        icon: '🏙️',
        keywords: ['city', 'capital', 'municipality', 'town', 'metropolis', 'urban', 'settlement'],
        entries: [
            'Amsterdam', 'Athens', 'Atlanta', 'Auckland', 'Austin', 'Alexandria', 'Ankara', 'Algiers', 'Abu Dhabi', 'Addis Ababa',
            'Bangkok', 'Barcelona', 'Beijing', 'Beirut', 'Belfast', 'Belgrade', 'Berlin', 'Bogota', 'Boston', 'Brasilia', 'Brisbane', 'Brussels', 'Budapest', 'Buenos Aires',
            'Cairo', 'Calgary', 'Cape Town', 'Caracas', 'Casablanca', 'Chicago', 'Copenhagen', 'Cologne', 'Colombo', 'Curitiba',
            'Dallas', 'Damascus', 'Delhi', 'Denver', 'Detroit', 'Dhaka', 'Doha', 'Dubai', 'Dublin', 'Dubrovnik', 'Durban',
            'Edinburgh', 'Edmonton', 'Eindhoven', 'Erbil',
            'Florence', 'Frankfurt', 'Fukuoka', 'Freetown',
            'Geneva', 'Glasgow', 'Guangzhou', 'Guatemala City', 'Guayaquil',
            'Hanoi', 'Harare', 'Havana', 'Helsinki', 'Ho Chi Minh City', 'Hong Kong', 'Honolulu', 'Houston', 'Hyderabad',
            'Incheon', 'Indianapolis', 'Islamabad', 'Istanbul', 'Izmir',
            'Jakarta', 'Jerusalem', 'Johannesburg', 'Jeddah',
            'Karachi', 'Kathmandu', 'Kyiv', 'Kingston', 'Kolkata', 'Kuala Lumpur', 'Kuwait City', 'Kyoto',
            'Lagos', 'Lahore', 'Las Vegas', 'Lima', 'Lisbon', 'Liverpool', 'Ljubljana', 'London', 'Los Angeles', 'Luanda', 'Luxembourg City', 'Lyon',
            'Madrid', 'Malaga', 'Manchester', 'Manila', 'Marseille', 'Melbourne', 'Mexico City', 'Miami', 'Milan', 'Minneapolis', 'Minsk', 'Mombasa', 'Montreal', 'Moscow', 'Mumbai', 'Munich', 'Muscat',
            'Nairobi', 'Naples', 'Nashville', 'New Delhi', 'New Orleans', 'New York', 'Nice', 'Nicosia',
            'Osaka', 'Oslo', 'Ottawa', 'Oxford',
            'Palermo', 'Panama City', 'Paris', 'Perth', 'Philadelphia', 'Phnom Penh', 'Phoenix', 'Pisa', 'Pittsburgh', 'Prague', 'Pretoria', 'Puebla',
            'Quito', 'Quebec City',
            'Rabat', 'Reykjavik', 'Riga', 'Rio de Janeiro', 'Riyadh', 'Rome', 'Rotterdam',
            'San Antonio', 'San Diego', 'San Francisco', 'San Jose', 'Santiago', 'Santo Domingo', 'Sao Paulo', 'Sarajevo', 'Seattle', 'Seoul', 'Seville', 'Shanghai', 'Singapore', 'Sofia', 'Stockholm', 'Strasbourg', 'Stuttgart', 'Sydney',
            'Taipei', 'Tallinn', 'Tampa', 'Tashkent', 'Tbilisi', 'Tehran', 'Tel Aviv', 'Tokyo', 'Toronto', 'Toulouse', 'Tunis', 'Turin',
            'Ulaanbaatar', 'Utrecht', 'Ufa', 'Ushuaia', 'Umea',
            'Valencia', 'Vancouver', 'Venice', 'Vienna', 'Vientiane', 'Vilnius', 'Verona',
            'Warsaw', 'Washington', 'Wellington', 'Winnipeg', 'Wroclaw', 'Wuhan',
            'Xian', 'Xiamen',
            'Yangon', 'Yerevan', 'Yokohama',
            'Zagreb', 'Zurich'
        ]
    },
    'profession': {
        name: 'Job / Profession',
        tier: 'tier_1',
        description: 'Occupations, careers, vocations, and professional titles.',
        icon: '💼',
        keywords: ['profession', 'occupation', 'job', 'practitioner', 'specialist', 'worker', 'officer', 'doctor', 'engineer', 'craftsman', 'person who', 'one who', 'career', 'vocation'],
        entries: [
            'Accountant', 'Actor', 'Actuary', 'Acrobat', 'Architect', 'Artist', 'Astronomer', 'Athlete', 'Attorney', 'Auditor', 'Author', 'Aviator',
            'Baker', 'Banker', 'Barber', 'Bartender', 'Biologist', 'Blacksmith', 'Boilermaker', 'Botanist', 'Bricklayer', 'Broker', 'Builder', 'Butcher',
            'Carpenter', 'Cashier', 'Chef', 'Chemist', 'Civil Engineer', 'Clerk', 'Coach', 'Composer', 'Consultant', 'Copywriter', 'Counselor', 'Curator',
            'Dancer', 'Dentist', 'Designer', 'Detective', 'Dietitian', 'Diplomat', 'Director', 'Doctor', 'Driver',
            'Economist', 'Editor', 'Electrician', 'Embalmer', 'Engineer', 'Entrepreneur', 'Epidemiologist', 'Executive',
            'Farmer', 'Filmmaker', 'Financial Analyst', 'Firefighter', 'Fisherman', 'Flight Attendant', 'Florist',
            'Gardener', 'Genealogist', 'Geologist', 'Glazier', 'Graphic Designer', 'Guide',
            'Hairdresser', 'Historian', 'Horticulturist', 'Housekeeper', 'Hypnotherapist',
            'Illustrator', 'Immunologist', 'Inspector', 'Instructor', 'Interior Designer', 'Interpreter', 'Investigator',
            'Janitor', 'Jeweler', 'Journalist', 'Judge',
            'Lawyer', 'Lecturer', 'Librarian', 'Lifeguard', 'Locksmith', 'Logistician',
            'Machinist', 'Magician', 'Manager', 'Mechanic', 'Meteorologist', 'Microbiologist', 'Miner', 'Model', 'Musician',
            'Navigator', 'Neurologist', 'Nurse', 'Nutritionist',
            'Oceanographer', 'Optometrist', 'Orthodontist',
            'Painter', 'Paleontologist', 'Paramedic', 'Pathologist', 'Pharmacist', 'Philosopher', 'Photographer', 'Physician', 'Physicist', 'Pilot', 'Plumber', 'Police Officer', 'Politician', 'Professor', 'Programmer', 'Psychiatrist', 'Psychologist',
            'Radiologist', 'Real Estate Agent', 'Receptionist', 'Reporter', 'Researcher', 'Roofer',
            'Sailor', 'Scientist', 'Sculptor', 'Secretary', 'Security Guard', 'Singer', 'Social Worker', 'Software Engineer', 'Soldier', 'Surgeon', 'Surveyor',
            'Tailor', 'Teacher', 'Technician', 'Therapist', 'Tour Guide', 'Translator', 'Truck Driver', 'Tutor',
            'Umpire', 'Undertaker', 'Underwriter', 'Upholsterer', 'Urban Planner', 'Urologist', 'Usher',
            'Valet', 'Veterinarian', 'Videographer', 'Violinist', 'Vocalist',
            'Waiter', 'Waitress', 'Watchmaker', 'Web Developer', 'Welder', 'Woodworker', 'Writer',
            'Xylophonist', 'Xenobiologist',
            'Yoga Instructor',
            'Zoologist'
        ]
    },
    'clothing_item': {
        name: 'Clothing & Apparel',
        tier: 'tier_1',
        description: 'Garments, wearables, outerwear, and fashion accessories.',
        icon: '👗',
        keywords: ['clothing', 'garment', 'apparel', 'wear', 'attire', 'dress', 'shoe', 'hat', 'fabric', 'accessory', 'outerwear'],
        entries: [
            'Anorak', 'Apron', 'Ascot',
            'Bandana', 'Beanie', 'Belt', 'Beret', 'Bikini', 'Blazer', 'Blouse', 'Boots', 'Bowtie', 'Boxers', 'Bra', 'Bracelet', 'Breeches',
            'Cardigan', 'Cape', 'Cap', 'Coat', 'Corset', 'Cravat', 'Cummerbund',
            'Dress', 'Dungarees',
            'Earmuffs', 'Espadrilles',
            'Fedora', 'Fleece', 'Flip-flops', 'Frock',
            'Gauntlet', 'Girdle', 'Gloves', 'Gown',
            'Halfsleeve', 'Hat', 'Headband', 'Heels', 'Hoodie',
            'Jacket', 'Jeans', 'Jersey', 'Jumpsuit',
            'Kaftan', 'Kilt', 'Kimono',
            'Leggings', 'Leotard', 'Loafers',
            'Mittens', 'Moccasins', 'Muffler',
            'Necktie', 'Nightgown',
            'Overalls', 'Overcoat',
            'Pajamas', 'Pantaloons', 'Pants', 'Parka', 'Petticoat', 'Polo shirt', 'Poncho', 'Pullover',
            'Raincoat', 'Robe', 'Romper',
            'Sandals', 'Sari', 'Sarong', 'Scarf', 'Shawl', 'Shirt', 'Shoes', 'Shorts', 'Skirt', 'Slippers', 'Sneakers', 'Socks', 'Sombrero', 'Suit', 'Suspenders', 'Sweater', 'Sweatpants', 'Swimsuit',
            'T-shirt', 'Tank top', 'Tie', 'Tights', 'Toga', 'Top hat', 'Tracksuit', 'Trenchcoat', 'Trousers', 'Tunic', 'Turtleneck', 'Tuxedo',
            'Undergarment', 'Underpants', 'Undershirt', 'Underwear', 'Uniform', 'Unitard',
            'Veil', 'Vest', 'Visor',
            'Waistcoat', 'Wetsuit', 'Windbreaker',
            'Yarmulke',
            'Zip-up'
        ]
    },
    'sport_game': {
        name: 'Sport or Game',
        tier: 'tier_1',
        description: 'Athletic sports, tabletop games, and competitive pastimes.',
        icon: '⚽',
        keywords: ['sport', 'game', 'athletics', 'competition', 'pastime', 'board game', 'match', 'play', 'race'],
        entries: [
            'Archery', 'Athletics', 'Auto racing',
            'Badminton', 'Baseball', 'Basketball', 'Biathlon', 'Billiards', 'Bobsleigh', 'Bowling', 'Boxing', 'Bridge',
            'Canoeing', 'Checkers', 'Chess', 'Cricket', 'Croquet', 'Curling', 'Cycling',
            'Darts', 'Decathlon', 'Dodgeball', 'Dominoes',
            'Equestrian', 'Esports',
            'Fencing', 'Field hockey', 'Figure skating', 'Fishing', 'Floorball', 'Football', 'Formula One',
            'Golf', 'Gymnastics',
            'Handball', 'Heptathlon', 'Hide and seek', 'Hockey', 'Hurling',
            'Ice hockey', 'Ice skating',
            'Javelin', 'Judo', 'Jujitsu',
            'Karate', 'Kayaking', 'Kickboxing', 'Korfball',
            'Lacrosse', 'Lawn bowls', 'Ludo', 'Luge',
            'Marathon', 'Martial arts', 'Monopoly', 'Motocross', 'Mountaineering',
            'Netball',
            'Orienteering',
            'Paddle tennis', 'Paintball', 'Parkour', 'Pentathlon', 'Polo', 'Pool', 'Poker',
            'Racquetball', 'Rafting', 'Ringette', 'Rock climbing', 'Rowing', 'Rugby', 'Running',
            'Sailing', 'Scrabble', 'Scuba diving', 'Skateboarding', 'Skeleton', 'Skiing', 'Snooker', 'Snowboarding', 'Soccer', 'Softball', 'Squash', 'Sumo wrestling', 'Surfing', 'Swimming',
            'Table tennis', 'Taekwondo', 'Tag', 'Tennis', 'Track and field', 'Triathlon',
            'Ultimate frisbee', 'Unicycle hockey',
            'Volleyball', 'Vaulting',
            'Water polo', 'Weightlifting', 'Windsurfing', 'Wrestling',
            'Yachting'
        ]
    },

    // ==========================================
    // TIER 2: POP CULTURE & ARTS (1.25x, 150 pts)
    // ==========================================
    'video_game': {
        name: 'Video Game',
        tier: 'tier_2',
        description: 'Franchises, titles, and iconic video games.',
        icon: '🎮',
        keywords: ['video game', 'game', 'franchise', 'nintendo', 'playstation', 'rpg', 'arcade', 'xbox', 'steam'],
        entries: [
            'Among Us', 'Animal Crossing', 'Apex Legends', 'Assassin\'s Creed', 'Asteroids',
            'Baldur\'s Gate', 'Bioshock', 'Bloodborne', 'Borderlands', 'Brawlhalla',
            'Call of Duty', 'Castlevania', 'Celeste', 'Chrono Trigger', 'Civilization', 'Counter-Strike', 'Cyberpunk 2077',
            'Dark Souls', 'Dead Cells', 'Dead Space', 'Destiny', 'Deus Ex', 'Diablo', 'Dishonored', 'Doom', 'Dota 2', 'Dragon Age', 'Dragon Quest',
            'Elden Ring', 'Elder Scrolls', 'Fallout', 'Far Cry', 'Final Fantasy', 'Fortnite', 'Forza Horizon',
            'Gears of War', 'Genshin Impact', 'God of War', 'Grand Theft Auto', 'Gran Turismo', 'Grim Fandango', 'Guitar Hero',
            'Half-Life', 'Halo', 'Hades', 'Hearthstone', 'Hitman', 'Hollow Knight', 'Horizon Zero Dawn',
            'Ico', 'Infamous', 'Injustice', 'Inside',
            'Journey', 'Just Cause',
            'Kingdom Hearts', 'Kirby',
            'League of Legends', 'Left 4 Dead', 'LittleBigPlanet', 'Luigi\'s Mansion',
            'Mass Effect', 'Mega Man', 'Metal Gear Solid', 'Metroid', 'Minecraft', 'Mortal Kombat', 'Monster Hunter',
            'Nier Automata', 'Nioh', 'No Man\'s Sky',
            'Overwatch', 'Outer Wilds', 'Oxenfree',
            'Pac-Man', 'Palworld', 'Payday', 'Persona', 'Pikmin', 'Pokemon', 'Pong', 'Portal', 'Psychonauts',
            'Quake', 'Quantum Break',
            'Ratchet and Clank', 'Red Dead Redemption', 'Resident Evil', 'Roblox', 'Rocket League', 'Rust',
            'Sekiro', 'Silent Hill', 'SimCity', 'Sonic the Hedgehog', 'Space Invaders', 'Splatoon', 'StarCraft', 'Street Fighter', 'Super Mario', 'Super Smash Bros',
            'Tekken', 'Terraria', 'Tetris', 'The Last of Us', 'The Legend of Zelda', 'The Sims', 'The Witcher', 'Titanfall', 'Tomb Raider',
            'Uncharted', 'Undertale', 'Until Dawn', 'Ultima',
            'Valorant', 'Vampire Survivors',
            'Warcraft', 'Watch Dogs', 'Wolfenstein', 'World of Warcraft',
            'Xenoblade Chronicles', 'XCOM',
            'Yakuza', 'Yoshi\'s Island',
            'Zoo Tycoon'
        ]
    },
    'fictional_character': {
        name: 'Fictional Character',
        tier: 'tier_2',
        description: 'Protagonists, villains, or sidekicks in fiction & mythos.',
        icon: '🎭',
        keywords: ['character', 'fictional', 'protagonist', 'antagonist', 'hero', 'villain', 'myth', 'fictional character'],
        entries: [
            'Achilles', 'Aladdin', 'Albus Dumbledore', 'Alice', 'Anakin Skywalker', 'Aragorn', 'Arthur Dent', 'Arya Stark', 'Aslan', 'Atticus Finch',
            'Batman', 'Bilbo Baggins', 'Black Panther', 'Boba Fett', 'Bowser', 'Buffy Summers',
            'Captain America', 'Catwoman', 'Chewbacca', 'Cinderella', 'Cloud Strife', 'Conan the Barbarian',
            'Darth Vader', 'Deadpool', 'Doctor Strange', 'Don Quixote', 'Dracula', 'Dumbledore',
            'Edward Cullen', 'Elsa', 'Eowyn', 'Eragon',
            'Flash', 'Forrest Gump', 'Frodo Baggins',
            'Gandalf', 'Geralt of Rivia', 'Goku', 'Gollum', 'Green Lantern',
            'Han Solo', 'Harley Quinn', 'Harry Potter', 'He-Man', 'Hercules', 'Hermione Granger', 'Homer Simpson', 'Hulk',
            'Indiana Jones', 'Iron Man',
            'Jack Sparrow', 'James Bond', 'Jon Snow', 'Joker',
            'Katniss Everdeen', 'Kirby', 'Kratos', 'Kylo Ren',
            'Legolas', 'Lara Croft', 'Link', 'Luke Skywalker',
            'Magneto', 'Mario', 'Marty McFly', 'Mickey Mouse', 'Mulan',
            'Neo', 'Nemo', 'Nick Fury',
            'Obi-Wan Kenobi', 'Optimus Prime',
            'Percy Jackson', 'Peter Pan', 'Peter Parker', 'Pinocchio', 'Pooh', 'Pikachu',
            'Quicksilver',
            'Robin Hood', 'Ron Weasley', 'Ryu',
            'Samwise Gamgee', 'Sasuke Uchiha', 'Severus Snape', 'Sherlock Holmes', 'Shrek', 'Sonic', 'Spider-Man', 'Superman',
            'Tanjiro Kamado', 'Tarzan', 'Thor', 'Tintin',
            'Ultron', 'Ursula', 'Usopp',
            'Voldemort', 'Vegeta',
            'Wolverine', 'Wonder Woman',
            'Xena',
            'Yoda', 'Yoshi',
            'Zelda', 'Zorro'
        ]
    },
    'musical_instrument': {
        name: 'Musical Instrument',
        tier: 'tier_2',
        description: 'Acoustic, electric, or traditional music instruments.',
        icon: '🎻',
        keywords: ['musical instrument', 'instrument', 'music', 'percussion', 'string', 'wind', 'brass', 'acoustic', 'keyboard'],
        entries: [
            'Accordion', 'Acoustic guitar', 'Autoharp',
            'Bagpipes', 'Balalaika', 'Banjo', 'Bass guitar', 'Bassoon', 'Bongos', 'Bouzouki', 'Bugle',
            'Castanets', 'Cello', 'Clarinet', 'Clavichord', 'Conga', 'Cornet', 'Cymbals',
            'Didgeridoo', 'Djembe', 'Double bass', 'Drum kit', 'Dulcimer',
            'Electric guitar', 'English horn', 'Euphonium',
            'Fiddle', 'Flute', 'French horn',
            'Glockenspiel', 'Gong', 'Guitar',
            'Harmonica', 'Harmonium', 'Harp', 'Harpsichord', 'Horn', 'Hurdy-gurdy',
            'Kalimba', 'Kithara', 'Koto',
            'Lute', 'Lyre',
            'Mandolin', 'Maracas', 'Marimba', 'Melodica',
            'Oboe', 'Ocarina', 'Organ',
            'Pan flute', 'Piano', 'Piccolo', 'Pipe organ',
            'Recorder',
            'Saxophone', 'Shamisen', 'Sitar', 'Snare drum', 'Steel drum', 'Synthesizer',
            'Tabla', 'Tambourine', 'Theremin', 'Timbales', 'Timpani', 'Triangle', 'Trombone', 'Trumpet', 'Tuba', 'Tubular bells',
            'Ukulele', 'Udu',
            'Viola', 'Violin', 'Vibraphone',
            'Washboard', 'Whistle',
            'Xylophone',
            'Zither'
        ]
    },
    'movie_tv_show': {
        name: 'Movie or TV Show',
        tier: 'tier_2',
        description: 'Films, television series, and cinematic releases.',
        icon: '📺',
        keywords: ['film', 'movie', 'television', 'tv series', 'show', 'cinema', 'motion picture', 'series'],
        entries: [
            'Avatar', 'Alien', 'Avengers', 'Amadeus', 'Arcane', 'Apocalypse Now', 'Arrival',
            'Breaking Bad', 'Blade Runner', 'Back to the Future', 'Braveheart', 'Better Call Saul', 'Black Mirror', 'Buffy the Vampire Slayer',
            'Casablanca', 'Citizen Kane', 'Chernobyl', 'Community', 'Curb Your Enthusiasm',
            'Dark', 'Dexter', 'Doctor Who', 'Dune', 'Die Hard', 'Django Unchained',
            'Euphoria', 'Ex Machina', 'Fargo', 'Fight Club', 'Friends', 'Fleabag', 'Frozen', 'Forrest Gump',
            'Game of Thrones', 'Gladiator', 'Goodfellas', 'Ghostbusters', 'Gilmore Girls',
            'House of the Dragon', 'House', 'Homeland', 'Hannibal', 'Harry Potter', 'Inception', 'Interstellar', 'Indiana Jones',
            'Jaws', 'Jurassic Park', 'John Wick', 'Joker',
            'Kill Bill', 'Knives Out',
            'Lost', 'Lord of the Rings', 'Loki', 'Lucifer',
            'Mad Men', 'Mindhunter', 'Matrix', 'Memento', 'Modern Family', 'Money Heist',
            'Narcos', 'North by Northwest',
            'Ozark', 'Oppenheimer', 'Office',
            'Peaky Blinders', 'Pulp Fiction', 'Parks and Recreation', 'Prison Break', 'Psycho',
            'Quantum of Solace',
            'Rick and Morty', 'Rocky', 'Raging Bull',
            'Stranger Things', 'Succession', 'Seinfeld', 'Schindler\'s List', 'Star Wars', 'Severance', 'Sherlock', 'Squid Game', 'Shrek',
            'The Godfather', 'The Sopranos', 'The Wire', 'The Boys', 'The Crown', 'The Mandalorian', 'The Twilight Zone', 'The Simpsons', 'Titanic', 'Twin Peaks',
            'Unforgiven', 'Upload', 'Under the Dome', 'Up',
            'Vikings', 'Vampire Diaries',
            'Westworld', 'WandaVision', 'Wednesday',
            'X-Files',
            'Yellowstone', 'You',
            'Zootopia'
        ]
    },

    // ==========================================
    // TIER 3: STEM & GEOGRAPHY (1.5x, 200 pts)
    // ==========================================
    'chemical_element': {
        name: 'Chemical Element',
        tier: 'tier_3',
        description: 'Elements of the periodic table by standard IUPAC name.',
        icon: '🧪',
        keywords: ['chemical element', 'element', 'atomic', 'periodic table', 'metal', 'gas', 'halogen', 'actinide', 'lanthanide'],
        entries: [
            'Actinium', 'Aluminum', 'Americium', 'Antimony', 'Argon', 'Arsenic', 'Astatine',
            'Barium', 'Berkelium', 'Beryllium', 'Bismuth', 'Bohrium', 'Boron', 'Bromine',
            'Cadmium', 'Calcium', 'Californium', 'Carbon', 'Cerium', 'Cesium', 'Chlorine', 'Chromium', 'Cobalt', 'Copernicium', 'Copper', 'Curium',
            'Darmstadtium', 'Dubnium', 'Dysprosium',
            'Einsteinium', 'Erbium', 'Europium',
            'Fermium', 'Flerovium', 'Fluorine', 'Francium',
            'Gadolinium', 'Gallium', 'Germanium', 'Gold',
            'Hafnium', 'Hassium', 'Helium', 'Holmium', 'Hydrogen',
            'Indium', 'Iodine', 'Iridium', 'Iron',
            'Krypton',
            'Lanthanum', 'Lawrencium', 'Lead', 'Lithium', 'Livermorium', 'Lutetium',
            'Magnesium', 'Manganese', 'Meitnerium', 'Mendelevium', 'Mercury', 'Molybdenum', 'Moscovium',
            'Neodymium', 'Neon', 'Neptunium', 'Nickel', 'Nihonium', 'Niobium', 'Nitrogen', 'Nobelium',
            'Oganesson', 'Osmium', 'Oxygen',
            'Palladium', 'Phosphorus', 'Platinum', 'Plutonium', 'Polonium', 'Potassium', 'Praseodymium', 'Promethium', 'Protactinium',
            'Radium', 'Radon', 'Rhenium', 'Rhodium', 'Roentgenium', 'Rubidium', 'Ruthenium', 'Rutherfordium',
            'Samarium', 'Scandium', 'Seaborgium', 'Selenium', 'Silicon', 'Silver', 'Sodium', 'Strontium', 'Sulfur',
            'Tantalum', 'Technetium', 'Tellurium', 'Tennessine', 'Terbium', 'Thallium', 'Thorium', 'Thulium', 'Tin', 'Titanium', 'Tungsten',
            'Uranium', 'Ununoctium',
            'Vanadium',
            'Xenon',
            'Ytterbium', 'Yttrium',
            'Zinc', 'Zirconium'
        ]
    },
    'programming_language': {
        name: 'Programming Language',
        tier: 'tier_3',
        description: 'Compiled, interpreted, and domain-specific code languages.',
        icon: '💻',
        keywords: ['programming language', 'code', 'software', 'scripting', 'computer language', 'compiler', 'syntax'],
        entries: [
            'ActionScript', 'Ada', 'Algol', 'Apex', 'Assembly', 'AutoHotkey', 'Awk',
            'Bash', 'Basic', 'C', 'C#', 'C++', 'Clojure', 'COBOL', 'CoffeeScript', 'Crystal',
            'D', 'Dart', 'Delphi',
            'Elixir', 'Elm', 'Erlang',
            'F#', 'Fortran',
            'Go', 'Golang', 'Groovy',
            'Haskell', 'Haxe', 'HTML',
            'Java', 'JavaScript', 'Julia',
            'Kotlin',
            'Lisp', 'Lua',
            'MATLAB', 'Nim',
            'Objective-C', 'OCaml',
            'Pascal', 'Perl', 'PHP', 'PL/SQL', 'PowerShell', 'Prolog', 'Python',
            'R', 'Racket', 'Ruby', 'Rust',
            'Scala', 'Scheme', 'Scratch', 'Solidity', 'SQL', 'Swift',
            'Tcl', 'TypeScript',
            'UnrealScript',
            'V', 'Vala', 'VHDL', 'Visual Basic',
            'WebAssembly',
            'Zig'
        ]
    },
    'constellation': {
        name: 'Constellation',
        tier: 'tier_3',
        description: 'The 88 officially recognized IAU star constellations.',
        icon: '✨',
        keywords: ['constellation', 'star', 'iau', 'astronomy', 'celestial', 'sky', 'asterism'],
        entries: [
            'Andromeda', 'Antlia', 'Apus', 'Aquarius', 'Aquila', 'Ara', 'Aries', 'Auriga',
            'Bootes', 'Caelum', 'Camelopardalis', 'Cancer', 'Canes Venatici', 'Canis Major', 'Canis Minor', 'Capricornus', 'Carina', 'Cassiopeia', 'Centaurus', 'Cepheus', 'Cetus', 'Chamaeleon', 'Circinus', 'Columba', 'Coma Berenices', 'Corona Australis', 'Corona Borealis', 'Corvus', 'Crater', 'Crux', 'Cygnus',
            'Delphinus', 'Dorado', 'Draco',
            'Equuleus', 'Eridanus',
            'Fornax',
            'Gemini', 'Grus',
            'Hercules', 'Horologium', 'Hydra', 'Hydrus',
            'Indus',
            'Lacerta', 'Leo', 'Leo Minor', 'Lepus', 'Libra', 'Lupus', 'Lynx', 'Lyra',
            'Mensa', 'Microscopium', 'Monoceros', 'Musca',
            'Norma',
            'Octans', 'Ophiuchus', 'Orion',
            'Pavo', 'Pegasus', 'Perseus', 'Phoenix', 'Pictor', 'Pisces', 'Piscis Austrinus', 'Puppis', 'Pyxis',
            'Reticulum',
            'Sagitta', 'Sagittarius', 'Scorpius', 'Sculptor', 'Scutum', 'Serpens', 'Sextans',
            'Taurus', 'Telescopium', 'Triangulum', 'Triangulum Australe', 'Tucana',
            'Ursa Major', 'Ursa Minor',
            'Vela', 'Virgo', 'Volans', 'Vulpecula'
        ]
    },
    'space_mission_rocket': {
        name: 'Space Mission / Rocket',
        tier: 'tier_3',
        description: 'Space exploration spacecraft, missions, and launch vehicles.',
        icon: '🚀',
        keywords: ['spacecraft', 'rocket', 'space mission', 'nasa', 'satellite', 'lander', 'rover', 'orbiter', 'space exploration'],
        entries: [
            'Apollo', 'Ariane', 'Artemis', 'Atlas',
            'Cassini', 'Challenger', 'Chandrayaan', 'Chang\'e', 'Columbia', 'Curiosity', 'Cygnus',
            'Dawn', 'Discovery', 'Dragon',
            'Endeavour', 'Enterprise', 'ExoMars',
            'Falcon 9', 'Falcon Heavy',
            'Galileo', 'Gemini',
            'Hayabusa', 'Hubble', 'Huygens',
            'InSight', 'International Space Station',
            'James Webb', 'Juno',
            'Kepler',
            'Luna', 'Lunokhod',
            'Magellan', 'Mariner', 'Mars Express', 'Mars Rover', 'Mercury', 'Messenger', 'Mir',
            'New Horizons',
            'Opportunity', 'Orion', 'Osiris-Rex',
            'Perseverance', 'Philae', 'Pioneer', 'Proton',
            'Rosetta',
            'Saturn V', 'Shenzhou', 'Skylab', 'Sojourner', 'Soyuz', 'Space Shuttle', 'Spirit', 'Sputnik', 'Starship',
            'Tianzhou', 'Tiangong',
            'Ulysses',
            'Venera', 'Viking', 'Voyager', 'Vostok', 'Voskhod',
            'ZhengHe'
        ]
    },
    'organ_bone': {
        name: 'Human Organ or Bone',
        tier: 'tier_3',
        description: 'Anatomical organs, viscera, and skeletal bones.',
        icon: '🩻',
        keywords: ['organ', 'bone', 'anatomy', 'skeletal', 'visceral', 'human body', 'tissue', 'muscle', 'gland', 'artery', 'vein'],
        entries: [
            'Appendix', 'Adrenal gland', 'Aorta',
            'Bladder', 'Brain', 'Bronchus',
            'Calcaneus', 'Capitate', 'Clavicle', 'Coccyx', 'Colon', 'Cranium',
            'Diaphragm', 'Duodenum',
            'Ear', 'Esophagus', 'Eye',
            'Femur', 'Fibula',
            'Gallbladder',
            'Hamate', 'Heart', 'Humerus', 'Hyoid',
            'Ileum', 'Ilium', 'Incus', 'Intestine',
            'Jejunum',
            'Kidney',
            'Larynx', 'Liver', 'Lunate', 'Lungs',
            'Malleus', 'Mandible', 'Maxilla', 'Metacarpal', 'Metatarsal',
            'Navicular', 'Nose',
            'Occipital bone',
            'Pancreas', 'Patella', 'Pelvis', 'Phalanx', 'Pharynx', 'Pisiform', 'Prostate',
            'Radius', 'Rib',
            'Sacrum', 'Scaphoid', 'Scapula', 'Skin', 'Skull', 'Small intestine', 'Spleen', 'Stapes', 'Sternum', 'Stomach',
            'Talus', 'Temporal bone', 'Thyroid', 'Tibia', 'Tongue', 'Trachea', 'Trapezium', 'Trapezoid', 'Triquetrum',
            'Ulna', 'Ureter', 'Urethra', 'Uterus', 'Uvula',
            'Vertebra', 'Vomer',
            'Zygomatic bone'
        ]
    },
    'mountain_volcano': {
        name: 'Mountain or Volcano',
        tier: 'tier_3',
        description: 'Major peaks, volcanic calderas, and mountain ranges.',
        icon: '🌋',
        keywords: ['mountain', 'volcano', 'peak', 'caldera', 'mount', 'range', 'stratovolcano', 'summit', 'elevation'],
        entries: [
            'Aconcagua', 'Annapurna', 'Ararat',
            'Ben Nevis',
            'Chimborazo', 'Cotopaxi', 'Crestone',
            'Denali', 'Dhaulagiri',
            'Elbrus', 'Etna', 'Everest', 'Eyjafjallajokull',
            'Fuji',
            'Gasherbrum', 'Grimsvotn',
            'Haleakala', 'Hekla',
            'Illimani', 'Iztaccihuatl',
            'K2', 'Kanchenjunga', 'Kilimanjaro', 'Kilauea', 'Krakatoa',
            'Lhotse',
            'Mauna Kea', 'Mauna Loa', 'Matterhorn', 'Mont Blanc', 'Mount Baker', 'Mount Cook', 'Mount Hood', 'Mount Rainier', 'Mount Saint Helens', 'Mount Shasta', 'Mount Washington',
            'Nanga Parbat', 'Nevado del Ruiz',
            'Olympus', 'Ojos del Salado',
            'Pico de Orizaba', 'Popocatepetl',
            'Rainier',
            'Santorini', 'Stromboli',
            'Taal', 'Tabor', 'Teide', 'Trivor',
            'Unzen',
            'Vesuvius',
            'Whitney',
            'Yellowstone Caldera'
        ]
    },

    // ==========================================
    // TIER 4: NICHE / EXPERT (2.0x, 300 pts)
    // ==========================================
    'dinosaur': {
        name: 'Dinosaur / Prehistoric Beast',
        tier: 'tier_4',
        description: 'Mesozoic dinosaurs, pterosaurs, and ancient fauna.',
        icon: '🦖',
        keywords: ['dinosaur', 'prehistoric', 'fossil', 'mesozoic', 'cretaceous', 'jurassic', 'pterosaur', 'sauropod', 'theropod'],
        entries: [
            'Allosaurus', 'Ankylosaurus', 'Apatosaurus', 'Archaeopteryx', 'Argentinosaurus',
            'Baryonyx', 'Brachiosaurus', 'Brontosaurus',
            'Carnotaurus', 'Ceratosaurus', 'Coelophysis', 'Compsognathus', 'Corythosaurus',
            'Deinonychus', 'Dilophosaurus', 'Dimetrodon', 'Diplodocus', 'Dreadnoughtus',
            'Edmontosaurus', 'Elasmosaurus', 'Eoraptor',
            'Gallimimus', 'Giganotosaurus',
            'Hadrosaurus', 'Herrerasaurus',
            'Ichthyosaurus', 'Iguanodon',
            'Kentrosaurus',
            'Lambeosaurus', 'Liopleurodon',
            'Maiasaura', 'Mammoth', 'Megalodon', 'Megalosaurus', 'Microraptor', 'Mosasaurus',
            'Nodosaurus',
            'Oviraptor',
            'Pachycephalosaurus', 'Parasaurolophus', 'Plesiosaurus', 'Protoceratops', 'Pteranodon', 'Pterodactyl',
            'Quetzalcoatlus',
            'Rapetosaurus',
            'Sabertooth Cat', 'Sauropelta', 'Smilodon', 'Spinosaurus', 'Stegosaurus', 'Styracosaurus', 'Suchomimus',
            'Tarbosaurus', 'Therizinosaurus', 'Titanosaur', 'Torosaurus', 'Triceratops', 'Troodon', 'Tyrannosaurus Rex',
            'Utahraptor', 'Uintatherium', 'Unenlagia',
            'Velociraptor',
            'Woolly Rhino'
        ]
    },
    'mythological_deity': {
        name: 'Mythological Deity',
        tier: 'tier_4',
        description: 'Gods and goddesses from Greek, Norse, Egyptian, Hindu, Roman, and world myth.',
        icon: '⚡',
        keywords: ['god', 'goddess', 'deity', 'mythology', 'pantheon', 'divinity', 'mythological', 'immortal'],
        entries: [
            'Achilles', 'Adonis', 'Aeolus', 'Agni', 'Amun', 'Anansi', 'Anhur', 'Anubis', 'Aphrodite', 'Apollo', 'Ares', 'Artemis', 'Athena',
            'Bacchus', 'Baldur', 'Bastet', 'Brahma', 'Brigid',
            'Ceres', 'Chronos', 'Cupid',
            'Demeter', 'Diana', 'Dionysus', 'Durga',
            'Enki', 'Enlil', 'Eos', 'Erebus', 'Eros',
            'Fenrir', 'Freya', 'Freyr',
            'Ganesha', 'Geb',
            'Hades', 'Hanuman', 'Hathor', 'Hebe', 'Hecate', 'Heimdall', 'Hel', 'Hephaestus', 'Hera', 'Hermes', 'Horus', 'Hestia',
            'Indra', 'Ishtar', 'Isis',
            'Janus', 'Jove', 'Juno', 'Jupiter',
            'Kali', 'Khonsu', 'Krishna', 'Kukulkan',
            'Lakshmi', 'Loki',
            'Mars', 'Mercury', 'Minerva', 'Mithra', 'Morrigan',
            'Neith', 'Nemesis', 'Neptune', 'Nike', 'Nut',
            'Odin', 'Osiris',
            'Pan', 'Persephone', 'Pluto', 'Poseidon',
            'Quetzalcoatl',
            'Ra', 'Rama',
            'Saraswati', 'Sekhmet', 'Set', 'Shiva', 'Sobek', 'Surya',
            'Thanatos', 'Thor', 'Thoth', 'Tyr',
            'Uranus', 'Ullr',
            'Venus', 'Vesta', 'Vishnu', 'Vulcan',
            'Xipe Totec',
            'Yahweh',
            'Zeus'
        ]
    },
    'currency': {
        name: 'Currency / Fiat',
        tier: 'tier_4',
        description: 'Official monetary units and currencies worldwide.',
        icon: '🪙',
        keywords: ['currency', 'money', 'coin', 'banknote', 'monetary', 'fiat', 'dollar', 'cent', 'dinar', 'legal tender'],
        entries: [
            'Afghani', 'Ariary',
            'Baht', 'Balboa', 'Birr', 'Boliviano', 'Bolivar',
            'Cedi', 'Colon', 'Cordoba', 'Corona', 'Crown',
            'Dalasi', 'Denar', 'Dinar', 'Dirham', 'Dobra', 'Dollar', 'Dong', 'Drachma',
            'Escudo', 'Euro',
            'Florin', 'Forint', 'Franc',
            'Gourde', 'Guarani', 'Guilder',
            'Hryvnia',
            'Kina', 'Kip', 'Koruna', 'Krona', 'Krone', 'Kwanza', 'Kyat',
            'Lari', 'Lek', 'Lempira', 'Leone', 'Leu', 'Lev', 'Lira',
            'Manat', 'Mark', 'Metical',
            'Naira', 'Nakfa', 'Ngultrum',
            'Ouguiya',
            'Pataca', 'Pesa', 'Peseta', 'Peso', 'Pound', 'Pula',
            'Quetzal',
            'Rand', 'Real', 'Rial', 'Riel', 'Ringgit', 'Riyal', 'Ruble', 'Rufiyaa', 'Rupiah', 'Rupee',
            'Shekel', 'Shilling', 'Sol', 'Som', 'Somoni',
            'Taka', 'Tala', 'Tenge', 'Tolar', 'Tugrik',
            'UGX', 'Unidad de fomento',
            'Vatu',
            'Won',
            'Yen', 'Yuan',
            'Zloty'
        ]
    },
    'gemstone_mineral': {
        name: 'Gemstone or Mineral',
        tier: 'tier_4',
        description: 'Precious crystals, cut gems, minerals, and ores.',
        icon: '💎',
        keywords: ['gemstone', 'mineral', 'gem', 'crystal', 'ore', 'rock', 'precious stone', 'silicate', 'jewel', 'feldspar', 'quartz'],
        entries: [
            'Agate', 'Alexandrite', 'Almandine', 'Amazonite', 'Amber', 'Amethyst', 'Ametrine', 'Andalusite', 'Apatite', 'Aquamarine', 'Azurite',
            'Beryl', 'Bloodstone', 'Borax',
            'Calcite', 'Carnelian', 'Cassiterite', 'Cat\'s eye', 'Celestite', 'Chalcedony', 'Charoite', 'Chrysocolla', 'Chrysoberyl', 'Chrysoprase', 'Cinnabar', 'Citrine', 'Corundum',
            'Danburite', 'Diamond', 'Diopside', 'Dolomite',
            'Emerald', 'Epidote',
            'Feldspar', 'Fluorite',
            'Garnet', 'Goldstone', 'Gypsum',
            'Haematite', 'Hematite', 'Heliodor', 'Hiddenite', 'Howlite',
            'Iolite',
            'Jade', 'Jadeite', 'Jasper',
            'Kunzite', 'Kyanite',
            'Labradorite', 'Lapis lazuli', 'Larimar', 'Lepidolite',
            'Malachite', 'Marcasite', 'Maw sit sit', 'Moldavite', 'Moonstone', 'Morganite', 'Muscovite',
            'Nephrite',
            'Obsidian', 'Onyx', 'Opal',
            'Pearl', 'Peridot', 'Petalite', 'Prehnite', 'Pyrite', 'Pyrope',
            'Quartz',
            'Rhodochrosite', 'Rhodonite', 'Rose quartz', 'Ruby', 'Rutile',
            'Sapphire', 'Scapolite', 'Serpentine', 'Smoky quartz', 'Sodalite', 'Spessartine', 'Sphalerite', 'Spinel', 'Spodumene', 'Sugilite', 'Sunstone',
            'Tanzanite', 'Tiger\'s eye', 'Topaz', 'Tourmaline', 'Tsavorite', 'Turquoise',
            'Ulexite', 'Unakite', 'Uraninite', 'Uvarovite',
            'Vanadinite', 'Variscite', 'Vesuvianite', 'Vivianite',
            'Willemite', 'Wolframite', 'Wulfenite',
            'Xenotime', 'Xonotlite',
            'Yttrium',
            'Zeolite', 'Zincite', 'Zircon', 'Zoisite'
        ]
    },
    'historical_battle': {
        name: 'Historical Battle',
        tier: 'tier_4',
        description: 'Notable military conflicts, sieges, and historical battles.',
        icon: '⚔️',
        keywords: ['battle', 'siege', 'war', 'conflict', 'military', 'campaign', 'expedition', 'combat', 'engagement'],
        entries: [
            'Actium', 'Agincourt', 'Alamo', 'Alesia', 'Antietam', 'Austerlitz',
            'Balaclava', 'Bannockburn', 'Bastogne', 'Borodino', 'Bosworth Field', 'Boyne', 'Bunker Hill',
            'Cannae', 'Carrhae', 'Chancellorsville', 'Crecy', 'Culloden',
            'D-Day', 'Dien Bien Phu', 'Dunkirk',
            'El Alamein',
            'Fontenoy', 'Fredericksburg',
            'Gallipoli', 'Gaugamela', 'Gettysburg', 'Guadalcanal',
            'Hastings', 'Hattin',
            'Iwo Jima',
            'Jutland',
            'Kasserine Pass', 'Kalka River', 'Kadesh', 'Kursk',
            'Leipzig', 'Lepanto', 'Little Bighorn',
            'Marathon', 'Marengo', 'Marston Moor', 'Midway', 'Milvian Bridge',
            'Naseby', 'Navarino',
            'Okinawa',
            'Passchendaele', 'Pelusium', 'Pharsalus', 'Plataea', 'Poitiers',
            'Quebec',
            'Rorke\'s Drift',
            'Salamis', 'Saragossa', 'Saratoga', 'Sedan', 'Sekigahara', 'Somme', 'Stalingrad',
            'Thermopylae', 'Tours', 'Trafalgar', 'Tsushima',
            'Ulm',
            'Verdun', 'Vicksburg', 'Vienna',
            'Waterloo', 'Wounded Knee',
            'Yorktown', 'Ypres',
            'Zama'
        ]
    },
    'marine_creature': {
        name: 'Marine Creature',
        tier: 'tier_4',
        description: 'Pelagic fish, deep-sea abyssal organisms, and marine mammals.',
        icon: '🐙',
        keywords: ['marine', 'sea creature', 'ocean', 'pelagic', 'fish', 'shark', 'whale', 'cephalopod', 'crustacean', 'mollusk', 'aquatic'],
        entries: [
            'Abyssal grenadier', 'Angelfish', 'Anglerfish', 'Anemone',
            'Barbel', 'Barnacle', 'Barracuda', 'Basking shark', 'Beluga', 'Blobfish', 'Blue whale', 'Bowhead whale',
            'Clownfish', 'Coelacanth', 'Coral', 'Cuttlefish',
            'Dolphin', 'Dugong',
            'Eel', 'Elephant seal',
            'Fangtooth', 'Flying fish',
            'Giant squid', 'Goblin shark', 'Great white shark', 'Green sea turtle', 'Grouper', 'Gulper eel',
            'Haddock', 'Halibut', 'Hammerhead shark', 'Harp seal', 'Horseshoe crab', 'Humpback whale',
            'Isopod',
            'Jellyfish',
            'Killer whale', 'Krill',
            'Lanternfish', 'Leopard seal', 'Lionfish', 'Lobster',
            'Manta ray', 'Megamouth shark', 'Minke whale', 'Moray eel',
            'Narwhal', 'Nautilus', 'Nudibranch',
            'Octopus', 'Oarfish', 'Orca', 'Otter',
            'Penguin', 'Piranha', 'Plankton', 'Porpoise', 'Pufferfish',
            'Remora', 'Right whale',
            'Sailfish', 'Salmon', 'Sea anemone', 'Sea cucumber', 'Sea dragon', 'Sea horse', 'Sea lion', 'Sea otter', 'Sea urchin', 'Seahorse', 'Sperm whale', 'Spiny dogfish', 'Squid', 'Starfish', 'Stingray', 'Sunfish', 'Swordfish',
            'Tarpon', 'Tiger shark', 'Tuna',
            'Urchin', 'Umbrellabird',
            'Vampire squid', 'Viperfish',
            'Walrus', 'Whale shark',
            'Yellowfin tuna',
            'Zooplankton'
        ]
    }
};

/**
 * Normalizes user text for hash/exact verification
 */
function sanitizeInputWord(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]/g, "")      // remove non-alphanumerics
        .trim();
}

/**
 * Pre-indexes all category words into fast Set lookups and calculates synthetic rarity metrics
 */
class CategoryRegistry {
    constructor() {
        this.index = new Map();
        this.rarityMap = new Map();
        this.buildIndexes();
    }

    buildIndexes() {
        for (const [catId, catObj] of Object.entries(CATEGORIES_DATA)) {
            const wordSet = new Set();
            const words = catObj.entries || [];

            words.forEach((entry, i) => {
                const clean = sanitizeInputWord(entry);
                if (clean) {
                    wordSet.add(clean);
                    // Generate synthetic rarity weight (0 - 100).
                    const rarity = Math.min(96, Math.max(10, Math.round(30 + (i / words.length) * 60 + (clean.length % 7) * 2)));
                    this.rarityMap.set(`${catId}:${clean}`, rarity);
                }
            });

            this.index.set(catId, wordSet);
        }
    }

    getAllCategoryIds() {
        return Object.keys(CATEGORIES_DATA);
    }

    getCategory(catId) {
        return CATEGORIES_DATA[catId];
    }

    getRandomCategories(count = 5, forcedTiers = null) {
        let keys = Object.keys(CATEGORIES_DATA);
        if (forcedTiers) {
            keys = keys.filter(k => forcedTiers.includes(CATEGORIES_DATA[k].tier));
        }
        const shuffled = [...keys].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    hasExact(catId, cleanWord) {
        const set = this.index.get(catId);
        return set ? set.has(cleanWord) : false;
    }

    getRarity(catId, cleanWord) {
        const key = `${catId}:${cleanWord}`;
        if (this.rarityMap.has(key)) {
            return this.rarityMap.get(key);
        }
        return 88;
    }

    getEntriesForCategory(catId) {
        return CATEGORIES_DATA[catId]?.entries || [];
    }

    registerDynamicWord(catId, originalWord) {
        const clean = sanitizeInputWord(originalWord);
        if (!clean) return;
        let set = this.index.get(catId);
        if (!set) {
            set = new Set();
            this.index.set(catId, set);
        }
        set.add(clean);
        this.rarityMap.set(`${catId}:${clean}`, 94);
    }
}

// Global singleton instance
window.LexiconDB = new CategoryRegistry();
