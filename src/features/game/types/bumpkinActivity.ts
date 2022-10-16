import { ConsumableName } from "../types/consumables";
import { Animal, Food, Tool } from "../types/craftables";
import { CropName, SeedName } from "../types/crops";

type BuyableName = SeedName | Animal;
type SellableName = CropName | Food;

type Recipes = Food | ConsumableName;

type HarvestEvent = `${CropName} Harvested`;
type FedEvent = `${Recipes} Fed`;
export type CookEvent = `${Recipes} Cooked`;
type BuyEvent = `${BuyableName} Bought`;
export type CraftedEvent = `${Tool} Crafted`;
type ConsumableEvent = `${ConsumableName} Collected`;
type SellEvent = `${SellableName} Sold`;

export type BumpkinActivityName =
  | CookEvent
  | FedEvent
  | BuyEvent
  | CraftedEvent
  | ConsumableEvent
  | SellEvent
  | HarvestEvent
  // Resources
  | "Tree Chopped"
  | "Stone Mined"
  | "Iron Mined"
  | "Gold Mined"
  | "Egg Collected"
  // Misc
  | "SFL Spent"
  | "SFL Earned"
  | "Mutant Chicken Found"
  | "Building Constructed"
  | "Building Placed"
  | "Collectible Placed"
  | "Building Upgraded"
  | "Crop Fertilised"
  | "Crop Removed";
