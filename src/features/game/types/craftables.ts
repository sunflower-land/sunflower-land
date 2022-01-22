// Tools
import axe from "assets/tools/axe.png";
import woodPickaxe from "assets/tools/wood_pickaxe.png";
import stonePickaxe from "assets/tools/stone_pickaxe.png";
import ironPickaxe from "assets/tools/iron_pickaxe.png";
import hammer from "assets/tools/hammer.png";
import rod from "assets/tools/fishing_rod.png";

// NFTs
import chickenCoop from "assets/nfts/chicken_coop.png";
import christmasTree from "assets/nfts/christmas_tree.png";
import farmCat from "assets/nfts/farm_cat.png";
import farmDog from "assets/nfts/farm_dog.png";
import gnome from "assets/nfts/gnome.png";
import goldEgg from "assets/nfts/gold_egg.png";
import potatoStatue from "assets/nfts/potato_statue.png";
import scarecrow from "assets/nfts/scarecrow.png";
import sunflowerStatue from "assets/nfts/sunflower_statue.png";
import pumpkinSoup from "assets/nfts/pumpkin_soup.png";

import { SeedName, SEEDS } from "../types/crops";
import { InventoryItemName } from "../types/game";

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

export type CraftableName = NFT | Tool | SeedName;

export type Craftable = {
  name: CraftableName;
  image: any;
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
  | "Pumpkin Soup";

export type Tool =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Hammer"
  | "Rod";

export const TOOLS: Record<Tool, Craftable> = {
  Axe: {
    name: "Axe",
    image: axe,
    description: "Used to collect wood",
    price: 1,
    ingredients: [],
  },
  Pickaxe: {
    name: "Pickaxe",
    image: woodPickaxe,
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
    image: stonePickaxe,
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
    image: ironPickaxe,
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
    image: hammer,
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
    image: rod,
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
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    image: pumpkinSoup,
    description: "A creamy soup that goblins love",
    price: 5,
    ingredients: [
      {
        item: "Pumpkin",
        amount: 5,
      },
    ],
    limit: 1,
    type: "NFT",
  },
  "Sunflower Statue": {
    name: "Sunflower Statue",
    image: sunflowerStatue,
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
    name: "Potato Statue",
    image: potatoStatue,
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
    image: scarecrow,
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
    image: christmasTree,
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
    image: chickenCoop,
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
    image: farmCat,
    description: "Keep the rats away",
    price: 50,
    ingredients: [],
    amountLeft: 0,
    type: "NFT",
  },
  "Farm Dog": {
    name: "Farm Dog",
    image: farmDog,
    description: "Herd sheep 4x faster",
    price: 75,
    ingredients: [],
    amountLeft: 0,
    type: "NFT",
  },
  Gnome: {
    name: "Gnome",
    image: gnome,
    description: "A lucky gnome",
    price: 10,
    ingredients: [],
    amountLeft: 0,
    type: "NFT",
  },
  "Gold Egg": {
    name: "Gold Egg",
    image: goldEgg,
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
};
