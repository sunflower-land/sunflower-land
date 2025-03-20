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
import { InventoryItemName, TemperateSeasonName } from "./game";

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

const sortByPlantSeconds = <K extends SeedName, T extends Seed>(
  obj: Record<K, T>,
): Record<K, T> => {
  const entries = Object.entries(obj) as [K, T][];
  return Object.fromEntries(
    entries.sort((a, b) => a[1].plantSeconds - b[1].plantSeconds),
  ) as Record<K, T>;
};

const sortedCropSeeds = sortByPlantSeconds(CROP_SEEDS);
const sortedPatchFruitSeeds = sortByPlantSeconds(PATCH_FRUIT_SEEDS);
const sortedFlowerSeeds = sortByPlantSeconds(FLOWER_SEEDS);
const sortedGreenhouseProduceSeeds = sortByPlantSeconds({
  ...GREENHOUSE_FRUIT_SEEDS,
  ...GREENHOUSE_SEEDS,
});

export const SEEDS: Record<SeedName, Seed> = {
  ...sortedCropSeeds,
  ...sortedPatchFruitSeeds,
  ...sortedFlowerSeeds,
  ...sortedGreenhouseProduceSeeds,
};

export const isCropSeed = (seed: SeedName): seed is CropSeedName => {
  return seed in CROP_SEEDS;
};

export const isSeed = (name: InventoryItemName): name is SeedName =>
  name in SEEDS;

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
    "Lavender Seed",
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
    "Gladiolus Seed",
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
    "Clover Seed",
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
    "Edelweiss Seed",
    // Greenhouse
    "Rice Seed",
    "Olive Seed",
    "Grape Seed",
  ],
};
