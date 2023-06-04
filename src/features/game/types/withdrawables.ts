import { GoblinState } from "features/game/lib/goblinMachine";
import { CHICKEN_TIME_TO_EGG } from "features/game/lib/constants";
import { CROP_SEEDS, CropName, CropSeedName } from "./crops";
import { FruitName, FruitSeedName } from "./fruits";
import {
  Animal,
  BarnItem,
  Food,
  Lantern,
  LegacyItem,
  MOMEventItem,
  MarketItem,
  MutantChicken,
  QuestItem,
  Shovel,
  ToolName,
  TravelingSalesmanItem,
} from "./craftables";
import {
  Coupons,
  EasterEgg,
  FertiliserName,
  Inventory,
  InventoryItemName,
  Points,
  SpecialEvent,
} from "./game";
import { getKeys } from "./craftables";
import { canChop } from "../events/landExpansion/chop";
import { canMine } from "../events/landExpansion/stoneMine";
import { AchievementName } from "./achievements";
import { BeanName, MutantCropName } from "./beans";
import { WarTentItem } from "./craftables";
import { TreasureToolName } from "./tools";
import {
  GoblinBlacksmithItemName,
  GoblinPirateItemName,
  HeliosBlacksmithItem,
  SeasonPassName,
  SoldOutCollectibleName,
} from "./collectibles";
import { CommodityName, ResourceName } from "./resources";
import { Flag } from "./flags";
import { SkillName } from "./skills";
import { BuildingName } from "./buildings";
import { ConsumableName } from "./consumables";
import {
  AchievementDecorationName,
  EventDecorationName,
  SeasonalDecorationName,
  ShopDecorationName,
} from "./decorations";
import { AuctioneerItemName } from "./auctioneer";
import {
  BeachBountyTreasure,
  BoostTreasure,
  DecorationTreasure,
} from "./treasure";
import { WorkbenchToolName } from "./tools";

type WithdrawCondition = boolean | ((gameState: GoblinState) => boolean);

// Helps build withdraw rules for item groups
function buildDefaults<T extends InventoryItemName>(
  itemNames: T[],
  withdrawCondition: WithdrawCondition
): Record<T, WithdrawCondition> {
  return itemNames.reduce(
    (prev, cur) => ({
      ...prev,
      [cur]: withdrawCondition,
    }),
    {} as Record<T, WithdrawCondition>
  );
}

// Helper functions
type CanWithdrawArgs = {
  item: InventoryItemName;
  game: GoblinState;
};

function cropIsPlanted({ item, game }: CanWithdrawArgs): boolean {
  return Object.values(game.crops ?? {}).some(
    (plot) => plot.crop && plot.crop.name === item
  );
}

function areFruitsGrowing(game: GoblinState, fruit: FruitName): boolean {
  return Object.values(game.fruitPatches ?? {}).some(
    (patch) => patch.fruit?.name === fruit
  );
}

function hasSeeds(inventory: Inventory) {
  return getKeys(inventory).some((name) => name in CROP_SEEDS());
}

function areAnyCropsPlanted(game: GoblinState): boolean {
  return Object.values(game.crops ?? {}).some((plot) => !!plot.crop);
}

function areAnyTreesChopped(game: GoblinState): boolean {
  return Object.values(game.trees ?? {}).some((tree) => !canChop(tree));
}

function areAnyStonesMined(game: GoblinState): boolean {
  return Object.values(game.stones ?? {}).some((stone) => !canMine(stone));
}

function areAnyIronsMined(game: GoblinState): boolean {
  return Object.values(game.iron ?? {}).some((iron) => !canMine(iron));
}

function areAnyGoldsMined(game: GoblinState): boolean {
  return Object.values(game.gold ?? {}).some((gold) => !canMine(gold));
}

function areAnyChickensFed(game: GoblinState): boolean {
  return Object.values(game.chickens).some(
    (chicken) =>
      chicken.fedAt && Date.now() - chicken.fedAt < CHICKEN_TIME_TO_EGG
  );
}

function areAnyTreasureHolesDug(game: GoblinState): boolean {
  return Object.values(game.treasureIsland?.holes ?? {}).some((hole) => {
    const today = new Date().toISOString().substring(0, 10);

    return new Date(hole.dugAt).toISOString().substring(0, 10) == today;
  });
}

function hasCompletedAchievement(
  game: GoblinState,
  achievement: AchievementName
): boolean {
  return Object.keys(game.bumpkin?.achievements ?? []).includes(achievement);
}

