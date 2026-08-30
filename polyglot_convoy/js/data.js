/**
 * POLYGLOT CONVOY: Multilingual Translation & Speed Typing Database
 * Authentic translations across Spanish, French, German, Japanese (Romaji), Italian & Latin.
 */

window.POLYGLOT_DATA = {
    languages: {
        es: { name: "Spanish", flag: "🇪🇸", color: "#f59e0b" },
        fr: { name: "French", flag: "🇫🇷", color: "#38bdf8" },
        de: { name: "German", flag: "🇩🇪", color: "#ef4444" },
        ja: { name: "Japanese (Romaji)", flag: "🇯🇵", color: "#ec4899" },
        it: { name: "Italian", flag: "🇮🇹", color: "#10b981" },
        la: { name: "Latin", flag: "🏛️", color: "#a855f7" }
    },

    // 15 Structured Diplomatic Courier Missions
    missions: [
        {
            id: 1,
            title: "Madrid Station Express",
            badge: "MISSION #01 // SPANISH CORE",
            language: "es",
            difficulty: "Courier Cadet",
            wpmTarget: 25,
            durationSec: 75,
            description: "Translate high-frequency Spanish travel and diplomatic dispatches into English as they arrive on the express ticker.",
            phrases: [
                { source: "Hola, buenos días", target: "HELLO GOOD MORNING", hint: "Standard morning greeting" },
                { source: "¿Dónde está la estación?", target: "WHERE IS THE STATION", hint: "Common directional inquiry" },
                { source: "El tren sale pronto", target: "THE TRAIN LEAVES SOON", hint: "Salir = to leave" },
                { source: "Necesito ayuda urgente", target: "I NEED URGENT HELP", hint: "Emergency phrase" },
                { source: "Tenemos un mensaje secreto", target: "WE HAVE A SECRET MESSAGE", hint: "Tener = to have" },
                { source: "El tiempo vuela rápido", target: "TIME FLIES FAST", hint: "Common proverb" }
            ],
            grammarPearl: "In Spanish, questions and exclamations open with inverted punctuation (¿ and ¡). The verb 'estar' indicates temporary states/locations, while 'ser' indicates permanent traits."
        },
        {
            id: 2,
            title: "Paris Metro Dispatch",
            badge: "MISSION #02 // FRENCH ESSENTIALS",
            language: "fr",
            difficulty: "Courier Cadet",
            wpmTarget: 28,
            durationSec: 80,
            description: "Translate incoming French telegraphs before the Paris metro express reaches the terminus.",
            phrases: [
                { source: "Bienvenue à Paris", target: "WELCOME TO PARIS", hint: "Classic welcome" },
                { source: "Je cherche la vérité", target: "I AM LOOKING FOR THE TRUTH", hint: "Chercher = to look for" },
                { source: "Le pont est bloqué", target: "THE BRIDGE IS BLOCKED", hint: "Infrastructure alert" },
                { source: "Nous devons partir maintenant", target: "WE MUST LEAVE NOW", hint: "Devoir = must / to have to" },
                { source: "La nuit est calme", target: "THE NIGHT IS QUIET", hint: "Descriptive observation" },
                { source: "Rendez-vous à minuit", target: "MEET AT MIDNIGHT", hint: "Rendez-vous = appointment" }
            ],
            grammarPearl: "French uses contractions extensively (e.g. 'c'est', 'l'eau', 'j'ai'). Silent final consonants (liaison) are pronounced only when the next word starts with a vowel."
        },
        {
            id: 3,
            title: "Berlin Autobahn Relay",
            badge: "MISSION #03 // GERMAN PRECISION",
            language: "de",
            difficulty: "Junior Courier",
            wpmTarget: 30,
            durationSec: 85,
            description: "Translate high-precision German engineering and navigational telegrams at autobahn speed.",
            phrases: [
                { source: "Guten Tag mein Freund", target: "GOOD DAY MY FRIEND", hint: "Standard polite greeting" },
                { source: "Die Zeit läuft ab", target: "THE TIME IS RUNNING OUT", hint: "Ablaufen = to expire" },
                { source: "Der Schlüssel ist versteckt", target: "THE KEY IS HIDDEN", hint: "Passiv past participle" },
                { source: "Schnell zum Flughafen", target: "QUICKLY TO THE AIRPORT", hint: "Flughafen = flight haven (airport)" },
                { source: "Alles ist bereit", target: "EVERYTHING IS READY", hint: "Readiness confirmation" },
                { source: "Das Auto fährt sehr schnell", target: "THE CAR DRIVES VERY FAST", hint: "Fahren = to drive/travel" }
            ],
            grammarPearl: "In German, all nouns are capitalized (der Schlüssel, das Auto). German compound words combine multiple concepts into one descriptive word (e.g., Flughafen = flight + harbor)."
        },
        {
            id: 4,
            title: "Tokyo Shinkansen Ticker",
            badge: "MISSION #04 // JAPANESE ROMAJI",
            language: "ja",
            difficulty: "Junior Courier",
            wpmTarget: 32,
            durationSec: 85,
            description: "Translate Japanese Romaji transit communications as the bullet train races between Tokyo and Kyoto.",
            phrases: [
                { source: "Konnichiwa tomodachi", target: "HELLO FRIEND", hint: "Tomodachi = friend" },
                { source: "Densha wa mou kimashita", target: "THE TRAIN HAS ALREADY ARRIVED", hint: "Densha = electric train" },
                { source: "Watashi wa ikimasu", target: "I WILL GO", hint: "Iku = to go" },
                { source: "Mizu o kudasai", target: "WATER PLEASE", hint: "Mizu = water, kudasai = please" },
                { source: "Densetsu no katana", target: "THE LEGENDARY SWORD", hint: "Densetsu = legend" },
                { source: "Jikan ga arimasen", target: "THERE IS NO TIME", hint: "Arimasen = there is not" }
            ],
            grammarPearl: "Japanese follows Subject-Object-Verb (SOV) order. Particles like 'wa' (topic marker), 'ga' (subject), and 'o' (direct object) indicate the grammatical function of words."
        },
        {
            id: 5,
            title: "Rome Vatican Archives",
            badge: "MISSION #05 // ITALIAN & LATIN",
            language: "it",
            difficulty: "Senior Courier",
            wpmTarget: 34,
            durationSec: 90,
            description: "Translate classical Italian diplomatic cables and Latin historical mottos retrieved from archive vaults.",
            phrases: [
                { source: "Benvenuto a Roma", target: "WELCOME TO ROME", hint: "Italian welcome" },
                { source: "La vita è bella", target: "LIFE IS BEAUTIFUL", hint: "Famous Italian proverb" },
                { source: "Carpe diem quam minimum", target: "SEIZE THE DAY", hint: "Latin classic Horace" },
                { source: "Veni vidi vici", target: "I CAME I SAW I CONQUERED", hint: "Julius Caesar motto" },
                { source: "Il tempo vola via", target: "TIME FLIES AWAY", hint: "Volare = to fly" },
                { source: "Veritas vos liberabit", target: "THE TRUTH SHALL SET YOU FREE", hint: "Classical Latin motto" }
            ],
            grammarPearl: "Latin is a highly inflected language without articles ('a', 'the'). Italian evolved directly from Vulgar Latin, keeping rich vowel endings and expressive cadence."
        },
        {
            id: 6,
            title: "Geneva UN Emergency Summit",
            badge: "MISSION #06 // DIPLOMATIC CRISIS",
            language: "fr",
            difficulty: "Senior Courier",
            wpmTarget: 36,
            durationSec: 90,
            description: "A diplomatic emergency in Geneva requires rapid multi-clause translation under tightening deadlines.",
            phrases: [
                { source: "Le traité est signé", target: "THE TREATY IS SIGNED", hint: "Signer = to sign" },
                { source: "La paix est notre priorité", target: "PEACE IS OUR PRIORITY", hint: "Diplomatic priority" },
                { source: "Écoutez les témoins", target: "LISTEN TO THE WITNESSES", hint: "Écouter = to listen" },
                { source: "Tous les délégués sont ici", target: "ALL THE DELEGATES ARE HERE", hint: "Assembly status" },
                { source: "Un cessez-le-feu immédiat", target: "AN IMMEDIATE CEASEFIRE", hint: "Cessez = cease, feu = fire" },
                { source: "L'accord est officiel", target: "THE AGREEMENT IS OFFICIAL", hint: "Accord = agreement" }
            ],
            grammarPearl: "Diplomatic French has been the traditional language of international treaties for centuries due to its precision and structured legal syntax."
        },
        {
            id: 7,
            title: "The False Friends Minefield",
            badge: "MISSION #07 // COGNATE TRAPS",
            language: "es",
            difficulty: "Chief Courier",
            wpmTarget: 38,
            durationSec: 95,
            description: "Beware deceptive 'False Cognates' (Falsos Amigos) that sound like English words but mean completely different things!",
            phrases: [
                { source: "Ella está embarazada", target: "SHE IS PREGNANT", hint: "NOT embarrassed! Embarazada = pregnant" },
                { source: "Compré una carpeta roja", target: "I BOUGHT A RED FOLDER", hint: "NOT carpet! Carpeta = folder" },
                { source: "Tengo mucho éxito", target: "I HAVE MUCH SUCCESS", hint: "NOT exit! Éxito = success" },
                { source: "Actualmente vivo aquí", target: "CURRENTLY I LIVE HERE", hint: "NOT actually! Actualmente = currently" },
                { source: "La sopa está deliciosa", target: "THE SOUP IS DELICIOUS", hint: "NOT soap! Sopa = soup (Jabón = soap)" },
                { source: "La fábrica produce acero", target: "THE FACTORY PRODUCES STEEL", hint: "NOT fabric! Fábrica = factory" }
            ],
            grammarPearl: "False Friends (faux amis) occur when words in different languages share common etymology but diverged in meaning over centuries."
        },
        {
            id: 8,
            title: "The Subjunctive Mood Labyrinth",
            badge: "MISSION #08 // ADVANCED VERBS",
            language: "es",
            difficulty: "Chief Courier",
            wpmTarget: 40,
            durationSec: 95,
            description: "Translate phrases expressing doubt, wishes, uncertainty, and hypothetical conditions in the subjunctive mood.",
            phrases: [
                { source: "Espero que tengas suerte", target: "I HOPE THAT YOU HAVE LUCK", hint: "Subjunctive 'tengas' from tener" },
                { source: "Dudo que ellos vengan", target: "I DOUBT THAT THEY COME", hint: "Dudar triggers subjunctive 'vengan'" },
                { source: "Quiero que seas feliz", target: "I WANT YOU TO BE HAPPY", hint: "Subjunctive 'seas' from ser" },
                { source: "Aunque llueva saldremos", target: "EVEN IF IT RAINS WE WILL GO OUT", hint: "Hypothetical 'llueva'" },
                { source: "Es necesario que hablemos", target: "IT IS NECESSARY THAT WE TALK", hint: "Impersonal trigger 'hablemos'" },
                { source: "Ojalá que no pase nada", target: "HOPEFULLY NOTHING HAPPENS", hint: "Ojalá (God willing) trigger" }
            ],
            grammarPearl: "The Subjunctive mood reflects the speaker's attitude toward an event (wishes, emotions, doubts, possibilities) rather than objective factual statements (Indicative)."
        },
        {
            id: 9,
            title: "Aviation ATC Mayday",
            badge: "MISSION #09 // EMERGENCY AIRLINE",
            language: "fr",
            difficulty: "Flight Controller",
            wpmTarget: 42,
            durationSec: 100,
            description: "Emergency air traffic control transmissions from international airspace requiring instantaneous translation.",
            phrases: [
                { source: "Panne de moteur gauche", target: "LEFT ENGINE FAILURE", hint: "Panne = breakdown/failure" },
                { source: "Autorisation d'atterrir accordée", target: "LANDING CLEARANCE GRANTED", hint: "Atterrir = to land" },
                { source: "Turbulences sévères en approche", target: "SEVERE TURBULENCE ON APPROACH", hint: "Weather hazard" },
                { source: "Maintenez l'altitude actuelle", target: "MAINTAIN CURRENT ALTITUDE", hint: "Maintenir = to maintain" },
                { source: "Cap au nord immédiat", target: "HEADING NORTH IMMEDIATELY", hint: "Cap = heading/direction" },
                { source: "Carburant critique à bord", target: "CRITICAL FUEL ON BOARD", hint: "Carburant = aircraft fuel" }
            ],
            grammarPearl: "Aviation French uses standardized ICAO aeronautical terminology designed for unambiguous radio transmission clarity."
        },
        {
            id: 10,
            title: "Medical Relief Cross",
            badge: "MISSION #10 // FIRST RESPONDER",
            language: "es",
            difficulty: "Flight Controller",
            wpmTarget: 45,
            durationSec: 100,
            description: "Urgent medical triage field reports from international Red Cross humanitarian disaster response teams.",
            phrases: [
                { source: "El paciente respira bien", target: "THE PATIENT BREATHES WELL", hint: "Respirar = to breathe" },
                { source: "Presión arterial estable", target: "BLOOD PRESSURE STABLE", hint: "Vital sign check" },
                { source: "Suministros médicos en camino", target: "MEDICAL SUPPLIES ON THE WAY", hint: "Logistics update" },
                { source: "No tiene fiebre alta", target: "HE DOES NOT HAVE HIGH FEVER", hint: "Triage assessment" },
                { source: "Traslado en ambulancia", target: "TRANSPORT BY AMBULANCE", hint: "Traslado = transfer" },
                { source: "Agua potable para todos", target: "DRINKABLE WATER FOR EVERYONE", hint: "Potable = safe to drink" }
            ],
            grammarPearl: "Medical terminology across Romance languages (Spanish, French, Italian) derives predominantly from Latin and ancient Greek roots."
        },
        {
            id: 11,
            title: "Polyglot Rapid Fire",
            badge: "MISSION #11 // MULTILINGUAL SPRINT",
            language: "es", // Multi
            difficulty: "Diplomatic Master",
            wpmTarget: 48,
            durationSec: 105,
            description: "Extreme multilingual dispatch: Spanish, French, German, and Japanese phrases alternating every single transmission!",
            phrases: [
                { source: "🇪🇸 La llave abre la puerta", target: "THE KEY OPENS THE DOOR", hint: "Spanish: Abrir = to open" },
                { source: "🇫🇷 La lumière brille fort", target: "THE LIGHT SHINES BRIGHT", hint: "French: Briller = to shine" },
                { source: "🇩🇪 Der Wind weht stark", target: "THE WIND BLOWS STRONGLY", hint: "German: Wehen = to blow" },
                { source: "🇯🇵 Hashitte kudasai", target: "PLEASE RUN", hint: "Japanese: Hashiru = to run" },
                { source: "🇪🇸 El cielo está azul", target: "THE SKY IS BLUE", hint: "Spanish: Cielo = sky" },
                { source: "🇫🇷 Le livre est ouvert", target: "THE BOOK IS OPEN", hint: "French: Livre = book" }
            ],
            grammarPearl: "Code-switching (rapidly alternating between multiple languages) exercises executive cognitive control and enhances neuroplasticity."
        },
        {
            id: 12,
            title: "Philosophical Latin & Maxims",
            badge: "MISSION #12 // ANCIENT WISDOM",
            language: "la",
            difficulty: "Diplomatic Master",
            wpmTarget: 50,
            durationSec: 110,
            description: "Translate timeless Latin legal maxims, philosophical tenets, and imperial decrees into precise English.",
            phrases: [
                { source: "Cogito ergo sum", target: "I THINK THEREFORE I AM", hint: "René Descartes tenet" },
                { source: "Audaces fortuna iuvat", target: "FORTUNE FAVORS THE BOLD", hint: "Virgil's Aeneid" },
                { source: "Memento mori semper", target: "REMEMBER YOU MUST DIE", hint: "Stoic reminder" },
                { source: "Acta non verba", target: "DEEDS NOT WORDS", hint: "Action over talk" },
                { source: "Amor fati aeterna", target: "LOVE OF ETERNAL FATE", hint: "Stoic acceptance" },
                { source: "Ad astra per aspera", target: "THROUGH HARDSHIPS TO THE STARS", hint: "Famous motto" }
            ],
            grammarPearl: "Latin is the direct grammatical ancestor of Spanish, French, Italian, Portuguese, and Romanian, and supplied over 60% of advanced English vocabulary."
        },
        {
            id: 13,
            title: "Idioms & Street Slang",
            badge: "MISSION #13 // NATIVE FLUENCY",
            language: "fr",
            difficulty: "Grand Ambassador",
            wpmTarget: 52,
            durationSec: 110,
            description: "Translate native idioms where literal word-for-word translation fails and true figurative mastery is required.",
            phrases: [
                { source: "🇪🇸 Tomar el pelo a alguien", target: "TO PULL SOMEONES LEG", hint: "Literal: to take someone's hair" },
                { source: "🇫🇷 Poser un lapin", target: "TO STAND SOMEONE UP", hint: "Literal: to place a rabbit" },
                { source: "🇩🇪 Ich verstehe nur Bahnhof", target: "IT IS ALL GREEK TO ME", hint: "Literal: I only understand train station" },
                { source: "🇪🇸 Costar un ojo de la cara", target: "TO COST AN ARM AND A LEG", hint: "Literal: to cost an eye from the face" },
                { source: "🇫🇷 Avoir le cafard", target: "TO FEEL DOWN AND BLUE", hint: "Literal: to have the cockroach" },
                { source: "🇩🇪 Daumen drücken", target: "KEEP FINGERS CROSSED", hint: "Literal: to press thumbs" }
            ],
            grammarPearl: "Idioms are the ultimate test of language fluency because their meaning cannot be deduced simply by knowing the individual dictionary words."
        },
        {
            id: 14,
            title: "Cyber-Security Global Wiretap",
            badge: "MISSION #14 // INTERPOL CYBER",
            language: "de",
            difficulty: "Grand Ambassador",
            wpmTarget: 55,
            durationSec: 115,
            description: "Decipher intercept traffic from an international cyber-crime syndicate coordinating across 4 languages.",
            phrases: [
                { source: "🇩🇪 Das Passwort wurde geändert", target: "THE PASSWORD WAS CHANGED", hint: "Passiv past security alert" },
                { source: "🇪🇸 El servidor principal cayó", target: "THE MAIN SERVER WENT DOWN", hint: "Caer = to fall/drop" },
                { source: "🇫🇷 Les données sont cryptées", target: "THE DATA IS ENCRYPTED", hint: "Crypter = to encrypt" },
                { source: "🇯🇵 Fairu o kensaku shite", target: "SEARCH THE FILES", hint: "Kensaku = search" },
                { source: "🇩🇪 Keine Spuren hinterlassen", target: "LEAVE NO TRACES BEHIND", hint: "Spuren = tracks/traces" },
                { source: "🇪🇸 Misión cumplida con éxito", target: "MISSION COMPLETED SUCCESSFULLY", hint: "Confirmation wire" }
            ],
            grammarPearl: "Modern multinational technical teams frequently use hybrid technical terms adapted into their native grammatical conjugations."
        },
        {
            id: 15,
            title: "The Grand Multilingual Embassy Master",
            badge: "MISSION #15 // POLYGLOT PINNACLE",
            language: "es",
            difficulty: "Supreme Polyglot",
            wpmTarget: 60,
            durationSec: 120,
            description: "The ultimate trial: High-speed translation stream spanning Spanish, French, German, Japanese, Italian, and Latin in a single master convoy.",
            phrases: [
                { source: "🇪🇸 La libertad no tiene precio", target: "FREEDOM HAS NO PRICE", hint: "Libertad = freedom" },
                { source: "🇫🇷 L'esprit humain est infini", target: "THE HUMAN MIND IS INFINITE", hint: "Esprit = mind/spirit" },
                { source: "🇩🇪 Wissen ist wahre Macht", target: "KNOWLEDGE IS TRUE POWER", hint: "Wissen = knowledge" },
                { source: "🇯🇵 Mirai wa bokura no te ni", target: "THE FUTURE IS IN OUR HANDS", hint: "Mirai = future" },
                { source: "🇮🇹 L'unione fa la forza", target: "UNITY IS STRENGTH", hint: "Italian unity proverb" },
                { source: "🏛️ Vox populi vox dei", target: "THE VOICE OF THE PEOPLE", hint: "Ancient Latin maxim" }
            ],
            grammarPearl: "Congratulations! You have mastered the linguistic reflexes, grammar structures, and vocabulary of 6 world languages under lightning typing speeds!"
        }
    ]
};
