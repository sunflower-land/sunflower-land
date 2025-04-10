import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

import { produce } from "immer";

import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  isRewardShopCollectible,
  REWARD_SHOP_ITEMS,
  RewardShopCollectibleName,
  RewardShopWearableName,
} from "features/game/types/rewardShop";
import { hasFeatureAccess } from "lib/flags";
export type BuyRewardShopItemAction = {
  type: "rewardItem.bought";
  name: RewardShopCollectibleName | RewardShopWearableName;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyRewardShopItemAction;
  createdAt?: number;
};

export function buyRewardShopItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!hasFeatureAccess(stateCopy, "LOVE_CHARM_REWARD_SHOP")) {
      throw new Error("Love Charm Reward Shop is not available");
    }
    const { name } = action;

    const { bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("Bumpkin not found");
    }

    const item = REWARD_SHOP_ITEMS[action.name];

    if (!item) {
      throw new Error("Item not found in the Love Reward Shop");
    }

    // Check if player has enough resources
    const { price } = item.cost;

    const loveCharmBalance =
      stateCopy.inventory["Love Charm"] ?? new Decimal(0);

    if (loveCharmBalance.lt(price)) {
      throw new Error("Insufficient Love Charm");
    }

    // Deduct Love Charm
    stateCopy.inventory["Love Charm"] = loveCharmBalance.minus(price);

    // Add item to inventory
    if (isRewardShopCollectible(name)) {
      const current = stateCopy.inventory[name] ?? new Decimal(0);
      stateCopy.inventory[name] = current.add(1);
    } else {
      const current = stateCopy.wardrobe[name] ?? 0;

      stateCopy.wardrobe[name] = current + 1;
    }

    stateCopy.bumpkin.activity = trackActivity(
      `${name} Bought`,
      stateCopy.bumpkin.activity,
    );

    return stateCopy;
  });
}
