import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { FruitSeedName } from "features/game/types/fruits";
import { FruitPatch, GameState } from "features/game/types/game";
import { plantFruit } from "./fruitPlanted";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  expansions: [
    ...TEST_FARM.expansions,
    {
      fruitPatches: {
        0: {
          fruit: {
            name: "Apple",
            amount: 1,
            plantedAt: 123,
            harvestedAt: 0,
            harvestsLeft: 0,
          },
          x: -2,
          y: 0,
          height: 1,
          width: 1,
        },
        1: {
          x: -2,
          y: 0,
          height: 1,
          width: 1,
        },
      },
      createdAt: 234,
      readyAt: 0,
    },
  ],
};
describe("fruitPlanted", () => {
  const dateNow = Date.now();

  it("throws an error if the player doesn't have a bumpkin", () => {
    expect(() =>
      plantFruit({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          expansionIndex: 0,
          index: 0,
          seed: "Apple Seed",
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("does not plant fruit on a non existent expansion", () => {
    expect(() =>
      plantFruit({
        state: { ...GAME_STATE, bumpkin: INITIAL_BUMPKIN, expansions: [] },
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          expansionIndex: 3,
          index: 0,
          seed: "Apple Seed",
        },
      })
    ).toThrow("Expansion does not exist");
  });

  it("does not plant on a an expansion with no fruit patches", () => {
    expect(() =>
      plantFruit({
        state: GAME_STATE,
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: 0,
          expansionIndex: 0,
          seed: "Apple Seed",
        },
      })
    ).toThrow("Expansion does not have any fruit patches");
  });

  it("does not plant on non-existent fruit patch", () => {
    expect(() =>
      plantFruit({
        state: GAME_STATE,
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: 2,
          expansionIndex: 3,
          seed: "Apple Seed",
        },
      })
    ).toThrow("Fruit patch does not exist");
  });

  it("does not plant on non-integer plot", () => {
    expect(() =>
      plantFruit({
        state: GAME_STATE,
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: 1.2,
          expansionIndex: 3,
          seed: "Apple Seed",
        },
      })
    ).toThrow("Fruit patch does not exist");
  });

  it("does not plant on non-existent (negative input) plot", () => {
    expect(() =>
      plantFruit({
        state: GAME_STATE,
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: -1,
          expansionIndex: 3,
          seed: "Apple Seed",
        },
      })
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
          index: 0,
          expansionIndex: 3,
          seed: "Apple Seed",
        },
      })
    ).toThrow("Fruit is already planted");
  });

  it("does not plant an invalid seed", () => {
    expect(() =>
      plantFruit({
        state: { ...GAME_STATE, bumpkin: INITIAL_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: 1,
          expansionIndex: 3,
          seed: "Sunflower Seed" as FruitSeedName,
        },
      })
    ).toThrow("Not a fruit seed");
  });

  it("does not plant if user does not have seeds", () => {
    expect(() =>
      plantFruit({
        state: { ...GAME_STATE, bumpkin: INITIAL_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "fruit.planted",
          index: 1,
          expansionIndex: 3,
          seed: "Apple Seed",
        },
      })
    ).toThrow("Not enough seeds");
  });

  it("plants a seed", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = 1;

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
        expansionIndex: 3,
        seed: "Apple Seed",
      },
    });

    const fruitPatches = state.expansions[3].fruitPatches;

    expect(state.inventory["Apple Seed"]).toEqual(seedAmount.minus(1));
    expect(fruitPatches).toBeDefined();
    expect((fruitPatches as Record<number, FruitPatch>)[patchIndex]).toEqual(
      expect.objectContaining({
        fruit: expect.objectContaining({
          name: "Apple",
          plantedAt: expect.any(Number),
          amount: 1,
        }),
      })
    );
  });

  it("contains harvestedAt information", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = 1;

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
        expansionIndex: 3,
        seed: "Apple Seed",
      },
    });

    const fruitPatches = state.expansions[3].fruitPatches;

    expect((fruitPatches as Record<number, FruitPatch>)[patchIndex]).toEqual(
      expect.objectContaining({
        fruit: expect.objectContaining({
          name: "Apple",
          plantedAt: expect.any(Number),
          amount: 1,
          harvestedAt: 0,
        }),
      })
    );
  });

  it("contains harvestsLeft information", () => {
    const seedAmount = new Decimal(5);

    const patchIndex = 1;

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
        expansionIndex: 3,
        seed: "Apple Seed",
      },
    });

    const fruitPatches = state.expansions[3].fruitPatches;

    expect((fruitPatches as Record<number, FruitPatch>)[patchIndex]).toEqual(
      expect.objectContaining({
        fruit: expect.objectContaining({
          name: "Apple",
          plantedAt: expect.any(Number),
          amount: 1,
          harvestedAt: 0,
          harvestsLeft: 1,
        }),
      })
    );
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
        index: 1,
        expansionIndex: 3,
        seed: "Apple Seed",
      },
    });
    expect(state.bumpkin?.activity?.["Apple Seed Planted"]).toEqual(amount);
  });
});
