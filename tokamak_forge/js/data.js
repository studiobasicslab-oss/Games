/**
 * TOKAMAK FORGE: Nuclear Physics & Stellar Nucleosynthesis Database
 * Real isotope masses, binding energies per nucleon, decay modes, half-lives, and 12 Astrophysical Eras.
 */

window.TOKAMAK_DATA = {
    // Nuclear Constants & Magic Numbers (extra nuclear stability)
    magicNumbers: [2, 8, 20, 28, 50, 82, 126],

    // Elemental Isotopes for Physics & Merging
    isotopes: [
        {
            id: "H1",
            symbol: "¹H",
            name: "Protium (Hydrogen-1)",
            Z: 1, // Protons
            N: 0, // Neutrons
            A: 1, // Mass Number
            radius: 18,
            color: "#67e8f9",
            glow: "rgba(6, 182, 212, 0.6)",
            massAmu: 1.0078,
            bindingEnergyPerNucleon: 0.0,
            halfLifeSec: Infinity,
            isStable: true,
            fusesWith: {
                "H1": { product: "H2", energyMeV: 1.44, particle: "β+ (Positron + Neutrino)" },
                "H2": { product: "He3", energyMeV: 5.49, particle: "γ (Gamma Ray)" },
                "H3": { product: "He4", energyMeV: 19.8, particle: "γ (Gamma Ray)" }
            },
            lore: "The most abundant baryon in the cosmos. Formed in the first 3 minutes after the Big Bang."
        },
        {
            id: "H2",
            symbol: "²H",
            name: "Deuterium (Heavy Hydrogen)",
            Z: 1,
            N: 1,
            A: 2,
            radius: 22,
            color: "#38bdf8",
            glow: "rgba(56, 189, 248, 0.6)",
            massAmu: 2.0141,
            bindingEnergyPerNucleon: 1.11,
            halfLifeSec: Infinity,
            isStable: true,
            fusesWith: {
                "H2": { product: "He3", energyMeV: 3.27, particle: "n (Neutron)" },
                "H3": { product: "He4", energyMeV: 17.59, particle: "n (Fast Neutron 14.1 MeV)" }
            },
            lore: "Key fuel for terrestrial Tokamak reactors (D-T fusion). Abundant in ocean water."
        },
        {
            id: "H3",
            symbol: "³H",
            name: "Tritium",
            Z: 1,
            N: 2,
            A: 3,
            radius: 24,
            color: "#818cf8",
            glow: "rgba(129, 140, 248, 0.6)",
            massAmu: 3.0160,
            bindingEnergyPerNucleon: 2.83,
            halfLifeSec: 25, // Gamified for excitement
            isStable: false,
            decayMode: "β- decay → ³He (electron emitted)",
            decayProduct: "He3",
            fusesWith: {
                "H2": { product: "He4", energyMeV: 17.59, particle: "n (Fast Neutron)" },
                "H3": { product: "He4", energyMeV: 11.33, particle: "2n" }
            },
            lore: "Radioactive isotope with 12.3-year natural half-life. Emits beta electrons as it decays to Helium-3."
        },
        {
            id: "He3",
            symbol: "³He",
            name: "Helium-3",
            Z: 2,
            N: 1,
            A: 3,
            radius: 26,
            color: "#a78bfa",
            glow: "rgba(167, 139, 250, 0.6)",
            massAmu: 3.0160,
            bindingEnergyPerNucleon: 2.57,
            halfLifeSec: Infinity,
            isStable: true,
            fusesWith: {
                "He3": { product: "He4", energyMeV: 12.86, particle: "2 × ¹H" },
                "H2": { product: "He4", energyMeV: 18.35, particle: "¹H" }
            },
            lore: "Clean aneutronic fusion fuel. Rare on Earth, heavily deposited on the lunar regolith by solar wind."
        },
        {
            id: "He4",
            symbol: "⁴He",
            name: "Alpha Particle (Helium-4)",
            Z: 2,
            N: 2,
            A: 4,
            radius: 30,
            color: "#10b981",
            glow: "rgba(16, 185, 129, 0.7)",
            massAmu: 4.0026,
            bindingEnergyPerNucleon: 7.07, // Doubly magic nucleus (Z=2, N=2)
            halfLifeSec: Infinity,
            isStable: true,
            fusesWith: {
                "He4": { product: "Be8", energyMeV: -0.092, particle: "Resonant state" }
            },
            lore: "Doubly Magic Nucleus (Z=2, N=2). Tightly bound and extremely stable alpha particle."
        },
        {
            id: "Be8",
            symbol: "⁸Be",
            name: "Beryllium-8 (Resonance)",
            Z: 4,
            N: 4,
            A: 8,
            radius: 34,
            color: "#f43f5e",
            glow: "rgba(244, 63, 94, 0.8)",
            massAmu: 8.0053,
            bindingEnergyPerNucleon: 7.06,
            halfLifeSec: 6, // Ultra short in reality (10^-16s), gamified
            isStable: false,
            decayMode: "Spontaneous Fission → 2 × ⁴He",
            decayProduct: "He4", // Splits into two He4
            fusesWith: {
                "He4": { product: "C12", energyMeV: 7.27, particle: "γ (Hoyle State Carbon)" }
            },
            lore: "Extremely fleeting resonance step in the Triple-Alpha process. Must capture a third Alpha before decaying!"
        },
        {
            id: "C12",
            symbol: "¹²C",
            name: "Carbon-12",
            Z: 6,
            N: 6,
            A: 12,
            radius: 40,
            color: "#f59e0b",
            glow: "rgba(245, 158, 11, 0.7)",
            massAmu: 12.0000,
            bindingEnergyPerNucleon: 7.68,
            halfLifeSec: Infinity,
            isStable: true,
            fusesWith: {
                "He4": { product: "O16", energyMeV: 7.16, particle: "γ (Gamma Ray)" },
                "C12": { product: "Ne20", energyMeV: 4.62, particle: "⁴He" }
            },
            lore: "The atomic basis of organic life. Synthesized inside Red Giant stars via the Hoyle resonance."
        },
        {
            id: "O16",
            symbol: "¹⁶O",
            name: "Oxygen-16",
            Z: 8,
            N: 8,
            A: 16,
            radius: 46,
            color: "#06b6d4",
            glow: "rgba(6, 182, 212, 0.7)",
            massAmu: 15.9949,
            bindingEnergyPerNucleon: 7.98, // Doubly magic (Z=8, N=8)
            halfLifeSec: Infinity,
            isStable: true,
            fusesWith: {
                "He4": { product: "Ne20", energyMeV: 4.73, particle: "γ" },
                "O16": { product: "Si28", energyMeV: 9.59, particle: "⁴He" }
            },
            lore: "Doubly magic nucleus (Z=8, N=8). Created by alpha capture on Carbon-12 in late stellar burning."
        },
        {
            id: "Ne20",
            symbol: "²⁰Ne",
            name: "Neon-20",
            Z: 10,
            N: 10,
            A: 20,
            radius: 50,
            color: "#ec4899",
            glow: "rgba(236, 72, 153, 0.7)",
            massAmu: 19.9924,
            bindingEnergyPerNucleon: 8.03,
            halfLifeSec: Infinity,
            isStable: true,
            fusesWith: {
                "He4": { product: "Mg24", energyMeV: 9.32, particle: "γ" }
            },
            lore: "Noble gas isotope formed in massive stars during the Neon burning process."
        },
        {
            id: "Si28",
            symbol: "²⁸Si",
            name: "Silicon-28",
            Z: 14,
            N: 14,
            A: 28,
            radius: 56,
            color: "#eab308",
            glow: "rgba(234, 179, 8, 0.8)",
            massAmu: 27.9769,
            bindingEnergyPerNucleon: 8.45,
            halfLifeSec: Infinity,
            isStable: true,
            fusesWith: {
                "He4": { product: "S32", energyMeV: 6.95, particle: "γ" },
                "Si28": { product: "Ni56", energyMeV: 10.92, particle: "Photodisintegration balance" }
            },
            lore: "Formed in the core of massive stars at 3 billion Kelvin in the final days before a Supernova."
        },
        {
            id: "Ni56",
            symbol: "⁵⁶Ni",
            name: "Nickel-56 (Supernova Ash)",
            Z: 28,
            N: 28,
            A: 56,
            radius: 62,
            color: "#fb7185",
            glow: "rgba(251, 113, 133, 0.8)",
            massAmu: 55.9421,
            bindingEnergyPerNucleon: 8.64,
            halfLifeSec: 18,
            isStable: false,
            decayMode: "2-Stage β+ Decay → ⁵⁶Co → ⁵⁶Fe (Powers Supernova Light Curve)",
            decayProduct: "Fe56",
            fusesWith: {},
            lore: "Doubly magic radioactive isotope. Its 6-day beta decay into Cobalt and Iron powers the blinding glow of Supernovae."
        },
        {
            id: "Fe56",
            symbol: "⁵⁶Fe",
            name: "Iron-56 (The Nuclear Dead End)",
            Z: 26,
            N: 30,
            A: 56,
            radius: 68,
            color: "#ffffff",
            glow: "rgba(255, 255, 255, 0.9)",
            massAmu: 55.9349,
            bindingEnergyPerNucleon: 8.79, // Peak of binding energy per nucleon curve
            halfLifeSec: Infinity,
            isStable: true,
            fusesWith: {},
            lore: "The Peak of Nuclear Stability ($8.79\\text{ MeV/nucleon}$). Fusion beyond Iron consumes energy rather than releasing it, triggering stellar core collapse."
        },
        {
            id: "Au197",
            symbol: "¹⁹⁷Au",
            name: "Gold-197 (r-process)",
            Z: 79,
            N: 118,
            A: 197,
            radius: 74,
            color: "#fde047",
            glow: "rgba(253, 224, 71, 0.9)",
            massAmu: 196.9665,
            bindingEnergyPerNucleon: 7.91,
            halfLifeSec: Infinity,
            isStable: true,
            fusesWith: {},
            lore: "Noble heavy element forged exclusively in cataclysmic neutron star mergers (kilonovae) and core-collapse supernovae."
        },
        {
            id: "U235",
            symbol: "²³⁵U",
            name: "Uranium-235 (Fissile)",
            Z: 92,
            N: 143,
            A: 235,
            radius: 80,
            color: "#4ade80",
            glow: "rgba(74, 222, 128, 0.9)",
            massAmu: 235.0439,
            bindingEnergyPerNucleon: 7.59,
            halfLifeSec: 30,
            isStable: false,
            decayMode: "Alpha Decay + Induced Thermal Fission",
            decayProduct: "Ba141",
            fusesWith: {},
            lore: "Primordial fissile isotope. Absorbing a stray thermal neutron causes instant fission into two lighter nuclei + 200 MeV energy."
        }
    ],

    // 12 Structured Campaign Eras (From Big Bang to Supernova & Heavy Elements)
    campaignEras: [
        {
            id: 1,
            era: "ERA 01 // BIG BANG NUCLEOSYNTHESIS",
            title: "Primordial Flash (t + 3 Minutes)",
            targetGoal: "Fuse 4 × Protium (¹H) into Helium-4 (⁴He) to build the cosmic primordial abundance.",
            targetElements: ["He4"],
            dropPool: ["H1", "H2"],
            targetYieldMeV: 50,
            chamberTempMK: 15,
            lore: "3 minutes after the Big Bang, the universe cools enough for protons and neutrons to bind into Deuterium and Helium-4."
        },
        {
            id: 2,
            era: "ERA 02 // MAIN SEQUENCE STELLAR CORE",
            title: "The Proton-Proton Chain (Sun-like Stars)",
            targetGoal: "Synthesize 2 × Helium-3 (³He) and fuse them into Helium-4 + 2 protons.",
            targetElements: ["He3", "He4"],
            dropPool: ["H1", "H2", "H3"],
            targetYieldMeV: 120,
            chamberTempMK: 20,
            lore: "Inside the core of the Sun, 600 million tons of hydrogen are fused into helium every second at 15 million Kelvin."
        },
        {
            id: 3,
            era: "ERA 03 // TERRESTRIAL TOKAMAK IGNITION",
            title: "Deuterium-Tritium Magnetic Confinement",
            targetGoal: "Collide ²H (Deuterium) with ³H (Tritium) before Tritium decays to reach Q > 2.0 ignition.",
            targetElements: ["He4"],
            dropPool: ["H2", "H3"],
            targetYieldMeV: 200,
            chamberTempMK: 150, // 150 million Kelvin (10x core of sun)
            lore: "Commercial fusion reactors utilize D-T fuel due to its massive 17.6 MeV cross-section at achievable temperatures."
        },
        {
            id: 4,
            era: "ERA 04 // RED GIANT TRIPLE-ALPHA",
            title: "The Hoyle Carbon Resonance",
            targetGoal: "Fuse two ⁴He into unstable ⁸Be, and immediately capture a third ⁴He into Carbon-12 (¹²C) before decay!",
            targetElements: ["C12"],
            dropPool: ["He4", "H2"],
            targetYieldMeV: 350,
            chamberTempMK: 200,
            lore: "Beryllium-8 survives for only $10^{-16}$ seconds. Without Fred Hoyle's 7.65 MeV nuclear resonance in Carbon-12, life in the universe could not exist."
        },
        {
            id: 5,
            era: "ERA 05 // HELIUM SHELL FLASH",
            title: "Alpha Capture to Oxygen-16",
            targetGoal: "Bombard Carbon-12 with ⁴He to synthesize Oxygen-16 (¹⁶O).",
            targetElements: ["O16"],
            dropPool: ["C12", "He4"],
            targetYieldMeV: 500,
            chamberTempMK: 300,
            lore: "In mature giant stars, alpha capture on Carbon-12 creates Oxygen-16, the third most abundant element in the universe."
        },
        {
            id: 6,
            era: "ERA 06 // CARBON & NEON BURNING",
            title: "Supergiant Onion Core",
            targetGoal: "Fuse ¹²C + ¹²C to create Neon-20 (²⁰Ne) and Alpha particles.",
            targetElements: ["Ne20"],
            dropPool: ["C12", "He4"],
            targetYieldMeV: 750,
            chamberTempMK: 800,
            lore: "At 800 million Kelvin, massive stars ignite carbon burning, lasting just a few hundred years in the star's lifetime."
        },
        {
            id: 7,
            era: "ERA 07 // SILICON BURNING FLASH",
            title: "The 24-Hour Silicon Core",
            targetGoal: "Stepwise alpha captures to build Silicon-28 (²⁸Si).",
            targetElements: ["Si28"],
            dropPool: ["O16", "He4", "C12"],
            targetYieldMeV: 1200,
            chamberTempMK: 3000,
            lore: "Silicon burning takes place at 3 billion Kelvin and exhausts the entire core in less than 24 hours!"
        },
        {
            id: 8,
            era: "ERA 08 // THE IRON DEAD END",
            title: "Peak Binding Energy Barrier",
            targetGoal: "Synthesize Nickel-56 (⁵⁶Ni) and observe its beta decay into Iron-56 (⁵⁶Fe).",
            targetElements: ["Fe56"],
            dropPool: ["Si28", "He4", "O16"],
            targetYieldMeV: 2000,
            chamberTempMK: 4000,
            lore: "Iron-56 possesses the maximum binding energy per nucleon ($8.79\\text{ MeV}$). Any further fusion absorbs energy and kills the star."
        },
        {
            id: 9,
            era: "ERA 09 // CORE COLLAPSE SUPERNOVA",
            title: "Rapid Neutron Capture (r-Process)",
            targetGoal: "Survive the shockwave and forge Gold-197 (¹⁹⁷Au) through rapid neutron capture.",
            targetElements: ["Au197"],
            dropPool: ["Fe56", "He4", "H2"],
            targetYieldMeV: 3500,
            chamberTempMK: 8000,
            lore: "When the iron core collapses into a neutron star, an enormous flux of free neutrons builds precious heavy elements like Gold and Platinum in seconds."
        },
        {
            id: 10,
            era: "ERA 10 // ACTINIDE SYNTHESIS",
            title: "Primordial Uranium-235",
            targetGoal: "Forge Uranium-235 (²³⁵U) and manage its fission decay instability.",
            targetElements: ["U235"],
            dropPool: ["Au197", "He4", "Si28"],
            targetYieldMeV: 5000,
            chamberTempMK: 10000,
            lore: "Supernovae produce long-lived actinides like Uranium-235 and Thorium-232, which later heat planetary cores through radioactive decay."
        },
        {
            id: 11,
            era: "ERA 11 // THE ISLAND OF STABILITY",
            title: "Superheavy Element Synthesis (Z=114)",
            targetGoal: "Synthesize superheavy elements with magic spherical neutron shells.",
            targetElements: ["U235", "Au197", "Fe56"],
            dropPool: ["U235", "He4", "Si28"],
            targetYieldMeV: 7500,
            chamberTempMK: 12000,
            lore: "Nuclear physicists predict an 'Island of Stability' around neutron number 184 and proton numbers 114-126 where superheavy nuclei could endure for minutes or hours."
        },
        {
            id: 12,
            era: "ERA 12 // COSMIC NUCLEOSYNTHESIS MASTER",
            title: "Total Plasma Confinement Master",
            targetGoal: "Achieve continuous net-positive Q > 5.0 fusion output without a thermal quench.",
            targetElements: ["Fe56", "Au197", "U235"],
            dropPool: ["H1", "H2", "H3", "He4", "C12"],
            targetYieldMeV: 10000,
            chamberTempMK: 15000,
            lore: "You have mastered the physical laws governing stars, tokamaks, and supernovae across 13.8 billion years of cosmic evolution."
        }
    ]
};
