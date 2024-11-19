import { produce } from "immer";
import Decimal from "decimal.js-light";
import {
  ANIMAL_FOOD_EXPERIENCE,
  ANIMAL_LEVELS,
  AnimalLevel,
  ANIMALS,
  AnimalType,
} from "features/game/types/animals";
import {
  Animal,
  AnimalFoodName,
  AnimalMedicineName,
  GameState,
} from "features/game/types/game";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  getBoostedFoodQuantity,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/decorations";

export const ANIMAL_SLEEP_DURATION = 24 * 60 * 60 * 1000;

export const REQUIRED_FOOD_QTY: Record<AnimalType, number> = {
  Chicken: 1,
  Sheep: 3,
  Cow: 5,
};

export type FeedAnimalAction = {
  type: "animal.fed";
  animal: AnimalType;
  id: string;
  item?: AnimalFoodName | AnimalMedicineName;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedAnimalAction;
  createdAt?: number;
};

function isMaxLevel(animal: AnimalType, experience: number) {
  const maxLevel = (getKeys(ANIMAL_LEVELS[animal]).length - 1) as AnimalLevel;
  const maxLevelXP = ANIMAL_LEVELS[animal][maxLevel];

  return experience >= maxLevelXP;
}

const handleAnimalExperience = (
  animal: Animal,
  animalType: AnimalType,
  beforeFeedXp: number,
  foodXp: number,
): boolean => {
  animal.experience += foodXp;

  // Handle non-max level animal
  if (!isMaxLevel(animalType, beforeFeedXp)) {
    if (
      getAnimalLevel(beforeFeedXp, animalType) !==
      getAnimalLevel(animal.experience, animalType)
    ) {
      return true;
    }
    return false;
  }

  // Handle max level cycle completion
  const maxLevel = (getKeys(ANIMAL_LEVELS[animalType]).length -
    1) as AnimalLevel;
  const levelBeforeMax = (maxLevel - 1) as AnimalLevel;
  const maxLevelXp = ANIMAL_LEVELS[animalType][maxLevel];
  const levelBeforeMaxXp = ANIMAL_LEVELS[animalType][levelBeforeMax];
  const cycleXP = maxLevelXp - levelBeforeMaxXp;
  const excessXpBeforeFeed = Math.max(beforeFeedXp - maxLevelXp, 0);
  const currentCycleProgress = excessXpBeforeFeed % cycleXP;

  return currentCycleProgress + foodXp >= cycleXP;
};

const handleGoldenEggFeeding = (
  animal: Animal,
  animalType: AnimalType,
  level: number,
  favouriteFood: AnimalFoodName,
  copy: GameState,
) => {
  const foodXps = ANIMAL_FOOD_EXPERIENCE[animalType];
  const favouriteFoodXp = foodXps[level as AnimalLevel][favouriteFood];
  const beforeFeedXp = animal.experience;

  const isReady = handleAnimalExperience(
    animal,
    animalType,
    beforeFeedXp,
    favouriteFoodXp,
  );
  animal.state = isReady ? "ready" : "happy";

  copy.bumpkin.activity = trackActivity(
    `${animalType} Fed`,
    copy.bumpkin.activity,
  );

  return copy;
};

export function feedAnimal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { buildingRequired } = ANIMALS[action.animal];
    const buildingKey = makeAnimalBuildingKey(buildingRequired);
    const animal = copy[buildingKey].animals[action.id];

    if (!animal) {
      throw new Error(
        `Animal ${action.id} not found in building ${buildingKey}`,
      );
    }

    const beforeFeedXp = animal.experience;

    if (createdAt < animal.awakeAt) {
      throw new Error("Animal is asleep");
    }

    // Handle curing sick animal
    if (action.item === "Barn Delight") {
      if (animal.state !== "sick") {
        throw new Error("Cannot cure a healthy animal");
      }

      const barnDelightAmount =
        copy.inventory["Barn Delight"] ?? new Decimal(0);

      if (barnDelightAmount.lt(1)) {
        throw new Error("Not enough Barn Delight to cure the animal");
      }

      copy.inventory["Barn Delight"] = barnDelightAmount.sub(1);
      animal.state = "idle";

      copy.bumpkin.activity = trackActivity(
        `${action.animal} Cured`,
        copy.bumpkin.activity,
      );

      return copy; // Early return after curing
    }

    // Handle feeding
    if (animal.state === "sick") {
      throw new Error("Cannot feed a sick animal");
    }

    const level = getAnimalLevel(animal.experience, animal.type);
    const food = action.item as AnimalFoodName;
    const isChicken = action.animal === "Chicken";
    const hasGoldenEggPlaced = isCollectibleBuilt({
      name: "Gold Egg",
      game: copy,
    });
    const favouriteFood = getAnimalFavoriteFood(
      action.animal,
      animal.experience,
    );

    // Handle Golden Egg Free Food
    if (isChicken && hasGoldenEggPlaced) {
      return handleGoldenEggFeeding(
        animal,
        action.animal,
        level,
        favouriteFood,
        copy,
      );
    }

    // Regular feeding logic
    if (!food) {
      throw new Error("No food provided");
    }

    const foodXp = ANIMAL_FOOD_EXPERIENCE[action.animal][level][food];
    const foodQuantity = REQUIRED_FOOD_QTY[action.animal];
    const boostedFoodQuantity = getBoostedFoodQuantity({
      animalType: action.animal,
      foodQuantity,
      game: copy,
    });

    // Take food from inventory
    const inventoryAmount = copy.inventory[food] ?? new Decimal(0);

    if (inventoryAmount.lt(boostedFoodQuantity)) {
      throw new Error(`Player does not have enough ${food}`);
    }

    copy.inventory[food] = inventoryAmount.sub(boostedFoodQuantity);

    const isReady = handleAnimalExperience(
      animal,
      action.animal,
      beforeFeedXp,
      foodXp,
    );

    // Only set happy/sad state if animal isn't ready
    if (!isReady) {
      animal.state =
        favouriteFood === food || food === "Omnifeed" ? "happy" : "sad";
    } else {
      animal.state = "ready";
    }

    copy.bumpkin.activity = trackActivity(
      `${action.animal} Fed`,
      copy.bumpkin.activity,
    );

    return copy;
  });
}
