import { GameState } from "features/game/types/game";

export type RefreshKingdomChoresAction = {
  type: "kingdomChores.refreshed";
};

type Options = {
  state: Readonly<GameState>;
  action: RefreshKingdomChoresAction;
};

export function refreshKingdomChores({ state }: Options) {
  return state;
}
