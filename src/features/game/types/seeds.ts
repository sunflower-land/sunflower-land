import {
  CROP_SEEDS,
  CropName,
  CropSeedName,
  GREENHOUSE_SEEDS,
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "./crops";
import {
  GREENHOUSE_FRUIT_SEEDS,
  GreenHouseFruitName,
  GreenHouseFruitSeedName,
  PATCH_FRUIT_SEEDS,
  PatchFruitName,
  PatchFruitSeedName,
} from "./fruits";
import { FLOWER_SEEDS, FlowerSeedName } from "./flowers";
import { ResourceName } from "./resources";
import { TemperateSeasonName } from "./game";

export type SeedName =
  | CropSeedName
  | PatchFruitSeedName
  | FlowerSeedName
  | GreenHouseCropSeedName
  | GreenHouseFruitSeedName;

export type Seed = {
  price: number;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
  plantingSpot: ResourceName | "Greenhouse";
  yield?:
    | CropName
    | PatchFruitName
    | FlowerSeedName
    | GreenHouseCropName
    | GreenHouseFruitName;
  disabled?: boolean;
};

export const SEEDS: Record<SeedName, Seed> = {
  ...CROP_SEEDS,
  ...PATCH_FRUIT_SEEDS,
  ...FLOWER_SEEDS,
  ...GREENHOUSE_FRUIT_SEEDS,
  ...GREENHOUSE_SEEDS,
};

export const SEASONAL_SEEDS: Record<TemperateSeasonName, SeedName[]> = {
  spring: [
    // Crops
    "Sunflower Seed",
    "Rhubarb Seed",
    "Carrot Seed",
    "Cabbage Seed",
    "Soybean Seed",
    "Corn Seed",
    "Wheat Seed",
    "Kale Seed",
    "Barley Seed",
    // Fruits
    "Tomato Seed",
    "Blueberry Seed",
    "Orange Seed",

    // Flowers
    "Sunpetal Seed",
    "Bloom Seed",
    "Lily Seed",
    // Greenhouse
    "Rice Seed",
    "Olive Seed",
    "Grape Seed",
  ],
  summer: [
    "Sunflower Seed",
    "Potato Seed",
    "Zucchini Seed",
    "Pepper Seed",
    "Beetroot Seed",
    "Cauliflower Seed",
    "Eggplant Seed",
    "Radish Seed",
    "Wheat Seed",
    "Lemon Seed",
    "Orange Seed",
    "Banana Plant",

    // Flowers
    "Sunpetal Seed",
    "Bloom Seed",
    "Lily Seed",
    // Greenhouse
    "Rice Seed",
    "Olive Seed",
    "Grape Seed",
  ],
  autumn: [
    "Potato Seed",
    "Pumpkin Seed",
    "Carrot Seed",
    "Yam Seed",
    "Broccoli Seed",
    "Soybean Seed",
    "Wheat Seed",
    "Barley Seed",
    "Artichoke Seed",
    "Tomato Seed",
    "Apple Seed",
    "Banana Plant",

    // Flowers
    "Sunpetal Seed",
    "Bloom Seed",
    "Lily Seed",
    // Greenhouse
    "Rice Seed",
    "Olive Seed",
    "Grape Seed",
  ],
  winter: [
    "Potato Seed",
    "Cabbage Seed",
    "Beetroot Seed",
    "Cauliflower Seed",
    "Parsnip Seed",
    "Onion Seed",
    "Turnip Seed",
    "Wheat Seed",
    "Kale Seed",
    "Lemon Seed",
    "Blueberry Seed",
    "Apple Seed",

    // Flowers
    "Sunpetal Seed",
    "Bloom Seed",
    "Lily Seed",
    // Greenhouse
    "Rice Seed",
    "Olive Seed",
    "Grape Seed",
  ],
};
