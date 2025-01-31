import Decimal from "decimal.js-light";
import { GameState } from "../types/game";
import { getChapterBanner } from "../types/chapters";

export const hasVipAccess = ({
  game,
  now = Date.now(),
}: {
  game: GameState;
  now?: number;
}): boolean => {
  // Legacy Code - remove once DB is updated with expiresAt
  const chapterBannerQuantity =
    game.inventory[getChapterBanner(new Date(now))] ?? new Decimal(0);
  const hasChapterPass = chapterBannerQuantity.gt(0);

  const lifetimeBannerQuantity =
    game.inventory["Lifetime Farmer Banner"] ?? new Decimal(0);

  const hasLifetimePass = lifetimeBannerQuantity.gt(0);

  if (hasChapterPass || hasLifetimePass) return true;

  // New Code
  return !!game.vip?.expiresAt && game.vip?.expiresAt > now;
};

export type VipBundle = "1_MONTH" | "3_MONTHS" | "2_YEARS";

export const VIP_PRICES: Record<VipBundle, number> = {
  "1_MONTH": 800,
  "3_MONTHS": 1200, // 20% off - 1500 normally
  "2_YEARS": 11500,
};

export const VIP_DURATIONS: Record<VipBundle, number> = {
  "1_MONTH": 1000 * 60 * 60 * 24 * 31,
  "3_MONTHS": 1000 * 60 * 60 * 24 * 31 * 3,
  "2_YEARS": 1000 * 60 * 60 * 24 * 365 * 2,
};
