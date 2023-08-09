import { GameState, MazeAttempt } from "features/game/types/game";
import { SEASONS } from "features/game/types/seasons";
import { CORN_MAZES } from "features/world/ui/cornMaze/lib/mazes";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import cloneDeep from "lodash.clonedeep";

export type StartMazeAction = {
  type: "maze.started";
};

type Options = {
  state: Readonly<GameState>;
  action: StartMazeAction;
  createdAt?: number;
};

export const MAZE_TIME_LIMIT_SECONDS = 3 * 60;

export function startMaze({ state, action, createdAt = Date.now() }: Options) {
  const copy = cloneDeep(state) as GameState;

  if (!copy.bumpkin) {
    throw new Error("Bumpkin not found");
  }

  const { startDate } = SEASONS["Witches' Eve"];
  const currentWeek = getSeasonWeek();

  if (createdAt < startDate.getTime()) {
    throw new Error("Witches eve has not started");
  }

  if (!copy.witchesEve) {
    throw new Error("Witches eve not found on game state");
  }

  const { sflFee } = CORN_MAZES[currentWeek];

  let currentWeekMazeData = copy.witchesEve.maze[currentWeek];

  if (!currentWeekMazeData) {
    currentWeekMazeData = {
      sflFee,
      paidEntryFee: false,
      highestScore: 0,
      claimedFeathers: 0,
      attempts: [],
    };
  }

  const { attempts, paidEntryFee } = currentWeekMazeData;
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

  console.log("attempts", attempts);

  if (!paidEntryFee) {
    const { balance } = copy;

    if (balance.lessThan(sflFee)) {
      throw new Error("Insufficient SFL balance");
    }

    copy.balance = balance.minus(sflFee);
    currentWeekMazeData.paidEntryFee = true;
  }

  copy.witchesEve.maze[currentWeek] = currentWeekMazeData;

  return copy;
}
