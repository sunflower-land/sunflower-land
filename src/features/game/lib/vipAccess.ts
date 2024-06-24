import Decimal from "decimal.js-light";
import { Inventory } from "../types/game";
import { getSeasonalBanner } from "../types/seasons";

export const hasVipAccess = (inventory: Inventory): boolean => {
  const seasonBannerQuantity = inventory[getSeasonalBanner()] ?? new Decimal(0);
  const hasSeasonPass = seasonBannerQuantity.gt(0);

  const lifetimeBannerQuantity =
    inventory["Lifetime Farmer Banner"] ?? new Decimal(0);
  const hasLifetimePass = lifetimeBannerQuantity.gt(0);

  return hasSeasonPass || hasLifetimePass;
};
