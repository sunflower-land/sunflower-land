import { getKeys } from "features/game/types/craftables";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";
import { getSupportedChickens } from "./utils";

export type PlaceChickenAction = {
  type: "chicken.placed";
  id: string;
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
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin!");
  }

  const placedChickens = getKeys(stateCopy.chickens).filter(
    (index) => stateCopy.chickens[index].coordinates,
  ).length;

  if (stateCopy.inventory.Chicken?.lte(placedChickens)) {
    throw new Error("You do not have any available chickens");
  }

  const availableSpots = getSupportedChickens(stateCopy);

  if (placedChickens === availableSpots) {
    throw new Error("Insufficient space for more chickens");
  }

  const chickens: GameState["chickens"] = {
    ...stateCopy.chickens,
    [action.id]: {
      multiplier: 1,
      coordinates: action.coordinates,
    },
  };

  return {
    ...stateCopy,
    chickens,
  };
}
