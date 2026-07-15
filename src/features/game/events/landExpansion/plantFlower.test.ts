import Decimal from "decimal.js-light";
import { getFlowerTime, plantFlower } from "./plantFlower";
import type { GameState } from "features/game/types/game";
import { TEST_FARM } from "features/game/lib/constants";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import {
  FLOWER_CROSS_BREED_AMOUNTS,
  FLOWER_SEEDS,
} from "features/game/types/flowers";
import { CONFIG } from "lib/config";

const setNetwork = (network: "mainnet" | "amoy") => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = network;
};

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: TEST_BUMPKIN,
  flowers: {
    discovered: {},
    flowerBeds: {
      0: {
        createdAt: Date.now(),
        x: -2,
        y: 0,
        flower: {
          name: "Red Pansy",
          plantedAt: 123,
        },
      },
      1: {
        createdAt: Date.now(),
        x: -2,
        y: 0,
      },
    },
  },
};

describe("plantFlower", () => {
  const dateNow = Date.now();

  // These assert the LEGACY baked/back-dated model. FE jest runs on amoy where
  // SPEED_BOOSTS is on (Blossom Hourglass / Moth Shrine become windowed, permanent
  // boosts store baseDurationMs instead of back-dating), so force mainnet here.
  // Windowed coverage lives in "plantFlower — SPEED_BOOSTS speed windows".
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => setNetwork("mainnet"));
  afterAll(() => setNetwork(originalNetwork));

  it("does not plant in a non-existent flower bed", () => {
    expect(() =>
      plantFlower({
        state: GAME_STATE,
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "2",
          seed: "Sunpetal Seed",
          crossbreed: "Sunflower",
        },
      }),
    ).toThrow("Flower bed does not exist");
  });

  it("does not plant if flower bed is not placed", () => {
    expect(() =>
      plantFlower({
        state: {
          ...GAME_STATE,
          flowers: {
            ...GAME_STATE.flowers,
            flowerBeds: {
              1: {
                ...GAME_STATE.flowers.flowerBeds[1],
                x: undefined,
                y: undefined,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "1",
          seed: "Sunpetal Seed",
          crossbreed: "Sunflower",
        },
      }),
    ).toThrow("Flower bed is not placed");
  });

  it("does not plant if flower is already planted", () => {
    expect(() =>
      plantFlower({
        state: {
          ...GAME_STATE,
        },
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "0",
          seed: "Sunpetal Seed",
          crossbreed: "Sunflower",
        },
      }),
    ).toThrow("Flower is already planted");
  });

  it("does not plant an invalid seed", () => {
    expect(() =>
      plantFlower({
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "1",
          seed: "Sunflower Seed" as "Sunpetal Seed",
          crossbreed: "Sunflower",
        },
      }),
    ).toThrow("Not a flower seed");
  });

  it("does not plant if user does not have seeds", () => {
    expect(() =>
      plantFlower({
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "1",
          seed: "Sunpetal Seed",
          crossbreed: "Sunflower",
        },
      }),
    ).toThrow("Not enough seeds");
  });

  it("does not plant if user does not have the crossbreed", () => {
    expect(() =>
      plantFlower({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Sunpetal Seed": new Decimal(1) },
        },
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "1",
          seed: "Sunpetal Seed",
          crossbreed: "Sunflower",
        },
      }),
    ).toThrow("Not enough crossbreed");
  });

  it("plants a seed", () => {
    const seedAmount = new Decimal(5);

    const bedIndex = "1";

    const state = plantFlower({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Sunpetal Seed": seedAmount,
          Sunflower: new Decimal(100),
        },
      },
      createdAt: dateNow,
      action: {
        type: "flower.planted",
        id: bedIndex,
        seed: "Sunpetal Seed",
        crossbreed: "Sunflower",
      },
    });

    expect(state.inventory["Sunpetal Seed"]).toEqual(seedAmount.minus(1));
    expect(state.flowers.flowerBeds[bedIndex]).toEqual(
      expect.objectContaining({
        flower: expect.objectContaining({
          plantedAt: expect.any(Number),
        }),
      }),
    );
  });

  it("increments the flower seed planted activity", () => {
    const amount = 1;
    const state = plantFlower({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Sunpetal Seed": new Decimal(1),
          Sunflower: new Decimal(100),
        },
      },
      createdAt: dateNow,
      action: {
        type: "flower.planted",
        id: "1",
        seed: "Sunpetal Seed",
        crossbreed: "Sunflower",
      },
    });
    expect(state.farmActivity["Sunpetal Seed Planted"]).toEqual(amount);
  });

  it("deducts the seed from the inventory", () => {
    const initialState = {
      ...GAME_STATE,
      bumpkin: TEST_BUMPKIN,
      inventory: {
        "Sunpetal Seed": new Decimal(1),
        Sunflower: new Decimal(100),
      },
    };

    const inventoryBefore = initialState.inventory["Sunpetal Seed"];

    const state = plantFlower({
      state: initialState,
      createdAt: dateNow,
      action: {
        type: "flower.planted",
        id: "1",
        seed: "Sunpetal Seed",
        crossbreed: "Sunflower",
      },
    });
    expect(state.inventory["Sunpetal Seed"]).toEqual(inventoryBefore?.sub(1));
  });

  it("deducts the amount of cross breed required", () => {
    const initialState = {
      ...GAME_STATE,
      bumpkin: TEST_BUMPKIN,
      inventory: {
        "Sunpetal Seed": new Decimal(1),
        Sunflower: new Decimal(100),
      },
    };

    const inventoryBefore = initialState.inventory["Sunflower"];

    const state = plantFlower({
      state: initialState,
      createdAt: dateNow,
      action: {
        type: "flower.planted",
        id: "1",
        seed: "Sunpetal Seed",
        crossbreed: "Sunflower",
      },
    });

    const inventoryAfter = state.inventory["Sunflower"];
    expect(inventoryAfter).toEqual(
      inventoryBefore?.sub(
        FLOWER_CROSS_BREED_AMOUNTS["Sunpetal Seed"]["Sunflower"] ?? Infinity,
      ),
    );
  });
  it("reduces flower harvest time in half if wearing Flower Crown ", () => {
    const seedAmount = new Decimal(5);

    const bedIndex = "1";

    const state = plantFlower({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: { ...TEST_BUMPKIN.equipped, hat: "Flower Crown" },
        },
        inventory: {
          "Sunpetal Seed": seedAmount,
          Sunflower: new Decimal(100),
        },
      },
      createdAt: dateNow,
      action: {
        type: "flower.planted",
        id: bedIndex,
        seed: "Sunpetal Seed",
        crossbreed: "Sunflower",
      },
    });

    expect(state.inventory["Sunpetal Seed"]).toEqual(seedAmount.minus(1));
    expect(state.flowers.flowerBeds[bedIndex].flower?.plantedAt).toEqual(
      dateNow - (FLOWER_SEEDS["Sunpetal Seed"].plantSeconds * 1000) / 2,
    );
  });

  it("reduces flower harvest time in 10% if Flower Fox is built ", () => {
    const seedAmount = new Decimal(5);

    const bedIndex = "1";

    const state = plantFlower({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunpetal Seed": seedAmount,
          Sunflower: new Decimal(100),
        },
        collectibles: {
          "Flower Fox": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: dateNow,
              id: "1",
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "flower.planted",
        id: bedIndex,
        seed: "Sunpetal Seed",
        crossbreed: "Sunflower",
      },
    });

    expect(state.inventory["Sunpetal Seed"]).toEqual(seedAmount.minus(1));
    expect(state.flowers.flowerBeds[bedIndex].flower?.plantedAt).toEqual(
      dateNow - FLOWER_SEEDS["Sunpetal Seed"].plantSeconds * 1000 * 0.1,
    );
  });

  it("reduces 55% flower harvest time if both Flower Fox and Flower Crown are present", () => {
    const seedAmount = new Decimal(5);

    const bedIndex = "1";

    const state = plantFlower({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: { ...TEST_BUMPKIN.equipped, hat: "Flower Crown" },
        },
        inventory: {
          "Sunpetal Seed": seedAmount,
          Sunflower: new Decimal(100),
        },
        collectibles: {
          "Flower Fox": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: dateNow,
              id: "1",
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "flower.planted",
        id: bedIndex,
        seed: "Sunpetal Seed",
        crossbreed: "Sunflower",
      },
    });

    expect(state.inventory["Sunpetal Seed"]).toEqual(seedAmount.minus(1));
    expect(state.flowers.flowerBeds[bedIndex].flower?.plantedAt).toEqual(
      dateNow - FLOWER_SEEDS["Sunpetal Seed"].plantSeconds * 1000 * 0.55,
    );
  });

  it("throws if the seed is not in season", () => {
    const initialState: GameState = {
      ...GAME_STATE,
      bumpkin: TEST_BUMPKIN,
      inventory: {
        "Sunpetal Seed": new Decimal(1),
        Sunflower: new Decimal(100),
      },
      season: {
        season: "winter",
        startedAt: 0,
      },
    };

    expect(() =>
      plantFlower({
        state: initialState,
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "1",
          seed: "Lavender Seed",
          crossbreed: "Pepper",
        },
      }),
    ).toThrow("Lavender Seed is not in season");
  });
});

