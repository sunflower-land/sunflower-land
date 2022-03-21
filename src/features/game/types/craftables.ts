import Decimal from "decimal.js-light";
import { SeedName, SEEDS } from "../types/crops";
import { InventoryItemName } from "../types/game";
import { Section } from "lib/utils/hooks/useScrollIntoView";

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

export type LimitedItem =
  | "Sunflower Statue"
  | "Potato Statue"
  | "Christmas Tree"
  | "Scarecrow"
  | "Farm Cat"
  | "Farm Dog"
  | "Gnome"
  | "Chicken Coop"
  | "Gold Egg"
  | "Golden Cauliflower"
  | "Sunflower Tombstone"
  | "Sunflower Rock"
  | "Goblin Crown"
  | "Fountain"
  | "Woody the Beaver"
  | "Apprentice Beaver"
  | "Foreman Beaver";

export type Tool =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Hammer"
  | "Rod";

export type Food =
  | "Flour"
  | "Pumpkin Soup"
  | "Roasted Cauliflower"
  | "Sauerkraut";

export type Animal = "Chicken" | "Cow" | "Pig" | "Sheep";

export type Flag = "Sunflower Flag" | "Pakistan Flag";

export const FOODS: Record<Food, Craftable> = {
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: "A creamy soup that goblins love",
    price: new Decimal(0),
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
    price: new Decimal(0),
    ingredients: [
      {
        item: "Cabbage",
        amount: new Decimal(20),
      },
    ],
  },
  "Roasted Cauliflower": {
    name: "Roasted Cauliflower",
    description: "A Goblin's favourite",
    price: new Decimal(0),
    ingredients: [
      {
        item: "Cauliflower",
        amount: new Decimal(100),
      },
    ],
  },
  Flour: {
    name: "Flour",
    description: "Ground Wheat",
    price: new Decimal(0.1),
    ingredients: [
      {
        item: "Wheat",
        amount: new Decimal(3),
      },
    ],
  },
};

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
        item: "Iron",
        amount: new Decimal(2),
      },
    ],
    disabled: true,
  },
  Rod: {
    name: "Rod",
    description: "Used to fish trout",
    price: new Decimal(10),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(50),
      },
    ],
    disabled: true,
  },
};

export const LimitedItems: Record<LimitedItem, Craftable> = {
  "Sunflower Statue": {
    name: "Sunflower Statue",
    description: "Earn beta access to new features",
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
  Scarecrow: {
    name: "Scarecrow",
    description: "Grow wheat faster",
    price: new Decimal(50),
    ingredients: [
      {
        item: "Wheat",
        amount: new Decimal(10),
      },
      {
        item: "Wood",
        amount: new Decimal(10),
      },
    ],
    limit: 1,
    supply: 5000,
    disabled: true,
    section: Section.Scarecrow,
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
  "Chicken Coop": {
    name: "Chicken Coop",
    description: "Collect 3x the amount of eggs",
    price: new Decimal(50),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(10),
      },
      {
        item: "Stone",
        amount: new Decimal(10),
      },
      {
        item: "Gold",
        amount: new Decimal(10),
      },
    ],
    supply: 2000,
    limit: 1,
    section: Section["Chicken Coop"],
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
  Gnome: {
    name: "Gnome",
    description: "A lucky gnome",
    price: new Decimal(10),
    ingredients: [],
    supply: 0,
    section: Section.Gnome,
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
    requires: "Barn Manager",
  },
  "Sunflower Tombstone": {
    name: "Sunflower Tombstone",
    description: "In memory of Sunflower Farmers",
    price: new Decimal(0),
    ingredients: [],
    supply: 0,
    section: Section["Sunflower Tombstone"],
  },
  "Golden Cauliflower": {
    name: "Golden Cauliflower",
    description: "Double the rewards from cauliflowers",
    price: new Decimal(100),
    ingredients: [
      {
        item: "Cauliflower",
        amount: new Decimal(100),
      },
      {
        item: "Gold",
        amount: new Decimal(10),
      },
    ],
    supply: 100,
    requires: "Green Thumb",
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
  "Woody the Beaver": {
    name: "Woody the Beaver",
    description: "Increase wood drops by 1",
    price: new Decimal(50),
    ingredients: [
      {
        amount: new Decimal(200),
        item: "Wood",
      },
    ],
    supply: 500000,
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
        amount: new Decimal(500),
        item: "Woody the Beaver",
      },
    ],
    requires: "Lumberjack",
    supply: 5000,
  },
  "Foreman Beaver": {
    name: "Foreman Beaver",
    description: "Cut trees without axes",
    price: new Decimal(200),
    ingredients: [
      {
        amount: new Decimal(1000),
        item: "Wood",
      },
      {
        amount: new Decimal(500),
        item: "Apprentice Beaver",
      },
    ],
    supply: 300,
    requires: "Lumberjack",
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

export const FLAGS: Record<Flag, Craftable> = {
  "Sunflower Flag": {
    name: "Sunflower Flag",
    description: "Sunflower citizens flag",
    price: new Decimal(50),
    ingredients: [],
    disabled: true,
    supply: 1000,
  },
  "Pakistan Flag": {
    name: "Pakistan Flag",
    description: "A pakistani flag",
    price: new Decimal(50),
    ingredients: [],
    disabled: true,
    supply: 50000,
  },
};

export const CRAFTABLES: () => Record<CraftableName, Craftable> = () => ({
  ...TOOLS,
  ...LimitedItems,
  ...SEEDS(),
  ...FOODS,
  ...ANIMALS,
  ...FLAGS,
});
