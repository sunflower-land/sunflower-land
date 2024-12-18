import Decimal from "decimal.js-light";
import { ITEM_IDS, BumpkinItem } from "features/game/types/bumpkin";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/decorations";
import { GameState, InventoryItemName } from "features/game/types/game";
import { GARBAGE, GarbageName } from "features/game/types/garbage";
import { produce } from "immer";
import { availableWardrobe } from "./equip";

export type SellGarbageAction = {
  type: "garbage.sold";
  item: GarbageName;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SellGarbageAction;
};

export const isWearable = (item: InventoryItemName | BumpkinItem) =>
  item in ITEM_IDS;

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

    const isWearableItem = isWearable(item);
    const count = isWearableItem
      ? availableWardrobe(state)[item as BumpkinItem] ?? 0
      : inventory[item as InventoryItemName] ?? new Decimal(0);

    // Check if enough quantity
    if (isWearableItem) {
      if (Number(count) < amount) {
        throw new Error("Insufficient quantity to sell");
      }
    } else {
      if (new Decimal(count).lessThan(amount)) {
        throw new Error("Insufficient quantity to sell");
      }
    }

    // Check limits
    const { limit = 0 } = GARBAGE[item];
    if (
      (isWearableItem && Number(count) - amount < limit) ||
      (!isWearableItem && new Decimal(count).sub(amount).lessThan(limit))
    ) {
      throw new Error("Limit Reached");
    }

    // Handle coins
    const { sellPrice = 0 } = GARBAGE[item];
    if (sellPrice) {
      const coinsEarned = sellPrice * amount;
      bumpkin.activity = trackActivity(
        "Coins Earned",
        bumpkin.activity,
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
      getKeys(items).forEach((itemName) => {
        const previous = inventory[itemName] ?? new Decimal(0);
        inventory[itemName] = previous.add(
          GARBAGE[item].items?.[itemName] ?? 0,
        );
      });
    }

    // Track activity
    bumpkin.activity = trackActivity(
      `${item} Sold`,
      bumpkin?.activity,
      new Decimal(amount),
    );

    // Update inventory/wardrobe
    if (isWearableItem) {
      wardrobe[item as BumpkinItem] =
        (wardrobe[item as BumpkinItem] ?? 0) - amount;
    } else {
      inventory[item as InventoryItemName] =
        inventory[item as InventoryItemName]?.sub(amount) ??
        new Decimal(0).sub(amount);
    }

    return game;
  });
}
