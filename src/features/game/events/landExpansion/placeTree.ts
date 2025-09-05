import { GameState, Tree } from "features/game/types/game";
import {
  ADVANCED_RESOURCES,
  RESOURCE_MULTIPLIER,
  TreeName,
  UpgradedResourceName,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceTreeAction = {
  type: "tree.placed";
  name: TreeName;
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
    const placedTrees = Object.values(game.trees).filter(
      (tree) => tree.x !== undefined && tree.y !== undefined,
    ).length;

    const inventoryTrees = (game.inventory.Tree || new Decimal(0))
      .add(game.inventory["Ancient Tree"] || new Decimal(0))
      .add(game.inventory["Sacred Tree"] || new Decimal(0));

    const available = inventoryTrees.minus(placedTrees);

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
        name: action.name,
        multiplier: RESOURCE_MULTIPLIER[action.name],
        tier:
          ADVANCED_RESOURCES[action.name as UpgradedResourceName]?.tier ?? 1,
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
      name: action.name,
      multiplier: RESOURCE_MULTIPLIER[action.name],
      tier: ADVANCED_RESOURCES[action.name as UpgradedResourceName]?.tier ?? 1,
    };

    game.trees = {
      ...game.trees,
      [action.id]: tree,
    };

    return game;
  });
}
