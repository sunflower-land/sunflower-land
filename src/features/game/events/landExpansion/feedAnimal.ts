import { produce } from "immer";
import Decimal from "decimal.js-light";
import {
  ANIMAL_FOOD_EXPERIENCE,
  ANIMALS,
  AnimalType,
} from "features/game/types/animals";
import { AnimalFoodName, GameState } from "features/game/types/game";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

export const ANIMAL_SLEEP_DURATION = 24 * 60 * 60 * 1000;
export const ANIMAL_NEEDS_LOVE_DURATION = 1000 * 60 * 60 * 8;

export type FeedAnimalAction = {
  type: "animal.fed";
  animal: AnimalType;
  id: string;
  food: AnimalFoodName;
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

    if (createdAt < animal.asleepAt + ANIMAL_SLEEP_DURATION) {
      throw new Error("Animal is asleep");
    }

    const level = getAnimalLevel(animal.experience, animal.type);
    const { xp: foodXp, quantity: foodQuantity } =
      ANIMAL_FOOD_EXPERIENCE[action.animal][level][action.food];

    const favouriteFood = getAnimalFavoriteFood(
      action.animal,
      animal.experience,
    );
    const favouriteFoodXp =
      ANIMAL_FOOD_EXPERIENCE[action.animal][level][favouriteFood];

    const isChicken = action.animal === "Chicken";
    const hasGoldenEggPlaced = isCollectibleBuilt({
      name: "Gold Egg",
      game: copy,
    });

    const food = isChicken && hasGoldenEggPlaced ? favouriteFood : action.food;
    const requiredAmount = isChicken && hasGoldenEggPlaced ? 0 : foodQuantity;
    const inventoryAmount = copy.inventory[food] ?? new Decimal(0);

    if (inventoryAmount.lt(requiredAmount)) {
      throw new Error(`Player does not have enough ${food}`);
    }

    copy.inventory[food] = inventoryAmount.sub(requiredAmount);

    // Update XP calculation for chickens with Gold Egg
    const xpToAdd =
      isChicken && hasGoldenEggPlaced ? favouriteFoodXp.xp : foodXp;

    animal.experience += xpToAdd;

    animal.state = "sad";

    if (favouriteFood === food) {
      animal.state = "happy";
    }

    if (level !== getAnimalLevel(animal.experience, animal.type)) {
      animal.state = "ready";
    }

    return copy;
  });
}
