/**
 * @deprecated Use the event handler instead
 * Experimenting new raffle system
 */
import { GameState, InventoryItemName } from "../../types/game";
import { produce } from "immer";
import { MonumentName } from "features/game/types/monuments";
import Decimal from "decimal.js-light";
import { hasFeatureAccess } from "lib/flags";
import cloneDeep from "lodash.clonedeep";

export const REQUIRED_CHEERS: Record<MonumentName, number> = {
  "Big Orange": 50,
  "Big Apple": 200,
  "Big Banana": 1000,
  "Basic Cooking Pot": 10,
  "Expert Cooking Pot": 50,
  "Advanced Cooking Pot": 100,
  "Farmer's Monument": 100,
  "Woodcutter's Monument": 1000,
  "Miner's Monument": 10000,
  "Teamwork Monument": 100,
};

export const REWARD_ITEMS: Partial<
  Record<
    MonumentName,
    {
      item: InventoryItemName;
      amount: number;
    }
  >
> = {
  "Big Orange": {
    item: "Love Charm",
    amount: 200,
  },
  "Big Apple": {
    item: "Love Charm",
    amount: 400,
  },
  "Big Banana": {
    item: "Love Charm",
    amount: 600,
  },
  "Basic Cooking Pot": {
    item: "Bronze Food Box",
    amount: 1,
  },
  "Expert Cooking Pot": {
    item: "Silver Food Box",
    amount: 1,
  },
  "Advanced Cooking Pot": {
    item: "Gold Food Box",
    amount: 1,
  },
};

export type CompleteProjectAction = {
  type: "project.completed";
  project: MonumentName;
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteProjectAction;
  createdAt?: number;
};

export function completeProject({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const project = stateCopy.socialFarming.villageProjects?.[action.project];

    if (!project) {
      throw new Error("Project not found");
    }

    const requiredCheers = REQUIRED_CHEERS[action.project];

    if (project.cheers < requiredCheers) {
      throw new Error("Project is not complete");
    }

    let rewards = cloneDeep(REWARD_ITEMS);

    if (hasFeatureAccess(stateCopy, "CHEERS_V2")) {
      rewards["Big Orange"] = { amount: 1, item: "Bronze Love Box" };
      rewards["Big Apple"] = { amount: 1, item: "Silver Love Box" };
      rewards["Big Banana"] = { amount: 1, item: "Gold Love Box" };

      // Double Food Box Rewards
      rewards["Basic Cooking Pot"] = { amount: 2, item: "Bronze Love Box" };
      rewards["Expert Cooking Pot"] = { amount: 2, item: "Silver Love Box" };
      rewards["Advanced Cooking Pot"] = { amount: 2, item: "Gold Love Box" };
    }

    const rewardItem = rewards[action.project];

    if (!rewardItem) {
      throw new Error("Project does not have a reward");
    }

    const rewardAmount = rewardItem.amount;
    let boost = 0;

    if (rewardItem.item === "Love Charm") {
      boost = getLoveCharmBoost(stateCopy, rewardAmount);
    }

    const newAmount = rewardAmount + boost;

    stateCopy.inventory[rewardItem.item] =
      stateCopy.inventory[rewardItem.item]?.add(newAmount) ??
      new Decimal(newAmount);

    // Delete the village project
    stateCopy.socialFarming.villageProjects[action.project] = undefined;
    stateCopy.inventory[action.project] = (
      stateCopy.inventory[action.project] ?? new Decimal(1)
    )?.sub(1);

    // Delete the placed monument
    delete stateCopy.collectibles[action.project];
    delete stateCopy.home.collectibles[action.project];

    return stateCopy;
  });
}

export const getLoveCharmBoost = (state: GameState, rewardAmount: number) => {
  let boost = 0;

  if (
    (state.socialFarming.villageProjects["Farmer's Monument"]?.cheers ?? 0) >=
    REQUIRED_CHEERS["Farmer's Monument"]
  ) {
    boost += rewardAmount * 0.01;
  }
  if (
    (state.socialFarming.villageProjects["Woodcutter's Monument"]?.cheers ??
      0) >= REQUIRED_CHEERS["Woodcutter's Monument"]
  ) {
    boost += rewardAmount * 0.03;
  }
  if (
    (state.socialFarming.villageProjects["Miner's Monument"]?.cheers ?? 0) >=
    REQUIRED_CHEERS["Miner's Monument"]
  ) {
    boost += rewardAmount * 0.06;
  }
  if (
    (state.socialFarming.villageProjects["Teamwork Monument"]?.cheers ?? 0) >=
    REQUIRED_CHEERS["Teamwork Monument"]
  ) {
    boost += rewardAmount * 0.1;
  }

  return boost;
};
