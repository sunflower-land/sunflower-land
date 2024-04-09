import { CRAFTABLE_TOOLS } from "../events/landExpansion/craftTool";
import { CONSUMABLES } from "./consumables";
import { DECORATION_DIMENSIONS } from "./decorations";
import { RESOURCES } from "./resources";
import { getCurrentSeason, SeasonName, SEASONS } from "./seasons";

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
  | "Emerald Compass";

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
} & Treasure;

export const SELLABLE_TREASURE: Record<BeachBountyTreasure, SellableTreasure> =
  {
    "Clam Shell": {
      sellPrice: 375,
      description: "A clam shell.",
      type: "good",
    },
    Coral: {
      sellPrice: 1500,
      description: "A piece of coral, it's pretty",
      type: "good",
    },
    Crab: {
      sellPrice: 15,
      description: "A crab, watch out for it's claws!",
      type: "average",
    },
    Pearl: {
      sellPrice: 3750,
      description: "Shimmers in the sun.",
      type: "rare",
    },
    "Pirate Bounty": {
      sellPrice: 7500,
      description: "A bounty for a pirate. It's worth a lot of money.",
      type: "rare",
    },
    Seaweed: {
      sellPrice: 75,
      description: "Seaweed.",
      type: "average",
    },
    Starfish: {
      sellPrice: 112.5,
      description: "The star of the sea.",
      type: "average",
    },
    "Wooden Compass": {
      sellPrice: 131.25,
      description: "?",
      type: "good",
    },
    "Iron Compass": {
      sellPrice: 187.5,
      description:
        "Iron out your path to treasure! This compass is 'attract'-ive, and not just to the magnetic North!",
      type: "good",
    },
    "Old Bottle": {
      sellPrice: 22.5,
      description:
        "Antique pirate bottle, echoing tales of high seas adventure.",
      type: "average",
    },
    "Sea Cucumber": {
      sellPrice: 22.5,
      description: "A sea cucumber.",
      type: "average",
    },
    Pipi: {
      sellPrice: 187.5,
      description: "Plebidonax deltoides, found in the Pacific Ocean.",
      type: "good",
    },
    "Emerald Compass": {
      sellPrice: 187.5,
      description:
        "Guide your way through the lush mysteries of life! This compass doesn't just point North, it points towards opulence and grandeur!",
      type: "good",
    },
  };

export const REWARDS = (): Partial<Record<TreasureName, Treasure>> => ({
  "Pirate Cake": {
    type: "good",
  },
  Pipi: {
    type: "good",
  },
  "Purple Smoothie": {
    type: "good",
  },
  "Blueberry Jam": {
    type: "good",
  },
  "Fancy Fries": {
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
  "Clam Shell": {
    type: "good",
  },
  Coral: {
    type: "good",
  },
  Crab: {
    type: "average",
  },
  Pearl: {
    type: "rare",
  },
  "Pirate Bounty": {
    type: "rare",
  },
  Seaweed: {
    type: "average",
  },
  Starfish: {
    type: "average",
  },
  "Wooden Compass": {
    type: "good",
  },
  "Iron Compass": {
    type: "good",
  },
  "Old Bottle": {
    type: "average",
  },
  "Emerald Compass": {
    type: "good",
  },
});

export const SOLAR_FLARE_REWARDS = (): Partial<
  Record<TreasureName, Treasure>
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
  Record<TreasureName, Treasure>
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
    type: "rare",
  },
});

type SeasonalRewards = {
  startDate: number;
  endDate: number;
  rewards: Partial<Record<TreasureName, Treasure>>;
};

const getSeasonRewards = (
  season: SeasonName
): Partial<Record<TreasureName, Treasure>> => {
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
  return treasure in SELLABLE_TREASURE;
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
