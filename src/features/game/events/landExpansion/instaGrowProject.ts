import { produce } from "immer";
import { GameState } from "features/game/types/game";
import { MonumentName, REQUIRED_CHEERS } from "features/game/types/monuments";
import Decimal from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";

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
  "Big Orange": 0.5,
  "Big Apple": 1,
  "Big Banana": 4,
};

export function getPartialInstantGrowPrice({
  progress,
  project,
}: {
  progress: number;
  project: MonumentName;
}) {
  const initialPrice = INSTA_GROW_PRICES[project] ?? 0;
  const requiredCheers = REQUIRED_CHEERS[project];

  // Round to the nearest tenth
  const progressPercentage = Math.floor((progress / requiredCheers) * 10) / 10;
  const partialMultiplier = 1 - progressPercentage;

  return setPrecision(initialPrice * partialMultiplier, 2).toNumber();
}

export function instantGrowProject({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const project = stateCopy.socialFarming.villageProjects[action.project];

    if (!project) {
      throw new Error("Project does not exist");
    }

    const requiredCheers = REQUIRED_CHEERS[action.project];

    if (project.cheers >= requiredCheers) {
      throw new Error("Project is already finished");
    }

    const price = getPartialInstantGrowPrice({
      progress: project.cheers,
      project: action.project,
    });

    if (!price) {
      throw new Error("Project can not be insta-grown");
    }

    const obsidian = state.inventory.Obsidian ?? new Decimal(0);

    if (obsidian.lessThan(price)) {
      throw new Error("Insufficient Obsidian");
    }

    stateCopy.inventory.Obsidian = obsidian.sub(price);

    project.cheers = requiredCheers;
  });
}
