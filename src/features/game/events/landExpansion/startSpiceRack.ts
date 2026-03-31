import Decimal from "decimal.js-light";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import type { SpiceRackJob } from "features/game/lib/agingShed";
import {
  getSpiceRackRecipe,
  getMaxSpiceRackSlots,
  isSpiceRackRecipeName,
  type SpiceRackRecipeName,
} from "features/game/types/spiceRack";
import { getObjectEntries } from "lib/object";
import { GameState } from "features/game/types/game";
import { hasPlacedAgingShed } from "./hasPlacedAgingShed";

export type StartSpiceRackAction = {
  type: "spiceRack.started";
  recipe: SpiceRackRecipeName;
  /** Client-generated id (same idea as fermentation `jobId`). */
  jobId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: StartSpiceRackAction;
  createdAt?: number;
  farmId: number;
};

export function startSpiceRack({
  state,
  action,
  createdAt = Date.now(),
  farmId: _farmId,
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasPlacedAgingShed(game)) {
      throw new Error(translate("error.requiredBuildingNotExist"));
    }

    if (!isSpiceRackRecipeName(action.recipe)) {
      throw new Error("Invalid spice rack recipe");
    }

    const recipeDef = getSpiceRackRecipe(action.recipe);

    const maxSlots = getMaxSpiceRackSlots(game.agingShed.level);
    const queue = game.agingShed.racks.spice;

    if (queue.length >= maxSlots) {
      throw new Error(translate("error.noAvailableSlots"));
    }

    for (const [ingredient, amount] of getObjectEntries(
      recipeDef.ingredients,
    )) {
      const count = game.inventory[ingredient] ?? new Decimal(0);
      const need = amount ?? new Decimal(0);

      if (count.lessThan(need)) {
        throw new Error(`Insufficient ingredient: ${String(ingredient)}`);
      }

      game.inventory[ingredient] = count.sub(need);
    }

    const readyAt = createdAt + Math.max(0, recipeDef.durationSeconds) * 1000;

    const job: SpiceRackJob = {
      id: action.jobId,
      recipe: action.recipe,
      startedAt: createdAt,
      readyAt,
    };

    game.agingShed.racks.spice = [...queue, job];
  });
}
