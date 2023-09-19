import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type PlaceBudAction = {
  type: "bud.placed";
  id: number;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceBudAction;
  createdAt?: number;
};

export function placeBud({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const copy = cloneDeep(state);
  const buds = copy.buds ?? {};

  const bud = buds[action.id];

  if (!bud) throw new Error("This bud does not exist");

  throw new Error("This bud is already placed");
  return state;
}
