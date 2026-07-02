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
  workAccruedAt,
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
        const stone = updatedStone.stone;
        if (stone.baseDurationMs !== undefined) {
          // Windowed rock: "pause" recovery across the lift. Bank the work
          // accrued before removal, then resume the remaining work from now
          // against the current mine boost windows (mirrors placePlot).
          const banked = workAccruedAt({
            startedAt: stone.minedAt,
            at: updatedStone.removedAt,
            windows: getMineBoostWindows(game, action.name),
          });
          stone.baseDurationMs = Math.max(stone.baseDurationMs - banked, 0);
          stone.minedAt = createdAt;
        } else {
          // Legacy rock: back-date minedAt so the lifted interval doesn't count.
          const existingProgress = updatedStone.removedAt - stone.minedAt;
          stone.minedAt = createdAt - existingProgress;
        }
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
