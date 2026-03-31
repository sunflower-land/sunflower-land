import Decimal from "decimal.js-light";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import {
  FermentationCollectedActivity,
  getFermentationRecipe,
} from "features/game/types/fermentation";
import { getObjectEntries } from "lib/object";
import { GameState } from "features/game/types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { hasPlacedAgingShed } from "./hasPlacedAgingShed";

export type CollectFermentationAction = {
  type: "fermentation.collected";
};

type Options = {
  state: Readonly<GameState>;
  action: CollectFermentationAction;
  createdAt?: number;
  farmId: number;
};

export function collectFermentation({
  state,
  createdAt = Date.now(),
  farmId: _farmId,
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasPlacedAgingShed(game)) {
      throw new Error(translate("error.requiredBuildingNotExist"));
    }

    const queue = game.agingShed.racks.fermentation;

    if (!queue.length) {
      throw new Error(translate("error.buildingNotCooking"));
    }

    const ready = queue.filter((job) => job.readyAt <= createdAt);

    if (!ready.length) {
      throw new Error(translate("error.recipeNotReady"));
    }

    game.agingShed.racks.fermentation = queue.filter(
      (job) => job.readyAt > createdAt,
    );

    ready.forEach((job) => {
      const recipeDef = getFermentationRecipe(job.recipe);

      for (const [item, amount] of getObjectEntries(recipeDef.outputs)) {
        const prev = game.inventory[item] ?? new Decimal(0);
        const add = amount ?? new Decimal(0);
        game.inventory[item] = prev.add(add);

        const activityName: FermentationCollectedActivity = `${item} Fermented`;

        game.farmActivity = trackFarmActivity(
          activityName,
          game.farmActivity,
          new Decimal(add),
        );
      }
    });
  });
}
