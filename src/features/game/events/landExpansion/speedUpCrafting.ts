import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { getInstantGems, makeGemHistory } from "./speedUpRecipe";
import Decimal from "decimal.js-light";
import { hasFeatureAccess } from "lib/flags";
import { CRAFT_TO_COMPETITION_TASK } from "./collectCrafting";

export type InstantCraftAction = {
  type: "crafting.spedUp";
};

type Options = {
  state: Readonly<GameState>;
  action: InstantCraftAction;
  createdAt?: number;
};

export function speedUpCrafting({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (action.type !== "crafting.spedUp") {
      throw new Error("Invalid action");
    }

    const { craftingBox, inventory } = game;
    const { readyAt, item, status } = craftingBox;

    if (
      item?.collectible &&
      hasFeatureAccess(game, "BUILDING_FRIENDSHIPS") &&
      item.collectible in CRAFT_TO_COMPETITION_TASK
    ) {
      throw new Error("Cannot speed up crafting of collectible");
    }

    if (status !== "crafting" || !item) {
      throw new Error("Crafting box is not crafting");
    }

    if (readyAt < createdAt) {
      throw new Error("Crafting box is not ready to be sped up");
    }

    const gems = getInstantGems({
      readyAt: craftingBox.readyAt,
      now: createdAt,
      game,
    });

    const inventoryGems = inventory["Gem"] ?? new Decimal(0);

    if (!inventoryGems.gte(gems)) {
      throw new Error("Insufficient gems");
    }

    inventory["Gem"] = inventoryGems.sub(gems);

    craftingBox.readyAt = createdAt;
    game = makeGemHistory({ game, amount: gems });

    return game;
  });
}
