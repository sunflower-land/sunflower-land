import { Decimal } from "decimal.js-light";

export const MAX_BULK_FEED_AMOUNT = 10;

export function makeBulkFeedAmount(foodCount: Decimal, feedAll = false) {
  if (feedAll) {
    // If feedAll is true, return the entire food count
    return foodCount.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();
  } else {
    // If feedAll is false, return MAX_BULK_FEED_AMOUNT (Feed 10) if available food is more than 10
    return Math.min(
      MAX_BULK_FEED_AMOUNT,
      foodCount.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber()
    );
  }
}
