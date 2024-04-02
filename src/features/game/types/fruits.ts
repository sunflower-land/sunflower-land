/**
 * Classic seeds can be found in crops.ts
 */

import { getKeys } from "./craftables";
import { translate } from "lib/i18n/translate";

export type FruitName = "Apple" | "Blueberry" | "Orange" | "Banana";

export type FruitSeedName =
  | "Apple Seed"
  | "Blueberry Seed"
  | "Orange Seed"
  | "Banana Plant";

export type FruitSeed = {
  price: number;
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
    price: 30,
    description: translate("description.blueberry"),
    plantSeconds: 6 * 60 * 60,
    bumpkinLevel: 13,
    yield: "Blueberry",
  },
  "Orange Seed": {
    price: 50,
    description: translate("description.orange"),
    plantSeconds: 8 * 60 * 60,
    bumpkinLevel: 14,
    yield: "Orange",
  },
  "Apple Seed": {
    price: 70,
    description: translate("description.apple"),
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 15,
    yield: "Apple",
  },
  "Banana Plant": {
    price: 70,
    description: translate("description.banana"),
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 16,
    yield: "Banana",
  },
});

export type Fruit = {
  description: string;
  name: FruitName;
  isBush?: boolean;
  sellPrice: number;
  seed: FruitSeedName;
  bumpkinLevel: number;
  disabled?: boolean;
};

export const FRUIT: () => Record<FruitName, Fruit> = () => ({
  Blueberry: {
    description: translate("description.blueberry"),
    name: "Blueberry",
    sellPrice: 12,
    isBush: true,
    seed: "Blueberry Seed",
    bumpkinLevel: 13,
  },
  Orange: {
    description: translate("description.orange"),
    name: "Orange",
    sellPrice: 18,
    seed: "Orange Seed",
    bumpkinLevel: 14,
  },
  Apple: {
    description: translate("description.apple"),
    name: "Apple",
    sellPrice: 25,
    seed: "Apple Seed",
    bumpkinLevel: 15,
  },
  Banana: {
    description: translate("description.banana"),
    name: "Banana",
    sellPrice: 25,
    isBush: true,
    seed: "Banana Plant",
    bumpkinLevel: 16,
  },
});
