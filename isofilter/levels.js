/**
 * ISOFILTER: Logic Lab Puzzle Levels (1-15)
 * Progressively challenging nuclear routing puzzles with gate economy and star ratings.
 */

export const LEVELS = [
    {
        id: 1,
        title: "Protocol 01: Fundamental Metallurgy",
        subtitle: "Sort incoming isotopes into Metals vs Non-Metals.",
        briefing: "Welcome to the Subatomic Processing Unit. Divert metallic elements to RED BIN and non-metallic isotopes to BLUE BIN.",
        bins: [
            { id: 'bin_a', label: 'RED BIN: Metals', color: '#ef4444', matchRule: { type: 'metal', value: true } },
            { id: 'bin_b', label: 'BLUE BIN: Non-Metals', color: '#3b82f6', matchRule: { type: 'metal', value: false } }
        ],
        availableGates: [
            { id: 'g_metal', label: 'METALLIC?', config: { type: 'metal', value: true } },
            { id: 'g_rad', label: 'RADIOACTIVE?', config: { type: 'radioactive', value: true } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['Fe-56', 'H-1', 'Pb-208', 'C-12', 'Na-24', 'He-4']
    },
    {
        id: 2,
        title: "Protocol 02: Radiological Containment",
        subtitle: "Separate Active Radiation from Stable Elements.",
        briefing: "Ionizing emitters must be routed to the HAZARD VAULT. Stable isotopes proceed to SAFE STORAGE.",
        bins: [
            { id: 'bin_a', label: 'HAZARD VAULT: Radioactive', color: '#eab308', matchRule: { type: 'radioactive', value: true } },
            { id: 'bin_b', label: 'SAFE STORAGE: Stable', color: '#10b981', matchRule: { type: 'radioactive', value: false } }
        ],
        availableGates: [
            { id: 'g_rad', label: 'RADIOACTIVE?', config: { type: 'radioactive', value: true } },
            { id: 'g_mass_200', label: 'MASS > 200?', config: { type: 'mass', operator: '>', value: 200 } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['Co-60', 'C-12', 'Cs-137', 'Fe-56', 'U-238', 'Pb-208', 'H-3']
    },
    {
        id: 3,
        title: "Protocol 03: Heavy Actinide Mass Threshold",
        subtitle: "Filter heavy isotopes with atomic mass greater than 230.",
        briefing: "Actinide fuel precursors have atomic mass > 230. Route them to CORE BIN; lighter isotopes to DISPERSAL.",
        bins: [
            { id: 'bin_a', label: 'CORE BIN: Mass > 230', color: '#8b5cf6', matchRule: { type: 'mass', operator: '>', value: 230 } },
            { id: 'bin_b', label: 'DISPERSAL: Mass ≤ 230', color: '#64748b', matchRule: { type: 'mass', operator: '<=', value: 230 } }
        ],
        availableGates: [
            { id: 'g_mass_gt230', label: 'MASS > 230?', config: { type: 'mass', operator: '>', value: 230 } },
            { id: 'g_element_u', label: 'ELEMENT = URANIUM?', config: { type: 'element', value: 'Uranium' } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['U-235', 'Fe-56', 'Th-232', 'Pb-208', 'Pu-239', 'Co-60', 'Am-241', 'I-131']
    },
    {
        id: 4,
        title: "Protocol 04: Chemical Elemental Sieve",
        subtitle: "Isolate Uranium specifically from other actinide neighbors.",
        briefing: "Separate pure Uranium isotopes from Thorium, Plutonium, and lighter elements into the URANIUM CYLINDER.",
        bins: [
            { id: 'bin_a', label: 'URANIUM CYLINDER', color: '#22c55e', matchRule: { type: 'element', value: 'Uranium' } },
            { id: 'bin_b', label: 'OTHER ELEMENTS', color: '#64748b', matchRule: { op: 'NOT', subA: { type: 'element', value: 'Uranium' } } }
        ],
        availableGates: [
            { id: 'g_element_u', label: 'ELEMENT = URANIUM?', config: { type: 'element', value: 'Uranium' } },
            { id: 'g_rad', label: 'RADIOACTIVE?', config: { type: 'radioactive', value: true } },
            { id: 'g_mass_235', label: 'MASS == 235?', config: { type: 'mass', operator: '==', value: 235 } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['U-235', 'Th-232', 'U-238', 'Pu-239', 'Pb-208', 'Fe-56']
    },
    {
        id: 5,
        title: "Protocol 05: Boolean AND Conjunction",
        subtitle: "Radioactive AND Element = Uranium",
        briefing: "Route materials that are BOTH Radioactive AND Uranium to the REACTOR FEED; non-matching to REJECT.",
        bins: [
            { id: 'bin_a', label: 'REACTOR FEED: Radioactive Uranium', color: '#06b6d4', matchRule: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'element', value: 'Uranium' } } },
            { id: 'bin_b', label: 'REJECT BIN', color: '#64748b', matchRule: { op: 'NOT', subA: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'element', value: 'Uranium' } } } }
        ],
        availableGates: [
            { id: 'g_and_u_rad', label: 'RADIOACTIVE AND URANIUM', config: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'element', value: 'Uranium' } } },
            { id: 'g_or_u_th', label: 'URANIUM OR THORIUM', config: { op: 'OR', subA: { type: 'element', value: 'Uranium' }, subB: { type: 'element', value: 'Thorium' } } },
            { id: 'g_metal', label: 'METALLIC?', config: { type: 'metal', value: true } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['U-235', 'C-12', 'U-238', 'Fe-56', 'Co-60', 'Pb-208', 'H-1']
    },
    {
        id: 6,
        title: "Protocol 06: Boolean OR Disjunction",
        subtitle: "Fuel Precursors: Uranium OR Thorium",
        briefing: "Collect all Uranium or Thorium isotopes into FERTILE/FISSILE CELL, diverting everything else.",
        bins: [
            { id: 'bin_a', label: 'NUCLEAR FUEL: U or Th', color: '#10b981', matchRule: { op: 'OR', subA: { type: 'element', value: 'Uranium' }, subB: { type: 'element', value: 'Thorium' } } },
            { id: 'bin_b', label: 'SECONDARY STREAM', color: '#475569', matchRule: { op: 'NOT', subA: { op: 'OR', subA: { type: 'element', value: 'Uranium' }, subB: { type: 'element', value: 'Thorium' } } } }
        ],
        availableGates: [
            { id: 'g_or_u_th', label: 'URANIUM OR THORIUM', config: { op: 'OR', subA: { type: 'element', value: 'Uranium' }, subB: { type: 'element', value: 'Thorium' } } },
            { id: 'g_and_u_rad', label: 'RADIOACTIVE AND URANIUM', config: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'element', value: 'Uranium' } } },
            { id: 'g_mass_gt230', label: 'MASS > 230', config: { type: 'mass', operator: '>', value: 230 } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['Th-232', 'U-238', 'Pu-239', 'Co-60', 'U-235', 'Pb-208', 'Na-24']
    },
    {
        id: 7,
        title: "Protocol 07: Boolean NOT Inversion",
        subtitle: "Radioactive AND NOT Uranium",
        briefing: "Harvest non-uranium radionuclides (such as Co-60, I-131, Cs-137, H-3) for Medical & Industrial applications.",
        bins: [
            { id: 'bin_a', label: 'MEDICAL & TRACER VAULT', color: '#ec4899', matchRule: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { op: 'NOT', subA: { type: 'element', value: 'Uranium' } } } },
            { id: 'bin_b', label: 'EXCLUDED BATCH', color: '#334155', matchRule: { op: 'NOT', subA: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { op: 'NOT', subA: { type: 'element', value: 'Uranium' } } } } }
        ],
        availableGates: [
            { id: 'g_rad_not_u', label: 'RADIOACTIVE AND NOT URANIUM', config: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { op: 'NOT', subA: { type: 'element', value: 'Uranium' } } } },
            { id: 'g_not_rad', label: 'NOT RADIOACTIVE', config: { op: 'NOT', subA: { type: 'radioactive', value: true } } },
            { id: 'g_element_u', label: 'ELEMENT = URANIUM', config: { type: 'element', value: 'Uranium' } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['Co-60', 'U-235', 'I-131', 'Pb-208', 'Cs-137', 'U-238', 'C-14', 'Fe-56']
    },
    {
        id: 8,
        title: "Protocol 08: Cascading 3-Bin Pipeline",
        subtitle: "Multi-branch logic: Lead Shielding vs Uranium vs Other",
        briefing: "Build a 2-gate cascading pipeline: Gate 1 isolates Lead-208 (SHIELDING BIN); Gate 2 routes Uranium (REACTOR BIN) and rest (WASTE).",
        bins: [
            { id: 'bin_a', label: 'SHIELDING: Lead', color: '#64748b', matchRule: { type: 'element', value: 'Lead' } },
            { id: 'bin_b', label: 'REACTOR: Uranium', color: '#22c55e', matchRule: { type: 'element', value: 'Uranium' } },
            { id: 'bin_c', label: 'WASTE / BYPRODUCTS', color: '#f59e0b', matchRule: { op: 'AND', subA: { op: 'NOT', subA: { type: 'element', value: 'Lead' } }, subB: { op: 'NOT', subA: { type: 'element', value: 'Uranium' } } } }
        ],
        availableGates: [
            { id: 'g_lead', label: 'ELEMENT = LEAD', config: { type: 'element', value: 'Lead' } },
            { id: 'g_uranium', label: 'ELEMENT = URANIUM', config: { type: 'element', value: 'Uranium' } },
            { id: 'g_rad', label: 'RADIOACTIVE?', config: { type: 'radioactive', value: true } }
        ],
        maxGates: 2,
        optimalGates: 2,
        isotopeFeed: ['Pb-208', 'U-235', 'Fe-56', 'U-238', 'C-12', 'Pb-208', 'Co-60']
    },
    {
        id: 9,
        title: "Protocol 09: Half-Life Chrono-Sieve",
        subtitle: "Separate rapid-decay radioisotopes (Half-life < 100 days).",
        briefing: "Isotopes with short half-lives (< 100 days e.g. I-131, Na-24) require urgent radiopharmaceutical packaging.",
        bins: [
            { id: 'bin_a', label: 'RAPID DECAY (< 100d)', color: '#a855f7', matchRule: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'half_life', operator: '<', seconds: 8.64e6, label: '100 days' } } },
            { id: 'bin_b', label: 'LONG-LIVED / STABLE', color: '#3b82f6', matchRule: { op: 'NOT', subA: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'half_life', operator: '<', seconds: 8.64e6, label: '100 days' } } } }
        ],
        availableGates: [
            { id: 'g_hl_rapid', label: 'HALF-LIFE < 100 DAYS', config: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'half_life', operator: '<', seconds: 8.64e6, label: '100 days' } } },
            { id: 'g_metal', label: 'METALLIC?', config: { type: 'metal', value: true } },
            { id: 'g_mass_gt100', label: 'MASS > 100?', config: { type: 'mass', operator: '>', value: 100 } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['I-131', 'Na-24', 'U-238', 'C-14', 'Co-60', 'Pb-208', 'Cs-137']
    },
    {
        id: 10,
        title: "Protocol 10: Fissile Fuel Enrichment",
        subtitle: "Isolate weapons/power grade fissile nuclei (U-235 & Pu-239).",
        briefing: "Divert purely Fissile fuel (U-235, Pu-239) into the CRITICALITY CRADLE; non-fissile fertile isotopes into STORAGE.",
        bins: [
            { id: 'bin_a', label: 'CRITICALITY CRADLE (Fissile)', color: '#ef4444', matchRule: { type: 'fissile', value: true } },
            { id: 'bin_b', label: 'SUB-CRITICAL STOCKPILE', color: '#10b981', matchRule: { type: 'fissile', value: false } }
        ],
        availableGates: [
            { id: 'g_fissile', label: 'FISSILE FUEL?', config: { type: 'fissile', value: true } },
            { id: 'g_rad', label: 'RADIOACTIVE?', config: { type: 'radioactive', value: true } },
            { id: 'g_u', label: 'ELEMENT = URANIUM', config: { type: 'element', value: 'Uranium' } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['U-235', 'U-238', 'Pu-239', 'Th-232', 'Pb-208', 'Am-241']
    },
    {
        id: 11,
        title: "Protocol 11: Alpha Radiation Harvester",
        subtitle: "Filter Alpha Emitters specifically from Beta/Gamma rays.",
        briefing: "Alpha particles possess high ionizing power. Route all Alpha decaying isotopes to the ALPHA SPHERE.",
        bins: [
            { id: 'bin_a', label: 'ALPHA SPHERE', color: '#f97316', matchRule: { type: 'decay_mode', value: 'Alpha' } },
            { id: 'bin_b', label: 'BETA / GAMMA / STABLE', color: '#38bdf8', matchRule: { op: 'NOT', subA: { type: 'decay_mode', value: 'Alpha' } } }
        ],
        availableGates: [
            { id: 'g_decay_alpha', label: 'DECAY: ALPHA', config: { type: 'decay_mode', value: 'Alpha' } },
            { id: 'g_decay_gamma', label: 'DECAY: GAMMA', config: { type: 'decay_mode', value: 'Gamma' } },
            { id: 'g_mass_gt200', label: 'MASS > 200', config: { type: 'mass', operator: '>', value: 200 } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['Po-210', 'Ra-226', 'Th-232', 'Co-60', 'Cs-137', 'C-14', 'Am-241', 'H-3']
    },
    {
        id: 12,
        title: "Protocol 12: Gas & Non-Metal Scrubber",
        subtitle: "Sort Radioactive Non-Metals into atmospheric containment.",
        briefing: "Identify gaseous/non-metallic radionuclides (Tritium H-3, Carbon-14) to prevent facility atmospheric leakage.",
        bins: [
            { id: 'bin_a', label: 'ATMOSPHERIC SCRUBBER (Rad Non-Metal)', color: '#06b6d4', matchRule: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'metal', value: false } } },
            { id: 'bin_b', label: 'SOLID / STABLE LINE', color: '#64748b', matchRule: { op: 'NOT', subA: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'metal', value: false } } } }
        ],
        availableGates: [
            { id: 'g_rad_nonmetal', label: 'RAD AND NON-METAL', config: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'metal', value: false } } },
            { id: 'g_metal', label: 'METALLIC?', config: { type: 'metal', value: true } },
            { id: 'g_rad', label: 'RADIOACTIVE?', config: { type: 'radioactive', value: true } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['H-3', 'C-14', 'Fe-56', 'Co-60', 'C-12', 'H-1', 'He-4', 'U-235']
    },
    {
        id: 13,
        title: "Protocol 13: 3-Bin Complex Logistics",
        subtitle: "Separating Actinides, Transition Metals, and Light Elements.",
        briefing: "Route Actinides (U, Th, Pu, Am) to BIN 1, Heavy Transition Metals (Fe, Co) to BIN 2, and others to BIN 3.",
        bins: [
            { id: 'bin_a', label: 'BIN 1: Heavy Actinides (Mass > 230)', color: '#8b5cf6', matchRule: { type: 'mass', operator: '>', value: 230 } },
            { id: 'bin_b', label: 'BIN 2: Transition & Light Metals', color: '#3b82f6', matchRule: { type: 'metal', value: true } },
            { id: 'bin_c', label: 'BIN 3: Non-Metallic Gases & Carbons', color: '#10b981', matchRule: { type: 'metal', value: false } }
        ],
        availableGates: [
            { id: 'g_mass_gt230', label: 'MASS > 230', config: { type: 'mass', operator: '>', value: 230 } },
            { id: 'g_metal', label: 'METALLIC?', config: { type: 'metal', value: true } },
            { id: 'g_rad', label: 'RADIOACTIVE?', config: { type: 'radioactive', value: true } }
        ],
        maxGates: 2,
        optimalGates: 2,
        isotopeFeed: ['U-238', 'Fe-56', 'C-12', 'Th-232', 'Co-60', 'H-1', 'Pu-239', 'Na-24']
    },
    {
        id: 14,
        title: "Protocol 14: High Gate Economy Challenge",
        subtitle: "Multi-condition compound sorting with limited gate units.",
        briefing: "Separate High Radiation Actinides (Radioactive AND Mass > 200) into DEEP REPOSITORY; everything else to SURFACE.",
        bins: [
            { id: 'bin_a', label: 'DEEP REPOSITORY (Rad & Mass > 200)', color: '#e11d48', matchRule: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'mass', operator: '>', value: 200 } } },
            { id: 'bin_b', label: 'SURFACE FACILITY', color: '#64748b', matchRule: { op: 'NOT', subA: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'mass', operator: '>', value: 200 } } } }
        ],
        availableGates: [
            { id: 'g_comp_rad_heavy', label: 'RAD AND MASS > 200', config: { op: 'AND', subA: { type: 'radioactive', value: true }, subB: { type: 'mass', operator: '>', value: 200 } } },
            { id: 'g_rad', label: 'RADIOACTIVE?', config: { type: 'radioactive', value: true } },
            { id: 'g_metal', label: 'METALLIC?', config: { type: 'metal', value: true } }
        ],
        maxGates: 1,
        optimalGates: 1,
        isotopeFeed: ['Po-210', 'Ra-226', 'U-235', 'Co-60', 'Fe-56', 'C-14', 'Pb-208', 'Pu-239']
    },
    {
        id: 15,
        title: "Protocol 15: Master Criticality Sieve",
        subtitle: "The ultimate 3-way high-speed nuclear refinery.",
        briefing: "Assemble the optimal multi-gate filter: Divert Fissile Fuels to REACTOR CORE, Lead to SHIELDING, and other materials to GENERAL STOCK.",
        bins: [
            { id: 'bin_a', label: 'REACTOR CORE (Fissile Fuels)', color: '#ef4444', matchRule: { type: 'fissile', value: true } },
            { id: 'bin_b', label: 'SHIELDING VAULT (Lead-208)', color: '#64748b', matchRule: { type: 'element', value: 'Lead' } },
            { id: 'bin_c', label: 'GENERAL STOCKPILE', color: '#10b981', matchRule: { op: 'AND', subA: { op: 'NOT', subA: { type: 'fissile', value: true } }, subB: { op: 'NOT', subA: { type: 'element', value: 'Lead' } } } }
        ],
        availableGates: [
            { id: 'g_fissile', label: 'FISSILE FUEL?', config: { type: 'fissile', value: true } },
            { id: 'g_lead', label: 'ELEMENT = LEAD', config: { type: 'element', value: 'Lead' } },
            { id: 'g_rad', label: 'RADIOACTIVE?', config: { type: 'radioactive', value: true } }
        ],
        maxGates: 2,
        optimalGates: 2,
        isotopeFeed: ['U-235', 'Pu-239', 'Pb-208', 'Fe-56', 'Th-232', 'C-12', 'U-238', 'Co-60', 'Pb-208']
    }
];

export function getLevel(id) {
    return LEVELS.find(l => l.id === Number(id)) || LEVELS[0];
}
