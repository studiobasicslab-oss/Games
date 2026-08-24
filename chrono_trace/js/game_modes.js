/**
 * ChronoTrace Game Modes Manager
 * Manages Daily Timeline Web, Causal Chains Campaign (12 Chapters),
 * and Fog of Time (Rogue-lite mode with Relics).
 */

class GameModesManager {
    constructor() {
        this.campaignChapters = this.initCampaignChapters();
    }

    /**
     * Handcrafted Historical Campaign Chapters
     */
    initCampaignChapters() {
        return [
            {
                id: 'chapter_1',
                title: 'Chapter I: The Dawn of Written Memory',
                subtitle: 'Ancient Mesopotamia to the Classical Greek Golden Age',
                era: 'ANCIENT',
                description: 'Weave humanity\'s first recorded words from Mesopotamian clay to the philosophical groves of Athens.',
                targetOrigin: 'cuneiform_writing',
                targetCulmination: 'parthenon_construction',
                customNodes: [
                    'cuneiform_writing',
                    'great_pyramid_giza',
                    'code_of_hammurabi',
                    'first_olympic_games',
                    'founding_of_rome',
                    'roman_republic_founded',
                    'battle_of_marathon',
                    'parthenon_construction',
                    'socrates_trial' // trap or fork
                ],
                customEdges: [
                    ['cuneiform_writing', 'great_pyramid_giza'],
                    ['cuneiform_writing', 'code_of_hammurabi'],
                    ['great_pyramid_giza', 'first_olympic_games'],
                    ['code_of_hammurabi', 'founding_of_rome'],
                    ['first_olympic_games', 'roman_republic_founded'],
                    ['founding_of_rome', 'battle_of_marathon'],
                    ['roman_republic_founded', 'battle_of_marathon'],
                    ['battle_of_marathon', 'parthenon_construction'],
                    ['battle_of_marathon', 'socrates_trial'],
                    ['socrates_trial', 'parthenon_construction'] // paradox reverse edge!
                ],
                parTime: 45,
                starScores: [400, 700, 1000]
            },
            {
                id: 'chapter_2',
                title: 'Chapter II: The Hellenistic Sphere',
                subtitle: 'From the Socratic Academy to the Library of Alexandria',
                era: 'ANCIENT',
                description: 'Trace the lineage of ancient philosophy and empirical science as Greek thought spreads across Egypt and Asia.',
                targetOrigin: 'socrates_trial',
                targetCulmination: 'library_of_alexandria',
                customNodes: [
                    'socrates_trial',
                    'plato_academy',
                    'aristotle_lyceum',
                    'alexander_conquests',
                    'great_wall_qin',
                    'eratosthenes_earth_circumference',
                    'archimedes_principles',
                    'library_of_alexandria'
                ],
                customEdges: [
                    ['socrates_trial', 'plato_academy'],
                    ['plato_academy', 'aristotle_lyceum'],
                    ['aristotle_lyceum', 'alexander_conquests'],
                    ['alexander_conquests', 'library_of_alexandria'],
                    ['plato_academy', 'great_wall_qin'],
                    ['great_wall_qin', 'archimedes_principles'],
                    ['library_of_alexandria', 'eratosthenes_earth_circumference'],
                    ['eratosthenes_earth_circumference', 'archimedes_principles']
                ],
                parTime: 50,
                starScores: [450, 750, 1100]
            },
            {
                id: 'chapter_3',
                title: 'Chapter III: Imperial Colossus',
                subtitle: 'From the Roman Republic to the Fall of the West',
                era: 'ANCIENT',
                description: 'Navigate the rise of the Roman Empire, the Silk Road, and the final splintering of the Western frontier.',
                targetOrigin: 'roman_republic_founded',
                targetCulmination: 'fall_of_rome',
                customNodes: [
                    'roman_republic_founded',
                    'twelve_tables_rome',
                    'silk_road_opening',
                    'caesar_assassination',
                    'augustus_roman_empire',
                    'roman_colosseum',
                    'paper_invention_china',
                    'ptolemy_geocentrism',
                    'constantine_christianity',
                    'fall_of_rome'
                ],
                customEdges: [
                    ['roman_republic_founded', 'twelve_tables_rome'],
                    ['twelve_tables_rome', 'silk_road_opening'],
                    ['twelve_tables_rome', 'caesar_assassination'],
                    ['caesar_assassination', 'augustus_roman_empire'],
                    ['silk_road_opening', 'paper_invention_china'],
                    ['augustus_roman_empire', 'roman_colosseum'],
                    ['roman_colosseum', 'ptolemy_geocentrism'],
                    ['paper_invention_china', 'constantine_christianity'],
                    ['ptolemy_geocentrism', 'constantine_christianity'],
                    ['constantine_christianity', 'fall_of_rome']
                ],
                parTime: 60,
                starScores: [500, 850, 1200]
            },
            {
                id: 'chapter_4',
                title: 'Chapter IV: The Scholastic & Islamic Renaissance',
                subtitle: 'House of Wisdom to Medieval Universities',
                era: 'MEDIEVAL',
                description: 'Follow the preservation and expansion of scientific knowledge through Baghdad, Cordoba, and Bologna.',
                targetOrigin: 'justinian_code',
                targetCulmination: 'magna_carta',
                customNodes: [
                    'justinian_code',
                    'hagia_sophia_built',
                    'islamic_astrolabe',
                    'viking_lindisfarne',
                    'charlemagne_emperor',
                    'house_of_wisdom',
                    'alkhwarizmi_algebra',
                    'university_of_bologna',
                    'norman_conquest',
                    'first_crusade',
                    'fibonacci_liber_abaci',
                    'magna_carta'
                ],
                customEdges: [
                    ['justinian_code', 'hagia_sophia_built'],
                    ['justinian_code', 'viking_lindisfarne'],
                    ['hagia_sophia_built', 'islamic_astrolabe'],
                    ['islamic_astrolabe', 'alkhwarizmi_algebra'],
                    ['alkhwarizmi_algebra', 'house_of_wisdom'],
                    ['house_of_wisdom', 'fibonacci_liber_abaci'],
                    ['viking_lindisfarne', 'charlemagne_emperor'],
                    ['charlemagne_emperor', 'norman_conquest'],
                    ['norman_conquest', 'university_of_bologna'],
                    ['university_of_bologna', 'first_crusade'],
                    ['first_crusade', 'magna_carta'],
                    ['fibonacci_liber_abaci', 'magna_carta']
                ],
                parTime: 65,
                starScores: [600, 950, 1350]
            },
            {
                id: 'chapter_5',
                title: 'Chapter V: Silk & Shadows',
                subtitle: 'The Mongol Peace, Black Death, and the Fall of Byzantium',
                era: 'MEDIEVAL',
                description: 'Traverse the silk routes from Marco Polo\'s travels through the Great Plague to the siege of Constantinople.',
                targetOrigin: 'genghis_khan_unification',
                targetCulmination: 'fall_of_constantinople',
                customNodes: [
                    'genghis_khan_unification',
                    'magna_carta',
                    'marco_polo_travels',
                    'gunpowder_in_europe',
                    'black_death_europe',
                    'zheng_he_voyages',
                    'fall_of_constantinople'
                ],
                customEdges: [
                    ['genghis_khan_unification', 'magna_carta'],
                    ['genghis_khan_unification', 'marco_polo_travels'],
                    ['marco_polo_travels', 'gunpowder_in_europe'],
                    ['gunpowder_in_europe', 'black_death_europe'],
                    ['black_death_europe', 'zheng_he_voyages'],
                    ['zheng_he_voyages', 'fall_of_constantinople'],
                    ['black_death_europe', 'fall_of_constantinople']
                ],
                parTime: 50,
                starScores: [400, 750, 1100]
            },
            {
                id: 'chapter_6',
                title: 'Chapter VI: The Gutenberg Nexus',
                subtitle: 'The Movable Type Revolution & Oceanic Discovery',
                era: 'RENAISSANCE',
                description: 'The convergence of mass printed knowledge and transatlantic navigation that bridged the Old and New Worlds.',
                targetOrigin: 'gutenberg_printing_press',
                targetCulmination: 'magellan_circumnavigation',
                customNodes: [
                    'gutenberg_printing_press',
                    'columbus_voyage',
                    'treaty_of_tordesillas',
                    'da_gama_india',
                    'da_vinci_mona_lisa',
                    'michelangelo_sistine_chapel',
                    'luther_95_theses',
                    'fall_of_aztec_empire',
                    'magellan_circumnavigation'
                ],
                customEdges: [
                    ['gutenberg_printing_press', 'columbus_voyage'],
                    ['gutenberg_printing_press', 'da_vinci_mona_lisa'],
                    ['columbus_voyage', 'treaty_of_tordesillas'],
                    ['treaty_of_tordesillas', 'da_gama_india'],
                    ['da_vinci_mona_lisa', 'michelangelo_sistine_chapel'],
                    ['michelangelo_sistine_chapel', 'luther_95_theses'],
                    ['treaty_of_tordesillas', 'fall_of_aztec_empire'],
                    ['fall_of_aztec_empire', 'magellan_circumnavigation'],
                    ['luther_95_theses', 'magellan_circumnavigation']
                ],
                parTime: 55,
                starScores: [500, 850, 1250]
            },
            {
                id: 'chapter_7',
                title: 'Chapter VII: The Scientific Awakening',
                subtitle: 'From Copernican Heliocentrism to Newton\'s Principia',
                era: 'RENAISSANCE',
                description: 'Witness the foundational revolution of celestial mechanics, empirical telescopes, and universal gravitation.',
                targetOrigin: 'copernicus_heliocentrism',
                targetCulmination: 'newton_principia',
                customNodes: [
                    'copernicus_heliocentrism',
                    'vesalius_anatomy',
                    'gregorian_calendar',
                    'galileo_telescope',
                    'kepler_planetary_motion',
                    'harvey_blood_circulation',
                    'descartes_cogito',
                    'peace_of_westphalia',
                    'royal_society_founded',
                    'leeuwenhoek_microscope',
                    'newton_principia'
                ],
                customEdges: [
                    ['copernicus_heliocentrism', 'vesalius_anatomy'],
                    ['vesalius_anatomy', 'gregorian_calendar'],
                    ['gregorian_calendar', 'galileo_telescope'],
                    ['galileo_telescope', 'kepler_planetary_motion'],
                    ['kepler_planetary_motion', 'harvey_blood_circulation'],
                    ['harvey_blood_circulation', 'descartes_cogito'],
                    ['descartes_cogito', 'royal_society_founded'],
                    ['royal_society_founded', 'leeuwenhoek_microscope'],
                    ['leeuwenhoek_microscope', 'newton_principia'],
                    ['kepler_planetary_motion', 'newton_principia']
                ],
                parTime: 65,
                starScores: [600, 1000, 1400]
            },
            {
                id: 'chapter_8',
                title: 'Chapter VIII: Flames of Liberty & Steam',
                subtitle: 'Enlightenment Ideals and the First Industrial Age',
                era: 'INDUSTRIAL',
                description: 'The explosive birth of mechanical steam power and the constitutional overthrow of absolute monarchies.',
                targetOrigin: 'locke_human_understanding',
                targetCulmination: 'french_revolution',
                customNodes: [
                    'locke_human_understanding',
                    'diderot_encyclopedie',
                    'industrial_steam_engine',
                    'us_declaration_independence',
                    'adam_smith_wealth_nations',
                    'french_revolution',
                    'jenner_smallpox_vaccine',
                    'haitian_revolution'
                ],
                customEdges: [
                    ['locke_human_understanding', 'diderot_encyclopedie'],
                    ['diderot_encyclopedie', 'industrial_steam_engine'],
                    ['diderot_encyclopedie', 'us_declaration_independence'],
                    ['industrial_steam_engine', 'adam_smith_wealth_nations'],
                    ['us_declaration_independence', 'french_revolution'],
                    ['adam_smith_wealth_nations', 'french_revolution'],
                    ['french_revolution', 'haitian_revolution'],
                    ['industrial_steam_engine', 'jenner_smallpox_vaccine']
                ],
                parTime: 50,
                starScores: [450, 800, 1200]
            },
            {
                id: 'chapter_9',
                title: 'Chapter IX: The Victorian Electrodynamic Arc',
                subtitle: 'From Voltaic Piles to the Transcontinental Railroad',
                era: 'INDUSTRIAL',
                description: 'The rapid wiring of continents with electromagnetic induction, Morse telegraphy, and evolutionary biology.',
                targetOrigin: 'voltas_electric_battery',
                targetCulmination: 'edison_incandescent_lamp',
                customNodes: [
                    'voltas_electric_battery',
                    'stephenson_locomotive',
                    'faraday_electromagnetism',
                    'morse_telegraph',
                    'marx_communist_manifesto',
                    'darwin_origin_species',
                    'us_emancipation_proclamation',
                    'mendeleev_periodic_table',
                    'transcontinental_railroad',
                    'bell_telephone',
                    'edison_incandescent_lamp'
                ],
                customEdges: [
                    ['voltas_electric_battery', 'stephenson_locomotive'],
                    ['stephenson_locomotive', 'faraday_electromagnetism'],
                    ['faraday_electromagnetism', 'morse_telegraph'],
                    ['morse_telegraph', 'marx_communist_manifesto'],
                    ['morse_telegraph', 'darwin_origin_species'],
                    ['darwin_origin_species', 'us_emancipation_proclamation'],
                    ['darwin_origin_species', 'mendeleev_periodic_table'],
                    ['mendeleev_periodic_table', 'transcontinental_railroad'],
                    ['transcontinental_railroad', 'bell_telephone'],
                    ['bell_telephone', 'edison_incandescent_lamp']
                ],
                parTime: 70,
                starScores: [650, 1100, 1500]
            },
            {
                id: 'chapter_10',
                title: 'Chapter X: Crucible of the 20th Century',
                subtitle: 'From Powered Flight to the Manhattan Project',
                era: 'ATOMIC',
                description: 'Human flight, Einsteinian relativity, and the devastating total wars that forged the nuclear threshold.',
                targetOrigin: 'wright_brothers_flight',
                targetCulmination: 'united_nations_founded',
                customNodes: [
                    'wright_brothers_flight',
                    'einstein_special_relativity',
                    'ford_model_t_assembly_line',
                    'outbreak_world_war_one',
                    'einstein_general_relativity',
                    'russian_bolshevik_revolution',
                    'treaty_of_versailles',
                    'hubble_expanding_universe',
                    'fleming_penicillin',
                    'turing_universal_machine',
                    'outbreak_world_war_two',
                    'dday_normandy_landings',
                    'manhattan_project',
                    'united_nations_founded'
                ],
                customEdges: [
                    ['wright_brothers_flight', 'einstein_special_relativity'],
                    ['einstein_special_relativity', 'ford_model_t_assembly_line'],
                    ['ford_model_t_assembly_line', 'outbreak_world_war_one'],
                    ['outbreak_world_war_one', 'einstein_general_relativity'],
                    ['outbreak_world_war_one', 'russian_bolshevik_revolution'],
                    ['russian_bolshevik_revolution', 'treaty_of_versailles'],
                    ['treaty_of_versailles', 'hubble_expanding_universe'],
                    ['treaty_of_versailles', 'fleming_penicillin'],
                    ['fleming_penicillin', 'turing_universal_machine'],
                    ['turing_universal_machine', 'outbreak_world_war_two'],
                    ['outbreak_world_war_two', 'dday_normandy_landings'],
                    ['outbreak_world_war_two', 'manhattan_project'],
                    ['manhattan_project', 'united_nations_founded'],
                    ['dday_normandy_landings', 'united_nations_founded']
                ],
                parTime: 80,
                starScores: [700, 1200, 1600]
            },
            {
                id: 'chapter_11',
                title: 'Chapter XI: The Cosmic & Silicon Frontier',
                subtitle: 'The Cold War Space Race to the Personal Computer',
                era: 'ATOMIC',
                description: 'Microchips, DNA discovery, the lunar landing, and the birth of networked digital computers.',
                targetOrigin: 'transistor_invention',
                targetCulmination: 'fall_of_berlin_wall',
                customNodes: [
                    'transistor_invention',
                    'dna_double_helix',
                    'salk_polio_vaccine',
                    'sputnik_first_satellite',
                    'integrated_circuit_microchip',
                    'gagarin_first_human_space',
                    'cuban_missile_crisis',
                    'arpanet_first_message',
                    'apollo_11_moon_landing',
                    'microprocessor_intel_4004',
                    'personal_computer_apple_ii',
                    'fall_of_berlin_wall'
                ],
                customEdges: [
                    ['transistor_invention', 'dna_double_helix'],
                    ['dna_double_helix', 'salk_polio_vaccine'],
                    ['salk_polio_vaccine', 'sputnik_first_satellite'],
                    ['sputnik_first_satellite', 'integrated_circuit_microchip'],
                    ['sputnik_first_satellite', 'gagarin_first_human_space'],
                    ['gagarin_first_human_space', 'cuban_missile_crisis'],
                    ['cuban_missile_crisis', 'arpanet_first_message'],
                    ['cuban_missile_crisis', 'apollo_11_moon_landing'],
                    ['arpanet_first_message', 'microprocessor_intel_4004'],
                    ['microprocessor_intel_4004', 'personal_computer_apple_ii'],
                    ['personal_computer_apple_ii', 'fall_of_berlin_wall'],
                    ['apollo_11_moon_landing', 'fall_of_berlin_wall']
                ],
                parTime: 75,
                starScores: [650, 1150, 1550]
            },
            {
                id: 'chapter_12',
                title: 'Chapter XII: The Digital Singularity',
                subtitle: 'World Wide Web to Artificial Intelligence',
                era: 'DIGITAL',
                description: 'The hyper-connected modern era from the birth of the World Wide Web to generative intelligence.',
                targetOrigin: 'world_wide_web_tim_berners_lee',
                targetCulmination: 'chatgpt_ai_revolution',
                customNodes: [
                    'world_wide_web_tim_berners_lee',
                    'dissolution_soviet_union',
                    'dolly_the_sheep_cloning',
                    'deep_blue_defeats_kasparov',
                    'google_search_founded',
                    'human_genome_project',
                    'first_iphone',
                    'crispr_cas9',
                    'spacex_falcon9_reusable',
                    'alphago_defeats_lee_sedol',
                    'james_webb_telescope',
                    'chatgpt_ai_revolution'
                ],
                customEdges: [
                    ['world_wide_web_tim_berners_lee', 'dissolution_soviet_union'],
                    ['world_wide_web_tim_berners_lee', 'dolly_the_sheep_cloning'],
                    ['dolly_the_sheep_cloning', 'deep_blue_defeats_kasparov'],
                    ['deep_blue_defeats_kasparov', 'google_search_founded'],
                    ['google_search_founded', 'human_genome_project'],
                    ['human_genome_project', 'first_iphone'],
                    ['first_iphone', 'crispr_cas9'],
                    ['first_iphone', 'spacex_falcon9_reusable'],
                    ['crispr_cas9', 'alphago_defeats_lee_sedol'],
                    ['spacex_falcon9_reusable', 'james_webb_telescope'],
                    ['alphago_defeats_lee_sedol', 'chatgpt_ai_revolution'],
                    ['james_webb_telescope', 'chatgpt_ai_revolution']
                ],
                parTime: 70,
                starScores: [600, 1100, 1500]
            }
        ];
    }

