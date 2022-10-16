import { BuildingName } from "./buildings";
import { Cake } from "./craftables";
import { Inventory } from "./game";

export type ConsumableName =
  | "Boiled Egg"
  | "Mashed Potato"
  | "Bumpkin Broth"
  | "Roasted Cauliflower"
  | "Bumpkin Salad"
  | "Goblin's Treat"
  | "Pumpkin Soup"
  | Cake;

export type Consumable = {
  experience: number;
  name: ConsumableName;
  description: string;
  stamina: number;
  ingredients: Inventory;
  cookingSeconds: number;
  building: BuildingName;
  // SFL sell rate
  marketRate: number;
};
