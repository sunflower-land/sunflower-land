import { FLOWERS } from "features/game/types/flowers";
import { GameState } from "../../types/game";
import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";

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

  const flowerBed = stateCopy.flowers[action.id];

  if (!flowerBed) throw new Error("Flower bed does not exist");

  const flower = flowerBed.flower;

  if (!flower) throw new Error("Flower bed does not have a flower");

  const isReady =
    flower.plantedAt + FLOWERS[flower.name].harvestSeconds * 1000 < createdAt;

  if (!isReady) throw new Error("Flower is not ready to harvest");

  stateCopy.inventory[flower.name] = (
    stateCopy.inventory[flower.name] ?? new Decimal(0)
  ).add(flower.amount);

  delete flowerBed.flower;

  return stateCopy;
}
