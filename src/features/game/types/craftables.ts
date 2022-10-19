import Decimal from "decimal.js-light";
import { SeedName, SEEDS } from "../types/crops";
import { InventoryItemName } from "../types/game";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Flag, FLAGS } from "./flags";
import { marketRate } from "../lib/halvening";
import { KNOWN_IDS, KNOWN_ITEMS, LimitedItemType } from ".";
import { OnChainLimitedItems } from "../lib/goblinMachine";
import { isArray } from "lodash";

export { FLAGS };

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

export type CraftableName =
  | LimitedItemName
  | ToolName
  | SeedName
  | Food
  | Animal
  | Flag
  | Shovel
  | TravelingSalesmanItem
  | WarBanner
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

export type MutantChicken = "Speed Chicken" | "Rich Chicken" | "Fat Chicken";

export interface LimitedItem extends CraftableItem {
  maxSupply?: number;
  section?: Section;
  cooldownSeconds?: number;
  mintedAt?: number;
  type?: LimitedItemType;
  requires?: InventoryItemName;
}

export type MOMEventItem = "Engine Core" | "Observatory";

export type TravelingSalesmanItem = "Wicker Man" | "Golden Bonsai";

export type QuestItem =
  | "Goblin Key"
  | "Sunflower Key"
  | "Ancient Goblin Sword"
  | "Ancient Human Warhammer";

export type BlacksmithItem =
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
  | BlacksmithItem
  | BarnItem
  | MarketItem
  | Flag
  | MOMEventItem
  | QuestItem
  | MutantChicken
  | WarTentItem;

export type CollectibleName =
  | BlacksmithItem
  | BarnItem
  | MarketItem
  | Flag
  | TravelingSalesmanItem
  | MutantChicken
  | "War Skull"
  | "War Tombstone";

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
    price: new Decimal(0),
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
    price: new Decimal(0),
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
    price: new Decimal(0),
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
    price: new Decimal(0),
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
    price: new Decimal(0),
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
    price: new Decimal(0),
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
    price: new Decimal(0),
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
    price: new Decimal(0),
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
    price: new Decimal(0),
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
    price: new Decimal(0),
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
    description: "Used to construct buildings",
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
    description: "Used to fish trout",
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
    description: "It's old and rusty, but still harvests crops",
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

export const ROCKET_ITEMS: Record<MOMEventItem, LimitedItem> = {
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
    section: Section["Speed Chicken"],
    type: LimitedItemType.MutantChicken,
  },
  "Fat Chicken": {
    name: "Fat Chicken",
    description: "10% less wheat needed to feed a chicken",
    section: Section["Fat Chicken"],
    type: LimitedItemType.MutantChicken,
  },
  "Rich Chicken": {
    name: "Rich Chicken",
    description: "Yields 10% more eggs",
    section: Section["Rich Chicken"],
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

export const BLACKSMITH_ITEMS: Record<
  BlacksmithItem | "Chef Apron",
  LimitedItem
> = {
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
    description: "Double the rewards from cauliflowers",
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
    description: "Herd sheep 4x faster",
    section: Section["Farm Dog"],
    type: LimitedItemType.BarnItem,
  },
  "Gold Egg": {
    name: "Gold Egg",
    description: "A rare egg, what lays inside?",
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

type Craftables = Record<CraftableName, CraftableItem>;

export const CRAFTABLES: () => Craftables = () => ({
  ...TOOLS,
  ...SHOVELS,
  ...BLACKSMITH_ITEMS,
  ...BARN_ITEMS,
  ...MARKET_ITEMS,
  ...SEEDS(),
  ...FOODS(),
  ...ANIMALS(),
  ...FLAGS,
  ...ROCKET_ITEMS,
  ...QUEST_ITEMS,
  ...MUTANT_CHICKENS,
  ...SALESMAN_ITEMS,
  ...WAR_BANNERS,
  ...WAR_TENT_ITEMS,
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
  ...ROCKET_ITEMS,
  ...QUEST_ITEMS,
  ...MUTANT_CHICKENS,
  ...SALESMAN_ITEMS,
  ...WAR_TENT_ITEMS,
};

export const LIMITED_ITEM_NAMES = getKeys(LIMITED_ITEMS);

export const makeLimitedItemsByName = (
  items: Record<LimitedItemName, LimitedItem>,
  onChainItems: OnChainLimitedItems
) => {
  return getKeys(items).reduce((limitedItems, itemName) => {
    const name = itemName as LimitedItemName;
    // Get id form limited item name
    const id = KNOWN_IDS[name];
    // Get onchain item based on id
    const onChainItem = onChainItems[id];

    if (onChainItem) {
      const {
        tokenAmount,
        ingredientAmounts,
        ingredientIds,
        cooldownSeconds,
        maxSupply,
        mintedAt,
        enabled,
      } = onChainItem;

      // Build ingredients
      const ingredients = ingredientIds.map((id, index) => ({
        id,
        item: KNOWN_ITEMS[id],
        amount: new Decimal(ingredientAmounts[index]),
      }));

      const isNewItem = !enabled && Number(maxSupply) === 0;

      limitedItems[name] = {
        id: onChainItem.mintId,
        name,
        description: items[name].description,
        tokenAmount: new Decimal(tokenAmount),
        maxSupply,
        cooldownSeconds,
        ingredients,
        mintedAt,
        type: items[name].type,
        disabled: !enabled,
        isPlaceholder: items[name].isPlaceholder || isNewItem,
        canMintMultiple: items[name].canMintMultiple,
        mintReleaseDate: items[name].mintReleaseDate || 0,
      };
    }

    return limitedItems;
    // TODO: FIX TYPE
  }, {} as Record<CraftableName, LimitedItem>);
};

export const filterLimitedItemsByType = (
  type: LimitedItemType | LimitedItemType[],
  limitedItems: Record<LimitedItemName, LimitedItem>
) => {
  // Convert `obj` to a key/value array
  // `[['name', 'Luke Skywalker'], ['title', 'Jedi Knight'], ...]`
  const asArray = Object.entries(limitedItems);

  const filtered = asArray.filter(([_, value]) => {
    if (value.type && isArray(type)) {
      return type.includes(value.type);
    }

    return value.type === type;
  });

  // Convert the key/value array back to an object:
  // `{ name: 'Luke Skywalker', title: 'Jedi Knight' }`
  return Object.fromEntries(filtered);
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
      height: 0,
      width: 0,
    },
  }),
  {} as Record<Flag, Dimensions>
);

