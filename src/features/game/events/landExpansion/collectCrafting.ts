import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type CollectCraftingAction = {
  type: "crafting.collected";
};

type Options = {
  state: Readonly<GameState>;
  action: CollectCraftingAction;
  createdAt?: number;
};

export function collectCrafting({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { craftingBox } = copy;

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

    return copy;
  });
}
