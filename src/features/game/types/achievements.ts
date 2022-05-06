import { ResourceName } from "./resources";
import { CropName } from "./crops";
import { INITIAL_FARM } from "features/game/lib/constants";

export type AchievementName =
  | "Welcome To The Game"
  | "Wood Farmer I"
  | "Sunflower Farmer I"
  | "Stone Miner I"
  | "Iron Miner I"
  | "Gold Miner I"
  | "Cooker I";

export type AchievementType = "farming" | "gathering" | "crafting";

export type Achievement = {
  id: number;
  description: string;
  type: AchievementType;
  resource: ResourceName | CropName;
  quantity: number;
  rewardItem: ResourceName | CropName;
  rewardQuantity: number;
  unlocked: boolean;
  progress: number;
  rewardClaimed: boolean;
};

/**
 * Get all achievements from base game data
 */
export function getAllAchievements(): Record<AchievementName, Achievement> {
  // TODO REPLACE BY GAME STATE
  return INITIAL_FARM.achievements;
}

/**
 * Find the name of the achievement in fact of the id of the achievement
 * @param id
 */
export function getNameFromId(id: number) {
  const achievements = getAllAchievements();
  for (const name in achievements) {
    if (achievements[<AchievementName>name].id === id) {
      return <AchievementName>name;
    }
  }
}

/**
 * Get an achievement by name
 */
export function getAchievement(name: AchievementName): Achievement {
  return getAllAchievements()[name];
}

/**
 * Get Achievements unlocked by a player
 */
export function getUnlockedAchievements() {
  return Object.values(getAllAchievements()).filter(
    (achievement) => achievement.unlocked
  );
}

/**
 * Get Achievements locked
 */
export function getLockedAchievements() {
  return Object.values(getAllAchievements()).filter(
    (achievement) => !achievement.unlocked
  );
}

/**
 * Get Achievements by items needed
 * @param item
 */
export function getAchievementsByItemNeeded(
  item: ResourceName | CropName
): Achievement[] {
  // filter records by item needed
  const achievement = getLockedAchievements().filter(
    (achievement) => achievement.resource === item
  );
  if (!achievement) {
    throw new Error(`Achievement with item ${item} not found`);
  }
  return achievement;
}

/**
 * Update achievements progression and unlock if needed
 * @param itemAdded
 * @param quantity
 */
export const updateAchievements = (
  itemAdded: ResourceName | CropName,
  quantity: number
) => {
  const achievements = getAchievementsByItemNeeded(itemAdded);
  achievements.forEach((achievement) => {
    achievement.progress += quantity;
    if (achievement.progress >= achievement.quantity) {
      achievement.unlocked = true;
      // send notification - TODO
      console.log("[DEBUG] Achievement unlocked:", achievement.description);
      console.log();
      // Send EVENT to update game state
    }
  });
  // TODO - Update GameState
};
