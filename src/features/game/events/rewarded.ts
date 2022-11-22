import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { CROPS } from "../types/crops";
import { GameState } from "../types/game";

export type OpenRewardAction = {
  type: "reward.opened";
  fieldIndex: number;
};

type Options = {
  state: Readonly<GameState>;
  action: OpenRewardAction;
  createdAt?: number;
};

export function openReward({ state, action, createdAt = Date.now() }: Options) {
  const stateCopy = cloneDeep(state);
  const field = stateCopy.fields[action.fieldIndex];

  if (!field) {
    throw new Error("Field does not exist");
  }

  if (!field.reward) {
    throw new Error("Field does not have a reward");
  }

  if (!field.reward.items) {
    throw new Error("Field does not have a reward");
  }

  const crop = CROPS()[field.name];

  if (createdAt - field.plantedAt < crop.harvestSeconds * 1000) {
    throw new Error("Not ready");
  }

  // Only a single seed reward supported at the moment
  const seed = field.reward.items[0];

  const { inventory } = stateCopy;

  const seedBalance = inventory[seed.name] || new Decimal(0);
  inventory[seed.name] = seedBalance.add(seed.amount);

  // Remove the reward
  delete stateCopy.fields[action.fieldIndex].reward;

  return {
    ...stateCopy,
    inventory,
  };
}
