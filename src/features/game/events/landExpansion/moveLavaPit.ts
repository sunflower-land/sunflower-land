import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { GameState } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import cloneDeep from "lodash.clonedeep";

export type MoveLavaPitAction = {
  type: "lavaPit.moved";
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveLavaPitAction;
  createdAt?: number;
};

export function moveLavaPit({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game: GameState = cloneDeep(state);

  const pit = game.lavaPits[action.id];

  if (!pit) {
    throw new Error(`Lava pit #${action.id} does not exist`);
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
    throw new Error("Lava pit collides");
  }

  pit.x = action.coordinates.x;
  pit.y = action.coordinates.y;

  return game;
}
