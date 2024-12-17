import levelupIcon from "assets/icons/level_up.png";
import choreIcon from "assets/icons/chores.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameState, InventoryItemName, Wardrobe } from "./game";
import { getBumpkinLevel } from "../lib/level";
import { getKeys } from "./decorations";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { ITEM_DETAILS } from "./images";

export type CompetitionName = "TESTING" | "FSL" | "ANIMAL_TESTING";

export type CompetitionProgress = {
  startedAt: number;
  initialProgress: Partial<Record<CompetitionTaskName, number>>;
};

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
  | "Cook honey cake"
  | "Craft bear"
  | "Craft basic hair";

export const COMPETITION_TASK_PROGRESS: Record<
  CompetitionTaskName,
  (game: GameState) => number
> = {
  "Complete chore": (game) => game.chores?.choresCompleted ?? 0,
  "Complete delivery": (game) => game.delivery.fulfilledCount ?? 0,
  "Expand island": (game) => {
    let expansions = game.inventory["Basic Land"]?.toNumber() ?? 3;

    if (game.island.type === "basic") {
      expansions -= 3; // Remove initial
    }

    if (game.island.type === "spring") {
      expansions += 7; // On basic island
      expansions -= 4; // Remove initial
    }

    if (game.island.type === "desert") {
      expansions += 7; // On basic island
      expansions += 13; // On spring island
      expansions -= 4; // Remove initial
    }

    return expansions;
  },
  "Level up": (game) => getBumpkinLevel(game.bumpkin.experience),
  "Cook honey cake": (game) => game.bumpkin.activity["Honey Cake Cooked"] ?? 0,
  "Craft basic hair": (game) => game.farmActivity["Basic Hair Crafted"] ?? 0,
  "Craft bear": (game) => game.farmActivity["Basic Bear Crafted"] ?? 0,
  "Eat pizza": (game) => game.bumpkin.activity["Pizza Margherita Fed"] ?? 0,

  // TODO include existing progress
  "Sell cow": (game) => {
    let bountied = game.farmActivity["Cow Bountied"] ?? 0;

    const soldInFirstFewDays = game.bounties.completed.filter(
      (bounty) =>
        bounty.id === "Cow" &&
        bounty.soldAt >= new Date("2024-12-16T00:00:00Z").getTime() &&
        bounty.soldAt < new Date("2024-12-23T00:00:00Z").getTime() &&
        bounty.soldAt < Date.now(),
    ).length;

    return bountied + soldInFirstFewDays;
  },
  "Sell sheep": (game) => {
    let bountied = game.farmActivity["Sheep Bountied"] ?? 0;

    const soldInFirstFewDays = game.bounties.completed.filter(
      (bounty) =>
        bounty.id === "Sheep" &&
        bounty.soldAt >= new Date("2024-12-16T00:00:00Z").getTime() &&
        bounty.soldAt < new Date("2024-12-23T00:00:00Z").getTime() &&
        bounty.soldAt < Date.now(),
    ).length;

    return bountied + soldInFirstFewDays;
  },
  "Sell chicken": (game) => {
    let bountied = game.farmActivity["Chicken Bountied"] ?? 0;

    const soldInFirstFewDays = game.bounties.completed.filter(
      (bounty) =>
        bounty.id === "Chicken" &&
        bounty.soldAt >= new Date("2024-12-16T00:00:00Z").getTime() &&
        bounty.soldAt < new Date("2024-12-23T00:00:00Z").getTime() &&
        bounty.soldAt < Date.now(),
    ).length;

    return bountied + soldInFirstFewDays;
  },
};

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
      "Complete chore": 1,
      "Complete delivery": 2,
      "Level up": 10,
      "Expand island": 15,
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
  ANIMAL_TESTING: {
    startAt: new Date("2024-12-17T00:00:00Z").getTime(),
    endAt: new Date("2025-02-01T00:00:00Z").getTime(),
    points: {
      "Sell cow": 10,
      "Sell sheep": 5,
      "Sell chicken": 3,
      "Complete delivery": 5,
      "Eat pizza": 5,
      "Cook honey cake": 5,
      "Craft bear": 2,
      "Craft basic hair": 1,
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
  "Cook honey cake": {
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
};

export function getCompetitionPoints({
  game,
  name,
}: {
  game: GameState;
  name: CompetitionName;
}): number {
  return getKeys(COMPETITION_POINTS[name].points).reduce((total, task) => {
    const completed = getTaskCompleted({ game, name, task });

    return total + completed * (COMPETITION_POINTS[name]?.points[task] ?? 0);
  }, 0);
}

export function getTaskCompleted({
  game,
  name,
  task,
}: {
  game: GameState;
  name: CompetitionName;
  task: CompetitionTaskName;
}): number {
  const { competitions } = game;
  const previous = competitions.progress[name]?.initialProgress[task] ?? 0;
  const count = COMPETITION_TASK_PROGRESS[task](game);
  const completed = count - previous;

  return completed;
}

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
        "Chicken Suit": 1,
      },
      items: {
        "Black Sheep": 1,
      },
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
      items: {
        "Black Sheep": 1,
      },
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
      items: {
        "Black Sheep": 1,
      },
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 36]: item,
      }),
      {},
    ),
  // 51 - 75
  ...new Array(25)
    .fill({
      wearables: {
        "Merino Jumper": 1,
        "Shepherd Staff": 1,
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
  // 76 - 100
  ...new Array(25)
    .fill({
      wearables: {
        "Chicken Suit": 1,
        "Shepherd Staff": 1,
      },
      items: {},
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 76]: item,
      }),
      {},
    ),
  // 101 - 200
  ...new Array(100)
    .fill({
      wearables: {
        "Shepherd Staff": 1,
      },
      items: {
        "Moo-ver": 1,
      },
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 101]: item,
      }),
      {},
    ),
  // 201 - 300
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
        [index + 201]: item,
      }),
      {},
    ),
};
