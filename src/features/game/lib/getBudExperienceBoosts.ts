import { getObjectEntries } from "../expansion/lib/utils";
import { Bud } from "../types/buds";
import { GameState } from "../types/game";
import { getAuraBoost } from "./getBudYieldBoosts";
import { Consumable, FISH_CONSUMABLES } from "features/game/types/consumables";
import { BudNFTName } from "features/game/types/marketplace";

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
): { exp: number; budUsed: BudNFTName | undefined } => {
  const boosts = getObjectEntries(buds)
    // Bud must be placed to give a boost
    .filter(([_, bud]) => !!bud.coordinates)
    .map(([id, bud]) => [id, getBudExperienceBoost(bud, food)] as const);

  const maxBoost = Math.max(...boosts.map(([_, boost]) => boost), 1);
  const findBestBud = boosts.find(([_, boost]) => boost === maxBoost);
  // Get the strongest boost from all the buds on the farm

  if (!findBestBud || maxBoost === 1) {
    return { exp: 1, budUsed: undefined };
  }

  return {
    exp: Number(maxBoost.toFixed(4)),
    budUsed: `Bud #${findBestBud[0]}`,
  };
};
