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
import { getObjectEntries } from "features/game/expansion/lib/utils";

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

    const { bumpkin, minigames, balance } = stateCopy;

    if (!minigames.games[action.id]) {
      throw new Error("Minigame not found");
    }

    const store = MINIGAME_SHOP_ITEMS[action.id];

    if (!store) {
      throw new Error("Minigame does not have a shop");
    }

    const item = store[action.name];

    if (!item) {
      throw new Error("Item not found in Shopx");
    }

    const { sfl, items } = item.cost;

    // Check if player has enough SFL
    if (balance.lt(sfl)) {
      throw new Error("Insufficient SFL");
    }

    stateCopy.balance = balance.sub(new Decimal(sfl));

    getObjectEntries(items).forEach(([item, amount]) => {
      const current = stateCopy.inventory[item] ?? new Decimal(0);

      if (current.lt(amount ?? 0)) {
        throw new Error(`Insufficient ${item}`);
      }

      stateCopy.inventory[item] = current.sub(amount ?? 0);
    });

    const purchases = minigames.games[action.id]!.shop ?? {
      items: {},
      wearables: {},
    };

    const max = item.max ?? 1;

    // Add item to inventory
    if (isEventShopCollectible(item)) {
      const name = item.name;

      // If already exists, throw error
      if (purchases!.items?.[name] && purchases!.items?.[name] >= max) {
        throw new Error("Item already purchased");
      }

      const current = stateCopy.inventory[name] ?? new Decimal(0);
      stateCopy.inventory[name] = current.add(1);

      minigames.games[action.id]!.shop = {
        ...purchases,
        items: {
          ...purchases.items,
          [name]: (purchases.items?.[name] ?? 0) + 1,
        },
      };
    } else {
      const name = item.name;

      // If already exists, throw error
      if (purchases!.wearables?.[name] && purchases!.wearables?.[name] >= max) {
        throw new Error("Wearable already purchased");
      }

      const current = stateCopy.wardrobe[name] ?? 0;

      stateCopy.wardrobe[name] = current + 1;

      minigames.games[action.id]!.shop = {
        ...purchases,
        wearables: {
          ...purchases.wearables,
          [name]: (purchases.wearables?.[name] ?? 0) + 1,
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
