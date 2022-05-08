import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { CraftableItem } from "./craftables";

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
  buyPrice: Decimal;
  sellPrice: Decimal;
  harvestSeconds: number;
  name: CropName;
  description: string;
};

/**
 * Crops and their original prices
 * TODO - use crop name from GraphQL API
 */
export const CROPS: () => Record<CropName, Crop> = () => ({
  Sunflower: {
    buyPrice: marketRate(0.01),
    sellPrice: marketRate(0.02),
    harvestSeconds: 1 * 60,
    name: "Sunflower",
    description: "A sunny flower",
  },
  Potato: {
    buyPrice: marketRate(0.1),
    sellPrice: marketRate(0.14),
    harvestSeconds: 5 * 60,
    name: "Potato",
    description: "Healthier than you might think.",
  },
  Pumpkin: {
    buyPrice: marketRate(0.2),
    sellPrice: marketRate(0.4),
    harvestSeconds: 30 * 60,
    name: "Pumpkin",
    description: "There's more to pumpkin than pie.",
  },
  Carrot: {
    buyPrice: marketRate(0.5),
    sellPrice: marketRate(0.8),
    harvestSeconds: 60 * 60,
    name: "Carrot",
    description: "They're good for your eyes!",
  },
  Cabbage: {
    buyPrice: marketRate(1),
    sellPrice: marketRate(1.5),
    harvestSeconds: 2 * 60 * 60,
    name: "Cabbage",
    description: "Once a luxury, now a food for many.",
  },
  Beetroot: {
    buyPrice: marketRate(2),
    sellPrice: marketRate(2.8),
    harvestSeconds: 4 * 60 * 60,

    name: "Beetroot",

    description: "Good for hangovers!",
  },
  Cauliflower: {
    buyPrice: marketRate(3),
    sellPrice: marketRate(4.25),
    harvestSeconds: 8 * 60 * 60,
    name: "Cauliflower",
    description: "Excellent rice substitute!",
  },
  Parsnip: {
    buyPrice: marketRate(5),
    sellPrice: marketRate(6.5),
    harvestSeconds: 12 * 60 * 60,
    name: "Parsnip",
    description: "Not to be mistaken for carrots.",
  },
  Radish: {
    buyPrice: marketRate(7),
    sellPrice: marketRate(9.5),
    harvestSeconds: 24 * 60 * 60,
    name: "Radish",
    description: "Give it some time, it's worth the wait!",
  },
  Wheat: {
    buyPrice: marketRate(5),
    sellPrice: marketRate(7),
    harvestSeconds: 24 * 60 * 60,
    name: "Wheat",
    description: "The most harvested crop in the world.",
  },
});

export type SeedName = `${CropName} Seed`;

export const SEEDS: () => Record<SeedName, CraftableItem> = () => ({
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
  },
  "Carrot Seed": {
    name: "Carrot Seed",
    description: "They're good for your eyes!",
    tokenAmount: marketRate(0.5),
    ingredients: [],
    requires: "Pumpkin Soup",
  },
  "Cabbage Seed": {
    name: "Cabbage Seed",
    description: "Once a luxury, now a food for many.",
    tokenAmount: marketRate(1),
    ingredients: [],
    requires: "Pumpkin Soup",
  },
  "Beetroot Seed": {
    name: "Beetroot Seed",
    description: "Good for hangovers!",
    tokenAmount: marketRate(2),
    ingredients: [],
    requires: "Sauerkraut",
  },
  "Cauliflower Seed": {
    name: "Cauliflower Seed",
    description: "Excellent rice substitute!",
    tokenAmount: marketRate(3),
    ingredients: [],
    requires: "Sauerkraut",
  },
  "Parsnip Seed": {
    name: "Parsnip Seed",
    description: "Not to be mistaken for carrots.",
    tokenAmount: marketRate(5),
    ingredients: [],
    requires: "Roasted Cauliflower",
  },
  "Radish Seed": {
    name: "Radish Seed",
    description: "Give it some time, it's worth the wait!",
    tokenAmount: marketRate(7),
    ingredients: [],
    requires: "Roasted Cauliflower",
  },
  "Wheat Seed": {
    name: "Wheat Seed",
    description: "The most harvested crop in the world.",
    tokenAmount: marketRate(5),
    ingredients: [],
    requires: "Radish Pie",
  },
});
