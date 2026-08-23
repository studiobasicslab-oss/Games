/**
 * Star Catalog & Constellation Database for The Celestial Cartographer
 * Includes astronomical coordinates (RA/Dec), apparent magnitudes, spectral classes,
 * light-year distances, cultural lore (Greek, Arabic, Vedic, Polynesian, Navajo),
 * asterism linkages, and navigation pointer rules.
 */

export const SPECTRAL_COLORS = {
    O: '#9db4ff', // Deep blue-white
    B: '#bbccff', // Blue-white
    A: '#f8f9ff', // Pure white
    F: '#ffffed', // Yellow-white
    G: '#fff4e8', // Yellow (Sun-like)
    K: '#ffd2a1', // Orange
    M: '#ff6060'  // Red supergiant / cool red
};

export const DEEP_SKY_OBJECTS = [
    {
        id: 'm42',
        name: 'Orion Nebula (M42)',
        ra: 5.59,
        dec: -5.39,
        type: 'Diffuse Nebula & Stellar Nursery',
        distLy: 1344,
        desc: 'A massive luminous cloud of cosmic gas and dust where new stars are actively being born. Visible to the naked eye just below Orion\'s Belt.',
        color: 'rgba(236, 72, 153, 0.45)',
        icon: '🌌'
    },
    {
        id: 'm31',
        name: 'Andromeda Galaxy (M31)',
        ra: 0.71,
        dec: 41.27,
        type: 'Spiral Galaxy',
        distLy: 2500000,
        desc: 'The nearest major spiral galaxy to the Milky Way, containing over one trillion stars across 220,000 light-years.',
        color: 'rgba(147, 197, 253, 0.45)',
        icon: '🌀'
    },
    {
        id: 'pleiades',
        name: 'The Pleiades (M45 / Seven Sisters)',
        ra: 3.79,
        dec: 24.11,
        type: 'Open Star Cluster',
        distLy: 444,
        desc: 'A dazzling cluster of hot blue luminous stars enveloped in reflective cosmic dust, revered across nearly every ancient civilization.',
        color: 'rgba(96, 165, 250, 0.55)',
        icon: '✨'
    },
    {
        id: 'm57',
        name: 'Ring Nebula (M57)',
        ra: 18.89,
        dec: 33.03,
        type: 'Planetary Nebula',
        distLy: 2570,
        desc: 'A glowing shell of ionized gas expelled by a dying red giant star in the constellation Lyra.',
        color: 'rgba(52, 211, 153, 0.45)',
        icon: '💍'
    }
];

