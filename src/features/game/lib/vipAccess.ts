import Decimal from "decimal.js-light";
import { GameState } from "../types/game";
import { getSeasonalBanner } from "../types/chapters";

export const hasVipAccess = ({
  game,
  now = Date.now(),
}: {
  game: GameState;
  now?: number;
}): boolean => {
  // Legacy Code - remove once DB is updated with expiresAt
  const seasonBannerQuantity =
    game.inventory[getSeasonalBanner(new Date(now))] ?? new Decimal(0);
  const hasSeasonPass = seasonBannerQuantity.gt(0);

  const lifetimeBannerQuantity =
    game.inventory["Lifetime Farmer Banner"] ?? new Decimal(0);

  const hasLifetimePass = lifetimeBannerQuantity.gt(0);

  if (hasSeasonPass || hasLifetimePass) return true;

  const hasValidInGameVIP = !!game.vip?.expiresAt && game.vip?.expiresAt > now;

  // Has Ronin NFT VIP Access
  const nft = game.nfts?.ronin;
  if (nft && nft.expiresAt > now && !hasValidInGameVIP) {
    const RONIN_FARM_CREATION_CUTOFF = new Date(
      "2025-02-01T00:00:00Z",
    ).getTime();
    return game.createdAt > RONIN_FARM_CREATION_CUTOFF;
  }

  // New Code
  return hasValidInGameVIP;
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
