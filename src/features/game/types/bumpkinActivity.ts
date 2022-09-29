import { ConsumableName } from "../types/consumables";
import { Animal, Food, Tool } from "../types/craftables";
import { CropName, SeedName } from "../types/crops";
import { Bumpkin } from "../types/game";

type BuyableName = SeedName | Animal;
type SellableName = CropName | Food;

type Recipes = Food | ConsumableName;

export type HarvestEvent = `${CropName} Harvested`;
export type CookEvent = `${Recipes} Cooked`;
export type FedEvent = `${Recipes} Fed`;
export type BuyEvent = `${BuyableName} Bought`;
export type CraftedEvent = `${Tool} Crafted`;
export type ConsumableEvent = `${ConsumableName} Collected`;
export type SellEvent = `${SellableName} Sold`;

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

export function trackActivity(
  activityName: BumpkinActivityName,
  bumpkinActivity: Bumpkin["activity"]
) {
  const previous = bumpkinActivity || {};
  const activityAmount = previous[activityName] || 0;

  return {
    ...previous,
    [activityName]: activityAmount + 1,
  };
}
