import Decimal from "decimal.js-light";
import { GameState } from "../types/game";

export const RONIN_FARM_CREATION_CUTOFF = new Date(
  "2025-02-01T00:00:00Z",
).getTime();

// Prevents people sharing VIP across their farms
export const RONIN_VIP_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;

export const hasVipAccess = ({
  game,
  now = Date.now(),
}: {
  game: GameState;
  now?: number;
}): boolean => {
  const lifetimeBannerQuantity =
    game.inventory["Lifetime Farmer Banner"] ?? new Decimal(0);

  const hasLifetimePass = lifetimeBannerQuantity.gt(0);

  if (hasLifetimePass) return true;

  const hasValidInGameVIP = !!game.vip?.expiresAt && game.vip?.expiresAt > now;

  // Has Ronin NFT VIP Access
  const nft = game.nfts?.ronin;
  if (
    nft &&
    nft.expiresAt > now &&
    !hasValidInGameVIP &&
    nft.acknowledgedAt &&
    // They acknowledged the NFT before the 24 hour cooldown cutover rule
    (nft.acknowledgedAt < new Date("2025-03-06T00:00:00Z").getTime() ||
      // Ensure they have had the NFT for 3 days
      nft.acknowledgedAt < now - RONIN_VIP_COOLDOWN_MS)
  ) {
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
