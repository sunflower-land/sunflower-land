import Decimal from "decimal.js-light";
import { FLOWERS } from "../types/flowers";
import { GameState } from "../types/game";

export type openFlowerRewardAction = {
  type: "flower.reward";
  flowerFieldIndex: number;
};

type Options = {
  state: GameState;
  action: openFlowerRewardAction;
  createdAt?: number;
};

export function openFlowerReward({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const flowerField = state.flowerFields[action.flowerFieldIndex];

  if (!flowerField) {
    throw new Error("Field does not exist");
  }

  if (!flowerField.flowerReward) {
    throw new Error("Field does not have a flowerReward");
  }

  const flower = FLOWERS()[flowerField.name];

  if (createdAt - flowerField.plantedAt < flower.harvestSeconds * 1000) {
    throw new Error("Not ready");
  }

  // Only a single seed flowerReward supported at the moment
  const flowerSeed = flowerField.flowerReward.items[0];

  const inventory = { ...state.inventory };

  const flowerSeedBalance = inventory[flowerSeed.name] || new Decimal(0);
  inventory[flowerSeed.name] = flowerSeedBalance.add(flowerSeed.amount);

  // Remove the reward
  delete state.flowerFields[action.flowerFieldIndex].flowerReward;

  return {
    ...state,
    inventory,
  };
}
