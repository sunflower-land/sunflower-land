import { GameState, Rock } from "features/game/types/game";
import {
  IronRockName,
  RESOURCE_MULTIPLIER,
  UpgradedResourceName,
  ADVANCED_RESOURCES,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { findExistingUnplacedNode } from "features/game/lib/resourceNodes";

export type PlaceIronAction = {
  type: "iron.placed";
  name: IronRockName;
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

    const existingIron = findExistingUnplacedNode({
      game,
      nodeToFind: action.name,
      baseNode: "Iron Rock",
    });

    if (existingIron) {
      const [id, iron] = existingIron;
      const updatedIron = {
        ...(iron as Rock),
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedIron.stone && updatedIron.removedAt) {
        const existingProgress =
          updatedIron.removedAt - updatedIron.stone.minedAt;
        updatedIron.stone.minedAt = createdAt - existingProgress;
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
