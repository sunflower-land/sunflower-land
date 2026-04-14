import { FiniteResource, GameState } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

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
        const existingProgress =
          updatedCrimstone.removedAt - updatedCrimstone.stone.minedAt;
        updatedCrimstone.stone.minedAt = createdAt - existingProgress;
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
