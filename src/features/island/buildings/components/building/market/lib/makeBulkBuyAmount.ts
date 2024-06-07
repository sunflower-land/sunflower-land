import { Decimal } from "decimal.js-light";

export const MAX_BULK_BUY_AMOUNT = 10;

export function makeBulkBuyTools(stock: Decimal) {
  if (stock.lessThan(MAX_BULK_BUY_AMOUNT)) {
    return stock.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();
  }

  return MAX_BULK_BUY_AMOUNT;
}

export function makeBulkBuySeeds(stock: Decimal, limit: Decimal) {
  // limit is the difference between inventory limit and inventory amount
  if (limit.lessThan(stock)) {
    return limit.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();
  } else {
    return stock.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();
  }
}
