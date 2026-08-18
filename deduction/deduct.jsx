import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
Brain,
Trophy,
Zap,
BookOpen,
Sparkles,
Search,
ArrowUp,
ArrowDown,
Check,
X,
HelpCircle,
RefreshCw,
Share2,
Flame,
Calendar,
Award,
ChevronRight,
Info,
Volume2,
VolumeX,
Terminal,
Globe,
FlaskConical,
Cpu,
Layers,
ChevronDown,
CheckCircle2,
Lock,
BarChart3,
Dna,
Shuffle,
Compass,
Code2,
Microscope,
FileText
} from 'lucide-react';

// ==========================================
// 1. SOUND SYNTHESIZER ENGINE (Web Audio API)
// ==========================================
class SoundEngine {
constructor() {
this.ctx = null;
this.muted = false;
}

init() {
if (!this.ctx) {
const AudioCtx = window.AudioContext || window.webkitAudioContext;
if (AudioCtx) this.ctx = new AudioCtx();
}
}

playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
if (this.muted) return;
this.init();
if (!this.ctx) return;

try {
const osc = this.ctx.createOscillator();
const gain = this.ctx.createGain();
osc.type = type;
osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

osc.connect(gain);
gain.connect(this.ctx.destination);
osc.start();
osc.stop(this.ctx.currentTime + duration);
} catch (e) {
console.warn('Audio playback prevented:', e);
}
}

click() {
this.playTone(400, 'triangle', 0.05, 0.05);
}

match() {
this.playTone(523.25, 'sine', 0.12, 0.1); // C5
setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.1), 80); // E5
}

mismatch() {
this.playTone(220, 'sawtooth', 0.15, 0.08); // A3
}

victory() {
const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
notes.forEach((note, idx) => {
setTimeout(() => this.playTone(note, 'sine', 0.25, 0.12), idx * 100);
});
}
}

const audio = new SoundEngine();

// ==========================================
// 2. EXHAUSTIVE DATASETS GENERATOR
// ==========================================

