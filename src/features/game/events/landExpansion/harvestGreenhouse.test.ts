import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { fertiliseGreenhouse } from "./fertiliseGreenhouse";
import { harvestGreenHouse } from "./harvestGreenHouse";
import { plantGreenhouse } from "./plantGreenhouse";
import { GREENHOUSE_CROP_TIME_SECONDS } from "features/game/lib/greenhouseGrowTimes";
import { getGreenhouseReadyAt } from "./greenhouseReadiness";
import { getExpiryCooldown } from "features/game/lib/collectibleBuilt";
import type { GameState } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";

// Pin the legacy (mainnet, SPEED_BOOSTS off) behaviour for this file's existing
// tests — jest runs on amoy where the flag is ON. The windowed model is covered
// in the dedicated SPEED_BOOSTS describes.
const originalNetwork = CONFIG.NETWORK;
beforeAll(() => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
});
afterAll(() => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
});

// Legacy base-time readiness (plantedAt + base grow duration) for these
// mainnet-pinned tests; the windowed model derives it via getGreenhouseReadyAt.
const getReadyAt = ({
  plant,
  createdAt,
}: {
  plant: keyof typeof GREENHOUSE_CROP_TIME_SECONDS;
  createdAt: number;
}) => createdAt + GREENHOUSE_CROP_TIME_SECONDS[plant] * 1000;

const farm: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
};

const greenhouseFarm = (): GameState => ({
  ...farm,
  inventory: {
    ...farm.inventory,
    "Rice Seed": new Decimal(5),
    "Greenhouse Goodie": new Decimal(10),
  },
  greenhouse: { oil: 50, pots: {} },
  buildings: {
    ...farm.buildings,
    Greenhouse: [
      {
        coordinates: { x: 0, y: 0 },
        id: "1",
        createdAt: 0,
        readyAt: 0,
      },
    ],
  },
});

