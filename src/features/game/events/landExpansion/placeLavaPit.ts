import cloneDeep from "lodash.clonedeep";

import Decimal from "decimal.js-light";
import { GameState, LavaPit } from "features/game/types/game";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

export type PlaceLavaPitAction = {
  type: "lavaPit.placed";
  name: "Lava Pit";
  id: string;
  coordinates: Coordinates;
  location?: "farm";
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceLavaPitAction;
  createdAt?: number;
};

export function placeLavaPit({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  const available = (game.inventory["Lava Pit"] || new Decimal(0)).minus(
    Object.keys(game.lavaPits ?? {}).length,
  );

  if (available.lt(1)) {
    throw new Error("No lava pit available");
  }

  const dimensions = RESOURCE_DIMENSIONS["Lava Pit"];
  const collides = detectCollision({
    state: game,
    position: {
      x: action.coordinates.x,
      y: action.coordinates.y,
      height: dimensions.height,
      width: dimensions.width,
    },
    location: "farm",
    name: "Lava Pit",
  });

  if (collides) {
    throw new Error("Lava Pit collides");
  }

  if (game.lavaPits[action.id]) {
    throw new Error("ID exists");
  }

  const lavaPit: LavaPit = {
    createdAt,
    x: action.coordinates.x,
    y: action.coordinates.y,
  };

  game.lavaPits = {
    ...game.lavaPits,
    [action.id as unknown as number]: lavaPit,
  };

  return game;
}
