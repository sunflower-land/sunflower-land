import { Bud } from "../types/buds";
import { GameState } from "../types/game";
import { getAuraBoost } from "./getBudYieldBoosts";
import { Consumable, FISH_CONSUMABLES } from "features/game/types/consumables";

const getTypeBoost = (bud: Bud, food: Consumable): number => {
  if (food.name in FISH_CONSUMABLES && bud.type === "Port") {
    return 0.1;
  }

  return 0;
};

const getBudExperienceBoost = (bud: Bud, food: Consumable): number => {
  return 1 + getAuraBoost(bud) * getTypeBoost(bud, food);
};

export const getBudExperienceBoosts = (
  buds: NonNullable<GameState["buds"]>,
  food: Consumable,
): number => {
  const boosts = Object.values(buds)
    // Bud must be placed to give a boost
    .filter((buds) => !!buds.coordinates)
    .map((bud) => getBudExperienceBoost(bud, food));

  // Get the strongest boost from all the buds on the farm
  return Number(Math.max(...boosts, 1).toFixed(4));
};
