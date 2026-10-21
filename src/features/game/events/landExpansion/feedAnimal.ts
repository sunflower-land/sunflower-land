import { produce } from "immer";
import Decimal from "decimal.js-light";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";
import {
  ANIMAL_FOOD_EXPERIENCE,
  ANIMAL_LEVELS,
  type AnimalLevel,
  ANIMALS,
  type AnimalType,
} from "features/game/types/animals";
import type {
  Animal,
  AnimalFoodName,
  AnimalMedicineName,
  AnimalMud,
  BoostName,
  GameState,
} from "features/game/types/game";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  getAnimalMaxLevel,
  getAnimalReadyAt,
  getBoostedFoodQuantity,
  getXpUntilReady,
  hasAnimalCompletedCycle,
  isFoodForAnimal,
  isMuddy,
  makeAnimalBuildingKey,
  MUD_XP_MULTIPLIER,
} from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getKeys } from "lib/object";
import { isWearableActive } from "features/game/lib/wearables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { isAnimalFeedable } from "./buyAnimal";
import {
  BEETLE_FEEDING_XP,
  type BeetleName,
  isBeetle,
} from "features/game/types/beetles";
import { hasFeatureAccess } from "lib/flags";

export const ANIMAL_SLEEP_DURATION = 24 * 60 * 60 * 1000;

export const REQUIRED_FOOD_QTY: Record<AnimalType, number> = {
  Chicken: 1,
  Sheep: 3,
  Cow: 5,
  // One Slop per feeding: a Slop's recipe is #7721's "quantity per feeding
  // action" (types/pigFeeds.ts).
  Pig: 1,
};

export type FeedAnimalAction = {
  type: "animal.fed";
  animal: AnimalType;
  id: string;
  item?: AnimalFoodName | AnimalMedicineName | BeetleName;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedAnimalAction;
  createdAt?: number;
};

export function isMaxLevel(
  animal: AnimalType,
  experience: number,
  maxLevel: AnimalLevel = (getKeys(ANIMAL_LEVELS[animal]).length -
    1) as AnimalLevel,
) {
  return experience >= ANIMAL_LEVELS[animal][maxLevel];
}

/** Applies the feed's XP and reports whether it earned produce. */
const handleAnimalExperience = (
  animal: Animal,
  animalType: AnimalType,
  beforeFeedXp: number,
  foodXp: number,
): boolean => {
  animal.experience = new Decimal(animal.experience).add(foodXp).toNumber();

  return hasAnimalCompletedCycle({
    animalType,
    beforeXp: beforeFeedXp,
    gainedXp: foodXp,
  });
};

const handleFreeFeeding = ({
  animal,
  animalType,
  level,
  copy,
}: {
  animal: Animal;
  animalType: AnimalType;
  level: number;
  copy: GameState;
}) => {
  const beforeFeedXp = animal.experience;
  const nextLevel = (level + 1) as AnimalLevel;
  const maxLevel = getAnimalMaxLevel(animalType);
  let isReady = false;

  // Is max level (or capped there by its building)
  if (nextLevel > maxLevel) {
    const maxLevelXp = ANIMAL_LEVELS[animalType][maxLevel];
    const currentCycleProgress = beforeFeedXp % maxLevelXp;
    const xpDiff = maxLevelXp - currentCycleProgress;

    isReady = handleAnimalExperience(animal, animalType, beforeFeedXp, xpDiff);
  } else {
    const nextLevelXp = ANIMAL_LEVELS[animalType][nextLevel];
    const xpDiff = nextLevelXp - beforeFeedXp;

    const favouriteFood = getAnimalFavoriteFood(animalType, beforeFeedXp);

    const { foodXp } = handleFoodXP({
      state: copy,
      animal: animalType,
      level: nextLevel,
      food: favouriteFood,
    });

    const noOfFeed = Math.ceil(xpDiff / foodXp);
    const xpToFeed = noOfFeed * foodXp;
    isReady = handleAnimalExperience(
      animal,
      animalType,
      beforeFeedXp,
      xpToFeed,
    );
  }

  animal.state = isReady ? "ready" : "happy";

  copy.farmActivity = trackFarmActivity(`${animalType} Fed`, copy.farmActivity);

  return copy;
};

