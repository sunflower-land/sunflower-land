import Decimal from "decimal.js-light";

export const ESTIMATED_HALVENING = new Date("2024-02-18T16:00:00+11:00");
// export const ESTIMATED_HALVENING = new Date("2024-02-20T16:00:00+11:00");

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

  if (now < 1663718400000) {
    return 0.025;
  }

  /**
   * Estimated Block number + timestamp
   * (Monday, 10 July 2023)
   */
  if (now < 1688947200000) {
    return 0.0125;
  }

  if (now < ESTIMATED_HALVENING.getTime()) {
    return 0.00625;
  }

  return 0.003125;
}

/**
 * Gets the market rate of an item based on demand
 * In future consider using Decimal as the halvening rate gets more precise
 */
export function marketRate(value: number) {
  const rate = getHalveningRate();
  return new Decimal(value).mul(rate);
}
