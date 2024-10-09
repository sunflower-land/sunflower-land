import { produce } from "immer";
import Decimal from "decimal.js-light";
import { ANIMALS, AnimalType } from "features/game/types/animals";
import { AnimalFoodName, GameState, Inventory } from "features/game/types/game";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { getKeys } from "features/game/types/craftables";

type AnimalLevel = 1 | 2 | 3;

const ANIMAL_FOOD_EXPERIENCE: Record<
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

const getAnimalLevel = (experience: number): AnimalLevel => {
  if (experience >= 50) return 3;
  if (experience >= 20) return 2;
  return 1;
};

export type FeedAnimalAction = {
  type: "animal.fed";
  animal: AnimalType;
  id: string;
  food: AnimalFoodName;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedAnimalAction;
  createdAt: number;
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

    const inventoryAmount = copy.inventory[action.food] ?? new Decimal(0);
    if (inventoryAmount.lt(1)) {
      throw new Error(`Player does not have any ${action.food}`);
    }

    if (createdAt < animal.asleepAt + 24 * 60 * 60 * 1000) {
      throw new Error("Animal is asleep");
    }

    copy.inventory[action.food] = inventoryAmount.sub(1);

    const level = getAnimalLevel(animal.experience);
    const food = ANIMAL_FOOD_EXPERIENCE[action.animal][level];
    const xp = food[action.food];

    animal.experience += xp;

    console.log(
      { level, food, xp, animalEXP: animal.experience },
      getAnimalLevel(animal.experience),
    );
    if (level !== getAnimalLevel(animal.experience)) {
      animal.asleepAt = createdAt;
    }

    const maxXp = Math.max(...Object.values(food));
    const favouriteFoods = getKeys(food).filter(
      (foodName) => food[foodName] === maxXp,
    );

    if (favouriteFoods.length !== 1) {
      throw new Error("No favourite food");
    }
    const favouriteFood = favouriteFoods[0];

    if (favouriteFood === action.food) {
      getKeys(ANIMAL_RESOURCE_DROP[action.animal][level]).forEach(
        (resource) => {
          const amount = ANIMAL_RESOURCE_DROP[action.animal][level][resource];
          copy.inventory[resource] = (
            copy.inventory[resource] ?? new Decimal(0)
          ).add(amount ?? new Decimal(0));
        },
      );
    }

    return copy;
  });
}
