import { GameState } from "features/game/types/game";
import { SEASONS } from "features/game/types/seasons";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import cloneDeep from "lodash.clonedeep";
import { MAZE_TIME_LIMIT_SECONDS } from "./startMaze";
import Decimal from "decimal.js-light";

export type SaveMazeAction = {
  type: "maze.saved";
  crowsFound: number;
  health: number;
  timeRemaining: number;
  completedAt?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SaveMazeAction;
  createdAt?: number;
};

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

export function saveMaze({ state, action, createdAt = Date.now() }: Options) {
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

  // Maze meta data for the current week
  const maze = copy.witchesEve.maze[currentWeek];

  if (!maze) {
    throw new Error("Maze data not found for current week");
  }

  const { attempts } = maze;

  // Find index of active attempt ie: startedAt is set but completedAt is not
  const attemptIdx = attempts.findIndex((attempt) => !attempt.completedAt);

  if (attemptIdx < 0) {
    throw new Error("No in progress maze attempt found");
  }

  // Update attempt values
  attempts[attemptIdx].crowsFound = action.crowsFound;
  attempts[attemptIdx].health = action.health;
  attempts[attemptIdx].time = MAZE_TIME_LIMIT_SECONDS - action.timeRemaining;

  // End attempt
  if (action.completedAt) {
    attempts[attemptIdx].completedAt = action.completedAt;
  }

  // Don't give any feather if the player died or ran out of time
  if (action.health <= 0 || action.timeRemaining <= 0) {
    return copy;
  }

  // Return if the player didn't beat their highest score
  if (action.crowsFound < maze.highestScore) {
    return copy;
  }

  const reward = calculateFeathersEarned(
    copy.witchesEve.weeklyLostCrowCount,
    action.crowsFound,
    maze.claimedFeathers
  );

  const previousFeathers = copy.inventory["Crow Feather"] ?? new Decimal(0);
  copy.inventory["Crow Feather"] = previousFeathers.add(reward);

  // Update highest score
  maze.highestScore = action.crowsFound;

  // Increase the claimed feathers by the reward
  maze.claimedFeathers += reward;

  return copy;
}
