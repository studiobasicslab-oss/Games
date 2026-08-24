/**
 * Etymo-Tree: The Root Shifter - Comparative Linguistic Database
 */

const ETYMO_PUZZLES = [
    {
        id: 1,
        concept: "Father (Ancestral Kin)",
        meaning: "Male parent / elder patriarch",
        correctRoot: "*ph₂tḗr",
        targetBranchLaw: "grimms_law_p_f",
        rootCandidates: ["*ph₂tḗr", "*méh₂tēr", "*bʰréh₂tēr", "*h₂nḗr"],
        words: [
            { id: 'w_eng_father', lang: 'English (Germanic)', term: 'Father', isFalseFriend: false },
            { id: 'w_lat_pater', lang: 'Latin (Italic)', term: 'Pater', isFalseFriend: false },
            { id: 'w_san_pitr', lang: 'Sanskrit (Indo-Aryan)', term: 'Pitṛ (पितृ)', isFalseFriend: false },
            { id: 'w_gre_pater', lang: 'Ancient Greek (Hellenic)', term: 'Patḗr (πατήρ)', isFalseFriend: false },
            { id: 'w_ger_vater', lang: 'German (Germanic)', term: 'Vater', isFalseFriend: false },
            { id: 'w_ara_ab', lang: 'Arabic (Semitic)', term: 'Ab (أب)', isFalseFriend: true, note: 'Deceptive non-IE Semitic lookalike!' }
        ],
        explanation: "PIE *ph₂tḗr shifted initial *p ➔ *f in Proto-Germanic via Grimm's Law, yielding English 'Father' while Romance retained Latin 'Pater'."
    },
    {
        id: 2,
        concept: "Hound / Canine (The Hunter)",
        meaning: "Domestic dog / hunting hound",
        correctRoot: "*ḱwṓn",
        targetBranchLaw: "grimms_law_p_f",
        rootCandidates: ["*ḱwṓn", "*wĺ̥kʷos", "*h₂ŕ̥tḱos", "*gʷṓws"],
        words: [
            { id: 'w_eng_hound', lang: 'English (Germanic)', term: 'Hound', isFalseFriend: false },
            { id: 'w_lat_canis', lang: 'Latin (Italic)', term: 'Canis', isFalseFriend: false },
            { id: 'w_gre_kyon', lang: 'Greek (Hellenic)', term: 'Kyōn (κύων)', isFalseFriend: false },
            { id: 'w_san_svan', lang: 'Sanskrit (Indo-Aryan)', term: 'Śvan (श्वन्)', isFalseFriend: false },
            { id: 'w_mba_dog', lang: 'Mbabaram (Australian Indigenous)', term: 'Dog (gúdrru)', isFalseFriend: true, note: 'Famous coincidence trap: Australian Mbabaram happened to sound like English dog with 0 shared ancestry!' }
        ],
        explanation: "PIE *ḱwṓn shifted initial palatovelar *ḱ ➔ *h in Germanic (Hound) and *k in Latin (Canis ➔ Canine)."
    },
    {
        id: 3,
        concept: "Water (The Flowing Stream)",
        meaning: "Living water / aqueous element",
        correctRoot: "*wódr̥",
        targetBranchLaw: "high_german_shift",
        rootCandidates: ["*wódr̥", "*h₂ékʷeh₂", "*móri", "*péh₃-"],
        words: [
            { id: 'w_eng_water', lang: 'English (Germanic)', term: 'Water', isFalseFriend: false },
            { id: 'w_ger_wasser', lang: 'German (Germanic)', term: 'Wasser', isFalseFriend: false },
            { id: 'w_rus_voda', lang: 'Russian (Slavic)', term: 'Voda (Вода)', isFalseFriend: false },
            { id: 'w_gre_hydor', lang: 'Greek (Hellenic)', term: 'Hydōr (ὕδωρ)', isFalseFriend: false },
            { id: 'w_san_udan', lang: 'Sanskrit (Indo-Aryan)', term: 'Udan (उदन्)', isFalseFriend: false },
            { id: 'w_nah_atl', lang: 'Nahuatl (Uto-Aztecan)', term: 'Ātl', isFalseFriend: true, note: 'Indigenous Mesoamerican root!' }
        ],
        explanation: "Proto-Germanic *watōr shifted *t ➔ *ss in Old High German ('Wasser'), while Greek preserved 'Hydōr' (hydro-)."
    },
    {
        id: 4,
        concept: "Heart (The Vital Center)",
        meaning: "Anatomical & spiritual core",
        correctRoot: "*ḱḗr / *ḱr̥d",
        targetBranchLaw: "grimms_law_p_f",
        rootCandidates: ["*ḱḗr / *ḱr̥d", "*h₂nḗr", "*men-", "*h₁éngʷʰnis"],
        words: [
            { id: 'w_eng_heart', lang: 'English (Germanic)', term: 'Heart', isFalseFriend: false },
            { id: 'w_lat_cor', lang: 'Latin (Italic)', term: 'Cor / Cordis', isFalseFriend: false },
            { id: 'w_gre_kardia', lang: 'Greek (Hellenic)', term: 'Kardia (καρδία)', isFalseFriend: false },
            { id: 'w_san_hrd', lang: 'Sanskrit (Indo-Aryan)', term: 'Hṛd (हृद्)', isFalseFriend: false },
            { id: 'w_rus_serdtse', lang: 'Russian (Slavic)', term: 'Serdtse (Сердце)', isFalseFriend: false },
            { id: 'w_heb_lev', lang: 'Hebrew (Semitic)', term: 'Lēv (לֵב)', isFalseFriend: true, note: 'Semitic Afroasiatic root!' }
        ],
        explanation: "PIE *ḱr̥d gave Germanic 'Heart' via Grimm's Law (*k ➔ *h), Greek 'Kardia' (cardiac), and Latin 'Cor' (cordial)."
    },
    {
        id: 5,
        concept: "Ten (The Decimal Count)",
        meaning: "The count of two hands (10)",
        correctRoot: "*déḱm̥",
        targetBranchLaw: "high_german_shift",
        rootCandidates: ["*déḱm̥", "*óktōw", "*pénkʷe", "*septḿ̥"],
        words: [
            { id: 'w_eng_ten', lang: 'English (Germanic)', term: 'Ten', isFalseFriend: false },
            { id: 'w_lat_decem', lang: 'Latin (Italic)', term: 'Decem', isFalseFriend: false },
            { id: 'w_gre_deka', lang: 'Greek (Hellenic)', term: 'Deka (δέκα)', isFalseFriend: false },
            { id: 'w_san_dasa', lang: 'Sanskrit (Indo-Aryan)', term: 'Daśa (दश)', isFalseFriend: false },
            { id: 'w_ger_zehn', lang: 'German (Germanic)', term: 'Zehn', isFalseFriend: false },
            { id: 'w_chi_shi', lang: 'Mandarin (Sino-Tibetan)', term: 'Shí (十)', isFalseFriend: true, note: 'Sino-Tibetan numeral!' }
        ],
        explanation: "PIE *déḱm̥ shifted initial *d ➔ *t in Germanic (Ten) and *t ➔ *z in High German (Zehn)."
    },
    {
        id: 6,
        concept: "Star (The Celestial Luminary)",
        meaning: "Night sky point of light",
        correctRoot: "*h₂stḗr",
        targetBranchLaw: "grimms_law_p_f",
        rootCandidates: ["*h₂stḗr", "*sóh₂wl̥", "*méh₁nōs", "*dyḗws"],
        words: [
            { id: 'w_eng_star', lang: 'English (Germanic)', term: 'Star', isFalseFriend: false },
            { id: 'w_lat_stella', lang: 'Latin (Italic)', term: 'Stella', isFalseFriend: false },
            { id: 'w_gre_aster', lang: 'Greek (Hellenic)', term: 'Astēr (ἀστήρ)', isFalseFriend: false },
            { id: 'w_san_tara', lang: 'Sanskrit (Indo-Aryan)', term: 'Tārā (तारा)', isFalseFriend: false },
            { id: 'w_ger_stern', lang: 'German (Germanic)', term: 'Stern', isFalseFriend: false },
            { id: 'w_jap_hoshi', lang: 'Japanese (Japonic)', term: 'Hoshi (星)', isFalseFriend: true, note: 'Japonic isolate root!' }
        ],
        explanation: "PIE *h₂stḗr is the ancestor of English 'Star', Greek 'Astronomy', and Latin 'Constellation'."
    },
    {
        id: 7,
        concept: "Brother (The Kin Companion)",
        meaning: "Male sibling of common parentage",
        correctRoot: "*bʰréh₂tēr",
        targetBranchLaw: "grimms_law_p_f",
        rootCandidates: ["*bʰréh₂tēr", "*swésōr", "*súhnus", "*dʰugh₂tḗr"],
        words: [
            { id: 'w_eng_brother', lang: 'English (Germanic)', term: 'Brother', isFalseFriend: false },
            { id: 'w_lat_frater', lang: 'Latin (Italic)', term: 'Frater', isFalseFriend: false },
            { id: 'w_san_bhratr', lang: 'Sanskrit (Indo-Aryan)', term: 'Bhrātṛ (भ्रातृ)', isFalseFriend: false },
            { id: 'w_rus_brat', lang: 'Russian (Slavic)', term: 'Brat (Брат)', isFalseFriend: false },
            { id: 'w_ger_bruder', lang: 'German (Germanic)', term: 'Bruder', isFalseFriend: false },
            { id: 'w_fin_veli', lang: 'Finnish (Uralic)', term: 'Veli', isFalseFriend: true, note: 'Finno-Ugric Uralic root!' }
        ],
        explanation: "PIE voiced aspirated stop *bʰ shifted to *f in Latin ('Frater' ➔ Fraternal) and *b in Germanic ('Brother')."
    },
    {
        id: 8,
        concept: "Night (The Shadow Realm)",
        meaning: "Dark period between dusk and dawn",
        correctRoot: "*nókʷts",
        targetBranchLaw: "grimms_law_p_f",
        rootCandidates: ["*nókʷts", "*déi-", "*h₂éwsōs", "*kʷrep-"],
        words: [
            { id: 'w_eng_night', lang: 'English (Germanic)', term: 'Night', isFalseFriend: false },
            { id: 'w_lat_nox', lang: 'Latin (Italic)', term: 'Nox / Noctis', isFalseFriend: false },
            { id: 'w_gre_nyx', lang: 'Greek (Hellenic)', term: 'Nyx (νύξ)', isFalseFriend: false },
            { id: 'w_san_nakta', lang: 'Sanskrit (Indo-Aryan)', term: 'Naktā (नक्ता)', isFalseFriend: false },
            { id: 'w_rus_noch', lang: 'Russian (Slavic)', term: 'Noch (Ночь)', isFalseFriend: false },
            { id: 'w_tur_gece', lang: 'Turkish (Turkic)', term: 'Gece', isFalseFriend: true, note: 'Turkic root!' }
        ],
        explanation: "PIE *nókʷts gave rise to English 'Night', Latin 'Nocturnal', and Greek 'Nyx'."
    }
];