export const COLLECTIBLES_DIMENSIONS: Record<CollectibleName, Dimensions> = {
  // Salesman Items
  "Wicker Man": { height: 1, width: 1 },
  "Golden Bonsai": { height: 1, width: 1 },

  // Flags
  ...flagsDimension,

  // Blacksmith Items
  "Sunflower Statue": { width: 2, height: 2 },
  "Potato Statue": { width: 1, height: 1 },
  "Christmas Tree": { width: 2, height: 2 },
  Gnome: { width: 1, height: 1 },
  "Sunflower Tombstone": { width: 1, height: 1 },
  "Sunflower Rock": { width: 4, height: 3 },
  "Goblin Crown": { width: 1, height: 1 },
  Fountain: { width: 2, height: 2 },
  "Woody the Beaver": { width: 1, height: 1 },
  "Apprentice Beaver": { width: 1, height: 1 },
  "Foreman Beaver": { width: 1, height: 1 },
  "Nyon Statue": { width: 2, height: 1 },
  "Homeless Tent": { width: 2, height: 2 },
  "Farmer Bath": { width: 2, height: 3 },
  "Mysterious Head": { width: 2, height: 2 },
  "Rock Golem": { width: 2, height: 3 },
  "Tunnel Mole": { width: 1, height: 1 },
  "Rocky the Mole": { width: 1, height: 1 },
  Nugget: { width: 1, height: 1 },

  // Market Items
  Scarecrow: { height: 2, width: 2 },
  Nancy: { width: 2, height: 2 },
  Kuebiko: { width: 2, height: 2 },
  "Golden Cauliflower": { width: 1, height: 1 },
  "Mysterious Parsnip": { width: 1, height: 1 },
  "Carrot Sword": { width: 1, height: 1 },

  // Barn Items
  "Farm Cat": { width: 1, height: 1 },
  "Farm Dog": { width: 1, height: 1 },
  "Chicken Coop": { width: 2, height: 2 },
  "Gold Egg": { width: 1, height: 1 },
  "Easter Bunny": { width: 2, height: 1 },
  Rooster: { height: 1, width: 1 },
  "Egg Basket": { height: 1, width: 1 },
  "War Skull": { height: 1, width: 1 },
  "War Tombstone": { height: 1, width: 1 },

  // Mutant Chickens
  "Fat Chicken": { height: 1, width: 1 },
  "Rich Chicken": { height: 1, width: 1 },
  "Speed Chicken": { height: 1, width: 1 },
};

export const ANIMAL_DIMENSIONS: Record<"Chicken", Dimensions> = {
  Chicken: {
    height: 1,
    width: 1,
  },
};
