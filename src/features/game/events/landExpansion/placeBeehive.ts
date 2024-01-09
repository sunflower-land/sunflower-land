import { Beehive, GameState } from "features/game/types/game";
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
  const copy: GameState = cloneDeep(state);

  if (copy.inventory.Beehive?.lte(0)) {
    throw new Error("You do not have any available beehives");
  }

  const beehive: Beehive = {
    id: action.id,
    coordinates: action.coordinates,
    honeyLevel: 0,
    isProducingHoney: false,
  };

  copy.beehives = { ...copy.beehives, [action.id]: beehive };

  return copy;
}
