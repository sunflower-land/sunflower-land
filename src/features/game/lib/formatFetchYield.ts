import Decimal from "decimal.js-light";

export function formatFetchYield(amount: Decimal): string {
  return amount.isInteger() ? amount.toString() : amount.toFixed(2);
}
