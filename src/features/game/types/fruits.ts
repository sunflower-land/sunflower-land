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
  "Apple Seed": {
    sfl: marketRate(20),
    description: "Perfect for homemade Apple Pie",
    plantSeconds: 2 * 24 * 60 * 60,
    bumpkinLevel: 13,
    yield: "Apple",
  },
  "Blueberry Seed": {
    sfl: marketRate(25),
    description: "A Goblin's weakness",
    plantSeconds: 2 * 24 * 60 * 60,
    bumpkinLevel: 14,
    yield: "Blueberry",
  },
  "Orange Seed": {
    sfl: marketRate(30),
    description: "Vitamin C to keep your Bumpkin Healthy",
    plantSeconds: 2 * 24 * 60 * 60,
    bumpkinLevel: 15,
    yield: "Orange",
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
  Apple: {
    description: "Perfect for homemade Apple Pie",
    harvestSeconds: 2 * 24 * 60 * 60,
    name: "Apple",
    sellPrice: marketRate(12),
  },
  Blueberry: {
    description: "A Goblin's weakness",
    harvestSeconds: 2 * 24 * 60 * 60,
    name: "Blueberry",
    isBush: true,
    sellPrice: marketRate(25),
  },
  Orange: {
    description: "Vitamin C to keep your Bumpkin Healthy",
    harvestSeconds: 2 * 24 * 60 * 60,
    name: "Orange",
    sellPrice: marketRate(18),
  },
});
