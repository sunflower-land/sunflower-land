import {
  CropSeedName,
  GREENHOUSE_SEEDS,
  GreenHouseCropName,
  GreenHouseCropSeedName,
  PLOT_CROP_SEEDS,
  PlotCropName,
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
    | PlotCropName
    | PatchFruitName
    | FlowerSeedName
    | GreenHouseCropName
    | GreenHouseFruitName;
  disabled?: boolean;
};

export const SEEDS: () => Record<SeedName, Seed> = () => ({
  ...PLOT_CROP_SEEDS,
  ...PATCH_FRUIT_SEEDS(),
  ...FLOWER_SEEDS(),
  ...GREENHOUSE_FRUIT_SEEDS(),
  ...GREENHOUSE_SEEDS,
});
