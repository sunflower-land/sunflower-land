import cloneDeep from "lodash.clonedeep";
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
  BoostName,
  GameState,
  InventoryItemName,
} from "../types/game";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "./collectibleBuilt";
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

function getEggYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: BoostName[];
} {
  let boost = 0;
  const boostsUsed: BoostName[] = [];

  if (isCollectibleBuilt({ name: "Chicken Coop", game })) {
    boost += 1;
    boostsUsed.push("Chicken Coop");
  }

  if (isCollectibleBuilt({ name: "Rich Chicken", game })) {
    boost += 0.1;
    boostsUsed.push("Rich Chicken");
  }

  if (isCollectibleBuilt({ name: "Undead Rooster", game })) {
    boost += 0.1;
    boostsUsed.push("Undead Rooster");
  }

  if (isCollectibleBuilt({ name: "Ayam Cemani", game })) {
    boost += 0.2;
    boostsUsed.push("Ayam Cemani");
  }

  if (game.bumpkin.skills["Abundant Harvest"]) {
    boost += 0.2;
    boostsUsed.push("Abundant Harvest");
  }

  return { amount: boost, boostsUsed };
}

function getFeatherYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: BoostName[];
} {
  let boost = 0;
  const boostsUsed: BoostName[] = [];

  if (isWearableActive({ name: "Chicken Suit", game })) {
    boost += 1;
    boostsUsed.push("Chicken Suit");
  }

  if (isCollectibleBuilt({ name: "Alien Chicken", game })) {
    boost += 0.1;
    boostsUsed.push("Alien Chicken");
  }

  if (game.bumpkin.skills["Fine Fibers"]) {
    boost += 0.1;
    boostsUsed.push("Fine Fibers");
  }

  if (game.bumpkin.skills["Leathercraft Mastery"]) {
    boost -= 0.35;
    boostsUsed.push("Leathercraft Mastery");
  }

  if (game.bumpkin.skills["Featherweight"]) {
    boost += 0.25;
    boostsUsed.push("Featherweight");
  }

  if (game.bumpkin.skills["Merino Whisperer"]) {
    boost -= 0.35;
    boostsUsed.push("Merino Whisperer");
  }

  return { amount: boost, boostsUsed };
}

function getWoolYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: BoostName[];
} {
  let boost = 0;
  const boostsUsed: BoostName[] = [];

  if (isWearableActive({ name: "Black Sheep Onesie", game })) {
    boost += 2;
    boostsUsed.push("Black Sheep Onesie");
  }
  // White Sheep Onesie - +.25 wool
  if (isWearableActive({ name: "White Sheep Onesie", game })) {
    boost += 0.25;
    boostsUsed.push("White Sheep Onesie");
  }

  if (isCollectibleBuilt({ name: "Astronaut Sheep", game })) {
    boost += 0.1;
    boostsUsed.push("Astronaut Sheep");
  }

  if (game.bumpkin.skills["Abundant Harvest"]) {
    boost += 0.2;
    boostsUsed.push("Abundant Harvest");
  }

  return { amount: boost, boostsUsed };
}

function getMerinoWoolYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: BoostName[];
} {
  let boost = 0;
  const boostsUsed: BoostName[] = [];

  if (isWearableActive({ name: "Merino Jumper", game })) {
    boost += 1;
    boostsUsed.push("Merino Jumper");
  }

  if (isCollectibleBuilt({ name: "Toxic Tuft", game })) {
    boost += 0.1;
    boostsUsed.push("Toxic Tuft");
  }

  if (game.bumpkin.skills["Fine Fibers"]) {
    boost += 0.1;
    boostsUsed.push("Fine Fibers");
  }

  if (game.bumpkin.skills["Leathercraft Mastery"]) {
    boost -= 0.35;
    boostsUsed.push("Leathercraft Mastery");
  }

  if (game.bumpkin.skills["Featherweight"]) {
    boost -= 0.35;
    boostsUsed.push("Featherweight");
  }

  if (game.bumpkin.skills["Merino Whisperer"]) {
    boost += 0.25;
    boostsUsed.push("Merino Whisperer");
  }

  return { amount: boost, boostsUsed };
}
function getMilkYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: BoostName[];
} {
  let boost = 0;
  const boostsUsed: BoostName[] = [];

  if (isCollectibleBuilt({ name: "Longhorn Cowfish", game })) {
    boost += 0.2;
    boostsUsed.push("Longhorn Cowfish");
  }

  if (isWearableActive({ name: "Milk Apron", game })) {
    boost += 0.5;
    boostsUsed.push("Milk Apron");
  }

  if (isWearableActive({ name: "Cowbell Necklace", game })) {
    boost += 2;
    boostsUsed.push("Cowbell Necklace");
  }

  if (game.bumpkin.skills["Abundant Harvest"]) {
    boost += 0.2;
    boostsUsed.push("Abundant Harvest");
  }

  return { amount: boost, boostsUsed };
}

function getLeatherYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: BoostName[];
} {
  let boost = 0;
  const boostsUsed: BoostName[] = [];

  if (isCollectibleBuilt({ name: "Moo-ver", game })) {
    boost += 0.25;
    boostsUsed.push("Moo-ver");
  }

  if (isCollectibleBuilt({ name: "Mootant", game })) {
    boost += 0.1;
    boostsUsed.push("Mootant");
  }

  if (game.bumpkin.skills["Fine Fibers"]) {
    boost += 0.1;
    boostsUsed.push("Fine Fibers");
  }

  if (game.bumpkin.skills["Leathercraft Mastery"]) {
    boost += 0.25;
    boostsUsed.push("Leathercraft Mastery");
  }

  if (game.bumpkin.skills["Featherweight"]) {
    boost -= 0.35;
    boostsUsed.push("Featherweight");
  }

  if (game.bumpkin.skills["Merino Whisperer"]) {
    boost -= 0.35;
    boostsUsed.push("Merino Whisperer");
  }

  return { amount: boost, boostsUsed };
}

export function getResourceDropAmount({
  game,
  animalType,
  resource,
  baseAmount,
  multiplier,
}: ResourceDropAmountArgs): {
  amount: number;
  boostsUsed: BoostName[];
} {
  let amount = baseAmount;
  const boostsUsed: BoostName[] = [];

  const { bumpkin, buds = {} } = game;

  const isChicken = animalType === "Chicken";
  const isCow = animalType === "Cow";
  const isSheep = animalType === "Sheep";

  // Egg yield boosts
  if (isChicken && resource === "Egg") {
    const { amount: eggBoost, boostsUsed: eggBoostsUsed } =
      getEggYieldBoosts(game);
    amount += eggBoost;
    boostsUsed.push(...eggBoostsUsed);
  }

  // Feather yield boosts
  if (isChicken && resource === "Feather") {
    const { amount: featherBoost, boostsUsed: featherBoostsUsed } =
      getFeatherYieldBoosts(game);
    amount += featherBoost;
    boostsUsed.push(...featherBoostsUsed);
  }

  // Wool Yield Boost
  if (isSheep && resource === "Wool") {
    const { amount: woolBoost, boostsUsed: woolBoostsUsed } =
      getWoolYieldBoosts(game);
    amount += woolBoost;
    boostsUsed.push(...woolBoostsUsed);
  }

  // Merino Wool Yield Boost
  if (isSheep && resource === "Merino Wool") {
    const { amount: merinoWoolBoost, boostsUsed: merinoWoolBoostsUsed } =
      getMerinoWoolYieldBoosts(game);
    amount += merinoWoolBoost;
    boostsUsed.push(...merinoWoolBoostsUsed);
  }

  // Milk Yield Boost
  if (isCow && resource === "Milk") {
    const { amount: milkBoost, boostsUsed: milkBoostsUsed } =
      getMilkYieldBoosts(game);
    amount += milkBoost;
    boostsUsed.push(...milkBoostsUsed);
  }

  // Leather Yield Boost
  if (isCow && resource === "Leather") {
    const { amount: leatherBoost, boostsUsed: leatherBoostsUsed } =
      getLeatherYieldBoosts(game);
    amount += leatherBoost;
    boostsUsed.push(...leatherBoostsUsed);
  }

  // Add centralized Bale boost logic here
  if (isCollectibleBuilt({ name: "Bale", game })) {
    const baleBoost = 0.1;
    // For Chickens (Eggs) - always applies
    if (isChicken && resource === "Egg") {
      if (bumpkin.skills["Double Bale"]) {
        amount += baleBoost * 2;
        boostsUsed.push("Double Bale");
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
        boostsUsed.push("Double Bale");
      } else {
        amount += baleBoost;
      }
      boostsUsed.push("Bale Economy");
    }
    boostsUsed.push("Bale");
  }

  // Cattlegrim boosts all produce
  if (isWearableActive({ name: "Cattlegrim", game })) {
    amount += 0.25;
    boostsUsed.push("Cattlegrim");
  }

  // Barn Manager boosts all produce
  if (game.inventory["Barn Manager"]?.gt(0)) {
    amount += 0.1;
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(buds, resource);
  amount += yieldBoost;
  if (budUsed) boostsUsed.push(budUsed);

  if (multiplier) amount *= multiplier;

  return { amount: Number(amount.toFixed(2)), boostsUsed };
}

export function getBoostedFoodQuantity({
  animalType,
  foodQuantity,
  game,
}: {
  animalType: AnimalType;
  foodQuantity: number;
  game: GameState;
}): {
  foodQuantity: number;
  boostsUsed: BoostName[];
} {
  let baseFoodQuantity = cloneDeep(foodQuantity);
  const boostsUsed: BoostName[] = [];
  if (
    animalType === "Chicken" &&
    isCollectibleBuilt({ name: "Fat Chicken", game })
  ) {
    baseFoodQuantity *= 0.9;
    boostsUsed.push("Fat Chicken");
  }

  if (animalType === "Cow" && isCollectibleBuilt({ name: "Dr Cow", game })) {
    baseFoodQuantity *= 0.95;
    boostsUsed.push("Dr Cow");
  }

  if (
    animalType === "Chicken" &&
    isCollectibleBuilt({ name: "Cluckulator", game })
  ) {
    baseFoodQuantity *= 0.75;
    boostsUsed.push("Cluckulator");
  }

  if (
    (animalType === "Sheep" || animalType === "Cow") &&
    isWearableActive({ name: "Infernal Bullwhip", game })
  ) {
    baseFoodQuantity *= 0.5;
    boostsUsed.push("Infernal Bullwhip");
  }

  if (game.bumpkin.skills["Efficient Feeding"]) {
    baseFoodQuantity *= 0.95;
    boostsUsed.push("Efficient Feeding");
  }

  if (game.bumpkin.skills["Clucky Grazing"]) {
    if (animalType === "Chicken") {
      baseFoodQuantity *= 0.75;
    } else {
      baseFoodQuantity *= 1.5;
    }
    boostsUsed.push("Clucky Grazing");
  }

  if (game.bumpkin.skills["Sheepwise Diet"]) {
    if (animalType === "Sheep") {
      baseFoodQuantity *= 0.75;
    } else {
      baseFoodQuantity *= 1.5;
    }
    boostsUsed.push("Sheepwise Diet");
  }

  if (game.bumpkin.skills["Cow-Smart Nutrition"]) {
    if (animalType === "Cow") {
      baseFoodQuantity *= 0.75;
    } else {
      baseFoodQuantity *= 1.5;
    }
    boostsUsed.push("Cow-Smart Nutrition");
  }

  if (game.bumpkin.skills["Chonky Feed"]) {
    baseFoodQuantity *= 1.5;
    boostsUsed.push("Chonky Feed");
  }

  if (
    (animalType === "Sheep" || animalType === "Cow") &&
    isTemporaryCollectibleActive({ name: "Collie Shrine", game })
  ) {
    baseFoodQuantity *= 0.95;
    boostsUsed.push("Collie Shrine");
  }

  if (
    animalType === "Chicken" &&
    isTemporaryCollectibleActive({ name: "Bantam Shrine", game })
  ) {
    baseFoodQuantity *= 0.95;
    boostsUsed.push("Bantam Shrine");
  }

  return { foodQuantity: baseFoodQuantity, boostsUsed };
}

export function getBoostedAwakeAt({
  animalType,
  createdAt,
  game,
}: {
  animalType: AnimalType;
  createdAt: number;
  game: GameState;
}): {
  awakeAt: number;
  boostsUsed: BoostName[];
} {
  const sleepDuration = ANIMAL_SLEEP_DURATION;
  const { bumpkin } = game;
  const twoHoursInMs = 2 * 60 * 60 * 1000;

  // Start with the base duration
  let totalDuration = sleepDuration;
  const boostsUsed: BoostName[] = [];

  const isChicken = animalType === "Chicken";
  const isSheep = animalType === "Sheep";
  const isCow = animalType === "Cow";

  // Apply fixed time reductions first
  if (isChicken) {
    if (isCollectibleBuilt({ name: "El Pollo Veloz", game })) {
      totalDuration -= twoHoursInMs;
      boostsUsed.push("El Pollo Veloz");
    }

    if (isCollectibleBuilt({ name: "Speed Chicken", game })) {
      totalDuration *= 0.9;
      boostsUsed.push("Speed Chicken");
    }

    if (isCollectibleBuilt({ name: "Janitor Chicken", game })) {
      totalDuration *= 0.95;
      boostsUsed.push("Janitor Chicken");
    }
  }

  if (isSheep) {
    if (isWearableActive({ name: "Dream Scarf", game })) {
      totalDuration *= 0.8;
      boostsUsed.push("Dream Scarf");
    }

    if (isCollectibleBuilt({ name: "Farm Dog", game })) {
      totalDuration *= 0.75;
      boostsUsed.push("Farm Dog");
    }
  }

  if (isCow) {
    if (isCollectibleBuilt({ name: "Mammoth", game })) {
      totalDuration *= 0.75;
      boostsUsed.push("Mammoth");
    }
  }

  if (game.inventory["Wrangler"]?.gt(0)) {
    totalDuration *= 0.9;
    boostsUsed.push("Wrangler");
  }

  if (bumpkin.skills["Restless Animals"]) {
    totalDuration *= 0.9;
    boostsUsed.push("Restless Animals");
  }

  if (
    (isCow || isSheep) &&
    isTemporaryCollectibleActive({ name: "Collie Shrine", game })
  ) {
    totalDuration *= 0.75;
    boostsUsed.push("Collie Shrine");
  }

  if (
    isChicken &&
    isTemporaryCollectibleActive({ name: "Bantam Shrine", game })
  ) {
    totalDuration *= 0.75;
    boostsUsed.push("Bantam Shrine");
  }

  // Add the boosted duration to the created time
  return { awakeAt: createdAt + totalDuration, boostsUsed };
}
