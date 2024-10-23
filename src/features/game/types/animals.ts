import Decimal from "decimal.js-light";
import { BuildingName } from "./buildings";
import { AnimalFoodName, AnimalMedicineName, Inventory } from "./game";
import { translate } from "lib/i18n/translate";

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
    2: 120,
    3: 240,
    4: 360,
    5: 480,
    6: 660,
    7: 840,
    8: 1020,
    9: 1200,
    10: 1440,
    11: 1680,
    12: 1920,
    13: 2160,
    14: 2400,
    15: 2700,
  },
  Cow: {
    0: 0,
    1: 180,
    2: 360,
    3: 720,
    4: 1080,
    5: 1440,
    6: 1980,
    7: 2520,
    8: 3060,
    9: 3600,
    10: 4320,
    11: 5040,
    12: 5760,
    13: 6480,
    14: 7200,
    15: 8100,
  },
  Sheep: {
    0: 0,
    1: 120,
    2: 240,
    3: 480,
    4: 720,
    5: 960,
    6: 1320,
    7: 1680,
    8: 2040,
    9: 2400,
    10: 2880,
    11: 3360,
    12: 3840,
    13: 4320,
    14: 4800,
    15: 5400,
  },
};

export const ANIMAL_FOODS: Record<AnimalFoodName | AnimalMedicineName, Feed> = {
  Hay: {
    name: "Hay",
    type: "food",
    description: translate("description.hay"),
    ingredients: {
      Corn: new Decimal(1),
    },
  },
  "Kernel Blend": {
    name: "Kernel Blend",
    type: "food",
    description: translate("description.kernel.blend"),
    ingredients: {
      Wheat: new Decimal(1),
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
  Record<
    AnimalLevel,
    Record<
      Exclude<AnimalFoodName, "Barn Delight">,
      { xp: number; quantity: number }
    >
  >
> = {
  Chicken: {
    0: {
      Hay: { xp: 10, quantity: 1 },
      "Kernel Blend": { xp: 60, quantity: 1 },
      NutriBarley: { xp: 20, quantity: 1 },
      "Mixed Grain": { xp: 30, quantity: 1 },
    },
    1: {
      Hay: { xp: 10, quantity: 1 },
      "Kernel Blend": { xp: 60, quantity: 1 },
      NutriBarley: { xp: 20, quantity: 1 },
      "Mixed Grain": { xp: 30, quantity: 1 },
    },
    2: {
      Hay: { xp: 10, quantity: 1 },
      "Kernel Blend": { xp: 60, quantity: 1 },
      NutriBarley: { xp: 20, quantity: 1 },
      "Mixed Grain": { xp: 30, quantity: 1 },
    },
    3: {
      "Kernel Blend": { xp: 100, quantity: 1 },
      Hay: { xp: 60, quantity: 1 },
      NutriBarley: { xp: 20, quantity: 1 },
      "Mixed Grain": { xp: 30, quantity: 1 },
    },
    4: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 60, quantity: 1 },
      NutriBarley: { xp: 20, quantity: 1 },
      "Mixed Grain": { xp: 30, quantity: 1 },
    },
    5: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 60, quantity: 1 },
      NutriBarley: { xp: 20, quantity: 1 },
      "Mixed Grain": { xp: 30, quantity: 1 },
    },
    6: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 20, quantity: 1 },
      NutriBarley: { xp: 60, quantity: 1 },
      "Mixed Grain": { xp: 30, quantity: 1 },
    },
    7: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 20, quantity: 1 },
      NutriBarley: { xp: 60, quantity: 1 },
      "Mixed Grain": { xp: 30, quantity: 1 },
    },
    8: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 20, quantity: 1 },
      NutriBarley: { xp: 60, quantity: 1 },
      "Mixed Grain": { xp: 30, quantity: 1 },
    },
    9: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 20, quantity: 1 },
      NutriBarley: { xp: 60, quantity: 1 },
      "Mixed Grain": { xp: 30, quantity: 1 },
    },
    10: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 20, quantity: 1 },
      NutriBarley: { xp: 30, quantity: 1 },
      "Mixed Grain": { xp: 60, quantity: 1 },
    },
    11: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 20, quantity: 1 },
      NutriBarley: { xp: 30, quantity: 1 },
      "Mixed Grain": { xp: 60, quantity: 1 },
    },
    12: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 20, quantity: 1 },
      NutriBarley: { xp: 30, quantity: 1 },
      "Mixed Grain": { xp: 60, quantity: 1 },
    },
    13: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 20, quantity: 1 },
      NutriBarley: { xp: 30, quantity: 1 },
      "Mixed Grain": { xp: 60, quantity: 1 },
    },
    14: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 20, quantity: 1 },
      NutriBarley: { xp: 30, quantity: 1 },
      "Mixed Grain": { xp: 60, quantity: 1 },
    },
    15: {
      "Kernel Blend": { xp: 10, quantity: 1 },
      Hay: { xp: 20, quantity: 1 },
      NutriBarley: { xp: 30, quantity: 1 },
      "Mixed Grain": { xp: 60, quantity: 1 },
    },
  },
  Cow: {
    0: {
      "Kernel Blend": { xp: 60, quantity: 5 },
      Hay: { xp: 10, quantity: 5 },
      NutriBarley: { xp: 20, quantity: 5 },
      "Mixed Grain": { xp: 30, quantity: 5 },
    },
    1: {
      "Kernel Blend": { xp: 60, quantity: 5 },
      Hay: { xp: 10, quantity: 5 },
      NutriBarley: { xp: 20, quantity: 5 },
      "Mixed Grain": { xp: 30, quantity: 5 },
    },
    2: {
      "Kernel Blend": { xp: 60, quantity: 5 },
      Hay: { xp: 10, quantity: 5 },
      NutriBarley: { xp: 20, quantity: 5 },
      "Mixed Grain": { xp: 30, quantity: 5 },
    },
    3: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 60, quantity: 5 },
      NutriBarley: { xp: 20, quantity: 5 },
      "Mixed Grain": { xp: 30, quantity: 5 },
    },
    4: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 60, quantity: 5 },
      NutriBarley: { xp: 20, quantity: 5 },
      "Mixed Grain": { xp: 30, quantity: 5 },
    },
    5: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 60, quantity: 5 },
      NutriBarley: { xp: 20, quantity: 5 },
      "Mixed Grain": { xp: 30, quantity: 5 },
    },
    6: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 20, quantity: 5 },
      NutriBarley: { xp: 60, quantity: 5 },
      "Mixed Grain": { xp: 30, quantity: 5 },
    },
    7: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 20, quantity: 5 },
      NutriBarley: { xp: 60, quantity: 5 },
      "Mixed Grain": { xp: 30, quantity: 5 },
    },
    8: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 20, quantity: 5 },
      NutriBarley: { xp: 60, quantity: 5 },
      "Mixed Grain": { xp: 30, quantity: 5 },
    },
    9: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 20, quantity: 5 },
      NutriBarley: { xp: 60, quantity: 5 },
      "Mixed Grain": { xp: 30, quantity: 5 },
    },
    10: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 20, quantity: 5 },
      NutriBarley: { xp: 30, quantity: 5 },
      "Mixed Grain": { xp: 60, quantity: 5 },
    },
    11: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 20, quantity: 5 },
      NutriBarley: { xp: 30, quantity: 5 },
      "Mixed Grain": { xp: 60, quantity: 5 },
    },
    12: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 20, quantity: 5 },
      NutriBarley: { xp: 30, quantity: 5 },
      "Mixed Grain": { xp: 60, quantity: 5 },
    },
    13: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 20, quantity: 5 },
      NutriBarley: { xp: 30, quantity: 5 },
      "Mixed Grain": { xp: 60, quantity: 5 },
    },
    14: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 20, quantity: 5 },
      NutriBarley: { xp: 30, quantity: 5 },
      "Mixed Grain": { xp: 60, quantity: 5 },
    },
    15: {
      "Kernel Blend": { xp: 10, quantity: 5 },
      Hay: { xp: 20, quantity: 5 },
      NutriBarley: { xp: 30, quantity: 5 },
      "Mixed Grain": { xp: 60, quantity: 5 },
    },
  },
  Sheep: {
    0: {
      "Kernel Blend": { xp: 60, quantity: 3 },
      Hay: { xp: 10, quantity: 3 },
      NutriBarley: { xp: 20, quantity: 3 },
      "Mixed Grain": { xp: 30, quantity: 3 },
    },
    1: {
      "Kernel Blend": { xp: 60, quantity: 3 },
      Hay: { xp: 10, quantity: 3 },
      NutriBarley: { xp: 20, quantity: 3 },
      "Mixed Grain": { xp: 30, quantity: 3 },
    },
    2: {
      "Kernel Blend": { xp: 60, quantity: 3 },
      Hay: { xp: 10, quantity: 3 },
      NutriBarley: { xp: 20, quantity: 3 },
      "Mixed Grain": { xp: 30, quantity: 3 },
    },
    3: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 60, quantity: 3 },
      NutriBarley: { xp: 20, quantity: 3 },
      "Mixed Grain": { xp: 30, quantity: 3 },
    },
    4: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 60, quantity: 3 },
      NutriBarley: { xp: 20, quantity: 3 },
      "Mixed Grain": { xp: 30, quantity: 3 },
    },
    5: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 60, quantity: 3 },
      NutriBarley: { xp: 20, quantity: 3 },
      "Mixed Grain": { xp: 30, quantity: 3 },
    },
    6: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 20, quantity: 3 },
      NutriBarley: { xp: 60, quantity: 3 },
      "Mixed Grain": { xp: 30, quantity: 3 },
    },
    7: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 20, quantity: 3 },
      NutriBarley: { xp: 60, quantity: 3 },
      "Mixed Grain": { xp: 30, quantity: 3 },
    },
    8: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 20, quantity: 3 },
      NutriBarley: { xp: 60, quantity: 3 },
      "Mixed Grain": { xp: 30, quantity: 3 },
    },
    9: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 20, quantity: 3 },
      NutriBarley: { xp: 60, quantity: 3 },
      "Mixed Grain": { xp: 30, quantity: 3 },
    },
    10: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 20, quantity: 3 },
      NutriBarley: { xp: 30, quantity: 3 },
      "Mixed Grain": { xp: 60, quantity: 3 },
    },
    11: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 20, quantity: 3 },
      NutriBarley: { xp: 30, quantity: 3 },
      "Mixed Grain": { xp: 60, quantity: 3 },
    },
    12: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 20, quantity: 3 },
      NutriBarley: { xp: 30, quantity: 3 },
      "Mixed Grain": { xp: 60, quantity: 3 },
    },
    13: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 20, quantity: 3 },
      NutriBarley: { xp: 30, quantity: 3 },
      "Mixed Grain": { xp: 60, quantity: 3 },
    },
    14: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 20, quantity: 3 },
      NutriBarley: { xp: 30, quantity: 3 },
      "Mixed Grain": { xp: 60, quantity: 3 },
    },
    15: {
      "Kernel Blend": { xp: 10, quantity: 3 },
      Hay: { xp: 20, quantity: 3 },
      NutriBarley: { xp: 30, quantity: 3 },
      "Mixed Grain": { xp: 60, quantity: 3 },
    },
  },
};

export const ANIMAL_RESOURCE_DROP: Record<
  AnimalType,
  Record<AnimalLevel, Inventory>
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
