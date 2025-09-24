import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { PlaceableLocation } from "features/game/types/collectibles";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type PlaceBudAction = {
  type: "bud.placed";
  id: string;
  coordinates: Coordinates;
  location: PlaceableLocation;
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
  return produce(state, (copy) => {
    const bud = copy.buds?.[Number(action.id)];

    if (!bud) throw new Error("This bud does not exist");

    if (bud.coordinates) throw new Error("This bud is already placed");

    bud.coordinates = action.coordinates;
    bud.location = action.location;

    return copy;
  });
}