const cropSeeds: Record<CropSeedName, boolean> = {
  "Beetroot Seed": false,
  "Cabbage Seed": false,
  "Carrot Seed": false,
  "Cauliflower Seed": false,
  "Kale Seed": false,
  "Potato Seed": false,
  "Pumpkin Seed": false,
  "Sunflower Seed": false,
  "Parsnip Seed": false,
  "Eggplant Seed": false,
  "Radish Seed": false,
  "Wheat Seed": false,
};

const fruitSeed: Record<FruitSeedName, boolean> = {
  "Apple Seed": false,
  "Blueberry Seed": false,
  "Orange Seed": false,
};
const crops: Record<CropName, boolean> = {
  Beetroot: true,
  Cabbage: true,
  Carrot: true,
  Cauliflower: true,
  Kale: true,
  Potato: true,
  Pumpkin: true,
  Sunflower: true,
  Parsnip: true,
  Eggplant: false,
  Radish: true,
  Wheat: true,
};

const fruits: Record<FruitName, boolean> = {
  Apple: true,
  Blueberry: true,
  Orange: true,
};

const beans: Record<BeanName, boolean> = {
  "Golden Bean": false,
  "Magic Bean": false,
  "Shiny Bean": false,
};

const questItems: Record<QuestItem, boolean> = {
  "Ancient Goblin Sword": false,
  "Ancient Human Warhammer": false,
  "Goblin Key": false,
  "Sunflower Key": false,
};

const warTentItems: Record<WarTentItem, WithdrawCondition> = {
  "Beetroot Amulet": false,
  "Carrot Amulet": false,
  "Sunflower Amulet": false,
  "Green Amulet": false,
  "Skull Hat": false,
  "Sunflower Shield": false,
  "Undead Rooster": (game) => !areAnyChickensFed(game),
  "War Skull": true,
  "War Tombstone": true,
  "Warrior Helmet": false,
  "Warrior Pants": false,
  "Warrior Shirt": false,
};

const tools: Record<ToolName | WorkbenchToolName | Shovel, boolean> = {
  Axe: false,
  Hammer: false,
  Pickaxe: false,
  "Rusty Shovel": false,
  "Iron Pickaxe": false,
  "Stone Pickaxe": false,
  Rod: false,
  Shovel: false,
};

const treasureTools: Record<TreasureToolName, boolean> = {
  "Sand Drill": false,
  "Sand Shovel": false,
};

/* TODO - Split TOOLS into TOOLS and SHOVELS
 * SHOVELS are a separate object in the frontend, but they are
 * part of TOOLS in the backend.
 */

const warBanners = {
  "Human War Banner": false,
  "Goblin War Banner": false,
};

const heliosBlacksmith: Record<HeliosBlacksmithItem, boolean> = {
  "Immortal Pear": false,
  "Treasure Map": false,
  "Basic Scarecrow": false,
};

const commodities: Record<CommodityName, boolean> = {
  // Mushrooms
  "Magic Mushroom": false,
  "Wild Mushroom": false,

  Chicken: false,
  Wood: true,
  Stone: true,
  Iron: true,
  Gold: true,
  Diamond: false,

  Honey: false,
  Egg: true,
};

const resources: Record<ResourceName, boolean> = {
  Tree: false,
  "Stone Rock": false,
  "Iron Rock": false,
  "Gold Rock": false,
  "Crop Plot": false,
  "Fruit Patch": false,
  Boulder: false,
};

const mutantChickens: Record<MutantChicken, WithdrawCondition> = {
  "Ayam Cemani": (game) => !areAnyChickensFed(game),
  "Fat Chicken": (game) => !areAnyChickensFed(game),
  "Rich Chicken": (game) => !areAnyChickensFed(game),
  "Speed Chicken": (game) => !areAnyChickensFed(game),
};

const flags: Record<Flag, boolean> = {
  "Australian Flag": true,
  "Belgian Flag": true,
  "Brazilian Flag": true,
  "Chinese Flag": true,
  "Finnish Flag": true,
  "French Flag": true,
  "German Flag": true,
  "Indonesian Flag": true,
  "Indian Flag": true,
  "Iranian Flag": true,
  "Italian Flag": true,
  "Japanese Flag": true,
  "Moroccan Flag": true,
  "Dutch Flag": true,
  "Philippine Flag": true,
  "Polish Flag": true,
  "Portuguese Flag": true,
  "Russian Flag": true,
  "Saudi Arabian Flag": true,
  "South Korean Flag": true,
  "Spanish Flag": true,
  "Sunflower Flag": true,
  "Thai Flag": true,
  "Turkish Flag": true,
  "Ukrainian Flag": true,
  "American Flag": true,
  "Vietnamese Flag": true,
  "Canadian Flag": true,
  "Singaporean Flag": true,
  "British Flag": true,
  "Sierra Leone Flag": true,
  "Romanian Flag": true,
  "Rainbow Flag": true,
  "Goblin Flag": true,
  "Pirate Flag": true,
  "Algerian Flag": true,
  "Mexican Flag": true,
  "Dominican Republic Flag": true,
  "Argentinian Flag": true,
  "Lithuanian Flag": true,
  "Malaysian Flag": true,
  "Colombian Flag": true,
};

