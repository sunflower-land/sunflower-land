import Decimal from "decimal.js-light";
import { ConsumableName, CookableName } from "./consumables";
import { Animal, Food, ToolName } from "./craftables";
import { CropName, GreenHouseCropName, GreenHouseCropSeedName } from "./crops";
import {
  AnimalFoodName,
  AnimalMedicineName,
  AnimalResource,
  Bumpkin,
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
import { RecipeCollectibleName } from "../lib/crafting";
import { BumpkinItem } from "./bumpkin";

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

export type BumpkinActivityName =
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
  | "Farms Cheered"
  | "Farms Helped"
  | `${MonumentName} Completed`;

export function trackActivity(
  activityName: BumpkinActivityName,
  bumpkinActivity: Bumpkin["activity"],
  activityAmount = new Decimal(1),
): Bumpkin["activity"] {
  const previous = bumpkinActivity || {};
  const oldAmount = previous[activityName] || 0;

  return {
    ...previous,
    // TODO - support Decimals
    [activityName]: activityAmount.add(oldAmount).toNumber(),
  };
}
