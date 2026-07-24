/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Decimal } from "decimal.js-light";

import type {
  CropName,
  CropSeedName,
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "./crops";

import type { CollectibleName, CraftableName, Food } from "./craftables";
import type {
  UpgradedResourceName,
  CommodityName,
  MushroomName,
  ResourceName,
  ResourceTier,
  TreeName,
} from "./resources";
import type { LegacyBadgeName } from "./skills";
import type { BuildingName } from "./buildings";
import type { GameEvent } from "../events";
import type { BumpkinItem, Equipped as BumpkinParts } from "./bumpkin";
import type { ConsumableName, CookableName } from "./consumables";
import type { ProcessedResource } from "./processedFood";
import type { BumpkinSkillName, BumpkinRevampSkillName } from "./bumpkinSkills";
import type { AchievementName } from "./achievements";
import type { DecorationName } from "./decorations";
import type {
  BeanName,
  ExoticCropName,
  GiantFruit,
  MutantCropName,
} from "./beans";
import type {
  FullMoonFruit,
  GreenHouseFruitName,
  GreenHouseFruitSeedName,
  PatchFruitName,
  PatchFruitSeedName,
} from "./fruits";
import type { BeachBountyTreasure, TreasureName } from "./treasure";
import type {
  GoblinBlacksmithItemName,
  GoblinPirateItemName,
  HeliosBlacksmithItem,
  MegaStoreCollectibleName,
  PlaceableLocation,
  PotionHouseItemName,
  PurchasableItems,
  SoldOutCollectibleName,
  TreasureCollectibleItem,
} from "./collectibles";
import type { TreasureToolName, WorkbenchToolName } from "./tools";
import type { ConversationName } from "./announcements";
import type { NPCName } from "lib/npcs";
import type {
  ChapterBanner,
  ChapterTicket,
  ChapterName,
  ChapterRaffleTicket,
} from "./chapters";
import type { Bud } from "./buds";
import type {
  CompostName,
  CropCompostName,
  FruitCompostName,
  GreenhouseCompostName,
  Worm,
} from "./composters";
import type { FarmActivityName } from "./farmActivity";
import type { MilestoneName } from "./milestones";
import type {
  AgedFishName,
  PrimeAgedFishName,
  FishName,
  FishingBait,
  MarineMarvelName,
  OldFishName,
} from "./fishing";
import type { MinigameName } from "./minigames";
import type {
  FlowerCrossBreedName,
  FlowerName,
  FlowerSeedName,
  MutantFlowerName,
} from "./flowers";
import type { FermentationProductName } from "./fermentationProducts";
import type { SpiceRackProductName } from "./spiceRackProducts";
import type { PickledCropName } from "./pickled";
import { translate } from "lib/i18n/translate";
import { capitalize } from "lib/utils/capitalize";
import type { SpecialEvents } from "./specialEvents";
import type { TradeableName } from "../actions/sellMarketResource";
import type { MinigameCurrency } from "../events/minigames/purchaseMinigameItem";
import type {
  FactionShopCollectibleName,
  FactionShopFoodName,
} from "./factionShop";
import type { DiggingFormationName } from "./desert";
import type {
  BudNFTName,
  CollectionName,
  MarketplaceTradeableName,
} from "./marketplace";
import type { GameTransaction } from "./transactions";
import type { LevelRequirement } from "features/game/lib/level";
import type { CompetitionName, CompetitionProgress } from "./competitions";
import type { AnimalType } from "./animals";
import type { ChoreBoard } from "./choreBoard";
import type { DollName, RecipeCollectibleName, Recipes } from "../lib/crafting";

import type { ChapterCollectibleName, ChapterTierItemName } from "./megastore";
import type { TradeFood } from "../events/landExpansion/redeemTradeReward";
import type {
  CalendarEvent,
  CalendarEventName,
  SeasonalEventName,
} from "./calendar";
import type { VipBundle } from "../lib/vipAccess";
import type { InGameTaskName } from "../events/landExpansion/completeSocialTask";
import type { TwitterPost, TwitterPostName } from "./social";
import type { NetworkName } from "../events/landExpansion/updateNetwork";
import type { RewardBoxes, RewardBoxName } from "./rewardBoxes";
import type {
  FloatingIslandShop,
  FloatingShopItemName,
} from "./floatingIsland";
import type { LandBiomeName } from "features/island/biomes/biomes";
import type { MonumentName } from "./monuments";
import type { AOEItemName } from "../expansion/placeable/lib/collisionDetection";
import type { Coordinates } from "../expansion/components/MapPlacement";
import type { ClutterName } from "./clutter";
import type { PetName, PetResourceName, Pets } from "./pets";
import type { RockName } from "./resources";
import type { PetShopItemName } from "./petShop";
import type { League } from "features/leagues/leagues";
import type { Buff, BuffName } from "./buffs";
import type {
  CrustaceanChum,
  CrustaceanName,
  WaterTrapName,
} from "./crustaceans";
import type { SaltFarm } from "./salt";
import type { AgingShed } from "../lib/agingShed";
import type { SculptureName } from "./saltSculpture";

export type CraftingQueueItem = {
  id: string;
  readyAt: number;
  startedAt: number;
} & (
  | {
      type: "collectible";
      name: RecipeCollectibleName;
    }
  | {
      type: "wearable";
      name: BumpkinItem;
    }
);

export type Reward = {
  coins?: number;
  sfl?: Decimal;
  items?: {
    name: InventoryItemName;
    amount: number;
  }[];
};

export type FertiliserName = "Rapid Growth";

export const FERTILISERS: Record<FertiliserName, { description: string }> = {
  "Rapid Growth": {
    description: translate("description.rapid.growth"),
  },
};

export type CropFertiliser = {
  name: CropCompostName;
  fertilisedAt: number;
};

export type FruitFertiliser = {
  name: FruitCompostName;
  fertilisedAt: number;
};

export type GreenhouseFertiliser = {
  name: GreenhouseCompostName;
  fertilisedAt: number;
};

export type FieldItem = {
  name: CropName;
  // Epoch time in milliseconds
  plantedAt: number;
  multiplier?: number;
  reward?: Omit<Reward, "sfl">;
  fertiliser?: CropFertiliser;
};

export type EasterEgg =
  | "Red Egg"
  | "Orange Egg"
  | "Green Egg"
  | "Blue Egg"
  | "Pink Egg"
  | "Purple Egg"
  | "Yellow Egg";

export const EASTER_EGG: Record<EasterEgg, { description: string }> = {
  "Red Egg": {
    description: translate("description.red.egg"),
  },
  "Orange Egg": {
    description: translate("description.orange.egg"),
  },
  "Green Egg": {
    description: translate("description.green.egg"),
  },
  "Blue Egg": {
    description: translate("description.blue.egg"),
  },
  "Pink Egg": {
    description: translate("description.pink.egg"),
  },
  "Purple Egg": {
    description: translate("description.purple.egg"),
  },
  "Yellow Egg": {
    description: translate("description.yellow.egg"),
  },
};

export const EASTER_EGGS: EasterEgg[] = [
  "Blue Egg",
  "Green Egg",
  "Orange Egg",
  "Pink Egg",
  "Purple Egg",
  "Red Egg",
  "Yellow Egg",
];

export type EasterEventItemName = "Easter Bunny" | "Pablo The Bunny";

export type MOMEventItem = "Engine Core";

export type FactionEmblem =
  | "Goblin Emblem"
  | "Bumpkin Emblem"
  | "Sunflorian Emblem"
  | "Nightshade Emblem";

export type MutantChicken =
  | "Speed Chicken"
  | "Rich Chicken"
  | "Fat Chicken"
  | "Ayam Cemani"
  | "El Pollo Veloz"
  | "Banana Chicken"
  | "Crim Peckster"
  | "Knight Chicken"
  | "Pharaoh Chicken"
  | "Alien Chicken"
  | "Summer Chicken"
  | "Love Chicken"
  | "Janitor Chicken"
  | "Sleepy Chicken"
  | "Squid Chicken"
  | "Flamingo Chicken"
  | "Ascended Chicken";

export type MutantCow =
  | "Mootant"
  | "Frozen Cow"
  | "Dr Cow"
  | "Baby Cow"
  | "Astronaut Cow"
  | "Mermaid Cow"
  | "Spa Cow"
  | "Ascended Cow";

export type MutantSheep =
  | "Toxic Tuft"
  | "Frozen Sheep"
  | "Nurse Sheep"
  | "Baby Sheep"
  | "Astronaut Sheep"
  | "Mermaid Sheep"
  | "Spa Sheep"
  | "Ascended Sheep";

export type MutantAnimal = MutantChicken | MutantCow | MutantSheep;

export const BB_TO_GEM_RATIO = 20;

export type Coupons =
  | "Gold Pass"
  | "Trading Ticket"
  | "War Bond"
  | "Jack-o-lantern"
  | "Golden Crop"
  | "Beta Pass"
  | "Red Envelope"
  | "Love Letter"
  | "Block Buck"
  | "Gem"
  | "Sunflower Supporter"
  | "Potion Ticket"
  | "Bud Ticket"
  | "Skill Reset Ticket"
  | "Bud Seedling"
  | "Community Coin"
  | "Arcade Token"
  | "Farmhand Coupon"
  | "Farmhand"
  | "Prize Ticket"
  | "Mark"
  | "Trade Point"
  | "Love Charm"
  | "Easter Token 2025"
  | "Easter Ticket 2025"
  | "Colors Token 2025"
  | "Colors Ticket 2025"
  | "Halloween Token 2025"
  | "Halloween Ticket 2025"
  | "Holiday Token 2025"
  | "Holiday Ticket 2025"
  | "April Fools Token 2026"
  | "April Fools Ticket 2026"
  | "Colors Token 2026"
  | "Colors Ticket 2026"
  | "Cheer"
  | "CluckCoin"
  | Keys
  | ChapterTicket
  | ChapterRaffleTicket
  | FactionEmblem;

export type Keys = "Treasure Key" | "Rare Key" | "Luxury Key";

export const COUPONS: Record<Coupons, { description: string }> = {
  Gem: {
    description: translate("description.gem"),
  },
  "Gold Pass": {
    description: translate("description.gold.pass"),
  },
  "Trading Ticket": {
    description: translate("description.trading.ticket"),
  },
  "War Bond": {
    description: translate("description.war.bond"),
  },
  "Jack-o-lantern": {
    description: translate("description.jack.o.lantern"),
  },
  "Golden Crop": {
    description: translate("description.golden.crop"),
  },
  "Beta Pass": {
    description: translate("description.beta.pass"),
  },
  "Red Envelope": {
    description: translate("description.red.envelope"),
  },
  "Love Letter": {
    description: translate("description.love.letter"),
  },
  "Block Buck": {
    description: translate("description.block.buck"),
  },
  "Solar Flare Ticket": {
    description: translate("description.solar.flare.ticket"),
  },
  "Dawn Breaker Ticket": {
    description: translate("description.dawn.breaker.ticket"),
  },
  "Crow Feather": {
    description: translate("description.crow.feather"),
  },
  "Sunflower Supporter": {
    description: translate("description.sunflower.supporter"),
  },
  "Potion Ticket": {
    description: translate("description.potion.ticket"),
  },
  "Bud Ticket": {
    description: translate("description.bud.ticket"),
  },
  "Skill Reset Ticket": {
    description: translate("description.skillResetTicket"),
  },
  "Bud Seedling": {
    description: translate("description.bud.seedling"),
  },
  "Mermaid Scale": {
    description: translate("description.mermaid.scale"),
  },
  "Community Coin": {
    description: translate("description.community.coin"),
  },
  "Arcade Token": {
    description: translate("description.arcade.coin"),
  },
  "Farmhand Coupon": {
    description: translate("description.farmhand.coupon"),
  },
  Farmhand: {
    description: translate("description.farmhand"),
  },
  "Tulip Bulb": {
    description: translate("description.tulip.bulb"),
  },
  "Treasure Key": {
    description: translate("description.treasure.key"),
  },
  "Luxury Key": {
    description: translate("description.luxury.key"),
  },
  "Rare Key": {
    description: translate("description.rare.key"),
  },
  "Prize Ticket": {
    description: translate("description.prizeTicket"),
  },
  Scroll: {
    description: translate("description.scroll"),
  },
  "Amber Fossil": {
    description: translate("description.amberFossil"),
  },
  "Goblin Emblem": {
    description: translate("description.goblin.emblem"),
  },
  "Bumpkin Emblem": {
    description: translate("description.bumpkin.emblem"),
  },
  "Sunflorian Emblem": {
    description: translate("description.sunflorian.emblem"),
  },
  "Nightshade Emblem": {
    description: translate("description.nightshade.emblem"),
  },
  Mark: {
    description: translate("description.faction.mark"),
  },
  Horseshoe: {
    description: translate("description.horseshoe"),
  },
  "Trade Point": {
    description: translate("description.trade.points"),
  },
  Timeshard: {
    description: "",
  },
  "Love Charm": {
    description: translate("description.love.charm"),
  },
  "Easter Token 2025": {
    description: "",
  },
  "Easter Ticket 2025": {
    description: "",
  },
  Geniseed: {
    description: translate("description.geniseed"),
  },
  "Colors Token 2025": {
    description: translate("description.colorToken2025"),
  },
  "Colors Ticket 2025": {
    description: translate("description.colorTicket2025"),
  },
  Bracelet: { description: "" },
  Cheer: { description: translate("description.cheer") },
  CluckCoin: { description: translate("description.cluck.coin") },
  "Pet Cookie": { description: translate("description.petCookie") },
  Floater: { description: "Collected during the Crabs and Traps." },
  "Paw Prints Raffle Ticket": {
    description: translate("description.pawPrintsRaffleTicket"),
  },
  "Crabs and Traps Raffle Ticket": {
    description: translate("description.crabsAndTrapsRaffleTicket"),
  },
  "Halloween Token 2025": {
    description: translate("description.halloweenToken2025"),
  },
  "Halloween Ticket 2025": {
    description: translate("description.halloweenTicket2025"),
  },
  "Holiday Token 2025": {
    description: translate("description.holidayToken2025"),
  },
  "Holiday Ticket 2025": {
    description: translate("description.holidayTicket2025"),
  },
  "April Fools Token 2026": {
    description: translate("description.aprilFoolsToken2026"),
  },
  "April Fools Ticket 2026": {
    description: translate("description.aprilFoolsTicket2026"),
  },
  "Salt Rock": { description: "Collected during the Salt Awakening." },
  "Salt Awakening Raffle Ticket": {
    description: "A raffle ticket for the Salt Awakening chapter.",
  },
  "Shiny Feather": { description: translate("description.shinyFeather") },
  "Ascension Age Raffle Ticket": {
    description: translate("description.ascensionAgeRaffleTicket"),
  },
  "Colors Token 2026": {
    description: translate("description.colorsToken2026"),
  },
  "Colors Ticket 2026": {
    description: translate("description.colorsTicket2026"),
  },
};

export type Purchase = {
  id: string;
  usd: number;
  purchasedAt: number;
  method: "MATIC" | "XSOLLA";
};

export type Points = "Human War Point" | "Goblin War Point";

export type WarBanner = "Human War Banner" | "Goblin War Banner";

export type FactionBanner =
  | "Sunflorian Faction Banner"
  | "Bumpkin Faction Banner"
  | "Goblin Faction Banner"
  | "Nightshade Faction Banner";

export type GoldenCropEventItem = "Golden Crop";

export type Skills = Partial<
  Record<BumpkinSkillName, number> & Record<BumpkinRevampSkillName, number>
>;

export type Bumpkin = {
  id: number;
  equipped: BumpkinParts;
  tokenUri: string;
  experience: number;
  skills: Skills;
  achievements?: Partial<Record<AchievementName, number>>;
  activity?: Partial<Record<FarmActivityName, number>>;
  previousFreeSkillResetAt?: number;
  previousPowerUseAt?: Partial<Record<BumpkinRevampSkillName, number>>;
  paidSkillResets?: number;
  coordinates?: Coordinates;
  location?: Exclude<PlaceableLocation, "petHouse">;
  flipped?: boolean;
};

export type SpecialEvent = "Chef Apron" | "Chef Hat";
export type WarItems =
  | "Sunflower Amulet"
  | "Carrot Amulet"
  | "Beetroot Amulet"
  | "Green Amulet"
  | "Warrior Helmet"
  | "Warrior Pants";

export type LoveAnimalItem = "Petting Hand" | "Brush" | "Music Box";

type Bounty = {
  id: string;
  name: InventoryItemName;
  coins?: number;
  items?: Partial<Record<InventoryItemName, number>>;
};

type AnimalCoinBounty = Bounty & {
  name: AnimalType;
  level: number;
  coins: number;
};

type AnimalTicketBounty = Bounty & {
  name: AnimalType;
  level: number;
  items: Partial<Record<ChapterTicket, number>>;
};

type AnimalGemBounty = Bounty & {
  name: AnimalType;
  level: number;
  items: { Gem: number };
};

export type AnimalBounty =
  | AnimalCoinBounty
  | AnimalTicketBounty
  | AnimalGemBounty;

export type FlowerBounty = Bounty & {
  name: FlowerName;
};

export type ObsidianBounty = Bounty & {
  name: "Obsidian";
  sfl?: number;
};

export type FishBounty = Bounty & {
  name: FishName;
};

export type CrustaceanBounty = Bounty & {
  name: CrustaceanName;
};

export type DollBounty = Bounty & {
  name: DollName;
};

export type GiantFruitBounty = Bounty & {
  name: GiantFruit;
};

export type ExoticBounty = Bounty & {
  name:
    | ExoticCropName
    | BeachBountyTreasure
    | FullMoonFruit
    | RecipeCraftableName;
};

export type MarkBounty = Bounty & {
  name: "Mark";
  quantity: number;
};

export type BountyRequest =
  | AnimalBounty
  | FlowerBounty
  | ObsidianBounty
  | FishBounty
  | ExoticBounty
  | MarkBounty
  | DollBounty
  | GiantFruitBounty
  | CrustaceanBounty;

export type Bounties = {
  requests: BountyRequest[];
  completed: { id: string; soldAt: number }[];
  bonusClaimedAt?: number;
};

export type InventoryItemName =
  | AnimalResource
  | CropName
  | CropSeedName
  | BeanName
  | MutantCropName
  | PatchFruitName
  | PatchFruitSeedName
  | FlowerSeedName
  | GreenHouseFruitSeedName
  | GreenHouseFruitName
  | GreenHouseCropName
  | GreenHouseCropSeedName
  | CraftableName
  | CommodityName
  | ResourceName
  | UpgradedResourceName
  | LegacyBadgeName
  | EasterEgg
  | EasterEventItemName
  | Food
  | MOMEventItem
  | MutantAnimal
  | Coupons
  | Points
  | WarItems
  | SpecialEvent
  | BuildingName
  | FertiliserName
  | WarBanner
  | ConsumableName
  | ProcessedResource
  | DecorationName
  | GoldenCropEventItem
  | TreasureName
  | HeliosBlacksmithItem
  | SoldOutCollectibleName
  | GoblinBlacksmithItemName
  | GoblinPirateItemName
  | PurchasableItems
  | TreasureToolName
  | TreasureCollectibleItem
  | LanternName
  | ExoticCropName
  | PotionHouseItemName
  | "Basic Land"
  | FishingBait
  | CompostName
  | FishName
  | AgedFishName
  | PrimeAgedFishName
  | MarineMarvelName
  | OldFishName
  | FlowerName
  | MegaStoreCollectibleName
  | FactionBanner
  | WorkbenchToolName
  | FactionShopCollectibleName
  | FactionShopFoodName
  | MutantFlowerName
  | AnimalFoodName
  | AnimalMedicineName
  | LoveAnimalItem
  | BedName
  | RecipeCraftableName
  | ChapterCollectibleName
  | TradeFood
  | ChapterBanner
  | "Creator Banner"
  | RewardBoxName
  | LandBiomeName
  | MonumentName
  | DollName
  | ClutterName
  | PetName
  | PetResourceName
  | PetShopItemName
  | CrustaceanName
  | ChapterRaffleTicket
  | PickledCropName
  | FermentationProductName
  | SpiceRackProductName;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export type Wardrobe = Partial<Record<BumpkinItem, number>>;

export type Fields = Record<number, FieldItem>;

export type Chicken = {
  fedAt?: number;
  multiplier: number;
  reward?: Reward;
  coordinates?: { x: number; y: number };
};

export type StockExpiry = Partial<Record<InventoryItemName, string>>;

type PastAction = GameEvent & {
  createdAt: Date;
};

export type WarCollectionOffer = {
  warBonds: number;
  startAt: string;
  endAt: string;
  ingredients: {
    name: InventoryItemName;
    amount: number;
  }[];
};

export type Wood = {
  choppedAt: number;
  seed?: number;
  reward?: Omit<Reward, "sfl">;
  criticalHit?: CriticalHit;
  amount?: number;
  /**
   * Unboosted-by-windowed-collectibles recovery duration (ms), with all
   * permanent (discount-at-start) boosts already folded in. Present only on
   * trees chopped under the speed-rate model; its presence selects
   * `computeReadyAt` over the legacy back-dated `choppedAt` readiness check.
   */
  baseDurationMs?: number;
};

export type CriticalHitName =
  | InventoryItemName
  | BumpkinRevampSkillName
  | BumpkinItem
  | "Native";

export type CriticalHit = Partial<Record<CriticalHitName, number>>;

export type PlantedCrop = {
  id?: string;
  name: CropName;
  plantedAt: number;
  criticalHit?: CriticalHit;
  reward?: Omit<Reward, "sfl">;
  amount?: number;
  boostedTime?: number;
  /**
   * Unboosted-by-windowed-collectibles grow duration (ms), with all other
   * (discount-at-start) boosts already folded in. Present only on crops planted
   * under the speed-rate model; its presence selects `computeReadyAt` over the
   * legacy back-dated `plantedAt`/`boostedTime` readiness check.
   */
  baseDurationMs?: number;
};

export type PlantedFruit = {
  name: PatchFruitName;
  plantedAt: number;
  harvestsLeft: number;
  harvestedAt: number;
  criticalHit?: CriticalHit;
  amount?: number;
  /**
   * Work (ms) banked when the patch was lifted mid-grow/replenish (windowed
   * fruit freeze accrued WORK, not wall-clock progress, while the patch sits in
   * inventory). Display-only: the patch UI folds it into the progress bar;
   * readiness ignores it — the banked work is already subtracted from
   * `baseDurationMs`. Reset when a new phase begins (harvest → replenish).
   */
  boostedTime?: number;
  /**
   * Unboosted-by-windowed-collectibles grow/replenish duration (ms), with all
   * permanent (discount-at-start) boosts already folded in. Present only on
   * fruit planted/harvested under the speed-rate model; its presence — NOT the
   * `SPEED_BOOSTS` flag — selects `computeReadyAt` (over the legacy back-dated
   * `plantedAt`/`harvestedAt` readiness check), so a fruit planted while the flag
   * was on keeps windowed timing on rollback and retains its baked permanent
   * boosts. Applies to whichever phase is active (`harvestedAt || plantedAt`).
   */
  baseDurationMs?: number;
};

type OptionalCoordinates = {
  x?: number;
  y?: number;
  /**
   * Sub-tile pixel offset for rendering only, expressed as integer source
   * pixels (range -8..8). One unit = one source pixel = PIXEL_SCALE screen
   * pixels. Set by the pixel-perfect placement feature. Collision/AOE/
   * adjacency logic ignores these and reads the integer x/y above.
   */
  oX?: number;
  oY?: number;
};

export type Tree = {
  wood: Wood;
  createdAt?: number;
  removedAt?: number;
  tier?: ResourceTier;
  name?: TreeName;
  multiplier?: number;
} & OptionalCoordinates;

export type Stone = {
  minedAt: number;
  criticalHit?: CriticalHit;
  amount?: number;
  boostedTime?: number;
  /**
   * Unboosted-by-windowed-collectibles recovery duration (ms), with all
   * permanent (discount-at-start) boosts already folded in. Present only on
   * rocks mined under the speed-rate model; its presence selects
   * `computeReadyAt` over the legacy back-dated `minedAt` readiness check.
   */
  baseDurationMs?: number;
};

export type FiniteResource = {
  minesLeft: number;
} & Rock;

export type Rock = {
  stone: Stone;
  createdAt?: number;
  removedAt?: number;
  tier?: ResourceTier;
  name?: RockName;
  multiplier?: number;
} & OptionalCoordinates;

export type Oil = {
  drilledAt: number;
  /**
   * Unboosted-by-windowed-collectibles recovery duration (ms), with all
   * permanent (discount-at-start) boosts already folded in. Present only on
   * reserves drilled under the speed-rate model; its presence selects
   * `computeReadyAt` over the legacy back-dated `drilledAt` readiness check.
   * Oil has no progress-fill bar (countdown only), so — like `Wood` — it
   * carries no `boostedTime`.
   *
   * Lifecycle: each drill rebuilds the timer, so a flag-off re-drill CLEARS this
   * and reverts the reserve to legacy — mirrors the stone/tree resource nodes
   * (`rock.stone` rebuild / `delete tree.wood.baseDurationMs`). The read path stays
   * windowed on the marker's presence until that next drill.
   */
  baseDurationMs?: number;
};

export type OilReserve = {
  oil: Oil;
  drilled: number;
  createdAt: number;
  removedAt?: number;
} & OptionalCoordinates;

export type CropPlot = {
  crop?: PlantedCrop;
  fertiliser?: CropFertiliser;
  amount?: number;
  createdAt: number;
  beeSwarm?: {
    count: number;
    swarmActivatedAt: number;
  };
  removedAt?: number;
} & OptionalCoordinates;

export type GreenhousePlant = {
  name: GreenHouseCropName | GreenHouseFruitName;
  plantedAt: number;
  criticalHit?: CriticalHit;
  amount?: number;
  /**
   * Work (ms) banked when the Greenhouse building was moved mid-grow (windowed
   * plants freeze accrued WORK, not wall-clock progress, while the building
   * sits in inventory). Display-only: the pot UI folds it into the progress
   * bar; readiness ignores it — the banked work is already subtracted from
   * `baseDurationMs`.
   */
  boostedTime?: number;
  /**
   * Unboosted-by-windowed-collectibles grow duration (ms), with all permanent
   * (discount-at-start) boosts already folded in. Present only on plants sown
   * under the speed-rate model; its presence — NOT the `SPEED_BOOSTS` flag —
   * selects `computeReadyAt` (over the legacy back-dated `plantedAt` readiness
   * check), so a plant sown while the flag was on keeps windowed timing on
   * rollback and retains its baked permanent boosts.
   */
  baseDurationMs?: number;
};

export type GreenhousePot = {
  plant?: GreenhousePlant;
  fertiliser?: GreenhouseFertiliser;
};

export type FruitPatch = {
  fruit?: PlantedFruit;
  createdAt: number;
  fertiliser?: FruitFertiliser;
  removedAt?: number;
} & OptionalCoordinates;

export type BuildingProduct = {
  name: CookableName | ProcessedResource;
  readyAt: number;
  /**
   * @deprecated Use per-item quantity fields instead.
   */
  amount?: number;
  boost?: Partial<Record<InventoryItemName, number>>;
  // The rank of a skill applied when the recipe was cooked, so per-rank effects
  // (e.g. Double Nom's +food) collect at the rank paid for. Legacy recipes store
  // `true` (treated as rank 1); new recipes store the numeric rank.
  skills?: Partial<Record<BumpkinRevampSkillName, boolean | number>>;
  timeRemaining?: number;
  startedAt?: number;
  requirements?: Inventory;
};

export type BuildingProduce = {
  items: Partial<Record<InventoryItemName, number>>;
  startedAt: number;
  readyAt: number;
};

export type Cancelled = Partial<{
  [key in InventoryItemName]: {
    cancelledAt: number;
  };
}>;

export type PlacedItem = {
  id: string;
  /**
   * Tile coordinates of the placed item. x/y are integer tiles.
   * oX/oY are optional integer source-pixel offsets (range -8..8) used for
   * rendering only — pixel-perfect placement. Collision/AOE/adjacency ignore
   * them and read the integer x/y.
   */
  coordinates?: { x: number; y: number; oX?: number; oY?: number };
  readyAt?: number;
  createdAt?: number;
  removedAt?: number;
  cancelled?: Cancelled;
  crafting?: BuildingProduct[];
  processing?: BuildingProduct[];
  oil?: number;
  flipped?: boolean;
  /**
   * Weather-protection collectible (e.g. Tornado Pinwheel) consumed by its
   * calendar event. Stays placed/owned but grants no protection until renewed.
   */
  used?: boolean;
};

export type ShakeItem = PlacedItem & { shakenAt?: number };
export type PlacedLamp = PlacedItem & { rubbedCount?: number };

// Support custom types for collectibles
type CustomCollectibles = {
  "Maneki Neko": ShakeItem[];
  "Festive Tree": ShakeItem[];
  "Genie Lamp": PlacedLamp[];
};

// Mapping to determine which type should be used for a placed collectible
type PlacedTypes<Name extends CollectibleName> = {
  [key in Name]: key extends keyof CustomCollectibles
    ? CustomCollectibles[key]
    : PlacedItem[];
};

export type Collectibles = Partial<PlacedTypes<CollectibleName>>;

export type CompostBuilding = PlacedItem & {
  producing?: BuildingProduce;
  requires?: Partial<Record<InventoryItemName, number>>;
  boost?: Partial<Record<InventoryItemName, number>>;
};

export type CropMachineQueueItem = {
  crop: CropName;
  seeds: number;
  growTimeRemaining: number;
  totalGrowTime: number;
  startTime?: number;
  growsUntil?: number;
  readyAt?: number;
  criticalHit?: CriticalHit;
  amount?: number;
  pausedTimeRemaining?: number;
};

export type CropMachineBuilding = PlacedItem & {
  queue?: CropMachineQueueItem[];
  unallocatedOilTime?: number;
};

type CustomBuildings = {
  "Compost Bin": CompostBuilding[];
  "Turbo Composter": CompostBuilding[];
  "Premium Composter": CompostBuilding[];
  "Crop Machine": CropMachineBuilding[];
};

type PlacedBuildings<Name extends BuildingName> = {
  [key in Name]: key extends keyof CustomBuildings
    ? CustomBuildings[key]
    : PlacedItem[];
};

export type Buildings = Partial<PlacedBuildings<BuildingName>>;

/**
 * A single restorable position within a {@link SavedLayout}. Mirrors the
 * coordinate shape used by placed items (integer tile x/y + optional render
 * offsets oX/oY).
 */
export type LayoutCoordinates = {
  x: number;
  y: number;
  oX?: number;
  oY?: number;
};

/**
 * A placed collectible/building reduced to what a layout restores: which item
 * (`id`), where (`coordinates`) and its orientation (`flipped`). Derived from
 * {@link PlacedItem} so it stays in step with the source shape, without the
 * per-item state (crafting, readyAt, oil, …) a layout doesn't need.
 */
export type LayoutPlacement = Pick<PlacedItem, "id" | "flipped"> & {
  coordinates: LayoutCoordinates;
};

/**
 * A restorable position for a placeable that can also be flipped (the player's
 * Bumpkin and FarmHands). Buds/Pet NFTs aren't flippable so they store bare
 * {@link LayoutCoordinates} instead.
 */
export type LayoutFlippablePlacement = LayoutCoordinates & {
  flipped?: boolean;
};

/**
 * A named snapshot of the player's farm arrangement (`location: "farm"`).
 * Items are keyed by `id` so applying a layout repositions the player's
 * existing items. Collectibles/buildings mirror the live `name -> PlacedItem[]`
 * buckets (capturing `flipped`); resources mirror the live `Record<id, {...}>`
 * buckets whose coordinates live as top-level x/y. See `saveLayout`/`applyLayout`.
 */
export type SavedLayout = {
  name: string;
  createdAt: number;
  updatedAt: number;
  /**
   * Marks the auto-managed "Ascension Layout" captured when the player first
   * ascends (volcano→swamp) and re-applied on later ascensions. It is protected:
   * the player cannot delete, rename, or overwrite it, and it does not count
   * against the manual `MAX_SAVED_LAYOUTS` limit.
   */
  auto?: boolean;
  collectibles: Partial<Record<CollectibleName, LayoutPlacement[]>>;
  buildings: Partial<Record<BuildingName, LayoutPlacement[]>>;
  resources: {
    trees: Record<string, LayoutCoordinates>;
    stones: Record<string, LayoutCoordinates>;
    gold: Record<string, LayoutCoordinates>;
    iron: Record<string, LayoutCoordinates>;
    crimstones: Record<string, LayoutCoordinates>;
    sunstones: Record<string, LayoutCoordinates>;
    ascensionCrystals: Record<string, LayoutCoordinates>;
    oilReserves: Record<string, LayoutCoordinates>;
    crops: Record<string, LayoutCoordinates>;
    fruitPatches: Record<string, LayoutCoordinates>;
    beehives: Record<string, LayoutCoordinates>;
    flowerBeds: Record<string, LayoutCoordinates>;
    lavaPits: Record<string, LayoutCoordinates>;
  };
  /** Placed Buds, keyed by bud id (not flippable). Farm-placed only. */
  buds?: Record<string, LayoutCoordinates>;
  /** Placed Pet NFTs, keyed by pet nft id (not flippable). Farm-placed only. */
  petNFTs?: Record<string, LayoutCoordinates>;
  /** Placed FarmHands (extra bumpkins), keyed by id. Farm-placed only. */
  farmHands?: Record<string, LayoutFlippablePlacement>;
  /** The player's own Bumpkin (single). Present only when placed on the farm. */
  bumpkin?: LayoutFlippablePlacement;
  /**
   * Land extent at save time, so a preview can size itself to the land and draw
   * the right biome art even after the farm later expands or ascends.
   */
  land?: {
    /** Land expansion count (`inventory["Basic Land"]`) — picks the image level. */
    expansions: number;
    /** Island/biome — resolves the land sprite via `getCurrentBiome`. */
    island: GameState["island"];
  };
};

/**
 * Maximum number of saved layouts a player can keep. The live farm is the
 * working arrangement, not a saved layout — these slots are separate from it.
 */
export const MAX_SAVED_LAYOUTS = 3;
/** Maximum character length of a saved layout name. */
export const MAX_LAYOUT_NAME_LENGTH = 30;

export type ExpansionConstruction = {
  createdAt: number;
  readyAt: number;
};

export interface ExpansionRequirements {
  resources: Partial<Record<InventoryItemName, number>>;
  coins?: number;
  seconds: number;
  bumpkinLevel: LevelRequirement;
}

export type Airdrop = {
  id: string;
  createdAt: number;
  items: Partial<Record<InventoryItemName, number>>;
  wearables: Partial<Record<BumpkinItem, number>>;
  sfl: number;
  coins: number;
  xp?: number;
  buff?: BuffName;
  message?: string;
  coordinates?: Coordinates;
  factionPoints?: number;
  vipDays?: number;
  recipes?: RecipeCollectibleName[];
};

// Mystery Prize reveals
export type Reveal = {
  revealedAt: number;
  id: string;
};

export type TreasureHole = {
  dugAt: number;
  discovered: InventoryItemName | null;
};

export type AuctionNFT = "Pet";

export type Bid = {
  auctionId: string;
  sfl: number;
  ingredients: Partial<Record<InventoryItemName, number>>;
  biddedAt: number;
  tickets: number;
} & (
  | {
      type: "collectible";
      collectible: InventoryItemName;
    }
  | {
      type: "wearable";
      wearable: BumpkinItem;
    }
  | {
      type: "nft";
      nft: AuctionNFT;
    }
);
export type Minted = Partial<
  Record<
    ChapterName,
    Record<InventoryItemName | BumpkinItem | AuctionNFT, number>
  >
>;

export type MazeAttempts = Partial<Record<SeasonWeek, MazeMetadata>>;

export type WitchesEve = {
  weeklyLostCrowCount: number;
  maze: MazeAttempts;
};

export type FlowerShop = {
  week: number;
  weeklyFlower: FlowerName;
  tradedFlowerShop?: boolean;
};

export type FarmHand = {
  equipped: BumpkinParts;
  coordinates?: Coordinates;
  location?: "farm" | "home" | "interior" | "level_one";
  flipped?: boolean;
};

export type Mushroom = {
  name: MushroomName;
  amount: number;
  x: number;
  y: number;
};

export type DugHole = {
  x: number;
  y: number;
  dugAt: number;
  items: Partial<Record<InventoryItemName, number>>;
  tool: "Sand Shovel" | "Sand Drill";
};

export type StreakReward = {
  count: number;
  collectedAt: number;
  totalClaimed: number;
};

export type Desert = {
  digging: {
    extraDigs?: number;
    patterns: DiggingFormationName[];
    completedPatterns?: DiggingFormationName[];
    grid: (DugHole | DugHole[])[];
    streak?: StreakReward;
  };
};

export type Mushrooms = {
  spawnedAt: number;
  mushrooms: Record<string, Mushroom>;
};

export type NPCDialogue = {
  id: string;
  from: "aunt" | "bumpkin" | "betty" | "bruce";
};

export type LanternName =
  | "Luminous Lantern"
  | "Radiance Lantern"
  | "Aurora Lantern"
  | "Ocean Lantern"
  | "Solar Lantern"
  | "Goblin Lantern"
  | "Betty Lantern"
  | "Bumpkin Lantern";

export type AnimalFoodName =
  | "Hay"
  | "Kernel Blend"
  | "NutriBarley"
  | "Mixed Grain"
  | "Omnifeed";

export type AnimalMedicineName = "Barn Delight";

export type BedName =
  | "Basic Bed"
  | "Fisher Bed"
  | "Floral Bed"
  | "Sturdy Bed"
  | "Desert Bed"
  | "Cow Bed"
  | "Pirate Bed"
  | "Royal Bed"
  | "Pearl Bed"
  | "Double Bed"
  | "Messy Bed"
  | "Salt Crystal Bed"
  | "Cloud Bed";

export type RecipeCraftableName =
  | "Cushion"
  | "Timber"
  | "Bee Box"
  | "Crimsteel"
  | "Merino Cushion"
  | "Kelp Fibre"
  | "Hardened Leather"
  | "Synthetic Fabric"
  | "Ocean's Treasure"
  | "Royal Bedding"
  | "Royal Ornament";

export type Party = {
  fulfilledAt?: number;
  fulfilledCount?: number;
  requirements?: Partial<Record<InventoryItemName, number>>;
};

export type Order = {
  id: string;
  from: NPCName;
  items: Partial<
    Record<InventoryItemName | BumpkinItem | "coins" | "sfl", number>
  >;
  reward: {
    sfl?: number;
    coins?: number;
    items?: Partial<Record<InventoryItemName, number>>;
  };
  createdAt: number;
  readyAt: number;
  completedAt?: number;
};

type QuestNPCName =
  | "pumpkin' pete"
  | "bert"
  | "raven"
  | "timmy"
  | "tywin"
  | "cornwell";

export type Quest = Order & {
  from: QuestNPCName;
};

export type Delivery = {
  orders: (Order | Quest)[];
  fulfilledCount: number;
  skippedCount?: number;
  skippedAt?: number;

  milestone: {
    goal: number;
    total: number;
    claimedAt?: number;
  };
};

export type DailyRewards = {
  streaks?: number;
  chest?: {
    collectedAt: number;
    code: number;
  };
};

export type PotionName =
  | "Bloom Boost"
  | "Happy Hooch"
  | "Earth Essence"
  | "Flower Power"
  | "Organic Oasis"
  | "Dream Drip"
  | "Silver Syrup";

export type PotionStatus =
  | "pending"
  | "incorrect"
  | "correct"
  | "almost"
  | "bomb";

export type PotionSlot = { potion: PotionName; status: PotionStatus };

export type Attempt = [PotionSlot, PotionSlot, PotionSlot, PotionSlot];

export type PotionHouse = {
  game: {
    status: "in_progress" | "finished";
    attempts: Attempt[];
    reward?: number;
    multiplier?: number;
  };
  history: {
    [score: number]: number;
  };
};

export type NPCS = Partial<Record<NPCName, NPCData>>;

export type NPCData = {
  deliveryCount: number;
  deliveryCompletedAt?: number;
  skippedCount?: number;
  questCompletedAt?: number;
  friendship?: {
    updatedAt: number;
    points: number;
    giftClaimedAtPoints?: number;
    giftedAt?: number;
  };
  streaks?: {
    streak: number;
    lastClaimedAt: number;
  };
};

export type ChoreV2 = {
  activity: FarmActivityName;
  description: string;
  createdAt: number;
  completedAt?: number;
  requirement: number;
  bumpkinId: number;
  startCount: number;
};

export type KingdomChores = {
  chores: KingdomChore[];
  choresCompleted: number;
  choresSkipped: number;
  skipAvailableAt?: number;
  resetsAt?: number;
};

export type KingdomChore = {
  activity: FarmActivityName;
  description: string;
  image: InventoryItemName;
  requirement: number;
  marks: number;
  completedAt?: number;
  skippedAt?: number;
} & (
  | { startedAt: number; startCount: number }
  | { startedAt?: never; startCount?: never }
);

export type SeasonWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type MazeAttempt = {
  startedAt: number;
  completedAt?: number;
  crowsFound: number;
  health: number;
  time: number;
  crowIds?: string[];
};

export type MazeMetadata = {
  sflFee: number;
  paidEntryFee: boolean;
  highestScore: number;
  claimedFeathers: number;
  attempts: MazeAttempt[];
};

export enum ChoreV2Name {
  EASY_1 = 1,
  EASY_2,
  MEDIUM_1,
  MEDIUM_2,
  HARD_1,
}

export type ChoresV2 = {
  chores: Record<ChoreV2Name, ChoreV2>;
  choresCompleted: number;
  choresSkipped: number;
};

export type CommunityIsland = {
  metadata: string;
  updatedAt: number;
  mints?: {
    items: Partial<Record<InventoryItemName, number>>;
    wearables: Wardrobe;
  };
  burns?: {
    sfl: number;
    items: Partial<Record<InventoryItemName, number>>;
  };
};

export type MinigamePrize = {
  startAt: number;
  endAt: number;
  score: number;
  coins: number;
  items: Partial<Record<InventoryItemName, number>>;
  wearables: Wardrobe;
};

export type MinigameHistory = {
  highscore: number;
  attempts: number;
  prizeClaimedAt?: number;
};

export type Minigame = {
  highscore: number;
  // SFL attempts purchased
  purchases?: {
    sfl: number;
    items?: Partial<Record<MinigameCurrency, number>>;
    purchasedAt: number;
  }[];

  // Minigame shop
  shop?: {
    wearables?: Wardrobe;
    items?: Partial<Record<InventoryItemName, number>>;
  };

  history: Record<string, MinigameHistory>;
};

export type TradeListing = {
  items: Partial<Record<MarketplaceTradeableName, number>>;
  sfl: number;
  tax?: number; // Defaults to 10% of the sfl
  createdAt: number;
  collection: CollectionName;
  economy?: string;
  boughtAt?: number;
  buyerId?: number;
  signature?: string;
  fulfilledAt?: number;
  fulfilledById?: number;
  initiatedAt?: number;
  tradeType: "instant" | "onchain";

  clearedAt?: number;
};

export type TradeOffer = {
  items: Partial<Record<MarketplaceTradeableName, number>>;
  sfl: number;
  tax?: number; // Defaults to 10% of the sfl
  collection: CollectionName;
  economy?: string;
  createdAt: number;
  fulfilledAt?: number;
  fulfilledById?: number;
  signature?: string;
  initiatedAt?: number;
  tradeType: "instant" | "onchain";

  clearedAt?: number;
};

type FishingSpot = {
  castedAt?: number;
  bait?: FishingBait;
  chum?: InventoryItemName;
  caught?: Partial<Record<InventoryItemName, number>>;
  /**
   * Per-fish breakdown of bonus units the Shrimp Onesie added during this
   * cast. Already included in `caught`; surfaced separately so the catch
   * UI can attribute the extra fish to the wearable.
   */
  shrimpOnesieBonus?: Partial<Record<InventoryItemName, number>>;
  guaranteedCatch?: FishName;
  maps?: Partial<Record<MarineMarvelName, number>>;
  /**
   * Number of reels used for this cast. When omitted, defaults to 1.
   */
  multiplier?: number;
};

type WaterTrapSpot = {
  waterTrap?: WaterTrap;
} & Coordinates;

export type WaterTrap = {
  type: WaterTrapName;
  placedAt: number;
  chum?: CrustaceanChum;
  readyAt: number;
  caught: Partial<Record<CrustaceanName, number>>;
};

export type CrabTrap = {
  trapSpots?: Record<string, WaterTrapSpot>;
};

export type Fishing = {
  wharf: FishingSpot;
  dailyAttempts?: {
    [date: string]: number;
  };
  extraReels?: ExtraReels;

  // TODO remove after 1st June
  beach?: FishingSpot;
  weather?: string;
};

export type ExtraReels = {
  timesBought?: {
    [date: string]: number;
  };
  count: number;
};

export type Christmas = {
  day: Record<
    number,
    {
      candy: number;
      collectedAt: number;
    }
  >;
};

export type Currency =
  | "SFL"
  | "Coins"
  | "Gem"
  | "Crimstone"
  | "Sunstone"
  | "Seasonal Ticket"
  | "Mark"
  | "Love Charm"
  | "Easter Token 2025"
  | "Colors Token 2025"
  | "Halloween Token 2025"
  | "Holiday Token 2025"
  | "April Fools Token 2026"
  | "Colors Token 2026";

export type ShopItemBase = {
  shortDescription: string;
  currency: Currency;
  price: Decimal;
  limit: number | null;
  type: "wearable" | "collectible" | "food" | "keys";
};

type AvailableAllSeason = {
  availableAllSeason: boolean;
};

export type WearablesItem = {
  name: BumpkinItem;
} & ShopItemBase &
  AvailableAllSeason;

export type CollectiblesItem = {
  name: InventoryItemName;
} & ShopItemBase &
  AvailableAllSeason;

export type MegaStoreItemName = BumpkinItem | InventoryItemName;

export type MegaStoreItem = WearablesItem | CollectiblesItem;

export type MegaStore = {
  available: {
    from: number;
    to: number;
  };
  wearables: WearablesItem[];
  collectibles: CollectiblesItem[];
};

export const ISLAND_TYPES = ["basic", "spring", "desert", "volcano"] as const;
export type BasicIslandType = (typeof ISLAND_TYPES)[number];

export const ASCENSION_ISLANDS = [
  "swamp",
  "spooky",
  "crystal",
  "galaxy",
  "marble",
] as const;
export type AscensionIslandType = (typeof ASCENSION_ISLANDS)[number];

export const ISLAND_EXPANSIONS = [
  ...ISLAND_TYPES,
  ...ASCENSION_ISLANDS,
] as const;

export type IslandType = (typeof ISLAND_EXPANSIONS)[number];

/**
 * Islands that are displayed under a custom name rather than `"{Type} Island"`.
 * Use {@link getIslandName} for any player-facing island label so these stay
 * consistent across the UI.
 */
export const ISLAND_DISPLAY_NAMES: Partial<Record<IslandType, string>> = {
  spring: "Petal Paradise",
  marble: "Marble Age",
};

/**
 * The player-facing display name for an island: its custom name if it has one,
 * otherwise the title-cased generic `"{Type} Island"`.
 */
export const getIslandName = (island: IslandType): string =>
  ISLAND_DISPLAY_NAMES[island] ?? `${capitalize(island)} Island`;

export type Home = {
  collectibles: Collectibles;
};

/**
 * Interior is an entirely separate placement surface from Home.
 * See `src/features/interior/` and `src/features/game/expansion/placeable/lib/interiorLayouts.ts`.
 *
 * Unlike Home, the interior uses a per-island tile mask (rooms have non-rectangular shapes)
 * and a bottom-left-anchored coordinate system starting at (0,0).
 *
 * Each interior is split into one or more LEVELS — for now there's just `ground`,
 * but future expansions (upstairs, basement, etc.) plug in alongside it without
 * changing the existing data.
 */
export type InteriorLevel = {
  collectibles: Collectibles;
};

/**
 * Post-volcano home expansion tiers. Players unlock these sequentially via
 * the `interior.upgrade` event. The list is intentionally one continuous
 * progression and is *not* level-specific in the type — when level_two
 * artwork ships we simply add its tier values here and the same `expansion`
 * field on `Interior` continues to track progress.
 *
 * Names mirror the asset filenames in `src/assets/buildings/level-one-*.webp`.
 */
export type HomeExpansionTier =
  | "level-one-start"
  | "level-one-2"
  | "level-one-3"
  | "level-one-4"
  | "level-one-5"
  | "level-one-6"
  | "level-one-full";

export type LevelOne = {
  collectibles: Collectibles;
};

export type InteriorLevelName = "ground" | "level_one";

export type Interior = {
  ground: InteriorLevel;
  /**
   * Present once the player has bought their first post-volcano upgrade.
   * Lives at the /level_one route. Independent placements from `ground`.
   */
  level_one?: LevelOne;
  /**
   * Tracks which home-expansion tier the player has unlocked. Lives on the
   * top-level Interior (not on a specific floor) so it can be shared across
   * future levels. Undefined = no expansion bought yet.
   */
  expansion?: HomeExpansionTier;
};

export type PlantedFlower = {
  name: FlowerName;
  plantedAt: number;
  crossbreed?: FlowerCrossBreedName;
  dirty?: boolean;
  reward?: Reward;
  criticalHit?: CriticalHit;
  amount?: number;
  /**
   * Work (ms) banked when the flower bed was lifted mid-grow (windowed flowers
   * freeze accrued WORK, not wall-clock progress, while the bed sits in
   * inventory). Display-only: the bed UI folds it into the progress bar;
   * readiness ignores it — the banked work is already subtracted from
   * `baseDurationMs`. Flowers are one-shot, so it never needs resetting.
   */
  boostedTime?: number;
  /**
   * Unboosted-by-windowed-collectibles grow duration (ms), with all permanent
   * (discount-at-start) boosts already folded in. Present only on flowers planted
   * under the speed-rate model; its presence — NOT the `SPEED_BOOSTS` flag —
   * selects `computeReadyAt` (over the legacy back-dated `plantedAt` readiness
   * check), so a flower planted while the flag was on keeps windowed timing on
   * rollback and retains its baked permanent boosts.
   */
  baseDurationMs?: number;
};

export type FlowerBed = {
  flower?: PlantedFlower;
  createdAt: number;
  removedAt?: number;
} & OptionalCoordinates;

export type FlowerBeds = Record<string, FlowerBed>;

export type AttachedFlower = {
  id: string;
  attachedAt: number;
  attachedUntil: number;
  rate?: number;
};

export type Beehive = {
  swarm: boolean;
  honey: {
    updatedAt: number;
    produced: number;
  };
  flowers: AttachedFlower[];
  removedAt?: number;
} & OptionalCoordinates;

export type Beehives = Record<string, Beehive>;

export type FactionName =
  | "sunflorians"
  | "bumpkins"
  | "goblins"
  | "nightshades";

export type ResourceRequest = {
  item: InventoryItemName;
  amount: number;
  dailyFulfilled: {
    [day: number]: number;
  };
};

export type FactionPetRequest = {
  food: InventoryItemName;
  quantity: number;
  dailyFulfilled: {
    [day: number]: number;
  };
};

export type FactionPet = {
  week: string;
  qualifiesForBoost?: boolean;
  requests: FactionPetRequest[];
};

type FactionKitchen = {
  week: string;
  requests: ResourceRequest[];
};

export type FactionPrize = {
  coins: number;
  sfl: number;
  items: Partial<Record<InventoryItemName, number>>;
};

export type CollectivePet = {
  totalXP: number;
  goalXP: number;
  goalReached: boolean;
  streak: number;
  sleeping: boolean;
};

export type FactionHistory = {
  score: number;
  petXP: number;
  results?: {
    rank: number;
    reward?: FactionPrize;
    claimedAt?: number;
  };

  collectivePet?: CollectivePet;
};

export type Faction = {
  name: FactionName;
  pledgedAt: number;
  emblemsClaimedAt?: number;
  points?: number;
  kitchen?: FactionKitchen;
  pet?: FactionPet;
  history: Record<string, FactionHistory>;
  boostCooldownUntil?: number;
};

export type DonationItemName =
  | CropName
  | FishName
  | PatchFruitName
  | CommodityName
  | Worm;

type KeysBoughtAt = Partial<Record<Keys, { boughtAt: number }>>;
type Stores = "factionShop" | "treasureShop" | "megastore";
export type KeysBought = Record<Stores, KeysBoughtAt>;

export type AnimalBuildingKey = "henHouse" | "barn";
export type UpgradableBuildingKey =
  | AnimalBuildingKey
  | "waterWell"
  | "petHouse";

export type AnimalResource =
  | "Egg"
  | "Leather"
  | "Wool"
  | "Merino Wool"
  | "Feather"
  | "Milk";
export type AnimalState = "idle" | "happy" | "sad" | "ready" | "sick";

export type AnimalFeedBuffName = "Salt Lick" | "Honey Treat";

export type AnimalFeedBuff = {
  name: AnimalFeedBuffName;
  harvestsRemaining: number;
};

export type Animal = {
  id: string;
  type: AnimalType;
  state: AnimalState;
  createdAt: number;
  experience: number;
  asleepAt: number;
  awakeAt: number;
  lovedAt: number;
  item: LoveAnimalItem;
  multiplier?: number;
  reward?: Reward;
  feedBuff?: AnimalFeedBuff;
};

export type AnimalBuilding = UpgradableBuilding & {
  animals: Record<string, Animal>;
};

export type UpgradableBuilding = {
  level: number;
  upgradeReadyAt?: number;
  upgradedAt?: number;
};

export type PetHouseBuilding = UpgradableBuilding & {
  pets: Partial<PlacedTypes<PetName>>;
};

export type Bank = {
  taxFreeSFL: number;
  withdrawnAmount: number;
};

export type TemperateSeasonName = "spring" | "summer" | "autumn" | "winter";

export type Season = {
  startedAt: number;
  season: TemperateSeasonName;
};

type BaseCalendarEventDetails = {
  date: string;
  weather?: boolean;
};

type CalendarScheduledEvent = BaseCalendarEventDetails & {
  name: "calendar";
  title: string;
  description: string;
};

type OtherCalendarEvent = BaseCalendarEventDetails & {
  name: Exclude<CalendarEventName, "calendar">;
};

export type CalendarEventDetails = CalendarScheduledEvent | OtherCalendarEvent;

export type Calendar = Partial<Record<SeasonalEventName, CalendarEvent>> & {
  dates: CalendarEventDetails[];
};

export type LavaPit = {
  createdAt: number;
  startedAt?: number;
  readyAt?: number;
  collectedAt?: number;
  removedAt?: number;
} & OptionalCoordinates;

export type VIP = {
  bundles: { name: VipBundle; boughtAt: number }[];
  expiresAt: number;
  trialStartedAt?: number;
};

export type Chain = "ronin";

export type NFT = {
  name: string;
  tokenId: number;
  expiresAt: number;
  acknowledgedAt?: number;
};

export type BoostName =
  | InventoryItemName
  | BumpkinItem
  | BumpkinRevampSkillName
  | BudNFTName
  | SpecialBoostName;

export type SpecialBoostName =
  | `${SeasonalEventName}`
  | "Power hour"
  | "VIP Access"
  | "Faction Pet"
  | "Native"
  | "Volcano Bonus"
  | "Tier 2 Bonus"
  | "Tier 3 Bonus"
  | "Streak Bonus"
  | "Bee Swarm Bonus"
  | "Building Oil"
  | "Double Delivery";

export type BoostUsedAt = Partial<Record<BoostName, number>>;

/**
 * A finalised [from, to] interval during which a temporary boost collectible was
 * active. Stored in `GameState.boostHistory` so the boost's contribution to
 * in-progress timers survives the placed record being burned (deleted) or
 * renewed (createdAt reset). Activity-agnostic — the per-activity speed is
 * applied when the window is read.
 */
export type BoostHistoryWindow = { from: number; to: number };

type ClutterCoordinates = {
  type: ClutterName;
} & Coordinates;

type VillageProject = {
  cheers: number;
  winnerId?: number;
  helpedAt?: number; // Local only field
};

export type SocialFarming = {
  points: number;
  weeklyPoints: {
    points: number;
    week: string;
  };
  villageProjects: Partial<Record<MonumentName, VillageProject>>;
  completedProjects?: MonumentName[];
  cheersGiven: {
    date: string;
    projects: Partial<Record<MonumentName, number[]>>;
    farms: number[];
  };
  cheers: { freeCheersClaimedAt: number };
  waves?: {
    date: string;
    farms: number[];
  };
  helpIncrease?: { boughtAt: number[] };
  clutter?: {
    spawnedAt: number;
    locations: { [clutterId: string]: ClutterCoordinates };
  };
  // NOTE: Remove after Chapter competition
  helpedForCompetition?: number;
};

export type Auctioneer = {
  bid?: Bid;
  minted?: Minted;
};

type RoninV2PackName =
  | "Bronze Pack"
  | "Silver Pack"
  | "Gold Pack"
  | "Platinum Pack"
  | "Legendary Pack"
  | "Whale Pack";

export type FarmHands = {
  bumpkins: Record<string, FarmHand>;
};

export interface GameState {
  home: Home;
  interior: Interior;
  bank: Bank;

  buffs?: Partial<Record<BuffName, Buff>>;

  choreBoard: ChoreBoard;

  competitions: {
    progress: Partial<Record<CompetitionName, CompetitionProgress>>;
  };

  calendar: Calendar;
  vip?: VIP;
  shipments: {
    restockedAt?: number;
  };

  verified?: boolean;

  gems: {
    history?: Record<string, { spent: number; coinsSpent?: number }>;
  };

  flower: {
    history?: Record<string, { loveCharmsSpent: number }>;
  };

  // There are more fields but unused
  transaction?: GameTransaction;

  island: {
    type: IslandType;
    upgradedAt?: number;
    previousExpansions?: number;
    sunstones?: number;
    biome?: LandBiomeName;
    ascensionLevel?: number;
  };

  username?: string;
  settings: {
    username?: {
      setAt?: number;
    };
    network?: NetworkName;
    economiesEnabled?: boolean;
    interiorsEnabled?: boolean;
    toolShop?: {
      buyAllEnabled?: boolean;
      buyAll?: Partial<
        Record<
          WorkbenchToolName,
          {
            blocked?: boolean;
          }
        >
      >;
    };
  };
  coins: number;
  balance: Decimal;
  previousBalance: Decimal;
  airdrops?: Airdrop[];

  createdAt: number;

  tradedAt?: string;
  warCollectionOffer?: WarCollectionOffer;

  minigames: {
    prizes: Partial<Record<MinigameName, MinigamePrize>>;
    games: Partial<Record<MinigameName, Minigame>>;
  };

  farmHands: FarmHands;
  inventory: Inventory;
  previousInventory: Inventory;
  wardrobe: Wardrobe;
  previousWardrobe: Wardrobe;
  stock: Inventory;
  stockExpiry: StockExpiry;
  boostsUsedAt?: BoostUsedAt;
  boostHistory?: Partial<Record<CollectibleName, BoostHistoryWindow[]>>;

  // When an item is burnt, what the prize was
  mysteryPrizes: Partial<Record<InventoryItemName, Reveal[]>>;

  trees: Record<string, Tree>;
  stones: Record<string, Rock>;
  gold: Record<string, Rock>;
  iron: Record<string, Rock>;
  crimstones: Record<string, FiniteResource>;
  sunstones: Record<string, FiniteResource>;
  ascensionCrystals: Record<string, FiniteResource>;
  oilReserves: Record<string, OilReserve>;

  crops: Record<string, CropPlot>;
  greenhouse: {
    oil: number;
    pots: Record<string, GreenhousePot>;
  };
  fruitPatches: Record<string, FruitPatch>;
  beehives: Beehives;
  flowers: {
    discovered: Partial<Record<FlowerName, FlowerCrossBreedName[]>>;
    flowerBeds: FlowerBeds;
  };
  fishing: Fishing;
  crabTraps: CrabTrap;
  farmActivity: Partial<Record<FarmActivityName, number>>;
  milestones: Partial<Record<MilestoneName, number>>;

  expansionConstruction?: ExpansionConstruction;
  expandedAt?: number;

  bumpkin: Bumpkin;

  buildings: Buildings;
  collectibles: Collectibles;
  delivery: Delivery;
  npcs?: NPCS;

  // TODO remove when old events are deleted
  migrated?: boolean;
  metadata?: any[];
  pumpkinPlaza: {
    rewardCollectedAt?: number;
    kickedAt?: number;
    kickedById?: number;
    raffle?: { entries: Record<string, number> };
    budBox?: { openedAt: number };
    vipChest?: { openedAt: number };
    blockchainBox?: {
      openedAt: number;
      items: Partial<Record<InventoryItemName, number>>;
      vipDays: number;
      tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
    };
    giftGiver?: { openedAt: number };
    streamerHat?: { openedAt: number; dailyCount?: number };
    pirateChest?: { openedAt: number };
    keysBought?: KeysBought;
  };

  roninRewards?: {
    onchain?: {
      openedAt: number;
      pack: RoninV2PackName;
    };
    twitter?: {
      openedAt: number;
      pack: RoninV2PackName;
    };
  };

  conversations: ConversationName[];
  mailbox: {
    read: {
      id: string;
      createdAt: number;
    }[];
  };
  raffle?: {
    active: Record<
      string,
      {
        entries: number;
        endAt: number;
        items: Partial<Record<InventoryItemName, number>>;
      }
    >;
  };
  dailyRewards?: DailyRewards;
  auctioneer: Auctioneer;
  chores?: ChoresV2;
  kingdomChores: KingdomChores;
  mushrooms?: Mushrooms;
  potionHouse?: PotionHouse;

  bounties: Bounties;

  trades: {
    listings?: Record<string, TradeListing>;
    offers?: Record<string, TradeOffer>;
    tradePoints?: number;
    dailyListings?: { date: number; count: number };
    dailyPurchases?: { date: number; count: number };
    weeklySales?: {
      [date: string]: Partial<Record<MarketplaceTradeableName, number>>;
    };

    weeklyPurchases?: {
      [date: string]: Partial<Record<MarketplaceTradeableName, number>>;
    };
  };

  buds?: Record<number, Bud>;

  flowerShop?: FlowerShop;
  specialEvents: SpecialEvents;
  goblinMarket: {
    resources: Partial<
      Record<
        TradeableName,
        {
          bundlesSold: number;
          date: number;
        }
      >
    >;
  };
  faction?: Faction;
  previousFaction?: {
    name: FactionName;
    leftAt: number;
  };
  dailyFactionDonationRequest?: {
    resource: DonationItemName;
    amount: Decimal;
  };
  desert: Desert;

  ban: {
    status: "investigating" | "permanent" | "ok";
    isSocialVerified?: boolean;
  };

  henHouse: AnimalBuilding;
  barn: AnimalBuilding;
  waterWell: UpgradableBuilding;
  agingShed: AgingShed;
  petHouse: PetHouseBuilding;

  craftingBox: {
    status: "pending" | "idle" | "crafting";
    queue?: CraftingQueueItem[];
    /** @deprecated Derive from queue[0] via getCraftingBoxCurrent */
    item?:
      | {
          collectible: RecipeCollectibleName;
          wearable?: never;
        }
      | {
          collectible?: never;
          wearable: BumpkinItem;
        };
    /** @deprecated Derive from queue[0] */
    startedAt?: number;
    /** @deprecated Derive from queue[0] */
    readyAt?: number;
    recipes: Partial<Recipes>;
  };
  season: Season;
  lavaPits: Record<string, LavaPit>;
  /**
   * Saved snapshots of the farm arrangement. The live farm is the "current"
   * layout; these are the saved alternatives the player can load onto it.
   * Optional so legacy saves (which never had this field) need no migration.
   * Capped at {@link MAX_SAVED_LAYOUTS}.
   */
  layouts?: SavedLayout[];
  nfts?: Partial<Record<Chain, NFT>>;

  faceRecognition?: {
    session?: {
      id: string;
      createdAt: number;
      token: string;
    };
    history: FaceRecognitionEvent[];
  };
  telegram?: {
    linkedAt: number;
    startedAt?: number;
    joinedAt?: number;
  };
  twitter?: {
    username: string;
    linkedAt: number;
    followedAt?: number;
    isAuthorised?: boolean;
    verifiedPostsAt?: number;
    tweets?: Partial<Record<TwitterPostName, TwitterPost>>;
  };
  discord?: {
    connected: boolean;
    verified: boolean;
  };
  referrals?: {
    totalReferrals: number;
    totalVIPReferrals?: number;
    totalUnclaimedReferrals?: number;
    rewards?: {
      items?: Partial<Record<InventoryItemName, number>>;
      wearables?: Partial<Record<BumpkinItem, number>>;
      coins?: number;
      sfl?: number;
    };
    /**
     * VIP referral milestone thresholds (1, 5, 10, 20 … 90) that have been
     * claimed, mapped to the timestamp (ms) they were claimed at. Used to make
     * each milestone prize claimable exactly once.
     */
    vipMilestonesClaimed?: Partial<Record<number, number>>;
  };
  socialTasks?: {
    completed: Partial<Record<InGameTaskName, { completedAt: number }>>;
  };

  rewardBoxes?: RewardBoxes;

  floatingIsland: {
    schedule: {
      startAt: number;
      endAt: number;
    }[];
    shop: FloatingIslandShop;
    boughtAt?: Partial<Record<FloatingShopItemName, number>>;
    petalPuzzleSolvedAt?: number;
  };
  megastore?: {
    boughtAt: Partial<Record<ChapterTierItemName, number>>;
    // Per-item, per-chapter purchase count. Used by the `limit` enforcement
    // so a recurring item from a previous chapter doesn't stay blocked.
    purchases?: Partial<
      Record<ChapterTierItemName, { chapter: ChapterName; count: number }>
    >;
  };
  withdrawals?: {
    amount: number;
  };

  aoe: AOE;
  socialFarming: SocialFarming;
  pets?: Pets;

  prototypes?: {
    leagues?: League;
  };
  saltFarm: SaltFarm;
  sculptures?: Partial<
    Record<SculptureName, { level: number; upgradedAt?: number }>
  >;
}

export type AOE = Partial<
  Record<AOEItemName, Partial<Record<number, Partial<Record<number, number>>>>>
>;

export type FaceRecognitionEvent =
  | { event: "succeeded"; createdAt: number; confidence: number }
  | { event: "failed"; createdAt: number; confidence: number }
  | {
      event: "duplicate";
      createdAt: number;
      duplicates: {
        similarity: number;
        faceId: string;
        farmId: number;
      }[];
    }
  | { event: "ownerChanged"; createdAt: number };

export interface Context {
  state?: GameState;
  actions: PastAction[];
}
