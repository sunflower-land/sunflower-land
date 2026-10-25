import { ANIMAL_SLEEP_DURATION } from "../events/landExpansion/feedAnimal";
import {
  ANIMAL_FOOD_EXPERIENCE,
  ANIMAL_FOODS,
  ANIMAL_LEVELS,
  ANIMAL_BUILDING_TYPES,
  type AnimalBuildingType,
  type AnimalLevel,
  ANIMALS,
  type AnimalType,
  PIG_BRISTLES_PER_LEVEL,
} from "../types/animals";
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
  Inventory,
  InventoryItemName,
} from "../types/game";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "./collectibleBuilt";
import { getBudYieldBoosts } from "./getBudYieldBoosts";
import { isWearableActive } from "./wearables";
import { computeReadyAt, getAnimalBoostWindows } from "./boostWindows";
import { hasFeatureAccess } from "lib/flags";
import { isBeetle } from "../types/beetles";
import Decimal from "decimal.js-light";
import { getSkillLevel, SKILL_RANKS } from "../types/bumpkinSkills";

export const makeAnimalBuildingKey = (
  buildingName: AnimalBuildingType,
): AnimalBuildingKey => {
  return buildingName
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "") as AnimalBuildingKey;
};

/**
 * Every animal building's GameState key, in AnimalBuildingType order. Derived
 * so a new animal building cannot be forgotten by a loop; the order is stable
 * because `checkAnimalHealth` draws random numbers per building.
 */
export const ANIMAL_BUILDING_KEYS: AnimalBuildingKey[] =
  ANIMAL_BUILDING_TYPES.map(makeAnimalBuildingKey);

/**
 * Mud spent per application (#7721 Balance Update). Its charges work exactly
 * like a spice-rack treat's (`getAnimalHarvests`, spent in `claimProduce`).
 */
export const MUD_PER_APPLICATION = 10;
/**
 * Final feeding-XP multiplier for a muddy Pig (#7721: +25% final XP). The
 * result can be fractional (10 -> 12.5); handleFoodXP keeps it exact.
 */
export const MUD_XP_MULTIPLIER = 1.25;

export const isMuddy = (animal: Pick<Animal, "mud">): boolean =>
  (animal.mud?.harvestsRemaining ?? 0) > 0;

/**
 * Starting XP for the animals a new building is seeded with. Arbitrary data,
 * not derivable from ANIMAL_LEVELS - 40 and 80 both resolve to level 0 for
 * their animals.
 */
const DEFAULT_ANIMAL_EXPERIENCE: Record<AnimalType, number> = {
  Chicken: 40,
  Cow: 80,
  Sheep: 80,
  Pig: 80,
};

/**
 * How many animals a building is seeded with when it is constructed. Exhaustive
 * so a new animal building has to make the choice deliberately.
 *
 * The Pigpen's three (#7721) fill its level-1 capacity of 3, so buying a Pig
 * waits for the first upgrade - accepted by Elias, 2026-10-12.
 */
const STARTER_HERD_SIZE: Record<AnimalBuildingType, number> = {
  "Hen House": 3,
  Barn: 3,
  Pigpen: 3,
};

