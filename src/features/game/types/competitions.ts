import levelupIcon from "assets/icons/level_up.png";
import choreIcon from "assets/icons/chores.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameState, InventoryItemName, Wardrobe } from "./game";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { ITEM_DETAILS } from "./images";
import { hasVipAccess } from "../lib/vipAccess";
import helpedIcon from "assets/icons/helped.webp";

export type CompetitionName =
  | "TESTING"
  | "FSL"
  | "ANIMALS"
  | "PEGGYS_COOKOFF"
  | "BUILDING_FRIENDSHIPS";

export type CompetitionProgress = {
  startedAt: number;
  initialProgress?: Partial<Record<CompetitionTaskName, number>>;
  currentProgress: Partial<Record<CompetitionTaskName, number>>;
  points: number;
};

/*
Fire Pit:
Cook Fried Tofu: 1 Points
Cook Rice Bun: 6 Points

Smoothie Shack:
Prepare Grape Juice: 5 Points
Prepare Banana Blast: 7 Points

Bakery:
Cook Honey Cake: 10 Points
Cook Orange Cake: 5 Points

Deli:
Cook Fermented Fish: 10 Points
Cook Fancy Fries: 20 Points

Kitchen:
Cook Pancakes: 2 Points
Cook Tofu Scramble: 4 Points
*/

export type CompetitionTaskName =
  | "Level up"
  | "Expand island"
  | "Complete delivery"
  | "Complete chore"
  | "Sell cow"
  | "Sell sheep"
  | "Sell chicken"
  | "Complete delivery"
  | "Eat pizza"
  | "Cook Honey Cake"
  | "Craft bear"
  | "Craft basic hair"
  | "Harvest barley"
  | "Cook Fried Tofu"
  | "Cook Rice Bun"
  | "Prepare Grape Juice"
  | "Prepare Banana Blast"
  | "Cook Orange Cake"
  | "Cook Fermented Fish"
  | "Cook Fancy Fries"
  | "Cook Pancakes"
  | "Cook Tofu Scramble"
  | "Help 10 Friends"
  | "Complete a Basic Cooking Pot"
  | "Complete an Expert Cooking Pot"
  | "Complete an Advanced Cooking Pot"
  | "Craft a Doll"
  | "Craft a Moo Doll"
  | "Craft a Wooly Doll"
  | "Craft a Lumber Doll"
  | "Craft a Gilded Doll"
  | "Craft a Lunar Doll"
  | "Craft an Ember Doll";

export const COMPETITION_POINTS: Record<
  CompetitionName,
  {
    startAt: number;
    endAt: number;
    points: Partial<Record<CompetitionTaskName, number>>;
  }
> = {
  TESTING: {
    startAt: new Date("2024-09-04T00:00:00Z").getTime(),
    endAt: new Date("2024-10-06T00:00:00Z").getTime(),
    points: {
      "Complete chore": 2,
      "Complete delivery": 2,
      "Expand island": 10,
      "Level up": 5,
    },
  },
  FSL: {
    startAt: new Date("2024-10-08T00:00:00Z").getTime(),
    endAt: new Date("2024-10-29T00:00:00Z").getTime(),
    points: {
      "Complete chore": 1,
      "Complete delivery": 2,
      "Level up": 10,
      "Expand island": 15,
    },
  },
  ANIMALS: {
    startAt: new Date("2024-12-17T00:00:00Z").getTime(),
    endAt: new Date("2025-02-01T00:00:00Z").getTime(),
    points: {
      "Sell cow": 10,
      "Sell sheep": 5,
      "Sell chicken": 3,
      "Complete delivery": 5,
      "Eat pizza": 5,
      "Craft bear": 2,
      "Craft basic hair": 1,
      "Harvest barley": 1,
    },
  },
  PEGGYS_COOKOFF: {
    startAt: new Date("2025-07-10T00:00:00Z").getTime(),
    endAt: new Date("2025-07-20T00:00:00Z").getTime(),
    points: {
      "Cook Fried Tofu": 1,
      "Cook Rice Bun": 6,
      "Prepare Grape Juice": 5,
      "Prepare Banana Blast": 7,
      "Cook Orange Cake": 5,
      "Cook Honey Cake": 10,
      "Cook Fermented Fish": 10,
      "Cook Fancy Fries": 20,
      "Cook Pancakes": 2,
      "Cook Tofu Scramble": 4,
    },
  },
  BUILDING_FRIENDSHIPS: {
    startAt: new Date("2025-10-13T00:00:00Z").getTime(),
    endAt: new Date("2025-10-23T00:00:00Z").getTime(),
    points: {
      "Help 10 Friends": 1,
      "Complete a Basic Cooking Pot": 1,
      "Complete an Expert Cooking Pot": 5,
      "Complete an Advanced Cooking Pot": 10,
      "Craft a Moo Doll": 10,
      "Craft a Wooly Doll": 10,
      "Craft a Lumber Doll": 15,
      "Craft a Gilded Doll": 15,
      "Craft a Lunar Doll": 20,
      "Craft an Ember Doll": 50,
    },
  },
};