describe("plantGreenhouse", () => {
  it("requires greenhouse exists", () => {
    expect(() =>
      harvestGreenHouse({
        action: {
          type: "greenhouse.harvested",
          id: 1,
        },
        state: farm,
        farmId: 1,
      }),
    ).toThrow("Greenhouse does not exist");
  });

  it("requires pot exists", () => {
    expect(() =>
      harvestGreenHouse({
        action: {
          type: "greenhouse.harvested",
          id: 10,
        },
        state: {
          ...farm,
          buildings: {
            Greenhouse: [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        farmId: 1,
      }),
    ).toThrow("Pot does not exist");
  });
  it("requires plant exists", () => {
    expect(() =>
      harvestGreenHouse({
        action: {
          type: "greenhouse.harvested",
          id: 1,
        },
        state: {
          ...farm,
          greenhouse: {
            oil: 50,
            pots: {
              1: {},
            },
          },
          buildings: {
            Greenhouse: [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        farmId: 1,
      }),
    ).toThrow("Plant does not exist");
  });
  it("requires plant is ready", () => {
    expect(() =>
      harvestGreenHouse({
        action: {
          type: "greenhouse.harvested",
          id: 1,
        },
        state: {
          ...farm,
          greenhouse: {
            oil: 50,
            pots: {
              1: {
                plant: {
                  name: "Rice",
                  plantedAt: Date.now() - 100,
                },
              },
            },
          },
          buildings: {
            Greenhouse: [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        farmId: 1,
      }),
    ).toThrow("Plant is not ready");
  });
  it("harvests plant", () => {
    const state = harvestGreenHouse({
      action: {
        type: "greenhouse.harvested",
        id: 1,
      },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      farmId: 1,
    });

    expect(state.inventory.Rice).toEqual(new Decimal(1));
  });

  it("clears plant", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: {
        type: "greenhouse.harvested",
        id: 1,
      },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(state.greenhouse.pots[1].plant).toBeUndefined();
  });

  it("clears fertiliser on harvest", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: {
        type: "greenhouse.harvested",
        id: 1,
      },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
              fertiliser: {
                name: "Greenhouse Goodie",
                fertilisedAt: 1,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(state.greenhouse.pots[1].plant).toBeUndefined();
    expect(state.greenhouse.pots[1].fertiliser).toBeUndefined();
  });

  it("adds Greenhouse Goodie +0.2 when plant has preset amount", () => {
    const plantedAt = Date.now() - 72 * 60 * 60 * 1000;
    const greenhouseBuilding = [
      {
        coordinates: { x: 0, y: 0 },
        id: "1",
        createdAt: 0,
        readyAt: 0,
      },
    ] as const;

    const withoutGoodie = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt,
                amount: 5,
              },
            },
          },
        },
        buildings: { ...farm.buildings, Greenhouse: [...greenhouseBuilding] },
      },
    });

    const withGoodie = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt,
                amount: 5,
              },
              fertiliser: { name: "Greenhouse Goodie", fertilisedAt: 1 },
            },
          },
        },
        buildings: { ...farm.buildings, Greenhouse: [...greenhouseBuilding] },
      },
    });

    expect(withoutGoodie.inventory.Rice).toEqual(new Decimal(5));
    expect(withGoodie.inventory.Rice).toEqual(new Decimal(5.2));
  });

  it("same Rice yield when Greenhouse Goodie applied before vs after planting", () => {
    const t0 = 20_000_000_000_000;

    let beforePlant = fertiliseGreenhouse({
      state: greenhouseFarm(),
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Goodie",
      },
      createdAt: t0,
    });
    beforePlant = plantGreenhouse({
      state: beforePlant,
      action: { type: "greenhouse.planted", id: 1, seed: "Rice Seed" },
      createdAt: t0 + 1,
    });
    const plantedAtBefore = beforePlant.greenhouse.pots[1].plant!.plantedAt;
    const harvestAtBefore = getReadyAt({
      plant: "Rice",
      createdAt: plantedAtBefore,
    });
    beforePlant = harvestGreenHouse({
      state: beforePlant,
      action: { type: "greenhouse.harvested", id: 1 },
      createdAt: harvestAtBefore,
      farmId: 1,
    });

    let afterPlant = plantGreenhouse({
      state: greenhouseFarm(),
      action: { type: "greenhouse.planted", id: 1, seed: "Rice Seed" },
      createdAt: t0 + 1,
    });
    afterPlant = fertiliseGreenhouse({
      state: afterPlant,
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Goodie",
      },
      createdAt: t0 + 2,
    });
    const plantedAtAfter = afterPlant.greenhouse.pots[1].plant!.plantedAt;
    const harvestAtAfter = getReadyAt({
      plant: "Rice",
      createdAt: plantedAtAfter,
    });
    afterPlant = harvestGreenHouse({
      state: afterPlant,
      action: { type: "greenhouse.harvested", id: 1 },
      createdAt: harvestAtAfter,
      farmId: 1,
    });

    expect(beforePlant.inventory.Rice).toEqual(afterPlant.inventory.Rice);
  });

  it("tracks analytics", () => {
    const state = harvestGreenHouse({
      action: {
        type: "greenhouse.harvested",
        id: 1,
      },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      farmId: 1,
    });

    expect(state.farmActivity["Rice Harvested"]).toEqual(1);
  });

  it("boosts +0.25 Olive yield with Olive Royalty Shirt equipped", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shirt: "Olive Royalty Shirt",
          },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Olive",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });
    expect(state.inventory.Olive).toEqual(new Decimal(1.25));
  });

  it("boosts +1 Olive yield with Olive Shield equipped", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Olive Shield",
          },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Olive",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });
    expect(state.inventory.Olive).toEqual(new Decimal(2));
  });

  it("boosts +1 Rice yield with Non La Hat equipped", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Non La Hat",
          },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });
    expect(state.inventory.Rice).toEqual(new Decimal(2));
  });

  it("boosts +0.25 Rice yield with Rice Panda placed", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        collectibles: {
          "Rice Panda": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });
    expect(state.inventory.Rice).toEqual(new Decimal(1.25));
  });

  it("boosts +2 greenhouse crop yield with Pharaoh Gnome placed", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        collectibles: {
          "Pharaoh Gnome": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });
    expect(state.inventory.Rice).toEqual(new Decimal(3));
  });

  it("boosts +0.1 greenhouse crop yield with Glass Room skill", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { ...INITIAL_BUMPKIN.skills, "Glass Room": 1 },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });
    expect(state.inventory.Rice).toEqual(new Decimal(1.1));
  });

  it("boosts +0.5 greenhouse crop yield with Seeded Bounty skill", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { ...INITIAL_BUMPKIN.skills, "Seeded Bounty": 1 },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });
    expect(state.inventory.Rice).toEqual(new Decimal(1.5));
  });

  it("boosts +1 greenhouse crop yield with Greasy Plants skill", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { ...INITIAL_BUMPKIN.skills, "Greasy Plants": 1 },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });
    expect(state.inventory.Rice).toEqual(new Decimal(2));
  });
});

