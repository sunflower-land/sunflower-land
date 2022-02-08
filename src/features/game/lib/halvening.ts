import Decimal from "decimal.js-light";

function getHalveningRate() {
  const now = new Date().getTime();

  /**
   * Estimated Block number + timestamp
   * (Sunday, 17 April 2022)
   * Will be updated closer to halvening
   */
  if (now < 1650204736000) {
    return 0.2;
  }

  /**
   * Estimated Block number + timestamp
   * (Friday, 17 June 2022)
   * Will be updated closer to halvening
   */
  if (now < 1655475136000) {
    return 0.1;
  }

  return 0.05;
}

/**
 * Gets the market rate of an item based on demand
 * In future consider using Decimal as the halvening rate gets more precise
 */
export function marketRate(value: number) {
  const rate = getHalveningRate();
  return new Decimal(value).mul(rate);
}
