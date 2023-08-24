import Decimal from "decimal.js-light";
import { CropSeedName } from "../types/crops";
import { InventoryItemName, LanternName } from "../types/game";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Flag, FLAGS } from "./flags";
import { marketRate } from "../lib/halvening";
import { LimitedItemType } from ".";
import { DecorationName, DECORATION_DIMENSIONS } from "./decorations";
import { BeanName, MutantCropName } from "./beans";
import {
  GoblinBlacksmithItemName,
  GoblinPirateItemName,
  HeliosBlacksmithItem,
  PotionHouseItemName,
  SeasonPassName,
  SoldOutCollectibleName,
} from "./collectibles";
import { BoostTreasure } from "./treasure";
import { RESOURCE_DIMENSIONS } from "./resources";

export { FLAGS };

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

export type CraftableName =
  | LimitedItemName
  | ToolName
  | CropSeedName
  | Food
  | Animal
  | Flag
  | Shovel
  | TravelingSalesmanItem
  | WarBanner
  | HeliosBlacksmithItem
  // TEMP
  | "Chef Apron";

export interface Craftable {
  name: CraftableName;
  description: string;
  price?: Decimal;
  sellPrice?: Decimal;
  ingredients: Ingredient[];
  limit?: number;
  supply?: number;
  disabled?: boolean;
  requires?: InventoryItemName;
  section?: Section;
}

export type Ingredient = {
  id?: number;
  item: InventoryItemName;
  amount: Decimal;
};

export interface CraftableItem {
  id?: number;
  name: CraftableName;
  description: string;
  tokenAmount?: Decimal;
  ingredients?: Ingredient[];
  disabled?: boolean;
  // Hidden for crafting
  hidden?: boolean;
  requires?: InventoryItemName;
  /**
   * When enabled, description and price will display as "?"
   * This is to reduce people viewing placeholder development code and assuming that is the price/buff
   */
  isPlaceholder?: boolean;
  bumpkinLevel?: number;
  canMintMultiple?: boolean;
  /**
   * Date the item will be craftable in milliseconds
   * Date.UTC(YEAR, MONTH, DAY, HOUR?, MINUTE?, SECONDS?, MS?)
   * REMEMBER MONTHS START IN 0, 0 = JAN, 1 = FEB...
   */
  mintReleaseDate?: number;
}

export type MutantChicken =
  | "Speed Chicken"
  | "Rich Chicken"
  | "Fat Chicken"
  | "Ayam Cemani"
  | "El Pollo Veloz";

export interface LimitedItem extends CraftableItem {
  maxSupply?: number;
  section?: Section;
  cooldownSeconds?: number;
  mintedAt?: number;
  type?: LimitedItemType;
  requires?: InventoryItemName;
}

export type MOMEventItem = "Engine Core" | "Observatory";

export type TravelingSalesmanItem =
  | "Wicker Man"
  | "Golden Bonsai"
  | "Victoria Sisters"
  | "Christmas Bear";

export type QuestItem =
  | "Goblin Key"
  | "Sunflower Key"
  | "Ancient Goblin Sword"
  | "Ancient Human Warhammer";

export type LegacyItem =
  | "Sunflower Statue"
  | "Potato Statue"
  | "Christmas Tree"
  | "Gnome"
  | "Sunflower Tombstone"
  | "Sunflower Rock"
  | "Goblin Crown"
  | "Fountain"
  | "Woody the Beaver"
  | "Apprentice Beaver"
  | "Foreman Beaver"
  | "Nyon Statue"
  | "Homeless Tent"
  | "Egg Basket"
  | "Farmer Bath"
  | "Mysterious Head"
  | "Tunnel Mole"
  | "Rocky the Mole"
  | "Nugget"
  | "Rock Golem";

export type BarnItem =
  | "Farm Cat"
  | "Farm Dog"
  | "Chicken Coop"
  | "Gold Egg"
  | "Easter Bunny"
  | "Rooster";

export type MarketItem =
  | "Nancy"
  | "Scarecrow"
  | "Kuebiko"
  | "Golden Cauliflower"
  | "Mysterious Parsnip"
  | "Carrot Sword";

