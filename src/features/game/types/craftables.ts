import Decimal from "decimal.js-light";
import { SeedName, SEEDS } from "../types/crops";
import { InventoryItemName } from "../types/game";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Flag, FLAGS } from "./flags";
import { marketRate } from "../lib/halvening";

export { FLAGS };

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

export type CraftableName =
  | LimitedItem
  | Tool
  | SeedName
  | Food
  | Animal
  | Flag;

export type Craftable = {
  name: CraftableName;
  description: string;
  price: Decimal;
  ingredients: {
    item: InventoryItemName;
    amount: Decimal;
  }[];
  limit?: number;
  supply?: number;
  disabled?: boolean;
  requires?: InventoryItemName;
  section?: Section;
};

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
  | "Farmer Bath";

export type BarnItem =
  | "Farm Cat"
  | "Farm Dog"
  | "Chicken Coop"
  | "Gold Egg"
  | "Easter Bunny";

export type MarketItem =
  | "Nancy"
  | "Scarecrow"
  | "Kuebiko"
  | "Golden Cauliflower"
  | "Mysterious Parsnip"
  | "Carrot Sword";

export type LimitedItem = BlacksmithItem | BarnItem | MarketItem | Flag;

export type Tool =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Hammer"
  | "Rod";

export type Food =
  | "Pumpkin Soup"
  | "Roasted Cauliflower"
  | "Sauerkraut"
  | "Radish Pie";

export type Animal = "Chicken" | "Cow" | "Pig" | "Sheep";

export const FOODS: () => Record<Food, Craftable> = () => ({
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: "A creamy soup that goblins love",
    price: marketRate(3),
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
    price: marketRate(25),

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
    price: marketRate(150),
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
    price: marketRate(300),
    ingredients: [
      {
        item: "Radish",
        amount: new Decimal(60),
      },
    ],
  },
});

export const TOOLS: Record<Tool, Craftable> = {
  Axe: {
    name: "Axe",
    description: "Used to collect wood",
    price: new Decimal(1),
    ingredients: [],
  },
  Pickaxe: {
    name: "Pickaxe",
    description: "Used to collect stone",
    price: new Decimal(1),
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
    price: new Decimal(2),
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
    price: new Decimal(5),
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
    price: new Decimal(5),
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
    price: new Decimal(5),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
    ],
    disabled: true,
  },
};