export function handleFoodXP({
  state,
  animal,
  level,
  food,
  mud,
}: {
  state: GameState;
  animal: AnimalType;
  level: AnimalLevel;
  food: AnimalFoodName | BeetleName;
  mud?: AnimalMud;
}) {
  // A Beetle fed directly is a food like any other, with a fixed base XP.
  // Decimal keeps fractional XP (a muddy Pig's 10 -> 12.5) exact.
  let foodXp = new Decimal(
    isBeetle(food)
      ? BEETLE_FEEDING_XP[food]
      : (ANIMAL_FOOD_EXPERIENCE[animal][level][food] ?? 0),
  );

  // Chonky Feed never applies to a Beetle (#7721): a Beetle feed is always
  // exactly one Beetle, so there is no extra feed cost to pay for the XP.
  const chonkyFeedLevel = getSkillLevel(state.bumpkin.skills, "Chonky Feed");
  if (chonkyFeedLevel && !isBeetle(food)) {
    foodXp = foodXp.mul(SKILL_RANKS["Chonky Feed"].xp[chonkyFeedLevel - 1]);
  }

  // Mud is the FINAL multiplier, after every other feed-XP modifier.
  if (isMuddy({ mud })) {
    foodXp = foodXp.mul(MUD_XP_MULTIPLIER);
  }

  return { foodXp: foodXp.toNumber() };
}

/**
 * How many feeds one click gives `animal`: an animal asks for as many of its
 * favourite food (with Chonky Feed and Mud) as it takes to get ready, and one
 * click feeds them all. Feeding a different food uses the same count.
 */
export function getFeedBatchSize({
  state,
  animal,
}: {
  state: GameState;
  animal: Animal;
}): number {
  const { foodXp } = handleFoodXP({
    state,
    animal: animal.type,
    level: getAnimalLevel(animal.experience, animal.type),
    food: getAnimalFavoriteFood(animal.type, animal.experience),
    mud: animal.mud,
  });

  return Math.max(
    1,
    new Decimal(getXpUntilReady(animal.type, animal.experience))
      .div(foodXp)
      .toDecimalPlaces(0, Decimal.ROUND_CEIL)
      .toNumber(),
  );
}

export function getBarnDelightCost({ state }: { state: GameState }): {
  amount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isWearableActive({ name: "Oracle Syringe", game: state })) {
    amount = 0;
    boostsUsed.push({ name: "Oracle Syringe", value: "Free" });
    // Early return to avoid other boosts
    return { amount, boostsUsed };
  }

  if (isWearableActive({ name: "Medic Apron", game: state })) {
    amount /= 2;
    boostsUsed.push({ name: "Medic Apron", value: "x0.5" });
  }

  return { amount, boostsUsed };
}

