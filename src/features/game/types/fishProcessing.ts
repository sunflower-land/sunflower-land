import Decimal from "decimal.js-light";

import { Inventory, TemperateSeasonName } from "./game";
import { ProcessedFood } from "./processedFood";

export const FISH_PROCESSING_TIME_SECONDS = 2 * 60 * 60;

const BASE_PROCESSING_REQUIREMENTS: Record<ProcessedFood, Inventory> = {
  "Fish Flake": {
    Anchovy: new Decimal(6),
  },
  "Fish Stick": {
    "Red Snapper": new Decimal(6),
  },
  "Fish Oil": {
    Tuna: new Decimal(6),
  },
  "Crab Stick": {},
};

const FISH_FLAKE_SEASONAL: Record<TemperateSeasonName, Inventory> = {
  spring: {
    Porgy: new Decimal(1),
    "Sea Horse": new Decimal(1),
  },
  summer: {
    Butterflyfish: new Decimal(3),
    "Sea Horse": new Decimal(1),
  },
  autumn: {
    Halibut: new Decimal(1),
    "Sea Bass": new Decimal(2),
  },
  winter: {
    Blowfish: new Decimal(3),
    Clownfish: new Decimal(1),
  },
};

const FISH_STICK_SEASONAL: Record<TemperateSeasonName, Inventory> = {
  spring: {
    "Olive Flounder": new Decimal(2),
    "Zebra Turkeyfish": new Decimal(2),
  },
  summer: {
    "Moray Eel": new Decimal(3),
    Tilapia: new Decimal(2),
  },
  autumn: {
    "Moray Eel": new Decimal(3),
    Napoleanfish: new Decimal(2),
  },
  winter: {
    Walleye: new Decimal(1),
    Angelfish: new Decimal(1),
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

const SEASONAL_PROCESSING_REQUIREMENTS: Record<
  ProcessedFood,
  Record<TemperateSeasonName, Inventory>
> = {
  "Fish Flake": FISH_FLAKE_SEASONAL,
  "Fish Stick": FISH_STICK_SEASONAL,
  "Fish Oil": FISH_OIL_SEASONAL,
  "Crab Stick": {
    spring: {},
    summer: {},
    autumn: {},
    winter: {},
  },
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