describe("getFlowerTime", () => {
  // Legacy baked model (Blossom Hourglass applies at plant). FE jest runs on amoy
  // where it's windowed instead, so force mainnet. Windowed coverage lives in
  // "getFlowerTime — SPEED_BOOSTS".
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => setNetwork("mainnet"));
  afterAll(() => setNetwork(originalNetwork));

  it("applies a Blossom Hourglass boost of -25% flower growth time for 4 hours", () => {
    const now = Date.now();
    const seed = "Bloom Seed";
    const growSeconds = FLOWER_SEEDS[seed].plantSeconds;

    const { seconds: time } = getFlowerTime(seed, {
      ...GAME_STATE,
      collectibles: {
        "Blossom Hourglass": [
          {
            id: "1",
            createdAt: now,
            readyAt: now + 4 * 60 * 60 * 1000,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    });

    expect(time).toEqual(growSeconds * 0.75);
  });

  it("does not apply a Blossom Hourglass boost if it has expired", () => {
    const now = Date.now();
    const fiveHoursAgo = now - 5 * 60 * 60 * 1000;
    const seed = "Bloom Seed";
    const growSeconds = FLOWER_SEEDS[seed].plantSeconds;

    const { seconds: time } = getFlowerTime(seed, {
      ...GAME_STATE,
      collectibles: {
        "Blossom Hourglass": [
          {
            id: "1",
            createdAt: fiveHoursAgo,
            readyAt: fiveHoursAgo,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    });

    expect(time).toEqual(growSeconds);
  });

  it("applies a 10% speed boost with Blooming Boost skill", () => {
    const seed = "Bloom Seed";
    const growSeconds = FLOWER_SEEDS[seed].plantSeconds;

    const { seconds: time } = getFlowerTime(seed, {
      ...GAME_STATE,
      bumpkin: {
        ...TEST_BUMPKIN,
        skills: { "Blooming Boost": 1 },
      },
    });

    expect(time).toEqual(growSeconds * 0.9);
  });

  it("applies a 20% speed boost with Flower Power skill", () => {
    const seed = "Bloom Seed";
    const growSeconds = FLOWER_SEEDS[seed].plantSeconds;

    const { seconds: time } = getFlowerTime(seed, {
      ...GAME_STATE,
      bumpkin: {
        ...TEST_BUMPKIN,
        skills: { "Flower Power": 1 },
      },
    });

    expect(time).toEqual(growSeconds * 0.8);
  });

  describe("upgradeable skill ranks", () => {
    const seed = "Bloom Seed";
    const growSeconds = FLOWER_SEEDS[seed].plantSeconds;

    const timeWithSkills = (skills: Record<string, number>) =>
      getFlowerTime(seed, {
        ...GAME_STATE,
        bumpkin: { ...TEST_BUMPKIN, skills },
      }).seconds;

    it("applies a 12.5% speed boost with Blooming Boost at rank 2", () => {
      expect(timeWithSkills({ "Blooming Boost": 2 })).toEqual(
        growSeconds * 0.875,
      );
    });

    it("applies a 15% speed boost with Blooming Boost at rank 3", () => {
      expect(timeWithSkills({ "Blooming Boost": 3 })).toEqual(
        growSeconds * 0.85,
      );
    });

    it("applies a 30% speed boost with Flower Power at rank 2", () => {
      expect(timeWithSkills({ "Flower Power": 2 })).toEqual(growSeconds * 0.7);
    });

    it("applies a 40% speed boost with Flower Power at rank 3", () => {
      expect(timeWithSkills({ "Flower Power": 3 })).toEqual(growSeconds * 0.6);
    });

    it("applies a 50% growth debuff with Flowery Abode at rank 1", () => {
      expect(timeWithSkills({ "Flowery Abode": 1 })).toEqual(growSeconds * 1.5);
    });

    it("applies a 60% growth debuff with Flowery Abode at rank 2", () => {
      expect(timeWithSkills({ "Flowery Abode": 2 })).toEqual(growSeconds * 1.6);
    });

    it("applies a 70% growth debuff with Flowery Abode at rank 3", () => {
      expect(timeWithSkills({ "Flowery Abode": 3 })).toEqual(growSeconds * 1.7);
    });
  });
});

describe("getFlowerTime — SPEED_BOOSTS", () => {
  // Windowed model: the two temporary boosts (Blossom Hourglass + Moth Shrine's
  // time half) are derived live from boost windows, so they're excluded from the
  // baked time here; permanent boosts stay baked.
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => setNetwork("amoy"));
  afterAll(() => setNetwork(originalNetwork));

  const now = Date.now();

  it("excludes the Blossom Hourglass from the baked time (windowed)", () => {
    const seed = "Bloom Seed";
    const growSeconds = FLOWER_SEEDS[seed].plantSeconds;

    const { seconds: time, boostsUsed } = getFlowerTime(seed, {
      ...GAME_STATE,
      collectibles: {
        "Blossom Hourglass": [
          {
            id: "1",
            createdAt: now,
            readyAt: now + 4 * 60 * 60 * 1000,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    });

    expect(time).toEqual(growSeconds);
    expect(boostsUsed.map((b) => b.name)).not.toContain("Blossom Hourglass");
  });

  it("excludes the Moth Shrine time boost from the baked time (windowed)", () => {
    const seed = "Bloom Seed";
    const growSeconds = FLOWER_SEEDS[seed].plantSeconds;

    const { seconds: time, boostsUsed } = getFlowerTime(seed, {
      ...GAME_STATE,
      collectibles: {
        "Moth Shrine": [
          {
            id: "1",
            createdAt: now,
            readyAt: now + 7 * 24 * 60 * 60 * 1000,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    });

    expect(time).toEqual(growSeconds);
    expect(boostsUsed.map((b) => b.name)).not.toContain("Moth Shrine");
  });

  it("still bakes permanent boosts (Flower Fox 0.9x) into the time", () => {
    const seed = "Bloom Seed";
    const growSeconds = FLOWER_SEEDS[seed].plantSeconds;

    const { seconds: time } = getFlowerTime(seed, {
      ...GAME_STATE,
      collectibles: {
        "Flower Fox": [
          { id: "1", createdAt: now, readyAt: 0, coordinates: { x: 0, y: 0 } },
        ],
      },
    });

    expect(time).toEqual(growSeconds * 0.9);
  });
});

describe("plantFlower — SPEED_BOOSTS speed windows", () => {
  const dateNow = Date.now();
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => setNetwork("amoy"));
  afterAll(() => setNetwork(originalNetwork));

  const baseState: GameState = {
    ...GAME_STATE,
    inventory: {
      "Sunpetal Seed": new Decimal(5),
      Sunflower: new Decimal(100),
    },
  };

  const plantAt = (state: GameState) =>
    plantFlower({
      state,
      createdAt: dateNow,
      action: {
        type: "flower.planted",
        id: "1",
        seed: "Sunpetal Seed",
        crossbreed: "Sunflower",
      },
    });

  it("stores the real plantedAt + baseDurationMs instead of back-dating", () => {
    const flower = plantAt(baseState).flowers.flowerBeds["1"].flower;

    expect(flower?.plantedAt).toEqual(dateNow);
    expect(flower?.baseDurationMs).toEqual(
      FLOWER_SEEDS["Sunpetal Seed"].plantSeconds * 1000,
    );
  });

  it("bakes permanent boosts into baseDurationMs (Flower Fox 0.9x)", () => {
    const flower = plantAt({
      ...baseState,
      collectibles: {
        "Flower Fox": [
          {
            id: "1",
            createdAt: dateNow,
            readyAt: 0,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    }).flowers.flowerBeds["1"].flower;

    expect(flower?.plantedAt).toEqual(dateNow);
    expect(flower?.baseDurationMs).toEqual(
      FLOWER_SEEDS["Sunpetal Seed"].plantSeconds * 1000 * 0.9,
    );
  });

  it("excludes an active Blossom Hourglass from baseDurationMs (it is windowed)", () => {
    const flower = plantAt({
      ...baseState,
      collectibles: {
        "Blossom Hourglass": [
          {
            id: "1",
            createdAt: dateNow,
            readyAt: dateNow + 4 * 60 * 60 * 1000,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    }).flowers.flowerBeds["1"].flower;

    // Not multiplied by 0.75 — the Blossom Hourglass is applied live via the window.
    expect(flower?.baseDurationMs).toEqual(
      FLOWER_SEEDS["Sunpetal Seed"].plantSeconds * 1000,
    );
  });
});
