import { getObjectEntries } from "lib/object";
import type { BumpkinItem } from "features/game/types/bumpkin";
import type { InventoryItemName } from "features/game/types/game";

/**
 * The reward bucket shape stored on `gameState.referrals.rewards`.
 * Milestone prizes are merged into this bucket and later moved into the
 * player's inventory / wardrobe / balance by the `referral.rewardsClaimed`
 * event (see `claimReferralRewards.ts`).
 */
export type ReferralReward = {
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Partial<Record<BumpkinItem, number>>;
  coins?: number;
  sfl?: number;
};

/**
 * Bonus prizes awarded when a player reaches a given number of VIP referrals
 * (i.e. people they referred who bought their first VIP bundle).
 *
 * Milestones: 1st, 5th, 10th, then every 10th up to 90.
 *
 * NOTE: These are placeholder rewards — adjust the items/amounts as needed.
 * Each prize may be any mix of coins, inventory items, and wearables.
 */
export const VIP_REFERRAL_MILESTONES: Record<number, ReferralReward> = {
  1: { coins: 5000 },
  5: { items: { "Super Totem": 1 } },
  10: { wearables: { "Streamer Helmet": 1 } },
  20: { items: { Gem: 100 * 25 } },
  30: { items: { "Honey Cheddar": 10 } },
  40: { items: { "Love Charm": 5_000 } },
  50: { items: { Gem: 100 * 25 } },
  60: { coins: 50_000 },
  70: { items: { "Creator Banner": 1 } },
  80: { items: { "Love Charm": 10_000 } },
  90: { items: { Gem: 100 * 50 } },
};

/** All configured milestone thresholds, ascending. */
export const VIP_REFERRAL_MILESTONE_THRESHOLDS = getObjectEntries(
  VIP_REFERRAL_MILESTONES,
)
  .map(([threshold]) => Number(threshold))
  .sort((a, b) => a - b);
