import Decimal from "decimal.js-light";
import { InventoryItemName } from "./game";

export type Bait = "Earthworm" | "Grub" | "Red Wiggler";

export type CompostName = "Sprout Mix" | "Fruitful Blend" | "Rapid Root";

export type ComposterName =
  | "Basic Composter"
  | "Advanced Composter"
  | "Expert Composter";

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

export const COMPOST: Record<CompostName, { description: string }> = {
  "Sprout Mix": {
    description: "Sprout Mix increases your crop yield by +0.2",
  },
  "Fruitful Blend": {
    description: "Fruitful Blend boosts your fruit yield by +0.25",
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
  bait: Bait;
};

export const composterDetails: Record<ComposterName, ComposterDetails> = {
  "Basic Composter": {
    requirements: {
      Sunflower: new Decimal(5),
      Pumpkin: new Decimal(3),
      Carrot: new Decimal(2),
    },
    bait: "Earthworm",
    produce: "Sprout Mix",
    timeToFinishMilliseconds: 6 * 60 * 60 * 1000,
  },
  "Advanced Composter": {
    requirements: {
      Kale: new Decimal(5),
      Egg: new Decimal(1),
    },
    produce: "Fruitful Blend",
    bait: "Grub",
    timeToFinishMilliseconds: 8 * 60 * 60 * 1000,
  },
  "Expert Composter": {
    requirements: {
      Orange: new Decimal(2),
      Blueberry: new Decimal(2),
      Egg: new Decimal(3),
    },
    produce: "Rapid Root",
    bait: "Red Wiggler",
    timeToFinishMilliseconds: 12 * 60 * 60 * 1000,
  },
};
