import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
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

  const flowerBed = flowers[action.id];

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

  stateCopy.inventory[action.seed] = seedCount.minus(1);

  flowerBed.flower = {
    plantedAt: createdAt,
    amount: 1,
    name: "Flower 1",
  };

  bumpkin.activity = trackActivity(
    `${action.seed} Planted`,
    bumpkin?.activity,
    new Decimal(1)
  );

  const updatedBeehives = updateBeehives({
    beehives: stateCopy.beehives,
    flowers: stateCopy.flowers,
    createdAt,
  });

  stateCopy.beehives = updatedBeehives;

  return stateCopy;
}
