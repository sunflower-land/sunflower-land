/**
 * Classic seeds can be found in crops.ts
 */

import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { getKeys } from "./craftables";

export type FruitName = "Apple" | "Blueberry" | "Orange";

export type FruitSeedName = `${FruitName} Seed`;

export type FruitSeed = {
  sfl: Decimal;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
  yield: FruitName;
};

export function isFruitSeed(seed: FruitSeedName) {
  return getKeys(FRUIT_SEEDS()).includes(seed);
}

export const FRUIT_SEEDS: () => Record<FruitSeedName, FruitSeed> = () => ({
  "Blueberry Seed": {
    sfl: marketRate(30),
    description: "A Goblin's weakness",
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 13,
    yield: "Blueberry",
  },
  "Orange Seed": {
    sfl: marketRate(50),
    description: "Vitamin C to keep your Bumpkin Healthy",
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 14,
    yield: "Orange",
  },
  "Apple Seed": {
    sfl: marketRate(70),
    description: "Perfect for homemade Apple Pie",
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 15,
    yield: "Apple",
  },
});

export type Fruit = {
  description: string;
  harvestSeconds: number;
  name: FruitName;
  isBush?: boolean;
  sellPrice: Decimal;
};

export const FRUIT: () => Record<FruitName, Fruit> = () => ({
  Blueberry: {
    description: "A Goblin's weakness",
    harvestSeconds: 4 * 60 * 60,
    name: "Blueberry",
    sellPrice: marketRate(12),
    isBush: true,
  },
  Orange: {
    description: "Vitamin C to keep your Bumpkin Healthy",
    harvestSeconds: 6 * 60 * 60,
    name: "Orange",
    sellPrice: marketRate(18),
  },
  Apple: {
    description: "Perfect for homemade Apple Pie",
    harvestSeconds: 12 * 60 * 60,
    name: "Apple",
    sellPrice: marketRate(25),
  },
});
