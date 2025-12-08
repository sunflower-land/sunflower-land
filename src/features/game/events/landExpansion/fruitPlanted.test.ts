import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  PATCH_FRUIT_SEEDS,
  PatchFruitSeedName,
} from "features/game/types/fruits";
import { FruitPatch, GameState } from "features/game/types/game";
import { getFruitPatchTime, plantFruit } from "./fruitPlanted";

const dateNow = Date.now();
const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  season: {
    season: "autumn",
    startedAt: 0,
  },
  fruitPatches: {
    0: {
      createdAt: dateNow,
      fruit: {
        name: "Apple",
        plantedAt: 123,
        harvestedAt: 0,
        harvestsLeft: 0,
      },
      x: -2,
      y: 0,
    },
    1: {
      createdAt: dateNow,
      x: -2,
      y: 0,
    },
  },
};
describe("fruitPlanted", () => {
  it("does not plant on non-existent fruit patch", () => {
    expect(() =>
      plantFruit({
        state: GAME_STATE,
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: "2",
          seed: "Apple Seed",
        },
      }),
    ).toThrow("Fruit patch does not exist");
  });

  it("does not plant on non-integer plot", () => {
    expect(() =>
      plantFruit({
        state: GAME_STATE,
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: "1.2",
          seed: "Apple Seed",
        },
      }),
    ).toThrow("Fruit patch does not exist");
  });

  it("does not plant on non-existent (negative input) plot", () => {
    expect(() =>
      plantFruit({
        state: GAME_STATE,
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: "-1",
          seed: "Apple Seed",
        },
      }),
    ).toThrow("Fruit patch does not exist");
  });

  it("does not plant if patch is already planted", () => {
    expect(() =>
      plantFruit({
        state: {
          ...GAME_STATE,
        },
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: "0",
          seed: "Apple Seed",
        },
      }),
    ).toThrow("Fruit is already planted");
  });

  it("does not plant if patch is not placed", () => {
    expect(() =>
      plantFruit({
        state: {
          ...GAME_STATE,
          fruitPatches: {
            ...GAME_STATE.fruitPatches,
            1: {
              ...GAME_STATE.fruitPatches[1],
              x: undefined,
              y: undefined,
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: "1",
          seed: "Apple Seed",
        },
      }),
    ).toThrow("Fruit patch is not placed");
  });

  it("does not plant an invalid seed", () => {
    expect(() =>
      plantFruit({
        state: { ...GAME_STATE, bumpkin: INITIAL_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: "1",
          seed: "Sunflower Seed" as PatchFruitSeedName,
        },
      }),
    ).toThrow("Not a fruit seed");
  });

  it("does not plant if user does not have seeds", () => {
    expect(() =>
      plantFruit({
        state: { ...GAME_STATE, bumpkin: INITIAL_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: "1",
          seed: "Apple Seed",
        },
      }),
    ).toThrow("Not enough seeds");
  });

  it("plants a seed", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Apple Seed": seedAmount,
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Apple Seed",
      },
    });

    const fruitPatches = state.fruitPatches;

    expect(state.inventory["Apple Seed"]).toEqual(seedAmount.minus(1));
    expect(fruitPatches).toBeDefined();
    expect((fruitPatches as Record<number, FruitPatch>)[patchIndex]).toEqual(
      expect.objectContaining({
        fruit: expect.objectContaining({
          name: "Apple",
          plantedAt: expect.any(Number),
        }),
      }),
    );
  });

  it("contains harvestedAt information", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Apple Seed": seedAmount,
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Apple Seed",
      },
    });

    const fruitPatches = state.fruitPatches;

    expect((fruitPatches as Record<number, FruitPatch>)[patchIndex]).toEqual(
      expect.objectContaining({
        fruit: expect.objectContaining({
          name: "Apple",
          plantedAt: expect.any(Number),
          harvestedAt: 0,
        }),
      }),
    );
  });

  it("contains harvestsLeft information", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Apple Seed": seedAmount,
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Apple Seed",
      },
      harvestsLeft: () => 3,
    });

    const fruitPatches = state.fruitPatches;

    expect((fruitPatches as Record<number, FruitPatch>)[patchIndex]).toEqual(
      expect.objectContaining({
        fruit: expect.objectContaining({
          name: "Apple",
          plantedAt: expect.any(Number),
          harvestedAt: 0,
          harvestsLeft: 3,
        }),
      }),
    );
  });

  it("includes immortal pear bonus", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Apple Seed": seedAmount,
          "Immortal Pear": new Decimal(1),
        },
        collectibles: {
          "Immortal Pear": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Apple Seed",
      },
      harvestsLeft: () => 3,
    });

    const fruitPatches = state.fruitPatches;

    expect((fruitPatches as Record<number, FruitPatch>)[patchIndex]).toEqual(
      expect.objectContaining({
        fruit: expect.objectContaining({
          name: "Apple",
          plantedAt: expect.any(Number),
          harvestedAt: 0,
          harvestsLeft: 4,
        }),
      }),
    );
  });

  it("includes Squirrel Monkey bonus on Oranges", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Orange Seed": seedAmount,
          "Squirrel Monkey": new Decimal(1),
        },
        season: {
          season: "spring",
          startedAt: 0,
        },
        collectibles: {
          "Squirrel Monkey": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Orange Seed",
      },
    });

    const fruitPatches = state.fruitPatches;

    expect(
      (fruitPatches as Record<number, FruitPatch>)[patchIndex].fruit?.plantedAt,
    ).toEqual(
      dateNow - (PATCH_FRUIT_SEEDS["Orange Seed"].plantSeconds * 1000) / 2,
    );
  });

  it("gives a 50% growth time reduction when Lemon Tea Bath is placed", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Lemon Seed": seedAmount,
          "Lemon Tea Bath": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
        },
        collectibles: {
          "Lemon Tea Bath": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Lemon Seed",
      },
    });

    const fruitPatches = state.fruitPatches;

    expect(
      (fruitPatches as Record<number, FruitPatch>)[patchIndex].fruit?.plantedAt,
    ).toEqual(
      dateNow - (PATCH_FRUIT_SEEDS["Lemon Seed"].plantSeconds * 1000) / 2,
    );
  });

  it("gives a 25% growth time reduction when Lemon Frog is placed", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Lemon Seed": seedAmount,
          "Lemon Frog": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
        },
        collectibles: {
          "Lemon Frog": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Lemon Seed",
      },
    });

    const fruitPatches = state.fruitPatches;

    expect(
      (fruitPatches as Record<number, FruitPatch>)[patchIndex].fruit?.plantedAt,
    ).toEqual(
      dateNow - PATCH_FRUIT_SEEDS["Lemon Seed"].plantSeconds * 1000 * 0.25,
    );
  });

  it("gives a 62.5% growth time reduction on lemons when Lemon Frog and Lemon Tea Bath are placed", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Lemon Seed": seedAmount,
          "Lemon Tea Bath": new Decimal(1),
          "Lemon Frog": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
        },
        collectibles: {
          "Lemon Tea Bath": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
          "Lemon Frog": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Lemon Seed",
      },
    });

    const fruitPatches = state.fruitPatches;

    expect(
      (fruitPatches as Record<number, FruitPatch>)[patchIndex].fruit?.plantedAt,
    ).toEqual(
      dateNow - PATCH_FRUIT_SEEDS["Lemon Seed"].plantSeconds * 1000 * 0.625,
    );
  });

  it("gives a 50% growth time reduction on tomatoes when Tomato Clown is placed", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Tomato Seed": seedAmount,
          "Tomato Clown": new Decimal(1),
        },
        collectibles: {
          "Tomato Clown": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Tomato Seed",
      },
    });

    const fruitPatches = state.fruitPatches;

    expect(
      (fruitPatches as Record<number, FruitPatch>)[patchIndex].fruit?.plantedAt,
    ).toEqual(
      dateNow - (PATCH_FRUIT_SEEDS["Tomato Seed"].plantSeconds * 1000) / 2,
    );
  });

  it("gives a 25% growth time reduction on tomatoes when Cannonball is placed", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Tomato Seed": seedAmount,
          Cannonball: new Decimal(1),
        },
        collectibles: {
          Cannonball: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Tomato Seed",
      },
    });

    const fruitPatches = state.fruitPatches;

    expect(
      (fruitPatches as Record<number, FruitPatch>)[patchIndex].fruit?.plantedAt,
    ).toEqual(
      dateNow - PATCH_FRUIT_SEEDS["Tomato Seed"].plantSeconds * 1000 * 0.25,
    );
  });

  it("gives a 62.5% growth time reduction on tomatoes when Cannonball and Tomato Clown are placed", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = "1";

    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Tomato Seed": seedAmount,
          "Tomato Clown": new Decimal(1),
          Cannonball: new Decimal(1),
        },
        collectibles: {
          "Tomato Clown": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
          Cannonball: [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: patchIndex,
        seed: "Tomato Seed",
      },
    });

    const fruitPatches = state.fruitPatches;

    expect(
      (fruitPatches as Record<number, FruitPatch>)[patchIndex].fruit?.plantedAt,
    ).toEqual(
      dateNow - PATCH_FRUIT_SEEDS["Tomato Seed"].plantSeconds * 1000 * 0.625,
    );
  });

  it("does not accept harvests exceeding limits", () => {
    expect(() =>
      plantFruit({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: {
            "Apple Seed": new Decimal(3),
          },
        },
        createdAt: dateNow,
        harvestsLeft: () => 10,
        action: {
          type: "fruit.planted",
          index: "1",
          seed: "Apple Seed",
        },
      }),
    ).toThrow("Invalid harvests left amount");
  });

  it("increments the fruit seed planted activity", () => {
    const amount = 1;
    const state = plantFruit({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Apple Seed": new Decimal(1),
        },
      },
      createdAt: dateNow,
      action: {
        type: "fruit.planted",
        index: "1",
        seed: "Apple Seed",
      },
    });
    expect(state.farmActivity["Apple Seed Planted"]).toEqual(amount);
  });
});

