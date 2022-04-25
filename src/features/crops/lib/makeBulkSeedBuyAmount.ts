import { Decimal } from "decimal.js-light";

export const MAX_BULK_SEED_BUY_AMOUNT = 10;

export function makeBulkSeedBuyAmount(stock: Decimal) {
  const amount = stock.lessThan(MAX_BULK_SEED_BUY_AMOUNT)
    ? stock.toDecimalPlaces(0, Decimal.ROUND_DOWN)
    : new Decimal(MAX_BULK_SEED_BUY_AMOUNT);

  return amount.toNumber();
}
