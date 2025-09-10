import { GameState, Rock } from "features/game/types/game";
import {
  RESOURCE_MULTIPLIER,
  GoldRockName,
  ADVANCED_RESOURCES,
  UpgradedResourceName,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { findExistingUnplacedNode } from "features/game/lib/resourceNodes";

export type PlaceGoldAction = {
  type: "gold.placed";
  name: GoldRockName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
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
    const available = (game.inventory["Gold Rock"] || new Decimal(0)).minus(
      Object.values(game.gold).filter(
        (gold) => gold.x !== undefined && gold.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No gold available");
    }

    const existingGold = findExistingUnplacedNode({
      game,
      nodeToFind: action.name,
      baseNode: "Gold Rock",
    });

    if (existingGold) {
      const [id, gold] = existingGold;
      const updatedGold = {
        ...(gold as Rock),
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedGold.stone && updatedGold.removedAt) {
        const existingProgress =
          updatedGold.removedAt - updatedGold.stone.minedAt;
        updatedGold.stone.minedAt = createdAt - existingProgress;
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
