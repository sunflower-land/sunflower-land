import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import type {
  CraftingQueueItem,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import type { BumpkinItem } from "features/game/types/bumpkin";
import { produce } from "immer";

export type CollectCraftingAction = {
  type: "crafting.collected";
};

type Options = {
  state: Readonly<GameState>;
  action: CollectCraftingAction;
  createdAt?: number;
};

export function grantCraftedItem(
  item: Pick<CraftingQueueItem, "type" | "name">,
  game: GameState,
): void {
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

    // A lifted box keeps crafting while it sits in the inventory - the pause is
    // only applied when it is placed back down, so collecting from an unplaced
    // one would side-step it entirely. The queue lives on `game.craftingBox`, not
    // on the building, so lifting it does not put it out of reach on its own.
    if (
      !(copy.buildings["Crafting Box"] ?? []).some(
        (b) => b.coordinates !== undefined,
      )
    ) {
      throw new Error("Crafting Box is not placed");
    }

    const nothingReady = queue.every((item) => item.readyAt > createdAt);
    if (nothingReady) {
      throw new Error("No items are ready");
    }

    const remainingQueue = queue.filter((item) => {
      if (item.readyAt <= createdAt) {
        grantCraftedItem(item, copy);
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
