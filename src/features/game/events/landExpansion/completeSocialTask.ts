import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";

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
  requirementProgress?: (state: GameState) => number;
  requirementTotal?: number;
  reward: Partial<Record<InventoryItemName, number>>;
};

export const TASKS = {
  "Invite a friend": {
    title: "Invite a friend",
    description: "Invite a friend to join the game",
    image: SUNNYSIDE.icons.player,
    reward: { "Love Charm": 15 },
    requirement: (state) =>
      (state.referrals ?? { totalReferrals: 0 }).totalReferrals > 0,
  },
  "Link your Discord": {
    title: "Link your Discord",
    description: "Link your Discord to your account",
    image: SUNNYSIDE.icons.discord,
    reward: { "Love Charm": 25 },
    requirement: (state) => !!state.discord?.connected,
  },
  "Link your Telegram": {
    title: "Link your Telegram",
    description: "Link your Telegram to your account",
    image: SUNNYSIDE.icons.telegram,
    reward: { "Love Charm": 25 },
    requirement: (state) => !!state.telegram?.linkedAt,
  },
  "Upgrade to Petal Paradise": {
    title: "Upgrade to Petal Paradise",
    description: "Expand your land fully and upgrade to Petal Paradise",
    image: SUNNYSIDE.icons.player,
    reward: { "Love Charm": 25 },
    requirement: (state) =>
      hasRequiredIslandExpansion(state.island.type, "spring"),
  },
  "Complete 50 deliveries": {
    title: "Complete 50 deliveries",
    description:
      "Go to the plaza and complete deliveries with various NPCs 50 times",
    image: SUNNYSIDE.icons.player,
    reward: { "Love Charm": 25 },
    requirement: (state) => state.delivery.fulfilledCount >= 50,
    requirementTotal: 50,
    requirementProgress: (state) => state.delivery.fulfilledCount,
  },
} satisfies Record<string, Task>;

export type SocialTaskName = keyof typeof TASKS;

/**
 * Other ways to earn Love Charm (Read-only)
 */
export const OTHER_WAYS_TO_EARN_LOVE_CHARM = {
  "Invite a VIP friend": {
    title: "Invite a VIP friend",
    image: SUNNYSIDE.icons.player,
    description:
      "Invite a friend to join the game and buy VIP to earn bonus Love Charm",
  },
  "Join a stream": {
    title: "Join a stream",
    image: SUNNYSIDE.icons.player,
    description:
      "Join a dev chat on discord or twitch stream to earn 1 Love Charm every 5 minutes from the host wearing a stream hat.",
  },
} satisfies Record<string, OtherTasks>;

export const isSocialTask = (task: Task | OtherTasks): task is Task =>
  "requirement" in task;

export type CompleteSocialTaskAction = {
  type: "socialTask.completed";
  taskId: SocialTaskName;
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
    if (!hasFeatureAccess(stateCopy, "REFERRAL_PROGRAM")) {
      throw new Error("Referral program is not enabled");
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
