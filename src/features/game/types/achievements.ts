import { ResourceName } from "./resources";
import { CropName } from "./crops";
import { INITIAL_FARM } from "features/game/lib/constants";
import { getProgression } from "features/game/types/progress";
import { MachineInterpreter } from "features/game/lib/gameMachine";
import { SetToast } from "features/game/toast/ToastQueueProvider";
import { achievementUnlockedToast } from "features/game/toast/lib/achievementUnlockedToast";

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
 * @param achievements
 */
export function getAchievementsByItemNeeded(
  item: ResourceName | CropName
): Achievement[] {
  // filter records by item needed
  const achievement = getLockedAchievements().filter(
    (achievement) => achievement.resource === item
  );
  // throw an error if there is no achievement
  if (!achievement) {
    throw new Error(`Achievement with item ${item} not found`);
  }
  return achievement;
}

/**
 * Update achievements progression and unlock if needed
 */
export const updateAchievements = (
  gameService: MachineInterpreter,
  setToast: SetToast
) => {
  // Get progression
  const progression = getProgression();
  // for each item in progress, update events
  progression.forEach((item: any) => {
    // get achievements by item name
    const achievements = getAchievementsByItemNeeded(item.name);
    // add quantity to progress of each achievement
    achievements.forEach((achievement) => {
      achievement.progress += item.amount;
      // if progress is greater than quantity, unlock achievement
      if (achievement.progress >= achievement.quantity) {
        achievement.unlocked = true;
        // send notification - TODO
        console.log("[DEBUG] Achievement unlocked:", achievement.description);
        // Send EVENT to update game state
        gameService.send("ACHIEVEMENT_UNLOCKED", {
          achievement: achievement,
        });

        // Send toast notification
        achievementUnlockedToast(achievement, setToast);
      }
    });
  });
};
