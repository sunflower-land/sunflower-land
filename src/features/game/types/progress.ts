/**
 * TODO - Change this (Waiting for the backend to be ready)
 * This is a temporary solution to get the achievement data
 * @temporary
 */

/**
 * It's a counter of the number of items earned by the player. (harvest, buy, sell, crafted, mined, ...)
 */
import { ResourceName } from "features/game/types/resources";
import { CropName } from "features/game/types/crops";
import { updateAchievements } from "features/game/types/achievements";

export type ItemEarned = {
  name: ResourceName | CropName;
  amount: number;
};

export const PROGRESSION_INITIAL_STATE: ItemEarned[] = [
  {
    name: "Wood",
    amount: 0,
  },
  {
    name: "Stone",
    amount: 0,
  },
  {
    name: "Iron",
    amount: 0,
  },
  {
    name: "Gold",
    amount: 0,
  },
  {
    name: "Egg",
    amount: 0,
  },
  {
    name: "Chicken",
    amount: 0,
  },
  {
    name: "Sunflower",
    amount: 0,
  },
  {
    name: "Potato",
    amount: 0,
  },
  {
    name: "Pumpkin",
    amount: 0,
  },
  {
    name: "Carrot",
    amount: 0,
  },
  {
    name: "Cabbage",
    amount: 0,
  },
  {
    name: "Beetroot",
    amount: 0,
  },
  {
    name: "Cauliflower",
    amount: 0,
  },
  {
    name: "Parsnip",
    amount: 0,
  },
  {
    name: "Radish",
    amount: 0,
  },
  {
    name: "Wheat",
    amount: 0,
  },
];

export const PROGRESSION_STORAGE_KEY = "progression";

export function saveProgression(progression: ItemEarned[]): void {
  localStorage.setItem(PROGRESSION_STORAGE_KEY, JSON.stringify(progression));
}

/**
 * Update the progression with the new item earned
 * @param name
 * @param amount
 */
export function updateProgression(name: string, amount: number): void {
  const progression = getProgression();
  const index = progression.findIndex(
    (item: { name: string }) => item.name === name
  );
  if (index !== -1) {
    progression[index].amount += amount;
  }
  // Save the progression - TODO - Change this (Waiting for the backend to be ready)
  saveProgression(progression);
  updateAchievements(progression[index].name, progression[index].amount);
}

export function getProgression() {
  const progression = localStorage.getItem(PROGRESSION_STORAGE_KEY);
  if (progression) {
    return JSON.parse(progression);
  }
}
