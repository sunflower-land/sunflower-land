import Decimal from "decimal.js-light";
import { Inventory } from "../types/game";
import { getSeasonalBanner } from "../types/seasons";

export const hasVipAccess = (inventory: Inventory): boolean => {
  const goldPassSunset = new Date("2024-05-01T00:00:00Z").getTime();

  if (Date.now() < goldPassSunset) {
    const goldPassQuantity = inventory["Gold Pass"] ?? new Decimal(0);
    const hasGoldPass = goldPassQuantity.gt(0);

    return hasGoldPass;
  }

  const seasonBannerQuantity = inventory[getSeasonalBanner()] ?? new Decimal(0);
  const hasSeasonPass = seasonBannerQuantity.gt(0);

  const lifetimeBannerQuantity =
    inventory["Lifetime Farmer Banner"] ?? new Decimal(0);
  const hasLifetimePass = lifetimeBannerQuantity.gt(0);

  return hasSeasonPass || hasLifetimePass;
};
