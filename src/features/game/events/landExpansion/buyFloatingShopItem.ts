import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";

import { produce } from "immer";

import { trackFarmActivity } from "features/game/types/farmActivity";

import { BumpkinItem } from "features/game/types/bumpkin";
import {
  FLOATING_ISLAND_SHOP_ITEMS,
  FloatingShopCollectible,
  FloatingShopItem,
} from "features/game/types/floatingIsland";

export const isFloatingShopCollectible = (
  item: FloatingShopItem,
): item is FloatingShopCollectible => item.type === "collectible";

export type BuyFloatingShopItemAction = {
  type: "floatingShopItem.bought";
  name: InventoryItemName | BumpkinItem;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyFloatingShopItemAction;
  createdAt?: number;
};

export function buyFloatingShopItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { name } = action;

    const { bumpkin, floatingIsland } = copy;

    if (!bumpkin) {
      throw new Error("Bumpkin not found");
    }

    const item =
      action.name === "Pet Egg"
        ? FLOATING_ISLAND_SHOP_ITEMS[action.name]
        : floatingIsland.shop[action.name];

    if (!item) {
      throw new Error("Item not found in the Love Reward Shop");
    }

    const boughtAt = floatingIsland.boughtAt?.[action.name];

    if (boughtAt) {
      if (action.name === "Pet Egg" && boughtAt < createdAt) {
        throw new Error("Pet Egg can only be bought once");
      }
      const todayKey = new Date().toISOString().split("T")[0];
      const boughtAtKey = new Date(boughtAt).toISOString().split("T")[0];

      if (boughtAtKey === todayKey) {
        throw new Error("Item already bought today");
      }
    }

    // Check if player has enough resources
    const { items } = item.cost;

    Object.entries(items).forEach(([key, value]) => {
      const balance =
        copy.inventory[key as InventoryItemName] ?? new Decimal(0);
      if (balance.lt(value)) {
        throw new Error(`Insufficient ${key}`);
      }

      // Deduct Love Charm
      copy.inventory[key as InventoryItemName] = balance.minus(value);
    });

    // Add item to inventory
    if (isFloatingShopCollectible(item)) {
      const current = copy.inventory[item.name] ?? new Decimal(0);
      copy.inventory[item.name] = current.add(1);
    } else {
      const current = copy.wardrobe[item.name] ?? 0;

      copy.wardrobe[item.name] = current + 1;
    }

    // Exclude Pet Egg from activity tracking as it conflicts with megastore.
    // Condition to check if petEgg has been bought doesn't require "Pet Egg Bought" activity
    if (name !== "Pet Egg") {
      copy.farmActivity = trackFarmActivity(
        `${name} Bought`,
        copy.farmActivity,
      );
    }

    if (!floatingIsland.boughtAt) {
      floatingIsland.boughtAt = {};
    }

    floatingIsland.boughtAt[action.name] = createdAt;

    return copy;
  });
}
