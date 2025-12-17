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
    const item = tierItems.find((item) =>
      item
        ? isCollectible(item)
          ? item.collectible === name
          : item.wearable === name
        : undefined,
    );

    if (!item) {
      throw new Error("Item not found in the chapter store");
    }

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

    // Ensure items without a cooldown, can only be bought once
    if (!item.cooldownMs) {
      const itemCrafted =
        copy.farmActivity[`${name as ChapterTierItemName} Bought`];

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
      const boughtAt = copy.megastore?.boughtAt[name as ChapterTierItemName];
      if (boughtAt) {
        if (boughtAt + item.cooldownMs > createdAt) {
          throw new Error("Item cannot be bought while in cooldown");
        }
      }
    }

    copy.farmActivity = trackFarmActivity(
      `${name as ChapterTierItemName} Bought`,
      copy.farmActivity,
    );

    if (!copy.megastore) {
      copy.megastore = { boughtAt: {} };
    }

    copy.megastore.boughtAt[name as ChapterTierItemName] = createdAt;

    return copy;
  });
}

// Function to assess if key is bought within the current chapter
export function isKeyBoughtWithinChapter(
  game: GameState,
  tier: keyof ChapterStore,
  now: number,
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

  let keyBoughtAt = game.megastore?.boughtAt[tierKey as ChapterTierItemName];

  // We changed to a new field. From May 1st can remove this code
  if (!keyBoughtAt) {
    keyBoughtAt =
      game.pumpkinPlaza.keysBought?.megastore?.[tierKey as Keys]?.boughtAt;
  }

  const chapterTime = CHAPTERS[getCurrentChapter(now)];
  const historyKey =
    game.farmActivity[`${tierKey as ChapterTierItemName} Bought`];
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

// Function to assess if Flower Box is bought within the current chapter
export function isBoxBoughtWithinChapter(
  game: GameState,
  tier: keyof ChapterStore,
  now: number,
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

  let boxBoughtAt = game.megastore?.boughtAt[tierBox as ChapterTierItemName];

  // We changed to a new field. From May 1st can remove this code
  if (!boxBoughtAt) {
    boxBoughtAt =
      game.pumpkinPlaza.keysBought?.megastore?.[tierBox as Keys]?.boughtAt;
  }

  const chapterTime = CHAPTERS[getCurrentChapter(now)];
  const historyBox =
    game.farmActivity[`${tierBox as ChapterTierItemName} Bought`];

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

  const petEggActivityName = "Pet Egg Bought";
  const petEggHistory = game.farmActivity[petEggActivityName];

  if (!petEggHistory) {
    return true;
  }

  const petEggBoughtAt =
    game.megastore?.boughtAt["Pet Egg" as ChapterTierItemName];

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

  const craftedItems = tierItems.filter(
    (tierItem: ChapterStoreItem) =>
      (itemType === "collectible" &&
        "collectible" in tierItem &&
        game.farmActivity[
          `${tierItem.collectible as ChapterTierItemName} Bought`
        ]) ||
      (itemType === "wearable" &&
        "wearable" in tierItem &&
        game.farmActivity[
          `${tierItem.wearable as ChapterTierItemName} Bought`
        ]),
  );

  if (!craftedItems) return 0;

  return craftedItems.length > 0 ? craftedItems.length : 0;
}
