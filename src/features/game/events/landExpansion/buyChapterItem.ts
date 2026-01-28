import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";

import { produce } from "immer";
import { getCurrentChapter, CHAPTERS } from "features/game/types/chapters";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  MEGASTORE,
  ChapterStore,
  ChapterStoreCollectible,
  ChapterStoreItem,
  ChapterStoreTier,
  ChapterStoreWearable,
  ChapterTierItemName,
} from "features/game/types/megastore";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import { trackFarmActivity } from "features/game/types/farmActivity";

export function isCollectible(
  item: ChapterStoreItem,
): item is ChapterStoreCollectible {
  return "collectible" in item;
}

export function isWearable(
  item: ChapterStoreItem,
): item is ChapterStoreWearable {
  return "wearable" in item;
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

export type FlowerBox =
  | "Bronze Flower Box"
  | "Silver Flower Box"
  | "Gold Flower Box";

export const FLOWER_BOXES: Record<FlowerBox, true> = {
  "Bronze Flower Box": true,
  "Silver Flower Box": true,
  "Gold Flower Box": true,
};

// Helper to get item name from a validated ChapterStoreItem
function getItemName(item: ChapterStoreItem): ChapterTierItemName {
  return isCollectible(item) ? item.collectible : item.wearable;
}

// Helper to create farm activity name from chapter item
function toBoughtActivityName(
  itemName: ChapterTierItemName,
): `${ChapterTierItemName} Bought` {
  return `${itemName} Bought`;
}

// Shared helper to check if an item was bought within the current chapter
// Used by both the event handler and UI to maintain consistency
export function isBoughtWithinCurrentChapter(
  boughtAt: number | undefined,
  now: number,
): boolean {
  if (!boughtAt) return false;

  const currentChapter = getCurrentChapter(now);
  const chapterTime = CHAPTERS[currentChapter];
  const boughtDate = new Date(boughtAt);

  return (
    boughtDate >= chapterTime.startDate && boughtDate <= chapterTime.endDate
  );
}

export function buyChapterItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { name, tier } = action;

    const currentChapter = getCurrentChapter(createdAt);
    const chapterStore = MEGASTORE[currentChapter];

    if (!chapterStore) {
      throw new Error("Chapter store not found");
    }

    const tierItems = chapterStore[tier].items;
    const item = tierItems.find((storeItem) =>
      storeItem
        ? isCollectible(storeItem)
          ? storeItem.collectible === name
          : storeItem.wearable === name
        : undefined,
    );

    if (!item) {
      throw new Error("Item not found in the chapter store");
    }

    // Get the validated item name from the store item
    const itemName = getItemName(item);
    const activityName = toBoughtActivityName(itemName);

    const chapterCollectiblesCrafted = getChapterItemsCrafted(
      state,
      chapterStore,
      "collectible",
      tier,
      true,
    );
    const chapterWearablesCrafted = getChapterItemsCrafted(
      state,
      chapterStore,
      "wearable",
      tier,
      true,
    );
    const chapterItemsCrafted =
      chapterCollectiblesCrafted + chapterWearablesCrafted;

    const keyReduction = isKeyBoughtWithinChapter(state, tier, createdAt, true)
      ? 0
      : 1;
    const boxReduction = isBoxBoughtWithinChapter(state, tier, createdAt, true)
      ? 0
      : 1;
    const petEggReduction = isPetEggBoughtWithinChapter(
      state,
      tier,
      createdAt,
      true,
    )
      ? 0
      : 1;
    const reduction = keyReduction + boxReduction + petEggReduction;

    // Check if player meets the tier requirement
    if (tier !== "basic") {
      if (
        tier === "rare" &&
        chapterItemsCrafted - reduction < chapterStore.rare.requirement
      ) {
        throw new Error(
          "You need to buy more basic items to unlock rare items",
        );
      }

      if (
        tier === "epic" &&
        chapterItemsCrafted - reduction < chapterStore.epic.requirement
      ) {
        throw new Error(
          "You need to buy more basic and rare items to unlock epic items",
        );
      }

      if (
        tier === "mega" &&
        chapterItemsCrafted - reduction < chapterStore.mega.requirement
      ) {
        throw new Error("You need to buy more epic items to unlock mega items");
      }
    }

    // Check if Pet Egg was already bought within the current chapter (one per chapter limit)
    if (itemName === "Pet Egg") {
      const petEggBoughtAt = copy.megastore?.boughtAt["Pet Egg"];
      const petEggPurchaseCount = copy.farmActivity["Pet Egg Bought"] ?? 0;

      // Primary check: boughtAt timestamp is within current chapter
      if (isBoughtWithinCurrentChapter(petEggBoughtAt, createdAt)) {
        throw new Error("Pet Egg already bought this chapter");
      }

      // Fallback for legacy data: if farmActivity shows a purchase but boughtAt is missing,
      // and we're in the chapter where Pet Egg was introduced, treat conservatively
      if (!petEggBoughtAt && petEggPurchaseCount > 0) {
        const petEggChapter = CHAPTERS["Paw Prints"];
        const nowDate = new Date(createdAt);
        const isInPetEggChapter =
          nowDate >= petEggChapter.startDate &&
          nowDate <= petEggChapter.endDate;

        if (isInPetEggChapter) {
          // Pet Egg was only introduced in Paw Prints, so any prior purchase must be from this chapter
          throw new Error("Pet Egg already bought this chapter");
        }
      }
    }

    // Ensure items without a cooldown, can only be bought once (except Pet Egg which uses chapter-based validation)
    if (!item.cooldownMs && itemName !== "Pet Egg") {
      const itemCrafted = copy.farmActivity[activityName];

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

    let costItemName: keyof typeof items;
    for (costItemName in items) {
      const amount = items[costItemName];
      if (amount === undefined) continue;
      const inventoryAmount = copy.inventory[costItemName] || new Decimal(0);
      if (inventoryAmount.lessThan(amount)) {
        throw new Error(`Insufficient ${costItemName}`);
      }
    }

    // Deduct resources
    copy.balance = copy.balance.minus(_sfl);
    for (costItemName in items) {
      const amount = items[costItemName];
      if (amount === undefined) continue;
      copy.inventory[costItemName] = (
        copy.inventory[costItemName] || new Decimal(0)
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
      const boughtAt = copy.megastore?.boughtAt[itemName];
      if (boughtAt) {
        if (boughtAt + item.cooldownMs > createdAt) {
          throw new Error("Item cannot be bought while in cooldown");
        }
      }
    }

    copy.farmActivity = trackFarmActivity(activityName, copy.farmActivity);

    if (!copy.megastore) {
      copy.megastore = { boughtAt: {} };
    }

    copy.megastore.boughtAt[itemName] = createdAt;

    return copy;
  });
}

