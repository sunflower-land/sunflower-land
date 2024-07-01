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
  return Array.from(Array(numOfChickens).keys()).reduce(
    (obj, curr) => {
      obj[curr] = {
        coordinates: {
          x: curr,
          y: curr,
        },
        multiplier: 1,
      };

      return obj;
    },
    {} as Record<number, Chicken>,
  );
};

describe("removeChicken", () => {
  it("does not remove non-existent chicken", () => {
    expect(() =>
      removeChicken({
        state: {
          ...GAME_STATE,
          collectibles: {},
          chickens: makeChickensStateObject(10),
        },
        action: {
          type: "chicken.removed",
          id: "11",
        },
      }),
    ).toThrow(REMOVE_CHICKEN_ERRORS.INVALID_CHICKEN);
  });

  it("does not remove chicken when egg is brewing", () => {
    const state = {
      ...GAME_STATE,
      collectibles: {},
      chickens: makeChickensStateObject(1),
    };
    state.chickens[0].fedAt = 1;
    expect(() =>
      removeChicken({
        state: state,
        action: {
          type: "chicken.removed",
          id: "0",
        },
      }),
    ).toThrow(REMOVE_CHICKEN_ERRORS.CHICKEN_BREWING_EGG);
  });

  it("removes a chicken", () => {
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
        id: "3",
      },
    });

    expect(gameState.chickens["0"]).toEqual({
      coordinates: { x: 0, y: 0 },
      multiplier: 1,
    });
    expect(gameState.chickens["1"]).toEqual({
      coordinates: { x: 1, y: 1 },
      multiplier: 1,
    });
    expect(gameState.chickens["2"]).toEqual({
      coordinates: { x: 2, y: 2 },
      multiplier: 1,
    });
    expect(gameState.chickens["3"]).toBeUndefined();
    expect(gameState.chickens["4"]).toEqual({
      coordinates: { x: 4, y: 4 },
      multiplier: 1,
    });
  });
});
