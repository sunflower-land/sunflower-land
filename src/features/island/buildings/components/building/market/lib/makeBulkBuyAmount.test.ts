import Decimal from "decimal.js-light";
import {
  makeBulkBuySeeds,
  makeBulkBuyTools,
  MAX_BULK_BUY_AMOUNT,
} from "./makeBulkBuyAmount";
import { GameState } from "features/game/types/game";
import { INVENTORY_LIMIT, TEST_FARM } from "features/game/lib/constants";

const state: GameState = { ...TEST_FARM };

describe("makeBulkBuyTools", () => {
  it("should return the the MAX if enough stock", () => {
    expect(makeBulkBuyTools(new Decimal(200))).toBe(10);
    expect(makeBulkBuyTools(new Decimal(11))).toBe(10);
  });

  it("should return remaining stock if less than MAX bulk buy amount", () => {
    expect(makeBulkBuyTools(new Decimal(MAX_BULK_BUY_AMOUNT - 1))).toBe(9);
    expect(makeBulkBuyTools(new Decimal(MAX_BULK_BUY_AMOUNT - 4))).toBe(6);
  });

  it("should round down if stock some how not integer", () => {
    expect(makeBulkBuyTools(new Decimal(MAX_BULK_BUY_AMOUNT - 0.3))).toBe(
      MAX_BULK_BUY_AMOUNT - 1
    );
    expect(makeBulkBuyTools(new Decimal(MAX_BULK_BUY_AMOUNT - 1.5))).toBe(
      MAX_BULK_BUY_AMOUNT - 2
    );
  });
});

describe("makeBulkBuySeeds", () => {
  // Added 3 tests each to make sure that the function works
  it("should return all the stock if sum of stock and inventory amount doesn't exceed inventory limit", () => {
    expect(
      makeBulkBuySeeds(
        new Decimal(state.stock["Sunflower Seed"] ?? new Decimal(0)),
        new Decimal(INVENTORY_LIMIT(state)["Sunflower Seed"] ?? new Decimal(0))
      )
    ).toBe(400);
    expect(
      makeBulkBuySeeds(
        new Decimal(state.stock["Potato Seed"] ?? new Decimal(0)),
        new Decimal(INVENTORY_LIMIT(state)["Potato Seed"] ?? new Decimal(0))
      )
    ).toBe(200);
    expect(
      makeBulkBuySeeds(
        new Decimal(state.stock["Pumpkin Seed"] ?? new Decimal(0)),
        new Decimal(INVENTORY_LIMIT(state)["Pumpkin Seed"] ?? new Decimal(0))
      )
    ).toBe(150);
  });
  it("should return the difference between inventory limit and inventory amount if sum of stock and inventory amount exceeds inventory limit", () => {
    expect(
      makeBulkBuySeeds(
        new Decimal(state.stock["Sunflower Seed"] ?? new Decimal(0)),
        new Decimal(
          INVENTORY_LIMIT(state)["Sunflower Seed"] ?? new Decimal(0)
        ).minus(772)
      )
    ).toBe(228);
    expect(
      makeBulkBuySeeds(
        new Decimal(state.stock["Potato Seed"] ?? new Decimal(0)),
        new Decimal(
          INVENTORY_LIMIT(state)["Potato Seed"] ?? new Decimal(0)
        ).minus(416)
      )
    ).toBe(84);
    expect(
      makeBulkBuySeeds(
        new Decimal(state.stock["Pumpkin Seed"] ?? new Decimal(0)),
        new Decimal(
          INVENTORY_LIMIT(state)["Pumpkin Seed"] ?? new Decimal(0)
        ).minus(255)
      )
    ).toBe(145);
  });
  it("should return the remaining stock if stock less than the difference between inventory limit and inventory amount", () => {
    expect(
      makeBulkBuySeeds(
        new Decimal(100),
        new Decimal(
          INVENTORY_LIMIT(state)["Sunflower Seed"] ?? new Decimal(0)
        ).minus(772)
      )
    ).toBe(100);
  });
});
