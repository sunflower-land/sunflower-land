import Decimal from "decimal.js-light";
import { InventoryItemName } from "./game";
import { getKeys } from "./craftables";

type PansyName = "Red Pansy" | "Yellow Pansy" | "Purple Pansy";
type CosmosName = "Red Cosmos" | "Yellow Cosmos" | "Purple Cosmos";
type DaffodilName = "Red Daffodil" | "Yellow Daffodil" | "Purple Daffodil";
type BalloonFlowerName =
  | "Red Balloon Flower"
  | "Yellow Balloon Flower"
  | "Purple Balloon Flower";
type LotusName = "Red Lotus" | "Yellow Lotus" | "Purple Lotus";
type SunpetalFlowerName = PansyName | CosmosName;
type BloomFlowerName = DaffodilName | BalloonFlowerName;
type LilyFlowerName = LotusName;

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
    "Red Pansy": { seed: "Sunpetal Seed" },
    "Yellow Pansy": { seed: "Sunpetal Seed" },
    "Purple Pansy": { seed: "Sunpetal Seed" },
    "Red Cosmos": { seed: "Sunpetal Seed" },
    "Yellow Cosmos": { seed: "Sunpetal Seed" },
    "Purple Cosmos": { seed: "Sunpetal Seed" },
  };
const BLOOM_FLOWERS: Record<BloomFlowerName, { seed: "Bloom Seed" }> = {
  "Red Daffodil": { seed: "Bloom Seed" },
  "Yellow Daffodil": { seed: "Bloom Seed" },
  "Purple Daffodil": { seed: "Bloom Seed" },
  "Red Balloon Flower": { seed: "Bloom Seed" },
  "Yellow Balloon Flower": { seed: "Bloom Seed" },
  "Purple Balloon Flower": { seed: "Bloom Seed" },
};
const LILY_FLOWERS: Record<LilyFlowerName, { seed: "Lily Seed" }> = {
  "Red Lotus": { seed: "Lily Seed" },
  "Yellow Lotus": { seed: "Lily Seed" },
  "Purple Lotus": { seed: "Lily Seed" },
};

export const FLOWERS: Record<FlowerName, Flower> = {
  ...SUNPETAL_FLOWERS,
  ...BLOOM_FLOWERS,
  ...LILY_FLOWERS,
};
