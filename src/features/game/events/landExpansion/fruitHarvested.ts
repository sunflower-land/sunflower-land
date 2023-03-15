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
  index: string;
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

function getPlantedAt(
  fruitName: FruitName,
  collectibles: Collectibles,
  createdAt: number
) {
  if (
    fruitName === "Orange" &&
    isCollectibleBuilt("Squirrel Monkey", collectibles)
  ) {
    const orangeTimeInMilliseconds =
      FRUIT_SEEDS()["Orange Seed"].plantSeconds * 1000;

    const offset = orangeTimeInMilliseconds / 2;

    return createdAt - offset;
  }

  return createdAt;
}

export function harvestFruit({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { fruitPatches, bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const patch = fruitPatches[action.index];

  if (!patch) {
    throw new Error("Fruit patch does not exist");
  }

  if (!patch.fruit) {
    throw new Error("Nothing was planted");
  }

  const { name, plantedAt, harvestsLeft, harvestedAt, amount } = patch.fruit;

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

  stateCopy.inventory[name] =
    stateCopy.inventory[name]?.add(amount) ?? new Decimal(amount);

  patch.fruit.harvestsLeft = patch.fruit.harvestsLeft - 1;
  patch.fruit.harvestedAt = getPlantedAt(
    name,
    stateCopy.collectibles,
    createdAt
  );

  patch.fruit.amount = getFruitYield(name, stateCopy.collectibles);

  const activityName: BumpkinActivityName = `${name} Harvested`;

  bumpkin.activity = trackActivity(activityName, bumpkin.activity);

  return stateCopy;
}
