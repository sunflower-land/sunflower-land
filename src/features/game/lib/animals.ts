import { ANIMAL_SLEEP_DURATION } from "../events/landExpansion/feedAnimal";
import {
  ANIMAL_FOOD_EXPERIENCE,
  ANIMAL_FOODS,
  ANIMAL_LEVELS,
  type AnimalBuildingType,
  type AnimalLevel,
  ANIMALS,
  type AnimalType,
} from "../types/animals";
import type { BuildingName } from "../types/buildings";
import { getKeys } from "lib/object";
import type {
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
import Decimal from "decimal.js-light";
import { getSkillLevel, SKILL_RANKS } from "../types/bumpkinSkills";

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
  animal: Animal;
};

function getEggYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let boost = new Decimal(0);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isCollectibleBuilt({ name: "Chicken Coop", game })) {
    boost = boost.plus(1);
    boostsUsed.push({ name: "Chicken Coop", value: "+1" });
  }

  if (isCollectibleBuilt({ name: "Rich Chicken", game })) {
    boost = boost.plus(0.1);
    boostsUsed.push({ name: "Rich Chicken", value: "+0.1" });
  }

  if (isCollectibleBuilt({ name: "Undead Rooster", game })) {
    boost = boost.plus(0.1);
    boostsUsed.push({ name: "Undead Rooster", value: "+0.1" });
  }

  if (isCollectibleBuilt({ name: "Ayam Cemani", game })) {
    boost = boost.plus(0.2);
    boostsUsed.push({ name: "Ayam Cemani", value: "+0.2" });
  }

  if (isCollectibleBuilt({ name: "Squid Chicken", game })) {
    boost = boost.plus(0.1);
    boostsUsed.push({ name: "Squid Chicken", value: "+0.1" });
  }

  const abundantHarvest = getAbundantHarvestBoost(game);
  if (abundantHarvest) {
    boost = boost.plus(abundantHarvest.value);
    boostsUsed.push(abundantHarvest.boostUsed);
  }

  return { amount: boost.toNumber(), boostsUsed };
}

// Abundant Harvest adds the same flat yield to Egg, Wool and Milk.
function getAbundantHarvestBoost(game: GameState) {
  const level = getSkillLevel(game.bumpkin.skills, "Abundant Harvest");
  if (!level) return undefined;

  const value = SKILL_RANKS["Abundant Harvest"].ranks[level - 1];

  return {
    value,
    boostUsed: { name: "Abundant Harvest" as BoostName, value: `+${value}` },
  };
}

// Fine Fibers adds the same flat yield to all three fibre resources, while
// Featherweight / Merino Whisperer / Leathercraft Mastery each buff their own
// fibre and debuff the other two from a single debuff value.
function getFibreYieldBoosts(
  game: GameState,
  favoured: "Featherweight" | "Merino Whisperer" | "Leathercraft Mastery",
): { amount: number; boostsUsed: { name: BoostName; value: string }[] } {
  // Accumulated in Decimal: these stack on one another, and in float
  // 0.1 + 0.35 lands on 0.44999999999999996.
  let boost = new Decimal(0);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const fineFibersLevel = getSkillLevel(game.bumpkin.skills, "Fine Fibers");
  if (fineFibersLevel) {
    const value = SKILL_RANKS["Fine Fibers"].ranks[fineFibersLevel - 1];
    boost = boost.plus(value);
    boostsUsed.push({ name: "Fine Fibers", value: `+${value}` });
  }

  const FIBRE_SKILLS = [
    "Featherweight",
    "Merino Whisperer",
    "Leathercraft Mastery",
  ] as const;

  for (const skill of FIBRE_SKILLS) {
    const level = getSkillLevel(game.bumpkin.skills, skill);
    if (!level) continue;

    const effect = SKILL_RANKS[skill];

    if (skill === favoured) {
      const value = effect.buff[level - 1];
      boost = boost.plus(value);
      boostsUsed.push({ name: skill, value: `+${value}` });
    } else {
      const value = effect.debuff[level - 1];
      boost = boost.minus(value);
      boostsUsed.push({ name: skill, value: `-${value}` });
    }
  }

  return { amount: boost.toNumber(), boostsUsed };
}

function getFeatherYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let boost = new Decimal(0);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isWearableActive({ name: "Chicken Suit", game })) {
    boost = boost.plus(1);
    boostsUsed.push({ name: "Chicken Suit", value: "+1" });
  }

  if (isCollectibleBuilt({ name: "Alien Chicken", game })) {
    boost = boost.plus(0.1);
    boostsUsed.push({ name: "Alien Chicken", value: "+0.1" });
  }

  const { amount: fibreBoost, boostsUsed: fibreBoostsUsed } =
    getFibreYieldBoosts(game, "Featherweight");
  boost = boost.plus(fibreBoost);
  boostsUsed.push(...fibreBoostsUsed);

  return { amount: boost.toNumber(), boostsUsed };
}

function getWoolYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let boost = new Decimal(0);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isWearableActive({ name: "Black Sheep Onesie", game })) {
    boost = boost.plus(2);
    boostsUsed.push({ name: "Black Sheep Onesie", value: "+2" });
  }
  // White Sheep Onesie - +.25 wool
  if (isWearableActive({ name: "White Sheep Onesie", game })) {
    boost = boost.plus(0.25);
    boostsUsed.push({ name: "White Sheep Onesie", value: "+0.25" });
  }

  if (isCollectibleBuilt({ name: "Astronaut Sheep", game })) {
    boost = boost.plus(0.1);
    boostsUsed.push({ name: "Astronaut Sheep", value: "+0.1" });
  }

  const abundantHarvest = getAbundantHarvestBoost(game);
  if (abundantHarvest) {
    boost = boost.plus(abundantHarvest.value);
    boostsUsed.push(abundantHarvest.boostUsed);
  }

  return { amount: boost.toNumber(), boostsUsed };
}

function getMerinoWoolYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let boost = new Decimal(0);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isWearableActive({ name: "Merino Jumper", game })) {
    boost = boost.plus(1);
    boostsUsed.push({ name: "Merino Jumper", value: "+1" });
  }

  if (isCollectibleBuilt({ name: "Toxic Tuft", game })) {
    boost = boost.plus(0.1);
    boostsUsed.push({ name: "Toxic Tuft", value: "+0.1" });
  }

  const { amount: fibreBoost, boostsUsed: fibreBoostsUsed } =
    getFibreYieldBoosts(game, "Merino Whisperer");
  boost = boost.plus(fibreBoost);
  boostsUsed.push(...fibreBoostsUsed);

  return { amount: boost.toNumber(), boostsUsed };
}
function getMilkYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let boost = new Decimal(0);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isCollectibleBuilt({ name: "Longhorn Cowfish", game })) {
    boost = boost.plus(0.2);
    boostsUsed.push({ name: "Longhorn Cowfish", value: "+0.2" });
  }

  if (isCollectibleBuilt({ name: "Spa Cow", game })) {
    boost = boost.plus(0.1);
    boostsUsed.push({ name: "Spa Cow", value: "+0.1" });
  }

  if (isWearableActive({ name: "Milk Apron", game })) {
    boost = boost.plus(0.5);
    boostsUsed.push({ name: "Milk Apron", value: "+0.5" });
  }

  if (isWearableActive({ name: "Cowbell Necklace", game })) {
    boost = boost.plus(2);
    boostsUsed.push({ name: "Cowbell Necklace", value: "+2" });
  }

  const abundantHarvest = getAbundantHarvestBoost(game);
  if (abundantHarvest) {
    boost = boost.plus(abundantHarvest.value);
    boostsUsed.push(abundantHarvest.boostUsed);
  }

  return { amount: boost.toNumber(), boostsUsed };
}

function getLeatherYieldBoosts(game: GameState): {
  amount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let boost = new Decimal(0);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isCollectibleBuilt({ name: "Moo-ver", game })) {
    boost = boost.plus(0.25);
    boostsUsed.push({ name: "Moo-ver", value: "+0.25" });
  }

  if (isCollectibleBuilt({ name: "Mootant", game })) {
    boost = boost.plus(0.1);
    boostsUsed.push({ name: "Mootant", value: "+0.1" });
  }

  const { amount: fibreBoost, boostsUsed: fibreBoostsUsed } =
    getFibreYieldBoosts(game, "Leathercraft Mastery");
  boost = boost.plus(fibreBoost);
  boostsUsed.push(...fibreBoostsUsed);

  if (isWearableActive({ name: "Training Whistle", game })) {
    boost = boost.plus(1);
    boostsUsed.push({ name: "Training Whistle", value: "+1" });
  }

  return { amount: boost.toNumber(), boostsUsed };
}

