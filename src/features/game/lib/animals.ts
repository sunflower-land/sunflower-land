import { ANIMAL_SLEEP_DURATION } from "../events/landExpansion/feedAnimal";
import {
  ANIMAL_FOOD_EXPERIENCE,
  ANIMAL_FOODS,
  ANIMAL_LEVELS,
  AnimalBuildingType,
  AnimalLevel,
  ANIMALS,
  AnimalType,
} from "../types/animals";
import { BuildingName } from "../types/buildings";
import { getKeys } from "../types/decorations";
import {
  Animal,
  AnimalBuilding,
  AnimalBuildingKey,
  AnimalFoodName,
  AnimalMedicineName,
  AnimalResource,
  GameState,
  InventoryItemName,
} from "../types/game";
import { getCurrentSeason } from "../types/seasons";
import { isCollectibleBuilt } from "./collectibleBuilt";
import { getBudYieldBoosts } from "./getBudYieldBoosts";
import { hasVipAccess } from "./vipAccess";
import { isWearableActive } from "./wearables";

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
        [String(index)]: {
          id: index.toString(),
          type: animalType as AnimalType,
          state: "idle",
          coordinates: positions[index],
          asleepAt: 0,
          experience: animalType === "Chicken" ? 40 : 80,
          createdAt: Date.now(),
          item: "Petting Hand",
          lovedAt: 0,
          awakeAt: 0,
        },
      };
    }, {});

  return {
    level: 1,
    animals: defaultAnimals,
  };
}

export const isMaxLevel = (animal: AnimalType, level: AnimalLevel) => {
  const maxLevel = Math.max(...Object.keys(ANIMAL_LEVELS[animal]).map(Number));
  return level === maxLevel;
};

export function getAnimalLevel(experience: number, animal: AnimalType) {
  const levels = ANIMAL_LEVELS[animal];

  let currentLevel: AnimalLevel = 0;

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
  const levelFood = ANIMAL_FOOD_EXPERIENCE[type][level];
  const maxXp = Math.max(...Object.values(levelFood));

  const favouriteFoods = getKeys(levelFood)
    .filter((foodName) => levelFood[foodName] === maxXp)
    .filter((food) => food !== "Omnifeed");

  if (favouriteFoods.length !== 1) throw new Error("No favourite food");

  return favouriteFoods[0];
}

export function isAnimalFood(item: InventoryItemName): item is AnimalFoodName {
  return getKeys(ANIMAL_FOODS)
    .filter((food) => ANIMAL_FOODS[food].type === "food")
    .includes(item as AnimalFoodName);
}

export function isAnimalMedicine(
  item: InventoryItemName,
): item is AnimalMedicineName {
  return getKeys(ANIMAL_FOODS)
    .filter((food) => ANIMAL_FOODS[food].type === "medicine")
    .includes(item as AnimalMedicineName);
}

export type ResourceDropAmountArgs = {
  game: GameState;
  animalType: AnimalType;
  resource: AnimalResource;
  baseAmount: number;
  multiplier: number;
};

function getEggYieldBoosts(game: GameState) {
  let boost = 0;

  if (isCollectibleBuilt({ name: "Chicken Coop", game })) {
    boost += 1;
  }

  if (isCollectibleBuilt({ name: "Rich Chicken", game })) {
    boost += 0.1;
  }

  if (isCollectibleBuilt({ name: "Undead Rooster", game })) {
    boost += 0.1;
  }

  if (isCollectibleBuilt({ name: "Ayam Cemani", game })) {
    boost += 0.2;
  }

  if (game.bumpkin.skills["Abundant Harvest"]) {
    boost += 0.2;
  }

  return boost;
}

function getFeatherYieldBoosts(game: GameState) {
  let boost = 0;

  if (isWearableActive({ name: "Chicken Suit", game })) {
    boost += 1;
  }

  if (isCollectibleBuilt({ name: "Alien Chicken", game })) {
    boost += 0.1;
  }

  if (game.bumpkin.skills["Fine Fibers"]) {
    boost += 0.1;
  }

  return boost;
}

function getWoolYieldBoosts(game: GameState) {
  let boost = 0;

  if (isWearableActive({ name: "Black Sheep Onesie", game })) {
    boost += 2;
  }
  if (isWearableActive({ name: "White Sheep Onesie", game })) {
    boost += 0.25;
  }

  if (game.bumpkin.skills["Abundant Harvest"]) {
    boost += 0.2;
  }

  return boost;
}

function getMerinoWoolYieldBoosts(game: GameState) {
  let boost = 0;

  if (isWearableActive({ name: "Merino Jumper", game })) {
    boost += 1;
  }

  if (isCollectibleBuilt({ name: "Toxic Tuft", game })) {
    boost += 0.1;
  }

  if (game.bumpkin.skills["Fine Fibers"]) {
    boost += 0.1;
  }

  return boost;
}

function getMilkYieldBoosts(game: GameState) {
  let boost = 0;

  if (isWearableActive({ name: "Milk Apron", game })) {
    boost += 0.5;
  }

  if (isWearableActive({ name: "Cowbell Necklace", game })) {
    boost += 2;
  }

  if (isCollectibleBuilt({ name: "Longhorn Cowfish", game })) {
    boost += 0.2;
  }

  if (game.bumpkin.skills["Abundant Harvest"]) {
    boost += 0.2;
  }

  return boost;
}

function getLeatherYieldBoosts(game: GameState) {
  let boost = 0;

  if (isCollectibleBuilt({ name: "Moo-ver", game })) {
    boost += 0.25;
  }

  if (isCollectibleBuilt({ name: "Mootant", game })) {
    boost += 0.1;
  }

  if (game.bumpkin.skills["Fine Fibers"]) {
    boost += 0.1;
  }

  return boost;
}

