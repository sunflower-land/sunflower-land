import { FLOWERS, FLOWER_SEEDS } from "features/game/types/flowers";
import { GameState } from "../../types/game";
import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { trackActivity } from "features/game/types/bumpkinActivity";

import { translate } from "lib/i18n/translate";

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
    game: state,
    createdAt,
  });

  const bumpkin = stateCopy.bumpkin;

  if (!bumpkin) throw new Error("You do not have a Bumpkin!");

  const flowers = stateCopy.flowers;
  const flowerBed = flowers.flowerBeds[action.id];

  if (!flowerBed) throw new Error(translate("harvestflower.noFlowerBed"));

  const flower = flowerBed.flower;

  if (!flower) throw new Error(translate("harvestflower.noFlower"));

  const isReady =
    flower.plantedAt +
      FLOWER_SEEDS()[FLOWERS[flower.name].seed].plantSeconds * 1000 <
    createdAt;

  if (!isReady) throw new Error(translate("harvestflower.notReady"));

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
    new Decimal(1),
  );

  stateCopy.farmActivity = trackFarmActivity(
    `${flower.name} Harvested`,
    stateCopy.farmActivity,
    1,
  );

  stateCopy.beehives = updateBeehives({
    game: stateCopy,
    createdAt,
  });

  return stateCopy;
}