type TierKey = "Treasure Key" | "Rare Key" | "Luxury Key";

function getTierKey(tier: keyof ChapterStore, isLowerTier: boolean): TierKey {
  if (isLowerTier) {
    if (tier === "rare") return "Treasure Key";
    if (tier === "epic") return "Rare Key";
    if (tier === "mega") return "Luxury Key";
  }
  if (tier === "basic") return "Treasure Key";
  if (tier === "rare") return "Rare Key";
  return "Luxury Key";
}

// Function to assess if key is bought within the current chapter
export function isKeyBoughtWithinChapter(
  game: GameState,
  tier: keyof ChapterStore,
  now: number,
  isLowerTier = false,
) {
  const tierKey = getTierKey(tier, isLowerTier);

  const keyBoughtAt = game.megastore?.boughtAt[tierKey];

  const chapterTime = CHAPTERS[getCurrentChapter(now)];
  const historyKey = game.farmActivity[toBoughtActivityName(tierKey)];
  //If player has no history of buying keys at megastore
  if (!keyBoughtAt && isLowerTier && !historyKey) return true;

  // Returns false if key is bought outside current chapter, otherwise, true
  if (keyBoughtAt) {
    const isWithinChapter =
      new Date(keyBoughtAt) >= chapterTime.startDate &&
      new Date(keyBoughtAt) <= chapterTime.endDate;
    return isWithinChapter;
  }

  // This will only be triggered if isLowerTier is false
  return false;
}