const easterEggs: Record<EasterEgg, boolean> = {
  "Blue Egg": false,
  "Green Egg": false,
  "Orange Egg": false,
  "Pink Egg": false,
  "Purple Egg": false,
  "Red Egg": false,
  "Yellow Egg": false,
};

const skills: Record<SkillName, boolean> = {
  "Green Thumb": false,
  "Barn Manager": false,
  "Seed Specialist": false,
  Wrangler: false,
  Lumberjack: false,
  Prospector: false,
  Logger: false,
  "Gold Rush": false,
  Artist: false,
  Coder: false,
  "Liquidity Provider": false,
  "Discord Mod": false,
  Warrior: false,
};

const coupons: Record<Coupons, boolean> = {
  "Trading Ticket": false,
  "War Bond": false,
  "Jack-o-lantern": false,
  "Golden Crop": false,
  "Beta Pass": false,
  "Red Envelope": false,
  "Love Letter": false,
  "Block Buck": false,
  "Solar Flare Ticket": false,
  "Dawn Breaker Ticket": false,
  "Sunflower Supporter": false,
};

const buildings: Record<BuildingName, boolean> = {
  "Town Center": false,
  "Fire Pit": false,
  Market: false,
  Workbench: false,
  Kitchen: false,
  Tent: false,
  "Water Well": false,
  Bakery: false,
  "Hen House": false,
  Deli: false,
  "Smoothie Shack": false,
  Toolshed: false,
  Warehouse: false,
};

const fertilisers: Record<FertiliserName, boolean> = {
  "Rapid Growth": false,
};

const food: Record<Food, boolean> = {
  "Beetroot Cake": false,
  "Cabbage Cake": false,
  "Carrot Cake": false,
  "Cauliflower Cake": false,
  "Potato Cake": false,
  "Pumpkin Cake": false,
  "Sunflower Cake": false,
  "Parsnip Cake": false,
  "Radish Cake": false,
  "Wheat Cake": false,
  "Pumpkin Soup": false,
  "Radish Pie": false,
  "Roasted Cauliflower": false,
  Sauerkraut: false,
};

const consumables: Record<ConsumableName, boolean> = {
  "Mashed Potato": false,
  "Pumpkin Soup": false,
  "Bumpkin Broth": false,
  "Boiled Eggs": false,
  "Mushroom Soup": false,
  "Roast Veggies": false,
  "Bumpkin Salad": false,
  "Cauliflower Burger": false,
  "Mushroom Jacket Potatoes": false,
  "Goblin's Treat": false,
  "Club Sandwich": false,
  "Kale Stew": false,
  Pancakes: false,
  "Kale & Mushroom Pie": false,
  "Fermented Carrots": false,
  Sauerkraut: false,
  "Blueberry Jam": false,
  "Apple Pie": false,
  "Orange Cake": false,
  "Honey Cake": false,
  "Sunflower Crunch": false,
  "Reindeer Carrot": false,
  "Sunflower Cake": false,
  "Potato Cake": false,
  "Pumpkin Cake": false,
  "Carrot Cake": false,
  "Cabbage Cake": false,
  "Beetroot Cake": false,
  "Cauliflower Cake": false,
  "Parsnip Cake": false,
  "Radish Cake": false,
  "Wheat Cake": false,
  "Apple Juice": false,
  "Orange Juice": false,
  "Purple Smoothie": false,
  "Power Smoothie": false,
  "Bumpkin Detox": false,
  "Bumpkin Roast": false,
  "Goblin Brunch": false,
  "Fruit Salad": false,
  "Kale Omelette": false,
  "Cabbers n Mash": false,
  "Fancy Fries": false,
  "Pirate Cake": false,
};

