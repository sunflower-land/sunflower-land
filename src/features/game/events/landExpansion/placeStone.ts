import type { GameState, Rock } from "features/game/types/game";
import {
  ADVANCED_RESOURCES,
  type UpgradedResourceName,
  type StoneRockName,
  RESOURCE_MULTIPLIER,
} from "features/game/types/resources";
import { produce } from "immer";
import {
  findExistingUnplacedNode,
  getAvailableNodes,
} from "features/game/lib/resourceNodes";
import {
  getMineBoostWindows,
  pauseWindowedTimer,
} from "features/game/lib/boostWindows";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";

export type PlaceStoneAction = {
  type: "stone.placed";
  name: StoneRockName;
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceStoneAction;
  createdAt?: number;
};

export function placeStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = getAvailableNodes(game, "stones");

    if (available.lt(1)) {
      throw new Error("No stone available");
    }

    const nodeStateAccessor = game.stones;

    const existingStone = findExistingUnplacedNode({
      nodeStateAccessor,
      nodeToFind: action.name,
    });

    if (existingStone) {
      const [id, stone] = existingStone;
      const updatedStone = {
        ...stone,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedStone.stone && updatedStone.removedAt) {
        // Pause recovery across the lift (windowed banking or legacy back-date).
        updatedStone.stone.minedAt = pauseWindowedTimer({
          timer: updatedStone.stone,
          startedAt: updatedStone.stone.minedAt,
          removedAt: updatedStone.removedAt,
          createdAt,
          windows: getMineBoostWindows(game, action.name),
        });
      }
      delete updatedStone.removedAt;

      game.stones[id] = updatedStone;

      return game;
    }

    const newStone: Rock = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      stone: {
        minedAt: 0,
      },
      tier: ADVANCED_RESOURCES[action.name as UpgradedResourceName]?.tier ?? 1,
      name: action.name,
      multiplier: RESOURCE_MULTIPLIER[action.name],
    };

    game.stones = {
      ...game.stones,
      [action.id]: newStone,
    };

    return game;
  });
}
