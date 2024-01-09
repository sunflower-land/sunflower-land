import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type PlaceBeehiveAction = {
  type: "beehive.placed";
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceBeehiveAction;
  createdAt?: number;
};

export function placeBeehive({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const copy = cloneDeep(state);

  if (copy.inventory.Beehive?.lte(0)) {
    throw new Error("You do not have any available beehives");
  }

  return state;
}
