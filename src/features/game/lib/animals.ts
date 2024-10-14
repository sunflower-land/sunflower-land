import { ANIMAL_FOOD_EXPERIENCE } from "../events/landExpansion/feedAnimal";
import {
  ANIMAL_LEVELS,
  AnimalBuildingType,
  AnimalLevel,
  ANIMALS,
  AnimalType,
} from "../types/animals";
import { BuildingName } from "../types/buildings";
import { getKeys } from "../types/decorations";
import { Animal, AnimalBuilding, AnimalBuildingKey } from "../types/game";

export const makeAnimalBuildingKey = (
  buildingName: Extract<BuildingName, "Hen House" | "Barn">,
): AnimalBuildingKey => {
  return buildingName
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "") as AnimalBuildingKey;
};

export function makeAnimalBuilding(
  building: AnimalBuildingType,
): AnimalBuilding {
  const DEFAULT_ANIMAL_COUNT = 3;

  const animalType = getKeys(ANIMALS).find(
    (animal) => ANIMALS[animal].buildingRequired === building,
  );
  const { width } = ANIMALS[animalType as AnimalType];

  const positions = [
    { x: -width, y: 0 },
    { x: 0, y: 0 },
    { x: width, y: 0 },
  ];

  const defaultAnimals = new Array(DEFAULT_ANIMAL_COUNT)
    .fill(0)
    .reduce<Record<string, Animal>>((animals, _, index) => {
      return {
        ...animals,
        [index]: {
          id: index.toString(),
          type: animalType,
          state: "idle",
          coordinates: positions[index],
          asleepAt: 0,
          experience: 0,
          createdAt: Date.now(),
          item: "Petting Hand",
          lovedAt: 0,
        },
      };
    }, {});

  return {
    level: 1,
    animals: defaultAnimals,
  };
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
