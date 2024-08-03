import { translate } from "lib/i18n/translate";
import { Seed } from "./seeds";

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
  | "Kale"
  | "Soybean";

export type Crop = {
  sellPrice: number;
  harvestSeconds: number;
  name: CropName;
  description: string;
  bumpkinLevel: number;
  disabled?: boolean;
};

export type GreenHouseCropName = "Olive" | "Rice";

export type GreenHouseCrop = {
  sellPrice: number;
  harvestSeconds: number;
  name: GreenHouseCropName;
  description: string;
  bumpkinLevel: number;
  disabled?: boolean;
};

export const GREENHOUSE_CROPS: Record<GreenHouseCropName, GreenHouseCrop> = {
  Rice: {
    sellPrice: 320,
    harvestSeconds: 32 * 60 * 60,
    name: "Rice",
    description: "A staple food for many.",
    bumpkinLevel: 10,
  },
  Olive: {
    sellPrice: 400,
    harvestSeconds: 44 * 60 * 60,
    name: "Olive",
    description: "Zesty with a rich history.",
    bumpkinLevel: 10,
  },
};

export const GREENHOUSE_SEEDS: Record<GreenHouseCropSeedName, Seed> = {
  "Rice Seed": {
    price: 240,
    description: "A staple food for many.",
    bumpkinLevel: 40,
    plantSeconds: 32 * 60 * 60,
    plantingSpot: "Greenhouse",
  },
  "Olive Seed": {
    price: 320,
    description: "Zesty with a rich history.",
    bumpkinLevel: 40,
    plantSeconds: 44 * 60 * 60,
    plantingSpot: "Greenhouse",
  },
};

export type GreenHouseCropSeedName = `${GreenHouseCropName} Seed`;

/**
 * Crops and their original prices
 */
export const CROPS: Record<CropName, Crop> = {
  Sunflower: {
    name: "Sunflower",
    description: translate("description.sunflower"),
    sellPrice: 0.02,
    bumpkinLevel: 1,
    harvestSeconds: 1 * 60,
  },
  Potato: {
    name: "Potato",
    description: translate("description.potato"),
    sellPrice: 0.14,
    bumpkinLevel: 1,
    harvestSeconds: 5 * 60,
  },
  Pumpkin: {
    name: "Pumpkin",
    description: translate("description.pumpkin"),
    sellPrice: 0.4,
    bumpkinLevel: 3,
    harvestSeconds: 30 * 60,
  },
  Carrot: {
    name: "Carrot",
    description: translate("description.carrot"),
    sellPrice: 0.8,
    bumpkinLevel: 3,
    harvestSeconds: 60 * 60,
  },
  Cabbage: {
    name: "Cabbage",
    description: translate("description.cabbage"),
    sellPrice: 1.5,
    bumpkinLevel: 3,
    harvestSeconds: 2 * 60 * 60,
  },
  Soybean: {
    sellPrice: 2.3,
    harvestSeconds: 3 * 60 * 60,
    name: "Soybean",
    description: translate("description.soybean"),
    bumpkinLevel: 10,
  },
  Beetroot: {
    name: "Beetroot",
    description: translate("description.beetroot"),
    sellPrice: 2.8,
    bumpkinLevel: 3,
    harvestSeconds: 4 * 60 * 60,
  },
  Cauliflower: {
    name: "Cauliflower",
    description: translate("description.cauliflower"),
    sellPrice: 4.25,
    bumpkinLevel: 4,
    harvestSeconds: 8 * 60 * 60,
  },
  Parsnip: {
    name: "Parsnip",
    description: translate("description.parsnip"),
    sellPrice: 6.5,
    bumpkinLevel: 4,
    harvestSeconds: 12 * 60 * 60,
  },
  Eggplant: {
    name: "Eggplant",
    description: translate("description.eggplant"),
    sellPrice: 8,
    bumpkinLevel: 5,
    harvestSeconds: 16 * 60 * 60,
  },
  Corn: {
    name: "Corn",
    description: translate("description.corn"),
    sellPrice: 9,
    bumpkinLevel: 5,
    harvestSeconds: 20 * 60 * 60,
  },
  Radish: {
    name: "Radish",
    description: translate("description.radish"),
    sellPrice: 9.5,
    bumpkinLevel: 5,
    harvestSeconds: 24 * 60 * 60,
  },
  Wheat: {
    name: "Wheat",
    description: translate("description.wheat"),
    sellPrice: 7,
    bumpkinLevel: 5,
    harvestSeconds: 24 * 60 * 60,
  },
  Kale: {
    name: "Kale",
    description: translate("description.kale"),
    sellPrice: 10,
    bumpkinLevel: 7,
    harvestSeconds: 36 * 60 * 60,
  },
};

