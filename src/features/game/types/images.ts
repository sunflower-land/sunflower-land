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
import crown from "assets/nfts/goblin_crown.png";
import fountain from "assets/nfts/fountain.gif";
import beaver from "assets/nfts/beaver.png";

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
  secondaryImage?: any;
};

type Items = Record<InventoryItemName, ItemDetails>;

const crops = CROPS();
const seeds = SEEDS();
export const ITEM_DETAILS: Items = {
  // Crops
  Sunflower: {
    ...crops.Sunflower,
    image: sunflowerCrop,
  },
  Potato: {
    ...crops.Potato,
    image: potatoCrop,
  },
  Pumpkin: {
    ...crops.Pumpkin,
    image: pumpkinCrop,
  },
  Carrot: {
    ...crops.Carrot,
    image: carrotCrop,
  },
  Cabbage: {
    ...crops.Cabbage,
    image: cabbageCrop,
  },
  Beetroot: {
    ...crops.Beetroot,
    image: beetrootCrop,
  },
  Cauliflower: {
    ...crops.Cauliflower,
    image: cauliflowerCrop,
  },
  Parsnip: {
    ...crops.Parsnip,
    image: parsnipCrop,
  },
  Radish: {
    ...crops.Radish,
    image: radishCrop,
  },
  Wheat: {
    ...crops.Wheat,
    image: wheatCrop,
  },

  // Seeds
  "Sunflower Seed": {
    ...seeds["Sunflower Seed"],
    image: sunflowerSeed,
    secondaryImage: sunflowerCrop,
  },
  "Potato Seed": {
    ...seeds["Potato Seed"],
    image: potatoSeed,
    secondaryImage: potatoCrop,
  },
  "Pumpkin Seed": {
    ...seeds["Pumpkin Seed"],
    image: pumpkinSeed,
    secondaryImage: pumpkinCrop,
  },
  "Carrot Seed": {
    ...seeds["Carrot Seed"],
    image: carrotSeed,
    secondaryImage: carrotCrop,
  },
  "Cabbage Seed": {
    ...seeds["Cabbage Seed"],
    image: cabbageSeed,
    secondaryImage: cabbageCrop,
  },
  "Beetroot Seed": {
    ...seeds["Beetroot Seed"],
    image: beetrootSeed,
    secondaryImage: beetrootCrop,
  },
  "Cauliflower Seed": {
    ...seeds["Cauliflower Seed"],
    image: cauliflowerSeed,
    secondaryImage: cauliflowerCrop,
  },
  "Parsnip Seed": {
    ...seeds["Parsnip Seed"],
    image: parsnipSeed,
    secondaryImage: parsnipCrop,
  },
  "Radish Seed": {
    ...seeds["Radish Seed"],
    image: radishSeed,
    secondaryImage: radishCrop,
  },
  "Wheat Seed": {
    ...seeds["Wheat Seed"],
    image: wheatSeed,
    secondaryImage: wheatCrop,
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

  // NFTs

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
  "Goblin Crown": {
    ...LimitedItems["Goblin Crown"],
    image: crown,
  },
  Fountain: {
    ...LimitedItems["Fountain"],
    image: fountain,
  },
  Beaver: {
    ...LimitedItems["Beaver"],
    image: beaver,
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
