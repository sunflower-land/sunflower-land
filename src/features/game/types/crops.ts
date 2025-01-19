import { translate } from "lib/i18n/translate";
import { Seed } from "./seeds";
import { getKeys } from "./decorations";
import { EXOTIC_CROPS, ExoticCrop, ExoticCropName } from "./beans";
import { GREENHOUSE_FRUIT, PATCH_FRUIT, PatchFruitName } from "./fruits";
import {
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
  isOvernightCrop,
} from "../events/landExpansion/harvest";
import { TranslationKeys } from "lib/i18n/dictionaries/types";

export type CropName =
  | "Sunflower"
  | "Potato"
  | "Pumpkin"
  | "Carrot"
  | "Cabbage"
  | "Soybean"
  | "Beetroot"
  | "Cauliflower"
  | "Parsnip"
  | "Eggplant"
  | "Corn"
  | "Radish"
  | "Wheat"
  | "Kale"
  | "Barley"
  | "Rhubarb"
  | "Zucchini"
  | "Yam"
  | "Broccoli"
  | "Pepper"
  | "Onion"
  | "Turnip"
  | "Artichoke"
  | "Duskberry"
  | "Grimroot"
  | "Lunacress";

export type Crop = {
  sellPrice: number;
  harvestSeconds: number;
  name: CropName;
  description: string;
  disabled?: boolean;
};

export type GreenHouseCropName = "Olive" | "Rice";

export type GreenHouseCrop = {
  sellPrice: number;
  harvestSeconds: number;
  name: GreenHouseCropName;
  description: string;
  disabled?: boolean;
};

export const GREENHOUSE_CROPS: Record<GreenHouseCropName, GreenHouseCrop> = {
  Rice: {
    sellPrice: 320,
    harvestSeconds: 32 * 60 * 60,
    name: "Rice",
    description: "A staple food for many.",
  },
  Olive: {
    sellPrice: 400,
    harvestSeconds: 44 * 60 * 60,
    name: "Olive",
    description: "Zesty with a rich history.",
  },
};

export const GREENHOUSE_SEEDS: Record<GreenHouseCropSeedName, Seed> = {
  "Rice Seed": {
    price: 240,
    description: "A staple food for many.",
    bumpkinLevel: 40,
    plantSeconds: 32 * 60 * 60,
    plantingSpot: "Greenhouse",
    yield: "Rice",
  },
  "Olive Seed": {
    price: 320,
    description: "Zesty with a rich history.",
    bumpkinLevel: 40,
    plantSeconds: 44 * 60 * 60,
    plantingSpot: "Greenhouse",
    yield: "Olive",
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
    harvestSeconds: 1 * 60,
  },
  Potato: {
    name: "Potato",
    description: translate("description.potato"),
    sellPrice: 0.14,
    harvestSeconds: 5 * 60,
  },
  Rhubarb: {
    sellPrice: 0.24,
    harvestSeconds: 10 * 60,
    name: "Rhubarb",
    description: translate("description.rhubarb"),
  },
  Pumpkin: {
    name: "Pumpkin",
    description: translate("description.pumpkin"),
    sellPrice: 0.4,
    harvestSeconds: 30 * 60,
  },

  Zucchini: {
    sellPrice: 0.4,
    harvestSeconds: 30 * 60,
    name: "Zucchini",
    description: translate("description.zucchini"),
  },
  Carrot: {
    name: "Carrot",
    description: translate("description.carrot"),
    sellPrice: 0.8,
    harvestSeconds: 60 * 60,
  },
  Yam: {
    sellPrice: 0.8,
    harvestSeconds: 60 * 60,
    name: "Yam",
    description: translate("description.yam"),
  },
  Cabbage: {
    name: "Cabbage",
    description: translate("description.cabbage"),
    sellPrice: 1.5,
    harvestSeconds: 2 * 60 * 60,
  },

  Broccoli: {
    sellPrice: 1.5,
    harvestSeconds: 2 * 60 * 60,
    name: "Broccoli",
    description: translate("description.broccoli"),
  },
  Soybean: {
    name: "Soybean",
    description: translate("description.soybean"),
    sellPrice: 2.3,
    harvestSeconds: 3 * 60 * 60,
  },
  Beetroot: {
    name: "Beetroot",
    description: translate("description.beetroot"),
    sellPrice: 2.8,
    harvestSeconds: 4 * 60 * 60,
  },

  Pepper: {
    sellPrice: 3,
    harvestSeconds: 4 * 60 * 60,
    name: "Pepper",
    description: translate("description.pepper"),
  },
  Cauliflower: {
    name: "Cauliflower",
    description: translate("description.cauliflower"),
    sellPrice: 4.25,
    harvestSeconds: 8 * 60 * 60,
  },
  Parsnip: {
    name: "Parsnip",
    description: translate("description.parsnip"),
    sellPrice: 6.5,
    harvestSeconds: 12 * 60 * 60,
  },
  Eggplant: {
    name: "Eggplant",
    description: translate("description.eggplant"),
    sellPrice: 8,
    harvestSeconds: 16 * 60 * 60,
  },
  Corn: {
    name: "Corn",
    description: translate("description.corn"),
    sellPrice: 9,
    harvestSeconds: 20 * 60 * 60,
  },

  Onion: {
    sellPrice: 10,
    harvestSeconds: 20 * 60 * 60,
    name: "Onion",
    description: translate("description.onion"),
  },
  Radish: {
    name: "Radish",
    description: translate("description.radish"),
    sellPrice: 9.5,
    harvestSeconds: 24 * 60 * 60,
  },
  Wheat: {
    name: "Wheat",
    description: translate("description.wheat"),
    sellPrice: 7,
    harvestSeconds: 24 * 60 * 60,
  },

  Turnip: {
    sellPrice: 8,
    harvestSeconds: 24 * 60 * 60,
    name: "Turnip",
    description: translate("description.turnip"),
  },
  Kale: {
    name: "Kale",
    description: translate("description.kale"),
    sellPrice: 10,
    harvestSeconds: 36 * 60 * 60,
  },
  Artichoke: {
    sellPrice: 12,
    harvestSeconds: 36 * 60 * 60,
    name: "Artichoke",
    description: translate("description.artichoke"),
  },
  Barley: {
    sellPrice: 12,
    harvestSeconds: 48 * 60 * 60,
    name: "Barley",
    description: translate("description.barley"),
  },
  Duskberry: {
    sellPrice: 1,
    harvestSeconds: 24 * 60 * 60,
    name: "Duskberry",
    description: translate("description.duskberry"),
  },
  Grimroot: {
    sellPrice: 1,
    harvestSeconds: 24 * 60 * 60,
    name: "Grimroot",
    description: translate("description.grimroot"),
  },
  Lunacress: {
    sellPrice: 1,
    harvestSeconds: 24 * 60 * 60,
    name: "Lunacress",
    description: translate("description.lunacress"),
  },
};