    /**
     * Build Graph Engine from Campaign Chapter
     */
    buildCampaignGraph(chapterId) {
        const chapter = this.campaignChapters.find(c => c.id === chapterId);
        if (!chapter) return null;

        const engine = new GraphEngine();
        
        // Group nodes by chronological order or layer estimate
        const chapterEvents = chapter.customNodes
            .map(id => window.EVENTS_MAP.get(id))
            .filter(Boolean)
            .sort((a, b) => a.year - b.year);

        // Assign layers dynamically based on event ranks
        const total = chapterEvents.length;
        chapterEvents.forEach((ev, idx) => {
            let layer;
            if (ev.id === chapter.targetOrigin) {
                layer = 0;
            } else if (ev.id === chapter.targetCulmination) {
                layer = 4;
            } else {
                layer = Math.min(3, Math.max(1, Math.floor((idx / total) * 3) + 1));
            }

            engine.addNode(ev, {
                layer,
                isOrigin: ev.id === chapter.targetOrigin,
                isCulmination: ev.id === chapter.targetCulmination
            });
        });

        // Add predefined edges
        chapter.customEdges.forEach(([fromId, toId]) => {
            engine.addEdge(fromId, toId);
        });

        engine.computeAllValidPaths();
        return { engine, chapter };
    }

