import { translate } from "lib/i18n/translate";
import { SEASONS } from "./seasons";

export type BeachBountyTreasure =
  | "Pirate Bounty"
  | "Pearl"
  | "Coral"
  | "Clam Shell"
  | "Starfish"
  | "Seaweed"
  | "Crab"
  | "Pipi"
  | "Sea Cucumber"
  | "Wooden Compass"
  | "Iron Compass"
  | "Old Bottle"
  | "Emerald Compass"
  | "Cockle Shell"
  | "Sand"
  | "Camel Bone"
  | "Vase"
  | "Hieroglyph"
  | BeachBountySeasonalArtefact;

export type BeachBountySeasonalArtefact = "Scarab";

export type ConsumableTreasure =
  | "Pirate Cake"
  | "Purple Smoothie"
  | "Blueberry Jam"
  | "Fancy Fries"
  | "Club Sandwich"
  | "Sunflower Crunch"
  | "Pumpkin Soup"
  | "Boiled Eggs"
  | "Kale Stew"
  | "Bumpkin Salad"
  | "Cauliflower Burger";

export type DecorationTreasure =
  | "Abandoned Bear"
  | "Turtle Bear"
  | "T-Rex Skull"
  | "Sunflower Coin"
  | "Skeleton King Staff"
  | "Lifeguard Bear"
  | "Snorkel Bear"
  | "Whale Bear"
  | "Pirate Bear"
  | "Goblin Bear"
  | "Galleon"
  | "Dinosaur Bone"
  | "Human Bear";

export type BoostTreasure =
  | "Tiki Totem"
  | "Lunar Calendar"
  | "Foliant"
  | "Genie Lamp";
export type ResourceTreasure = "Gold" | "Stone" | "Iron";
export type ToolTreasure = "Sand Drill";

export type TreasureName =
  | BeachBountyTreasure
  | ConsumableTreasure
  | DecorationTreasure
  | BoostTreasure
  | ResourceTreasure
  | ToolTreasure;

export interface Treasure {
  description?: string;
  type: "average" | "good" | "rare";
}

export type SellableTreasure = {
  description: string;
  sellPrice: number;
  from?: Date;
  to?: Date;
};

export const SEASONAL_ARTEFACT: Record<
  BeachBountySeasonalArtefact,
  SellableTreasure
> = {
  Scarab: {
    sellPrice: 200,
    from: SEASONS["Pharaoh's Treasure"].startDate,
    to: SEASONS["Pharaoh's Treasure"].endDate,
    description: "",
  },
};

export const SELLABLE_TREASURE: Record<BeachBountyTreasure, SellableTreasure> =
  {
    Sand: {
      sellPrice: 10,
      description: "",
    },
    "Camel Bone": {
      sellPrice: 10,
      description: "",
    },
    Crab: {
      sellPrice: 15,
      description: translate("description.crab"),
    },
    "Old Bottle": {
      sellPrice: 22.5,
      description: translate("description.old.bottle"),
    },
    "Sea Cucumber": {
      sellPrice: 22.5,
      description: translate("description.sea.cucumber"),
    },
    Vase: {
      sellPrice: 50,
      description: "",
    },
    Seaweed: {
      sellPrice: 75,
      description: translate("description.seaweed"),
    },
    "Cockle Shell": {
      sellPrice: 100,
      description: "",
    },
    Starfish: {
      sellPrice: 112.5,
      description: translate("description.starfish"),
    },
    "Wooden Compass": {
      sellPrice: 131.25,
      description: translate("description.wooden.compass"),
    },
    "Iron Compass": {
      sellPrice: 187.5,
      description: translate("description.iron.compass"),
    },
    "Emerald Compass": {
      sellPrice: 187.5,
      description: translate("description.emerald.compass"),
    },
    Pipi: {
      sellPrice: 187.5,
      description: translate("description.pipi"),
    },
    Hieroglyph: {
      sellPrice: 250,
      description: "",
    },
    "Clam Shell": {
      sellPrice: 375,
      description: translate("description.clam.shell"),
    },
    Coral: {
      sellPrice: 1500,
      description: translate("description.coral"),
    },
    Pearl: {
      sellPrice: 3750,
      description: translate("description.pearl"),
    },
    "Pirate Bounty": {
      sellPrice: 7500,
      description: translate("description.pirate.bounty"),
    },
    ...SEASONAL_ARTEFACT,
  };
