// CROPS
import sunflowerSeed from "assets/crops/sunflower/seed.png";
import sunflowerCrop from "assets/crops/sunflower/crop.png";
import potatoSeed from "assets/crops/potato/seed.png";
import potatoCrop from "assets/crops/potato/crop.png";
import pumpkinSeed from "assets/crops/pumpkin/seed.png";
import pumpkinCrop from "assets/crops/pumpkin/crop.png";
import carrotSeed from "assets/crops/carrot/seed.png";
import carrotCrop from "assets/crops/carrot/crop.png";
import cabbageSeed from "assets/crops/cabbage/seed.png";
import cabbageCrop from "assets/crops/cabbage/crop.png";
import beetrootSeed from "assets/crops/beetroot/seed.png";
import beetrootCrop from "assets/crops/beetroot/crop.png";
import cauliflowerSeed from "assets/crops/cauliflower/seed.png";
import cauliflowerCrop from "assets/crops/cauliflower/crop.png";
import parsnipSeed from "assets/crops/parsnip/seed.png";
import parsnipCrop from "assets/crops/parsnip/crop.png";
import radishSeed from "assets/crops/radish/seed.png";
import radishCrop from "assets/crops/radish/crop.png";
import wheatSeed from "assets/crops/wheat/seed.png";
import wheatCrop from "assets/crops/wheat/crop.png";

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
import sunflowerRock from "assets/nfts/sunflower_rock.png";
import sunflowerTombstone from "assets/nfts/sunflower_tombstone.png";
import goldenCauliflower from "assets/nfts/golden_cauliflower.png";

// Foods
import flour from "assets/crops/wheat/flour.png";
import pumpkinSoup from "assets/nfts/pumpkin_soup.png";
import cabbageSoup from "assets/nfts/saurrerkrat.png";
import roastedCaulfilower from "assets/nfts/roasted_cauliflower.png";

// Resources
import stone from "assets/resources/stone.png";
import wood from "assets/resources/wood.png";
import egg from "assets/resources/egg.png";
import iron from "assets/resources/iron_ore.png";
import gold from "assets/resources/gold_ore.png";
import chicken from "assets/resources/chicken.png";

import { InventoryItemName } from "./game";
import { FOODS, LimitedItems, TOOLS } from "./craftables";
import { CROPS, SEEDS } from "./crops";
import { RESOURCES } from "./resources";

export type ItemDetails = {
  description: string;
  image: any;
};

type Items = Record<InventoryItemName, ItemDetails>;

export const ITEM_DETAILS: Items = {
  // Crops
  Sunflower: {
    ...CROPS.Sunflower,
    image: sunflowerCrop,
  },
  Potato: {
    ...CROPS.Potato,
    image: potatoCrop,
  },
  Pumpkin: {
    ...CROPS.Pumpkin,
    image: pumpkinCrop,
  },
  Carrot: {
    ...CROPS.Carrot,
    image: carrotCrop,
  },
  Cabbage: {
    ...CROPS.Cabbage,
    image: cabbageCrop,
  },
  Beetroot: {
    ...CROPS.Beetroot,
    image: beetrootCrop,
  },
  Cauliflower: {
    ...CROPS.Cauliflower,
    image: cauliflowerCrop,
  },
  Parsnip: {
    ...CROPS.Parsnip,
    image: parsnipCrop,
  },
  Radish: {
    ...CROPS.Radish,
    image: radishCrop,
  },
  Wheat: {
    ...CROPS.Wheat,
    image: wheatCrop,
  },

  // Seeds
  "Sunflower Seed": {
    ...SEEDS["Sunflower Seed"],
    image: sunflowerSeed,
  },
  "Potato Seed": {
    ...SEEDS["Potato Seed"],
    image: potatoSeed,
  },
  "Pumpkin Seed": {
    ...SEEDS["Pumpkin Seed"],
    image: pumpkinSeed,
  },
  "Carrot Seed": {
    ...SEEDS["Carrot Seed"],
    image: carrotSeed,
  },
  "Cabbage Seed": {
    ...SEEDS["Cabbage Seed"],
    image: cabbageSeed,
  },
  "Beetroot Seed": {
    ...SEEDS["Beetroot Seed"],
    image: beetrootSeed,
  },
  "Cauliflower Seed": {
    ...SEEDS["Cauliflower Seed"],
    image: cauliflowerSeed,
  },
  "Parsnip Seed": {
    ...SEEDS["Parsnip Seed"],
    image: parsnipSeed,
  },
  "Radish Seed": {
    ...SEEDS["Radish Seed"],
    image: radishSeed,
  },
  "Wheat Seed": {
    ...SEEDS["Wheat Seed"],
    image: wheatSeed,
  },

  // Resources
  Wood: {
    ...RESOURCES["Wood"],
    image: wood,
  },
  Stone: {
    ...RESOURCES["Stone"],
    image: stone,
  },
  Iron: {
    ...RESOURCES["Iron"],
    image: iron,
  },
  Gold: {
    ...RESOURCES["Gold"],
    image: gold,
  },
  Egg: {
    ...RESOURCES["Egg"],
    image: egg,
  },
  Chicken: {
    ...RESOURCES["Chicken"],
    image: chicken,
  },

  // TOOLS
  Axe: {
    ...TOOLS["Axe"],
    image: axe,
  },
  Pickaxe: {
    ...TOOLS["Pickaxe"],
    image: woodPickaxe,
  },
  "Stone Pickaxe": {
    ...TOOLS["Stone Pickaxe"],
    image: stonePickaxe,
  },
  "Iron Pickaxe": {
    ...TOOLS["Iron Pickaxe"],
    image: ironPickaxe,
  },
  Hammer: {
    ...TOOLS["Hammer"],
    image: hammer,
  },
  Rod: {
    ...TOOLS["Rod"],
    image: rod,
  },

  "Sunflower Statue": {
    ...LimitedItems["Sunflower Statue"],
    image: sunflowerStatue,
  },
  "Potato Statue": {
    ...LimitedItems["Potato Statue"],
    image: potatoStatue,
  },
  Scarecrow: {
    ...LimitedItems["Scarecrow"],
    image: scarecrow,
  },
  "Christmas Tree": {
    ...LimitedItems["Christmas Tree"],
    image: christmasTree,
  },
  Gnome: {
    ...LimitedItems["Gnome"],
    image: gnome,
  },
  "Gold Egg": {
    ...LimitedItems["Gold Egg"],
    image: goldEgg,
  },
  "Farm Cat": {
    ...LimitedItems["Farm Cat"],
    image: farmCat,
  },
  "Farm Dog": {
    ...LimitedItems["Farm Dog"],
    image: farmDog,
  },
  "Chicken Coop": {
    ...LimitedItems["Chicken Coop"],
    image: chickenCoop,
  },
  "Golden Cauliflower": {
    ...LimitedItems["Golden Cauliflower"],
    image: goldenCauliflower,
  },
  "Sunflower Rock": {
    ...LimitedItems["Sunflower Rock"],
    image: sunflowerRock,
  },
  "Sunflower Tombstone": {
    ...LimitedItems["Sunflower Tombstone"],
    image: sunflowerTombstone,
  },

  // FOOD

  "Pumpkin Soup": {
    ...FOODS["Pumpkin Soup"],
    image: pumpkinSoup,
  },

  Sauerkraut: {
    ...FOODS["Sauerkraut"],
    image: cabbageSoup,
  },
  "Roasted Cauliflower": {
    ...FOODS["Roasted Cauliflower"],
    image: roastedCaulfilower,
  },
  Flour: {
    ...FOODS["Flour"],
    image: flour,
  },
};
