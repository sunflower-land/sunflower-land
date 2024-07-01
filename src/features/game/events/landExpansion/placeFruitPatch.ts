import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import {
  ResourceName,
  RESOURCE_DIMENSIONS,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";

export type PlaceFruitPatchAction = {
  type: "fruitPatch.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceFruitPatchAction;
  createdAt?: number;
};

export function placeFruitPatch({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  const available = (game.inventory["Fruit Patch"] || new Decimal(0)).minus(
    Object.keys(game.fruitPatches).length,
  );

  if (available.lt(1)) {
    throw new Error("No fruit patches available");
  }

  game.fruitPatches = {
    ...game.fruitPatches,
    [action.id as unknown as number]: {
      createdAt: createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      ...RESOURCE_DIMENSIONS["Fruit Patch"],
    },
  };

  return game;
}
