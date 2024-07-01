import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  CHICKEN_COOP_MULTIPLIER,
  HEN_HOUSE_CAPACITY,
} from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

export const getFruitHarvests = (state: Readonly<GameState>) => {
  if (isCollectibleBuilt({ name: "Immortal Pear", game: state })) {
    return [4, 6];
  }

  return [3, 5];
};

export const getSupportedChickens = (state: Readonly<GameState>) => {
  const henHouses =
    state.buildings["Hen House"]?.filter(
      (building) => building.readyAt < Date.now(),
    ).length ?? 0;

  const chickenCoop = isCollectibleBuilt({ name: "Chicken Coop", game: state });

  let capacity = henHouses * HEN_HOUSE_CAPACITY;

  if (chickenCoop) {
    capacity *= CHICKEN_COOP_MULTIPLIER;
  }

  return capacity;
};
