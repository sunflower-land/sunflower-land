import { GameState } from "features/game/types/game";
import { produce } from "immer";
import {
  getInstantGems,
  makeGemHistory,
} from "features/game/lib/getInstantGems";
import Decimal from "decimal.js-light";
import { recalculateCraftingQueue } from "./cancelQueuedCrafting";

export type InstantCraftAction = {
  type: "crafting.spedUp";
};

type Options = {
  state: Readonly<GameState>;
  action: InstantCraftAction;
  createdAt?: number;
  farmId?: number;
};

export function speedUpCrafting({
  state,
  action,
  createdAt = Date.now(),
  farmId = 0,
}: Options): GameState {
  return produce(state, (game) => {
    if (action.type !== "crafting.spedUp") {
      throw new Error("Invalid action");
    }

    const { craftingBox, inventory } = game;
    const queue = craftingBox.queue ?? [];
    const { readyAt, status } = craftingBox;

    if (status !== "crafting" || queue.length === 0) {
      throw new Error("Crafting box is not crafting");
    }

    const firstInProgress = queue.find((q) => q.readyAt > createdAt);
    const currentReadyAt =
      firstInProgress?.readyAt ?? queue[0]?.readyAt ?? readyAt;
    if (currentReadyAt <= createdAt) {
      throw new Error("Crafting box is not ready to be sped up");
    }

    const gems = getInstantGems({
      readyAt: currentReadyAt,
      now: createdAt,
      game,
    });

    const inventoryGems = inventory["Gem"] ?? new Decimal(0);

    if (!inventoryGems.gte(gems)) {
      throw new Error("Insufficient gems");
    }

    inventory["Gem"] = inventoryGems.sub(gems);

    game = makeGemHistory({ game, amount: gems, createdAt });

    if (queue.length > 0) {
      const readyItems = queue.filter((q) => q.readyAt <= createdAt);
      const inProgressItems = queue.filter((q) => q.readyAt > createdAt);

      const recalculated = recalculateCraftingQueue({
        queue: inProgressItems,
        game,
        farmId,
        firstItemReadyAt: createdAt,
      });

      game.craftingBox.queue = [...readyItems, ...recalculated];
    }

    return game;
  });
}
