import Decimal from "decimal.js-light";
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
  action,
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

    copy.inventory[item] = (copy.inventory[item] || new Decimal(0)).plus(1);

    copy.craftingBox.status = "idle";
    copy.craftingBox.item = undefined;

    return copy;
  });
}