    /**
     * Generate Deterministic Daily Timeline Web based on date string (YYYY-MM-DD)
     */
    generateDailyGraph(dateString) {
        // Simple linear congruential PRNG seeded with date hash
        let seed = 0;
        for (let i = 0; i < dateString.length; i++) {
            seed = (seed * 31 + dateString.charCodeAt(i)) >>> 0;
        }

        const seededRandom = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        const allEvents = [...window.HISTORICAL_EVENTS].sort((a, b) => a.year - b.year);
        
        // Pick origin from early half, culmination from late half
        const earlyEvents = allEvents.slice(0, 30);
        const lateEvents = allEvents.slice(40);

        const origin = earlyEvents[Math.floor(seededRandom() * earlyEvents.length)];
        const culmination = lateEvents[Math.floor(seededRandom() * lateEvents.length)];

        const middleEvents = allEvents.filter(e => 
            e.id !== origin.id && e.id !== culmination.id && e.year >= origin.year && e.year <= culmination.year
        );

        // Shuffle middle events with seeded PRNG
        const shuffledMiddle = [...middleEvents].sort(() => seededRandom() - 0.5);
        const selectedMiddle = shuffledMiddle.slice(0, 10);

        const engine = new GraphEngine();

        // 4 Layers: 0: Origin, 1: 3-4 nodes, 2: 3-4 nodes, 3: Culmination
        engine.addNode(origin, { layer: 0, isOrigin: true });

        const layer1Count = Math.floor(selectedMiddle.length / 2);
        const layer1Nodes = selectedMiddle.slice(0, layer1Count);
        const layer2Nodes = selectedMiddle.slice(layer1Count);

        layer1Nodes.forEach(ev => engine.addNode(ev, { layer: 1 }));
        layer2Nodes.forEach(ev => engine.addNode(ev, { layer: 2 }));

        engine.addNode(culmination, { layer: 3, isCulmination: true });

        // Connect Origin to Layer 1
        layer1Nodes.forEach(n1 => engine.addEdge(origin.id, n1.id));

        // Connect Layer 1 to Layer 2
        layer1Nodes.forEach(n1 => {
            layer2Nodes.forEach(n2 => {
                if (seededRandom() > 0.35) {
                    engine.addEdge(n1.id, n2.id);
                }
            });
        });

        // Ensure every layer 1 has at least one forward edge
        layer1Nodes.forEach(n1 => {
            const hasEdge = layer2Nodes.some(n2 => engine.edges.some(e => 
                (e.from === n1.id && e.to === n2.id) || (e.from === n2.id && e.to === n1.id)
            ));
            if (!hasEdge && layer2Nodes.length > 0) {
                engine.addEdge(n1.id, layer2Nodes[0].id);
            }
        });

        // Connect Layer 2 to Culmination
        layer2Nodes.forEach(n2 => engine.addEdge(n2.id, culmination.id));

        // Connect direct shortcut if lucky
        if (seededRandom() > 0.6 && layer1Nodes.length > 0) {
            engine.addEdge(layer1Nodes[0].id, culmination.id);
        }

        engine.computeAllValidPaths();

        // If no path is valid due to random seeds, make a guaranteed bridge
        if (engine.allValidPaths.length === 0) {
            const sorted = [origin, ...selectedMiddle, culmination].sort((a, b) => a.year - b.year);
            for (let i = 0; i < sorted.length - 1; i++) {
                engine.addEdge(sorted[i].id, sorted[i + 1].id);
            }
            engine.computeAllValidPaths();
        }

        return { engine, dateString, origin, culmination };
    }

    /**
     * Generate Emoji Share Card for Daily Mode
     */
    generateShareCard(dateStr, pathNodeIds, paradoxCount, score, isVictory = true) {
        const dateFormatted = dateStr.replace(/-/g, '.');
        const nodeIcons = pathNodeIds.map(id => {
            const ev = window.EVENTS_MAP.get(id);
            return ev ? ev.icon : '⏳';
        }).join(' ➔ ');

        const paradoxEmoji = paradoxCount === 0 ? '✨ Flawless Timeline' : `⚡ ${paradoxCount} Paradox${paradoxCount > 1 ? 'es' : ''}`;
        
        return `⏳ ChronoTrace Daily #${dateFormatted}
${isVictory ? '🌟 TIMELINE STABILIZED!' : '💥 TIMELINE COLLAPSED'}
Path: ${nodeIcons}
${paradoxEmoji} | 🏆 ${score} pts
Play at: bughouse.games/chrono_trace`;
    }
}

// Global exposure
if (typeof window !== 'undefined') {
    window.GameModesManager = new GameModesManager();
}
