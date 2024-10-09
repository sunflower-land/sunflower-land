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
