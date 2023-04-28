import Decimal from "decimal.js-light";
import { CRAFTABLE_TOOLS } from "../events/landExpansion/craftTool";
import { marketRate } from "../lib/halvening";
import { CONSUMABLES } from "./consumables";
import { DECORATION_DIMENSIONS } from "./decorations";
import { RESOURCES } from "./resources";
import { getCurrentSeason, SeasonName, SEASONS } from "./seasons";

export type BeachBountyTreasure =
  | "Pirate Bounty"
  | "Pearl"
  | "Coral"
  | "Clam Shell"
  | "Pipi"
  | "Starfish"
  | "Seaweed"
  | "Sea Cucumber"
  | "Crab"
  | "Wooden Compass";

export type ConsumableTreasure =
  | "Pirate Cake"
  | "Sunflower Cake"
  | "Radish Cake"
  | "Carrot Cake"
  | "Cauliflower Cake"
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
  | "Parasaur Skull"
  | "Golden Bear Head"
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

export interface TreasureDetail {
  description?: string;
  type: "average" | "good" | "rare";
}

export type BeachBounty = {
  sellPrice: Decimal;
} & TreasureDetail;

export const BEACH_BOUNTY_TREASURE: Record<BeachBountyTreasure, BeachBounty> = {
  "Clam Shell": {
    sellPrice: marketRate(375),
    description: "A clam shell.",
    type: "good",
  },
  Coral: {
    sellPrice: marketRate(1500),
    description: "A piece of coral, it's pretty",
    type: "good",
  },
  Crab: {
    sellPrice: marketRate(15),
    description: "A crab, watch out for it's claws!",
    type: "average",
  },
  Pearl: {
    sellPrice: marketRate(3750),
    description: "Shimmers in the sun.",
    type: "rare",
  },
  Pipi: {
    sellPrice: marketRate(187.5),
    description: "Plebidonax deltoides, found in the Pacific Ocean.",
    type: "good",
  },
  "Pirate Bounty": {
    sellPrice: marketRate(7500),
    description: "A bounty for a pirate. It's worth a lot of money.",
    type: "rare",
  },
  "Sea Cucumber": {
    sellPrice: marketRate(22.5),
    description: "A sea cucumber.",
    type: "average",
  },
  Seaweed: {
    sellPrice: marketRate(75),
    description: "Seaweed.",
    type: "average",
  },
  Starfish: {
    sellPrice: marketRate(112.5),
    description: "The star of the sea.",
    type: "average",
  },
  "Wooden Compass": {
    sellPrice: marketRate(131.25),
    description: "?",
    type: "good",
  },
};

export const REWARDS = (): Partial<Record<TreasureName, TreasureDetail>> => ({
  "Pirate Cake": {
    type: "good",
  },
  "Carrot Cake": {
    type: "good",
  },
  "Sunflower Cake": {
    type: "good",
  },
  "Radish Cake": {
    type: "good",
  },
  "Cauliflower Cake": {
    type: "good",
  },
  "Club Sandwich": {
    type: "average",
  },
  "Sunflower Crunch": {
    type: "average",
  },
  "Pumpkin Soup": {
    type: "average",
  },
  "Sunflower Coin": {
    type: "rare",
  },
  "Boiled Eggs": {
    type: "average",
  },
  "Bumpkin Salad": {
    type: "average",
  },
  "Cauliflower Burger": {
    type: "average",
  },
  "Kale Stew": {
    type: "average",
  },
  "Sand Drill": {
    type: "good",
  },
  Gold: {
    type: "good",
  },
  Iron: {
    type: "good",
  },
  Stone: {
    type: "average",
  },

  ...BEACH_BOUNTY_TREASURE,
});

export const SOLAR_FLARE_REWARDS = (): Partial<
  Record<TreasureName, TreasureDetail>
> => ({
  "Tiki Totem": {
    type: "rare",
  },
  "Lunar Calendar": {
    type: "rare",
  },
  "Pirate Bear": {
    type: "rare",
  },
  "Whale Bear": {
    type: "rare",
  },
  "T-Rex Skull": {
    type: "rare",
  },
});

export const DAWN_BREAKER_REWARDS = (): Partial<
  Record<TreasureName, TreasureDetail>
> => ({
  Foliant: {
    type: "rare",
  },
  "Dinosaur Bone": {
    type: "rare",
  },
  "Lifeguard Bear": {
    type: "rare",
  },
  "Snorkel Bear": {
    type: "rare",
  },
  "Turtle Bear": {
    type: "rare",
  },
  "Genie Lamp": {
    type: "good",
  },
});

type SeasonalRewards = {
  startDate: number;
  endDate: number;
  rewards: Partial<Record<TreasureName, TreasureDetail>>;
};

const getSeasonRewards = (
  season: SeasonName
): Partial<Record<TreasureName, TreasureDetail>> => {
  if (season === "Dawn Breaker") {
    return DAWN_BREAKER_REWARDS();
  }

  if (season === "Solar Flare") {
    return SOLAR_FLARE_REWARDS();
  }

  return {};
};

export const SEASONAL_REWARDS: () => SeasonalRewards = () => {
  const currentSeason = getCurrentSeason();
  const seasonDates = SEASONS[currentSeason];

  return {
    startDate: seasonDates.startDate.getTime(),
    endDate: seasonDates.endDate.getTime(),
    rewards: getSeasonRewards(currentSeason),
  };
};

export const BOOST_TREASURE: Record<BoostTreasure, string> = {
  "Tiki Totem": "+0.1 wood per tree",
  "Lunar Calendar": "10% faster crop growth",
  Foliant: "+0.2 Kale per harvest",
  "Genie Lamp": "Grants 3 wishes",
};

export function isBoostTreasure(
  treasure: TreasureName
): treasure is BoostTreasure {
  return treasure in BOOST_TREASURE;
}

export function isBeachBountyTreasure(
  treasure: TreasureName
): treasure is BeachBountyTreasure {
  return treasure in BEACH_BOUNTY_TREASURE;
}

export function isConsumableTreasure(
  treasure: TreasureName
): treasure is ConsumableTreasure {
  return treasure in CONSUMABLES;
}

export function isDecorationTreasure(
  treasure: TreasureName
): treasure is DecorationTreasure {
  return treasure in DECORATION_DIMENSIONS;
}

export function isResourceTreasure(
  treasure: TreasureName
): treasure is ResourceTreasure {
  return treasure in RESOURCES;
}

export function isToolTreasure(
  treasure: TreasureName
): treasure is ToolTreasure {
  return treasure in CRAFTABLE_TOOLS;
}
