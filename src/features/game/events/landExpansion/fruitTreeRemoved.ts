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

  if (
    (patchFruitName === "Tomato" ||
      patchFruitName === "Blueberry" ||
      patchFruitName === "Banana") &&
    game.bumpkin.skills["No Axe No Worries"]
  ) {
    return new Decimal(0);
  }

  return new Decimal(1);
}

export function getWoodReward({ state }: { state: GameState }) {
  let woodReward = 1;
  // Fruity Woody: +1 Wood when removing a fruit tree
  if (state.bumpkin.skills["Fruity Woody"]) {
    woodReward += 1;
  }

  // Get -1 wood reward with No Axe No Worries Skill
  if (state.bumpkin.skills["No Axe No Worries"]) {
    woodReward -= 1;
  }

  return { woodReward };
}

export function removeFruitTree({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { fruitPatches, bumpkin, inventory } = stateCopy;

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

    const { woodReward } = getWoodReward({ state: stateCopy });

    inventory.Axe = axeAmount.sub(requiredAxes);
    inventory.Wood = inventory.Wood?.add(woodReward) || new Decimal(1);

    return stateCopy;
  });
}
