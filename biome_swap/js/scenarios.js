/**
 * Biome Swap: The Keystone Balance - Restoration Scenarios
 */

const RESTORATION_SCENARIOS = [
    {
        id: 1,
        title: "Scenario 01: Yellowstone Riparian Crisis",
        biome: "forest",
        targetBiodiversity: 65,
        maxDays: 12,
        initialEnergy: 90,
        description: "Decades of wolf absence have caused elk herds to overgraze riverside willow saplings, causing erosion. Reintroduce wolves to trigger the trophic cascade!",
        initialInvasives: [],
        tiles: [
            { r: 0, c: 0, producers: 15, herbivores: 60, predators: 0, apex: 0, soilHealth: 30, moisture: 25 },
            { r: 0, c: 1, producers: 10, herbivores: 70, predators: 0, apex: 0, soilHealth: 25, moisture: 20 },
            { r: 1, c: 0, producers: 20, herbivores: 55, predators: 0, apex: 0, soilHealth: 35, moisture: 30 },
            { r: 1, c: 1, producers: 12, herbivores: 65, predators: 0, apex: 0, soilHealth: 20, moisture: 20 },
            { r: 2, c: 2, producers: 25, herbivores: 40, predators: 5, apex: 0, soilHealth: 45, moisture: 35 },
            { r: 3, c: 3, producers: 30, herbivores: 30, predators: 5, apex: 0, soilHealth: 50, moisture: 40 }
        ],
        hint: "Play 'Wolf Pack Reintroduction' on a tile with high herbivores, followed by 'Beaver Engineer' to create wetlands!"
    },
    {
        id: 2,
        title: "Scenario 02: Pacific Kelp & Urchin Barrens",
        biome: "reef",
        targetBiodiversity: 70,
        maxDays: 12,
        initialEnergy: 85,
        description: "Explosive purple sea urchin populations have chewed giant kelp holdfasts to bare rock. Deploy sea otters to shatter the urchin barrens.",
        initialInvasives: [],
        tiles: [
            { r: 0, c: 0, producers: 5, herbivores: 80, predators: 0, apex: 0, soilHealth: 30 },
            { r: 0, c: 1, producers: 8, herbivores: 75, predators: 0, apex: 0, soilHealth: 25 },
            { r: 1, c: 1, producers: 10, herbivores: 85, predators: 0, apex: 0, soilHealth: 20 },
            { r: 2, c: 2, producers: 15, herbivores: 60, predators: 5, apex: 0, soilHealth: 40 }
        ],
        hint: "Use 'Sea Otter Raft' to decimate urchin barrens and 'Coral Nursery' to seed marine growth."
    },
    {
        id: 3,
        title: "Scenario 03: Cane Toad Invasive Front",
        biome: "savanna",
        targetBiodiversity: 60,
        maxDays: 10,
        initialEnergy: 100,
        description: "Toxic invasive cane toads are invading the billabongs and poisoning local predators. Deploy biocontrol agents and controlled burns to halt their spread.",
        initialInvasives: ['cane_toad'],
        tiles: [
            { r: 0, c: 0, producers: 30, herbivores: 20, predators: 5, apex: 0, invasive: 60, soilHealth: 30 },
            { r: 0, c: 1, producers: 25, herbivores: 15, predators: 0, apex: 0, invasive: 45, soilHealth: 35 },
            { r: 1, c: 0, producers: 35, herbivores: 25, predators: 5, apex: 0, invasive: 40, soilHealth: 40 }
        ],
        hint: "Target invasive hotspots with 'Biocontrol Parasitoid Agent' and 'Controlled Burn'."
    },
    {
        id: 4,
        title: "Scenario 04: Great Barrier Coral Bleach",
        biome: "reef",
        targetBiodiversity: 75,
        maxDays: 14,
        initialEnergy: 95,
        description: "A marine heatwave bleached 70% of the barrier reef. Graft thermal-tolerant micro-fragments and establish predator schools to control macro-algae.",
        initialInvasives: [],
        tiles: [
            { r: 0, c: 0, producers: 10, herbivores: 20, predators: 5, apex: 0, soilHealth: 20 },
            { r: 1, c: 1, producers: 5, herbivores: 15, predators: 0, apex: 0, soilHealth: 15 },
            { r: 2, c: 2, producers: 12, herbivores: 30, predators: 10, apex: 0, soilHealth: 25 }
        ],
        hint: "Plant 'Coral Nursery' polyps and introduce trout/reef predators to foster polyculture."
    },
    {
        id: 5,
        title: "Scenario 05: Scottish Highlands Rewilding",
        biome: "forest",
        targetBiodiversity: 70,
        maxDays: 12,
        initialEnergy: 90,
        description: "Centuries of deforestation turned the Caledonian Forest into a barren deer monoculture. Rebuild soil fungal networks and reintroduce apex predators.",
        initialInvasives: [],
        tiles: [
            { r: 0, c: 0, producers: 15, herbivores: 65, predators: 0, apex: 0, soilHealth: 25 },
            { r: 1, c: 0, producers: 18, herbivores: 55, predators: 0, apex: 0, soilHealth: 30 },
            { r: 2, c: 1, producers: 20, herbivores: 50, predators: 0, apex: 0, soilHealth: 35 }
        ],
        hint: "Combine 'Mycorrhizal Fungal Web' with 'Wolf Pack' to restore soil-to-canopy carbon flows."
    },
    {
        id: 6,
        title: "Scenario 06: Arctic Tundra Peat Stability",
        biome: "tundra",
        targetBiodiversity: 65,
        maxDays: 10,
        initialEnergy: 85,
        description: "Melting permafrost threatens to release methane pockets. Foster insulating lichen carpets and snowy raptors to balance grazing lemming cycles.",
        initialInvasives: [],
        tiles: [
            { r: 0, c: 0, producers: 10, herbivores: 40, predators: 0, apex: 0, soilHealth: 20 },
            { r: 1, c: 1, producers: 15, herbivores: 35, predators: 0, apex: 0, soilHealth: 25 }
        ],
        hint: "Spread 'Arctic Peat & Lichen' and perch 'Snowy Owl' to secure the permafrost."
    },
    {
        id: 7,
        title: "Scenario 07: Serengeti Waterway Migration",
        biome: "savanna",
        targetBiodiversity: 80,
        maxDays: 14,
        initialEnergy: 110,
        description: "Overpopulated ungulate herds are exhausting dry-season waterholes. Introduce pride patrols to steer migration paths and preserve riparian acacia groves.",
        initialInvasives: [],
        tiles: [
            { r: 0, c: 0, producers: 20, herbivores: 70, predators: 10, apex: 0, soilHealth: 35 },
            { r: 1, c: 1, producers: 15, herbivores: 80, predators: 5, apex: 0, soilHealth: 30 }
        ],
        hint: "Deploy 'Lion Pride Patrol' and 'Riparian Willow' along the central river corridor."
    },
    {
        id: 8,
        title: "Scenario 08: Kudzu Vine Canopy Choke",
        biome: "forest",
        targetBiodiversity: 70,
        maxDays: 10,
        initialEnergy: 100,
        description: "Fast-climbing invasive Kudzu is smothering native oak canopies, blocking solar flux. Conduct strategic burns and release targeted biocontrols.",
        initialInvasives: ['kudzu'],
        tiles: [
            { r: 0, c: 0, producers: 10, herbivores: 10, predators: 0, apex: 0, invasive: 75, soilHealth: 30 },
            { r: 1, c: 0, producers: 15, herbivores: 15, predators: 5, apex: 0, invasive: 60, soilHealth: 35 },
            { r: 0, c: 1, producers: 10, herbivores: 10, predators: 0, apex: 0, invasive: 70, soilHealth: 25 }
        ],
        hint: "Burn dense patches with 'Controlled Burn' then inoculate soil with 'Mycorrhizal Web'."
    },
    {
        id: 9,
        title: "Scenario 09: Everglades Mangrove Hydrology",
        biome: "forest",
        targetBiodiversity: 78,
        maxDays: 12,
        initialEnergy: 95,
        description: "Altered drainage canals dried the sawgrass marshes. Build organic beaver and wetland dams to re-flood the mangrove nursery flats.",
        initialInvasives: [],
        tiles: [
            { r: 0, c: 0, producers: 25, herbivores: 30, predators: 10, apex: 5, soilHealth: 40, moisture: 20 },
            { r: 1, c: 1, producers: 20, herbivores: 35, predators: 5, apex: 0, soilHealth: 30, moisture: 15 }
        ],
        hint: "Water is life: 'Beaver Engineer Colony' will spike moisture and trigger wetland bio-blooms."
    },
    {
        id: 10,
        title: "Scenario 10: Lionfish Coral Incursion",
        biome: "reef",
        targetBiodiversity: 80,
        maxDays: 12,
        initialEnergy: 100,
        description: "Venomous invasive lionfish are stripping reef flats of juvenile grazers. Deploy biocontrols and train native apex grouper/otters to hunt them.",
        initialInvasives: ['lionfish'],
        tiles: [
            { r: 0, c: 0, producers: 25, herbivores: 10, predators: 0, apex: 0, invasive: 70 },
            { r: 1, c: 1, producers: 30, herbivores: 15, predators: 5, apex: 0, invasive: 55 }
        ],
        hint: "Suppress lionfish with 'Biocontrol Parasitoid' and repopulate with 'Sea Otter Raft'."
    },
    {
        id: 11,
        title: "Scenario 11: Amazon Canopy Keystone Polyculture",
        biome: "forest",
        targetBiodiversity: 85,
        maxDays: 14,
        initialEnergy: 105,
        description: "A cleared jungle parcel needs full 4-tier trophic reconstruction: mycorrhizae, fruit trees, tapir herbivores, and apex predators.",
        initialInvasives: [],
        tiles: [
            { r: 0, c: 0, producers: 10, herbivores: 10, predators: 0, apex: 0, soilHealth: 15 },
            { r: 1, c: 1, producers: 15, herbivores: 10, predators: 0, apex: 0, soilHealth: 20 }
        ],
        hint: "Carefully climb Lindeman's trophic pyramid: Soil -> Producers -> Herbivores -> Apex!"
    },
    {
        id: 12,
        title: "Scenario 12: Biosphere Omega - The Global Keystone Equilibrium",
        biome: "forest",
        targetBiodiversity: 90,
        maxDays: 16,
        initialEnergy: 120,
        description: "Ultimate ecological challenge: Balance a fragile multi-tiered landscape subjected to random invasive outbreaks and sudden drought shifts!",
        initialInvasives: ['cane_toad', 'kudzu'],
        tiles: [
            { r: 0, c: 0, producers: 20, herbivores: 50, predators: 5, apex: 0, invasive: 30, soilHealth: 30 },
            { r: 1, c: 1, producers: 15, herbivores: 40, predators: 0, apex: 0, invasive: 40, soilHealth: 25 },
            { r: 2, c: 2, producers: 25, herbivores: 30, predators: 5, apex: 0, invasive: 20, soilHealth: 35 },
            { r: 3, c: 3, producers: 20, herbivores: 35, predators: 0, apex: 0, invasive: 35, soilHealth: 30 }
        ],
        hint: "Master all 4 cascades and maintain an unshakeable solar thermodynamic balance!"
    }
];
