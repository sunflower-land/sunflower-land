import { GameState, InventoryItemName, RecipeCraftableName } from "./game";
import { DollName, RecipeCollectibleName } from "../lib/crafting";
import { ResourceName, UpgradedResourceName } from "./resources";
import { FishName } from "./fishing";
import { FullMoonFruit } from "./fruits";
import { LandBiomeName } from "features/island/biomes/biomes";
import { PetResourceName } from "./pets";
import Decimal from "decimal.js-light";
import { ConsumableName, CookableName } from "./consumables";
import { Animal, Food, ToolName } from "./craftables";
import { CropName, GreenHouseCropName, GreenHouseCropSeedName } from "./crops";
import {
  AnimalFoodName,
  AnimalMedicineName,
  AnimalResource,
  Keys,
  LanternName,
  MegaStoreItemName,
} from "./game";
import { BeanName, ExoticCropName } from "./beans";
import {
  HeliosBlacksmithItem,
  PotionHouseItemName,
  TreasureCollectibleItem,
} from "./collectibles";
import {
  GreenHouseFruitName,
  GreenHouseFruitSeedName,
  PatchFruitName,
  PatchFruitSeedName,
} from "./fruits";
import { GarbageName } from "./garbage";
import { SeedName } from "./seeds";
import { TreasureToolName, WorkbenchToolName } from "./tools";
import { BeachBountyTreasure, TreasureName } from "./treasure";
import { CompostName, ComposterName } from "./composters";
import { PurchaseableBait } from "./fishing";
import { FlowerName, FlowerSeedName } from "./flowers";
import { FactionShopItemName } from "./factionShop";
import { ShopDecorationName, SeasonalDecorationName } from "./decorations";
import { AnimalType } from "./animals";
import { SeasonalTierItemName } from "./megastore";
import { WeatherShopItem } from "./calendar";
import { PetShopItemName } from "./petShop";
import { MonumentName } from "./monuments";
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

export type ResourceBought = `${ResourceName} Bought`;
export type BiomeBought = `${LandBiomeName} Bought`;
export type ResourceNodeUpgradeEvent = `${UpgradedResourceName} Upgrade`;

type BuyableName =
  | SeedName
  // This Animal type will become legacy once Animals are released
  | Animal
  | AnimalType
  | ShopDecorationName
  | SeasonalDecorationName
  | BeanName
  | MegaStoreItemName
  | GreenHouseFruitSeedName
  | GreenHouseCropSeedName
  | FactionShopItemName
  | SeasonalTierItemName;

type SellableName =
  | CropName
  | Food
  | PatchFruitName
  | BeachBountyTreasure
  | GarbageName
  | ExoticCropName
  | "Love Charm";

type Recipes = Food | CookableName;
type Edibles = Food | ConsumableName;

export type HarvestEvent = `${
  | CropName
  | PatchFruitName
  | FlowerName
  | GreenHouseCropName
  | GreenHouseFruitName
  | "Honey"} Harvested`;
export type PlantEvent = `${CropName | PatchFruitName} Planted`;
export type FruitPlantEvent = `${PatchFruitSeedName} Planted`;
export type PlantFlowerEvent = `${FlowerSeedName} Planted`;
export type CookEvent = `${Recipes} Cooked`;
export type FedEvent = `${Edibles} Fed`;
export type BuyEvent = `${BuyableName} Bought`;
export type CraftedEvent = `${
  | ToolName
  | WorkbenchToolName
  | TreasureToolName
  | HeliosBlacksmithItem
  | TreasureCollectibleItem
  | PotionHouseItemName
  | LanternName
  | Keys
  | PurchaseableBait
  | WeatherShopItem
  | PetShopItemName
  | RecipeCollectibleName
  | BumpkinItem} Crafted`;
export type ConsumableEvent = `${ConsumableName} Collected`;
export type SellEvent = `${SellableName} Sold`;
export type TreasureEvent = `${TreasureName} Dug`;
export type ComposterCollectEvent = `${CompostName} Collected`;
export type CompostedEvent = `${ComposterName} Collected`;
export type PlantGreenHouseFruitEvent = `${GreenHouseFruitName} Planted`;
export type PlantGreenHouseCropEvent = `${GreenHouseCropName} Planted`;
export type AnimalFeedMixedEvent =
  `${AnimalFoodName | AnimalMedicineName} Mixed`;
export type AnimalFeedEvent = `${Animal} Fed`;
export type AnimalCuredEvent = `${Animal} Cured`;
export type AnimalResourceEvent = `${AnimalResource} Collected`;
export type OrderDeliveredEvent = `${
  | "Ticket Order"
  | "Coins Order"
  | "FLOWER Order"} Delivered`;

export type FarmActivityName =
  | CaughtEvent
  | HarvestedEvent
  | BountiedEvent
  | CraftedEvent
  | ResourceBought
  | BiomeBought
  | "Obsidian Exchanged"
  | "FLOWER Exchanged"
  | ResourceNodeUpgradeEvent
  | `${PetResourceName} Fetched`
  | PlantGreenHouseFruitEvent
  | PlantGreenHouseCropEvent
  | CookEvent
  | FedEvent
  | BuyEvent
  | CraftedEvent
  | ConsumableEvent
  | SellEvent
  | HarvestEvent
  | PlantEvent
  | FruitPlantEvent
  | PlantFlowerEvent
  | TreasureEvent
  | CompostedEvent
  | AnimalFeedMixedEvent
  | AnimalFeedEvent
  | AnimalCuredEvent
  | AnimalResourceEvent
  | OrderDeliveredEvent

  // Resources
  | "Tree Chopped"
  | "Stone Mined"
  | "Iron Mined"
  | "Gold Mined"
  | "Crimstone Mined"
  | "Sunstone Mined"
  | "Egg Collected"
  | "Oil Drilled"
  | "Obsidian Collected"
  | "Potion Mixed"

  // Misc
  | "Coins Spent"
  | "Coins Earned"
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
  | "Crop Fertilised"
  | "Rod Casted"
  | "Farm Cheered"
  | "Farm Helped"
  | `${MonumentName} Completed`;

export function trackFarmActivity(
  activityName: FarmActivityName,
  farmAnalytics: GameState["farmActivity"],
  amount = new Decimal(1),
) {
  const previous = farmAnalytics || {};
  const activityAmount = previous[activityName] || 0;

  return {
    ...previous,
    [activityName]: amount.add(activityAmount).toNumber(),
  };
}
