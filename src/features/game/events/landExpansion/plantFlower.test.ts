import Decimal from "decimal.js-light";
import { plantFlower } from "./plantFlower";
import { GameState } from "features/game/types/game";
import { TEST_FARM } from "features/game/lib/constants";
import { INITIAL_BUMPKIN } from "features/game/lib/bumpkinData";
import { FLOWER_CROSS_BREED_AMOUNTS } from "features/game/types/flowers";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  flowers: {
    discovered: {},
    flowerBeds: {
      0: {
        createdAt: Date.now(),
        x: -2,
        y: 0,
        height: 1,
        width: 3,
        flower: {
          name: "Red Pansy",
          amount: 1,
          plantedAt: 123,
        },
      },
      1: {
        createdAt: Date.now(),
        x: -2,
        y: 0,
        height: 1,
        width: 3,
      },
    },
  },
};

describe("plantFlower", () => {
  const dateNow = Date.now();

  it("throws an error if the player doesn't have a bumpkin", () => {
    expect(() =>
      plantFlower({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "0",
          seed: "Sunpetal Seed",
          crossbreed: "Sunflower",
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

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
      })
    ).toThrow("Flower bed does not exist");
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
      })
    ).toThrow("Flower is already planted");
  });

  it("does not plant an invalid seed", () => {
    expect(() =>
      plantFlower({
        state: { ...GAME_STATE, bumpkin: INITIAL_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "1",
          seed: "Sunflower Seed" as "Sunpetal Seed",
          crossbreed: "Sunflower",
        },
      })
    ).toThrow("Not a flower seed");
  });

  it("does not plant if user does not have seeds", () => {
    expect(() =>
      plantFlower({
        state: { ...GAME_STATE, bumpkin: INITIAL_BUMPKIN },
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "1",
          seed: "Sunpetal Seed",
          crossbreed: "Sunflower",
        },
      })
    ).toThrow("Not enough seeds");
  });

  it("does not plant if user does not have the crossbreed", () => {
    expect(() =>
      plantFlower({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: { "Sunpetal Seed": new Decimal(1) },
        },
        createdAt: dateNow,
        action: {
          type: "flower.planted",
          id: "1",
          seed: "Sunpetal Seed",
          crossbreed: "Sunflower",
        },
      })
    ).toThrow("Not enough crossbreed");
  });

  it("plants a seed", () => {
    const seedAmount = new Decimal(5);

    const bedIndex = "1";

    const state = plantFlower({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
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
          amount: 1,
        }),
      })
    );
  });

  it("increments the flower seed planted activity", () => {
    const amount = 1;
    const state = plantFlower({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
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
    expect(state.bumpkin?.activity?.["Sunpetal Seed Planted"]).toEqual(amount);
  });

  it("deducts the seed from the inventory", () => {
    const initialState = {
      ...GAME_STATE,
      bumpkin: INITIAL_BUMPKIN,
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
      bumpkin: INITIAL_BUMPKIN,
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
      inventoryBefore?.sub(FLOWER_CROSS_BREED_AMOUNTS["Sunflower"])
    );
  });
});
