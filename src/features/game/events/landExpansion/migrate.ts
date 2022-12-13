import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";

export type LandExpansionMigrateAction = {
  type: "game.migrated";
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionMigrateAction;
  createdAt?: number;
};

export const canMigrate = (state: GameState) => {
  // WOOHOOO
  return true;
};

export function migrate({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;

  stateCopy.migrated = true;

  return stateCopy;
}
