import type { FiniteResource, GameState } from "features/game/types/game";
import type { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  getMineBoostWindows,
  pauseWindowedTimer,
} from "features/game/lib/boostWindows";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";

export type PlaceSunstoneAction = {
  type: "sunstone.placed";
  name: ResourceName;
  id: string;
  coordinates: Coordinates;
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
      Object.values(game.sunstones).filter(
        (sunstone) => sunstone.x !== undefined && sunstone.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No sunstone available");
    }

    const existingSunstone = Object.entries(game.sunstones).find(
      ([_, sunstone]) => sunstone.x === undefined && sunstone.y === undefined,
    );

    if (existingSunstone) {
      const [id, sunstone] = existingSunstone;
      const updatedSunstone = {
        ...sunstone,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedSunstone.stone && updatedSunstone.removedAt) {
        // Pause recovery across the lift (windowed banking or legacy back-date),
        // as every other rock does. Sunstone has no boost windows today, so this
        // is behaviour-identical to the back-date it replaces - but it stops a
        // future sunstone boost from silently mis-crediting a lifted node.
        updatedSunstone.stone.minedAt = pauseWindowedTimer({
          timer: updatedSunstone.stone,
          startedAt: updatedSunstone.stone.minedAt,
          removedAt: updatedSunstone.removedAt,
          createdAt,
          windows: getMineBoostWindows(game, "Sunstone Rock"),
        });
      }
      delete updatedSunstone.removedAt;

      game.sunstones[id] = updatedSunstone;

      return game;
    }

    const newSunstone: FiniteResource = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      stone: {
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
