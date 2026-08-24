/**
 * Scale: The Power of Ten - Physical Scale & Fermi Database
 */

const SCALE_OBJECTS = [
    { exp: -18, name: "Quarks & Leptons", size: "10⁻¹⁸ m", force: "Strong Nuclear Force", desc: "Fundamental point-like elementary particles composing protons and neutrons." },
    { exp: -15, name: "Proton / Atomic Nucleus", size: "10⁻¹⁵ m (1 Femtometer)", force: "Strong Nuclear Force", desc: "Dense core where protons and neutrons bind via gluon exchange." },
    { exp: -10, name: "Hydrogen Atom Orbit", size: "10⁻¹⁰ m (1 Ångström)", force: "Electromagnetism", desc: "Electron cloud probability density surrounding a single proton." },
    { exp: -9, name: "DNA Double Helix", size: "10⁻⁹ m (2 Nanometers)", force: "Electromagnetism / Chemistry", desc: "Watson-Crick antiparallel genetic sugar-phosphate backbone." },
    { exp: -7, name: "Bacteriophage Virus", size: "10⁻⁷ m (100 Nanometers)", force: "Electromagnetism", desc: "Protein capsid containing viral RNA/DNA strands." },
    { exp: -6, name: "Red Blood Cell (Erythrocyte)", size: "10⁻⁶ m (7 Microns)", force: "Electromagnetism / Biology", desc: "Biconcave disc carrying hemoglobin oxygen through capillary networks." },
    { exp: -3, name: "Black Garden Ant", size: "10⁻³ m (4 Millimeters)", force: "Electromagnetism & Friction", desc: "Social insect exoskeleton lifting 50 times its body mass." },
    { exp: 0, name: "Human Being", size: "10⁰ m (1.7 Meters)", force: "Electromagnetism & Gravity", desc: "Macroscopic multicellular organism composed of ~37 trillion cells." },
    { exp: 1, name: "Blue Whale", size: "10¹ m (30 Meters)", force: "Gravity & Buoyancy", desc: "Largest animal ever known to inhabit Earth, weighing 190 metric tons." },
    { exp: 4, name: "Mount Everest Peak", size: "10⁴ m (8.8 Kilometers)", force: "Gravity & Tectonic Pressure", desc: "Highest elevation on Earth above sea level, shaped by continental collision." },
    { exp: 7, name: "Planet Earth", size: "10⁷ m (12,742 Kilometers)", force: "Gravity", desc: "Dense terrestrial rocky planet holding oceans and nitrogen-oxygen atmosphere." },
    { exp: 8, name: "Planet Saturn & Rings", size: "10⁸ m (120,000 Kilometers)", force: "Gravity", desc: "Gas giant encircled by extensive ice and rock particle rings." },
    { exp: 9, name: "The Sun (Sol)", size: "10⁹ m (1.39 Million Kilometers)", force: "Gravity & Nuclear Fusion", desc: "G-type main-sequence star powering the solar system via core proton-proton fusion." },
    { exp: 13, name: "Solar System (Voyager 1 Distance)", size: "10¹³ m (24 Billion Kilometers)", force: "Gravity", desc: "The heliosphere boundary where the solar wind meets interstellar space." },
    { exp: 16, name: "Proxima Centauri Distance", size: "10¹⁶ m (4.2 Light Years)", force: "Gravity", desc: "The closest star system to our Sun." },
    { exp: 21, name: "Milky Way Galaxy", size: "10²¹ m (100,000 Light Years)", force: "Gravity & Dark Matter", desc: "Barred spiral galaxy harboring 100-400 billion stars and a central supermassive black hole." },
    { exp: 23, name: "Local Group & Andromeda", size: "10²³ m (10 Million Light Years)", force: "Gravity", desc: "Gravitationally bound collection of over 50 galaxies including Andromeda and Triangulum." },
    { exp: 24, name: "Laniakea / Virgo Supercluster", size: "10²⁴ m (500 Million Light Years)", force: "Gravity & Cosmic Filaments", desc: "Cosmic basin of galaxy clusters flowing towards the Great Attractor." },
    { exp: 26, name: "Observable Universe", size: "10²⁶ m (93 Billion Light Years)", force: "Dark Energy & Metric Expansion", desc: "The spherical boundary of all matter observable from Earth since the Big Bang." }
];

const FERMI_CHALLENGES = [
    {
        id: 1,
        question: "Estimate the diameter of a Red Blood Cell in meters (Power of 10):",
        correctExp: -6,
        tolerance: 1,
        explanation: "A human erythrocyte measures approximately 7 to 8 micrometers, or ~10⁻⁶ meters."
    },
    {
        id: 2,
        question: "Estimate the diameter of the Sun in meters (Power of 10):",
        correctExp: 9,
        tolerance: 1,
        explanation: "The Sun's diameter is 1,392,700 km = 1.39 × 10⁹ meters."
    },
    {
        id: 3,
        question: "Estimate the width of a DNA Double Helix strand in meters (Power of 10):",
        correctExp: -9,
        tolerance: 1,
        explanation: "A B-DNA double helix has a diameter of roughly 2 nanometers = 2 × 10⁻⁹ meters."
    },
    {
        id: 4,
        question: "Estimate the diameter of Planet Earth in meters (Power of 10):",
        correctExp: 7,
        tolerance: 1,
        explanation: "Earth's equatorial diameter is 12,742 km = 1.27 × 10⁷ meters."
    },
    {
        id: 5,
        question: "Estimate the diameter of the Milky Way Galaxy in meters (Power of 10):",
        correctExp: 21,
        tolerance: 1,
        explanation: "The Milky Way spans 100,000 light-years = ~9.5 × 10²⁰ to 10²¹ meters."
    },
    {
        id: 6,
        question: "Estimate the size of an atomic nucleus / proton in meters (Power of 10):",
        correctExp: -15,
        tolerance: 1,
        explanation: "Protons and atomic nuclei measure on the femtometer scale, ~10⁻¹⁵ meters."
    },
    {
        id: 7,
        question: "Estimate the diameter of the entire Observable Universe in meters (Power of 10):",
        correctExp: 26,
        tolerance: 1,
        explanation: "The comoving observable universe has a diameter of ~93 billion light-years = ~8.8 × 10²⁶ meters."
    },
    {
        id: 8,
        question: "Estimate the size of a common garden ant in meters (Power of 10):",
        correctExp: -3,
        tolerance: 1,
        explanation: "Ants typically measure 3 to 5 millimeters = ~10⁻³ meters."
    }
];
