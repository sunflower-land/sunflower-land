import Decimal from "decimal.js-light";
import { BuildingName } from "./buildings";
import {
  AnimalFoodName,
  AnimalMedicineName,
  AnimalResource,
  Inventory,
} from "./game";
import { translate } from "lib/i18n/translate";
import { getKeys } from "./decorations";

export type AnimalBuildingType = Extract<BuildingName, "Barn" | "Hen House">;

export type AnimalType = "Chicken" | "Cow" | "Sheep";

type AnimalDetail = {
  coins: number;
  levelRequired: number;
  buildingRequired: AnimalBuildingType;
  height: number;
  width: number;
};

export type FeedType = "food" | "medicine";

export interface Feed {
  name: AnimalFoodName | AnimalMedicineName;
  type: FeedType;
  description: string;
  ingredients: Inventory;
  coins?: number;
}
export const ANIMALS: Record<AnimalType, AnimalDetail> = {
  Chicken: {
    coins: 50,
    levelRequired: 6,
    buildingRequired: "Hen House",
    height: 2,
    width: 2,
  },
  Cow: {
    coins: 100,
    levelRequired: 14,
    buildingRequired: "Barn",
    height: 2,
    width: 2,
  },
  Sheep: {
    coins: 120,
    levelRequired: 18,
    buildingRequired: "Barn",
    height: 2,
    width: 2,
  },
};

export type AnimalLevel =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;

export const ANIMAL_LEVELS: Record<AnimalType, Record<AnimalLevel, number>> = {
  Chicken: {
    0: 0,
    1: 60,
    2: 60,
    3: 120,
    4: 120,
    5: 120,
    6: 180,
    7: 180,
    8: 180,
    9: 180,
    10: 240,
    11: 240,
    12: 240,
    13: 240,
    14: 240,
    15: 300,
  },
  Cow: {
    0: 0,
    1: 180,
    2: 180,
    3: 360,
    4: 360,
    5: 360,
    6: 540,
    7: 540,
    8: 540,
    9: 540,
    10: 720,
    11: 720,
    12: 720,
    13: 720,
    14: 720,
    15: 900,
  },
  Sheep: {
    0: 0,
    1: 120,
    2: 120,
    3: 240,
    4: 240,
    5: 240,
    6: 360,
    7: 360,
    8: 360,
    9: 360,
    10: 480,
    11: 480,
    12: 480,
    13: 480,
    14: 480,
    15: 600,
  },
};

export const ANIMAL_FOODS: Record<AnimalFoodName | AnimalMedicineName, Feed> = {
  Hay: {
    name: "Hay",
    type: "food",
    description: translate("description.hay"),
    ingredients: {
      Wheat: new Decimal(1),
    },
  },
  "Kernel Blend": {
    name: "Kernel Blend",
    type: "food",
    description: translate("description.kernel.blend"),
    ingredients: {
      Corn: new Decimal(1),
    },
  },
  NutriBarley: {
    name: "NutriBarley",
    type: "food",
    description: translate("description.nutribarley"),
    ingredients: {
      Barley: new Decimal(1),
    },
  },
  "Mixed Grain": {
    name: "Mixed Grain",
    type: "food",
    description: translate("description.mixed.grain"),
    ingredients: {
      Wheat: new Decimal(1),
      Corn: new Decimal(1),
      Barley: new Decimal(1),
    },
  },
  "Barn Delight": {
    name: "Barn Delight",
    type: "medicine",
    description: translate("description.barn.delight"),
    ingredients: {
      Egg: new Decimal(10),
      Iron: new Decimal(1),
    },
  },
};

export const ANIMAL_FOOD_EXPERIENCE: Record<
  AnimalType,
  Record<AnimalLevel, Record<Exclude<AnimalFoodName, "Barn Delight">, number>>