const decorations: Record<ShopDecorationName, WithdrawCondition> = {
  "White Tulips": false,
  "Potted Sunflower": false,
  "Potted Potato": false,
  "Potted Pumpkin": false,
  Cactus: false,
  "Basic Bear": false,
  "Dirt Path": false,
  Bush: false,
  Shrub: false,
  Fence: false,
  "Bonnie's Tombstone": false,
  "Grubnash's Tombstone": false,
  "Crimson Cap": false,
  "Toadstool Seat": false,
  "Chestnut Fungi Stool": false,
  "Mahogany Cap": false,
  "Pine Tree": false,
  "Stone Fence": false,
};
const seasonalDecorations: Record<SeasonalDecorationName, WithdrawCondition> = {
  Clementine: false,
  Cobalt: false,
  "Dawn Umbrella Seat": false,
  "Eggplant Grill": false,
  "Giant Dawn Mushroom": false,
  "Shroom Glow": false,
};

const mutantCrop: Record<MutantCropName, WithdrawCondition> = {
  "Stellar Sunflower": false,
  "Peaceful Potato": false,
  "Perky Pumpkin": false,
  "Colossal Crop": false,
};

const specialEvents: Record<SpecialEvent | MOMEventItem, WithdrawCondition> = {
  "Chef Apron": false,
  "Chef Hat": false,
  "Engine Core": false,
  Observatory: true,
};

const points: Record<Points, WithdrawCondition> = {
  "Human War Point": false,
  "Goblin War Point": false,
};

const goblinBlacksmith: Record<GoblinBlacksmithItemName, WithdrawCondition> = {
  "Mushroom House": false,
  Obie: false,
  "Purple Trail": false,
  Maximus: false,
};

const animals: Record<Animal, WithdrawCondition> = {
  Cow: false,
  Pig: false,
  Sheep: false,
  Chicken: false,
};

const barnItems: Record<BarnItem, WithdrawCondition> = {
  "Chicken Coop": (game) => !areAnyChickensFed(game),
  "Easter Bunny": (game) => !cropIsPlanted({ item: "Carrot", game }),
  "Farm Cat": true,
  "Farm Dog": true,
  "Gold Egg": (game) => !areAnyChickensFed(game),
  Rooster: (game) => !areAnyChickensFed(game),
};

const blacksmithItems: Record<LegacyItem, WithdrawCondition> = {
  "Sunflower Statue": true,
  "Potato Statue": true,
  "Christmas Tree": true,
  Gnome: true,
  "Sunflower Tombstone": true,
  "Sunflower Rock": true,
  "Goblin Crown": true,
  Fountain: true,
  "Egg Basket": false,

  "Woody the Beaver": (game) => !areAnyTreesChopped(game),
  "Apprentice Beaver": (game) => !areAnyTreesChopped(game),
  "Foreman Beaver": (game) => !areAnyTreesChopped(game),
  "Nyon Statue": true,
  "Homeless Tent": true,
  "Farmer Bath": true,
  "Mysterious Head": true,
  "Rock Golem": (game) => !areAnyStonesMined(game),
  "Tunnel Mole": (game) => !areAnyStonesMined(game),
  "Rocky the Mole": (game) => !areAnyIronsMined(game),
  Nugget: (game) => !areAnyGoldsMined(game),
};

const travelingSalesmanItems: Record<TravelingSalesmanItem, WithdrawCondition> =
  {
    "Christmas Bear": true,
    "Golden Bonsai": true,
    "Victoria Sisters": (game) => !cropIsPlanted({ item: "Pumpkin", game }),
    "Wicker Man": true,
  };

const auctioneer: Record<AuctioneerItemName, WithdrawCondition> = {
  "Peeled Potato": (game) => !cropIsPlanted({ item: "Potato", game }),
  "Christmas Snow Globe": true,
  "Cyborg Bear": true,
  "Wood Nymph Wendy": (game) => !areAnyTreesChopped(game),
};

const soldOut: Record<SoldOutCollectibleName, WithdrawCondition> = {
  "Squirrel Monkey": (game) => !areFruitsGrowing(game, "Orange"),
  "Black Bearry": (game) => !areFruitsGrowing(game, "Blueberry"),
  "Lady Bug": (game) => !areFruitsGrowing(game, "Apple"),
  "Cabbage Boy": (game) => !cropIsPlanted({ item: "Cabbage", game }),
  "Cabbage Girl": (game) => !cropIsPlanted({ item: "Cabbage", game }),
  "Maneki Neko": true,
  "Heart Balloons": true,
  Flamingo: true,
  "Blossom Tree": true,
  "Palm Tree": true,
  "Beach Ball": true,
  "Collectible Bear": true,
  "Pablo The Bunny": (game) => !cropIsPlanted({ item: "Carrot", game }),
  "Easter Bush": true,
  "Giant Carrot": true,

  Hoot: false,
};

