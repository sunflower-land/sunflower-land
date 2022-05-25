import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../lib/constants";
import { GameState } from "../types/game";
import { collectEggs } from "./collectEgg";

const GAME_STATE: GameState = INITIAL_FARM;

describe("collect eggs", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if chicken does not exist", () => {
    expect(() =>
      collectEggs({
        state: GAME_STATE,
        action: { type: "chicken.collectEgg", index: 3 },
      })
    ).toThrow("This chicken does not exist");
  });

  it("throws an error if chicken hasn't layed egg", () => {
    expect(() =>
      collectEggs({
        state: {
          ...GAME_STATE,
          inventory: { Chicken: new Decimal(1) },
          chickens: {
            0: {
              fedAt: Date.now(),
              multiplier: 1,
            },
          },
        },
        action: { type: "chicken.collectEgg", index: 0 },
      })
    ).toThrow("This chicken hasn't layed an egg");
  });

  it("can collect an egg", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(1) },
      chickens: {
        0: {
          fedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
          multiplier: 1,
        },
      },
    };

    const newState = collectEggs({
      state,
      action: { type: "chicken.collectEgg", index: 0 },
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(1));
    expect(newState.chickens?.[0]).toBeUndefined();
  });

  it("can collect an egg multiple times", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(2) },
      chickens: {
        0: {
          fedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
          multiplier: 1,
        },
        1: {
          fedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
          multiplier: 1,
        },
      },
    };

    const stateAfterFirstEggCollected = collectEggs({
      state,
      action: { type: "chicken.collectEgg", index: 0 },
    });

    const stateAfterSecondEggCollected = collectEggs({
      state: stateAfterFirstEggCollected,
      action: { type: "chicken.collectEgg", index: 1 },
    });

    expect(stateAfterSecondEggCollected.inventory.Egg).toEqual(new Decimal(2));
    expect(stateAfterSecondEggCollected.chickens?.[0]).toBeUndefined();
    expect(stateAfterSecondEggCollected.chickens?.[1]).toBeUndefined();
  });
});
