import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  CraftingQueueItem,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { RecipeCollectibleName } from "features/game/lib/crafting";
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
      const item = craftingBox.item;
      if (!item) {
        throw new Error("No item to collect");
      }
      if (craftingBox.readyAt > createdAt) {
        throw new Error("Item is not ready");
      }
      if (item.collectible) {
        copy.inventory[item.collectible] = (
          copy.inventory[item.collectible] || new Decimal(0)
        ).plus(1);
      }
      if (item.wearable) {
        copy.wardrobe[item.wearable] = (copy.wardrobe[item.wearable] || 0) + 1;
      }
      copy.farmActivity = trackFarmActivity(
        `${item.collectible || item.wearable} Crafted`,
        copy.farmActivity,
      );
      copy.craftingBox.status = "idle";
      copy.craftingBox.item = undefined;
      copy.craftingBox.queue = [];
      return;
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
      copy.craftingBox.item = undefined;
      copy.craftingBox.startedAt = 0;
      copy.craftingBox.readyAt = 0;
    } else {
      const current = remainingQueue[0];
      copy.craftingBox.item =
        current.type === "collectible"
          ? { collectible: current.name as RecipeCollectibleName }
          : { wearable: current.name as BumpkinItem };
      copy.craftingBox.startedAt = current.startedAt;
      copy.craftingBox.readyAt = current.readyAt;
    }
  });
}
