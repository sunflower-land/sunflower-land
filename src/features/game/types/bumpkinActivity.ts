import Decimal from "decimal.js-light";
import { ConsumableName, CookableName } from "../types/consumables";
import { Animal, Food, ToolName } from "../types/craftables";
import { CropName } from "../types/crops";
import { Bumpkin, LanternName } from "../types/game";
import { BeanName, ExoticCropName } from "./beans";
import { HeliosBlacksmithItem, PotionHouseItemName } from "./collectibles";
import { DecorationName } from "./decorations";
import { FruitName, FruitSeedName } from "./fruits";
import { GarbageName } from "./garbage";
import { SeedName } from "./seeds";
import { TreasureToolName, WorkbenchToolName } from "./tools";
import { BeachBountyTreasure, TreasureName } from "./treasure";
import { CompostName, ComposterName } from "./composters";
import { PurchaseableBait } from "./fishing";

type BuyableName = SeedName | Animal | DecorationName | BeanName;
type SellableName =
  | CropName
  | Food
  | FruitName
  | BeachBountyTreasure
  | FruitName
  | GarbageName
  | ExoticCropName;

type Recipes = Food | CookableName;
type Edibles = Food | ConsumableName;

export type HarvestEvent = `${CropName | FruitName} Harvested`;
export type PlantEvent = `${CropName | FruitName} Planted`;
export type FruitPlantEvent = `${FruitSeedName} Planted`;
export type CookEvent = `${Recipes} Cooked`;
export type FedEvent = `${Edibles} Fed`;
export type BuyEvent = `${BuyableName} Bought`;
export type CraftedEvent = `${
  | ToolName
  | WorkbenchToolName
  | TreasureToolName
  | HeliosBlacksmithItem
  | PotionHouseItemName
  | LanternName
  | PurchaseableBait} Crafted`;
export type ConsumableEvent = `${ConsumableName} Collected`;
export type SellEvent = `${SellableName} Sold`;
export type TreasureEvent = `${TreasureName} Dug`;
export type ComposterCollectEvent = `${CompostName} Collected`;
export type CompostedEvent = `${ComposterName} Collected`;

export type BumpkinActivityName =
  | CookEvent
  | FedEvent
  | BuyEvent
  | CraftedEvent
  | ConsumableEvent
  | SellEvent
  | HarvestEvent
  | PlantEvent
  | FruitPlantEvent
  | TreasureEvent
  | CompostedEvent
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
  | "Building Removed"
  | "Collectible Placed"
  | "Collectible Removed"
  | "Building Upgraded"
  | "Crop Fertilised"
  | "Crop Removed"
  | "Treasure Dug"
  | "Treasure Searched"
  | "Treasure Drilled"
  | "Love Letter Collected"
  | "Easter Egg Collected"
  | "Chore Completed"
  | "Chore Skipped"
  | "Bud Placed"
  | ComposterCollectEvent
  | "Kraken Tentacle Traded"
  | "Crop Fertilised"
  | "5x Block Buck Crafted"
  | "100x Block Buck Crafted"
  | "Fishing Pack Crafted"
  | "Tool Pack Crafted";

export function trackActivity(
  activityName: BumpkinActivityName,
  bumpkinActivity: Bumpkin["activity"],
  activityAmount = new Decimal(1)
): Bumpkin["activity"] {
  const previous = bumpkinActivity || {};
  const oldAmount = previous[activityName] || 0;

  return {
    ...previous,
    // TODO - support Decimals
    [activityName]: activityAmount.add(oldAmount).toNumber(),
  };
}
