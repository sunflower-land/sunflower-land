import { GameState, InventoryItemName } from "../../types/game";
import { produce } from "immer";
import { MonumentName } from "features/game/types/monuments";
import Decimal from "decimal.js-light";

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

    const rewardItem = REWARD_ITEMS[action.project];

    if (!rewardItem) {
      throw new Error("Project does not have a reward");
    }

    stateCopy.inventory[rewardItem.item] =
      stateCopy.inventory[rewardItem.item]?.add(rewardItem.amount) ??
      new Decimal(rewardItem.amount);

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
