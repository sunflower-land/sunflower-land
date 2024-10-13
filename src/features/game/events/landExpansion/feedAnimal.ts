import { produce } from "immer";
import Decimal from "decimal.js-light";
import { AnimalLevel, ANIMALS, AnimalType } from "features/game/types/animals";
import { AnimalFoodName, GameState, Inventory } from "features/game/types/game";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { getKeys } from "features/game/types/craftables";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

export const ANIMAL_FOOD_EXPERIENCE: Record<
  AnimalType,
  Record<AnimalLevel, Record<AnimalFoodName, number>>
> = {
  Chicken: {
    1: {
      Hay: 10,
      "Kernel Blend": 20,
    },
    2: {
      Hay: 15,
      "Kernel Blend": 30,
    },
    3: {
      Hay: 40,
      "Kernel Blend": 20,
    },
  },
  Cow: {
    1: {
      Hay: 10,
      "Kernel Blend": 20,
    },
    2: {
      Hay: 15,
      "Kernel Blend": 30,
    },
    3: {
      Hay: 40,
      "Kernel Blend": 20,
    },
  },
  Sheep: {
    1: {
      Hay: 10,
      "Kernel Blend": 20,
    },
    2: {
      Hay: 15,
      "Kernel Blend": 30,
    },
    3: {
      Hay: 40,
      "Kernel Blend": 20,
    },
  },
};

const ANIMAL_RESOURCE_DROP: Record<
  AnimalType,
  Record<AnimalLevel, Inventory>
> = {
  Chicken: {
    1: {
      Egg: new Decimal(1),
    },
    2: {
      Egg: new Decimal(2),
    },
    3: {
      Egg: new Decimal(2),
      Feather: new Decimal(1),
    },
  },
  Cow: {
    1: {},
    2: {},
    3: {},
  },
  Sheep: {
    1: {},
    2: {},
    3: {},
  },
};

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
    const xp = ANIMAL_FOOD_EXPERIENCE[action.animal][level];
    const favouriteFood = getAnimalFavoriteFood(
      action.animal,
      animal.experience,
    );

    const isChicken = action.animal === "Chicken";
    const hasGoldenEggPlaced = isCollectibleBuilt({
      name: "Gold Egg",
      game: copy,
    });

    const food = isChicken && hasGoldenEggPlaced ? favouriteFood : action.food;
    const requiredAmount = isChicken && hasGoldenEggPlaced ? 0 : 1;
    const inventoryAmount = copy.inventory[food] ?? new Decimal(0);

    if (inventoryAmount.lt(requiredAmount)) {
      throw new Error(`Player does not have any ${food}`);
    }

    copy.inventory[food] = inventoryAmount.sub(requiredAmount);
    animal.experience += xp[food];

    animal.state = "sad";

    if (favouriteFood === food) {
      getKeys(ANIMAL_RESOURCE_DROP[action.animal][level]).forEach(
        (resource) => {
          const amount = ANIMAL_RESOURCE_DROP[action.animal][level][resource];
          copy.inventory[resource] = (
            copy.inventory[resource] ?? new Decimal(0)
          ).add(amount ?? new Decimal(0));
        },
      );
      animal.state = "happy";
    }

    if (level !== getAnimalLevel(animal.experience, animal.type)) {
      animal.asleepAt = createdAt;
      animal.state = "idle";
    }

    return copy;
  });
}
