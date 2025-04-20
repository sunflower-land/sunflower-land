import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

import { produce } from "immer";

import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  isEventShopCollectible,
  EVENT_SHOP_ITEMS,
  EventShopCollectibleName,
  EventShopWearableName,
} from "features/game/types/eventShop";
export type BuyEventShopItemAction = {
  type: "eventItem.bought";
  name: EventShopCollectibleName | EventShopWearableName;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyEventShopItemAction;
  createdAt?: number;
};

export function buyEventShopItem({
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

    const item = EVENT_SHOP_ITEMS[action.name];

    if (!item) {
      throw new Error("Item not found in the Love Event Shop");
    }

    // Check if player has enough resources
    const { price } = item.cost;

    const easterTokenBalance =
      stateCopy.inventory["Easter Token 2025"] ?? new Decimal(0);

    if (easterTokenBalance.lt(price)) {
      throw new Error("Insufficient Easter Token 2025");
    }

    // Deduct Easter Token 2025
    stateCopy.inventory["Easter Token 2025"] = easterTokenBalance.minus(price);

    // Add item to inventory
    if (isEventShopCollectible(name)) {
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
