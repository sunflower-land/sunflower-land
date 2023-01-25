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
type Treasure = {
  sfl: Decimal;
};

// PLACEHOLDERS
export const BEACH_BOUNTY: () => Record<
  BeachBountyTreasure,
  Treasure
> = () => ({
  "Clam Shell": {
    sfl: marketRate(10),
  },
  "Sea Cucumber": {
    sfl: marketRate(10),
  },
  Coral: {
    sfl: marketRate(10),
  },
  Crab: {
    sfl: marketRate(10),
  },
  Starfish: {
    sfl: marketRate(10),
  },
  "Pirate Bounty": {
    sfl: marketRate(10),
  },
  Pearl: {
    sfl: marketRate(10),
  },
  Pipi: {
    sfl: marketRate(10),
  },
  Seaweed: {
    sfl: marketRate(10),
  },
});