function getTierBox(tier: keyof ChapterStore, isLowerTier: boolean): FlowerBox {
  if (isLowerTier) {
    if (tier === "rare") return "Bronze Flower Box";
    if (tier === "epic") return "Silver Flower Box";
    if (tier === "mega") return "Gold Flower Box";
  }
  if (tier === "basic") return "Bronze Flower Box";
  if (tier === "rare") return "Silver Flower Box";
  return "Gold Flower Box";
}

// Function to assess if Flower Box is bought within the current chapter
export function isBoxBoughtWithinChapter(
  game: GameState,
  tier: keyof ChapterStore,
  now: number,
  isLowerTier = false,
) {
  const tierBox = getTierBox(tier, isLowerTier);

  const boxBoughtAt = game.megastore?.boughtAt[tierBox];

  const chapterTime = CHAPTERS[getCurrentChapter(now)];
  const historyBox = game.farmActivity[toBoughtActivityName(tierBox)];

  //If player has no history of buying keys at megastore
  if (!boxBoughtAt && isLowerTier && !historyBox) return true;
  // Returns false if key is bought outside current chapter, otherwise, true
  if (boxBoughtAt) {
    const isWithinChapter =
      new Date(boxBoughtAt) >= chapterTime.startDate &&
      new Date(boxBoughtAt) <= chapterTime.endDate;
    return isWithinChapter;
  }

  // This will only be triggered if isLowerTier is false
  return false;
}

export function isPetEggBoughtWithinChapter(
  game: GameState,
  tier: keyof ChapterStore,
  now: number,
  isLowerTier = false,
) {
  const tierToEvaluate = isLowerTier ? tierMapping[tier] : tier;

  if (tier !== "mega" && !(isLowerTier && tierToEvaluate === "epic")) {
    return true;
  }

  const petEggActivityName = toBoughtActivityName("Pet Egg");
  const petEggHistory = game.farmActivity[petEggActivityName];

  if (!petEggHistory) {
    return true;
  }

  const petEggBoughtAt = game.megastore?.boughtAt["Pet Egg"];

  if (!petEggBoughtAt) {
    return false;
  }

  const chapterTime = CHAPTERS[getCurrentChapter(now)];
  const boughtDate = new Date(petEggBoughtAt);

  return (
    boughtDate >= chapterTime.startDate && boughtDate <= chapterTime.endDate
  );
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
  chapterStore: ChapterStore,
  tiers: keyof ChapterStore,
  isLowerTier = false,
) {
  // Select lower tier if isLowerTier is true, otherwise select the provided tier
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return chapterStore[selectedTier];
}

export function getTierItems(
  chapterStore: ChapterStore,
  tiers: keyof ChapterStore,
  isLowerTier = false,
): ChapterStoreItem[] {
  // Select lower tier if isLowerTier is true, otherwise select the provided tier
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return chapterStore[selectedTier].items;
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

  const craftedItems = tierItems.filter((tierItem: ChapterStoreItem) => {
    if (itemType === "collectible" && isCollectible(tierItem)) {
      const activityName = toBoughtActivityName(tierItem.collectible);
      return game.farmActivity[activityName];
    }
    if (itemType === "wearable" && isWearable(tierItem)) {
      const activityName = toBoughtActivityName(tierItem.wearable);
      return game.farmActivity[activityName];
    }
    return false;
  });

  if (!craftedItems) return 0;

  return craftedItems.length > 0 ? craftedItems.length : 0;
}
