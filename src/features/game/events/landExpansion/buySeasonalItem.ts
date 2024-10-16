import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";

import { produce } from "immer";
import { getCurrentSeason } from "features/game/types/seasons";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  MEGASTORE,
  SeasonalStore,
  SeasonalStoreCollectible,
  SeasonalStoreItem,
} from "features/game/types/megastore";

function isCollectible(
  item: SeasonalStoreItem,
): item is SeasonalStoreCollectible {
  return "collectible" in item;
}

export type BuySeasonalItemAction = {
  type: "seasonalItem.bought";
  name: BumpkinItem | InventoryItemName;
  tier: keyof SeasonalStore;
};

type Options = {
  state: Readonly<GameState>;
  action: BuySeasonalItemAction;
  createdAt?: number;
};

export function buySeasonalItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (draft) => {
    const { name, tier } = action;

    const currentSeason = getCurrentSeason(new Date(createdAt));
    const seasonalStore = MEGASTORE[currentSeason];

    if (!seasonalStore) {
      throw new Error("Seasonal store not found");
    }

    const tierItems = seasonalStore[tier].items;
    const item = tierItems.find((item) =>
      isCollectible(item) ? item.collectible === name : item.wearable === name,
    );

    if (!item) {
      throw new Error("Item not found in the seasonal store");
    }

    // Check if the item has already been crafted
    if (isCollectible(item)) {
      if (draft.inventory[item.collectible]) {
        throw new Error("This item has already been crafted");
      }
    } else {
      if (draft.wardrobe[item.wearable]) {
        throw new Error("This item has already been crafted");
      }
    }

    const seasonalCollectiblesCrafted = getKeys(draft.inventory).filter(
      (itemName) =>
        tierItems.some((item) =>
          "wearable" in item
            ? item.wearable === itemName
            : item.collectible === itemName,
        ),
    ).length;

    const seasonalWearablesCrafted = getKeys(draft.wardrobe).filter(
      (itemName) =>
        tierItems.some((item) =>
          "wearable" in item
            ? item.wearable === itemName
            : item.collectible === itemName,
        ),
    ).length;

    const seasonalItemsCrafted =
      seasonalCollectiblesCrafted + seasonalWearablesCrafted;

    // Check if player meets the tier requirement
    if (tier !== "basic") {
      if (
        tier === "rare" &&
        seasonalItemsCrafted < seasonalStore.rare.requirement
      ) {
        throw new Error(
          "You need to buy more basic items to unlock rare items",
        );
      }

      if (
        tier === "epic" &&
        seasonalItemsCrafted < seasonalStore.epic.requirement
      ) {
        throw new Error(
          "You need to buy more basic items to unlock epic items",
        );
      }
    }

    // Check if player has enough resources
    const { sfl, items } = item.cost;

    if (draft.balance.lessThan(sfl)) {
      throw new Error("Insufficient SFL");
    }

    for (const [itemName, amount] of Object.entries(items)) {
      const inventoryAmount =
        draft.inventory[itemName as InventoryItemName] || new Decimal(0);
      if (inventoryAmount.lessThan(amount)) {
        throw new Error(`Insufficient ${itemName}`);
      }
    }

    // Deduct resources
    draft.balance = draft.balance.minus(sfl);
    for (const [itemName, amount] of Object.entries(items)) {
      draft.inventory[itemName as InventoryItemName] = (
        draft.inventory[itemName as InventoryItemName] || new Decimal(0)
      ).plus(amount);
    }

    // Add item to inventory
    if (isCollectible(item)) {
      draft.inventory[item.collectible] = new Decimal(1);
    } else {
      draft.wardrobe[item.wearable] = 1;
    }

    return draft;
  });
}
