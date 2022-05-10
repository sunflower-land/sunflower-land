import Decimal from "decimal.js-light";

function getHalveningRate() {
  const now = new Date().getTime();

  /**
   * Estimated Block number + timestamp
   * 2022-04-27T06:00:00.000Z
   * Will be updated closer to halvening
   */
  if (now < 1651039200000) {
    return 0.1;
  }

  /**
   * Estimated Block number + timestamp
   * (Tuesday, 10 May 2022)
   */
  if (now < 1652140800000) {
    return 0.05;
  }

  return 0.025;
}

/**
 * Gets the market rate of an item based on demand
 * In future consider using Decimal as the halvening rate gets more precise
 */
export function marketRate(value: number) {
  const rate = getHalveningRate();
  return new Decimal(value).mul(rate);
}
