import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { harvestFlower } from "./harvestFlower";
import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import { FLOWERS, FLOWER_SEEDS } from "features/game/types/flowers";
import { getFlowerReadyAt } from "features/game/lib/flowerBedReadiness";
import { CONFIG } from "lib/config";

const GAME_STATE = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

const setNetwork = (network: "mainnet" | "amoy") => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = network;
};

describe("harvestFlower", () => {
  it("throws an error if the flower bed does not exist", () => {
    expect(() =>
      harvestFlower({
        state: GAME_STATE,
        action: { type: "flower.harvested", id: "1" },
      }),
    ).toThrow("Flower bed does not exist");
  });

  it("throws an error if the flower bed does not have a flower", () => {
    const flowerBedId = "123";
    expect(() =>
      harvestFlower({
        state: {
          ...GAME_STATE,
          flowers: {
            discovered: {},
            flowerBeds: {
              [flowerBedId]: {
                createdAt: 0,
                x: 0,
                y: 0,
              },
            },
          },
        },
        action: { type: "flower.harvested", id: flowerBedId },
      }),
    ).toThrow("Flower bed does not have a flower");
  });

  it("throws an error if the flower is not ready to harvest", () => {
    const flowerBedId = "123";
    expect(() =>
      harvestFlower({
        state: {
          ...GAME_STATE,
          flowers: {
            discovered: {},
            flowerBeds: {
              [flowerBedId]: {
                createdAt: 0,
                x: 0,
                y: 0,
                flower: {
                  name: "Red Pansy",
                  plantedAt: Date.now(),
                },
              },
            },
          },
        },
        action: { type: "flower.harvested", id: flowerBedId },
      }),
    ).toThrow("Flower is not ready to harvest");
  });

  it("updates the inventory", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.inventory["Red Pansy"]).toEqual(new Decimal(1));
  });

  it("removes the flower from the flower bed", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.flowers.flowerBeds[flowerBedId].flower).toBeUndefined();
  });

  it("increments the bumpkin flower harvested activity", () => {
    const amount = 1;
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.farmActivity["Red Pansy Harvested"]).toEqual(amount);
  });

  it("increments the farm flower harvested activity", () => {
    const amount = 1;
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.farmActivity["Red Pansy Harvested"]).toEqual(amount);
  });

  it("updates the discovered flowers", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Yellow Pansy",
                crossbreed: "Sunflower",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.flowers.discovered["Yellow Pansy"]).toEqual(["Sunflower"]);
  });

  it("gives +1 flower when Salt Crystal Flower is placed and the flower was marked as a critical hit", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        inventory: {
          "Salt Crystal Flower": new Decimal(1),
        },
        collectibles: {
          "Salt Crystal Flower": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
                criticalHit: { "Salt Crystal Flower": 1 },
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.inventory["Red Pansy"]).toEqual(new Decimal(2));
  });

  it("does not give +1 flower when Salt Crystal Flower is placed but there is no critical hit", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        inventory: {
          "Salt Crystal Flower": new Decimal(1),
        },
        collectibles: {
          "Salt Crystal Flower": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.inventory["Red Pansy"]).toEqual(new Decimal(1));
  });

  it("adds a reward to the inventory", () => {
    const flowerBedId = "123";
    const state = harvestFlower({
      state: {
        ...GAME_STATE,
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: 0,
                reward: {
                  items: [
                    {
                      name: "Desert Rose",
                      amount: 1,
                    },
                  ],
                },
              },
            },
          },
        },
      },
      action: { type: "flower.harvested", id: flowerBedId },
    });

    expect(state.inventory["Desert Rose"]).toEqual(new Decimal(1));
  });
});

describe("harvestFlower — SPEED_BOOSTS speed windows", () => {
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => setNetwork("amoy"));
  afterAll(() => setNetwork(originalNetwork));

  const flowerName = "Red Pansy";
  const seed = FLOWERS[flowerName].seed;
  const baseMs = FLOWER_SEEDS[seed].plantSeconds * 1000;
  const plantedAt = 1_000_000_000;

  // A windowed flower with an active Blossom Hourglass window from plantedAt.
  const windowedGame = (): GameState => ({
    ...GAME_STATE,
    collectibles: {
      "Blossom Hourglass": [
        {
          id: "1",
          createdAt: plantedAt,
          readyAt: plantedAt,
          coordinates: { x: 0, y: 0 },
        },
      ],
    },
    flowers: {
      discovered: {},
      flowerBeds: {
        "1": {
          createdAt: 0,
          x: 0,
          y: 0,
          flower: { name: flowerName, plantedAt, baseDurationMs: baseMs },
        },
      },
    },
  });

  it("readies a boosted flower earlier than its base grow time", () => {
    const game = windowedGame();
    const flower = game.flowers.flowerBeds["1"].flower!;

    const windowedReadyAt = getFlowerReadyAt(flower, game);
    const legacyReadyAt = plantedAt + baseMs;

    expect(windowedReadyAt).toBeLessThan(legacyReadyAt);

    // Harvestable at the windowed readyAt even though legacy would still be growing.
    const state = harvestFlower({
      state: game,
      action: { type: "flower.harvested", id: "1" },
      createdAt: windowedReadyAt + 1,
    });

    expect(state.flowers.flowerBeds["1"].flower).toBeUndefined();
  });

  it("throws before the windowed readyAt", () => {
    const game = windowedGame();
    const flower = game.flowers.flowerBeds["1"].flower!;
    const windowedReadyAt = getFlowerReadyAt(flower, game);

    expect(() =>
      harvestFlower({
        state: game,
        action: { type: "flower.harvested", id: "1" },
        createdAt: windowedReadyAt - 1000,
      }),
    ).toThrow("Flower is not ready to harvest");
  });

  // Moth Shrine's TIME half is windowed (excluded from plant-time boostsUsed), but
  // its +1-flower YIELD critical must still apply at harvest.
  it("still grants the Moth Shrine +1 yield for a windowed flower", () => {
    // isTemporaryCollectibleActive checks Date.now(), so anchor the shrine to now.
    const nowMs = Date.now();
    const game: GameState = {
      ...GAME_STATE,
      collectibles: {
        "Moth Shrine": [
          {
            id: "1",
            createdAt: nowMs,
            readyAt: nowMs,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
      flowers: {
        discovered: {},
        flowerBeds: {
          "1": {
            createdAt: 0,
            x: 0,
            y: 0,
            flower: {
              name: flowerName,
              // Long past → ready regardless of windows.
              plantedAt: nowMs - 10 * baseMs,
              baseDurationMs: baseMs,
              criticalHit: { "Moth Shrine": 1 },
            },
          },
        },
      },
    };

    const state = harvestFlower({
      state: game,
      action: { type: "flower.harvested", id: "1" },
      createdAt: nowMs,
    });

    // Base 1 + Moth Shrine +1.
    expect(state.inventory[flowerName]?.gte(new Decimal(2))).toBe(true);
  });
});