describe("harvestGreenHouse ascension skill ranks", () => {
  const harvestRice = (
    skills: GameState["bumpkin"]["skills"],
    farmActivity: GameState["farmActivity"] = {},
  ) =>
    harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { ...INITIAL_BUMPKIN.skills, ...skills },
        },
        farmActivity,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
            },
          },
        },
        buildings: {
          Greenhouse: [
            { coordinates: { x: 0, y: 0 }, id: "1", createdAt: 0, readyAt: 0 },
          ],
        },
      },
    });

  // Glass Room additiveYield [0.1, 0.15, 0.2] — rank 1 == current (+0.1).
  it("scales Glass Room yield with rank (+0.1/+0.15/+0.2)", () => {
    expect(harvestRice({ "Glass Room": 1 }).inventory.Rice).toEqual(
      new Decimal(1.1),
    );
    expect(harvestRice({ "Glass Room": 2 }).inventory.Rice).toEqual(
      new Decimal(1.15),
    );
    expect(harvestRice({ "Glass Room": 3 }).inventory.Rice).toEqual(
      new Decimal(1.2),
    );
  });

  // Seeded Bounty yield leg [0.5, 0.75, 1] — rank 1 == current (+0.5).
  it("scales Seeded Bounty yield with rank (+0.5/+0.75/+1)", () => {
    expect(harvestRice({ "Seeded Bounty": 1 }).inventory.Rice).toEqual(
      new Decimal(1.5),
    );
    expect(harvestRice({ "Seeded Bounty": 2 }).inventory.Rice).toEqual(
      new Decimal(1.75),
    );
    expect(harvestRice({ "Seeded Bounty": 3 }).inventory.Rice).toEqual(
      new Decimal(2),
    );
  });

  // Greasy Plants yield leg [1, 1.5, 2] — rank 1 == current (+1).
  it("scales Greasy Plants yield with rank (+1/+1.5/+2)", () => {
    expect(harvestRice({ "Greasy Plants": 1 }).inventory.Rice).toEqual(
      new Decimal(2),
    );
    expect(harvestRice({ "Greasy Plants": 2 }).inventory.Rice).toEqual(
      new Decimal(2.5),
    );
    expect(harvestRice({ "Greasy Plants": 3 }).inventory.Rice).toEqual(
      new Decimal(3),
    );
  });

  // Greenhouse Gamble chance [25, 35, 45] — locate a counter in the r2-only
  // band (procs at 35 but not 25) to prove rank 2 procs where rank 1 does not.
  it("procs Greenhouse Gamble at rank 2 where rank 1 would not", () => {
    const itemId = KNOWN_IDS["Rice"];
    let boundary = -1;
    for (let counter = 0; counter < 500_000; counter++) {
      const r1 = prngChance({
        farmId: 1,
        itemId,
        counter,
        chance: 25,
        criticalHitName: "Greenhouse Gamble",
      });
      const r2 = prngChance({
        farmId: 1,
        itemId,
        counter,
        chance: 35,
        criticalHitName: "Greenhouse Gamble",
      });
      if (r2 && !r1) {
        boundary = counter;
        break;
      }
    }
    expect(boundary).toBeGreaterThanOrEqual(0);

    expect(
      harvestRice({ "Greenhouse Gamble": 1 }, { "Rice Harvested": boundary })
        .inventory.Rice,
    ).toEqual(new Decimal(1));
    expect(
      harvestRice({ "Greenhouse Gamble": 2 }, { "Rice Harvested": boundary })
        .inventory.Rice,
    ).toEqual(new Decimal(2));
  });

  it("procs Greenhouse Gamble at rank 3 where rank 2 would not", () => {
    const itemId = KNOWN_IDS["Rice"];
    let boundary = -1;
    for (let counter = 0; counter < 500_000; counter++) {
      const r2 = prngChance({
        farmId: 1,
        itemId,
        counter,
        chance: 35,
        criticalHitName: "Greenhouse Gamble",
      });
      const r3 = prngChance({
        farmId: 1,
        itemId,
        counter,
        chance: 45,
        criticalHitName: "Greenhouse Gamble",
      });
      if (r3 && !r2) {
        boundary = counter;
        break;
      }
    }
    expect(boundary).toBeGreaterThanOrEqual(0);

    expect(
      harvestRice({ "Greenhouse Gamble": 2 }, { "Rice Harvested": boundary })
        .inventory.Rice,
    ).toEqual(new Decimal(1));
    expect(
      harvestRice({ "Greenhouse Gamble": 3 }, { "Rice Harvested": boundary })
        .inventory.Rice,
    ).toEqual(new Decimal(2));
  });
});

