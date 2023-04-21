import { trackActivity } from "features/game/types/bumpkinActivity";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import {
  areUnsupportedChickensBrewing,
  removeUnsupportedChickens,
} from "./removeBuilding";

export enum REMOVE_COLLECTIBLE_ERRORS {
  INVALID_COLLECTIBLE = "This collectible does not exist",
  NO_RUSTY_SHOVEL_AVAILABLE = "No Rusty Shovel available!",
  NO_BUMPKIN = "You do not have a Bumpkin",
  CHICKEN_COOP_REMOVE_BREWING_CHICKEN = "Cannot remove Chicken Coop that causes chickens that are brewing egg to be removed",
}

export type RemoveCollectibleAction = {
  type: "collectible.removed";
  name: CollectibleName;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveCollectibleAction;
  createdAt?: number;
};

export function removeCollectible({ state, action }: Options) {
  console.log({ remove: action });
  const stateCopy = cloneDeep(state) as GameState;

  const { collectibles, inventory, bumpkin } = stateCopy;
  const collectibleGroup = collectibles[action.name];

  if (bumpkin === undefined) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.NO_BUMPKIN);
  }

  if (!collectibleGroup) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  }

  const collectibleToRemove = collectibleGroup.find(
    (collectible) => collectible.id === action.id
  );

  if (!collectibleToRemove) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  }

  stateCopy.collectibles[action.name] = collectibleGroup.filter(
    (collectible) => collectible.id !== collectibleToRemove.id
  );

  // Remove collectible key if there are none placed
  if (!stateCopy.collectibles[action.name]?.length) {
    delete stateCopy.collectibles[action.name];
  }

  if (action.name === "Chicken Coop") {
    if (areUnsupportedChickensBrewing(stateCopy)) {
      throw new Error(
        REMOVE_COLLECTIBLE_ERRORS.CHICKEN_COOP_REMOVE_BREWING_CHICKEN
      );
    }

    stateCopy.chickens = removeUnsupportedChickens(stateCopy);
  }

  bumpkin.activity = trackActivity("Collectible Removed", bumpkin.activity);

  return stateCopy;
}
