// TODO - import types
import sunflowerSeed from "assets/crops/sunflower/seed.png";
import sunflowerSeedling from "assets/crops/sunflower/seedling.png";
import sunflowerPlant from "assets/crops/sunflower/planted.png";
import sunflowerCrop from "assets/crops/sunflower/crop.png";

import potatoSeed from "assets/crops/potato/seed.png";
import potatoSeedling from "assets/crops/potato/seedling.png";
import potatoPlant from "assets/crops/potato/plant.png";
import potatoCrop from "assets/crops/potato/crop.png";

import pumpkinSeed from "assets/crops/pumpkin/seed.png";
import pumpkinSeedling from "assets/crops/pumpkin/seedling.png";
import pumpkinPlant from "assets/crops/pumpkin/plant.png";
import pumpkinCrop from "assets/crops/pumpkin/crop.png";

import carrotSeed from "assets/crops/carrot/seed.png";
import carrotSeedling from "assets/crops/carrot/seedling.png";
import carrotPlant from "assets/crops/carrot/plant.png";
import carrotCrop from "assets/crops/carrot/crop.png";

import cabbageSeed from "assets/crops/cabbage/seed.png";
import cabbageSeedling from "assets/crops/cabbage/seedling.png";
import cabbagePlant from "assets/crops/cabbage/plant.png";
import cabbageCrop from "assets/crops/cabbage/crop.png";

import beetrootSeed from "assets/crops/beetroot/seed.png";
import beetrootSeedling from "assets/crops/beetroot/seedling.png";
import beetrootPlant from "assets/crops/beetroot/plant.png";
import beetrootCrop from "assets/crops/beetroot/crop.png";

import cauliflowerSeed from "assets/crops/cauliflower/seed.png";
import cauliflowerSeedling from "assets/crops/cauliflower/seedling.png";
import cauliflowerPlant from "assets/crops/cauliflower/plant.png";
import cauliflowerCrop from "assets/crops/cauliflower/crop.png";

import parsnipSeed from "assets/crops/parsnip/seed.png";
import parsnipSeedling from "assets/crops/parsnip/seedling.png";
import parsnipPlant from "assets/crops/parsnip/plant.png";
import parsnipCrop from "assets/crops/parsnip/crop.png";

import radishSeed from "assets/crops/radish/seed.png";
import radishSeedling from "assets/crops/radish/seedling.png";
import radishPlant from "assets/crops/radish/plant.png";
import radishCrop from "assets/crops/radish/crop.png";

import wheatSeed from "assets/crops/wheat/seed.png";
import wheatSeedling from "assets/crops/wheat/seedling.png";
import wheatPlant from "assets/crops/wheat/plant.png";
import wheatCrop from "assets/crops/wheat/crop.png";

import { Craftable } from "./craftables";

export type CropName =
  | "Sunflower"
  | "Potato"
  | "Pumpkin"
  | "Carrot"
  | "Cabbage"
  | "Beetroot"
  | "Cauliflower"
  | "Parsnip"
  | "Radish"
  | "Wheat";

export type Crop = {
  buyPrice: number;
  sellPrice: number;
  harvestSeconds: number;
  name: CropName;
  description: string;
  images: {
    seed: any;
    seedling: any;
    ready: any;
    shop: any;
  };
};

/**
 * Crops and their original prices
 * TODO - use crop name from GraphQL API
 */
