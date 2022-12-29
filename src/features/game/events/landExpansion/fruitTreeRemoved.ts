import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type ChopFruitTreeAction = {
  type: "fruitTree.removed";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: ChopFruitTreeAction;
};

export function removeFruitTree({ state, action }: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { expansions, bumpkin } = stateCopy;
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

  stateCopy.inventory.Wood = stateCopy.inventory.Wood?.add(1);

  return stateCopy;
}
