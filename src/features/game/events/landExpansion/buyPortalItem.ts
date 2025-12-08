import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

import { produce } from "immer";

import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  EventShopItemName,
  isEventShopCollectible,
  MINIGAME_SHOP_ITEMS,
} from "features/game/types/minigameShop";
import { MinigameName } from "features/game/types/minigames";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { hasVipAccess } from "features/game/lib/vipAccess";

export type BuyMinigameItemAction = {
  type: "minigameItem.bought";
  id: MinigameName;
  name: EventShopItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMinigameItemAction;
  createdAt?: number;
};

export function buyEventShopItem({ state, action }: Options): GameState {
  return produce(state, (stateCopy) => {
    const { name } = action;

    const { minigames, balance } = stateCopy;

    const minigame = minigames.games[action.id] ?? {
      history: {},
      purchases: [],
      highscore: 0,
    };

    const store = MINIGAME_SHOP_ITEMS[action.id];

    if (!store) {
      throw new Error("Minigame does not have a shop");
    }

    const item = store[action.name];

    if (!item) {
      throw new Error("Item not found in Shopx");
    }

    const { sfl, items } = item.cost;

    if (sfl) {
      let cost = sfl;

      if (hasVipAccess({ game: stateCopy })) {
        cost = cost * 0.5;
      }

      // Check if player has enough SFL
      if (balance.lt(cost)) {
        throw new Error("Insufficient SFL");
      }

      stateCopy.balance = balance.sub(new Decimal(cost));
    }

    getObjectEntries(items).forEach(([item, amount]) => {
      const current = stateCopy.inventory[item] ?? new Decimal(0);

      if (current.lt(amount ?? 0)) {
        throw new Error(`Insufficient ${item}`);
      }

      stateCopy.inventory[item] = current.sub(amount ?? 0);
    });

    const purchases = minigame.shop ?? {
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

      minigame!.shop = {
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

      minigame!.shop = {
        ...purchases,
        wearables: {
          ...purchases.wearables,
          [name]: (purchases.wearables?.[name] ?? 0) + 1,
        },
      };
    }

    minigames.games[action.id] = minigame;

    stateCopy.farmActivity = trackFarmActivity(
      `${name} Bought`,
      stateCopy.farmActivity,
    );

    return stateCopy;
  });
}
