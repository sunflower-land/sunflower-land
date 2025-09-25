import { CropPlot, GameState } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

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
        const existingProgress =
          updatedPlot.removedAt - updatedPlot.crop.plantedAt;
        updatedPlot.crop.plantedAt = createdAt - existingProgress;
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
