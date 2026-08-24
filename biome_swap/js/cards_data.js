/**
 * Biome Swap: The Keystone Balance - Operator Cards Database
 */

const OPERATOR_CARDS = [
    {
        id: 'card_wolf',
        name: 'Wolf Pack Reintroduction',
        type: 'apex',
        cost: 40,
        icon: '🐺',
        description: 'Reintroduces apex canids. Heavily suppresses overgrazing deer/elk and initiates the legendary riparian cascade.',
        effects: { apex: 30, herbivores: -25, producers: 20, soilHealth: 10 },
        aoe: true
    },
    {
        id: 'card_otter',
        name: 'Sea Otter Raft',
        type: 'apex',
        cost: 35,
        icon: '🦦',
        description: 'Deploys keystone marine otters to crush sea urchin barrens and restore towering giant kelp forests.',
        effects: { apex: 35, herbivores: -30, producers: 35 },
        aoe: true
    },
    {
        id: 'card_lion',
        name: 'Lion Pride Patrol',
        type: 'apex',
        cost: 45,
        icon: '🦁',
        description: 'Restores apex balance on the savanna grasslands, preventing riverbank erosion.',
        effects: { apex: 30, herbivores: -20, producers: 25 },
        aoe: false
    },
    {
        id: 'card_willow',
        name: 'Riparian Willow Planting',
        type: 'producer',
        cost: 20,
        icon: '🌿',
        description: 'Founds dense willow thickets along water margins, boosting moisture and riverbank stability.',
        effects: { producers: 40, moisture: 25, soilHealth: 15 },
        aoe: false
    },
    {
        id: 'card_myco',
        name: 'Mycorrhizal Fungal Web',
        type: 'producer',
        cost: 15,
        icon: '🍄',
        description: 'Underground symbiotic fungal network exchanging minerals for plant carbon.',
        effects: { soilHealth: 35, producers: 15 },
        aoe: true
    },
    {
        id: 'card_beaver',
        name: 'Beaver Engineer Colony',
        type: 'herbivore',
        cost: 25,
        icon: '🦫',
        description: 'Builds organic dams that retain groundwater, creating lush wetland reservoirs for songbirds and trout.',
        effects: { herbivores: 20, moisture: 40, soilHealth: 20 },
        aoe: true
    },
    {
        id: 'card_biocontrol',
        name: 'Biocontrol Parasitoid Agent',
        type: 'cascade',
        cost: 30,
        icon: '🧬',
        description: 'Releases natural targeted biocontrol predators to decimate fast-spreading invasive pests without toxicity.',
        effects: { invasive: -60, soilHealth: 10 },
        aoe: true
    },
    {
        id: 'card_burn',
        name: 'Controlled Indigenous Burn',
        type: 'cascade',
        cost: 20,
        icon: '🔥',
        description: 'Clears accumulated dead scrub and invasive weeds while enriching topsoil ash for rapid pioneer germination.',
        effects: { invasive: -40, soilHealth: 30, producers: -15 },
        aoe: true
    },
    {
        id: 'card_coral',
        name: 'Heat-Resilient Coral Nursery',
        type: 'producer',
        cost: 25,
        icon: '🪸',
        description: 'Grafts micro-fragmented polyps to revive bleached barrier reefs and attract juvenile tropical fish.',
        effects: { producers: 45, predators: 15 },
        aoe: false
    },
    {
        id: 'card_lichen',
        name: 'Arctic Peat & Lichen Spread',
        type: 'producer',
        cost: 20,
        icon: '❄️',
        description: 'Expands insulating permafrost moss carpets that lock methane in sub-zero soils.',
        effects: { producers: 40, soilHealth: 25 },
        aoe: false
    },
    {
        id: 'card_owl',
        name: 'Snowy Owl Nesting',
        type: 'predator',
        cost: 25,
        icon: '🦉',
        description: 'Perches predatory raptors to regulate cyclical lemming / rodent swarms.',
        effects: { predators: 30, herbivores: -20 },
        aoe: false
    },
    {
        id: 'card_trout',
        name: 'River Trout Stocking',
        type: 'predator',
        cost: 20,
        icon: '🐟',
        description: 'Fills wetland gravel beds with coldwater native trout, balancing aquatic insect populations.',
        effects: { predators: 25, moisture: 10 },
        aoe: false
    }
];
