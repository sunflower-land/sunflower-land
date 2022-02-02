import { SeedName, SEEDS } from "../types/crops";
import { InventoryItemName } from "../types/game";

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

export type CraftableName = NFT | Tool | SeedName | Food;

export type Craftable = {
  name: CraftableName;
  description: string;
  price: number;
  ingredients: {
    item: InventoryItemName;
    amount: number;
  }[];
  limit?: number;
  amountLeft?: number;
  disabled?: boolean;
  type?: "NFT";
  requires?: InventoryItemName;
};

export type NFT =
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
  | "Sunflower Rock";

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

export const FOODS: Record<Food, Craftable> = {
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: "A creamy soup that goblins love",
    price: 5,
    ingredients: [
      {
        item: "Pumpkin",
        amount: 5,
      },
    ],
    limit: 1,
  },
  Flour: {
    name: "Flour",
    description: "Ground Wheat",
    price: 0.1,
    ingredients: [
      {
        item: "Wheat",
        amount: 3,
      },
    ],
  },
  "Roasted Cauliflower": {
    name: "Roasted Cauliflower",
    description: "A Goblin's favourite",
    price: 0.1,
    ingredients: [
      {
        item: "Cauliflower",
        amount: 3,
      },
    ],
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description: "Fermented cabbage",
    price: 0.1,
    ingredients: [
      {
        item: "Cabbage",
        amount: 3,
      },
    ],
  },
};

export const TOOLS: Record<Tool, Craftable> = {
  Axe: {
    name: "Axe",
    description: "Used to collect wood",
    price: 1,
    ingredients: [],
  },
  Pickaxe: {
    name: "Pickaxe",
    description: "Used to collect stone",
    price: 1,
    ingredients: [
      {
        item: "Wood",
        amount: 2,
      },
    ],
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: "Used to collect iron",
    price: 2,
    ingredients: [
      {
        item: "Wood",
        amount: 3,
      },
      {
        item: "Stone",
        amount: 3,
      },
    ],
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description: "Used to collect gold",
    price: 5,
    ingredients: [
      {
        item: "Wood",
        amount: 5,
      },
      {
        item: "Iron",
        amount: 3,
      },
    ],
  },
  Hammer: {
    name: "Hammer",
    description: "Used to construct buildings",
    price: 5,
    ingredients: [
      {
        item: "Wood",
        amount: 5,
      },
      {
        item: "Iron",
        amount: 2,
      },
    ],
    disabled: true,
  },
  Rod: {
    name: "Rod",
    description: "Used to fish trout",
    price: 10,
    ingredients: [
      {
        item: "Wood",
        amount: 50,
      },
    ],
    disabled: true,
  },
};

export const NFTs: Record<NFT, Craftable> = {
  "Sunflower Statue": {
    name: "Sunflower Statue",
    description: "Earn beta access to new features",
    price: 5,
    ingredients: [
      {
        item: "Sunflower",
        amount: 1000,
      },
      {
        item: "Stone",
        amount: 50,
      },
    ],
    limit: 1,
    amountLeft: 812,
    type: "NFT",
  },
  "Potato Statue": {
    name: "Potato Statue",
    description: "The OG potato hustler flex",
    price: 0,
    ingredients: [
      {
        item: "Potato",
        amount: 100,
      },
      {
        item: "Stone",
        amount: 20,
      },
    ],
    limit: 1,
    amountLeft: 3412,
    type: "NFT",
  },
  Scarecrow: {
    name: "Scarecrow",
    description: "Grow wheat faster",
    price: 50,
    ingredients: [
      {
        item: "Wheat",
        amount: 10,
      },
      {
        item: "Wood",
        amount: 10,
      },
    ],
    limit: 1,
    amountLeft: 1700,
    type: "NFT",
  },
  "Christmas Tree": {
    name: "Christmas Tree",
    description: "Receieve a Santa Airdrop on Christmas day",
    price: 50,
    ingredients: [
      {
        item: "Wood",
        amount: 100,
      },
      {
        item: "Stone",
        amount: 50,
      },
    ],
    amountLeft: 0,
    type: "NFT",
  },
  "Chicken Coop": {
    name: "Chicken Coop",
    description: "Collect 3x the amount of eggs",
    price: 50,
    ingredients: [
      {
        item: "Wood",
        amount: 10,
      },
      {
        item: "Stone",
        amount: 10,
      },
      {
        item: "Gold",
        amount: 10,
      },
    ],
    amountLeft: 1856,
    limit: 1,
    type: "NFT",
  },
  "Farm Cat": {
    name: "Farm Cat",
    description: "Keep the rats away",
    price: 50,
    ingredients: [],
    amountLeft: 0,
    type: "NFT",
  },
  "Farm Dog": {
    name: "Farm Dog",
    description: "Herd sheep 4x faster",
    price: 75,
    ingredients: [],
    amountLeft: 0,
    type: "NFT",
  },
  Gnome: {
    name: "Gnome",
    description: "A lucky gnome",
    price: 10,
    ingredients: [],
    amountLeft: 0,
    type: "NFT",
  },
  "Gold Egg": {
    name: "Gold Egg",
    description: "A rare egg, what lays inside?",
    price: 0,
    ingredients: [
      {
        item: "Egg",
        amount: 150,
      },
      {
        item: "Gold",
        amount: 50,
      },
    ],
    amountLeft: 82,
    type: "NFT",
  },
  "Sunflower Tombstone": {
    name: "Sunflower Tombstone",
    description: "In memory of Sunflower Farmers",
    price: 0,
    ingredients: [],
    amountLeft: 0,
    type: "NFT",
  },
  "Golden Cauliflower": {
    name: "Golden Cauliflower",
    description: "Double the rewards from cauliflowers",
    price: 100,
    ingredients: [
      {
        item: "Cauliflower",
        amount: 100,
      },
      {
        item: "Gold",
        amount: 10,
      },
    ],
    amountLeft: 100,
  },
  "Sunflower Rock": {
    name: "Sunflower Rock",
    description: "The game that broke Polygon",
    price: 100,
    ingredients: [
      {
        item: "Sunflower",
        amount: 10000,
      },
      {
        item: "Iron",
        amount: 100,
      },
    ],
    amountLeft: 50,
  },
};

export const CRAFTABLES: Record<CraftableName, Craftable> = {
  ...TOOLS,
  ...NFTs,
  ...SEEDS,
  ...FOODS,
};
