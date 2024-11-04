import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName, Keys } from "features/game/types/game";

import { produce } from "immer";
import { getCurrentSeason, SEASONS } from "features/game/types/seasons";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  MEGASTORE,
  SeasonalStore,
  SeasonalStoreCollectible,
  SeasonalStoreItem,
  SeasonalStoreTier,
} from "features/game/types/megastore";
import { ARTEFACT_SHOP_KEYS } from "features/game/types/collectibles";
import { SFLDiscount } from "features/game/lib/SFLDiscount";

export function isCollectible(
  item: SeasonalStoreItem,
): item is SeasonalStoreCollectible {
  return "collectible" in item;
}

export type BuySeasonalItemAction = {
  type: "seasonalItem.bought";
  name: BumpkinItem | InventoryItemName;
  tier: SeasonalStoreTier;
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

    const seasonalCollectiblesCrafted = getSeasonalItemsCrafted(
      state,
      "inventory",
      seasonalStore,
      "collectible",
      tier,
      true,
    );
    const seasonalWearablesCrafted = getSeasonalItemsCrafted(
      state,
      "wardrobe",
      seasonalStore,
      "wearable",
      tier,
      true,
    );
    const seasonalItemsCrafted =
      seasonalCollectiblesCrafted + seasonalWearablesCrafted;

    const isKey = (name: InventoryItemName): name is Keys =>
      name in ARTEFACT_SHOP_KEYS;
    const keyBoughtAt =
      stateCopy.pumpkinPlaza.keysBought?.megastore[name as Keys]?.boughtAt;

    const reduction = isKeyBoughtWithinSeason(state, tier, true) ? 0 : 1;

    // Check if player meets the tier requirement
    if (tier !== "basic") {
      if (
        tier === "rare" &&
        seasonalItemsCrafted - reduction < seasonalStore.rare.requirement
      ) {
        throw new Error(
          "You need to buy more basic items to unlock rare items",
        );
      }

      if (
        tier === "epic" &&
        seasonalItemsCrafted - reduction < seasonalStore.epic.requirement
      ) {
        throw new Error(
          "You need to buy more basic and rare items to unlock epic items",
        );
      }

      if (
        tier === "mega" &&
        seasonalItemsCrafted - reduction < seasonalStore.mega.requirement
      ) {
        throw new Error("You need to buy more epic items to unlock mega items");
      }
    }

    // Check if player has enough resources
    const { sfl, items } = item.cost;

    const _sfl = SFLDiscount(state, new Decimal(sfl));

    if (stateCopy.balance.lessThan(_sfl)) {
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
    stateCopy.balance = stateCopy.balance.minus(_sfl);
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

    // This is where the key is bought
    if (isKey(name as InventoryItemName)) {
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

// Function to assess if key is bought within the current season
export function isKeyBoughtWithinSeason(
  game: GameState,
  tier: keyof SeasonalStore,
  isLowerTier = false,
) {
  const tierKey =
    isLowerTier && tier === "rare"
      ? "Treasure Key"
      : isLowerTier && tier === "epic"
        ? "Rare Key"
        : isLowerTier && tier === "mega"
          ? "Luxury Key"
          : tier === "basic"
            ? "Treasure Key"
            : tier === "rare"
              ? "Rare Key"
              : "Luxury Key";

  const keyBoughtAt =
    game.pumpkinPlaza.keysBought?.megastore[tierKey as Keys]?.boughtAt;
  const seasonTime = SEASONS[getCurrentSeason()];

  if (keyBoughtAt) {
    const isWithinSeason =
      new Date(keyBoughtAt) >= seasonTime.startDate &&
      new Date(keyBoughtAt) <= seasonTime.endDate;

    return isWithinSeason;
  }

  return false;
}

const tierMapping: Record<keyof SeasonalStore, keyof SeasonalStore> = {
  basic: "basic",
  rare: "basic",
  epic: "rare",
  mega: "epic",
};

//Gets lower Tier
export function getLowerTier(tiers: keyof SeasonalStore, isLowerTier = true) {
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return selectedTier;
}

export function getStore(
  seasonalStore: SeasonalStore,
  tiers: keyof SeasonalStore,
  isLowerTier = false,
) {
  // Select lower tier if isLowerTier is true, otherwise select the provided tier
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return seasonalStore[selectedTier];
}

export function getTierItems(
  seasonalStore: SeasonalStore,
  tiers: keyof SeasonalStore,
  isLowerTier = false,
): SeasonalStoreItem[] {
  // Select lower tier if isLowerTier is true, otherwise select the provided tier
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return seasonalStore[selectedTier].items;
}

export function getSeasonalItemsCrafted(
  game: GameState,
  items: "wardrobe" | "inventory",
  seasonalStore: SeasonalStore,
  itemType: "collectible" | "wearable",
  tier: keyof SeasonalStore,
  isLowerTier = false,
) {
  const tierItems = getTierItems(seasonalStore, tier, isLowerTier);
  if (!tierItems) return 0;

  const craftedItems = getKeys(game[items]).filter((itemName) =>
    tierItems.some(
      (tierItem: SeasonalStoreItem) =>
        (itemType === "collectible" &&
          "collectible" in tierItem &&
          tierItem.collectible === itemName) ||
        (itemType === "wearable" &&
          "wearable" in tierItem &&
          tierItem.wearable === itemName) ||
        0,
    ),
  );
  if (!craftedItems) return 0;

  return craftedItems.length > 0 ? craftedItems.length : 0;
}
