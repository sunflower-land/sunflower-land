import Decimal from "decimal.js-light";
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
  SeasonalStoreWearable,
  SeasonalTierItemName,
} from "features/game/types/megastore";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import { trackFarmActivity } from "features/game/types/farmActivity";

export function isCollectible(
  item: SeasonalStoreItem,
): item is SeasonalStoreCollectible {
  return "collectible" in item;
}

export function isWearable(
  item: SeasonalStoreItem,
): item is SeasonalStoreWearable {
  return "wearable" in item;
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

export type FlowerBox =
  | "Bronze Flower Box"
  | "Silver Flower Box"
  | "Gold Flower Box";

export const FLOWER_BOXES: Record<FlowerBox, true> = {
  "Bronze Flower Box": true,
  "Silver Flower Box": true,
  "Gold Flower Box": true,
};

export function buySeasonalItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
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
      seasonalStore,
      "collectible",
      tier,
      true,
    );
    const seasonalWearablesCrafted = getSeasonalItemsCrafted(
      state,
      seasonalStore,
      "wearable",
      tier,
      true,
    );
    const seasonalItemsCrafted =
      seasonalCollectiblesCrafted + seasonalWearablesCrafted;

    const keyReduction = isKeyBoughtWithinSeason(state, tier, true) ? 0 : 1;
    const boxReduction = isBoxBoughtWithinSeason(state, tier, true) ? 0 : 1;
    const petEggReduction = isPetEggBoughtWithinSeason(state, tier, true)
      ? 0
      : 1;
    const reduction = keyReduction + boxReduction + petEggReduction;

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

    // Ensure items without a cooldown, can only be bought once
    if (!item.cooldownMs) {
      const itemCrafted =
        copy.farmActivity[`${name as SeasonalTierItemName} Bought`];

      if (itemCrafted) {
        throw new Error("This item has already been crafted");
      }
    }

    // Check if player has enough resources
    const { sfl, items } = item.cost;

    const _sfl = SFLDiscount(state, new Decimal(sfl));

    if (copy.balance.lessThan(_sfl)) {
      throw new Error("Insufficient SFL");
    }

    for (const [itemName, amount] of Object.entries(items)) {
      const inventoryAmount =
        copy.inventory[itemName as InventoryItemName] || new Decimal(0);
      if (inventoryAmount.lessThan(amount)) {
        throw new Error(`Insufficient ${itemName}`);
      }
    }

    // Deduct resources
    copy.balance = copy.balance.minus(_sfl);
    for (const [itemName, amount] of Object.entries(items)) {
      copy.inventory[itemName as InventoryItemName] = (
        copy.inventory[itemName as InventoryItemName] || new Decimal(0)
      ).minus(amount);
    }

    // Add item to inventory
    if (isCollectible(item)) {
      const current = copy.inventory[item.collectible] ?? new Decimal(0);
      copy.inventory[item.collectible] = current.add(1);
    } else {
      const current = copy.wardrobe[item.wearable] ?? 0;

      copy.wardrobe[item.wearable] = current + 1;
    }

    // This is where the key is bought
    if (item.cooldownMs) {
      const boughtAt = copy.megastore?.boughtAt[name as SeasonalTierItemName];
      if (boughtAt) {
        if (boughtAt + item.cooldownMs > createdAt) {
          throw new Error("Item cannot be bought while in cooldown");
        }
      }
    }

    copy.farmActivity = trackFarmActivity(
      `${name as SeasonalTierItemName} Bought`,
      copy.farmActivity,
    );

    if (!copy.megastore) {
      copy.megastore = { boughtAt: {} };
    }

    copy.megastore.boughtAt[name as SeasonalTierItemName] = createdAt;

    return copy;
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

  let keyBoughtAt = game.megastore?.boughtAt[tierKey as SeasonalTierItemName];

  // We changed to a new field. From May 1st can remove this code
  if (!keyBoughtAt) {
    keyBoughtAt =
      game.pumpkinPlaza.keysBought?.megastore?.[tierKey as Keys]?.boughtAt;
  }

  const seasonTime = SEASONS[getCurrentSeason()];
  const historyKey =
    game.farmActivity[`${tierKey as SeasonalTierItemName} Bought`];
  //If player has no history of buying keys at megastore
  if (!keyBoughtAt && isLowerTier && !historyKey) return true;

  // Returns false if key is bought outside current season, otherwise, true
  if (keyBoughtAt) {
    const isWithinSeason =
      new Date(keyBoughtAt) >= seasonTime.startDate &&
      new Date(keyBoughtAt) <= seasonTime.endDate;
    return isWithinSeason;
  }

  // This will only be triggered if isLowerTier is false
  return false;
}