export const BLACKSMITH_ITEMS: Record<BlacksmithItem, Craftable> = {
  "Sunflower Statue": {
    name: "Sunflower Statue",
    description: "A symbol of the holy token",
    price: new Decimal(5),
    ingredients: [
      {
        item: "Sunflower",
        amount: new Decimal(1000),
      },
      {
        item: "Stone",
        amount: new Decimal(50),
      },
    ],
    limit: 1,
    supply: 1000,
    section: Section["Sunflower Statue"],
  },
  "Potato Statue": {
    name: "Potato Statue",
    description: "The OG potato hustler flex",
    price: new Decimal(0),
    ingredients: [
      {
        item: "Potato",
        amount: new Decimal(100),
      },
      {
        item: "Stone",
        amount: new Decimal(20),
      },
    ],
    limit: 1,
    supply: 5000,
    section: Section["Potato Statue"],
  },
  "Christmas Tree": {
    name: "Christmas Tree",
    description: "Receive a Santa Airdrop on Christmas day",
    price: new Decimal(50),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(100),
      },
      {
        item: "Stone",
        amount: new Decimal(50),
      },
    ],
    supply: 0,
    section: Section["Christmas Tree"],
  },
  Gnome: {
    name: "Gnome",
    description: "A lucky gnome",
    price: new Decimal(10),
    ingredients: [],
    supply: 0,
    section: Section.Gnome,
  },
  "Homeless Tent": {
    name: "Homeless Tent",
    description: "A nice and cozy tent",
    price: new Decimal(10),
    ingredients: [
      {
        item: "Wheat",
        amount: new Decimal(5),
      },
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Stone",
        amount: new Decimal(5),
      },
    ],
    limit: 1,
    supply: 1000,
    section: Section.Tent,
  },
  "Sunflower Tombstone": {
    name: "Sunflower Tombstone",
    description: "In memory of Sunflower Farmers",
    price: new Decimal(0),
    ingredients: [],
    supply: 0,
    section: Section["Sunflower Tombstone"],
  },
  "Sunflower Rock": {
    name: "Sunflower Rock",
    description: "The game that broke Polygon",
    price: new Decimal(100),
    ingredients: [
      {
        item: "Sunflower",
        amount: new Decimal(10000),
      },
      {
        item: "Iron",
        amount: new Decimal(100),
      },
    ],
    supply: 150,
    section: Section["Sunflower Rock"],
  },
  "Goblin Crown": {
    name: "Goblin Crown",
    description: "Summon the leader of the Goblins",
    price: new Decimal(5),
    ingredients: [],
    supply: 5000,
    section: Section["Goblin Crown"],
  },
  Fountain: {
    name: "Fountain",
    description: "A relaxing fountain for your farm",
    price: new Decimal(5),
    ingredients: [
      {
        amount: new Decimal(1),
        item: "Stone",
      },
    ],
    supply: 10000,
    section: Section.Fountain,
  },
  "Nyon Statue": {
    name: "Nyon Statue",
    description: "In memory of Nyon Lann",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(30),
        item: "Stone",
      },
      {
        amount: new Decimal(20),
        item: "Iron",
      },
      {
        amount: new Decimal(5),
        item: "Gold",
      },
    ],
    limit: 1,
    supply: 1000,
  },
  "Farmer Bath": {
    name: "Farmer Bath",
    description: "A beetroot scented bath for the farmers",
    price: new Decimal(25),
    ingredients: [
      {
        amount: new Decimal(100),
        item: "Beetroot",
      },
      {
        amount: new Decimal(20),
        item: "Wood",
      },
    ],
    supply: 5000,
    section: Section["Bath"],
  },
  "Woody the Beaver": {
    name: "Woody the Beaver",
    description: "Increase wood drops by 20%",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(200),
        item: "Wood",
      },
    ],
    supply: 50000,
    section: Section.Beaver,
  },
  "Apprentice Beaver": {
    name: "Apprentice Beaver",
    description: "Trees recover 50% faster",
    price: new Decimal(100),
    ingredients: [
      {
        amount: new Decimal(500),
        item: "Wood",
      },
      {
        amount: new Decimal(1),
        item: "Woody the Beaver",
      },
    ],
    supply: 5000,
    section: Section.Beaver,
    disabled: false,
  },
  "Foreman Beaver": {
    name: "Foreman Beaver",
    description: "Cut trees without axes",
    price: new Decimal(0),
    ingredients: [
      {
        amount: new Decimal(5000),
        item: "Wood",
      },
      {
        amount: new Decimal(1),
        item: "Apprentice Beaver",
      },
    ],
    supply: 308,
    section: Section.Beaver,
    disabled: true,
  },
  "Egg Basket": {
    name: "Egg Basket",
    description: "Gives access to the Easter Egg Hunt",
    price: new Decimal(0),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Carrot",
        amount: new Decimal(5),
      },
    ],
    supply: 100000,
    disabled: true,
  },
};

export const MARKET_ITEMS: Record<MarketItem, Craftable> = {
  Nancy: {
    name: "Nancy",
    description: "Keeps a few crows away. Crops grow 15% faster",
    price: new Decimal(10),
    ingredients: [
      {
        item: "Wheat",
        amount: new Decimal(100),
      },
      {
        item: "Wood",
        amount: new Decimal(50),
      },
    ],
    supply: 50000,
    section: Section.Scarecrow,
  },
  Scarecrow: {
    name: "Scarecrow",
    description: "A goblin scarecrow. Yield 20% more crops",
    price: new Decimal(50),
    ingredients: [
      {
        item: "Wheat",
        amount: new Decimal(400),
      },
      {
        item: "Wood",
        amount: new Decimal(50),
      },
      {
        item: "Nancy",
        amount: new Decimal(1),
      },
    ],
    limit: 1,
    supply: 5000,
    disabled: false,
    section: Section.Scarecrow,
  },
  Kuebiko: {
    name: "Kuebiko",
    description:
      "Even the shopkeeper is scared of this scarecrow. Seeds are free",
    price: new Decimal(300),
    ingredients: [
      {
        item: "Wheat",
        amount: new Decimal(600),
      },
      {
        item: "Scarecrow",
        amount: new Decimal(1),
      },
    ],
    supply: 209,
    disabled: true,
    section: Section.Scarecrow,
  },
  "Golden Cauliflower": {
    name: "Golden Cauliflower",
    description: "Double the rewards from cauliflowers",
    price: new Decimal(100),
    ingredients: [
      {
        item: "Cauliflower",
        amount: new Decimal(500),
      },
      {
        item: "Gold",
        amount: new Decimal(100),
      },
    ],
    supply: 113,
    disabled: true,
  },
  "Mysterious Parsnip": {
    name: "Mysterious Parsnip",
    description: "Parsnips grow 50% faster",
    price: new Decimal(0),
    ingredients: [
      {
        item: "Parsnip",
        amount: new Decimal(500),
      },
      {
        item: "Gold",
        amount: new Decimal(50),
      },
    ],
    supply: 512,
    disabled: true,
  },
  "Carrot Sword": {
    name: "Carrot Sword",
    description: "Increase chance of a mutant crop appearing",
    price: new Decimal(50),
    ingredients: [
      {
        item: "Carrot",
        amount: new Decimal(2000),
      },
    ],
    supply: 1000,
  },
};

