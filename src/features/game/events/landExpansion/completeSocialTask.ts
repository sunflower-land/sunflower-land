import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import codexIcon from "assets/icons/codex.webp";

export type OtherTasks = {
  title: string;
  description: string;
  image: string;
};

/**
 * @param requirement - A function that returns true if the task is completed
 * @param requirementProgress - A function that returns the progress of the task (optional)
 * @param requirementTotal - The total number of the task (optional)
 * @param reward - The reward of the task
 */
export type Task = OtherTasks & {
  requirement: (state: GameState) => boolean;
  requirementTotal: number;
  reward: Partial<Record<InventoryItemName, number>>;
  currentProgress?: (state: GameState) => number;
};

export const IN_GAME_TASKS = {
  "Link your Discord": {
    title: translate("socialTask.linkDiscord"),
    description: translate("socialTask.linkDiscord.description"),
    image: SUNNYSIDE.icons.discord,
    reward: { "Love Charm": 25 },
    requirement: (state) => !!state.discord?.connected,
    requirementTotal: 1,
  },
  "Link your Telegram": {
    title: translate("socialTask.linkTelegram"),
    description: translate("socialTask.linkTelegram.description"),
    image: SUNNYSIDE.icons.telegram,
    reward: { "Love Charm": 25 },
    requirement: (state) => !!state.telegram?.linkedAt,
    requirementTotal: 1,
  },
  "Upgrade to Petal Paradise": {
    title: translate("socialTask.upgradeToPetalParadise"),
    description: translate("socialTask.upgradeToPetalParadise.description"),
    image: SUNNYSIDE.icons.hammer,
    reward: { "Love Charm": 25 },
    requirement: (state) =>
      hasRequiredIslandExpansion(state.island.type, "spring"),
    requirementTotal: 1,
  },
  "Complete 50 deliveries": {
    title: translate("socialTask.complete50Deliveries"),
    description: translate("socialTask.complete50Deliveries.description"),
    image: codexIcon,
    reward: { "Love Charm": 25 },
    requirement: (state) => state.delivery.fulfilledCount >= 50,
    requirementTotal: 50,
    currentProgress: (state) => state.delivery.fulfilledCount,
  },
} satisfies Record<string, Task>;

export type InGameTaskName = keyof typeof IN_GAME_TASKS;

export const ALL_TASKS = {
  ...IN_GAME_TASKS,
};

export const isSocialTask = (task: Task | OtherTasks): task is Task =>
  "requirement" in task;

export const isSocialTaskName = (task: string): task is InGameTaskName =>
  task in IN_GAME_TASKS;

export type CompleteSocialTaskAction = {
  type: "socialTask.completed";
  taskId: InGameTaskName;
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteSocialTaskAction;
  createdAt?: number;
};

export function completeSocialTask({
  state,
  action,
  createdAt = Date.now(),
}: Options): Readonly<GameState> {
  return produce(state, (stateCopy) => {
    const { taskId } = action;
    const task = IN_GAME_TASKS[taskId] as Task | undefined;

    if (!task) {
      throw new Error("Task not found");
    }

    const { reward, requirement } = task;

    if (!requirement(state)) {
      throw new Error("Requirement not met");
    }

    if (stateCopy.socialTasks?.completed?.[taskId]) {
      throw new Error("Task already completed");
    }

    getObjectEntries(reward).forEach(([key, value]) => {
      stateCopy.inventory[key] = (
        stateCopy.inventory[key] ?? new Decimal(0)
      ).add(value ?? 0);
    });

    if (!stateCopy.socialTasks) {
      stateCopy.socialTasks = { completed: {} };
    }

    stateCopy.socialTasks.completed[taskId] = { completedAt: createdAt };

    return stateCopy;
  });
}