export type CropSeedName = `${CropName} Seed`;

export const CROP_SEEDS: Record<CropSeedName, Seed> = {
  "Sunflower Seed": {
    description: translate("description.sunflower"),
    price: 0.01,
    plantSeconds: 60,
    bumpkinLevel: 1,
    yield: "Sunflower",
    plantingSpot: "Crop Plot",
  },
  "Potato Seed": {
    description: translate("description.potato"),
    price: 0.1,
    plantSeconds: 5 * 60,
    bumpkinLevel: 1,
    yield: "Potato",
    plantingSpot: "Crop Plot",
  },
  "Rhubarb Seed": {
    price: 0.15,
    description: translate("description.rhubarb"),
    plantSeconds: 10 * 60,
    bumpkinLevel: 1,
    plantingSpot: "Crop Plot",
    yield: "Rhubarb",
  },
  "Pumpkin Seed": {
    description: translate("description.pumpkin"),
    price: 0.2,
    plantSeconds: 30 * 60,
    bumpkinLevel: 2,
    yield: "Pumpkin",
    plantingSpot: "Crop Plot",
  },

  "Zucchini Seed": {
    price: 0.2,
    description: translate("description.zucchini"),
    plantSeconds: 30 * 60,
    bumpkinLevel: 2,
    plantingSpot: "Crop Plot",
    yield: "Zucchini",
  },
  "Carrot Seed": {
    description: translate("description.carrot"),
    price: 0.5,
    plantSeconds: 60 * 60,
    bumpkinLevel: 2,
    yield: "Carrot",
    plantingSpot: "Crop Plot",
  },
  "Yam Seed": {
    price: 0.5,
    description: translate("description.yam"),
    plantSeconds: 60 * 60,
    bumpkinLevel: 2,
    plantingSpot: "Crop Plot",
    yield: "Yam",
  },
  "Cabbage Seed": {
    description: translate("description.cabbage"),
    price: 1,
    bumpkinLevel: 3,
    plantSeconds: 2 * 60 * 60,
    yield: "Cabbage",
    plantingSpot: "Crop Plot",
  },

  "Broccoli Seed": {
    price: 1,
    description: translate("description.broccoli"),
    plantSeconds: 2 * 60 * 60,
    bumpkinLevel: 3,
    plantingSpot: "Crop Plot",
    yield: "Broccoli",
  },
  "Soybean Seed": {
    description: translate("description.soybean"),
    price: 1.5,
    bumpkinLevel: 3,
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
  "Pepper Seed": {
    price: 2,
    description: translate("description.pepper"),
    plantSeconds: 4 * 60 * 60,
    bumpkinLevel: 3,
    plantingSpot: "Crop Plot",
    yield: "Pepper",
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
  "Onion Seed": {
    price: 7,
    description: translate("description.onion"),
    plantSeconds: 20 * 60 * 60,
    bumpkinLevel: 5,
    plantingSpot: "Crop Plot",
    yield: "Onion",
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

  "Turnip Seed": {
    price: 5,
    description: translate("description.turnip"),
    plantSeconds: 24 * 60 * 60,
    bumpkinLevel: 6,
    plantingSpot: "Crop Plot",
    yield: "Turnip",
  },
  "Kale Seed": {
    description: translate("description.kale"),
    price: 7,
    bumpkinLevel: 7,
    plantSeconds: 36 * 60 * 60,
    yield: "Kale",
    plantingSpot: "Crop Plot",
  },
  "Artichoke Seed": {
    price: 7,
    description: translate("description.artichoke"),
    plantSeconds: 36 * 60 * 60,
    bumpkinLevel: 8,
    plantingSpot: "Crop Plot",
    yield: "Artichoke",
  },
  "Barley Seed": {
    price: 10,
    description: translate("description.barley"),
    plantSeconds: 48 * 60 * 60,
    bumpkinLevel: 14,
    plantingSpot: "Crop Plot",
    yield: "Barley",
  },
  "Duskberry Seed": {
    price: 0,
    description: translate("description.duskberry"),
    plantSeconds: 24 * 60 * 60,
    bumpkinLevel: 0,
    plantingSpot: "Crop Plot",
    yield: "Duskberry",
  },
  "Grimroot Seed": {
    price: 0,
    description: translate("description.grimroot"),
    plantSeconds: 24 * 60 * 60,
    bumpkinLevel: 0,
    plantingSpot: "Crop Plot",
    yield: "Grimroot",
  },
  "Lunacress Seed": {
    price: 0,
    description: translate("description.lunacress"),
    plantSeconds: 24 * 60 * 60,
    bumpkinLevel: 0,
    plantingSpot: "Crop Plot",
    yield: "Lunacress",
  },
};

const exotics = getKeys(EXOTIC_CROPS)
  // sort by sell price
  .sort((a, b) => EXOTIC_CROPS[a].sellPrice - EXOTIC_CROPS[b].sellPrice)
  .reduce(
    (acc, key) => ({
      ...acc,
      [key]: EXOTIC_CROPS[key],
    }),
    {} as Record<ExoticCropName, ExoticCrop>,
  );

export const ALL_PRODUCE: Record<ProduceName, any> = {
  ...CROPS,
  ...PATCH_FRUIT(),
  ...GREENHOUSE_FRUIT(),
  ...GREENHOUSE_CROPS,
  ...exotics,
};

export type ProduceCategory =
  | "Basic Crop"
  | "Medium Crop"
  | "Advanced Crop"
  | "Exotic Crop"
  | "Overnight Crop"
  | "Greenhouse"
  | "Fruit"
  | "Flower";

export type ProduceName =
  | CropName
  | PatchFruitName
  | GreenHouseCropName
  | ExoticCropName;

export function getCropCategory(crop: ProduceName): TranslationKeys {
  if (!crop) {
    return "crops.flower";
  }

  if (isBasicCrop(crop as CropName)) {
    return "crops.basicCrop";
  }

  if (isMediumCrop(crop as CropName)) {
    return "crops.mediumCrop";
  }

  if (isAdvancedCrop(crop as CropName)) {
    return "crops.advancedCrop";
  }

  if (EXOTIC_CROPS[crop as ExoticCropName]) {
    return "crops.exoticCrop";
  }

  if (GREENHOUSE_CROPS[crop as GreenHouseCropName]) {
    return "crops.greenhouse";
  }

  if (PATCH_FRUIT()[crop as PatchFruitName]) {
    return "crops.fruit";
  }

  if (
    ALL_PRODUCE[crop].harvestSeconds >= 24 * 60 * 60 &&
    isOvernightCrop(crop as CropName)
  ) {
    return "crops.overnightCrop";
  }

  return "crops.flower";
}
