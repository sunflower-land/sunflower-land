import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  CHICKEN_COOP_MULTIPLIER,
  HEN_HOUSE_CAPACITY,
} from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

export const getFruitHarvests = (state: Readonly<GameState>) => {
  if (isCollectibleBuilt("Immortal Pear", state.collectibles)) {
    return [4, 6];
  }

  return [3, 5];
};

export const getSupportedChickens = (state: Readonly<GameState>) => {
  const henHouses =
    state.buildings["Hen House"]?.filter(
      (building) => building.readyAt < Date.now()
    ).length ?? 0;

  const chickenCoop =
    state.collectibles["Chicken Coop"]?.filter(
      (coop) => coop.readyAt < Date.now()
    ).length ?? 0;

  let capacity = henHouses * HEN_HOUSE_CAPACITY;

  if (chickenCoop) {
    capacity *= CHICKEN_COOP_MULTIPLIER;
  }

  return capacity;
};

export const removeItem = <T>(
  arr: Array<T>,
  value: T
): Array<T> | undefined => {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr.length ? arr : undefined;
};
