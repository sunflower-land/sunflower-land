import Decimal from "decimal.js-light";
import { InventoryItemName } from "./game";
import { getKeys } from "./craftables";

type SunpetalFlowerName = "Flower 1" | "Flower 2";
type BloomFlowerName = "Flower 3";
type LilyFlowerName = "Flower 4";

export type FlowerSeed = {
  price: Decimal;
  bumpkinLevel: number;
  sfl: Decimal;
  description: string;
  plantSeconds: number;
  disabled: boolean;
};

type FlowerSeeds = {
  "Sunpetal Seed": FlowerSeed;
  "Bloom Seed": FlowerSeed;
  "Lily Seed": FlowerSeed;
};

export type FlowerName = SunpetalFlowerName | BloomFlowerName | LilyFlowerName;

export type FlowerSeedName = keyof FlowerSeeds;

export function isFlowerSeed(seed: FlowerSeedName) {
  return getKeys(FLOWER_SEEDS()).includes(seed);
}

export const FLOWER_SEEDS: () => Record<FlowerSeedName, FlowerSeed> = () => ({
  "Sunpetal Seed": {
    price: new Decimal(0),
    bumpkinLevel: 0,
    sfl: new Decimal(0),
    description: "A seed for a flower",
    plantSeconds: 1,
    disabled: true,
  },
  "Bloom Seed": {
    price: new Decimal(0),
    bumpkinLevel: 0,
    sfl: new Decimal(0),
    description: "A seed for a flower",
    plantSeconds: 1,
    disabled: true,
  },
  "Lily Seed": {
    price: new Decimal(0),
    bumpkinLevel: 0,
    sfl: new Decimal(0),
    description: "A seed for a flower",
    plantSeconds: 1,
    disabled: true,
  },
});

export type FlowerCrossBreedName = Extract<
  InventoryItemName,
  "Sunflower" | "Cauliflower"
>;

export const FLOWER_CROSS_BREED_AMOUNTS: Record<FlowerCrossBreedName, number> =
  {
    Sunflower: 50,
    Cauliflower: 10,
  };

type Flower = {
  seed: FlowerSeedName;
};

const SUNPETAL_FLOWERS: Record<SunpetalFlowerName, { seed: "Sunpetal Seed" }> =
  {
    "Flower 1": { seed: "Sunpetal Seed" },
    "Flower 2": { seed: "Sunpetal Seed" },
  };
const BLOOM_FLOWERS: Record<BloomFlowerName, { seed: "Bloom Seed" }> = {
  "Flower 3": { seed: "Bloom Seed" },
};
const LILY_FLOWERS: Record<LilyFlowerName, { seed: "Lily Seed" }> = {
  "Flower 4": { seed: "Lily Seed" },
};

export const FLOWERS: Record<FlowerName, Flower> = {
  ...SUNPETAL_FLOWERS,
  ...BLOOM_FLOWERS,
  ...LILY_FLOWERS,
};
