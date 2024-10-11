import { ANIMAL_FOOD_EXPERIENCE } from "../events/landExpansion/feedAnimal";
import {
  ANIMAL_LEVELS,
  AnimalLevel,
  ANIMALS,
  AnimalType,
} from "../types/animals";
import { BuildingName } from "../types/buildings";
import { getKeys } from "../types/decorations";
import { Animal, AnimalBuildingKey } from "../types/game";

export const makeAnimalBuildingKey = (
  buildingName: Extract<BuildingName, "Hen House" | "Barn">,
): AnimalBuildingKey => {
  return buildingName
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "") as AnimalBuildingKey;
};

export function makeAnimals(count: number, type: AnimalType) {
  const animal = ANIMALS[type];

  const positions = [
    { x: -animal.width, y: 0 },
    { x: 0, y: 0 },
    { x: animal.width, y: 0 },
  ];

  return new Array(count).fill(0).reduce(
    (animals, _, index) => {
      return {
        ...animals,
        [index]: {
          id: index.toString(),
          type,
          state: "idle",
          coordinates: positions[index],
          experience: 0,
          asleepAt: 0,
        },
      };
    },
    {} as Record<string, Animal>,
  );
}

export const isMaxLevel = (animal: AnimalType, level: AnimalLevel) => {
  return level === Object.keys(ANIMAL_LEVELS[animal]).length;
};

export function getAnimalLevel(experience: number, animal: AnimalType) {
  const levels = ANIMAL_LEVELS[animal];

  let currentLevel: AnimalLevel = 1;

  // Iterate through the levels and find the appropriate one
  for (const [level, xpThreshold] of Object.entries(levels)) {
    if (experience >= xpThreshold) {
      currentLevel = Number(level) as AnimalLevel; // Update to the highest level met
    } else {
      break; // Exit the loop if the next threshold is not met
    }
  }

  return currentLevel;
}

export function getAnimalFavoriteFood(type: AnimalType, animalXP: number) {
  const level = getAnimalLevel(animalXP, type);
  const xp = ANIMAL_FOOD_EXPERIENCE[type][level];
  const maxXp = Math.max(...Object.values(xp));

  const favouriteFoods = getKeys(xp).filter(
    (foodName) => xp[foodName] === maxXp,
  );

  if (favouriteFoods.length !== 1) throw new Error("No favourite food");

  return favouriteFoods[0];
}
