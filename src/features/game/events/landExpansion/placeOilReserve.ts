import { GameState, OilReserve } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceOilReserveAction = {
  type: "oilReserve.placed";
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
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
      Object.keys(game.oilReserves).length,
    );

    if (available.lt(1)) {
      throw new Error("No oil reserve available");
    }

    const newOilReserve: OilReserve = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      oil: {
        amount: 10,
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
