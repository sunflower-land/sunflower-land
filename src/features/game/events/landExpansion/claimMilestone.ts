import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import {
  MilestoneName,
  MILESTONES,
  isInventoryItemReward,
} from "features/game/types/milestones";
import cloneDeep from "lodash.clonedeep";

export type ClaimMilestoneAction = {
  type: "milestone.claimed";
  milestone: MilestoneName;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimMilestoneAction;
};

export function claimMilestone({ state, action }: Options): GameState {
  const copy = cloneDeep(state) as GameState;

  const milestone = MILESTONES[action.milestone];

  if (copy.milestones[action.milestone]) {
    throw new Error("You already have this milestone");
  }

  const percentageComplete = milestone.percentageComplete(copy.farmActivity);

  if (percentageComplete < 100) {
    throw new Error("You do not meet the requirements");
  }

  copy.milestones[action.milestone] = 1;

  const rewards = getKeys(milestone.reward);

  for (const reward of rewards) {
    const rewardAmount = Number(milestone.reward[reward]);

    if (isInventoryItemReward(reward)) {
      const amountInInventory = copy.inventory[reward] ?? new Decimal(0);

      copy.inventory[reward] = amountInInventory.add(new Decimal(rewardAmount));

      continue;
    }

    const amountInWardrobe = copy.wardrobe[reward] ?? 0;
    copy.wardrobe[reward] = amountInWardrobe + rewardAmount;
  }

  return copy;
}
