import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import type { GameState } from "../types/game";

import { INITIAL_FARM } from "./constants";
import {
  applyLandLayout,
  LAYOUT_EXPANSIONS,
  type LandLayout,
} from "./landLayouts";
import { REAL_FARM_LAYOUTS, isRealFarmLayout } from "./fixtures/realFarms";

/**
 * Offline-testing QoL (ART_MODE only): several recurring popups are gated by
 * localStorage, not game state (referrals announcement, VIP promo, isles
 * intro) — pre-acknowledge them so every reload doesn't re-open them.
 */
try {
  if (!CONFIG.API_URL && typeof localStorage !== "undefined") {
    const acknowledgedAt = new Date().toISOString();
    [
      "referralsAnnouncementLastRead",
      "vipIsRead",
      "islesIntroduction",
      // The daily-reward streak modal re-acknowledges per calendar day, so
      // always stamp it fresh.
      "dailyRewardAcknowledged",
    ].forEach((key) => {
      if (key === "dailyRewardAcknowledged" || !localStorage.getItem(key)) {
        localStorage.setItem(key, acknowledgedAt);
      }
    });
  }
} catch {
  // storage unavailable — popups will just show
}

/**
 * Dev-harness overrides for the Phaser-farm parity matrix
 * (docs/phaser-farm-migration): localStorage keys set by the DevPanel (or a
 * Playwright runner) swap island type/biome, season, and expansion count on
 * the offline farm without touching the fixture itself.
 */
function applyPhaserDevOverrides(farm: GameState): GameState {
  try {
    if (typeof localStorage === "undefined") return farm;
    const island = localStorage.getItem("phaserFarm.dev.island");
    const biome = localStorage.getItem("phaserFarm.dev.biome");
    const season = localStorage.getItem("phaserFarm.dev.season");
    const expansions = localStorage.getItem("phaserFarm.dev.expansions");
    const stress = localStorage.getItem("phaserFarm.dev.stress");
    const weather = localStorage.getItem("phaserFarm.dev.weather");
    const gifs = localStorage.getItem("phaserFarm.dev.gifs");
    // Default to the iSPANK capture — the richest everyday testing target.
    // "fixture" is the explicit opt-out back to the hand-authored fixture.
    const stored = localStorage.getItem("phaserFarm.dev.layout");
    const layout = stored === "fixture" ? null : (stored ?? "ispank");
    if (
      !island &&
      !biome &&
      !season &&
      !expansions &&
      !stress &&
      !weather &&
      !gifs &&
      !layout
    )
      return farm;

    // A layout preset repositions the fixture into non-overlapping bands and
    // carries its own land size (see landLayouts.ts). The real-farm presets
    // are different: they swap in whole captured accounts [fixtures/].
    if (isRealFarmLayout(layout)) farm = REAL_FARM_LAYOUTS[layout]();
    else if (layout) farm = applyLandLayout(farm, layout as LandLayout);

    // Stress egg: carpet the land with ready Sunflowers to tap like crazy
    // (pair with expansions=42; StressBumpkins adds the crowd). Capped at 99
    // plots — the most a level-4 well can water [getSupportedPlots]; beyond
    // that plots render dry and clicks open the nonFertilePlot modal.
    let crops = farm.crops;
    let waterWell = farm.waterWell;
    let buildings = farm.buildings;
    if (stress || layout === "stress") {
      crops = {};
      let index = 0;
      for (let x = -5; x <= 5; x++) {
        for (let y = -8; y <= 0; y++) {
          crops[`stress-${index++}`] = {
            createdAt: 0,
            x,
            y,
            crop: { name: "Sunflower", plantedAt: 0 },
          };
        }
      }
      waterWell = { ...farm.waterWell, level: 4 };
      if (!farm.buildings["Water Well"]?.some((w) => !!w.coordinates)) {
        buildings = {
          ...farm.buildings,
          "Water Well": [
            {
              id: "stress-well",
              createdAt: 0,
              readyAt: 0,
              coordinates: { x: 7, y: -8 },
            },
          ],
        };
      }
    }

    // Animated-art harness: place every GIF-backed collectible in a grid so
    // the converted spritesheets can be eyeballed in one screen
    // [scripts/gif-to-spritesheet.js].
    let collectibles = farm.collectibles;
    if (gifs) {
      // Real ITEM_DETAILS names whose art is a GIF (resolved from images.ts).
      const ANIMATED = [
        "Potato Statue",
        "Goblin Crown",
        "Woody the Beaver",
        "Apprentice Beaver",
        "Foreman Beaver",
        "Tunnel Mole",
        "Rocky the Mole",
        "Pablo The Bunny",
        "Victoria Sisters",
        "Cabbage Boy",
        "Cabbage Girl",
        "Wood Nymph Wendy",
        "Peeled Potato",
        "Christmas Snow Globe",
        "Lady Bug",
        "Black Bearry",
        "Maneki Neko",
        "Heart of Davy Jones",
        "Lab Grown Carrot",
        "Lab Grown Pumpkin",
        "Lab Grown Radish",
        "Sapo Docuras",
        "Sapo Travessuras",
        "Reveling Lemon",
        "Tomato Clown",
        "Tomato Bombard",
        "Spring Blossom Banner",
      ];
      collectibles = { ...farm.collectibles };
      ANIMATED.forEach((name, index) => {
        collectibles[name as keyof typeof collectibles] = [
          {
            id: `gif-${index}`,
            createdAt: Date.now(),
            readyAt: 0,
            coordinates: {
              x: -8 + (index % 8) * 2,
              y: 10 - Math.floor(index / 8) * 2,
            },
          },
        ];
      });
    }

    return {
      ...farm,
      crops,
      waterWell,
      buildings,
      collectibles,
      // Weather harness: tsunami destroys the oldest half of the plots
      // (weather-plot art + affected modal).
      ...(weather
        ? {
            calendar: {
              ...farm.calendar,
              tsunami: { startedAt: Date.now(), triggeredAt: Date.now() },
            },
          }
        : {}),
      island: {
        ...farm.island,
        ...(island ? { type: island as GameState["island"]["type"] } : {}),
        ...(biome ? { biome: biome as GameState["island"]["biome"] } : {}),
      },
      ...(season
        ? {
            season: {
              ...farm.season,
              season: season as GameState["season"]["season"],
            },
          }
        : {}),
      ...(expansions || stress || (layout && !isRealFarmLayout(layout))
        ? {
            inventory: {
              ...farm.inventory,
              "Basic Land": new Decimal(
                Number(
                  expansions ??
                    (layout && LAYOUT_EXPANSIONS[layout as LandLayout]) ??
                    42,
                ),
              ),
              ...(stress || layout === "stress"
                ? { "Sunflower Seed": new Decimal(10000) }
                : {}),
            },
          }
        : {}),
    };
  } catch {
    return farm;
  }
}

