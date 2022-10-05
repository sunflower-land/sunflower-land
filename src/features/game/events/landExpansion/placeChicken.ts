import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";

export type PlaceChickenAction = {
  type: "chicken.placed";
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceChickenAction;
  createdAt?: number;
};

export function placeChicken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  console.log("PLACE CHICKEN");
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  // TODO - check they have a spare chicken

  // TODO track
  // bumpkin.activity = trackActivity(`Building Constructed`, bumpkin.activity);

  const id = Object.keys(stateCopy.chickens).length + 1;

  const chickens: GameState["chickens"] = {
    ...stateCopy.chickens,
    [id]: {
      multiplier: 1,
      coordinates: action.coordinates,
    },
  };

  console.log({ chickens });

  return {
    ...stateCopy,
    chickens,
  };
}
