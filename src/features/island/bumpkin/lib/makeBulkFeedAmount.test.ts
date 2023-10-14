import Decimal from "decimal.js-light";
import { makeBulkFeedAmount, MAX_BULK_FEED_AMOUNT } from "./makeBulkFeedAmount";

describe("makeBulkSeedBuyAmount", () => {
  it("should return the the MAX if enough food in inventory", () => {
    expect(makeBulkFeedAmount(new Decimal(200))).toBe(MAX_BULK_FEED_AMOUNT);
    expect(makeBulkFeedAmount(new Decimal(11))).toBe(MAX_BULK_FEED_AMOUNT);
  });

  it("should return remaining food count in inventory if less than MAX bulk feed amount", () => {
    expect(makeBulkFeedAmount(new Decimal(MAX_BULK_FEED_AMOUNT - 1))).toBe(
      MAX_BULK_FEED_AMOUNT - 1
    );
    expect(makeBulkFeedAmount(new Decimal(MAX_BULK_FEED_AMOUNT - 4))).toBe(
      MAX_BULK_FEED_AMOUNT - 4
    );
  });

  it("should round down if inventory food count some how is not an integer", () => {
    expect(makeBulkFeedAmount(new Decimal(MAX_BULK_FEED_AMOUNT - 0.3))).toBe(
      MAX_BULK_FEED_AMOUNT - 1
    );
    expect(makeBulkFeedAmount(new Decimal(MAX_BULK_FEED_AMOUNT - 1.5))).toBe(
      MAX_BULK_FEED_AMOUNT - 2
    );
  });
});
