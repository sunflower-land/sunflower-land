import { GameState, Rock } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceIronAction = {
  type: "iron.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
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
    const available = (game.inventory["Iron Rock"] || new Decimal(0)).minus(
      Object.values(game.iron).filter(
        (iron) => iron.x !== undefined && iron.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No iron available");
    }

    const existingIron = Object.entries(game.iron).find(
      ([_, iron]) => iron.x === undefined && iron.y === undefined,
    );

    if (existingIron) {
      const [id, iron] = existingIron;
      const updatedIron = {
        ...iron,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedIron.stone && updatedIron.removedAt) {
        const existingProgress =
          updatedIron.removedAt - updatedIron.stone.minedAt;
        updatedIron.stone.minedAt = createdAt - existingProgress;
        delete updatedIron.removedAt;
      }

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
    };

    game.iron = {
      ...game.iron,
      [action.id as unknown as number]: iron,
    };

    return game;
  });
}
