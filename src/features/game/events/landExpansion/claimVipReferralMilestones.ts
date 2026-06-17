import Decimal from "decimal.js-light";
import { produce } from "immer";
import { getObjectEntries } from "lib/object";
import type { GameState } from "features/game/types/game";
import { VIP_REFERRAL_MILESTONES } from "features/game/lib/vipReferralMilestones";

export type ClaimVipReferralMilestonesAction = {
  type: "referral.vipMilestonesClaimed";
  milestone: number;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimVipReferralMilestonesAction;
  createdAt?: number;
};

/**
 * Claims the bonus prize for a single VIP referral milestone the player has
 * reached (e.g. their 1st, 5th, 10th … 90th VIP referral). The milestone to
 * claim is given by `action.milestone`.
 *
 * The claim is rejected unless the milestone is configured, the player has
 * reached the required number of VIP referrals, and it hasn't already been
 * claimed. Claimed milestones are recorded on `referrals.vipMilestonesClaimed`
 * as `{ [milestone]: claimedAt }` so each can be claimed exactly once.
 *
 * This is the client-side mirror of the authoritative server reducer — it
 * applies the same state transition so the UI updates optimistically.
 */
export function claimVipReferralMilestones({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { referrals, inventory, wardrobe } = copy;
    if (!referrals) {
      throw new Error("Referrals not found");
    }

    const { milestone } = action;
    const reward = VIP_REFERRAL_MILESTONES[milestone];
    if (!reward) {
      throw new Error("Invalid milestone");
    }

    if ((referrals.totalVIPReferrals ?? 0) < milestone) {
      throw new Error("Milestone not reached");
    }

    const claimed = referrals.vipMilestonesClaimed ?? {};
    if (claimed[milestone] !== undefined) {
      throw new Error("Milestone already claimed");
    }

    const { items, wearables, coins, sfl } = reward;

    if (items) {
      getObjectEntries(items).forEach(([item, amount]) => {
        inventory[item] = (inventory[item] ?? new Decimal(0)).add(amount ?? 0);
      });
    }

    if (wearables) {
      getObjectEntries(wearables).forEach(([item, amount]) => {
        wardrobe[item] = (wardrobe[item] ?? 0) + (amount ?? 0);
      });
    }

    if (sfl) {
      copy.balance = copy.balance.add(sfl);
    }

    if (coins) {
      copy.coins += coins;
    }

    // Record the milestone as claimed (with the time it was claimed at) so it
    // cannot be claimed again.
    referrals.vipMilestonesClaimed = { ...claimed, [milestone]: createdAt };
  });
}
