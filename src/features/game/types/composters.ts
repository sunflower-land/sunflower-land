import { GameState, InventoryItemName } from "./game";
import { translate } from "lib/i18n/translate";

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
    description: translate("worm.earthworm"),
  },
  Grub: {
    description: translate("worm.grub"),
  },
  "Red Wiggler": {
    description: translate("worm.redWiggler"),
  },
};

export const FRUIT_COMPOST: Record<FruitCompostName, { description: string }> =
  {
    "Fruitful Blend": {
      description: translate("compost.fruitfulBlend"),
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
    description: translate("compost.sproutMix"),
    boostedDescriptions: [
      {
        name: "Knowledge Crab",
        description: translate("compost.sproutMixBoosted"),
      },
    ],
  },
  "Rapid Root": {
    description: translate("compost.rapidRoot"),
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
    eggBoostMilliseconds: 2 * 60 * 60 * 1000,
  },
  "Turbo Composter": {
    produce: "Fruitful Blend",
    produceAmount: 3,
    worm: "Grub",
    timeToFinishMilliseconds: 8 * 60 * 60 * 1000,
    eggBoostRequirements: 20,
    eggBoostMilliseconds: 3 * 60 * 60 * 1000,
  },
  "Premium Composter": {
    produce: "Rapid Root",
    produceAmount: 10,
    worm: "Red Wiggler",
    timeToFinishMilliseconds: 12 * 60 * 60 * 1000,
    eggBoostRequirements: 30,
    eggBoostMilliseconds: 4 * 60 * 60 * 1000,
  },
};

export function isComposting(game: GameState, name: ComposterName): boolean {
  const composter = game.buildings[name]?.[0];
  const producing = composter?.producing;
  if (!producing) return false;
  return Date.now() > producing?.readyAt;
}
