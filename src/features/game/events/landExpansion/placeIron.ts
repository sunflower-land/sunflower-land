import type { GameState, Rock } from "features/game/types/game";
import {
  type IronRockName,
  RESOURCE_MULTIPLIER,
  type UpgradedResourceName,
  ADVANCED_RESOURCES,
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

export type PlaceIronAction = {
  type: "iron.placed";
  name: IronRockName;
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceIronAction;
  createdAt?: number;
};

export function placeIron({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = getAvailableNodes(game, "iron");

    if (available.lt(1)) {
      throw new Error("No iron available");
    }

    const nodeStateAccessor = game.iron;

    const existingIron = findExistingUnplacedNode({
      nodeStateAccessor,
      nodeToFind: action.name,
    });

    if (existingIron) {
      const [id, iron] = existingIron;
      const updatedIron = {
        ...iron,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedIron.stone && updatedIron.removedAt) {
        const stone = updatedIron.stone;
        if (stone.baseDurationMs !== undefined) {
          // Windowed rock: "pause" recovery across the lift. Bank the work
          // accrued before removal, then resume the remaining work from now
          // against the current mine boost windows (mirrors placePlot).
          const banked = workAccruedAt({
            startedAt: stone.minedAt,
            at: updatedIron.removedAt,
            windows: getMineBoostWindows(game, action.name),
          });
          stone.baseDurationMs = Math.max(stone.baseDurationMs - banked, 0);
          stone.minedAt = createdAt;
        } else {
          // Legacy rock: back-date minedAt so the lifted interval doesn't count.
          const existingProgress = updatedIron.removedAt - stone.minedAt;
          stone.minedAt = createdAt - existingProgress;
        }
      }
      delete updatedIron.removedAt;

      game.iron[id] = updatedIron;

      return game;
    }

    const iron: Rock = {
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

    game.iron = {
      ...game.iron,
      [action.id as unknown as number]: iron,
    };

    return game;
  });
}
