import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  FLOWER_CROSS_BREED_AMOUNTS,
  FlowerCrossBreedName,
  FlowerSeedName,
  isFlowerSeed,
} from "features/game/types/flowers";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { translate } from "lib/i18n/translate";

export type PlantFlowerAction = {
  type: "flower.planted";
  id: string;
  seed: FlowerSeedName;
  crossbreed: FlowerCrossBreedName;
};

type Options = {
  state: Readonly<GameState>;
  action: PlantFlowerAction;
  createdAt?: number;
};

export function plantFlower({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy: GameState = cloneDeep(state);
  const { flowers, bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error(translate("harvestflower.noBumpkin"));
  }

  const flowerBed = flowers.flowerBeds[action.id];

  if (!flowerBed) {
    throw new Error(translate("harvestflower.noFlowerBed"));
  }

  if (flowerBed.flower?.plantedAt) {
    throw new Error(translate("harvestflower.alr.plant"));
  }

  if (!isFlowerSeed(action.seed)) {
    throw new Error("Not a flower seed");
  }

  const seedCount = stateCopy.inventory[action.seed] ?? new Decimal(0);

  if (seedCount.lessThan(1)) {
    throw new Error("Not enough seeds");
  }

  const crossBreedCount =
    stateCopy.inventory[action.crossbreed] ?? new Decimal(0);
  const crossBreedAmount = FLOWER_CROSS_BREED_AMOUNTS[action.crossbreed];

  if (crossBreedCount.lessThan(crossBreedAmount)) {
    throw new Error("Not enough crossbreeds");
  }

  stateCopy.inventory[action.seed] = seedCount.minus(1);
  stateCopy.inventory[action.crossbreed] =
    crossBreedCount.minus(crossBreedAmount);

  flowerBed.flower = {
    plantedAt: createdAt,
    amount: 1,
    name: "Red Pansy",
    dirty: true,
  };

  bumpkin.activity = trackActivity(
    `${action.seed} Planted`,
    bumpkin?.activity,
    new Decimal(1)
  );

  const updatedBeehives = updateBeehives({
    beehives: stateCopy.beehives,
    flowerBeds: stateCopy.flowers.flowerBeds,
    createdAt,
  });

  stateCopy.beehives = updatedBeehives;

  return stateCopy;
}
