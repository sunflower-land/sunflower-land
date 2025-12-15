import Decimal from "decimal.js-light";

import { GameState } from "../../types/game";
import { CropCompostName } from "features/game/types/composters";
import { applyFertiliserToPlot } from "./fertilisePlot";
import { produce } from "immer";
import { isReadyToHarvest } from "./harvest";
import { CROPS } from "../../types/crops";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { gameAnalytics } from "lib/gameAnalytics";

export type BulkFertilisePlotAction = {
  type: "plots.bulkFertilised";
  fertiliser: CropCompostName;
};

type Options = {
  state: Readonly<GameState>;
  action: BulkFertilisePlotAction;
  createdAt?: number;
};

export const getPlotsToFertilise = (state: GameState, createdAt: number) => {
  return Object.entries(state.crops).filter(([, plot]) => {
    return (
      plot.x !== undefined &&
      plot.y !== undefined &&
      !plot.fertiliser &&
      plot.crop &&
      !isReadyToHarvest(createdAt, plot.crop, CROPS[plot.crop.name])
    );
  });
};

export function bulkFertilisePlot({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const bumpkin = game.bumpkin;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin");
    }

    if (!action.fertiliser) {
      throw new Error("No fertiliser selected");
    }

    const availablePlots = getPlotsToFertilise(game, createdAt);

    const fertiliserCount = game.inventory[action.fertiliser] || new Decimal(0);
    const plotsToFertilise = Math.min(
      fertiliserCount.toNumber(),
      availablePlots.length,
    );

    if (plotsToFertilise < 1) {
      throw new Error("Not enough fertiliser to apply");
    }

    const previousFertilised = game.farmActivity?.["Crop Fertilised"] ?? 0;

    let applied = 0;
    for (let i = 0; i < plotsToFertilise && applied < plotsToFertilise; i++) {
      const [plotID, plot] = availablePlots[i];
      if (plot.x === undefined || plot.y === undefined) continue;

      try {
        applyFertiliserToPlot({
          game,
          plotId: plotID,
          fertiliser: action.fertiliser,
          createdAt,
        });
        applied += 1;
      } catch (e) {
        continue;
      }
    }

    game.inventory[action.fertiliser] = fertiliserCount.minus(applied);
    game.farmActivity = trackFarmActivity(
      `Crop Fertilised`,
      game.farmActivity,
      new Decimal(applied),
    );

    if (previousFertilised === 0 && applied > 0) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:Fertilised:Completed",
      });
    }
  });
}
