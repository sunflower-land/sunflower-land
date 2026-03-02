import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { getInstantGems, makeGemHistory } from "./speedUpRecipe";
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
    const { readyAt, item, status } = craftingBox;

    if (status !== "crafting" || !item) {
      throw new Error("Crafting box is not crafting");
    }

    const currentReadyAt = queue.length > 0 ? queue[0].readyAt : readyAt;
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

    game = makeGemHistory({ game, amount: gems });

    if (queue.length > 0) {
      game.craftingBox.queue = recalculateCraftingQueue({
        queue,
        game,
        farmId,
        firstItemReadyAt: createdAt,
      });
      const current = game.craftingBox.queue?.[0];
      if (current) {
        game.craftingBox.readyAt = current.readyAt;
        game.craftingBox.startedAt = current.startedAt;
      }
    } else {
      craftingBox.readyAt = createdAt;
    }

    return game;
  });
}