export const COMPETITION_TASK_DETAILS: Record<
  CompetitionTaskName,
  { icon: string; description: string }
> = {
  "Complete chore": {
    icon: choreIcon,
    description: "Visit Hank in the plaza to complete daily chores.",
  },
  "Complete delivery": {
    icon: SUNNYSIDE.icons.player,
    description: "Visit the plaza and deliver goods to Bumpkins.",
  },
  "Expand island": {
    icon: SUNNYSIDE.tools.hammer,
    description: "Gather resources and expand your island.",
  },
  "Level up": {
    icon: levelupIcon,
    description: "Cook food and level up your Bumpkin.",
  },
  "Cook Honey Cake": {
    icon: ITEM_DETAILS["Honey Cake"].image,
    description: "Cook a Honey Cake at the Bakery",
  },
  "Eat pizza": {
    icon: ITEM_DETAILS["Pizza Margherita"].image,
    description: "Eat a Pizza Margherita",
  },
  "Craft bear": {
    icon: ITEM_DETAILS["Basic Bear"].image,
    description: "Craft a Basic Bear at the Crafting Box",
  },
  "Craft basic hair": {
    icon: SUNNYSIDE.icons.hammer,
    description: "Craft a Basic Hair at the Crafting Box",
  },
  "Sell cow": {
    icon: ITEM_DETAILS["Cow"].image,
    description: "Sell a Cow at the Barn",
  },
  "Sell sheep": {
    icon: ITEM_DETAILS["Sheep"].image,
    description: "Sell a Sheep at the Barn",
  },
  "Sell chicken": {
    icon: ITEM_DETAILS["Chicken"].image,
    description: "Sell a Chicken at the Hen House",
  },
  "Harvest barley": {
    icon: ITEM_DETAILS["Barley"].image,
    description: "Harvest Barley at the Farm",
  },
  "Cook Fried Tofu": {
    icon: ITEM_DETAILS["Fried Tofu"].image,
    description: "Cook a Fried Tofu at the Fire Pit",
  },
  "Cook Rice Bun": {
    icon: ITEM_DETAILS["Rice Bun"].image,
    description: "Cook a Rice Bun at the Fire Pit",
  },
  "Prepare Grape Juice": {
    icon: ITEM_DETAILS["Grape Juice"].image,
    description: "Prepare a Grape Juice at the Smoothie Shack",
  },
  "Prepare Banana Blast": {
    icon: ITEM_DETAILS["Banana Blast"].image,
    description: "Prepare a Banana Blast at the Smoothie Shack",
  },
  "Cook Orange Cake": {
    icon: ITEM_DETAILS["Orange Cake"].image,
    description: "Cook an Orange Cake at the Bakery",
  },
  "Cook Fermented Fish": {
    icon: ITEM_DETAILS["Fermented Fish"].image,
    description: "Cook a Fermented Fish at the Deli",
  },
  "Cook Fancy Fries": {
    icon: ITEM_DETAILS["Fancy Fries"].image,
    description: "Cook Fancy Fries at the Deli",
  },
  "Cook Pancakes": {
    icon: ITEM_DETAILS["Pancakes"].image,
    description: "Cook Pancakes at the Kitchen",
  },
  "Cook Tofu Scramble": {
    icon: ITEM_DETAILS["Tofu Scramble"].image,
    description: "Cook a Tofu Scramble at the Kitchen",
  },
  "Help 10 Friends": {
    icon: helpedIcon,
    description: "Help 10 Friends by cleaning their farm",
  },
  "Complete a Basic Cooking Pot": {
    icon: ITEM_DETAILS["Basic Cooking Pot"].image,
    description: "Complete a Basic Cooking Pot",
  },
  "Complete an Expert Cooking Pot": {
    icon: ITEM_DETAILS["Expert Cooking Pot"].image,
    description: "Complete an Expert Cooking Pot",
  },
  "Complete an Advanced Cooking Pot": {
    icon: ITEM_DETAILS["Advanced Cooking Pot"].image,
    description: "Complete an Advanced Cooking Pot",
  },
  "Craft a Doll": {
    icon: ITEM_DETAILS["Doll"].image,
    description: "Craft a Doll at the Crafting Box",
  },
  "Craft a Moo Doll": {
    icon: ITEM_DETAILS["Moo Doll"].image,
    description: "Craft a Moo Doll at the Crafting Box",
  },
  "Craft a Wooly Doll": {
    icon: ITEM_DETAILS["Wooly Doll"].image,
    description: "Craft a Wooly Doll at the Crafting Box",
  },
  "Craft a Lumber Doll": {
    icon: ITEM_DETAILS["Lumber Doll"].image,
    description: "Craft a Lumber Doll at the Crafting Box",
  },
  "Craft a Gilded Doll": {
    icon: ITEM_DETAILS["Gilded Doll"].image,
    description: "Craft a Gilded Doll at the Crafting Box",
  },
  "Craft a Lunar Doll": {
    icon: ITEM_DETAILS["Lunar Doll"].image,
    description: "Craft a Lunar Doll at the Crafting Box",
  },
  "Craft an Ember Doll": {
    icon: ITEM_DETAILS["Ember Doll"].image,
    description: "Craft an Ember Doll at the Crafting Box",
  },
};