export function getResourceDropAmount({
  game,
  animalType,
  resource,
  baseAmount,
  multiplier,
}: ResourceDropAmountArgs) {
  let amount = baseAmount;

  const { bumpkin, buds = {} } = game;

  const isChicken = animalType === "Chicken";
  const isCow = animalType === "Cow";
  const isSheep = animalType === "Sheep";

  // Egg yield boosts
  if (isChicken && resource === "Egg") {
    amount += getEggYieldBoosts(game);
  }

  // Feather yield boosts
  if (isChicken && resource === "Feather") {
    amount += getFeatherYieldBoosts(game);
  }

  // Wool Yield Boost
  if (isSheep && resource === "Wool") {
    amount += getWoolYieldBoosts(game);
  }

  // Merino Wool Yield Boost
  if (isSheep && resource === "Merino Wool") {
    amount += getMerinoWoolYieldBoosts(game);
  }

  // Milk Yield Boost
  if (isCow && resource === "Milk") {
    amount += getMilkYieldBoosts(game);
  }

  // Leather Yield Boost
  if (isCow && resource === "Leather") {
    amount += getLeatherYieldBoosts(game);
  }

  // Cattlegrim boosts all produce
  if (isWearableActive({ name: "Cattlegrim", game })) {
    amount += 0.25;
  }

  // Add centralized Bale boost logic here
  if (isCollectibleBuilt({ name: "Bale", game })) {
    const baleBoost = 0.1;
    // For Chickens (Eggs) - always applies
    if (isChicken && resource === "Egg") {
      if (bumpkin.skills["Double Bale"]) {
        amount += baleBoost * 2;
      } else {
        amount += baleBoost;
      }
    }

    // For Sheep (Wool) and Cows (Milk) - only if Bale Economy skill is present
    if (
      bumpkin.skills["Bale Economy"] &&
      ((isSheep && resource === "Wool") || (isCow && resource === "Milk"))
    ) {
      if (bumpkin.skills["Double Bale"]) {
        amount += baleBoost * 2;
      } else {
        amount += baleBoost;
      }
    }
  }

  // Barn Manager boosts all produce
  if (game.inventory["Barn Manager"]?.gt(0)) {
    amount += 0.1;
  }

  // Free Range boosts all produce
  if (bumpkin.skills["Free Range"]) {
    amount += 0.1;
  }

  amount += getBudYieldBoosts(buds, resource);

  if (multiplier) amount *= multiplier;

  return Number(amount.toFixed(2));
}

export function getBoostedFoodQuantity({
  animalType,
  foodQuantity,
  game,
}: {
  animalType: AnimalType;
  foodQuantity: number;
  game: GameState;
}) {
  if (
    animalType === "Chicken" &&
    isCollectibleBuilt({ name: "Fat Chicken", game })
  ) {
    foodQuantity *= 0.9;
  }

  if (
    animalType === "Chicken" &&
    isCollectibleBuilt({ name: "Cluckulator", game })
  ) {
    foodQuantity *= 0.8;
  }

  if (
    (animalType === "Sheep" || animalType === "Cow") &&
    isWearableActive({ name: "Infernal Bullwhip", game })
  ) {
    foodQuantity *= 0.5;
  }

  if (hasVipAccess({ game }) && getCurrentSeason() === "Bull Run") {
    foodQuantity *= 0.9;
  }

  if (game.bumpkin.skills["Efficient Feeding"]) {
    foodQuantity *= 0.95;
  }

  if (game.bumpkin.skills["Clucky Grazing"]) {
    if (animalType === "Chicken") {
      foodQuantity *= 0.75;
    } else {
      foodQuantity *= 1.5;
    }
  }

  if (game.bumpkin.skills["Sheepwise Diet"]) {
    if (animalType === "Sheep") {
      foodQuantity *= 0.75;
    } else {
      foodQuantity *= 1.5;
    }
  }

  if (game.bumpkin.skills["Cow-Smart Nutrition"]) {
    if (animalType === "Cow") {
      foodQuantity *= 0.75;
    } else {
      foodQuantity *= 1.5;
    }
  }

  if (game.bumpkin.skills["Chonky Feed"]) {
    foodQuantity *= 1.5;
  }

  return foodQuantity;
}

export function getBoostedAwakeAt({
  animalType,
  createdAt,
  game,
}: {
  animalType: AnimalType;
  createdAt: number;
  game: GameState;
}) {
  const sleepDuration = ANIMAL_SLEEP_DURATION;
  const { bumpkin } = game;
  const twoHoursInMs = 2 * 60 * 60 * 1000;

  // Start with the base duration
  let totalDuration = sleepDuration;

  const isChicken = animalType === "Chicken";
  const isSheep = animalType === "Sheep";

  // Apply fixed time reductions first
  if (isChicken) {
    if (isCollectibleBuilt({ name: "El Pollo Veloz", game })) {
      totalDuration -= twoHoursInMs;
    }

    if (isCollectibleBuilt({ name: "Speed Chicken", game })) {
      totalDuration *= 0.9;
    }
  }

  if (isSheep) {
    if (isWearableActive({ name: "Dream Scarf", game })) {
      totalDuration *= 0.8;
    }

    if (isCollectibleBuilt({ name: "Farm Dog", game })) {
      totalDuration *= 0.75;
    }
  }

  if (game.inventory["Wrangler"]?.gt(0)) {
    totalDuration *= 0.9;
  }

  if (bumpkin.skills["Stable Hand"]) {
    totalDuration *= 0.9;
  }

  if (bumpkin.skills["Restless Animals"]) {
    totalDuration *= 0.9;
  }

  // Add the boosted duration to the created time
  return createdAt + totalDuration;
}
