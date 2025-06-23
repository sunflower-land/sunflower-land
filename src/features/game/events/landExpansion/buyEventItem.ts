import Decimal from "decimal.js-light";
import { GameState, InventoryItemName, Keys } from "features/game/types/game";

import { produce } from "immer";
import { getCurrentSeason, SEASONS } from "features/game/types/seasons";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  EVENTMEGASTORE,
  EventStore,
  EventStoreCollectible,
  EventStoreItem,
  EventStoreTier,
  EventStoreWearable,
  EventTierItemName,
} from "features/game/types/eventmegastore";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import { trackActivity } from "features/game/types/bumpkinActivity";

export function isCollectible(
  item: EventStoreItem,
): item is EventStoreCollectible {
  return "collectible" in item;
}

export function isWearable(item: EventStoreItem): item is EventStoreWearable {
  return "wearable" in item;
}

export type BuyEventItemAction = {
  type: "eventItem.bought";
  name: BumpkinItem | InventoryItemName;
  tier: EventStoreTier;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyEventItemAction;
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

export function buyEventItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { name, tier } = action;

    const currentSeason = getCurrentSeason(new Date(createdAt));
    const eventStore = EVENTMEGASTORE[currentSeason];

    if (!eventStore) {
      throw new Error("Event store not found");
    }

    const tierItems = eventStore[tier].items;
    const item = tierItems.find((item) =>
      item
        ? isCollectible(item)
          ? item.collectible === name
          : item.wearable === name
        : undefined,
    );

    if (!item) {
      throw new Error("Item not found in the event store");
    }

    const eventCollectiblesCrafted = getEventItemsCrafted(
      state,
      eventStore,
      "collectible",
      tier,
      true,
    );
    const eventWearablesCrafted = getEventItemsCrafted(
      state,
      eventStore,
      "wearable",
      tier,
      true,
    );
    const eventItemsCrafted = eventCollectiblesCrafted + eventWearablesCrafted;

    const keyReduction = isKeyBoughtWithinSeason(state, tier, true) ? 0 : 1;
    const boxReduction = isBoxBoughtWithinSeason(state, tier, true) ? 0 : 1;
    const reduction = keyReduction + boxReduction;

    // Check if player meets the tier requirement
    if (tier !== "basic") {
      if (
        tier === "rare" &&
        eventItemsCrafted - reduction < eventStore.rare.requirement
      ) {
        throw new Error(
          "You need to buy more basic items to unlock rare items",
        );
      }

      if (
        tier === "epic" &&
        eventItemsCrafted - reduction < eventStore.epic.requirement
      ) {
        throw new Error(
          "You need to buy more basic and rare items to unlock epic items",
        );
      }

      if (
        tier === "mega" &&
        eventItemsCrafted - reduction < eventStore.mega.requirement
      ) {
        throw new Error("You need to buy more epic items to unlock mega items");
      }
    }

    // Ensure items without a cooldown, can only be bought once
    if (!item.cooldownMs) {
      const itemCrafted =
        copy.bumpkin.activity[`${name as EventTierItemName} Bought`];

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
      const boughtAt = copy.megastore?.boughtAt[name as EventTierItemName];
      if (boughtAt) {
        if (boughtAt + item.cooldownMs > createdAt) {
          throw new Error("Item cannot be bought while in cooldown");
        }
      }
    }

    copy.bumpkin.activity = trackActivity(
      `${name as EventTierItemName} Bought`,
      copy.bumpkin.activity,
    );

    if (!copy.megastore) {
      copy.megastore = { boughtAt: {} };
    }

    copy.megastore.boughtAt[name as EventTierItemName] = createdAt;

    return copy;
  });
}

// Function to assess if key is bought within the current season
export function isKeyBoughtWithinSeason(
  game: GameState,
  tier: keyof EventStore,
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

  let keyBoughtAt = game.megastore?.boughtAt[tierKey as EventTierItemName];

  // We changed to a new field. From May 1st can remove this code
  if (!keyBoughtAt) {
    keyBoughtAt =
      game.pumpkinPlaza.keysBought?.megastore?.[tierKey as Keys]?.boughtAt;
  }

  const seasonTime = SEASONS[getCurrentSeason()];
  const historyKey =
    game.bumpkin.activity[`${tierKey as EventTierItemName} Bought`];
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
  tier: keyof EventStore,
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

  let boxBoughtAt = game.megastore?.boughtAt[tierBox as EventTierItemName];

  // We changed to a new field. From May 1st can remove this code
  if (!boxBoughtAt) {
    boxBoughtAt =
      game.pumpkinPlaza.keysBought?.megastore?.[tierBox as Keys]?.boughtAt;
  }

  const seasonTime = SEASONS[getCurrentSeason()];
  const historyBox =
    game.bumpkin.activity[`${tierBox as EventTierItemName} Bought`];

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

const tierMapping: Record<keyof EventStore, keyof EventStore> = {
  basic: "basic",
  rare: "basic",
  epic: "rare",
  mega: "epic",
};

//Gets lower Tier
export function getLowerTier(tiers: keyof EventStore, isLowerTier = true) {
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return selectedTier;
}

export function getStore(
  eventStore: EventStore,
  tiers: keyof EventStore,
  isLowerTier = false,
) {
  // Select lower tier if isLowerTier is true, otherwise select the provided tier
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return eventStore[selectedTier];
}

export function getTierItems(
  eventStore: EventStore,
  tiers: keyof EventStore,
  isLowerTier = false,
): EventStoreItem[] {
  // Select lower tier if isLowerTier is true, otherwise select the provided tier
  const selectedTier = isLowerTier ? tierMapping[tiers] : tiers;
  return eventStore[selectedTier].items;
}

export function getEventItemsCrafted(
  game: GameState,
  eventStore: EventStore,
  itemType: "collectible" | "wearable",
  tier: keyof EventStore,
  isLowerTier = false,
) {
  const tierItems = getTierItems(eventStore, tier, isLowerTier);
  if (!tierItems) return 0;

  const craftedItems = tierItems.filter(
    (tierItem: EventStoreItem) =>
      (itemType === "collectible" &&
        "collectible" in tierItem &&
        game.bumpkin.activity[
          `${tierItem.collectible as EventTierItemName} Bought`
        ]) ||
      (itemType === "wearable" &&
        "wearable" in tierItem &&
        game.bumpkin.activity[
          `${tierItem.wearable as EventTierItemName} Bought`
        ]),
  );

  if (!craftedItems) return 0;

  return craftedItems.length > 0 ? craftedItems.length : 0;
}
