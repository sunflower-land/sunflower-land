import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";

import { produce } from "immer";

import { trackActivity } from "features/game/types/bumpkinActivity";

import { BumpkinItem } from "features/game/types/bumpkin";
import {
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

    const item = floatingIsland.shop[action.name];

    if (!item) {
      throw new Error("Item not found in the Love Reward Shop");
    }

    const boughtAt = floatingIsland.boughtAt?.[action.name];

    if (boughtAt) {
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

    copy.bumpkin.activity = trackActivity(
      `${name} Bought`,
      copy.bumpkin.activity,
    );

    if (!floatingIsland.boughtAt) {
      floatingIsland.boughtAt = {};
    }

    floatingIsland.boughtAt[action.name] = createdAt;

    return copy;
  });
}
