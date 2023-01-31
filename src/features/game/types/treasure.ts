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

export type PlaceableTreasure = BoostTreasure | DecorationTreasure;

export const PLACEABLE_TREASURE: Record<PlaceableTreasure, TreasureDetail> = {
  "Lunar Calendar": {
    description: "A charm made from crops.",
  },
  "Tiki Totem": {
    description: "A charm made of wood.",
  },
  "Abandoned Bear": {
    description: "A bear that was left behind on the island.",
  },
  "Turtle Bear": {
    description: "Turtley enough for the turtle club.",
  },
  "T-Rex Skull": {
    description: "A skull from a T-Rex! Amazing!",
  },
  "Sunflower Coin": {
    description: "A coin made of sunflowers.",
  },
  Foliant: {
    description: "A book of spells.",
  },
  "Skeleton King Staff": {
    description: "All hail the Skeleton King!",
  },
  "Lifeguard Bear": {
    description: "Lifeguard Bear is here to save the day!",
  },
  "Snorkel Bear": {
    description: "Snorkel Bear loves to swim.",
  },
  "Parasaur Skull": {
    description: "A skull from a parasaur!",
  },
  "Goblin Bear": {
    description: "A goblin bear. It's a bit scary.",
  },
  "Golden Bear Head": {
    description: "Spooky, but cool.",
  },
  "Pirate Bear": {
    description: "Argh, matey! Hug me!",
  },
  Galleon: {
    description: "A toy ship, still in pretty good nick.",
  },
  "Pirate Hat": {
    description:
      "A dinky old pirate hat. This must have been buried for a long time.",
  },
  "Dinosaur Fossil": {
    description: "A Dinosaur Fossil! What kind of creature was this?",
  },
  "Human Bear": {
    description: "A human bear. Even scarier than a goblin bear.",
  },
};

export const TREASURES: Record<
  TreasureName | ConsumableTreasure,
  TreasureDetail
> = {
  "Pirate Cake": {
    description: "Great for Pirate themed birthday parties.",
  },
  "Treasure Map": {
    description: "A treasure map! But this isn't an island I've ever heard of.",
  },
  "Carrot Cake": {},
  "Sunflower Cake": {},
  "Radish Cake": {},
  "Cauliflower Cake": {},
  "Club Sandwich": {},
  "Sunflower Crunch": {},
  "Pumpkin Soup": {},
  ...PLACEABLE_TREASURE,
  ...BEACH_BOUNTY_TREASURE,
};
