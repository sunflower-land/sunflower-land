import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { FruitName } from "features/game/types/fruits";
import {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum FRUIT_TREE_REMOVED_ERRORS {
  MISSING_AXE = "No axe",
  NO_AXES = "No axes left",
}

export type RemoveFruitTreeAction = {
  type: "fruitTree.removed";
  index: string;
  selectedItem: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveFruitTreeAction;
  createdAt?: number;
};

export function getRequiredAxeAmount(
  fruitName: FruitName,
  inventory: Inventory,
  game: GameState,
) {
  // Apply boost for Trees
  if (fruitName === "Apple" || fruitName === "Orange") {
    if (isCollectibleBuilt({ name: "Foreman Beaver", game })) {
      return new Decimal(0);
    }

    if (inventory.Logger?.gte(1)) {
      return new Decimal(0.5);
    }
  }

  return new Decimal(1);
}

export function removeFruitTree({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { fruitPatches, bumpkin, inventory, collectibles } = stateCopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin!");
  }

  const patch = fruitPatches[action.index];

  if (!patch) {
    throw new Error("Fruit patch does not exist");
  }

  if (!patch.fruit) {
    throw new Error("Nothing was planted");
  }

  const requiredAxes = getRequiredAxeAmount(
    patch.fruit.name,
    inventory,
    stateCopy,
  );

  if (action.selectedItem !== "Axe" && requiredAxes.gt(0)) {
    throw new Error(FRUIT_TREE_REMOVED_ERRORS.MISSING_AXE);
  }

  const axeAmount = inventory.Axe || new Decimal(0);

  if (axeAmount.lessThan(requiredAxes)) {
    throw new Error(FRUIT_TREE_REMOVED_ERRORS.NO_AXES);
  }

  const { harvestsLeft } = patch.fruit;

  if (harvestsLeft) {
    throw new Error("Fruit is still available");
  }

  delete patch.fruit;
  delete patch.fertiliser;

  inventory.Axe = axeAmount.sub(requiredAxes);
  stateCopy.inventory.Wood = stateCopy.inventory.Wood?.add(1) || new Decimal(1);

  return stateCopy;
}
