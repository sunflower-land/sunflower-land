import Decimal from "decimal.js-light";
import {
  CHICKEN_TIME_TO_EGG,
  INITIAL_FARM,
  MUTANT_CHICKEN_BOOST_AMOUNT,
} from "../lib/constants";
import { GameState, InventoryItemName } from "../types/game";
import { collectEggs } from "./collectEgg";
import { feedChicken } from "./feedChicken";

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

  it("can collect a Speed Chicken", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(2) },
      chickens: {
        0: {
          fedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
          multiplier: 1,
          reward: {
            items: [
              {
                name: "Speed Chicken" as InventoryItemName,
                amount: 1,
              },
            ],
          },
        },
      },
    };

    const newState = collectEggs({
      state,
      action: { type: "chicken.collectEgg", index: 0 },
    });

    expect(newState.inventory["Speed Chicken"]).toStrictEqual(new Decimal(1));
  });

  it("can collect a Fat Chicken", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(2) },
      chickens: {
        0: {
          fedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
          multiplier: 1,
          reward: {
            items: [
              {
                name: "Fat Chicken" as InventoryItemName,
                amount: 1,
              },
            ],
          },
        },
      },
    };

    const newState = collectEggs({
      state,
      action: { type: "chicken.collectEgg", index: 0 },
    });

    expect(newState.inventory["Fat Chicken"]).toStrictEqual(new Decimal(1));
  });

  it("can collect a Rich Chicken", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(2) },
      chickens: {
        0: {
          fedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
          multiplier: 1,
          reward: {
            items: [
              {
                name: "Rich Chicken" as InventoryItemName,
                amount: 1,
              },
            ],
          },
        },
      },
    };

    const newState = collectEggs({
      state,
      action: { type: "chicken.collectEgg", index: 0 },
    });

    expect(newState.inventory["Rich Chicken"]).toStrictEqual(new Decimal(1));
  });

  it("can collect an egg 10% sooner with a Speed Chicken", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(2),
        Wheat: new Decimal(1),
        ["Speed Chicken"]: new Decimal(1),
      },
    };

    // Boost applied at time the chicken is fed
    const stateAfterFeed = feedChicken({
      state,
      action: { type: "chicken.feed", index: 0 },
    });

    jest.advanceTimersByTime(
      CHICKEN_TIME_TO_EGG - CHICKEN_TIME_TO_EGG * MUTANT_CHICKEN_BOOST_AMOUNT
    );

    const stateAfterCollect = collectEggs({
      state: stateAfterFeed,
      action: { type: "chicken.collectEgg", index: 0 },
    });

    expect(stateAfterCollect.inventory.Egg).toStrictEqual(new Decimal(1));
  });

  it("doesn't stack speed boosts with multiple Speed Chickens", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(2),
        Wheat: new Decimal(1),
        ["Speed Chicken"]: new Decimal(5),
      },
    };

    // Boost applied at time the chicken is fed
    const stateAfterFeed = feedChicken({
      state,
      action: { type: "chicken.feed", index: 0 },
    });

    jest.advanceTimersByTime(
      CHICKEN_TIME_TO_EGG - CHICKEN_TIME_TO_EGG * MUTANT_CHICKEN_BOOST_AMOUNT
    );

    const stateAfterCollect = collectEggs({
      state: stateAfterFeed,
      action: { type: "chicken.collectEgg", index: 0 },
    });

    expect(stateAfterCollect.inventory.Egg).toStrictEqual(new Decimal(1));
  });

  it("can collect an 10% more with a Rich Chicken", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(2),
        Wheat: new Decimal(1),
        ["Rich Chicken"]: new Decimal(1),
      },
    };

    // Boost applied at time the chicken is fed
    const stateAfterFeed = feedChicken({
      state,
      action: { type: "chicken.feed", index: 0 },
    });

    jest.advanceTimersByTime(CHICKEN_TIME_TO_EGG);

    const stateAfterCollect = collectEggs({
      state: stateAfterFeed,
      action: { type: "chicken.collectEgg", index: 0 },
    });

    expect(stateAfterCollect.inventory.Egg).toStrictEqual(new Decimal(1.1));
  });

  it("doesn't stack rich boosts with multiple Rich Chickens", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(2),
        Wheat: new Decimal(1),
        ["Rich Chicken"]: new Decimal(5),
      },
    };

    // Boost applied at time the chicken is fed
    const stateAfterFeed = feedChicken({
      state,
      action: { type: "chicken.feed", index: 0 },
    });

    jest.advanceTimersByTime(CHICKEN_TIME_TO_EGG);

    const stateAfterCollect = collectEggs({
      state: stateAfterFeed,
      action: { type: "chicken.collectEgg", index: 0 },
    });

    expect(stateAfterCollect.inventory.Egg).toStrictEqual(new Decimal(1.1));
  });

  it("collects 2x eggs when Chicken Coop is in inventory", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(1), "Chicken Coop": new Decimal(1) },
      chickens: {
        0: {
          fedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
          multiplier: 2,
        },
      },
    };

    const newState = collectEggs({
      state,
      action: { type: "chicken.collectEgg", index: 0 },
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(2));
  });
});
