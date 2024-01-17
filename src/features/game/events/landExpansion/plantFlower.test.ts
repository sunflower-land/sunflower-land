import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN } from "features/game/lib/bumpkinData";
import { TEST_FARM } from "features/game/lib/constants";
import { FlowerBed, GameState } from "features/game/types/game";
import { plantFlower } from "./plantFlower";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  flowers: {
    0: {
      createdAt: Date.now(),
      x: -2,
      y: 0,
      height: 1,
      width: 3,
      flower: {
        name: "Flower 1",
        amount: 1,
        plantedAt: 123,
      },
    },
    1: {
      createdAt: Date.now(),
      x: -2,
      y: 0,
      height: 1,
      width: 1,
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
        },
      })
    ).toThrow("Not enough seeds");
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
        },
      },
      createdAt: dateNow,
      action: {
        type: "flower.planted",
        id: bedIndex,

        seed: "Sunpetal Seed",
      },
    });

    const flowers = state.flowers;

    expect(state.inventory["Sunpetal Seed"]).toEqual(seedAmount.minus(1));
    expect((flowers as Record<number, FlowerBed>)[bedIndex]).toEqual(
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
        },
      },
      createdAt: dateNow,
      action: {
        type: "flower.planted",
        id: "1",
        seed: "Sunpetal Seed",
      },
    });
    expect(state.bumpkin?.activity?.["Sunpetal Seed Planted"]).toEqual(amount);
  });
});
