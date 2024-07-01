import { Bud } from "../types/buds";
import { GameState } from "../types/game";
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
): number => {
  const boosts = Object.values(buds)
    // Bud must be placed to give a boost
    .filter((buds) => !!buds.coordinates)
    .map((bud) => getBudSpeedBoost(bud, resource));

  // Get the strongest boost from all the buds on the farm
  return Number(Math.min(...boosts, 1).toFixed(4));
};
