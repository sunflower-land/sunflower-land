import type { GameState, OilReserve } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import {
  getOilBoostWindows,
  pauseWindowedTimer,
} from "features/game/lib/boostWindows";

export type PlaceOilReserveAction = {
  type: "oilReserve.placed";
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceOilReserveAction;
  createdAt?: number;
};

export function placeOilReserve({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory["Oil Reserve"] || new Decimal(0)).minus(
      Object.values(game.oilReserves).filter(
        (oilReserve) =>
          oilReserve.x !== undefined && oilReserve.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No oil reserve available");
    }

    const existingOilReserve = Object.entries(game.oilReserves).find(
      ([_, oilReserve]) =>
        oilReserve.x === undefined && oilReserve.y === undefined,
    );

    if (existingOilReserve) {
      const [id, oilReserve] = existingOilReserve;
      const updatedOilReserve = {
        ...oilReserve,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedOilReserve.oil && updatedOilReserve.removedAt) {
        // Pause recovery across the lift: bank work for a windowed reserve
        // (shrinks baseDurationMs), else legacy back-date. Behaviour-identical to
        // the old back-date for legacy reserves.
        updatedOilReserve.oil.drilledAt = pauseWindowedTimer({
          timer: updatedOilReserve.oil,
          startedAt: updatedOilReserve.oil.drilledAt,
          removedAt: updatedOilReserve.removedAt,
          createdAt,
          windows: getOilBoostWindows(game),
        });
      }
      delete updatedOilReserve.removedAt;

      game.oilReserves[id] = updatedOilReserve;

      return game;
    }

    const newOilReserve: OilReserve = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      oil: {
        drilledAt: 0,
      },
      drilled: 0,
    };

    game.oilReserves = {
      ...game.oilReserves,
      [action.id]: newOilReserve,
    };

    return game;
  });
}
