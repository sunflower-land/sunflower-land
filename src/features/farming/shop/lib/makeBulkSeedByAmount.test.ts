import Decimal from "decimal.js-light";
import {
  makeBulkSeedBuyAmount,
  MAX_BULK_SEED_BUY_AMOUNT,
} from "./makeBulkSeedBuyAmount";

describe("makeBulkSeedBuyAmount", () => {
  it("should return the the MAX if enough stock", () => {
    expect(makeBulkSeedBuyAmount(new Decimal(200))).toBe(
      MAX_BULK_SEED_BUY_AMOUNT
    );
    expect(makeBulkSeedBuyAmount(new Decimal(11))).toBe(
      MAX_BULK_SEED_BUY_AMOUNT
    );
  });

  it("should return remaining stock if less than MAX bulk buy amount", () => {
    expect(
      makeBulkSeedBuyAmount(new Decimal(MAX_BULK_SEED_BUY_AMOUNT - 1))
    ).toBe(MAX_BULK_SEED_BUY_AMOUNT - 1);
    expect(
      makeBulkSeedBuyAmount(new Decimal(MAX_BULK_SEED_BUY_AMOUNT - 4))
    ).toBe(MAX_BULK_SEED_BUY_AMOUNT - 4);
  });

  it("should round down if stock some how not integer", () => {
    expect(
      makeBulkSeedBuyAmount(new Decimal(MAX_BULK_SEED_BUY_AMOUNT - 0.3))
    ).toBe(MAX_BULK_SEED_BUY_AMOUNT - 1);
    expect(
      makeBulkSeedBuyAmount(new Decimal(MAX_BULK_SEED_BUY_AMOUNT - 1.5))
    ).toBe(MAX_BULK_SEED_BUY_AMOUNT - 2);
  });
});
