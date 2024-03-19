import { CROP_SEEDS, CropName, CropSeedName } from "./crops";
import { FRUIT_SEEDS, FruitName, FruitSeedName } from "./fruits";
import { FLOWER_SEEDS, FlowerSeedName } from "./flowers";

export type SeedName = CropSeedName | FruitSeedName | FlowerSeedName;

export type Seed = {
  price: number;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
  yield?: CropName | FruitName | FlowerSeedName;
  disabled?: boolean;
};

export const SEEDS: () => Record<SeedName, Seed> = () => ({
  ...CROP_SEEDS(),
  ...FRUIT_SEEDS(),
  ...FLOWER_SEEDS(),
});