export const getCompetitionPointsPerTask = ({
  game,
  name,
  task,
}: {
  game: GameState;
  name: CompetitionName;
  task: CompetitionTaskName;
}) => {
  let points = COMPETITION_POINTS[name]?.points[task] ?? 0;
  const hasVIP = hasVipAccess({ game });
  if (hasVIP) {
    points += 1;
  }
  return points;
};

export type CompetitionPlayer = {
  id: number;
  points: number;
  username: string;
  rank: number;
  bumpkin: BumpkinParts;

  // Following data is used for reporting + airdrops
  nftId?: number;
};

export type CompetitionData = {
  players: CompetitionPlayer[];
};

export type CompetitionLeaderboardResponse = {
  leaderboard: CompetitionPlayer[];
  accumulators?: CompetitionPlayer[];
  accumulatorMiniboard?: CompetitionPlayer[];
  miniboard: CompetitionPlayer[];
  lastUpdated: number;
  player?: CompetitionPlayer;
  devs: CompetitionPlayer[];
};

export type CompetitionPrize = {
  wearables: Wardrobe;
  items: Partial<Record<InventoryItemName, number>>;
};

export const PRIZES: Record<number, CompetitionPrize> = {
  // 1st - 20th
  ...new Array(20)
    .fill({
      wearables: {
        "Infernal Bullwhip": 1,
      },
      items: {},
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 1]: item,
      }),
      {},
    ),
  // 21st - 35th
  ...new Array(15)
    .fill({
      wearables: {
        "Cowbell Necklace": 1,
      },
      items: {},
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 21]: item,
      }),
      {},
    ),
  // 36 - 50
  ...new Array(15)
    .fill({
      wearables: {
        "Black Sheep Onesie": 1,
      },
      items: {},
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 36]: item,
      }),
      {},
    ),
  // 51 - 85
  ...new Array(35)
    .fill({
      wearables: {
        "Merino Jumper": 1,
      },
      items: {},
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 51]: item,
      }),
      {},
    ),
  // 86 - 130
  ...new Array(45)
    .fill({
      wearables: {
        "Chicken Suit": 1,
      },
      items: {},
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 86]: item,
      }),
      {},
    ),
  // 131 - 230
  ...new Array(100)
    .fill({
      wearables: {},
      items: {
        "Moo-ver": 1,
      },
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 131]: item,
      }),
      {},
    ),
  // 231 - 280
  ...new Array(50)
    .fill({
      wearables: {},
      items: {
        "Black Sheep": 1,
      },
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 231]: item,
      }),
      {},
    ),
  // 281 - 380
  ...new Array(100)
    .fill({
      wearables: {},
      items: {
        UFO: 1,
      },
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 281]: item,
      }),
      {},
    ),
  // 381 - 530
  ...new Array(150)
    .fill({
      wearables: {
        "Shepherd Staff": 1,
      },
      items: {},
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 381]: item,
      }),
      {},
    ),
  // 530 - 1000
  ...new Array(470)
    .fill({
      wearables: {},
      items: {
        "Luxury Key": 1,
      },
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 530]: item,
      }),
      {},
    ),
};
