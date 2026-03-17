import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  CraftingQueueItem,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { produce } from "immer";

export type CollectCraftingAction = {
  type: "crafting.collected";
};

type Options = {
  state: Readonly<GameState>;
  action: CollectCraftingAction;
  createdAt?: number;
};

function collectQueueItem(item: CraftingQueueItem, game: GameState): void {
  if (item.type === "collectible") {
    const name = item.name as InventoryItemName;
    game.inventory[name] = (game.inventory[name] || new Decimal(0)).plus(1);
  } else {
    const name = item.name as BumpkinItem;
    game.wardrobe[name] = (game.wardrobe[name] || 0) + 1;
  }
  game.farmActivity = trackFarmActivity(
    `${item.name} Crafted`,
    game.farmActivity,
  );
}

export function collectCrafting({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { craftingBox } = copy;
    const queue = craftingBox.queue ?? [];

    if (queue.length === 0) {
      throw new Error("No item to collect");
    }

    const nothingReady = queue.every((item) => item.readyAt > createdAt);
    if (nothingReady) {
      throw new Error("No items are ready");
    }

    const remainingQueue = queue.filter((item) => {
      if (item.readyAt <= createdAt) {
        collectQueueItem(item, copy);
        return false;
      }
      return true;
    });

    copy.craftingBox.queue = remainingQueue;

    if (remainingQueue.length === 0) {
      copy.craftingBox.status = "idle";
    }
  });
}
