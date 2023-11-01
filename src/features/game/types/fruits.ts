/**
 * Classic seeds can be found in crops.ts
 */

import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { getKeys } from "./craftables";

export type FruitName = "Apple" | "Blueberry" | "Orange" | "Banana";

export type FruitSeedName =
  | "Apple Seed"
  | "Blueberry Seed"
  | "Orange Seed"
  | "Banana Plant";

export type FruitSeed = {
  sfl: Decimal;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
  yield: FruitName;
  disabled?: boolean;
};

export function isFruitSeed(seed: FruitSeedName) {
  return getKeys(FRUIT_SEEDS()).includes(seed);
}

export const FRUIT_SEEDS: () => Record<FruitSeedName, FruitSeed> = () => ({
  "Blueberry Seed": {
    sfl: marketRate(30),
    description: "A Goblin's weakness",
    plantSeconds: 6 * 60 * 60,
    bumpkinLevel: 13,
    yield: "Blueberry",
  },
  "Orange Seed": {
    sfl: marketRate(50),
    description: "Vitamin C to keep your Bumpkin Healthy",
    plantSeconds: 8 * 60 * 60,
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
  "Banana Plant": {
    sfl: marketRate(70),
    description: "Oh banana!",
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 16,
    yield: "Banana",
  },
});

export type Fruit = {
  description: string;
  name: FruitName;
  isBush?: boolean;
  sellPrice: Decimal;
  seed: FruitSeedName;
  bumpkinLevel: number;
  disabled?: boolean;
};

export const FRUIT: () => Record<FruitName, Fruit> = () => ({
  Blueberry: {
    description: "A Goblin's weakness",
    name: "Blueberry",
    sellPrice: marketRate(12),
    isBush: true,
    seed: "Blueberry Seed",
    bumpkinLevel: 13,
  },
  Orange: {
    description: "Vitamin C to keep your Bumpkin Healthy",
    name: "Orange",
    sellPrice: marketRate(18),
    seed: "Orange Seed",
    bumpkinLevel: 14,
  },
  Apple: {
    description: "Perfect for homemade Apple Pie",
    name: "Apple",
    sellPrice: marketRate(25),
    seed: "Apple Seed",
    bumpkinLevel: 15,
  },
  Banana: {
    description: "Oh banana!",
    name: "Banana",
    sellPrice: marketRate(25),
    isBush: true,
    seed: "Banana Plant",
    bumpkinLevel: 16,
  },
});