export const CONSTELLATIONS = [
    {
        id: 'ursa_major',
        name: 'Ursa Major',
        title: 'The Great Bear & The Big Dipper',
        season: 'Spring / All Year (Circumpolar)',
        hemisphere: 'North',
        centerRA: 11.0,
        centerDec: 55.0,
        difficulty: 1,
        artSvg: 'bear',
        description: 'One of the oldest recognizable constellations in human history. The iconic seven-star asterism, the Big Dipper, forms the hindquarters and tail of the celestial Great Bear.',
        lore: {
            greek: 'Callisto, a nymph beloved by Zeus, was transformed into a bear by jealous Hera and cast into the heavens to circle the pole forever without dipping into the ocean.',
            arabic: 'The quadrilateral is known as "Na\'sh" (the Bier or Coffin), and the three handle stars are "Banāt Na\'sh" (the Mourners weeping for their lost ancestor).',
            vedic: 'Known as "Saptarishi" (the Seven Great Sages: Kratu, Pulaha, Pulastya, Atri, Angiras, Vashistha, and Marichi) who guide the cosmic order and dharma across the yugas.',
            polynesian: 'Revered in ancient Polynesian sea-voyaging as "Hiku-kālua-kama" and used as an anchor steering mark for navigators voyaging across the open Pacific ocean.',
            navajo: 'Known as "Náhookǫs Bi\'kà\'" (The Revolving Male / Bear), symbol of fatherly protection, law, and northern direction paired with Cassiopeia.'
        },
        pointerGuide: {
            title: 'Pointer Stars to Polaris',
            instruction: 'Draw a line from Merak through Dubhe and extend it 5x distance to discover Polaris, the North Star!',
            from: 'merak',
            to: 'dubhe',
            target: 'polaris',
            distanceMultiplier: 5.0
        },
        stars: [
            { id: 'dubhe', name: 'Dubhe', bayer: 'α UMa', ra: 11.06, dec: 61.75, mag: 1.79, spec: 'K', distLy: 123, desc: 'Arabic: "Zahr ad-Dubb al-Akbar" (Back of the Great Bear). The upper pointer star to the North Star.' },
            { id: 'merak', name: 'Merak', bayer: 'β UMa', ra: 11.03, dec: 56.38, mag: 2.37, spec: 'A', distLy: 79.7, desc: 'Arabic: "al-Maraqq" (The Loins). The lower pointer star to Polaris.' },
            { id: 'phecda', name: 'Phecda', bayer: 'γ UMa', ra: 11.90, dec: 53.69, mag: 2.44, spec: 'A', distLy: 83.2, desc: 'Arabic: "Fakhð" (The Thigh). Bottom-left anchor of the Dipper bowl.' },
            { id: 'megrez', name: 'Megrez', bayer: 'δ UMa', ra: 12.25, dec: 57.03, mag: 3.31, spec: 'A', distLy: 80.5, desc: 'Arabic: "al-Maghriz" (The Base of the Tail). Junction star connecting bowl to handle.' },
            { id: 'alioth', name: 'Alioth', bayer: 'ε UMa', ra: 12.90, dec: 55.96, mag: 1.77, spec: 'A', distLy: 82.6, desc: 'Arabic: "al-Yat" (The Fat Tail). Brightest star in Ursa Major.' },
            { id: 'mizar', name: 'Mizar', bayer: 'ζ UMa', ra: 13.40, dec: 54.92, mag: 2.23, spec: 'A', distLy: 82.9, desc: 'Famous visual binary with tiny Alcor ("The Horse and Rider"), used by ancient Persian and Arab warriors as an eye test!' },
            { id: 'alkaid', name: 'Alkaid', bayer: 'η UMa', ra: 13.79, dec: 49.31, mag: 1.86, spec: 'B', distLy: 103.9, desc: 'Arabic: "Qā\'id Banāt Na\'sh" (Leader of the Daughters of the Bier). Tip of the handle.' }
        ],
        lines: [
            ['dubhe', 'merak'],
            ['merak', 'phecda'],
            ['phecda', 'megrez'],
            ['megrez', 'dubhe'],
            ['megrez', 'alioth'],
            ['alioth', 'mizar'],
            ['mizar', 'alkaid']
        ]
    },
    {
        id: 'ursa_minor',
        name: 'Ursa Minor',
        title: 'The Little Bear & Polaris',
        season: 'All Year (North Polar Hub)',
        hemisphere: 'North',
        centerRA: 15.0,
        centerDec: 78.0,
        difficulty: 1,
        artSvg: 'little_bear',
        description: 'The celestial pivot of the northern sky. At the tip of the Little Dipper\'s handle sits Polaris, the true North Star around which the entire northern sky revolves.',
        lore: {
            greek: 'Arcas, son of Callisto, placed next to his mother in the heavens to remain by her side for all eternity.',
            arabic: 'Known as "al-Fas" (The Hole / Pivot of the Millstone) or "al-Qutb" (The Pivot Axis).',
            vedic: 'Revered as "Dhruva Loka" — Dhruva, the steadfast child devotee whose spiritual determination was rewarded by being made the unmoving pole star of the universe.',
            polynesian: 'Named "Hōkūpaʻa" (The Fixed Star / Immovable Beacon), the crucial cardinal anchor for Pacific voyaging canoes sailing northward toward Hawaii.',
            navajo: 'Called "Náhookǫs Bi\'kǫ\'" (The Central Fire / Hearth of the Universe), around which all other stars dance in harmonious order.'
        },
        pointerGuide: {
            title: 'The Celestial Anchor',
            instruction: 'Follow the pointers of Ursa Major to lock onto Polaris, the true pivot of the northern heavens.',
            from: 'dubhe',
            to: 'polaris',
            target: 'polaris',
            distanceMultiplier: 1.0
        },
        stars: [
            { id: 'polaris', name: 'Polaris', bayer: 'α UMi', ra: 2.53, dec: 89.26, mag: 1.98, spec: 'F', distLy: 433, isNavAnchor: true, desc: 'The North Star. Sits less than 1° from true north celestial pole. Multiple supergiant system.' },
            { id: 'kochab', name: 'Kochab', bayer: 'β UMi', ra: 14.85, dec: 74.16, mag: 2.08, spec: 'K', distLy: 130.9, desc: 'Arabic: "al-Kawkab" (The Star). Ancient pole star around 1100 BCE.' },
            { id: 'pherkad', name: 'Pherkad', bayer: 'γ UMi', ra: 15.35, dec: 71.83, mag: 3.05, spec: 'A', distLy: 487, desc: 'Arabic: "Farqad" (The Dim Calf). Together with Kochab, known as the "Guardians of the Pole".' },
            { id: 'yildun', name: 'Yildun', bayer: 'δ UMi', ra: 17.54, dec: 86.59, mag: 4.36, spec: 'A', distLy: 172, desc: 'Turkish: "Yıldız" (Star). Intermediate star in the handle.' },
            { id: 'urim_zeta', name: 'Urodelus', bayer: 'ε UMi', ra: 16.76, dec: 82.04, mag: 4.21, spec: 'G', distLy: 303, desc: 'Handle star linking to the bowl.' },
            { id: 'ahfa', name: 'Ahfa al Farkadayn', bayer: 'ζ UMi', ra: 15.73, dec: 77.79, mag: 4.29, spec: 'A', distLy: 380, desc: 'Inner bowl corner star.' },
            { id: 'anwar', name: 'Anwar al Farkadayn', bayer: 'η UMi', ra: 16.29, dec: 75.75, mag: 4.95, spec: 'F', distLy: 97, desc: 'Corner star completing the Little Dipper bowl.' }
        ],
        lines: [
            ['polaris', 'yildun'],
            ['yildun', 'urim_zeta'],
            ['urim_zeta', 'ahfa'],
            ['ahfa', 'anwar'],
            ['anwar', 'kochab'],
            ['kochab', 'pherkad'],
            ['pherkad', 'ahfa']
        ]
    },
    {
        id: 'cassiopeia',
        name: 'Cassiopeia',
        title: 'The Queen of the Sky',
        season: 'Autumn / Winter',
        hemisphere: 'North',
        centerRA: 1.0,
        centerDec: 60.0,
        difficulty: 1,
        artSvg: 'queen',
        description: 'Distinctive W-shaped (or M-shaped) asterism opposite the Big Dipper across Polaris. Serves as a vital northern wayfinding guide when the Big Dipper sits low on the horizon.',
        lore: {
            greek: 'The vain Ethiopian Queen who boasted that she and her daughter Andromeda were more beautiful than the Nereids (sea nymphs), angering Poseidon.',
            arabic: 'Known as "al-Kaff al-Khadib" (The Stained Hand of Henna), reaching out across the starry night.',
            vedic: 'Associated with Queen Sharmishtha in the Mahabharata, symbol of celestial majesty and endurance.',
            polynesian: 'Known as "ʻIwakeliʻi" (The Great Frigate Bird), gliding above the northern ocean horizon to guide island-hopping voyagers.',
            navajo: 'Called "Náhookǫs Bi\'áád" (The Revolving Female), symbolizing home, maternal wisdom, and stability, balancing the Revolving Male.'
        },
        pointerGuide: {
            title: 'Locating Andromeda & Polaris',
            instruction: 'The central vertex of Cassiopeia\'s W points directly toward the North Star, while the open bowl points to the great Andromeda Galaxy.',
            from: 'schedar',
            to: 'navi',
            target: 'polaris',
            distanceMultiplier: 3.5
        },
        stars: [
            { id: 'caph', name: 'Caph', bayer: 'β Cas', ra: 0.15, dec: 59.15, mag: 2.27, spec: 'F', distLy: 54.7, desc: 'Arabic: "Kaff" (Palm). Westernmost star in the W asterism.' },
            { id: 'schedar', name: 'Schedar', bayer: 'α Cas', ra: 0.68, dec: 56.54, mag: 2.23, spec: 'K', distLy: 228, desc: 'Arabic: "Sadr" (The Breast). Orange giant marking the lower corner of the W.' },
            { id: 'navi', name: 'Navi (Tsih)', bayer: 'γ Cas', ra: 0.94, dec: 60.72, mag: 2.15, spec: 'B', distLy: 550, desc: 'Eruptive variable star named "Navi" in reverse tribute to astronaut Virgil "Gus" Ivan Grissom by the Apollo 1 crew.' },
            { id: 'ruchbah', name: 'Ruchbah', bayer: 'δ Cas', ra: 1.43, dec: 60.23, mag: 2.68, spec: 'A', distLy: 99.4, desc: 'Arabic: "Rukbah" (The Knee). Eclipsing binary star.' },
            { id: 'segin', name: 'Segin', bayer: 'ε Cas', ra: 1.90, dec: 63.67, mag: 3.37, spec: 'B', distLy: 460, desc: 'Luminous blue giant marking the eastern tip of the W.' }
        ],
        lines: [
            ['caph', 'schedar'],
            ['schedar', 'navi'],
            ['navi', 'ruchbah'],
            ['ruchbah', 'segin']
        ]
    },
    {
        id: 'orion',
        name: 'Orion',
        title: 'The Great Hunter & Master Wayfinder',
        season: 'Winter',
        hemisphere: 'Equatorial / Global',
        centerRA: 5.5,
        centerDec: 0.0,
        difficulty: 2,
        artSvg: 'hunter',
        description: 'The undisputed master constellation of the winter sky. Its luminous hourglass figure and straight three-star belt serve as the astronomical crossroads to the entire night sky.',
        lore: {
            greek: 'The legendary giant hunter who boasted no beast on Earth could conquer him, until mother Gaia sent the Scorpion to strike his heel.',
            arabic: 'Known as "al-Jabbār" (The Giant / Mighty One) or "al-Jawzā\'" (The Central One), honored in classical Arabian navigation poetry.',
            vedic: 'Known as "Mrigashira" / "Kāla-Purusha" (The Cosmic Stag or Cosmic Man of Time), dancing at the center of the celestial equator.',
            polynesian: 'Celebrated as "Heihei-i-nā-muka" or "The Cat\'s Cradle", guiding voyagers across the equator with zero declination.',
            navajo: 'Revered as "Átseʼ Etsʼózí" (First Slender One), warrior protector carrying the celestial bow and arrow across the winter nights.'
        },
        pointerGuide: {
            title: 'Orion\'s Belt Wayfinding Dual Ray',
            instruction: 'Extend Orion\'s Belt downward to the left to find Sirius (brightest star), or upward to the right to find Aldebaran and the Pleiades!',
            from: 'mintaka',
            to: 'alnitak',
            target: 'sirius',
            distanceMultiplier: 4.2
        },
        stars: [
            { id: 'betelgeuse', name: 'Betelgeuse', bayer: 'α Ori', ra: 5.92, dec: 7.41, mag: 0.50, spec: 'M', distLy: 642, desc: 'Arabic: "Ibt al-Jawzā\'" (Armpit of the Central One). A colossal glowing red supergiant over 700 times the size of our Sun.' },
            { id: 'rigel', name: 'Rigel', bayer: 'β Ori', ra: 5.24, dec: -8.20, mag: 0.13, spec: 'B', distLy: 860, desc: 'Arabic: "Rijl Jauzah" (Foot of the Giant). Blazing blue supergiant shining with 120,000 times the luminosity of the Sun.' },
            { id: 'bellatrix', name: 'Bellatrix', bayer: 'γ Ori', ra: 5.42, dec: 6.35, mag: 1.64, spec: 'B', distLy: 250, desc: 'Latin: "The Female Warrior". Hot blue giant marking Orion\'s left shoulder.' },
            { id: 'saiph', name: 'Saiph', bayer: 'κ Ori', ra: 5.79, dec: -9.67, mag: 2.07, spec: 'B', distLy: 650, desc: 'Arabic: "Saif al-Jabbār" (Sword of the Giant). Orion\'s right foot.' },
            { id: 'mintaka', name: 'Mintaka', bayer: 'δ Ori', ra: 5.53, dec: -0.30, mag: 2.23, spec: 'B', distLy: 1200, desc: 'Arabic: "al-Minṭaqah" (The Belt). Western star of Orion\'s Belt, sits almost precisely on the celestial equator (0° Dec)!' },
            { id: 'alnilam', name: 'Alnilam', bayer: 'ε Ori', ra: 5.60, dec: -1.20, mag: 1.69, spec: 'B', distLy: 2000, desc: 'Arabic: "al-Niẓām" (String of Pearls). Center star of Orion\'s Belt.' },
            { id: 'alnitak', name: 'Alnitak', bayer: 'ζ Ori', ra: 5.68, dec: -1.94, mag: 1.77, spec: 'O', distLy: 1260, desc: 'Arabic: "an-Niṭāq" (The Girdle). Eastern star of the belt, glowing next to the famous Horsehead Nebula.' },
            { id: 'meissa', name: 'Meissa', bayer: 'λ Ori', ra: 5.58, dec: 9.93, mag: 3.39, spec: 'O', distLy: 1100, desc: 'Arabic: "al-Maisān" (The Shining One). Head of Orion.' }
        ],
        lines: [
            ['betelgeuse', 'bellatrix'],
            ['bellatrix', 'mintaka'],
            ['mintaka', 'alnilam'],
            ['alnilam', 'alnitak'],
            ['alnitak', 'saiph'],
            ['saiph', 'rigel'],
            ['rigel', 'mintaka'],
            ['betelgeuse', 'alnitak'],
            ['betelgeuse', 'meissa'],
            ['bellatrix', 'meissa']
        ]
    },
    {
        id: 'canis_major',
        name: 'Canis Major',
        title: 'The Great Dog & Sirius',
        season: 'Winter',
        hemisphere: 'South / Equatorial',
        centerRA: 6.8,
        centerDec: -22.0,
        difficulty: 2,
        artSvg: 'dog',
        description: 'Home to Sirius, the brightest star in Earth\'s entire night sky. Faithful hunting companion following behind Orion across the winter skies.',
        lore: {
            greek: 'Laelaps, the legendary hound so swift that no prey could ever escape it, immortalized by Zeus.',
            arabic: 'Sirius is named "ash-Shi\'rā al-Yamāniyyah" (The Bright Star of Yemen), celebrated in ancient pre-Islamic astronomy and poetry.',
            vedic: 'Associated with Mrigavyadha (The Celestial Hunter\'s Hound) and Rudra\'s guardian dog at the gates of the cosmos.',
            polynesian: 'Named "Aʻa" (The Burning Flame) or "Kāne", paramount steering star for navigators voyaging south across Tahiti and Hawaii.',
            navajo: 'Regarded as a vigilant celestial scout star observing over sleeping families during the freezing winter nights.'
        },
        pointerGuide: {
            title: 'Follow the Belt to Sirius',
            instruction: 'Trace a straight ray through Orion\'s Belt downward to locate Sirius, glowing with brilliant diamond blue-white light.',
            from: 'alnitak',
            to: 'sirius',
            target: 'sirius',
            distanceMultiplier: 1.0
        },
        stars: [
            { id: 'sirius', name: 'Sirius', bayer: 'α CMa', ra: 6.75, dec: -16.72, mag: -1.46, spec: 'A', distLy: 8.6, isNavAnchor: true, desc: 'The Dog Star. The brightest individual star in the night sky, only 8.6 light-years from Earth with a white dwarf companion (Sirius B).' },
            { id: 'adhara', name: 'Adhara', bayer: 'ε CMa', ra: 6.98, dec: -28.97, mag: 1.50, spec: 'B', distLy: 430, desc: 'Arabic: "al-\'Adhārā" (The Maidens). Second brightest star in Canis Major, intense ultraviolet emitter.' },
            { id: 'wezen', name: 'Wezen', bayer: 'δ CMa', ra: 7.14, dec: -26.39, mag: 1.83, spec: 'F', distLy: 1600, desc: 'Arabic: "al-Wazn" (The Weight). Luminous yellow supergiant.' },
            { id: 'murzim', name: 'Mirzam', bayer: 'β CMa', ra: 6.38, dec: -17.96, mag: 1.98, spec: 'B', distLy: 490, desc: 'Arabic: "al-Mirzam" (The Herald / Announcer), rising just before Sirius to announce the Dog Star\'s arrival.' },
            { id: 'aludra', name: 'Aludra', bayer: 'η CMa', ra: 7.40, dec: -29.30, mag: 2.45, spec: 'B', distLy: 2000, desc: 'Arabic: "al-\'Udhrah" (The Virginity). Blue supergiant marking the dog\'s tail.' }
        ],
        lines: [
            ['murzim', 'sirius'],
            ['sirius', 'wezen'],
            ['wezen', 'adhara'],
            ['wezen', 'aludra']
        ]
    },
    {
        id: 'taurus',
        name: 'Taurus',
        title: 'The Celestial Bull & Aldebaran',
        season: 'Winter',
        hemisphere: 'North / Equatorial',
        centerRA: 4.5,
        centerDec: 16.0,
        difficulty: 2,
        artSvg: 'bull',
        description: 'A majestic zodiac constellation charging toward Orion. Features the V-shaped Hyades cluster centered on fiery Aldebaran and the sparkling Pleiades star cluster.',
        lore: {
            greek: 'The great white bull that Zeus transformed into to whisk Princess Europa away across the Aegean sea to Crete.',
            arabic: 'Aldebaran is "al-Dabarān" (The Follower), because it faithfully pursues the Pleiades cluster across the night sky.',
            vedic: 'Home to the sacred Nakshatras "Rohini" (Aldebaran, the Red One) and "Krittika" (The Pleiades / Seven Mothers of Kartikeya).',
            polynesian: 'The Pleiades are revered as "Makaliʻi" (The Little Eyes). Its rising in late November marks the Polynesian New Year (Makahiki season of peace).',
            navajo: 'Known as part of "Dilyéhé" (The Pleiades / Seven Hardworking Boys), dictating the seasons for winter storytelling and spring planting.'
        },
        pointerGuide: {
            title: 'Belt to the Bull\'s Eye',
            instruction: 'Extend Orion\'s Belt upward and to the right to locate blazing orange Aldebaran, the eye of the Bull!',
            from: 'mintaka',
            to: 'aldebaran',
            target: 'aldebaran',
            distanceMultiplier: 1.0
        },
        stars: [
            { id: 'aldebaran', name: 'Aldebaran', bayer: 'α Tau', ra: 4.60, dec: 16.51, mag: 0.85, spec: 'K', distLy: 65.3, isNavAnchor: true, desc: 'The Eye of the Bull. A luminous red-orange giant star 44 times the solar radius.' },
            { id: 'elnath', name: 'Elnath', bayer: 'β Tau', ra: 5.44, dec: 28.61, mag: 1.65, spec: 'B', distLy: 134, desc: 'Arabic: "an-Naṭḥ" (The Butting One). Marks the bull\'s northern horn, shared with Auriga.' },
            { id: 'tianguan', name: 'Tianguan', bayer: 'ζ Tau', ra: 5.63, dec: 21.14, mag: 2.97, spec: 'B', distLy: 440, desc: 'The southern horn tip, near the site of the historical Supernova of 1054 CE that formed the Crab Nebula (M1).' },
            { id: 'hyadum_i', name: 'Ain', bayer: 'ε Tau', ra: 4.48, dec: 19.18, mag: 3.53, spec: 'K', distLy: 147, desc: 'Arabic: "al-\'Ayn" (The Eye). Northern eye in the V-shaped Hyades.' },
            { id: 'alcyone', name: 'Alcyone', bayer: 'η Tau', ra: 3.79, dec: 24.11, mag: 2.87, spec: 'B', distLy: 440, desc: 'The brightest star of the Pleiades cluster (Seven Sisters).' }
        ],
        lines: [
            ['alcyone', 'hyadum_i'],
            ['hyadum_i', 'aldebaran'],
            ['aldebaran', 'tianguan'],
            ['hyadum_i', 'elnath'],
            ['elnath', 'tianguan']
        ]
    },
    {
        id: 'cygnus',
        name: 'Cygnus',
        title: 'The Celestial Swan & Northern Cross',
        season: 'Summer / Autumn',
        hemisphere: 'North',
        centerRA: 20.5,
        centerDec: 42.0,
        difficulty: 3,
        artSvg: 'swan',
        description: 'Soaring along the glowing spine of the Milky Way galaxy. The Northern Cross asterism forms the swan\'s wings and neck, anchored by Deneb.',
        lore: {
            greek: 'Orpheus transformed into a swan upon his death to be placed near his beloved lyre (Lyra) in the heavens.',
            arabic: 'Known as "ad-Dajāja" (The Hen) and Deneb is "Dhanab ad-Dajāja" (Tail of the Hen).',
            vedic: 'Associated with Hamsa, the divine cosmic swan of spiritual discrimination, separating truth from illusion.',
            polynesian: 'Part of the great soaring sea-bird navigation paths that guide island voyagers across trade winds.',
            navajo: 'Regarded as a celestial bird messenger whose flight marks the seasonal shift toward autumn harvest.'
        },
        pointerGuide: {
            title: 'The Summer Triangle Apex',
            instruction: 'Link Deneb with Vega (Lyra) and Altair (Aquila) to form the Summer Triangle framing the Great Milky Way Rift.',
            from: 'deneb',
            to: 'vega',
            target: 'altair',
            distanceMultiplier: 1.0
        },
        stars: [
            { id: 'deneb', name: 'Deneb', bayer: 'α Cyg', ra: 20.69, dec: 45.28, mag: 1.25, spec: 'A', distLy: 2615, isNavAnchor: true, desc: 'Tail of the Swan. Colossal white supergiant, one of the most intrinsically luminous stars known (200,000x Sun luminosity).' },
            { id: 'albireo', name: 'Albireo', bayer: 'β Cyg', ra: 19.51, dec: 27.96, mag: 3.05, spec: 'K', distLy: 430, desc: 'The golden topaz and sapphire blue double star marking the swan\'s head, widely considered the most beautiful binary star in astronomy.' },
            { id: 'sadr', name: 'Sadr', bayer: 'γ Cyg', ra: 20.37, dec: 40.26, mag: 2.23, spec: 'F', distLy: 1800, desc: 'Arabic: "al-Ṣadr" (The Chest). Center intersection of the Northern Cross surrounded by rich emission nebulae.' },
            { id: 'gienah_cyg', name: 'Gienah', bayer: 'ε Cyg', ra: 20.77, dec: 33.97, mag: 2.48, spec: 'K', distLy: 73, desc: 'Arabic: "Janāḥ" (The Wing). Eastern wingtip of Cygnus.' },
            { id: 'fawaris', name: 'Delta Cygni', bayer: 'δ Cyg', ra: 19.75, dec: 45.13, mag: 2.86, spec: 'B', distLy: 165, desc: 'Western wingtip of Cygnus.' }
        ],
        lines: [
            ['deneb', 'sadr'],
            ['sadr', 'albireo'],
            ['fawaris', 'sadr'],
            ['sadr', 'gienah_cyg']
        ]
    },
    {
        id: 'lyra',
        name: 'Lyra',
        title: 'The Celestial Harp & Vega',
        season: 'Summer',
        hemisphere: 'North',
        centerRA: 18.9,
        centerDec: 36.0,
        difficulty: 3,
        artSvg: 'harp',
        description: 'A small but brilliant constellation shaped like a celestial harp, anchored by Vega, the second brightest star in the northern hemisphere.',
        lore: {
            greek: 'The magical lyre made by Hermes from a tortoise shell and given to Orpheus, whose music enchanted all living things.',
            arabic: 'Named "an-Nasr al-Wāqi\'" (The Falling Eagle / Swooping Falcon), from which the modern name Vega derives.',
            vedic: 'Known as "Abhijit" (The Invincible One), a special 28th intercalary Nakshatra representing supreme victory and focus.',
            polynesian: 'Known as "Keoe", an essential zenith star for navigators steering canoes across northern waters.',
            navajo: 'Auspicious marker star signaling nocturnal ceremonies and traditional dances.'
        },
        pointerGuide: {
            title: 'Summer Triangle Anchor',
            instruction: 'Vega is the brightest beacon of the Summer Triangle, shining with a pure diamond sapphire hue.',
            from: 'vega',
            to: 'deneb',
            target: 'deneb',
            distanceMultiplier: 1.0
        },
        stars: [
            { id: 'vega', name: 'Vega', bayer: 'α Lyr', ra: 18.62, dec: 38.78, mag: 0.03, spec: 'A', distLy: 25.0, isNavAnchor: true, desc: 'The baseline reference star for astronomical magnitude (0.00 mag). Spun into an oblate shape by its rapid 12.5-hour rotation!' },
            { id: 'sheliak', name: 'Sheliak', bayer: 'β Lyr', ra: 18.83, dec: 33.36, mag: 3.52, spec: 'B', distLy: 960, desc: 'Famous prototype eclipsing variable star where gas streams between two close binary stars.' },
            { id: 'sulafat', name: 'Sulafat', bayer: 'γ Lyr', ra: 18.98, dec: 32.69, mag: 3.25, spec: 'B', distLy: 620, desc: 'Arabic: "al-Sulḥafāh" (The Tortoise). Bottom corner of the harp parallelogram.' },
            { id: 'lyra_delta', name: 'Delta Lyrae', bayer: 'δ Lyr', ra: 18.90, dec: 36.90, mag: 4.30, spec: 'M', distLy: 740, desc: 'Red giant optical pair in the upper harp frame.' },
            { id: 'lyra_zeta', name: 'Zeta Lyrae', bayer: 'ζ Lyr', ra: 18.75, dec: 37.60, mag: 4.36, spec: 'A', distLy: 156, desc: 'Double star joining Vega to the harp body.' }
        ],
        lines: [
            ['vega', 'lyra_zeta'],
            ['lyra_zeta', 'sheliak'],
            ['sheliak', 'sulafat'],
            ['sulafat', 'lyra_delta'],
            ['lyra_delta', 'lyra_zeta']
        ]
    },
    {
        id: 'aquila',
        name: 'Aquila',
        title: 'The Celestial Eagle & Altair',
        season: 'Summer / Autumn',
        hemisphere: 'Equatorial',
        centerRA: 19.8,
        centerDec: 3.0,
        difficulty: 3,
        artSvg: 'eagle',
        description: 'The soaring eagle carrying Zeus\'s thunderbolts. Its heart is Altair, flanked symmetrically by Tarazed and Alshain.',
        lore: {
            greek: 'The royal eagle that carried Ganymede up to Mount Olympus and retrieved the thunderbolts hurled by Zeus.',
            arabic: 'Named "an-Nasr aṭ-Ṭā\'ir" (The Flying Eagle), which gave rise to the name Altair.',
            vedic: 'Associated with the Nakshatra "Shravana" (The Ear / Hearing), symbolizing oral transmission of sacred knowledge and devotion.',
            polynesian: 'Named "Humu", a vital navigational star used by Polynesian wayfinders traveling along the equator.',
            navajo: 'A warrior spirit keeping vigil over the southern desert plains.'
        },
        pointerGuide: {
            title: 'Completing the Summer Triangle',
            instruction: 'Draw the line between Vega, Deneb, and Altair to complete the great Summer Triangle across the Milky Way.',
            from: 'altair',
            to: 'vega',
            target: 'vega',
            distanceMultiplier: 1.0
        },
        stars: [
            { id: 'altair', name: 'Altair', bayer: 'α Aql', ra: 19.84, dec: 8.87, mag: 0.77, spec: 'A', distLy: 16.7, isNavAnchor: true, desc: 'The Flying Eagle. Rotates so fast (nearly 300 km/s) that its equator is stretched wide into an oval shape!' },
            { id: 'tarazed', name: 'Tarazed', bayer: 'γ Aql', ra: 19.77, dec: 10.61, mag: 2.72, spec: 'K', distLy: 395, desc: 'Persian: "The Balance Scale Beam". Bright orange giant flanking Altair on the north.' },
            { id: 'alshain', name: 'Alshain', bayer: 'β Aql', ra: 19.92, dec: 6.41, mag: 3.71, spec: 'G', distLy: 44.7, desc: 'Persian: "The Falcon". Yellow subgiant flanking Altair on the south.' },
            { id: 'denebokab', name: 'Deneb el Okab', bayer: 'ζ Aql', ra: 19.09, dec: 13.86, mag: 2.99, spec: 'A', distLy: 83, desc: 'Arabic: "Tail of the Eagle". Northern wing joint.' },
            { id: 'aquila_theta', name: 'Tiamat', bayer: 'θ Aql', ra: 20.19, dec: -0.82, mag: 3.24, spec: 'B', distLy: 287, desc: 'Southern wingtip of Aquila.' }
        ],
        lines: [
            ['tarazed', 'altair'],
            ['altair', 'alshain'],
            ['altair', 'denebokab'],
            ['alshain', 'aquila_theta']
        ]
    },
    {
        id: 'crux',
        name: 'Crux',
        title: 'The Southern Cross & South Pole Wayfinding',
        season: 'All Year (Southern Circumpolar)',
        hemisphere: 'South',
        centerRA: 12.4,
        centerDec: -60.0,
        difficulty: 4,
        artSvg: 'cross',
        description: 'The smallest constellation in the sky yet the most iconic symbol of the Southern Hemisphere. Used for centuries by Polynesian, Aboriginal Australian, and European mariners to find true South.',
        lore: {
            greek: 'Known to ancient Greeks as the hind feet of Centaurus before precession lowered it below European horizons.',
            arabic: 'Revered by medieval navigators crossing the Indian Ocean toward Zanzibar and the Spice Islands.',
            vedic: 'Associated with the legend of King Trishanku, suspended upside down in the southern sky by Sage Vishwamitra.',
            polynesian: 'Known in Hawaii as "Hānaiakamalama" (Cared for by the Moon) and in Maori as "Te Punga" (The Anchor of the Great Sky Canoe).',
            navajo: 'Regarded in southern indigenous lore as the four sacred compass guardians of life and harmony.'
        },
        pointerGuide: {
            title: 'Finding the South Celestial Pole',
            instruction: 'Extend the long vertical axis of Crux (Gacrux through Acrux) 4.5x downward to locate the true South Celestial Pole!',
            from: 'gacrux',
            to: 'acrux',
            target: 'south_pole',
            distanceMultiplier: 4.5
        },
        stars: [
            { id: 'acrux', name: 'Acrux', bayer: 'α Cru', ra: 12.44, dec: -63.10, mag: 0.77, spec: 'B', distLy: 320, isNavAnchor: true, desc: 'Southern anchor of Crux. Brilliant multiple blue-white subgiant system.' },
            { id: 'mimosa', name: 'Mimosa (Becrux)', bayer: 'β Cru', ra: 12.79, dec: -59.69, mag: 1.25, spec: 'B', distLy: 280, desc: 'Eastern arm of the Cross. Pulsating Beta Cephei variable blue giant.' },
            { id: 'gacrux', name: 'Gacrux', bayer: 'γ Cru', ra: 12.52, dec: -57.11, mag: 1.64, spec: 'M', distLy: 88.6, desc: 'Northern apex of the Cross. Cool red giant providing vivid color contrast against the three blue companions.' },
            { id: 'crux_delta', name: 'Imai', bayer: 'δ Cru', ra: 12.25, dec: -58.75, mag: 2.79, spec: 'B', distLy: 345, desc: 'Western arm of the Cross.' },
            { id: 'ginan', name: 'Ginan', bayer: 'ε Cru', ra: 12.35, dec: -60.40, mag: 3.59, spec: 'K', distLy: 228, desc: 'Fifth orange star inside the lower cross diamond, featured on the national flags of Australia, Brazil, and Papua New Guinea.' }
        ],
        lines: [
            ['gacrux', 'acrux'],
            ['crux_delta', 'mimosa'],
            ['crux_delta', 'ginan'],
            ['ginan', 'acrux']
        ]
    },
    {
        id: 'scorpius',
        name: 'Scorpius',
        title: 'The Great Scorpion & Antares',
        season: 'Summer',
        hemisphere: 'South / Equatorial',
        centerRA: 16.5,
        centerDec: -30.0,
        difficulty: 4,
        artSvg: 'scorpion',
        description: 'One of the grandest constellations in the heavens, tracing an enormous curving fishhook across the dense core of the Milky Way.',
        lore: {
            greek: 'The giant scorpion sent by Gaia to slay Orion. To this day, when Scorpius rises in the east, Orion flees and sets in the west.',
            arabic: 'Antares is "Qalb al-\'Aqrab" (The Heart of the Scorpion), pulsating with fiery crimson vitality.',
            vedic: 'Home to "Jyeshtha" (The Eldest / Chief Queen) and "Mula" (The Root / Galactic Center), sacred nakshatra of great power.',
            polynesian: 'Celebrated throughout the Pacific as "Manaiakalani" (The Great Magic Fishhook of Maui), with which the demigod hauled the Hawaiian islands up from the ocean floor!',
            navajo: 'Called "Hastiin Sikʼazii" (The Old Man with Slanted Legs), bringing cool mountain breezes.'
        },
        pointerGuide: {
            title: 'Maui\'s Hook to the Galactic Center',
            instruction: 'Follow the curve of the Scorpion\'s stinger (Shaula and Lesath) into the radiant heart of the Milky Way core.',
            from: 'antares',
            to: 'shaula',
            target: 'shaula',
            distanceMultiplier: 1.0
        },
        stars: [
            { id: 'antares', name: 'Antares', bayer: 'α Sco', ra: 16.49, dec: -26.43, mag: 1.06, spec: 'M', distLy: 550, isNavAnchor: true, desc: 'Greek: "Rival of Mars" (Anti-Ares) for its intense ruby red color. Colossal red supergiant with a radius exceeding the orbit of Mars!' },
            { id: 'graffias', name: 'Acrab', bayer: 'β Sco', ra: 16.09, dec: -19.80, mag: 2.62, spec: 'B', distLy: 400, desc: 'Arabic: "al-\'Aqrab" (The Scorpion). Triple star marking the upper claw.' },
            { id: 'dschubba', name: 'Dschubba', bayer: 'δ Sco', ra: 16.00, dec: -22.62, mag: 2.29, spec: 'B', distLy: 490, desc: 'Arabic: "al-Jabhah" (The Forehead). Center of the scorpion\'s head.' },
            { id: 'shaula', name: 'Shaula', bayer: 'λ Sco', ra: 17.56, dec: -37.10, mag: 1.62, spec: 'B', distLy: 570, desc: 'Arabic: "ash-Shawlā\'" (The Raised Tail / Stinger). Brilliant multiple star at the stinger tip.' },
            { id: 'lesath', name: 'Lesath', bayer: 'υ Sco', ra: 17.51, dec: -37.30, mag: 2.70, spec: 'B', distLy: 580, desc: 'Together with Shaula forms the "Cat\'s Eyes" asterism guarding the stinger.' },
            { id: 'sargas', name: 'Sargas', bayer: 'θ Sco', ra: 17.62, dec: -43.00, mag: 1.86, spec: 'F', distLy: 300, desc: 'Bright yellow giant on the lower tail curve.' }
        ],
        lines: [
            ['graffias', 'dschubba'],
            ['dschubba', 'antares'],
            ['antares', 'sargas'],
            ['sargas', 'shaula'],
            ['shaula', 'lesath']
        ]
    },
    {
        id: 'pegasus',
        name: 'Pegasus',
        title: 'The Winged Horse & Great Square',
        season: 'Autumn',
        hemisphere: 'North',
        centerRA: 22.5,
        centerDec: 20.0,
        difficulty: 4,
        artSvg: 'horse',
        description: 'The monumental Great Square of Pegasus dominates the crisp autumn sky, pointing the way to Andromeda and the cosmic ocean.',
        lore: {
            greek: 'The magnificent divine winged stallion sired by Poseidon that flew up to Mount Olympus to serve Zeus.',
            arabic: 'The Great Square is "al-Dalw" (The Great Well Bucket), bringing water of life from the celestial source.',
            vedic: 'Associated with the dual Nakshatras "Purva Bhadrapada" and "Uttara Bhadrapada" (The Auspicious Star Legs of the Cosmic Steed).',
            polynesian: 'Known as "Manokalanipo", marking the high zenith crossing for autumn voyages.',
            navajo: 'A sacred celestial creature galloping across the dome of night.'
        },
        pointerGuide: {
            title: 'Gateway to Andromeda',
            instruction: 'Use the northeast corner of the Great Square (Alpheratz) as the bridge to chart the Andromeda constellation and galaxy.',
            from: 'scheat',
            to: 'alpheratz',
            target: 'alpheratz',
            distanceMultiplier: 1.0
        },
        stars: [
            { id: 'markab', name: 'Markab', bayer: 'α Peg', ra: 23.08, dec: 15.21, mag: 2.49, spec: 'B', distLy: 133, desc: 'Arabic: "al-Markab" (The Saddle). Southwest corner of the Great Square.' },
            { id: 'scheat', name: 'Scheat', bayer: 'β Peg', ra: 23.06, dec: 28.08, mag: 2.44, spec: 'M', distLy: 196, desc: 'Arabic: "ash-Shāq" (The Shin / Foreleg). Luminous pulsating red giant at northwest corner.' },
            { id: 'algenib', name: 'Algenib', bayer: 'γ Peg', ra: 0.22, dec: 15.18, mag: 2.84, spec: 'B', distLy: 390, desc: 'Arabic: "al-Janb" (The Flank). Southeast corner star.' },
            { id: 'alpheratz', name: 'Alpheratz', bayer: 'α And', ra: 0.14, dec: 29.09, mag: 2.07, spec: 'B', distLy: 97, desc: 'Arabic: "Surrat al-Faras" (Navel of the Horse). Shared head star linking Pegasus to Andromeda!' },
            { id: 'enif', name: 'Enif', bayer: 'ε Peg', ra: 21.74, dec: 9.87, mag: 2.38, spec: 'K', distLy: 690, desc: 'Arabic: "al-Anf" (The Muzzle / Nose). Supergiant marking the tip of the horse\'s nose.' }
        ],
        lines: [
            ['markab', 'scheat'],
            ['scheat', 'alpheratz'],
            ['alpheratz', 'algenib'],
            ['algenib', 'markab'],
            ['markab', 'enif']
        ]
    }
];

