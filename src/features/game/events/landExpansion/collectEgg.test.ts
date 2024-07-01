import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { GameState, InventoryItemName } from "../../types/game";
import { collectEggs } from "./collectEgg";

const GAME_STATE: GameState = TEST_FARM;

describe("collect eggs", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  const dateNow = Date.now();

  it("throws an error if chicken does not exist", () => {
    expect(() =>
      collectEggs({
        state: GAME_STATE,
        action: { type: "chicken.collectEgg", id: "3" },
      }),
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
              fedAt: dateNow,
              multiplier: 1,
            },
          },
        },
        action: { type: "chicken.collectEgg", id: "0" },
      }),
    ).toThrow("This chicken hasn't layed an egg");
  });

  it("can collect an egg", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(1) },
      chickens: {
        0: {
          fedAt: dateNow - 3 * 24 * 60 * 60 * 1000,
          multiplier: 1,
        },
      },
    };

    const newState = collectEggs({
      state,
      action: { type: "chicken.collectEgg", id: "0" },
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(1));
    expect(newState.chickens?.[0]).toEqual({
      multiplier: 1,
    });
  });

  it("can collect an egg multiple times", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(2) },
      chickens: {
        0: {
          fedAt: dateNow - 3 * 24 * 60 * 60 * 1000,
          multiplier: 1,
        },
        1: {
          fedAt: dateNow - 3 * 24 * 60 * 60 * 1000,
          multiplier: 1,
        },
      },
    };

    const stateAfterFirstEggCollected = collectEggs({
      state,
      action: { type: "chicken.collectEgg", id: "0" },
    });

    const stateAfterSecondEggCollected = collectEggs({
      state: stateAfterFirstEggCollected,
      action: { type: "chicken.collectEgg", id: "1" },
    });

    expect(stateAfterSecondEggCollected.inventory.Egg).toEqual(new Decimal(2));
    expect(stateAfterSecondEggCollected.chickens?.[0]).toEqual({
      multiplier: 1,
    });
    expect(stateAfterSecondEggCollected.chickens?.[1]).toEqual({
      multiplier: 1,
    });
  });

  it("can collect a Speed Chicken", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(2) },
      chickens: {
        0: {
          fedAt: dateNow - 3 * 24 * 60 * 60 * 1000,
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
      action: { type: "chicken.collectEgg", id: "0" },
    });

    expect(newState.inventory["Speed Chicken"]).toStrictEqual(new Decimal(1));
  });

  it("can collect a Fat Chicken", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(2) },
      chickens: {
        0: {
          fedAt: dateNow - 3 * 24 * 60 * 60 * 1000,
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
      action: { type: "chicken.collectEgg", id: "0" },
    });

    expect(newState.inventory["Fat Chicken"]).toStrictEqual(new Decimal(1));
  });

  it("can collect a Rich Chicken", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(2) },
      chickens: {
        0: {
          fedAt: dateNow - 3 * 24 * 60 * 60 * 1000,
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
      action: { type: "chicken.collectEgg", id: "0" },
    });

    expect(newState.inventory["Rich Chicken"]).toStrictEqual(new Decimal(1));
  });
  it("increments the Egg Collected activity ", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(1) },
      chickens: {
        0: {
          fedAt: dateNow - 3 * 24 * 60 * 60 * 1000,
          multiplier: 1,
        },
      },
      skills: {
        farming: new Decimal(0),
        gathering: new Decimal(0),
      },
    };

    const newState = collectEggs({
      state,
      action: { type: "chicken.collectEgg", id: "0" },
      createdAt: dateNow,
    });

    expect(newState.bumpkin?.activity?.["Egg Collected"]).toEqual(1);
  });
});
