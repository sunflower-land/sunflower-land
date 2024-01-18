import Decimal from "decimal.js-light";
import { InventoryItemName } from "./game";
import { getKeys } from "./craftables";

export type FlowerName = "Flower 1" | "Flower 2";

export type FlowerSeedName = "Sunpetal Seed";

export type FlowerSeed = {
  price: Decimal;
  bumpkinLevel: number;
  sfl: Decimal;
  description: string;
  plantSeconds: number;
  disabled: boolean;
};

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
  harvestSeconds: number;
};

export const FLOWERS: Record<FlowerName, Flower> = {
  // Todo set the seconds
  "Flower 1": {
    harvestSeconds: 5,
  },
  "Flower 2": {
    harvestSeconds: 5,
  },
};
