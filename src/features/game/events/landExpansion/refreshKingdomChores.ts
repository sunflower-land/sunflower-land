import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type RefreshKingdomChoresAction = {
  type: "kingdomChores.refreshed";
};

type Options = {
  state: Readonly<GameState>;
  action: RefreshKingdomChoresAction;
};

export function refreshKingdomChores({ state }: Options) {
  return cloneDeep<GameState>(state);
}