export function feedAnimal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { buildingRequired } = ANIMALS[action.animal];

    const buildings = copy.buildings[buildingRequired];
    if (!buildings?.some((building) => !!building.coordinates)) {
      throw new Error("Building does not exist");
    }

    const buildingKey = makeAnimalBuildingKey(buildingRequired);
    const animal = copy[buildingKey].animals[action.id];
    const boostsUsed: { name: BoostName; value: string }[] = [];

    if (!animal) {
      throw new Error(
        `Animal ${action.id} not found in building ${buildingKey}`,
      );
    }

    const beforeFeedXp = animal.experience;

    if (createdAt < getAnimalReadyAt(animal, copy) && animal.state !== "sick") {
      throw new Error("Animal is asleep");
    }

    // Handle curing sick animal
    if (action.item === "Barn Delight") {
      if (animal.state !== "sick") {
        throw new Error("Cannot cure a healthy animal");
      }

      const barnDelightAmount =
        copy.inventory["Barn Delight"] ?? new Decimal(0);
      const { amount: barnDelightCost, boostsUsed: barnDelightBoostsUsed } =
        getBarnDelightCost({ state: copy });

      if (barnDelightAmount.lt(barnDelightCost)) {
        throw new Error("Not enough Barn Delight to cure the animal");
      }

      copy.inventory["Barn Delight"] = barnDelightAmount.sub(barnDelightCost);
      animal.state = "idle";

      copy.farmActivity = trackFarmActivity(
        `${action.animal} Cured`,
        copy.farmActivity,
      );

      copy.boostsUsedAt = updateBoostUsed({
        game: copy,
        boostNames: barnDelightBoostsUsed,
        createdAt,
      });

      return copy; // Early return after curing
    }

    // Animals beyond the building's capacity (e.g. a capacity boosting
    // collectible was removed or sold after buying animals) cannot be fed.
    // They can still be cured (handled above) and sold to bounties.
    if (!isAnimalFeedable(buildingKey, copy, action.id)) {
      throw new Error("Animal exceeds building capacity and cannot be fed");
    }

    // Handle feeding
    if (animal.state === "sick") {
      throw new Error("Cannot feed a sick animal");
    }

    const level = getAnimalLevel(animal.experience, animal.type);
    const food = action.item as AnimalFoodName | BeetleName;
    if (food && isBeetle(food) && !hasFeatureAccess(copy, "BEETLE_FEEDING")) {
      throw new Error("Beetle feeding is not available");
    }

    const hasGoldenEggPlaced = isCollectibleBuilt({
      name: "Gold Egg",
      game: copy,
    });
    const hasGoldenCowPlaced = isCollectibleBuilt({
      name: "Golden Cow",
      game: copy,
    });
    const hasGoldenSheepPlaced = isCollectibleBuilt({
      name: "Golden Sheep",
      game: copy,
    });
    const favouriteFood = getAnimalFavoriteFood(
      action.animal,
      animal.experience,
    );

    // Handle Golden Egg Free Food
    if (action.animal === "Chicken" && hasGoldenEggPlaced) {
      copy.boostsUsedAt = updateBoostUsed({
        game: copy,
        boostNames: [{ name: "Gold Egg", value: "Free" }],
        createdAt,
      });
      return handleFreeFeeding({
        animal,
        animalType: action.animal,
        level,
        copy,
      });
    }

    // Handle Golden Cow Free Food
    if (action.animal === "Cow" && hasGoldenCowPlaced) {
      copy.boostsUsedAt = updateBoostUsed({
        game: copy,
        boostNames: [{ name: "Golden Cow", value: "Free" }],
        createdAt,
      });
      return handleFreeFeeding({
        animal,
        animalType: action.animal,
        level,
        copy,
      });
    }

    // Handle Golden Sheep Free Food
    if (action.animal === "Sheep" && hasGoldenSheepPlaced) {
      copy.boostsUsedAt = updateBoostUsed({
        game: copy,
        boostNames: [{ name: "Golden Sheep", value: "Free" }],
        createdAt,
      });
      return handleFreeFeeding({
        animal,
        animalType: action.animal,
        level,
        copy,
      });
    }

    // Regular feeding logic
    if (!food) {
      throw new Error("No food provided");
    }

    if (!isBeetle(food) && !isFoodForAnimal(action.animal, food)) {
      throw new Error("This animal cannot eat this food");
    }

    // One click feeds the whole batch that gets the animal ready; a Beetle is
    // always one per click.
    const feeds = isBeetle(food)
      ? 1
      : getFeedBatchSize({ state: copy, animal });

    const { foodXp: xpPerFeed } = handleFoodXP({
      state: copy,
      animal: action.animal,
      level,
      food,
      mud: animal.mud,
    });
    const foodXp = new Decimal(xpPerFeed).mul(feeds).toNumber();

    // A Beetle is always one per feeding, with no feed-saving boosts.
    const { foodQuantity: quantityPerFeed, boostsUsed: foodBoostsUsed } =
      isBeetle(food)
        ? { foodQuantity: new Decimal(1), boostsUsed: [] }
        : getBoostedFoodQuantity({
            animalType: action.animal,
            foodQuantity: REQUIRED_FOOD_QTY[action.animal],
            game: copy,
            animal,
            now: createdAt,
          });
    const boostedFoodQuantity = quantityPerFeed.mul(feeds);

    // Take food from inventory
    const inventoryAmount = copy.inventory[food] ?? new Decimal(0);

    if (inventoryAmount.lt(boostedFoodQuantity)) {
      throw new Error(`Player does not have enough ${food}`);
    }

    copy.inventory[food] = inventoryAmount.sub(boostedFoodQuantity);

    boostsUsed.push(...foodBoostsUsed);

    const isReady = handleAnimalExperience(
      animal,
      action.animal,
      beforeFeedXp,
      foodXp,
    );

    // Only set happy/sad state if animal isn't ready
    if (!isReady) {
      animal.state =
        favouriteFood === food || food === "Omnifeed" || isBeetle(food)
          ? "happy"
          : "sad";
    } else {
      animal.state = "ready";
    }

    copy.farmActivity = trackFarmActivity(
      `${action.animal} Fed`,
      copy.farmActivity,
    );

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: boostsUsed,
      createdAt,
    });

    return copy;
  });
}
