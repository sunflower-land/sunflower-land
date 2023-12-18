import {
  getEncyclopediaFish,
  getFishByType,
} from "features/island/hud/components/codex/lib/utils";
import { KNOWN_IDS } from ".";
import { BumpkinItem } from "./bumpkin";
import { getKeys } from "./craftables";
import { FishType, FishName, FISH, MarineMarvelName } from "./fishing";
import { InventoryItemName, GameState } from "./game";

export type MilestoneName =
  | "Novice Angler"
  | "Advanced Angler"
  | "Expert Angler"
  | "Fish Encyclopedia"
  | "Master Angler"
  | "Marine Marvel Master"
  | "Deep Sea Diver";

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

const FISH_BY_TYPE: Record<FishType, (FishName | MarineMarvelName)[]> =
  getFishByType();

export const FISH_MILESTONES: Record<MilestoneName, Milestone> = {
  "Novice Angler": {
    task: "Catch each basic fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const caughtFish = FISH_BY_TYPE.basic.filter(
        (name) => (farmActivity[`${name} Caught`] ?? 0) >= 1
      );

      return Math.min(
        (caughtFish.length / FISH_BY_TYPE.basic.length) * 100,
        100
      );
    },
    reward: {
      "Sunflower Rod": 1,
    },
  },
  "Advanced Angler": {
    task: "Catch each advanced fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const caughtFish = FISH_BY_TYPE.advanced.filter(
        (name) => (farmActivity[`${name} Caught`] ?? 0) >= 1
      );

      return Math.min(
        (caughtFish.length / FISH_BY_TYPE.advanced.length) * 100,
        100
      );
    },
    reward: {
      "Fishing Hat": 1,
    },
  },
  "Expert Angler": {
    task: "Catch 300 fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = 300;

      const totalFishCaught = getKeys(FISH).reduce(
        (total, name) => total + (farmActivity[`${name} Caught`] ?? 0),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      "Angler Waders": 1,
    },
  },
  "Fish Encyclopedia": {
    task: "Discover each basic, advanced, and expert fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const encyclopediaFish = getEncyclopediaFish();
      const totalFishRequired = encyclopediaFish.length;

      const totalFishCaught = encyclopediaFish.reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Caught`] ?? 0, 1),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      "Bucket O' Worms": 1,
    },
  },
  "Master Angler": {
    task: "Catch 1500 fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = 1500;

      const totalFishCaught = getKeys(FISH).reduce(
        (total, name) => total + (farmActivity[`${name} Caught`] ?? 0),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      Trident: 1,
    },
  },
  "Marine Marvel Master": {
    task: "Catch each Marine Marvel",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = FISH_BY_TYPE["marine marvel"].length;

      const totalFishCaught = FISH_BY_TYPE["marine marvel"].reduce(
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
  "Deep Sea Diver": {
    task: "Catch 5 of every fish",
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const encyclopediaFish = getEncyclopediaFish();
      const totalFishRequired = encyclopediaFish.length * 5;

      const totalFishCaught = encyclopediaFish.reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Caught`] ?? 0, 1),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      "Deep Sea Helm": 1,
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
  const noviceThreshold: number = totalMilestones * 0.4; // 40% of total milestones
  const experiencedThreshold: number = totalMilestones * 0.7; // 70% of total milestones

  // Check the number of milestones and assign the label accordingly
  if (claimed < noviceThreshold) return "Novice";

  if (claimed < experiencedThreshold) return "Experienced";

  return "Expert";
};

export const MILESTONE_MESSAGES: Record<MilestoneName, string> = {
  "Novice Angler":
    "Congratulations, you've just reached the Novice Angler milestone! You're well on your way to becoming a fishing pro by catching each basic fish.",
  "Advanced Angler":
    "Impressive, you've just reached the Advanced Angler milestone! You've mastered the art of catching each advanced fish. Keep it up!",
  "Expert Angler":
    "Wow, you've just reached the Expert Angler milestone! You're a true fishing expert now! Catching 300 fish is no small feat.",
  "Fish Encyclopedia":
    "Congratulations, you've just reached the Fish Encyclopedia milestone! You've become a true fish connoisseur! Discovering each basic, advanced, and expert fish is a remarkable achievement.",
  "Master Angler":
    "Wow, you've just reached the Master Angler milestone! Catching 1500 fish is a testament to your fishing skills.",
  "Marine Marvel Master":
    "Congratulations, you've just reached the Marine Marvel Master milestone! You're the undisputed champion of the seas! Catching each Marvel proves your fishing prowess like no other.",
};
