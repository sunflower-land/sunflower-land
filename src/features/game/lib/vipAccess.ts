import Decimal from "decimal.js-light";
import { GameState } from "../types/game";

export const hasVipAccess = ({
  game,
  now = Date.now(),
}: {
  game: GameState;
  now?: number;
}): boolean => {
  // Legacy Code - remove once DB is updated with expiresAt
  const seasonBannerQuantity =
    game.inventory["Bull Run Banner"] ?? new Decimal(0);
  const hasSeasonPass = seasonBannerQuantity.gt(0);

  const lifetimeBannerQuantity =
    game.inventory["Lifetime Farmer Banner"] ?? new Decimal(0);

  const hasLifetimePass = lifetimeBannerQuantity.gt(0);

  if (hasSeasonPass || hasLifetimePass) return true;

  // New Code
  return !!game.vip?.expiresAt && game.vip?.expiresAt > now;
};

export type VipBundle = "1_MONTH" | "3_MONTHS" | "1_YEAR";

export const VIP_PRICES: Record<VipBundle, number> = {
  "1_MONTH": 650, //4.99
  "3_MONTHS": 1500, // 11.99
  "1_YEAR": 6000, // 39.99
};

export const VIP_DURATIONS: Record<VipBundle, number> = {
  "1_MONTH": 1000 * 60 * 60 * 24 * 31,
  "3_MONTHS": 1000 * 60 * 60 * 24 * 31 * 3,
  "1_YEAR": 1000 * 60 * 60 * 24 * 365,
};
