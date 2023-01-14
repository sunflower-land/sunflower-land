import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";
import { FRUIT, FruitName, FRUIT_SEEDS } from "features/game/types/fruits";
import { Collectibles, GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type HarvestFruitAction = {
  type: "fruit.harvested";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestFruitAction;
  createdAt?: number;
};

export function getFruitYield(name: FruitName, collectibles: Collectibles) {
  if (name === "Apple" && isCollectibleBuilt("Lady Bug", collectibles)) {
    return 1.25;
  }

  if (
    name === "Blueberry" &&
    isCollectibleBuilt("Black Bearry", collectibles)
  ) {
    return 2;
  }

  return 1;
}

export function harvestFruit({
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

  const patch = fruitPatches[action.index];

  if (!patch) {
    throw new Error("Fruit patch does not exist");
  }

  if (!patch.fruit) {
    throw new Error("Nothing was planted");
  }

  const { name, plantedAt, harvestsLeft, harvestedAt } = patch.fruit;

  const { seed } = FRUIT()[name];
  const { plantSeconds } = FRUIT_SEEDS()[seed];

  if (createdAt - plantedAt < plantSeconds * 1000) {
    throw new Error("Not ready");
  }

  if (createdAt - harvestedAt < plantSeconds * 1000) {
    throw new Error("Fruit is still replenishing");
  }

  if (!harvestsLeft) {
    throw new Error("No harvest left");
  }

  patch.fruit.harvestsLeft = patch.fruit.harvestsLeft - 1;
  patch.fruit.harvestedAt = createdAt;

  patch.fruit.amount = getFruitYield(name, stateCopy.collectibles);

  stateCopy.inventory[name] =
    stateCopy.inventory[name]?.add(1) || new Decimal(1);

  const activityName: BumpkinActivityName = `${name} Harvested`;

  bumpkin.activity = trackActivity(activityName, bumpkin.activity);

  return stateCopy;
}
