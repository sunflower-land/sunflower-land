import Decimal from "decimal.js-light";
import { refundBid } from "./refundBid";
import { TEST_FARM } from "features/game/lib/constants";

describe("refundBid", () => {
  it("ensures a bid was place", () => {
    expect(() =>
      refundBid({
        action: {
          type: "bid.refunded",
        },
        state: {
          ...TEST_FARM,
          auctioneer: {},
        },
      }),
    ).toThrow("No bid was placed");
  });

  it("refunds ingredients", () => {
    const state = refundBid({
      action: {
        type: "bid.refunded",
      },
      state: {
        ...TEST_FARM,
        auctioneer: {
          bid: {
            collectible: "Beta Bear",
            tickets: 3,
            biddedAt: Date.now(),
            ingredients: { Gold: 4 },
            sfl: 5,
            auctionId: "test-drop-1",
            type: "collectible",
          },
        },
      },
    });

    expect(state.inventory.Gold).toEqual(new Decimal(4));
  });
  it("refunds sfl", () => {
    const state = refundBid({
      action: {
        type: "bid.refunded",
      },
      state: {
        ...TEST_FARM,
        auctioneer: {
          bid: {
            collectible: "Beta Bear",
            tickets: 3,
            biddedAt: Date.now(),
            ingredients: { Gold: 4 },
            sfl: 5,
            auctionId: "test-drop-1",
            type: "collectible",
          },
        },
      },
    });

    expect(state.balance).toEqual(new Decimal(5));
  });

  it("removes bid", () => {
    const state = refundBid({
      action: {
        type: "bid.refunded",
      },
      state: {
        ...TEST_FARM,
        inventory: {},
        auctioneer: {
          bid: {
            collectible: "Beta Bear",
            tickets: 3,
            biddedAt: Date.now(),
            ingredients: { Gold: 4 },
            sfl: 5,
            auctionId: "test-drop-1",
            type: "collectible",
          },
        },
      },
    });

    expect(state.auctioneer.bid).toBeUndefined();
  });
});
