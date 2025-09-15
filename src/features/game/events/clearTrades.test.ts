import { INITIAL_FARM } from "../lib/constants";
import { clearTrades } from "./clearTrades";

describe("clearTrades", () => {
  it("clears listings that have a clearedAt field", () => {
    const state = clearTrades({
      state: {
        ...INITIAL_FARM,
        trades: {
          listings: {
            "1": {
              sfl: 10,
              createdAt: Date.now(),
              items: { "Rich Chicken": 1 },
              collection: "collectibles",
              tradeType: "instant",
              clearedAt: Date.now(),
            },
            "2": {
              sfl: 10,
              createdAt: Date.now(),
              items: { "Rich Chicken": 1 },
              collection: "collectibles",
              tradeType: "instant",
            },
          },
        },
      },
      action: { type: "trades.cleared" },
    });
    expect(state.trades.listings?.["1"]).toBeUndefined();
    expect(state.trades.listings?.["2"]).toBeDefined();
  });

  it("clears offers that have a clearedAt field", () => {
    const state = clearTrades({
      action: { type: "trades.cleared" },
      state: {
        ...INITIAL_FARM,
        trades: {
          offers: {
            "1": {
              items: { "Rich Chicken": 1 },
              sfl: 10,
              collection: "collectibles",
              createdAt: Date.now(),
              tradeType: "instant",
              clearedAt: Date.now(),
            },
            "2": {
              items: { "Rich Chicken": 1 },
              sfl: 10,
              collection: "collectibles",
              createdAt: Date.now(),
              tradeType: "instant",
            },
          },
        },
      },
    });

    expect(state.trades.offers?.["1"]).toBeUndefined();
    expect(state.trades.offers?.["2"]).toBeDefined();
  });
});
