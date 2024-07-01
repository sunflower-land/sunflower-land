import {
  getEncyclopediaFish,
  getFishByType,
} from "features/island/hud/components/codex/lib/utils";
import { KNOWN_IDS } from ".";
import { BumpkinItem } from "./bumpkin";
import { getKeys } from "./craftables";
import { FishType, FishName, FISH, MarineMarvelName } from "./fishing";
import { InventoryItemName, GameState } from "./game";
import { FLOWERS } from "./flowers";
import { translate } from "lib/i18n/translate";

type FishMilestoneName =
  | "Novice Angler"
  | "Advanced Angler"
  | "Expert Angler"
  | "Fish Encyclopedia"
  | "Master Angler"
  | "Marine Marvel Master"
  | "Deep Sea Diver";

type FlowerMilestoneName =
  | "Sunpetal Savant"
  | "Bloom Big Shot"
  | "Lily Luminary";

export type MilestoneName = FishMilestoneName | FlowerMilestoneName;

type MilestoneReward = InventoryItemName | BumpkinItem;

export const isInventoryItemReward = (
  reward: MilestoneReward,
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

export const FISH_MILESTONES: Record<FishMilestoneName, Milestone> = {
  "Novice Angler": {
    task: translate("quest.basic.fish"),
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const caughtFish = FISH_BY_TYPE.basic.filter(
        (name) => (farmActivity[`${name} Caught`] ?? 0) >= 1,
      );

      return Math.min(
        (caughtFish.length / FISH_BY_TYPE.basic.length) * 100,
        100,
      );
    },
    reward: {
      "Sunflower Rod": 1,
    },
  },
  "Advanced Angler": {
    task: translate("quest.advanced.fish"),
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const caughtFish = FISH_BY_TYPE.advanced.filter(
        (name) => (farmActivity[`${name} Caught`] ?? 0) >= 1,
      );

      return Math.min(
        (caughtFish.length / FISH_BY_TYPE.advanced.length) * 100,
        100,
      );
    },
    reward: {
      "Fishing Hat": 1,
    },
  },
  "Expert Angler": {
    task: translate("quest.300.fish"),
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = 300;

      const totalFishCaught = getKeys(FISH).reduce(
        (total, name) => total + (farmActivity[`${name} Caught`] ?? 0),
        0,
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      "Angler Waders": 1,
    },
  },
  "Fish Encyclopedia": {
    task: translate("quest.all.fish"),
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const encyclopediaFish = getEncyclopediaFish();
      const totalFishRequired = encyclopediaFish.length;

      const totalFishCaught = encyclopediaFish.reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Caught`] ?? 0, 1),
        0,
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      "Bucket O' Worms": 1,
    },
  },
  "Master Angler": {
    task: translate("quest.1500.fish"),
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = 1500;

      const totalFishCaught = getKeys(FISH).reduce(
        (total, name) => total + (farmActivity[`${name} Caught`] ?? 0),
        0,
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      Trident: 1,
    },
  },
  "Marine Marvel Master": {
    task: translate("quest.marine.marvel"),
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const totalFishRequired = FISH_BY_TYPE["marine marvel"].length;

      const totalFishCaught = FISH_BY_TYPE["marine marvel"].reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Caught`] ?? 0, 1),
        0,
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      "Luminous Anglerfish Topper": 1,
    },
  },
  "Deep Sea Diver": {
    task: translate("quest.5.fish"),
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const encyclopediaFish = getEncyclopediaFish();

      const fishComplete = encyclopediaFish.filter(
        (name) => (farmActivity[`${name} Caught`] ?? 0) >= 5,
        0,
      );

      return (fishComplete.length / encyclopediaFish.length) * 100;
    },
    reward: {
      "Deep Sea Helm": 1,
    },
  },
};

export const FLOWER_MILESTONES: Record<FlowerMilestoneName, Milestone> = {
  "Sunpetal Savant": {
    task: translate("quest.sunpetal.savant"),
    reward: {},
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const sunpetalFlowers = getKeys(FLOWERS).filter(
        (name) => FLOWERS[name].seed === "Sunpetal Seed",
      );

      const uniqueFlowersDiscovered = sunpetalFlowers.reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Harvested`] ?? 0, 1),
        0,
      );

      return Math.min((uniqueFlowersDiscovered / 12) * 100, 100);
    },
  },
  "Bloom Big Shot": {
    task: translate("quest.bloom.bigshot"),
    reward: {},
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const sunpetalFlowers = getKeys(FLOWERS).filter(
        (name) => FLOWERS[name].seed === "Bloom Seed",
      );

      const uniqueFlowersDiscovered = sunpetalFlowers.reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Harvested`] ?? 0, 1),
        0,
      );

      return Math.min((uniqueFlowersDiscovered / 12) * 100, 100);
    },
  },
  "Lily Luminary": {
    task: translate("quest.lily.luminary"),
    reward: {},
    percentageComplete: (farmActivity: GameState["farmActivity"]) => {
      const sunpetalFlowers = getKeys(FLOWERS).filter(
        (name) => FLOWERS[name].seed === "Lily Seed",
      );

      const uniqueFlowersDiscovered = sunpetalFlowers.reduce(
        (total, name) =>
          total + Math.min(farmActivity[`${name} Harvested`] ?? 0, 1),
        0,
      );

      return Math.min((uniqueFlowersDiscovered / 12) * 100, 100);
    },
  },
};

// All Milestones
export const MILESTONES: Record<MilestoneName, Milestone> = {
  ...FISH_MILESTONES,
  ...FLOWER_MILESTONES,
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
  totalMilestones: number,
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
  "Novice Angler": translate("milestone.noviceAngler"),
  "Advanced Angler": translate("milestone.advancedAngler"),
  "Expert Angler": translate("milestone.expertAngler"),
  "Fish Encyclopedia": translate("milestone.fishEncyclopedia"),
  "Master Angler": translate("milestone.masterAngler"),
  "Marine Marvel Master": translate("milestone.marineMarvelMaster"),
  "Deep Sea Diver": translate("milestone.deepSeaDiver"),
  "Sunpetal Savant": translate("milestone.sunpetalSavant"),
  "Bloom Big Shot": translate("milestone.bloomBigShot"),
  "Lily Luminary": translate("milestone.lilyLuminary"),
};
