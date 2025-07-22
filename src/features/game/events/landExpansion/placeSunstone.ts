import { FiniteResource, GameState } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceSunstoneAction = {
  type: "sunstone.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceSunstoneAction;
  createdAt?: number;
};

export function placeSunstone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory["Sunstone Rock"] || new Decimal(0)).minus(
      Object.keys(game.sunstones).length,
    );

    if (available.lt(1)) {
      throw new Error("No sunstone available");
    }

    const newSunstone: FiniteResource = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      stone: {
        amount: 1,
        minedAt: 0,
      },
      minesLeft: 10,
    };

    game.sunstones = {
      ...game.sunstones,
      [action.id]: newSunstone,
    };

    return game;
  });
}
