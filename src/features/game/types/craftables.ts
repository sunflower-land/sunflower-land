import { SeedName, SEEDS } from "../types/crops";
import { InventoryItemName } from "../types/game";

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

export type CraftableName = NFT | Tool | SeedName | Food;

export type Craftable = {
  item_type: string;
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
  | "Gold Egg";

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
    item_type: "food",
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
    item_type: "food",
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
    item_type: "food",
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
    item_type: "food",
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
    item_type: "tool",
    name: "Axe",
    description: "Used to collect wood",
    price: 1,
    ingredients: [],
  },
  Pickaxe: {
    item_type: "tool",
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
    item_type: "tool",
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
    item_type: "tool",
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
    item_type: "tool",
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
    item_type: "tool",
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
    item_type: "nft",
    name: "Sunflower Statue",
    description: "A symbol of the holy token",
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
    item_type: "nft",
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
    item_type: "nft",
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
    item_type: "nft",
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
    item_type: "nft",
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
    item_type: "nft",
    name: "Farm Cat",
    description: "Keep the rats away",
    price: 50,
    ingredients: [],
    amountLeft: 0,
    type: "NFT",
  },
  "Farm Dog": {
    item_type: "nft",
    name: "Farm Dog",
    description: "Herd sheep 4x faster",
    price: 75,
    ingredients: [],
    amountLeft: 0,
    type: "NFT",
  },
  Gnome: {
    item_type: "nft",
    name: "Gnome",
    description: "A lucky gnome",
    price: 10,
    ingredients: [],
    amountLeft: 0,
    type: "NFT",
  },
  "Gold Egg": {
    item_type: "nft",
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
};

export const CRAFTABLES: Record<CraftableName, Craftable> = {
  ...TOOLS,
  ...NFTs,
  ...SEEDS,
  ...FOODS,
};
