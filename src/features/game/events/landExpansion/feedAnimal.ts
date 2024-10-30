import { produce } from "immer";
import Decimal from "decimal.js-light";
import {
  ANIMAL_FOOD_EXPERIENCE,
  ANIMAL_LEVELS,
  ANIMAL_RESOURCE_DROP,
  AnimalLevel,
  ANIMALS,
  AnimalType,
} from "features/game/types/animals";
import {
  AnimalFoodName,
  AnimalMedicineName,
  GameState,
} from "features/game/types/game";
import {
  getAnimalFavoriteFood,
  getBoostedFoodQuantity,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/craftables";

// export const ANIMAL_SLEEP_DURATION = 24 * 60 * 60 * 1000;
export const ANIMAL_SLEEP_DURATION = 20 * 1000;

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
        copy.bumpkin?.activity,
        new Decimal(1),
      );

      return copy; // Early return after curing
    }

    // Regular feeding logic
    if (animal.state === "sick") {
      throw new Error("Cannot feed a sick animal");
    }

    const food = action.item as AnimalFoodName;
    const isChicken = action.animal === "Chicken";
    const hasGoldenEggPlaced = isCollectibleBuilt({
      name: "Gold Egg",
      game: copy,
    });
    const favouriteFood = getAnimalFavoriteFood(action.animal, animal.level);

    const totalLevels = getKeys(ANIMAL_RESOURCE_DROP[action.animal]).length;
    const nextLevel = Math.min(animal.level + 1, totalLevels) as AnimalLevel;
    const xpNeededForLevelUp = ANIMAL_LEVELS[action.animal][nextLevel];
    const levelFoodsXP = ANIMAL_FOOD_EXPERIENCE[action.animal][animal.level];

    // Players with a Gold Egg place can feed a chicken for free
    if (isChicken && hasGoldenEggPlaced) {
      const favouriteFoodXp = levelFoodsXP[favouriteFood];
      animal.experience += favouriteFoodXp;

      animal.state = "happy";

      if (animal.experience >= xpNeededForLevelUp) {
        animal.state = "ready";
      }

      copy.bumpkin.activity = trackActivity(
        `${action.animal} Fed`,
        copy.bumpkin?.activity,
        new Decimal(1),
      );

      // Early return
      return copy;
    }

    if (!food) {
      throw new Error("No food provided");
    }

    const foodXp = levelFoodsXP[food];
    const foodQuantity = REQUIRED_FOOD_QTY[action.animal];
    const boostedFoodQuantity = getBoostedFoodQuantity({
      animalType: action.animal,
      foodQuantity,
      game: copy,
    });

    const inventoryAmount = copy.inventory[food] ?? new Decimal(0);

    if (inventoryAmount.lt(boostedFoodQuantity)) {
      throw new Error(`Player does not have enough ${food}`);
    }

    copy.inventory[food] = inventoryAmount.sub(boostedFoodQuantity);

    animal.experience += foodXp;
    animal.state = "sad";

    if (favouriteFood === food) {
      animal.state = "happy";
    }

    if (animal.experience >= xpNeededForLevelUp) {
      animal.state = "ready";
    }

    copy.bumpkin.activity = trackActivity(
      `${action.animal} Fed`,
      copy.bumpkin?.activity,
      new Decimal(1),
    );

    return copy;
  });
}
