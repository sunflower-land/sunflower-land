import levelupIcon from "assets/icons/level_up.png";
import choreIcon from "assets/icons/chores.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameState } from "./game";
import { getBumpkinLevel } from "../lib/level";
import { getKeys } from "./decorations";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type CompetitionName = "TESTING" | "FSL";

export type CompetitionProgress = {
  startedAt: number;
  initialProgress: Record<CompetitionTaskName, number>;
};

export type CompetitionTaskName =
  | "Level up"
  | "Expand island"
  | "Complete delivery"
  | "Complete chore";

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
};

export const COMPETITION_POINTS: Record<
  CompetitionName,
  {
    startAt: number;
    endAt: number;
    points: Record<CompetitionTaskName, number>;
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

    return total + completed * COMPETITION_POINTS[name].points[task];
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
