import Decimal from "decimal.js-light";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  CHAPTER_CROP_WEEK,
  CHAPTER_CROP_WEEK_SEED,
} from "features/game/types/chapterCropWeek";

import { planSeedPurchases } from "./planSeedPurchases";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  coins: 1000,
  inventory: {
    ...TEST_FARM.inventory,
    "Crop Plot": new Decimal(10),
  },
};

describe("planSeedPurchases", () => {
  it("plans the max affordable amount of an affordable seed", () => {
    const plan = planSeedPurchases(GAME_STATE, ["Sunflower Seed"]);

    expect(plan.purchases).toHaveLength(1);
    expect(plan.purchases[0].seedName).toBe("Sunflower Seed");
    expect(plan.purchases[0].amount).toBeGreaterThan(0);
    expect(plan.totalCost).toBeGreaterThan(0);
  });

  it("spends the shared coin pool in list order, skipping seeds it can no longer afford", () => {
    // Sunflower Seed (0.01) is priced far below Pumpkin Seed (0.2) - with a
    // tight budget the first seed in the list should eat the whole pool,
    // leaving nothing for the second.
    const state: GameState = {
      ...GAME_STATE,
      coins: 0.01,
      bumpkin: { ...INITIAL_BUMPKIN, experience: 100 },
    };

    const plan = planSeedPurchases(state, ["Sunflower Seed", "Pumpkin Seed"]);

    expect(plan.purchases.map((p) => p.seedName)).toEqual(["Sunflower Seed"]);
  });

  it("does not plan the same seed twice when it appears more than once in the input", () => {
    const plan = planSeedPurchases(GAME_STATE, [
      "Sunflower Seed",
      "Sunflower Seed",
    ]);

    expect(plan.purchases).toHaveLength(1);
  });

  it("is not price-limited by coins when the seed is free (e.g. Kuebiko built)", () => {
    const state: GameState = {
      ...GAME_STATE,
      coins: 0,
      collectibles: {
        Kuebiko: [
          {
            id: "1",
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
          },
        ],
      },
    };

    const plan = planSeedPurchases(state, ["Sunflower Seed"]);

    expect(plan.purchases).toHaveLength(1);
    expect(plan.purchases[0].price).toBe(0);
    expect(plan.totalCost).toBe(0);
  });

  it("skips a seed whose planting spot is present but below 1", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Crop Plot": new Decimal(0),
      },
    };

    const plan = planSeedPurchases(state, ["Sunflower Seed"]);

    expect(plan.purchases).toHaveLength(0);
  });

  // Regression: a farm that has never unlocked a Fruit Patch has no
  // "Fruit Patch" key in inventory at all (not a 0) - the plan must treat
  // a missing key the same as zero, not silently include the seed.
  it("skips a seed whose planting spot is missing from inventory entirely", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: { ...INITIAL_BUMPKIN, experience: 1_000_000 },
      inventory: {
        ...GAME_STATE.inventory,
        "Fruit Patch": undefined,
      },
      stock: {
        ...GAME_STATE.stock,
        "Tomato Seed": new Decimal(10),
      },
    };

    const plan = planSeedPurchases(state, ["Tomato Seed"]);

    expect(plan.purchases).toHaveLength(0);
  });

  it("skips a seed locked by the bumpkin's level", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: { ...INITIAL_BUMPKIN, experience: 0 },
    };

    // Pumpkin Seed requires level 2
    const plan = planSeedPurchases(state, ["Pumpkin Seed"]);

    expect(plan.purchases).toHaveLength(0);
  });

  it("skips a seed that is out of stock", () => {
    const state: GameState = {
      ...GAME_STATE,
      stock: {
        ...GAME_STATE.stock,
        "Sunflower Seed": new Decimal(0),
      },
    };

    const plan = planSeedPurchases(state, ["Sunflower Seed"]);

    expect(plan.purchases).toHaveLength(0);
  });

  it("skips a seed that would exceed the inventory limit", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(1_000_000),
      },
    };

    const plan = planSeedPurchases(state, ["Sunflower Seed"]);

    expect(plan.purchases).toHaveLength(0);
  });

  it("skips full moon seeds outside of a full moon", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: { ...INITIAL_BUMPKIN, experience: 1_000_000 },
      inventory: {
        ...GAME_STATE.inventory,
        "Fruit Patch": new Decimal(10),
      },
      stock: {
        ...GAME_STATE.stock,
        "Celestine Seed": new Decimal(5),
      },
    };

    const plan = planSeedPurchases(state, ["Celestine Seed"]);

    expect(plan.purchases).toHaveLength(0);
  });

  it("includes full moon seeds during an active full moon", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: { ...INITIAL_BUMPKIN, experience: 1_000_000 },
      inventory: {
        ...GAME_STATE.inventory,
        "Fruit Patch": new Decimal(10),
      },
      stock: {
        ...GAME_STATE.stock,
        "Celestine Seed": new Decimal(5),
      },
      calendar: {
        ...GAME_STATE.calendar,
        fullMoon: { startedAt: Date.now(), triggeredAt: Date.now() },
      },
    };

    const plan = planSeedPurchases(state, ["Celestine Seed"]);

    expect(plan.purchases).toHaveLength(1);
    expect(plan.purchases[0].seedName).toBe("Celestine Seed");
  });

  it("skips the Chapter Crop Week seed outside of the event window", () => {
    jest.useFakeTimers();
    jest.setSystemTime(CHAPTER_CROP_WEEK.startDate.getTime() - 1);

    const state: GameState = {
      ...GAME_STATE,
      stock: {
        ...GAME_STATE.stock,
        [CHAPTER_CROP_WEEK_SEED]: new Decimal(5),
      },
    };

    const plan = planSeedPurchases(state, [CHAPTER_CROP_WEEK_SEED]);

    expect(plan.purchases).toHaveLength(0);

    jest.useRealTimers();
  });

  it("includes the Chapter Crop Week seed during the event window", () => {
    jest.useFakeTimers();
    jest.setSystemTime(CHAPTER_CROP_WEEK.startDate.getTime());

    const state: GameState = {
      ...GAME_STATE,
      stock: {
        ...GAME_STATE.stock,
        [CHAPTER_CROP_WEEK_SEED]: new Decimal(5),
      },
    };

    const plan = planSeedPurchases(state, [CHAPTER_CROP_WEEK_SEED]);

    expect(plan.purchases).toHaveLength(1);
    expect(plan.purchases[0].seedName).toBe(CHAPTER_CROP_WEEK_SEED);

    jest.useRealTimers();
  });
});
