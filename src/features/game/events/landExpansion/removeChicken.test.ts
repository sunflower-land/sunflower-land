import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { Chicken, GameState } from "features/game/types/game";
import { removeChicken, REMOVE_CHICKEN_ERRORS } from "./removeChicken";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
  },
};

const makeChickensStateObject = (numOfChickens: number) => {
  return Array.from(Array(numOfChickens).keys()).reduce((obj, curr) => {
    obj[curr] = {
      coordinates: {
        x: curr,
        y: curr,
      },
      multiplier: 1,
    };

    return obj;
  }, {} as Record<number, Chicken>);
};

describe("removeChicken", () => {
  it("does not remove non-existent chicken ", () => {
    expect(() =>
      removeChicken({
        state: {
          ...GAME_STATE,
          collectibles: {},
          chickens: makeChickensStateObject(10),
        },
        action: {
          type: "chicken.removed",
          chickenIndex: 11,
        },
      })
    ).toThrow(REMOVE_CHICKEN_ERRORS.INVALID_CHICKEN);
  });

  it("does not remove if not enough Rusty Shovel in inventory", () => {
    expect(() =>
      removeChicken({
        state: {
          ...GAME_STATE,
          inventory: {
            "Rusty Shovel": new Decimal(0),
          },
          chickens: makeChickensStateObject(10),
        },
        action: {
          type: "chicken.removed",
          chickenIndex: 5,
        },
      })
    ).toThrow(REMOVE_CHICKEN_ERRORS.NO_RUSTY_SHOVEL_AVAILABLE);
  });

  it("removes a chicken: clone the last chicken index to removed index and deletes the last index", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        "Rusty Shovel": new Decimal(1),
      },
      chickens: makeChickensStateObject(5),
    };

    expect(state.chickens[4]).toEqual({
      coordinates: { x: 4, y: 4 },
      multiplier: 1,
    });

    const gameState = removeChicken({
      state,
      action: {
        type: "chicken.removed",
        chickenIndex: 3,
      },
    });

    expect(gameState.chickens[0]).toEqual({
      coordinates: { x: 0, y: 0 },
      multiplier: 1,
    });
    expect(gameState.chickens[1]).toEqual({
      coordinates: { x: 1, y: 1 },
      multiplier: 1,
    });
    expect(gameState.chickens[2]).toEqual({
      coordinates: { x: 2, y: 2 },
      multiplier: 1,
    });
    expect(gameState.chickens[3]).toEqual({
      coordinates: { x: 4, y: 4 },
      multiplier: 1,
    });
    expect(gameState.chickens[4]).toBeUndefined();
  });

  it("uses one Rusty Shovel per chicken removed", () => {
    const gameState = removeChicken({
      state: {
        ...GAME_STATE,
        inventory: {
          "Rusty Shovel": new Decimal(2),
        },
        chickens: makeChickensStateObject(5),
      },
      action: {
        type: "chicken.removed",
        chickenIndex: 4,
      },
    });

    console.log(gameState.chickens[-1]);

    expect(gameState.inventory["Rusty Shovel"]).toEqual(new Decimal(1));
  });
});
