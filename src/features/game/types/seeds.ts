/**
 * Classic seeds can be found in crops.ts
 */

import { Inventory } from "components/InventoryItems";
import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";

export type UpcomingSeedName =
  | "Kale Seed"
  | "Apple Seed"
  | "Blueberry Seed"
  | "Orange Seed";

export type UpcomingSeed = {
  name: UpcomingSeedName;
  sfl: Decimal;
  description: string;
  plantSeconds: number;
};

export const UPCOMING_SEEDS: () => Record<
  UpcomingSeedName,
  UpcomingSeed
> = () => ({
  "Kale Seed": {
    name: "Kale Seed",
    sfl: marketRate(0.01),
    description: "A Bumpkin power food",
    plantSeconds: 2 * 24 * 60 * 60,
  },
  "Apple Seed": {
    name: "Apple Seed",
    sfl: marketRate(0.01),
    description: "Perfect for homemade Apple Pie",
    plantSeconds: 2 * 24 * 60 * 60,
  },
  "Blueberry Seed": {
    name: "Blueberry Seed",
    sfl: marketRate(0.01),
    description: "A Goblin's weakness",
    plantSeconds: 2 * 24 * 60 * 60,
  },
  "Orange Seed": {
    name: "Orange Seed",
    sfl: marketRate(0.01),
    description: "Vitamin C to keep your Bumpkin Healthy",
    plantSeconds: 2 * 24 * 60 * 60,
  },
});

export type ExoticSeedName = "Magic Bean" | "Shiny Bean" | "Golden Bean";

export type ExoticSeed = {
  name: ExoticSeedName;
  sfl: Decimal;
  ingredients: Inventory;
  description: string;
  plantSeconds: number;
};

export const EXOTIC_SEEDS: () => Record<ExoticSeedName, ExoticSeed> = () => ({
  "Magic Bean": {
    name: "Magic Bean",
    sfl: marketRate(5),
    ingredients: {
      Wood: new Decimal(100),
    },
    description: "What will grow?",
    plantSeconds: 2 * 24 * 60 * 60,
  },
  "Shiny Bean": {
    name: "Shiny Bean",
    sfl: marketRate(10),
    ingredients: {
      Wood: new Decimal(100),
      Iron: new Decimal(10),
    },
    description: "What will grow?",
    plantSeconds: 3 * 24 * 60 * 60,
  },
  "Golden Bean": {
    name: "Golden Bean",
    sfl: marketRate(15),
    ingredients: {
      Wood: new Decimal(100),
      Gold: new Decimal(10),
    },
    description: "What will grow?",
    plantSeconds: 5 * 24 * 60 * 60,
  },
});
