import type { GameState, Rock } from "features/game/types/game";
import {
  RESOURCE_MULTIPLIER,
  type GoldRockName,
  ADVANCED_RESOURCES,
  type UpgradedResourceName,
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

export type PlaceGoldAction = {
  type: "gold.placed";
  name: GoldRockName;
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceGoldAction;
  createdAt?: number;
};

export function placeGold({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = getAvailableNodes(game, "gold");

    if (available.lt(1)) {
      throw new Error("No gold available");
    }

    const nodeStateAccessor = game.gold;

    const existingGold = findExistingUnplacedNode({
      nodeStateAccessor,
      nodeToFind: action.name,
    });

    if (existingGold) {
      const [id, gold] = existingGold;
      const updatedGold = {
        ...gold,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedGold.stone && updatedGold.removedAt) {
        // Pause recovery across the lift (windowed banking or legacy back-date).
        updatedGold.stone.minedAt = pauseWindowedTimer({
          timer: updatedGold.stone,
          startedAt: updatedGold.stone.minedAt,
          removedAt: updatedGold.removedAt,
          createdAt,
          windows: getMineBoostWindows(game, action.name),
        });
      }
      delete updatedGold.removedAt;

      game.gold[id] = updatedGold;

      return game;
    }

    const gold: Rock = {
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

    game.gold = {
      ...game.gold,
      [action.id as unknown as number]: gold,
    };

    return game;
  });
}
