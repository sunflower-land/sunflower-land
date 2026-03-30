import Decimal from "decimal.js-light";
import { produce } from "immer";
import { v4 as randomUUID } from "uuid";
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

export type StartFermentationAction = {
  type: "fermentation.started";
  recipe: FermentationRecipeName;
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

    game.inventory = getObjectEntries(recipeDef.ingredients).reduce(
      (inventory, [ingredient, amount]) => {
        const count = inventory[ingredient] ?? new Decimal(0);
        const need = amount ?? new Decimal(0);

        if (count.lessThan(need)) {
          throw new Error(`Insufficient ingredient: ${String(ingredient)}`);
        }

        return {
          ...inventory,
          [ingredient]: count.sub(need),
        };
      },
      game.inventory,
    );

    const readyAt = createdAt + Math.max(0, recipeDef.durationSeconds) * 1000;

    const job: FermentationJob = {
      id: randomUUID(),
      recipe: action.recipe,
      startedAt: createdAt,
      readyAt,
    };

    game.agingShed.racks.fermentation = [...queue, job];
  });
}
