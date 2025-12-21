import { BuffName } from "./buffs";
import { GameState, InventoryItemName } from "./game";
import { getBumpkinLevel, getExperienceToNextLevel } from "../lib/level";
import { getChapterTicket } from "./chapters";

export type DailyRewardDefinition = {
  id: DailyRewardName;
  label: string;
  items?: Partial<Record<InventoryItemName, number>>;
  coins?: number;
  sfl?: number;
  xp?: number;
  buff?: BuffName;
};

type StreakMilestone = {
  days: number;
  reward: DailyRewardDefinition;
};

export type DailyRewardName =
  | "default-reward"
  | "onboarding-day-1-sprout-starter"
  | "onboarding-day-2-builder-basics"
  | "onboarding-day-3-harvesters-gift"
  | "onboarding-day-4-tool-tune-up"
  | "onboarding-day-5-bumpkin-gift"
  | "onboarding-day-6-anchovy-kit"
  | "onboarding-day-7-first-week-finale"
  | "weekly-day-1-tool-cache"
  | "weekly-day-2-growth-boost"
  | "weekly-day-3-love-box"
  | "weekly-day-4-angler-pack"
  | "weekly-day-5-growth-feast"
  | "weekly-day-6-coin-stash"
  | "weekly-mega-box"
  | "streak-one-year"
  | "streak-two-year"
  | "weekly-day-6-coin-stash"
  | "weekly-mega-box"
  | "streak-one-year"
  | "streak-two-year";

// The first 7 rewards, players can claim without losing a streak
const ONBOARDING_REWARDS: DailyRewardDefinition[] = [
  {
    id: "onboarding-day-1-sprout-starter",
    label: "Sprout Starter",
    items: {
      "Sunflower Seed": 70,
      "Rhubarb Seed": 30,
      "Carrot Seed": 20,
    },
    coins: 50,
  },
  {
    id: "onboarding-day-2-builder-basics",
    label: "Builder Basics",
    items: {
      Wood: 5,
      Stone: 1,
    },
  },
  {
    id: "onboarding-day-3-harvesters-gift",
    label: "Harvester's Gift",
    items: {
      "Basic Love Box": 1,
      "Cabbers n Mash": 2,
    },
    coins: 200,
  },
  {
    id: "onboarding-day-4-tool-tune-up",
    label: "Tool Tune-Up",
    items: {
      Axe: 3,
      Pickaxe: 2,
      "Stone Pickaxe": 1,
    },
  },
  {
    id: "onboarding-day-5-bumpkin-gift",
    label: "Bumpkin Gift",
    coins: 350,
  },
  {
    id: "onboarding-day-6-anchovy-kit",
    label: "Anchovy Kit",
    items: {
      Rod: 3,
      Earthworm: 5,
      Carrot: 30,
    },
  },
  {
    id: "onboarding-day-7-first-week-finale",
    label: "First Week Finale",
    items: {
      "Weekly Mega Box": 1,
      Gem: 50,
    },
  },
];

const POTION_XP_END_GAME_FLOOR = 0.04;
const POTION_XP_CURVE_TUNING = 1.5;
const LN_200 = Math.log(200);

/**
 * Calculates:
 * L3 + 0.42 * ((ln(200) - ln(value)) / ln(200)) ^ L2
 */
export function calculateXPPotion(
  level: number,
  xpToNextLevel: number,
): number {
  const percetangeIncrease =
    POTION_XP_END_GAME_FLOOR +
    0.42 *
      Math.pow((LN_200 - Math.log(level)) / LN_200, POTION_XP_CURVE_TUNING);

  return Math.floor(xpToNextLevel * percetangeIncrease);
}

const WEEKLY_REWARDS: (game: GameState) => DailyRewardDefinition[] = (
  game: GameState,
) => {
  const level = getBumpkinLevel(game.bumpkin?.experience ?? 0);
  const { experienceToNextLevel } = getExperienceToNextLevel(
    game.bumpkin?.experience ?? 0,
  );

  const scaleAmount = (base: number, multiplier: number) => {
    const baseMultiplier = Math.ceil(multiplier);
    return Math.max(1, Math.floor(base * baseMultiplier));
  };

  const day2Xp = calculateXPPotion(level, experienceToNextLevel);

  const loveBox = (() => {
    if (level > 100) {
      return "Silver Love Box";
    }
    if (level > 50) {
      return "Bronze Love Box";
    }

    return "Basic Love Box";
  })();

  return [
    {
      id: "weekly-day-1-tool-cache",
      label: "Tool Cache",
      items: {
        Axe: scaleAmount(5, level / 25),
        Pickaxe: scaleAmount(2, level / 25),
        "Stone Pickaxe": scaleAmount(1, level / 25),
      },
    },
    {
      id: "weekly-day-2-growth-boost",
      label: "Growth Boost",
      buff: "Power hour",
    },
    {
      id: "weekly-day-3-love-box",
      label: "Love Box",
      items: {
        [loveBox]: 1,
      },
    },
    {
      id: "weekly-day-4-angler-pack",
      label: "Angler Pack",
      items: {
        Rod: scaleAmount(5, Math.max(1, Math.floor(level / 25))),
        Earthworm: scaleAmount(3, Math.max(1, Math.floor(level / 25))),
        Grub: scaleAmount(2, Math.max(1, Math.floor(level / 25))),
      },
    },
    {
      id: "weekly-day-5-growth-feast",
      label: "Growth Feast",
      xp: day2Xp,
    },
    {
      id: "weekly-day-6-coin-stash",
      label: "Coin Stash",
      coins: Math.floor(500 * (level / 25)),
    },
    {
      id: "weekly-mega-box",
      label: "Weekly Mega Box",
      items: {
        "Weekly Mega Box": 1,
      },
    },
  ];
};

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

export function getWeeklyReward({
  game,
  streak,
}: {
  game: GameState;
  streak: number;
}): DailyRewardDefinition {
  const index = streak % WEEKLY_REWARDS(game).length;
  return WEEKLY_REWARDS(game)[index];
}

export function getMilestoneRewards({
  streak,
}: {
  streak: number;
}): DailyRewardDefinition[] {
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
  game,
  streak,
  currentDate,
}: {
  game: GameState;
  streak: number;
  currentDate: string;
}): DailyRewardDefinition[] {
  const DEFAULT_REWARD: DailyRewardDefinition = {
    id: "default-reward",
    label: "Default Reward",
    items: {
      Cheer: 3,
      [getChapterTicket(new Date(currentDate).getTime())]: 1,
    },
  };

  let baseReward = getWeeklyReward({ game, streak });

  // If they are beginning out,
  if ((game.farmActivity["Daily Reward Collected"] ?? 0) <= 6 && streak <= 6) {
    baseReward = ONBOARDING_REWARDS[streak];
  }

  return [baseReward, DEFAULT_REWARD, ...getMilestoneRewards({ streak })];
}
