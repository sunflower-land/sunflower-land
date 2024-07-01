import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { GameState, PlacedLamp } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import {
  areUnsupportedChickensBrewing,
  removeUnsupportedChickens,
} from "./removeBuilding";
import { REMOVAL_RESTRICTIONS } from "features/game/types/removeables";
import { SEEDS } from "features/game/types/seeds";
import { CollectibleLocation } from "features/game/types/collectibles";
import { FLOWER_SEEDS } from "features/game/types/flowers";

export enum REMOVE_COLLECTIBLE_ERRORS {
  INVALID_COLLECTIBLE = "This collectible does not exist",
  NO_BUMPKIN = "You do not have a Bumpkin",
  CHICKEN_COOP_REMOVE_BREWING_CHICKEN = "Cannot remove Chicken Coop that causes chickens that are brewing egg to be removed",
  GENIE_IN_USE = "Genie Lamp is in use",
  COLLECTIBLE_IN_USE = "This item is in use",
}

export type RemoveCollectibleAction = {
  type: "collectible.removed";
  name: CollectibleName;
  id: string;
  location: CollectibleLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveCollectibleAction;
  createdAt?: number;
};

export function removeCollectible({ state, action }: Options) {
  const stateCopy = cloneDeep(state) as GameState;

  const { inventory, bumpkin } = stateCopy;
  let collectibleGroup =
    action.location === "home"
      ? stateCopy.home.collectibles[action.name]
      : stateCopy.collectibles[action.name];

  if (bumpkin === undefined) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.NO_BUMPKIN);
  }

  if (!collectibleGroup) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  }

  const collectibleToRemove = collectibleGroup.find(
    (collectible) => collectible.id === action.id,
  );

  if (!collectibleToRemove) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  }

  // TODO - remove once landscaping is launched
  const shovelAmount = inventory["Rusty Shovel"] || new Decimal(0);
  if (shovelAmount.gte(1)) {
    inventory["Rusty Shovel"] = inventory["Rusty Shovel"]?.minus(1);
  }

  collectibleGroup = collectibleGroup.filter(
    (collectible) => collectible.id !== collectibleToRemove.id,
  );

  // Remove collectible key if there are none placed
  if (collectibleGroup.length === 0) {
    if (action.location === "home") {
      delete stateCopy.home.collectibles[action.name];
    }

    if (action.location === "farm") {
      delete stateCopy.collectibles[action.name];
    }
  } else {
    if (action.location === "home") {
      stateCopy.home.collectibles[action.name] = collectibleGroup;
    }

    if (action.location === "farm") {
      stateCopy.collectibles[action.name] = collectibleGroup;
    }
  }

  if (action.name === "Chicken Coop") {
    if (areUnsupportedChickensBrewing(stateCopy)) {
      throw new Error(
        REMOVE_COLLECTIBLE_ERRORS.CHICKEN_COOP_REMOVE_BREWING_CHICKEN,
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

  const removalRestriction = REMOVAL_RESTRICTIONS[action.name];
  if (removalRestriction) {
    const [restricted] = removalRestriction(state);
    if (restricted)
      throw new Error(REMOVE_COLLECTIBLE_ERRORS.COLLECTIBLE_IN_USE);
  }

  if (action.name === "Kuebiko") {
    getKeys(SEEDS()).forEach((seed) => {
      if (stateCopy.inventory[seed]) {
        delete stateCopy.inventory[seed];
      }
    });
  }

  if (action.name === "Hungry Caterpillar") {
    getKeys(FLOWER_SEEDS()).forEach((seed) => {
      if (stateCopy.inventory[seed]) {
        delete stateCopy.inventory[seed];
      }
    });
  }

  bumpkin.activity = trackActivity("Collectible Removed", bumpkin.activity);

  return stateCopy;
}
