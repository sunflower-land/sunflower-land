import {
  CROP_SEEDS,
  CropName,
  CropSeedName,
  GREENHOUSE_SEEDS,
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "./crops";
import {
  FRUIT_SEEDS,
  FruitName,
  FruitSeedName,
  GREENHOUSE_FRUIT_SEEDS,
  GreenHouseFruitName,
  GreenHouseFruitSeedName,
} from "./fruits";
import { FLOWER_SEEDS, FlowerSeedName } from "./flowers";

export type SeedName =
  | CropSeedName
  | FruitSeedName
  | FlowerSeedName
  | GreenHouseCropSeedName
  | GreenHouseFruitSeedName;

export type Seed = {
  price: number;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
  yield?:
    | CropName
    | FruitName
    | FlowerSeedName
    | GreenHouseCropName
    | GreenHouseFruitName;
  disabled?: boolean;
};

export const SEEDS: () => Record<SeedName, Seed> = () => ({
  ...CROP_SEEDS(),
  ...FRUIT_SEEDS(),
  ...FLOWER_SEEDS(),
  ...GREENHOUSE_SEEDS(),
  ...GREENHOUSE_FRUIT_SEEDS(),
});
