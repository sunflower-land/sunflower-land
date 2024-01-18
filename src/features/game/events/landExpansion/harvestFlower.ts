import { FLOWERS } from "features/game/types/flowers";
import { GameState } from "../../types/game";
import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { translate } from "lib/i18n/translate";

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

  const bumpkin = stateCopy.bumpkin;

  if (!bumpkin) throw new Error(translate("harvestflower.noBumpkin"));

  const flowerBed = stateCopy.flowers[action.id];

  if (!flowerBed) throw new Error(translate("harvestflower.noFlowerBed"));

  const flower = flowerBed.flower;

  if (!flower) throw new Error(translate("harvestflower.noFlower"));

  const isReady =
    flower.plantedAt + FLOWERS[flower.name].harvestSeconds * 1000 < createdAt;

  if (!isReady) throw new Error(translate("harvestflower.notReady"));

  stateCopy.inventory[flower.name] = (
    stateCopy.inventory[flower.name] ?? new Decimal(0)
  ).add(flower.amount);

  delete flowerBed.flower;

  bumpkin.activity = trackActivity(
    `${flower.name} Harvested`,
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