> = {
  Chicken: {
    0: {
      Hay: 10,
      "Kernel Blend": 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    1: {
      Hay: 10,
      "Kernel Blend": 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    2: {
      Hay: 10,
      "Kernel Blend": 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    3: {
      "Kernel Blend": 100,
      Hay: 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    4: {
      "Kernel Blend": 10,
      Hay: 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    5: {
      "Kernel Blend": 10,
      Hay: 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    6: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    7: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    8: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    9: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    10: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    11: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    12: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    13: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    14: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    15: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
  },
  Cow: {
    0: {
      "Kernel Blend": 60,
      Hay: 10,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    1: {
      "Kernel Blend": 60,
      Hay: 10,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    2: {
      "Kernel Blend": 60,
      Hay: 10,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    3: {
      "Kernel Blend": 10,
      Hay: 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    4: {
      "Kernel Blend": 10,
      Hay: 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    5: {
      "Kernel Blend": 10,
      Hay: 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    6: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    7: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    8: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    9: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    10: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    11: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    12: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    13: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    14: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    15: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
  },
  Sheep: {
    0: {
      "Kernel Blend": 60,
      Hay: 10,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    1: {
      "Kernel Blend": 60,
      Hay: 10,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    2: {
      "Kernel Blend": 60,
      Hay: 10,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    3: {
      "Kernel Blend": 10,
      Hay: 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    4: {
      "Kernel Blend": 10,
      Hay: 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    5: {
      "Kernel Blend": 10,
      Hay: 60,
      NutriBarley: 20,
      "Mixed Grain": 30,
    },
    6: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    7: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    8: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    9: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 60,
      "Mixed Grain": 30,
    },
    10: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    11: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    12: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    13: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    14: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
    15: {
      "Kernel Blend": 10,
      Hay: 20,
      NutriBarley: 30,
      "Mixed Grain": 60,
    },
  },
};

export const ANIMAL_RESOURCE_DROP: Record<
  AnimalType,
  Record<AnimalLevel, Partial<Record<AnimalResource, Decimal>>>
> = {
  Chicken: {
    0: {},
    1: {
      Egg: new Decimal(1),
    },
    2: {
      Egg: new Decimal(1),
      Feather: new Decimal(1),
    },
    3: {
      Egg: new Decimal(2),
    },
    4: {
      Egg: new Decimal(2),
      Feather: new Decimal(1),
    },
    5: {
      Egg: new Decimal(2),
      Feather: new Decimal(2),
    },
    6: {
      Egg: new Decimal(3),
    },
    7: {
      Egg: new Decimal(3),
      Feather: new Decimal(1),
    },
    8: {
      Egg: new Decimal(3),
      Feather: new Decimal(2),
    },
    9: {
      Egg: new Decimal(3),
      Feather: new Decimal(3),
    },
    10: {
      Egg: new Decimal(3),
      Feather: new Decimal(3),
    },
    11: {
      Egg: new Decimal(3),
      Feather: new Decimal(3),
    },
    12: {
      Egg: new Decimal(3),
      Feather: new Decimal(3),
    },
    13: {
      Egg: new Decimal(3),
      Feather: new Decimal(3),
    },
    14: {
      Egg: new Decimal(3),
      Feather: new Decimal(3),
    },
    15: {
      Egg: new Decimal(3),
      Feather: new Decimal(3),
    },
  },
  Cow: {
    0: {},
    1: {
      Milk: new Decimal(1),
    },
    2: {
      Milk: new Decimal(1),
      Leather: new Decimal(1),
    },
    3: {
      Milk: new Decimal(2),
    },
    4: {
      Milk: new Decimal(2),
      Leather: new Decimal(1),
    },
    5: {
      Milk: new Decimal(2),
      Leather: new Decimal(2),
    },
    6: {
      Milk: new Decimal(3),
    },
    7: {
      Milk: new Decimal(3),
      Leather: new Decimal(1),
    },
    8: {
      Milk: new Decimal(3),
      Leather: new Decimal(2),
    },
    9: {
      Milk: new Decimal(3),
      Leather: new Decimal(3),
    },
    10: {
      Milk: new Decimal(3),
      Leather: new Decimal(3),
    },
    11: {
      Milk: new Decimal(3),
      Leather: new Decimal(3),
    },
    12: {
      Milk: new Decimal(3),
      Leather: new Decimal(3),
    },
    13: {
      Milk: new Decimal(3),
      Leather: new Decimal(3),
    },
    14: {
      Milk: new Decimal(3),
      Leather: new Decimal(3),
    },
    15: {
      Milk: new Decimal(3),
      Leather: new Decimal(3),
    },
  },
  Sheep: {
    0: {},
    1: {
      Wool: new Decimal(1),
    },
    2: {
      Wool: new Decimal(1),
      "Merino Wool": new Decimal(1),
    },
    3: {
      Wool: new Decimal(2),
    },
    4: {
      Wool: new Decimal(2),
      "Merino Wool": new Decimal(1),
    },
    5: {
      Wool: new Decimal(2),
      "Merino Wool": new Decimal(2),
    },
    6: {
      Wool: new Decimal(3),
    },
    7: {
      Wool: new Decimal(3),
      "Merino Wool": new Decimal(1),
    },
    8: {
      Wool: new Decimal(3),
      "Merino Wool": new Decimal(2),
    },
    9: {
      Wool: new Decimal(3),
      "Merino Wool": new Decimal(3),
    },
    10: {
      Wool: new Decimal(3),
      "Merino Wool": new Decimal(3),
    },
    11: {
      Wool: new Decimal(3),
      "Merino Wool": new Decimal(3),
    },
    12: {
      Wool: new Decimal(3),
      "Merino Wool": new Decimal(3),
    },
    13: {
      Wool: new Decimal(3),
      "Merino Wool": new Decimal(3),
    },
    14: {
      Wool: new Decimal(3),
      "Merino Wool": new Decimal(3),
    },
    15: {
      Wool: new Decimal(3),
      "Merino Wool": new Decimal(3),
    },
  },
};

export function getUniqueAnimalResources(): AnimalResource[] {
  const uniqueResources = new Set<AnimalResource>();

  Object.values(ANIMAL_RESOURCE_DROP).forEach((animalLevels) => {
    Object.values(animalLevels).forEach((inventory) => {
      getKeys(inventory).forEach((resource) => {
        uniqueResources.add(resource);
      });
    });
  });

  return Array.from(uniqueResources);
}
