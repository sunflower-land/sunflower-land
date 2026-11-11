import Decimal from "decimal.js-light";
import type { Auction } from "features/game/lib/auctionMachine";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { getMaxAuctionTickets } from "./getMaxAuctionTickets";

const auction: Auction = {
  auctionId: "test",
  type: "wearable",
  wearable: "Autumn's Embrace",
  startAt: 0,
  endAt: 1,
  supply: 10,
  chapterLimit: 1,
  sfl: 0,
  ingredients: { "Shiny Feather": 1 },
};

const game: GameState = {
  ...INITIAL_FARM,
  balance: new Decimal(10.5),
  inventory: { "Shiny Feather": new Decimal(123.75), Wood: new Decimal(9) },
};

describe("getMaxAuctionTickets", () => {
  it("uses the available seasonal tickets, rounding down partial tickets", () => {
    expect(getMaxAuctionTickets(auction, game)).toBe(123);
  });

  it("accounts for the ingredient cost of each ticket", () => {
    expect(
      getMaxAuctionTickets(
        { ...auction, ingredients: { "Shiny Feather": 5 } },
        game,
      ),
    ).toBe(24);
  });

  it("uses the FLOWER balance and cost for FLOWER-only auctions", () => {
    expect(
      getMaxAuctionTickets({ ...auction, sfl: 2, ingredients: {} }, game),
    ).toBe(5);
  });

  it("uses the limiting resource for multi-ingredient auctions", () => {
    expect(
      getMaxAuctionTickets(
        { ...auction, ingredients: { "Shiny Feather": 2, Wood: 2 } },
        game,
      ),
    ).toBe(4);
  });

  it("includes FLOWER in mixed auction limits", () => {
    expect(getMaxAuctionTickets({ ...auction, sfl: 3 }, game)).toBe(3);
  });

  it("returns zero for missing or insufficient resources", () => {
    expect(getMaxAuctionTickets(auction, { ...game, inventory: {} })).toBe(0);
    expect(getMaxAuctionTickets({ ...auction, sfl: 20 }, game)).toBe(0);
  });

  it("ignores zero-cost ingredients and handles auctions without costs", () => {
    expect(
      getMaxAuctionTickets(
        { ...auction, ingredients: { "Shiny Feather": 1, Stone: 0 } },
        game,
      ),
    ).toBe(123);
    expect(getMaxAuctionTickets({ ...auction, ingredients: {} }, game)).toBe(0);
  });
});
