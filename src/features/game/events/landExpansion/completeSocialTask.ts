import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";

export type Task = {
  title: string;
  description: string;
  image: string;
  requirement: (state: GameState) => boolean;
  reward: Partial<Record<InventoryItemName, number>>;
};

export type OtherTasks = Omit<Task, "requirement" | "reward">;

export const TASKS = {
  "Invite a friend": {
    title: "Invite a friend",
    description: "Invite a friend to join the game",
    image: SUNNYSIDE.icons.player,
    reward: { "Social Spark": 15 },
    requirement: (state) =>
      (state.referrals ?? { totalReferrals: 0 }).totalReferrals > 0,
  },
  "Link your Discord": {
    title: "Link your Discord",
    description: "Link your Discord to your account",
    image: SUNNYSIDE.icons.discord,
    reward: { "Social Spark": 25 },
    requirement: (state) => (state.wardrobe["Companion Cap"] ?? 0) > 0,
  },
  "Link your Telegram": {
    title: "Link your Telegram",
    description: "Link your Telegram to your account",
    image: SUNNYSIDE.icons.telegram,
    reward: { "Social Spark": 25 },
    requirement: () => false,
  },
  "Upgrade to Petal Paradise": {
    title: "Upgrade to Petal Paradise",
    description: "Expand your land fully and upgrade to Petal Paradise",
    image: SUNNYSIDE.icons.player,
    reward: { "Social Spark": 25 },
    requirement: (state) =>
      hasRequiredIslandExpansion(state.island.type, "spring"),
  },
  "Complete 50 deliveries": {
    title: "Complete 50 deliveries",
    description:
      "Go to the plaza and complete deliveries with various NPCs 50 times",
    image: SUNNYSIDE.icons.player,
    reward: { "Social Spark": 25 },
    requirement: (state) => state.delivery.fulfilledCount >= 50,
  },
} satisfies Record<string, Task>;

export type SocialTaskName = keyof typeof TASKS;

export const OTHER_WAYS_TO_EARN_SOCIAL_SPARK = {
  "Invite a VIP friend": {
    title: "Invite a VIP friend",
    image: SUNNYSIDE.icons.player,
    description:
      "Invite a friend to join the game and buy VIP to earn bonus Social Spark",
  },
  "Join a stream": {
    title: "Join a stream",
    image: SUNNYSIDE.icons.player,
    description:
      "Join a dev chat on discord or twitch stream to earn 1 Social Spark every 5 minutes from the host wearing a stream hat.",
  },
} satisfies Record<string, OtherTasks>;

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
