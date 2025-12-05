import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type BumpkinWaveAction = {
  type: "social.wave";
};

type Options = {
  state: Readonly<GameState>;
  action: BumpkinWaveAction;
  createdAt?: number;
};

export function bumpkinWave({ state }: Options): GameState {
  return produce(state, (draft) => {
    draft.socialFarming.points += 1;
    draft.socialFarming.weeklyPoints.points += 1;
  });
}
