import { GameState, InventoryItemName } from "./game";
import { FlowerName } from "./flowers";
import { AnimalType } from "./animals";
import { RecipeCollectibleName, RecipeWearableName } from "../lib/crafting";
import { ResourceName } from "./resources";

export type CaughtEvent = `${InventoryItemName} Caught`;
export type HarvestedEvent = `${FlowerName} Harvested`;
export type BountiedEvent = `${AnimalType | FlowerName | "Obsidian"} Bountied`;
export type CraftedEvent =
  `${RecipeCollectibleName | RecipeWearableName} Crafted`;

export type ResourceBought = `${ResourceName} Bought`;

export type FarmActivityName =
  | CaughtEvent
  | HarvestedEvent
  | BountiedEvent
  | CraftedEvent
  | ResourceBought
  | "Obsidian Exchanged"
  | "Obsession Completed";

export function trackFarmActivity(
  activityName: FarmActivityName,
  farmAnalytics: GameState["farmActivity"],
  amount = 1,
) {
  const previous = farmAnalytics || {};
  const activityAmount = previous[activityName] || 0;

  return {
    ...previous,
    [activityName]: (amount += activityAmount),
  };
}
