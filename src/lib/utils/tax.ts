import Decimal from "decimal.js-light";

/**
 * Returns the tax rate when withdrawing SFL
 * Smart contract uses a base rate of 1000 for decimal precision. 10% = 100
 */
export function getTax(amount: Decimal) {
  if (amount.lessThan(10)) {
    // 30%
    return 300;
  }

  if (amount.lessThan(100)) {
    // 25%
    return 250;
  }

  if (amount.lessThan(1000)) {
    // 20%
    return 200;
  }

  if (amount.lessThan(5000)) {
    // 15%
    return 150;
  }

  // 10%
  return 100;
}