describe("harvestGreenHouse under SPEED_BOOSTS (windowed)", () => {
  const farmId = 1;

  beforeAll(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
  });
  afterAll(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  const placed = (createdAt: number) => [
    {
      id: "1",
      createdAt,
      coordinates: { x: 0, y: 0 },
      readyAt: createdAt,
    },
  ];

  const plantRice = (state: GameState, createdAt: number): GameState =>
    plantGreenhouse({
      state,
      action: { type: "greenhouse.planted", id: 1, seed: "Rice Seed" },
      createdAt,
    });

  it("harvests earlier when a Tortoise Shrine covers the whole grow (1.5×)", () => {
    const now = Date.now();
    const state = plantRice(
      {
        ...greenhouseFarm(),
        collectibles: { "Tortoise Shrine": placed(now) },
      },
      now,
    );

    const readyAt = getGreenhouseReadyAt(
      state.greenhouse.pots[1].plant!,
      state,
    );
    expect(readyAt).toEqual(
      now + (GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000) / 1.5,
    );

    // `now >= readyAt` boundary: exactly at readyAt harvests…
    const harvested = harvestGreenHouse({
      state,
      action: { type: "greenhouse.harvested", id: 1 },
      createdAt: readyAt,
      farmId,
    });
    expect(harvested.greenhouse.pots[1].plant).toBeUndefined();

    // …one ms earlier does not.
    expect(() =>
      harvestGreenHouse({
        state,
        action: { type: "greenhouse.harvested", id: 1 },
        createdAt: readyAt - 1,
        farmId,
      }),
    ).toThrow("Plant is not ready");
  });

  it("still credits an expired Harvest Hourglass window", () => {
    const now = Date.now();
    const state = plantRice(
      {
        ...greenhouseFarm(),
        collectibles: { "Harvest Hourglass": placed(now) },
      },
      now,
    );

    const base = GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000;
    const cooldown = getExpiryCooldown("Harvest Hourglass", state);
    const readyAt = getGreenhouseReadyAt(
      state.greenhouse.pots[1].plant!,
      state,
    );

    // The hourglass expires long before the 32h grow finishes, but the work
    // earned during its window is kept: earlier than base time, later than a
    // hypothetical full-grow 1.35×.
    expect(readyAt).toEqual(now + cooldown + (base - cooldown * 1.35));
    expect(readyAt).toBeLessThan(now + base);
    expect(readyAt).toBeGreaterThan(now + base / 1.35);

    const harvested = harvestGreenHouse({
      state,
      action: { type: "greenhouse.harvested", id: 1 },
      createdAt: readyAt,
      farmId,
    });
    expect(harvested.greenhouse.pots[1].plant).toBeUndefined();
  });

  it("ignores Harvest Hourglass for Grape but applies Orchard Hourglass", () => {
    const now = Date.now();
    const base = GREENHOUSE_CROP_TIME_SECONDS.Grape * 1000;
    const plantGrape = (collectibles: GameState["collectibles"]): GameState =>
      plantGreenhouse({
        state: {
          ...greenhouseFarm(),
          inventory: { "Grape Seed": new Decimal(1) },
          collectibles,
        },
        action: { type: "greenhouse.planted", id: 1, seed: "Grape Seed" },
        createdAt: now,
      });

    // Harvest Hourglass never covered greenhouse fruit — no speed for Grape.
    const withHarvest = plantGrape({ "Harvest Hourglass": placed(now) });
    expect(
      getGreenhouseReadyAt(withHarvest.greenhouse.pots[1].plant!, withHarvest),
    ).toEqual(now + base);

    // Orchard Hourglass covers the fruit activity — windowed-model addition.
    const withOrchard = plantGrape({ "Orchard Hourglass": placed(now) });
    const orchardReadyAt = getGreenhouseReadyAt(
      withOrchard.greenhouse.pots[1].plant!,
      withOrchard,
    );
    expect(orchardReadyAt).toBeLessThan(now + base);
    expect(orchardReadyAt).toBeGreaterThan(now + base / 1.35);
  });

  it("stacks a totem with the Tortoise Shrine multiplicatively (3×)", () => {
    const now = Date.now();
    const state = plantRice(
      {
        ...greenhouseFarm(),
        collectibles: {
          "Super Totem": placed(now),
          "Tortoise Shrine": placed(now),
        },
      },
      now,
    );

    const readyAt = getGreenhouseReadyAt(
      state.greenhouse.pots[1].plant!,
      state,
    );
    expect(readyAt).toEqual(
      now + (GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000) / 3,
    );

    const harvested = harvestGreenHouse({
      state,
      action: { type: "greenhouse.harvested", id: 1 },
      createdAt: readyAt,
      farmId,
    });
    expect(harvested.greenhouse.pots[1].plant).toBeUndefined();
  });

  it("keeps base timing for an unboosted windowed plant", () => {
    const now = Date.now();
    const state = plantRice(greenhouseFarm(), now);

    const base = GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000;
    expect(
      getGreenhouseReadyAt(state.greenhouse.pots[1].plant!, state),
    ).toEqual(now + base);

    expect(() =>
      harvestGreenHouse({
        state,
        action: { type: "greenhouse.harvested", id: 1 },
        createdAt: now + base - 1,
        farmId,
      }),
    ).toThrow("Plant is not ready");

    const harvested = harvestGreenHouse({
      state,
      action: { type: "greenhouse.harvested", id: 1 },
      createdAt: now + base,
      farmId,
    });
    expect(harvested.greenhouse.pots[1].plant).toBeUndefined();
  });
});
