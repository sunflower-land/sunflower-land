import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type RemoveFruitTreeAction = {
  type: "fruitTree.removed";
  expansionIndex: number;
  index: number;
  item: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveFruitTreeAction;
  createdAt?: number;
};

export function removeFruitTree({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { expansions, bumpkin, inventory } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  if (!expansion.fruitPatches) {
    throw new Error("Expansion does not have any fruit patches");
  }

  if (action.item !== "Axe") {
    throw new Error("No axe");
  }

  const axeAmount = inventory.Axe || new Decimal(0);

  if (axeAmount.lessThan(1)) {
    throw new Error("No axes left");
  }

  const { fruitPatches } = expansion;

  const patch = fruitPatches[action.index];

  if (!patch) {
    throw new Error("Fruit patch does not exist");
  }

  if (!patch.fruit) {
    throw new Error("Nothing was planted");
  }

  const { harvestsLeft } = patch.fruit;

  if (harvestsLeft) {
    throw new Error("Fruit is still available");
  }

  delete patch.fruit;

  inventory.Axe = axeAmount.sub(1);
  stateCopy.inventory.Wood = stateCopy.inventory.Wood?.add(1) || new Decimal(1);

  return stateCopy;
}
