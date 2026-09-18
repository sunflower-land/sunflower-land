import Decimal from "decimal.js-light";
import { getObjectEntries } from "lib/object";
import type { GameState } from "features/game/types/game";
import { produce } from "immer";
import { mfCurrencyChange } from "lib/moonforgeAnalytics";

export type ClaimReferralRewardsAction = {
  type: "referral.rewardsClaimed";
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimReferralRewardsAction;
  createdAt?: number;
};

export function claimReferralRewards({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { referrals, inventory, wardrobe } = copy;
    if (!referrals) {
      throw new Error("Referrals not found");
    }

    const { rewards } = referrals;

    if (!rewards) {
      throw new Error("No rewards to claim");
    }

    //   Add rewards to inventory
    const { items, wearables, coins, sfl } = rewards;
    if (items) {
      getObjectEntries(items).forEach(([item, amount]) => {
        inventory[item] = (inventory[item] ?? new Decimal(0)).add(amount ?? 0);
      });
    }

    //   Add rewards to wardrobe
    if (wearables) {
      getObjectEntries(wearables).forEach(([item, amount]) => {
        wardrobe[item] = (wardrobe[item] ?? 0) + (amount ?? 0);
      });
    }

    const coinsBefore = copy.coins;
    const sflBefore = copy.balance.toNumber();

    //   Add rewards to balance
    if (sfl) {
      copy.balance = copy.balance.add(sfl);
    }

    //   Add rewards to coins
    if (coins) {
      copy.coins += coins;
    }

    //   Delete rewards
    delete copy.referrals?.rewards;
    delete copy.referrals?.totalUnclaimedReferrals;

    mfCurrencyChange("referral_reward", "grant", {
      coin: { before: coinsBefore, after: copy.coins },
      sfl: { before: sflBefore, after: copy.balance.toNumber() },
    });

    return copy;
  });
}
