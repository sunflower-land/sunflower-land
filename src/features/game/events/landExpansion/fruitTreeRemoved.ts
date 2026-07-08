import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import type {
  BoostName,
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { produce } from "immer";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";

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
  const boostsUsed: { name: BoostName; value: string }[] = [];
  let requiredAxeAmount = 1;

  if (inventory.Logger?.gte(1)) {
    requiredAxeAmount = 0.5;
    boostsUsed.push({ name: "Logger", value: "x0.5" });
  }

  if (isCollectibleBuilt({ name: "Foreman Beaver", game })) {
    requiredAxeAmount = 0;
    boostsUsed.push({ name: "Foreman Beaver", value: "Free" });
  }

  if (game.bumpkin.skills["No Axe No Worries"]) {
    requiredAxeAmount = 0;
    boostsUsed.push({ name: "No Axe No Worries", value: "Free" });
  }

  return { amount: requiredAxeAmount, boostsUsed };
}

export function getWoodReward({ state }: { state: GameState }) {
  let woodReward = 1;
  // Fruity Woody: +1/+1.5/+2 Wood when removing a fruit tree (scales with rank)
  const fruityWoodyLevel = getSkillLevel(state.bumpkin.skills, "Fruity Woody");
  if (fruityWoodyLevel) {
    woodReward += SKILL_RANKS["Fruity Woody"].ranks[fruityWoodyLevel - 1];
  }

  // No Axe No Worries: wood penalty shrinks with rank (-1 / -0.5 / none)
  const noAxeNoWorriesLevel = getSkillLevel(
    state.bumpkin.skills,
    "No Axe No Worries",
  );
  if (noAxeNoWorriesLevel) {
    woodReward -=
      SKILL_RANKS["No Axe No Worries"].ranks[noAxeNoWorriesLevel - 1];
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

    const { amount: requiredAxes, boostsUsed: axeBoostsUsed } =
      getRequiredAxeAmount(inventory, stateCopy);

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

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: [...axeBoostsUsed],
      createdAt,
    });

    return stateCopy;
  });
}
