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

interface TreasureDetail {
  description?: string;
}

export type BeachBounty = {
  sellPrice: Decimal;
} & TreasureDetail;

export const BEACH_BOUNTY_TREASURE: Record<BeachBountyTreasure, BeachBounty> = {
  "Clam Shell": {
    sellPrice: marketRate(500),
    description: "A clam shell.",
  },
  Coral: {
    sellPrice: marketRate(2000),
    description: "A piece of coral, it's pretty",
  },
  Crab: {
    sellPrice: marketRate(25),
    description: "A crab, watch out for it's claws!",
  },
  Pearl: {
    sellPrice: marketRate(5000),
    description: "Shimmers in the sun.",
  },
  Pipi: {
    sellPrice: marketRate(250),
    description: "Plebidonax deltoides, found in the Pacific Ocean.",
  },
  "Pirate Bounty": {
    sellPrice: marketRate(10000),
    description: "A bounty for a pirate. It's worth a lot of money.",
  },
  "Sea Cucumber": {
    sellPrice: marketRate(25),
    description: "A sea cucumber.",
  },
  Seaweed: {
    sellPrice: marketRate(100),
    description: "Seaweed.",
  },
  Starfish: {
    sellPrice: marketRate(150),
    description: "The star of the sea.",
  },
};

export const TREASURES: Record<TreasureName | ConsumableTreasure, unknown> = {
  "Pirate Cake": {},
  "Treasure Map": {},
  "Carrot Cake": {},
  "Sunflower Cake": {},
  "Radish Cake": {},
  "Cauliflower Cake": {},
  "Club Sandwich": {},
  "Sunflower Crunch": {},
  "Pumpkin Soup": {},
  "Lunar Calendar": {},
  "Tiki Totem": {},
  "Abandoned Bear": {},
  "Turtle Bear": {},
  "T-Rex Skull": {},
  "Sunflower Coin": {},
  Foliant: {},
  "Skeleton King Staff": {},
  "Lifeguard Bear": {},
  "Snorkel Bear": {},
  "Parasaur Skull": {},
  "Goblin Bear": {},
  "Golden Bear Head": {},
  "Pirate Bear": {},
  Galleon: {},
  "Dinosaur Fossil": {},
  "Human Bear": {},
  ...BEACH_BOUNTY_TREASURE,
};
