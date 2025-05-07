import { FiniteResource, GameState } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceCrimstoneAction = {
  type: "crimstone.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceCrimstoneAction;
  createdAt?: number;
};

export function placeCrimstone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (
      game.inventory["Crimstone Rock"] || new Decimal(0)
    ).minus(Object.keys(game.crimstones).length);

    if (available.lt(1)) {
      throw new Error("No crimstones available");
    }

    const crimstone: FiniteResource = {
      createdAt: createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      stone: {
        amount: 1,
        minedAt: 0,
      },
      minesLeft: 5,
    };

    game.crimstones = {
      ...game.crimstones,
      [action.id as unknown as number]: crimstone,
    };

    return game;
  });
}
