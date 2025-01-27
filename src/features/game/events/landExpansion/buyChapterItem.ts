import Decimal from "decimal.js-light";
import { GameState, InventoryItemName, Keys } from "features/game/types/game";

import { produce } from "immer";
import { getCurrentChapter, CHAPTERS } from "features/game/types/chapters";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  MEGASTORE,
  ChapterStore,
  ChapterStoreCollectible,
  ChapterStoreItem,
  ChapterStoreTier,
  ChapterTierItemName,
} from "features/game/types/megastore";
import { ARTEFACT_SHOP_KEYS } from "features/game/types/collectibles";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import { trackActivity } from "features/game/types/bumpkinActivity";

export function isCollectible(
  item: ChapterStoreItem,
): item is ChapterStoreCollectible {
  return "collectible" in item;
}

export type BuyChapterItemAction = {
  type: "chapterItem.bought";
  name: BumpkinItem | InventoryItemName;
  tier: ChapterStoreTier;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyChapterItemAction;
  createdAt?: number;
};

export function buySeasonalItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { name, tier } = action;

    const currentChapter = getCurrentChapter(new Date(createdAt));
    const chapterStore = MEGASTORE[currentChapter];

    if (!chapterStore) {
      throw new Error("Seasonal store not found");
    }

    const tierItems = chapterStore[tier].items;
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

    const seasonalCollectiblesCrafted = getChapterItemsCrafted(
      state,
      chapterStore,
      "collectible",
      tier,
      true,
    );
    const seasonalWearablesCrafted = getChapterItemsCrafted(
      state,
      chapterStore,
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
        seasonalItemsCrafted - reduction < chapterStore.rare.requirement
      ) {
        throw new Error(
          "You need to buy more basic items to unlock rare items",
        );
      }

      if (
        tier === "epic" &&
        seasonalItemsCrafted - reduction < chapterStore.epic.requirement
      ) {
        throw new Error(
          "You need to buy more basic and rare items to unlock epic items",
        );
      }

      if (
        tier === "mega" &&
        seasonalItemsCrafted - reduction < chapterStore.mega.requirement
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

    stateCopy.bumpkin.activity = trackActivity(
      `${name as ChapterTierItemName} Bought`,
      stateCopy.bumpkin.activity,
    );
    return stateCopy;
  });
}

// Function to assess if key is bought within the current season
export function isKeyBoughtWithinSeason(
  game: GameState,
  tier: keyof ChapterStore,
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
  const chapterTime = CHAPTERS[getCurrentChapter()];
  const historyKey =
    game.bumpkin.activity[`${tierKey as ChapterTierItemName} Bought`];
  //If player has no history of buying keys at megastore
  if (!keyBoughtAt && isLowerTier && !historyKey) return true;

  // Returns false if key is bought outside current season, otherwise, true
  if (keyBoughtAt) {
    const isWithinSeason =
      new Date(keyBoughtAt) >= chapterTime.startDate &&
      new Date(keyBoughtAt) <= chapterTime.endDate;
    return isWithinSeason;
  }

  // This will only be triggered if isLowerTier is false
  return false;
}

const tierMapping: Record<keyof ChapterStore, keyof ChapterStore> = {
  basic: "basic",
  rare: "basic",
  epic: "rare",
  mega: "epic",
};

//Gets lower Tier
export function getLowerTier(tiers: keyof ChapterStore, isLowerTier = true) {
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return selectedTier;
}

export function getStore(
  chap: ChapterStore,
  tiers: keyof ChapterStore,
  isLowerTier = false,
) {
  // Select lower tier if isLowerTier is true, otherwise select the provided tier
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return chap[selectedTier];
}

export function getTierItems(
  chap: ChapterStore,
  tiers: keyof ChapterStore,
  isLowerTier = false,
): ChapterStoreItem[] {
  // Select lower tier if isLowerTier is true, otherwise select the provided tier
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return chap[selectedTier].items;
}

export function getChapterItemsCrafted(
  game: GameState,
  chapterStore: ChapterStore,
  itemType: "collectible" | "wearable",
  tier: keyof ChapterStore,
  isLowerTier = false,
) {
  const tierItems = getTierItems(chapterStore, tier, isLowerTier);
  if (!tierItems) return 0;

  const craftedItems = tierItems.filter(
    (tierItem: ChapterStoreItem) =>
      (itemType === "collectible" &&
        "collectible" in tierItem &&
        game.bumpkin.activity[
          `${tierItem.collectible as ChapterTierItemName} Bought`
        ]) ||
      (itemType === "wearable" &&
        "wearable" in tierItem &&
        game.bumpkin.activity[
          `${tierItem.wearable as ChapterTierItemName} Bought`
        ]),
  );

  if (!craftedItems) return 0;

  return craftedItems.length > 0 ? craftedItems.length : 0;
}
