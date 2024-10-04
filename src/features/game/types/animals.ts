import { BuildingName } from "./buildings";

export type AnimalType = "Chicken" | "Cow" | "Sheep";
export const ANIMAL_BUILDINGS: BuildingName[] = ["Hen House", "Barn"] as const;

type AnimalDetail = {
  coins: number;
  levelRequired: number;
  buildingRequired: BuildingName;
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
    height: 1,
    width: 1,
  },
  Sheep: {
    coins: 120,
    levelRequired: 18,
    buildingRequired: "Barn",
    height: 1,
    width: 1,
  },
};
