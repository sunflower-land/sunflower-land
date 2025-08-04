import { GameState, Rock } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceGoldAction = {
  type: "gold.placed";
  name: ResourceName;
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

    const existingGold = Object.entries(game.gold).find(
      ([_, gold]) => gold.x === undefined && gold.y === undefined,
    );

    if (existingGold) {
      const [id, gold] = existingGold;
      const updatedGold = {
        ...gold,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedGold.stone && updatedGold.removedAt) {
        const existingProgress =
          updatedGold.removedAt - updatedGold.stone.minedAt;
        updatedGold.stone.minedAt = createdAt - existingProgress;
        delete updatedGold.removedAt;
      }

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
    };

    game.gold = {
      ...game.gold,
      [action.id as unknown as number]: gold,
    };

    return game;
  });
}
