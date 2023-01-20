import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import {
  areUnsupportedChickensBrewing,
  removeUnsupportedChickens,
} from "./removeBuilding";
import { removeItem } from "./utils";

export enum REMOVE_COLLECTIBLE_ERRORS {
  INVALID_COLLECTIBLE = "This collectible does not exist",
  NO_RUSTY_SHOVEL_AVAILABLE = "No Rusty Shovel available!",
  NO_BUMPKIN = "You do not have a Bumpkin",
  CHICKEN_COOP_REMOVE_BREWING_CHICKEN = "Cannot remove Chicken Coop that causes chickens that are brewing egg to be removed",
}

export type RemoveCollectibleAction = {
  type: "collectible.removed";
  collectible: CollectibleName;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveCollectibleAction;
  createdAt?: number;
};

export function removeCollectible({ state, action }: Options) {
  const stateCopy = cloneDeep(state) as GameState;

  const { collectibles, inventory, bumpkin } = stateCopy;
  const collectibleGroup = collectibles[action.collectible];

  if (bumpkin === undefined) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.NO_BUMPKIN);
  }

  if (!collectibleGroup) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  }

  const collectibleIndex = collectibleGroup?.findIndex(
    (collectible) => collectible.id == action.id
  );

  if (collectibleIndex === -1) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  }

  const shovelAmount = inventory["Rusty Shovel"] || new Decimal(0);

  if (shovelAmount.lessThan(1)) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.NO_RUSTY_SHOVEL_AVAILABLE);
  }

  stateCopy.collectibles[action.collectible] = removeItem(
    collectibleGroup,
    collectibleGroup[collectibleIndex]
  );

  // Remove collectible key if there are none placed
  if (!stateCopy.collectibles[action.collectible]) {
    delete stateCopy.collectibles[action.collectible];
  }

  if (action.collectible === "Chicken Coop") {
    if (areUnsupportedChickensBrewing(stateCopy)) {
      throw new Error(
        REMOVE_COLLECTIBLE_ERRORS.CHICKEN_COOP_REMOVE_BREWING_CHICKEN
      );
    }

    stateCopy.chickens = removeUnsupportedChickens(stateCopy);
  }

  bumpkin.activity = trackActivity("Collectible Removed", bumpkin.activity);

  inventory["Rusty Shovel"] = inventory["Rusty Shovel"]?.minus(1);

  return stateCopy;
}
