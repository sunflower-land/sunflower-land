import Decimal from "decimal.js-light";
import { cancelBid } from "./cancelBid";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

describe("cancelBid", () => {
  const GAME_STATE: GameState = {
    ...INITIAL_FARM,
    balance: new Decimal(0),
    inventory: {
      Gold: new Decimal(0),
    },
    auctioneer: {
      bid: {
        auctionId: "test-drop-1",
        biddedAt: Date.now(),
        ingredients: {
          Gold: 5,
        },
        sfl: 10,
        tickets: 2,
        type: "collectible" as const,
        collectible: "Beta Bear",
      },
    },
  };

  it("throws if there is no active bid", () => {
    expect(() =>
      cancelBid({
        action: {
          type: "bid.cancelled",
          auctionId: "test-drop-1",
        },
        state: {
          ...INITIAL_FARM,
          auctioneer: {},
        },
      }),
    ).toThrow("No bid to cancel");
  });

  it("throws if auction id mismatches", () => {
    expect(() =>
      cancelBid({
        action: {
          type: "bid.cancelled",
          auctionId: "test-drop-2",
        },
        state: GAME_STATE,
      }),
    ).toThrow("Auction does not match active bid");
  });

  it("restores escrowed resources and clears the bid", () => {
    const state = cancelBid({
      action: {
        type: "bid.cancelled",
        auctionId: "test-drop-1",
      },
      state: GAME_STATE,
    });

    expect(state.balance).toEqual(new Decimal(10));
    expect(state.inventory.Gold).toEqual(new Decimal(5));
    expect(state.auctioneer.bid).toBeUndefined();
  });
});
