import Decimal from "decimal.js-light";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

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

    const { totalUnclaimedReferrals, rewards } = referrals;

    if (totalUnclaimedReferrals === 0) {
      throw new Error("No unclaimed referrals");
    }
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

    return copy;
  });
}
