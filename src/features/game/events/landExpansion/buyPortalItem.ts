import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

import { produce } from "immer";

import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  isEventShopCollectible,
  MINIGAME_SHOP_ITEMS,
  EventShopCollectibleName,
  EventShopWearableName,
} from "features/game/types/minigameShop";
import { MinigameName } from "features/game/types/minigames";

export type BuyMinigameItemAction = {
  type: "minigameItem.bought";
  id: MinigameName;
  name: EventShopCollectibleName | EventShopWearableName;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMinigameItemAction;
  createdAt?: number;
};

export function buyEventShopItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { name } = action;

    const { bumpkin, minigames } = stateCopy;

    if (!bumpkin) {
      throw new Error("Bumpkin not found");
    }

    const item = MINIGAME_SHOP_ITEMS[action.name];

    if (!item) {
      throw new Error("Item not found in the Love Event Shop");
    }

    if (!minigames.games[action.id]) {
      throw new Error("Minigame not found");
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

    const shop = minigames.games[action.id]!.shop ?? {
      items: {},
      wearables: {},
    };

    // Add item to inventory
    if (isEventShopCollectible(name)) {
      // If already exists, throw error
      if (shop!.items?.[name] && shop!.items?.[name] >= item.max) {
        throw new Error("Item already purchased");
      }

      const current = stateCopy.inventory[name] ?? new Decimal(0);
      stateCopy.inventory[name] = current.add(1);

      minigames.games[action.id]!.shop = {
        ...shop,
        items: {
          ...shop.items,
          [name]: (shop.items?.[name] ?? 0) + 1,
        },
      };
    } else {
      // If already exists, throw error
      if (shop!.wearables?.[name] && shop!.wearables?.[name] >= item.max) {
        throw new Error("Item already purchased");
      }

      const current = stateCopy.wardrobe[name] ?? 0;

      stateCopy.wardrobe[name] = current + 1;

      minigames.games[action.id]!.shop = {
        ...shop,
        wearables: {
          ...shop.wearables,
          [name]: (shop.wearables?.[name] ?? 0) + 1,
        },
      };
    }

    stateCopy.bumpkin.activity = trackActivity(
      `${name} Bought`,
      stateCopy.bumpkin.activity,
    );

    return stateCopy;
  });
}
