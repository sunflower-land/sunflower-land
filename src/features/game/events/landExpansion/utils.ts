import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  CHICKEN_COOP_MULTIPLIER,
  HEN_HOUSE_CAPACITY,
} from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { isFullMoonBerry } from "./seedBought";
import { SeedName } from "features/game/types/seeds";

export const getFruitHarvests = (
  state: Readonly<GameState>,
  seed: SeedName,
) => {
  let harvests = [3, 5];
  if (isFullMoonBerry(seed)) {
    harvests = [4, 4];
  }
  if (isCollectibleBuilt({ name: "Immortal Pear", game: state })) {
    harvests = harvests.map(
      (harvest) => harvest + (state.bumpkin.skills["Pear Turbocharge"] ? 2 : 1),
    );
  }

  return harvests;
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
