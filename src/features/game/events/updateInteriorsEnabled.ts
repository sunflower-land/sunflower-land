import type { GameState } from "features/game/types/game";
import { produce } from "immer";

export type InteriorsEnabledAction = {
  type: "interiors.enabled";
  enabled: boolean;
};

type Options = {
  state: Readonly<GameState>;
  action: InteriorsEnabledAction;
  createdAt?: number;
};

export function updateInteriorsEnabled({ state, action }: Options): GameState {
  return produce(state, (draft) => {
    draft.settings.interiorsEnabled = action.enabled;
  });
}
