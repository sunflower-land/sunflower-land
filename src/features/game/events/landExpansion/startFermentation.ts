import Decimal from "decimal.js-light";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import type { FermentationJob } from "features/game/lib/agingShed";
import {
  getFermentationRecipe,
  getMaxFermentationSlots,
  isFermentationRecipeName,
  type FermentationRecipeName,
} from "features/game/types/fermentation";
import { getObjectEntries } from "lib/object";
import { GameState } from "features/game/types/game";
import { hasPlacedAgingShed } from "./hasPlacedAgingShed";
import { hasFeatureAccess } from "lib/flags";

export type StartFermentationAction = {
  type: "fermentation.started";
  recipe: FermentationRecipeName;
  /** Client-generated id (same idea as `cropId` in `plant.ts`, often `crypto.randomUUID().slice(0, 8)`). */
  jobId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: StartFermentationAction;
  createdAt?: number;
  farmId: number;
};

export function startFermentation({
  state,
  action,
  createdAt = Date.now(),
  farmId: _farmId,
}: Options): GameState {
  if (!hasFeatureAccess(state, "AGING_SHED")) {
    throw new Error("Aging Shed not enabled");
  }

  return produce(state, (game) => {
    if (!hasPlacedAgingShed(game)) {
      throw new Error(translate("error.requiredBuildingNotExist"));
    }

    if (!isFermentationRecipeName(action.recipe)) {
      throw new Error("Invalid fermentation recipe");
    }

    const recipeDef = getFermentationRecipe(action.recipe);

    const maxSlots = getMaxFermentationSlots(game.agingShed.level);
    const queue = game.agingShed.racks.fermentation;

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

    const job: FermentationJob = {
      id: action.jobId,
      recipe: action.recipe,
      startedAt: createdAt,
      readyAt,
    };

    game.agingShed.racks.fermentation = [...queue, job];
  });
}
