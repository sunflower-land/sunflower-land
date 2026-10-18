import type { GameState } from "features/game/types/game";
import type { ExperimentName } from "features/game/types/experiments";
import { produce } from "immer";

export type ExperimentToggledAction = {
  type: "experiment.toggled";
  experiment: ExperimentName;
  enabled: boolean;
};

type Options = {
  state: Readonly<GameState>;
  action: ExperimentToggledAction;
  createdAt?: number;
};

export function updateExperiment({ state, action }: Options): GameState {
  return produce(state, (draft) => {
    draft.settings.experiments = {
      ...draft.settings.experiments,
      [action.experiment]: action.enabled,
    };
  });
}
