import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type RefreshKingdomChoresAction = {
  type: "kingdomChores.refreshed";
};

type Options = {
  state: Readonly<GameState>;
  action: RefreshKingdomChoresAction;
};

export function refreshKingdomChores({ state }: Options) {
  return produce(state, (stateCopy) => {
    return stateCopy;
  });
}
