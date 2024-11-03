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
  getBoostedFoodQuantity,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { trackActivity } from "features/game/types/bumpkinActivity";

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
      const favouriteFoodXp =
        ANIMAL_FOOD_EXPERIENCE[action.animal][level][favouriteFood];
      animal.experience += favouriteFoodXp;

      animal.state = "happy";

      if (level !== getAnimalLevel(animal.experience, animal.type)) {
        animal.state = "ready";
      }

      copy.bumpkin.activity = trackActivity(
        `${action.animal} Fed`,
        copy.bumpkin.activity,
      );

      // Early return
      return copy;
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

    const inventoryAmount = copy.inventory[food] ?? new Decimal(0);

    if (inventoryAmount.lt(boostedFoodQuantity)) {
      throw new Error(`Player does not have enough ${food}`);
    }

    copy.inventory[food] = inventoryAmount.sub(boostedFoodQuantity);

    animal.experience += foodXp;

    animal.state = "sad";

    if (favouriteFood === food || food === "Omnifeed") {
      animal.state = "happy";
    }

    if (level !== getAnimalLevel(animal.experience, animal.type)) {
      animal.state = "ready";
    }

    copy.bumpkin.activity = trackActivity(
      `${action.animal} Fed`,
      copy.bumpkin.activity,
    );

    return copy;
  });
}
