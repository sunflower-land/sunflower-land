import { InventoryItemName } from "./game";

export type DailyRewardDefinition = {
  id: string;
  label: string;
  items?: Partial<Record<InventoryItemName, number>>;
  coins?: number;
  sfl?: number;
};

type StreakMilestone = {
  every: number;
  reward: DailyRewardDefinition;
};

const BRONZE_FARMING_PACK: Partial<Record<InventoryItemName, number>> = {
  "Sunflower Seed": 75,
  "Potato Seed": 50,
  "Carrot Seed": 25,
  "Rapid Growth": 5,
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
    id: "weekly-tiki-totem",
    label: "Tiki Totem",
    items: {
      "Tiki Totem": 1,
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
    items: BRONZE_FARMING_PACK,
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
    every: 365,
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
    every: 730,
    reward: {
      id: "streak-two-year",
      label: "Two Year Streak Reward",
      coins: 10000,
      items: {
        "Pizza Margherita": 5,
        "Super Totem": 1,
        Gem: 300,
        "Luxury Key": 1,
      },
    },
  },
];

export function getWeeklyReward(streak: number): DailyRewardDefinition {
  if (streak <= 0) {
    throw new Error("Invalid streak");
  }

  const index = (streak - 1) % WEEKLY_REWARDS.length;
  return WEEKLY_REWARDS[index];
}

export function getMilestoneRewards(streak: number): DailyRewardDefinition[] {
  if (streak <= 0) {
    return [];
  }

  return STREAK_MILESTONES.filter(({ every }) => streak % every === 0).map(
    ({ reward }) => reward,
  );
}

export function getRewardsForStreak(streak: number): DailyRewardDefinition[] {
  if (streak <= 0) {
    return [];
  }

  return [getWeeklyReward(streak), ...getMilestoneRewards(streak)];
}
