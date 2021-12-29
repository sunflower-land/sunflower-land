import { getMarketRate } from "./supply";

export function getPrice(landSize: number) {
  if (landSize < 8) {
    return 1;
  }

  if (landSize < 11) {
    return 50;
  }

  if (landSize < 14) {
    return 500;
  }

  return 2500;
}

interface UpgradePriceOptions {
  farmSize: number;
  totalSupply: number;
}

export function getUpgradePrice({
  farmSize,
  totalSupply,
}: UpgradePriceOptions) {
  const marketRate = getMarketRate(totalSupply);

  if (farmSize <= 5) {
    return 1 / marketRate;
  }

  if (farmSize <= 8) {
    return 50 / marketRate;
  }

  if (farmSize <= 11) {
    return 500 / marketRate;
  }

  return 2500 / marketRate;
}
