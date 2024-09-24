import Decimal from "decimal.js-light";
import {
  COMPETITION_POINTS,
  COMPETITION_TASK_PROGRESS,
  CompetitionName,
  CompetitionTaskName,
} from "features/game/types/competitions";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";

import { produce } from "immer";

export type StartCompetitionAction = {
  type: "competition.started";
  name: CompetitionName;
};

type Options = {
  state: Readonly<GameState>;
  action: StartCompetitionAction;
  createdAt?: number;
};

export function startCompetition({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    const competition = COMPETITION_POINTS[action.name];

    if (!competition) {
      throw new Error("Competition does not exist");
    }

    if (createdAt < competition.startAt) {
      throw new Error("Competition has not started");
    }

    if (createdAt > competition.endAt) {
      throw new Error("Competition has ended");
    }

    if (!!game.competitions?.progress[action.name]) {
      throw new Error("Player has already started competition");
    }

    const progress = getKeys(COMPETITION_POINTS[action.name].points).reduce(
      (acc, name) => {
        let progressFn = COMPETITION_TASK_PROGRESS[name];

        if (!progressFn) {
          throw new Error(`Task ${name} does not exist`);
        }

        let points = progressFn(game);

        return {
          ...acc,
          [name]: points,
        };
      },
      {} as Record<CompetitionTaskName, number>,
    );

    game.competitions.progress[action.name] = {
      startedAt: createdAt,
      initialProgress: progress,
    };

    return game;
  });
}
