import "lib/__mocks__/configMock";

import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { buyWearable } from "./buyWearable";
import {
  STYLIST_WEARABLES,
  StylistWearable,
} from "features/game/types/stylist";

const GAME_STATE: GameState = TEST_FARM;

describe("buyWearable", () => {
  it("throws an error if item is not a wearable to be bought", () => {
    expect(() =>
      buyWearable({
        state: GAME_STATE,
        action: {
          type: "wearable.bought",
          name: "Devil Wings",
        },
      })
    ).toThrow("This item is not available");
  });

  it("does not craft decoration if there is not enough funds", () => {
    expect(() =>
      buyWearable({
        state: {
          ...GAME_STATE,
          balance: new Decimal(0),
        },
        action: {
          type: "wearable.bought",
          name: "Red Farmer Shirt",
        },
      })
    ).toThrow("Insufficient coins");
  });

  it("does not craft wearable too early", () => {
    expect(() =>
      buyWearable({
        state: {
          ...GAME_STATE,
          balance: new Decimal(400),
        },
        action: {
          type: "wearable.bought",
          name: "Fresh Catch Vest",
        },
        createdAt: new Date("2023-07-31").getTime(),
      })
    ).toThrow("This item is not available");
  });

  it("does not craft wearable too late", () => {
    expect(() =>
      buyWearable({
        state: {
          ...GAME_STATE,
          balance: new Decimal(400),
        },
        action: {
          type: "wearable.bought",
          name: "Fresh Catch Vest",
        },
        createdAt: new Date("2024-09-02").getTime(),
      })
    ).toThrow("This item is not available");
  });

  it("does not craft a party hat", () => {
    expect(() =>
      buyWearable({
        state: {
          ...GAME_STATE,
          balance: new Decimal(400),
          createdAt: new Date().getTime() - 364 * 24 * 60 * 60 * 1000,
        },
        action: {
          type: "wearable.bought",
          name: "Birthday Hat",
        },
        createdAt: new Date("2023-07-31").getTime(),
      })
    ).toThrow("Not available");
  });

  it("crafts a party hat", () => {
    const state = buyWearable({
      state: {
        ...GAME_STATE,
        coins: 10000,
        createdAt: new Date().getTime() - 366 * 24 * 60 * 60 * 1000,
      },
      action: {
        type: "wearable.bought",
        name: "Birthday Hat",
      },
      createdAt: new Date("2023-07-31").getTime(),
    });

    expect(state.wardrobe["Birthday Hat"]).toEqual(1);
  });

  // it("does not craft decoration if requirements are not met", () => {
  //   expect(() =>
  //     buyWearable({
  //       state: {
  //         ...GAME_STATE,
  //         balance: new Decimal(100),
  //         inventory: {},
  //       },
  //       action: {
  //         type: "wearable.bought",
  //         name: "Red Farmer Shirt",
  //       },
  //     })
  //   ).toThrow("Insufficient ingredient: Sunflower");
  // });

  it("burns the coins on purchase", () => {
    const coins = 10000;
    const state = buyWearable({
      state: {
        ...GAME_STATE,
        coins,
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        type: "wearable.bought",
        name: "Red Farmer Shirt",
      },
    });

    const shirt = STYLIST_WEARABLES["Red Farmer Shirt"] as StylistWearable;

    expect(state.coins).toEqual(coins - shirt.coins ?? 0);
  });

  it("mints the newly bought decoration", () => {
    const coins = 10000;
    const item = "Red Farmer Shirt";
    const state = buyWearable({
      state: {
        ...GAME_STATE,
        coins,
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        name: item,
        type: "wearable.bought",
      },
    });

    const oldAmount = GAME_STATE.wardrobe[item] ?? 0;

    expect(state.wardrobe[item]).toEqual(oldAmount + 1);
  });

  it("throws an error if the player doesn't have a bumpkin", async () => {
    expect(() =>
      buyWearable({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        action: {
          type: "wearable.bought",
          name: "Red Farmer Shirt",
        },
      })
    ).toThrow("Bumpkin not found");
  });

  it("increments the coins spent activity", () => {
    const state = buyWearable({
      state: {
        ...GAME_STATE,
        coins: 10000,
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        type: "wearable.bought",
        name: "Red Farmer Shirt",
      },
    });

    const shirt = STYLIST_WEARABLES["Red Farmer Shirt"] as StylistWearable;

    expect(state.bumpkin?.activity?.["Coins Spent"]).toEqual(shirt.coins ?? 0);
  });
});
