import Decimal from "decimal.js-light";

function getHalveningRate() {
  const now = new Date().getTime();

  /**
   * Estimated Block number + timestamp
   * March 22nd 12am
   * Will be updated closer to halvening
   */
  // if (now < 1647907200000) {
  //   console.log("Previous");
  //   return 0.2;
  // }

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
   * (Friday, 17 June 2022)
   * Will be updated closer to halvening
   */
  if (now < 1655475136000) {
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
