import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { isPlotFrozen } from "features/game/lib/weatherGreatFreeze";

export enum REMOVE_PLOT_ERRORS {
  PLOT_NOT_FOUND = "Plot not found",
  PLOT_NOT_PLACED = "Plot not placed",
  PLOT_FROZEN = "Plot is affected by greatFreeze",
}

export type RemovePlotAction = {
  type: "plot.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemovePlotAction;
  createdAt?: number;
};

export function removePlot({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (copy) => {
    const { crops } = copy;
    const plot = crops[action.id];
    if (!plot) {
      throw new Error(REMOVE_PLOT_ERRORS.PLOT_NOT_FOUND);
    }

    if (plot.x === undefined || plot.y === undefined) {
      throw new Error(REMOVE_PLOT_ERRORS.PLOT_NOT_PLACED);
    }

    // Lifting a locked plot would free it for the rest of the Great Freeze.
    if (isPlotFrozen({ game: copy, id: action.id, now: createdAt })) {
      throw new Error(REMOVE_PLOT_ERRORS.PLOT_FROZEN);
    }

    delete plot.x;
    delete plot.y;
    plot.removedAt = createdAt;

    return copy;
  });
}