export const BARN_ITEMS: Record<BarnItem, Craftable> = {
  "Chicken Coop": {
    name: "Chicken Coop",
    description: "Collect 3x the amount of eggs",
    price: new Decimal(50),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(100),
      },
      {
        item: "Gold",
        amount: new Decimal(50),
      },
      {
        item: "Egg",
        amount: new Decimal(2000),
      },
    ],
    supply: 1000,
    limit: 1,
    section: Section["Chicken Coop"],
    disabled: true,
  },
  "Farm Cat": {
    name: "Farm Cat",
    description: "Keep the rats away",
    price: new Decimal(50),
    ingredients: [],
    supply: 0,
    section: Section["Farm Cat"],
  },
  "Farm Dog": {
    name: "Farm Dog",
    description: "Herd sheep 4x faster",
    price: new Decimal(75),
    ingredients: [],
    supply: 0,
    section: Section["Farm Dog"],
  },
  "Gold Egg": {
    name: "Gold Egg",
    description: "A rare egg, what lays inside?",
    price: new Decimal(0),
    ingredients: [
      {
        item: "Egg",
        amount: new Decimal(150),
      },
      {
        item: "Gold",
        amount: new Decimal(50),
      },
    ],
    supply: 250,
    disabled: true,
  },
  "Easter Bunny": {
    name: "Easter Bunny",
    description: "Earn 20% more Carrots",
    price: new Decimal(0),
    ingredients: [
      {
        item: "Egg Basket",
        amount: new Decimal(1),
      },
      {
        item: "Blue Egg",
        amount: new Decimal(1),
      },
      {
        item: "Yellow Egg",
        amount: new Decimal(1),
      },
      {
        item: "Green Egg",
        amount: new Decimal(1),
      },
      {
        item: "Purple Egg",
        amount: new Decimal(1),
      },
      {
        item: "Orange Egg",
        amount: new Decimal(1),
      },
      {
        item: "Pink Egg",
        amount: new Decimal(1),
      },
      {
        item: "Red Egg",
        amount: new Decimal(1),
      },
    ],
    supply: 100000,
    disabled: false,
    section: Section["Easter Bunny"],
  },
};

export const ANIMALS: Record<Animal, Craftable> = {
  Chicken: {
    name: "Chicken",
    description: "Produces eggs. Requires wheat for feeding",
    price: new Decimal(5),
    ingredients: [],
    disabled: true,
  },
  Cow: {
    name: "Cow",
    description: "Produces milk. Requires wheat for feeding",
    price: new Decimal(50),
    ingredients: [],
    disabled: true,
  },
  Pig: {
    name: "Pig",
    description: "Produces manure. Requires wheat for feeding",
    price: new Decimal(20),
    ingredients: [],
    disabled: true,
  },
  Sheep: {
    name: "Sheep",
    description: "Produces wool. Requires wheat for feeding",
    price: new Decimal(20),
    ingredients: [],
    disabled: true,
  },
};

export const CRAFTABLES: () => Record<CraftableName, Craftable> = () => ({
  ...TOOLS,
  ...BLACKSMITH_ITEMS,
  ...BARN_ITEMS,
  ...MARKET_ITEMS,
  ...SEEDS(),
  ...FOODS(),
  ...ANIMALS,
  ...FLAGS,
});

export const RARE_ITEMS: Record<LimitedItem, Craftable> = {
  ...BLACKSMITH_ITEMS,
  ...BARN_ITEMS,
  ...MARKET_ITEMS,
  ...FLAGS,
};
