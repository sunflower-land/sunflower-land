import { GameState, Rock } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceStoneAction = {
  type: "stone.placed";
  name: ResourceName;
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

export function placeStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory["Stone Rock"] || new Decimal(0)).minus(
      Object.values(game.stones).filter(
        (stone) => stone.x !== undefined && stone.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No stone available");
    }

    const existingStone = Object.entries(game.stones).find(
      ([_, stone]) => stone.x === undefined && stone.y === undefined,
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
        delete updatedStone.removedAt;
      }

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
    };

    game.stones = {
      ...game.stones,
      [action.id]: newStone,
    };

    return game;
  });
}
