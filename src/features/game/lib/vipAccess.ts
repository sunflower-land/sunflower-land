import Decimal from "decimal.js-light";
import { GameState } from "../types/game";

export const VIP_TRIAL_PERIOD_MS = 1000 * 60 * 60 * 24 * 7;

export const hasVipAccess = ({
  game,
  now = Date.now(),
  type = "trial",
}: {
  game: GameState;
  now?: number;
  type?: "trial" | "full";
}): boolean => {
  const hasTrialVIP =
    !!game.vip?.trialStartedAt &&
    game.vip?.trialStartedAt > now - VIP_TRIAL_PERIOD_MS;
  if (type === "trial" && hasTrialVIP) {
    return true;
  }

  const lifetimeBannerQuantity =
    game.inventory["Lifetime Farmer Banner"] ?? new Decimal(0);

  const hasLifetimePass = lifetimeBannerQuantity.gt(0);

  const hasValidInGameVIP = !!game.vip?.expiresAt && game.vip?.expiresAt > now;

  return hasValidInGameVIP || hasLifetimePass;
};

export type VipBundle = "1_MONTH" | "3_MONTHS" | "2_YEARS";

export const VIP_PRICES: Record<VipBundle, number> = {
  "1_MONTH": 1250,
  "3_MONTHS": 1500,
  "2_YEARS": 11500,
};

export const VIP_DURATIONS: Record<VipBundle, number> = {
  "1_MONTH": 1000 * 60 * 60 * 24 * 31,
  "3_MONTHS": 1000 * 60 * 60 * 24 * 31 * 3,
  "2_YEARS": 1000 * 60 * 60 * 24 * 365 * 2,
};

const EXPANSION_VIP_DISCOUNT_FIXED = 500;
const EXPANSION_VIP_DISCOUNT_PERCENT = 0.2;

/**
 * Expansion coin cost after VIP discount: 500 coins off or 20% off, whichever is bigger.
 */
export const getExpansionCoinCostWithVip = ({
  coins,
  game,
}: {
  coins: number | undefined;
  game: GameState;
}): number => {
  const fullCost = coins ?? 0;
  if (fullCost === 0) return 0;
  if (!hasVipAccess({ game })) return fullCost;
  const discount20 = Math.floor(fullCost * EXPANSION_VIP_DISCOUNT_PERCENT);
  const discount = Math.max(EXPANSION_VIP_DISCOUNT_FIXED, discount20);
  return Math.max(0, fullCost - discount);
};
