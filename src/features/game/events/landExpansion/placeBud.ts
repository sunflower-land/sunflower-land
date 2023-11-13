import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type PlaceBudAction = {
  type: "bud.placed";
  id: string;
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

  // eslint-disable-next-line no-console
  console.log({ action });
  const bud = copy.buds?.[Number(action.id)];
  // eslint-disable-next-line no-console
  console.log({ bud });

  if (!bud) throw new Error("This bud does not exist");

  if (bud.coordinates) throw new Error("This bud is already placed");

  copy.buds[Number(action.id)].coordinates = action.coordinates;

  return copy;
}
