/**
 * Classic seeds can be found in crops.ts
 */

import { getKeys } from "./craftables";
import { translate } from "lib/i18n/translate";
import { ResourceName } from "./resources";

export type FruitName =
  | "Apple"
  | "Blueberry"
  | "Orange"
  | "Banana"
  | "Tomato"
  | "Lemon";

export type GreenHouseFruitName = "Grape";
export type GreenHouseFruitSeedName = "Grape Seed";

export type FruitSeedName =
  | "Apple Seed"
  | "Blueberry Seed"
  | "Orange Seed"
  | "Banana Plant"
  | "Tomato Seed"
  | "Lemon Seed";

export type FruitSeed = {
  price: number;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
  yield: FruitName;
  plantingSpot: ResourceName | "Greenhouse";
  disabled?: boolean;
};

export function isFruitSeed(seed: FruitSeedName) {
  return getKeys(FRUIT_SEEDS()).includes(seed);
}

export const FRUIT_SEEDS: () => Record<FruitSeedName, FruitSeed> = () => ({
  "Tomato Seed": {
    price: 5,
    description: "Rich in Lycopene",
    plantSeconds: 2 * 60 * 60,
    bumpkinLevel: 13,
    yield: "Tomato",
    plantingSpot: "Fruit Patch",
  },
  "Lemon Seed": {
    price: 15,
    description: "Because sometimes, you just can't squeeze an orange!",
    plantSeconds: 4 * 60 * 60,
    bumpkinLevel: 12,
    yield: "Lemon",
    plantingSpot: "Fruit Patch",
  },
  "Blueberry Seed": {
    price: 30,
    description: translate("description.blueberry"),
    plantSeconds: 6 * 60 * 60,
    bumpkinLevel: 13,
    yield: "Blueberry",
    plantingSpot: "Fruit Patch",
  },
  "Orange Seed": {
    price: 50,
    description: translate("description.orange"),
    plantSeconds: 8 * 60 * 60,
    bumpkinLevel: 14,
    yield: "Orange",
    plantingSpot: "Fruit Patch",
  },
  "Apple Seed": {
    price: 70,
    description: translate("description.apple"),
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 15,
    yield: "Apple",
    plantingSpot: "Fruit Patch",
  },
  "Banana Plant": {
    price: 70,
    description: translate("description.banana"),
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 16,
    yield: "Banana",
    plantingSpot: "Fruit Patch",
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
  Tomato: {
    description: "Rich in Lycopene",
    name: "Tomato",
    sellPrice: 2,
    seed: "Tomato Seed",
    isBush: true,
    bumpkinLevel: 10,
  },
  Lemon: {
    description: "Because sometimes, you just can't squeeze an orange!",
    name: "Lemon",
    sellPrice: 6,
    seed: "Lemon Seed",
    isBush: true,
    bumpkinLevel: 12,
  },
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

export type GreenhouseFruitSeed = {
  price: number;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
  yield: GreenHouseFruitName;
  disabled?: boolean;
  plantingSpot: ResourceName | "Greenhouse";
};

export const GREENHOUSE_FRUIT_SEEDS: () => Record<
  GreenHouseFruitSeedName,
  GreenhouseFruitSeed
> = () => ({
  "Grape Seed": {
    price: 160,
    description: "A bunch of grapes",
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 40,
    yield: "Grape",
    plantingSpot: "Greenhouse",
  },
});

export type GreenHouseFruit = {
  description: string;
  name: GreenHouseFruitName;
  isBush?: boolean;
  sellPrice: number;
  seed: GreenHouseFruitSeedName;
  bumpkinLevel: number;
};

export const GREENHOUSE_FRUIT: () => Record<
  GreenHouseFruitName,
  GreenHouseFruit
> = () => ({
  Grape: {
    description: "A bunch of grapes",
    name: "Grape",
    sellPrice: 240,
    seed: "Grape Seed",
    bumpkinLevel: 40,
  },
});
