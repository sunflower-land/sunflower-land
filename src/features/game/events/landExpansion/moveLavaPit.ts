import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
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

  pit.x = action.coordinates.x;
  pit.y = action.coordinates.y;

  return game;
}
