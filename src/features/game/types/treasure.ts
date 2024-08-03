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
  sellPrice: number;
};

export const SEASONAL_ARTEFACT: Record<
  BeachBountySeasonalArtefact,
  SellableTreasure
> = {
  Scarab: {
    sellPrice: 200,
  },
};

export const SELLABLE_TREASURE: Record<BeachBountyTreasure, SellableTreasure> =
  {
    Sand: {
      sellPrice: 10,
    },
    "Camel Bone": {
      sellPrice: 10,
    },
    Crab: {
      sellPrice: 15,
    },
    "Old Bottle": {
      sellPrice: 22.5,
    },
    "Sea Cucumber": {
      sellPrice: 22.5,
    },
    Vase: {
      sellPrice: 50,
    },
    Seaweed: {
      sellPrice: 75,
    },
    "Cockle Shell": {
      sellPrice: 100,
    },
    Starfish: {
      sellPrice: 112.5,
    },
    "Wooden Compass": {
      sellPrice: 131.25,
    },
    "Iron Compass": {
      sellPrice: 187.5,
    },
    "Emerald Compass": {
      sellPrice: 187.5,
    },
    Pipi: {
      sellPrice: 187.5,
    },
    Hieroglyph: {
      sellPrice: 250,
    },
    "Clam Shell": {
      sellPrice: 375,
    },
    Coral: {
      sellPrice: 1500,
    },
    Pearl: {
      sellPrice: 3750,
    },
    "Pirate Bounty": {
      sellPrice: 7500,
    },
    ...SEASONAL_ARTEFACT,
  };
