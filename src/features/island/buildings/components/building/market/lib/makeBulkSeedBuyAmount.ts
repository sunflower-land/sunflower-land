import { Decimal } from "decimal.js-light";

export const MAX_BULK_SEED_BUY_AMOUNT = 10;

export function makeBulkSeedBuyAmount(stock: Decimal) {
  if (stock.lessThan(MAX_BULK_SEED_BUY_AMOUNT)) {
    return stock.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();
  }

  return MAX_BULK_SEED_BUY_AMOUNT;
}
