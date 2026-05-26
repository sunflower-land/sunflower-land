import type { GameState, InventoryItemName, RecipeCraftableName } from "./game";
import type { DollName, RecipeCollectibleName } from "../lib/crafting";
import type {
  ResourceName,
  RockName,
  TreeName,
  UpgradedResourceName,
} from "./resources";
import type { FishName, MarineMarvelName } from "./fishing";
import type { FullMoonFruit } from "./fruits";
import type { LandBiomeName } from "features/island/biomes/biomes";
import type { PetResourceName } from "./pets";
import Decimal from "decimal.js-light";
import type { ConsumableName, CookableName } from "./consumables";
import type { Animal, Food, ToolName } from "./craftables";
import type {
  CropName,
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "./crops";
import type {
  AnimalFoodName,
  AnimalMedicineName,
  AnimalResource,
  Keys,
  LanternName,
  MegaStoreItemName,
} from "./game";
import type { BeanName, ExoticCropName } from "./beans";
import type {
  HeliosBlacksmithItem,
  PotionHouseItemName,
  TreasureCollectibleItem,
} from "./collectibles";
import type {
  GreenHouseFruitName,
  GreenHouseFruitSeedName,
  PatchFruitName,
  PatchFruitSeedName,
} from "./fruits";
import type { GarbageName } from "./garbage";
import type { SeedName } from "./seeds";
import type { TreasureToolName, WorkbenchToolName } from "./tools";
import type { BeachBountyTreasure, TreasureName } from "./treasure";
import type { CompostName, ComposterName, Worm } from "./composters";
import type { PurchaseableBait } from "./fishing";
import type { FlowerName, FlowerSeedName } from "./flowers";
import type { FactionShopItemName } from "./factionShop";
import type { ShopDecorationName, ChapterDecorationName } from "./decorations";
import type { AnimalType } from "./animals";
import type { ChapterTierItemName } from "./megastore";
import type { WeatherShopItem } from "./calendar";
import type { PetShopItemName } from "./petShop";
import type { MonumentName } from "./monuments";
import type { BumpkinItem } from "./bumpkin";
import type {
  CrustaceanChum,
  CrustaceanName,
  WaterTrapName,
} from "./crustaceans";
import type { ProcessedResource } from "./processedFood";
import type { ChapterName, ChapterTicket } from "./chapters";
import type { TrackName } from "./tracks";
import type { BonusName } from "./bonuses";
import type { FermentationCollectedActivity } from "./fermentation";
import type { SpiceRackCollectedActivity } from "./spiceRack";
import type { AgedFishName, PrimeAgedFishName } from "./fishing";

export type AgingCollectedActivity =
  | `${AgedFishName} Collected`
  | `${PrimeAgedFishName} Collected`;

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
  | "Mark"
  | CrustaceanName} Bountied`;

export type ResourceBought = `${ResourceName} Bought`;
export type BiomeBought = `${LandBiomeName} Bought`;
export type ResourceNodeUpgradeEvent = `${UpgradedResourceName} Upgrade`;

type BuyableName =
  | SeedName
  // This Animal type will become legacy once Animals are released
  | Animal
  | AnimalType
  | ShopDecorationName
  | ChapterDecorationName
  | BeanName
  | MegaStoreItemName
  | GreenHouseFruitSeedName
  | GreenHouseCropSeedName
  | FactionShopItemName
  | ChapterTierItemName;

type SellableName =
  | CropName
  | Food
  | PatchFruitName
  | BeachBountyTreasure
  | GarbageName
  | ExoticCropName
  | "Love Charm";

type Recipes = Food | CookableName;
type ProcessedEvent = `${ProcessedResource} Processed`;
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
export type CraftingStartedEvent = `${
  | RecipeCollectibleName
  | BumpkinItem} Crafting Started`;
export type ConsumableEvent = `${ConsumableName} Collected`;
export type SellEvent = `${SellableName} Sold`;
export type TreasureEvent = `${TreasureName} Dug`;
export type ComposterCollectEvent = `${CompostName} Collected`;
export type CompostedEvent = `${ComposterName} Collected`;
export type WormCollectedEvent = `${Worm} Collected`;
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
  | CraftingStartedEvent
  | ResourceBought
  | BiomeBought
  | "Obsidian Exchanged"
  | "FLOWER Exchanged"
  | "Gems Purchased"
  | "Starter Pack Purchased"
  | ResourceNodeUpgradeEvent
  | `${PetResourceName} Fetched`
  | PlantGreenHouseFruitEvent
  | PlantGreenHouseCropEvent
  | CookEvent
  | ProcessedEvent
  | FermentationCollectedActivity
  | AgingCollectedActivity
  | SpiceRackCollectedActivity
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
  | `${TreeName} Chopped`
  | `${RockName} Mined`
  | "Basic Tree Chopped"
  | "Stone Mined"
  | "Iron Mined"
  | "Gold Mined"
  | "Crimstone Mined"
  | "Sunstone Mined"
  | "Egg Collected"
  | "Oil Drilled"
  | "Obsidian Collected"
  | "Potion Mixed"
  | "Salt Harvested"

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
  | WormCollectedEvent
  | "Crop Fertilised"
  | "Rod Casted"
  | "Farm Cheered"
  | "Farm Helped"
  | `${MonumentName} Completed`
  | "Daily Reward Collected"
  | "VIP Coins Saved"
  | "VIP FLOWER Saved"
  | "VIP Ticket Earned"
  | "VIP Gift Claimed"
  | "Recipe Queued"
  | "VIP XP Earned"
  | "Fish Missed"
  | "Fish Retried"
  | `${WaterTrapName} Collected`
  | `${WaterTrapName} Placed`
  | `${MarineMarvelName} Map Piece Found`
  | "Map Missed"
  | `${ChapterTicket} Collected`
  | `${ChapterName} Points Earned`
  | `${ChapterName} ${TrackName} Milestone Claimed`
  | `${BonusName} Bonus Claimed`
  | `${CrustaceanName} Caught with ${CrustaceanChum}`
  | "Crafting Queue Cancelled"
  | "Instant Gems Spent"
  | "Instant Coins Spent";

export function trackFarmActivity(
  activityName: FarmActivityName,
  farmAnalytics: GameState["farmActivity"],
  amount = new Decimal(1),
): GameState["farmActivity"] {
  const previous = { ...farmAnalytics };
  const activityAmount = previous[activityName] ?? 0;

  previous[activityName] = Math.max(0, amount.add(activityAmount).toNumber());
  return previous;
}
