import levelupIcon from "assets/icons/level_up.png";
import choreIcon from "assets/icons/chores.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameState, InventoryItemName, Wardrobe } from "./game";
import { getBumpkinLevel } from "../lib/level";
import { getKeys } from "./decorations";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { ITEM_DETAILS } from "./images";

export type CompetitionName = "TESTING" | "FSL" | "ANIMALS";

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
  | "Craft basic hair"
  | "Harvest barley";

export const COMPETITION_TASK_PROGRESS: Record<
  CompetitionTaskName,
  (game: GameState) => number
> = {
  "Complete chore": (game) => game.chores?.choresCompleted ?? 0,
  "Harvest barley": (game) => game.bumpkin.activity["Barley Harvested"] ?? 0,
  // For deliveries, count the number since yesterday
  "Complete delivery": (game) => {
    const delivered = game.delivery.fulfilledCount ?? 0;

    if (game.competitions.progress.ANIMALS) return delivered;

    const deliveredSinceYesterday = getKeys(game.npcs ?? {}).reduce(
      (total, npc) => {
        const npcData = game.npcs?.[npc];

        if (
          npcData?.deliveryCompletedAt &&
          npcData.deliveryCompletedAt >
            new Date("2024-12-17T00:00:00Z").getTime()
        ) {
          return total + 1;
        }

        return total;
      },
      0,
    );

    return delivered - deliveredSinceYesterday;
  },
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

  "Sell cow": (game) => {
    const bountied = game.farmActivity["Cow Bountied"] ?? 0;

    if (game.competitions.progress.ANIMALS) return bountied;

    const soldInFirstFewDays = game.bounties.completed.filter(
      (bounty) =>
        !!BOUNTIES["2024-12-16"].find(
          (b) => b.id === bounty.id && b.name === "Cow",
        ),
    ).length;

    return bountied - soldInFirstFewDays;
  },
  "Sell sheep": (game) => {
    const bountied = game.farmActivity["Sheep Bountied"] ?? 0;
    if (game.competitions.progress.ANIMALS) return bountied;

    const soldInFirstFewDays = game.bounties.completed.filter(
      (bounty) =>
        !!BOUNTIES["2024-12-16"].find(
          (b) => b.id === bounty.id && b.name === "Sheep",
        ),
    ).length;

    return bountied - soldInFirstFewDays;
  },
  "Sell chicken": (game) => {
    const bountied = game.farmActivity["Chicken Bountied"] ?? 0;

    if (game.competitions.progress.ANIMALS) return bountied;

    const soldInFirstFewDays = game.bounties.completed.filter(
      (bounty) =>
        !!BOUNTIES["2024-12-16"].find(
          (b) => b.id === bounty.id && b.name === "Chicken",
        ),
    ).length;

    return bountied - soldInFirstFewDays;
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
  "Harvest barley": {
    icon: ITEM_DETAILS["Barley"].image,
    description: "Harvest Barley at the Farm",
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

// Temporary put bounties in front-end for testing
export const BOUNTIES = {
  "2024-12-16": [
    {
      level: 6,
      id: "4ee67e",
      name: "Chicken",
      coins: 140,
    },
    {
      level: 15,
      id: "e9dee5",
      name: "Chicken",
      coins: 720,
    },
    {
      level: 3,
      id: "228f0a",
      name: "Chicken",
      coins: 100,
    },
    {
      level: 10,
      id: "ed6d87",
      name: "Chicken",
      coins: 310,
    },
    {
      level: 4,
      id: "719d07",
      name: "Chicken",
      coins: 110,
    },
    {
      level: 4,
      id: "895746",
      name: "Chicken",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 6,
      id: "debf92",
      name: "Chicken",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 5,
      id: "9a8a96",
      name: "Chicken",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 7,
      id: "1e98cd",
      name: "Chicken",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 12,
      id: "69a44e",
      name: "Sheep",
      coins: 2550,
    },
    {
      level: 7,
      id: "21be87",
      name: "Cow",
      coins: 1810,
    },
    {
      level: 8,
      id: "5f6a54",
      name: "Cow",
      coins: 2400,
    },
    {
      level: 3,
      id: "65ce7b",
      name: "Sheep",
      coins: 320,
    },
    {
      level: 7,
      id: "971763",
      name: "Sheep",
      items: {
        Horseshoe: 5,
      },
    },
    {
      level: 5,
      id: "5f6493",
      name: "Sheep",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 3,
      id: "d88905",
      name: "Cow",
      items: {
        Horseshoe: 2,
      },
    },
    {
      level: 3,
      id: "bac051",
      name: "Sheep",
      items: {
        Horseshoe: 2,
      },
    },
    {
      level: 5,
      id: "bba5bd",
      name: "Cow",
      items: {
        Horseshoe: 3,
      },
    },
    {
      id: "6d4249",
      name: "Purple Cosmos",
      items: {
        Horseshoe: 3,
      },
    },
    {
      id: "26cb11",
      name: "White Carnation",
      items: {
        Horseshoe: 7,
      },
    },
    {
      id: "acc666",
      name: "White Pansy",
      items: {
        Horseshoe: 3,
      },
    },
    // --- NEW BOUNTIES ---
    {
      level: 15,
      id: "47a94c",
      name: "Chicken",
      coins: 720,
    },
    {
      level: 4,
      id: "7662de",
      name: "Chicken",
      coins: 110,
    },
    {
      level: 8,
      id: "fbdb49",
      name: "Chicken",
      coins: 220,
    },
    {
      level: 12,
      id: "b79148",
      name: "Chicken",
      coins: 470,
    },
    {
      level: 14,
      id: "497d88",
      name: "Chicken",
      coins: 650,
    },
    {
      level: 15,
      id: "968b20",
      name: "Chicken",
      coins: 720,
    },
    {
      level: 2,
      id: "f43e6f",
      name: "Chicken",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 4,
      id: "6c8c41",
      name: "Chicken",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 5,
      id: "158dc6",
      name: "Chicken",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 7,
      id: "ed45eb",
      name: "Chicken",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 7,
      id: "894475",
      name: "Chicken",
      items: {
        Gem: 10,
      },
    },
    {
      level: 5,
      id: "a0fe79",
      name: "Chicken",
      items: {
        Gem: 5,
      },
    },
    {
      level: 4,
      id: "21016d",
      name: "Cow",
      items: {
        Horseshoe: 2,
      },
    },
    {
      level: 5,
      id: "1e8b2d",
      name: "Cow",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 7,
      id: "67df3d",
      name: "Cow",
      items: {
        Gem: 10,
      },
    },
    {
      level: 3,
      id: "9e3e27",
      name: "Cow",
      coins: 540,
    },
    {
      level: 5,
      id: "a62e45",
      name: "Cow",
      coins: 930,
    },
    {
      level: 7,
      id: "297142",
      name: "Cow",
      coins: 1810,
    },
    {
      level: 4,
      id: "6ab20c",
      name: "Sheep",
      items: {
        Horseshoe: 3,
      },
    },
    {
      level: 6,
      id: "64901c",
      name: "Sheep",
      items: {
        Gem: 10,
      },
    },
    {
      level: 3,
      id: "2fa3f0",
      name: "Sheep",
      coins: 320,
    },
    {
      level: 5,
      id: "4543b8",
      name: "Sheep",
      coins: 480,
    },
    {
      level: 8,
      id: "362d96",
      name: "Sheep",
      coins: 1070,
    },
  ],
};
