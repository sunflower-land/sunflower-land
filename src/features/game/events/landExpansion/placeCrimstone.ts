import type { FiniteResource, GameState } from "features/game/types/game";
import type { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  getMineBoostWindows,
  pauseWindowedTimer,
} from "features/game/lib/boostWindows";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";

export type PlaceCrimstoneAction = {
  type: "crimstone.placed";
  name: ResourceName;
  id: string;
  coordinates: Coordinates;
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
    ).minus(
      Object.values(game.crimstones).filter(
        (crimstone) => crimstone.x !== undefined && crimstone.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No crimstones available");
    }

    const existingCrimstone = Object.entries(game.crimstones).find(
      ([_, crimstone]) =>
        crimstone.x === undefined && crimstone.y === undefined,
    );

    if (existingCrimstone) {
      const [id, crimstone] = existingCrimstone;
      const updatedCrimstone = {
        ...crimstone,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedCrimstone.stone && updatedCrimstone.removedAt) {
        // Pause recovery across the lift (windowed banking or legacy back-date).
        updatedCrimstone.stone.minedAt = pauseWindowedTimer({
          timer: updatedCrimstone.stone,
          startedAt: updatedCrimstone.stone.minedAt,
          removedAt: updatedCrimstone.removedAt,
          createdAt,
          windows: getMineBoostWindows(game, "Crimstone Rock"),
        });
      }
      delete updatedCrimstone.removedAt;

      game.crimstones[id] = updatedCrimstone;

      return game;
    }

    const crimstone: FiniteResource = {
      createdAt: createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      stone: {
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
