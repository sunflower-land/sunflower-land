import { GameState, Tree } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceTreeAction = {
  type: "tree.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceTreeAction;
  createdAt?: number;
};

export function placeTree({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory.Tree || new Decimal(0)).minus(
      Object.values(game.trees).filter(
        (tree) => tree.x !== undefined && tree.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No trees available");
    }

    const existingTree = Object.entries(game.trees).find(
      ([_, tree]) => tree.x === undefined && tree.y === undefined,
    );

    if (existingTree) {
      const [id, tree] = existingTree;
      const updatedTree = {
        ...tree,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedTree.wood && updatedTree.removedAt) {
        const existingProgress =
          updatedTree.removedAt - updatedTree.wood.choppedAt;
        updatedTree.wood.choppedAt = createdAt - existingProgress;
      }
      delete updatedTree.removedAt;

      game.trees[id] = updatedTree;

      return game;
    }

    const tree: Tree = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      wood: { choppedAt: 0 },
    };

    game.trees = {
      ...game.trees,
      [action.id]: tree,
    };

    return game;
  });
}
