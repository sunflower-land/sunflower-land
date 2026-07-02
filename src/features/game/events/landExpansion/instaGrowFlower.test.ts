import { instaGrowFlower } from "./instaGrowFlower";
import type { GameState } from "../../types/game";
import { FLOWER_SEEDS, FLOWERS, type FlowerName } from "../../types/flowers";
import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { getFlowerReadyAt } from "features/game/lib/flowerBedReadiness";
import { CONFIG } from "lib/config";

const setNetwork = (network: "mainnet" | "amoy") => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = network;
};

const GAME_STATE: GameState = {
  flowers: {
    discovered: {},
    flowerBeds: {},
  },
  inventory: {
    Obsidian: new Decimal(1),
  },
} as GameState;

describe("instaGrowFlower", () => {
  it("throws an error if the flower bed does not exist", () => {
    expect(() =>
      instaGrowFlower({
        state: GAME_STATE,
        action: { type: "flower.instaGrown", id: "123" },
      }),
    ).toThrow("Flower bed does not exist");
  });

  it("throws an error if the flower bed does not have a flower", () => {
    const state = {
      ...GAME_STATE,
      flowers: {
        discovered: {},
        flowerBeds: {
          "123": {
            createdAt: 0,
            x: 0,
            y: 0,
          },
        },
      },
    };

    expect(() =>
      instaGrowFlower({
        state,
        action: { type: "flower.instaGrown", id: "123" },
      }),
    ).toThrow("Flower bed does not have a flower");
  });

  it("throws an error if flower is already ready", () => {
    const flowerBedId = "123";
    const state = {
      ...GAME_STATE,
      flowers: {
        discovered: {},
        flowerBeds: {
          [flowerBedId]: {
            createdAt: 0,
            x: 0,
            y: 0,
            flower: {
              name: "Red Pansy" as FlowerName,
              plantedAt:
                Date.now() -
                (FLOWER_SEEDS[FLOWERS["Red Pansy"].seed].plantSeconds * 1000 +
                  1000), // Already ready
            },
          },
        },
      },
    };

    expect(() =>
      instaGrowFlower({
        state,
        action: { type: "flower.instaGrown", id: flowerBedId },
      }),
    ).toThrow("Flower is already ready to harvest");
  });

  it("throws an error if insufficient Obsidian", () => {
    const flowerBedId = "123";
    const state = {
      ...GAME_STATE,
      inventory: {
        Obsidian: new Decimal(0.05),
      },
      flowers: {
        discovered: {},
        flowerBeds: {
          [flowerBedId]: {
            createdAt: 0,
            x: 0,
            y: 0,
            flower: {
              name: "Red Pansy" as FlowerName,
              plantedAt: Date.now(),
            },
          },
        },
      },
    };

    expect(() =>
      instaGrowFlower({
        state,
        action: { type: "flower.instaGrown", id: flowerBedId },
      }),
    ).toThrow("Insufficient Obsidian");
  });

  it("instantly grows the flower and deducts Obsidian cost", () => {
    const flowerBedId = "123";
    const plantedAt = Date.now();
    const growTime =
      FLOWER_SEEDS[FLOWERS["Red Pansy"].seed].plantSeconds * 1000;
    const timeLeft = growTime; // Full time remaining
    const daysRemaining = timeLeft / (24 * 60 * 60 * 1000);
    const expectedCost = daysRemaining * 0.1;

    const state = {
      ...GAME_STATE,
      inventory: {
        Obsidian: new Decimal(1),
      },
      flowers: {
        discovered: {},
        flowerBeds: {
          [flowerBedId]: {
            createdAt: 0,
            x: 0,
            y: 0,
            flower: {
              name: "Red Pansy" as FlowerName,
              plantedAt,
            },
          },
        },
      },
      beehives: {
        123: {
          swarm: false,
          honey: {
            updatedAt: 0,
            produced: 0,
          },
          flowers: [
            {
              id: flowerBedId,
              attachedAt: 0,
              attachedUntil: 0,
            },
          ],
        },
      },
    };

    const result = instaGrowFlower({
      state,
      action: { type: "flower.instaGrown", id: flowerBedId },
    });

    expect(result.inventory.Obsidian).toEqual(new Decimal(1).sub(expectedCost));

    const newTimeLeft =
      result.flowers.flowerBeds[flowerBedId].flower!.plantedAt +
      growTime -
      Date.now();
    expect(newTimeLeft).toBeLessThanOrEqual(0);
  });

  it("updates the beehives after a flower is instagrown", () => {
    const flowerBedId = "123";
    const now = Date.now();
    const growTime =
      FLOWER_SEEDS[FLOWERS["Red Pansy"].seed].plantSeconds * 1000;

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {
        Obsidian: new Decimal(1),
      },
      beehives: {
        "123": {
          swarm: false,
          honey: {
            updatedAt: 0,
            produced: 0,
          },
          x: 0,
          y: 0,
          flowers: [
            {
              id: flowerBedId,
              attachedAt: now,
              attachedUntil: now + growTime,
            },
          ],
        },
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
              plantedAt: now,
            },
          },
        },
      },
    };

    const result = instaGrowFlower({
      state,
      action: { type: "flower.instaGrown", id: flowerBedId },
    });

    expect(result.beehives["123"].flowers).toEqual([]);
  });
});

