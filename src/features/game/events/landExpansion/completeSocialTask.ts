import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";
import { translate } from "lib/i18n/translate";
import codexIcon from "assets/icons/codex.webp";
import promoteIcon from "assets/icons/promote.webp";
import tvIcon from "assets/icons/tv.webp";

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
  requirementProgress: (state: GameState) => number;
  requirementTotal?: number;
  reward: Partial<Record<InventoryItemName, number>>;
};

export const TASKS = {
  "Upgrade to Petal Paradise": {
    title: translate("socialTask.upgradeToPetalParadise"),
    description: translate("socialTask.upgradeToPetalParadise.description"),
    image: SUNNYSIDE.icons.hammer,
    reward: { "Love Charm": 25 },
    requirement: (state) =>
      hasRequiredIslandExpansion(state.island.type, "spring"),
  },
  "Complete 50 deliveries": {
    title: translate("socialTask.complete50Deliveries"),
    description: translate("socialTask.complete50Deliveries.description"),
    image: codexIcon,
    reward: { "Love Charm": 25 },
    requirement: (state) => state.delivery.fulfilledCount >= 50,
    requirementTotal: 50,
    requirementProgress: (state) => state.delivery.fulfilledCount,
  },
} satisfies Record<string, Task>;

export type InGameTaskName = keyof typeof TASKS;

/**
 * Other ways to earn Love Charm (Read-only)
 */
export const OTHER_WAYS_TO_EARN_LOVE_CHARM = {
  "Help Bumpkin NPCs": {
    title: translate("socialTask.helpBumpkinNPCs"),
    description: translate("socialTask.helpBumpkinNPCs.description"),
    image: SUNNYSIDE.icons.player,
  },
  "Refer a friend": {
    title: translate("socialTask.referFriend"),
    description: translate("socialTask.referFriend.description"),
    image: promoteIcon,
  },
  "Link your Discord": {
    title: translate("socialTask.linkDiscord"),
    description: translate("socialTask.linkDiscord.description"),
    image: SUNNYSIDE.icons.discord,
  },
  "Link your Telegram": {
    title: translate("socialTask.linkTelegram"),
    description: translate("socialTask.linkTelegram.description"),
    image: SUNNYSIDE.icons.telegram,
  },
  "Link your Twitter": {
    title: translate("socialTask.linkTwitter"),
    description: translate("socialTask.linkTwitter.description"),
    image: SUNNYSIDE.icons.twitter,
  },
  "Join a stream": {
    title: translate("socialTask.joinStream"),
    image: tvIcon,
    description: translate("socialTask.joinStream.description"),
  },
} satisfies Record<string, OtherTasks>;

export type OtherTaskName = keyof typeof OTHER_WAYS_TO_EARN_LOVE_CHARM;

export const isSocialTask = (task: Task | OtherTasks): task is Task =>
  "requirement" in task;

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
    if (!hasFeatureAccess(stateCopy, "TASK_BOARD")) {
      throw new Error("Task board is not enabled");
    }

    const { taskId } = action;
    const task = TASKS[taskId] as Task | undefined;

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
