/**
 * Geo Detective - Case Dossiers Database
 * Authentic real-world geographical & historical mysteries.
 */

window.GEO_CASES = [
    {
        id: "case-017",
        caseNumber: "CASE #017",
        title: "The Missing Camera",
        category: "Missing Person & Recon",
        typeBadge: "👤 Missing Person",
        difficulty: "Normal",
        timeEst: "10-15 min",
        locationRegion: "Central Europe",
        tagline: "A renowned documentary photographer vanished in Europe. His final roll of 35mm film holds the coordinates of his whereabouts.",
        briefing: "On September 14, 2019, investigative photojournalist Viktor Vance failed to check in with his agency. Before his phone went silent, he transmitted a sequence of fragmented field notes, encrypted coordinate sketches, and visual clues. Interpol failed to locate him because his path wasn't documented on tickets — he followed geographical riddles across ancient city boundaries.",
        targetLocationName: "Prague, Czech Republic",
        initialCenter: [50.0875, 14.4213],
        initialZoom: 12,
        clues: [
            {
                clueNumber: 1,
                title: "The River's Bend & The King",
                evidenceType: "Interception Note",
                clueText: "“I will meet you where the Vltava river bends sharply beneath the ancient castle, in the City of a Hundred Spires. Cross the river where thirty stone saints stand guard over the water.”",
                taskPrompt: "Identify the European capital city and the famous 14th-century stone bridge where Viktor met his contact.",
                inputPlaceholder: "e.g., Prague, Charles Bridge or City Name",
                targetQuestion: "What is the capital city?",
                acceptedAnswers: [
                    "prague", "praha", "praga", "czech republic", "czechia", "charles bridge", "karluv most"
                ],
                coordinates: { lat: 50.0865, lng: 14.4114 },
                mapZoom: 14,
                hints: [
                    "Think of the historic capital of Bohemia, known as the 'City of a Hundred Spires'.",
                    "The river mentioned is the Vltava (Moldau), which flows through the Czech Republic.",
                    "Look in Google Maps for the Czech capital: Prague (Praha)."
                ],
                smartFeedback: {
                    "vienna": "Close in region! Vienna is on the Danube, but this river is the Vltava in the Czech Republic.",
                    "budapest": "Budapest has famous bridges over the Danube, but look further northwest into Bohemia.",
                    "bratislava": "You are within ~300 km! Head northwest into the Czech capital."
                },
                verificationStory: "Excellent deduction. You traced Viktor to **Prague (Praha)**, standing directly upon the historic **Charles Bridge (Karlův Most)** overlooking the Vltava river."
            },
            {
                clueNumber: 2,
                title: "The Gaze of the Stone King",
                evidenceType: "Recon Polaroid & Field Sketch",
                clueText: "“At the eastern entrance of the bridge, a colossal Gothic tower watches the crossing. High on its facade sits the seated stone effigy of Holy Roman Emperor Charles IV. He looks directly across the cobblestone square toward a 16th-century Jesuit complex with an astronomical tower.”",
                taskPrompt: "Find the name of this vast historic building complex directly east across Knights of the Cross Square (Křižovnické náměstí).",
                inputPlaceholder: "Enter building or complex name...",
                targetQuestion: "What is the name of this historic complex?",
                acceptedAnswers: [
                    "clementinum", "klementinum", "national library", "clementinum astronomical tower", "klementinum library"
                ],
                coordinates: { lat: 50.0863, lng: 14.4160 },
                mapZoom: 17,
                hints: [
                    "It is one of the largest architectural complexes in Europe, home to the National Library of the Czech Republic.",
                    "Its name starts with 'C' (or 'K' in Czech) and it features a famous Baroque Library and Astronomical Tower.",
                    "Search directly east of the Old Town Bridge Tower on Google Maps: 'Clementinum'."
                ],
                smartFeedback: {
                    "old town square": "You are just 300 meters away! Look at the building directly bordering Křižovnická street before the square.",
                    "prague castle": "That is across the river to the west. Charles IV's statue at the eastern tower looks east towards the Clementinum."
                },
                verificationStory: "Spot on! Viktor ducked into the **Clementinum (Klementinum)**, home to Kepler's astronomical observations and the Baroque National Library."
            },
            {
                clueNumber: 3,
                title: "The Astronomical Dial & The Final Handoff",
                evidenceType: "Encrypted Note on Ticket Stub",
                clueText: "“From the Clementinum, he took the narrow Karlova alley east to the heartbeat of the Old Town. He slipped behind the crowd gathered at the top of the hour to watch the 12 Apostles mechanical march on the world's oldest operating astronomical clock.”",
                taskPrompt: "What is the exact name of this legendary medieval clock mounted on the Old Town City Hall?",
                inputPlaceholder: "Name the clock...",
                targetQuestion: "What is the name of this astronomical clock?",
                acceptedAnswers: [
                    "orloj", "prague orloj", "prague astronomical clock", "prazsky orloj", "astronomical clock"
                ],
                coordinates: { lat: 50.0870, lng: 14.4207 },
                mapZoom: 18,
                hints: [
                    "It was first installed in the year 1410 by clockmaker Mikuláš of Kadaň.",
                    "In Czech, this mechanical wonder is known by a single word: 'Orloj'.",
                    "Search in Prague's Old Town Square for the 'Prague Astronomical Clock' (Orloj)."
                ],
                smartFeedback: {
                    "church of our lady before tyn": "Very close! The clock is across the square on the southern wall of the Old Town Hall.",
                    "jan hus": "The Jan Hus memorial is in the center of the square; the clock is on the City Hall tower wall."
                },
                verificationStory: "Confirmed! Viktor reached the **Prague Orloj (Pražský Orloj)** just as the skeleton chimed the hour."
            },
            {
                clueNumber: 4,
                title: "The Dead Drop: The Golden Street",
                evidenceType: "Recovered Memory Card Fragment",
                clueText: "“FINAL ENTRY: The package isn't in Old Town. I crossed back beneath the castle walls into the castle district (Hradčany). Hidden inside House No. 22 along the tiny, legendary street where 16th-century alchemists and later Franz Kafka wrote... behind the blue facade.”",
                taskPrompt: "What is the name of this famous, colorful historic lane nestled inside the Prague Castle complex?",
                inputPlaceholder: "Name the street or lane...",
                targetQuestion: "What is the name of this street?",
                acceptedAnswers: [
                    "golden lane", "zlatá ulička", "zlata ulicka", "golden alley", "golden street", "alchemists lane"
                ],
                coordinates: { lat: 50.0920, lng: 14.4042 },
                mapZoom: 18,
                hints: [
                    "It is a tiny lane of miniature pastel houses built into the northern fortification wall of Prague Castle.",
                    "Its name comes from the goldsmiths (and legendary alchemists) who lived there in the 16th century.",
                    "Search inside Prague Castle on Google Maps: 'Golden Lane' (Zlatá ulička)."
                ],
                smartFeedback: {
                    "nerudova": "Nerudova is the picturesque street leading up to the castle, but this lane is tucked inside the castle walls itself.",
                    "st vitus": "St. Vitus Cathedral is in the central courtyard; head to the northeast corner of the castle grounds."
                },
                verificationStory: "CASE SOLVED! Viktor concealed his camera and field notes inside **House #22 on Golden Lane (Zlatá ulička)** within Prague Castle, securing his evidence against rogue syndicates!"
            }
        ],
        revealChain: [
            { step: "Target City", name: "Prague (Praha)", country: "Czech Republic", icon: "🏙️" },
            { step: "Crossing Point", name: "Charles Bridge (Karlův Most)", country: "Vltava River", icon: "🌉" },
            { step: "Intel Archive", name: "The Clementinum Complex", country: "Old Town Border", icon: "📚" },
            { step: "Rendezvous Point", name: "Prague Orloj (Astronomical Clock)", country: "Old Town Square", icon: "⏰" },
            { step: "Final Vault", name: "House #22, Golden Lane (Zlatá ulička)", country: "Prague Castle", icon: "🗝️" }
        ],
        debrief: "Viktor Vance used the historical geography of Prague's royal coronation route (the Royal Way) in reverse to evade surveillance. By moving from the Charles Bridge through the Clementinum and Old Town Square back up to the Golden Lane in Prague Castle, every waypoint corresponded to an astronomical landmark built during the reign of Emperor Charles IV."
    },
    {
        id: "case-024",
        caseNumber: "CASE #024",
        title: "The Watchmaker's Vault",
        category: "Missing Object & Heist",
        typeBadge: "🕵️ Missing Object",
        difficulty: "Normal",
        timeEst: "10-15 min",
        locationRegion: "Central Europe",
        tagline: "A master mechanical chronometer built for a 19th-century monarch vanished. A trail of statues and architectural inscriptions holds the combination.",
        briefing: "In 1848, the master horologist László created a perpetual movement watch. Stolen from a private museum last week, the thief left a cryptic transmission stating: 'Only someone who can read the stone eyes across the twin cities of the Danube will find the vault before the spring unwinds.'",
        targetLocationName: "Budapest, Hungary",
        initialCenter: [47.4979, 19.0402],
        initialZoom: 13,
        clues: [
            {
                clueNumber: 1,
                title: "The Twin Cities & The First Suspension",
                evidenceType: "Antique Postcard",
                clueText: "“I started in the grand capital born from the union of two hilly and flat cities on opposite banks of the blue Danube. Stand where the massive cast-iron lions without tongues guard Europe's first permanent suspension bridge.”",
                taskPrompt: "Name the city and the iconic 1849 suspension bridge guarded by the four stone lions.",
                inputPlaceholder: "City or Bridge name...",
                targetQuestion: "What is the capital city?",
                acceptedAnswers: [
                    "budapest", "chain bridge", "szechenyi chain bridge", "széchenyi lánchíd", "lanchid", "hungary"
                ],
                coordinates: { lat: 47.4990, lng: 19.0437 },
                mapZoom: 15,
                hints: [
                    "The capital of Hungary, formed by uniting Buda and Pest.",
                    "The bridge is named after Count István Széchenyi.",
                    "Search in Google Maps: Széchenyi Chain Bridge in Budapest."
                ],
                smartFeedback: {
                    "vienna": "Vienna is on the Danube, but it wasn't formed from the union of Buda and Pest!",
                    "belgrade": "You are too far south along the Danube. Look at Hungary's capital."
                },
                verificationStory: "Spot on! You arrived at the **Széchenyi Chain Bridge (Széchenyi Lánchíd)** in **Budapest, Hungary**."
            },
            {
                clueNumber: 2,
                title: "The Great Dome & The Holy Right Hand",
                evidenceType: "Torn Notebook Page",
                clueText: "“From the eastern bridgehead in Pest, walk straight east along Zrínyi street toward the colossal neoclassical dome that stands exactly 96 meters high — matched in height only by the Hungarian Parliament. Inside lies the mummified right hand of the nation's first king.”",
                taskPrompt: "What is the name of this grand co-cathedral basilica?",
                inputPlaceholder: "Enter the basilica name...",
                targetQuestion: "What is the name of this basilica?",
                acceptedAnswers: [
                    "st stephen's basilica", "st stephen basilica", "saint stephen's basilica", "szent istvan bazilika", "szent istván bazilika", "st. stephen's basilica"
                ],
                coordinates: { lat: 47.5009, lng: 19.0540 },
                mapZoom: 17,
                hints: [
                    "Named in honor of Stephen I, the first King of Hungary.",
                    "Located in District V of Budapest on Szent István tér.",
                    "Search on Google Maps: 'St. Stephen's Basilica, Budapest'."
                ],
                smartFeedback: {
                    "hungarian parliament": "The Parliament also stands 96m high, but this building is a basilica containing the Holy Right Hand relic.",
                    "matthias church": "Matthias Church is across the river in Buda Castle hill. This clue is east in Pest."
                },
                verificationStory: "Deduction verified! You reached **St. Stephen's Basilica (Szent István-bazilika)** on the Pest side."
            },
            {
                clueNumber: 3,
                title: "The Overlook of the Fisherman",
                evidenceType: "Decoded Telegram",
                clueText: "“Cross back over the Danube and climb the Castle Hill. Stand upon the white fairytale neo-Romanesque ramparts featuring seven conical towers, representing the seven Magyar tribes who settled the Carpathian Basin in 895.”",
                taskPrompt: "What is the name of this panoramic terrace and architectural fortress overlook?",
                inputPlaceholder: "Name the landmark...",
                targetQuestion: "What is the name of this terrace?",
                acceptedAnswers: [
                    "fisherman's bastion", "fishermans bastion", "halászbástya", "halaszbastya", "fisherman bastion"
                ],
                coordinates: { lat: 47.5019, lng: 19.0349 },
                mapZoom: 17,
                hints: [
                    "Located right next to Matthias Church on Buda Castle hill.",
                    "Named after the guild of fishermen who were responsible for defending this stretch of the city walls in the Middle Ages.",
                    "Search in Google Maps: 'Fisherman's Bastion'."
                ],
                smartFeedback: {
                    "buda castle": "Very close! Fisherman's Bastion is just north of the Royal Palace along the castle ridge."
                },
                verificationStory: "Remarkable! You climbed to the terrace of **Fisherman's Bastion (Halászbástya)** with an unobstructed view of the Danube and Parliament."
            },
            {
                clueNumber: 4,
                title: "The Subterranean Labyrinth Vault",
                evidenceType: "Horologist Cipher",
                clueText: "“FINAL VAULT: Deep beneath the volcanic rock of Castle Hill lies a network of caves and cellars where Count Dracula was once imprisoned. The chronometer is locked inside the underground thermal fountain chamber.”",
                taskPrompt: "What is the name of this famous underground cave labyrinth beneath Buda Castle?",
                inputPlaceholder: "Enter the underground labyrinth name...",
                targetQuestion: "What is the name of this underground site?",
                acceptedAnswers: [
                    "labyrinth of buda castle", "buda castle labyrinth", "budavari labirintus", "budavári labirintus", "buda labyrinth", "the labyrinth"
                ],
                coordinates: { lat: 47.5002, lng: 19.0326 },
                mapZoom: 18,
                hints: [
                    "A complex of caves carved by geothermal waters beneath District I of Budapest.",
                    "Famous for its historical exhibits, wax museum, and 15th-century prison history of Vlad the Impaler.",
                    "Search on Google Maps: 'Labyrinth of Buda Castle'."
                ],
                smartFeedback: {
                    "hospital in the rock": "Hospital in the Rock is another famous underground bunker nearby! But the ancient cave complex where Dracula was held is the Buda Labyrinth."
                },
                verificationStory: "CASE SOLVED! The master chronometer was recovered from the stone vaults of the **Labyrinth of Buda Castle (Budavári Labirintus)** before the spring mechanisms could be tampered with!"
            }
        ],
        revealChain: [
            { step: "Starting Riverway", name: "Széchenyi Chain Bridge", country: "Budapest, Hungary", icon: "🌉" },
            { step: "Eastern Beacon", name: "St. Stephen's Basilica", country: "Pest Quarter", icon: "⛪" },
            { step: "Seven Towers Rampart", name: "Fisherman's Bastion (Halászbástya)", country: "Buda Hill", icon: "🏰" },
            { step: "Final Underground Vault", name: "Labyrinth of Buda Castle", country: "Subterranean Caves", icon: "⏳" }
        ],
        debrief: "The thief orchestrated the route around Budapest's dual nature: Pest (flat, civic, religious, trade) and Buda (rocky, fortress, underground thermal caverns). The 96-meter height parity between St. Stephen's Basilica and the Hungarian Parliament symbolizes the balance between church and state."
    },
    {
        id: "case-031",
        caseNumber: "CASE #031",
        title: "The Diplomat's Black Book",
        category: "Mystery Package & Courier",
        typeBadge: "📦 Mystery Package",
        difficulty: "Hard",
        timeEst: "15-20 min",
        locationRegion: "Southern Europe & Mediterranean",
        tagline: "A locked diplomatic dispatch bag was routed through three coastal merchant powers across the Adriatic. Intercept the courier before the drop.",
        briefing: "A rogue attaché smuggled an encrypted ledger containing offshore maritime transactions. Rather than taking air routes, the courier traveled along the ancient Venetian maritime trading routes (Stato da Màr), hiding clues on stone bridges and cloistered courtyards.",
        targetLocationName: "Venice, Italy",
        initialCenter: [45.4387, 12.3271],
        initialZoom: 13,
        clues: [
            {
                clueNumber: 1,
                title: "The City of 118 Islands",
                evidenceType: "Ferry Manifest",
                clueText: "“I stepped off the night train at Santa Lucia station. The streets here are paved with seawater. No cars, no wheels — only 400 footbridges connecting over a hundred marshland islands in a saltwater lagoon.”",
                taskPrompt: "Name this world-famous floating lagoon city in Northern Italy.",
                inputPlaceholder: "City name...",
                targetQuestion: "What is the city?",
                acceptedAnswers: [
                    "venice", "venezia", "venedig", "italy", "italia"
                ],
                coordinates: { lat: 45.4408, lng: 12.3155 },
                mapZoom: 14,
                hints: [
                    "Capital of the Veneto region in northeastern Italy.",
                    "Famous for its Grand Canal, gondolas, and St. Mark's Square.",
                    "Search on Google Maps: Venice, Italy."
                ],
                smartFeedback: {
                    "florence": "Florence is inland along the Arno river. This city is built in a lagoon with sea canals.",
                    "amsterdam": "Amsterdam has canals and bicycles, but Venice has NO cars and is in northern Italy."
                },
                verificationStory: "Confirmed! You followed the courier's trail straight into **Venice (Venezia), Italy**."
            },
            {
                clueNumber: 2,
                title: "The Oldest Stone Crossing on the Grand Canal",
                evidenceType: "Surveillance Photograph",
                clueText: "“The courier paused at the single-span stone arch bridge designed by Antonio da Ponte in 1591, lined with two rows of jeweler and souvenir shops. For centuries, it was the only permanent pedestrian crossing over the Grand Canal.”",
                taskPrompt: "What is the name of this world-renowned Renaissance stone bridge?",
                inputPlaceholder: "Name the bridge...",
                targetQuestion: "What is the name of this bridge?",
                acceptedAnswers: [
                    "rialto bridge", "ponte di rialto", "rialto", "bridge of rialto"
                ],
                coordinates: { lat: 45.4380, lng: 12.3359 },
                mapZoom: 17,
                hints: [
                    "It connects the sestieri (districts) of San Marco and San Polo.",
                    "Famous for the nearby Rialto food and fish markets.",
                    "Search on Google Maps: 'Rialto Bridge, Venice'."
                ],
                smartFeedback: {
                    "bridge of sighs": "Bridge of Sighs is enclosed and connects the Doge's Palace to the prison. This bridge is the main commercial crossing over the Grand Canal.",
                    "accademia bridge": "The Accademia Bridge is made of wood/steel further south. The 1591 stone bridge is Rialto."
                },
                verificationStory: "Clear visual! You caught the courier passing over the **Rialto Bridge (Ponte di Rialto)**."
            },
            {
                clueNumber: 3,
                title: "The Palace of the Doges & The Lions' Mouths",
                evidenceType: "Intercepted Telegraphic Cipher",
                clueText: "“He walked south into Piazza San Marco, entering the Gothic palace of the supreme authority of the former Republic. He slipped a coded token into the 'Bocca di Leone' (Lion's Mouth) stone letterbox once used for anonymous denunciations of state treason.”",
                taskPrompt: "Name this historic seat of Venetian government and residence of the Doge.",
                inputPlaceholder: "Enter palace name...",
                targetQuestion: "What is the name of this palace?",
                acceptedAnswers: [
                    "doge's palace", "doges palace", "palazzo ducale", "doge palace", "ducal palace"
                ],
                coordinates: { lat: 45.4340, lng: 12.3400 },
                mapZoom: 18,
                hints: [
                    "Located on the waterfront of St. Mark's Basin, adjacent to St. Mark's Basilica.",
                    "Known in Italian as Palazzo Ducale.",
                    "Search on Google Maps: 'Doge's Palace, Venice'."
                ],
                smartFeedback: {
                    "st mark's basilica": "The basilica is right next door, but the government palace of the rulers is the Doge's Palace."
                },
                verificationStory: "Interception successful! The courier left the token at the **Doge's Palace (Palazzo Ducale)**."
            },
            {
                clueNumber: 4,
                title: "The Spiral Staircase of the Snail",
                evidenceType: "Field Audio Transcription",
                clueText: "“FINAL DROP: Meet in the hidden courtyard of a Gothic-Renaissance palazzo tucked deep within the alleys of San Marco. Look for the famous external multi-arch spiral staircase shaped like a snail shell (bóvolo in Venetian dialect).”",
                taskPrompt: "What is the name of this unique spiral staircase palazzo?",
                inputPlaceholder: "Palazzo name...",
                targetQuestion: "What is the name of this palazzo?",
                acceptedAnswers: [
                    "scala contarini del bovolo", "palazzo contarini del bovolo", "scala del bovolo", "contarini del bovolo", "bovolo staircase"
                ],
                coordinates: { lat: 45.4352, lng: 12.3347 },
                mapZoom: 18,
                hints: [
                    "Built in 1499 for Pietro Contarini, featuring cylindrical tower arches.",
                    "'Bovolo' means snail in the Venetian language.",
                    "Search on Google Maps: 'Scala Contarini del Bovolo'."
                ],
                smartFeedback: {
                    "ca doro": "Ca' d'Oro is on the Grand Canal. This palazzo is hidden inside a quiet inner alley (Corte dei Risi) near Campo Manin."
                },
                verificationStory: "CASE SOLVED! The Diplomatic Black Book was seized on the top tier of the **Scala Contarini del Bovolo**, preserving state intelligence!"
            }
        ],
        revealChain: [
            { step: "Lagoon City", name: "Venice (Venezia)", country: "Veneto, Italy", icon: "🛶" },
            { step: "Grand Canal Crossing", name: "Rialto Bridge (Ponte di Rialto)", country: "San Polo / San Marco", icon: "🌉" },
            { step: "State Archive Drop", name: "Doge's Palace (Palazzo Ducale)", country: "Piazza San Marco", icon: "🏛️" },
            { step: "Final Snail Spiral Drop", name: "Scala Contarini del Bovolo", country: "Hidden Courtyard", icon: "🐚" }
        ],
        debrief: "The courier utilized the labyrinthine pedestrian geometry of Venice where GPS satellite signals frequently bounce off tall stone alleyway facades (calle), making optical geolocation and architectural wayfinding the only reliable tracking method."
    },
    {
        id: "case-042",
        caseNumber: "CASE #042",
        title: "The Alchemist's Bone Chapel",
        category: "Historical Mystery",
        typeBadge: "🏛️ Historical Mystery",
        difficulty: "Hard",
        timeEst: "15-20 min",
        locationRegion: "Bohemia, Central Europe",
        tagline: "An 18th-century ledger containing lost metallurgical formulas points to a legendary chapel decorated with the bones of 40,000 people.",
        briefing: "Historians studying medieval silver mining towns discovered references to a subterranean crypt where an alchemist hid his master manuscripts during the Hussite Wars. Every clue is encoded in the history of silver, soil, and skeletal architecture.",
        targetLocationName: "Kutná Hora, Czech Republic",
        initialCenter: [49.9524, 15.2687],
        initialZoom: 13,
        clues: [
            {
                clueNumber: 1,
                title: "The Silver Capital of Bohemia",
                evidenceType: "Medieval Mining Map",
                clueText: "“Travel 70 km east of Prague to the historic boomtown whose silver mines produced the famous Prague Groschen coins and funded the Bohemian Kingdom. Look for the Gothic Cathedral dedicated to Saint Barbara, patron saint of miners.”",
                taskPrompt: "Name this historic UNESCO World Heritage town in the Central Bohemian Region.",
                inputPlaceholder: "Enter town name...",
                targetQuestion: "What is the town?",
                acceptedAnswers: [
                    "kutna hora", "kutná hora", "kuttenberg", "czech republic"
                ],
                coordinates: { lat: 49.9524, lng: 15.2687 },
                mapZoom: 14,
                hints: [
                    "A famous silver mining center that once rivaled Prague in wealth and prestige.",
                    "Home to St. Barbara's Church with its distinctive tent-like roof spires.",
                    "Search in Google Maps: 'Kutná Hora'."
                ],
                smartFeedback: {
                    "cesky krumlov": "Český Krumlov is in Southern Bohemia along the Vltava. This silver mining town is east of Prague.",
                    "plzen": "Plzeň is famous for beer in Western Bohemia. Look east for the historic silver town."
                },
                verificationStory: "Coordinates locked! You reached the historic silver city of **Kutná Hora**."
            },
            {
                clueNumber: 2,
                title: "The Cathedral of the Miners",
                evidenceType: "Architectural Drawing",
                clueText: "“In the southwest corner of Kutná Hora stands a spectacular late-Gothic cathedral featuring flying buttresses, dramatic triple-tented roofs resembling miner's tents, and medieval frescoes showing silver coin minting.”",
                taskPrompt: "What is the name of this cathedral dedicated to the patron saint of miners?",
                inputPlaceholder: "Cathedral name...",
                targetQuestion: "What is the name of this church?",
                acceptedAnswers: [
                    "st barbara's church", "st barbara", "st. barbara's church", "church of st barbara", "chrám svaté barbory", "saint barbara"
                ],
                coordinates: { lat: 49.9448, lng: 15.2636 },
                mapZoom: 17,
                hints: [
                    "Dedicated to Saint Barbara, protector against sudden death and patron of miners and artillerymen.",
                    "Its Czech name is Chrám svaté Barbory.",
                    "Search on Google Maps: 'St Barbara's Church, Kutná Hora'."
                ],
                smartFeedback: {
                    "sedlec": "Sedlec is in the northern suburb of the town. St. Barbara's is in the south overlooking the Vrchlice river valley."
                },
                verificationStory: "Identified! You traced the first landmark to **St. Barbara's Church (Chrám svaté Barbory)**."
            },
            {
                clueNumber: 3,
                title: "The Chandelier of Human Bones",
                evidenceType: "Alchemical Journal Excerpt",
                clueText: "“FINAL VAULT: Proceed north to the Sedlec suburb. Enter the Roman Catholic chapel beneath the Cemetery Church of All Saints. Look up at the massive chandelier containing at least one of every human bone, decorated by woodcarver František Rint in 1870.”",
                taskPrompt: "What is the world-famous name of this skeletal ossuary chapel?",
                inputPlaceholder: "Enter ossuary name...",
                targetQuestion: "What is the name of this ossuary?",
                acceptedAnswers: [
                    "sedlec ossuary", "sedlec bone church", "kostnice sedlec", "sedlec", "the bone church", "sedlec ossuary bone church"
                ],
                coordinates: { lat: 49.9618, lng: 15.2882 },
                mapZoom: 18,
                hints: [
                    "An ossuary containing the artistic arrangement of skeletons from over 40,000 individuals.",
                    "Known worldwide as the 'Bone Church' or 'Sedlec Ossuary'.",
                    "Search in Google Maps: 'Sedlec Ossuary'."
                ],
                smartFeedback: {
                    "kutna hora cemetery": "You're at the right site! The specific underground chapel is the Sedlec Ossuary."
                },
                verificationStory: "CASE SOLVED! The alchemist's silver ledger was recovered behind the bone coat of arms in the **Sedlec Ossuary (Kostnice v Sedlci)**!"
            }
        ],
        revealChain: [
            { step: "Silver Town", name: "Kutná Hora", country: "Bohemia, Czechia", icon: "⛏️" },
            { step: "Miners' Sanctuary", name: "St. Barbara's Church", country: "Vrchlice Overlook", icon: "⛪" },
            { step: "Final Bone Crypt", name: "Sedlec Ossuary (Kostnice)", country: "All Saints Cemetery", icon: "💀" }
        ],
        debrief: "During the 13th century, an abbot returned to Sedlec from Jerusalem with a jar of holy soil from Golgotha and scattered it over the cemetery, making it one of Central Europe's most sought-after burial sites. When the cemetery overflowed following the Black Death, the bones were gathered and fashioned into profound memento mori artwork."
    },
    {
        id: "case-055",
        caseNumber: "CASE #055",
        title: "The Pillars of the Sunken Beacon",
        category: "Treasure Hunt",
        typeBadge: "🔐 Treasure Hunt",
        difficulty: "Hard",
        timeEst: "15-20 min",
        locationRegion: "Mediterranean & North Africa",
        tagline: "Decode the coordinates of the ancient Seven Wonders to locate a sunken maritime chest.",
        briefing: "Maritime archeologists deciphered a Ptolemaic navigation slate. The slate links the gateway of the Atlantic Ocean with the legendary lost lighthouse that guarded the harbor of Alexander the Great's Egyptian capital.",
        targetLocationName: "Alexandria, Egypt",
        initialCenter: [31.2156, 29.8856],
        initialZoom: 13,
        clues: [
            {
                clueNumber: 1,
                title: "The Western Pillar of Hercules",
                evidenceType: "Ancient Geographer's Chart",
                clueText: "“Start at the monolithic limestone promontory guarding the European side of the Strait of Gibraltar, where the Mediterranean Sea meets the Atlantic Ocean. A British Overseas Territory famous for its Barbary macaques.”",
                taskPrompt: "Name this iconic monolithic promontory and territory.",
                inputPlaceholder: "Name the rock or territory...",
                targetQuestion: "What is this location?",
                acceptedAnswers: [
                    "gibraltar", "rock of gibraltar", "the rock of gibraltar"
                ],
                coordinates: { lat: 36.1408, lng: -5.3536 },
                mapZoom: 14,
                hints: [
                    "Known in antiquity as Mons Calpe, one of the two Pillars of Hercules.",
                    "Located on the southern tip of the Iberian Peninsula.",
                    "Search on Google Maps: 'Rock of Gibraltar'."
                ],
                smartFeedback: {
                    "ceuta": "Ceuta is on the African side across the strait (Abila). This clue describes the European Rock with the Barbary macaques.",
                    "tangier": "Tangier is in Morocco. Look directly across to Gibraltar."
                },
                verificationStory: "Waypoint locked! You established the western anchor at the **Rock of Gibraltar**."
            },
            {
                clueNumber: 2,
                title: "The City of Alexander & The Ancient Harbor",
                evidenceType: "Ptolemaic Maritime Papyrus",
                clueText: "“Sail 3,000 km east along the North African coast to the Egyptian port city founded in 331 BC by Alexander the Great, home to the Great Library and the ancient Pharos.”",
                taskPrompt: "Name this major historic port city on the Nile Delta coast.",
                inputPlaceholder: "City name...",
                targetQuestion: "What is the city?",
                acceptedAnswers: [
                    "alexandria", "al-iskandariyya", "iskandariya", "egypt"
                ],
                coordinates: { lat: 31.2001, lng: 29.9187 },
                mapZoom: 13,
                hints: [
                    "Egypt's second-largest city and primary Mediterranean seaport.",
                    "Founded by Alexander the Great and home to Queen Cleopatra.",
                    "Search on Google Maps: 'Alexandria, Egypt'."
                ],
                smartFeedback: {
                    "cairo": "Cairo is inland along the Nile. This is the Mediterranean port city named after its Macedonian founder.",
                    "port said": "Port Said is at the Suez Canal entrance. Alexandria is further west on the Delta."
                },
                verificationStory: "Vector matched! You arrived in **Alexandria, Egypt**."
            },
            {
                clueNumber: 3,
                title: "The Citadel on the Ruins of Pharos",
                evidenceType: "Sonar Imaging Log",
                clueText: "“FINAL VAULT: Go to the eastern tip of Pharos Island. Stand at the 15th-century defensive fortress built by Sultan Qaitbay using the very stone blocks of the fallen Lighthouse of Alexandria.”",
                taskPrompt: "What is the name of this famous sea-facing defensive fortress?",
                inputPlaceholder: "Name the citadel or fortress...",
                targetQuestion: "What is the name of this fortress?",
                acceptedAnswers: [
                    "citadel of qaitbay", "qaitbay citadel", "fort qaitbay", "citadel qaitbay", "qaitbay"
                ],
                coordinates: { lat: 31.2141, lng: 29.8856 },
                mapZoom: 17,
                hints: [
                    "Built in 1477 AD by Mamluk Sultan Al-Ashraf Sayf al-Din Qa'it Bay.",
                    "Erected on the exact spot of the destroyed ancient Lighthouse of Alexandria (Pharos).",
                    "Search on Google Maps: 'Citadel of Qaitbay'."
                ],
                smartFeedback: {
                    "bibliotheca alexandrina": "The modern library is along the Corniche to the east. The fortress on Pharos island is the Citadel of Qaitbay."
                },
                verificationStory: "CASE SOLVED! The sunken treasure chest was recovered from the underwater ruins beneath the outer bastion of the **Citadel of Qaitbay (قلعة قايtbay)**!"
            }
        ],
        revealChain: [
            { step: "Western Pillar", name: "Rock of Gibraltar", country: "Strait of Gibraltar", icon: "⛰️" },
            { step: "Ancient Port", name: "Alexandria", country: "Nile Delta, Egypt", icon: "🏛️" },
            { step: "Final Sunken Beacon", name: "Citadel of Qaitbay (Pharos Ruins)", country: "Eastern Harbor", icon: "⚓" }
        ],
        debrief: "The Lighthouse of Alexandria stood over 100 meters tall and survived numerous earthquakes until falling in the 14th century. In 1477, Sultan Qaitbay used the massive fallen granite and limestone blocks of the Pharos to build his fortress walls."
    },
    {
        id: "case-078",
        caseNumber: "CASE #078",
        title: "The City of Three Flags",
        category: "Time Travel & History",
        typeBadge: "⏳ Time Travel",
        difficulty: "Normal",
        timeEst: "10-15 min",
        locationRegion: "Franco-German Border",
        tagline: "Track a secret diary across a border city that shifted nationality four times between 1870 and 1945 without moving an inch.",
        briefing: "In 1918, an archivist hid a bilingual ledger documenting cultural cross-border exchanges. The clues in the diary only make sense when comparing French and German names of landmarks in the Alsatian capital.",
        targetLocationName: "Strasbourg, France",
        initialCenter: [48.5734, 7.7521],
        initialZoom: 13,
        clues: [
            {
                clueNumber: 1,
                title: "The Capital of Alsace & The Grand Île",
                evidenceType: "Bilingual Historical Diary Entry",
                clueText: "“I write from the island city embraced by the arms of the Ill river, home to the European Parliament, where timber-framed houses bear both French and German street signs.”",
                taskPrompt: "Name this historic capital of Alsace on the border of France and Germany.",
                inputPlaceholder: "City name...",
                targetQuestion: "What is the city?",
                acceptedAnswers: [
                    "strasbourg", "strassburg", "straßburg", "france"
                ],
                coordinates: { lat: 48.5734, lng: 7.7521 },
                mapZoom: 14,
                hints: [
                    "The official seat of the European Parliament and capital of the Grand Est region.",
                    "Known for its historic Grande Île and picturesque Petite France district.",
                    "Search on Google Maps: 'Strasbourg'."
                ],
                smartFeedback: {
                    "colmar": "Colmar is a beautiful Alsatian town 70 km south! But this city is the capital and home to the European Parliament.",
                    "metz": "Metz is in Lorraine. Look at the capital of Alsace along the Rhine border."
                },
                verificationStory: "Dossier confirmed! You identified the border crossroads city of **Strasbourg (Straßburg)**."
            },
            {
                clueNumber: 2,
                title: "The Pink Sandstone Giant & The Astronomical Clock",
                evidenceType: "Postcard with French/German Stamp",
                clueText: "“Stand before the towering single-spired Gothic cathedral constructed from reddish-pink sandstone quarried in the Vosges mountains. For 227 years (1647 to 1874), its 142-meter spire made it the world's tallest building.”",
                taskPrompt: "What is the name of this cathedral?",
                inputPlaceholder: "Cathedral name...",
                targetQuestion: "What is the name of this cathedral?",
                acceptedAnswers: [
                    "strasbourg cathedral", "cathedrale notre dame de strasbourg", "cathédrale notre-dame de strasbourg", "notre dame de strasbourg", "strasbourg minster", "straßburger münster"
                ],
                coordinates: { lat: 48.5818, lng: 7.7509 },
                mapZoom: 17,
                hints: [
                    "Dedicated to Notre-Dame, celebrated by Victor Hugo as a 'gigantic and delicate marvel'.",
                    "Famous for its internal 18-meter Renaissance Astronomical Clock.",
                    "Search on Google Maps: 'Strasbourg Cathedral'."
                ],
                smartFeedback: {
                    "notre dame de paris": "Paris is in Île-de-France. This is the single-spired pink sandstone cathedral in Strasbourg."
                },
                verificationStory: "Confirmed! You arrived at **Strasbourg Cathedral (Cathédrale Notre-Dame de Strasbourg)**."
            },
            {
                clueNumber: 3,
                title: "The Covered Bridges of the Leather Tanners",
                evidenceType: "Archivist's Handwritten Map",
                clueText: "“FINAL VAULT: Walk west to the district of the tanners and millers (Petite France). Cross the defensive bridge system with three fortified 14th-century towers spanning the four channels of the river Ill.”",
                taskPrompt: "What is the French name of these historic fortified covered bridges?",
                inputPlaceholder: "Enter bridge name in French or English...",
                targetQuestion: "What is the name of these bridges?",
                acceptedAnswers: [
                    "ponts couverts", "ponts couverts de strasbourg", "covered bridges", "ponts couverts de strasbourg", "gedecke brucken"
                ],
                coordinates: { lat: 48.5800, lng: 7.7391 },
                mapZoom: 18,
                hints: [
                    "In French, it translates literally to 'Covered Bridges', although the wooden roofs were removed in 1784.",
                    "Located immediately upstream of the Vauban Dam (Barrage Vauban).",
                    "Search on Google Maps: 'Ponts Couverts, Strasbourg'."
                ],
                smartFeedback: {
                    "barrage vauban": "The Barrage Vauban is just a few steps downstream with the rooftop terrace! These are the three stone towers and bridges directly connecting Petite France: Ponts Couverts."
                },
                verificationStory: "CASE SOLVED! The bilingual historical ledger was retrieved from the base of the Heinrich Tower at the **Ponts Couverts**!"
            }
        ],
        revealChain: [
            { step: "Border Crossroad", name: "Strasbourg", country: "Alsace, France", icon: "🇪🇺" },
            { step: "Pink Sandstone Spire", name: "Strasbourg Cathedral", country: "Grande Île", icon: "⛪" },
            { step: "Final Tanners' Bastion", name: "Ponts Couverts (Petite France)", country: "Ill River Channels", icon: "🌉" }
        ],
        debrief: "Alsace has a unique Franco-German hybrid culture. Strasbourg changed sovereignty between France and Germany in 1681, 1871, 1918, 1940, and 1944. Its dialect, architecture, culinary traditions, and street names reflect this rich multi-layered heritage."
    },
    {
        id: "case-063",
        caseNumber: "CASE #063",
        title: "The Three Witnesses of Kyoto",
        category: "The Liar & Verification",
        typeBadge: "🧩 The Liar",
        difficulty: "Hard",
        timeEst: "15-20 min",
        locationRegion: "East Asia (Japan)",
        tagline: "Three antique dealers gave conflicting statements about where a stolen Edo period woodblock print was passed. Cross-reference real-world landmarks to catch the liar.",
        briefing: "A masterpiece Hokusai woodblock print vanished from a Kansai gallery. Three suspects were questioned. One claims they were under thousands of bright vermilion torii gates; another claims they were on a massive wooden temple stage with zero nails overlooking cherry trees; the third claims they were next to a pavilion covered entirely in pure gold leaf. Only two witnesses told the geographical truth.",
        targetLocationName: "Kyoto, Japan",
        initialCenter: [34.9949, 135.7850],
        initialZoom: 13,
        clues: [
            {
                clueNumber: 1,
                title: "The Imperial City of Ten Thousand Shrines",
                evidenceType: "Train Pass & Geolocation Ping",
                clueText: "“All three witnesses boarded the Shinkansen bullet train to Japan's ancient imperial capital for over a millennium (794 to 1868), home to 17 UNESCO Historic Monuments.”",
                taskPrompt: "Name this historic Japanese cultural capital.",
                inputPlaceholder: "City name...",
                targetQuestion: "What is the city?",
                acceptedAnswers: [
                    "kyoto", "kyōto", "japan", "nippon"
                ],
                coordinates: { lat: 35.0116, lng: 135.7681 },
                mapZoom: 13,
                hints: [
                    "Former capital of Japan before Tokyo.",
                    "Famous for Gion, geishas, zen gardens, and thousands of wooden temples.",
                    "Search on Google Maps: 'Kyoto, Japan'."
                ],
                smartFeedback: {
                    "tokyo": "Tokyo is the modern capital in Kanto. This is the ancient millennium capital in Kansai.",
                    "osaka": "Osaka is nearby, famous for street food and merchant culture, but Kyoto is the imperial city of shrines."
                },
                verificationStory: "Confirmed! The investigation converges on **Kyoto (京都), Japan**."
            },
            {
                clueNumber: 2,
                title: "Witness A: The Ten Thousand Vermilion Gates",
                evidenceType: "Witness Statement & Photo Timestamp",
                clueText: "“Witness A claims: 'I walked through the Senbon Torii — thousands of vibrant orange-red wooden gates winding up the sacred mountain dedicated to Inari, the Shinto god of rice and foxes.'”",
                taskPrompt: "What is the name of this famous head Shinto shrine in southern Kyoto?",
                inputPlaceholder: "Shrine name...",
                targetQuestion: "What is the name of this shrine?",
                acceptedAnswers: [
                    "fushimi inari", "fushimi inari taisha", "fushimi inari-taisha", "fushimi inari shrine"
                ],
                coordinates: { lat: 34.9671, lng: 135.7727 },
                mapZoom: 16,
                hints: [
                    "Famous for its mountain paths shaded by over 10,000 torii gates and stone fox (kitsune) statues.",
                    "Located in Fushimi ward of Kyoto.",
                    "Search on Google Maps: 'Fushimi Inari-taisha'."
                ],
                smartFeedback: {
                    "yasaka shrine": "Yasaka Shrine is in Gion. The shrine with thousands of vermilion gates climbing Mount Inari is Fushimi Inari."
                },
                verificationStory: "Witness A's location verified: **Fushimi Inari-Taisha (伏見稲荷大社)**."
            },
            {
                clueNumber: 3,
                title: "Witness B & C: The Golden Pavilion vs The Pure Water Stage",
                evidenceType: "Security Recon Cam",
                clueText: "“FINAL INVESTIGATION: The surveillance camera proved the exchange happened at the wooden temple perched on the slopes of Mount Otowa, where visitors drink from the Otowa Waterfall for health and longevity, walking across the massive cliffside wooden stage constructed without a single nail.”",
                taskPrompt: "What is the name of this legendary Buddhist temple on Mount Otowa?",
                inputPlaceholder: "Temple name...",
                targetQuestion: "What is the name of this temple?",
                acceptedAnswers: [
                    "kiyomizu-dera", "kiyomizudera", "kiyomizu dera", "kiyomizu temple", "otowasan kiyomizudera"
                ],
                coordinates: { lat: 34.9949, lng: 135.7850 },
                mapZoom: 18,
                hints: [
                    "Its name translates literally to 'Pure Water Temple'.",
                    "Famous for the Japanese expression 'to jump off the stage at Kiyomizu' (taking the plunge).",
                    "Search on Google Maps: 'Kiyomizu-dera, Kyoto'."
                ],
                smartFeedback: {
                    "kinkaku-ji": "Kinkaku-ji is the Golden Pavilion in northern Kyoto (Witness C was lying about being there!). The wooden stage temple with the pure water spring is Kiyomizu-dera."
                },
                verificationStory: "CASE SOLVED! The print was recovered near the three-stream spring beneath the main stage of **Kiyomizu-dera (清水寺)**! Witness C was exposed as the accomplice."
            }
        ],
        revealChain: [
            { step: "Imperial Nexus", name: "Kyoto", country: "Kansai, Japan", icon: "⛩️" },
            { step: "Witness A Verified", name: "Fushimi Inari-Taisha", country: "Vermilion Gates", icon: "🦊" },
            { step: "True Hand-off Site", name: "Kiyomizu-dera (Pure Water)", country: "Mount Otowa Cliff Stage", icon: "🏛️" }
        ],
        debrief: "Kiyomizu-dera's main hall is supported by 139 massive zelkova pillars standing 13 meters tall, constructed using traditional Japanese joinery without a single metal nail. The pure spring water flowing from Mount Otowa has drawn pilgrims since the 8th century."
    }
];
