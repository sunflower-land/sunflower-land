import Decimal from "decimal.js-light";
import { CROPS } from "../types/crops";
import { GameState } from "../types/game";

export type OpenRewardAction = {
  type: "reward.opened";
  fieldIndex: number;
};

type Options = {
  state: GameState;
  action: OpenRewardAction;
  createdAt?: number;
};

export function openReward({ state, action, createdAt = Date.now() }: Options) {
  const field = state.fields[action.fieldIndex];

  if (!field) {
    throw new Error("Field does not exist");
  }

  if (!field.reward) {
    throw new Error("Field does not have a reward");
  }

  const crop = CROPS()[field.name];

  if (createdAt - field.plantedAt < crop.harvestSeconds * 1000) {
    throw new Error("Not ready");
  }

  // Only a single seed reward supported at the moment
  const seed = field.reward.items[0];

  const inventory = { ...state.inventory };

  const seedBalance = inventory[seed.name] || new Decimal(0);
  inventory[seed.name] = seedBalance.add(seed.amount);

  // Remove the reward
  delete state.fields[action.fieldIndex].reward;

  return {
    ...state,
    inventory,
  };
}
