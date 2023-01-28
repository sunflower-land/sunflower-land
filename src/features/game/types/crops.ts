import Decimal from "decimal.js-light";

import { marketRate } from "../lib/halvening";
import { CraftableItem } from "./craftables";
import { ItemDetails } from "./game";

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
  | "Wheat"
  | "Kale";

export interface Crop extends ItemDetails {
  sellPrice: Decimal;
  harvestSeconds: number;
  name: CropName;
}

/**
 * Crops and their original prices
 */
export const CROPS: Record<CropName, Crop> = {
  Sunflower: {
    sellPrice: marketRate(0.02),
    harvestSeconds: 1 * 60,
    name: "Sunflower",
    description: "A sunny flower",
  },
  Potato: {
    sellPrice: marketRate(0.14),
    harvestSeconds: 5 * 60,
    name: "Potato",
    description: "Healthier than you might think.",
  },
  Pumpkin: {
    sellPrice: marketRate(0.4),
    harvestSeconds: 30 * 60,
    name: "Pumpkin",
    description: "There's more to pumpkin than pie.",
  },
  Carrot: {
    sellPrice: marketRate(0.8),
    harvestSeconds: 60 * 60,
    name: "Carrot",
    description: "They're good for your eyes!",
  },
  Cabbage: {
    sellPrice: marketRate(1.5),
    harvestSeconds: 2 * 60 * 60,
    name: "Cabbage",
    description: "Once a luxury, now a food for many.",
  },
  Beetroot: {
    sellPrice: marketRate(2.8),
    harvestSeconds: 4 * 60 * 60,
    name: "Beetroot",
    description: "Good for hangovers!",
  },
  Cauliflower: {
    sellPrice: marketRate(4.25),
    harvestSeconds: 8 * 60 * 60,
    name: "Cauliflower",
    description: "Excellent rice substitute!",
  },
  Parsnip: {
    sellPrice: marketRate(6.5),
    harvestSeconds: 12 * 60 * 60,
    name: "Parsnip",
    description: "Not to be mistaken for carrots.",
  },
  Radish: {
    sellPrice: marketRate(9.5),
    harvestSeconds: 24 * 60 * 60,
    name: "Radish",
    description: "Takes time but is worth the wait!",
  },
  Wheat: {
    sellPrice: marketRate(7),
    harvestSeconds: 24 * 60 * 60,
    name: "Wheat",
    description: "The most harvested crop in the world.",
  },
  Kale: {
    sellPrice: marketRate(10),
    harvestSeconds: 36 * 60 * 60,
    name: "Kale",
    description: "Bumpkin Power Food",
  },
};

export type CropSeedName = `${CropName} Seed`;

export const CROP_SEEDS: Record<CropSeedName, CraftableItem> = {
  "Sunflower Seed": {
    name: "Sunflower Seed",
    tokenAmount: marketRate(0.01),
    ingredients: [],
    description: "A sunny flower",
  },
  "Potato Seed": {
    name: "Potato Seed",
    tokenAmount: marketRate(0.1),
    ingredients: [],
    description: "Healthier than you might think.",
  },
  "Pumpkin Seed": {
    name: "Pumpkin Seed",
    description: "There's more to pumpkin than pie.",
    tokenAmount: marketRate(0.2),
    ingredients: [],
    bumpkinLevel: 2,
  },
  "Carrot Seed": {
    name: "Carrot Seed",
    description: "They're good for your eyes!",
    tokenAmount: marketRate(0.5),
    ingredients: [],
    bumpkinLevel: 2,
  },
  "Cabbage Seed": {
    name: "Cabbage Seed",
    description: "Once a luxury, now a food for many.",
    tokenAmount: marketRate(1),
    ingredients: [],
    bumpkinLevel: 3,
  },
  "Beetroot Seed": {
    name: "Beetroot Seed",
    description: "Good for hangovers!",
    tokenAmount: marketRate(2),
    ingredients: [],
    bumpkinLevel: 3,
  },
  "Cauliflower Seed": {
    name: "Cauliflower Seed",
    description: "Excellent rice substitute!",
    tokenAmount: marketRate(3),
    ingredients: [],
    bumpkinLevel: 4,
  },
  "Parsnip Seed": {
    name: "Parsnip Seed",
    description: "Not to be mistaken for carrots.",
    tokenAmount: marketRate(5),
    ingredients: [],
    bumpkinLevel: 4,
  },
  "Radish Seed": {
    name: "Radish Seed",
    description: "Takes time but is worth the wait!",
    tokenAmount: marketRate(7),
    ingredients: [],
    bumpkinLevel: 5,
  },
  "Wheat Seed": {
    name: "Wheat Seed",
    description: "The most harvested crop in the world.",
    tokenAmount: marketRate(5),
    ingredients: [],
    bumpkinLevel: 5,
  },
  "Kale Seed": {
    name: "Kale Seed",
    tokenAmount: marketRate(7),
    ingredients: [],
    description: "A Bumpkin Power Food!",
    bumpkinLevel: 7,
  },
};
