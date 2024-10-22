import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName, Keys } from "features/game/types/game";

import { produce } from "immer";
import { getCurrentSeason } from "features/game/types/seasons";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  MEGASTORE,
  SeasonalStore,
  SeasonalStoreCollectible,
  SeasonalStoreItem,
} from "features/game/types/megastore";
import { ARTEFACT_SHOP_KEYS } from "features/game/types/collectibles";

export function isCollectible(
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
  return produce(state, (stateCopy) => {
    const { name, tier } = action;

    const currentSeason = getCurrentSeason(new Date(createdAt));
    const seasonalStore = MEGASTORE[currentSeason];

    if (!seasonalStore) {
      throw new Error("Seasonal store not found");
    }

    const tierItems = seasonalStore[tier].items;
    const item = tierItems.find((item) =>
      item
        ? isCollectible(item)
          ? item.collectible === name
          : item.wearable === name
        : undefined,
    );

    if (!item) {
      throw new Error("Item not found in the seasonal store");
    }

    const tierData =
      tier === "basic"
        ? seasonalStore["basic"].items
        : tier === "rare"
          ? seasonalStore["basic"].items
          : tier === "epic"
            ? seasonalStore["rare"].items
            : seasonalStore["basic"].items;
    const seasonalCollectiblesCrafted = getKeys(stateCopy.inventory).filter(
      (itemName) =>
        tierData.some((item) =>
          "wearable" in item
            ? item.wearable === itemName
            : item.collectible === itemName,
        ),
    ).length;

    const seasonalWearablesCrafted = getKeys(stateCopy.wardrobe).filter(
      (itemName) =>
        tierData.some((item) =>
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

    if (stateCopy.balance.lessThan(sfl)) {
      throw new Error("Insufficient SFL");
    }

    for (const [itemName, amount] of Object.entries(items)) {
      const inventoryAmount =
        stateCopy.inventory[itemName as InventoryItemName] || new Decimal(0);
      if (inventoryAmount.lessThan(amount)) {
        throw new Error(`Insufficient ${itemName}`);
      }
    }

    // Deduct resources
    stateCopy.balance = stateCopy.balance.minus(sfl);
    for (const [itemName, amount] of Object.entries(items)) {
      stateCopy.inventory[itemName as InventoryItemName] = (
        stateCopy.inventory[itemName as InventoryItemName] || new Decimal(0)
      ).minus(amount);
    }

    // Add item to inventory
    if (isCollectible(item)) {
      const current = stateCopy.inventory[item.collectible] ?? new Decimal(0);

      stateCopy.inventory[item.collectible] = current.add(1);
    } else {
      const current = stateCopy.wardrobe[item.wearable] ?? 0;

      stateCopy.wardrobe[item.wearable] = current + 1;
    }

    const isKey = (name: InventoryItemName): name is Keys =>
      name in ARTEFACT_SHOP_KEYS;

    // This is where the key is bought

    if (isKey(name as InventoryItemName)) {
      const keyBoughtAt =
        stateCopy.pumpkinPlaza.keysBought?.megastore[name as Keys]?.boughtAt;
      if (keyBoughtAt) {
        const currentTime = new Date(createdAt).toISOString().slice(0, 10);
        const lastBoughtTime = new Date(keyBoughtAt).toISOString().slice(0, 10);

        if (currentTime === lastBoughtTime) {
          throw new Error("Already bought today");
        }
      }
      // Ensure `keysBought` is properly initialized
      if (!stateCopy.pumpkinPlaza.keysBought) {
        stateCopy.pumpkinPlaza.keysBought = {
          treasureShop: {},
          megastore: {},
          factionShop: {},
        };
      }

      stateCopy.pumpkinPlaza.keysBought.megastore[name as Keys] = {
        boughtAt: createdAt,
      };
    }

    return stateCopy;
  });
}
