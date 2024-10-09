import { produce } from "immer";
import Decimal from "decimal.js-light";
import { ANIMALS, AnimalType } from "features/game/types/animals";
import { AnimalFoodName, GameState, Inventory } from "features/game/types/game";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { getKeys } from "features/game/types/craftables";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

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

export function feedAnimal({ state, action, createdAt }: Options): GameState {
  return produce(state, (copy) => {
    const { buildingRequired } = ANIMALS[action.animal];
    const buildingKey = makeAnimalBuildingKey(buildingRequired);
    const animal = copy[buildingKey].animals[action.id];

    if (!animal) {
      throw new Error(
        `Animal ${action.id} not found in building ${buildingKey}`,
      );
    }

    if (createdAt < animal.asleepAt + 24 * 60 * 60 * 1000) {
      throw new Error("Animal is asleep");
    }

    const level = getAnimalLevel(animal.experience);
    const xp = ANIMAL_FOOD_EXPERIENCE[action.animal][level];
    const maxXp = Math.max(...Object.values(xp));
    const favouriteFoods = getKeys(xp).filter(
      (foodName) => xp[foodName] === maxXp,
    );

    if (favouriteFoods.length !== 1) throw new Error("No favourite food");
    const favouriteFood = favouriteFoods[0];

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

    if (level !== getAnimalLevel(animal.experience)) {
      animal.asleepAt = createdAt;
      animal.state = "idle";
    }

    return copy;
  });
}
