import { InventoryItemName } from "./game";
import { getSeasonalTicket } from "./seasons";

export type DailyRewardDefinition = {
  id: string;
  label: string;
  items?: Partial<Record<InventoryItemName, number>>;
  coins?: number;
  sfl?: number;
};

type StreakMilestone = {
  days: number;
  reward: DailyRewardDefinition;
};

const WEEKLY_REWARDS: DailyRewardDefinition[] = [
  {
    id: "weekly-basic-farming-pack",
    label: "Basic Farming Pack",
    items: {
      "Basic Farming Pack": 1,
    },
  },
  {
    id: "weekly-basic-food-box",
    label: "Basic Food Box",
    items: {
      "Basic Food Box": 1,
    },
  },
  {
    id: "weekly-time-warp-totem",
    label: "Time Warp Totem",
    items: {
      "Time Warp Totem": 1,
    },
  },
  {
    id: "weekly-tool-box",
    label: "Bronze Tool Box",
    items: {
      "Bronze Tool Box": 1,
    },
  },
  {
    id: "weekly-bronze-food-box",
    label: "Bronze Food Box",
    items: {
      "Bronze Food Box": 1,
    },
  },
  {
    id: "weekly-bronze-farming-pack",
    label: "Bronze Farming Pack",
    items: {
      "Basic Farming Pack": 1,
    },
  },
  {
    id: "weekly-mega-box",
    label: "Weekly Mega Box",
    items: {
      "Weekly Mega Box": 1,
    },
  },
];

const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 364,
    reward: {
      id: "streak-one-year",
      label: "Yearly Streak Reward",
      coins: 10000,
      items: {
        "Pirate Cake": 10,
        "Treasure Key": 1,
        "Rare Key": 1,
        "Luxury Key": 1,
      },
    },
  },
  {
    days: 729,
    reward: {
      id: "streak-two-year",
      label: "Two Year Streak Reward",
      coins: 10000,
      items: {
        "Pizza Margherita": 5,
        "Super Totem": 1,
        Gem: 320,
        "Luxury Key": 1,
      },
    },
  },
];

export function getWeeklyReward(streak: number): DailyRewardDefinition {
  const index = streak % WEEKLY_REWARDS.length;
  return WEEKLY_REWARDS[index];
}

export function getMilestoneRewards(streak: number): DailyRewardDefinition[] {
  if (streak <= 0) {
    return [];
  }

  let milestone: DailyRewardDefinition | undefined;

  STREAK_MILESTONES.forEach(({ days, reward }) => {
    if (streak === days) {
      milestone = reward;
    }
  });

  return milestone ? [milestone] : [];
}

export function getRewardsForStreak({
  streak,
  currentDate,
}: {
  streak: number;
  currentDate: string;
}): DailyRewardDefinition[] {
  const DEFAULT_REWARD: DailyRewardDefinition = {
    id: "default-reward",
    label: "Default Reward",
    items: {
      Cheer: 3,
      [getSeasonalTicket(new Date(currentDate))]: 1,
    },
  };
  return [
    getWeeklyReward(streak),
    DEFAULT_REWARD,
    ...getMilestoneRewards(streak),
  ];
}
