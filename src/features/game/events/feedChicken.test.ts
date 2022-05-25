import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../lib/constants";

import { GameState } from "../types/game";
import { feedChicken, FEEDING_TIME } from "./feedChicken";

const GAME_STATE: GameState = INITIAL_FARM;

describe("feed chickens", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if chicken does not exist", () => {
    expect(() =>
      feedChicken({
        state: GAME_STATE,
        action: { type: "chicken.feed", index: 3 },
      })
    ).toThrow("This chicken does not exist");
  });

  it("throws an error if chicken is not hungry", () => {
    expect(() =>
      feedChicken({
        state: {
          ...GAME_STATE,
          inventory: { Chicken: new Decimal(1) },
          chickens: {
            0: {
              fedAt: Date.now() - 1000,
              multiplier: 0,
            },
          },
        },
        action: { type: "chicken.feed", index: 0 },
      })
    ).toThrow("This chicken is not hungry");
  });

  it("throws an error if the user has no wheat", () => {
    expect(() =>
      feedChicken({
        state: {
          ...GAME_STATE,
          inventory: { Chicken: new Decimal(1), Wheat: new Decimal(0.1) },
          chickens: {
            0: {
              fedAt: 0,
              multiplier: 0,
            },
          },
        },
        action: { type: "chicken.feed", index: 0 },
      })
    ).toThrow("No wheat to feed chickens");
  });

  it("throws and error if the user has more than 10 chickens", () => {
    expect(() =>
      feedChicken({
        state: {
          ...GAME_STATE,
          inventory: { Chicken: new Decimal(11), Wheat: new Decimal(1) },
        },

        action: { type: "chicken.feed", index: 10 },
      })
    ).toThrow("Cannot have more than 10 chickens");
  });

  it("feeds a chicken", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(1), Wheat: new Decimal(1) },
      chickens: {
        0: {
          fedAt: 0,
          multiplier: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.feed", index: 0 },
    });

    const newChickens = newState.chickens || {};

    expect(newChickens[0].fedAt).toBeGreaterThan(0);
    expect(newState.inventory.Wheat).toStrictEqual(new Decimal(0));
  });

  it("feeds a chicken multiple times", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(1), Wheat: new Decimal(2) },
      chickens: {
        0: {
          fedAt: 0,
          multiplier: 0,
        },
      },
    };

    const firstFeed = feedChicken({
      state,
      action: { type: "chicken.feed", index: 0 },
    });

    jest.advanceTimersByTime(FEEDING_TIME);

    const secondFeed = feedChicken({
      state: firstFeed,
      action: { type: "chicken.feed", index: 0 },
    });

    const newChickens = secondFeed.chickens || {};

    expect(newChickens[0].fedAt).toBeGreaterThan(0);
    expect(secondFeed.inventory.Wheat).toStrictEqual(new Decimal(0));
  });
});