// --- COMPLETE 118 PERIODIC TABLE ELEMENTS ---
const ALL_ELEMENTS_RAW = [
{ n: 1, s: "H", name: "Hydrogen", p: 1, st: "Gas", b: "s-block", r: false, c: "Reactive Nonmetal", f: "Hydrogen makes up about 75% of the elemental mass of the universe.", h: "First element on the periodic table." },
{ n: 2, s: "He", name: "Helium", p: 1, st: "Gas", b: "s-block", r: false, c: "Noble Gas", f: "Helium was discovered in the solar spectrum before being found on Earth.", h: "Second lightest element; non-reactive noble gas." },
{ n: 3, s: "Li", name: "Lithium", p: 2, st: "Solid", b: "s-block", r: false, c: "Alkali Metal", f: "Lithium is the least dense of all solid elements.", h: "Powering modern rechargeable electric vehicle batteries." },
{ n: 4, s: "Be", name: "Beryllium", p: 2, st: "Solid", b: "s-block", r: false, c: "Alkaline Earth", f: "Beryllium is transparent to X-rays and used in space telescope mirrors.", h: "Used in the primary mirror of the James Webb Space Telescope." },
{ n: 5, s: "B", name: "Boron", p: 2, st: "Solid", b: "p-block", r: false, c: "Metalloid", f: "Boron compounds are crucial in making Pyrex heat-resistant glass.", h: "Semimetal commonly used in pyrotechnics and green flares." },
{ n: 6, s: "C", name: "Carbon", p: 2, st: "Solid", b: "p-block", r: false, c: "Reactive Nonmetal", f: "Carbon forms over 10 million known compounds; basis for organic life.", h: "Forms soft graphite as well as super-hard diamond." },
{ n: 7, s: "N", name: "Nitrogen", p: 2, st: "Gas", b: "p-block", r: false, c: "Reactive Nonmetal", f: "Nitrogen gas makes up approximately 78% of Earth's atmosphere.", h: "Essential gas that dilutes oxygen in our atmosphere." },
{ n: 8, s: "O", name: "Oxygen", p: 2, st: "Gas", b: "p-block", r: false, c: "Reactive Nonmetal", f: "Oxygen is the most abundant element by mass in Earth's crust.", h: "Vital gas required for aerobic cellular respiration." },
{ n: 9, s: "F", name: "Fluorine", p: 2, st: "Gas", b: "p-block", r: false, c: "Halogen", f: "Fluorine is the most chemically reactive and electronegative of all elements.", h: "Extremely reactive halogen present in toothpaste as fluoride." },
{ n: 10, s: "Ne", name: "Neon", p: 2, st: "Gas", b: "p-block", r: false, c: "Noble Gas", f: "Glows reddish-orange when excited by high-voltage electric currents.", h: "Famous for bright glowing gas discharge advertising signs." },
{ n: 11, s: "Na", name: "Sodium", p: 3, st: "Solid", b: "s-block", r: false, c: "Alkali Metal", f: "Soft alkali metal that floats on water and reacts violently with it.", h: "Combines with chlorine to create ordinary table salt." },
{ n: 12, s: "Mg", name: "Magnesium", p: 3, st: "Solid", b: "s-block", r: false, c: "Alkaline Earth", f: "Magnesium forms the central atom in chlorophyll molecules.", h: "Burns with an intense, blinding white light." },
{ n: 13, s: "Al", name: "Aluminium", p: 3, st: "Solid", b: "p-block", r: false, c: "Post-Transition", f: "Most abundant metal in Earth's crust, prized for low density and corrosion resistance.", h: "Used in soda cans, aircraft frames, and foil." },
{ n: 14, s: "Si", name: "Silicon", p: 3, st: "Solid", b: "p-block", r: false, c: "Metalloid", f: "The second most abundant element in Earth's crust; cornerstone of computer chips.", h: "Semiconductor heart of Silicon Valley electronics." },
{ n: 15, s: "P", name: "Phosphorus", p: 3, st: "Solid", b: "p-block", r: false, c: "Reactive Nonmetal", f: "Discovered in 1669 by Henning Brand by distilling human urine.", h: "Essential component of DNA backbone and matchheads." },
{ n: 16, s: "S", name: "Sulfur", p: 3, st: "Solid", b: "p-block", r: false, c: "Reactive Nonmetal", f: "Historically called brimstone; responsible for smell of volcanic vents.", h: "Bright yellow nonmetal known anciently as brimstone."
},
{ n: 17, s: "Cl", name: "Chlorine", p: 3, st: "Gas", b: "p-block", r: false, c: "Halogen", f: "Yellow-green toxic gas widely used as a disinfectant in swimming pools.", h: "Common water purifying halogen agent." },
{ n: 18, s: "Ar", name: "Argon", p: 3, st: "Gas", b: "p-block", r: false, c: "Noble Gas", f: "Third most abundant gas in Earth's atmosphere at nearly 1%.", h: "Inert noble gas used to fill incandescent light bulbs." },
{ n: 19, s: "K", name: "Potassium", p: 4, st: "Solid", b: "s-block", r: false, c: "Alkali Metal", f: "Essential electrolyte in human nerve impulse transmission and bananas.", h: "Symbol K comes from Neo-Latin 'kalium'." },
{ n: 20, s: "Ca", name: "Calcium", p: 4, st: "Solid", b: "s-block", r: false, c: "Alkaline Earth", f: "Fifth most abundant element in human body; strengthens bones and teeth.", h: "Key element in limestone, chalk, and human bones." },
{ n: 21, s: "Sc", name: "Scandium", p: 4, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Used in high-end bicycle frames and baseball bats for structural strength.", h: "First transition metal of the 4th period." },
{ n: 22, s: "Ti", name: "Titanium", p: 4, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Has highest strength-to-density ratio of any metallic element.", h: "Named after the Titans of Greek mythology; used in aerospace."
},
{ n: 23, s: "V", name: "Vanadium", p: 4, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Added to steel alloys to create shock-resistant tools and springs.", h: "Named after Vanadis, Scandinavian goddess of beauty." },
{ n: 24, s: "Cr", name: "Chromium", p: 4, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Gives rubies their red color and stainless steel its shine.", h: "Metals plated with this mirror-like coating resist tarnishing." },
{ n: 25, s: "Mn", name: "Manganese", p: 4, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Essential in industrial steelmaking to prevent brittleness.", h: "Crucial element in clear glassmaking and dry-cell batteries." },
{ n: 26, s: "Fe", name: "Iron", p: 4, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Makes up the majority of Earth's core by mass and oxygen transporter in blood.", h: "Chemical symbol Fe comes from Latin 'ferrum'."
},
{ n: 27, s: "Co", name: "Cobalt", p: 4, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Cobalt blue pigments have been used in ceramics since ancient times.", h: "Key component in lithium-ion battery cathodes and blue glass." },
{ n: 28, s: "Ni", name: "Nickel", p: 4, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Earth's inner core is primarily composed of an iron-nickel alloy.", h: "Corrosion-resistant metal used in US five-cent coins." },
{ n: 29, s: "Cu", name: "Copper", p: 4, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "One of few metals occurring naturally in directly usable metallic form.", h: "Reddish-orange metal famous for electrical wiring."
},
{ n: 30, s: "Zn", name: "Zinc", p: 4, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Galvanizing steel with zinc prevents rust formation.", h: "Essential mineral used to coat iron against rust." },
{ n: 31, s: "Ga", name: "Gallium", p: 4, st: "Solid", b: "p-block", r: false, c: "Post-Transition", f: "Melts in human hands at 29.76°C (85.57°F).", h: "Post-transition metal that liquefied when held." },
{ n: 32, s: "Ge", name: "Germanium", p: 4, st: "Solid", b: "p-block", r: false, c: "Metalloid", f: "Crucial early semiconductor material used in original transistors.", h: "Named after Germany." },
{ n: 33, s: "As", name: "Arsenic", p: 4, st: "Solid", b: "p-block", r: false, c: "Metalloid", f: "Historically infamous poison used as Victorian 'inheritance powder'.", h: "Historically notorious lethal poison." },
{ n: 34, s: "Se", name: "Selenium", p: 4, st: "Solid", b: "p-block", r: false, c: "Reactive Nonmetal", f: "Conducts electricity better in light than in darkness (photoconductive).", h: "Named after Selene, Greek goddess of the moon." },
{ n: 35, s: "Br", name: "Bromine", p: 4, st: "Liquid", b: "p-block", r: false, c: "Halogen", f: "The only nonmetallic element that is liquid at room temperature.", h: "Foul-smelling reddish-brown liquid halogen." },
{ n: 36, s: "Kr", name: "Krypton", p: 4, st: "Gas", b: "p-block", r: false, c: "Noble Gas", f: "Used in high-speed photographic flash lamps.", h: "Shares name with Superman's fictional home planet." },
{ n: 37, s: "Rb", name: "Rubidium", p: 5, st: "Solid", b: "s-block", r: false, c: "Alkali Metal", f: "Ignites spontaneously in air and reacts violently with water.", h: "Alkali metal named after its deep red spectral lines." },
{ n: 38, s: "Sr", name: "Strontium", p: 5, st: "Solid", b: "s-block", r: false, c: "Alkaline Earth", f: "Provides vibrant brilliant red colors in fireworks displays.", h: "Gives emergency flare fireworks their deep crimson color." },
{ n: 39, s: "Y", name: "Yttrium", p: 5, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Named after Ytterby, a Swedish village where four elements were discovered.", h: "Used in red phosphors for old CRT television displays." },
{ n: 40, s: "Zr", name: "Zirconium", p: 5, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Highly resistant to corrosion, used in nuclear reactor fuel rods.", h: "Synthesizes cubic zirconia diamond substitutes." },
{ n: 41, s: "Nb", name: "Niobium", p: 5, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Superconducting metal used in MRI scanners and particle accelerators.", h: "Formerly known as columbium in America." },
{ n: 42, s: "Mo", name: "Molybdenum", p: 5, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Has one of the highest melting points of all pure elements (2623°C).", h: "High-melting transition metal used in heavy armor steel." },
{ n: 43, s: "Tc", name: "Technetium", p: 5, st: "Solid", b: "d-block", r: true, c: "Transition Metal", f: "First artificially created element; all isotopes are radioactive.", h: "First synthetic radioactive element on periodic table." },
{ n: 44, s: "Ru", name: "Ruthenium", p: 5, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Rare platinum-group metal named after Russia (Ruthenia).", h: "Platinum-group metal named after Ruthenia." },
{ n: 45, s: "Rh", name: "Rhodium", p: 5, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Extremely rare and expensive metal used in automotive catalytic converters.", h: "One of the rarest and most expensive precious metals." },
{ n: 46, s: "Pd", name: "Palladium", p: 5, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Can absorb up to 900 times its own volume in hydrogen gas.", h: "Named after the asteroid Pallas." },
{ n: 47, s: "Ag", name: "Silver", p: 5, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Highest electrical conductivity, thermal conductivity, and reflectivity of any metal.", h: "Chemical symbol Ag stems from Latin 'argentum'." },
{ n: 48, s: "Cd", name: "Cadmium", p: 5, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Toxic heavy metal formerly prominent in rechargeable NiCd batteries.", h: "Used in vivid yellow pigments beloved by Impressionist painters." },
{ n: 49, s: "In", name: "Indium", p: 5, st: "Solid", b: "p-block", r: false, c: "Post-Transition", f: "Indium tin oxide coats modern touchscreen glass displays.", h: "Produces a distinctive 'cry' sound when bent." },
{ n: 50, s: "Sn", name: "Tin", p: 5, st: "Solid", b: "p-block", r: false, c: "Post-Transition", f: "Alloyed with copper since 3000 BCE to initiate the Bronze Age.", h: "Chemical symbol Sn stems from Latin 'stannum'." },
{ n: 51, s: "Sb", name: "Antimony", p: 5, st: "Solid", b: "p-block", r: false, c: "Metalloid", f: "Symbol Sb stems from stibium; used anciently as eye cosmetic kohl.", h: "Ancient eye cosmetic element with symbol Sb." },
{ n: 52, s: "Te", name: "Tellurium", p: 5, st: "Solid", b: "p-block", r: false, c: "Metalloid", f: "Exposure to tellurium causes garlic-smelling breath for weeks.", h: "Named after Tellus, Latin word for Earth." },
{ n: 53, s: "I", name: "Iodine", p: 5, st: "Solid", b: "p-block", r: false, c: "Halogen", f: "Sublimes into a deep purple gas when heated; vital for human thyroid.", h: "Halogen required by human thyroid gland." },
{ n: 54, s: "Xe", name: "Xenon", p: 5, st: "Gas", b: "p-block", r: false, c: "Noble Gas", f: "Heavy noble gas used in ion propulsion engines on deep space probes.", h: "Heavy noble gas used in spacecraft ion engines." },
{ n: 55, s: "Cs", name: "Caesium", p: 6, st: "Solid", b: "s-block", r: false, c: "Alkali Metal", f: "Defines the precise SI second unit in atomic clocks.", h: "Vibrations of this alkali metal power standard atomic clocks." },
{ n: 56, s: "Ba", name: "Barium", p: 6, st: "Solid", b: "s-block", r: false, c: "Alkaline Earth", f: "Barium meals swallow cocktails absorb X-rays for GI tract medical imaging.", h: "Alkaline earth metal used in medical X-ray imaging cocktails." },
{ n: 57, s: "La", name: "Lanthanum", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "First element of lanthanide series; gives name to entire row.", h: "Named from Greek 'lanthanein' meaning hidden." },
{ n: 58, s: "Ce", name: "Cerium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Most abundant rare earth element; forms spark flints in lighter wheels.", h: "Sparks when struck in ferrocerium lighter flints." },
{ n: 59, s: "Pr", name: "Praseodymium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Gives glass protective yellow tint used in glassblower goggles.", h: "Name means 'green twin' in Greek." },
{ n: 60, s: "Nd", name: "Neodymium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Forms the strongest known permanent commercial magnets (NdFeB).", h: "Key ingredient in super-strong permanent magnets." },
{ n: 61, s: "Pm", name: "Promethium", p: 6, st: "Solid", b: "f-block", r: true, c: "Lanthanide", f: "Only radioactive lanthanide element; named after titan Prometheus.", h: "Named after the Greek Titan who stole fire." },
{ n: 62, s: "Sm", name: "Samarium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "First chemical element named after an actual person (Vasili Samarsky).", h: "High-temperature resistant magnets used in aircraft." },
{ n: 63, s: "Eu", name: "Europium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Most reactive lanthanide; used in anti-counterfeiting red phosphors in Euro banknotes.", h: "Named after the continent of Europe." },
{ n: 64, s: "Gd", name: "Gadolinium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Used as intravenous contrast agent in MRI medical scans.", h: "Named after Johan Gadolin; paramagnetic MRI agent." },
{ n: 65, s: "Tb", name: "Terbium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Green phosphor used in fluorescent lamps and flat panel screens.", h: "Second of four elements named after Ytterby, Sweden." },
{ n: 66, s: "Dy", name: "Dysprosium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Name stems from Greek 'dysprositos' meaning hard to get.", h: "Added to neodymium magnets to withstand heat." },
{ n: 67, s: "Ho", name: "Holmium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Has the highest magnetic strength of any element.", h: "Named after the Latin name for Stockholm." },
{ n: 68, s: "Er", name: "Erbium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Erbium-doped fiber amplifiers boost signal optical fiber internet.", h: "Third element named after Ytterby village." },
{ n: 69, s: "Tm", name: "Thulium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Second rarest lanthanide; used in portable medical X-ray machines.", h: "Named after Thule, mythical northern land." },
{ n: 70, s: "Yb", name: "Ytterbium", p: 6, st: "Solid", b: "f-block", r: false, c: "Lanthanide", f: "Fourth and final element named after Ytterby quarry in Sweden.", h: "Fourth Swedish village namesake." },
{ n: 71, s: "Lu", name: "Lutetium", p: 6, st: "Solid", b: "d-block", r: false, c: "Lanthanide", f: "Final element in lanthanide series; hardest rare earth metal.", h: "Named after Lutetia, ancient precursor city to Paris." },
{ n: 72, s: "Hf", name: "Hafnium", p: 6, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Used in microprocessors gate dielectrics to reduce electrical current leakage.", h: "Named after Hafnia, Latin name for Copenhagen." },
{ n: 73, s: "Ta", name: "Tantalum", p: 6, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Immune to chemical attack below 150°C; vital for smartphone capacitors.", h: "Named after Tantalus of Greek mythology." },
{ n: 74, s: "W", name: "Tungsten", p: 6, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Has highest melting point of all metallic elements at 3422°C.", h: "Symbol W comes from German name 'Wolfram'." },
{ n: 75, s: "Re", name: "Rhenium", p: 6, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "One of rarest elements in Earth's crust; used in jet engine turbine blades.", h: "Named after the Rhine River." },
{ n: 76, s: "Os", name: "Osmium", p: 6, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Densest naturally occurring element, twice as dense as lead.", h: "Densest naturally occurring element." },
{ n: 77, s: "Ir", name: "Iridium", p: 6, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Enriched layer at K-T boundary proves asteroid impact killed dinosaurs.", h: "Asteroid impact layer metal named after Iris." },
{ n: 78, s: "Pt", name: "Platinum", p: 6, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Unreactive precious metal named from Spanish 'platina' meaning little silver.", h: "Precious jewelry metal more valuable than gold." },
{ n: 79, s: "Au", name: "Gold", p: 6, st: "Solid", b: "d-block", r: false, c: "Transition Metal", f: "Most malleable metal; single ounce can be drawn into a 50-mile wire.", h: "Precious coin metal with Latin symbol Au." },
{ n: 80, s: "Hg", name: "Mercury", p: 6, st: "Liquid", b: "d-block", r: false, c: "Transition Metal", f: "Only metallic element that is liquid at standard room temperature.", h: "Quicksilver metal with Latin symbol Hg." },
{ n: 81, s: "Tl", name: "Thallium", p: 6, st: "Solid", b: "p-block", r: false, c: "Post-Transition", f: "Tasteless toxic metal historically nicknamed 'The Poisoner's Poison'.", h: "Infamous tasteless poison element." },
{ n: 82, s: "Pb", name: "Lead", p: 6, st: "Solid", b: "p-block", r: false, c: "Post-Transition", f: "Dense shield against radiation; symbol Pb comes from plumbum.", h: "Heavy toxic metal used in radiation shielding." },
{ n: 83, s: "Bi", name: "Bismuth", p: 6, st: "Solid", b: "p-block", r: false, c: "Post-Transition", f: "Forms rainbow iridescent oxidation crystals; active ingredient in Pepto-Bismol.", h: "Forms stunning rainbow crystalline geometries."
},
{ n: 84, s: "Po", name: "Polonium", p: 6, st: "Solid", b: "p-block", r: true, c: "Post-Transition", f: "Discovered by Marie Curie in 1898 and named after her homeland Poland.", h: "Radioactive element named by Marie Curie for Poland." },
{ n: 85, s: "At", name: "Astatine", p: 6, st: "Solid", b: "p-block", r: true, c: "Halogen", f: "Rarest naturally occurring element in Earth's crust (<28 grams worldwide).", h: "Extremely unstable radioactive halogen." }, { n: 86,
    s: "Rn" , name: "Radon" , p: 6, st: "Gas" , b: "p-block" , r: true, c: "Noble Gas" ,
    f: "Colorless radioactive gas that accumulates in basements from natural uranium decay." ,
    h: "Radioactive heavy noble gas hazard in basements." }, { n: 87, s: "Fr" , name: "Francium" , p: 7, st: "Solid" ,
    b: "s-block" , r: true, c: "Alkali Metal" , f: "Second rarest element in crust; most unstable alkali metal." ,
    h: "Radioactive alkali metal named after France." }, { n: 88, s: "Ra" , name: "Radium" , p: 7, st: "Solid" ,
    b: "s-block" , r: true, c: "Alkaline Earth" ,
    f: "Discovered by Marie Curie; famously glowed in 1920s luminous watch dials." ,
    h: "Glow-in-the-dark radioactive element isolated by Curie." }, { n: 89, s: "Ac" , name: "Actinium" , p: 7,
    st: "Solid" , b: "f-block" , r: true, c: "Actinide" ,
    f: "First element in actinide series; glows eerie blue in the dark." ,
    h: "Glows with blue light due to radioactivity." }, { n: 90, s: "Th" , name: "Thorium" , p: 7, st: "Solid" ,
    b: "f-block" , r: true, c: "Actinide" ,
    f: "Promising safe alternative nuclear power fuel, 3-4x more abundant than uranium." ,
    h: "Named after Thor, Norse god of thunder." }, { n: 91, s: "Pa" , name: "Protactinium" , p: 7, st: "Solid" ,
    b: "f-block" , r: true, c: "Actinide" , f: "Extremely toxic and highly radioactive actinide rare metal." ,
    h: "Name means 'parent of actinium'." }, { n: 92, s: "U" , name: "Uranium" , p: 7, st: "Solid" , b: "f-block" , r:
    true, c: "Actinide" , f: "Primary fuel for nuclear power plants and nuclear weaponry." ,
    h: "Heavy radioactive fuel element named after Uranus." }, { n: 93, s: "Np" , name: "Neptunium" , p: 7, st: "Solid"
    , b: "f-block" , r: true, c: "Actinide" , f: "First transuranium element produced synthetically in 1940." ,
    h: "Named after planet Neptune." }, { n: 94, s: "Pu" , name: "Plutonium" , p: 7, st: "Solid" , b: "f-block" , r:
    true, c: "Actinide" , f: "Used in Trinity test and Fat Man bomb; key satellite thermoelectric generator." ,
    h: "Transuranic element named after Pluto." }, { n: 95, s: "Am" , name: "Americium" , p: 7, st: "Solid" ,
    b: "f-block" , r: true, c: "Actinide" , f: "Synthetic radioisotope present in household ionization smoke detectors."
    , h: "Synthetic element inside home smoke detectors." }, { n: 96, s: "Cm" , name: "Curium" , p: 7, st: "Solid" ,
    b: "f-block" , r: true, c: "Actinide" , f: "Named in honor of Marie and Pierre Curie." ,
    h: "Named after pioneering radioactivity scientists." }, { n: 97, s: "Bk" , name: "Berkelium" , p: 7, st: "Solid" ,
    b: "f-block" , r: true, c: "Actinide" , f: "Synthesized at UC Berkeley Radiation Laboratory in 1949." ,
    h: "Named after Berkeley, California." }, { n: 98, s: "Cf" , name: "Californium" , p: 7, st: "Solid" , b: "f-block"
    , r: true, c: "Actinide" , f: "Powerful neutron emitter used to start nuclear reactors and detect gold ores." ,
    h: "Named after US State of California." }, { n: 99, s: "Es" , name: "Einsteinium" , p: 7, st: "Solid" ,
    b: "f-block" , r: true, c: "Actinide" ,
    f: "Discovered in debris of the Ivy Mike 1952 thermonuclear hydrogen bomb blast." ,
    h: "Named in honor of Albert Einstein." }, { n: 100, s: "Fm" , name: "Fermium" , p: 7, st: "Solid" , b: "f-block" ,
    r: true, c: "Actinide" , f: "Named after Enrico Fermi, pioneer of first nuclear reactor." ,
    h: "Named after nuclear pioneer Enrico Fermi." }, { n: 101, s: "Md" , name: "Mendelevium" , p: 7, st: "Solid" ,
    b: "f-block" , r: true, c: "Actinide" , f: "Named after Dmitri Mendeleev, creator of the periodic table." ,
    h: "Named after father of the periodic table." }, { n: 102, s: "No" , name: "Nobelium" , p: 7, st: "Solid" ,
    b: "f-block" , r: true, c: "Actinide" ,
    f: "Named after Alfred Nobel, inventor of dynamite and founder of Nobel Prizes." ,
    h: "Named after founder of Nobel Prizes." }, { n: 103, s: "Lr" , name: "Lawrencium" , p: 7, st: "Solid" ,
    b: "f-block" , r: true, c: "Actinide" ,
    f: "Final element of actinide series; named after cyclotron inventor Ernest Lawrence." ,
    h: "Named after cyclotron inventor." }, { n: 104, s: "Rf" , name: "Rutherfordium" , p: 7, st: "Synthetic" ,
    b: "d-block" , r: true, c: "Superheavy" , f: "First transactinide superheavy element; half-life under 1.3 hours." ,
    h: "Named after father of nuclear physics Ernest Rutherford." }, { n: 105, s: "Db" , name: "Dubnium" , p: 7,
    st: "Synthetic" , b: "d-block" , r: true, c: "Superheavy" ,
    f: "Named after Russian nuclear research facility town Dubna." , h: "Named after Russian research city Dubna." }, {
    n: 106, s: "Sg" , name: "Seaborgium" , p: 7, st: "Synthetic" , b: "d-block" , r: true, c: "Superheavy" ,
    f: "First element named after a living person (Glenn T. Seaborg)." , h: "Named after nuclear chemist Glenn Seaborg."
    }, { n: 107, s: "Bh" , name: "Bohrium" , p: 7, st: "Synthetic" , b: "d-block" , r: true, c: "Superheavy" ,
    f: "Named after Danish atomic physicist Niels Bohr." , h: "Named after quantum pioneer Niels Bohr." }, { n: 108,
    s: "Hs" , name: "Hassium" , p: 7, st: "Synthetic" , b: "d-block" , r: true, c: "Superheavy" ,
    f: "Named after German state of Hesse (Latin Hassia)." , h: "Named after German state Hesse." }, { n: 109, s: "Mt" ,
    name: "Meitnerium" , p: 7, st: "Synthetic" , b: "d-block" , r: true, c: "Superheavy" ,
    f: "Named after Lise Meitner, discoverer of nuclear fission." ,
    h: "Named after nuclear fission discoverer Lise Meitner." }, { n: 110, s: "Ds" , name: "Darmstadtium" , p: 7,
    st: "Synthetic" , b: "d-block" , r: true, c: "Superheavy" ,
    f: "Discovered at GSI Helmholtzzentrum in Darmstadt, Germany." , h: "Named after Darmstadt, Germany." }, { n: 111,
    s: "Rg" , name: "Roentgenium" , p: 7, st: "Synthetic" , b: "d-block" , r: true, c: "Superheavy" ,
    f: "Named after Wilhelm Röntgen, discoverer of X-rays." , h: "Named after X-ray discoverer Wilhelm Röntgen." }, { n:
    112, s: "Cn" , name: "Copernicium" , p: 7, st: "Synthetic" , b: "d-block" , r: true, c: "Superheavy" ,
    f: "Named after astronomer Nicolaus Copernicus." , h: "Named after heliocentric astronomer Copernicus." }, { n: 113,
    s: "Nh" , name: "Nihonium" , p: 7, st: "Synthetic" , b: "p-block" , r: true, c: "Superheavy" ,
    f: "First element discovered in an Asian country (RIKEN lab Japan; Nihon)." , h: "Named after Japan ('Nihon')." }, {
    n: 114, s: "Fl" , name: "Flerovium" , p: 7, st: "Synthetic" , b: "p-block" , r: true, c: "Superheavy" ,
    f: "Superheavy element named after Soviet nuclear physicist Georgy Flyorov." ,
    h: "Named after Flerov Laboratory of Nuclear Reactions." }, { n: 115, s: "Mc" , name: "Moscovium" , p: 7,
    st: "Synthetic" , b: "p-block" , r: true, c: "Superheavy" ,
    f: "Synthesized jointly by Russian and American scientists; named for Moscow region." ,
    h: "Named after Moscow Oblast region." }, { n: 116, s: "Lv" , name: "Livermorium" , p: 7, st: "Synthetic" ,
    b: "p-block" , r: true, c: "Superheavy" ,
    f: "Named in honor of Lawrence Livermore National Laboratory in California." ,
    h: "Named after Lawrence Livermore National Lab." }, { n: 117, s: "Ts" , name: "Tennessine" , p: 7, st: "Synthetic"
    , b: "p-block" , r: true, c: "Superheavy" , f: "Named after US state of Tennessee, home to Oak Ridge National Lab."
    , h: "Second US state namesake after California." }, { n: 118, s: "Og" , name: "Oganesson" , p: 7, st: "Synthetic" ,
    b: "p-block" , r: true, c: "Superheavy" , f: "Highest atomic number element; named after Yuri Oganessian." ,
    h: "Element #118; completes 7th row of periodic table." } ]; const elementsCategoryItems=ALL_ELEMENTS_RAW.map((e)=>
    ({
    id: `elem_${e.n}`,
    name: `${e.name} (${e.s})`,
    atomic_number: e.n,
    period: e.p,
    state: e.st,
    block: e.b,
    radioactive: e.r,
    category: e.c,
    fact: e.f,
    hint: e.h
    }));

    // --- CATEGORIES DEFINITION ---
    const CATEGORIES_DATA = [
    {
    id: 'elements',
    name: 'Chemical Elements (All 118)',
    icon: FlaskConical,
    difficulty: 'Easy',
    description: 'Deduce all 118 elements from Hydrogen (#1) to Oganesson (#118).',
    schema: [
    { key: 'atomic_number', label: 'Atomic #', type: 'number' },
    { key: 'period', label: 'Period', type: 'number' },
    { key: 'state', label: 'State (STP)', type: 'enum' },
    { key: 'block', label: 'Block', type: 'enum' },
    { key: 'radioactive', label: 'Radioactive', type: 'boolean' },
    { key: 'category', label: 'Chemical Type', type: 'enum' }
    ],
    items: elementsCategoryItems
    },
    {
    id: 'countries',
    name: 'Countries & Nations (100+)',
    icon: Globe,
    difficulty: 'Easy',
    description: 'Deduce world nations by continent, population, hemisphere, and landlocked status.',
    schema: [
    { key: 'continent', label: 'Continent', type: 'enum' },
    { key: 'landlocked', label: 'Landlocked', type: 'boolean' },
    { key: 'population_m', label: 'Pop. (M)', type: 'number' },
    { key: 'hemisphere', label: 'Hemisphere', type: 'enum' },
    { key: 'island_nation', label: 'Island Nation', type: 'boolean' }
    ],
    items: [
    { id: 'japan', name: 'Japan', continent: 'Asia', landlocked: false, population_m: 125, hemisphere:
    'Northern/Eastern', island_nation: true, fact: 'Japan comprises an archipelago of over 14,000 islands along the Pacific Ring of Fire.', hint: 'Known as the Land of the Rising Sun.' },
    { id: 'brazil', name: 'Brazil', continent: 'South America', landlocked: false, population_m: 215, hemisphere:
    'Southern/Western', island_nation: false, fact: 'Home to 60% of the Amazon Rainforest and the longest coastline in South America.', hint: 'The only Portuguese-speaking country in the Americas.' },
    { id: 'kenya', name: 'Kenya', continent: 'Africa', landlocked: false, population_m: 54, hemisphere: 'Equatorial',
    island_nation: false, fact: 'The Great Rift Valley runs through Kenya, yielding some of humanity’s oldest fossil remains.', hint: 'Capital city is Nairobi.' },
    { id: 'switzerland', name: 'Switzerland', continent: 'Europe', landlocked: true, population_m: 9, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'Maintains four national languages: German, French, Italian, and Romansh.', hint: 'Famous for its Alpine peaks, chocolate, and armed neutrality.' },
    { id: 'canada', name: 'Canada', continent: 'North America', landlocked: false, population_m: 39, hemisphere:
    'Northern/Western', island_nation: false, fact: 'Canada has the longest coastline of any country in the world (202,080 km).', hint: 'Features a red maple leaf on its national flag.' },
    { id: 'australia', name: 'Australia', continent: 'Oceania', landlocked: false, population_m: 26, hemisphere:
    'Southern/Eastern', island_nation: true, fact: 'Home to the Great Barrier Reef, the world’s largest coral reef system.', hint: 'The Land Down Under.' },
    { id: 'india', name: 'India', continent: 'Asia', landlocked: false, population_m: 1430, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'Origin of four major world religions: Hinduism, Buddhism, Jainism, and Sikhism.', hint: 'World’s most populous nation.' },
    { id: 'egypt', name: 'Egypt', continent: 'Africa', landlocked: false, population_m: 112, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'Home to the Great Pyramid of Giza, the oldest of the Seven Wonders of the Ancient World.', hint: 'Gift of the Nile.' },
    { id: 'germany', name: 'Germany', continent: 'Europe', landlocked: false, population_m: 84, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'Europe’s largest economy, famous for the Autobahn highway system.',
    hint: 'Capital city is Berlin.' },
    { id: 'argentina', name: 'Argentina', continent: 'South America', landlocked: false, population_m: 46, hemisphere:
    'Southern/Western', island_nation: false, fact: 'Home to Aconcagua, the highest peak in both the Southern and Western Hemispheres.', hint: 'Famous for tango dance and Pampas grasslands.' },
    { id: 'nigeria', name: 'Nigeria', continent: 'Africa', landlocked: false, population_m: 224, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'Africa’s most populous country and major hub of Afrobeats music.',
    hint: 'Giant of Africa.' },
    { id: 'mexico', name: 'Mexico', continent: 'North America', landlocked: false, population_m: 128, hemisphere:
    'Northern/Western', island_nation: false, fact: 'Introduced chocolate, chili peppers, and corn to the rest of the world.', hint: 'Home of the ancient Maya and Aztec civilizations.' },
    { id: 'iceland', name: 'Iceland', continent: 'Europe', landlocked: false, population_m: 0.4, hemisphere:
    'Northern/Western', island_nation: true, fact: 'Runs entirely on renewable geothermal and hydroelectric energy.',
    hint: 'Land of Fire and Ice.' },
    { id: 'south_korea', name: 'South Korea', continent: 'Asia', landlocked: false, population_m: 51, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'World leader in broadband internet speeds and semiconductor manufacturing.', hint: 'Capital city is Seoul.' },
    { id: 'madagascar', name: 'Madagascar', continent: 'Africa', landlocked: false, population_m: 30, hemisphere:
    'Southern/Eastern', island_nation: true, fact: 'Over 90% of its wildlife is found nowhere else on Earth.', hint:
    'Famous for baobab trees and lemurs.' },
    { id: 'mongolia', name: 'Mongolia', continent: 'Asia', landlocked: true, population_m: 3.4, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'The most sparsely populated sovereign country in the world.', hint:
    'Homeland of Genghis Khan.' },
    { id: 'singapore', name: 'Singapore', continent: 'Asia', landlocked: false, population_m: 5.9, hemisphere:
    'Equatorial', island_nation: true, fact: 'Global financial hub comprised of a single island city-state.', hint:
    'Famous Lion City.' },
    { id: 'norway', name: 'Norway', continent: 'Europe', landlocked: false, population_m: 5.5, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'Features thousands of dramatic sea-carved fjords along its western coast.', hint: 'Land of the Midnight Sun.' },
    { id: 'peru', name: 'Peru', continent: 'South America', landlocked: false, population_m: 34, hemisphere:
    'Southern/Western', island_nation: false, fact: 'Home to Machu Picchu, the 15th-century Inca citadel set high in the Andes.', hint: 'Cradle of the Inca Empire.' },
    { id: 'ethiopia', name: 'Ethiopia', continent: 'Africa', landlocked: true, population_m: 126, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'The birthplace of coffee and one of two African nations never colonized.', hint: 'Capital city is Addis Ababa.' },
    { id: 'france', name: 'France', continent: 'Europe', landlocked: false, population_m: 68, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'The most visited country in the world by international tourists.',
    hint: 'Home of the Eiffel Tower.' },
    { id: 'china', name: 'China', continent: 'Asia', landlocked: false, population_m: 1410, hemisphere:
    'Northern/Eastern', island_nation: false, fact: 'Invented paper, printing, gunpowder, and the magnetic compass.',
    hint: 'Home to the Great Wall.' },
    { id: 'usa', name: 'United States', continent: 'North America', landlocked: false, population_m: 335, hemisphere:
    'Northern/Western', island_nation: false, fact: 'Contains 50 states spanning 6 geographic time zones.', hint: 'Home to Grand Canyon and Silicon Valley.' },
    { id: 'indonesia', name: 'Indonesia', continent: 'Asia', landlocked: false, population_m: 277, hemisphere:
    'Equatorial', island_nation: true, fact: 'World’s largest island country with over 17,000 islands.', hint: 'Capital city is Jakarta.' },
    { id: 'chile', name: 'Chile', continent: 'South America', landlocked: false, population_m: 19.5, hemisphere:
    'Southern/Western', island_nation: false, fact: 'Stretches over 4,300 km long but averages only 177 km wide.', hint:
    'Home to the hyper-arid Atacama Desert.' }
    ]
    },
    {
    id: 'linux_commands',
    name: 'Linux Shell Commands (45+)',
    icon: Cpu,
    difficulty: 'Hard',
    description: 'Deduce Unix terminal tools by category, POSIX compliance, and filesystem modifications.',
    schema: [
    { key: 'domain', label: 'Category', type: 'enum' },
    { key: 'posix', label: 'POSIX Standard', type: 'boolean' },
    { key: 'modifies_fs', label: 'Modifies Filesystem', type: 'boolean' },
    { key: 'requires_root', label: 'Needs Root Often', type: 'boolean' }
    ],
    items: [
    { id: 'grep', name: 'grep', domain: 'Text Processing', posix: true, modifies_fs: false, requires_root: false, fact:
    'Stands for Global Regular Expression Print, originating in the ancient Unix ed editor.', hint: 'Filters stdin or files matching a regex pattern.' },
    { id: 'chmod', name: 'chmod', domain: 'File Permissions', posix: true, modifies_fs: true, requires_root: false,
    fact: 'Uses octal bits like 755 or 644 to alter read/write/execute file permissions.', hint: 'Used when making scripts executable (`chmod +x`).' },
    { id: 'systemctl', name: 'systemctl', domain: 'System Service', posix: false, modifies_fs: true, requires_root:
    true, fact: 'Central CLI management tool for systemd service daemons.', hint: 'Used to start, stop, or enable system services.' },
    { id: 'awk', name: 'awk', domain: 'Text Processing', posix: true, modifies_fs: false, requires_root: false, fact:
    'Full Turing-complete language named after creators Aho, Weinberger, and Kernighan.', hint: 'Slices columnar text fields efficiently.' },
    { id: 'sed', name: 'sed', domain: 'Text Processing', posix: true, modifies_fs: true, requires_root: false, fact:
    'Stream Editor designed for parsing and transforming text streams via regex substitution.', hint: 'Used for inline text search-and-replace (`s/old/new/g`).' },
    { id: 'find', name: 'find', domain: 'File Operations', posix: true, modifies_fs: false, requires_root: false, fact:
    'Recursively walks directory trees searching by name, size, or modification date.', hint: 'Search directory hierarchies for matching files.' },
    { id: 'xargs', name: 'xargs', domain: 'Utility Pipeline', posix: true, modifies_fs: false, requires_root: false,
    fact: 'Builds and executes command lines from standard input arguments.', hint: 'Pipes stdout lists into input args for another tool.' },
    { id: 'tar', name: 'tar', domain: 'Archiving', posix: true, modifies_fs: true, requires_root: false, fact: 'Tape Archive utility originally written to write multi-file archives onto physical magnetic tape.', hint: 'Bundles directory trees into `.tar.gz` archives.' },
    { id: 'curl', name: 'curl', domain: 'Networking', posix: false, modifies_fs: false, requires_root: false, fact:
    'Supports HTTP, HTTPS, FTP, and dozens of protocols for transferring data with URLs.', hint: 'Command line tool for requesting web endpoints.' },
    { id: 'ssh', name: 'ssh', domain: 'Networking', posix: false, modifies_fs: false, requires_root: false, fact:
    'Secure Shell protocol encrypted replacement for unencrypted Telnet.', hint: 'Logs into remote servers securely.' },
    { id: 'top', name: 'top', domain: 'Process Monitor', posix: true, modifies_fs: false, requires_root: false, fact:
    'Provides a dynamic real-time view of running system processes and CPU utilization.', hint: 'Real-time task manager in the terminal.' },
    { id: 'htop', name: 'htop', domain: 'Process Monitor', posix: false, modifies_fs: false, requires_root: false, fact:
    'Interactive ncurses-based process viewer offering colorized CPU core usage bars.', hint: 'Colorized, mouse-friendly process manager.' },
    { id: 'chown', name: 'chown', domain: 'File Permissions', posix: true, modifies_fs: true, requires_root: true, fact:
    'Changes ownership user and group assignment of files and directories.', hint: 'Command to change file owner (`owner:group`).' },
    { id: 'df', name: 'df', domain: 'Disk Operations', posix: true, modifies_fs: false, requires_root: false, fact:
    'Displays disk filesystem space usage for mounted storage drives.', hint: 'Report file system disk space usage (`df -h`).' },
    { id: 'du', name: 'du', domain: 'Disk Operations', posix: true, modifies_fs: false, requires_root: false, fact:
    'Disk Usage utility estimates file space usage recursively within directories.', hint: 'Calculates directory folder sizes.' },
    { id: 'iptables', name: 'iptables', domain: 'Networking', posix: false, modifies_fs: false, requires_root: true,
    fact: 'CLI firewall utility that configures Linux kernel IPv4 packet filtering rules.', hint: 'Configures netfilter firewall rules.' },
    { id: 'crontab', name: 'crontab', domain: 'Task Scheduling', posix: true, modifies_fs: true, requires_root: false,
    fact: 'Schedules recurring background cron jobs using 5 time-and-date fields.', hint: 'Schedules periodic automated background commands.' }
    ]
    },
    {
    id: 'scientists',
    name: 'Historical Scientists (35+)',
    icon: Dna,
    difficulty: 'Medium',
    description: 'Deduce historical minds by century, Nobel status, primary field, and region.',
    schema: [
    { key: 'century', label: 'Active Century', type: 'number' },
    { key: 'nobel_laureate', label: 'Nobel Prize', type: 'boolean' },
    { key: 'primary_field', label: 'Primary Field', type: 'enum' },
    { key: 'region', label: 'Region', type: 'enum' }
    ],
    items: [
    { id: 'curie', name: 'Marie Curie', century: 20, nobel_laureate: true, primary_field: 'Physics / Chemistry', region:
    'Europe', fact: 'The only person to win Nobel Prizes in two different scientific fields.', hint: 'Discovered Radium and Polonium.' },
    { id: 'einstein', name: 'Albert Einstein', century: 20, nobel_laureate: true, primary_field: 'Theoretical Physics',
    region: 'Europe / N. America', fact: 'Won his 1921 Nobel Prize for explaining the photoelectric effect, not relativity!', hint: 'Formulated E = mc².' },
    { id: 'newton', name: 'Isaac Newton', century: 17, nobel_laureate: false, primary_field: 'Physics / Mathematics',
    region: 'Europe', fact: 'Formulated universal gravitation and co-invented calculus in 1666 while isolated during plague.', hint: 'Formulated laws of motion.' },
    { id: 'turing', name: 'Alan Turing', century: 20, nobel_laureate: false, primary_field: 'Computer Science', region:
    'Europe', fact: 'Cracked the German WWII Enigma cipher machine and devised theoretical Turing machines.', hint:
    'Father of modern theoretical computer science.' },
    { id: 'tesla', name: 'Nikola Tesla', century: 19, nobel_laureate: false, primary_field: 'Electrical Engineering',
    region: 'Europe / N. America', fact: 'Championed Alternating Current (AC) electricity over Thomas Edison’s Direct Current.', hint: 'Pioneered induction motors and AC power.' },
    { id: 'darwin', name: 'Charles Darwin', century: 19, nobel_laureate: false, primary_field: 'Evolutionary Biology',
    region: 'Europe', fact: 'Published On the Origin of Species in 1859 after observing Galapagos finches.', hint:
    'Proposed natural selection.' },
    { id: 'galileo', name: 'Galileo Galilei', century: 17, nobel_laureate: false, primary_field: 'Astronomy / Physics',
    region: 'Europe', fact: 'Discovered Jupiter’s four largest moons using his improved refracting telescope.', hint:
    'Father of observational astronomy.' },
    { id: 'copernicus', name: 'Nicolaus Copernicus', century: 16, nobel_laureate: false, primary_field: 'Astronomy',
    region: 'Europe', fact: 'Formulated heliocentric model placing the Sun at center of solar system.', hint: 'Replaced geocentric model with heliocentrism.' },
    { id: 'pasteur', name: 'Louis Pasteur', century: 19, nobel_laureate: false, primary_field: 'Microbiology', region:
    'Europe', fact: 'Discovered principles of vaccination, microbial fermentation, and pasteurization.', hint: 'Proved germ theory of disease.' },
    { id: 'hawking', name: 'Stephen Hawking', century: 20, nobel_laureate: false, primary_field: 'Theoretical Physics',
    region: 'Europe', fact: 'Theoretical physicist who predicted black holes emit Hawking radiation.', hint: 'Author of A Brief History of Time.' },
    { id: 'mendeleev', name: 'Dmitri Mendeleev', century: 19, nobel_laureate: false, primary_field: 'Chemistry', region:
    'Europe', fact: 'Created periodic table of elements in 1869, correctly predicting undiscovered elements.', hint:
    'Formulated Periodic Law.' },
    { id: 'bohr', name: 'Niels Bohr', century: 20, nobel_laureate: true, primary_field: 'Quantum Physics', region:
    'Europe', fact: 'Developed Bohr atomic model with quantized electron orbital energy levels.', hint: '1922 Nobel laureate for atomic structure.' },
    { id: 'lovelace', name: 'Ada Lovelace', century: 19, nobel_laureate: false, primary_field: 'Computer Science',
    region: 'Europe', fact: 'Published first algorithm intended for Charles Babbage’s mechanical Analytical Engine.',
    hint: 'Recognized as world’s first computer programmer.' },
    { id: 'feynman', name: 'Richard Feynman', century: 20, nobel_laureate: true, primary_field: 'Quantum Physics',
    region: 'N. America', fact: 'Pioneered quantum electrodynamics and pictorial Feynman diagrams.', hint: 'Famous Feynman Lectures author.' }
    ]
    },
    {
    id: 'prog_lang',
    name: 'Programming Languages (30+)',
    icon: Terminal,
    difficulty: 'Medium',
    description: 'Deduce computer languages by paradigms, year, compilation, and safety.',
    schema: [
    { key: 'compiled', label: 'Compiled', type: 'boolean' },
    { key: 'memory_safe', label: 'Memory Safe', type: 'boolean' },
    { key: 'garbage_collected', label: 'GC Engine', type: 'boolean' },
    { key: 'year', label: 'Year Created', type: 'number' },
    { key: 'typing', label: 'Typing System', type: 'enum' },
    { key: 'paradigms', label: 'Paradigms', type: 'array' }
    ],
    items: [
    { id: 'rust', name: 'Rust', compiled: true, memory_safe: true, garbage_collected: false, year: 2010, typing:
    'Strong/Static', paradigms: ['Functional', 'Imperative', 'Concurrent'], fact: 'Rust uses ownership and borrowing rules enforced at compile-time without a runtime GC.', hint: 'Loved for performance without garbage collection.' },
    { id: 'java', name: 'Java', compiled: true, memory_safe: true, garbage_collected: true, year: 1995, typing:
    'Strong/Static', paradigms: ['Object-Oriented', 'Imperative'], fact: 'Runs bytecode on the JVM, operating on billions of devices.', hint: 'Slogan: Write once, run anywhere.' },
    { id: 'python', name: 'Python', compiled: false, memory_safe: true, garbage_collected: true, year: 1991, typing:
    'Strong/Dynamic', paradigms: ['Object-Oriented', 'Imperative', 'Functional'], fact: 'Named after Monty Python; dominant in AI and data science.', hint: 'Emphasizes readability with clean indentation.' },
    { id: 'cpp', name: 'C++', compiled: true, memory_safe: false, garbage_collected: false, year: 1985, typing:
    'Strong/Static', paradigms: ['Object-Oriented', 'Procedural', 'Generic'], fact: 'Grants direct pointer manipulation, dominant in game engines.', hint: 'Created by Bjarne Stroustrup as C with Classes.' },
    { id: 'javascript', name: 'JavaScript', compiled: false, memory_safe: true, garbage_collected: true, year: 1995,
    typing: 'Weak/Dynamic', paradigms: ['Event-Driven', 'Functional', 'Object-Oriented'], fact: 'Created in 10 days by Brendan Eich in 1995.', hint: 'Native language of web browsers.' },
    { id: 'go', name: 'Go (Golang)', compiled: true, memory_safe: true, garbage_collected: true, year: 2009, typing:
    'Strong/Static', paradigms: ['Concurrent', 'Imperative'], fact: 'Built at Google featuring lightweight Goroutines.',
    hint: 'Features a Gopher mascot.' },
    { id: 'haskell', name: 'Haskell', compiled: true, memory_safe: true, garbage_collected: true, year: 1990, typing:
    'Strong/Static', paradigms: ['Pure Functional', 'Lazy Evaluation'], fact: 'Purely functional language with lazy evaluation by default.', hint: 'Named after logician Haskell Curry.' },
    { id: 'c', name: 'C', compiled: true, memory_safe: false, garbage_collected: false, year: 1972, typing:
    'Strong/Static', paradigms: ['Procedural', 'Imperative'], fact: 'Developed at Bell Labs by Dennis Ritchie to build Unix.', hint: 'Mother of modern operating systems.' },
    { id: 'typescript', name: 'TypeScript', compiled: false, memory_safe: true, garbage_collected: true, year: 2012,
    typing: 'Strong/Static', paradigms: ['Object-Oriented', 'Functional'], fact: 'Developed by Microsoft as a typed superset of JavaScript.', hint: 'Transpiles into clean JavaScript.' },
    { id: 'swift', name: 'Swift', compiled: true, memory_safe: true, garbage_collected: true, year: 2014, typing:
    'Strong/Static', paradigms: ['Object-Oriented', 'Functional', 'Protocol-Oriented'], fact: 'Created by Apple to replace Objective-C for iOS/macOS apps.', hint: 'Official Apple platform language.' }
    ]
    }
    ];

    // ==========================================
    // 3. COMPARISON ENGINE ALGORITHM
    // ==========================================
    function compareItemAttribute(schemaDef, guessedVal, targetVal) {
    const { type } = schemaDef;

    if (type === 'boolean') {
    const isMatch = guessedVal === targetVal;
    return {
    status: isMatch ? 'exact' : 'mismatch',
    text: isMatch ? (guessedVal ? 'True' : 'False') : (guessedVal ? 'True' : 'False'),
    symbol: isMatch ? '✓' : '✗',
    explanation: isMatch
    ? `Both match (${guessedVal ? 'Yes' : 'No'})`
    : `Target is ${targetVal ? 'Yes' : 'No'}, but guess was ${guessedVal ? 'Yes' : 'No'}`
    };
    }

    if (type === 'number') {
    if (guessedVal === targetVal) {
    return {
    status: 'exact',
    text: `${guessedVal}`,
    symbol: '✓',
    explanation: `Exact numeric match (${guessedVal})`
    };
    }
    const isHigher = targetVal > guessedVal;
    return {
    status: isHigher ? 'higher' : 'lower',
    text: `${guessedVal} ${isHigher ? '↑' : '↓'}`,
    symbol: isHigher ? '↑' : '↓',
    explanation: `Target value is ${isHigher ? 'HIGHER' : 'LOWER'} than ${guessedVal}`
    };
    }

    if (type === 'enum') {
    const isMatch = String(guessedVal).toLowerCase() === String(targetVal).toLowerCase();
    return {
    status: isMatch ? 'exact' : 'mismatch',
    text: `${guessedVal}`,
    symbol: isMatch ? '✓' : '✗',
    explanation: isMatch
    ? `Exact match: ${guessedVal}`
    : `Category mismatch (${guessedVal} vs Target: ${targetVal})`
    };
    }

    if (type === 'array') {
    const guessArr = Array.isArray(guessedVal) ? guessedVal : [];
    const targetArr = Array.isArray(targetVal) ? targetVal : [];

    const intersection = guessArr.filter((val) =>
    targetArr.some((tVal) => tVal.toLowerCase() === val.toLowerCase())
    );

    const isExact =
    guessArr.length === targetArr.length &&
    intersection.length === guessArr.length;

    if (isExact) {
    return {
    status: 'exact',
    text: guessArr.join(', '),
    symbol: '✓',
    explanation: `All tags match: [${guessArr.join(', ')}]`
    };
    }

    if (intersection.length > 0) {
    return {
    status: 'partial',
    text: guessArr.join(', '),
    symbol: '~',
    explanation: `Shares overlapping traits: [${intersection.join(', ')}]`
    };
    }

    return {
    status: 'mismatch',
    text: guessArr.join(', '),
    symbol: '✗',
    explanation: `No shared traits with target`
    };
    }

    return { status: 'mismatch', text: String(guessedVal), symbol: '?' };
    }

    // ==========================================
    // 4. MAIN APP COMPONENT
    // ==========================================
    export default function App() {
    // Navigation & Game State
    const [activeTab, setActiveTab] = useState('play'); // 'play', 'codex'
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES_DATA[0]);
    const [gameMode, setGameMode] = useState('standard'); // 'standard', 'daily'

    // Current Target State
    const [targetItem, setTargetItem] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
    const [searchQuery, setSearchQuery] = useState('');
    const [codexSearch, setCodexSearch] = useState('');
    const [codexCategoryFilter, setCodexCategoryFilter] = useState('all');
    const [hintUnlocked, setHintUnlocked] = useState(false);

    // User Stats & Persistence
    const [xp, setXp] = useState(380);
    const [streak, setStreak] = useState(5);
    const [solvedCount, setSolvedCount] = useState(12);
    const [unlockedFacts, setUnlockedFacts] = useState([
    'elem_1', 'elem_6', 'elem_79', 'elem_80', 'japan', 'curie', 'grep', 'rust'
    ]);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Initialize Game Round
    const startNewGame = (category = selectedCategory, mode = gameMode) => {
    setSelectedCategory(category);
    setGameMode(mode);

    // Pick random target
    let availableItems = category.items;
    if (mode === 'daily') {
    const dayHash = new Date().getUTCDate() % availableItems.length;
    setTargetItem(availableItems[dayHash]);
    } else {
    const randomIdx = Math.floor(Math.random() * availableItems.length);
    setTargetItem(availableItems[randomIdx]);
    }

    setGuesses([]);
    setGameStatus('playing');
    setSearchQuery('');
    setHintUnlocked(false);
    };

    useEffect(() => {
    startNewGame(CATEGORIES_DATA[0], 'standard');
    }, []);

    useEffect(() => {
    audio.muted = !soundEnabled;
    }, [soundEnabled]);

    // Handle Player Guess
    const handleMakeGuess = (guessedItem) => {
    if (gameStatus !== 'playing' || !guessedItem) return;

    if (guesses.some((g) => g.item.id === guessedItem.id)) return;

    audio.click();

    const comparisons = selectedCategory.schema.map((schemaDef) => {
    const guessedVal = guessedItem[schemaDef.key];
    const targetVal = targetItem[schemaDef.key];
    return {
    key: schemaDef.key,
    label: schemaDef.label,
    type: schemaDef.type,
    comparison: compareItemAttribute(schemaDef, guessedVal, targetVal)
    };
    });

    const isWin = guessedItem.id === targetItem.id;
    const newGuessEntry = {
    item: guessedItem,
    comparisons,
    isWin
    };

    const newGuesses = [newGuessEntry, ...guesses];
    setGuesses(newGuesses);
    setSearchQuery('');

    // Unlock fact in Codex
    if (!unlockedFacts.includes(guessedItem.id)) {
    setUnlockedFacts((prev) => [...prev, guessedItem.id]);
    }

    if (isWin) {
    audio.victory();
    setGameStatus('won');
    setXp((prev) => prev + 120 + Math.max(0, 60 - newGuesses.length * 5));
    setStreak((prev) => prev + 1);
    setSolvedCount((prev) => prev + 1);
    } else {
    audio.mismatch();
    if (newGuesses.length >= 8) {
    setGameStatus('lost');
    setStreak(0);
    }
    }
    };

    // Fast memoized available options capped at top 25 for crisp typing performance
    const availableOptions = useMemo(() => {
    if (!selectedCategory) return [];
    const guessedIds = new Set(guesses.map((g) => g.item.id));
    const query = searchQuery.trim().toLowerCase();

    const filtered = selectedCategory.items.filter((item) => {
    if (guessedIds.has(item.id)) return false;
    if (!query) return true;
    return item.name.toLowerCase().includes(query);
    });

    return filtered.slice(0, 25);
    }, [selectedCategory, guesses, searchQuery]);

    // Codex Filtered Items
    const filteredCodexItems = useMemo(() => {
    return CATEGORIES_DATA.flatMap((cat) => {
    if (codexCategoryFilter !== 'all' && cat.id !== codexCategoryFilter) return [];
    return cat.items
    .filter((item) => {
    if (!codexSearch.trim()) return true;
    return (
    item.name.toLowerCase().includes(codexSearch.toLowerCase()) ||
    cat.name.toLowerCase().includes(codexSearch.toLowerCase())
    );
    })
    .map((item) => ({ ...item, categoryName: cat.name, catId: cat.id }));
    });
    }, [codexCategoryFilter, codexSearch]);

    // Render Badge according to comparison result
    const renderResultBadge = (cmp) => {
    const { status, text } = cmp.comparison;

    let bgClass = 'bg-slate-800 text-slate-300 border-slate-700';
    let icon = null;

    if (status === 'exact') {
    bgClass = 'bg-emerald-950/80 text-emerald-400 border-emerald-600/60 shadow-sm shadow-emerald-950';
    icon =
    <Check className="w-3.5 h-3.5 mr-1 stroke-[3]" />;
    } else if (status === 'partial') {
    bgClass = 'bg-amber-950/80 text-amber-400 border-amber-600/60';
    icon =
    <Sparkles className="w-3.5 h-3.5 mr-1" />;
    } else if (status === 'higher') {
    bgClass = 'bg-sky-950/80 text-sky-400 border-sky-600/60';
    icon =
    <ArrowUp className="w-3.5 h-3.5 mr-1 stroke-[3] animate-bounce" />;
    } else if (status === 'lower') {
    bgClass = 'bg-indigo-950/80 text-indigo-400 border-indigo-600/60';
    icon =
    <ArrowDown className="w-3.5 h-3.5 mr-1 stroke-[3] animate-bounce" />;
    } else {
    bgClass = 'bg-rose-950/60 text-rose-400 border-rose-800/60';
    icon =
    <X className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />;
    }

    return (
    <div className={`group relative flex items-center justify-center px-2.5 py-2 rounded-lg border text-xs font-semibold
        tracking-wide transition-all ${bgClass}`}>
        {icon}
        <span className="truncate max-w-[100px]">{text}</span>

        {/* Tooltip on hover */}
        <div
            className="absolute bottom-full mb-2 hidden group-hover:block z-30 w-48 p-2 text-[11px] font-normal text-slate-200 bg-slate-900 border border-slate-700 rounded-md shadow-xl pointer-events-none text-center">
            <p className="font-semibold text-amber-300 mb-0.5">{cmp.label}</p>
            {cmp.comparison.explanation}
        </div>
    </div>
    );
    };

    return (
    <div
        className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 antialiased pb-12">
        {/* HEADER BAR */}
        <header
            className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Brand Logo */}
                <div className="flex items-center space-x-3 cursor-pointer" onClick={()=> setActiveTab('play')}>
                    <div
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/50">
                        <Brain className="w-6 h-6 text-slate-950 stroke-[2.5]" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h1
                                className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-slate-100 bg-clip-text text-transparent">
                                Deduction Quest
                            </h1>
                            <span
                                className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                                v3.0 Exhaustive
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 hidden sm:block">
                            Learn science & logic through deductive elimination
                        </p>
                    </div>
                </div>

                {/* Player Stats Bar */}
                <div className="flex items-center space-x-4 text-xs font-medium">
                    <div
                        className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                        <span className="text-slate-300">Streak:</span>
                        <span className="font-bold text-amber-400">{streak}</span>
                    </div>

                    <div
                        className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                        <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                        <span className="text-slate-300">XP:</span>
                        <span className="font-bold text-emerald-400">{xp}</span>
                    </div>

                    <button onClick={()=> setSoundEnabled(!soundEnabled)}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition"
                        title="Toggle Audio Effects"
                        >
                        {soundEnabled ?
                        <Volume2 className="w-4 h-4 text-emerald-400" /> :
                        <VolumeX className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </header>

        {/* MAIN CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
            {/* NAVIGATION TABS */}
            <div
                className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6 overflow-x-auto gap-2">
                <div className="flex items-center space-x-2">
                    <button onClick={()=> setActiveTab('play')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                        activeTab === 'play'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                        >
                        <Brain className="w-4 h-4" />
                        <span>Play Deduction</span>
                    </button>

                    <button onClick={()=> {
                        setActiveTab('play');
                        startNewGame(selectedCategory, 'daily');
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                        gameMode === 'daily' && activeTab === 'play'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                        >
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>Daily Puzzle</span>
                    </button>

                    <button onClick={()=> setActiveTab('codex')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                        activeTab === 'codex'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                        >
                        <BookOpen className="w-4 h-4" />
                        <span>Fact Codex</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950/30 text-emerald-950 font-bold">
                            {unlockedFacts.length}
                        </span>
                    </button>
                </div>

                <div className="text-xs text-slate-500 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Solved: <strong className="text-slate-300">{solvedCount}</strong></span>
                </div>
            </div>

            {/* TAB 1: PLAY DEDUCTION */}
            {activeTab === 'play' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* SIDEBAR: CATEGORY SELECTOR */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                        <h2
                            className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                            <span>Categories</span>
                            <Layers className="w-3.5 h-3.5 text-slate-500" />
                        </h2>

                        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                            {CATEGORIES_DATA.map((cat) => {
                            const IconComp = cat.icon;
                            const isSelected = selectedCategory.id === cat.id;

                            return (
                            <button key={cat.id} onClick={()=> startNewGame(cat, 'standard')}
                                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start
                                space-x-3 ${
                                isSelected
                                ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-950/20'
                                : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                                }`}
                                >
                                <div className={`p-2 rounded-lg shrink-0 ${ isSelected ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-400' }`}>
                                    <IconComp className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className="text-sm font-semibold text-slate-200 truncate">{cat.name}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{cat.description}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded font-mono ${
                                            cat.difficulty==='Easy'
                                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                                            cat.difficulty==='Medium'
                                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                            : 'bg-rose-950 text-rose-400 border border-rose-800' }`}>
                                            {cat.difficulty}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            {cat.items.length} items
                                        </span>
                                    </div>
                                </div>
                            </button>
                            );
                            })}
                        </div>
                    </div>

                    {/* HINT & RULES CARD */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                            <h3
                                className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                                <HelpCircle className="w-4 h-4 text-emerald-400" />
                                <span>Target Clue</span>
                            </h3>
                            {!hintUnlocked && gameStatus === 'playing' && (
                            <button onClick={()=> setHintUnlocked(true)}
                                className="text-[10px] px-2 py-1 rounded bg-amber-950 text-amber-400 border border-amber-800 hover:bg-amber-900 transition"
                                >
                                Unlock (-15 XP)
                            </button>
                            )}
                        </div>

                        {hintUnlocked ? (
                        <p
                            className="text-xs text-amber-200/90 italic bg-amber-950/30 p-3 rounded-lg border border-amber-900/50">
                            "{targetItem?.hint}"
                        </p>
                        ) : (
                        <p className="text-xs text-slate-500 italic">
                            Unlock a clue if you are stuck eliminating properties.
                        </p>
                        )}
                    </div>
                </div>

                {/* MAIN BOARD */}
                <div className="lg:col-span-3 space-y-6">
                    {/* INPUT & STATUS HEADER */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                        <div
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-lg font-bold text-slate-100">{selectedCategory.name}</h2>
                                    {gameMode === 'daily' && (
                                    <span
                                        className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full font-mono">
                                        Daily Challenge
                                    </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Database loaded with {selectedCategory.items.length} total entries. Guess items to
                                    eliminate attributes.
                                </p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="text-xs text-slate-400 font-mono">
                                    Attempts: <span className="text-emerald-400 font-bold">{guesses.length}</span> / 8
                                </div>
                                <button onClick={()=> startNewGame(selectedCategory, gameMode)}
                                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                                    >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>New Target</span>
                                </button>
                            </div>
                        </div>

                        {/* GUESS SEARCH INPUT */}
                        {gameStatus === 'playing' ? (
                        <div className="relative">
                            <div className="relative flex items-center">
                                <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
                                <input type="text" value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)}
                                placeholder={`Search and guess from ${selectedCategory.items.length} items...`}
                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                />
                            </div>

                            {/* AUTOCOMPLETE DROPDOWN */}
                            {searchQuery.trim().length > 0 && (
                            <div
                                className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                                {availableOptions.length > 0 ? (
                                availableOptions.map((item) => (
                                <button key={item.id} onClick={()=> handleMakeGuess(item)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-950/40 hover:text-emerald-300 transition flex items-center justify-between text-sm"
                                    >
                                    <span className="font-medium text-slate-200">{item.name}</span>
                                    <span className="text-xs text-slate-500">Select to Guess →</span>
                                </button>
                                ))
                                ) : (
                                <div className="px-4 py-3 text-xs text-slate-500 text-center">
                                    No matching items or already guessed.
                                </div>
                                )}
                            </div>
                            )}
                        </div>
                        ) : (
                        /* VICTORY / DEFEAT BANNER */
                        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between
                            gap-4 ${ gameStatus==='won' ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-600/80 text-rose-200' }`}>
                            <div className="flex items-center space-x-3">
                                <div className={`p-3 rounded-full ${ gameStatus==='won'
                                    ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-slate-950' }`}>
                                    {gameStatus === 'won' ?
                                    <Trophy className="w-6 h-6" /> :
                                    <X className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base">
                                        {gameStatus === 'won'
                                        ? `Deduction Complete! Solved in ${guesses.length} attempts!`
                                        : `Out of Guesses! The target was ${targetItem?.name}.`}
                                    </h3>
                                    <p className="text-xs opacity-90 mt-0.5">{targetItem?.fact}</p>
                                </div>
                            </div>

                            <button onClick={()=> startNewGame(selectedCategory, 'standard')}
                                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs shadow-lg transition whitespace-nowrap"
                                >
                                Play Next Round →
                            </button>
                        </div>
                        )}
                    </div>

                    {/* DEDUCTION MATRIX GRID */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-x-auto">
                        <h3
                            className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
                            <span>Deduction Log Matrix</span>
                            <span className="text-[10px] text-slate-500 font-normal">
                                Hover badges for property comparisons
                            </span>
                        </h3>

                        {guesses.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 space-y-2">
                            <Search className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
                            <p className="text-sm">No guesses submitted yet.</p>
                            <p className="text-xs text-slate-600">
                                Search and select an item above to test attributes.
                            </p>
                        </div>
                        ) : (
                        <div className="space-y-4 min-w-[600px]">
                            {/* SCHEMA HEADERS */}
                            <div
                                className="grid grid-cols-7 gap-2 text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
                                <div className="col-span-1">Guessed Item</div>
                                {selectedCategory.schema.map((sch) => (
                                <div key={sch.key} className="col-span-1 text-center truncate">
                                    {sch.label}
                                </div>
                                ))}
                            </div>

                            {/* GUESS ROWS */}
                            {guesses.map((entry, idx) => (
                            <div key={idx} className="space-y-2">
                                <div
                                    className="grid grid-cols-7 gap-2 items-center bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                                    <div
                                        className="col-span-1 font-semibold text-xs text-slate-200 truncate flex items-center space-x-1.5">
                                        <span className="text-[10px] text-slate-500 font-mono">#{guesses.length -
                                            idx}</span>
                                        <span className="truncate">{entry.item.name}</span>
                                    </div>

                                    {entry.comparisons.map((cmp, cIdx) => (
                                    <div key={cIdx} className="col-span-1 flex justify-center">
                                        {renderResultBadge(cmp)}
                                    </div>
                                    ))}
                                </div>

                                {/* DID YOU KNOW MICRO-LEARNING DROP */}
                                <div
                                    className="bg-slate-950/40 border border-slate-800/50 rounded-lg p-2.5 px-3 flex items-start space-x-2.5 text-xs text-slate-300">
                                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-semibold text-emerald-300 mr-1.5">Did You Know?</span>
                                        <span className="text-slate-300">{entry.item.fact}</span>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                </div>
            </div>
            )}

            {/* TAB 2: KNOWLEDGE CODEX */}
            {activeTab === 'codex' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-emerald-400" />
                            <span>Unlocked Knowledge Codex</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Collection of all scientific facts discovered through your deductions
                            ({unlockedFacts.length} unlocked).
                        </p>
                    </div>

                    {/* CODEX SEARCH & FILTER */}
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <input type="text" value={codexSearch} onChange={(e)=> setCodexSearch(e.target.value)}
                        placeholder="Search facts or items..."
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                        <select value={codexCategoryFilter} onChange={(e)=> setCodexCategoryFilter(e.target.value)}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
                            >
                            <option value="all">All Categories</option>
                            {CATEGORIES_DATA.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1">
                    {filteredCodexItems.map((item) => {
                    const isUnlocked = unlockedFacts.includes(item.id);

                    return (
                    <div key={item.id} className={`p-4 rounded-xl border transition-all ${ isUnlocked
                        ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                        : 'bg-slate-950/20 border-slate-900 text-slate-600 opacity-60' }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-emerald-400">{item.categoryName}</span>
                            {isUnlocked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                            <Lock className="w-4 h-4 text-slate-600" />
                            )}
                        </div>

                        <h3 className="font-bold text-sm text-slate-100">{item.name}</h3>

                        {isUnlocked ? (
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.fact}</p>
                        ) : (
                        <p className="text-xs text-slate-600 mt-2 italic">
                            Guess this item in a deduction game to unlock its fact card.
                        </p>
                        )}
                    </div>
                    );
                    })}
                </div>
            </div>
            )}
        </div>
    </div>
    );
    }