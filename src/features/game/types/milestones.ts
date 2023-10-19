import { getFishByType } from "features/island/hud/components/codex/lib/utils";
import { KNOWN_IDS } from ".";
import { BumpkinItem } from "./bumpkin";
import { getKeys } from "./craftables";
import { FishType, FishName, FISH } from "./fishing";
import { InventoryItemName, GameState } from "./game";

export type MilestoneName =
  | "Novice Angler"
  | "Advanced Angler"
  | "Expert Angler"
  | "Fish Encyclopedia"
  | "Master Angler";

type MilestoneReward = InventoryItemName | BumpkinItem;

export const isInventoryItemReward = (
  reward: MilestoneReward
): reward is InventoryItemName => {
  return reward in KNOWN_IDS;
};

export type Milestone = {
  task: string;
  percentageComplete: (farmActivity: GameState["farmActivity"]) => number;
  reward: Partial<Record<MilestoneReward, number>>;
};

const FISH_BY_TYPE: Record<FishType, FishName[]> = getFishByType();

export const FISH_MILESTONES: Record<MilestoneName, Milestone> = {
  "Novice Angler": {
    task: "Catch 5 of each basic fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = FISH_BY_TYPE.basic.length * 5;

      const totalFishCaught = FISH_BY_TYPE.basic.reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Caught`] ?? 0, 5),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      "Sunflower Rod": 1,
    },
  },
  "Advanced Angler": {
    task: "Catch 5 of each advanced fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = FISH_BY_TYPE.advanced.length * 5;

      const totalFishCaught = FISH_BY_TYPE.advanced.reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Caught`] ?? 0, 5),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      "Fishing Hat": 1,
    },
  },
  "Expert Angler": {
    task: "Catch 5 of each expert fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = FISH_BY_TYPE.expert.length;

      const totalFishCaught = FISH_BY_TYPE.expert.reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Caught`] ?? 0, 5),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      "Angler Waders": 1,
    },
  },
  "Fish Encyclopedia": {
    task: "Discover all fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = getKeys(FISH).length;

      const totalFishCaught = getKeys(FISH).reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Caught`] ?? 0, 1),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      "Luminous Anglerfish Topper": 1,
    },
  },
  "Master Angler": {
    task: "Catch 10 of every fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = getKeys(FISH).length * 10;

      const totalFishCaught = getKeys(FISH).reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Caught`] ?? 0, 10),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      Trident: 1,
    },
  },
};

// All Milestones
export const MILESTONES: Record<MilestoneName, Milestone> = {
  ...FISH_MILESTONES,
};

export type ExperienceLevel = "Novice" | "Experienced" | "Expert";

/**
 * Helper function to get the experience level of the player for a specific codex category eg. Fishing
 * @param claimed number of milestones claimed
 * @param totalMilestones total number of milestones
 * @returns ExperienceLevel
 */
export const getExperienceLevelForMilestones = (
  claimed: number,
  totalMilestones: number
) => {
  // Calculate the thresholds as a fraction of the total milestones
  const noviceThreshold: number = totalMilestones * 0.3; // 30% of total milestones
  const experiencedThreshold: number = totalMilestones * 0.6; // 60% of total milestones

  // Check the number of milestones and assign the label accordingly
  if (claimed < noviceThreshold) return "Novice";

  if (claimed < experiencedThreshold) return "Experienced";

  return "Expert";
};