export type CropSeedName = `${CropName} Seed`;

export const CROP_SEEDS: Record<CropSeedName, Seed> = {
  "Sunflower Seed": {
    price: 0.01,
    description: translate("description.sunflower"),
    plantSeconds: 60,
    bumpkinLevel: 1,
    yield: "Sunflower",
    plantingSpot: "Crop Plot",
  },
  "Potato Seed": {
    price: 0.1,
    description: translate("description.potato"),
    plantSeconds: 5 * 60,
    bumpkinLevel: 1,
    yield: "Potato",
    plantingSpot: "Crop Plot",
  },
  "Pumpkin Seed": {
    description: translate("description.pumpkin"),
    price: 0.2,
    plantSeconds: 30 * 60,
    bumpkinLevel: 2,
    yield: "Pumpkin",
    plantingSpot: "Crop Plot",
  },
  "Carrot Seed": {
    description: translate("description.carrot"),
    price: 0.5,
    plantSeconds: 60 * 60,
    bumpkinLevel: 2,
    yield: "Carrot",
    plantingSpot: "Crop Plot",
  },
  "Cabbage Seed": {
    description: translate("description.cabbage"),
    price: 1,
    bumpkinLevel: 3,
    plantSeconds: 2 * 60 * 60,
    yield: "Cabbage",
    plantingSpot: "Crop Plot",
  },
  "Soybean Seed": {
    price: 1.5,
    description: translate("description.soybean"),
    bumpkinLevel: 10,
    plantSeconds: 3 * 60 * 60,
    yield: "Soybean",
    plantingSpot: "Crop Plot",
  },
  "Beetroot Seed": {
    description: translate("description.beetroot"),
    price: 2,
    bumpkinLevel: 3,
    plantSeconds: 4 * 60 * 60,
    yield: "Beetroot",
    plantingSpot: "Crop Plot",
  },
  "Cauliflower Seed": {
    description: translate("description.cauliflower"),
    price: 3,
    bumpkinLevel: 4,
    plantSeconds: 8 * 60 * 60,
    yield: "Cauliflower",
    plantingSpot: "Crop Plot",
  },
  "Parsnip Seed": {
    description: translate("description.parsnip"),
    price: 5,
    bumpkinLevel: 4,
    plantSeconds: 12 * 60 * 60,
    yield: "Parsnip",
    plantingSpot: "Crop Plot",
  },
  "Eggplant Seed": {
    description: translate("description.eggplant"),
    price: 6,
    bumpkinLevel: 5,
    plantSeconds: 16 * 60 * 60,
    yield: "Eggplant",
    plantingSpot: "Crop Plot",
  },
  "Corn Seed": {
    description: translate("description.corn"),
    price: 7,
    bumpkinLevel: 5,
    plantSeconds: 20 * 60 * 60,
    yield: "Corn",
    plantingSpot: "Crop Plot",
  },
  "Radish Seed": {
    description: translate("description.radish"),
    price: 7,
    bumpkinLevel: 5,
    plantSeconds: 24 * 60 * 60,
    yield: "Radish",
    plantingSpot: "Crop Plot",
  },
  "Wheat Seed": {
    description: translate("description.wheat"),
    price: 5,
    bumpkinLevel: 5,
    plantSeconds: 24 * 60 * 60,
    yield: "Wheat",
    plantingSpot: "Crop Plot",
  },
  "Kale Seed": {
    price: 7,
    description: translate("description.kale"),
    bumpkinLevel: 7,
    plantSeconds: 36 * 60 * 60,
    yield: "Kale",
    plantingSpot: "Crop Plot",
  },
};
