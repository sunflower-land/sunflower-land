import Decimal from "decimal.js-light";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import { KNOWN_IDS } from "features/game/types";
import {
  getSpiceRackRecipe,
  spiceRackCollectedActivity,
} from "features/game/types/spiceRack";
import { getObjectEntries } from "lib/object";
import { GameState } from "features/game/types/game";
import { getAgingOutput } from "features/game/types/agingFormulas";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { hasPlacedAgingShed } from "./hasPlacedAgingShed";

export type CollectSpiceRackAction = {
  type: "spiceRack.collected";
};

type Options = {
  state: Readonly<GameState>;
  action: CollectSpiceRackAction;
  createdAt: number;
  farmId: number;
};

export function collectSpiceRack({
  state,
  createdAt,
  farmId,
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasPlacedAgingShed(game)) {
      throw new Error(translate("error.requiredBuildingNotExist"));
    }

    const queue = game.agingShed.racks.spice;

    if (!queue.length) {
      throw new Error(translate("error.buildingNotCooking"));
    }

    const ready = queue.filter((job) => job.readyAt <= createdAt);

    if (!ready.length) {
      throw new Error(translate("error.recipeNotReady"));
    }

    game.agingShed.racks.spice = queue.filter((job) => job.readyAt > createdAt);

    const { skills } = game.bumpkin;

    ready.forEach((job) => {
      const recipeDef = getSpiceRackRecipe(job.recipe);
      const counter =
        game.farmActivity[spiceRackCollectedActivity(job.recipe)] ?? 0;

      for (const [item, amount] of getObjectEntries(recipeDef.outputs)) {
        const prev = game.inventory[item] ?? new Decimal(0);
        const add = getAgingOutput(skills, amount ?? new Decimal(0), item, {
          farmId,
          itemId: KNOWN_IDS[item],
          counter,
        });

        game.inventory[item] = prev.add(add);
      }

      const activityName = spiceRackCollectedActivity(job.recipe);

      game.farmActivity = trackFarmActivity(
        activityName,
        game.farmActivity,
        new Decimal(1),
      );
    });
  });
}