export const CHAPTERS = [
    {
        id: 'chapter_1',
        number: 1,
        title: 'The Circumpolar Guides',
        subtitle: 'Orient the Ancient Mariner\'s Compass',
        era: 'Ancient Mediterranean & Aegean Sea (c. 1200 BCE)',
        theme: 'brass_compass',
        constellations: ['ursa_major', 'ursa_minor', 'cassiopeia'],
        storyIntro: 'The seas are cloaked in eternal twilight and your brass astrolabe has lost its calibration. To navigate your ship through the fog of the northern ocean, you must reconstruct the Great Bear, draw the pointer line to the North Star (Polaris), and verify your heading with the Queen\'s Crown.',
        objective: 'Link Ursa Major, fire the pointer ray to ignite Polaris, and chart Cassiopeia to unlock true North.',
        rewardBadge: '🧭 North Star Wayfinder',
        requiredStarLocks: 3
    },
    {
        id: 'chapter_2',
        number: 2,
        title: 'The Winter Giants',
        subtitle: 'The Great Hexagon & The Follower',
        era: 'Silk Road & Classical Arabian Observatories (c. 850 CE)',
        theme: 'desert_astrolabe',
        constellations: ['orion', 'canis_major', 'taurus'],
        storyIntro: 'Crossing the shifting sands of the Rub\' al Khali desert by night, caravan navigators rely upon the Hunter. You must link Orion\'s belt of pearls, cast the dual pointer ray down to blazing Sirius and up to fiery Aldebaran, and reveal the Pleiades.',
        objective: 'Construct Orion, navigate to Sirius and Aldebaran using the belt pointer, and light the Winter Crossroads.',
        rewardBadge: '🌟 Master of the Winter Hexagon',
        requiredStarLocks: 3
    },
    {
        id: 'chapter_3',
        number: 3,
        title: 'The Summer Triangle',
        subtitle: 'The River of Heaven & Celestial Swan',
        era: 'Vedic Rishis & Tang Dynasty Stargazers (c. 720 CE)',
        theme: 'celestial_river',
        constellations: ['cygnus', 'lyra', 'aquila'],
        storyIntro: 'The Great River of Heaven (the Milky Way) flows split in two across the warm summer sky. Reconnect the three anchor vertices — Vega the Weaver Maiden, Altair the Cowherd, and Deneb the Celestial Swan — to bridge the cosmic rift.',
        objective: 'Link Cygnus, Lyra, and Aquila to forge the sacred Summer Triangle across the galactic dark lanes.',
        rewardBadge: '🦅 Guardian of the Celestial River',
        requiredStarLocks: 3
    },
    {
        id: 'chapter_4',
        number: 4,
        title: 'The Southern Wayfinders',
        subtitle: 'Ocean Swells & The True South',
        era: 'Polynesian Double-Hulled Canoe Voyagers (c. 1000 CE)',
        theme: 'polynesian_ocean',
        constellations: ['crux', 'scorpius'],
        storyIntro: 'Sailing thousands of miles of open Pacific waters without modern charts, your crew reads the ocean swells and the southern stars. Align the Sacred Southern Cross and trace Maui\'s Magic Fishhook (Scorpius) as it pulls islands from the deep.',
        objective: 'Chart Crux, extend the pointer axis to locate the South Celestial Pole, and reconstruct Maui\'s Hook.',
        rewardBadge: '🛶 Grand Pacific Navigator',
        requiredStarLocks: 2
    },
    {
        id: 'chapter_5',
        number: 5,
        title: 'The Autumn Legends',
        subtitle: 'The Winged Steed & The Great Void',
        era: 'Alexandrian Library Astronomers (c. 150 CE)',
        theme: 'alexandrian_library',
        constellations: ['pegasus', 'cassiopeia'],
        storyIntro: 'The autumn nights grow crisp. Unfurl the Great Square of Pegasus to open the portal to distant galaxies beyond our own starry realm, completing your restoration of the Celestial Cartography.',
        objective: 'Link Pegasus, align the Great Square, and reveal the cosmic spiral of Andromeda.',
        rewardBadge: '👑 Supreme Celestial Cartographer',
        requiredStarLocks: 2
    }
];

