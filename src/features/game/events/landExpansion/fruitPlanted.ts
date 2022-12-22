import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  FruitName,
  FruitSeedName,
  isFruitSeed,
} from "features/game/types/fruits";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type PlantFruitAction = {
  type: "fruit.planted";
  expansionIndex: number;
  index: number;
  seed: FruitSeedName;
};

type Options = {
  state: Readonly<GameState>;
  action: PlantFruitAction;
  createdAt?: number;
};

export function plantFruit({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
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

  if (action.index < 0) {
    throw new Error("Fruit patch does not exist");
  }

  if (!Number.isInteger(action.index)) {
    throw new Error("Fruit patch does not exist");
  }

  const patch = fruitPatches[action.index];

  if (!patch) {
    throw new Error("Fruit patch does not exist");
  }

  if (patch.fruit?.plantedAt) {
    throw new Error("Fruit is already planted");
  }

  if (!isFruitSeed(action.seed)) {
    throw new Error("Not a fruit seed");
  }

  const seedCount = stateCopy.inventory[action.seed] || new Decimal(0);

  if (seedCount.lessThan(1)) {
    throw new Error("Not enough seeds");
  }

  stateCopy.inventory[action.seed] = stateCopy.inventory[action.seed]?.minus(1);

  const fruitName = action.seed.split(" ")[0] as FruitName;

  patch.fruit = {
    name: fruitName,
    plantedAt: createdAt,
    amount: 1,
    harvestedAt: 0,
    // Value will be overriden by BE
    harvestsLeft: 1,
  };

  bumpkin.activity = trackActivity(
    `${action.seed} Planted`,
    bumpkin?.activity,
    new Decimal(1)
  );

  return stateCopy;
}
