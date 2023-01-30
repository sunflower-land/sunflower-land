import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";

export type BeachBountyTreasure =
  | "Pirate Bounty"
  | "Pearl"
  | "Coral"
  | "Clam Shell"
  | "Pipi"
  | "Starfish"
  | "Seaweed"
  | "Sea Cucumber"
  | "Crab";

export type ConsumableTreasure =
  | "Pirate Cake"
  | "Sunflower Cake"
  | "Radish Cake"
  | "Carrot Cake"
  | "Cauliflower Cake"
  | "Club Sandwich"
  | "Sunflower Crunch"
  | "Pumpkin Soup";

export type DecorationTreasure =
  | "Abandoned Bear"
  | "Turtle Bear"
  | "T-Rex Skull"
  | "Sunflower Coin"
  | "Foliant"
  | "Skeleton King Staff"
  | "Lifeguard Bear"
  | "Snorkel Bear"
  | "Parasaur Skull"
  | "Golden Bear Head"
  | "Pirate Bear"
  | "Goblin Bear"
  | "Galleon"
  | "Pirate Hat"
  | "Dinosaur Fossil"
  | "Human Bear";

export type QuestTreasure = "Treasure Map";

export type BoostTreasure = "Tiki Totem" | "Lunar Calendar";

export type TreasureName =
  | BeachBountyTreasure
  | ConsumableTreasure
  | DecorationTreasure
  | QuestTreasure
  | BoostTreasure;

export type BeachBounty = {
  sellPrice: Decimal;
};

export const BEACH_BOUNTY_TREASURE: Record<BeachBountyTreasure, BeachBounty> = {
  "Clam Shell": {
    sellPrice: marketRate(500),
  },
  Coral: {
    sellPrice: marketRate(2000),
  },
  Crab: {
    sellPrice: marketRate(25),
  },
  Pearl: {
    sellPrice: marketRate(5000),
  },
  Pipi: {
    sellPrice: marketRate(250),
  },
  "Pirate Bounty": {
    sellPrice: marketRate(10000),
  },
  "Sea Cucumber": {
    sellPrice: marketRate(25),
  },
  Seaweed: {
    sellPrice: marketRate(100),
  },
  Starfish: {
    sellPrice: marketRate(150),
  },
};

export type PlaceableTreasures = BoostTreasure;

export const PLACEABLE_TREASURES: Record<
  PlaceableTreasures,
  { description: string }
> = {
  "Lunar Calendar": {
    description: "A charm made from crops.",
  },
  "Tiki Totem": {
    description: "A charm made of wood.",
  },
};
