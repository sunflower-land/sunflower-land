import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { PatchFruitName } from "features/game/types/fruits";
import {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { produce } from "immer";

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
  patchFruitName: PatchFruitName,
  inventory: Inventory,
  game: GameState,
) {
  // Apply boost for Trees
  if (
    patchFruitName === "Apple" ||
    patchFruitName === "Orange" ||
    patchFruitName === "Lemon"
  ) {
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
  return produce(state, (stateCopy) => {
    const { fruitPatches, bumpkin, inventory, collectibles } = stateCopy;
    let woodReward = 1;

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

    // Fruity Woody: +1 Wood when removing a fruit tree
    if (bumpkin.skills["Fruity Woody"]) {
      woodReward += 1;
    }

    delete patch.fruit;
    delete patch.fertiliser;

    inventory.Axe = axeAmount.sub(requiredAxes);
    stateCopy.inventory.Wood =
      stateCopy.inventory.Wood?.add(woodReward) || new Decimal(1);

    return stateCopy;
  });
}