describe("instaGrowFlower — SPEED_BOOSTS speed windows", () => {
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => setNetwork("amoy"));
  afterAll(() => setNetwork(originalNetwork));

  const flowerName: FlowerName = "Red Pansy";
  const baseMs = FLOWER_SEEDS[FLOWERS[flowerName].seed].plantSeconds * 1000;

  it("zeroes baseDurationMs instead of back-dating plantedAt", () => {
    const createdAt = 2_000_000_000;
    const plantedAt = createdAt;
    const flowerBedId = "1";

    const result = instaGrowFlower({
      state: {
        ...INITIAL_FARM,
        inventory: { Obsidian: new Decimal(100) },
        beehives: {},
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              flower: { name: flowerName, plantedAt, baseDurationMs: baseMs },
            },
          },
        },
      } as GameState,
      action: { type: "flower.instaGrown", id: flowerBedId },
      createdAt,
    });

    const flower = result.flowers.flowerBeds[flowerBedId].flower!;

    // Windowed insta-grow zeroes remaining work and anchors the start to now.
    expect(flower.baseDurationMs).toEqual(0);
    expect(flower.plantedAt).toEqual(createdAt);
    // Ready now: readyAt resolves to the (now) start === createdAt.
    expect(getFlowerReadyAt(flower, result)).toEqual(createdAt);
    // Some Obsidian was spent.
    expect(result.inventory.Obsidian!.lt(new Decimal(100))).toBe(true);
  });

  it("credits beehive honey accrued before insta-growing an attached windowed flower", () => {
    const createdAt = 2_000_000_000;
    const plantedAt = createdAt - 12 * 60 * 60 * 1000; // planted 12h ago
    const flowerBedId = "1";

    const result = instaGrowFlower({
      state: {
        ...INITIAL_FARM,
        inventory: { Obsidian: new Decimal(100) },
        beehives: {
          hive: {
            swarm: false,
            honey: { updatedAt: plantedAt, produced: 0 },
            x: 0,
            y: 0,
            flowers: [
              {
                id: flowerBedId,
                attachedAt: plantedAt,
                attachedUntil: plantedAt + baseMs,
              },
            ],
          },
        },
        flowers: {
          discovered: {},
          flowerBeds: {
            [flowerBedId]: {
              createdAt: 0,
              x: 0,
              y: 0,
              // Windowed flower with a 24h base still 12h from ready.
              flower: {
                name: flowerName,
                plantedAt,
                baseDurationMs: 24 * 60 * 60 * 1000,
              },
            },
          },
        },
      } as GameState,
      action: { type: "flower.instaGrown", id: flowerBedId },
      createdAt,
    });

    const flower = result.flowers.flowerBeds[flowerBedId].flower!;
    // readyAt anchored to now, NOT collapsed back to the (past) plantedAt.
    expect(flower.plantedAt).toEqual(createdAt);
    expect(getFlowerReadyAt(flower, result)).toEqual(createdAt);
    // Honey produced over [attachedAt, insta-grow] is credited, not clamped to 0
    // by a past readyAt.
    expect(result.beehives.hive.honey.produced).toBeGreaterThan(0);
  });
});
