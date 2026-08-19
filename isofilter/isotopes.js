/**
 * ISOFILTER: Nuclear Isotope Database
 * Authentic physics & nuclear chemistry properties for logic routing
 */

export const ISOTOPES = [
    // Hydrogen & Helium
    {
        id: 'H-1',
        name: 'Protium',
        symbol: 'H',
        mass: 1,
        atomicNumber: 1,
        element: 'Hydrogen',
        category: 'Non-metal',
        radioactive: false,
        halfLifeSeconds: Infinity,
        halfLifeDisplay: 'Stable',
        decayMode: 'None',
        fissile: false,
        color: '#60a5fa',
        icon: '💧',
        desc: 'Standard hydrogen, 99.98% of natural hydrogen.'
    },
    {
        id: 'H-3',
        name: 'Tritium',
        symbol: 'H',
        mass: 3,
        atomicNumber: 1,
        element: 'Hydrogen',
        category: 'Non-metal',
        radioactive: true,
        halfLifeSeconds: 3.88e8, // ~12.3 years
        halfLifeDisplay: '12.3 years',
        decayMode: 'Beta',
        fissile: false,
        color: '#38bdf8',
        icon: '✨',
        desc: 'Radioactive hydrogen isotope used in luminous watch dials and fusion research.'
    },
    {
        id: 'He-4',
        name: 'Helium-4',
        symbol: 'He',
        mass: 4,
        atomicNumber: 2,
        element: 'Helium',
        category: 'Noble Gas',
        radioactive: false,
        halfLifeSeconds: Infinity,
        halfLifeDisplay: 'Stable',
        decayMode: 'None',
        fissile: false,
        color: '#fbbf24',
        icon: '🎈',
        desc: 'Stable noble gas; identical to an emitted alpha particle.'
    },

    // Carbon & Nitrogen & Oxygen
    {
        id: 'C-12',
        name: 'Carbon-12',
        symbol: 'C',
        mass: 12,
        atomicNumber: 6,
        element: 'Carbon',
        category: 'Non-metal',
        radioactive: false,
        halfLifeSeconds: Infinity,
        halfLifeDisplay: 'Stable',
        decayMode: 'None',
        fissile: false,
        color: '#94a3b8',
        icon: '🪨',
        desc: 'Standard basis for atomic atomic mass units (amu).'
    },
    {
        id: 'C-14',
        name: 'Carbon-14',
        symbol: 'C',
        mass: 14,
        atomicNumber: 6,
        element: 'Carbon',
        category: 'Non-metal',
        radioactive: true,
        halfLifeSeconds: 1.8e11, // ~5,730 years
        halfLifeDisplay: '5,730 years',
        decayMode: 'Beta',
        fissile: false,
        color: '#a3e635',
        icon: '🦴',
        desc: 'Cosmogenic radiocarbon used in archaeological radiometric dating.'
    },

    // Light Metals & Halogens
    {
        id: 'Na-24',
        name: 'Sodium-24',
        symbol: 'Na',
        mass: 24,
        atomicNumber: 11,
        element: 'Sodium',
        category: 'Alkali Metal',
        radioactive: true,
        halfLifeSeconds: 53820, // ~15 hours
        halfLifeDisplay: '15 hours',
        decayMode: 'Beta',
        fissile: false,
        color: '#f97316',
        icon: '🧂',
        desc: 'Short-lived beta emitter used as an industrial leak tracer.'
    },
    {
        id: 'Fe-56',
        name: 'Iron-56',
        symbol: 'Fe',
        mass: 56,
        atomicNumber: 26,
        element: 'Iron',
        category: 'Transition Metal',
        radioactive: false,
        halfLifeSeconds: Infinity,
        halfLifeDisplay: 'Stable',
        decayMode: 'None',
        fissile: false,
        color: '#cbd5e1',
        icon: '⚙️',
        desc: 'Most tightly bound atomic nucleus per nucleon in stellar nucleosynthesis.'
    },
    {
        id: 'Co-60',
        name: 'Cobalt-60',
        symbol: 'Co',
        mass: 60,
        atomicNumber: 27,
        element: 'Cobalt',
        category: 'Transition Metal',
        radioactive: true,
        halfLifeSeconds: 1.66e8, // ~5.27 years
        halfLifeDisplay: '5.27 years',
        decayMode: 'Gamma',
        fissile: false,
        color: '#6366f1',
        icon: '⚡',
        desc: 'High-intensity gamma emitter used for radiotherapy and food irradiation.'
    },
    {
        id: 'Sr-90',
        name: 'Strontium-90',
        symbol: 'Sr',
        mass: 90,
        atomicNumber: 38,
        element: 'Strontium',
        category: 'Alkaline Earth Metal',
        radioactive: true,
        halfLifeSeconds: 9.1e8, // ~28.8 years
        halfLifeDisplay: '28.8 years',
        decayMode: 'Beta',
        fissile: false,
        color: '#ec4899',
        icon: '⚠️',
        desc: 'Dangerous nuclear fission byproduct that mimics calcium in human bone.'
    },
    {
        id: 'I-131',
        name: 'Iodine-131',
        symbol: 'I',
        mass: 131,
        atomicNumber: 53,
        element: 'Iodine',
        category: 'Halogen',
        radioactive: true,
        halfLifeSeconds: 6.93e5, // ~8.02 days
        halfLifeDisplay: '8.02 days',
        decayMode: 'Beta',
        fissile: false,
        color: '#a855f7',
        icon: '💊',
        desc: 'Major medical radioisotope for targeted thyroid cancer treatment.'
    },
    {
        id: 'Cs-137',
        name: 'Caesium-137',
        symbol: 'Cs',
        mass: 137,
        atomicNumber: 55,
        element: 'Caesium',
        category: 'Alkali Metal',
        radioactive: true,
        halfLifeSeconds: 9.5e8, // ~30.17 years
        halfLifeDisplay: '30.2 years',
        decayMode: 'Gamma',
        fissile: false,
        color: '#e11d48',
        icon: '☢️',
        desc: 'Prevalent gamma-emitting fission product from nuclear reactors.'
    },

    // Heavy & Shielding Metals
    {
        id: 'Pb-208',
        name: 'Lead-208',
        symbol: 'Pb',
        mass: 208,
        atomicNumber: 82,
        element: 'Lead',
        category: 'Post-transition Metal',
        radioactive: false,
        halfLifeSeconds: Infinity,
        halfLifeDisplay: 'Stable',
        decayMode: 'None',
        fissile: false,
        color: '#64748b',
        icon: '🛡️',
        desc: 'Doubly magic nucleus; heaviest stable isotope known, premier radiation shield.'
    },
    {
        id: 'Po-210',
        name: 'Polonium-210',
        symbol: 'Po',
        mass: 210,
        atomicNumber: 84,
        element: 'Polonium',
        category: 'Post-transition Metal',
        radioactive: true,
        halfLifeSeconds: 1.19e7, // ~138 days
        halfLifeDisplay: '138 days',
        decayMode: 'Alpha',
        fissile: false,
        color: '#d946ef',
        icon: '☠️',
        desc: 'Intensely radioactive alpha emitter; extreme radiological toxicity.'
    },
    {
        id: 'Ra-226',
        name: 'Radium-226',
        symbol: 'Ra',
        mass: 226,
        atomicNumber: 88,
        element: 'Radium',
        category: 'Alkaline Earth Metal',
        radioactive: true,
        halfLifeSeconds: 5.05e10, // ~1,600 years
        halfLifeDisplay: '1,600 years',
        decayMode: 'Alpha',
        fissile: false,
        color: '#10b981',
        icon: '💚',
        desc: 'Discovered by Marie Curie; glows faintly from radioluminescence.'
    },

    // Actinides & Nuclear Fuels
    {
        id: 'Th-232',
        name: 'Thorium-232',
        symbol: 'Th',
        mass: 232,
        atomicNumber: 90,
        element: 'Thorium',
        category: 'Actinide',
        radioactive: true,
        halfLifeSeconds: 4.43e17, // ~14.05 billion years
        halfLifeDisplay: '14.05B years',
        decayMode: 'Alpha',
        fissile: false, // Fertile, not directly fissile
        color: '#14b8a6',
        icon: '🟢',
        desc: 'Primordial fertile actinide; core fuel cycle for next-gen thorium reactors.'
    },
    {
        id: 'U-235',
        name: 'Uranium-235',
        symbol: 'U',
        mass: 235,
        atomicNumber: 92,
        element: 'Uranium',
        category: 'Actinide',
        radioactive: true,
        halfLifeSeconds: 2.22e16, // ~703.8 million years
        halfLifeDisplay: '703.8M years',
        decayMode: 'Alpha',
        fissile: true,
        color: '#22c55e',
        icon: '⚡',
        desc: 'Only naturally occurring fissile isotope; essential for nuclear power plants.'
    },
    {
        id: 'U-238',
        name: 'Uranium-238',
        symbol: 'U',
        mass: 238,
        atomicNumber: 92,
        element: 'Uranium',
        category: 'Actinide',
        radioactive: true,
        halfLifeSeconds: 1.41e17, // ~4.468 billion years
        halfLifeDisplay: '4.47B years',
        decayMode: 'Alpha',
        fissile: false,
        color: '#84cc16',
        icon: '🧱',
        desc: 'Accounts for 99.28% of natural uranium; fertile breeder material.'
    },
    {
        id: 'Pu-239',
        name: 'Plutonium-239',
        symbol: 'Pu',
        mass: 239,
        atomicNumber: 94,
        element: 'Plutonium',
        category: 'Actinide',
        radioactive: true,
        halfLifeSeconds: 7.61e11, // ~24,110 years
        halfLifeDisplay: '24,110 years',
        decayMode: 'Alpha',
        fissile: true,
        color: '#f43f5e',
        icon: '🔥',
        desc: 'Synthetic fissile actinide produced by neutron capture in uranium reactors.'
    },
    {
        id: 'Am-241',
        name: 'Americium-241',
        symbol: 'Am',
        mass: 241,
        atomicNumber: 95,
        element: 'Americium',
        category: 'Actinide',
        radioactive: true,
        halfLifeSeconds: 1.36e10, // ~432.2 years
        halfLifeDisplay: '432.2 years',
        decayMode: 'Alpha',
        fissile: false,
        color: '#eab308',
        icon: '🚨',
        desc: 'Synthetic alpha emitter utilized inside common household ionization smoke detectors.'
    }
];

export const ISOTOPE_MAP = new Map(ISOTOPES.map(iso => [iso.id, iso]));

export function getIsotope(id) {
    return ISOTOPE_MAP.get(id);
}

export function getRandomIsotope(pool = ISOTOPES) {
    return pool[Math.floor(Math.random() * pool.length)];
}
