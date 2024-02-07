import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { CraftableItem } from "./craftables";
import { CONFIG } from "lib/config";
import { SEASONS } from "./seasons";
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
    name: "Sunflower",
    description: translate("description.sunflower"),
    sellPrice: marketRate(0.02),
    bumpkinLevel: 1,
    harvestSeconds: 1 * 60,
  },
  Potato: {
    name: "Potato",
    description: translate("description.potato"),
    sellPrice: marketRate(0.14),
    bumpkinLevel: 1,
    harvestSeconds: 5 * 60,
  },
  Pumpkin: {
    name: "Pumpkin",
    description: translate("description.pumpkin"),
    sellPrice: marketRate(0.4),
    bumpkinLevel: 3,
    harvestSeconds: 30 * 60,
  },
  Carrot: {
    name: "Carrot",
    description: translate("description.carrot"),
    sellPrice: marketRate(0.8),
    bumpkinLevel: 3,
    harvestSeconds: 60 * 60,
  },
  Cabbage: {
    name: "Cabbage",
    description: translate("description.cabbage"),
    sellPrice: marketRate(1.5),
    bumpkinLevel: 3,
    harvestSeconds: 2 * 60 * 60,
  },
  Beetroot: {
    name: "Beetroot",
    description: translate("description.beetroot"),
    sellPrice: marketRate(2.8),
    bumpkinLevel: 3,
    harvestSeconds: 4 * 60 * 60,
  },
  Cauliflower: {
    name: "Cauliflower",
    description: translate("description.cauliflower"),
    sellPrice: marketRate(4.25),
    bumpkinLevel: 4,
    harvestSeconds: 8 * 60 * 60,
  },
  Parsnip: {
    name: "Parsnip",
    description: translate("description.parsnip"),
    sellPrice: marketRate(6.5),
    bumpkinLevel: 4,
    harvestSeconds: 12 * 60 * 60,
  },
  Eggplant: {
    name: "Eggplant",
    description: translate("description.eggplant"),
    sellPrice: marketRate(8),
    bumpkinLevel: 5,
    harvestSeconds: 16 * 60 * 60,
  },
  Corn: {
    name: "Corn",
    description: translate("description.corn"),
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
    description: translate("description.radish"),
    sellPrice: marketRate(9.5),
    bumpkinLevel: 5,
    harvestSeconds: 24 * 60 * 60,
  },
  Wheat: {
    name: "Wheat",
    description: translate("description.wheat"),
    sellPrice: marketRate(7),
    bumpkinLevel: 5,
    harvestSeconds: 24 * 60 * 60,
  },
  Kale: {
    name: "Kale",
    description: translate("description.kale"),
    sellPrice: marketRate(10),
    bumpkinLevel: 7,
    harvestSeconds: 36 * 60 * 60,
  },
});

export type CropSeedName = `${CropName} Seed`;

export const CROP_SEEDS: () => Record<CropSeedName, CraftableItem> = () => ({
  "Sunflower Seed": {
    name: "Sunflower Seed",
    description: translate("description.sunflower"),
    tokenAmount: marketRate(0.01),
    ingredients: [],
  },
  "Potato Seed": {
    name: "Potato Seed",
    description: translate("description.potato"),
    tokenAmount: marketRate(0.1),
    ingredients: [],
  },
  "Pumpkin Seed": {
    name: "Pumpkin Seed",
    description: translate("description.pumpkin"),
    tokenAmount: marketRate(0.2),
    bumpkinLevel: 2,
    ingredients: [],
  },
  "Carrot Seed": {
    name: "Carrot Seed",
    description: translate("description.carrot"),
    tokenAmount: marketRate(0.5),
    bumpkinLevel: 2,
    ingredients: [],
  },
  "Cabbage Seed": {
    name: "Cabbage Seed",
    description: translate("description.cabbage"),
    tokenAmount: marketRate(1),
    bumpkinLevel: 3,
    ingredients: [],
  },
  "Beetroot Seed": {
    name: "Beetroot Seed",
    description: translate("description.beetroot"),
    tokenAmount: marketRate(2),
    bumpkinLevel: 3,
    ingredients: [],
  },
  "Cauliflower Seed": {
    name: "Cauliflower Seed",
    description: translate("description.cauliflower"),
    tokenAmount: marketRate(3),
    bumpkinLevel: 4,
    ingredients: [],
  },
  "Parsnip Seed": {
    name: "Parsnip Seed",
    description: translate("description.parsnip"),
    tokenAmount: marketRate(5),
    bumpkinLevel: 4,
    ingredients: [],
  },
  "Eggplant Seed": {
    name: "Eggplant Seed",
    description: translate("description.eggplant"),
    tokenAmount: marketRate(6),
    bumpkinLevel: 5,
    ingredients: [],
  },
  "Corn Seed": {
    name: "Corn Seed",
    description: translate("description.corn"),
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
    description: translate("description.radish"),
    tokenAmount: marketRate(7),
    bumpkinLevel: 5,
    ingredients: [],
  },
  "Wheat Seed": {
    name: "Wheat Seed",
    description: translate("description.wheat"),
    tokenAmount: marketRate(5),
    bumpkinLevel: 5,
    ingredients: [],
  },
  "Kale Seed": {
    name: "Kale Seed",
    description: translate("description.kale"),
    tokenAmount: marketRate(7),
    bumpkinLevel: 7,
    ingredients: [],
  },
});