export const DAILY_CHALLENGES = [
    {
        title: 'The Hunter\'s Midnight Watch',
        targetId: 'orion',
        hemisphere: 'North / Equatorial',
        flavor: 'Tonight the winter titan Orion stands at zenith. Find and connect all 8 anchor stars in under 90 seconds!',
        timeLimitSec: 90
    },
    {
        title: 'Guiding the Sea Voyage',
        targetId: 'ursa_major',
        hemisphere: 'North',
        flavor: 'Reconstruct the Big Dipper and fire the pointer ray to Polaris to calibrate the mariner\'s compass.',
        timeLimitSec: 75
    },
    {
        title: 'The Weaver and the Cowherd',
        targetId: 'lyra',
        hemisphere: 'North',
        flavor: 'Chart Vega and the celestial harp Lyra to illuminate the northern river bank.',
        timeLimitSec: 60
    },
    {
        title: 'The South Sea Anchor',
        targetId: 'crux',
        hemisphere: 'South',
        flavor: 'Find the Southern Cross in the southern horizon and extend its pointer axis to locate the pole.',
        timeLimitSec: 60
    },
    {
        title: 'Maui\'s Oceanic Hook',
        targetId: 'scorpius',
        hemisphere: 'South',
        flavor: 'Connect the glowing curves of Scorpius and ignite ruby Antares at its heart.',
        timeLimitSec: 80
    }
];
