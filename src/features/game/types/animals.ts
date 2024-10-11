import { BuildingName } from "./buildings";

export type AnimalBuildingType = Extract<BuildingName, "Barn" | "Hen House">;

export type AnimalType = "Chicken" | "Cow" | "Sheep";

type AnimalDetail = {
  coins: number;
  levelRequired: number;
  buildingRequired: AnimalBuildingType;
  height: number;
  width: number;
};
export const ANIMALS: Record<AnimalType, AnimalDetail> = {
  Chicken: {
    coins: 50,
    levelRequired: 6,
    buildingRequired: "Hen House",
    height: 1,
    width: 1,
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

export type AnimalLevel = 1 | 2 | 3;

export const ANIMAL_LEVELS: Record<AnimalType, Record<AnimalLevel, number>> = {
  Chicken: {
    1: 0,
    2: 20,
    3: 50,
  },
  Cow: {
    1: 0,
    2: 20,
    3: 50,
  },
  Sheep: {
    1: 0,
    2: 20,
    3: 50,
  },
};
