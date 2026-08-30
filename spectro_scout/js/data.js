/**
 * SPECTRO-SCOUT: Exoplanet Spectroscopy & Chemical Fingerprinting Database
 * Authentic absorption wavelengths (nm), Doppler mechanics, and 15 Alien Planetary Systems.
 */

window.SPECTRO_DATA = {
    // Standard Atomic & Molecular Absorption Fingerprints (Wavelengths in nm)
    chemicalTemplates: [
        {
            id: "H2O",
            name: "Water Vapor (H₂O)",
            badge: "💧 Hydrosphere",
            color: "#38bdf8",
            lines: [590, 720, 820, 940], // Prominent absorption band centers
            tolerance: 12,
            desc: "Key indicator for liquid surface oceans and habitable atmospheric cycles."
        },
        {
            id: "O2_O3",
            name: "Oxygen & Ozone (O₂ / O₃)",
            badge: "🌿 Biosignature #1",
            color: "#10b981",
            lines: [688, 762, 600], // Fraunhofer B-band & Chappuis band
            tolerance: 10,
            desc: "Highly reactive gas requiring continuous biological replenishment (photosynthesis)."
        },
        {
            id: "CO2",
            name: "Carbon Dioxide (CO₂)",
            badge: "🌋 Greenhouse Gas",
            color: "#f59e0b",
            lines: [430, 485, 780, 860],
            tolerance: 12,
            desc: "Dominant gas in terrestrial volcanic outgassing and carbon silicate weathering."
        },
        {
            id: "CH4",
            name: "Methane (CH₄)",
            badge: "🐄 Biosignature #2",
            color: "#a855f7",
            lines: [619, 725, 790, 890],
            tolerance: 12,
            desc: "Strong biosignature when detected concurrently with Oxygen (thermodynamic disequilibrium)."
        },
        {
            id: "Na",
            name: "Sodium Doublet (Na D)",
            badge: "🧂 Alkali Metal",
            color: "#fcd34d",
            lines: [589, 590], // Famous Fraunhofer D1 and D2 lines
            tolerance: 6,
            desc: "Prominent in high-temperature upper atmospheres of Hot Jupiters."
        },
        {
            id: "H_Alpha",
            name: "Hydrogen Balmer (H-α / H-β)",
            badge: "⭐ Stellar Primary",
            color: "#f43f5e",
            lines: [486, 656], // H-beta (486nm cyan), H-alpha (656nm deep red)
            tolerance: 8,
            desc: "Primary building block of stellar atmospheres and escaping gas envelopes."
        },
        {
            id: "Fe",
            name: "Vaporized Iron (Fe)",
            badge: "⚙️ Ultra-Hot Vapor",
            color: "#94a3b8",
            lines: [438, 527],
            tolerance: 8,
            desc: "Detected in extreme 2000K+ atmospheres where metal clouds condense into iron rain."
        }
    ],

    // 15 Exoplanetary Systems to Survey
    targets: [
        {
            id: 1,
            title: "Solar Calibration Baseline",
            badge: "SYSTEM #01 // SOL-1",
            difficulty: "Telescope Apprentice",
            starName: "Sol (G2V Yellow Dwarf)",
            planetName: "Earth (Calibration Mode)",
            distanceLy: "0.0 LY",
            targetDopplerKmS: 0, // Zero velocity
            trueChemicals: ["H_Alpha", "O2_O3", "H2O"],
            habitableScore: 100,
            temperatureK: 288,
            description: "Calibrate spectrometer sensors against standard sunlight. Align the Hydrogen Balmer and Oxygen bands at zero Doppler shift.",
            debrief: "Fraunhofer first discovered dark absorption lines in solar light in 1814. Cooler gases in the outer solar and terrestrial atmosphere absorb specific photon wavelengths corresponding to electron energy level jumps."
        },
        {
            id: 2,
            title: "Hot Jupiter Atmospheric Escape",
            badge: "SYSTEM #02 // OSIRIS",
            difficulty: "Telescope Apprentice",
            starName: "HD 209458 (F8V Dwarf)",
            planetName: "HD 209458b (Osiris)",
            distanceLy: "159 LY",
            targetDopplerKmS: +35, // Receding (Redshift)
            trueChemicals: ["Na", "H_Alpha"],
            habitableScore: 0,
            temperatureK: 1450,
            description: "A bloated gas giant orbiting just 0.047 AU from its parent star. Extreme stellar winds are boiling off its hydrogen envelope and vaporizing sodium.",
            debrief: "HD 209458b was the first exoplanet where an atmosphere was directly confirmed via transit spectroscopy (detecting the sharp Sodium D absorption doublet at 589nm)."
        },
        {
            id: 3,
            title: "The Steamy Water World",
            badge: "SYSTEM #03 // OCEAN PLANET",
            difficulty: "Junior Spectroscopist",
            starName: "GJ 1214 (M-Dwarf)",
            planetName: "GJ 1214b",
            distanceLy: "48 LY",
            targetDopplerKmS: -25, // Approaching (Blueshift)
            trueChemicals: ["H2O", "CO2"],
            habitableScore: 45,
            temperatureK: 550,
            description: "A super-Earth with an extraordinarily low bulk density, enveloped by a thick, high-mean-molecular-weight steam atmosphere.",
            debrief: "Infrared transmission spectroscopy reveals broad water vapor absorption bands. Water worlds represent an intermediate class between rocky Terrestrial worlds and gaseous Mini-Neptunes."
        },
        {
            id: 4,
            title: "TRAPPIST-1e Habitable Zone",
            badge: "SYSTEM #04 // EARTH-TWIN CANDIDATE",
            difficulty: "Junior Spectroscopist",
            starName: "TRAPPIST-1 (Ultracool Dwarf)",
            planetName: "TRAPPIST-1e",
            distanceLy: "39.6 LY",
            targetDopplerKmS: +15,
            trueChemicals: ["H2O", "CO2", "O2_O3"],
            habitableScore: 92,
            temperatureK: 251,
            description: "A rocky world in the temperate habitable zone of an ultracool red dwarf. Moderate greenhouse effect and potential surface liquid water oceans.",
            debrief: "TRAPPIST-1e is considered one of the prime targets for James Webb Space Telescope (JWST) to detect an intact secondary atmosphere containing CO2 and water vapor."
        },
        {
            id: 5,
            title: "Proxima Centauri b Radial Wobble",
            badge: "SYSTEM #05 // CLOSEST NEIGHBOR",
            difficulty: "Senior Spectroscopist",
            starName: "Proxima Centauri (M5.5Ve)",
            planetName: "Proxima b",
            distanceLy: "4.24 LY",
            targetDopplerKmS: -45, // High blueshift
            trueChemicals: ["CO2", "H_Alpha"],
            habitableScore: 60,
            temperatureK: 234,
            description: "Our closest exoplanetary neighbor. Orbiting within the star's habitable zone but subject to intense stellar magnetic flares.",
            debrief: "High-resolution Doppler spectrographs like ESPRESSO measure stellar wobble down to 10 cm/s (a slow walking pace!) to identify orbiting planets."
        },
        {
            id: 6,
            title: "Molten Silicate Super-Earth",
            badge: "SYSTEM #06 // LAVA WORLD",
            difficulty: "Senior Spectroscopist",
            starName: "55 Cancri (G8V)",
            planetName: "55 Cancri e (Janssen)",
            distanceLy: "41 LY",
            targetDopplerKmS: +50,
            trueChemicals: ["CO2", "Na", "Fe"],
            habitableScore: 0,
            temperatureK: 2400,
            description: "A tidally locked carbon super-Earth with an ocean of liquid magma on its dayside, evaporating rock and vaporized metals.",
            debrief: "At 2400 Kelvin, rock vapors and volatile gases form a dynamic exosphere with distinct sodium and mineral spectral lines."
        },
        {
            id: 7,
            title: "Atmospheric Disequilibrium Biosignature",
            badge: "SYSTEM #07 // SMOKING GUN BIOLOGY",
            difficulty: "Senior Spectroscopist",
            starName: "Kepler-452 (G2V)",
            planetName: "Kepler-452b ('Earth 2.0')",
            distanceLy: "1402 LY",
            targetDopplerKmS: -10,
            trueChemicals: ["O2_O3", "CH4", "H2O"],
            habitableScore: 98,
            temperatureK: 265,
            description: "A super-Earth with simultaneous detection of Oxygen/Ozone and Methane! These two gases rapidly destroy each other chemically unless continuously produced by living organisms.",
            debrief: "Chemical Disequilibrium: Oxygen and Methane cannot coexist in chemical equilibrium. Their simultaneous atmospheric presence is the ultimate remote biosignature of active alien biology!"
        },
        {
            id: 8,
            title: "Venusian Runaway Greenhouse",
            badge: "SYSTEM #08 // TOXIC RUNAWAY",
            difficulty: "Chief Astrobiologist",
            starName: "Gliese 1132 (M-Dwarf)",
            planetName: "GJ 1132b",
            distanceLy: "39 LY",
            targetDopplerKmS: +20,
            trueChemicals: ["CO2", "H2O"],
            habitableScore: 10,
            temperatureK: 530,
            description: "A terrestrial planet that suffered an irreversible runaway greenhouse effect, blanketing the surface in superheated supercritical CO2.",
            debrief: "When solar flux vaporizes oceans, water vapor enters the stratosphere and is photolyzed by UV into hydrogen (which escapes) and oxygen, leaving a dense CO2 furnace."
        },
        {
            id: 9,
            title: "Iron Rain Ultra-Hot Jupiter",
            badge: "SYSTEM #09 // METALLIC WEATHER",
            difficulty: "Chief Astrobiologist",
            starName: "WASP-76 (F7V)",
            planetName: "WASP-76b",
            distanceLy: "634 LY",
            targetDopplerKmS: -60,
            trueChemicals: ["Fe", "Na", "H_Alpha"],
            habitableScore: 0,
            temperatureK: 2700,
            description: "Tidally locked inferno: Iron vaporizes on the 2700K dayside, blows to the cooler nightside via 18,000 km/h winds, and condenses into liquid iron raindrops.",
            debrief: "Spectroscopic absorption of neutral Iron (Fe I) vanishes at the evening terminator as iron atoms condense from gas into liquid droplets falling as metallic rain."
        },
        {
            id: 10,
            title: "Hycean Habitable Candidate",
            badge: "SYSTEM #10 // HYCEAN WORLD",
            difficulty: "Chief Astrobiologist",
            starName: "K2-18 (M2.5V)",
            planetName: "K2-18b",
            distanceLy: "124 LY",
            targetDopplerKmS: +30,
            trueChemicals: ["CH4", "CO2", "H2O"],
            habitableScore: 85,
            temperatureK: 280,
            description: "A Hydrogen-rich ocean-bearing 'Hycean' world. JWST detected methane and carbon dioxide with a depletion of ammonia, indicating a possible liquid water ocean underneath.",
            debrief: "Hycean worlds have hydrogen-dominated atmospheres that retain heat even at great distances, allowing vast oceans under thick gas envelopes."
        },
        {
            id: 11,
            title: "Relativistic Quasar Redshift",
            badge: "SYSTEM #11 // COSMIC EXPANSION",
            difficulty: "Director of Astro-Forensics",
            starName: "3C 273 (Active Quasar)",
            planetName: "Cosmological Redshift Benchmark",
            distanceLy: "2.4 Billion LY",
            targetDopplerKmS: +120, // Massive cosmological redshift
            trueChemicals: ["H_Alpha", "Na"],
            habitableScore: 0,
            temperatureK: 10000,
            description: "A supermassive black hole accreting matter in the deep universe. Cosmic expansion stretches its Hydrogen-Alpha emission line far into the infrared.",
            debrief: "Cosmological Redshift: Edwin Hubble discovered in 1929 that spectral absorption lines from distant galaxies are shifted towards longer wavelengths ($z = \\Delta \\lambda / \\lambda$), proving the universe is expanding."
        },
        {
            id: 12,
            title: "Interstellar Rogue Planet",
            badge: "SYSTEM #12 // UNBOUND WANDERER",
            difficulty: "Director of Astro-Forensics",
            starName: "None (Free-Floating)",
            planetName: "PSO J318.5-22",
            distanceLy: "80 LY",
            targetDopplerKmS: -15,
            trueChemicals: ["CH4", "H2O", "Fe"],
            habitableScore: 12,
            temperatureK: 1100,
            description: "A planet without a sun, ejected from its natal solar system. Glows faintly in the infrared from residual gravitational contraction heat.",
            debrief: "Direct imaging spectroscopy of rogue planets isolates emission spectra without the blinding glare of a host star."
        },
        {
            id: 13,
            title: "Circumbinary Tatooine Transit",
            badge: "SYSTEM #13 // DUAL SUNS",
            difficulty: "Director of Astro-Forensics",
            starName: "Kepler-16 (K-Dwarf + M-Dwarf)",
            planetName: "Kepler-16b",
            distanceLy: "245 LY",
            targetDopplerKmS: +40,
            trueChemicals: ["CO2", "H2O", "H_Alpha"],
            habitableScore: 40,
            temperatureK: 200,
            description: "Orbits two stars simultaneously. Complex Doppler wobble reflecting the gravitational dance of two suns.",
            debrief: "Circumbinary spectra exhibit splitting and shifting absorption lines that alternately blueshift and redshift as the two stars orbit each other."
        },
        {
            id: 14,
            title: "TRAPPIST-1f Cryogenic Biosphere",
            badge: "SYSTEM #14 // ICE SHELL WORLD",
            difficulty: "Master of Space Science",
            starName: "TRAPPIST-1 (Ultracool Dwarf)",
            planetName: "TRAPPIST-1f",
            distanceLy: "39.6 LY",
            targetDopplerKmS: -30,
            trueChemicals: ["CO2", "O2_O3", "H2O"],
            habitableScore: 80,
            temperatureK: 219,
            description: "A frozen ocean world with a thick nitrogen/CO2 blanket and potential sub-glacial liquid oceans heated by tidal flexing.",
            debrief: "Even outer habitable zone planets can maintain sub-surface biospheres through geothermal venting and tidal dissipation."
        },
        {
            id: 15,
            title: "The Great Oxidation Archean World",
            badge: "SYSTEM #15 // ARCHEAN ANALOGUE",
            difficulty: "Master of Space Science",
            starName: "HD 40307 (K2.5V)",
            planetName: "HD 40307g (Super-Earth)",
            distanceLy: "42 LY",
            targetDopplerKmS: +10,
            trueChemicals: ["O2_O3", "CH4", "CO2", "H2O"],
            habitableScore: 100,
            temperatureK: 279,
            description: "A super-Earth undergoing its Great Oxidation Event! Cyanobacteria are flooding the atmosphere with Oxygen, reacting with primitive Methane.",
            debrief: "Earth's atmosphere 2.4 billion years ago transformed completely when photosynthesis saturated ocean iron sinks, permanently turning our planet's spectrum into a blazing biological beacon."
        }
    ]
};
