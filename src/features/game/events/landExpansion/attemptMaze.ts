import Decimal from "decimal.js-light";
import { GameState, MazeAttempt, MazeMetadata } from "features/game/types/game";
import { SEASONS } from "features/game/types/seasons";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import cloneDeep from "lodash.clonedeep";

export type AttemptMazeAction = {
  type: "maze.attempted";
  crowsFound: number;
  health: number;
  timeRemaining: number;
};

type Options = {
  state: Readonly<GameState>;
  action: AttemptMazeAction;
  createdAt?: number;
};

export const MAZE_TIME_LIMIT_SECONDS = 3 * 60;
export const MAX_FEATHERS_PER_WEEK = 100;

export function calculateFeathersEarned(
  currentLostCrowCount: number,
  crowsFound: number,
  claimedFeathers: number
): number {
  const feathersEarned =
    Math.floor(MAX_FEATHERS_PER_WEEK / currentLostCrowCount) * crowsFound;

  // If first attempt
  if (claimedFeathers === 0) {
    return feathersEarned;
  }

  return feathersEarned - claimedFeathers;
}

export function mazeAttempted({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const copy = cloneDeep(state) as GameState;

  if (!copy.bumpkin) {
    throw new Error("Bumpkin not found");
  }

  const { startDate } = SEASONS["Witches' Eve"];
  const currentWeek = getSeasonWeek(createdAt);

  if (createdAt < startDate.getTime() && process.env.NETWORK === "mainnet") {
    throw new Error("Witches eve has not started");
  }

  if (!copy.witchesEve) {
    throw new Error("Witches eve not found on game state");
  }

  let weeklyData = copy.witchesEve.maze[currentWeek];

  if (!weeklyData) {
    weeklyData = {
      highestScore: 0,
      claimedFeathers: 0,
      losses: [],
      wins: [],
    } as MazeMetadata;
  }

  const { crowsFound, health, timeRemaining } = action;

  const attempt: MazeAttempt = {
    crowsFound,
    health,
    time: MAZE_TIME_LIMIT_SECONDS - timeRemaining,
  };

  const { losses, wins, highestScore, claimedFeathers, completedAt } =
    weeklyData;

  // Losing attempt
  if (health === 0 || timeRemaining === 0) {
    weeklyData.losses = [...losses, attempt];

    copy.witchesEve.maze[currentWeek] = weeklyData;

    return copy;
  }

  // Winning attempt
  weeklyData.wins = [...wins, attempt];

  // If the maze has already been completed, just add stats
  if (!!completedAt || crowsFound < highestScore) {
    copy.witchesEve.maze[currentWeek] = weeklyData;

    return copy;
  }

  const reward = calculateFeathersEarned(
    copy.witchesEve.weeklyLostCrowCount,
    crowsFound,
    claimedFeathers
  );

  const previousFeathers = copy.inventory["Crow Feather"] ?? new Decimal(0);
  copy.inventory["Crow Feather"] = previousFeathers.add(reward);

  weeklyData.highestScore = crowsFound;
  weeklyData.claimedFeathers = claimedFeathers + reward;

  if (weeklyData.claimedFeathers >= MAX_FEATHERS_PER_WEEK) {
    weeklyData.completedAt = createdAt;
  }

  copy.witchesEve.maze[currentWeek] = weeklyData;

  return copy;
}
