import Decimal from "decimal.js-light";
import { makeBulkBuyAmount, MAX_BULK_BUY_AMOUNT } from "./makeBulkBuyAmount";

describe("makeBulkSeedBuyAmount", () => {
  it("should return the the MAX if enough stock", () => {
    expect(makeBulkBuyAmount(new Decimal(200))).toBe(MAX_BULK_BUY_AMOUNT);
    expect(makeBulkBuyAmount(new Decimal(11))).toBe(MAX_BULK_BUY_AMOUNT);
  });

  it("should return remaining stock if less than MAX bulk buy amount", () => {
    expect(makeBulkBuyAmount(new Decimal(MAX_BULK_BUY_AMOUNT - 1))).toBe(
      MAX_BULK_BUY_AMOUNT - 1
    );
    expect(makeBulkBuyAmount(new Decimal(MAX_BULK_BUY_AMOUNT - 4))).toBe(
      MAX_BULK_BUY_AMOUNT - 4
    );
  });

  it("should round down if stock some how not integer", () => {
    expect(makeBulkBuyAmount(new Decimal(MAX_BULK_BUY_AMOUNT - 0.3))).toBe(
      MAX_BULK_BUY_AMOUNT - 1
    );
    expect(makeBulkBuyAmount(new Decimal(MAX_BULK_BUY_AMOUNT - 1.5))).toBe(
      MAX_BULK_BUY_AMOUNT - 2
    );
  });
});
