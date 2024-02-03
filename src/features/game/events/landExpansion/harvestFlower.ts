import { FLOWERS, FLOWER_SEEDS } from "features/game/types/flowers";
import { GameState } from "../../types/game";
import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { trackFarmActivity } from "features/game/types/farmActivity";

export type HarvestFlowerAction = {
  type: "flower.harvested";
  id: string;
};

type Options = {
  state: GameState;
  action: HarvestFlowerAction;
  createdAt?: number;
};

export function harvestFlower({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);

  stateCopy.beehives = updateBeehives({
    beehives: stateCopy.beehives,
    flowerBeds: stateCopy.flowers.flowerBeds,
    createdAt,
  });

  const bumpkin = stateCopy.bumpkin;

  if (!bumpkin) throw new Error("You do not have a Bumpkin");

  const flowers = stateCopy.flowers;
  const flowerBed = flowers.flowerBeds[action.id];

  if (!flowerBed) throw new Error("Flower bed does not exist");

  const flower = flowerBed.flower;

  if (!flower) throw new Error("Flower bed does not have a flower");

  const isReady =
    flower.plantedAt +
      FLOWER_SEEDS()[FLOWERS[flower.name].seed].plantSeconds * 1000 <
    createdAt;

  if (!isReady) throw new Error("Flower is not ready to harvest");

  stateCopy.inventory[flower.name] = (
    stateCopy.inventory[flower.name] ?? new Decimal(0)
  ).add(flower.amount);

  const discovered = flowers.discovered[flower.name] ?? [];
  if (!!flower.crossbreed && !discovered.includes(flower.crossbreed)) {
    flowers.discovered[flower.name] = [...discovered, flower.crossbreed];
  }

  delete flowerBed.flower;

  bumpkin.activity = trackActivity(
    `${flower.name} Harvested`,
    bumpkin?.activity,
    new Decimal(1)
  );

  stateCopy.farmActivity = trackFarmActivity(
    `${flower.name} Harvested`,
    stateCopy.farmActivity,
    1
  );

  stateCopy.beehives = updateBeehives({
    beehives: stateCopy.beehives,
    flowerBeds: stateCopy.flowers.flowerBeds,
    createdAt,
  });

  return stateCopy;
}
