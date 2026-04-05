import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type EconomiesEnabledAction = {
  type: "economies.enabled";
  enabled: boolean;
};

type Options = {
  state: Readonly<GameState>;
  action: EconomiesEnabledAction;
  createdAt?: number;
};

export function updateEconomiesEnabled({ state, action }: Options): GameState {
  return produce(state, (draft) => {
    draft.settings.economiesEnabled = action.enabled;
  });
}
