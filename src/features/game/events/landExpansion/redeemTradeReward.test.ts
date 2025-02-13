import Decimal from "decimal.js-light";
import {
  INITIAL_FARM,
  INVENTORY_LIMIT,
  INITIAL_STOCK,
} from "features/game/lib/constants";
import { redeemTradeReward, TRADE_REWARDS } from "./redeemTradeReward";

describe("redeemTradeRewards", () => {
  it("throws an error if player does not have enough trade points", () => {
    expect(() =>
      redeemTradeReward({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            "Trade Point": new Decimal(0),
          },
        },
        action: {
          type: "reward.redeemed",
          item: "Treasure Key",
        },
      }),
    ).toThrow("You do not have enough Trade Points!");
  });

  it("throws an error if player is trying to buy a pack and hits inventory limit", () => {
    expect(() =>
      redeemTradeReward({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            "Sunflower Seed": INVENTORY_LIMIT(INITIAL_FARM)["Sunflower Seed"],
            "Trade Point": new Decimal(3000),
          },
        },
        action: {
          item: "Seed Pack",
          type: "reward.redeemed",
        },
      }),
    ).toThrow("Inventory Limit Reached!");
  });

  it("does not throw inventory error if player is not buying seed pack", () => {
    expect(() => {
      redeemTradeReward({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            "Sunflower Seed": INVENTORY_LIMIT(INITIAL_FARM)["Sunflower Seed"],
            "Trade Point": new Decimal(500),
          },
        },
        action: {
          type: "reward.redeemed",
          item: "Tool Pack",
        },
      });
    }).not.toThrow("Inventory Limit Reached!");
  });

  it("buys an key", () => {
    const state = redeemTradeReward({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Trade Point": new Decimal(
            TRADE_REWARDS["Treasure Key"].ingredients["Trade Point"],
          ),
        },
      },
      action: {
        type: "reward.redeemed",
        item: "Treasure Key",
      },
    });

    expect(state.inventory["Treasure Key"]).toEqual(new Decimal(1));
    expect(state.inventory["Trade Point"]).toEqual(new Decimal(0));
  });

  it.only("buys a Trade Rewards Pack", () => {
    const state = redeemTradeReward({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Sunflower Seed": new Decimal(0),
          "Trade Point": new Decimal(1500),
        },
      },
      action: {
        item: "Seed Pack",
        type: "reward.redeemed",
      },
    });

    expect(state.inventory["Sunflower Seed"]).toEqual(
      new Decimal(INITIAL_STOCK(INITIAL_FARM)["Sunflower Seed"]),
    );
    expect(state.inventory["Trade Point"]).toEqual(new Decimal(0));
  });
});
