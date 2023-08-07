import Decimal from "decimal.js-light";
import { GameState, MazeAttempt } from "features/game/types/game";
import { SEASONS } from "features/game/types/seasons";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import cloneDeep from "lodash.clonedeep";
import { MAX_FEATHERS_PER_WEEK } from "./saveMaze";

export type StartMazeAction = {
  type: "maze.started";
};

type Options = {
  state: Readonly<GameState>;
  action: StartMazeAction;
  createdAt?: number;
};

export const MAZE_TIME_LIMIT_SECONDS = 3 * 60;
export const MAZE_SFL_FEE = new Decimal(0);

export function startMaze({ state, action, createdAt = Date.now() }: Options) {
  const copy = cloneDeep(state) as GameState;

  if (!copy.bumpkin) {
    throw new Error("Bumpkin not found");
  }

  const { startDate } = SEASONS["Witches' Eve"];
  const currentWeek = getSeasonWeek(createdAt);

  if (createdAt < startDate.getTime()) {
    throw new Error("Witches eve has not started");
  }

  if (!copy.witchesEve) {
    throw new Error("Witches eve not found on game state");
  }

  let currentWeekMazeData = copy.witchesEve.maze[currentWeek];

  if (!currentWeekMazeData) {
    currentWeekMazeData = {
      highestScore: 0,
      claimedFeathers: 0,
      attempts: [],
    };
  }

  const { attempts, claimedFeathers } = currentWeekMazeData;
  const inProgressAttempt = attempts?.find((attempt) => !attempt.completedAt);

  if (inProgressAttempt) {
    copy.witchesEve.maze[currentWeek] = currentWeekMazeData;

    return copy;
  }

  const newAttempt: MazeAttempt = {
    startedAt: createdAt,
    crowsFound: 0,
    health: 3,
    time: 0,
  };

  attempts.push(newAttempt);

  copy.witchesEve.maze[currentWeek] = currentWeekMazeData;

  if (claimedFeathers === MAX_FEATHERS_PER_WEEK) {
    // Don't charge entry if players have already claimed the max feathers
    return copy;
  }

  const { balance } = copy;

  if (balance.lessThan(MAZE_SFL_FEE)) {
    throw new Error("Insufficient SFL balance");
  }

  copy.balance = balance.minus(MAZE_SFL_FEE);

  return copy;
}
