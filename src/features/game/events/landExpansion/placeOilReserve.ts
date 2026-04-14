import { GameState, OilReserve } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

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
        const existingProgress =
          updatedOilReserve.removedAt - updatedOilReserve.oil.drilledAt;
        updatedOilReserve.oil.drilledAt = createdAt - existingProgress;
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
