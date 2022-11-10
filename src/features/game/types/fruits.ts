/**
 * Classic seeds can be found in crops.ts
 */

import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";

export type FruitName = "Apple" | "Blueberry" | "Orange";

export type FruitSeedName = `${FruitName} Seed`;

export type FruitSeed = {
  sfl: Decimal;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
};

export const FRUIT_SEEDS: () => Record<FruitSeedName, FruitSeed> = () => ({
  "Apple Seed": {
    sfl: marketRate(20),
    description: "Perfect for homemade Apple Pie",
    plantSeconds: 2 * 24 * 60 * 60,
    bumpkinLevel: 13,
  },
  "Blueberry Seed": {
    sfl: marketRate(25),
    description: "A Goblin's weakness",
    plantSeconds: 2 * 24 * 60 * 60,
    bumpkinLevel: 14,
  },
  "Orange Seed": {
    sfl: marketRate(30),
    description: "Vitamin C to keep your Bumpkin Healthy",
    plantSeconds: 2 * 24 * 60 * 60,
    bumpkinLevel: 15,
  },
});

export type Fruit = {
  description: string;
  plantSeconds: number;
};

export const FRUIT: () => Record<FruitName, Fruit> = () => ({
  Apple: {
    description: "Perfect for homemade Apple Pie",
    plantSeconds: 2 * 24 * 60 * 60,
  },
  Blueberry: {
    description: "A Goblin's weakness",
    plantSeconds: 2 * 24 * 60 * 60,
  },
  Orange: {
    description: "Vitamin C to keep your Bumpkin Healthy",
    plantSeconds: 2 * 24 * 60 * 60,
  },
});
