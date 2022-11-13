import Decimal from "decimal.js-light";
import { CollectibleName } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum REMOVE_COLLECTIBLE_ERRORS {
  INVALID_COLLECTIBLE = "This collectible does not exist",
  NO_VALID_SHOVEL_SELECTED = "No valid shovel selected!",
  NO_RUSTY_SHOVEL_AVAILABLE = "No Rusty Shovel available!",
}

export type RemoveCollectibleAction = {
  type: "collectible.removed";
  item?: InventoryItemName;
  collectible: CollectibleName;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveCollectibleAction;
  createdAt?: number;
};

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export function removeCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state) as GameState;

  const { collectibles, inventory } = stateCopy;
  const collectibleGroup = collectibles[action.collectible];

  if (!collectibleGroup) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  }

  const collectibleIndex = collectibleGroup?.findIndex(
    (collectible) => collectible.id == action.id
  );

  if (collectibleIndex === -1) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
  }

  if (action.item !== "Rusty Shovel") {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.NO_VALID_SHOVEL_SELECTED);
  }

  const shovelAmount = inventory["Rusty Shovel"] || new Decimal(0);

  if (shovelAmount.lessThan(1)) {
    throw new Error(REMOVE_COLLECTIBLE_ERRORS.NO_RUSTY_SHOVEL_AVAILABLE);
  }

  stateCopy.collectibles[action.collectible] = removeItem(
    collectibleGroup,
    collectibleGroup[collectibleIndex]
  );

  inventory["Rusty Shovel"] = inventory["Rusty Shovel"]?.minus(1);

  return stateCopy;
}
