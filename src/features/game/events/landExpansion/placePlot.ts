import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  ResourceName,
  RESOURCE_DIMENSIONS,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";

export type PlacePlotAction = {
  type: "plot.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlacePlotAction;
  createdAt?: number;
};

export function placePlot({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  console.log("Place plot!", action);
  const game = cloneDeep(state) as GameState;
  const { bumpkin } = game;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  const available = (game.inventory["Crop Plot"] || new Decimal(0)).minus(
    Object.keys(game.plots).length
  );

  if (available.lt(1)) {
    throw new Error("No plots available");
  }

  // TODO
  bumpkin.activity = trackActivity("Crop Plot Placed", bumpkin.activity);

  game.plots = {
    ...game.plots,
    [action.id as unknown as number]: {
      createdAt: createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      ...RESOURCE_DIMENSIONS["Crop Plot"],
    },
  };

  return game;
}
