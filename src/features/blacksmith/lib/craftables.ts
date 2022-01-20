// Tools
import axe from "assets/tools/axe.png";
import woodPickaxe from "assets/tools/wood_pickaxe.png";

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

import { Craftable } from "features/game/events/craft";

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

export type Tool = "Axe" | "Pickaxe";

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
        amount: 1,
      },
    ],
  },
};

export const NFTs: Record<NFT, Craftable> = {
  "Sunflower Statue": {
    name: "Sunflower Statue",
    image: sunflowerStatue,
    description: "A symbol of the holy token",
    price: 50,
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
  },
  "Potato Statue": {
    name: "Potato Statue",
    image: potatoStatue,
    description: "The OG potato hustler flex",
    price: 1,
    ingredients: [
      {
        item: "Wood",
        amount: 1,
      },
    ],
  },
  Scarecrow: {
    name: "Scarecrow",
    image: scarecrow,
    description: "Keeps crows away from your crops",
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
  },
  "Christmas Tree": {
    name: "Christmas Tree",
    image: christmasTree,
    description: "Receieve a Santa Airdrop on Christmas day",
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
  },
  "Chicken Coop": {
    name: "Chicken Coop",
    image: chickenCoop,
    description: "Collect 3x the amount of eggs",
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
  },
  "Farm Cat": {
    name: "Farm Cat",
    image: farmCat,
    description: "Keep the rats away",
    price: 100,
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
  },
  "Farm Dog": {
    name: "Farm Dog",
    image: farmDog,
    description: "Herd sheep 4x faster",
    price: 100,
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
  },
  Gnome: {
    name: "Gnome",
    image: gnome,
    description: "A lucky gnome",
    price: 100,
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
  },
  "Gold Egg": {
    name: "Gold Egg",
    image: goldEgg,
    description: "A rare egg, what lays inside?",
    price: 100,
    ingredients: [
      {
        item: "Wheat",
        amount: 10,
      },
    ],
  },
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    image: pumpkinSoup,
    description: "A creamy soup that goblins love",
    price: 5,
    ingredients: [
      {
        item: "Pumpkin",
        amount: 0,
      },
    ],
  },
};
