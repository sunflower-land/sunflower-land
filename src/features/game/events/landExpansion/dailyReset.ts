import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type DailyResetAction = {
  type: "daily.reset";
};

type Options = {
  state: Readonly<GameState>;
  action: DailyResetAction;
};

export function dailyReset({ state }: Options) {
  return produce(state, (stateCopy) => {
    return stateCopy;
  });
}