const BASE_OFFLINE_FARM: GameState = {
  ...INITIAL_FARM,
  // Red Pansy already-discovered so clicking the ready flower bed harvests
  // directly (first discovery opens the congratulations modal instead) —
  // exercised by the dispatch-parity suite.
  farmActivity: {
    ...INITIAL_FARM.farmActivity,
    "Red Pansy Harvested": 1,
  },
  bumpkin: {
    ...INITIAL_FARM.bumpkin,
    // Level 60 [level.ts LEVEL_EXPERIENCE] — high enough that every building
    // is unlocked, so nothing silently opens the "level locked" modal.
    experience: 2_000_000,
    coordinates: { x: 0, y: 3 },
  },
  // No Rules/T&C modal on every offline reload.
  tcsAcknowledged: Date.now(),
  // Greenhouse: oil in the machine, one growing pot, one fertilised pot.
  greenhouse: {
    // "greenhouse-fixture"
    oil: 12,
    pots: {
      1: {
        plant: {
          name: "Grape",
          plantedAt: Date.now() - 60 * 60 * 1000,
          amount: 1,
          baseDurationMs: 12 * 60 * 60 * 1000,
        },
      },
      2: {
        fertiliser: { name: "Greenhouse Glow", fertilisedAt: Date.now() },
      },
      3: {},
      4: {},
    },
  },
  // Interiors beta on, with furniture on both floors [/interior, /level_one].
  settings: { ...INITIAL_FARM.settings, interiorsEnabled: true },
  interior: {
    ...INITIAL_FARM.interior,
    ground: {
      collectibles: {
        "Basic Bear": [
          {
            id: "int-bear",
            readyAt: 0,
            createdAt: 0,
            coordinates: { x: -4, y: 2 },
          },
        ],
        Rug: [
          {
            id: "int-rug",
            readyAt: 0,
            createdAt: 0,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    },
    expansion: "level-one-2",
    level_one: {
      collectibles: {
        "Basic Bear": [
          {
            id: "l1-bear",
            readyAt: 0,
            createdAt: 0,
            coordinates: { x: 2, y: 3 },
          },
        ],
      },
    },
  },
  // One sick cow -> the Barn shows the stress alert next to hungry "!"
  // (default animals all have awakeAt 0 = hungry). The rest exercise the
  // barn interaction states: ready (claim), sleeping, needsLove (love
  // window open = a third into the sleep).
  barn: {
    ...INITIAL_FARM.barn,
    animals: {
      ...INITIAL_FARM.barn.animals,
      "0": { ...INITIAL_FARM.barn.animals["0"], state: "sick" },
      "1": {
        ...INITIAL_FARM.barn.animals["1"],
        state: "ready",
        // Past the Cow level-1 threshold (180) so displayLevel stays >= 0.
        experience: 200,
      },
      "3": {
        ...INITIAL_FARM.barn.animals["1"],
        id: "3",
        type: "Sheep",
        state: "idle",
        // A third of the sleep has passed -> the love window is open.
        asleepAt: Date.now() - 4 * 60 * 60 * 1000,
        awakeAt: Date.now() + 8 * 60 * 60 * 1000,
        lovedAt: 0,
        item: "Petting Hand",
        experience: 40,
      },
      "4": {
        ...INITIAL_FARM.barn.animals["1"],
        id: "4",
        type: "Sheep",
        state: "idle",
        asleepAt: Date.now() - 10 * 60 * 1000,
        awakeAt: Date.now() + 8 * 60 * 60 * 1000,
        lovedAt: Date.now() - 10 * 60 * 1000,
        experience: 240,
      },
    },
  },
  farmHands: {
    bumpkins: {
      "1": {
        equipped: INITIAL_FARM.bumpkin.equipped,
        coordinates: { x: 2, y: 3 },
        flipped: true,
      },
      // Unplaced -> stands in the HomeBumpkins row at the Town Center.
      "2": {
        equipped: INITIAL_FARM.bumpkin.equipped,
      },
    },
  },
  airdrops: [
    {
      id: "test-airdrop",
      createdAt: Date.now(),
      items: { "Block Buck": 1 },
      wearables: {},
      sfl: 0,
      coins: 100,
      coordinates: { x: 7, y: 3 },
    },
  ],
  petHouse: {
    ...INITIAL_FARM.petHouse,
    // A pet placed inside the pet house so the interior has content.
    pets: {
      Barkley: [
        {
          id: "pethouse-barkley",
          createdAt: 0,
          readyAt: 0,
          coordinates: { x: 0, y: 0 },
        },
      ],
    },
  },
  pets: {
    common: {
      Barkley: {
        name: "Barkley",
        requests: { food: [], fedAt: Date.now() },
        energy: 100,
        experience: 50,
        pettedAt: Date.now(),
      },
    },
  },
  inventory: {
    ...INITIAL_FARM.inventory,
    // A spread of foods across every Feed tab category, with a mix of
    // quantities: >10 (bulk modal + "Eat 10"), 2-10, and exactly 1.
    // Animal feeding (barn/hen house interaction)
    "Kernel Blend": new Decimal(50),
    Hay: new Decimal(20),
    NutriBarley: new Decimal(10),
    "Mixed Grain": new Decimal(10),
    "Barn Delight": new Decimal(5),
    "Grape Seed": new Decimal(10),
    "Rice Seed": new Decimal(5),
    "Greenhouse Glow": new Decimal(5),
    "Greenhouse Goodie": new Decimal(5),
    "Petting Hand": new Decimal(5),
    Brush: new Decimal(3),
    // Fire Pit
    "Mashed Potato": new Decimal(50),
    "Pumpkin Soup": new Decimal(25),
    "Bumpkin Broth": new Decimal(12),
    "Boiled Eggs": new Decimal(8),
    "Reindeer Carrot": new Decimal(3),
    Popcorn: new Decimal(1),
    // Kitchen
    "Fruit Salad": new Decimal(60),
    "Sunflower Crunch": new Decimal(30),
    "Roast Veggies": new Decimal(15),
    Pancakes: new Decimal(11),
    "Club Sandwich": new Decimal(5),
    // Bakery
    "Sunflower Cake": new Decimal(20),
    "Carrot Cake": new Decimal(12),
    "Apple Pie": new Decimal(7),
    "Honey Cake": new Decimal(2),
    // Deli
    "Fancy Fries": new Decimal(40),
    Cheese: new Decimal(25),
    Sauerkraut: new Decimal(11),
    "Blueberry Jam": new Decimal(4),
    // Smoothie Shack (juices — exercises the "Drink" verb)
    "Orange Juice": new Decimal(35),
    "Purple Smoothie": new Decimal(15),
    "Apple Juice": new Decimal(11),
    "Bumpkin Detox": new Decimal(6),
    // Special
    "Pirate Cake": new Decimal(15),
    Caponata: new Decimal(3),
    "Trade Cake": new Decimal(1),
    // Fish
    Anchovy: new Decimal(50),
    Clownfish: new Decimal(30),
    Tuna: new Decimal(12),
    "Red Snapper": new Decimal(8),
    // Aged fish
    "Aged Anchovy": new Decimal(20),
    "Prime Aged Anchovy": new Decimal(11),
    "Aged Tuna": new Decimal(5),
    "Crop Plot": new Decimal(4),
    "Sunflower Seed": new Decimal(200),
    "Kale Seed": new Decimal(50),
    // One spare in the chest -> the placed expired hourglass offers renew
    "Gourmet Hourglass": new Decimal(2),
    "Harvest Hourglass": new Decimal(1),
    "Time Warp Totem": new Decimal(1),
    // Patch-fruit seeds across the seasons (quick-select shows the seasonal set)
    "Apple Seed": new Decimal(10),
    "Orange Seed": new Decimal(10),
    "Blueberry Seed": new Decimal(10),
    "Banana Plant": new Decimal(10),
    "Tomato Seed": new Decimal(10),
    "Lemon Seed": new Decimal(10),
    Pickaxe: new Decimal(20),
    "Stone Pickaxe": new Decimal(20),
    "Iron Pickaxe": new Decimal(20),
    "Gold Pickaxe": new Decimal(20),
    "Oil Drill": new Decimal(5),
    "Iron Rock": new Decimal(1),
    "Gold Rock": new Decimal(1),
    "Crimstone Rock": new Decimal(1),
    "Sunstone Rock": new Decimal(1),
    "Oil Reserve": new Decimal(1),
  },
  // One of each mineable node for the farm renderers.
  iron: {
    "1": {
      createdAt: Date.now(),
      stone: { minedAt: 0 },
      x: 2,
      y: 2,
    },
  },
  gold: {
    "1": {
      createdAt: Date.now(),
      stone: { minedAt: 0 },
      x: 3,
      y: 2,
    },
  },
  crimstones: {
    "1": {
      createdAt: Date.now(),
      stone: { minedAt: 0 },
      minesLeft: 5,
      x: 3,
      y: -2,
    },
  },
  sunstones: {
    "1": {
      createdAt: Date.now(),
      stone: { minedAt: 0 },
      minesLeft: 10,
      x: -5,
      y: -2,
    },
  },
  oilReserves: {
    "1": {
      createdAt: Date.now(),
      oil: { drilledAt: 0 },
      drilled: 0,
      x: 5,
      y: 1,
    },
  },
  fruitPatches: {
    "1": {
      createdAt: Date.now(),
      x: -5,
      y: 2,
      fruit: {
        name: "Apple",
        plantedAt: 0,
        harvestsLeft: 3,
        harvestedAt: 0,
        amount: 1,
      },
    },
    "2": {
      createdAt: Date.now(),
      x: -5,
      y: 4,
      fruit: {
        name: "Blueberry",
        plantedAt: Date.now(),
        harvestsLeft: 3,
        harvestedAt: 0,
        amount: 1,
      },
    },
    // Empty patch — exercises planting + the quick-select disc row.
    "3": {
      createdAt: Date.now(),
      x: -5,
      y: 6,
    },
  },
  flowers: {
    discovered: {},
    flowerBeds: {
      "1": {
        createdAt: Date.now(),
        x: -4,
        y: -2,
        flower: {
          name: "Red Pansy",
          plantedAt: 0,
        },
      },
      "2": {
        createdAt: Date.now(),
        x: -4,
        y: -3,
      },
    },
  },
  beehives: {
    "1": {
      x: 1,
      y: -2,
      swarm: false,
      honey: {
        updatedAt: Date.now(),
        produced: 12 * 60 * 60 * 1000,
      },
      flowers: [],
    },
    // Full hive (24h = DEFAULT_HONEY_PRODUCTION_TIME) — click harvests
    // directly, exercised by the dispatch-parity suite.
    "2": {
      x: 2,
      y: -2,
      swarm: false,
      honey: {
        updatedAt: Date.now(),
        produced: 24 * 60 * 60 * 1000,
      },
      flowers: [],
    },
  },
  mushrooms: {
    spawnedAt: 0,
    mushrooms: {
      "1": { name: "Wild Mushroom", amount: 1, x: -1, y: 4 },
    },
  },
  crabTraps: {
    trapSpots: {
      "1": { x: 0, y: 0 },
    },
  },
  // Buildings: the INITIAL_FARM trio plus a cooking Fire Pit (active +
  // ready recipes), an under-construction Kitchen, and a running composter.
  buildings: {
    ...INITIAL_FARM.buildings,
    // Interior surfaces need their building placed to unlock the route.
    "Pet House": [
      {
        id: "pethouse-1",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: -8, y: 5 },
      },
    ],
    Greenhouse: [
      {
        id: "greenhouse-1",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: 8, y: 5 },
      },
    ],
    "Fish Market": [
      {
        id: "fishmarket-1",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: -8, y: 2 },
      },
    ],
    // Growing pack (sprouting stage) + a ready pack -> stage sheet, ready
    // overlay and crop icon row.
    "Crop Machine": [
      {
        id: "cropmachine-1",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: -8, y: 8 },
        queue: [
          {
            crop: "Sunflower",
            seeds: 10,
            growTimeRemaining: 0,
            totalGrowTime: 60 * 60 * 1000,
            startTime: Date.now() - 25 * 60 * 1000,
            readyAt: Date.now() + 35 * 60 * 1000,
          },
          {
            crop: "Potato",
            seeds: 5,
            growTimeRemaining: 0,
            totalGrowTime: 60 * 60 * 1000,
            startTime: Date.now() - 2 * 60 * 60 * 1000,
            readyAt: Date.now() - 60 * 60 * 1000,
          },
        ],
        unallocatedOilTime: 0,
      },
    ],
    // Animal buildings placed -> alert rows render (hungry/sick/love)
    "Hen House": [
      {
        id: "henhouse-1",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: -2, y: -3 },
      },
    ],
    Barn: [
      {
        id: "barn-1",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: 2, y: -3 },
      },
    ],
    "Fire Pit": [
      {
        id: "firepit-1",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: -3, y: 7 },
        crafting: [
          { name: "Pumpkin Soup", readyAt: 0 },
          { name: "Mashed Potato", readyAt: Date.now() + 60 * 60 * 1000 },
        ],
      },
    ],
    Kitchen: [
      {
        id: "kitchen-1",
        readyAt: Date.now() + 2 * 60 * 60 * 1000,
        createdAt: Date.now(),
        coordinates: { x: 1, y: 8 },
      },
    ],
    "Compost Bin": [
      {
        id: "compost-1",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: -5, y: 7 },
        producing: {
          items: { "Sprout Mix": 10 },
          startedAt: Date.now() - 3 * 60 * 60 * 1000,
          readyAt: Date.now() + 3 * 60 * 60 * 1000,
        },
      },
    ],
  },
  // Collectibles: a static SFT, a fence run (autotile), stacked tiles
  // (connected art), a rug (low band), a flower, and one under construction.
  collectibles: {
    "Basic Bear": [
      { id: "bear-1", createdAt: 0, readyAt: 0, coordinates: { x: 6, y: 6 } },
    ],
    // Expiring boosts: active totem (countdown + fast-forward), expired
    // hourglass WITH a chest replacement (! -> renew modal), expired
    // hourglass WITHOUT one (dig icon -> burn).
    "Time Warp Totem": [
      {
        id: "twt-1",
        createdAt: Date.now(),
        readyAt: 0,
        coordinates: { x: 3, y: 7 },
      },
    ],
    "Gourmet Hourglass": [
      {
        id: "gourmet-1",
        createdAt: 0,
        readyAt: 0,
        coordinates: { x: 4, y: 7 },
      },
    ],
    "Harvest Hourglass": [
      {
        id: "harvest-1",
        createdAt: 0,
        readyAt: 0,
        coordinates: { x: 5, y: 7 },
      },
    ],
    Bush: [
      { id: "bush-1", createdAt: 0, readyAt: 0, coordinates: { x: -3, y: -1 } },
    ],
    // Weather shields: one spent (grey + "!" -> renew), one fresh.
    "Tornado Pinwheel": [
      {
        id: "pinwheel-1",
        createdAt: 0,
        readyAt: 0,
        coordinates: { x: -5, y: -1 },
        used: true,
      },
    ],
    Mangrove: [
      {
        id: "mangrove-1",
        createdAt: 0,
        readyAt: 0,
        coordinates: { x: -4, y: -1 },
      },
    ],
    "Genie Lamp": [
      {
        id: "genie-1",
        createdAt: 0,
        readyAt: 0,
        coordinates: { x: -2, y: -1 },
        rubbedCount: 1,
      },
    ],
    "Maneki Neko": [
      {
        id: "maneki-1",
        createdAt: 0,
        readyAt: 0,
        coordinates: { x: 0, y: -1 },
      },
    ],
    "Obsidian Shrine": [
      {
        id: "obsidian-1",
        createdAt: Date.now(),
        readyAt: 0,
        coordinates: { x: 5, y: -1 },
      },
    ],
    "Fox Shrine": [
      {
        id: "fox-1",
        createdAt: 0,
        readyAt: 0,
        coordinates: { x: 3, y: -1 },
      },
    ],
    "Salt Sculpture": [
      {
        id: "saltsculpt-1",
        createdAt: 0,
        readyAt: 0,
        coordinates: { x: 8, y: 0 },
      },
    ],
    Fence: [
      { id: "fence-1", createdAt: 0, readyAt: 0, coordinates: { x: 3, y: 5 } },
      { id: "fence-2", createdAt: 0, readyAt: 0, coordinates: { x: 4, y: 5 } },
      { id: "fence-3", createdAt: 0, readyAt: 0, coordinates: { x: 5, y: 5 } },
    ],
    "Blue Tile": [
      { id: "tile-1", createdAt: 0, readyAt: 0, coordinates: { x: 6, y: 5 } },
      { id: "tile-2", createdAt: 0, readyAt: 0, coordinates: { x: 6, y: 4 } },
    ],
    Rug: [
      { id: "rug-1", createdAt: 0, readyAt: 0, coordinates: { x: 6, y: 2 } },
    ],
    "Red Carnation": [
      {
        id: "flower-1",
        createdAt: 0,
        readyAt: 0,
        coordinates: { x: 7, y: 6 },
      },
    ],
    Scarecrow: [
      {
        id: "scarecrow-1",
        createdAt: Date.now(),
        readyAt: Date.now() + 30 * 60 * 1000,
        coordinates: { x: 2, y: 4 },
      },
    ],
    Barkley: [
      {
        id: "barkley-1",
        createdAt: 0,
        readyAt: 0,
        coordinates: { x: 7, y: 5 },
      },
    ],
  },
  // A spread of plot states for the farm renderers: empty soil, a crop that's
  // ready the moment the farm loads, and one mid-growth.
  crops: {
    "1": { createdAt: Date.now(), x: -2, y: 0 },
    "2": { createdAt: Date.now(), x: -1, y: 0 },
    "3": {
      createdAt: Date.now(),
      x: 0,
      y: 0,
      crop: { name: "Sunflower", plantedAt: 0 },
    },
    "4": {
      createdAt: Date.now(),
      x: 1,
      y: 0,
      crop: { name: "Kale", plantedAt: Date.now() },
    },
  },
};

export const STATIC_OFFLINE_FARM: GameState =
  applyPhaserDevOverrides(BASE_OFFLINE_FARM);