const achievementDecoration: Record<
  AchievementDecorationName,
  WithdrawCondition
> = {
  "Chef Bear": true,
  "Construction Bear": true,
  "Angel Bear": true,
  "Badass Bear": true,
  "Bear Trap": true,
  "Brilliant Bear": true,
  "Classy Bear": true,
  "Farmer Bear": true,
  "Sunflower Bear": true,
  "Rich Bear": true,
  "Rainbow Artist Bear": true,
  "Devil Bear": true,
};

const market: Record<MarketItem, WithdrawCondition> = {
  // TODO add rule when beans are introduced
  "Carrot Sword": true,

  "Golden Cauliflower": (game) => !cropIsPlanted({ item: "Cauliflower", game }),
  "Mysterious Parsnip": (game) => !cropIsPlanted({ item: "Parsnip", game }),
  Nancy: (game) => !areAnyCropsPlanted(game),
  Scarecrow: (game) => !areAnyCropsPlanted(game),
  Kuebiko: (game) => !areAnyCropsPlanted(game) && !hasSeeds(game.inventory),
};

const boostTreasure: Record<BoostTreasure, WithdrawCondition> = {
  "Lunar Calendar": (game) => !areAnyCropsPlanted(game),
  "Tiki Totem": (game) => !areAnyTreesChopped(game),
  "Genie Lamp": false,
  Foliant: false,
};

const goblinPirate: Record<GoblinPirateItemName, WithdrawCondition> = {
  "Iron Idol": (game) => !areAnyIronsMined(game),
  "Heart of Davy Jones": (game) => !areAnyTreasureHolesDug(game),
  Karkinos: (game) => !cropIsPlanted({ item: "Cabbage", game }),
  "Emerald Turtle": false,
  "Tin Turtle": false,
};

const treasureDecoration: Record<DecorationTreasure, WithdrawCondition> = {
  "T-Rex Skull": true,
  "Sunflower Coin": true,
  "Pirate Bear": true,
  "Whale Bear": true,

  "Abandoned Bear": false,
  "Dinosaur Bone": false,
  Galleon: false,
  "Golden Bear Head": false,
  "Human Bear": false,
  "Lifeguard Bear": false,
  "Parasaur Skull": false,
  "Skeleton King Staff": false,
  "Snorkel Bear": false,
  "Turtle Bear": false,
  "Goblin Bear": false,
};

const beachBounty: Record<BeachBountyTreasure, WithdrawCondition> = {
  "Pirate Bounty": false,
  Pearl: false,
  Coral: false,
  "Clam Shell": false,
  Pipi: false,
  Starfish: false,
  Seaweed: false,
  "Sea Cucumber": false,
  Crab: false,
  "Wooden Compass": false,
  "Iron Compass": false,
  "Old Bottle": false,
};

const eventDecoration: Record<EventDecorationName, WithdrawCondition> = {
  "Valentine Bear": true,
  "Easter Bear": true,
  "Easter Bush": true,
  "Giant Carrot": true,
  "Genie Bear": false,
};

const lanterns: Record<Lantern, WithdrawCondition> = {
  "Luminous Lantern": false,
  "Radiance Lantern": false,
  "Aurora Lantern": false,
};

const purchasables: Record<SeasonPassName, WithdrawCondition> = {
  "Dawn Breaker Banner": false,
  "Solar Flare Banner": false,
};

export const WITHDRAWABLES: Record<InventoryItemName, WithdrawCondition> = {
  ...crops,
  ...fruits,
  ...cropSeeds,
  ...fruitSeed,
  ...beans,
  ...questItems,
  ...warTentItems,
  ...tools,
  ...treasureTools,
  ...food,
  ...warBanners,
  ...heliosBlacksmith,
  ...commodities,
  ...mutantChickens,
  ...flags,
  ...easterEggs,
  ...mutantCrop,
  ...specialEvents,
  ...points,
  ...goblinBlacksmith,
  ...auctioneer,
  ...soldOut,
  ...travelingSalesmanItems,
  ...blacksmithItems,
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
  "Basic Land": false,
  ...lanterns,

  // non-withdrawables
  ...skills,
  ...coupons,
  ...buildings,
  ...fertilisers,
  ...consumables,
  ...decorations,
};

// Explicit false check is important, as we also want to check if it's a bool.
export const isNeverWithdrawable = (itemName: InventoryItemName) =>
  WITHDRAWABLES[itemName] === false;
