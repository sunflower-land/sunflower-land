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
  | "Fossil 3"
  | "Sunflower Coin"
  | "Foliant"
  | "Skeleton King Staff"
  | "Lifeguard Bear"
  | "Snorkel Bear"
  | "Fossil 2"
  | "Golden Bear Head"
  | "Pirate Bear"
  | "Goblin Bear"
  | "Galleon"
  | "Pirate Hat"
  | "Fossil 1"
  | "Human Bear";

export type QuestTreasure = "Treasure Map";

export type BoostTreasure = "Wood Charm" | "Crop Charm";

export type TreasureName =
  | BeachBountyTreasure
  | ConsumableTreasure
  | DecorationTreasure
  | QuestTreasure
  | BoostTreasure;

export type Treasures = (Treasure | null)[];

export type Treasure = {
  description: string;
  sellPrice?: Decimal;
};

export type BeachBounty = {
  description: string;
  sellPrice: Decimal;
};

export const BEACH_BOUNTY_TREASURE: Record<BeachBountyTreasure, BeachBounty> = {
  "Clam Shell": {
    description: "",
    sellPrice: marketRate(500),
  },
  Coral: {
    description: "",
    sellPrice: marketRate(2000),
  },
  Crab: {
    description: "",
    sellPrice: marketRate(25),
  },
  Pearl: {
    description: "",
    sellPrice: marketRate(5000),
  },
  Pipi: {
    description: "",
    sellPrice: marketRate(250),
  },
  "Pirate Bounty": {
    description: "",
    sellPrice: marketRate(10000),
  },
  "Sea Cucumber": {
    description: "",
    sellPrice: marketRate(25),
  },
  Seaweed: {
    description: "",
    sellPrice: marketRate(100),
  },
  Starfish: {
    description: "",
    sellPrice: marketRate(150),
  },
};

export const TREASURES: Record<TreasureName, Treasure> = {
  ...BEACH_BOUNTY_TREASURE,
  "Pirate Bounty": {
    description: "",
  },
  "Pirate Cake": {
    description: "",
  },
  "Sunflower Cake": {
    description: "",
  },
  "Radish Cake": {
    description: "",
  },
  "Carrot Cake": {
    description: "",
  },
  "Cauliflower Cake": {
    description: "",
  },
  "Club Sandwich": {
    description: "",
  },
  "Sunflower Crunch": {
    description: "",
  },
  "Pumpkin Soup": {
    description: "",
  },
  "Abandoned Bear": {
    description: "",
  },
  "Turtle Bear": {
    description: "",
  },
  "Fossil 3": {
    description: "",
  },
  "Sunflower Coin": {
    description: "",
  },
  Foliant: {
    description: "",
  },
  "Skeleton King Staff": {
    description: "",
  },
  "Lifeguard Bear": {
    description: "",
  },
  "Snorkel Bear": {
    description: "",
  },
  "Fossil 2": {
    description: "",
  },
  "Goblin Bear": {
    description: "",
  },
  "Golden Bear Head": {
    description: "",
  },
  "Pirate Bear": {
    description: "",
  },
  Galleon: {
    description: "",
  },
  "Pirate Hat": {
    description: "",
  },
  "Fossil 1": {
    description: "",
  },
  "Human Bear": {
    description: "",
  },
  "Treasure Map": {
    description: "",
  },
  "Wood Charm": {
    description: "",
  },
  "Crop Charm": {
    description: "",
  },
};
