/**
 * Classic seeds can be found in crops.ts
 */

import { getKeys } from "./craftables";
import { translate } from "lib/i18n/translate";
import { ResourceName } from "./resources";
import { SeedName } from "./seeds";

export type PatchFruitName =
  | "Apple"
  | "Blueberry"
  | "Orange"
  | "Banana"
  | "Tomato"
  | "Lemon"
  | "Celestine"
  | "Lunara"
  | "Duskberry";

export type GreenHouseFruitName = "Grape";
export type GreenHouseFruitSeedName = "Grape Seed";

export type FullMoonFruit = Extract<
  PatchFruitName,
  "Celestine" | "Lunara" | "Duskberry"
>;

export const FULL_MOON_FRUITS: FullMoonFruit[] = [
  "Celestine",
  "Lunara",
  "Duskberry",
];

export function isFullMoonFruit(fruit: PatchFruitName): fruit is FullMoonFruit {
  return FULL_MOON_FRUITS.includes(fruit as FullMoonFruit);
}

export type PatchFruitSeedName =
  | "Apple Seed"
  | "Blueberry Seed"
  | "Orange Seed"
  | "Banana Plant"
  | "Tomato Seed"
  | "Lemon Seed"
  | "Celestine Seed"
  | "Lunara Seed"
  | "Duskberry Seed";

export type PatchFruitSeed = {
  price: number;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
  yield: PatchFruitName;
  plantingSpot: ResourceName | "Greenhouse";
  disabled?: boolean;
};

export function isPatchFruitSeed(seed: SeedName) {
  return getKeys(PATCH_FRUIT_SEEDS).includes(seed as PatchFruitSeedName);
}

export const PATCH_FRUIT_SEEDS: Record<PatchFruitSeedName, PatchFruitSeed> = {
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
  "Celestine Seed": {
    price: 300,
    description: translate("description.celestine"),
    plantSeconds: 6 * 60 * 60,
    bumpkinLevel: 12,
    yield: "Celestine",
    plantingSpot: "Fruit Patch",
  },
  "Lunara Seed": {
    price: 750,
    description: translate("description.lunara"),
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 12,
    yield: "Lunara",
    plantingSpot: "Fruit Patch",
  },
  "Duskberry Seed": {
    price: 1250,
    description: translate("description.duskberry"),
    plantSeconds: 24 * 60 * 60,
    bumpkinLevel: 12,
    yield: "Duskberry",
    plantingSpot: "Fruit Patch",
  },
};

export type PatchFruit = {
  description: string;
  name: PatchFruitName;
  isBush?: boolean;
  sellPrice: number;
  seed: PatchFruitSeedName;
  disabled?: boolean;
};

export const PATCH_FRUIT: Record<PatchFruitName, PatchFruit> = {
  Tomato: {
    description: "Rich in Lycopene",
    name: "Tomato",
    sellPrice: 2,
    seed: "Tomato Seed",
    isBush: true,
  },
  Lemon: {
    description: "Because sometimes, you just can't squeeze an orange!",
    name: "Lemon",
    sellPrice: 6,
    seed: "Lemon Seed",
  },
  Blueberry: {
    description: translate("description.blueberry"),
    name: "Blueberry",
    sellPrice: 12,
    isBush: true,
    seed: "Blueberry Seed",
  },
  Orange: {
    description: translate("description.orange"),
    name: "Orange",
    sellPrice: 18,
    seed: "Orange Seed",
  },
  Apple: {
    description: translate("description.apple"),
    name: "Apple",
    sellPrice: 25,
    seed: "Apple Seed",
  },
  Banana: {
    description: translate("description.banana"),
    name: "Banana",
    sellPrice: 25,
    isBush: true,
    seed: "Banana Plant",
  },
  Celestine: {
    description: translate("description.celestine"),
    name: "Celestine",
    sellPrice: 200,
    seed: "Celestine Seed",
  },
  Lunara: {
    description: translate("description.lunara"),
    name: "Lunara",
    sellPrice: 500,
    seed: "Lunara Seed",
  },
  Duskberry: {
    description: translate("description.duskberry"),
    name: "Duskberry",
    sellPrice: 1000,
    seed: "Duskberry Seed",
  },
};

export type GreenhouseFruitSeed = {
  price: number;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
  yield: GreenHouseFruitName;
  disabled?: boolean;
  plantingSpot: ResourceName | "Greenhouse";
};

export const GREENHOUSE_FRUIT_SEEDS: Record<
  GreenHouseFruitSeedName,
  GreenhouseFruitSeed
> = {
  "Grape Seed": {
    price: 160,
    description: "A bunch of grapes",
    plantSeconds: 12 * 60 * 60,
    bumpkinLevel: 40,
    yield: "Grape",
    plantingSpot: "Greenhouse",
  },
};

export type GreenHouseFruit = {
  description: string;
  name: GreenHouseFruitName;
  isBush?: boolean;
  sellPrice: number;
  seed: GreenHouseFruitSeedName;
  bumpkinLevel: number;
};

export const GREENHOUSE_FRUIT: Record<GreenHouseFruitName, GreenHouseFruit> = {
  Grape: {
    description: "A bunch of grapes",
    name: "Grape",
    sellPrice: 240,
    seed: "Grape Seed",
    bumpkinLevel: 40,
  },
};
