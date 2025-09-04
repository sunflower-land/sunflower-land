import { GameState, InventoryItemName, RecipeCraftableName } from "./game";
import { FlowerName } from "./flowers";
import { AnimalType } from "./animals";
import { DollName, RecipeCollectibleName } from "../lib/crafting";
import { ResourceName, UpgradedResourceName } from "./resources";
import { FishName } from "./fishing";
import { ExoticCropName } from "./beans";
import { BeachBountyTreasure } from "./treasure";
import { FullMoonFruit } from "./fruits";
import { LandBiomeName } from "features/island/biomes/biomes";
import { BumpkinItem } from "./bumpkin";

export type CaughtEvent = `${InventoryItemName} Caught`;
export type HarvestedEvent = `${FlowerName} Harvested`;
export type BountiedEvent = `${
  | AnimalType
  | FlowerName
  | "Obsidian"
  | FishName
  | ExoticCropName
  | BeachBountyTreasure
  | FullMoonFruit
  | RecipeCraftableName
  | DollName
  | "Mark"} Bountied`;
export type CraftedEvent = `${RecipeCollectibleName | BumpkinItem} Crafted`;

export type ResourceBought = `${ResourceName} Bought`;
export type BiomeBought = `${LandBiomeName} Bought`;
export type ResourceNodeUpgradeEvent = `${UpgradedResourceName} Upgrade`;

export type FarmActivityName =
  | CaughtEvent
  | HarvestedEvent
  | BountiedEvent
  | CraftedEvent
  | ResourceBought
  | BiomeBought
  | "Obsidian Exchanged"
  | "FLOWER Exchanged"
  | ResourceNodeUpgradeEvent;

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