// Function to assess if Flower Box is bought within the current season
export function isBoxBoughtWithinSeason(
  game: GameState,
  tier: keyof SeasonalStore,
  isLowerTier = false,
) {
  const tierBox =
    isLowerTier && tier === "rare"
      ? "Bronze Flower Box"
      : isLowerTier && tier === "epic"
        ? "Silver Flower Box"
        : isLowerTier && tier === "mega"
          ? "Gold Flower Box"
          : tier === "basic"
            ? "Bronze Flower Box"
            : tier === "rare"
              ? "Silver Flower Box"
              : "Gold Flower Box";

  let boxBoughtAt = game.megastore?.boughtAt[tierBox as SeasonalTierItemName];

  // We changed to a new field. From May 1st can remove this code
  if (!boxBoughtAt) {
    boxBoughtAt =
      game.pumpkinPlaza.keysBought?.megastore?.[tierBox as Keys]?.boughtAt;
  }

  const seasonTime = SEASONS[getCurrentSeason()];
  const historyBox =
    game.farmActivity[`${tierBox as SeasonalTierItemName} Bought`];

  //If player has no history of buying keys at megastore
  if (!boxBoughtAt && isLowerTier && !historyBox) return true;
  // Returns false if key is bought outside current season, otherwise, true
  if (boxBoughtAt) {
    const isWithinSeason =
      new Date(boxBoughtAt) >= seasonTime.startDate &&
      new Date(boxBoughtAt) <= seasonTime.endDate;
    return isWithinSeason;
  }

  // This will only be triggered if isLowerTier is false
  return false;
}

export function isPetEggBoughtWithinSeason(
  game: GameState,
  tier: keyof SeasonalStore,
  isLowerTier = false,
) {
  const tierToEvaluate = isLowerTier ? tierMapping[tier] : tier;

  if (tier !== "mega" && !(isLowerTier && tierToEvaluate === "epic")) {
    return true;
  }

  const petEggActivityName = "Pet Egg Bought";
  const petEggHistory = game.farmActivity[petEggActivityName];

  if (!petEggHistory) {
    return true;
  }

  const petEggBoughtAt =
    game.megastore?.boughtAt["Pet Egg" as SeasonalTierItemName];

  if (!petEggBoughtAt) {
    return false;
  }

  const seasonTime = SEASONS[getCurrentSeason()];
  const boughtDate = new Date(petEggBoughtAt);

  return boughtDate >= seasonTime.startDate && boughtDate <= seasonTime.endDate;
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
  seasonalStore: SeasonalStore,
  itemType: "collectible" | "wearable",
  tier: keyof SeasonalStore,
  isLowerTier = false,
) {
  const tierItems = getTierItems(seasonalStore, tier, isLowerTier);
  if (!tierItems) return 0;

  const craftedItems = tierItems.filter(
    (tierItem: SeasonalStoreItem) =>
      (itemType === "collectible" &&
        "collectible" in tierItem &&
        game.farmActivity[
          `${tierItem.collectible as SeasonalTierItemName} Bought`
        ]) ||
      (itemType === "wearable" &&
        "wearable" in tierItem &&
        game.farmActivity[
          `${tierItem.wearable as SeasonalTierItemName} Bought`
        ]),
  );

  if (!craftedItems) return 0;

  return craftedItems.length > 0 ? craftedItems.length : 0;
}