export function makeAnimalBuilding(
  building: AnimalBuildingType,
  createdAt = Date.now(),
): AnimalBuilding {
  const count = STARTER_HERD_SIZE[building];

  const animalType = getKeys(ANIMALS).find(
    (animal) => ANIMALS[animal].buildingRequired === building,
  );
  const { width } = ANIMALS[animalType as AnimalType];

  // Centred on the origin, so the row reads the same whatever its size: three
  // animals sit at -width / 0 / +width exactly as before, one sits at 0.
  const positions = Array.from({ length: count }, (_, index) => ({
    x: (index - (count - 1) / 2) * width,
    y: 0,
  }));

  const defaultAnimals = new Array(count)
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
          experience: DEFAULT_ANIMAL_EXPERIENCE[animalType as AnimalType],
          createdAt,
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

/** The top of the animal's XP table. */
export function getAnimalMaxLevel(animal: AnimalType): AnimalLevel {
  return Math.max(...getKeys(ANIMAL_LEVELS[animal]).map(Number)) as AnimalLevel;
}

export const isMaxLevel = (animal: AnimalType, level: AnimalLevel) =>
  level >= getAnimalMaxLevel(animal);

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

/**
 * XP the animal still needs before it is ready: to its next level, or at the
 * max level to the end of its current produce cycle.
 */
export function getXpUntilReady(animalType: AnimalType, xp: number): number {
  const maxLevel = getAnimalMaxLevel(animalType);
  const maxLevelXp = ANIMAL_LEVELS[animalType][maxLevel];

  if (xp < maxLevelXp) {
    const next = (getAnimalLevel(xp, animalType) + 1) as AnimalLevel;
    return ANIMAL_LEVELS[animalType][next] - xp;
  }

  const levelBeforeMaxXp =
    ANIMAL_LEVELS[animalType][(maxLevel - 1) as AnimalLevel];
  const cycleXP = maxLevelXp - levelBeforeMaxXp;

  return cycleXP - ((xp - maxLevelXp) % cycleXP);
}

/**
 * Whether gaining `gainedXp` on top of `beforeXp` earns the animal its produce:
 * a level-up below the top of the table, or, at max level, one more full cycle
 * of the final level's XP. Shared by feeding and petting so EITHER can flip the
 * animal to "ready" - petting alone used to check only for a level change, so
 * a max-level animal whose pet crossed the cycle line kept accruing XP but
 * never produced, and the next feed restarted the cycle from the wrap-around.
 *
 * XP keeps accruing past max level rather than being held inside one cycle,
 * so progress is always `excess % cycleXP` and nothing is ever rewritten.
 */
export function hasAnimalCompletedCycle({
  animalType,
  beforeXp,
  gainedXp,
}: {
  animalType: AnimalType;
  beforeXp: number;
  gainedXp: number;
}): boolean {
  const maxLevel = getAnimalMaxLevel(animalType);
  const maxLevelXp = ANIMAL_LEVELS[animalType][maxLevel];

  if (beforeXp < maxLevelXp) {
    return (
      getAnimalLevel(beforeXp, animalType) !==
      getAnimalLevel(beforeXp + gainedXp, animalType)
    );
  }

  const levelBeforeMaxXp =
    ANIMAL_LEVELS[animalType][(maxLevel - 1) as AnimalLevel];
  const cycleXP = maxLevelXp - levelBeforeMaxXp;
  const currentCycleProgress = (beforeXp - maxLevelXp) % cycleXP;

  return currentCycleProgress + gainedXp >= cycleXP;
}

export function getAnimalFavoriteFood(type: AnimalType, animalXP: number) {
  const level = getAnimalLevel(animalXP, type);
  const levelFood = ANIMAL_FOOD_EXPERIENCE[type][level];
  const maxXp = Math.max(
    ...getKeys(levelFood).map((food) => levelFood[food] ?? 0),
  );

  const favouriteFoods = getKeys(levelFood)
    .filter((foodName) => levelFood[foodName] === maxXp)
    .filter((food) => food !== "Omnifeed");

  if (favouriteFoods.length !== 1) throw new Error("No favourite food");

  return favouriteFoods[0];
}

/**
 * True when `food` is one of `animal`'s foods. Pigs eat only the four Slops;
 * the other animals never eat a Slop.
 */
export function isFoodForAnimal(
  animal: AnimalType,
  food: InventoryItemName,
): food is AnimalFoodName {
  return Object.prototype.hasOwnProperty.call(
    ANIMAL_FOOD_EXPERIENCE[animal][0],
    food,
  );
}

export function isAnimalFood(item: InventoryItemName): item is AnimalFoodName {
  return getKeys(ANIMAL_FOODS)
    .filter((food) => ANIMAL_FOODS[food].type === "food")
    .includes(item as AnimalFoodName);
}

/**
 * Resolves which item a click on an animal should feed.
 *
 * Players can accidentally feed the wrong food (e.g. walking from cows with
 * Hay selected to chickens that want Kernel Blend). We switch to the favourite
 * if enough is held. The favourite, Omnifeed and a Beetle are explicit choices,
 * so they are never overridden - and a Beetle is never switched TO on its own,
 * since it is a resource with other uses. If the favourite isn't held, the
 * selection is left alone so players can still feed whatever they actioned.
 */
export function getFeedItem({
  animal,
  selectedItem,
  favouriteFood,
  inventory,
  requiredQty,
  hasBeetleFeedingAccess,
}: {
  animal: AnimalType;
  selectedItem?: InventoryItemName;
  favouriteFood: AnimalFoodName;
  inventory: Inventory;
  requiredQty: Decimal;
  hasBeetleFeedingAccess: boolean;
}): InventoryItemName | undefined {
  if (
    selectedItem === favouriteFood ||
    (selectedItem === "Omnifeed" && isFoodForAnimal(animal, selectedItem)) ||
    (hasBeetleFeedingAccess && !!selectedItem && isBeetle(selectedItem))
  ) {
    return selectedItem;
  }

  const favouriteCount = inventory[favouriteFood] ?? new Decimal(0);
  if (favouriteCount.gte(requiredQty)) {
    return favouriteFood;
  }

  return selectedItem;
}

/** How many of `item` one feeding uses - a Beetle is always one. */
export function getFeedQuantity(
  item: InventoryItemName | undefined,
  requiredQty: Decimal,
): Decimal {
  return item && isBeetle(item) ? new Decimal(1) : requiredQty;
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

  if (isCollectibleBuilt({ name: "Ascended Chicken", game })) {
    boost = boost.plus(0.1);
    boostsUsed.push({ name: "Ascended Chicken", value: "+0.1" });
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

  if (isCollectibleBuilt({ name: "Ascended Sheep", game })) {
    boost = boost.plus(0.05);
    boostsUsed.push({ name: "Ascended Sheep", value: "+0.05" });
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

// Truffle Yield / Bristle Payout are multiplicative, unlike the flat yield
// helpers above, so they return a multiplier for the caller to apply AFTER
// the flat produce boosts.
function getTruffleYieldBoosts(game: GameState): {
  multiplier: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let multiplier = new Decimal(1);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const truffleYieldLevel = getSkillLevel(game.bumpkin.skills, "Truffle Yield");
  if (truffleYieldLevel) {
    const bonus = new Decimal(1).plus(
      SKILL_RANKS["Truffle Yield"].ranks[truffleYieldLevel - 1],
    );
    multiplier = multiplier.mul(bonus);
    boostsUsed.push({ name: "Truffle Yield", value: `x${bonus.toNumber()}` });
  }

  return { multiplier: multiplier.toNumber(), boostsUsed };
}

function getPigBristlesYieldBoosts(game: GameState): {
  multiplier: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let multiplier = new Decimal(1);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const bristlePayoutLevel = getSkillLevel(
    game.bumpkin.skills,
    "Bristle Payout",
  );
  if (bristlePayoutLevel) {
    const bonus = new Decimal(1).plus(
      SKILL_RANKS["Bristle Payout"].ranks[bristlePayoutLevel - 1],
    );
    multiplier = multiplier.mul(bonus);
    boostsUsed.push({ name: "Bristle Payout", value: `x${bonus.toNumber()}` });
  }

  return { multiplier: multiplier.toNumber(), boostsUsed };
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
  const isPig = animalType === "Pig";

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

  // Truffle Yield Boost (#7721) scales the Truffles after the flat produce boosts.
  if (isPig && resource === "Truffle") {
    const { multiplier: truffleMultiplier, boostsUsed: truffleBoostsUsed } =
      getTruffleYieldBoosts(game);
    amount = amount.mul(truffleMultiplier);
    boostsUsed.push(...truffleBoostsUsed);
  }

  // Pig Bristles Yield Boost (#7721) scales the Bristles the same way, after
  // the flat produce boosts and before the sickness cut in `getPigBristles`.
  if (isPig && resource === "Pig Bristles") {
    const { multiplier: bristlesMultiplier, boostsUsed: bristlesBoostsUsed } =
      getPigBristlesYieldBoosts(game);
    amount = amount.mul(bristlesMultiplier);
    boostsUsed.push(...bristlesBoostsUsed);
  }

  // Bud yield boosts are flat and sit after the Pig multipliers so they are
  // not scaled by Truffle Yield / Bristle Payout.
  const { yieldBoost, budUsed } = getBudYieldBoosts(buds, resource);
  amount = amount.plus(yieldBoost);
  if (budUsed)
    boostsUsed.push({ name: budUsed, value: `+${yieldBoost.toString()}` });

  if (multiplier) {
    amount = amount.mul(multiplier);
    if (multiplier !== 1) {
      boostsUsed.push({ name: "Buckaroo", value: `x${multiplier}` });
    }
  }

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
  now,
}: {
  animalType: AnimalType;
  foodQuantity: number;
  game: GameState;
  animal: Animal;
  now: number;
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
    "Swill Savvy": "Pig",
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
    isTemporaryCollectibleActive({ name: "Collie Shrine", game, now })
  ) {
    baseFoodQuantity = baseFoodQuantity.mul(0.95);
    boostsUsed.push({ name: "Collie Shrine", value: "x0.95" });
  }

  if (
    animalType === "Chicken" &&
    isTemporaryCollectibleActive({ name: "Bantam Shrine", game, now })
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

/**
 * The animal's sleep duration with its boosts applied, plus the wake time that
 * follows from starting it at `createdAt`.
 *
 * Legacy model: every boost — including the two temporary pet shrines — is baked
 * into the returned duration. Speed-rate model (SPEED_BOOSTS): the shrines are
 * excluded from BOTH the duration and `boostsUsed` and derived live from windows
 * instead, so what remains is the permanent-boost-only base duration returned as
 * `baseDurationMs`. Mirrors `getOilRecoveryTimeForDisplay`; returns no
 * `baseDurationMs` flag-off, so a flag-off re-sleep reverts the animal to legacy.
 *
 * `feedBuff` is the treat the animal carries INTO this sleep: a Truffle
 * Seasoning halves it. `claimProduce` passes the treat before spending its
 * charge, so the last charge still shortens the sleep it is spent on.
 */
export function getBoostedAwakeAt({
  animalType,
  createdAt,
  game,
  feedBuff,
}: {
  animalType: AnimalType;
  createdAt: number;
  game: GameState;
  feedBuff?: Animal["feedBuff"];
}): {
  awakeAt: number;
  baseDurationMs?: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const sleepDuration = ANIMAL_SLEEP_DURATION;
  const boostsWindowed = hasFeatureAccess(game, "SPEED_BOOSTS");
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

    if (isCollectibleBuilt({ name: "Ascended Cow", game })) {
      totalDuration *= 0.975;
      boostsUsed.push({ name: "Ascended Cow", value: "x0.975" });
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

  // Truffle Seasoning: -50% on the sleep it is spent on. Baked in like the
  // permanent boosts, so under the speed-rate model the shrines still stack
  // live on top of it.
  if (feedBuff?.name === "Truffle Seasoning") {
    totalDuration *= 0.5;
    boostsUsed.push({ name: "Truffle Seasoning", value: "x0.5" });
  }

  if (
    !boostsWindowed &&
    (isCow || isSheep) &&
    isTemporaryCollectibleActive({
      name: "Collie Shrine",
      game,
      now: createdAt,
    })
  ) {
    totalDuration *= 0.75;
    boostsUsed.push({ name: "Collie Shrine", value: "x0.75" });
  }

  if (
    !boostsWindowed &&
    isChicken &&
    isTemporaryCollectibleActive({
      name: "Bantam Shrine",
      game,
      now: createdAt,
    })
  ) {
    totalDuration *= 0.75;
    boostsUsed.push({ name: "Bantam Shrine", value: "x0.75" });
  }

  if (boostsWindowed) {
    // The stored wake time is only a cache of the projection made now (see
    // `Animal.awakeAt`); `getAnimalReadyAt` re-derives it live off the windows.
    return {
      awakeAt: computeReadyAt({
        startedAt: createdAt,
        baseDurationMs: totalDuration,
        windows: getAnimalBoostWindows(game, animalType),
      }),
      baseDurationMs: totalDuration,
      boostsUsed,
    };
  }

  // Add the boosted duration to the created time
  return { awakeAt: createdAt + totalDuration, boostsUsed };
}

/**
 * When a sleeping animal actually wakes, across both boost models. Animals put to
 * sleep under the speed-rate model (with `baseDurationMs`) derive their wake time
 * live from the shrine windows; legacy animals use their baked `awakeAt`.
 *
 * `baseDurationMs` is a PERMANENT per-animal migration marker: the read path keys
 * off its presence, NOT the `SPEED_BOOSTS` flag (matching `getMineReadyAt`). An
 * animal put to sleep while the flag was on therefore keeps windowed timing even
 * if the flag is later disabled — it stores the real `asleepAt` plus a
 * permanent-boost-only `baseDurationMs`, so falling back to the cached `awakeAt`
 * would freeze it at whatever projection happened to be made at sleep. Instant
 * wake (doll / Barnyard Rouse) clears the marker, so this returns that instant.
 */
export function getAnimalReadyAt(animal: Animal, game: GameState): number {
  const { baseDurationMs, asleepAt, awakeAt } = animal;

  if (baseDurationMs === undefined) return awakeAt;

  return computeReadyAt({
    startedAt: asleepAt,
    baseDurationMs,
    windows: getAnimalBoostWindows(game, animal.type),
  });
}

/**
 * A DISPLAY-ONLY copy of the animal with its live wake time substituted into
 * `awakeAt`.
 *
 * The animal xstate machine holds only `{ animal }` in context and has no access
 * to game state, so its `isAnimalSleeping` / `isAnimalNeedsLove` guards cannot
 * derive the windowed wake time themselves. Components resolve the animal once
 * and hand the machine (and the sleeping modal) this copy instead of threading a
 * `readyAt` through every event payload.
 *
 * NEVER persist or send this — it is a derived view, and writing it back would
 * bake a projection into state that is supposed to stay live. Safe as-is because
 * every mutation goes through `gameService` by animal id.
 */
export function resolveAnimal(animal: Animal, game: GameState): Animal {
  return { ...animal, awakeAt: getAnimalReadyAt(animal, game) };
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
  const { awakeAt, baseDurationMs, boostsUsed } = getBoostedAwakeAt({
    animalType,
    createdAt,
    game,
  });

  return {
    baseTimeMs: ANIMAL_SLEEP_DURATION,
    // Windowed: the permanent-boost-only duration. The shrines are excluded here
    // and surfaced by the caller as a live projection instead — projecting off a
    // `createdAt` of 0 would sit an epoch away from any real window.
    maturityTimeMs: baseDurationMs ?? awakeAt - createdAt,
    boostsUsed,
  };
}

/** The 25% a sick animal loses on bounty rewards and on its Bristles. */
export const SICK_ANIMAL_REWARD_MULTIPLIER = 0.75;

/**
 * The level an animal is sold or traded in at. A ready animal shows its
 * previous level until the yield is claimed, so it counts one level lower. At
 * the max level there is no next level to transition into - "ready" only means
 * a produce cycle completed - so the adjustment does not apply. This mirrors
 * the badge, which guards its own `- 1` the same way.
 */
export function getBountyLevel(
  animal: Pick<Animal, "type" | "experience" | "state">,
): AnimalLevel {
  const level = getAnimalLevel(animal.experience, animal.type);

  return animal.state === "ready" && level < getAnimalMaxLevel(animal.type)
    ? ((level - 1) as AnimalLevel)
    : level;
}

/**
 * Pig Bristles paid when a Pig is traded in or sold to a bounty (#7721): the
 * level's table amount through the generic produce boosts and Bristle Payout,
 * then the 25% sickness cut, kept exact to two decimals like produce. A level
 * whose table amount is 0 pays nothing - boosts have nothing to boost.
 */
export function getPigBristles({
  game,
  pig,
}: {
  game: GameState;
  pig: Animal;
}): {
  amount: number;
  beforeSickness: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const baseAmount = PIG_BRISTLES_PER_LEVEL[getBountyLevel(pig)];

  if (baseAmount === 0) {
    return { amount: 0, beforeSickness: 0, boostsUsed: [] };
  }

  const { amount: beforeSickness, boostsUsed } = getResourceDropAmount({
    game,
    animalType: "Pig",
    resource: "Pig Bristles",
    baseAmount,
    multiplier: pig.multiplier ?? 0,
    animal: pig,
  });

  const amount =
    pig.state === "sick"
      ? Number(
          new Decimal(beforeSickness)
            .mul(SICK_ANIMAL_REWARD_MULTIPLIER)
            .toFixed(2),
        )
      : beforeSickness;

  return { amount, beforeSickness, boostsUsed };
}

/**
 * A Pig can be traded in under the bounty rules - awake, sick or ready included
 * - as long as its level pays Bristles.
 */
export function canTradeInPig({
  pig,
  game,
  now,
}: {
  pig: Animal;
  game: GameState;
  now: number;
}): boolean {
  // Keep the truthiness guard: an animal that has never slept carries
  // `awakeAt: 0` and no marker, and must stay tradeable.
  const readyAt = getAnimalReadyAt(pig, game);
  if (readyAt && readyAt > now) {
    return false;
  }

  return PIG_BRISTLES_PER_LEVEL[getBountyLevel(pig)] > 0;
}