export const CROPS: Record<CropName, Crop> = {
  Sunflower: {
    buyPrice: 0.01,
    sellPrice: 0.02,
    harvestSeconds: 1 * 60,
    name: "Sunflower",
    description: "A sunny flower",
    images: {
      seed: sunflowerSeed,
      seedling: sunflowerSeedling,
      ready: sunflowerPlant,
      shop: sunflowerCrop,
    },
  },
  Potato: {
    buyPrice: 0.1,
    sellPrice: 0.14,
    harvestSeconds: 5 * 60,
    name: "Potato",
    description: "A nutrious crop for any diet",
    images: {
      seed: potatoSeed,
      seedling: potatoSeedling,
      ready: potatoPlant,
      shop: potatoCrop,
    },
  },
  Pumpkin: {
    buyPrice: 0.2,
    sellPrice: 0.4,
    harvestSeconds: 30 * 60,
    name: "Pumpkin",
    description: "A nutrious crop for any diet",
    images: {
      seed: pumpkinSeed,
      seedling: pumpkinSeedling,
      ready: pumpkinPlant,
      shop: pumpkinCrop,
    },
  },
  Carrot: {
    buyPrice: 0.5,
    sellPrice: 0.8,
    harvestSeconds: 60 * 60,
    name: "Carrot",
    description: "A nutrious crop for any diet",
    images: {
      seed: carrotSeed,

      seedling: carrotSeedling,
      ready: carrotPlant,
      shop: carrotCrop,
    },
  },
  Cabbage: {
    buyPrice: 1,
    sellPrice: 1.5,
    harvestSeconds: 2 * 60 * 60,
    name: "Cabbage",
    description: "A nutrious crop for any diet",
    images: {
      seed: cabbageSeed,
      seedling: cabbageSeedling,
      ready: cabbagePlant,
      shop: cabbageCrop,
    },
  },
  Beetroot: {
    buyPrice: 2,
    sellPrice: 2.8,
    harvestSeconds: 4 * 60 * 60,

    name: "Beetroot",

    description: "A nutrious crop for any diet",
    images: {
      seed: beetrootSeed,
      seedling: beetrootSeedling,
      ready: beetrootPlant,
      shop: beetrootCrop,
    },
  },
  Cauliflower: {
    buyPrice: 3,
    sellPrice: 4.25,
    harvestSeconds: 8 * 60 * 60,
    name: "Cauliflower",
    description: "A nutrious crop for any diet",

    images: {
      seed: cauliflowerSeed,
      seedling: cauliflowerSeedling,
      ready: cauliflowerPlant,
      shop: cauliflowerCrop,
    },
  },
  Parsnip: {
    buyPrice: 5,
    sellPrice: 6.5,
    harvestSeconds: 12 * 60 * 60,
    name: "Parsnip",
    description: "A nutrious crop for any diet",
    images: {
      seed: parsnipSeed,
      seedling: parsnipSeedling,
      ready: parsnipPlant,
      shop: parsnipCrop,
    },
  },
  Radish: {
    buyPrice: 7,
    sellPrice: 9.5,
    harvestSeconds: 24 * 60 * 60,
    name: "Radish",
    description: "A nutrious crop for any diet",
    images: {
      seed: radishSeed,
      seedling: radishSeedling,
      ready: radishPlant,
      shop: radishCrop,
    },
  },
  Wheat: {
    buyPrice: 0.1,
    sellPrice: 0.14,
    harvestSeconds: 5 * 60,
    name: "Wheat",
    description: "A nutrious crop for any diet",
    images: {
      seed: wheatSeed,
      seedling: wheatSeedling,
      ready: wheatPlant,
      shop: wheatCrop,
    },
  },
};

export type SeedName = `${CropName} Seed`;

export const SEEDS: Record<SeedName, Craftable> = {
  "Sunflower Seed": {
    name: "Sunflower Seed",
    price: 0.01,
    ingredients: [],
    description: "A sunny flower",
    image: sunflowerSeed,
  },
  "Potato Seed": {
    name: "Potato Seed",
    price: 0.1,
    ingredients: [],
    description: "A nutrious crop for any diet",
    image: potatoSeed,
  },
  "Pumpkin Seed": {
    name: "Pumpkin Seed",
    description: "A nutrious crop for any diet",
    price: 0.2,
    ingredients: [],
    image: pumpkinSeed,
  },
  "Carrot Seed": {
    name: "Carrot Seed",
    description: "A nutrious crop for any diet",
    price: 0.5,
    ingredients: [],
    image: carrotSeed,
    requires: "Pumpkin Soup",
  },
  "Cabbage Seed": {
    name: "Cabbage Seed",
    description: "A nutrious crop for any diet",
    price: 1,
    ingredients: [],
    image: cabbageSeed,
    requires: "Pumpkin Soup",
  },
  "Beetroot Seed": {
    name: "Beetroot Seed",
    description: "A nutrious crop for any diet",
    price: 2,
    ingredients: [],
    image: beetrootSeed,
    requires: "Pumpkin Soup",
  },
  "Cauliflower Seed": {
    name: "Cauliflower Seed",
    description: "A nutrious crop for any diet",
    price: 3,
    ingredients: [],
    image: cauliflowerSeed,
    requires: "Pumpkin Soup",
  },
  "Parsnip Seed": {
    name: "Parsnip Seed",
    description: "A nutrious crop for any diet",
    price: 5,
    ingredients: [],
    image: parsnipSeed,
    requires: "Pumpkin Soup",
  },
  "Radish Seed": {
    name: "Radish Seed",
    description: "A nutrious crop for any diet",
    price: 7,
    ingredients: [],
    image: radishSeed,
    requires: "Pumpkin Soup",
  },
  "Wheat Seed": {
    name: "Wheat Seed",
    description: "A nutrious crop for any diet",
    price: 2,
    ingredients: [],
    image: wheatSeed,
    requires: "Pumpkin Soup",
  },
};
