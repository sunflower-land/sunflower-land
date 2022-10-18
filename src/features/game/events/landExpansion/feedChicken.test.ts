import Decimal from "decimal.js-light";
import {
  CHICKEN_TIME_TO_EGG,
  INITIAL_BUMPKIN,
  INITIAL_FARM,
} from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { feedChicken } from "./feedChicken";

const GAME_STATE: GameState = INITIAL_FARM;

describe("feed chickens", () => {
  const dateNow = Date.now();
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if chicken does not exist", () => {
    expect(() =>
      feedChicken({
        state: GAME_STATE,
        action: { type: "chicken.fed", index: 3 },
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
              fedAt: dateNow,
              multiplier: 0,
            },
          },
        },
        action: { type: "chicken.fed", index: 0 },
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
        action: { type: "chicken.fed", index: 0 },
      })
    ).toThrow("No wheat to feed chickens");
  });

  it("throws and error if the user has more than 10 chickens without coop", () => {
    expect(() =>
      feedChicken({
        state: {
          ...GAME_STATE,
          inventory: { Chicken: new Decimal(11), Wheat: new Decimal(1) },
        },

        action: { type: "chicken.fed", index: 11 },
      })
    ).toThrow("Cannot have more than 10 chickens");
  });

  it("throws and error if the user has more than 15 chickens with coop", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        "Chicken Coop": new Decimal(1),
        Chicken: new Decimal(16),
        Wheat: new Decimal(1),
      },
      collectibles: {
        "Chicken Coop": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 1, y: 1 },
            // ready at < now
            readyAt: dateNow - 5 * 60 * 1000,
          },
        ],
      },
    };
    expect(() =>
      feedChicken({
        state: state,
        action: { type: "chicken.fed", index: 16 },
      })
    ).toThrow("Cannot have more than 15 chickens");
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
      action: { type: "chicken.fed", index: 0 },
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
      action: { type: "chicken.fed", index: 0 },
    });

    jest.advanceTimersByTime(CHICKEN_TIME_TO_EGG);

    const secondFeed = feedChicken({
      state: firstFeed,
      action: { type: "chicken.fed", index: 0 },
    });

    const newChickens = secondFeed.chickens || {};

    expect(newChickens[0].fedAt).toBeGreaterThan(0);
    expect(secondFeed.inventory.Wheat).toStrictEqual(new Decimal(0));
  });

  it("takes 10% less wheat to feed a chicken if a user has a single Fat Chicken placed and ready", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(1),
        ["Fat Chicken"]: new Decimal(1),
      },
      collectibles: {
        "Fat Chicken": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 1, y: 1 },
            // ready at < now
            readyAt: dateNow - 5 * 60 * 1000,
          },
        ],
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", index: 0 },
    });

    expect(newState.inventory.Wheat).toEqual(new Decimal(0.1));
  });

  it("does not stack Fat Chicken boost when a user has more than one", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(1),
        ["Fat Chicken"]: new Decimal(5),
      },
      collectibles: {
        "Fat Chicken": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 1, y: 1 },
            // ready at < now
            readyAt: dateNow - 5 * 60 * 1000,
          },
        ],
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", index: 0 },
    });

    expect(newState.inventory.Wheat).toEqual(new Decimal(0.1));
  });

  it("increases max chickens to 15 when Chicken Coop is placed and ready", () => {
    const state = {
      ...GAME_STATE,
      bumpkin: INITIAL_BUMPKIN,
      inventory: {
        Chicken: new Decimal(15),
        "Chicken Coop": new Decimal(1),
        Wheat: new Decimal(1),
      },
      collectibles: {
        "Chicken Coop": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 1, y: 1 },
            // ready at < now
            readyAt: dateNow - 5 * 60 * 1000,
          },
        ],
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", index: 14 },
      createdAt: dateNow,
    });

    expect(newState.chickens[14]).toBeTruthy();
  });
});
