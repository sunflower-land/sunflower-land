import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { CraftableItem } from "./craftables";
import { translate } from "lib/i18n/translate";

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
    sellPrice: marketRate(0.02),
    harvestSeconds: 1 * 60,
    name: "Sunflower",
    description: translate("description.sunflower"),
    bumpkinLevel: 1,
  },
  Potato: {
    sellPrice: marketRate(0.14),
    harvestSeconds: 5 * 60,
    name: "Potato",
    description: translate("description.potato"),
    bumpkinLevel: 1,
  },
  Pumpkin: {
    sellPrice: marketRate(0.4),
    harvestSeconds: 30 * 60,
    name: "Pumpkin",
    description: translate("description.pumpkin"),
    bumpkinLevel: 3,
  },
  Carrot: {
    sellPrice: marketRate(0.8),
    harvestSeconds: 60 * 60,
    name: "Carrot",
    description: translate("description.carrot"),
    bumpkinLevel: 3,
  },
  Cabbage: {
    sellPrice: marketRate(1.5),
    harvestSeconds: 2 * 60 * 60,
    name: "Cabbage",
    description: translate("description.cabbage"),
    bumpkinLevel: 3,
  },
  Beetroot: {
    sellPrice: marketRate(2.8),
    harvestSeconds: 4 * 60 * 60,
    name: "Beetroot",
    description: translate("description.beetroot"),
    bumpkinLevel: 3,
  },
  Cauliflower: {
    sellPrice: marketRate(4.25),
    harvestSeconds: 8 * 60 * 60,
    name: "Cauliflower",
    description: translate("description.cauliflower"),
    bumpkinLevel: 4,
  },
  Parsnip: {
    sellPrice: marketRate(6.5),
    harvestSeconds: 12 * 60 * 60,
    name: "Parsnip",
    description: translate("description.parsnip"),
    bumpkinLevel: 4,
  },
  Eggplant: {
    sellPrice: marketRate(8),
    harvestSeconds: 16 * 60 * 60,
    name: "Eggplant",
    description: translate("description.eggplant"),
    bumpkinLevel: 5,
  },
  Corn: {
    sellPrice: marketRate(9),
    harvestSeconds: 20 * 60 * 60,
    name: "Corn",
    description: translate("description.corn"),
    bumpkinLevel: 5,
  },
  Radish: {
    sellPrice: marketRate(9.5),
    harvestSeconds: 24 * 60 * 60,
    name: "Radish",
    description: translate("description.radish"),
    bumpkinLevel: 5,
  },
  Wheat: {
    sellPrice: marketRate(7),
    harvestSeconds: 24 * 60 * 60,
    name: "Wheat",
    description: translate("description.wheat"),
    bumpkinLevel: 5,
  },
  Kale: {
    sellPrice: marketRate(10),
    harvestSeconds: 36 * 60 * 60,
    name: "Kale",
    description: translate("description.kale"),
    bumpkinLevel: 7,
  },
});

export type CropSeedName = `${CropName} Seed`;

export const CROP_SEEDS: () => Record<CropSeedName, CraftableItem> = () => ({
  "Sunflower Seed": {
    name: "Sunflower Seed",
    tokenAmount: marketRate(0.01),
    ingredients: [],
    description: translate("description.sunflower"),
  },
  "Potato Seed": {
    name: "Potato Seed",
    tokenAmount: marketRate(0.1),
    ingredients: [],
    description: translate("description.potato"),
  },
  "Pumpkin Seed": {
    name: "Pumpkin Seed",
    description: translate("description.pumpkin"),
    tokenAmount: marketRate(0.2),
    ingredients: [],
    bumpkinLevel: 2,
  },
  "Carrot Seed": {
    name: "Carrot Seed",
    description: translate("description.carrot"),
    tokenAmount: marketRate(0.5),
    ingredients: [],
    bumpkinLevel: 2,
  },
  "Cabbage Seed": {
    name: "Cabbage Seed",
    description: translate("description.cabbage"),
    tokenAmount: marketRate(1),
    ingredients: [],
    bumpkinLevel: 3,
  },
  "Beetroot Seed": {
    name: "Beetroot Seed",
    description: translate("description.beetroot"),
    tokenAmount: marketRate(2),
    ingredients: [],
    bumpkinLevel: 3,
  },
  "Cauliflower Seed": {
    name: "Cauliflower Seed",
    description: translate("description.cauliflower"),
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
  "Eggplant Seed": {
    name: "Eggplant Seed",
    description: translate("description.eggplant"),
    tokenAmount: marketRate(6),
    ingredients: [],
    bumpkinLevel: 5,
  },
  "Corn Seed": {
    name: "Corn Seed",
    description: translate("description.corn"),
    tokenAmount: marketRate(7),
    ingredients: [],
    bumpkinLevel: 5,
  },
  "Radish Seed": {
    name: "Radish Seed",
    description: translate("description.radish"),
    tokenAmount: marketRate(7),
    ingredients: [],
    bumpkinLevel: 5,
  },
  "Wheat Seed": {
    name: "Wheat Seed",
    description: translate("description.wheat"),
    tokenAmount: marketRate(5),
    ingredients: [],
    bumpkinLevel: 5,
  },
  "Kale Seed": {
    name: "Kale Seed",
    tokenAmount: marketRate(7),
    ingredients: [],
    description: translate("description.kale"),
    bumpkinLevel: 7,
  },
});
