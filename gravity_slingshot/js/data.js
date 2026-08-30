/**
 * GRAVITY SLINGSHOT: Deep Space Astrogator Database
 * Celestial bodies, gravity parameters, Keplerian mechanics formulas, and 12 Flight Missions.
 */

window.SLINGSHOT_DATA = {
    // 12 Structured Grand Tour Astrogation Missions
    missions: [
        {
            id: 1,
            title: "Low Earth Orbit Circularization",
            badge: "MISSION #01 // LEO INSERTION",
            difficulty: "Cadet Navigator",
            description: "You have launched on a suborbital ballistic arc. Burn PROGRADE precisely at Apoapsis (highest point) to raise your Periapsis and achieve a stable circular orbit.",
            targetGoal: "Circularize orbit around Earth with Eccentricity e < 0.15 without atmospheric re-entry.",
            deltaVBudget: 450, // m/s
            startPosition: { x: 0, y: -180 }, // relative to Earth
            startVelocity: { vx: 220, vy: 0 },
            primaryBody: "Earth",
            celestialBodies: [
                { id: "earth", name: "Earth", mass: 500000, radius: 45, color: "#38bdf8", glow: "rgba(56, 189, 248, 0.5)", x: 0, y: 0, vx: 0, vy: 0 }
            ],
            targetCriteria: {
                minPeriapsis: 60,
                maxEccentricity: 0.18,
                durationStableSec: 6
            },
            astrodynamicsPearl: "Kepler's 1st Law: Orbits are ellipses. A burn at apoapsis raises the opposite side (periapsis), circularizing the orbit."
        },
        {
            id: 2,
            title: "Translunar Injection (TLI)",
            badge: "MISSION #02 // HOHMANN TRANSFER",
            difficulty: "Cadet Navigator",
            description: "Perform a Hohmann transfer burn from Low Earth Orbit to intercept the Moon's moving gravitational sphere of influence (Hill Sphere).",
            targetGoal: "Time and execute a prograde burn to intersect the Moon's orbital path and enter Lunar orbit.",
            deltaVBudget: 600,
            startPosition: { x: 0, y: -90 },
            startVelocity: { vx: 245, vy: 0 },
            primaryBody: "Earth",
            celestialBodies: [
                { id: "earth", name: "Earth", mass: 500000, radius: 45, color: "#38bdf8", glow: "rgba(56, 189, 248, 0.5)", x: 0, y: 0, vx: 0, vy: 0 },
                { id: "moon", name: "Moon", mass: 65000, radius: 18, color: "#cbd5e1", glow: "rgba(203, 213, 225, 0.4)", orbitRadius: 360, orbitSpeed: 0.008, angle: 0.8, x: 0, y: 0 }
            ],
            targetCriteria: {
                targetBody: "moon",
                maxDistanceToTarget: 50,
                durationStableSec: 4
            },
            astrodynamicsPearl: "A Hohmann Transfer Orbit is the most fuel-efficient two-impulse trajectory to transfer between two circular coplanar orbits."
        },
        {
            id: 3,
            title: "Apollo Free-Return Trajectory",
            badge: "MISSION #03 // GRAVITY SLINGSHOT",
            difficulty: "Junior Astrogator",
            description: "Execute a lunar flyby around the dark side of the Moon. Use the Moon's gravity to bend your return vector back toward Earth with ZERO return burn fuel!",
            targetGoal: "Slingshot behind the Moon and re-enter Earth's capture corridor safely.",
            deltaVBudget: 350,
            startPosition: { x: 0, y: -90 },
            startVelocity: { vx: 290, vy: 0 },
            primaryBody: "Earth",
            celestialBodies: [
                { id: "earth", name: "Earth", mass: 500000, radius: 45, color: "#38bdf8", glow: "rgba(56, 189, 248, 0.5)", x: 0, y: 0, vx: 0, vy: 0 },
                { id: "moon", name: "Moon", mass: 70000, radius: 18, color: "#cbd5e1", glow: "rgba(203, 213, 225, 0.4)", orbitRadius: 350, orbitSpeed: 0.007, angle: 0.6, x: 0, y: 0 }
            ],
            targetCriteria: {
                mustFlybyBody: "moon",
                returnToBody: "earth",
                maxReturnDistance: 120,
                durationStableSec: 3
            },
            astrodynamicsPearl: "The Apollo 13 crew used a circumlunar free-return trajectory: the Moon's gravity turned their spacecraft around like a cosmic slingshot."
        },
        {
            id: 4,
            title: "Mars Intercept & Heliocentric Transit",
            badge: "MISSION #04 // INTERPLANETARY",
            difficulty: "Junior Astrogator",
            description: "Escape Earth's gravity well, enter the Sun's heliocentric frame, and execute a transfer burn to intercept Mars at its orbital rendezvous point.",
            targetGoal: "Escape Earth and enter stable orbit around Mars.",
            deltaVBudget: 750,
            startPosition: { x: 0, y: -160 },
            startVelocity: { vx: 220, vy: 0 },
            primaryBody: "Sun",
            celestialBodies: [
                { id: "sun", name: "Sun", mass: 1200000, radius: 55, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.6)", x: 0, y: 0, vx: 0, vy: 0 },
                { id: "earth", name: "Earth", mass: 120000, radius: 24, color: "#38bdf8", glow: "rgba(56, 189, 248, 0.4)", orbitRadius: 160, orbitSpeed: 0.015, angle: 1.5, x: 0, y: 0 },
                { id: "mars", name: "Mars", mass: 75000, radius: 16, color: "#f87171", glow: "rgba(248, 113, 113, 0.4)", orbitRadius: 320, orbitSpeed: 0.009, angle: 3.4, x: 0, y: 0 }
            ],
            targetCriteria: {
                targetBody: "mars",
                maxDistanceToTarget: 40,
                durationStableSec: 4
            },
            astrodynamicsPearl: "Interplanetary transit windows open only when the planetary phase angle matches the Hohmann transfer time (every 26 months for Mars)."
        },
        {
            id: 5,
            title: "The Oberth Effect Boost",
            badge: "MISSION #05 // OBERTH MANEUVER",
            difficulty: "Senior Astrogator",
            description: "Harness Hermann Oberth's principle: rocket engines generate far more kinetic energy when burned at high speed deep within a gravitational well (Periapsis).",
            targetGoal: "Perform a high-thrust burn at solar periapsis to exceed cosmic escape velocity ($v > 450\\text{ km/s}$) using minimal fuel.",
            deltaVBudget: 400,
            startPosition: { x: 0, y: -380 },
            startVelocity: { vx: 95, vy: 0 }, // Highly eccentric orbit dropping to Sun
            primaryBody: "Sun",
            celestialBodies: [
                { id: "sun", name: "Sun", mass: 1500000, radius: 60, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.6)", x: 0, y: 0, vx: 0, vy: 0 }
            ],
            targetCriteria: {
                minSpeedAchieved: 480,
                mustBurnNearRadius: 110,
                durationStableSec: 2
            },
            astrodynamicsPearl: "Kinetic energy is $\\frac{1}{2}mv^2$. Because velocity is squared, $\\Delta E_k = m v \\Delta v + \\frac{1}{2}m(\\Delta v)^2$. Burning at highest $v$ produces maximum kinetic gain!"
        },
        {
            id: 6,
            title: "Jupiter Voyager Slingshot",
            badge: "MISSION #06 // PLANETARY FLYBY",
            difficulty: "Senior Astrogator",
            description: "Recreate the legendary Voyager Grand Tour. Dive into Jupiter's massive gravitational well and steal orbital kinetic momentum to boost past solar escape velocity!",
            targetGoal: "Perform a gravity assist around Jupiter to achieve hyperbolic escape velocity ($> 500\\text{ km/s}$) and target Saturn.",
            deltaVBudget: 500,
            startPosition: { x: -280, y: -280 },
            startVelocity: { vx: 180, vy: 80 },
            primaryBody: "Sun",
            celestialBodies: [
                { id: "sun", name: "Sun", mass: 1200000, radius: 50, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.6)", x: 0, y: 0, vx: 0, vy: 0 },
                { id: "jupiter", name: "Jupiter", mass: 450000, radius: 36, color: "#fb923c", glow: "rgba(251, 146, 60, 0.5)", orbitRadius: 300, orbitSpeed: 0.006, angle: 0.5, x: 0, y: 0 },
                { id: "saturn", name: "Saturn", mass: 220000, radius: 28, color: "#fef08a", glow: "rgba(254, 240, 138, 0.4)", orbitRadius: 480, orbitSpeed: 0.003, angle: 2.2, x: 0, y: 0 }
            ],
            targetCriteria: {
                mustFlybyBody: "jupiter",
                targetBody: "saturn",
                maxDistanceToTarget: 60,
                durationStableSec: 3
            },
            astrodynamicsPearl: "In a gravity assist, the probe gains velocity equal to twice the planet's orbital speed ($v_{\\text{final}} = v_0 + 2v_p$) relative to the Sun, while the planet slows down by an infinitesimal fraction."
        },
        {
            id: 7,
            title: "Lagrange L2 Halo Parking",
            badge: "MISSION #07 // THREE-BODY DYNAMICS",
            difficulty: "Flight Director",
            description: "Navigate to the Sun-Earth L2 Lagrange point (1.5 million km behind Earth) and perform stationkeeping in a halo orbit, just like the James Webb Space Telescope.",
            targetGoal: "Park probe within the L2 gravitational equilibrium zone with minimal velocity drift.",
            deltaVBudget: 400,
            startPosition: { x: 0, y: -170 },
            startVelocity: { vx: 225, vy: 0 },
            primaryBody: "Sun",
            celestialBodies: [
                { id: "sun", name: "Sun", mass: 1000000, radius: 50, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.6)", x: 0, y: 0, vx: 0, vy: 0 },
                { id: "earth", name: "Earth", mass: 140000, radius: 22, color: "#38bdf8", glow: "rgba(56, 189, 248, 0.4)", orbitRadius: 200, orbitSpeed: 0.012, angle: 0, x: 0, y: 0 }
            ],
            targetCriteria: {
                lagrangePoint: "L2", // At radius ~245 along Sun-Earth axis
                durationStableSec: 5
            },
            astrodynamicsPearl: "Lagrange points are positions in an orbital configuration where the gravitational forces of two large bodies balance the centrifugal force."
        },
        {
            id: 8,
            title: "Rosetta Comet Rendezvous",
            badge: "MISSION #08 // MICROGRAVITY DOCKING",
            difficulty: "Flight Director",
            description: "Match speed and orbit with a fast, highly eccentric comet (67P) on a non-coplanar trajectory. Requires delicate null-relative-velocity burns.",
            targetGoal: "Rendezvous with the Comet and match velocities within 10 m/s relative speed.",
            deltaVBudget: 700,
            startPosition: { x: -200, y: -150 },
            startVelocity: { vx: 160, vy: 110 },
            primaryBody: "Sun",
            celestialBodies: [
                { id: "sun", name: "Sun", mass: 1200000, radius: 50, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.6)", x: 0, y: 0, vx: 0, vy: 0 },
                { id: "comet", name: "Comet 67P", mass: 15000, radius: 10, color: "#94a3b8", glow: "rgba(148, 163, 184, 0.4)", orbitRadius: 280, orbitSpeed: 0.014, eccentricity: 0.55, angle: 1.8, x: 0, y: 0 }
            ],
            targetCriteria: {
                targetBody: "comet",
                maxRelativeVelocity: 15,
                maxDistanceToTarget: 25,
                durationStableSec: 4
            },
            astrodynamicsPearl: "Cometary rendezvous requires matching not just position, but both speed and orbital plane to orbit alongside in microgravity."
        },
        {
            id: 9,
            title: "Parker Solar Probe Shielding",
            badge: "MISSION #09 // MULTI-FLYBY RESCUE",
            difficulty: "Chief Astrogator",
            description: "Use repeated retrograde gravity assists around Venus to shed orbital angular momentum and dive to within 10 solar radii of the Sun's blistering corona.",
            targetGoal: "Shed angular momentum using Venus and achieve solar perihelion < 80 units without plunging into the Sun.",
            deltaVBudget: 550,
            startPosition: { x: 0, y: -220 },
            startVelocity: { vx: 190, vy: 0 },
            primaryBody: "Sun",
            celestialBodies: [
                { id: "sun", name: "Sun", mass: 1400000, radius: 45, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.8)", x: 0, y: 0, vx: 0, vy: 0 },
                { id: "venus", name: "Venus", mass: 110000, radius: 20, color: "#fcd34d", glow: "rgba(252, 211, 77, 0.4)", orbitRadius: 180, orbitSpeed: 0.016, angle: 0.4, x: 0, y: 0 }
            ],
            targetCriteria: {
                mustFlybyBody: "venus",
                minSolarPerihelion: 55,
                maxSolarPerihelion: 85,
                durationStableSec: 3
            },
            astrodynamicsPearl: "It takes more $\\Delta v$ to reach the Sun from Earth than to leave the Solar System entirely! Retrograde Venus flybys are essential to cancel Earth's 30 km/s orbital speed."
        },
        {
            id: 10,
            title: "Binary Pulsar Gravitational Slingshot",
            badge: "MISSION #10 // EXTREME RELATIVISTIC",
            difficulty: "Chief Astrogator",
            description: "Thread the needle between two rapidly spinning neutron stars. Use their extreme relativistic frame-dragging gravity wells to accelerate to 0.1c (10% speed of light).",
            targetGoal: "Pass through the binary pulsar orbital throat and escape with velocity > 650 km/s.",
            deltaVBudget: 600,
            startPosition: { x: -350, y: 0 },
            startVelocity: { vx: 210, vy: 50 },
            primaryBody: "Pulsar A",
            celestialBodies: [
                { id: "pulsar_a", name: "Pulsar Alpha", mass: 650000, radius: 14, color: "#67e8f9", glow: "rgba(6, 182, 212, 0.8)", x: 0, y: -60, vx: 60, vy: 0 },
                { id: "pulsar_b", name: "Pulsar Beta", mass: 650000, radius: 14, color: "#c084fc", glow: "rgba(192, 132, 252, 0.8)", x: 0, y: 60, vx: -60, vy: 0 }
            ],
            targetCriteria: {
                minSpeedAchieved: 680,
                durationStableSec: 2
            },
            astrodynamicsPearl: "Binary stars orbit a common center of mass (Barycenter). Weaving between them offers double gravitational boost mechanics."
        },
        {
            id: 11,
            title: "Interstellar Oumuamua Intercept",
            badge: "MISSION #11 // HYPERBOLIC RENDEZVOUS",
            difficulty: "Master of Spaceflight",
            description: "An interstellar visitor from another star system is speeding through on a hyperbolic unbound trajectory ($e = 1.2$). Catch and photograph it before it departs our solar system forever.",
            targetGoal: "Intercept Oumuamua within 30 km distance while on an escape trajectory.",
            deltaVBudget: 800,
            startPosition: { x: 0, y: -150 },
            startVelocity: { vx: 260, vy: 0 },
            primaryBody: "Sun",
            celestialBodies: [
                { id: "sun", name: "Sun", mass: 1200000, radius: 50, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.6)", x: 0, y: 0, vx: 0, vy: 0 },
                { id: "oumuamua", name: "1I/'Oumuamua", mass: 8000, radius: 8, color: "#f43f5e", glow: "rgba(244, 63, 94, 0.7)", x: -300, y: -220, vx: 240, vy: 140 }
            ],
            targetCriteria: {
                targetBody: "oumuamua",
                maxDistanceToTarget: 35,
                durationStableSec: 2
            },
            astrodynamicsPearl: "Hyperbolic trajectories have eccentricity $e > 1.0$, meaning the object has excess kinetic energy and will never return to the system."
        },
        {
            id: 12,
            title: "Supermassive Black Hole Ergosphere Turn",
            badge: "MISSION #12 // THE PENROSE MECHANISM",
            difficulty: "Master of Spaceflight",
            description: "Navigate the spinning event horizon of Gargantua. Graze the Ergosphere and jettison propellant backwards into the black hole to extract rotational energy via the Penrose Process.",
            targetGoal: "Perform an ergosphere slingshot turn around the Black Hole and escape with record-breaking relativistic velocity.",
            deltaVBudget: 900,
            startPosition: { x: -380, y: -200 },
            startVelocity: { vx: 260, vy: 40 },
            primaryBody: "Black Hole",
            celestialBodies: [
                { id: "black_hole", name: "Gargantua Singularity", mass: 2200000, radius: 28, color: "#000000", glow: "rgba(234, 179, 8, 0.9)", isBlackHole: true, x: 0, y: 0, vx: 0, vy: 0 }
            ],
            targetCriteria: {
                minSpeedAchieved: 850,
                avoidRadius: 35, // Event Horizon boundary
                durationStableSec: 3
            },
            astrodynamicsPearl: "The Penrose process allows extracting rotational energy from a Kerr spinning black hole by firing a mass into the ergosphere opposite to the spin."
        }
    ],

    // Keplerian Formulas & Physics Reference
    formulas: [
        { name: "Universal Gravitation", math: "F = G · (M · m) / r²", desc: "Every mass attracts every other mass with force inversely proportional to distance squared." },
        { name: "Orbital Speed (Circular)", math: "v = √(G · M / r)", desc: "Speed required to maintain a circular orbit at radius r." },
        { name: "Escape Velocity", math: "v_esc = √(2 · G · M / r) = √2 · v_circ", desc: "Speed required to completely escape a gravitational well on a parabolic/hyperbolic path." },
        { name: "Hohmann Transfer Δv", math: "Δv₁ = v_circ · (√(2r₂ / (r₁ + r₂)) - 1)", desc: "Velocity change required to enter an elliptical transfer orbit between two radii." },
        { name: "The Oberth Effect", math: "ΔE_k = m · v · Δv + ½ m(Δv)²", desc: "Rocket burns at high orbital speed convert chemical energy into kinetic energy with vastly higher efficiency." }
    ]
};
