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

export type Treasure = {
  id: string;
  weighting: number;
  type: "average" | "good" | "rare";
  reward: TreasureName;
};

export type Treasures = (Treasure | null)[];

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