describe("getFruitTime", () => {
  it("applies a 50% speed boost with Squirrel Monkey placed for orange seeds", () => {
    const seed = "Orange Seed";
    const orangePlantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      collectibles: {
        "Squirrel Monkey": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(time).toEqual(orangePlantSeconds * 0.5);
  });
  it("does not apply a 50% speed boost with Squirrel Monkey placed for other seeds", () => {
    const seed = "Apple Seed";
    const applePlantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      collectibles: {
        "Squirrel Monkey": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(time).toEqual(applePlantSeconds);
  });

  it("applies a 50% time reduction for Lemons when Lemon Tea Bath is placed", () => {
    const seed = "Lemon Seed";
    const lemonPlantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      collectibles: {
        "Lemon Tea Bath": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(time).toEqual(lemonPlantSeconds * 0.5);
  });

  it("gives a 50% growth time reduction for tomatoes when Tomato Clown is placed", () => {
    const seed = "Tomato Seed";
    const tomatoPlantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      collectibles: {
        "Tomato Clown": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(time).toEqual(tomatoPlantSeconds * 0.5);
  });

  it("applies a 10% speed boost with Nana placed for Banana plant", () => {
    const seed = "Banana Plant";
    const orangePlantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      collectibles: {
        Nana: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(time).toEqual(orangePlantSeconds * 0.9);
  });
  it("does not apply a 10% speed boost with Nana placed for other seeds", () => {
    const seed = "Apple Seed";
    const applePlantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      collectibles: {
        Nana: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(time).toEqual(applePlantSeconds);
  });

  it("applies a 20% speed boost with Banana Onesie", () => {
    const seed = "Banana Plant";
    const orangePlantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        equipped: {
          ...INITIAL_BUMPKIN.equipped,

          onesie: "Banana Onesie",
        },
      },
    });
    expect(time).toEqual(orangePlantSeconds * 0.8);
  });

  it("applies a 20% speed boost with Fruit Tune Box", () => {
    const seed = "Banana Plant";
    const orangePlantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      collectibles: {
        "Fruit Tune Box": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(time).toEqual(orangePlantSeconds * 0.8);
  });

  it("applies a Orchard Hourglass boost of -25% fruit growth time for 6 hours", () => {
    const now = Date.now();
    const seed = "Banana Plant";
    const plantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      collectibles: {
        "Orchard Hourglass": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: now,
            id: "123",
            readyAt: now,
          },
        ],
      },
    });
    expect(time).toEqual(plantSeconds * 0.75);
  });

  it("does not apply a Orchard Hourglass boost if its expired", () => {
    const now = Date.now();
    const sevenHoursAgo = now - 1000 * 60 * 60 * 7;
    const seed = "Banana Plant";
    const plantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      collectibles: {
        "Orchard Hourglass": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: sevenHoursAgo,
            id: "123",
            readyAt: sevenHoursAgo,
          },
        ],
      },
    });
    expect(time).toEqual(plantSeconds);
  });

  it("applies a 10% growth speed boost on Fruit seeds with Catchup skill", () => {
    const seed = "Tomato Seed";
    const plantSeconds = PATCH_FRUIT_SEEDS[seed].plantSeconds;
    const { seconds: time } = getFruitPatchTime(seed, {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: {
          Catchup: 1,
        },
      },
    });

    expect(time).toEqual(plantSeconds * 0.9);
  });
  it("takes 2x faster to grow Apples with Long Pickings skill, but Oranges take 2x longer to grow", () => {
    const applePlantSeconds = PATCH_FRUIT_SEEDS["Apple Seed"].plantSeconds;
    const { seconds: appleTime } = getFruitPatchTime("Apple Seed", {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: {
          "Long Pickings": 1,
        },
      },
    });
    const orangePlantSeconds = PATCH_FRUIT_SEEDS["Orange Seed"].plantSeconds;
    const { seconds: orangeTime } = getFruitPatchTime("Orange Seed", {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: {
          "Long Pickings": 1,
        },
      },
    });
    expect(appleTime).toEqual(applePlantSeconds * 0.5);
    expect(orangeTime).toEqual(orangePlantSeconds * 2);
  });
  it("takes 2x faster to grow Orange with Short Pickings skill, but Apples take 2x longer to grow", () => {
    const applePlantSeconds = PATCH_FRUIT_SEEDS["Apple Seed"].plantSeconds;
    const { seconds: appleTime } = getFruitPatchTime("Apple Seed", {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: {
          "Short Pickings": 1,
        },
      },
    });
    const orangePlantSeconds = PATCH_FRUIT_SEEDS["Orange Seed"].plantSeconds;
    const { seconds: orangeTime } = getFruitPatchTime("Orange Seed", {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: {
          "Short Pickings": 1,
        },
      },
    });
    expect(appleTime).toEqual(applePlantSeconds * 2);
    expect(orangeTime).toEqual(orangePlantSeconds * 0.5);
  });
});