export type WarBanner = "Human War Banner" | "Goblin War Banner";

export type WarTentItem =
  | "Sunflower Amulet"
  | "Carrot Amulet"
  | "Beetroot Amulet"
  | "Green Amulet"
  | "Warrior Shirt"
  | "Warrior Pants"
  | "Warrior Helmet"
  | "Sunflower Shield"
  | "Skull Hat"
  | "War Skull"
  | "War Tombstone"
  | "Undead Rooster";

export type LimitedItemName =
  | LegacyItem
  | BarnItem
  | MarketItem
  | Flag
  | MOMEventItem
  | QuestItem
  | MutantChicken
  | WarTentItem;

export type CollectibleName =
  | LegacyItem
  | BarnItem
  | MarketItem
  | Flag
  | TravelingSalesmanItem
  | MutantChicken
  | MutantCropName
  | DecorationName
  | BeanName
  | HeliosBlacksmithItem
  | GoblinBlacksmithItemName
  | SoldOutCollectibleName
  | GoblinPirateItemName
  | SeasonPassName
  | "Dawn Breaker Banner"
  | "Solar Flare Banner"
  | BoostTreasure
  | WarBanner
  | LanternName
  | "Observatory"
  | "War Skull"
  | "War Tombstone"
  | "Undead Rooster"
  | PotionHouseItemName;

export type ToolName =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Hammer"
  | "Rod";

export type Shovel = "Rusty Shovel" | "Shovel";

export type Food =
  | "Pumpkin Soup"
  | "Roasted Cauliflower"
  | "Sauerkraut"
  | "Radish Pie"
  | Cake;

export type Cake =
  | "Sunflower Cake"
  | "Potato Cake"
  | "Pumpkin Cake"
  | "Carrot Cake"
  | "Cabbage Cake"
  | "Beetroot Cake"
  | "Cauliflower Cake"
  | "Parsnip Cake"
  | "Radish Cake"
  | "Wheat Cake";

export type Animal = "Chicken" | "Cow" | "Pig" | "Sheep";

export const FOODS: () => Record<Food, CraftableItem> = () => ({
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: "A creamy soup that goblins love",
    tokenAmount: marketRate(3),
    ingredients: [
      {
        item: "Pumpkin",
        amount: new Decimal(5),
      },
    ],
    limit: 1,
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description: "Fermented cabbage",
    tokenAmount: marketRate(25),
    ingredients: [
      {
        item: "Cabbage",
        amount: new Decimal(10),
      },
    ],
  },
  "Roasted Cauliflower": {
    name: "Roasted Cauliflower",
    description: "A Goblin's favourite",
    tokenAmount: marketRate(150),
    ingredients: [
      {
        item: "Cauliflower",
        amount: new Decimal(30),
      },
    ],
  },
  "Radish Pie": {
    name: "Radish Pie",
    description: "Despised by humans, loved by goblins",
    tokenAmount: marketRate(300),
    ingredients: [
      {
        item: "Radish",
        amount: new Decimal(60),
      },
    ],
  },
  ...CAKES(),
});

