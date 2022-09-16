import Decimal from "decimal.js-light";
import { BuildingName } from "./buildings";
import { Inventory } from "./game";

export type ConsumableName = "Boiled Egg";

export type Consumable = {
  experience: number;
  name: ConsumableName;
  description: string;
  stamina: number;
  ingredients: Inventory;
  cookingSeconds: number;
  building: BuildingName;
};

export const CONSUMABLES: Record<ConsumableName, Consumable> = {
  "Boiled Egg": {
    name: "Boiled Egg",
    description: "Boiled Eggs are always a good breakfast choice",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Egg: new Decimal(1),
    },
  },
};
