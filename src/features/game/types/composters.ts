import { GameState, InventoryItemName, TemperateSeasonName } from "./game";
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
  resourceBoostRequirements: number;
  resourceBoostMilliseconds: number;
};

export const composterDetails: Record<ComposterName, ComposterDetails> = {
  "Compost Bin": {
    worm: "Earthworm",
    produce: "Sprout Mix",
    produceAmount: 10,
    timeToFinishMilliseconds: 6 * 60 * 60 * 1000,
    resourceBoostRequirements: 10,
    resourceBoostMilliseconds: 2 * 60 * 60 * 1000,
  },
  "Turbo Composter": {
    produce: "Fruitful Blend",
    produceAmount: 3,
    worm: "Grub",
    timeToFinishMilliseconds: 8 * 60 * 60 * 1000,
    resourceBoostRequirements: 20,
    resourceBoostMilliseconds: 3 * 60 * 60 * 1000,
  },
  "Premium Composter": {
    produce: "Rapid Root",
    produceAmount: 10,
    worm: "Red Wiggler",
    timeToFinishMilliseconds: 12 * 60 * 60 * 1000,
    resourceBoostRequirements: 30,
    resourceBoostMilliseconds: 4 * 60 * 60 * 1000,
  },
};

export function isComposting(game: GameState, name: ComposterName): boolean {
  const composter = game.buildings[name]?.[0];
  const producing = composter?.producing;
  if (!producing) return false;
  return Date.now() > producing?.readyAt;
}

export const SEASON_COMPOST_REQUIREMENTS: Record<
  ComposterName,
  Record<TemperateSeasonName, Requirements>
> = {
  "Compost Bin": {
    spring: {
      Rhubarb: 10,
      Carrot: 5,
    },
    summer: {
      Zucchini: 10,
      Pepper: 2,
    },
    autumn: {
      Yam: 15,
    },
    winter: {
      Potato: 10,
      Cabbage: 3,
    },
  },
  "Turbo Composter": {
    spring: {
      Soybean: 5,
      Corn: 3,
    },
    summer: {
      Cauliflower: 4,
      Eggplant: 3,
    },
    autumn: {
      Broccoli: 10,
      Artichoke: 2,
    },
    winter: {
      Onion: 5,
      Turnip: 2,
    },
  },
  "Premium Composter": {
    spring: {
      Blueberry: 8,
      Egg: 5,
    },
    summer: {
      Banana: 3,
      Egg: 5,
    },
    autumn: {
      Apple: 4,
      Tomato: 5,
    },
    winter: {
      Lemon: 3,
      Apple: 3,
    },
  },
};
