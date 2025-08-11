import { produce } from "immer";
import { GameState } from "features/game/types/game";
import { MonumentName, REQUIRED_CHEERS } from "features/game/types/monuments";
import Decimal from "decimal.js-light";

export type InstantGrowProjectAction = {
  type: "project.instantGrow";
  project: MonumentName;
};

type Options = {
  state: Readonly<GameState>;
  action: InstantGrowProjectAction;
  createdAt?: number;
};

export const INSTA_GROW_PRICES: Partial<Record<MonumentName, number>> = {
  "Big Orange": 1,
  "Big Apple": 1,
  "Big Banana": 1,
};

export function instantGrowProject({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const price = INSTA_GROW_PRICES[action.project];

    if (!price) {
      throw new Error("Project can not be insta-grown");
    }

    const project = stateCopy.socialFarming.villageProjects[action.project];

    if (!project) {
      throw new Error("Project does not exist");
    }

    const requiredCheers = REQUIRED_CHEERS[action.project];

    if (project.cheers >= requiredCheers) {
      throw new Error("Project is already finished");
    }

    const obsidian = state.inventory.Obsidian ?? new Decimal(0);

    if (obsidian.lessThan(price)) {
      throw new Error("Insufficient Obsidian");
    }

    stateCopy.inventory.Obsidian = obsidian.sub(price);

    project.cheers = requiredCheers;
  });
}
