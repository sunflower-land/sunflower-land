import { GameState, Rock } from "features/game/types/game";
import {
  ADVANCED_RESOURCES,
  UpgradedResourceName,
  RockName,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  getActiveNodes,
  isActiveNode,
} from "features/game/expansion/lib/utils";

export type PlaceStoneAction = {
  type: "stone.placed";
  name: RockName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceStoneAction;
  createdAt?: number;
};

export const STONE_MULTIPLIERS: Record<RockName, number> = {
  "Stone Rock": 1,
  "Fused Stone Rock": 4,
  "Reinforced Stone Rock": 16,
};

export function placeStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory[action.name] || new Decimal(0)).minus(
      getActiveNodes(game.stones).length,
    );

    if (available.lt(1)) {
      throw new Error("No stone available");
    }

    const existingStone = Object.entries(game.stones).find(([_, stone]) =>
      isActiveNode(stone),
    );

    if (existingStone) {
      const [id, stone] = existingStone;
      const updatedStone = {
        ...stone,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedStone.stone && updatedStone.removedAt) {
        const existingProgress =
          updatedStone.removedAt - updatedStone.stone.minedAt;
        updatedStone.stone.minedAt = createdAt - existingProgress;
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
      multiplier: STONE_MULTIPLIERS[action.name],
    };

    game.stones = {
      ...game.stones,
      [action.id]: newStone,
    };

    return game;
  });
}
