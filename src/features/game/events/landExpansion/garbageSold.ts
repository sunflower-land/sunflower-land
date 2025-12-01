import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { GameState, InventoryItemName } from "features/game/types/game";
import { GARBAGE, GarbageName } from "features/game/types/garbage";
import { produce } from "immer";
import { KNOWN_IDS } from "features/game/types";
import { availableWardrobe } from "./equip";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { getObjectEntries } from "features/game/expansion/lib/utils";

export type SellGarbageAction = {
  type: "garbage.sold";
  item: GarbageName;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SellGarbageAction;
};

export const isCollectible = (
  item: InventoryItemName | BumpkinItem,
): item is InventoryItemName => item in KNOWN_IDS;

export const getItemCount = (item: GarbageName, state: GameState): Decimal => {
  const { inventory, wardrobe } = state;
  let count: number | Decimal;

  // Get initial count based on item type
  const isChestItem =
    item === "Water Well" || item === "Hen House" || item === "Tent";

  if (!isCollectible(item)) {
    count = availableWardrobe(state)[item] ?? 0;
  } else if (isChestItem) {
    count = getChestItems(state)[item] ?? new Decimal(0);
  } else {
    count = inventory[item] ?? new Decimal(0);
  }

  // Handle item limits
  const sellLimit = GARBAGE[item].limit;
  if (!sellLimit) {
    return new Decimal(count);
  }

  if (isCollectible(item) && isChestItem) {
    const inventoryAmount = inventory[item]?.toNumber() ?? 0;
    if (inventoryAmount <= 1) return new Decimal(0);

    const unplacedAmount = getChestItems(state)[item]?.toNumber() ?? 0;
    count = Math.min(unplacedAmount, sellLimit);
  }

  if (!isCollectible(item)) {
    const wardrobeAmount = wardrobe[item] ?? 0;
    if (wardrobeAmount <= 1) return new Decimal(0);

    const unequippedAmount = availableWardrobe(state)[item] ?? 0;
    count = Math.min(unequippedAmount, sellLimit);
  }

  return new Decimal(count);
};

export function sellGarbage({ state, action }: Options) {
  return produce(state, (game) => {
    const { item, amount } = action;
    const { bumpkin, inventory, wardrobe } = game;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    if (!(item in GARBAGE)) {
      throw new Error("Not for sale");
    }

    if (!new Decimal(amount).isInteger()) {
      throw new Error("Invalid amount");
    }
    const isCollectibleItem = isCollectible(item);

    const count = getItemCount(item, game);

    // Check if enough quantity
    if (!isCollectibleItem) {
      if (Number(count) < amount) {
        throw new Error("Insufficient quantity to sell");
      }
    } else {
      if (new Decimal(count).lessThan(amount)) {
        throw new Error("Insufficient quantity to sell");
      }
    }

    // Handle coins
    const { sellPrice = 0 } = GARBAGE[item];
    if (sellPrice) {
      const coinsEarned = sellPrice * amount;
      game.farmActivity = trackFarmActivity(
        "Coins Earned",
        game.farmActivity,
        new Decimal(coinsEarned),
      );
      game.coins += coinsEarned;
    }

    // Handle gems
    const gems = GARBAGE[item].gems ?? 0;
    if (gems) {
      const previous = inventory.Gem ?? new Decimal(0);
      inventory.Gem = previous.add(gems * amount);
    }

    // Handle additional items
    const items = GARBAGE[item].items;
    if (items) {
      getObjectEntries(items).forEach(([itemName, quantity]) => {
        inventory[itemName] = (inventory[itemName] ?? new Decimal(0)).add(
          (quantity ?? new Decimal(0)).mul(amount),
        );
      });
    }

    // Track activity
    game.farmActivity = trackFarmActivity(
      `${item} Sold`,
      game.farmActivity,
      new Decimal(amount),
    );

    // Update inventory/wardrobe
    if (!isCollectibleItem) {
      wardrobe[item] = (wardrobe[item] ?? 0) - amount;
    } else {
      inventory[item] =
        inventory[item]?.sub(amount) ?? new Decimal(0).sub(amount);
    }

    return game;
  });
}
