import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";

import { produce } from "immer";

import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  type EventShopItemName,
  isEventShopCollectible,
  MINIGAME_SHOP_ITEMS,
} from "features/game/types/minigameShop";
import type { MinigameName } from "features/game/types/minigames";
import { getObjectEntries } from "lib/object";
import { hasVipAccess } from "features/game/lib/vipAccess";
import {
  type EventStore,
  HALLOWEEN_2026_EVENT_ITEMS,
} from "features/game/types/halloween2026EventShop";

/**
 * Tiered event stores: a tier opens once the player has bought at least its
 * `requirement` different items from the store (any tier). Same tiers as the
 * event store screen.
 */
const MINIGAME_SHOP_TIERS: Partial<Record<MinigameName, EventStore>> = {
  "halloween-2026-game-2": HALLOWEEN_2026_EVENT_ITEMS,
};

export type BuyMinigameItemAction = {
  type: "minigameItem.bought";
  id: MinigameName;
  name: EventShopItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMinigameItemAction;
  createdAt: number;
};

export function buyEventShopItem({
  state,
  action,
  createdAt,
}: Options): GameState {
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

    const tiers = MINIGAME_SHOP_TIERS[action.id];

    if (tiers) {
      const tier = getObjectEntries(tiers).find(([, { items }]) =>
        items.some(
          (tierItem) =>
            ("wearable" in tierItem
              ? tierItem.wearable
              : tierItem.collectible) === action.name,
        ),
      );

      if (!tier) {
        throw new Error("Item is not in a tier");
      }

      const [tierName, tierData] = tier;
      const requirement = "requirement" in tierData ? tierData.requirement : 0;

      // Different items bought from this store so far, any tier
      const bought =
        Object.keys(minigame.shop?.items ?? {}).length +
        Object.keys(minigame.shop?.wearables ?? {}).length;

      if (bought < requirement) {
        throw new Error(`${tierName} tier is locked`);
      }
    }

    const { sfl, items } = item.cost;

    if (sfl) {
      let cost = sfl;

      if (hasVipAccess({ game: stateCopy, now: createdAt })) {
        cost = cost * 0.5;
      }

      // Check if player has enough SFL
      if (balance.lt(cost)) {
        throw new Error("Insufficient SFL");
      }

      stateCopy.balance = balance.sub(new Decimal(cost));
      stateCopy.farmActivity = trackFarmActivity(
        "FLOWER Spent",
        stateCopy.farmActivity,
        new Decimal(cost),
      );
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
