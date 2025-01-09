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

export function isMaxLevel(animal: AnimalType, experience: number) {
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
  let isReady = false;

  // Is max level
  if (nextLevel > 15) {
    const maxLevelXp = ANIMAL_LEVELS[animalType][15];
    const currentCycleProgress = beforeFeedXp % maxLevelXp;
    const xpDiff = maxLevelXp - currentCycleProgress;

    isReady = handleAnimalExperience(animal, animalType, beforeFeedXp, xpDiff);
  } else {
    const nextLevelXp = ANIMAL_LEVELS[animalType][nextLevel];
    const xpDiff = nextLevelXp - beforeFeedXp;

    isReady = handleAnimalExperience(animal, animalType, beforeFeedXp, xpDiff);
  }

  animal.state = isReady ? "ready" : "happy";

  copy.bumpkin.activity = trackActivity(
    `${animalType} Fed`,
    copy.bumpkin.activity,
  );

  return copy;
};

export function handleFoodXP({
  state,
  animal,
  level,
  food,
}: {
  state: GameState;
  animal: AnimalType;
  level: AnimalLevel;
  food: AnimalFoodName;
}) {
  let foodXp = ANIMAL_FOOD_EXPERIENCE[animal][level][food];

  if (state.bumpkin.skills["Chonky Feed"]) {
    foodXp *= 2;
  }

  return { foodXp };
}

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
    const hasGoldenEggPlaced = isCollectibleBuilt({
      name: "Gold Egg",
      game: copy,
    });
    const hasGoldenCowPlaced = isCollectibleBuilt({
      name: "Golden Cow",
      game: copy,
    });
    const favouriteFood = getAnimalFavoriteFood(
      action.animal,
      animal.experience,
    );

    // Handle Golden Egg Free Food
    if (action.animal === "Chicken" && hasGoldenEggPlaced) {
      return handleFreeFeeding({
        animal,
        animalType: action.animal,
        level,
        copy,
      });
    }

    // Handle Golden Cow Free Food
    if (action.animal === "Cow" && hasGoldenCowPlaced) {
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

    const { foodXp } = handleFoodXP({
      state: copy,
      animal: action.animal,
      level,
      food,
    });

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
