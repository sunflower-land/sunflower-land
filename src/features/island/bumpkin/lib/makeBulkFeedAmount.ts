import { Decimal } from "decimal.js-light";

export const MAX_BULK_FEED_AMOUNT = 10;

export function makeBulkFeedAmount(foodCount: Decimal) {
  // return remaining food count if food count is less than max bulk feed amount
  if (foodCount.lessThan(MAX_BULK_FEED_AMOUNT)) {
    return foodCount.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();
  }

  // else return max bulk feed amount
  return MAX_BULK_FEED_AMOUNT;
}
