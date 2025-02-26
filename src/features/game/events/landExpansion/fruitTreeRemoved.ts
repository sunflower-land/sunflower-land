import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
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

export function getRequiredAxeAmount(inventory: Inventory, game: GameState) {
  let requiredAxeAmount = 1;

  if (inventory.Logger?.gte(1)) {
    requiredAxeAmount = 0.5;
  }

  if (isCollectibleBuilt({ name: "Foreman Beaver", game })) {
    requiredAxeAmount = 0;
  }

  if (game.bumpkin.skills["No Axe No Worries"]) {
    requiredAxeAmount = 0;
  }

  return requiredAxeAmount;
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

    const requiredAxes = getRequiredAxeAmount(inventory, stateCopy);

    if (action.selectedItem !== "Axe" && requiredAxes > 0) {
      throw new Error(FRUIT_TREE_REMOVED_ERRORS.MISSING_AXE);
    }

    const axeAmount = inventory.Axe ?? new Decimal(0);

    if (axeAmount.lt(requiredAxes)) {
      throw new Error(FRUIT_TREE_REMOVED_ERRORS.NO_AXES);
    }

    const { harvestsLeft } = patch.fruit;

    if (harvestsLeft) {
      throw new Error("Fruit is still available");
    }

    const { woodReward } = getWoodReward({ state: stateCopy });

    delete patch.fruit;
    delete patch.fertiliser;

    inventory.Axe = axeAmount.sub(requiredAxes);
    inventory.Wood = inventory.Wood?.add(woodReward) || new Decimal(1);

    return stateCopy;
  });
}
