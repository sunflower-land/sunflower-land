import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
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

  const available = (copy.inventory.Beehive || new Decimal(0)).minus(
    Object.keys(copy.beehives ?? {}).length,
  );

  if (available.lte(0)) {
    throw new Error("You do not have any available beehives");
  }

  const beehive: Beehive = {
    x: action.coordinates.x,
    y: action.coordinates.y,
    swarm: false,
    height: 1,
    width: 1,
    honey: {
      updatedAt: createdAt,
      produced: 0,
    },
    flowers: [],
  };

  copy.beehives = { ...copy.beehives, [action.id]: beehive };

  const updatedBeehives = updateBeehives({
    game: copy,
    createdAt,
  });

  copy.beehives = updatedBeehives;

  return copy;
}
