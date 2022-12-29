import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { removeFruitTree } from "./fruitTreeRemoved";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  inventory: {
    Wood: new Decimal(1),
  },
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

describe("fruitHarvested", () => {
  it("throws an error if the player doesn't have a bumpkin", () => {
    expect(() =>
      removeFruitTree({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        action: {
          type: "fruitTree.removed",
          expansionIndex: 3,
          index: 0,
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("does not chop fruit tree on a non existent expansion", () => {
    expect(() =>
      removeFruitTree({
        state: { ...GAME_STATE, expansions: [] },
        action: {
          type: "fruitTree.removed",
          expansionIndex: 3,
          index: 0,
        },
      })
    ).toThrow("Expansion does not exist");
  });

  it("does not chop on a an expansion with no fruit patches", () => {
    expect(() =>
      removeFruitTree({
        state: GAME_STATE,
        action: {
          type: "fruitTree.removed",
          index: 0,
          expansionIndex: 0,
        },
      })
    ).toThrow("Expansion does not have any fruit patches");
  });

  it("does not chop on non-existent fruit patch", () => {
    expect(() =>
      removeFruitTree({
        state: GAME_STATE,
        action: {
          type: "fruitTree.removed",
          index: -1,
          expansionIndex: 3,
        },
      })
    ).toThrow("Fruit patch does not exist");
  });

  it("does not chop empty air", () => {
    expect(() =>
      removeFruitTree({
        state: GAME_STATE,
        action: {
          type: "fruitTree.removed",
          index: 1,
          expansionIndex: 3,
        },
      })
    ).toThrow("Nothing was planted");
  });

  it("does not chop if harvest is available", () => {
    expect(() =>
      removeFruitTree({
        state: {
          ...GAME_STATE,
          expansions: [
            {
              fruitPatches: {
                0: {
                  fruit: {
                    name: "Apple",
                    amount: 1,
                    plantedAt: 123,
                    harvestedAt: 0,
                    harvestsLeft: 3,
                  },
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
        },
        action: {
          type: "fruitTree.removed",
          index: 0,
          expansionIndex: 0,
        },
      })
    ).toThrow("Fruit is still available");
  });

  it("chops the dead tree", () => {
    const state = removeFruitTree({
      state: GAME_STATE,
      action: {
        type: "fruitTree.removed",
        index: 0,
        expansionIndex: 3,
      },
    });

    const fruitAfterChop = state.expansions[3].fruitPatches?.[1].fruit;
    expect(fruitAfterChop).toBeUndefined();

    expect(state.inventory.Wood).toStrictEqual(new Decimal(2));
  });
});
