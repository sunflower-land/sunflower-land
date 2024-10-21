import { produce } from "immer";
import Decimal from "decimal.js-light";
import {
  ANIMAL_FOOD_EXPERIENCE,
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
  item: AnimalFoodName | AnimalMedicineName;
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

      return copy; // Early return after curing
    }

    if (animal.state === "sick") {
      throw new Error("Cannot feed a sick animal");
    }

    const level = getAnimalLevel(animal.experience, animal.type);
    const { xp: foodXp, quantity: foodQuantity } =
      ANIMAL_FOOD_EXPERIENCE[action.animal][level][
        action.item as AnimalFoodName
      ];

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

    const food = isChicken && hasGoldenEggPlaced ? favouriteFood : action.item;
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
