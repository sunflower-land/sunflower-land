import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import { hasPlacedAgingShed } from "./hasPlacedAgingShed";
import { grantFermentationRecipeOutputs } from "./grantFermentationRecipeOutputs";
import { GameState } from "features/game/types/game";

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
  farmId,
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
      grantFermentationRecipeOutputs(
        game,
        job.recipe,
        farmId,
        !!job.skills?.Ager,
      );
    });
  });
}
