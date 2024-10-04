import {
  CropName,
  CropSeedName,
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "./crops";
import {
  FruitName,
  FruitSeedName,
  GreenHouseFruitName,
  GreenHouseFruitSeedName,
} from "./fruits";
import {
  Animal,
  BarnItem,
  Food,
  LegacyItem,
  MOMEventItem,
  MarketItem,
  MutantChicken,
  QuestItem,
  Shovel,
  ToolName,
  TravelingSalesmanItem,
  getKeys,
} from "./craftables";
import {
  Coupons,
  EasterEgg,
  FertiliserName,
  GameState,
  InventoryItemName,
  LanternName,
  Points,
  SpecialEvent,
} from "./game";
import { BeanName, ExoticCropName, MutantCropName } from "./beans";
import { WarTentItem } from "./craftables";
import { TreasureToolName } from "./tools";
import {
  GoblinBlacksmithItemName,
  GoblinPirateItemName,
  HeliosBlacksmithItem,
  MegaStoreCollectibleName,
  PotionHouseItemName,
  PurchasableItems,
  SoldOutCollectibleName,
  TreasureCollectibleItem,
} from "./collectibles";
import { CommodityName, ResourceName } from "./resources";
import { Flag } from "./flags";
import { SkillName } from "./skills";
import { BuildingName } from "./buildings";
import { ConsumableName } from "./consumables";
import {
  AchievementDecorationName,
  DECORATION_TEMPLATES,
  EventDecorationName,
  InteriorDecorationName,
  PotionHouseDecorationName,
  SeasonalDecorationName,
  ShopDecorationName,
  TemplateDecorationName,
} from "./decorations";
import {
  BeachBountyTreasure,
  BoostTreasure,
  DecorationTreasure,
} from "./treasure";
import { WorkbenchToolName } from "./tools";
import { BumpkinItem } from "./bumpkin";
import { SEASONS, hasSeasonEnded } from "./seasons";
import { CompostName } from "./composters";
import {
  FishName,
  FishingBait,
  MarineMarvelName,
  OldFishName,
} from "./fishing";
import { canWithdrawBoostedWearable } from "./wearableValidation";
import { FlowerName, FlowerSeedName, MutantFlowerName } from "./flowers";
import { FactionShopCollectibleName, FactionShopFoodName } from "./factionShop";

const canWithdrawTimebasedItem = (availableAt: Date) => {
  const now = new Date();

  return now >= availableAt;
};

const cropSeeds: Record<CropSeedName, () => boolean> = {
  "Beetroot Seed": () => false,
  "Cabbage Seed": () => false,
  "Carrot Seed": () => false,
  "Cauliflower Seed": () => false,
  "Kale Seed": () => false,
  "Potato Seed": () => false,
  "Pumpkin Seed": () => false,
  "Sunflower Seed": () => false,
  "Parsnip Seed": () => false,
  "Eggplant Seed": () => false,
  "Corn Seed": () => false,
  "Radish Seed": () => false,
  "Wheat Seed": () => false,
  "Soybean Seed": () => false,
  "Barley Seed": () => false,
};

const fruitSeed: Record<FruitSeedName, () => boolean> = {
  "Apple Seed": () => false,
  "Blueberry Seed": () => false,
  "Orange Seed": () => false,
  "Banana Plant": () => false,
  "Tomato Seed": () => false,
  "Lemon Seed": () => false,
};

const flowerSeed: Record<FlowerSeedName, () => boolean> = {
  "Sunpetal Seed": () => false,
  "Bloom Seed": () => false,
  "Lily Seed": () => false,
};

const crops: Record<CropName, () => boolean> = {
  Beetroot: () => true,
  Cabbage: () => true,
  Carrot: () => true,
  Cauliflower: () => true,
  Kale: () => true,
  Potato: () => true,
  Pumpkin: () => true,
  Sunflower: () => true,
  Parsnip: () => true,
  Eggplant: () => true,
  Corn: () => true,
  Radish: () => true,
  Wheat: () => true,
  Soybean: () => true,
  Barley: () => false,
};

const fruits: Record<FruitName, () => boolean> = {
  Apple: () => true,
  Blueberry: () => true,
  Orange: () => true,
  Banana: () => true,
  Tomato: () => false,
  Lemon: () => false,
};

const flowers: Record<FlowerName, () => boolean> = {
  "Red Pansy": () => false,
  "Yellow Pansy": () => false,
  "Purple Pansy": () => false,
  "White Pansy": () => false,
  "Blue Pansy": () => false,
  "Red Cosmos": () => false,
  "Yellow Cosmos": () => false,
  "Purple Cosmos": () => false,
  "White Cosmos": () => false,
  "Blue Cosmos": () => false,
  "Red Balloon Flower": () => false,
  "Yellow Balloon Flower": () => false,
  "Purple Balloon Flower": () => false,
  "White Balloon Flower": () => false,
  "Blue Balloon Flower": () => false,
  "Red Carnation": () => false,
  "Yellow Carnation": () => false,
  "Purple Carnation": () => false,
  "White Carnation": () => false,
  "Blue Carnation": () => false,
  "Prism Petal": () => false,
  "Primula Enigma": () => false,
  "Celestial Frostbloom": () => false,
  "Red Daffodil": () => false,
  "Yellow Daffodil": () => false,
  "Purple Daffodil": () => false,
  "White Daffodil": () => false,
  "Blue Daffodil": () => false,
  "Red Lotus": () => false,
  "Yellow Lotus": () => false,
  "Purple Lotus": () => false,
  "White Lotus": () => false,
  "Blue Lotus": () => false,
};

const beans: Record<BeanName, () => boolean> = {
  "Magic Bean": () => false,
};

const questItems: Record<QuestItem, () => boolean> = {
  "Ancient Goblin Sword": () => false,
  "Ancient Human Warhammer": () => false,
  "Goblin Key": () => false,
  "Sunflower Key": () => false,
};

const warTentItems: Record<WarTentItem, () => boolean> = {
  "Beetroot Amulet": () => false,
  "Carrot Amulet": () => false,
  "Sunflower Amulet": () => false,
  "Green Amulet": () => false,
  "Skull Hat": () => false,
  "Sunflower Shield": () => false,
  "Undead Rooster": () => true,
  "War Skull": () => true,
  "War Tombstone": () => true,
  "Warrior Helmet": () => false,
  "Warrior Pants": () => false,
  "Warrior Shirt": () => false,
};

const tools: Record<ToolName | WorkbenchToolName | Shovel, () => boolean> = {
  Axe: () => false,
  Hammer: () => false,
  Pickaxe: () => false,
  "Rusty Shovel": () => false,
  "Iron Pickaxe": () => false,
  "Stone Pickaxe": () => false,
  "Gold Pickaxe": () => false,
  Rod: () => false,
  Shovel: () => false,
  "Oil Drill": () => false,
};

const treasureTools: Record<TreasureToolName, () => boolean> = {
  "Sand Drill": () => false,
  "Sand Shovel": () => false,
};

/* TODO - Split TOOLS into TOOLS and SHOVELS
 * SHOVELS are a separate object in the frontend, but they are
 * part of TOOLS in the backend.
 */

const warBanners = {
  "Human War Banner": () => false,
  "Goblin War Banner": () => false,
};

const factionBanners = {
  "Bumpkin Faction Banner": () => false,
  "Goblin Faction Banner": () => false,
  "Nightshade Faction Banner": () => false,
  "Sunflorian Faction Banner": () => false,
};

const heliosBlacksmith: Record<HeliosBlacksmithItem, () => boolean> = {
  "Immortal Pear": () => false,
  "Basic Scarecrow": () => false,
  Bale: () => false,
  "Scary Mike": () => false,
  "Laurie the Chuckle Crow": () => false,
  "Grain Grinder": () => true,
  Kernaldo: () => true,
  Poppy: () => true,
  Nana: () => true,
  "Soil Krabby": () => true,
  "Skill Shrimpy": () => true,
  "Stone Beetle": () => false,
  "Iron Beetle": () => false,
  "Gold Beetle": () => false,
  "Fairy Circle": () => false,
  Squirrel: () => false,
  Macaw: () => false,
  Butterfly: () => false,
};

const treasureCollectible: Record<TreasureCollectibleItem, () => boolean> = {
  "Treasure Map": () => false,
  "Adrift Ark": () => false,
  Castellan: () => false,
  "Sunlit Citadel": () => hasSeasonEnded("Pharaoh's Treasure"),
  "Baobab Tree": () => hasSeasonEnded("Pharaoh's Treasure"),
  Camel: () => hasSeasonEnded("Pharaoh's Treasure"),
};

const commodities: Record<CommodityName, () => boolean> = {
  // Mushrooms
  "Magic Mushroom": () => false,
  "Wild Mushroom": () => false,

  Chicken: () => false,
  Wood: () => true,
  Stone: () => true,
  Iron: () => true,
  Gold: () => true,
  Crimstone: () => false,
  Sunstone: () => false,
  Diamond: () => false,
  Oil: () => false,

  Honey: () => false,
  Egg: () => true,
};

const resources: Record<ResourceName, () => boolean> = {
  Tree: () => false,
  "Stone Rock": () => false,
  "Iron Rock": () => false,
  "Gold Rock": () => false,
  "Crimstone Rock": () => false,
  "Crop Plot": () => false,
  "Fruit Patch": () => false,
  Boulder: () => false,
  Beehive: () => false,
  "Flower Bed": () => false,
  "Sunstone Rock": () => false,
  "Oil Reserve": () => false,
};

const mutantChickens: Record<MutantChicken, () => boolean> = {
  "Ayam Cemani": () => true,
  "Fat Chicken": () => true,
  "Rich Chicken": () => true,
  "Speed Chicken": () => true,
  "El Pollo Veloz": () => true,
  "Banana Chicken": () => true,
  "Crim Peckster": () => true,
  "Knight Chicken": () => true,
  "Pharaoh Chicken": () =>
    canWithdrawTimebasedItem(SEASONS["Pharaoh's Treasure"].endDate),
};

const flags: Record<Flag, () => boolean> = {
  "Australian Flag": () => true,
  "Belgian Flag": () => true,
  "Brazilian Flag": () => true,
  "Chinese Flag": () => true,
  "Finnish Flag": () => true,
  "French Flag": () => true,
  "German Flag": () => true,
  "Indonesian Flag": () => true,
  "Indian Flag": () => true,
  "Iranian Flag": () => true,
  "Italian Flag": () => true,
  "Japanese Flag": () => true,
  "Moroccan Flag": () => true,
  "Dutch Flag": () => true,
  "Philippine Flag": () => true,
  "Polish Flag": () => true,
  "Portuguese Flag": () => true,
  "Russian Flag": () => true,
  "Saudi Arabian Flag": () => true,
  "South Korean Flag": () => true,
  "Spanish Flag": () => true,
  "Sunflower Flag": () => true,
  "Thai Flag": () => true,
  "Turkish Flag": () => true,
  "Ukrainian Flag": () => true,
  "American Flag": () => true,
  "Vietnamese Flag": () => true,
  "Canadian Flag": () => true,
  "Singaporean Flag": () => true,
  "British Flag": () => true,
  "Sierra Leone Flag": () => true,
  "Romanian Flag": () => true,
  "Rainbow Flag": () => true,
  "Goblin Flag": () => true,
  "Pirate Flag": () => true,
  "Algerian Flag": () => true,
  "Mexican Flag": () => true,
  "Dominican Republic Flag": () => true,
  "Argentinian Flag": () => true,
  "Lithuanian Flag": () => true,
  "Malaysian Flag": () => true,
  "Colombian Flag": () => true,
};

const easterEggs: Record<EasterEgg, () => boolean> = {
  "Blue Egg": () => false,
  "Green Egg": () => false,
  "Orange Egg": () => false,
  "Pink Egg": () => false,
  "Purple Egg": () => false,
  "Red Egg": () => false,
  "Yellow Egg": () => false,
};

const skills: Record<SkillName, () => boolean> = {
  "Green Thumb": () => false,
  "Barn Manager": () => false,
  "Seed Specialist": () => false,
  Wrangler: () => false,
  Lumberjack: () => false,
  Prospector: () => false,
  Logger: () => false,
  "Gold Rush": () => false,
  Artist: () => false,
  Coder: () => false,
  "Liquidity Provider": () => false,
  "Discord Mod": () => false,
  Warrior: () => false,
};

const coupons: Record<Coupons, () => boolean> = {
  "Gold Pass": () => false, // Duplicate entry but there will be error if i didn't include this here
  "Trading Ticket": () => false,
  "War Bond": () => false,
  "Jack-o-lantern": () => false,
  "Golden Crop": () => false,
  "Beta Pass": () => false,
  "Red Envelope": () => false,
  "Love Letter": () => false,
  "Block Buck": () => false,
  Gem: () => false,
  "Solar Flare Ticket": () => false,
  "Dawn Breaker Ticket": () => false,
  "Sunflower Supporter": () => false,
  "Crow Feather": () => false,
  "Potion Ticket": () => false,
  "Bud Ticket": () => false,
  "Bud Seedling": () => false,
  "Mermaid Scale": () => false,
  "Community Coin": () => false,
  "Arcade Token": () => false,
  "Farmhand Coupon": () => false,
  Farmhand: () => false,
  "Tulip Bulb": () => false,
  "Treasure Key": () => false,
  "Luxury Key": () => false,
  "Rare Key": () => false,
  "Prize Ticket": () => false,
  Scroll: () => false,
  "Amber Fossil": () => false,
  "Bumpkin Emblem": () => false,
  "Goblin Emblem": () => false,
  "Nightshade Emblem": () => false,
  "Sunflorian Emblem": () => false,
  Mark: () => false,
  "Trade Point": () => false,
};

const buildings: Record<BuildingName, () => boolean> = {
  "Town Center": () => false,
  "Fire Pit": () => false,
  Market: () => false,
  Workbench: () => false,
  Kitchen: () => false,
  Tent: () => false,
  "Water Well": () => false,
  Bakery: () => false,
  Greenhouse: () => false,
  "Hen House": () => false,
  Barn: () => false,
  Deli: () => false,
  "Smoothie Shack": () => false,
  Toolshed: () => false,
  Warehouse: () => false,
  "Compost Bin": () => false,
  "Turbo Composter": () => false,
  "Premium Composter": () => false,
  House: () => false,
  Manor: () => false,
  "Crop Machine": () => false,
};

const fertilisers: Record<FertiliserName, () => boolean> = {
  "Rapid Growth": () => false,
};

const food: Record<Food, () => boolean> = {
  "Beetroot Cake": () => false,
  "Cabbage Cake": () => false,
  "Carrot Cake": () => false,
  "Cauliflower Cake": () => false,
  "Potato Cake": () => false,
  "Pumpkin Cake": () => false,
  "Sunflower Cake": () => false,
  "Parsnip Cake": () => false,
  "Radish Cake": () => false,
  "Wheat Cake": () => false,
  "Pumpkin Soup": () => false,
  "Radish Pie": () => false,
  "Roasted Cauliflower": () => false,
  Sauerkraut: () => false,
};

const consumables: Record<ConsumableName, () => boolean> = {
  "Glazed Carrots": () => false,
  Caponata: () => false,
  Paella: () => false,
  "Beetroot Blaze": () => false,
  "Rapid Roast": () => false,
  "Shroom Syrup": () => false,
  "Mashed Potato": () => false,
  "Pumpkin Soup": () => false,
  "Bumpkin Broth": () => false,
  "Boiled Eggs": () => false,
  "Mushroom Soup": () => false,
  "Roast Veggies": () => false,
  "Bumpkin Salad": () => false,
  "Cauliflower Burger": () => false,
  "Mushroom Jacket Potatoes": () => false,
  "Goblin's Treat": () => false,
  "Club Sandwich": () => false,
  "Kale Stew": () => false,
  Pancakes: () => false,
  "Kale & Mushroom Pie": () => false,
  "Fermented Carrots": () => false,
  Sauerkraut: () => false,
  "Blueberry Jam": () => false,
  "Apple Pie": () => false,
  "Orange Cake": () => false,
  "Honey Cake": () => false,
  "Sunflower Crunch": () => false,
  "Reindeer Carrot": () => false,
  "Sunflower Cake": () => false,
  "Potato Cake": () => false,
  "Pumpkin Cake": () => false,
  "Carrot Cake": () => false,
  "Cabbage Cake": () => false,
  "Beetroot Cake": () => false,
  "Cauliflower Cake": () => false,
  "Parsnip Cake": () => false,
  "Radish Cake": () => false,
  "Wheat Cake": () => false,
  "Apple Juice": () => false,
  "Orange Juice": () => false,
  "Purple Smoothie": () => false,
  "Power Smoothie": () => false,
  "Bumpkin Detox": () => false,
  "Bumpkin Roast": () => false,
  "Goblin Brunch": () => false,
  "Fruit Salad": () => false,
  "Kale Omelette": () => false,
  "Cabbers n Mash": () => false,
  "Fancy Fries": () => false,
  "Pirate Cake": () => false,
  "Bumpkin ganoush": () => false,
  Cornbread: () => false,
  "Eggplant Cake": () => false,
  Popcorn: () => false,
  "Fermented Fish": () => false,
  Chowder: () => false,
  Gumbo: () => false,
  "Barred Knifejaw": () => false,
  "Blue Marlin": () => false,
  "Football fish": () => false,
  "Hammerhead shark": () => false,
  "Horse Mackerel": () => false,
  "Mahi Mahi": () => false,
  "Moray Eel": () => false,
  "Olive Flounder": () => false,
  "Red Snapper": () => false,
  "Saw Shark": () => false,
  "Sea Bass": () => false,
  "Sea Horse": () => false,
  "Whale Shark": () => false,
  "White Shark": () => false,
  "Zebra Turkeyfish": () => false,
  Anchovy: () => false,
  Blowfish: () => false,
  Butterflyfish: () => false,
  Clownfish: () => false,
  Coelacanth: () => false,
  Napoleanfish: () => false,
  Oarfish: () => false,
  Ray: () => false,
  Squid: () => false,
  Sunfish: () => false,
  Surgeonfish: () => false,
  Tuna: () => false,
  "Banana Blast": () => false,
  Angelfish: () => false,
  Halibut: () => false,
  Parrotfish: () => false,
  "Carrot Juice": () => false,
  "Seafood Basket": () => false,
  "Fish Burger": () => false,
  "Fish n Chips": () => false,
  "Fish Omelette": () => false,
  "Fried Calamari": () => false,
  "Fried Tofu": () => false,
  "Grape Juice": () => false,
  "Ocean's Olive": () => false,
  "Quick Juice": () => false,
  "Rice Bun": () => false,
  "Slow Juice": () => false,
  "Steamed Red Rice": () => false,
  "Sushi Roll": () => false,
  "The Lot": () => false,
  "Tofu Scramble": () => false,
  Antipasto: () => false,
};

const decorations: Record<ShopDecorationName, () => boolean> = {
  "Town Sign": () => false,
  "White Tulips": () => false,
  "Potted Sunflower": () => false,
  "Potted Potato": () => false,
  "Potted Pumpkin": () => false,
  Cactus: () => false,
  "Basic Bear": () => false,
  "Dirt Path": () => false,
  Bush: () => false,
  Shrub: () => false,
  Fence: () => false,
  "Bonnie's Tombstone": () => false,
  "Grubnash's Tombstone": () => false,
  "Crimson Cap": () => false,
  "Toadstool Seat": () => false,
  "Chestnut Fungi Stool": () => false,
  "Mahogany Cap": () => false,
  "Pine Tree": () => false,
  "Stone Fence": () => false,
  "Field Maple": () => false,
  "Red Maple": () => false,
  "Golden Maple": () => false,
};

const seasonalDecorations: Record<SeasonalDecorationName, () => boolean> = {
  // TODO - time base withdrawals
  "Battlecry Drum": () => false,
  "Golden Gallant": () => false,
  "Golden Guardian": () => false,
  "Rookie Rook": () =>
    canWithdrawTimebasedItem(SEASONS["Pharaoh's Treasure"].endDate),
  "Silver Sentinel": () =>
    canWithdrawTimebasedItem(SEASONS["Pharaoh's Treasure"].endDate),
  "Silver Stallion": () => false,

  Blossombeard: () => false,
  "Desert Gnome": () => false,
  Clementine: () => true,
  Cobalt: () => true,
  "Dawn Umbrella Seat": () => true,
  "Eggplant Grill": () => true,
  "Giant Dawn Mushroom": () => true,
  "Shroom Glow": () => true,
  Candles: () => true,
  "Haunted Stump": () => true,
  "Spooky Tree": () => true,
  Observer: () => true,
  "Crow Rock": () => true,
  "Mini Corn Maze": () => true,
  "Beach Umbrella": () => true,
  "Hideaway Herman": () => true,
  "Lifeguard Ring": () => true,
  "Shifty Sheldon": () => true,
  "Tiki Torch": () => true,
  Surfboard: () => true,
  "Gaucho Rug": () => true,

  "Paper Reed": () => hasSeasonEnded("Pharaoh's Treasure"),
};

const mutantCrop: Record<MutantCropName, () => boolean> = {
  "Stellar Sunflower": () => true,
  "Potent Potato": () => true,
  "Radical Radish": () => true,
};

const specialEvents: Record<SpecialEvent | MOMEventItem, () => boolean> = {
  "Chef Apron": () => false,
  "Chef Hat": () => false,
  "Engine Core": () => false,
  Observatory: () => true,
};

const points: Record<Points, () => boolean> = {
  "Human War Point": () => false,
  "Goblin War Point": () => false,
};

const goblinBlacksmith: Record<GoblinBlacksmithItemName, () => boolean> = {
  "Mushroom House": () => true,
  Obie: () => true,
  "Purple Trail": () => true,
  Maximus: () => true,
};

const animals: Record<Animal, () => boolean> = {
  Cow: () => false,
  Pig: () => false,
  Sheep: () => false,
  Chicken: () => false,
};

const barnItems: Record<BarnItem, () => boolean> = {
  "Chicken Coop": () => true,
  "Easter Bunny": () => true,
  "Farm Cat": () => true,
  "Farm Dog": () => true,
  "Gold Egg": () => true,
  Rooster: () => true,
};

const blacksmithItems: Record<LegacyItem, () => boolean> = {
  "Sunflower Statue": () => true,
  "Potato Statue": () => true,
  "Christmas Tree": () => true,
  Gnome: () => true,
  "Sunflower Tombstone": () => true,
  "Sunflower Rock": () => true,
  "Goblin Crown": () => true,
  Fountain: () => true,
  "Egg Basket": () => false,
  "Woody the Beaver": () => true,
  "Apprentice Beaver": () => true,
  "Foreman Beaver": () => true,
  "Nyon Statue": () => true,
  "Homeless Tent": () => true,
  "Farmer Bath": () => true,
  "Mysterious Head": () => true,
  "Rock Golem": () => true,
  "Tunnel Mole": () => true,
  "Rocky the Mole": () => true,
  Nugget: () => true,
};

const travelingSalesmanItems: Record<TravelingSalesmanItem, () => boolean> = {
  "Christmas Bear": () => true,
  "Golden Bonsai": () => true,
  "Victoria Sisters": () => true,
  "Wicker Man": () => true,
};

const soldOut: Record<SoldOutCollectibleName, () => boolean> = {
  "Peeled Potato": () => true,
  "Christmas Snow Globe": () => true,
  "Beta Bear": () => true,
  "Cyborg Bear": () => true,
  "Wood Nymph Wendy": () => true,
  "Squirrel Monkey": () => true,
  "Black Bearry": () => true,
  "Lady Bug": () => true,
  "Cabbage Boy": () => true,
  "Cabbage Girl": () => true,
  "Maneki Neko": () => true,
  "Heart Balloons": () => true,
  Flamingo: () => true,
  "Blossom Tree": () => true,
  "Palm Tree": () => true,
  "Beach Ball": () => true,
  "Collectible Bear": () => true,
  "Pablo The Bunny": () => true,
  "Easter Bush": () => true,
  "Giant Carrot": () => true,
  Hoot: () => true,
  "Sir Goldensnout": () => true,
  "Freya Fox": () => true,
  "Queen Cornelia": () => true,
  "White Crow": () => true,

  Walrus: () => true,
  Alba: () => true,
  "Knowledge Crab": () => true,
  Anchor: () => true,
  "Rubber Ducky": () => true,
  "Kraken Head": () => true,
  "Blossom Royale": () => true,
  "Humming Bird": () => true,
  "Hungry Caterpillar": () => true,
  "Queen Bee": () => true,
  "Turbo Sprout": () => true,
  Soybliss: () => true,
  "Grape Granny": () => true,
  "Royal Throne": () => true,
  "Lily Egg": () => true,
  Goblet: () => true,
  "Pharaoh Gnome": () => canWithdrawTimebasedItem(new Date("2024-10-15")), // Last Auction 14th October
  "Lemon Tea Bath": () => canWithdrawTimebasedItem(new Date("2024-10-09")), // Last Auction 9th October
  "Tomato Clown": () => canWithdrawTimebasedItem(new Date("2024-10-06")), // Last Auction 5th October
  Pyramid: () => canWithdrawTimebasedItem(new Date("2024-09-27")), // Last Auction 26th September
  Oasis: () => canWithdrawTimebasedItem(new Date("2024-09-24")), // Last Auction 23rd September
};

const achievementDecoration: Record<AchievementDecorationName, () => boolean> =
  {
    "Chef Bear": () => true,
    "Construction Bear": () => true,
    "Angel Bear": () => true,
    "Badass Bear": () => true,
    "Bear Trap": () => true,
    "Brilliant Bear": () => true,
    "Classy Bear": () => true,
    "Farmer Bear": () => true,
    "Sunflower Bear": () => true,
    "Rich Bear": () => true,
    "Rainbow Artist Bear": () => true,
    "Devil Bear": () => true,
  };

const market: Record<MarketItem, () => boolean> = {
  // TODO add rule when beans are introduced
  "Carrot Sword": () => true,

  "Golden Cauliflower": () => true,
  "Mysterious Parsnip": () => true,
  Nancy: () => true,
  Scarecrow: () => true,
  Kuebiko: () => true,
};

const boostTreasure: Record<BoostTreasure, () => boolean> = {
  "Lunar Calendar": () => true,
  "Tiki Totem": () => true,
  "Genie Lamp": () => true,
  Foliant: () => true,
};

const goblinPirate: Record<GoblinPirateItemName, () => boolean> = {
  "Iron Idol": () => true,
  "Heart of Davy Jones": () => true,
  Karkinos: () => true,
  "Emerald Turtle": () => true,
  "Tin Turtle": () => true, // Mint ended
  "Golden Bear Head": () => true, // Mint ended
  "Parasaur Skull": () => true, // Mint ended
};

const treasureDecoration: Record<DecorationTreasure, () => boolean> = {
  "T-Rex Skull": () => true,
  "Sunflower Coin": () => true,
  "Pirate Bear": () => true,
  "Whale Bear": () => true,

  "Abandoned Bear": () => false,
  "Dinosaur Bone": () => hasSeasonEnded("Dawn Breaker"),
  Galleon: () => false,
  "Human Bear": () => false,
  "Lifeguard Bear": () => true,
  "Skeleton King Staff": () => false,
  "Snorkel Bear": () => true,
  "Turtle Bear": () => true,
  "Goblin Bear": () => false,
};

const beachBounty: Record<BeachBountyTreasure, () => boolean> = {
  "Pirate Bounty": () => false,
  Pearl: () => false,
  Coral: () => false,
  "Clam Shell": () => false,
  Pipi: () => false,
  Starfish: () => false,
  Seaweed: () => false,
  "Sea Cucumber": () => false,
  Crab: () => false,
  "Wooden Compass": () => false,
  "Iron Compass": () => false,
  "Old Bottle": () => false,
  "Emerald Compass": () => false,
  "Camel Bone": () => false,
  "Cockle Shell": () => false,
  Hieroglyph: () => false,
  Sand: () => false,
  Scarab: () => false,
  Vase: () => false,
};

const eventDecoration: Record<EventDecorationName, () => boolean> = {
  "Hungry Hare": () => true,
  "Community Egg": () => true,
  "Baby Panda": () => true,
  Baozi: () => true,
  "Valentine Bear": () => true,
  "Easter Bear": () => true,
  "Easter Bush": () => true,
  "Giant Carrot": () => true,
  "Genie Bear": () => true,
  "Eggplant Bear": () => true,
  "Dawn Flower": () => true,
  "Sapo Docuras": () => true,
  "Sapo Travessuras": () => true,
  "Time Warp Totem": () => false,

  "Bumpkin Nutcracker": () => true,
  "Festive Tree": () => false,
  "Grinx's Hammer": () => true,
  "White Festive Fox": () => true,
  "Earn Alliance Banner": () => true,
  "Benevolence Flag": () => true,
  "Devotion Flag": () => true,
  "Generosity Flag": () => true,
  "Splendor Flag": () => true,
  "Jelly Lamp": () => true,
  "Paint Can": () => true,
};

const lanterns: Record<LanternName, () => boolean> = {
  "Luminous Lantern": () => true,
  "Radiance Lantern": () => true,
  "Aurora Lantern": () => true,
  "Ocean Lantern": () => true,
  "Solar Lantern": () => true,
  "Betty Lantern": () => true,
  "Bumpkin Lantern": () => true,
  "Goblin Lantern": () => true,
};

const purchasables: Record<PurchasableItems, () => boolean> = {
  "Witches' Eve Banner": () => false,
  "Dawn Breaker Banner": () => false,
  "Solar Flare Banner": () => false,
  "Gold Pass": () => false,
  "Catch the Kraken Banner": () => false,
  "Spring Blossom Banner": () => false,
  "Clash of Factions Banner": () => false,
  "Lifetime Farmer Banner": () => false,
  "Pharaoh's Treasure Banner": () => false,
};

const potionHouse: Record<
  PotionHouseDecorationName | PotionHouseItemName,
  () => boolean
> = {
  "Giant Cabbage": () => false,
  "Giant Potato": () => false,
  "Giant Pumpkin": () => false,
  "Lab Grown Carrot": () => false,
  "Lab Grown Pumpkin": () => false,
  "Lab Grown Radish": () => false,
};

const exoticCrops: Record<ExoticCropName, () => boolean> = {
  "Adirondack Potato": () => false,
  "Black Magic": () => false,
  "Golden Helios": () => false,
  "Purple Cauliflower": () => false,
  "Warty Goblin Pumpkin": () => false,
  "White Carrot": () => false,
  Chiogga: () => false,
};

const bait: Record<FishingBait, () => boolean> = {
  Earthworm: () => false,
  Grub: () => false,
  "Red Wiggler": () => false,
  "Fishing Lure": () => false,
};

const compost: Record<CompostName, () => boolean> = {
  "Sprout Mix": () => false,
  "Fruitful Blend": () => false,
  "Rapid Root": () => false,
};

const fish: Record<FishName | MarineMarvelName | OldFishName, () => boolean> = {
  Anchovy: () => false,
  Butterflyfish: () => false,
  Blowfish: () => false,
  Clownfish: () => false,
  "Sea Bass": () => false,
  "Sea Horse": () => false,
  "Horse Mackerel": () => false,
  Squid: () => false,
  "Red Snapper": () => false,
  "Moray Eel": () => false,
  "Olive Flounder": () => false,
  Napoleanfish: () => false,
  Surgeonfish: () => false,
  "Zebra Turkeyfish": () => false,
  Ray: () => false,
  "Hammerhead shark": () => false,
  Tuna: () => false,
  "Mahi Mahi": () => false,
  "Blue Marlin": () => false,
  Oarfish: () => false,
  "Football fish": () => false,
  Sunfish: () => false,
  Coelacanth: () => false,
  "Whale Shark": () => false,
  "Barred Knifejaw": () => false,
  "Saw Shark": () => false,
  "White Shark": () => false,
  "Twilight Anglerfish": () => false,
  "Starlight Tuna": () => false,
  "Radiant Ray": () => false,
  "Phantom Barracuda": () => false,
  "Gilded Swordfish": () => false,
  "Kraken Tentacle": () => false,
  Angelfish: () => false,
  Halibut: () => false,
  Parrotfish: () => false,
  "Lemon Shark": () => hasSeasonEnded("Pharaoh's Treasure"),
  "Crimson Carp": () => hasSeasonEnded("Clash of Factions"),
  "Battle Fish": () => hasSeasonEnded("Clash of Factions"),
};

const interiors: Record<InteriorDecorationName, () => boolean> = {
  Rug: () => false,
  Wardrobe: () => false,
};

const megastore: Record<MegaStoreCollectibleName, () => boolean> = {
  Rainbow: () => true,
  Capybara: () => true,
  "Enchanted Rose": () => true,
  "Flower Fox": () => true,
  "Sunrise Bloom Rug": () => true,
  "Flower Rug": () => true,
  "Green Field Rug": () => true,
  "Flower Cart": () => true,
  "Tea Rug": () => true,
  "Fancy Rug": () => true,
  Clock: () => true,
  Vinny: () => true,
  "Regular Pawn": () => true,
  "Novice Knight": () => true,
  "Golden Garrison": () => true,
  "Trainee Target": () => true,
  "Chess Rug": () => true,
  "Rice Panda": () => canWithdrawTimebasedItem(new Date("2024-08-01")),
  "Silver Squire": () => canWithdrawTimebasedItem(new Date("2024-08-01")),
  Cluckapult: () => canWithdrawTimebasedItem(new Date("2024-08-01")),
  "Bullseye Board": () => canWithdrawTimebasedItem(new Date("2024-08-01")),
  "Twister Rug": () => true,

  "Hapy Jar": () => canWithdrawTimebasedItem(new Date("2024-09-01")),
  "Duamutef Jar": () => canWithdrawTimebasedItem(new Date("2024-10-01")),
  "Qebehsenuef Jar": () => canWithdrawTimebasedItem(new Date("2024-11-01")),
  "Imsety Jar": () => canWithdrawTimebasedItem(new Date("2024-09-01")),
  Cannonball: () => canWithdrawTimebasedItem(new Date("2024-09-01")),
  Sarcophagus: () => canWithdrawTimebasedItem(new Date("2024-09-01")),
  "Clay Tablet": () => canWithdrawTimebasedItem(new Date("2024-10-01")),
  "Snake in Jar": () => canWithdrawTimebasedItem(new Date("2024-10-01")),
  "Reveling Lemon": () => canWithdrawTimebasedItem(new Date("2024-10-01")),
  "Anubis Jackal": () => canWithdrawTimebasedItem(new Date("2024-10-01")),
  Sundial: () => canWithdrawTimebasedItem(new Date("2024-11-01")),
  "Sand Golem": () => canWithdrawTimebasedItem(new Date("2024-11-01")),
  "Cactus King": () => canWithdrawTimebasedItem(new Date("2024-11-01")),
  "Lemon Frog": () => canWithdrawTimebasedItem(new Date("2024-11-01")),
  "Scarab Beetle": () => canWithdrawTimebasedItem(new Date("2024-11-01")),
  "Tomato Bombard": () => hasSeasonEnded("Pharaoh's Treasure"),
};

const greenHouseFruitSeed: Record<GreenHouseFruitSeedName, () => boolean> = {
  "Grape Seed": () => false,
};

const greenHouseFruit: Record<GreenHouseFruitName, () => boolean> = {
  Grape: () => false,
};

const greenHouseCropSeed: Record<GreenHouseCropSeedName, () => boolean> = {
  "Olive Seed": () => false,
  "Rice Seed": () => false,
};

const greenHouseCrop: Record<GreenHouseCropName, () => boolean> = {
  Olive: () => false,
  Rice: () => false,
};

const factionShopCollectibles: Record<
  FactionShopCollectibleName,
  () => boolean
> = {
  "Sunflorian Throne": () => false,
  "Nightshade Throne": () => false,
  "Goblin Throne": () => false,
  "Bumpkin Throne": () => false,
  "Golden Sunflorian Egg": () => false,
  "Goblin Mischief Egg": () => false,
  "Bumpkin Charm Egg": () => false,
  "Nightshade Veil Egg": () => false,
  "Emerald Goblin Goblet": () => false,
  "Opal Sunflorian Goblet": () => false,
  "Sapphire Bumpkin Goblet": () => false,
  "Amethyst Nightshade Goblet": () => false,
  "Golden Faction Goblet": () => false,
  "Ruby Faction Goblet": () => false,
  "Sunflorian Bunting": () => false,
  "Nightshade Bunting": () => false,
  "Goblin Bunting": () => false,
  "Bumpkin Bunting": () => false,
  "Sunflorian Candles": () => false,
  "Nightshade Candles": () => false,
  "Goblin Candles": () => false,
  "Bumpkin Candles": () => false,
  "Sunflorian Left Wall Sconce": () => false,
  "Nightshade Left Wall Sconce": () => false,
  "Goblin Left Wall Sconce": () => false,
  "Bumpkin Left Wall Sconce": () => false,
  "Sunflorian Right Wall Sconce": () => false,
  "Nightshade Right Wall Sconce": () => false,
  "Goblin Right Wall Sconce": () => false,
  "Bumpkin Right Wall Sconce": () => false,
  "Gourmet Hourglass": () => false,
  "Harvest Hourglass": () => false,
  "Timber Hourglass": () => false,
  "Ore Hourglass": () => false,
  "Orchard Hourglass": () => false,
  "Blossom Hourglass": () => false,
  "Fisher's Hourglass": () => false,
  "Bumpkin Faction Rug": () => false,
  "Goblin Faction Rug": () => false,
  "Nightshade Faction Rug": () => false,
  "Sunflorian Faction Rug": () => false,
};

const factionShopFood: Record<FactionShopFoodName, () => boolean> = {
  Caponata: () => false,
  "Glazed Carrots": () => false,
  Paella: () => false,
};

const mutantFlowers: Record<MutantFlowerName, () => boolean> = {
  "Desert Rose": () =>
    canWithdrawTimebasedItem(SEASONS["Pharaoh's Treasure"].endDate),
};

export const WITHDRAWABLES: Record<InventoryItemName, () => boolean> = {
  ...greenHouseCrop,
  ...greenHouseCropSeed,
  ...greenHouseFruitSeed,
  ...greenHouseFruit,
  ...crops,
  ...fruits,
  ...flowers,
  ...cropSeeds,
  ...fruitSeed,
  ...flowerSeed,
  ...beans,
  ...questItems,
  ...warTentItems,
  ...tools,
  ...treasureTools,
  ...food,
  ...factionShopFood,
  ...warBanners,
  ...heliosBlacksmith,
  ...commodities,
  ...mutantChickens,
  ...flags,
  ...easterEggs,
  ...mutantCrop,
  ...mutantFlowers,
  ...specialEvents,
  ...points,
  ...goblinBlacksmith,
  ...soldOut,
  ...travelingSalesmanItems,
  ...blacksmithItems,
  ...treasureCollectible,
  ...barnItems,
  ...animals,
  ...achievementDecoration,
  ...market,
  ...boostTreasure,
  ...goblinPirate,
  ...treasureDecoration,
  ...eventDecoration,
  ...seasonalDecorations,
  ...beachBounty,
  ...resources,
  ...purchasables,
  "Basic Land": () => false,
  ...lanterns,
  ...megastore,

  // non-withdrawables
  ...skills,
  ...coupons,
  ...buildings,
  ...fertilisers,
  ...consumables,
  ...decorations,
  ...potionHouse,
  ...exoticCrops,
  ...bait,
  ...compost,
  ...fish,
  ...interiors,
  ...factionBanners,
  ...factionShopCollectibles,

  ...getKeys(DECORATION_TEMPLATES).reduce(
    (acc, key) => ({
      ...acc,
      [key]: DECORATION_TEMPLATES[key]?.isWithdrawable ?? (() => false),
    }),
    {} as Record<TemplateDecorationName, () => boolean>,
  ),
};

export const BUMPKIN_WITHDRAWABLES: Record<
  BumpkinItem,
  (state?: GameState) => boolean
> = {
  "Festival of Colors Background": () => true,
  "Painter's Cap": () => true,
  "Gift Giver": () => false,
  "Beige Farmer Potion": () => false,
  "Dark Brown Farmer Potion": () => false,
  "Light Brown Farmer Potion": () => false,
  "Goblin Potion": () => false,
  "Basic Hair": () => false,
  "Rancher Hair": () => false,
  "Explorer Hair": () => false,
  "Red Farmer Shirt": () => false,
  "Yellow Farmer Shirt": () => false,
  "Blue Farmer Shirt": () => false,
  "Chef Apron": () => true,
  "Warrior Shirt": () => true,
  "Farmer Overalls": () => false,
  "Lumberjack Overalls": () => false,
  "Farmer Pants": () => false,
  "Warrior Pants": () => true,
  "Black Farmer Boots": () => true,
  "Farmer Pitchfork": () => true,
  "Farmer Hat": () => true,
  "Chef Hat": () => true,
  "Warrior Helmet": () => true,
  "Sunflower Amulet": (state) =>
    canWithdrawBoostedWearable("Sunflower Amulet", state),
  "Carrot Amulet": (state) =>
    canWithdrawBoostedWearable("Carrot Amulet", state),
  "Beetroot Amulet": (state) =>
    canWithdrawBoostedWearable("Beetroot Amulet", state),
  "Green Amulet": (state) => canWithdrawBoostedWearable("Green Amulet", state),
  "Sunflower Shield": () => true,
  "Farm Background": () => true,
  "Fancy Top": () => true,
  "Brown Boots": () => true,
  "Brown Suspenders": () => true,
  "Fancy Pants": () => true,
  "Maiden Skirt": () => true,
  "Maiden Top": () => true,
  "Peasant Skirt": () => true,
  "SFL T-Shirt": () => true,
  "Yellow Boots": () => true,
  "Buzz Cut": () => false,
  "Parlour Hair": () => true,
  Axe: () => true,
  Sword: () => true,
  "Blue Suspenders": () => true,
  "Forest Background": () => true,
  "Seashore Background": () => true,
  Blondie: () => true,
  "Brown Long Hair": () => true,
  "Sun Spots": () => true,
  "White Long Hair": () => true,
  "Cemetery Background": () => true,
  "Teal Mohawk": () => true,
  "Space Background": () => true,
  Parsnip: (state) => canWithdrawBoostedWearable("Parsnip", state),
  "Jail Background": () => true,
  "Golden Spatula": () => true,
  "Artist Scarf": () => true,
  "Bumpkin Art Competition Merch": () => true,
  "Project Dignity Hoodie": () => true,
  "Developer Hoodie": () => true,
  "Blacksmith Hair": () => true,
  Hammer: () => true,
  "Bumpkin Boots": () => true,
  "Fire Shirt": () => true,
  "Red Long Hair": () => true,
  "Snowman Onesie": () => true,
  "Reindeer Suit": () => true,
  "Shark Onesie": () => true,
  "Christmas Background": () => true,
  "Devil Wings": (state) => canWithdrawBoostedWearable("Devil Wings", state),
  "Angel Wings": (state) => canWithdrawBoostedWearable("Angel Wings", state),
  "Fire Hair": () => true,
  "Luscious Hair": () => true,
  "Ancient War Hammer": () => true,
  "Ancient Goblin Sword": () => true,
  "Mountain View Background": () => true,
  "Skull Hat": () => true,
  "Reindeer Antlers": () => true,
  "Santa Hat": () => true,
  "Pineapple Shirt": () => true,
  "China Town Background": () => true,
  "Lion Dance Mask": () => true,
  "Fruit Picker Shirt": () => false,
  "Fruit Picker Apron": () => false,
  "Fruit Bowl": () => false,
  "Striped Blue Shirt": () => false,
  "Peg Leg": () => false,
  "Pirate Potion": () => false,
  "Pirate Hat": () => false,
  "Pirate General Coat": () => true,
  "Pirate Pants": () => true,
  "Pirate Leather Polo": () => true,
  "Crab Claw": () => true,
  "Pirate Scimitar": () => true,
  "Cupid Hair": () => true,
  "Cupid Dress": () => true,
  "Cupid Sandals": () => true,
  "Love Quiver": () => true,
  "SFL Office Background": () => true,
  "Bumpkin Puppet": () => true,
  "Goblin Puppet": () => true,
  "Hawaiian Shirt": () => true,
  "Bear Onesie": () => true,
  "Frog Onesie": () => true,
  "Tiger Onesie": () => true,
  "Beach Sarong": () => true,
  "Lifeguard Hat": () => false, // Not Launch
  "Lifeguard Pants": () => false, // Not Launch
  "Lifeguard Shirt": () => false, // Not Launch
  "Sleeping Otter": () => true,
  "Tropical Sarong": () => true,
  "Sequence Hat": () => true,
  "Sequence Shirt": () => true,
  "St Patricks Hat": () => true,
  "Bunny Onesie": () => true,
  "Light Brown Worried Farmer Potion": () => false, // Not Launched
  "Polkastarter Shirt": () => true,
  "Beach Trunks": () => false, // No Launched
  "Club Polo": () => true,
  "Dawn Breaker Background": () => true,
  "Dawn Lamp": () => true,
  "Eggplant Onesie": (state) =>
    canWithdrawBoostedWearable("Eggplant Onesie", state),
  "Fox Hat": () => true,
  "Grave Diggers Shovel": () => true,
  "Infected Potion": () => true,
  "Mushroom Hat": () => true,
  "Mushroom Lamp": () => false, // Not Launched
  "Mushroom Lights Background": () => false, // Not Launched
  "Mushroom Pants": () => false, // Not Launched
  "Mushroom Shield": () => true,
  "Mushroom Shoes": () => true,
  "Mushroom Sweater": () => true,
  "Rash Vest": () => false, // Not Launched
  "Squid Hat": () => true,
  "Summer Top": () => true,
  "Sunburst Potion": () => true,
  "Water Gun": () => false, // Not Launched
  "Wavy Pants": () => false, // Not Launched
  "White Turtle Neck": () => true,
  "Trial Tee": () => false,
  "Auction Megaphone": () => false, // Not Launched
  "Auctioneer Slacks": () => false, // Not Launched
  "Bidder's Brocade": () => false, // Not Launched
  "Harry's Hat": () => true,
  "Leather Shoes": () => false, // Not Launched
  "Tangerine Hair": () => false, // Not Launched
  "Straw Hat": () => true,
  "Traveller's Backpack": () => false, // Not Launched
  "Traveller's Pants": () => false, // Not Launched
  "Traveller's Shirt": () => false, // Not Launched
  "Witching Wardrobe": () => true,
  "Witch's Broom": () => true,
  "Infernal Bumpkin Potion": () => true,
  "Infernal Goblin Potion": () => true,
  "Imp Costume": () => true,
  "Ox Costume": () => true,
  "Luna's Hat": (state) => canWithdrawBoostedWearable("Luna's Hat", state),
  "Infernal Pitchfork": (state) =>
    canWithdrawBoostedWearable("Infernal Pitchfork", state), // Auction
  "Infernal Horns": () => true,
  Cattlegrim: (state) => canWithdrawBoostedWearable("Cattlegrim", state), // Auction
  "Crumple Crown": () => true,
  "Merch Bucket Hat": () => false,
  "Merch Coffee Mug": () => false,
  "Dawn Breaker Tee": () => false,
  "Merch Tee": () => false,
  "Merch Hoodie": () => false,
  "Birthday Hat": () => false,
  "Double Harvest Cap": () => false,
  "Streamer Helmet": () => false,
  "Corn Onesie": (state) => canWithdrawBoostedWearable("Corn Onesie", state),
  "Crow Wings": () => true,
  "Witches' Eve Tee": () => false,
  "Wise Beard": () => false, // Not Launched
  "Pumpkin Hat": () => false, // Not Launched
  "Wise Book": () => false, // Not Launched
  "Wise Hair": () => false, // Not Launched
  "Wise Robes": () => false, // Not Launched
  "Wise Slacks": () => false, // Not Launched
  "Wise Staff": () => false, // Not Launched
  "Greyed Glory": () => false, // Not Launched
  "Tattered Jacket": () => false, // Not Launched
  "Hoary Chin": () => false, // Not Launched
  "Tattered Slacks": () => false, // Not Launched
  "Old Shoes": () => false, // Not Launched
  "Bat Wings": () => false, // Not Launched
  "Gothic Twilight": () => false, // Not Launched
  "Dark Enchantment Gown": () => false, // Not Launched
  "Goth Hair": () => false, // Not Launched
  "Pale Potion": () => true,
  "Stretched Jeans": () => false, // Not Launched
  "Skull Shirt": () => true, // Halloween is over
  "Victorian Hat": () => false, // Not Launched
  "Boater Hat": () => false, // Not Launched
  "Antique Dress": () => false, // Not Launched
  "Crimson Skirt": () => false, // Not Launched
  "Chic Gala Blouse": () => false, // Not Launched
  "Ash Ponytail": () => false, // Not Launched
  "Pink Ponytail": () => false, // Not Launched
  "Silver Streaks": () => false, // Not Launched,
  "Brown Rancher Hair": () => false,
  "Parsnip Horns": () => true, // Released 24/11/23
  "Potato Suit": () => false,
  "Whale Hat": () => true,
  "Pumpkin Shirt": () => true,
  Halo: () => false,
  Kama: () => true,
  "Grey Merch Hoodie": () => false,
  "Unicorn Horn": () => true,
  "Unicorn Hat": () => false,
  "Feather Hat": () => true,
  "Valoria Wreath": () => true,
  "Earn Alliance Sombrero": () => true,
  "Fresh Catch Vest": () => true,
  "Fish Pro Vest": () => true,
  "Reel Fishing Vest": () => true,
  "Clown Shirt": () => true,
  "Luminous Anglerfish Topper": () => false,
  "Abyssal Angler Hat": () => true,
  Harpoon: () => false,
  "Ancient Rod": (state) => canWithdrawBoostedWearable("Ancient Rod", state),
  "Fishing Hat": () => false,
  Trident: () => false,
  "Bucket O' Worms": () => false,
  "Coconut Mask": () => false,
  "Crab Trap": () => canWithdrawTimebasedItem(new Date("2024-09-01")),
  "Seaside Tank Top": () => true,
  "Fish Trap": () => false,
  "Fishing Pants": () => true,
  "Angler Waders": () => false,
  "Fishing Spear": () => true,
  "Flip Flops": () => true,
  Wellies: () => true,
  "Saw Fish": () => true,
  "Skinning Knife": () => true,
  "Sunflower Rod": () => false,
  "Tackle Box": () => true,
  "Infernal Rod": () => true,
  "Mermaid Potion": () => false,
  "Squirrel Monkey Potion": () => false,
  "Koi Fish Hat": () => true,
  "Normal Fish Hat": () => true,
  "Stockeye Salmon Onesie": () => true,
  "Tiki Armor": () => true,
  "Tiki Mask": () => true,
  "Tiki Pants": () => true,
  "Banana Amulet": (state) =>
    canWithdrawBoostedWearable("Banana Amulet", state),
  "Banana Onesie": (state) =>
    canWithdrawBoostedWearable("Banana Onesie", state),
  "Basic Dumbo": () => false,
  "Companion Cap": () => false,
  "Dazzling Dumbo": () => false,
  "Deep Sea Helm": () => false,
  "Gloomy Dumbo": () => false,
  "Pickaxe Shark": () => false,
  "Seedling Hat": () => false,
  "Stormy Dumbo": () => false,
  "Ugly Christmas Sweater": () => true,
  "Candy Cane": () => true,
  "Elf Hat": () => true,
  "Elf Potion": () =>
    canWithdrawTimebasedItem(SEASONS["Pharaoh's Treasure"].endDate),
  "Elf Shoes": () => false,
  "Elf Suit": () => true,
  "Santa Beard": () => true,
  "Santa Suit": () => true,

  "Butterfly Wings": () => true,
  "Cozy Hoodie": () => false,
  "New Years Tiara": () => true,
  "Northern Lights Background": () => false,
  "Short Shorts": () => false,
  "Winter Jacket": () => false,

  // Spring Blossom
  "Beehive Staff": () => true,
  "Bee Smoker": () => true,
  "Bee Suit": (state) => canWithdrawBoostedWearable("Bee Suit", state),
  "Bee Wings": () => true,
  "Beekeeper Hat": (state) =>
    canWithdrawBoostedWearable("Beekeeper Hat", state),
  "Beekeeper Suit": () => true,
  "Crimstone Boots": () => true,
  "Crimstone Pants": () => true,
  "Crimstone Armor": (state) =>
    canWithdrawBoostedWearable("Crimstone Armor", state),
  "Gardening Overalls": () => true,
  "Crimstone Hammer": (state) =>
    canWithdrawBoostedWearable("Crimstone Hammer", state),
  "Crimstone Amulet": (state) =>
    canWithdrawBoostedWearable("Crimstone Amulet", state),
  "Full Bloom Shirt": () => true,
  "Blue Blossom Shirt": () => true,
  "Fairy Sandals": () => false,
  "Daisy Tee": () => true,
  "Propeller Hat": () => true,
  "Honeycomb Shield": (state) =>
    canWithdrawBoostedWearable("Honeycomb Shield", state), // Last Auction 2024/04/09 5pm UTC
  "Hornet Mask": (state) => canWithdrawBoostedWearable("Hornet Mask", state),
  "Flower Crown": (state) => canWithdrawBoostedWearable("Flower Crown", state),
  "Blue Monarch Dress": () => true,
  "Green Monarch Dress": () => false,
  "Orange Monarch Dress": () => true,
  "Blue Monarch Shirt": () => true,
  "Green Monarch Shirt": () => false,
  "Orange Monarch Shirt": () => true,
  "Queen Bee Crown": () => true,
  "Rose Dress": () => false,
  "Blue Rose Dress": () => false,

  "Lucky Red Hat": () => true,
  "Lucky Red Suit": () => true,
  "Chicken Hat": () => true,

  "Love's Topper": () => true,
  "Valentine's Field Background": () => true,

  "Striped Red Shirt": () => true,
  "Striped Yellow Shirt": () => true,

  // Clash of Factions Auction
  "Non La Hat": (state) => canWithdrawBoostedWearable("Non La Hat", state), // Last Auction 2024/06/29
  "Oil Can": (state) =>
    canWithdrawTimebasedItem(new Date("2024-07-18")) &&
    canWithdrawBoostedWearable("Oil Can", state), // Last Auction 2024/07/17
  "Olive Shield": (state) => canWithdrawBoostedWearable("Olive Shield", state), // Last Auction 2024/07/05
  "Paw Shield": () => canWithdrawTimebasedItem(new Date("2024-07-24")), // Last Auction 2024/07/23
  Pan: () => canWithdrawTimebasedItem(new Date("2024-07-21")), // Last Auction 2024/07/20
  // Clash of Factions Megastore
  "Royal Robe": () => true,
  Crown: () => true,
  "Soybean Onesie": () => canWithdrawTimebasedItem(new Date("2024-08-01")),
  "Tofu Mask": (state) => canWithdrawBoostedWearable("Tofu Mask", state),
  "Olive Royalty Shirt": (state) =>
    canWithdrawBoostedWearable("Olive Royalty Shirt", state),
  "Royal Scepter": () => false,

  // Faction Items
  "Bumpkin Armor": () => false,
  "Bumpkin Helmet": () => false,
  "Bumpkin Sword": () => false,
  "Bumpkin Sabatons": () => false,
  "Bumpkin Pants": () => false,
  "Goblin Armor": () => false,
  "Goblin Helmet": () => false,
  "Goblin Axe": () => false,
  "Goblin Sabatons": () => false,
  "Goblin Pants": () => false,
  "Nightshade Armor": () => false,
  "Nightshade Helmet": () => false,
  "Nightshade Sword": () => false,
  "Nightshade Sabatons": () => false,
  "Nightshade Pants": () => false,
  "Sunflorian Armor": () => false,
  "Sunflorian Helmet": () => false,
  "Sunflorian Sword": () => false,
  "Sunflorian Sabatons": () => false,
  "Sunflorian Pants": () => false,

  "Cap n Bells": () => false,
  "Knight Gambit": () => false,
  "Pixel Perfect Hoodie": () => false,
  "Queen's Crown": () => false,
  "Royal Dress": () => false,
  Motley: () => false,
  "Royal Braids": () => false,

  // Pharaoh's Treasure
  "Pharaoh Headdress": () => canWithdrawTimebasedItem(new Date("2024-09-01")),
  "Camel Onesie": (state) =>
    canWithdrawTimebasedItem(new Date("2024-10-01")) &&
    canWithdrawBoostedWearable("Camel Onesie", state),
  "Explorer Shirt": () => canWithdrawTimebasedItem(new Date("2024-09-01")),
  "Explorer Shorts": () => canWithdrawTimebasedItem(new Date("2024-10-01")),
  "Oil Overalls": (state) =>
    canWithdrawTimebasedItem(new Date("2024-10-27")) &&
    canWithdrawBoostedWearable("Oil Overalls", state), // Last Auction 27th October
  "Dev Wrench": (state) =>
    canWithdrawTimebasedItem(new Date("2024-10-18")) &&
    canWithdrawBoostedWearable("Dev Wrench", state), // Last Auction 17 October
  "Rock Hammer": () => canWithdrawTimebasedItem(new Date("2024-11-01")),
  "Explorer Hat": () => canWithdrawTimebasedItem(new Date("2024-10-01")),
  "Oil Protection Hat": () => false,
  "Amber Amulet": () => canWithdrawTimebasedItem(new Date("2024-09-01")),
  "Sun Scarab Amulet": () => false,
  "Desert Background": () => canWithdrawTimebasedItem(new Date("2024-09-30")), // Last Auction 29th September
  "Desert Merchant Turban": () => false,
  "Desert Merchant Shoes": () => false,
  "Desert Merchant Suit": () => false,
  "Desert Camel Background": () =>
    canWithdrawTimebasedItem(new Date("2024-11-01")),
  "Water Gourd": () => canWithdrawTimebasedItem(new Date("2024-09-01")),
  "Rocket Onesie": () => false,
  "Coin Aura": () => false,
  "Ankh Shirt": () => canWithdrawTimebasedItem(new Date("2024-10-01")),
  "Ancient Shovel": (state) =>
    canWithdrawTimebasedItem(new Date("2024-10-24")) &&
    canWithdrawBoostedWearable("Ancient Shovel", state), // Last Auction 23rd October
  "Infernal Drill": (state) =>
    canWithdrawTimebasedItem(new Date("2024-10-21")) &&
    canWithdrawBoostedWearable("Infernal Drill", state), // Last Auction 20th October
  "Lemon Shield": (state) =>
    canWithdrawTimebasedItem(new Date("2024-10-12")) &&
    canWithdrawBoostedWearable("Lemon Shield", state), // Last Auction 11th October
  "Scarab Wings": () => hasSeasonEnded("Pharaoh's Treasure"),
  "Bionic Drill": () => false,
  "Grape Pants": (state) =>
    canWithdrawBoostedWearable("Grape Pants", state) &&
    hasSeasonEnded("Pharaoh's Treasure"),
  "Fossil Head": () => canWithdrawTimebasedItem(new Date("2024-10-03")), // Last Auction 2nd October

  //Kingdom Shop Items
  "Bumpkin Crown": () => false,
  "Goblin Crown": () => false,
  "Nightshade Crown": () => false,
  "Sunflorian Crown": () => false,
  "Bumpkin Shield": () => false,
  "Goblin Shield": () => false,
  "Nightshade Shield": () => false,
  "Sunflorian Shield": () => false,
  "Bumpkin Quiver": () => false,
  "Goblin Quiver": () => false,
  "Nightshade Quiver": () => false,
  "Sunflorian Quiver": () => false,
  "Bumpkin Medallion": () => false,
  "Goblin Medallion": () => false,
  "Nightshade Medallion": () => false,
  "Sunflorian Medallion": () => false,

  // Map Background
  "Pumpkin Plaza Background": () => false,
  "Goblin Retreat Background": () => false,
  "Kingdom Background": () => false,

  //Gam3s Cap
  "Gam3s Cap": () => false,
};
