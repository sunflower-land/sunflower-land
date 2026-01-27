import { GameState, InventoryItemName } from "features/game/types/game";

import { produce } from "immer";
import {
  CHAPTER_STORES,
  getCurrentChapter,
  isChapterCollectible,
} from "features/game/types/chapters";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import { BumpkinItem } from "features/game/types/bumpkin";
import Decimal from "decimal.js-light";

export type BuyChapterStoreAction = {
  type: "chapterStore.bought";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyChapterStoreAction;
  createdAt?: number;
};

export function buyChapterStore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const chapterName = getCurrentChapter(createdAt);

    if (!copy.chapter) {
      throw new Error("Chapter not started");
    }

    if (copy.chapter.name !== chapterName) {
      throw new Error("Chapter not active");
    }

    // Check if they have already bought this item.
    const previous = copy.chapter.boughtAt?.[action.id];
    if (previous) {
      throw new Error("Item already bought");
    }

    const store = CHAPTER_STORES[chapterName];

    if (!store) {
      throw new Error("Chapter store not found");
    }

    const item = store[action.id];
    if (!item) {
      throw new Error("Item not found in the chapter store");
    }

    // Has the sfl balance?
    const cost = SFLDiscount(copy, new Decimal(item.cost.sfl ?? 0));
    const balance = copy.balance;
    if (balance.lt(cost)) {
      throw new Error("Insufficient SFL");
    }

    copy.balance = balance.minus(cost);

    // Subtract the item cost
    if (item.cost.items) {
      for (const [itemName, amount] of Object.entries(item.cost.items)) {
        const previous =
          copy.inventory[itemName as InventoryItemName] ?? new Decimal(0);
        if (previous.lt(amount)) {
          throw new Error(`Insufficient ${itemName}`);
        }

        copy.inventory[itemName as InventoryItemName] = previous.minus(amount);
      }
    }

    // Add the item
    if (isChapterCollectible(item)) {
      const previous =
        copy.inventory[item.collectible as InventoryItemName] ?? new Decimal(0);
      copy.inventory[item.collectible as InventoryItemName] = previous.add(1);
    } else {
      const previous = copy.wardrobe[item.wearable as BumpkinItem] ?? 0;
      copy.wardrobe[item.wearable as BumpkinItem] = previous + 1;
    }

    // Record as bought
    copy.chapter.boughtAt[action.id] = createdAt;

    // TODO: trackFarmActivity

    return copy;
  });
}
