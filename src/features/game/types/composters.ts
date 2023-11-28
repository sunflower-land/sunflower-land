import { InventoryItemName } from "./game";

export type Worm = "Earthworm" | "Grub" | "Red Wiggler";

export type FruitCompostName = "Fruitful Blend";
export type CropCompostName = "Sprout Mix" | "Rapid Root";

export type CompostName = FruitCompostName | CropCompostName;

export type ComposterName =
  | "Compost Bin"
  | "Turbo Composter"
  | "Premium Composter";

export const WORM: Record<Worm, { description: string }> = {
  Earthworm: {
    description: "A wriggly worm that attracts small fish.",
  },
  Grub: {
    description: "A juicy grub - perfect for advanced fish.",
  },
  "Red Wiggler": {
    description: "An exotic worm that entices rare fish.",
  },
};

export const FRUIT_COMPOST: Record<FruitCompostName, { description: string }> =
  {
    "Fruitful Blend": {
      description: "Fruitful Blend boosts each fruit yield by +0.1",
    },
  };

export const CROP_COMPOST: Record<
  CropCompostName,
  {
    description: string;
    boostedDescriptions?: [{ name: string; description: string }];
  }
> = {
  "Sprout Mix": {
    description: "Sprout Mix increases your crop yield by +0.2",
    boostedDescriptions: [
      {
        name: "Knowledge Crab",
        description: "Sprout Mix increases your crop yield by +0.4",
      },
    ],
  },
  "Rapid Root": {
    description: "Rapid Root reduces crop growth time by 50%",
  },
};

type Requirements = Partial<Record<InventoryItemName, number>>;

export type ComposterDetails = {
  timeToFinishMilliseconds: number;
  produce: CompostName;
  produceAmount: number;
  worm: Worm;
  eggBoostRequirements: number;
  eggBoostMilliseconds: number;
};

export const composterDetails: Record<ComposterName, ComposterDetails> = {
  "Compost Bin": {
    worm: "Earthworm",
    produce: "Sprout Mix",
    produceAmount: 10,
    timeToFinishMilliseconds: 6 * 60 * 60 * 1000,
    eggBoostRequirements: 10,
    eggBoostMilliseconds: 1 * 60 * 60 * 1000,
  },
  "Turbo Composter": {
    produce: "Fruitful Blend",
    produceAmount: 3,
    worm: "Grub",
    timeToFinishMilliseconds: 8 * 60 * 60 * 1000,
    eggBoostRequirements: 15,
    eggBoostMilliseconds: 2 * 60 * 60 * 1000,
  },
  "Premium Composter": {
    produce: "Rapid Root",
    produceAmount: 10,
    worm: "Red Wiggler",
    timeToFinishMilliseconds: 12 * 60 * 60 * 1000,
    eggBoostRequirements: 20,
    eggBoostMilliseconds: 3 * 60 * 60 * 1000,
  },
};
