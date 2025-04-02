import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";

import { produce } from "immer";

import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  REWARD_SHOP_ITEMS,
  RewardShopCollectibleName,
  RewardShopItemName,
  RewardShopWearableName,
} from "features/game/types/rewardShop";
import { BumpkinItem } from "features/game/types/bumpkin";
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
    if (item.type === "collectible") {
      const current =
        stateCopy.inventory[item.name as InventoryItemName] ?? new Decimal(0);
      stateCopy.inventory[item.name as InventoryItemName] = current.add(1);
    } else {
      const current = stateCopy.wardrobe[item.name as BumpkinItem] ?? 0;

      stateCopy.wardrobe[item.name as BumpkinItem] = current + 1;
    }

    stateCopy.bumpkin.activity = trackActivity(
      `${name as RewardShopItemName} Bought`,
      stateCopy.bumpkin.activity,
    );

    return stateCopy;
  });
}
