import { GameState, Tree } from "features/game/types/game";
import {
  ADVANCED_RESOURCES,
  RESOURCE_MULTIPLIER,
  TreeName,
  UpgradedResourceName,
} from "features/game/types/resources";
import { produce } from "immer";
import {
  findExistingUnplacedNode,
  getAvailableNodes,
} from "features/game/lib/resourceNodes";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

export type PlaceTreeAction = {
  type: "tree.placed";
  name: TreeName;
  id: string;
  coordinates: Coordinates;
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
    const available = getAvailableNodes(game, "trees");

    if (available.lt(1)) {
      throw new Error("No trees available");
    }

    const nodeStateAccessor = game.trees;

    const existingTree = findExistingUnplacedNode({
      nodeStateAccessor,
      nodeToFind: action.name,
    });

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
