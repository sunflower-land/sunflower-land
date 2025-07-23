import { getObjectEntries } from "../expansion/lib/utils";
import { Bud } from "../types/buds";
import { GameState } from "../types/game";
import { BudNFTName } from "../types/marketplace";
import { Resource, getAuraBoost, isCrop } from "./getBudYieldBoosts";

const getTypeBoost = (bud: Bud, resource: Resource): number => {
  if (isCrop(resource) && bud.type === "Saphiro") {
    return 0.1;
  }

  return 0;
};

const getBudSpeedBoost = (bud: Bud, resource: Resource): number => {
  return 1 - getAuraBoost(bud) * getTypeBoost(bud, resource);
};

export const getBudSpeedBoosts = (
  buds: NonNullable<GameState["buds"]>,
  resource: Resource,
): { speedBoost: number; budUsed: BudNFTName | undefined } => {
  const boosts = getObjectEntries(buds)
    // Bud must be placed to give a boost
    .filter(([_, bud]) => !!bud.coordinates)
    .map(([id, bud]) => [id, getBudSpeedBoost(bud, resource)] as const);

  const minBoost = Math.min(...boosts.map(([_, boost]) => boost), 1);
  const findBestBud = boosts.find(([_, boost]) => boost === minBoost);

  if (!findBestBud || minBoost === 1) {
    return { speedBoost: 1, budUsed: undefined };
  }

  // Get the strongest boost from all the buds on the farm
  return {
    speedBoost: Number(minBoost.toFixed(4)),
    budUsed: `Bud #${findBestBud[0]}`,
  };
};
