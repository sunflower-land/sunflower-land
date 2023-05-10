import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { CollectibleName } from "features/game/types/craftables";
import { GameState, PlacedLamp } from "features/game/types/game";
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
  GENIE_IN_USE = "Genie Lamp is in use",
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

  // TODO - remove once landscaping is launched
  const shovelAmount = inventory["Rusty Shovel"] || new Decimal(0);
  if (shovelAmount.gte(1)) {
    inventory["Rusty Shovel"] = inventory["Rusty Shovel"]?.minus(1);
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

  if (action.name === "Genie Lamp") {
    const collectible: PlacedLamp = collectibleToRemove;
    const rubbedCount = collectible.rubbedCount ?? 0;
    if (rubbedCount > 0) {
      throw new Error(REMOVE_COLLECTIBLE_ERRORS.GENIE_IN_USE);
    }
  }

  bumpkin.activity = trackActivity("Collectible Removed", bumpkin.activity);

  return stateCopy;
}
