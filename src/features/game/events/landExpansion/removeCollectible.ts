import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { removeUnsupportedChickens } from "./removeBuilding";

export enum REMOVE_COLLECTIBLE_ERRORS {
  INVALID_COLLECTIBLE = "This collectible does not exist",
  NO_RUSTY_SHOVEL_AVAILABLE = "No Rusty Shovel available!",
  NO_BUMPKIN = "You do not have a Bumpkin",
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

function removeItem<T>(arr: Array<T>, value: T): Array<T> | undefined {
  const index = arr.indexOf(value);

  if (index > -1) {
    arr.splice(index, 1);
  }

  return arr.length ? arr : undefined;
}

export function removeCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
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
    stateCopy.chickens = removeUnsupportedChickens(stateCopy);
  }

  bumpkin.activity = trackActivity("Collectible Removed", bumpkin.activity);

  inventory["Rusty Shovel"] = inventory["Rusty Shovel"]?.minus(1);

  return stateCopy;
}