export const CAKES: () => Record<Cake, Craftable> = () => ({
  "Sunflower Cake": {
    name: "Sunflower Cake",
    description: "Sunflower Cake",
    tokenAmount: new Decimal(0),
    sellPrice: marketRate(320),
    ingredients: [
      {
        item: "Sunflower",
        amount: new Decimal(1000),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Potato Cake": {
    name: "Potato Cake",
    description: "Potato Cake",
    tokenAmount: new Decimal(0),
    sellPrice: marketRate(320),
    ingredients: [
      {
        item: "Potato",
        amount: new Decimal(500),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Pumpkin Cake": {
    name: "Pumpkin Cake",
    description: "Pumpkin Cake",
    tokenAmount: new Decimal(0),
    sellPrice: marketRate(320),
    ingredients: [
      {
        item: "Pumpkin",
        amount: new Decimal(130),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Carrot Cake": {
    name: "Carrot Cake",
    description: "Carrot Cake",
    tokenAmount: new Decimal(0),
    sellPrice: marketRate(360),
    ingredients: [
      {
        item: "Carrot",
        amount: new Decimal(120),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Cabbage Cake": {
    name: "Cabbage Cake",
    description: "Cabbage Cake",
    tokenAmount: new Decimal(0),
    sellPrice: marketRate(360),
    ingredients: [
      {
        item: "Cabbage",
        amount: new Decimal(90),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Beetroot Cake": {
    name: "Beetroot Cake",
    description: "Beetroot Cake",
    tokenAmount: new Decimal(0),
    sellPrice: marketRate(560),
    ingredients: [
      {
        item: "Beetroot",
        amount: new Decimal(100),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Cauliflower Cake": {
    name: "Cauliflower Cake",
    description: "Cauliflower Cake",
    tokenAmount: new Decimal(0),
    sellPrice: marketRate(560),
    ingredients: [
      {
        item: "Cauliflower",
        amount: new Decimal(60),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Parsnip Cake": {
    name: "Parsnip Cake",
    description: "Parsnip Cake",
    tokenAmount: new Decimal(0),
    sellPrice: marketRate(560),
    ingredients: [
      {
        item: "Parsnip",
        amount: new Decimal(45),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Radish Cake": {
    name: "Radish Cake",
    description: "Radish Cake",
    tokenAmount: new Decimal(0),
    sellPrice: marketRate(560),
    ingredients: [
      {
        item: "Radish",
        amount: new Decimal(25),
      },
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
  "Wheat Cake": {
    name: "Wheat Cake",
    description: "Wheat Cake",
    tokenAmount: new Decimal(0),
    sellPrice: marketRate(560),
    ingredients: [
      {
        item: "Wheat",
        amount: new Decimal(35),
      },
      {
        item: "Egg",
        amount: new Decimal(15),
      },
    ],
  },
});

export const TOOLS: Record<ToolName, CraftableItem> = {
  Axe: {
    name: "Axe",
    description: "Used to collect wood",
    // Temporary price for weekly war challenge
    tokenAmount: new Decimal(1),
    ingredients: [],
  },
  Pickaxe: {
    name: "Pickaxe",
    description: "Used to collect stone",
    tokenAmount: new Decimal(1),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(2),
      },
    ],
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: "Used to collect iron",
    tokenAmount: new Decimal(2),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(3),
      },
      {
        item: "Stone",
        amount: new Decimal(3),
      },
    ],
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description: "Used to collect gold",
    tokenAmount: new Decimal(5),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Iron",
        amount: new Decimal(3),
      },
    ],
  },
  Hammer: {
    name: "Hammer",
    description: "Coming soon",
    tokenAmount: new Decimal(5),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Stone",
        amount: new Decimal(5),
      },
    ],
    disabled: true,
  },
  Rod: {
    name: "Rod",
    description: "Coming soon",
    tokenAmount: new Decimal(5),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
    ],
    disabled: true,
  },
};

export const SHOVELS: Record<Shovel, CraftableItem> = {
  "Rusty Shovel": {
    name: "Rusty Shovel",
    description: "Used to remove buildings and collectibles",
    ingredients: [],
    hidden: true,
  },
  Shovel: {
    name: "Shovel",
    description: "Used to remove unwanted crops",
    tokenAmount: new Decimal(0),
    ingredients: [
      {
        item: "Rusty Shovel",
        amount: new Decimal(1),
      },
      {
        item: "Iron",
        amount: new Decimal(10),
      },
      {
        item: "Wood",
        amount: new Decimal(20),
      },
    ],
  },
};

export const QUEST_ITEMS: Record<QuestItem, LimitedItem> = {
  "Goblin Key": {
    name: "Goblin Key",
    description: "The Goblin Key",
    type: LimitedItemType.QuestItem,
  },
  "Sunflower Key": {
    name: "Sunflower Key",
    description: "The Sunflower Key",
    type: LimitedItemType.QuestItem,
  },
  "Ancient Goblin Sword": {
    name: "Ancient Goblin Sword",
    description: "An Ancient Goblin Sword",
    type: LimitedItemType.QuestItem,
  },
  "Ancient Human Warhammer": {
    name: "Ancient Human Warhammer",
    description: "An Ancient Human Warhammer",
    type: LimitedItemType.QuestItem,
  },
};

export const SALESMAN_ITEMS: Record<TravelingSalesmanItem, LimitedItem> = {
  "Wicker Man": {
    name: "Wicker Man",
    description:
      "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
    disabled: false,
    section: Section["Wicker Man"],
  },
  "Golden Bonsai": {
    name: "Golden Bonsai",
    description: "Goblins love bonsai too",
    section: Section["Golden Bonsai"],
    isPlaceholder: true,
  },
  "Victoria Sisters": {
    name: "Victoria Sisters",
    description: "The pumpkin loving sisters",
    section: Section["Golden Bonsai"],
    isPlaceholder: true,
  },
  "Christmas Bear": {
    name: "Christmas Bear",
    description: "Santa's favorite",
    section: Section["Christmas Bear"],
    isPlaceholder: true,
  },
};

export const WAR_TENT_ITEMS: Record<WarTentItem, LimitedItem> = {
  "Sunflower Amulet": {
    name: "Sunflower Amulet",
    description: "10% increased Sunflower yield",
    type: LimitedItemType.WarTentItem,
  },
  "Carrot Amulet": {
    name: "Carrot Amulet",
    description: "Carrots grow 20% faster",
    type: LimitedItemType.WarTentItem,
  },
  "Beetroot Amulet": {
    name: "Beetroot Amulet",
    description: "20% increased Beetroot yield",
    type: LimitedItemType.WarTentItem,
  },
  "Green Amulet": {
    name: "Green Amulet",
    description: "Chance for 10x crop yield",
    type: LimitedItemType.WarTentItem,
  },
  "Warrior Shirt": {
    name: "Warrior Shirt",
    description: "A mark of a true warrior",
    type: LimitedItemType.WarTentItem,
  },
  "Warrior Pants": {
    name: "Warrior Pants",
    description: "Protect your thighs",
    type: LimitedItemType.WarTentItem,
  },
  "Warrior Helmet": {
    name: "Warrior Helmet",
    description: "Immune to arrows",
    type: LimitedItemType.WarTentItem,
  },
  "Sunflower Shield": {
    name: "Sunflower Shield",
    description: "A hero of Sunflower Land. Free Sunflower Seeds!",
    type: LimitedItemType.WarTentItem,
  },
  "Skull Hat": {
    name: "Skull Hat",
    description: "A rare hat for your Bumpkin.",
    type: LimitedItemType.WarTentItem,
  },
  "War Skull": {
    name: "War Skull",
    description: "Decorate the land with the bones of your enemies.",
    type: LimitedItemType.WarTentItem,
    canMintMultiple: true,
  },
  "War Tombstone": {
    name: "War Tombstone",
    description: "R.I.P",
    type: LimitedItemType.WarTentItem,
    canMintMultiple: true,
  },
  "Undead Rooster": {
    name: "Undead Rooster",
    description: "An unfortunate casualty of the war. 10% increased egg yield.",
    type: LimitedItemType.WarTentItem,
  },
};

export const MOM_EVENT_ITEMS: Record<MOMEventItem, LimitedItem> = {
  "Engine Core": {
    name: "Engine Core",
    description: "The power of the sunflower",
    type: LimitedItemType.MOMEventItem,
  },
  Observatory: {
    name: "Observatory",
    description: "Explore the stars and improve scientific development",
    section: Section.Observatory,
    type: LimitedItemType.MOMEventItem,
  },
};

export const MUTANT_CHICKENS: Record<MutantChicken, LimitedItem> = {
  "Speed Chicken": {
    name: "Speed Chicken",
    description: "Produces eggs 10% faster",
    type: LimitedItemType.MutantChicken,
  },
  "Fat Chicken": {
    name: "Fat Chicken",
    description: "10% less wheat needed to feed a chicken",
    type: LimitedItemType.MutantChicken,
  },
  "Rich Chicken": {
    name: "Rich Chicken",
    description: "Yields 10% more eggs",
    type: LimitedItemType.MutantChicken,
  },
  "Ayam Cemani": {
    name: "Ayam Cemani",
    description: "The rarest chicken in Sunflower Land.",
    type: LimitedItemType.MutantChicken,
  },
  "El Pollo Veloz": {
    name: "El Pollo Veloz",
    description: "Give me those eggs, fast! 4 hour speed boost on egg laying.",
    type: LimitedItemType.MutantChicken,
  },
};

export const WAR_BANNERS: Record<WarBanner, CraftableItem> = {
  "Goblin War Banner": {
    name: "Goblin War Banner",
    description: "A display of allegiance to the Goblin cause",
  },
  "Human War Banner": {
    name: "Human War Banner",
    description: "A display of allegiance to the Human cause",
  },
};

export const BLACKSMITH_ITEMS: Record<LegacyItem | "Chef Apron", LimitedItem> =
  {
    "Sunflower Statue": {
      name: "Sunflower Statue",
      description: "A symbol of the holy token",
      section: Section["Sunflower Statue"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Potato Statue": {
      name: "Potato Statue",
      description: "The OG potato hustler flex",
      section: Section["Potato Statue"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Christmas Tree": {
      name: "Christmas Tree",
      description: "Receive a Santa Airdrop on Christmas day",
      section: Section["Christmas Tree"],
      type: LimitedItemType.BlacksmithItem,
    },
    Gnome: {
      name: "Gnome",
      description: "A lucky gnome",
      section: Section.Gnome,
      type: LimitedItemType.BlacksmithItem,
    },
    "Homeless Tent": {
      name: "Homeless Tent",
      description: "A nice and cozy tent",
      section: Section.Tent,
      type: LimitedItemType.BlacksmithItem,
    },
    "Sunflower Tombstone": {
      name: "Sunflower Tombstone",
      description: "In memory of Sunflower Farmers",
      section: Section["Sunflower Tombstone"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Sunflower Rock": {
      name: "Sunflower Rock",
      description: "The game that broke Polygon",
      section: Section["Sunflower Rock"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Goblin Crown": {
      name: "Goblin Crown",
      description: "Summon the leader of the Goblins",
      section: Section["Goblin Crown"],
      type: LimitedItemType.BlacksmithItem,
    },
    Fountain: {
      name: "Fountain",
      description: "A relaxing fountain for your farm",
      section: Section.Fountain,
      type: LimitedItemType.BlacksmithItem,
    },
    "Nyon Statue": {
      name: "Nyon Statue",
      description: "In memory of Nyon Lann",
      section: Section["Nyon Statue"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Farmer Bath": {
      name: "Farmer Bath",
      description: "A beetroot scented bath for the farmers",
      section: Section["Bath"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Woody the Beaver": {
      name: "Woody the Beaver",
      description: "Increase wood drops by 20%",
      section: Section.Beaver,
      type: LimitedItemType.BlacksmithItem,
    },
    "Apprentice Beaver": {
      name: "Apprentice Beaver",
      description: "Trees recover 50% faster",
      section: Section.Beaver,
      type: LimitedItemType.BlacksmithItem,
    },
    "Foreman Beaver": {
      name: "Foreman Beaver",
      description: "Cut trees without axes",
      section: Section.Beaver,
      type: LimitedItemType.BlacksmithItem,
    },
    "Egg Basket": {
      name: "Egg Basket",
      description: "Gives access to the Easter Egg Hunt",
      type: LimitedItemType.BlacksmithItem,
    },
    "Mysterious Head": {
      name: "Mysterious Head",
      description: "A statue thought to protect farmers",
      section: Section["Mysterious Head"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Tunnel Mole": {
      name: "Tunnel Mole",
      description: "Gives a 25% increase to stone mines",
      section: Section.Mole,
      type: LimitedItemType.BlacksmithItem,
    },
    "Rocky the Mole": {
      name: "Rocky the Mole",
      description: "Gives a 25% increase to iron mines",
      section: Section.Mole,
      type: LimitedItemType.BlacksmithItem,
    },
    Nugget: {
      name: "Nugget",
      description: "Gives a 25% increase to gold mines",
      section: Section.Mole,
      type: LimitedItemType.BlacksmithItem,
    },
    "Rock Golem": {
      name: "Rock Golem",
      description: "Gives a 10% chance to get 3x stone",
      section: Section["Rock Golem"],
      type: LimitedItemType.BlacksmithItem,
    },
    "Chef Apron": {
      name: "Chef Apron",
      description: "Gives 20% extra SFL selling cakes",
      type: LimitedItemType.BlacksmithItem,
    },
  };

export const MARKET_ITEMS: Record<MarketItem, LimitedItem> = {
  Nancy: {
    name: "Nancy",
    description: "Keeps a few crows away. Crops grow 15% faster",
    section: Section.Scarecrow,
    type: LimitedItemType.MarketItem,
  },
  Scarecrow: {
    name: "Scarecrow",
    description: "A goblin scarecrow. Yield 20% more crops",
    section: Section.Scarecrow,
    type: LimitedItemType.MarketItem,
  },
  Kuebiko: {
    name: "Kuebiko",
    description:
      "Even the shopkeeper is scared of this scarecrow. Seeds are free",
    section: Section.Scarecrow,
    type: LimitedItemType.MarketItem,
  },
  "Golden Cauliflower": {
    name: "Golden Cauliflower",
    description: "Doubles cauliflower yield",
    type: LimitedItemType.MarketItem,
  },
  "Mysterious Parsnip": {
    name: "Mysterious Parsnip",
    description: "Parsnips grow 50% faster",
    type: LimitedItemType.MarketItem,
  },
  "Carrot Sword": {
    name: "Carrot Sword",
    description: "Increase chance of a mutant crop appearing",
    type: LimitedItemType.MarketItem,
  },
};

export const BARN_ITEMS: Record<BarnItem, LimitedItem> = {
  "Chicken Coop": {
    name: "Chicken Coop",
    description: "Collect 2x the amount of eggs",
    section: Section["Chicken Coop"],
    type: LimitedItemType.BarnItem,
  },
  "Farm Cat": {
    name: "Farm Cat",
    description: "Keep the rats away",
    section: Section["Farm Cat"],
    type: LimitedItemType.BarnItem,
  },
  "Farm Dog": {
    name: "Farm Dog",
    description: "Herd sheep with your farm dog",
    section: Section["Farm Dog"],
    type: LimitedItemType.BarnItem,
  },
  "Gold Egg": {
    name: "Gold Egg",
    description: "Feed chickens without needing wheat",
    type: LimitedItemType.BarnItem,
  },
  "Easter Bunny": {
    name: "Easter Bunny",
    description: "Earn 20% more Carrots",
    section: Section["Easter Bunny"],
    type: LimitedItemType.BarnItem,
  },
  Rooster: {
    name: "Rooster",
    description: "Doubles the chance of dropping a mutant chicken",
    section: Section["Rooster"],
    type: LimitedItemType.BarnItem,
  },
};

export const ANIMALS: () => Record<Animal, CraftableItem> = () => ({
  Chicken: {
    name: "Chicken",
    description: "Produces eggs. Requires wheat for feeding",
    tokenAmount: marketRate(200),
    ingredients: [],
  },
  Cow: {
    name: "Cow",
    description: "Produces milk. Requires wheat for feeding",
    tokenAmount: new Decimal(50),
    ingredients: [],
    disabled: true,
  },
  Pig: {
    name: "Pig",
    description: "Produces manure. Requires wheat for feeding",
    tokenAmount: new Decimal(20),
    ingredients: [],
    disabled: true,
  },
  Sheep: {
    name: "Sheep",
    description: "Produces wool. Requires wheat for feeding",
    tokenAmount: new Decimal(20),
    ingredients: [],
    disabled: true,
  },
});

/**
 * getKeys is a ref to Object.keys, but the return is typed literally.
 */
export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;

/**
 * getEntries is a ref to Object.entries, but the return is typed literally.
 */
type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];
export const getEntries = Object.entries as <T extends object>(
  obj: T
) => Entries<T>[];

export const LIMITED_ITEMS = {
  ...BLACKSMITH_ITEMS,
  ...BARN_ITEMS,
  ...MARKET_ITEMS,
  ...FLAGS,
  ...MOM_EVENT_ITEMS,
  ...QUEST_ITEMS,
  ...MUTANT_CHICKENS,
  ...SALESMAN_ITEMS,
  ...WAR_TENT_ITEMS,
};

export const isLimitedItem = (itemName: any) => {
  return !!getKeys(LIMITED_ITEMS).find(
    (limitedItemName) => limitedItemName === itemName
  );
};

export type Dimensions = { width: number; height: number };

const flagsDimension = getKeys(FLAGS).reduce(
  (previous, flagName) => ({
    ...previous,
    [flagName]: {
      width: 1,
      height: 1,
    },
  }),
  {} as Record<Flag, Dimensions>
);

export const COLLECTIBLES_DIMENSIONS: Record<CollectibleName, Dimensions> = {
  // Salesman Items
  "Wicker Man": { width: 1, height: 1 },
  "Golden Bonsai": { width: 1, height: 1 },

  // Flags
  ...flagsDimension,

  ...DECORATION_DIMENSIONS,

  ...RESOURCE_DIMENSIONS,

  // Blacksmith Items
  "Sunflower Statue": { width: 3, height: 4 },
  "Potato Statue": { width: 2, height: 2 },
  "Christmas Tree": { width: 2, height: 2 },
  Gnome: { width: 1, height: 1 },
  "Sunflower Tombstone": { width: 2, height: 2 },
  "Sunflower Rock": { width: 5, height: 4 },
  "Goblin Crown": { width: 1, height: 1 },
  Fountain: { width: 2, height: 2 },
  "Woody the Beaver": { width: 1, height: 1 },
  "Apprentice Beaver": { width: 1, height: 1 },
  "Foreman Beaver": { width: 1, height: 1 },
  "Nyon Statue": { width: 2, height: 2 },
  "Homeless Tent": { width: 2, height: 2 },
  "Farmer Bath": { width: 2, height: 3 },
  "Mysterious Head": { width: 2, height: 2 },
  "Rock Golem": { width: 2, height: 2 },
  "Tunnel Mole": { width: 1, height: 1 },
  "Rocky the Mole": { width: 1, height: 1 },
  Nugget: { width: 1, height: 1 },
  "Immortal Pear": { width: 2, height: 2 },

  // Market Items
  Scarecrow: { width: 2, height: 2 },
  Nancy: { width: 1, height: 2 },
  Kuebiko: { width: 2, height: 2 },
  "Golden Cauliflower": { width: 2, height: 2 },
  "Mysterious Parsnip": { width: 1, height: 1 },
  "Carrot Sword": { width: 1, height: 1 },

  // Barn Items
  "Farm Cat": { width: 1, height: 1 },
  "Farm Dog": { width: 1, height: 1 },
  "Chicken Coop": { width: 2, height: 2 },
  "Gold Egg": { width: 1, height: 1 },
  Rooster: { width: 1, height: 1 },
  "Egg Basket": { width: 1, height: 1 },
  "Fat Chicken": { width: 1, height: 1 },
  "Rich Chicken": { width: 1, height: 1 },
  "Speed Chicken": { width: 1, height: 1 },
  "Ayam Cemani": { width: 1, height: 1 },
  "El Pollo Veloz": { width: 1, height: 1 },
  // War Tent Items
  "War Skull": { width: 1, height: 1 },
  "War Tombstone": { width: 1, height: 1 },
  "Undead Rooster": { width: 1, height: 1 },

  Observatory: { width: 2, height: 2 },
  "Victoria Sisters": { width: 2, height: 2 },
  "Basic Bear": { width: 1, height: 1 },
  "Peeled Potato": { width: 1, height: 1 },
  "Wood Nymph Wendy": { width: 1, height: 1 },
  "Cabbage Boy": { width: 1, height: 1 },
  "Cabbage Girl": { width: 1, height: 1 },

  "Magic Bean": { width: 2, height: 2 },

  "Stellar Sunflower": { width: 1, height: 1 },
  "Potent Potato": { width: 1, height: 1 },
  "Radical Radish": { width: 1, height: 1 },

  "Christmas Bear": { width: 1, height: 1 },
  "Christmas Snow Globe": { width: 2, height: 2 },
  "Lady Bug": { width: 1, height: 1 },
  "Squirrel Monkey": { width: 2, height: 2 },
  "Black Bearry": { width: 1, height: 1 },
  "Iron Idol": { height: 2, width: 2 },
  "Parasaur Skull": {
    height: 2,
    width: 2,
  },
  "Golden Bear Head": {
    height: 2,
    width: 2,
  },

  "Maneki Neko": { width: 1, height: 1 },
  "Collectible Bear": { width: 2, height: 2 },
  "Cyborg Bear": { width: 1, height: 1 },
  "Beta Bear": { width: 1, height: 1 },

  //Easter Event Items
  "Easter Bunny": { width: 2, height: 1 },
  "Pablo The Bunny": { width: 1, height: 1 },
  "Easter Bear": { width: 1, height: 1 },
  "Giant Carrot": { width: 2, height: 2 },
  "Easter Bush": { width: 2, height: 1 },

  // Treasure Island SFTs
  "Tiki Totem": { height: 1, width: 1 },
  "Lunar Calendar": { height: 1, width: 1 },
  "Heart of Davy Jones": { height: 2, width: 2 },
  "Treasure Map": { height: 1, width: 2 },
  "Heart Balloons": { height: 1, width: 1 },
  Flamingo: { height: 2, width: 2 },
  "Blossom Tree": { height: 2, width: 2 },

  // Solar Flare SFTs
  "Palm Tree": { height: 2, width: 2 },
  "Beach Ball": { height: 1, width: 1 },
  Karkinos: { height: 2, width: 2 },

  // Banners
  "Witches' Eve Banner": { width: 1, height: 2 },
  "Dawn Breaker Banner": { width: 1, height: 2 },
  "Solar Flare Banner": { width: 1, height: 2 },
  "Human War Banner": { width: 1, height: 2 },
  "Goblin War Banner": { width: 1, height: 2 },
  // Dawn Breaker SFTs
  "Mushroom House": { height: 3, width: 2 },
  "Luminous Lantern": { height: 2, width: 1 },
  "Aurora Lantern": { height: 2, width: 1 },
  "Radiance Lantern": { height: 2, width: 1 },
  "Ocean Lantern": { height: 2, width: 1 },
  "Solar Lantern": { height: 2, width: 1 },
  "Goblin Lantern": { height: 2, width: 1 },
  "Bumpkin Lantern": { height: 2, width: 1 },
  "Betty Lantern": { height: 2, width: 1 },

  "Purple Trail": { width: 1, height: 1 },
  Obie: { width: 1, height: 1 },
  Maximus: { width: 2, height: 2 },
  Hoot: { width: 1, height: 1 },
  "Freya Fox": { width: 1, height: 1 },
  Poppy: { width: 1, height: 1 },
  "Grain Grinder": { width: 2, height: 1 },
  Kernaldo: { width: 1, height: 1 },

  // AoE items
  "Emerald Turtle": { height: 1, width: 1 },
  "Tin Turtle": { height: 1, width: 1 },
  "Basic Scarecrow": { width: 1, height: 2 },
  Bale: { width: 2, height: 2 },
  "Sir Goldensnout": { width: 2, height: 2 },
  "Scary Mike": { width: 1, height: 2 },
  "Laurie the Chuckle Crow": { width: 1, height: 2 },
  "Queen Cornelia": { width: 1, height: 2 },

  // Potion House Items
  "Lab Grown Carrot": { width: 1, height: 1 },
  "Lab Grown Radish": { width: 1, height: 1 },
  "Lab Grown Pumpkin": { width: 1, height: 1 },
};

export const ANIMAL_DIMENSIONS: Record<"Chicken", Dimensions> = {
  Chicken: {
    width: 1,
    height: 1,
  },
};
