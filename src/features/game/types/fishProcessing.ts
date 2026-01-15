import Decimal from "decimal.js-light";

import { Inventory, TemperateSeasonName } from "./game";
import { ProcessedFood } from "./processedFood";
import { InstantProcessedRecipeName } from "./consumables";

export const FISH_PROCESSING_TIME_SECONDS: Record<ProcessedFood, number> = {
  "Fish Flake": 1 * 60 * 60,
  "Fish Stick": 2 * 60 * 60,
  "Crab Stick": 4 * 60 * 60,
  "Fish Oil": 16 * 60 * 60,
};

const BASE_PROCESSING_REQUIREMENTS: Record<ProcessedFood, Inventory> = {
  "Fish Flake": {
    Anchovy: new Decimal(4),
  },
  "Fish Stick": {
    "Red Snapper": new Decimal(6),
  },
  "Fish Oil": {
    Tuna: new Decimal(8),
  },
  "Crab Stick": {
    Crab: new Decimal(1),
  },
};

const FISH_FLAKE_SEASONAL: Record<TemperateSeasonName, Inventory> = {
  spring: {
    Porgy: new Decimal(2),
    "Sea Bass": new Decimal(2),
  },
  summer: {
    Butterflyfish: new Decimal(3),
    "Sea Horse": new Decimal(1),
  },
  autumn: {
    Halibut: new Decimal(1),
    Muskellunge: new Decimal(2),
  },
  winter: {
    Blowfish: new Decimal(3),
    Clownfish: new Decimal(2),
  },
};

const FISH_STICK_SEASONAL: Record<TemperateSeasonName, Inventory> = {
  spring: {
    "Olive Flounder": new Decimal(2),
    "Zebra Turkeyfish": new Decimal(2),
  },
  summer: {
    Surgeonfish: new Decimal(2),
    Tilapia: new Decimal(2),
  },
  autumn: {
    "Moray Eel": new Decimal(2),
    Napoleanfish: new Decimal(2),
  },
  winter: {
    Walleye: new Decimal(1),
    Angelfish: new Decimal(2),
  },
};

const FISH_OIL_SEASONAL: Record<TemperateSeasonName, Inventory> = {
  spring: {
    Weakfish: new Decimal(2),
    Oarfish: new Decimal(2),
  },
  summer: {
    Cobia: new Decimal(2),
    Sunfish: new Decimal(2),
  },
  autumn: {
    "Mahi Mahi": new Decimal(4),
    Crab: new Decimal(2),
  },
  winter: {
    "Blue Marlin": new Decimal(2),
    "Football fish": new Decimal(2),
  },
};

const CRAB_STICK_SEASONAL: Record<TemperateSeasonName, Inventory> = {
  spring: {
    "Blue Crab": new Decimal(2),
    "Hermit Crab": new Decimal(2),
    "Sea Slug": new Decimal(2),
  },
  summer: {
    Mussel: new Decimal(2),
    Isopod: new Decimal(2),
    "Sea Snail": new Decimal(2),
  },
  autumn: {
    Shrimp: new Decimal(2),
    Lobster: new Decimal(2),
    Barnacle: new Decimal(2),
  },
  winter: {
    Oyster: new Decimal(2),
    Isopod: new Decimal(2),
    "Garden Eel": new Decimal(2),
  },
};

const SEASONAL_PROCESSING_REQUIREMENTS: Record<
  ProcessedFood,
  Record<TemperateSeasonName, Inventory>
> = {
  "Fish Flake": FISH_FLAKE_SEASONAL,
  "Fish Stick": FISH_STICK_SEASONAL,
  "Fish Oil": FISH_OIL_SEASONAL,
  "Crab Stick": CRAB_STICK_SEASONAL,
};

export const isProcessedFood = (
  item: ProcessedFood | InstantProcessedRecipeName,
): item is ProcessedFood => {
  return Object.keys(BASE_PROCESSING_REQUIREMENTS).includes(item);
};

export const getFishProcessingRequirements = ({
  item,
  season,
}: {
  item: ProcessedFood;
  season: TemperateSeasonName;
}): Inventory => {
  const baseRequirements = BASE_PROCESSING_REQUIREMENTS[item];
  const seasonalRequirements = SEASONAL_PROCESSING_REQUIREMENTS[item][season];

  return {
    ...baseRequirements,
    ...seasonalRequirements,
  };
};
