import Decimal from "decimal.js-light";
import { InventoryItemName } from "./game";

export type ComposterProduceName = "Earthworm" | "Grub" | "Red Wiggler";

export type Composter =
  | "Basic Composter"
  | "Advanced Composter"
  | "Expert Composter";

export const COMPOSTER_PRODUCE: Record<
  ComposterProduceName,
  { description: string }
> = {
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

type Requirements = Partial<Record<InventoryItemName, Decimal>>;

type ComposterDetails = {
  requirements: Requirements;
  timeToFinish: number;
  produce: ComposterProduceName;
};

type BasicComposterRequirements = {
  "Basic Composter": ComposterDetails;
  "Advanced Composter": ComposterDetails;
  "Expert Composter": ComposterDetails;
};

export const composterRequirements: BasicComposterRequirements = {
  "Basic Composter": {
    requirements: {
      Sunflower: new Decimal(5),
      Pumpkin: new Decimal(3),
      Carrot: new Decimal(2),
    },
    produce: "Earthworm",
    timeToFinish: 6 * 60 * 60 * 1000,
  },
  "Advanced Composter": {
    requirements: {
      Kale: new Decimal(5),
      Egg: new Decimal(1),
    },
    produce: "Grub",
    timeToFinish: 8 * 60 * 60 * 1000,
  },
  "Expert Composter": {
    requirements: {
      Orange: new Decimal(2),
      Blueberry: new Decimal(2),
      Egg: new Decimal(3),
    },
    produce: "Red Wiggler",
    timeToFinish: 12 * 60 * 60 * 1000,
  },
};
