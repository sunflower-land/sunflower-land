import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { CraftableItem } from "./craftables";
import { CONFIG } from "lib/config";
import { SEASONS } from "./seasons";

export type CropName =
  | "Sunflower"
  | "Potato"
  | "Pumpkin"
  | "Carrot"
  | "Cabbage"
  | "Beetroot"
  | "Cauliflower"
  | "Parsnip"
  | "Eggplant"
  | "Corn"
  | "Radish"
  | "Wheat"
  | "Kale";

export type Crop = {
  sellPrice: Decimal;
  harvestSeconds: number;
  name: CropName;
  description: string;
  bumpkinLevel: number;
  disabled?: boolean;
};

/**
 * Crops and their original prices
 */
export const CROPS: () => Record<CropName, Crop> = () => ({
  Sunflower: {
    name: "Sunflower",
    description: "A sunny flower",
    sellPrice: marketRate(0.02),
    bumpkinLevel: 1,
    harvestSeconds: 1 * 60,
  },
  Potato: {
    name: "Potato",
    description: "Healthier than you might think.",
    sellPrice: marketRate(0.14),
    bumpkinLevel: 1,
    harvestSeconds: 5 * 60,
  },
  Pumpkin: {
    name: "Pumpkin",
    description: "There's more to pumpkin than pie.",
    sellPrice: marketRate(0.4),
    bumpkinLevel: 3,
    harvestSeconds: 30 * 60,
  },
  Carrot: {
    name: "Carrot",
    description: "They're good for your eyes!",
    sellPrice: marketRate(0.8),
    bumpkinLevel: 3,
    harvestSeconds: 60 * 60,
  },
  Cabbage: {
    name: "Cabbage",
    description: "Once a luxury, now a food for many.",
    sellPrice: marketRate(1.5),
    bumpkinLevel: 3,
    harvestSeconds: 2 * 60 * 60,
  },
  Beetroot: {
    name: "Beetroot",
    description: "Good for hangovers!",
    sellPrice: marketRate(2.8),
    bumpkinLevel: 3,
    harvestSeconds: 4 * 60 * 60,
  },
  Cauliflower: {
    name: "Cauliflower",
    description: "Excellent rice substitute!",
    sellPrice: marketRate(4.25),
    bumpkinLevel: 4,
    harvestSeconds: 8 * 60 * 60,
  },
  Parsnip: {
    name: "Parsnip",
    description: "Not to be mistaken for carrots.",
    sellPrice: marketRate(6.5),
    bumpkinLevel: 4,
    harvestSeconds: 12 * 60 * 60,
  },
  Eggplant: {
    name: "Eggplant",
    description: "Nature's edible work of art.",
    sellPrice: marketRate(8),
    bumpkinLevel: 5,
    harvestSeconds: 16 * 60 * 60,
  },
  Corn: {
    name: "Corn",
    description: "Sun-kissed kernels of delight, nature's summer treasure.",
    sellPrice: marketRate(9),
    bumpkinLevel: 5,
    harvestSeconds: 20 * 60 * 60,
    disabled:
      CONFIG.NETWORK === "mainnet"
        ? new Date() < SEASONS["Witches' Eve"].startDate
        : false,
  },
  Radish: {
    name: "Radish",
    description: "Takes time but is worth the wait!",
    sellPrice: marketRate(9.5),
    bumpkinLevel: 5,
    harvestSeconds: 24 * 60 * 60,
  },
  Wheat: {
    name: "Wheat",
    description: "The most harvested crop in the world.",
    sellPrice: marketRate(7),
    bumpkinLevel: 5,
    harvestSeconds: 24 * 60 * 60,
  },
  Kale: {
    name: "Kale",
    description: "Bumpkin Power Food",
    sellPrice: marketRate(10),
    bumpkinLevel: 7,
    harvestSeconds: 36 * 60 * 60,
  },
});

export type CropSeedName = `${CropName} Seed`;

export const CROP_SEEDS: () => Record<CropSeedName, CraftableItem> = () => ({
  "Sunflower Seed": {
    name: "Sunflower Seed",
    description: "A sunny flower",
    tokenAmount: marketRate(0.01),
    ingredients: [],
  },
  "Potato Seed": {
    name: "Potato Seed",
    description: "Healthier than you might think.",
    tokenAmount: marketRate(0.1),
    ingredients: [],
  },
  "Pumpkin Seed": {
    name: "Pumpkin Seed",
    description: "There's more to pumpkin than pie.",
    tokenAmount: marketRate(0.2),
    bumpkinLevel: 2,
    ingredients: [],
  },
  "Carrot Seed": {
    name: "Carrot Seed",
    description: "They're good for your eyes!",
    tokenAmount: marketRate(0.5),
    bumpkinLevel: 2,
    ingredients: [],
  },
  "Cabbage Seed": {
    name: "Cabbage Seed",
    description: "Once a luxury, now a food for many.",
    tokenAmount: marketRate(1),
    bumpkinLevel: 3,
    ingredients: [],
  },
  "Beetroot Seed": {
    name: "Beetroot Seed",
    description: "Good for hangovers!",
    tokenAmount: marketRate(2),
    bumpkinLevel: 3,
    ingredients: [],
  },
  "Cauliflower Seed": {
    name: "Cauliflower Seed",
    description: "Excellent rice substitute!",
    tokenAmount: marketRate(3),
    bumpkinLevel: 4,
    ingredients: [],
  },
  "Parsnip Seed": {
    name: "Parsnip Seed",
    description: "Not to be mistaken for carrots.",
    tokenAmount: marketRate(5),
    bumpkinLevel: 4,
    ingredients: [],
  },
  "Eggplant Seed": {
    name: "Eggplant Seed",
    description: "Nature's edible work of art.",
    tokenAmount: marketRate(6),
    bumpkinLevel: 5,
    ingredients: [],
  },
  "Corn Seed": {
    name: "Corn Seed",
    description: "Sun-kissed kernels of delight, nature's summer treasure.",
    tokenAmount: marketRate(7),
    bumpkinLevel: 5,
    ingredients: [],
    disabled:
      CONFIG.NETWORK === "mainnet"
        ? new Date() < SEASONS["Witches' Eve"].startDate
        : false,
  },
  "Radish Seed": {
    name: "Radish Seed",
    description: "Takes time but is worth the wait!",
    tokenAmount: marketRate(7),
    bumpkinLevel: 5,
    ingredients: [],
  },
  "Wheat Seed": {
    name: "Wheat Seed",
    description: "The most harvested crop in the world.",
    tokenAmount: marketRate(5),
    bumpkinLevel: 5,
    ingredients: [],
  },
  "Kale Seed": {
    name: "Kale Seed",
    description: "A Bumpkin Power Food!",
    tokenAmount: marketRate(7),
    bumpkinLevel: 7,
    ingredients: [],
  },
});
