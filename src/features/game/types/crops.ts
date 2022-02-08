import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
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
    description: "A nutrious crop for any diet",
  },
  Pumpkin: {
    buyPrice: marketRate(0.2),
    sellPrice: marketRate(0.4),
    harvestSeconds: 30 * 60,
    name: "Pumpkin",
    description: "A nutrious crop for any diet",
  },
  Carrot: {
    buyPrice: marketRate(0.5),
    sellPrice: marketRate(0.8),
    harvestSeconds: 60 * 60,
    name: "Carrot",
    description: "A nutrious crop for any diet",
  },
  Cabbage: {
    buyPrice: marketRate(1),
    sellPrice: marketRate(1.5),
    harvestSeconds: 2 * 60 * 60,
    name: "Cabbage",
    description: "A nutrious crop for any diet",
  },
  Beetroot: {
    buyPrice: marketRate(2),
    sellPrice: marketRate(2.8),
    harvestSeconds: 4 * 60 * 60,

    name: "Beetroot",

    description: "A nutrious crop for any diet",
  },
  Cauliflower: {
    buyPrice: marketRate(3),
    sellPrice: marketRate(4.25),
    harvestSeconds: 8 * 60 * 60,
    name: "Cauliflower",
    description: "A nutrious crop for any diet",
  },
  Parsnip: {
    buyPrice: marketRate(5),
    sellPrice: marketRate(6.5),
    harvestSeconds: 12 * 60 * 60,
    name: "Parsnip",
    description: "A nutrious crop for any diet",
  },
  Radish: {
    buyPrice: marketRate(7),
    sellPrice: marketRate(9.5),
    harvestSeconds: 24 * 60 * 60,
    name: "Radish",
    description: "A nutrious crop for any diet",
  },
  Wheat: {
    buyPrice: marketRate(0.1),
    sellPrice: marketRate(0.14),
    harvestSeconds: 5 * 60,
    name: "Wheat",
    description: "A nutrious crop for any diet",
  },
});

export type SeedName = `${CropName} Seed`;

export const SEEDS: () => Record<SeedName, Craftable> = () => ({
  "Sunflower Seed": {
    name: "Sunflower Seed",
    price: marketRate(0.01),
    ingredients: [],
    description: "A sunny flower",
  },
  "Potato Seed": {
    name: "Potato Seed",
    price: marketRate(0.1),
    ingredients: [],
    description: "A nutrious crop for any diet",
  },
  "Pumpkin Seed": {
    name: "Pumpkin Seed",
    description: "A nutrious crop for any diet",
    price: marketRate(0.2),
    ingredients: [],
  },
  "Carrot Seed": {
    name: "Carrot Seed",
    description: "A nutrious crop for any diet",
    price: marketRate(0.5),
    ingredients: [],
    requires: "Pumpkin Soup",
  },
  "Cabbage Seed": {
    name: "Cabbage Seed",
    description: "A nutrious crop for any diet",
    price: marketRate(1),
    ingredients: [],
    requires: "Pumpkin Soup",
  },
  "Beetroot Seed": {
    name: "Beetroot Seed",
    description: "A nutrious crop for any diet",
    price: marketRate(2),
    ingredients: [],
    requires: "Sauerkraut",
  },
  "Cauliflower Seed": {
    name: "Cauliflower Seed",
    description: "A nutrious crop for any diet",
    price: marketRate(3),
    ingredients: [],
    requires: "Sauerkraut",
  },
  "Parsnip Seed": {
    name: "Parsnip Seed",
    description: "A nutrious crop for any diet",
    price: marketRate(5),
    ingredients: [],
    requires: "Roasted Cauliflower",
  },
  "Radish Seed": {
    name: "Radish Seed",
    description: "A nutrious crop for any diet",
    price: marketRate(7),
    ingredients: [],
    requires: "Roasted Cauliflower",
  },
  "Wheat Seed": {
    name: "Wheat Seed",
    description: "A nutrious crop for any diet",
    price: marketRate(2),
    ingredients: [],
    requires: "Pumpkin Soup",
  },
});