export function getResourceDropAmount({
  game,
  animalType,
  resource,
  baseAmount,
  multiplier,
  animal,
}: ResourceDropAmountArgs): {
  amount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  // Accumulated in Decimal so stacked decimal boosts stay exact.
  let amount = new Decimal(baseAmount);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const { bumpkin, buds = {} } = game;

  const isChicken = animalType === "Chicken";
  const isCow = animalType === "Cow";
  const isSheep = animalType === "Sheep";

  // Egg yield boosts
  if (isChicken && resource === "Egg") {
    const { amount: eggBoost, boostsUsed: eggBoostsUsed } =
      getEggYieldBoosts(game);
    amount = amount.plus(eggBoost);
    boostsUsed.push(...eggBoostsUsed);
  }

  // Feather yield boosts
  if (isChicken && resource === "Feather") {
    const { amount: featherBoost, boostsUsed: featherBoostsUsed } =
      getFeatherYieldBoosts(game);
    amount = amount.plus(featherBoost);
    boostsUsed.push(...featherBoostsUsed);
  }

  // Wool Yield Boost
  if (isSheep && resource === "Wool") {
    const { amount: woolBoost, boostsUsed: woolBoostsUsed } =
      getWoolYieldBoosts(game);
    amount = amount.plus(woolBoost);
    boostsUsed.push(...woolBoostsUsed);
  }

  // Merino Wool Yield Boost
  if (isSheep && resource === "Merino Wool") {
    const { amount: merinoWoolBoost, boostsUsed: merinoWoolBoostsUsed } =
      getMerinoWoolYieldBoosts(game);
    amount = amount.plus(merinoWoolBoost);
    boostsUsed.push(...merinoWoolBoostsUsed);
  }

  // Milk Yield Boost
  if (isCow && resource === "Milk") {
    const { amount: milkBoost, boostsUsed: milkBoostsUsed } =
      getMilkYieldBoosts(game);
    amount = amount.plus(milkBoost);
    boostsUsed.push(...milkBoostsUsed);
  }

  // Leather Yield Boost
  if (isCow && resource === "Leather") {
    const { amount: leatherBoost, boostsUsed: leatherBoostsUsed } =
      getLeatherYieldBoosts(game);
    amount = amount.plus(leatherBoost);
    boostsUsed.push(...leatherBoostsUsed);
  }

  // Add centralized Bale boost logic here
  if (isCollectibleBuilt({ name: "Bale", game })) {
    const baleBoost = 0.1;
    const doubleBaleLevel = getSkillLevel(bumpkin.skills, "Double Bale");

    // Bale only boosts eggs (always) and wool/milk (with Bale Economy). Track
    // whether it applied to THIS resource so the label isn't recorded for
    // Feather/Leather/Merino Wool (or wool/milk without Bale Economy).
    let baleApplied = false;

    // Double Bale multiplies Bale's decimal base, so scale in Decimal — a float
    // 0.1 * 3 drifts to 0.30000000000000004 and would leak into the label below.
    const applyBale = () => {
      baleApplied = true;
      if (!doubleBaleLevel) {
        amount = amount.plus(baleBoost);
        return;
      }

      const multiplier = SKILL_RANKS["Double Bale"].ranks[doubleBaleLevel - 1];
      const boosted = new Decimal(baleBoost).mul(multiplier);

      amount = amount.plus(boosted);
      boostsUsed.push({ name: "Double Bale", value: `+${boosted.toNumber()}` });
    };

    // For Chickens (Eggs) - always applies
    if (isChicken && resource === "Egg") {
      applyBale();
    }

    // For Sheep (Wool) and Cows (Milk) - only if Bale Economy skill is present
    if (
      bumpkin.skills["Bale Economy"] &&
      ((isSheep && resource === "Wool") || (isCow && resource === "Milk"))
    ) {
      applyBale();
      boostsUsed.push({ name: "Bale Economy", value: "+0.1" });
    }

    if (baleApplied) {
      boostsUsed.push({ name: "Bale", value: "+0.1" });
    }
  }

  // Cattlegrim boosts all produce
  if (isWearableActive({ name: "Cattlegrim", game })) {
    amount = amount.plus(0.25);
    boostsUsed.push({ name: "Cattlegrim", value: "+0.25" });
  }

  // Barn Manager boosts all produce
  if (game.inventory["Barn Manager"]?.gt(0)) {
    amount = amount.plus(0.1);
    boostsUsed.push({ name: "Barn Manager", value: "+0.1" });
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(buds, resource);
  amount = amount.plus(yieldBoost);
  if (budUsed)
    boostsUsed.push({ name: budUsed, value: `+${yieldBoost.toString()}` });

  if (multiplier) amount = amount.mul(multiplier);

  if (animal.feedBuff?.name === "Salt Lick") {
    amount = amount.mul(1.05);
    boostsUsed.push({ name: "Salt Lick", value: "x1.05" });
  }

  return { amount: Number(amount.toFixed(2)), boostsUsed };
}

export function getBoostedFoodQuantity({
  animalType,
  foodQuantity,
  game,
  animal,
}: {
  animalType: AnimalType;
  foodQuantity: number;
  game: GameState;
  animal: Animal;
}): {
  foodQuantity: Decimal;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let baseFoodQuantity = new Decimal(foodQuantity);
  const boostsUsed: { name: BoostName; value: string }[] = [];
  if (
    animalType === "Chicken" &&
    isCollectibleBuilt({ name: "Fat Chicken", game })
  ) {
    baseFoodQuantity = baseFoodQuantity.mul(0.9);
    boostsUsed.push({ name: "Fat Chicken", value: "x0.9" });
  }

  if (animalType === "Cow" && isCollectibleBuilt({ name: "Dr Cow", game })) {
    baseFoodQuantity = baseFoodQuantity.mul(0.95);
    boostsUsed.push({ name: "Dr Cow", value: "x0.95" });
  }

  if (
    animalType === "Sheep" &&
    isCollectibleBuilt({ name: "Mermaid Sheep", game })
  ) {
    baseFoodQuantity = baseFoodQuantity.mul(0.95);
    boostsUsed.push({ name: "Mermaid Sheep", value: "x0.95" });
  }

  if (
    animalType === "Chicken" &&
    isCollectibleBuilt({ name: "Cluckulator", game })
  ) {
    baseFoodQuantity = baseFoodQuantity.mul(0.75);
    boostsUsed.push({ name: "Cluckulator", value: "x0.75" });
  }

  if (
    (animalType === "Sheep" || animalType === "Cow") &&
    isWearableActive({ name: "Infernal Bullwhip", game })
  ) {
    baseFoodQuantity = baseFoodQuantity.mul(0.5);
    boostsUsed.push({ name: "Infernal Bullwhip", value: "x0.5" });
  }

  const efficientFeedingLevel = getSkillLevel(
    game.bumpkin.skills,
    "Efficient Feeding",
  );
  if (efficientFeedingLevel) {
    const value =
      SKILL_RANKS["Efficient Feeding"].ranks[efficientFeedingLevel - 1];
    baseFoodQuantity = baseFoodQuantity.mul(value);
    boostsUsed.push({ name: "Efficient Feeding", value: `x${value}` });
  }

  // Each diet skill cuts its own animal's feed and raises every other animal's.
  const DIET_SKILLS = {
    "Clucky Grazing": "Chicken",
    "Sheepwise Diet": "Sheep",
    "Cow-Smart Nutrition": "Cow",
  } as const;

  for (const skill of getKeys(DIET_SKILLS)) {
    const level = getSkillLevel(game.bumpkin.skills, skill);
    if (!level) continue;

    const effect = SKILL_RANKS[skill];
    const value =
      animalType === DIET_SKILLS[skill]
        ? effect.buff[level - 1]
        : effect.debuff[level - 1];

    baseFoodQuantity = baseFoodQuantity.mul(value);
    boostsUsed.push({ name: skill, value: `x${value}` });
  }

  const chonkyFeedLevel = getSkillLevel(game.bumpkin.skills, "Chonky Feed");
  if (chonkyFeedLevel) {
    const value = SKILL_RANKS["Chonky Feed"].feed[chonkyFeedLevel - 1];
    baseFoodQuantity = baseFoodQuantity.mul(value);
    boostsUsed.push({ name: "Chonky Feed", value: `x${value}` });
  }

  if (
    (animalType === "Sheep" || animalType === "Cow") &&
    isTemporaryCollectibleActive({ name: "Collie Shrine", game })
  ) {
    baseFoodQuantity = baseFoodQuantity.mul(0.95);
    boostsUsed.push({ name: "Collie Shrine", value: "x0.95" });
  }

  if (
    animalType === "Chicken" &&
    isTemporaryCollectibleActive({ name: "Bantam Shrine", game })
  ) {
    baseFoodQuantity = baseFoodQuantity.mul(0.95);
    boostsUsed.push({ name: "Bantam Shrine", value: "x0.95" });
  }

  if (animal?.feedBuff?.name === "Honey Treat") {
    baseFoodQuantity = baseFoodQuantity.mul(0.75);
    boostsUsed.push({ name: "Honey Treat", value: "x0.75" });
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
  boostsUsed: { name: BoostName; value: string }[];
} {
  const sleepDuration = ANIMAL_SLEEP_DURATION;
  const { bumpkin } = game;
  const twoHoursInMs = 2 * 60 * 60 * 1000;

  // Start with the base duration
  let totalDuration = sleepDuration;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const isChicken = animalType === "Chicken";
  const isSheep = animalType === "Sheep";
  const isCow = animalType === "Cow";

  // Apply fixed time reductions first
  if (isChicken) {
    if (isCollectibleBuilt({ name: "El Pollo Veloz", game })) {
      totalDuration -= twoHoursInMs;
      boostsUsed.push({ name: "El Pollo Veloz", value: "-2 hours" });
    }

    if (isCollectibleBuilt({ name: "Speed Chicken", game })) {
      totalDuration *= 0.9;
      boostsUsed.push({ name: "Speed Chicken", value: "x0.9" });
    }

    if (isCollectibleBuilt({ name: "Janitor Chicken", game })) {
      totalDuration *= 0.95;
      boostsUsed.push({ name: "Janitor Chicken", value: "x0.95" });
    }

    if (isCollectibleBuilt({ name: "Flamingo Chicken", game })) {
      totalDuration *= 0.975;
      boostsUsed.push({ name: "Flamingo Chicken", value: "x0.975" });
    }
  }

  if (isSheep) {
    if (isWearableActive({ name: "Dream Scarf", game })) {
      totalDuration *= 0.8;
      boostsUsed.push({ name: "Dream Scarf", value: "x0.8" });
    }

    if (isCollectibleBuilt({ name: "Farm Dog", game })) {
      totalDuration *= 0.75;
      boostsUsed.push({ name: "Farm Dog", value: "x0.75" });
    }
  }

  if (isCow) {
    if (isCollectibleBuilt({ name: "Mammoth", game })) {
      totalDuration *= 0.75;
      boostsUsed.push({ name: "Mammoth", value: "x0.75" });
    }
  }

  if (game.inventory["Wrangler"]?.gt(0)) {
    totalDuration *= 0.9;
    boostsUsed.push({ name: "Wrangler", value: "x0.9" });
  }

  const restlessAnimalsLevel = getSkillLevel(
    bumpkin.skills,
    "Restless Animals",
  );
  if (restlessAnimalsLevel) {
    const value =
      SKILL_RANKS["Restless Animals"].ranks[restlessAnimalsLevel - 1];
    totalDuration *= value;
    boostsUsed.push({ name: "Restless Animals", value: `x${value}` });
  }

  if (
    (isCow || isSheep) &&
    isTemporaryCollectibleActive({ name: "Collie Shrine", game })
  ) {
    totalDuration *= 0.75;
    boostsUsed.push({ name: "Collie Shrine", value: "x0.75" });
  }

  if (
    isChicken &&
    isTemporaryCollectibleActive({ name: "Bantam Shrine", game })
  ) {
    totalDuration *= 0.75;
    boostsUsed.push({ name: "Bantam Shrine", value: "x0.75" });
  }

  // Add the boosted duration to the created time
  return { awakeAt: createdAt + totalDuration, boostsUsed };
}

export function getAnimalMaturityTimeForDisplay({
  animalType,
  game,
}: {
  animalType: AnimalType;
  game: GameState;
}): {
  baseTimeMs: number;
  maturityTimeMs: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const createdAt = 0;
  const { awakeAt, boostsUsed } = getBoostedAwakeAt({
    animalType,
    createdAt,
    game,
  });

  return {
    baseTimeMs: ANIMAL_SLEEP_DURATION,
    maturityTimeMs: awakeAt - createdAt,
    boostsUsed,
  };
}
