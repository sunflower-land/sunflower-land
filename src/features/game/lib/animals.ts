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
import { isCollectibleBuilt } from "./collectibleBuilt";
import { getBudYieldBoosts } from "./getBudYieldBoosts";
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
          experience: 0,
          createdAt: Date.now(),
          item: "Petting Hand",
          lovedAt: 0,
          awakeAt: 0,
          level: 0,
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

export function getAnimalFavoriteFood(type: AnimalType, level: AnimalLevel) {
  const levelFood = ANIMAL_FOOD_EXPERIENCE[type][level];
  const maxXp = Math.max(...Object.values(levelFood));

  const favouriteFoods = getKeys(levelFood).filter(
    (foodName) => levelFood[foodName] === maxXp,
  );

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

  if (isCollectibleBuilt({ name: "Bale", game })) {
    boost += 0.1;
  }

  return boost;
}

function getMilkYieldBoosts(game: GameState) {
  let boost = 0;

  if (isWearableActive({ name: "Milk Apron", game })) {
    boost += 0.5;
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

  // Egg yield boosts
  if (isChicken && resource === "Egg") {
    amount += getEggYieldBoosts(game);
  }

  // Milk Yield Boost
  if (isCow && resource === "Milk") {
    amount += getMilkYieldBoosts(game);
  }

  // Cattlegrim boosts all produce
  if (isWearableActive({ name: "Cattlegrim", game })) {
    amount += 0.25;
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
    return foodQuantity * 0.9;
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

  // Add the boosted duration to the created time
  return createdAt + totalDuration;
}
