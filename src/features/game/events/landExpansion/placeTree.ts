import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  ResourceName,
  RESOURCE_DIMENSIONS,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";

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
  console.log("Place resource!", action);
  const game = cloneDeep(state) as GameState;
  const { bumpkin } = game;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  const available = (game.inventory.Tree || new Decimal(0)).minus(
    Object.keys(game.trees).length
  );

  if (available.lt(1)) {
    throw new Error("No trees available");
  }

  // TODO
  bumpkin.activity = trackActivity("Tree Placed", bumpkin.activity);

  game.trees = {
    ...game.trees,
    [action.id as unknown as number]: {
      createdAt: createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      ...RESOURCE_DIMENSIONS["Tree"],
      wood: {
        amount: 1,
        choppedAt: 0,
      },
    },
  };

  return game;
}
