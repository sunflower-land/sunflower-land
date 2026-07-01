import type { CropPlot, GameState } from "features/game/types/game";
import type { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import {
  getCropFertiliserWindows,
  getCropPlotBoostWindows,
  workAccruedAt,
} from "features/game/lib/boostWindows";

export type PlacePlotAction = {
  type: "plot.placed";
  name: ResourceName;
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlacePlotAction;
  createdAt?: number;
};

export function placePlot({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory["Crop Plot"] || new Decimal(0)).minus(
      Object.values(game.crops).filter(
        (plot) => plot.x !== undefined && plot.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No plots available");
    }

    const existingPlot = Object.entries(game.crops).find(
      ([_, plot]) => plot.x === undefined && plot.y === undefined,
    );

    if (existingPlot) {
      const [id, plot] = existingPlot;
      const updatedPlot = {
        ...plot,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedPlot.crop && updatedPlot.removedAt) {
        const crop = updatedPlot.crop;

        if (crop.baseDurationMs !== undefined) {
          // Windowed crop: "pause" growth across the lift. Bank the work accrued
          // before removal (already done, so it isn't redone), then resume the
          // remaining work from now against the current windows. `boostedTime`
          // keeps the pre-lift progress for the growth bar; `baseDurationMs`
          // holds the remaining work that still has to accrue.
          const banked = workAccruedAt({
            startedAt: crop.plantedAt,
            at: updatedPlot.removedAt,
            windows: [
              ...getCropPlotBoostWindows(game),
              ...getCropFertiliserWindows(updatedPlot.fertiliser),
            ],
          });
          crop.baseDurationMs = Math.max(crop.baseDurationMs - banked, 0);
          crop.boostedTime = (crop.boostedTime ?? 0) + banked;
          crop.plantedAt = createdAt;
        } else {
          // Legacy crop: back-date plantedAt so the lifted interval doesn't count.
          const existingProgress = updatedPlot.removedAt - crop.plantedAt;
          crop.plantedAt = createdAt - existingProgress;
        }
      }
      delete updatedPlot.removedAt;

      game.crops[id] = updatedPlot;

      return game;
    }

    const newPlot: CropPlot = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
    };

    game.crops = {
      ...game.crops,
      [action.id as unknown as number]: newPlot,
    };
    return game;
  });
}
