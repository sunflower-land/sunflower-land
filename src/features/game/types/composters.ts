import Decimal from "decimal.js-light";
import { InventoryItemName } from "./game";

export type Bait = "Earthworm" | "Grub" | "Red Wiggler";

export type FruitCompostName = "Fruitful Blend";
export type CropCompostName = "Sprout Mix" | "Rapid Root";

export type CompostName = FruitCompostName | CropCompostName;

export type ComposterName =
  | "Compost Bin"
  | "Turbo Composter"
  | "Premium Composter";

export const BAIT: Record<Bait, { description: string }> = {
  Earthworm: {
    description: "A wriggly worm used to fish.",
  },
  Grub: {
    description: "A juicy grub used to fish.",
  },
  "Red Wiggler": {
    description: "A red wiggler used to fish.",
  },
};

export const FRUIT_COMPOST: Record<FruitCompostName, { description: string }> =
  {
    "Fruitful Blend": {
      description: "Fruitful Blend boosts your fruit yield by +0.25",
    },
  };

export const CROP_COMPOST: Record<CropCompostName, { description: string }> = {
  "Sprout Mix": {
    description: "Sprout Mix increases your crop yield by +0.2",
  },
  "Rapid Root": {
    description: "Rapid Root boosts your crop speed by +50%",
  },
};

type Requirements = Partial<Record<InventoryItemName, Decimal>>;

export type ComposterDetails = {
  requirements: Requirements;
  timeToFinishMilliseconds: number;
  produce: CompostName;
  produceAmount: number;
  bait: Bait;
};

export const composterDetails: Record<ComposterName, ComposterDetails> = {
  "Compost Bin": {
    requirements: {
      Sunflower: new Decimal(5),
      Pumpkin: new Decimal(3),
      Carrot: new Decimal(2),
    },
    bait: "Earthworm",
    produce: "Sprout Mix",
    produceAmount: 10,
    timeToFinishMilliseconds: 6 * 60 * 60 * 1000,
  },
  "Turbo Composter": {
    requirements: {
      Cauliflower: new Decimal(3),
      Egg: new Decimal(1),
    },
    produce: "Rapid Root",
    produceAmount: 10,
    bait: "Grub",
    timeToFinishMilliseconds: 8 * 60 * 60 * 1000,
  },
  "Premium Composter": {
    requirements: {
      Radish: new Decimal(2),
      Parsnip: new Decimal(2),
    },
    produce: "Fruitful Blend",
    produceAmount: 3,
    bait: "Red Wiggler",
    timeToFinishMilliseconds: 12 * 60 * 60 * 1000,
  },
};
